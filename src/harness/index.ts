// Dispatch Slice 5 — F13 validation harness + S-suite.
// Spec authority: docs/features/validation-harness.md (F13-VH-01 … F13-VH-12)
// + PRIMARY-SPEC sections 4 (acceptance matrix) and 8 (release gate) +
// PIN-RECORD SCHED-01/11/12. Shapes only: no invented procedures, strings,
// thresholds, lane configs, or pin values. Enforcement is unverified until
// probes decide (F13-VH-12).

/** Pinned harness, primary (MANIFEST extension pick; PIN-RECORD SCHED-01). */
export const HARNESS_PACKAGE = "@marcfargas/pi-test-harness" as const;
export const HARNESS_PINNED_VERSION = "0.6.1" as const;

/**
 * Harness SHA: the spec-phase re-pin (exact version + SHA + drift disclosure,
 * F13-VH-10) fills this at the build-pin step. This module CHECKS the record,
 * never fills it — the value stays UNVERIFIED here by constraint.
 */
export const HARNESS_SHA_PIN = "UNVERIFIED" as const;

/** gaodes fork: FALLBACK-ONLY (MANIFEST; F13-VH-09). */
export const GAODES_PACKAGE = "@gaodes" as const;
export const GAODES_SCOPE = "fallback-only" as const;

export interface HarnessRepin {
  version: string;
  sha: typeof HARNESS_SHA_PIN | string;
  /** What moved between the 0.6.1 record and the re-pin + what it means. */
  driftDisclosure: string;
}

export type RepinVerdict = "recorded" | "coverage-violation";

export interface RepinOutcome {
  verdict: RepinVerdict;
  reason: string;
}

/**
 * F13-VH-10 re-pin: exact version + SHA + drift disclosure. No silent drift:
 * undisclosed drift is a coverage violation under F13-VH-02.
 */
export function checkRepin(repin: HarnessRepin): RepinOutcome {
  if (repin.sha === HARNESS_SHA_PIN || repin.driftDisclosure.trim() === "") {
    return {
      verdict: "coverage-violation",
      reason: "harness re-pin incomplete (exact version + SHA + drift disclosure required): undisclosed drift fails coverage (F13-VH-10/02)",
    };
  }
  return { verdict: "recorded", reason: `harness re-pinned ${repin.version} with SHA + drift disclosure (F13-VH-10)` };
}

export interface FallbackPin {
  commit: string;
  scope: string;
}

export interface FallbackProvenance {
  commitVerifiable: boolean;
  scopeWithinPin: boolean;
  sourceReachable: boolean;
}

/**
 * F13-VH-09 verify-then-admit: the fallback's exact commit/scope pins at spec
 * phase; provenance failure (unverifiable commit, scope beyond the pin, or
 * unreachable source) DROPS the fallback — primary-only, never unverified.
 */
export function admitFallback(_pin: FallbackPin, provenance: FallbackProvenance): { admitted: boolean; reason: string } {
  if (!provenance.commitVerifiable || !provenance.scopeWithinPin || !provenance.sourceReachable) {
    return { admitted: false, reason: "provenance failure: the gaodes fallback DROPS — harness runs primary-only (F13-VH-09)" };
  }
  return { admitted: true, reason: "gaodes fallback admitted verified-then-pinned, fallback-only (F13-VH-09)" };
}

// --- Two CI lanes (F13-VH-01: F13-Q1 USER OVERRIDE, both-in-v1) ---

export const CI_LANES = ["windows-latest", "macos-latest"] as const;
export type CiLane = (typeof CI_LANES)[number];
export type LaneResult = "green" | "red" | "missing";

export function bothLanesGreen(lanes: Record<CiLane, LaneResult>): { pass: boolean; reason: string } {
  const missing = (CI_LANES as readonly string[]).filter((lane) => lanes[lane as CiLane] !== "green");
  if (missing.length > 0) {
    return {
      pass: false,
      reason: `pilot entry blocked: lane(s) not green (${missing.join(", ")}); a missing or red macOS lane blocks exactly as Windows does (F13-VH-01)`,
    };
  }
  return { pass: true, reason: "Windows AND macOS lanes green in v1 (F13-Q1 override; F13-VH-01)" };
}

