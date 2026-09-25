// F13 harness + S-suite tests (F13-VH-01 … F13-VH-11).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CI_LANES,
  GAODES_SCOPE,
  HARNESS_PINNED_VERSION,
  HARNESS_SHA_PIN,
  S_SUITE,
  S_SUITE_NAMES,
  WATCHED_METRICS,
  admitFallback,
  bothLanesGreen,
  checkCoverage,
  checkRepin,
  checkSignedString,
  draftProcedure,
  pilotEntryGate,
  pilotExitBar,
  recordCounters,
  reentryGate,
  rollback,
  rollbackVerdict,
  type WatchedMetric,
} from "../harness/index.js";

function allRecorded(): Record<WatchedMetric, boolean> {
  return Object.fromEntries(WATCHED_METRICS.map((m) => [m, true])) as Record<WatchedMetric, boolean>;
}

describe("harness pin + spec-phase re-pin (F13-VH-10)", () => {
  it("the pinned harness is @marcfargas/pi-test-harness 0.6.1; the SHA stays UNVERIFIED here", () => {
    assert.equal(HARNESS_PINNED_VERSION, "0.6.1");
    assert.equal(HARNESS_SHA_PIN, "UNVERIFIED");
  });

  it("exact version + SHA + drift disclosure records", () => {
    const out = checkRepin({ version: "0.6.1", sha: "b99b1944e4421eedddc25201f93116bbff76af21", driftDisclosure: "HEAD equals the pin record: no drift" });
    assert.equal(out.verdict, "recorded");
  });

  it("undisclosed drift is a coverage violation", () => {
    assert.equal(checkRepin({ version: "0.6.1", sha: "UNVERIFIED", driftDisclosure: "" }).verdict, "coverage-violation");
    assert.equal(checkRepin({ version: "0.6.1", sha: "abc", driftDisclosure: "  " }).verdict, "coverage-violation");
  });
});

describe("substitution boundary: gaodes fallback-only, verify-then-admit (F13-VH-09)", () => {
  it("the fork stays fallback-only", () => {
    assert.equal(GAODES_SCOPE, "fallback-only");
  });

  it("verified provenance admits the fallback", () => {
    const out = admitFallback({ commit: "c", scope: "s" }, { commitVerifiable: true, scopeWithinPin: true, sourceReachable: true });
    assert.equal(out.admitted, true);
  });

  it("provenance failure drops the fallback to primary-only", () => {
    for (const p of [
      { commitVerifiable: false, scopeWithinPin: true, sourceReachable: true },
      { commitVerifiable: true, scopeWithinPin: false, sourceReachable: true },
      { commitVerifiable: true, scopeWithinPin: true, sourceReachable: false },
    ]) {
      assert.equal(admitFallback({ commit: "c", scope: "s" }, p).admitted, false);
    }
  });
});

describe("two CI lanes: Windows AND macOS green in v1 (F13-VH-01)", () => {
  it("both lanes ship in v1", () => {
    assert.deepEqual([...CI_LANES], ["windows-latest", "macos-latest"]);
  });

  it("both green passes; a missing or red macOS lane blocks exactly as Windows does", () => {
    assert.equal(bothLanesGreen({ "windows-latest": "green", "macos-latest": "green" }).pass, true);
    assert.equal(bothLanesGreen({ "windows-latest": "green", "macos-latest": "red" }).pass, false);
    assert.equal(bothLanesGreen({ "windows-latest": "green", "macos-latest": "missing" }).pass, false);
    assert.equal(bothLanesGreen({ "windows-latest": "red", "macos-latest": "green" }).pass, false);
  });
});

