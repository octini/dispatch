// F14 style-layer tests (F14-WS-01..09).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  STYLE_CORE,
  SANDWICH_ACCOUNTING,
  coreWordCount,
  coreInBand,
  assertSandwich,
  refuseRequiredBreach,
  admitStyleSource,
  discloseAtSessionStart,
  oneOffNote,
  setStandingPreference,
  revokeStandingPreference,
  lintProse,
  extractQuotedSpans,
  editorialGuidance,
  advanceLintRule,
  resolveInstructionConflict,
  LINT_LANGUAGE_SCOPE,
  STYLE_SCOPE,
  type LintRuleState,
} from "../style/index.js";
import { STYLE_CORE as PROMPT_CORE } from "../prompt.js";
import * as dispatcher from "../seats/dispatcher.js";
import * as writer from "../seats/writer.js";
import * as seeker from "../seats/seeker.js";
import * as expert from "../seats/expert.js";

describe("F14-WS-01 sandwiched core: verbatim 159-word text, accounting, refusal-to-park", () => {
  it("core text is the exact approved text, single-sourced and never trimmed", () => {
    assert.equal(STYLE_CORE, PROMPT_CORE);
    assert.equal(coreWordCount(), 159);
    assert.equal(coreInBand(), true);
  });

  it("TOP counts authored, BOTTOM counts exposure", () => {
    assert.deepEqual(SANDWICH_ACCOUNTING, { top: "authored", bottom: "exposure" });
  });

  it("hard breach refuses then parks — never a silent trim", () => {
    const breach = refuseRequiredBreach("over cap");
    assert.equal(breach.refused, true);
    assert.equal(breach.path, "F8-Q9 park/escalate");
    assert.match(breach.detail, /never silent trim/);
  });

  it("sandwich check needs TOP and BOTTOM instances", () => {
    assert.equal(assertSandwich(`a ${STYLE_CORE} b ${STYLE_CORE} c`), true);
    assert.equal(assertSandwich(`a ${STYLE_CORE} b`), false);
  });
});

describe("F14-WS-02 per-seat overlays derive from the seat configs (single-source)", () => {
  it("each seat carries its thin overlay and the prompt assembles it", () => {
    for (const seat of [dispatcher, writer, seeker, expert]) {
      assert.ok(seat.styleOverlay.length > 0, `${seat.id} overlay missing`);
    }
    assert.match(dispatcher.styleOverlay, /next step/);
    assert.match(writer.styleOverlay, /file:line/);
    assert.match(seeker.styleOverlay, /source/i);
    assert.match(expert.styleOverlay, /cold-read/);
  });
});

describe("F14-WS-03 detective lint with promotion ladder, English-only", () => {
  it("mechanical findings report only pre-promotion", () => {
    const findings = lintProse("This plan leverages seamless synergy. Great question indeed here.", []);
    assert.ok(findings.length > 0);
    assert.ok(findings.every((f) => f.reportOnly));
  });

  it("a signed rule with pilot evidence blocks; never sooner", () => {
    let state: LintRuleState = "proposed";
    state = advanceLintRule(state, { pilotEvidence: true, userSignoff: false });
    assert.equal(state, "piloted");
    state = advanceLintRule(state, { pilotEvidence: true, userSignoff: true });
    assert.equal(state, "user-signed");
    state = advanceLintRule(state, { pilotEvidence: true, userSignoff: true });
    assert.equal(state, "blocking");
    const findings = lintProse("This leverages synergy badly.", [], "blocking");
    assert.equal(findings.every((f) => !f.reportOnly), true);
  });

  it("mechanical lint is English-only (named limitation)", () => {
    assert.match(LINT_LANGUAGE_SCOPE, /English-only/);
  });

  it("long sentences and oversized lists flag", () => {
    const long = `word ${"padding ".repeat(30)}end.`;
    assert.ok(lintProse(long, []).some((f) => f.rule === "length-cap"));
    const list = Array.from({ length: 7 }, (_, i) => `- item ${i}`).join("\n");
    assert.ok(lintProse(list, []).some((f) => f.rule === "list-cap"));
  });
});

describe("F14-WS-04 verbatim carve-out: quotes never restyled", () => {
  it("rule-breaking text inside quotes never triggers when carved", () => {
    const text = `The error reads "leverage the seamless thing" verbatim.`;
    const carved = extractQuotedSpans(text);
    assert.deepEqual(lintProse(text, carved), []);
    assert.ok(lintProse(text, []).length > 0);
  });
});

describe("F14-WS-05 never-compress carve-out: safety spans stay complete", () => {
  it("caller-marked safety spans never trigger findings", () => {
    const text = "Auth check: leverage the token seamless flow.";
    const carved = [{ start: 0, end: text.length }];
    assert.deepEqual(lintProse(text, carved), []);
  });
});

describe("F14-WS-06 explicit-instruction override + Orwell escape hatch, disclosed", () => {
  it("explicit disclosed instruction outranks a signed rule for that output; finding still records", () => {
    const resolved = resolveInstructionConflict({ explicitUserInstruction: true, disclosed: true });
    assert.deepEqual(resolved, { suppressed: true, recorded: true, reviewGateFailure: false });
  });

  it("undisclosed breaks fail the review-gate check", () => {
    const resolved = resolveInstructionConflict({ explicitUserInstruction: true, disclosed: false });
    assert.equal(resolved.reviewGateFailure, true);
  });

  it("Orwell escape hatch rides the core with disclosure", () => {
    assert.match(STYLE_CORE, /barbarous/);
    assert.match(STYLE_CORE, /Disclose the break/);
  });
});

describe("F14-WS-07 license-gated source reuse", () => {
  it("unverified sources stay idea-level; verified-permissive sources adapt", () => {
    assert.deepEqual(admitStyleSource(false), { reuse: "idea-level" });
    assert.deepEqual(admitStyleSource(true), { reuse: "adapted" });
  });
});

describe("F14-WS-08 review-gate style check rides the cold read", () => {
  it("editorial guidance is advisory and never blocks", () => {
    for (const note of editorialGuidance("The plan was written by the team. Lead well.")) {
      assert.equal(note.blocking, false);
    }
  });
});

describe("F14-WS-09 standing vs one-off preferences; one style overall", () => {
  it("standing prefs disclose once at session start and on change, never per output", () => {
    let prefs = setStandingPreference([], "short lines", "user");
    assert.deepEqual(discloseAtSessionStart(prefs), ["standing style preference: short lines"]);
    prefs = revokeStandingPreference(prefs, "short lines", "user");
    assert.deepEqual(discloseAtSessionStart(prefs), []);
  });

  it("one-off overrides carry an in-output note", () => {
    assert.match(oneOffNote({ kind: "one-off", text: "formal tone", revoked: false }), /this output only/);
  });

  it("only the user manages standing preferences; one style for chat and files", () => {
    assert.throws(() => setStandingPreference([], "x", "dispatcher" as never));
    assert.match(STYLE_SCOPE, /One style overall/);
  });
});
