// V1 release gate tests (PRIMARY-SPEC section 8; F13-VH-05/01; PS-SEAM-07; PS-GATE-08).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkObjectiveFloor,
  checkPinRecord,
  currentPinRecord,
  isPinOpen,
  releaseGate,
  type PinRecordInput,
  type ReleaseGateInput,
} from "../release/index.js";

function pins(over: Partial<PinRecordInput> = {}): PinRecordInput {
  return {
    lockTtl: "60s",
    parkDeadline: "24h",
    stalenessMaxAge: "7d",
    snippetBound: "280",
    freshnessWindow: "15m",
    lensSkus: "pinned-skus",
    tokenizer: "pinned-tokenizer",
    ...over,
  };
}

function input(over: Partial<ReleaseGateInput> = {}): ReleaseGateInput {
  return {
    pins: pins(),
    unexplainedRollbacks: 0,
    refusalStringsAsSignedOff: true,
    lanes: { "windows-latest": "green", "macos-latest": "green" },
    agplReviewSigned: true,
    rollbackMechanicsDone: true,
    sSuiteRegreen: true,
    userSignedOff: true,
    ...over,
  };
}

describe("pin record: the gate CHECKS pins, never fills them", () => {
  it("a complete pin record passes the check", () => {
    assert.equal(checkPinRecord(pins()).complete, true);
  });

  it("any UNVERIFIED pin blocks that leg", () => {
    for (const key of ["lockTtl", "parkDeadline", "stalenessMaxAge", "snippetBound", "freshnessWindow", "lensSkus", "tokenizer"] as const) {
      const out = checkPinRecord(pins({ [key]: "UNVERIFIED" }));
      assert.equal(out.complete, false);
      assert.ok(out.missing.includes(key), key);
    }
  });

  it("the build-pin five read pinned here (lens + tokenizer stay open) and the gate never mutates the record", () => {
    const current = currentPinRecord();
    assert.equal(isPinOpen(current.lockTtl), false);
    assert.equal(isPinOpen(current.parkDeadline), false);
    assert.equal(isPinOpen(current.stalenessMaxAge), false);
    assert.equal(isPinOpen(current.snippetBound), false);
    assert.equal(isPinOpen(current.freshnessWindow), false);
    assert.equal(isPinOpen(current.lensSkus), true);
    assert.equal(isPinOpen(current.tokenizer), true);
    const before = { ...current };
    checkPinRecord(current);
    releaseGate(input({ pins: current }));
    assert.deepEqual(current, before);
  });
});

describe("objective floor (F13-VH-05/01)", () => {
  it("zero unexplained rollbacks, signed-off strings, both OSes green", () => {
    assert.equal(releaseGate(input()).verdict, "ship");
  });

  it("an unexplained rollback blocks", () => {
    const out = releaseGate(input({ unexplainedRollbacks: 1 }));
    assert.equal(out.verdict, "blocked");
    assert.ok(out.reasons.some((r) => r.includes("zero unexplained rollbacks")));
  });

  it("a deviating refusal-string sample blocks", () => {
    assert.equal(releaseGate(input({ refusalStringsAsSignedOff: false })).verdict, "blocked");
  });

  it("a red lane on EITHER OS blocks", () => {
    assert.equal(releaseGate(input({ lanes: { "windows-latest": "green", "macos-latest": "red" } })).verdict, "blocked");
    assert.equal(releaseGate(input({ lanes: { "windows-latest": "red", "macos-latest": "green" } })).verdict, "blocked");
  });

  it("the gate checks the floor through the imported harness bar (VH-05/01)", () => {
    const floor = { unexplainedRollbacks: 0, refusalStringsAsSignedOff: true, lanes: { "windows-latest": "green", "macos-latest": "green" } as const };
    assert.equal(checkObjectiveFloor({ ...floor, lanes: { ...floor.lanes } }).pass, true);
    assert.equal(checkObjectiveFloor({ ...floor, lanes: { ...floor.lanes }, unexplainedRollbacks: 1 }).pass, false);
    assert.equal(checkObjectiveFloor({ ...floor, lanes: { ...floor.lanes }, refusalStringsAsSignedOff: false }).pass, false);
    assert.equal(checkObjectiveFloor({ ...floor, lanes: { "windows-latest": "green", "macos-latest": "red" } }).pass, false);
    const blocked = releaseGate(input({ unexplainedRollbacks: 1 }));
    assert.equal(blocked.verdict, "blocked");
    assert.ok(blocked.reasons.some((r) => r.includes("pilotExitBar")));
  });
});

describe("ship blockers (PS-SEAM-07; F13-VH-08; S-suite; sign-off)", () => {
  it("v1 cannot ship without the user-signed AGPL boundary review", () => {
    const out = releaseGate(input({ agplReviewSigned: false }));
    assert.equal(out.verdict, "blocked");
    assert.ok(out.reasons.some((r) => r.includes("AGPL")));
  });

  it("incomplete rollback mechanics block", () => {
    assert.equal(releaseGate(input({ rollbackMechanicsDone: false })).verdict, "blocked");
  });

  it("a missing S-suite regression re-green blocks", () => {
    assert.equal(releaseGate(input({ sSuiteRegreen: false })).verdict, "blocked");
  });

  it("exit without user sign-off blocks even when the floor holds", () => {
    assert.equal(releaseGate(input({ userSignedOff: false })).verdict, "blocked");
  });

  it("an incomplete pin record blocks shipment", () => {
    const out = releaseGate(input({ pins: pins({ lensSkus: "UNVERIFIED" }) }));
    assert.equal(out.verdict, "blocked");
    assert.ok(out.reasons.some((r) => r.includes("lensSkus")));
  });

  it("reasons name every missing leg", () => {
    const out = releaseGate(input({ unexplainedRollbacks: 2, agplReviewSigned: false, userSignedOff: false }));
    assert.equal(out.verdict, "blocked");
    assert.equal(out.reasons.length, 3);
  });
});
