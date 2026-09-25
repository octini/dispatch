// Thin donsetch adapter (F10-WR-02/12; PS-SEAM-03/07).
// Per-call sequence: permission check (F2-PE-13 gate: capability + operation +
// arguments + resolved targets) -> subprocess call -> evidence stamp
// (F10-WR-09) -> fallback routing with verbatim failure records (F10-WR-08).
// AGPL boundary (F6-Q5): CLI/MCP subprocess ONLY. This module never imports
// donsetch internals; contact flows through SubprocessRunner (default:
// spawnSync "donsetch"). The native Pi extension stays a NAMED FALLBACK,
// probe-gated (UNVERIFIED).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { PermissionGate } from "../permission-gate.js";
import type { SeatId } from "../config.js";
import * as dispatcherSeat from "../seats/dispatcher.js";
import * as writerSeat from "../seats/writer.js";
import * as seekerSeat from "../seats/seeker.js";
import * as expertSeat from "../seats/expert.js";
import {
  KEYED_SLOTS,
  KEYED_UPGRADE_DISCLOSURE,
  KEYLESS_TRIO,
  RESERVES,
  discloseGap,
  hostClockScope,
  isKeyedGrantLive,
  isKeyedSlotActive,
  revokeKeyedGrant,
  trailDocumentsExhaustion,
  type KeyedSlot,
  type KeyedSlotGrant,
} from "../retrieval/stack.js";

/** Integration form: subprocess only, never linked (F10-WR-02). */
export const ADAPTER_FORM = "cli-subprocess" as const;
/** Library-linked donsetch surface: empty by construction (AGPL boundary). */
export const LINKED_DONSETCH_IMPORTS: string[] = [];
/** List-only snippet bound pins at build (F10-Q10); placeholder disclosed per stamp. */
export const SNIPPET_BOUND_STATUS = "UNVERIFIED" as const;
/** Build-pin record (PS-INV-08): this value must not survive past the build
 * pin — release-gated, probe-valued at build. UNVERIFIED until the probe lands. */
export const DEFAULT_SNIPPET_BOUND_UNVERIFIED = 280;
/** Backoff values pin at build; the trail records observance, never a value. */
export const BACKOFF_STATUS = "UNVERIFIED (probe-pinned at build)" as const;

export type RetrievalSurface = "full" | "context7-approved" | "list-only";
export type RetrievalOperation = "search" | "fetch" | "crawl" | "docs";

const SEAT_MODULES: Record<SeatId, { retrievalSurface: RetrievalSurface }> = {
  dispatcher: dispatcherSeat,
  writer: writerSeat,
  seeker: seekerSeat,
  expert: expertSeat,
};

/** Single-source seat matrix: surfaces derive from the seat configs. */
export function surfaceFor(seat: SeatId): RetrievalSurface {
  return SEAT_MODULES[seat].retrievalSurface;
}

/** F10-Q7 approval registry. Task-scoped entries live in the task record and
 * expire with the task; standing entries are user-owned (user-only edits). */
export interface ApprovalRegistry {
  /** F10-Q7(a): named in the approved plan or delegation envelope. */
  namedInPlan: string[];
  /** F10-Q7(b): the user's standing allowlist. */
  standingAllowlist: string[];
  taskId: string;
  taskOpen: boolean;
}

/** Writer lookup rule (F10-WR-03): Context7 docs are direct; every other
 * retrieval must be approval-live (named or allowlisted, task open). */
export function writerLookupAllowed(target: string, approvals: ApprovalRegistry | undefined): boolean {
  if (approvals === undefined || approvals.taskOpen !== true) return false;
  return approvals.namedInPlan.includes(target) || approvals.standingAllowlist.includes(target);
}

/** F10-Q7 revocation split: standing entries are user-only; task-scoped
 * entries may be dropped by the dispatcher (own task scope) or the user. */
