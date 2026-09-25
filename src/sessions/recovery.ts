// F5 crash recovery (F5-DS-06): at most TWO automatic infrastructure attempts
// PER TASK. Earlier escalation fires on repeated non-progress, uncertain
// external effects, or ownership conflict. The crash budget is separate from
// the task repair/re-review and integration budgets; none resets across
// sessions. Recovery reconciles against live evidence first; confirmed actions
// are never replayed. Budgets persist and history travels (F5-DS-07).

export const MAX_AUTO_RECOVERY_PER_TASK = 2;

export interface RecoveryLedger {
  attempts: number;
}

export interface RecoverySignals {
  repeatedNonProgress: boolean;
  uncertainExternalEffects: boolean;
  ownershipConflict: boolean;
}

export type RecoveryDecision =
  | { attempt: true; attempts: number }
  | { escalate: string };

/** Bounded recovery with reconcile-first and no-replay. */
export function decideRecovery(
  ledger: RecoveryLedger,
  signals: RecoverySignals,
  confirmedActions: string[],
  replayRequested: string[],
): RecoveryDecision {
  for (const action of replayRequested) {
    if (confirmedActions.includes(action)) {
      throw new Error(`recovery refused: confirmed action never replayed — ${action}`);
    }
  }
  if (signals.repeatedNonProgress || signals.uncertainExternalEffects || signals.ownershipConflict) {
    return { escalate: "earlier escalation: reconcile against live evidence first (F5-DS-06)" };
  }
  if (ledger.attempts >= MAX_AUTO_RECOVERY_PER_TASK) {
    return { escalate: "third automatic recovery refused and escalated (F5-DS-06)" };
  }
  return { attempt: true, attempts: ledger.attempts + 1 };
}

/** No budget resets across sessions by any event — budgets persist. */
export function persistBudgets(budgets: Record<string, number>): Record<string, number> {
  return { ...budgets };
}
