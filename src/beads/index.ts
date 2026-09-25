// Dispatch Slice 2 — F4 Beads typed tools + lifecycle semantics.
// Spec authority: docs/features/beads-integration.md (F4-BI-01 … F4-BI-12).
// Only the Dispatcher performs typed validated lifecycle mutations;
// specialists hold scoped reads, no mutation (F4-BI-07). Seat/tool coupling
// derives from the seat configs (FIND-1 single-source): this module reads
// them, never a second list.

import type { SeatId } from "../config.js";
import * as dispatcherSeat from "../seats/dispatcher.js";
import * as writerSeat from "../seats/writer.js";
import * as seekerSeat from "../seats/seeker.js";
import * as expertSeat from "../seats/expert.js";

export const BEADS_READ_TOOLS = [
  "beads_show",
  "beads_list",
  "beads_search",
  "beads_ready",
  "beads_blocked",
  "beads_memories",
] as const;

export const BEADS_MUTATION_TOOLS = [
  "beads_create",
  "beads_update",
  "beads_claim",
  "beads_close",
  "beads_reopen",
  "beads_dep",
] as const;

export type BeadsReadTool = (typeof BEADS_READ_TOOLS)[number];
export type BeadsMutationTool = (typeof BEADS_MUTATION_TOOLS)[number];
export type BeadsTool = BeadsReadTool | BeadsMutationTool;

const SEAT_TOOLSETS: Record<SeatId, { tools: Array<{ name: string }> }> = {
  dispatcher: dispatcherSeat,
  writer: writerSeat,
  seeker: seekerSeat,
  expert: expertSeat,
};

function seatOwns(seat: SeatId, tool: string): boolean {
  return SEAT_TOOLSETS[seat].tools.some((t) => t.name === tool);
}

export interface AuthorityVerdict {
  allowed: boolean;
  reason: string;
}

/**
 * Dispatcher-owned typed tools only (F4-BS-03 / F4-BI-07): no seat ever gets
 * a mutation path except the Dispatcher, and only through these typed tools.
 */
export function toolAuthority(seat: SeatId, tool: string): AuthorityVerdict {
  if ((BEADS_MUTATION_TOOLS as readonly string[]).includes(tool)) {
    if (seat !== "dispatcher") {
      return {
        allowed: false,
        reason: `${seat} holds no Beads mutation authority: dispatcher-exclusive via typed tools (F4-BI-07)`,
      };
    }
    if (!seatOwns("dispatcher", tool)) {
      return {
        allowed: false,
        reason: `${tool} is outside the dispatcher seat toolset (FIND-1 single-source)`,
      };
    }
    return { allowed: true, reason: "dispatcher typed mutation tool (F4-BI-07)" };
  }
  if ((BEADS_READ_TOOLS as readonly string[]).includes(tool)) {
    if (!seatOwns(seat, tool)) {
      return {
        allowed: false,
        reason: `${seat} holds no ${tool} read: outside its seat toolset (FIND-1)`,
      };
    }
    return { allowed: true, reason: `${seat} scoped read (F4-BI-07)` };
  }
  return { allowed: false, reason: `unknown Beads tool ${tool}: capability parked pending mapping` };
}

// --- Lifecycle semantics ---

export type IssueStatus = "open" | "in_progress" | "blocked" | "closed";

export interface LiveIssueState {
  id: string;
  status: IssueStatus;
  assignee: string | null;
  /** Run owner is distinct from the human assignee field (F4-BI-04). */
  runOwner: string | null;
  approvalValid: boolean;
}

export interface LiveStore {
  reachable: boolean;
  /** Null = unknown; unknown never authorizes (reconcile first). */
  readLive(id: string): LiveIssueState | null;
}

export interface MutationRequest {
  kind: "create" | "update" | "claim" | "close" | "reopen" | "dep";
  issueId: string;
  runId: string;
  /** dep only: the edge under validation. */
  createsCycle?: boolean;
  /** reopen only: required live checks. */
  ownershipClear?: boolean;
  evidenceChecked?: boolean;
}

export type LifecycleDecision = "proceed" | "refuse" | "park" | "finish-then-park";

