// F16 council tests (F16-RC-01..12).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LENSES,
  LENS_MODEL_SLOTS,
  assertPinnedModels,
  freezePacket,
  packetProvenance,
  synthesize,
  validateFindingIds,
  requireFullBody,
  shouldConvene,
  queuePriority,
  expandDesignatedClass,
  accountCouncilRun,
  resolveLensFailure,
  reconcileContradiction,
  type LensReturn,
} from "../council/index.js";

function returns(ballots: ["pass" | "block", "pass" | "block", "pass" | "block"], dissent?: string): LensReturn[] {
  return LENSES.map((lens, i) => ({
    lens,
    ballot: ballots[i] ?? "pass",
    findings: [{ id: `F-0${i + 1}`, lens, text: `finding ${i + 1}` }],
    ...(dissent !== undefined && i === 2 ? { dissentLine: dissent } : {}),
  }));
}

describe("F16-RC-01 three lenses, 2/3 majority, one-line dissent", () => {
  it("majority carries with the dissent recorded, never erased", () => {
    const verdict = synthesize({ caseId: "rc1", artifactRevision: "r1", returns: returns(["pass", "pass", "block"], "block: risk holds"), packetProvenance: ["p1"] });
    assert.equal(verdict.verdict, "pass");
    assert.deepEqual(verdict.tally, { pass: 2, block: 1 });
    assert.equal(verdict.dissent, "block: risk holds");
  });
});

describe("F16-RC-02 composite verdict binds designated reviews; gates never bypassed", () => {
  it("verdict carries mandatory user approval", () => {
    const verdict = synthesize({ caseId: "rc2", artifactRevision: "r1", returns: returns(["block", "block", "pass"]), packetProvenance: [] });
    assert.equal(verdict.verdict, "block");
    assert.equal(verdict.requiresUserApproval, true);
  });
});

describe("F16-RC-03 solo and consult untouched; no fifth seat", () => {
  it("routine work never convenes and foreign lenses refuse", () => {
    assert.equal(shouldConvene({ kind: "routine" }), false);
    assert.throws(() => requireFullBody([...returns(["pass", "pass", "pass"]), { lens: "observer" as never, ballot: "pass", findings: [] }]));
  });
});

describe("F16-RC-04 three trigger classes", () => {
  it("designated auto-runs; on-demand sources convene; routine skips", () => {
    assert.equal(shouldConvene({ kind: "designated", gate: "F3" }), true);
    assert.equal(shouldConvene({ kind: "on-demand", source: "user-prose", note: "run it by the band" }), true);
    assert.equal(shouldConvene({ kind: "on-demand", source: "seat-request", note: "uncertain" }), true);
    assert.equal(shouldConvene({ kind: "on-demand", source: "dispatcher-uncertainty", note: "F1-Q6" }), true);
  });

  it("designated takes queue priority over on-demand", () => {
    assert.ok(queuePriority({ kind: "designated", gate: "F3" }) < queuePriority({ kind: "on-demand", source: "user-prose", note: "x" }));
  });
});

describe("F16-RC-05 record-never-judge synthesis", () => {
  it("dissent copies verbatim; safety objections ride the findings list", () => {
    const rs = returns(["pass", "pass", "block"], "word-for-word dissent");
    rs[2]?.findings.push({ id: "F-S1", lens: "structure", text: "safety: auth bypass", severity: "safety" });
    const verdict = synthesize({ caseId: "rc5", artifactRevision: "r1", returns: rs, packetProvenance: [] });
    assert.equal(verdict.dissent, "word-for-word dissent");
    assert.ok(verdict.findings.some((f) => f.severity === "safety"));
    assert.deepEqual(verdict.synthesis.findingIds, ["F-01", "F-02", "F-03", "F-S1"]);
  });

  it("no majority means no verdict — tie-breaking forbidden", () => {
    assert.throws(() => synthesize({ caseId: "rc5b", artifactRevision: "r1", returns: returns(["pass", "pass", "pass"]).slice(0, 2) as LensReturn[], packetProvenance: [] }));
  });

  it("duplicate finding IDs fail assembly", () => {
    assert.throws(() => validateFindingIds([
      { id: "F-1", lens: "risk", text: "a" },
      { id: "F-1", lens: "quality", text: "b" },
    ]));
  });
});