export function revokeApproval(
  registry: ApprovalRegistry,
  target: string,
  actor: "user" | "dispatcher",
): { registry: ApprovalRegistry } | { refused: string } {
  if (registry.standingAllowlist.includes(target)) {
    if (actor !== "user") return { refused: "standing allowlist revocation is user-only (F10-Q7)" };
    return { registry: { ...registry, standingAllowlist: registry.standingAllowlist.filter((t) => t !== target) } };
  }
  if (registry.namedInPlan.includes(target)) {
    return { registry: { ...registry, namedInPlan: registry.namedInPlan.filter((t) => t !== target) } };
  }
  return { refused: `no such approval for ${target}` };
}

export interface SubprocessCall {
  command: "donsetch";
  tier: string;
  operation: RetrievalOperation;
  target: string;
}

export interface SubprocessResult {
  status: number;
  stdout: string;
  stderr: string;
}

export type SubprocessRunner = (call: SubprocessCall) => SubprocessResult;

/** Default runner: spawns the donsetch CLI in a separate process. The command
 * is pinned to "donsetch"; anything else throws (structural boundary). */
export function defaultRunner(call: SubprocessCall): SubprocessResult {
  if (call.command !== "donsetch") throw new Error(`adapter refused: command ${call.command} is outside the subprocess boundary`);
  const run = spawnSync("donsetch", [call.tier, call.operation, call.target], { encoding: "utf8" });
  return { status: run.status ?? 1, stdout: run.stdout ?? "", stderr: run.stderr ?? "" };
}

/** Evidence stamp (F10-WR-09): URL + retrieval time + source + session
 * provenance, with a content hash/length binding. */
export interface EvidenceStamp {
  url: string;
  retrievedAt: string;
  source: string;
  sessionProvenance: string;
  contentHash: string;
  contentLength: number;
  snippetBound?: number;
}

export interface FailureRecord {
  tier: string;
  status: string;
  /** Raw outcome, stored unmodified (F10-WR-08). */
  verbatim: string;
  at: string;
  backoff: string;
  /** Per-call/per-task scoping (F2): the call's seat:taskId binding. */
  seat: SeatId;
  taskId: string;
}

export interface AdapterRequest {
  seat: SeatId;
  capability: string;
  operation: RetrievalOperation;
  args: Record<string, unknown>;
  cwd: string;
  taskId: string;
  scopePaths: string[];
  target: string;
  approvals?: ApprovalRegistry;
  httpMethod?: string;
  paidTier?: boolean;
  byokPresent?: boolean;
  unlockerRequested?: boolean;
  /** Plan-time criticality (F10-Q8); null = uncovered demand, fails closed. */
  acceptanceCritical?: boolean | null;
  /** Disclosure reference for reserve activation (F10-WR-08): never the
   * activation trigger (activation is in-call, on the rate-class failure
   * trail). A present-but-unverifiable claim is refused. */
  reserveClaim?: string;
  /** Per-slot BYOK key presence (F2-Q5 grant semantics: the session default;
   * logged persistence). Active slots join the chain after the keyless trio. */
  keyedSlotKeys?: Partial<Record<KeyedSlot, boolean>>;
  /** Per-slot keyed grants (F1 GRANT-CHECK + F2-Q5): a present key opens its
   * slot only when its grant is also live (granted, unrevoked, unexpired). */
  keyedSlotGrants?: Partial<Record<KeyedSlot, KeyedSlotGrant>>;
}

export interface AdapterDeps {
  gate: PermissionGate;
  chain?: readonly string[];
  snippetBound?: number;
  /** Host clock (N1): the sole source of retrieval-time stamps (`at`,
   * `retrievedAt`, scope `now`). Seats and subprocesses never supply time. */
  now?: () => string;
  /** Trail-freshness window for the scoped exhaustion check (F2). The VALUE
   * is the section-7 pin (UNVERIFIED); callers pass it explicitly. */
  trailFreshnessWindowMs?: number;
  /** Grant re-verify hook (N4 TOCTOU): re-checked at the keyed-slot open.
   * Defaults to re-reading the request grants with fresh host-clock time. */
  reverifyKeyedGrant?: (slot: KeyedSlot) => boolean;
}

/** Test-only deps: the runner injection seam exists ONLY behind this explicit
 * test-only export (F5). Production never accepts a runner. */
