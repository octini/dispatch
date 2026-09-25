// F16 lens failure (F16-RC-10) + reconciler identity (F16-RC-11).
// All three lenses must return; a failed lens gets ONE bounded infrastructure
// retry (the F5 allowance — NOT a repair cycle); persistent failure FAILS THE
// RUN and escalates to the user. No 2-lens majority, no 1-1 ties — never a
// degraded body (F16-Q6). Reconciliation runs only by a fresh council run
// (one F1 repair cycle) or user escalation; the USER is reconciler of last
// resort; SELF-RECONCILIATION IS BLOCKED (F16-Q7).
import { requireFullBody } from "./run.js";
import type { LensReturn } from "./types.js";

export interface InfraRetryState {
  /** F5 per-task infrastructure-recovery attempts consumed by this run. */
  consumed: number;
}

export interface LensAttempt {
  returns: LensReturn[];
  failedLens: string | null;
}

/** Structured retry-path failure (F16-RC-10 mechanism): the failure carries
 * the reason + the escalation route + the budget state — never a generic throw. */
export interface LensFailure {
  failed: true;
  reason: string;
  escalateTo: "user";
  retry: InfraRetryState;
  escalate: string;
}

/** One bounded infra retry; consumption is recorded. Persistent failure fails
 * the run and escalates — the run never forms a degraded verdict. */
export function resolveLensFailure(
  attempt: LensAttempt,
  retry: InfraRetryState,
  recover: () => LensReturn[],
): { returns: LensReturn[]; retry: InfraRetryState } | LensFailure {
  if (attempt.failedLens === null) {
    return { returns: requireFullBody(attempt.returns), retry };
  }
  if (retry.consumed >= 1) {
    const reason = `lens ${attempt.failedLens} persistently failed after one bounded infra retry`;
    return {
      failed: true,
      reason,
      escalateTo: "user",
      retry,
      escalate: `council run fails + escalates: ${reason}`,
    };
  }
  try {
    const recovered = recover();
    return { returns: requireFullBody(recovered), retry: { consumed: retry.consumed + 1 } };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      failed: true,
      reason: `retry-path failure for lens ${attempt.failedLens}: ${reason}`,
      escalateTo: "user",
      retry: { consumed: retry.consumed + 1 },
      escalate: `council run fails + escalates: retry-path failure for lens ${attempt.failedLens}`,
    };
  }
}

export interface Contradiction {
  caseId: string;
  artifactRevision: string;
  authorityVerdict: string;
  authorityAuthor: string;
  secondOpinion: string;
}

export type ReconcilePath =
  | { path: "fresh-council-run"; repairCycles: 1 }
  | { path: "escalate-user"; reconciler: "user" };

/** A seat never adjudicates its own verdict — self-reconciliation is blocked. */
export function reconcileContradiction(
  contradiction: Contradiction,
  proposedReconciler: string,
): ReconcilePath {
  if (proposedReconciler === contradiction.authorityAuthor) {
    throw new Error("self-reconciliation blocked: a contradicted verdict goes to the user or a fresh council");
  }
  if (proposedReconciler === "user") return { path: "escalate-user", reconciler: "user" };
  return { path: "fresh-council-run", repairCycles: 1 };
}
