// F15 review-gate hook tests (F15-RD-05/06): cold read at every review with
// designated reviews routed to the F16 council; detector-first promotion ladder.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  advancePromotion,
  runReviewGate,
  type PromotionState,
} from "../claims/review-gate.js";

const UNSOURCED = "The plugin targets pi v0.87.1 with no source.";

describe("F15-RD-05 review-gate cold read at every review", () => {
  it("routine reviews cold-read via Expert solo, non-blocking pre-promotion", () => {
    const result = runReviewGate({ kind: "routine", output: UNSOURCED, caseId: "c1", promotion: "proposed" });
    assert.equal(result.routedTo, "expert-solo");
    assert.equal(result.findings.length, 1);
    assert.equal(result.blocking, false);
  });

  it("designated reviews route the hook to the F16 council", () => {
    const result = runReviewGate({
      kind: "designated",
      output: UNSOURCED,
      caseId: "c2",
      promotion: "proposed",
      council: { conveneDesignated: (r) => ({ convened: true, caseId: r.caseId }) },
    });
    assert.equal(result.routedTo, "council");
    assert.deepEqual(result.council, { convened: true, caseId: "c2" });
  });

  it("designated review without a council route refuses", () => {
    assert.throws(() => runReviewGate({ kind: "designated", output: UNSOURCED, caseId: "c3", promotion: "proposed" }));
  });
});

describe("F15-RD-06 promotion ladder: detector-first, pilot plus sign-off", () => {
  it("each rule climbs proposed to piloted to user-signed to blocking", () => {
    let state: PromotionState = "proposed";
    state = advancePromotion(state, { pilotEvidence: true, userSignoff: false });
    assert.equal(state, "piloted");
    state = advancePromotion(state, { pilotEvidence: false, userSignoff: true });
    assert.equal(state, "user-signed");
    state = advancePromotion(state, { pilotEvidence: true, userSignoff: true });
    assert.equal(state, "blocking");
  });

  it("blocking needs the promoted rule to fire; clean output never blocks", () => {
    const fired = runReviewGate({ kind: "routine", output: UNSOURCED, caseId: "c4", promotion: "blocking" });
    assert.equal(fired.blocking, true);
    const clean = runReviewGate({ kind: "routine", output: "I will check the file next.", caseId: "c5", promotion: "blocking" });
    assert.equal(clean.blocking, false);
  });

  it("without both legs a firing rule still reports only", () => {
    for (const promotion of ["proposed", "piloted", "user-signed"] as PromotionState[]) {
      const result = runReviewGate({ kind: "routine", output: UNSOURCED, caseId: promotion, promotion });
      assert.equal(result.findings.length, 1);
      assert.equal(result.blocking, false);
    }
  });
});