export interface TestOnlyAdapterDeps extends AdapterDeps {
  runner: SubprocessRunner;
}

/** Frozen production runner (F5): the subprocess boundary, non-overridable.
 * Object-frozen to mark the production path fixed. */
const frozenProductionRunner: SubprocessRunner = defaultRunner;
Object.freeze(frozenProductionRunner);

/** Runner injection scope record (F5): production frozen; tests only. */
export const RUNNER_INJECTION_SCOPE =
  "production: frozen internal runner (non-overridable); injection test-only via runRetrievalTestOnly" as const;

/** Test-seam production rule (N3): the test-only export never serves
 * production — runRetrievalTestOnly throws when NODE_ENV=production. */
export const TEST_SEAM_PRODUCTION_RULE =
  "test-only seam: runRetrievalTestOnly throws when NODE_ENV=production; the production path never reaches the swap seam (F5)" as const;

/** Grant open re-verify (N4 TOCTOU): the grant state is re-checked at the
 * keyed-slot open under the same call scope — a grant revoked between the
 * GRANT-CHECK and the open refuses the open. */
export const KEYED_GRANT_OPEN_REVERIFY =
  "F2-Q5 TOCTOU: grant re-checked at the keyed-slot open under the same call scope; revoked-between-check-and-open refuses" as const;

/** F10-Q7 revocation home (adapter): clears a keyed grant on revocation. */
export const KEYED_GRANT_REVOCATION_HOME =
  "F10-Q7: revocation clears the keyed grant via revokeKeyedGrant; the next keyed activation re-checks" as const;

/** Named revocation path (F10-Q7): clears one keyed slot grant. */
export function revokeKeyedSlotGrant(
  grants: Partial<Record<KeyedSlot, KeyedSlotGrant>> | undefined,
  slot: KeyedSlot,
): Partial<Record<KeyedSlot, KeyedSlotGrant>> {
  return revokeKeyedGrant(grants, slot);
}

export type AdapterOutcome = "served" | "list-only" | "refused" | "exhausted";

export interface AdapterResult {
  outcome: AdapterOutcome;
  reason: string;
  stamp?: EvidenceStamp;
  body?: string;
  failureTrail: FailureRecord[];
  disclosure?: string;
}

function isBashCapability(capability: string): boolean {
  return capability === "bash" || capability.startsWith("bash") || capability.startsWith("shell");
}

/** Suspected-degraded markers (F10-WR-08): garbage is a failure trigger,
 * never stamped clean. */
const DEGRADED_MARKERS = ["paywall", "subscribe to continue", "access denied", "captcha", "truncated", "451 unavailable"];

function looksDegraded(body: string): boolean {
  const lower = body.toLowerCase();
  return DEGRADED_MARKERS.some((m) => lower.includes(m));
}

function isRateClass(status: number, stderr: string, body: string): boolean {
  return /429|403|captcha|rate.?limit|payment_required|authenticationrequired/i.test(`${status} ${stderr} ${body}`);
}

/** N1: `retrievedAt` comes from the host clock `now` only — a timestamp
 * carried inside the subprocess body is content, never the stamp. */
function stampFor(target: string, tier: string, seat: SeatId, taskId: string, body: string, now: () => string, snippetBound?: number): EvidenceStamp {
  const stamp: EvidenceStamp = {
    url: target,
    retrievedAt: now(),
    source: tier,
    sessionProvenance: `${seat}:${taskId}`,
    contentHash: createHash("sha256").update(body, "utf8").digest("hex"),
    contentLength: Buffer.byteLength(body, "utf8"),
  };
  if (snippetBound !== undefined) stamp.snippetBound = snippetBound;
  return stamp;
}

interface ParsedList {
  title: string;
  url: string;
  snippet: string;
}

/** List-only projection (F10-Q10): titles + URLs + bounded snippets; the
 * bound discloses in the evidence record. */
