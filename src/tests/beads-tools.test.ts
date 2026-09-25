// Beads typed-tools unit tests (F4-BI-03/04/05/06/07/08/09/11 + F4-Q4).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Named-open paths stay explicit: the live bd binary
// behavior, operation-identity availability in live evidence, and the
// cross-worktree identity algorithm. Those stay open until their probes land.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BEADS_MUTATION_TOOLS,
  BEADS_READ_TOOLS,
  LIVING_SPEC_FIELDS,
  LOCK_DOMAIN_RECORD,
  LOCK_TTL_PIN,
  PARK_DEADLINE_PIN,
  PARK_REVERSAL_OWNER,
  createIssueLocks,
  manualActorRule,
  operationIdentity,
  outageDecision,
  outageParkRecord,
  ownershipTakeover,
  reconcileLiveEdit,
  reconcileUncertain,
  toolAuthority,
  validateLivingSpecEdit,
  verifyMutation,
  verifyThenMutate,
  type LiveIssueState,
  type LiveStore,
  type VersionedLiveIssueState,
  type VersionedLiveStore,
} from "../beads/index.js";
import * as dispatcher from "../seats/dispatcher.js";
import type { SeatId } from "../config.js";

function store(issues: Record<string, LiveIssueState>, reachable = true): LiveStore {
  return { reachable, readLive: (id: string) => issues[id] ?? null };
}

const OPEN: LiveIssueState = { id: "bd-1", status: "open", assignee: null, runOwner: null, approvalValid: true };
const OWNED: LiveIssueState = { id: "bd-2", status: "in_progress", assignee: "ryangking", runOwner: "run-other", approvalValid: true };
const MINE: LiveIssueState = { id: "bd-3", status: "in_progress", assignee: "ryangking", runOwner: "run-mine", approvalValid: true };
const CLOSED: LiveIssueState = { id: "bd-4", status: "closed", assignee: null, runOwner: null, approvalValid: true };
const NOAPPROVAL: LiveIssueState = { id: "bd-5", status: "open", assignee: null, runOwner: null, approvalValid: false };
const s = store({ "bd-1": OPEN });

describe("typed-tools-only, dispatcher-owned (F4-BS-03 / F4-BI-07)", () => {
  it("every typed tool lives in the dispatcher seat config (FIND-1 single-source)", () => {
    const names = new Set(dispatcher.tools.map((t) => t.name));
    for (const tool of [...BEADS_READ_TOOLS, ...BEADS_MUTATION_TOOLS]) {
      assert.ok(names.has(tool), `${tool} missing from the dispatcher seat config`);
    }
  });

  it("no seat ever gets a mutation path except the dispatcher", () => {
    const seats: SeatId[] = ["writer", "seeker", "expert"];
    for (const seat of seats) {
      for (const tool of BEADS_MUTATION_TOOLS) {
        const v = toolAuthority(seat, tool);
        assert.equal(v.allowed, false, `${seat} must not mutate via ${tool}`);
      }
    }
    for (const tool of BEADS_MUTATION_TOOLS) {
      assert.equal(toolAuthority("dispatcher", tool).allowed, true);
    }
  });

  it("specialists hold scoped reads only where their seat config grants them", () => {
    assert.equal(toolAuthority("seeker", "beads_show").allowed, true);
    assert.equal(toolAuthority("seeker", "beads_search").allowed, false);
    assert.equal(toolAuthority("writer", "beads_show").allowed, true);
    assert.equal(toolAuthority("expert", "beads_show").allowed, true);
  });

  it("unknown Beads tools park pending mapping", () => {
    assert.equal(toolAuthority("dispatcher", "beads_time_travel").allowed, false);
  });
});

