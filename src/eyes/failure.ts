// F17 failure semantics (F17-VL-08) + runtime seat availability (F17-VL-10).
// An unreadable/refused/timed-out read gets ONE bounded infrastructure retry
// (the F5 allowance, not a repair cycle) CONSUMING ONE of F5's two per-task
// attempts — no new budget surface. Spent allowance means no retry, straight
// to park (F3-SD-04a). Persistent failure parks with disclosure — NEVER a
// fabricated description. With no vision-capable seat at runtime, vision work
// parks with disclosure while text-only work continues; an eyeless designated
// review of visual evidence BLOCKS (Q31 insufficient evidence is not a pass).

export const F5_INFRA_ATTEMPTS_PER_TASK = 2;

export interface VisionAttemptState {
  f5AttemptsConsumed: number;
}

export type VisionOutcome =
  | { ok: true }
  | { ok: false; parked: true; disclosure: string };

/** One bounded retry inside F5's allowance; consumption is recorded. */
export function resolveVisionFailure(
  state: VisionAttemptState,
  recover: () => boolean,
): { outcome: VisionOutcome; state: VisionAttemptState } {
  if (state.f5AttemptsConsumed >= F5_INFRA_ATTEMPTS_PER_TASK) {
    return {
      outcome: { ok: false, parked: true, disclosure: "vision read parked per F3-SD-04a: no retry, F5 allowance spent" },
      state,
    };
  }
  const next: VisionAttemptState = { f5AttemptsConsumed: state.f5AttemptsConsumed + 1 };
  if (recover()) return { outcome: { ok: true }, state: next };
  return {
    outcome: { ok: false, parked: true, disclosure: "vision read parked per F3-SD-04a with disclosure; never fabricated" },
    state: next,
  };
}

export interface SeatAvailability {
  dispatcherVisionCapable: boolean;
  seekerAvailable: boolean;
}

/** No vision-capable seat at runtime parks vision work with disclosure. */
export function checkSeatAvailability(seats: SeatAvailability): { parked: boolean; disclosure?: string } {
  if (!seats.dispatcherVisionCapable && !seats.seekerAvailable) {
    return { parked: true, disclosure: "no vision-capable seat available; independent text-only work continues" };
  }
  return { parked: false };
}

/** An eyeless designated review of visual evidence BLOCKS — it cannot judge
 * evidence it cannot see. */
export function checkEyelessReview(seats: SeatAvailability, designated: boolean): { blocked: boolean } {
  const { parked } = checkSeatAvailability(seats);
  return { blocked: designated && parked };
}
