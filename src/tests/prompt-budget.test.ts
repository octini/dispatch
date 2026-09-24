// Prompt-assembly budget asserts (F8-Q7, F12-Q7, F14-WS-01, F15-RD-03, F8-Q9).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Named-open paths stay explicit: the Writer grant-ask
// wiring (F2-PE-08), the Seeker shell matrix sign-off, the Pi hook live
// wiring. Those unbuilt paths are untestable until their probes land.
// Exposure-bound record (band re-check, unanimous): The exposure budget (the lazy skill bodies + tool schemas + injected policy + handoff material per F8-PS-09) is a CONFIGURABLE BOUND — the default pins at build (section 7); the breach path is enforced now: the F8-Q9 trim order (evidence, then skill-meta) then park/escalate — never unbounded, never silent.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildPromptCore,
  buildReinjectionSet,
  countOccurrences,
  estimateTokens_UNVERIFIED,
  loadSkillBody,
  skillIndexFor,
  CLAIM_RULE,
  STYLE_CORE,
  PROMPT_CORE_HARD_CAP,
  PROMPT_CORE_TARGET,
} from "../prompt.js";
import * as dispatcher from "../seats/dispatcher.js";
import * as writer from "../seats/writer.js";
import * as seeker from "../seats/seeker.js";
import * as expert from "../seats/expert.js";
import type { SeatId } from "../config.js";

const SEATS: SeatId[] = ["dispatcher", "writer", "seeker", "expert"];
const POINTER = "dispatch-spec rev test-1";

describe("prompt core budget", () => {
  for (const seat of SEATS) {
    it(`${seat}: core within hard cap, never refused`, () => {
      const result = buildPromptCore({ seat, livingSpecPointer: POINTER });
      assert.equal(result.refused, false);
      assert.ok(result.coreTokens <= PROMPT_CORE_HARD_CAP, `core ${result.coreTokens} exceeds ${PROMPT_CORE_HARD_CAP}`);
    });

    it(`${seat}: claim rule counted exactly once`, () => {
      const result = buildPromptCore({ seat, livingSpecPointer: POINTER });
      assert.equal(result.claimCount, 1);
      assert.equal(countOccurrences(result.prompt, CLAIM_RULE), 1);
    });

    it(`${seat}: style core sandwiched top and bottom`, () => {
      const result = buildPromptCore({ seat, livingSpecPointer: POINTER });
      assert.equal(countOccurrences(result.prompt, STYLE_CORE), 2);
    });
  }

  it("re-injection set holds exactly three items", () => {
    assert.equal(buildReinjectionSet("writer", POINTER).length, 3);
  });

  it("overflowing optional evidence trims with disclosure; style core survives", () => {
    const big = Array.from({ length: 60 }, (_, i) => `evidence line ${i} with padding words to spend budget fast and force a trim under pressure now`);
    const result = buildPromptCore({ seat: "writer", livingSpecPointer: POINTER, optionalEvidence: big });
    assert.equal(result.refused, false);
    assert.ok(result.warnings.length > 0, "expected a trim disclosure");
    assert.equal(countOccurrences(result.prompt, STYLE_CORE), 2);
    assert.equal(countOccurrences(result.prompt, CLAIM_RULE), 1);
    assert.ok(result.coreTokens <= PROMPT_CORE_HARD_CAP);
  });

  it("joint required-content overage refuses the build, never silently trims", () => {
    const huge = `spec ${"padding ".repeat(1200)}`;
    const result = buildPromptCore({ seat: "writer", livingSpecPointer: huge });
    assert.equal(result.refused, true);
    assert.equal(result.prompt, "");
    assert.ok(result.warnings.some((w) => w.startsWith("REFUSED")));
  });

  it("500 target state is disclosed either way", () => {
    const result = buildPromptCore({ seat: "writer", livingSpecPointer: POINTER });
    if (result.coreTokens > PROMPT_CORE_TARGET) assert.ok(result.warnings.length > 0);
    else assert.equal(result.warnings.length, 0);
  });

  it("assembled string over the cap refuses even when each ledger fits alone (FIND-2)", () => {
    // Sweep the living-spec pointer so required-alone fits the cap while the
    // final assembled string (required + bottom style copy) overflows it.
    let sawAssembledRefusal = false;
    for (let pad = 400; pad <= 900; pad += 25) {
      const pointer = `spec ${"padding ".repeat(pad)}`;
      const result = buildPromptCore({ seat: "writer", livingSpecPointer: pointer });
      if (result.warnings.some((w) => w.startsWith("REFUSED: assembled"))) {
        assert.equal(result.refused, true);
        assert.equal(result.prompt, "");
        sawAssembledRefusal = true;
        break;
      }
      if (result.warnings.some((w) => w.startsWith("REFUSED: required"))) break;
    }
    assert.ok(sawAssembledRefusal, "expected an assembled-string refusal inside the sweep");
  });

  it("pinned-tokenizer undercount refuses instead of silently trimming (PS-GATE-08 migration)", () => {
    // The whitespace placeholder is UNVERIFIED and stays the declared unit.
    const base = buildPromptCore({ seat: "writer", livingSpecPointer: POINTER });
    assert.equal(base.refused, false);
    assert.ok(base.coreTokens <= PROMPT_CORE_HARD_CAP);
    // The pinned tokenizer counts the same required text higher: refuse.
    const migrated = buildPromptCore({
      seat: "writer",
      livingSpecPointer: POINTER,
      pinnedTokens_UNVERIFIED: PROMPT_CORE_HARD_CAP + 1,
    });
    assert.equal(migrated.refused, true);
    assert.equal(migrated.prompt, "");
    assert.ok(migrated.warnings.some((w) => w.startsWith("REFUSED")));
  });

  it("every non-refused prompt fits the assembled cap", () => {
    const result = buildPromptCore({ seat: "writer", livingSpecPointer: POINTER });
    assert.equal(result.refused, false);
    assert.ok(estimateTokens_UNVERIFIED(result.prompt) <= PROMPT_CORE_HARD_CAP);
  });
});

