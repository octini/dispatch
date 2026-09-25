// F5 cancellation (F5-DS-04/05): cancel targets the NAMED task or branch and
// its invocations only; the whole run cancels only when explicitly asked.
// Cancel stops new affected actions, requests underway-stop, preserves
// artifacts and evidence, reports underway and uncertain outcomes, and parks
// the affected branch. No rollback promise. Restart needs a user instruction
// plus a fresh session; cancelled sessions are never reused. Ownership is not
// released until the previous Writer stopped or is safely isolated.

export interface CancelRequest {
  namedTask: string;
  wholeRun: boolean;
  wholeRunExplicitlyAsked: boolean;
}

export interface CancelOutcome {
  stopped: string[];
  underwayStopRequested: true;
  artifactsPreserved: true;
  uncertainReported: true;
  parkedBranch: string;
  rollbackPromised: false;
}

export function cancelTask(request: CancelRequest): CancelOutcome {
  if (request.wholeRun && !request.wholeRunExplicitlyAsked) {
    throw new Error("whole-run cancel refused without explicit ask (F5-DS-04)");
  }
  return {
    stopped: [request.namedTask],
    underwayStopRequested: true,
    artifactsPreserved: true,
    uncertainReported: true,
    parkedBranch: request.namedTask,
    rollbackPromised: false,
  };
}

/** Restart after cancellation needs a user instruction plus a fresh session. */
export function restartAfterCancel(userInstruction: boolean): { fresh: true } {
  if (!userInstruction) throw new Error("restart refused: user instruction plus fresh session required (F5-DS-04)");
  return { fresh: true };
}

/** Preservation (F5-DS-09): unmerged work and needed evidence stay until
 * verified handback or explicit disposition; only disposable logs clean under
 * visible limits; protected data over a cap discloses and asks. */
export function preserveUntilHandback(handbackVerified: boolean, disposition: boolean): { preserved: boolean } {
  if (handbackVerified || disposition) return { preserved: false };
  return { preserved: true };
}

export function cleanDisposable(underVisibleLimit: boolean, protectedOverCap: boolean): { cleaned: boolean; disclosure?: string } {
  if (protectedOverCap) return { cleaned: false, disclosure: "protected data over cap: disclose and ask, never silent delete (F5-DS-09)" };
  if (!underVisibleLimit) return { cleaned: false };
  return { cleaned: true };
}

/** Handover release gate: a still-writing old process blocks ownership; when
 * stop cannot be confirmed after bounded attempts, escalate under park rules —
 * never an indefinite silent block. TERMINAL escalation (band fix): the
 * unconfirmable stop escalates, the replacement does not act. */
export function releaseOwnership(oldStoppedOrIsolated: boolean, attemptsExhausted: boolean): { released: true } | { escalate: string } {
  if (oldStoppedOrIsolated) return { released: true };
  if (attemptsExhausted) {
    return { escalate: "unconfirmable stop: ownership withheld, replacement does not act, escalate under F3-SD-04a park rules" };
  }
  throw new Error("handover blocked: previous Writer still able to write (F5-DS-05)");
}
