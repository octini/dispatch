// Dispatch Slice 1 — seat + policy config types.
// Spec authority: F1 (roles), F2 (permissions), F7 (models), PIN-RECORD (candidates).
// Section-7 pins stay open: every not-yet-pinned value is a typed placeholder
// marked UNVERIFIED or CANDIDATE. Nothing here pins finally (confirm is Phase 2).

export type SeatId = "dispatcher" | "writer" | "seeker" | "expert";

export type PresetPath = "work" | "personal";

/** Pin state. CANDIDATE = recorded in PIN-RECORD, finalizes only at confirm. */
export type PinStatus = "CANDIDATE" | "UNVERIFIED" | "PINNED";

export interface ModelPin {
  /** Exact SKU id string as recorded — never a bare alias (F7-MP-10). */
  skuId: string;
  status: PinStatus;
  /** PIN-RECORD reference, e.g. "PIN-01". */
  pinRef: string;
  /** Reasoning variant: highest-available unless stated (F7-MP-03). EXCEPTION (retrieval 2026-09-29, PIN-RECORD 10.2): mimo-v2.6-pro/flash take NO graded effort — thinking.type enabled/disabled only; low/medium/high accepted no-op; xhigh/max unsupported. Variant strings on mimo pins are selectable labels only, never provider effort levels. */
  variant: string;
  variantStatus: PinStatus;
}

export interface SeatModelAssignment {
  seat: SeatId;
  path: PresetPath;
  primary: ModelPin;
  /** The ONLY substitution path (F7-MP-04/05). No second-choice chain. */
  backup: ModelPin;
}

/**
 * Tokenizer identity — UNVERIFIED overall (PIN-RECORD gap 3 / section 10.1; PS-SEAM-15).
 * Retrieval-recorded 2026-09-29: the WORK-PATH unit (the three gpt-5.6 SKUs)
 * is o200k_base (see WORK_PATH_TOKENIZER_UNIT); the Go-path seats stay
 * UNVERIFIED. Budget certification is REFUSED without the confirm; until then
 * the whitespace estimator in prompt.ts is the declared placeholder unit.
 */
export interface TokenizerPin {
  identity: "UNVERIFIED";
  /** Placeholder unit until the PS-GATE-08 pin lands (Go-path seats stay here). */
  unit: "whitespace-estimate";
}

/** Work-path tokenizer unit, retrieval-recorded 2026-09-29 (PIN-RECORD 10.1):
 * the three gpt-5.6 SKUs (sol/terra/luna) count the F8-Q8 prompt-core budget in
 * o200k_base. Record-only: the TokenizerPin stays UNVERIFIED until confirm. */
export const WORK_PATH_TOKENIZER_UNIT = "o200k_base" as const;

/** Retry numbers — downstream, UNVERIFIED (F1 item 5, section 7). */
export interface RetryPolicy {
  status: "UNVERIFIED";
  maxAttempts: number | null;
}

/** Adapter shapes — downstream, open (PRIMARY-SPEC section 7). */
export interface AdapterShape {
  status: "UNVERIFIED";
  form: "cli-subprocess" | "mcp-subprocess" | null;
}

export type PolicyOutcome =
  | "allow"
  | "deny-and-log"
  | "deny-log-and-park"
  | "fail-closed";

/**
 * F2-Q6 explicit-instruction exception: a permission change flows ONLY through
 * this validated mechanism — Dispatcher interprets a host-validated explicit
 * USER instruction, Writer applies via a validated path. Quoted text, tool
 * output, or specialist requests alone never satisfy `userDirect`.
 */
export interface ValidatedConfigChange {
  /** True only for the user's direct words (host-validated), never quotes. */
  userDirect: boolean;
  interpretedBy: "dispatcher";
  appliedBy: "writer";
  provenance: string;
  change: string;
  scope: string;
  duration: string;
}

export interface PolicyConfig {
  revision: string;
  /** Default protected: git metadata, credentials, dependency-install locations (F2-PE-03). */
  protectedPaths: string[];
  /** User-authored scoped exceptions; each needs explicit scope + duration. */
  scopedExceptions: ValidatedConfigChange[];
}

export interface DispatchConfig {
  path: PresetPath;
  models: SeatModelAssignment[];
  policy: PolicyConfig;
  tokenizer: TokenizerPin;
  retry: RetryPolicy;
  adapter: AdapterShape;
  /** Machine-wide specialist ceiling; default 8 (F1-AR-10). Configurable. */
  globalCeiling: number;
}