describe("exposure bound (band re-check)", () => {
  it("test-configured bound breach fires the trim/park path; lazy bodies never run unbounded", () => {
    const bodies = [`${loadSkillBody("tdd").body} ${"padding ".repeat(200)}`];
    const result = buildPromptCore({
      seat: "writer",
      livingSpecPointer: POINTER,
      exposureBodies: bodies,
      exposureBoundForTest: 10,
    });
    assert.equal(result.refused, true);
    assert.equal(result.prompt, "");
    assert.ok(
      result.warnings.some((w) => w.includes("PARKED") && w.includes("trim/park")),
      "expected a trim/park disclosure",
    );
    assert.ok(!result.prompt.includes("lazy body"), "lazy bodies never run unbounded");
  });

  it("exposure within a test-configured bound assembles with bodies on the ledger", () => {
    const bodies = [loadSkillBody("tdd").body];
    const base = buildPromptCore({ seat: "writer", livingSpecPointer: POINTER });
    assert.equal(base.refused, false);
    const result = buildPromptCore({
      seat: "writer",
      livingSpecPointer: POINTER,
      exposureBodies: bodies,
      exposureBoundForTest: 100000,
    });
    assert.equal(result.refused, false);
    assert.ok(result.exposureTokens > base.exposureTokens, "bodies charge the exposure ledger");
  });
});

describe("skill index", () => {
  it("seat-filtered metadata; verify-before-claim on every seat", () => {
    for (const seat of SEATS) {
      const names = skillIndexFor(seat).map((s) => s.name);
      assert.ok(names.includes("verify-before-claim"), `${seat} misses verify-before-claim`);
      assert.ok(!names.includes("wizard"), "wizard is human-only, never a seat skill");
    }
    const d = skillIndexFor("dispatcher").map((s) => s.name);
    assert.ok(!d.includes("tdd"), "dispatcher carries no writer skill");
    assert.ok(!skillIndexFor("writer").map((s) => s.name).includes("grilling"));
  });

  it("skill bodies lazy-load onto the exposure budget", () => {
    const loaded = loadSkillBody("tdd");
    assert.equal(loaded.budget, "exposure");
    assert.throws(() => loadSkillBody("no-such-skill"));
  });

  it("retrieval tools list first in every seat toolset", () => {
    for (const mod of [dispatcher, writer, seeker, expert]) {
      const firstNonRetrieval = mod.tools.findIndex((t) => t.kind !== "retrieval");
      const lastRetrieval = mod.tools.map((t) => t.kind).lastIndexOf("retrieval");
      assert.ok(lastRetrieval < firstNonRetrieval, `${mod.id}: retrieval tools not first`);
    }
  });
});