describe("S-suite mapping + requirement-complete coverage (F13-VH-02/03; PS-SEAM-13)", () => {
  it("the suite names the 13 S-scenarios incl. S9a/b/c", () => {
    assert.equal(S_SUITE.length, 13);
    assert.ok(S_SUITE.includes("S9a") && S_SUITE.includes("S9b") && S_SUITE.includes("S9c"));
    assert.equal(S_SUITE_NAMES["S11"], "zero-web disclosure");
  });

  it("procedure drafts record only once reviewed, never self-certifying", () => {
    assert.equal(draftProcedure({ scenario: "S7", setup: "s", action: "a", assertion: "r", reviewed: false }).recorded, false);
    assert.equal(draftProcedure({ scenario: "S7", setup: "s", action: "a", assertion: "r", reviewed: true }).recorded, true);
  });

  it("every requirement ID maps to >=1 suite item or matrix row", () => {
    const out = checkCoverage([
      { requirementId: "F6-PD-04", control: "preventive", adversarialScenario: "P6-05", targets: [{ kind: "suite-item", item: "S-staging" }] },
      { requirementId: "F13-VH-12", control: "detective", adversarialScenario: null, targets: [{ kind: "acceptance-matrix-row", row: "P13-18" }] },
    ]);
    assert.equal(out.pass, true);
  });

  it("an orphan ID or a preventive control with no adversarial scenario blocks", () => {
    const orphan = checkCoverage([{ requirementId: "F6-PD-04", control: "preventive", adversarialScenario: "P6-05", targets: [] }]);
    assert.equal(orphan.pass, false);
    const noAdversarial = checkCoverage([{ requirementId: "F6-PD-04", control: "preventive", adversarialScenario: null, targets: [{ kind: "suite-item", item: "x" }] }]);
    assert.equal(noAdversarial.pass, false);
    assert.ok(noAdversarial.violations.some((v) => v.includes("no adversarial scenario")));
  });
});

describe("pilot protocol: synthetic-then-supervised entry + exit (F13-VH-04/05)", () => {
  it("entry needs all-green plus approval plus sign-off at ONE checkpoint", () => {
    assert.equal(pilotEntryGate({ lanesGreenBoth: true, sSuiteGreenBoth: true, userApproved: true, verbatimSignedOff: true }).enter, true);
    assert.equal(pilotEntryGate({ lanesGreenBoth: true, sSuiteGreenBoth: false, userApproved: true, verbatimSignedOff: true }).enter, false);
    assert.equal(pilotEntryGate({ lanesGreenBoth: true, sSuiteGreenBoth: true, userApproved: false, verbatimSignedOff: true }).enter, false);
    assert.equal(pilotEntryGate({ lanesGreenBoth: true, sSuiteGreenBoth: true, userApproved: true, verbatimSignedOff: false }).enter, false);
  });

  it("exit needs the objective floor plus sign-off; no numeric thresholds consulted", () => {
    const base = { metricsRecorded: allRecorded(), unexplainedRollbacks: 0, stringsAsSignedOff: true, userSignedOff: true };
    assert.equal(pilotExitBar(base).exit, true);
    assert.equal(pilotExitBar({ ...base, userSignedOff: false }).exit, false);
    assert.equal(pilotExitBar({ ...base, unexplainedRollbacks: 1 }).exit, false);
    assert.equal(pilotExitBar({ ...base, stringsAsSignedOff: false }).exit, false);
    assert.equal(
      pilotExitBar({ ...base, metricsRecorded: { ...allRecorded(), "repeat-call-canary": false } }).exit,
      false,
    );
  });
});

describe("rollback + re-entry (F13-VH-08)", () => {
  it("rollback flips to harness-only, revokes grants, preserves ledgers", () => {
    const done = rollback({ mode: "supervised", grantsRevoked: false, ledgersPreserved: false });
    assert.deepEqual(done, { mode: "harness-only", grantsRevoked: true, ledgersPreserved: true });
    assert.equal(rollbackVerdict(done).done, true);
    assert.equal(rollbackVerdict({ mode: "supervised", grantsRevoked: false, ledgersPreserved: false }).done, false);
  });

  it("re-entry without reproduced-green is BLOCKED", () => {
    assert.equal(reentryGate(false).enter, false);
    assert.equal(reentryGate(true).enter, true);
  });
});

describe("tamper-evident ledger shapes: signed-string binding at both gates (F13-VH-11)", () => {
  it("match-or-block at spec review AND pre-pilot", () => {
    assert.equal(checkSignedString({ text: "a", gate: "spec-review", signedOffText: "a" }).pass, true);
    assert.equal(checkSignedString({ text: "a", gate: "spec-review", signedOffText: "b" }).pass, false);
    assert.equal(checkSignedString({ text: "a", gate: "pre-pilot", signedOffText: "b" }).pass, false);
  });
});

describe("record-only falsifiers (F13-VH-06/07)", () => {
  it("low counters gate nothing: exit, rollback, and re-entry proceed on their own rules", () => {
    const out = recordCounters({
      tierVsPassRate: {
        "plan-shaped": { tasks: 40, firstPassRate: "low" },
        "judgment-heavy": { tasks: 12, firstPassRate: "low" },
      },
      resumeHitRate: { hits: 0, decisions: 30 },
    });
    assert.equal(out.recorded, true);
    assert.equal(out.gates, "none");
  });
});
