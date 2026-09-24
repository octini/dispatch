// Permission gate: the pi.on("tool_call") wrapper per the F2-PE-13 mapping.
// Capability + operation + arguments + resolved targets via OUR OWN resolver —
// the host supplies only raw args + cwd. Policy: global deny floor + four
// per-seat policies + the F2-Q6 explicit-instruction exception (validated
// config mechanism only). Ambiguity or missing policy = deny + log + PARK
// (F3-SD-04a), never silent. Fail-closed on thrown errors. Names alone never
// authorize (the #7406 registration race): every decision keys per tool with
// bounded input previews.
//
// Absence-path rebuttal (cobain + novoselic): The gate-attach throw covers the attached-but-failed path (FIND-3). The only remaining absence class is the plugin failing to LOAD at all — a HOST-level extension-load event outside Dispatch's enforcement (the host surfaces its load error); Dispatch's policy scope is the sessions where Dispatch loads, and there the gate ALWAYS attaches (the throw). A non-Dispatch plain Pi session is the user's own surface.

import type { PolicyConfig, PolicyOutcome, SeatId, ValidatedConfigChange } from "./config.js";
import * as dispatcherSeat from "./seats/dispatcher.js";
import * as writerSeat from "./seats/writer.js";
import * as seekerSeat from "./seats/seeker.js";
import * as expertSeat from "./seats/expert.js";

export const RECURRING_THRESHOLD = 3;
export const PREVIEW_BOUND = 120;

export interface GateToolCall {
  seat: SeatId;
  /** Tool capability name. Never sufficient alone (F2-PE-13). */
  tool: string;
  operation: string;
  /** Raw args from the host. Only raw input — targets resolve here. */
  args: Record<string, unknown>;
  cwd: string;
  taskId: string;
  /** Host-validated envelope authority: approved scope paths. */
  scopePaths: string[];
  /** F2-Q6 path only: permission edits ride this validated mechanism. */
  configChange?: ValidatedConfigChange;
}

export interface GateDecision {
  outcome: PolicyOutcome;
  reason: string;
  parked: boolean;
  targets: string[];
}

export interface AuditEntry {
  seq: number;
  taskId: string;
  seat: SeatId;
  tool: string;
  operation: string;
  outcome: PolicyOutcome;
  reason: string;
  targetsPreview: string;
  /** Bounded preview of raw inputs: fixed key allowlist + value-pattern best-effort (P-RED-17, never leak-proof). */
  argsPreview: string;
  attemptCount: number;
}

const REDACT_KEYS = new Set([
  "apikey",
  "key",
  "token",
  "secret",
  "password",
  "passwd",
  "auth",
  "authorization",
  "credential",
  "credentials",
  "accesskey",
  "secretkey",
]);

