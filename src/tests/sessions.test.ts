// F5 session-lifecycle tests (F5-DS-01..12).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateReuse,
  dispatchBackup,
  planRollover,
  chargeMidRolloverCrash,
  cancelTask,
  restartAfterCancel,
  releaseOwnership,
  preserveUntilHandback,
  cleanDisposable,
  decideRecovery,
  persistBudgets,
  guardTrackerAccess,
  requireRevisionEnvelope,
  validateLaunchAuthority,
  MAX_AUTO_RECOVERY_PER_TASK,
  type ReuseState,
} from "../sessions/index.js";

const IDENTITY = {
  model: "m1", variant: "v1", preset: "work", seatConfig: "s1", toolsSkills: "t1", hostVersion: "h1",
};

function partial(): ReuseState {
  return {
    hasProgress: true, runTerminal: false, overBudget: false,
    identity: { ...IDENTITY }, expectedIdentity: { ...IDENTITY },
    permissionNarrowed: false, status: "partial", seat: "writer",
  };
}

describe("F5-DS-01 guarded reuse: progress, live record, budget, identity, permission", () => {
  it("guarded partial work resumes", () => {
    assert.deepEqual(validateReuse(partial()), { eligible: true, reasons: [] });
  });

  it("missing progress, terminal record, over-budget, or narrowed permission refuse", () => {
    assert.equal(validateReuse({ ...partial(), hasProgress: false }).eligible, false);
    assert.equal(validateReuse({ ...partial(), runTerminal: true }).eligible, false);
    assert.equal(validateReuse({ ...partial(), overBudget: true }).eligible, false);
    assert.equal(validateReuse({ ...partial(), permissionNarrowed: true }).eligible, false);
  });
});

describe("F5-DS-02 identity equality; drift means fresh; backup fresh", () => {
  it("model drift refuses resume; backup dispatches fresh with notice", () => {
    assert.equal(validateReuse({ ...partial(), identity: { ...IDENTITY, model: "m2" } }).eligible, false);
    const backup = dispatchBackup("m-backup", false);
    assert.equal(backup.fresh, true);
    assert.match(backup.notice, /logged notice/);
    assert.throws(() => dispatchBackup("m-backup", true));
  });
});

describe("F5-DS-03 completed/cancelled never reuse; Expert always fresh", () => {
  it("terminal states and Expert reviews refuse in-place reuse", () => {
    assert.equal(validateReuse({ ...partial(), status: "completed" }).eligible, false);
    assert.equal(validateReuse({ ...partial(), status: "cancelled" }).eligible, false);
    assert.equal(validateReuse({ ...partial(), seat: "expert" }).eligible, false);
  });
});

describe("F5-DS-04 named cancel scope; stop/request/preserve/park; no rollback", () => {
  it("named branch cancels with duties; whole run needs explicit ask", () => {
    const outcome = cancelTask({ namedTask: "t1", wholeRun: false, wholeRunExplicitlyAsked: false });
    assert.deepEqual(outcome.parkedBranch, "t1");
    assert.equal(outcome.rollbackPromised, false);
    assert.throws(() => cancelTask({ namedTask: "t1", wholeRun: true, wholeRunExplicitlyAsked: false }));
  });

  it("restart needs a user instruction plus a fresh session", () => {
    assert.deepEqual(restartAfterCancel(true), { fresh: true });
    assert.throws(() => restartAfterCancel(false));
  });
});

describe("F5-DS-05 handover release gate; terminal escalation band fix", () => {
  it("still-writing blocks; unconfirmable stop escalates, never silent", () => {
    assert.deepEqual(releaseOwnership(true, false), { released: true });
    assert.throws(() => releaseOwnership(false, false));
    const terminal = releaseOwnership(false, true);
    assert.ok("escalate" in terminal);
  });
});