describe("verify-first lifecycle (F4-BI-09)", () => {
  it("claim against live state proceeds when unowned; parks on other-run owner", () => {
    const s = store({ "bd-1": OPEN, "bd-2": OWNED });
    assert.equal(verifyMutation(s, { kind: "claim", issueId: "bd-1", runId: "run-mine" }).decision, "proceed");
    const held = verifyMutation(s, { kind: "claim", issueId: "bd-2", runId: "run-mine" });
    assert.equal(held.decision, "park");
    assert.match(held.reason, /park-and-ask/);
  });

  it("verified same-run recovery proceeds", () => {
    const s = store({ "bd-3": MINE });
    assert.equal(verifyMutation(s, { kind: "claim", issueId: "bd-3", runId: "run-mine" }).decision, "proceed");
  });

  it("a stale cached board never authorizes: live-closed refuses the claim path", () => {
    const s = store({ "bd-4": CLOSED });
    const v = verifyMutation(s, { kind: "close", issueId: "bd-4", runId: "run-mine" });
    assert.equal(v.decision, "refuse");
    assert.match(v.reason, /never reads as verified completion/);
  });

  it("unknown live state parks for reconcile, never blind-replays", () => {
    const s = store({});
    assert.equal(verifyMutation(s, { kind: "close", issueId: "bd-9", runId: "run-mine" }).decision, "park");
  });

  it("unreachable tracker refuses new work; the outage path governs", () => {
    const s = store({ "bd-1": OPEN }, false);
    const v = verifyMutation(s, { kind: "claim", issueId: "bd-1", runId: "run-mine" });
    assert.equal(v.decision, "refuse");
    assert.match(v.reason, /F4-BI-05/);
  });

  it("reopen without valid approval blocks; with approval plus checks it resumes recorded", () => {
    const s = store({ "bd-5": NOAPPROVAL, "bd-1": OPEN });
    assert.equal(verifyMutation(s, { kind: "reopen", issueId: "bd-5", runId: "run-mine" }).decision, "refuse");
    const parked = verifyMutation(s, { kind: "reopen", issueId: "bd-1", runId: "run-mine" });
    assert.equal(parked.decision, "park");
    const resumed = verifyMutation(s, {
      kind: "reopen", issueId: "bd-1", runId: "run-mine", ownershipClear: true, evidenceChecked: true,
    });
    assert.equal(resumed.decision, "proceed");
  });

  it("creation never authorizes execution", () => {
    const s = store({});
    const v = verifyMutation(s, { kind: "create", issueId: "bd-new", runId: "run-mine" });
    assert.equal(v.decision, "proceed");
    assert.match(v.reason, /never authorizes execution/);
  });

  it("a withdrawing live edit parks the affected branch with artifacts preserved", () => {
    const v = reconcileLiveEdit({ kind: "close", withdrawsAssignment: true, contradictsAssignment: false });
    assert.equal(v.decision, "park");
    assert.match(v.reason, /preserve artifacts and evidence/);
  });
});

describe("manual-actor rule (F4-Q4)", () => {
  it("user direct paths stand; tracker actions are never test or approval facts", () => {
    const rule = manualActorRule();
    assert.equal(rule.userDirectPathsStand, true);
    assert.equal(rule.trackerActionIsTestOrApprovalFact, false);
    assert.equal(rule.takeoverOnNameOrIdle, "refused");
  });

  it("no takeover on idle or matching name; ambiguity parks and asks", () => {
    assert.equal(ownershipTakeover("idle").decision, "refuse");
    assert.equal(ownershipTakeover("same-name").decision, "refuse");
    assert.equal(ownershipTakeover("verified-same-run").decision, "proceed");
    assert.equal(ownershipTakeover("ambiguous-other-run").decision, "park");
  });
});

describe("outage park (F4-Q5)", () => {
  it("new claims, delegations, mutations, and completions are refused", () => {
    for (const kind of ["new-claim", "delegation", "mutation", "completion"] as const) {
      const v = outageDecision({ kind, authorityDoubt: false, ownershipDoubt: false });
      assert.equal(v.decision, "refuse", kind);
    }
  });

  it("a bounded authorized reversible unit finishes, then parks", () => {
    const v = outageDecision({
      kind: "finish-current",
      unit: {
        name: "u1", preconditions: ["scope"], postconditions: ["done"], scope: "/repo",
        reversibleOrCompensatable: true, declaredBeforeStart: true, authorized: true,
      },
      authorityDoubt: false,
      ownershipDoubt: false,
    });
    assert.equal(v.decision, "finish-then-park");
  });

  it("authority or ownership doubt stops the finish; never a second tracker", () => {
    const v = outageDecision({
      kind: "finish-current",
      unit: {
        name: "u1", preconditions: ["scope"], postconditions: ["done"], scope: "/repo",
        reversibleOrCompensatable: true, declaredBeforeStart: true, authorized: true,
      },
      authorityDoubt: true,
      ownershipDoubt: false,
    });
    assert.equal(v.decision, "park");
  });
});