/** Fixed-allowlist key check: exact normalized name only (no substring match). */
function isRedactKey(key: string): boolean {
  return REDACT_KEYS.has(key.toLowerCase().replace(/[^a-z0-9]/g, ""));
}
const VALUE_SECRET = /(?:sk-[A-Za-z0-9]{8,}|ghp_[A-Za-z0-9]{8,}|gho_[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{16}|xox[bpas]-[A-Za-z0-9-]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,})/;
const HIGH_ENTROPY_TOKEN = /^[A-Za-z0-9_\-+=/]{32,}$/;
const EVASION = /[|>&;`$]|(\$\()|(GIT_|PAGER|EDITOR)/;

function looksHighEntropy(text: string): boolean {
  if (!HIGH_ENTROPY_TOKEN.test(text)) return false;
  return /[a-z]/.test(text) && /[A-Z]/.test(text) && /[0-9]/.test(text);
}

function redact(value: unknown): string {
  const text = String(value);
  return text.length > PREVIEW_BOUND ? `${text.slice(0, PREVIEW_BOUND)}…` : text;
}

/** Defensive preview of raw args: never throws; fixed key allowlist + value-pattern best-effort (not a leak-proof guarantee). */
function safeArgsPreview(args: Record<string, unknown> | undefined): string {
  try {
    return Object.entries(args ?? {}).map(([k, v]) => `${k}=${previewArg(k, v)}`).join(" ");
  } catch {
    return "[unreadable inputs]";
  }
}

/** Bounded preview of one argument value: fixed key allowlist + value-pattern best-effort (never a leak-proof guarantee). */
export function previewArg(key: string, value: unknown): string {
  if (isRedactKey(key)) return "[redacted]";
  if (typeof value === "string" && (VALUE_SECRET.test(value) || looksHighEntropy(value))) return "[redacted]";
  return redact(value);
}

/**
 * OUR OWN target resolver. The host supplies raw args + cwd; resolved
 * targets are computed here: path-like arg values resolve against cwd and
 * normalize. Relative paths that normalize outside cwd are traversal escapes
 * (see hasTraversalEscape, denied in evaluate) — this function returns the
 * normalized targets only.
 *
 * Known boundary: this resolver does NOT chase symlinks, and check-time
 * resolution races use-time reality (TOCTOU) — the host must revalidate at
 * use; a resolved target is an advisory classification input, not a guarantee.
 */
export function resolveTargets(args: Record<string, unknown>, cwd: string): string[] {
  const targets: string[] = [];
  const collect = (value: unknown): void => {
    if (typeof value === "string" && (value.includes("/") || value.startsWith("."))) {
      const clean = value.split(/[?#]/)[0] ?? value;
      if (clean.length > 0 && clean.length <= 512) {
        const base = cwd.endsWith("/") ? cwd.slice(0, -1) : cwd;
        const joined = clean.startsWith("/") ? clean : `${base}/${clean}`;
        const parts: string[] = [];
        for (const seg of joined.split("/")) {
          if (seg === "" || seg === ".") continue;
          if (seg === "..") parts.pop();
          else parts.push(seg);
        }
        targets.push(`/${parts.join("/")}`);
      }
    } else if (Array.isArray(value)) {
      for (const item of value) collect(item);
    } else if (typeof value === "object" && value !== null) {
      for (const item of Object.values(value as Record<string, unknown>)) collect(item);
    }
  };
  collect(args);
  return [...new Set(targets)];
}

const DEFAULT_PROTECTED = ["/.git", "/.env", "/credentials", "/node_modules"];

function targetSegments(p: string): string[] {
  return p.split("/").filter((s) => s.length > 0);
}

/** Path-segment match: exact segments, or a trailing dot-extension on the
 * final needle segment (so /a/credentials.txt matches /credentials but
 * /.github/workflows/x never matches /.git). */
function needleMatches(target: string, needle: string): boolean {
  if (target === needle || target.startsWith(`${needle}/`)) return true;
  const nSegs = targetSegments(needle);
  if (nSegs.length === 0) return false;
  const tSegs = targetSegments(target);
  if (tSegs.length < nSegs.length) return false;
  for (let i = 0; i <= tSegs.length - nSegs.length; i++) {
    let ok = true;
    for (let j = 0; j < nSegs.length; j++) {
      const t = tSegs[i + j] as string;
      const n = nSegs[j] as string;
      const isLast = j === nSegs.length - 1;
      if (t === n) continue;
      if (isLast && t.startsWith(`${n}.`)) continue;
      ok = false;
      break;
    }
    if (ok) return true;
  }
  return false;
}

function isProtected(target: string, extra: string[]): boolean {
  const needles = [...DEFAULT_PROTECTED, ...extra.map((p) => (p.startsWith("/") ? p : `/${p}`))];
  return needles.some((n) => needleMatches(target, n));
}

/** Traversal-escape flag: a RELATIVE path-like value that normalizes outside
 * cwd. Absolute paths are scope-checked, not flagged here. */
export function hasTraversalEscape(args: Record<string, unknown>, cwd: string): boolean {
  const base = cwd.endsWith("/") ? cwd.slice(0, -1) : cwd;
  const depth = targetSegments(base).length;
  let escaped = false;
  const check = (value: unknown): void => {
    if (escaped) return;
    if (typeof value === "string" && (value.includes("/") || value.startsWith("."))) {
      const clean = (value.split(/[?#]/)[0] ?? value);
      if (clean.length === 0 || clean.length > 512 || clean.startsWith("/")) return;
      const parts: string[] = [...targetSegments(base)];
      for (const seg of clean.split("/")) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") {
          // A relative ".." that would pop at or above the cwd root escapes
          // (cwd "/" has no outside). Pops within cwd are fine.
          if (parts.length <= depth) {
            if (depth > 0) escaped = true;
            return;
          }
          parts.pop();
        } else {
          parts.push(seg);
        }
      }
    } else if (Array.isArray(value)) {
      for (const item of value) check(item);
    } else if (typeof value === "object" && value !== null) {
      for (const item of Object.values(value as Record<string, unknown>)) check(item);
    }
  };
  check(args);
  return escaped;
}

/** Single-source seat toolsets: the gate reads the seat configs, never a second list (F15 one-home for policy encoding). */
const SEAT_TOOLSETS: Record<SeatId, { tools: Array<{ name: string }> }> = {
  dispatcher: dispatcherSeat,
  writer: writerSeat,
  seeker: seekerSeat,
  expert: expertSeat,
};

/** Per-tool authored mapping (F2-PE-13); PS-GATE-04 verification pending. Unknown tools park pending mapping. */
type ToolClass =
  | "retrieval"
  | "read"
  | "beads-read"
  | "beads-mutation"
  | "edit"
  | "shell-bounded"
  | "dispatch"
  | "config";

const TOOL_CLASSES: Record<string, ToolClass> = {
  web_search: "retrieval",
  web_fetch: "retrieval",
  web_crawl: "retrieval",
  read: "read",
  grep: "read",
  beads_show: "beads-read",
  beads_list: "beads-read",
  beads_create: "beads-mutation",
  beads_update: "beads-mutation",
  beads_close: "beads-mutation",
  edit: "edit",
  write: "edit",
  shell_git_show: "shell-bounded",
  shell_rg: "shell-bounded",
  dispatch: "dispatch",
  config_update: "config",
};

/** Allowlisted bounded shell forms (F2 section 2.5): git show reads, rg queries. */
const SHELL_ALLOWLIST: Record<string, RegExp> = {
  shell_git_show: /^git show [A-Za-z0-9._\-/:]+$/,
  shell_rg: /^rg [A-Za-z0-9._\-/: ]+$/,
};

function inScope(targets: string[], scopePaths: string[]): boolean {
  if (targets.length === 0) return true;
  return targets.every((t) => scopePaths.some((s) => t === s || t.startsWith(`${s}/`)));
}

export class PermissionGate {
  private seq = 0;
  /** Recurring-pattern counter: per-key per-task; the task boundary resets it (new taskId = new window); interleaved allows never reset the denied-attempt window. */
  private attempts = new Map<string, number>();
  readonly audit: AuditEntry[] = [];

  constructor(private readonly policy: PolicyConfig) {}

  /** before_agent_start narrowing: restrict-only. Returns a subset — never adds. */
  narrowTools(seat: SeatId, current: string[]): string[] {
    const allowed = new Set(this.seatTools(seat));
    return current.filter((t) => allowed.has(t));
  }

  /** Single source of truth: the gate DERIVES its per-seat toolset from the seat config (F15 one-home) — no second list lives here. The gate holds NO fallback toolset list; the seat config is the sole source (a missing seat config fails closed under the deny floor). */
  seatTools(seat: SeatId): string[] {
    return SEAT_TOOLSETS[seat].tools.map((t) => t.name);
  }

  /** Structured audit note for a completed tool result (redacted, bounded). */
  logResult(taskId: string, seat: SeatId, tool: string, outcome: PolicyOutcome, detail: string): void {
    this.seq += 1;
    this.audit.push({
      seq: this.seq,
      taskId,
      seat,
      tool,
      operation: "result",
      outcome,
      reason: redact(detail),
      targetsPreview: "",
      argsPreview: "",
      attemptCount: 1,
    });
  }

  decide(call: GateToolCall): GateDecision {
    try {
      return this.evaluate(call);
    } catch (err) {
      // Fail-closed on thrown errors.
      return this.record(call, [], "fail-closed", `gate error: ${err instanceof Error ? err.message : "unknown"}`, true);
    }
  }

  private evaluate(call: GateToolCall): GateDecision {
    const targets = resolveTargets(call.args, call.cwd);

    // Traversal-escape flag: a relative path normalizing outside cwd denies.
    if (hasTraversalEscape(call.args, call.cwd)) {
      return this.record(call, targets, "deny-and-log", "traversal escape denied: path normalizes outside the approved root");
    }

    // F2-PE-13: unknown tool or schema parks the capability pending mapping.
    const toolClass = TOOL_CLASSES[call.tool];
    if (toolClass === undefined) {
      return this.record(call, targets, "deny-log-and-park", `unknown tool ${call.tool}: no verified mapping; capability parked pending adapter verification`);
    }

    // Global deny floor: raw .git metadata edits never stand in for validated ops.
    const rawGitEdit =
      (toolClass === "edit" || toolClass === "read") && targets.some((t) => t.includes("/.git/") || t.endsWith("/.git"));
    if (rawGitEdit) {
      return this.record(call, targets, "deny-and-log", "raw .git access denied: use a validated Git operation");
    }

    // Global deny floor: protected paths on every tool (F2-PE-12).
    const protectedHit = targets.find((t) => isProtected(t, this.policy.protectedPaths));
    if (protectedHit !== undefined && toolClass !== "config") {
      const excused =
        (call.configChange !== undefined && this.validConfigChange(call.configChange, targets)) ||
        this.scopedExceptionCovers(targets);
      if (!excused) {
        return this.record(call, targets, "deny-and-log", `protected path ${protectedHit}: explicit scoped user exception required`);
      }
    }

    // Shell-evasion battery (P-SHELL-15): compound, redirection, interpreter,
    // env overrides, option injection deny as unclassifiable/evasive.
    if (toolClass === "shell-bounded") {
      const command = String(call.args["command"] ?? "");
      const form = SHELL_ALLOWLIST[call.tool];
      if (form === undefined || !form.test(command) || EVASION.test(command)) {
        return this.record(call, targets, "deny-and-log", `unclassifiable shell denied for ${call.tool}; use a typed read alternative`);
      }
    }

    // F2-Q6 explicit-instruction exception: config edits flow ONLY through the
    // validated mechanism — Dispatcher interprets, Writer applies, user-direct.
    if (toolClass === "config") {
      // F2-PE-06/08: Dispatcher interprets, WRITER applies. No other seat applies.
      if (call.seat !== "writer") {
        return this.record(call, targets, "deny-and-log", `config change refused: ${call.seat} holds no apply authority; writer applies via the validated mechanism only`);
      }
      if (call.configChange !== undefined && this.validConfigChange(call.configChange, targets)) {
        return this.record(call, targets, "allow", "config change via validated F2-Q6 mechanism");
      }
      return this.record(call, targets, "deny-and-log", "config change refused: host-validated explicit USER instruction required");
    }

    // Per-seat policies (F2-PE-07/08).
    const seatVerdict = this.seatPolicy(call, toolClass, targets);
    if (seatVerdict !== null) return seatVerdict;

    // Scope check for mutating classes.
    if ((toolClass === "edit" || toolClass === "beads-mutation") && !inScope(targets, call.scopePaths)) {
      return this.record(call, targets, "deny-and-log", "outside approved scope");
    }

    // Ambiguity or missing policy: deny + log + PARK, never silent (F2-PE-02).
    if (call.scopePaths.length === 0 && (toolClass === "edit" || toolClass === "beads-mutation")) {
      return this.record(call, targets, "deny-log-and-park", "missing scope authority: deny, log, park");
    }

    return this.record(call, targets, "allow", `${call.seat} ${call.tool}/${call.operation} within verified mapping`);
  }

  /** Returns a decision when the seat policy settles the call, else null. */
  private seatPolicy(call: GateToolCall, toolClass: ToolClass, targets: string[]): GateDecision | null {
    switch (call.seat) {
      case "dispatcher":
        // Exclusive Beads mutation via typed validated host tools; never direct edits.
        if (toolClass === "edit") {
          return this.record(call, targets, "deny-and-log", "dispatcher holds no artifact-edit authority");
        }
        return null;
      case "writer":
        // Sole editing role; scoped reads; no Beads mutation. Ask only in scope.
        if (toolClass === "beads-mutation") {
          return this.record(call, targets, "deny-and-log", "writer holds Beads reads only; mutation is dispatcher-exclusive");
        }
        if (toolClass === "shell-bounded" || toolClass === "dispatch") {
          return this.record(call, targets, "deny-and-log", `writer holds no ${toolClass} authority`);
        }
        return null;
      case "seeker":
      case "expert":
        // Read-only: no edits, no Beads mutation, no dispatch.
        if (toolClass === "edit" || toolClass === "beads-mutation" || toolClass === "dispatch") {
          return this.record(call, targets, "deny-and-log", `${call.seat} is read-only: no ${toolClass}`);
        }
        return null;
    }
  }

  private validConfigChange(change: ValidatedConfigChange, _targets: string[]): boolean {
    if (change.userDirect !== true || change.interpretedBy !== "dispatcher" || change.appliedBy !== "writer") return false;
    // Scoped-exception store integrity check: format/validation before use —
    // a malformed stored exception is inert, never authorizing.
    if (typeof change.provenance !== "string" || change.provenance.trim().length === 0) return false;
    if (typeof change.scope !== "string" || change.scope.trim().length === 0 || !change.scope.startsWith("/")) return false;
    if (typeof change.duration !== "string" || change.duration.trim().length === 0) return false;
    if (typeof change.change !== "string" || change.change.trim().length === 0) return false;
    return true;
  }

  /** A persisted user-authorized scoped exception covers targets inside its
   * named scope only (F2-PE-03/P-OVER-04); outside its scope it is inert. */
  private scopedExceptionCovers(targets: string[]): boolean {
    return this.policy.scopedExceptions.some(
      (e) => this.validConfigChange(e, targets) && targets.every((t) => t === e.scope || t.startsWith(`${e.scope}/`)),
    );
  }

  private record(
    call: GateToolCall,
    targets: string[],
    outcome: PolicyOutcome,
    reason: string,
    forcePark = false,
  ): GateDecision {
    // Recurring-pattern escalation (F2-PE-04): threshold 3 same-DENIED attempts
    // per task parks. Only non-allow outcomes count — allows never increment.
    const key = `${call.seat}/${call.tool}/${call.operation}/${targets[0] ?? "-"}:${this.policy.revision}`;
    const prior = this.attempts.get(`${call.taskId}:${key}`) ?? 0;
    const attempts = outcome === "allow" ? prior : prior + 1;
    if (outcome !== "allow") this.attempts.set(`${call.taskId}:${key}`, attempts);

    let finalOutcome = outcome;
    let finalReason = reason;
    if (attempts >= RECURRING_THRESHOLD && outcome !== "allow") {
      finalOutcome = "deny-log-and-park";
      finalReason = `${reason} | recurring pattern (${attempts}x): branch parked, no auto-widening`;
    }

    const parked = forcePark || finalOutcome === "deny-log-and-park" || finalOutcome === "fail-closed";
    this.seq += 1;
    this.audit.push({
      seq: this.seq,
      taskId: call.taskId,
      seat: call.seat,
      tool: call.tool,
      operation: call.operation,
      outcome: finalOutcome,
      reason: [...new Set(finalReason.split("|"))].map((s) => redact(s.trim())).join(" | "),
      targetsPreview: redact(targets.join(", ")),
      argsPreview: safeArgsPreview(call.args),
      attemptCount: attempts,
    });
    return { outcome: finalOutcome, reason: finalReason, parked, targets };
  }
}