export function projectListOnly(stdout: string, bound: number): { items: ParsedList[]; disclosedBound: number } {
  let raw: unknown = null;
  try {
    raw = JSON.parse(stdout) as unknown;
  } catch {
    raw = null;
  }
  const results = (raw !== null && typeof raw === "object" && "results" in raw
    ? (raw as { results: unknown }).results
    : null) as Array<{ title?: unknown; url?: unknown; snippet?: unknown }> | null;
  const items: ParsedList[] = Array.isArray(results)
    ? results.map((r) => ({
      title: String(r.title ?? ""),
      url: String(r.url ?? ""),
      snippet: String(r.snippet ?? "").slice(0, bound),
    }))
    : [{ title: "", url: "", snippet: stdout.slice(0, bound) }];
  return { items, disclosedBound: bound };
}

function refuse(reason: string, trail: FailureRecord[] = []): AdapterResult {
  return { outcome: "refused", reason, failureTrail: trail };
}

/** Per-call flow: gate -> subprocess -> stamp -> fallback (F10-WR-02).
 * Production path (F5): the frozen internal runner, non-overridable. A
 * `runner` key here is refused; tests inject via runRetrievalTestOnly. */
export function runRetrieval(request: AdapterRequest, deps: AdapterDeps): AdapterResult {
  if ("runner" in (deps as unknown as Record<string, unknown>)) {
    throw new Error("runner injection is test-only: use runRetrievalTestOnly in tests (F5)");
  }
  return runWithRunner(request, deps, frozenProductionRunner);
}

/** Test-only seam (F5): the runner injection path, explicit for tests.
 * N3: throws when NODE_ENV=production — the seam never serves production. */
export function runRetrievalTestOnly(request: AdapterRequest, deps: TestOnlyAdapterDeps): AdapterResult {
  if (process.env.NODE_ENV === "production") {
    throw new Error("test-only seam unavailable in production (F5/N3)");
  }
  return runWithRunner(request, deps, deps.runner);
}

