// F5 session lifecycle public surface: guarded reuse, rollover, cancel,
// recovery. Authority validation (F5-DS-08): validate before any launch;
// revoked or insufficient authority parks, never launch-then-validate.
export * from "./reuse.js";
export * from "./rollover.js";
export * from "./cancel.js";
export * from "./recovery.js";

export interface LaunchAuthority {
  authorized: boolean;
  revoked: boolean;
}

/** Outage guard (F5-DS-10): while the tracker is inaccessible there is NO new
 * delegation and NO new recovery launch. Only the already-running bounded
 * authorized reversible unit may finish (artifacts preserved) then park. */
export function guardTrackerAccess(trackerAvailable: boolean): { launch: true } | { refused: string } {
  if (!trackerAvailable) {
    return { refused: "no new delegation or recovery while the tracker is inaccessible (F5-DS-10)" };
  }
  return { launch: true };
}

/** Envelope binding (F5-DS-12): fresh and resumed runs use the F1 envelope with
 * revision-bound evidence; checkpoint references prove nothing until reconciled. */
export function requireRevisionEnvelope(envelopeValid: boolean): { bound: true } {
  if (!envelopeValid) throw new Error("run refused: F1 envelope with revision-bound evidence required (F5-DS-12)");
  return { bound: true };
}

/** Validate-before-launch: revoked or insufficient authority parks the work. */
export function validateLaunchAuthority(authority: LaunchAuthority): { launch: true } | { parked: string } {
  if (authority.revoked) return { parked: "revoked authority parks the work, never launch-then-validate (F5-DS-08)" };
  if (!authority.authorized) return { parked: "insufficient authority parks the work (F5-DS-08)" };
  return { launch: true };
}