// --- S-suite (F13-VH-03: 13 coverage names from the tgo-uz53 record) ---

export const S_SUITE = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9a",
  "S9b",
  "S9c",
  "S10",
  "S11",
] as const;

export type SScenario = (typeof S_SUITE)[number];

export const S_SUITE_NAMES: Record<SScenario, string> = {
  S1: "interrupted sessions",
  S2: "stale memories",
  S3: "denied tools",
  S4: "model unavailable",
  S5: "conflicting instructions",
  S6: "failed verification",
  S7: "bootstrap idempotence",
  S8: "compressor single-owner",
  S9a: "reuse-gate identity",
  S9b: "reuse-gate permission",
  S9c: "reuse-gate completed",
  S10: "spec drift",
  S11: "zero-web disclosure",
};

/** Per-scenario procedure draft shape: setup/action/assertion, reviewed never self-certifying. */
export interface SProcedureDraft {
  scenario: SScenario;
  setup: string;
  action: string;
  assertion: string;
  reviewed: boolean;
}

export function draftProcedure(draft: SProcedureDraft): { recorded: boolean; reason: string } {
  if (!draft.reviewed) {
    return { recorded: false, reason: `${draft.scenario}: draft unreviewed — drafts are review targets, never self-certifying (F13-VH-03)` };
  }
  return { recorded: true, reason: `${draft.scenario} (${S_SUITE_NAMES[draft.scenario]}): setup/action/assertion draft recorded reviewed (F13-VH-03)` };
}

// --- Requirement-complete coverage rule (F13-VH-02; PS-SEAM-13) ---

/** Coverage target: an executable suite item, or an acceptance-matrix row (traceable, not automated). */
export type CoverageTarget =
  | { kind: "suite-item"; item: string }
  | { kind: "acceptance-matrix-row"; row: string };

export type ControlClass = "preventive" | "detective" | "advisory";

export interface CoverageEntry {
  requirementId: string;
  control: ControlClass;
  /** Preventive controls map to their FULL adversarial scenario. */
  adversarialScenario: string | null;
  targets: CoverageTarget[];
}

/**
 * Every requirement ID maps to ≥1 executable suite item or matrix row; every
 * preventive control maps to its full adversarial scenario — a preventive
 * control with no adversarial scenario is a coverage violation and blocks.
 */
export function checkCoverage(entries: CoverageEntry[]): { pass: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const entry of entries) {
    if (entry.targets.length === 0) {
      violations.push(`${entry.requirementId}: no suite item or acceptance-matrix row (F13-VH-02)`);
    }
    if (entry.control === "preventive" && entry.adversarialScenario === null) {
      violations.push(`${entry.requirementId}: preventive control with no adversarial scenario blocks (F13-VH-02)`);
    }
  }
  return { pass: violations.length === 0, violations };
}

// --- Pilot entry gate (F13-VH-04: ONE checkpoint, three legs) ---

export interface PilotEntryInput {
  lanesGreenBoth: boolean;
  sSuiteGreenBoth: boolean;
  userApproved: boolean;
  verbatimSignedOff: boolean;
}

export function pilotEntryGate(input: PilotEntryInput): { enter: boolean; reason: string } {
  if (!input.lanesGreenBoth || !input.sSuiteGreenBoth) {
    return { enter: false, reason: "pilot entry BLOCKED: all-green on both OS lanes required (S-suite plus coverage-rule executable items) (F13-VH-04)" };
  }
  if (!input.userApproved) {
    return { enter: false, reason: "pilot entry BLOCKED: explicit user approval required (F13-VH-04)" };
  }
  if (!input.verbatimSignedOff) {
    return { enter: false, reason: "pilot entry BLOCKED: verbatim sign-off on refusal/disclosure strings required (F13-VH-04)" };
  }
  return { enter: true, reason: "pilot enters at ONE checkpoint: all-green + explicit approval + verbatim sign-off (F13-VH-04)" };
}

// --- Pilot exit bar (F13-VH-05: user sign-off + objective floor, no numeric thresholds) ---

export const WATCHED_METRICS = [
  "refusal-samples-with-reason-codes",
  "resume-decisions",
  "compaction-contests",
  "verifier-fails",
  "unavailability-episodes",
  "web-fallback-disclosures",
  "repeat-call-canary",
] as const;