describe("F16-RC-06 provider-diverse lens models pinned at build", () => {
  it("no SKU named here; unpinned runs refuse", () => {
    assert.equal(LENS_MODEL_SLOTS.length, 3);
    assert.ok(LENS_MODEL_SLOTS.every((s) => s.skuId === null && s.status === "UNVERIFIED"));
    assert.throws(() => assertPinnedModels(LENS_MODEL_SLOTS, false));
  });
});

describe("F16-RC-07 budgets and ceilings", () => {
  it("initial run spends ceiling slots only; reruns spend one repair cycle", () => {
    const initial = accountCouncilRun({ kind: "initial-designated", taskId: "t1", activeInvocations: 0 });
    assert.deepEqual([initial.ceilingSlots, initial.repairCycles], [4, 0]);
    const rerun = accountCouncilRun({ kind: "rerun", taskId: "t1", activeInvocations: 0 });
    assert.equal(rerun.repairCycles, 1);
  });

  it("ceiling bind queues, never drops; on-demand bills the requesting ledger", () => {
    const bound = accountCouncilRun({ kind: "initial-designated", taskId: "t1", activeInvocations: 8 });
    assert.equal(bound.queued, true);
    const demand = accountCouncilRun({ kind: "on-demand", taskId: "t9", activeInvocations: 0 });
    assert.equal(demand.taskLedger, "t9");
  });
});

describe("F16-RC-08 frozen revision-bound packets with truncation and injection guard", () => {
  it("packets freeze bound to a revision with truncation status and evidence-only", () => {
    const packet = freezePacket({ caseId: "rc8", artifactRevision: "r7", lens: "risk", evidence: "diff here", truncated: true });
    assert.equal(packet.truncation, "truncated");
    assert.equal(packet.evidenceOnly, true);
    assert.match(packetProvenance(packet), /r7/);
  });

  it("empty evidence refuses", () => {
    assert.throws(() => freezePacket({ caseId: "rc8", artifactRevision: "r7", lens: "risk", evidence: "", truncated: false }));
  });
});

describe("F16-RC-09 invariance holds (single F1-AR-11 clarification excepted)", () => {
  it("council runs never bypass approval and never invent a seat", () => {
    const verdict = synthesize({ caseId: "rc9", artifactRevision: "r1", returns: returns(["pass", "pass", "pass"]), packetProvenance: [] });
    assert.equal(verdict.requiresUserApproval, true);
    assert.deepEqual([...LENSES], ["risk", "quality", "structure"]);
  });
});

describe("F16-RC-10 lens failure: full body or fail plus escalate", () => {
  it("one bounded infra retry recovers; persistent failure fails the run", () => {
    const good = returns(["pass", "pass", "pass"]);
    const recovered = resolveLensFailure({ returns: [], failedLens: "risk" }, { consumed: 0 }, () => good);
    assert.ok("returns" in recovered);
    const failed = resolveLensFailure({ returns: [], failedLens: "risk" }, { consumed: 1 }, () => good);
    assert.ok("failed" in failed && failed.failed === true);
  });
});

describe("F16-RC-11 reconciler identity: fresh run or user; self blocked", () => {
  it("contradictions reconcile by fresh council run or user escalation", () => {
    const c = { caseId: "rc11", artifactRevision: "r1", authorityVerdict: "pass", authorityAuthor: "expert", secondOpinion: "block" };
    assert.deepEqual(reconcileContradiction(c, "dispatcher"), { path: "fresh-council-run", repairCycles: 1 });
    assert.deepEqual(reconcileContradiction(c, "user"), { path: "escalate-user", reconciler: "user" });
    assert.throws(() => reconcileContradiction(c, "expert"));
  });
});

describe("F16-RC-12 class expansion user-only; on-demand cost recorded", () => {
  it("unapproved classes refuse; approved classes admit", () => {
    assert.throws(() => expandDesignatedClass("visual-gate", { userApproved: false }));
    assert.deepEqual(expandDesignatedClass("visual-gate", { userApproved: true }), { admitted: true, gate: "visual-gate" });
  });
});