export interface VerifyVerdict {
  decision: LifecycleDecision;
  reason: string;
}

/**
 * Verify-first claim/close/reopen/dep (F4-BI-09): scheduling, claims,
 * delegations, lifecycle mutations, and completions validate against LIVE
 * tracker state before proceeding; a stale cached board view never
 * authorizes. Creation never authorizes execution (F4-BI-01).
 */
export function verifyMutation(store: LiveStore, req: MutationRequest): VerifyVerdict {
  if (!store.reachable) {
    return {
      decision: "refuse",
      reason: "tracker unreachable: live validation required (F4-BI-09); the outage path governs (F4-BI-05)",
    };
  }
  if (req.kind === "create") {
    return {
      decision: "proceed",
      reason: "pre-approval creation allowed; creation never authorizes execution (F4-BI-01)",
    };
  }
  const live = store.readLive(req.issueId);
  if (live === null) {
    return { decision: "park", reason: "live state unknown: reconcile before retry, never blind replay (F4-BI-06)" };
  }
  switch (req.kind) {
    case "claim":
      // No takeover from idleness alone or a matching username alone (F4-BI-04).
      if (live.runOwner !== null && live.runOwner !== req.runId) {
        return {
          decision: "park",
          reason: "possible other-run owner: park-and-ask before any transfer (F4-BI-04)",
        };
      }
      if (live.runOwner === req.runId) {
        return { decision: "proceed", reason: "verified same-run recovery per session policy (F4-BI-04)" };
      }
      return { decision: "proceed", reason: "unowned assignment claimed against live state (F4-BI-09)" };
    case "update":
      return { decision: "proceed", reason: "typed living-spec edit against live state (F4-BI-09)" };
    case "close":
      // Manual closed tracker state never equals verified completion (F4-BI-08).
      if (live.status === "closed") {
        return { decision: "refuse", reason: "already closed; manual closed never reads as verified completion (F4-BI-08)" };
      }
      return { decision: "proceed", reason: "close recorded; close declares no verified completion (F4-BI-08)" };
    case "reopen":
      // Missing or revoked approval blocks; valid covering approval may resume
      // after the required live ownership and evidence checks (F4-BI-03).
      if (!live.approvalValid) {
        return { decision: "refuse", reason: "missing or revoked approval blocks reopen resume (F4-BI-03)" };
      }
      if (req.ownershipClear === true && req.evidenceChecked === true) {
        return { decision: "proceed", reason: "resume under valid covering approval recorded and disclosed (F4-BI-03)" };
      }
      return { decision: "park", reason: "live ownership and evidence checks required before resume (F4-BI-03)" };
    case "dep":
      // A cycle parks affected scheduling while independent work proceeds (F4-BI-11).
      if (req.createsCycle === true) {
        return { decision: "park", reason: "dependency cycle parks affected scheduling; independent work proceeds (F4-BI-11)" };
      }
      return { decision: "proceed", reason: "dependency edge validated before scheduling (F4-BI-11)" };
  }
}

// --- Per-issue verify-then-mutate lock (F4-BI-09 downstream coordination) ---
//
// Design line (BN-1, lock domain named per NB-1):
// (a) CROSS-PROCESS authority is the bd tracker's own atomic claim semantics
// (the verify-first, claim-if-unowned host-tool semantics — the tracker
// arbitrates concurrent claims across processes); this in-process lock never
// claims cross-process authority and never substitutes for a live re-read.
// (b) the IN-PROCESS per-issue lock guards the plugin's read-modify-write
// sequences within a process; verify-then-mutate runs under the lock, and a
// second verifier that finds the state changed (lock held or version moved)
// re-parks or refuses — the stale-never-authorizes rule extends to the race.
// (c) the lock carries a TTL + crash-release (a holder's absence releases at
// the TTL; the TTL VALUE = the section-7 pin LOCK_TTL_PIN, UNVERIFIED —
// never invented here). No zero-race guarantee is claimed beyond this
// coordination; residual race behavior stays a downstream probe item
// (spec section 7 item 5).

