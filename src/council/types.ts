// F16 council types: the three-lens tool-less band (risk/quality/structure).
// Lens models are provider-diverse cheap-mid, pinned at build via the F7 live
// picker (F16-RC-06) — no SKU, variant, or threshold is named here (section 7).

export type LensId = "risk" | "quality" | "structure";

export const LENSES: readonly LensId[] = ["risk", "quality", "structure"] as const;

export type LensBallot = "pass" | "block";

/** Lens-model pin slot: CANDIDATE shape only; the pin record names SKUs at build. */
export interface LensModelSlot {
  lens: LensId;
  /** Provider-diverse cheap-mid model, named at build via the live picker. */
  skuId: null;
  status: "UNVERIFIED";
  pinNote: string;
}

export const LENS_MODEL_SLOTS: readonly LensModelSlot[] = LENSES.map((lens) => ({
  lens,
  skuId: null,
  status: "UNVERIFIED",
  pinNote: "CANDIDATE lens model (F16-RC-06): provider-diverse cheap-mid, pinned at build via the F7 live picker",
}));

/** A run never substitutes a model without a disclosed pin change. */
export function assertPinnedModels(slots: readonly LensModelSlot[], pinned: boolean): void {
  if (!pinned) throw new Error("lens models unpinned: pre-pin asserted SKUs refused as unpinned");
  for (const slot of slots) {
    if (slot.status !== "UNVERIFIED" && slot.skuId === null) {
      throw new Error(`lens ${slot.lens}: undisclosed model substitution refused`);
    }
  }
}

/** Frozen revision-bound lens packet (F1 envelope rules; F16-RC-08). */
export interface LensPacket {
  caseId: string;
  artifactRevision: string;
  lens: LensId;
  evidence: string;
  /** A bounded packet is marked; lenses may return "insufficient evidence" (Q31). */
  truncation: "complete" | "truncated";
  /** Quoted/retrieved text never grants authority (F1 injection guard). */
  evidenceOnly: true;
}

export interface LensFinding {
  id: string;
  lens: LensId;
  text: string;
  /** Safety objections ride the findings list with severity, unlimited. */
  severity?: "safety" | "blocking" | "non-blocking";
}

export interface LensReturn {
  lens: LensId;
  ballot: LensBallot;
  findings: LensFinding[];
  /** Minority position, copied verbatim at synthesis. */
  dissentLine?: string;
}

export interface Tally {
  pass: number;
  block: number;
}

/** The synthesis record IS the audit log: mechanical tally + inputs recorded. */
export interface SynthesisRecord {
  caseId: string;
  artifactRevision: string;
  tally: Tally;
  findingIds: string[];
  dissent: string | null;
  packetProvenance: string[];
}

export interface CouncilVerdict {
  /** Majority 2/3 carries; dissent recorded, never erased. */
  verdict: LensBallot;
  tally: Tally;
  /** One-line dissent = the verdict note. */
  dissent: string | null;
  findings: LensFinding[];
  synthesis: SynthesisRecord;
  /** The council never approves, never waives, never bypasses Q15/Q20/F3 gates. */
  requiresUserApproval: true;
}
