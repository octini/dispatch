// F5 rollover (F5-DS-07): planned context rollover is a fresh Writer/Seeker
// dispatch with a validated F1 envelope plus a recorded checkpoint — never the
// full transcript. The outgoing session stops acting before the replacement
// owns the work. Rollover costs no crash try, resets no limit, conceals no
// non-progress: budgets persist and history travels.

export interface RolloverCheckpoint {
  assignment: string;
  userInstructions: { text: string; provenance: string }[];
  artifacts: string[];
  findings: string[];
  openQuestions: string[];
  remainingBudgets: Record<string, number>;
}

export interface RolloverPlan {
  freshDispatch: true;
  envelopeValidated: true;
  checkpoint: RolloverCheckpoint;
  outgoingStoppedFirst: true;
  crashCharged: false;
}

/** Plan a rollover: validated envelope + recorded checkpoint, never transcript. */
export function planRollover(
  checkpoint: RolloverCheckpoint,
  envelopeValid: boolean,
  fullTranscriptCarried: boolean,
): RolloverPlan {
  if (!envelopeValid) throw new Error("rollover refused: validated F1 envelope required");
  if (fullTranscriptCarried) throw new Error("rollover refused: never the full transcript");
  return {
    freshDispatch: true,
    envelopeValidated: true,
    checkpoint,
    outgoingStoppedFirst: true,
    crashCharged: false,
  };
}

/** Mid-rollover crash (band fix): a crash of the outgoing session before
 * handover charges the outgoing task; a crash of the replacement after
 * dispatch charges the replacement's task. */
export function chargeMidRolloverCrash(phase: "outgoing-before-handover" | "replacement-after-dispatch"): string {
  if (phase === "outgoing-before-handover") return "outgoing-task";
  return "replacement-task";
}