export interface VersionedLiveIssueState extends LiveIssueState {
  version: number;
}

export interface VersionedLiveStore extends LiveStore {
  readVersioned(id: string): VersionedLiveIssueState | null;
}

/**
 * Lock-domain record (NB-1): names the cross-process authority so no reader
 * mistakes the in-process lock for it. The bd tracker arbitrates concurrent
 * claims across processes; this module's lock covers in-process sequences.
 */
export const LOCK_DOMAIN_RECORD =
  "cross-process authority: the bd tracker's own atomic claim semantics (verify-first, claim-if-unowned host-tool semantics — the tracker arbitrates concurrent claims across processes); in-process guard: the per-issue lock covers the plugin's read-modify-write sequences within a process only" as const;

/** Section-7 pin: the lock TTL VALUE pins at build/probe; never invented here. */
export const LOCK_TTL_PIN = "UNVERIFIED" as const;

export interface IssueLocks {
  /** TTL path: a lock whose holder never released (crash) frees at the TTL. */
  tryAcquire(id: string, nowMs?: number, ttlMs?: number): boolean;
  release(id: string): void;
  held(id: string): boolean;
  /**
   * Design line (NB-2): the TTL/park expiry releases the LOCK ONLY — a
   * capped/parked state NEVER clears on expiry (the parked state clears only
   * via the user's re-check or word). This frees an expired lock and touches
   * no failure counter or park record.
   */
  releaseIfExpired(id: string, nowMs: number, ttlMs: number): boolean;
}

export function createIssueLocks(): IssueLocks {
  const heldAt = new Map<string, number>();
  return {
    tryAcquire(id: string, nowMs: number = Date.now(), ttlMs?: number): boolean {
      const at = heldAt.get(id);
      if (at !== undefined) {
        if (ttlMs !== undefined && nowMs - at >= ttlMs) {
          // TTL crash-release takeover: the absent holder releases at the TTL.
          heldAt.set(id, nowMs);
          return true;
        }
        return false;
      }
      heldAt.set(id, nowMs);
      return true;
    },
    release(id: string): void {
      heldAt.delete(id);
    },
    held(id: string): boolean {
      return heldAt.has(id);
    },
    releaseIfExpired(id: string, nowMs: number, ttlMs: number): boolean {
      const at = heldAt.get(id);
      if (at === undefined) return false;
      if (nowMs - at < ttlMs) return false;
      heldAt.delete(id);
      return true;
    },
  };
}

export interface LockedMutationRequest extends MutationRequest {
  /** The live version observed at verify time; a moved version re-parks. */
  expectedVersion?: number;
  /** Lock clock for the TTL path; the TTL VALUE stays the section-7 pin. */
  nowMs?: number;
  lockTtlMs?: number;
}

/**
 * Verify-then-mutate under the per-issue lock: re-reads live state while
 * holding the lock, re-parks on a held lock or a moved version, runs the
 * F4-BI-09 verify, and only then runs the mutation. The lock always
 * releases, on every path.
 */
export function verifyThenMutate(
  store: VersionedLiveStore,
  locks: IssueLocks,
  req: LockedMutationRequest,
  mutate: () => void,
): VerifyVerdict {
  if (!store.reachable) {
    return {
      decision: "refuse",
      reason: "tracker unreachable: live validation required (F4-BI-09); the outage path governs (F4-BI-05)",
    };
  }
  if (!locks.tryAcquire(req.issueId, req.nowMs, req.lockTtlMs)) {
    return {
      decision: "park",
      reason: `race: per-issue lock on ${req.issueId} held by another verifier; re-parked with disclosure — re-verify before retry; stale-never-authorizes extends to the race (F4-BI-09)`,
    };
  }
  try {
    const live = store.readVersioned(req.issueId);
    if (live === null) {
      return { decision: "park", reason: "live state unknown: reconcile before retry, never blind replay (F4-BI-06)" };
    }
    if (req.expectedVersion !== undefined && req.expectedVersion !== live.version) {
      return {
        decision: "park",
        reason: `race: ${req.issueId} moved since verify (v${req.expectedVersion} → v${live.version}); re-parked with disclosure — stale-never-authorizes extends to the race (F4-BI-09)`,
      };
    }
    const verdict = verifyMutation(store, req);
    if (verdict.decision !== "proceed") return verdict;
    mutate();
    return { decision: "proceed", reason: `${verdict.reason} (verify-then-mutate under the per-issue lock)` };
  } finally {
    locks.release(req.issueId);
  }
}

