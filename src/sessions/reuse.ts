// F5 guarded session reuse (F5-DS-01/02/03/08): partial Writer/Seeker sessions
// resume only on recorded progress + non-terminal run record + under-budget +
// equal identity + current permission validation with no narrowing since
// capture. Identity covers model + variant + preset + seat config + tools/skills
// + host version. Completed, cancelled, and Expert-review sessions are never
// reused; a named backup model is always a fresh dispatch with logged notice.

export interface SessionIdentity {
  model: string;
  variant: string;
  preset: string;
  seatConfig: string;
  toolsSkills: string;
  hostVersion: string;
}

export interface ReuseState {
  hasProgress: boolean;
  runTerminal: boolean;
  overBudget: boolean;
  identity: SessionIdentity;
  expectedIdentity: SessionIdentity;
  permissionNarrowed: boolean;
  status: "partial" | "completed" | "cancelled";
  seat: "writer" | "seeker" | "expert";
}

/** Guarded reuse validation + the gates (F5-Q1..Q5): refuse or fresh-dispatch. */
export function validateReuse(state: ReuseState): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (state.status === "completed") reasons.push("completed sessions are never reused (F5-DS-03)");
  if (state.status === "cancelled") reasons.push("cancelled sessions are never reused (F5-DS-03)");
  if (state.seat === "expert") reasons.push("Expert review sessions are always fresh (F5-DS-03)");
  if (!state.hasProgress) reasons.push("resume bar: no recorded progress (F5-DS-01)");
  if (state.runTerminal) reasons.push("resume bar: terminal run record (F5-DS-01)");
  if (state.overBudget) reasons.push("resume bar: over preset token budget (F5-DS-01)");
  if (JSON.stringify(state.identity) !== JSON.stringify(state.expectedIdentity)) {
    reasons.push("identity drift: fresh revalidated dispatch, never relaxed resume (F5-DS-02)");
  }
  if (state.permissionNarrowed) reasons.push("narrowed permissions: fresh authorized dispatch only (F5-DS-01)");
  return { eligible: reasons.length === 0, reasons };
}

/** Model/permission DRIFT: a named backup is a fresh dispatch with logged
 * notice, never an equality exception; revoked rights stay revoked. */
export function dispatchBackup(namedBackup: string, authorityRevoked: boolean): { fresh: true; notice: string } {
  if (authorityRevoked) throw new Error("backup dispatch parked: revoked authority never restored");
  return { fresh: true, notice: `fresh dispatch on backup ${namedBackup} with logged notice (F5-DS-02)` };
}
