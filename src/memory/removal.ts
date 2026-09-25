// F11 supersede model (F11-DM-04) + deletion policy (F11-DM-05): corrections
// SUPERSEDE — the old claim stays with its supersedes link intact; the lint
// surfaces contradictions. One-home rule: cross-repo supersedes are forbidden.
// Hard-delete ONLY for explicit user deletes (promoted entries included),
// staged entries failing the contract within their window (the verifier may
// delete those — the window shape is UNVERIFIED and NEVER renewing), and
// worthless entries as TOMBSTONES with reasons. NO AUTO-DELETION OF MEMORY,
// EVER — pressure discloses and parks for the user.

export interface SupersedeChain {
  oldId: string;
  newId: string;
  vaultRepo: string;
}

export function supersede(chain: SupersedeChain, targetRepo: string): SupersedeChain {
  if (chain.vaultRepo !== targetRepo) {
    throw new Error("cross-repo supersede forbidden: one-home rule (F11-DM-04)");
  }
  return chain;
}

/** Staging-window shape: UNVERIFIED section-7 item; the window never renews. */
export const STAGING_WINDOW = "UNVERIFIED (section-7 shape; a failing staged entry's window never renews)" as const;

export type DeleteActor = "user" | "verifier";

export interface DeleteRequest {
  actor: DeleteActor;
  status: "staged" | "promoted";
  contractFailing: boolean;
  inWindow: boolean;
  worthless: boolean;
}

export type DeleteOutcome =
  | { deleted: true; tombstone: false }
  | { deleted: true; tombstone: true; reason: string }
  | { refused: string };

/** Nobody but the user hard-deletes a promoted entry. */
export function hardDelete(request: DeleteRequest): DeleteOutcome {
  if (request.worthless) {
    return { deleted: true, tombstone: true, reason: "worthless entry (duplicate, junk, malware-shaped): content gone, tombstone recorded" };
  }
  if (request.status === "promoted" && request.actor !== "user") {
    return { refused: "blocked: verifier supersedes or flags instead (F11-DM-05)" };
  }
  if (request.status === "staged" && request.contractFailing && request.inWindow) {
    return { deleted: true, tombstone: false };
  }
  if (request.actor === "user") return { deleted: true, tombstone: false };
  return { refused: "blocked: outside the never-renewing contract-failure window (F11-DM-05)" };
}

/** Age/size/quota pressure discloses and parks — never auto-deletes. */
export function handleVaultPressure(): { deleted: false; disclosure: string } {
  return { deleted: false, disclosure: "vault pressure discloses and parks for the user; nothing auto-deletes (F11-DM-05)" };
}