function runWithRunner(request: AdapterRequest, deps: AdapterDeps, runner: SubprocessRunner): AdapterResult {
  const now = deps.now ?? (() => new Date().toISOString());
  const trail: FailureRecord[] = [];

  // 1. Permission check (F2-PE-13: capability + operation + args + targets).
  const gateDecision = deps.gate.decide({
    seat: request.seat,
    tool: request.capability,
    operation: request.operation,
    args: request.args,
    cwd: request.cwd,
    taskId: request.taskId,
    scopePaths: request.scopePaths,
  });
  if (gateDecision.outcome !== "allow") {
    return refuse(`gate ${gateDecision.outcome}: ${gateDecision.reason}`);
  }

  // 2. Seat surface (F10-WR-03; matrix derives from the seat configs).
  const surface = surfaceFor(request.seat);
  if (isBashCapability(request.capability)) {
    return refuse("no seat retrieves via bash (F10-WR-03)");
  }
  const listOnly = surface === "list-only";
  if (listOnly && (request.operation === "fetch" || request.operation === "crawl")) {
    return refuse(`${request.seat} is list-only: titles + URLs + bounded snippets only, no raw fetch (F10-WR-03)`);
  }
  if (surface === "context7-approved" && request.operation !== "docs" && !writerLookupAllowed(request.target, request.approvals)) {
    return refuse("writer lookup refused: Context7-direct or an approval-live lookup only (F10-WR-03)");
  }

  // 3. Read-only retrieval (F10-WR-10): no posts, submissions, side effects.
  const method = (request.httpMethod ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return refuse(`read-only retrieval: ${method} blocked, no state-changing calls (F10-WR-10)`);
  }

  // 4. Zero-paid default (F10-WR-04): no auto paid escalation ever; the
  // captcha unlocker is DISABLED in v1 and never auto-enabled.
  if (request.unlockerRequested === true) {
    return refuse("captcha unlocker DISABLED in v1 and never auto-enabled (F10-WR-04)");
  }
  if (request.paidTier === true && request.byokPresent !== true) {
    return refuse("zero-paid default: no paid endpoint without a BYOK key; never auto-escalates (F10-WR-04)");
  }

  // 5-6. Subprocess tiers in chain order, then stamp. Chain order
  // (KEYED_GRANT_CHECK_ORDER): the keyless trio -> the GRANT-CHECK -> the
  // key-presence check -> the keyed slot (only when both pass, F2-Q5 grant:
  // the session default, logged persistence; expiry/revocation enforced) ->
  // the reserves (on documented exhaustion only, F10-WR-08
  // reserve-activation rule).
  // Reserve activation is IN-CALL: the keyless tiers must all hold
  // rate-class failures in the failure trail (the trail IS the
  // documentation). reserveClaim is the DISCLOSURE reference only, never
  // the activation trigger; a present-but-unverifiable claim is refused.
  const chain = deps.chain ?? [...KEYLESS_TRIO];
  const baseChain = [...chain];
  const keyedClosedDisclosures: string[] = [];
  for (const slot of KEYED_SLOTS) {
    if (!isKeyedSlotActive(request.keyedSlotKeys?.[slot] === true)) continue;
    if (!isKeyedGrantLive(request.keyedSlotGrants?.[slot], now())) {
      const closed = `keyed slot ${slot} closed: no live grant (F2-Q5 session default; logged persistence; expiry/revocation enforcement)`;
      keyedClosedDisclosures.push(closed);
      trail.push({
        tier: slot,
        status: "keyed-grant-closed",
        verbatim: closed,
        at: now(),
        backoff: BACKOFF_STATUS,
        seat: request.seat,
        taskId: request.taskId,
      });
      continue;
    }
    baseChain.push(slot);
  }
  const closedDisclosure = keyedClosedDisclosures.length > 0 ? keyedClosedDisclosures.join("; ") : undefined;
  const keylessInChain = baseChain.filter((tier) => (KEYLESS_TRIO as readonly string[]).includes(tier));
  const exhaustionScope = keylessInChain.length > 0 ? keylessInChain : baseChain;
  const refuseUnverifiableClaim = (): AdapterResult =>
    refuse("unverifiable reserve claim refused: the in-call trail documents no keyless rate-class exhaustion (F10-WR-08)");

  const successes: { tier: string; body: string }[] = [];
  const servedReason = (tier: string, base: string): string =>
    (KEYED_SLOTS as readonly string[]).includes(tier) ? `${base}; ${KEYED_UPGRADE_DISCLOSURE}` : base;
  const withClosed = (disclosure?: string): { disclosure?: string } => {
    const merged = [closedDisclosure, disclosure].filter((d): d is string => d !== undefined && d !== "");
    return merged.length > 0 ? { disclosure: merged.join("; ") } : {};
  };
  const reverifyGrant = deps.reverifyKeyedGrant ?? ((slot: KeyedSlot) => isKeyedGrantLive(request.keyedSlotGrants?.[slot], now()));
  const attemptTier = (tier: string, disclosure?: string): AdapterResult | null => {
    // N4: re-check the grant AT the keyed-slot open (same call scope). A
    // grant revoked between the GRANT-CHECK and this open refuses the open.
    if ((KEYED_SLOTS as readonly string[]).includes(tier)) {
      if (!reverifyGrant(tier as KeyedSlot)) {
        const closed = `keyed slot ${tier} closed at open: grant re-check refused (F2-Q5 TOCTOU re-verify)`;
        trail.push({
          tier,
          status: "keyed-grant-closed",
          verbatim: closed,
          at: now(),
          backoff: BACKOFF_STATUS,
          seat: request.seat,
          taskId: request.taskId,
        });
        return null;
      }
    }
    let result: SubprocessResult;
    try {
      result = runner({ command: "donsetch", tier, operation: request.operation, target: request.target });
    } catch (err) {
      trail.push({
        tier,
        status: "spawn-error",
        verbatim: err instanceof Error ? err.message : "unknown spawn error",
        at: now(),
        backoff: BACKOFF_STATUS,
        seat: request.seat,
        taskId: request.taskId,
      });
      return null;
    }
    const body = result.stdout ?? "";
    const verbatim = result.stderr !== "" ? result.stderr : `status ${result.status}`;
    if (result.status !== 0 || isRateClass(result.status, result.stderr, body)) {
      trail.push({ tier, status: String(result.status), verbatim, at: now(), backoff: BACKOFF_STATUS, seat: request.seat, taskId: request.taskId });
      return null;
    }
    if (body.trim() === "") {
      trail.push({ tier, status: "empty", verbatim: "(empty body)", at: now(), backoff: BACKOFF_STATUS, seat: request.seat, taskId: request.taskId });
      return null;
    }
    if (looksDegraded(body)) {
      trail.push({ tier, status: "suspected-degraded", verbatim: body, at: now(), backoff: BACKOFF_STATUS, seat: request.seat, taskId: request.taskId });
      successes.push({ tier, body });
      return null;
    }
    if (listOnly && request.operation === "search") {
      const bound = deps.snippetBound ?? DEFAULT_SNIPPET_BOUND_UNVERIFIED;
      const projected = projectListOnly(body, bound);
      const out = JSON.stringify(projected.items);
      return {
        outcome: "list-only",
        reason: servedReason(tier, `list-only surface with disclosed snippet bound ${projected.disclosedBound} (${SNIPPET_BOUND_STATUS}) (F10-Q10)`),
        stamp: stampFor(request.target, tier, request.seat, request.taskId, out, now, projected.disclosedBound),
        body: out,
        failureTrail: trail,
        ...withClosed(disclosure),
      };
    }
    if (successes.length > 0) {
      const prior = successes[0];
      if (prior !== undefined && createHash("sha256").update(prior.body, "utf8").digest("hex") !==
        createHash("sha256").update(body, "utf8").digest("hex")) {
        trail.push({ tier: prior.tier, status: "divergent-content", verbatim: prior.body, at: now(), backoff: BACKOFF_STATUS, seat: request.seat, taskId: request.taskId });
      }
      return {
        outcome: "served",
        reason: servedReason(tier, `served by ${tier}; divergent tier content recorded and flagged, no silent winner (F10-WR-09)`),
        stamp: stampFor(request.target, tier, request.seat, request.taskId, body, now),
        body,
        failureTrail: trail,
        ...withClosed(disclosure),
      };
    }
    return {
      outcome: "served",
      reason: servedReason(tier, `served by ${tier}`),
      stamp: stampFor(request.target, tier, request.seat, request.taskId, body, now),
      body,
      failureTrail: trail,
      ...withClosed(disclosure),
    };
  };

  for (const tier of baseChain) {
    const outcome = attemptTier(tier);
    if (outcome === null) continue;
    if (request.reserveClaim !== undefined) return refuseUnverifiableClaim();
    return outcome;
  }

  // 6b. Reserve activation (F10-WR-08 + F2 scoping): IN-CALL on the
  // documented SCOPED+FRESH trail only. The claim rides along as the
  // disclosure reference, never more. A stale or foreign-scope trail refuses.
  // N1: scope `now` is host-clock time only (hostClockScope); seats and the
  // subprocess never supply it. Forgery exposure reduces to a compromised
  // host (out of scope). All trail `at` stamps above likewise use now().
  const trailScope = hostClockScope(request.seat, request.taskId, now, deps.trailFreshnessWindowMs ?? 0);
  if (trailDocumentsExhaustion(trail, exhaustionScope, trailScope)) {
    const ref =
      request.reserveClaim !== undefined && request.reserveClaim !== ""
        ? `disclosure ref ${request.reserveClaim}; `
        : "";
    const reserveDisclosure = `${ref}in-call rate-class trail documents keyless exhaustion (F10-WR-08)`;
    for (const tier of RESERVES) {
      const outcome = attemptTier(tier, reserveDisclosure);
      if (outcome !== null) return outcome;
    }
  } else if (request.reserveClaim !== undefined) {
    return refuseUnverifiableClaim();
  }

  // 7. Exhaustion: Q8/Q18 govern; uncovered demands fail closed (F10-Q8).
  const gap = discloseGap(request.acceptanceCritical ?? null);
  return {
    outcome: "exhausted",
    reason: `chain exhausted: ${gap.disclosure}`,
    failureTrail: trail,
    disclosure: closedDisclosure !== undefined ? `${gap.disclosure}; ${closedDisclosure}` : gap.disclosure,
  };
}