describe("F5-DS-06 two-attempt crash budget; reconcile-first; no replay", () => {
  it("third automatic recovery refuses; confirmed actions never replay", () => {
    assert.equal(MAX_AUTO_RECOVERY_PER_TASK, 2);
    const signals = { repeatedNonProgress: false, uncertainExternalEffects: false, ownershipConflict: false };
    assert.deepEqual(decideRecovery({ attempts: 2 }, signals, [], ["retry-a"]), { escalate: "third automatic recovery refused and escalated (F5-DS-06)" });
    assert.throws(() => decideRecovery({ attempts: 0 }, signals, ["done-a"], ["done-a"]));
  });

  it("earlier escalation fires on non-progress, murky effects, or conflict", () => {
    const murky = { repeatedNonProgress: false, uncertainExternalEffects: true, ownershipConflict: false };
    const decision = decideRecovery({ attempts: 0 }, murky, [], ["retry-a"]);
    assert.ok("escalate" in decision);
  });
});

describe("F5-DS-07 rollover: envelope plus checkpoint, never transcript", () => {
  it("planned rollover carries a checkpoint without the transcript", () => {
    const checkpoint = { assignment: "a", userInstructions: [], artifacts: [], findings: [], openQuestions: [], remainingBudgets: { repair: 2 } };
    const plan = planRollover(checkpoint, true, false);
    assert.equal(plan.freshDispatch, true);
    assert.equal(plan.crashCharged, false);
    assert.throws(() => planRollover(checkpoint, false, false));
    assert.throws(() => planRollover(checkpoint, true, true));
  });

  it("mid-rollover crash charges the band-fix owner", () => {
    assert.equal(chargeMidRolloverCrash("outgoing-before-handover"), "outgoing-task");
    assert.equal(chargeMidRolloverCrash("replacement-after-dispatch"), "replacement-task");
  });

  it("budgets persist and history travels — no reset", () => {
    assert.deepEqual(persistBudgets({ repair: 1 }), { repair: 1 });
  });
});

describe("F5-DS-08 authorized-only fresh dispatch; validate-before-launch", () => {
  it("revoked or insufficient authority parks, never launch-then-validate", () => {
    assert.deepEqual(validateLaunchAuthority({ authorized: true, revoked: false }), { launch: true });
    assert.ok("parked" in validateLaunchAuthority({ authorized: false, revoked: false }));
    assert.ok("parked" in validateLaunchAuthority({ authorized: true, revoked: true }));
  });
});

describe("F5-DS-09 preservation until handback; disclose-and-ask over cap", () => {
  it("needed evidence stays until verified handback or disposition", () => {
    assert.deepEqual(preserveUntilHandback(false, false), { preserved: true });
    assert.deepEqual(preserveUntilHandback(true, false), { preserved: false });
  });

  it("protected over-cap data discloses and asks", () => {
    const over = cleanDisposable(true, true);
    assert.equal(over.cleaned, false);
    assert.match(over.disclosure ?? "", /disclose and ask/);
    assert.deepEqual(cleanDisposable(true, false), { cleaned: true });
  });
});

describe("F5-DS-10 outage blocks new delegation and recovery", () => {
  it("tracker-down refuses launches", () => {
    assert.deepEqual(guardTrackerAccess(true), { launch: true });
    assert.ok("refused" in guardTrackerAccess(false));
  });
});

describe("F5-DS-11 budgets, ceilings, and gates do not move for sessions work", () => {
  it("recovery never resets the crash budget across sessions", () => {
    assert.equal(MAX_AUTO_RECOVERY_PER_TASK, 2);
    assert.deepEqual(persistBudgets({ integration: 1 }), { integration: 1 });
  });
});

describe("F5-DS-12 envelope binding; checkpoint proves nothing until reconciled", () => {
  it("runs need the F1 revision-bound envelope", () => {
    assert.deepEqual(requireRevisionEnvelope(true), { bound: true });
    assert.throws(() => requireRevisionEnvelope(false));
  });
});
