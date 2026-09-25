// F16 council budget accounting (F16-RC-07/12): findings join the review
// report with NO separate budget. The INITIAL designated run consumes ceiling
// slots only; RE-RUNS consume F1 repair cycles. One run = 3 lens invocations +
// 1 synthesis step against the F1-Q11 global-8 ceiling; the Dispatcher queues
// when the ceiling binds — never drops a lens silently. On-demand runs count
// against the global-8 AND record on the requesting task's ledger.

export const GLOBAL_CEILING_DEFAULT = 8;
export const LENS_INVOCATIONS_PER_RUN = 3;
export const SYNTHESIS_STEPS_PER_RUN = 1;

export type CouncilRunKind = "initial-designated" | "rerun" | "on-demand";

export interface CouncilCharge {
  /** Ceiling slots consumed (3 lenses + 1 synthesis). */
  ceilingSlots: number;
  /** F1 repair cycles consumed (re-runs only). */
  repairCycles: number;
  /** Task ledger the run records on (on-demand: the requesting task). */
  taskLedger: string | null;
  queued: boolean;
}

export interface AccountCouncilRunInput {
  kind: CouncilRunKind;
  taskId: string;
  activeInvocations: number;
  globalCeiling?: number;
}

/** Queue-not-drop at the ceiling: a bound run queues, never drops a lens. */
export function accountCouncilRun(input: AccountCouncilRunInput): CouncilCharge {
  const ceiling = input.globalCeiling ?? GLOBAL_CEILING_DEFAULT;
  const slots = LENS_INVOCATIONS_PER_RUN + SYNTHESIS_STEPS_PER_RUN;
  const queued = input.activeInvocations + slots > ceiling;
  if (input.kind === "initial-designated") {
    return { ceilingSlots: slots, repairCycles: 0, taskLedger: null, queued };
  }
  if (input.kind === "rerun") {
    return { ceilingSlots: slots, repairCycles: 1, taskLedger: input.taskId, queued };
  }
  return { ceilingSlots: slots, repairCycles: 0, taskLedger: input.taskId, queued };
}
