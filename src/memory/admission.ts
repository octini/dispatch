// F11 staged admission + verifier (F11-DM-03/11): agents stage UNVERIFIED
// entries only, each with a REQUIRED source link (no link, no staging) plus
// the scope stamp (required at admission). The verifier is LAYERED:
// deterministic contract checks + the automatic contradiction lint + an
// EPHEMERAL semantic promotion pass — never a standing seat. The verifier runs
// Seeker-tier (the cost/rate bounds of F7 composition; bound VALUES are
// section 7 — UNVERIFIED here). The user writes, promotes, and deletes
// directly at any time; NO separate Expert review gate.

export type EntryStatus = "staged" | "promoted" | "superseded";

export interface StagedEntry {
  content: string;
  sourceLink: string | null;
  scopeStamp: string | null;
  status: "UNVERIFIED";
}

/** Cost/rate bounds for the ephemeral verifier pass — UNVERIFIED section-7 pins. */
export const VERIFIER_BOUNDS = "UNVERIFIED (Seeker-tier cost/rate bounds per F7 composition; no values set here)" as const;

export interface ContractResult {
  admitted: boolean;
  reasons: string[];
}

/** Deterministic contract checks: source link present + scope stamp present. */
export function checkAdmissionContract(entry: StagedEntry): ContractResult {
  const reasons: string[] = [];
  if (entry.sourceLink === null || entry.sourceLink.length === 0) {
    reasons.push("no link, no staging (F11-DM-03)");
  }
  if (entry.scopeStamp === null || entry.scopeStamp.length === 0) {
    reasons.push("scope stamp required at admission (F11-DM-11)");
  }
  return { admitted: reasons.length === 0, reasons };
}

/** Ephemeral verifier pass: a short-lived job that ends when the pass ends. */
export function runVerifierPass(
  entry: StagedEntry,
  lint: (content: string) => string[],
): { promoted: boolean; contradictions: string[]; standingSeat: false } {
  const contract = checkAdmissionContract(entry);
  if (!contract.admitted) throw new Error(`admission blocked: ${contract.reasons.join("; ")}`);
  return { promoted: true, contradictions: lint(entry.content), standingSeat: false };
}

/** Scope tags (F11-DM-07): minimal FIXED set — project, scope (work|personal),
 * seat (or user), task (issue link), status. Format is section 7; values here
 * are the spec-settled set, never invented. */
export const SCOPE_TAGS = ["project", "scope", "seat", "task", "status"] as const;

export type ScopeTag = (typeof SCOPE_TAGS)[number];

/** Stamping is AUTOMATIC from the admitting context — never hand-written. */
export function stampScope(context: Record<ScopeTag, string>): string {
  return SCOPE_TAGS.map((tag) => `${tag}=${context[tag]}`).join(" ");
}

/** Session history is SEPARATE from durable knowledge (F11-DM-08): session
 * transcripts never promote implicitly. */
export function refuseImplicitPromotion(): { refused: string } {
  return { refused: "transcripts never promote implicitly; F11 staged admission is the gate (F11-DM-08)" };
}

/** The user writes, promotes, and deletes directly at any time — no gate. */
export function userDirectWrite(content: string): { written: true; status: EntryStatus } {
  void content;
  return { written: true, status: "promoted" };
}