/**
 * Live human tracker edits govern running work (F4-BI-03): a withdrawing or
 * contradicting edit stops new affected actions, preserves artifacts and
 * evidence, reports underway effects, and parks the affected branch.
 */
export function reconcileLiveEdit(edit: {
  kind: "close" | "reopen" | "edit";
  withdrawsAssignment: boolean;
  contradictsAssignment: boolean;
}): VerifyVerdict {
  if (edit.withdrawsAssignment || edit.contradictsAssignment) {
    return {
      decision: "park",
      reason: "live edit withdraws or contradicts the assignment: stop new affected actions, preserve artifacts and evidence, report underway effects, park the affected branch (F4-BI-03)",
    };
  }
  return { decision: "proceed", reason: "live edit leaves the assignment intact (F4-BI-03)" };
}

/**
 * F4-Q4 manual-actor rule: the user's direct paths stand; a tracker action
 * is never a test/approval fact; never take over on name/idle appearance.
 */
export function manualActorRule(): {
  userDirectPathsStand: true;
  trackerActionIsTestOrApprovalFact: false;
  takeoverOnNameOrIdle: "refused";
} {
  return { userDirectPathsStand: true, trackerActionIsTestOrApprovalFact: false, takeoverOnNameOrIdle: "refused" };
}

export function ownershipTakeover(
  signal: "idle" | "same-name" | "verified-same-run" | "ambiguous-other-run",
): VerifyVerdict {
  switch (signal) {
    case "idle":
    case "same-name":
      return { decision: "refuse", reason: `no takeover on ${signal} alone (F4-BI-04)` };
    case "verified-same-run":
      return { decision: "proceed", reason: "verified same-run recovery per session policy (F4-BI-04)" };
    case "ambiguous-other-run":
      return { decision: "park", reason: "ambiguous collision parks and asks before any transfer (F4-BI-04)" };
  }
}

// --- Outage behavior (F4-BI-05) ---

export interface BoundedUnit {
  name: string;
  preconditions: string[];
  postconditions: string[];
  scope: string;
  reversibleOrCompensatable: boolean;
  /** The unit is declared before it starts (dispatch or park record). */
  declaredBeforeStart: boolean;
  authorized: boolean;
}

export function outageDecision(req: {
  kind: "new-claim" | "delegation" | "mutation" | "completion" | "finish-current";
  unit?: BoundedUnit;
  authorityDoubt: boolean;
  ownershipDoubt: boolean;
}): VerifyVerdict {
  // NO new claims, delegations, lifecycle mutations, or completion declarations.
  if (req.kind !== "finish-current") {
    return { decision: "refuse", reason: `outage: no ${req.kind}; disclosed (F4-BI-05)` };
  }
  const u = req.unit;
  if (
    u !== undefined &&
    u.authorized &&
    u.declaredBeforeStart &&
    u.reversibleOrCompensatable &&
    !req.authorityDoubt &&
    !req.ownershipDoubt
  ) {
    return {
      decision: "finish-then-park",
      reason: "current already-authorized bounded reversible unit finishes, artifacts preserved, then parks; no next task, no consequential external action (F4-BI-05)",
    };
  }
  // Authority or ownership uncertainty still stops affected work (no bypass).
  return { decision: "park", reason: "outage: unit not finishable (unauthorized, undeclared, irreversible, or doubted); park with artifacts preserved (F4-BI-05)" };
}

// --- Outage park record boundedness (F4-BI-05) ---
//
// Design line (BN-4): the park record carries the recorded preconditions /
// postconditions + a deadline/expiry (VALUE = the section-7 pin) + the
// REVERSAL OWNER (the user, per F1's arbitration, with the Dispatcher's
// park-record as the carrier).

