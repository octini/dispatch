// F3-SD-05 tiny-only compact spec+plan (adjudicated EXECUTABLE 2026-09-29,
// issue tgo-7a26): ONLY tasks classified tiny MAY use a compact
// revision-bound record. Compactness never waives required review; when the
// task is no longer tiny the record promotes to the fuller structure first.

/** The four tiny-eligibility criteria (F3-SD-05): every compact record's
 * justification must describe each one. */
export const TINY_CRITERIA = [
  "bounded-touch-set",
  "explicit-transformation",
  "reversibility",
  "deterministic-verification",
] as const;

/** Compact revision-bound record: intent + boundaries + acceptance + the
 * tiny-eligibility justification + the Beads link. No tasks.md parallel tracker. */
export interface TinyCompactRecord {
  revision: string;
  intent: string;
  boundaries: string;
  acceptance: string;
  tinyJustification: string;
  beadsLink: string;
  /** True when a parallel tasks.md entry exists — always a violation. */
  tasksMdEntry: boolean;
}

/** Compact-record shape check (SDD-08): every field present, the
 * justification covering all four tiny criteria, the Beads link set, and no
 * parallel tasks.md tracker. */
export function checkCompactRecord(rec: TinyCompactRecord): { present: true } {
  const missing: string[] = [];
  if (rec.revision === "") missing.push("revision");
  if (rec.intent === "") missing.push("intent");
  if (rec.boundaries === "") missing.push("boundaries");
  if (rec.acceptance === "") missing.push("acceptance");
  if (rec.tinyJustification === "") missing.push("tiny-eligibility justification");
  if (rec.beadsLink === "") missing.push("Beads link");
  if (missing.length > 0) throw new Error(`compact record refused: missing ${missing.join(", ")} (F3-SD-05)`);
  const uncovered = TINY_CRITERIA.filter((c) => !rec.tinyJustification.includes(c));
  if (uncovered.length > 0) {
    throw new Error(`compact record refused: justification misses ${uncovered.join(", ")} (F3-SD-05)`);
  }
  if (rec.tasksMdEntry) throw new Error("compact record refused: no tasks.md parallel tracker (F3-SD-05)");
  return { present: true };
}

/** Deviation signal: wider scope, new acceptance, or changed consequences. */
export interface DeviationSignal {
  widerScope: boolean;
  newAcceptance: boolean;
  changedConsequences: boolean;
}

/** Promotion gate (SDD-09): a task that is no longer tiny promotes to the
 * fuller structure with required review BEFORE continuing; continuing on the
 * compact record is compactness-as-waiver and refused. */
export function requirePromotion(signal: DeviationSignal, continuingOnCompact: boolean): { promoted: true } {
  const noLongerTiny = signal.widerScope || signal.newAcceptance || signal.changedConsequences;
  if (noLongerTiny && continuingOnCompact) {
    throw new Error("continuation refused: task no longer tiny — promote to the fuller structure first; compactness-as-waiver refused (F3-SD-05)");
  }
  return { promoted: true };
}