export type WatchedMetric = (typeof WATCHED_METRICS)[number];

export interface PilotExitInput {
  metricsRecorded: Record<WatchedMetric, boolean>;
  unexplainedRollbacks: number;
  stringsAsSignedOff: boolean;
  userSignedOff: boolean;
}

export function pilotExitBar(input: PilotExitInput): { exit: boolean; reason: string } {
  const unrecorded = (WATCHED_METRICS as readonly string[]).filter((m) => !input.metricsRecorded[m as WatchedMetric]);
  if (unrecorded.length > 0) {
    return { exit: false, reason: `exit floor UNMET: unrecorded watched metric(s) ${unrecorded.join(", ")} — no numeric threshold consulted (F13-VH-05)` };
  }
  if (input.unexplainedRollbacks > 0) {
    return { exit: false, reason: "exit floor UNMET: unexplained rollback(s) — floor needs zero unexplained rollbacks (F13-VH-05)" };
  }
  if (!input.stringsAsSignedOff) {
    return { exit: false, reason: "exit floor UNMET: string(s) deviating from signed-off text (F13-VH-05)" };
  }
  if (!input.userSignedOff) {
    return { exit: false, reason: "pilot exit BLOCKED without user sign-off on evidence, even when the floor holds (F13-VH-05)" };
  }
  return { exit: true, reason: "pilot exits: user sign-off over evidence plus the objective floor (F13-VH-05)" };
}

// --- Record-only falsifier counters (F13-VH-06/07: never a gate) ---

export type TaskClass = "plan-shaped" | "judgment-heavy";

export interface FalsifierCounters {
  tierVsPassRate: Record<TaskClass, { tasks: number; firstPassRate: string }>;
  resumeHitRate: { hits: number; decisions: number };
}

/**
 * Counters NEVER gate pilot exit, rollback, or re-entry in v1; any future
 * binding threshold is a v2 candidate requiring its own user decision.
 */
export function recordCounters(counters: FalsifierCounters): { recorded: true; gates: "none"; reason: string } {
  void counters;
  return {
    recorded: true,
    gates: "none",
    reason: "F7 falsifier tier-vs-pass-rate (class-split) + BQ4 resume-hit recorded; record-only, never a gate (F13-VH-06/07)",
  };
}

// --- Rollback + re-entry (F13-VH-08: PRD:306-308) ---

export interface RollbackState {
  mode: "supervised" | "harness-only";
  grantsRevoked: boolean;
  ledgersPreserved: boolean;
}

export function rollback(state: RollbackState): RollbackState {
  return { mode: "harness-only", grantsRevoked: true, ledgersPreserved: true };
}

export function rollbackVerdict(state: RollbackState): { done: boolean; reason: string } {
  if (state.mode === "harness-only" && state.grantsRevoked && state.ledgersPreserved) {
    return { done: true, reason: "rollback flips to harness-only, revokes grants, preserves ledgers (F13-VH-08)" };
  }
  return { done: false, reason: "rollback incomplete: flip + revocation + ledger preservation all required (F13-VH-08)" };
}

/** Re-entry requires the failing scenario REPRODUCED GREEN — otherwise BLOCKED. */
export function reentryGate(failingScenarioReproducedGreen: boolean): { enter: boolean; reason: string } {
  if (!failingScenarioReproducedGreen) {
    return { enter: false, reason: "re-entry BLOCKED until the failing scenario reproduces green (F13-VH-08)" };
  }
  return { enter: true, reason: "re-entry: failing scenario reproduced green (F13-VH-08)" };
}

// --- Verbatim-string sign-off gates (F13-VH-11: spec review AND pre-pilot) ---

export type SignoffGate = "spec-review" | "pre-pilot";

export interface SignedString {
  text: string;
  gate: SignoffGate;
  signedOffText: string;
}

/** At BOTH gates the runtime strings must MATCH the signed-off text — a mismatch blocks. */
export function checkSignedString(signed: SignedString): { pass: boolean; reason: string } {
  if (signed.text !== signed.signedOffText) {
    return { pass: false, reason: `string mismatch at the ${signed.gate} gate blocks (F13-VH-11)` };
  }
  return { pass: true, reason: `runtime string matches the text signed off at ${signed.gate} (F13-VH-11)` };
}