// RELEASE-GATING record (NB-4): the park deadline/expiry VALUE (PARK_DEADLINE_PIN) + the staleness max-age VALUE (STALENESS_MAX_AGE_PIN) are RELEASE-GATING — the v1 release gate (PRIMARY-SPEC section 8) requires the pin record complete; these cannot backlog past release; they pin at the PS-GATE/build-pin step.
/** Section-7 pin: the park deadline/expiry VALUE pins at build/probe; never invented here. */
export const PARK_DEADLINE_PIN = "UNVERIFIED" as const;

/** Reversal owner: the user, per F1's arbitration (F1-AR-04: the user arbitrates). */
export const PARK_REVERSAL_OWNER = "user" as const;

export interface OutageParkRecord {
  issueId: string;
  park: "F3-SD-04a";
  preconditions: string[];
  postconditions: string[];
  /** Section-7 pin marker; valued at build/probe, never invented. */
  deadline: typeof PARK_DEADLINE_PIN;
  reversalOwner: typeof PARK_REVERSAL_OWNER;
  reason: string;
}

export function outageParkRecord(req: {
  issueId: string;
  preconditions: string[];
  postconditions: string[];
  reason: string;
}): OutageParkRecord {
  return {
    issueId: req.issueId,
    park: "F3-SD-04a",
    preconditions: req.preconditions,
    postconditions: req.postconditions,
    deadline: PARK_DEADLINE_PIN,
    reversalOwner: PARK_REVERSAL_OWNER,
    reason: req.reason,
  };
}

// --- Uncertain outcomes and safe retry (F4-BI-06) ---

export type LiveEvidence = "confirmed-success" | "confirmed-nonexecution" | "ambiguous";

export function reconcileUncertain(
  op: { operationId: string; kind: BeadsMutationTool },
  evidence: LiveEvidence,
): VerifyVerdict {
  switch (evidence) {
    case "confirmed-success":
      return {
        decision: "proceed",
        reason: `${op.kind} ${op.operationId} confirmed: reconciles without replay, never retried (F4-BI-06)`,
      };
    case "confirmed-nonexecution":
      return {
        decision: "proceed",
        reason: `${op.kind} ${op.operationId} confirmed unexecuted: safe retry on operation identity (F4-BI-06)`,
      };
    case "ambiguous":
      return {
        decision: "park",
        reason: `${op.kind} ${op.operationId} ambiguous: park; no blind replay, no suspected-duplicate delete, no orphan-close cleanup (F4-BI-06)`,
      };
  }
}

/**
 * A retry is safe only on operation identity plus live evidence — never on a
 * bare idempotency assertion. Similar title or close time alone is not
 * identity (F4-BI-06).
 */
export function operationIdentity(op: {
  operationId?: string;
  title?: string;
  closeTime?: string;
}): { identical: boolean; reason: string } {
  if (typeof op.operationId === "string" && op.operationId.length > 0) {
    return { identical: true, reason: "operation identity plus live evidence (F4-BI-06)" };
  }
  return { identical: false, reason: "title or time similarity alone is not identity (F4-BI-06)" };
}

// --- Typed living-spec edits ---

export const LIVING_SPEC_FIELDS = [
  "title",
  "description",
  "priority",
  "assignee",
  "status",
  "dependency",
] as const;

export type LivingSpecField = (typeof LIVING_SPEC_FIELDS)[number];

export interface LivingSpecEdit {
  issueId: string;
  field: LivingSpecField;
  value: string;
  actor: SeatId;
  operationId: string;
}

export function validateLivingSpecEdit(edit: { actor: SeatId; field: string }): VerifyVerdict {
  if (!(LIVING_SPEC_FIELDS as readonly string[]).includes(edit.field)) {
    return { decision: "refuse", reason: `${edit.field} is outside the validated living-spec set` };
  }
  const authority = toolAuthority(edit.actor, "beads_update");
  if (!authority.allowed) return { decision: "refuse", reason: authority.reason };
  return { decision: "proceed", reason: `typed living-spec edit to ${edit.field} (F4-BI-06 validated set)` };
}
