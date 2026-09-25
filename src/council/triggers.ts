// F16 council triggers (F16-RC-04) + designated-class governance (F16-RC-12).
// (i) designated reviews run automatically — consequential approval-bound work
// (the F3 gates) plus the F14/F15 review-gate cold reads; (ii) on-demand —
// user prose ("run it by the band"), any seat's request, or Dispatcher judgment
// for consequential uncertainty (the F1-Q6 pattern); (iii) routine tasks skip.

export type CouncilTrigger =
  | { kind: "designated"; gate: string }
  | { kind: "on-demand"; source: "user-prose" | "seat-request" | "dispatcher-uncertainty"; note: string }
  | { kind: "routine" };

/** True when the council convenes; routine work never convenes it. */
export function shouldConvene(trigger: CouncilTrigger): boolean {
  return trigger.kind !== "routine";
}

/** Designated reviews take QUEUE PRIORITY over on-demand when the ceiling binds. */
export function queuePriority(trigger: CouncilTrigger): number {
  if (trigger.kind === "designated") return 0;
  if (trigger.kind === "on-demand") return 1;
  return 2;
}

/** Designated-class expansion requires the USER's explicit approval — a new
 * class is a decision, never downstream discretion. */
export function expandDesignatedClass(
  proposed: string,
  approval: { userApproved: boolean },
): { admitted: boolean; gate: string } {
  if (!approval.userApproved) throw new Error(`designated class refused without user approval: ${proposed}`);
  return { admitted: true, gate: proposed };
}