describe("reconciliation before retry (F4-Q6)", () => {
  it("confirmed success reconciles without replay; confirmed nonexecution retries; ambiguity parks", () => {
    assert.equal(reconcileUncertain({ operationId: "op-1", kind: "beads_claim" }, "confirmed-success").decision, "proceed");
    assert.match(reconcileUncertain({ operationId: "op-1", kind: "beads_claim" }, "confirmed-success").reason, /never retried/);
    assert.match(reconcileUncertain({ operationId: "op-1", kind: "beads_claim" }, "confirmed-nonexecution").reason, /safe retry/);
    assert.equal(reconcileUncertain({ operationId: "op-1", kind: "beads_claim" }, "ambiguous").decision, "park");
  });

  it("title or time similarity alone is not identity", () => {
    assert.equal(operationIdentity({ title: "same title", closeTime: "2026-09-24" }).identical, false);
    assert.equal(operationIdentity({ operationId: "op-1" }).identical, true);
  });
});

describe("dependency validation (F4-BI-11) and typed living-spec edits", () => {
  it("a cycle parks affected scheduling while independent work proceeds", () => {
    const v = verifyMutation(s, { kind: "dep", issueId: "bd-1", runId: "run-mine", createsCycle: true });
    assert.equal(v.decision, "park");
    assert.match(v.reason, /independent work proceeds/);
    const ok = verifyMutation(s, { kind: "dep", issueId: "bd-1", runId: "run-mine" });
    assert.equal(ok.decision, "proceed");
  });

  it("living-spec edits are typed and dispatcher-only", () => {
    assert.ok(LIVING_SPEC_FIELDS.includes("priority"));
    assert.equal(validateLivingSpecEdit({ actor: "dispatcher", field: "priority" }).decision, "proceed");
    assert.equal(validateLivingSpecEdit({ actor: "writer", field: "priority" }).decision, "refuse");
    assert.equal(validateLivingSpecEdit({ actor: "dispatcher", field: "blast-radius" }).decision, "refuse");
  });
});

describe("per-issue verify-then-mutate lock (BN-1 / F4-BI-09)", () => {
  function versioned(issues: Record<string, VersionedLiveIssueState>, reachable = true): VersionedLiveStore {
    return {
      reachable,
      readLive: (id: string) => issues[id] ?? null,
      readVersioned: (id: string) => issues[id] ?? null,
    };
  }

  const V1: VersionedLiveIssueState = { id: "bd-1", status: "open", assignee: null, runOwner: null, approvalValid: true, version: 1 };

  it("two concurrent verify-then-mutate: one wins, the loser re-parks with disclosure", () => {
    const locks = createIssueLocks();
    const s = versioned({ "bd-1": V1 });
    assert.equal(locks.tryAcquire("bd-1"), true, "first verifier holds the lock");
    const loser = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-b" }, () => {});
    assert.equal(loser.decision, "park");
    assert.match(loser.reason, /race.*re-parked/);
    locks.release("bd-1");
    let mutated = false;
    const winner = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-b" }, () => { mutated = true; });
    assert.equal(winner.decision, "proceed");
    assert.equal(mutated, true);
    assert.equal(locks.held("bd-1"), false, "the lock always releases");
  });

  it("a moved version re-parks: stale-never-authorizes extends to the race", () => {
    const locks = createIssueLocks();
    const moved: VersionedLiveIssueState = { ...V1, version: 2 };
    const s = versioned({ "bd-1": moved });
    let mutated = false;
    const v = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-b", expectedVersion: 1 }, () => { mutated = true; });
    assert.equal(v.decision, "park");
    assert.match(v.reason, /moved since verify/);
    assert.equal(mutated, false, "no mutation on a stale verify");
    assert.equal(locks.held("bd-1"), false);
  });

  it("a matching version proceeds; the lock releases even on refuse", () => {
    const locks = createIssueLocks();
    const s = versioned({ "bd-1": V1 });
    let mutated = false;
    const ok = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-b", expectedVersion: 1 }, () => { mutated = true; });
    assert.equal(ok.decision, "proceed");
    assert.equal(mutated, true);
    const refused = verifyThenMutate(s, locks, { kind: "close", issueId: "bd-9", runId: "run-b" }, () => { mutated = false; });
    assert.equal(refused.decision, "park");
    assert.equal(locks.held("bd-1"), false);
    assert.equal(locks.held("bd-9"), false);
  });
});

describe("outage park record boundedness (BN-4 / F4-BI-05)", () => {
  it("the park record carries preconditions/postconditions + deadline pin + user reversal owner", () => {
    const r = outageParkRecord({
      issueId: "bd-1",
      preconditions: ["scope recorded"],
      postconditions: ["artifacts preserved"],
      reason: "tracker outage mid-unit",
    });
    assert.equal(r.park, "F3-SD-04a");
    assert.deepEqual(r.preconditions, ["scope recorded"]);
    assert.deepEqual(r.postconditions, ["artifacts preserved"]);
    assert.equal(r.deadline, "UNVERIFIED");
    assert.equal(r.reversalOwner, "user");
  });

  it("the deadline value stays a section-7 pin, never invented", () => {
    assert.equal(PARK_DEADLINE_PIN, "UNVERIFIED");
    assert.equal(PARK_REVERSAL_OWNER, "user");
  });
});

describe("lock domain: TTL crash-release + cross-process authority (NB-1)", () => {
  function versioned(issues: Record<string, VersionedLiveIssueState>, reachable = true): VersionedLiveStore {
    return {
      reachable,
      readLive: (id: string) => issues[id] ?? null,
      readVersioned: (id: string) => issues[id] ?? null,
    };
  }

  const V1: VersionedLiveIssueState = { id: "bd-1", status: "open", assignee: null, runOwner: null, approvalValid: true, version: 1 };

  it("an unreleased lock frees at the TTL (crash-release); an unexpired lock stays held", () => {
    const locks = createIssueLocks();
    assert.equal(locks.tryAcquire("bd-1", 1000), true);
    assert.equal(locks.tryAcquire("bd-1", 1200, 500), false, "unexpired: still held");
    assert.equal(locks.held("bd-1"), true);
    assert.equal(locks.tryAcquire("bd-1", 1500, 500), true, "TTL crash-release: the absent holder releases at the TTL");
    assert.equal(locks.held("bd-1"), true);
    locks.release("bd-1");
    assert.equal(locks.held("bd-1"), false);
  });

  it("releaseIfExpired frees only an expired lock, never a live one or a missing one", () => {
    const locks = createIssueLocks();
    assert.equal(locks.releaseIfExpired("bd-9", 2000, 500), false, "no lock: nothing to release");
    assert.equal(locks.tryAcquire("bd-1", 1000), true);
    assert.equal(locks.releaseIfExpired("bd-1", 1200, 500), false, "unexpired: untouched");
    assert.equal(locks.held("bd-1"), true);
    assert.equal(locks.releaseIfExpired("bd-1", 1500, 500), true, "expired: released");
    assert.equal(locks.held("bd-1"), false);
  });

  it("verifyThenMutate carries the TTL path: takeover proceeds, a live holder still parks", () => {
    const locks = createIssueLocks();
    const s = versioned({ "bd-1": V1 });
    assert.equal(locks.tryAcquire("bd-1", 1000), true, "first holder takes the lock");
    let mutated = false;
    const parked = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-b", nowMs: 1200, lockTtlMs: 500 }, () => { mutated = true; });
    assert.equal(parked.decision, "park", "live holder: the race still re-parks");
    assert.equal(mutated, false);
    assert.equal(locks.held("bd-1"), true, "the live holder keeps the lock");
    const recovered = verifyThenMutate(s, locks, { kind: "claim", issueId: "bd-1", runId: "run-c", nowMs: 1600, lockTtlMs: 500 }, () => { mutated = true; });
    assert.equal(recovered.decision, "proceed", "TTL crash-release: takeover after the holder's absence");
    assert.equal(mutated, true);
    assert.equal(locks.held("bd-1"), false, "the lock always releases");
  });

  it("the lock TTL value stays a section-7 pin, never invented", () => {
    assert.equal(LOCK_TTL_PIN, "UNVERIFIED");
  });

  it("the cross-process authority is documented as the tracker's own atomic claim semantics", () => {
    assert.match(LOCK_DOMAIN_RECORD, /tracker arbitrates/);
    assert.match(LOCK_DOMAIN_RECORD, /claim-if-unowned/);
    assert.match(LOCK_DOMAIN_RECORD, /in-process/);
  });
});
