// Claim/cite-rule tests (F15-RD-01/02/04/05/06/07; F8-PS-13).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. The detector is heuristic and English-first (named
// limitation); semantic judgment rides the review-gate cold read.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DETECTOR_LANGUAGE_SCOPE,
  DETECTOR_LANGUAGE_SCOPE_PIN,
  FRESH_FACT_CATEGORIES,
  SOURCE_NOT_CARRIED_DISCLOSURE,
  carrySourcesStrict,
  checkSkillText,
  citedClaimsWithSources,
  classifyAttribution,
  createReviewGateHook,
  detectClaims,
  extractSourceLinks,
  freshFactCategories,
  handleUnattributed,
  looksLikeClaim,
} from "../claims/detector.js";

describe("F15-RD-01 trigger scope: fresh-fact categories always count as external", () => {
  const cases: { category: string; sentence: string }[] = [
    { category: "versions", sentence: "The plugin targets pi v0.87.1." },
    { category: "prices", sentence: "Each search costs $0.007 USDC." },
    { category: "apis", sentence: "The endpoint returns a rate-limit response." },
    { category: "library-behavior", sentence: "The runner throws on spawn failure." },
    { category: "standards", sentence: "The spec requires RFC 9110 caching." },
    { category: "release-dates", sentence: "The release shipped 2026-09-28." },
  ];
  for (const { category, sentence } of cases) {
    it(`${category} flags without attribution`, () => {
      assert.ok(looksLikeClaim(sentence), `missed claim: ${sentence}`);
      assert.ok(freshFactCategories(sentence).includes(category as (typeof FRESH_FACT_CATEGORIES)[number]));
      assert.equal(detectClaims(sentence).length, 1);
    });
  }

  it("internal reasoning and procedures stay free; thoughts are not claims", () => {
    assert.deepEqual(detectClaims("I will check the file next, then decide."), []);
    assert.deepEqual(detectClaims("Run the build, read the output, fix what fails."), []);
  });
});

describe("F15-RD-01 three attribution paths (each accepted)", () => {
  it("source link passes", () => {
    assert.equal(classifyAttribution("See https://example.com/docs for the limit."), "source-link");
    assert.deepEqual(detectClaims("The limit is 20 RPM per https://example.com/docs."), []);
  });

  it("workspace file:line passes", () => {
    assert.equal(classifyAttribution("The ceiling holds per src/config.ts:42."), "file:line");
    assert.deepEqual(detectClaims("The ceiling holds per src/config.ts:42."), []);
  });

  it("user-instruction attribution passes", () => {
    assert.equal(classifyAttribution("The date stands per the user instruction."), "user-instruction");
    assert.deepEqual(detectClaims("Each search costs $0.007 USDC on the user's word."), []);
  });

  it("mixed prose: the embedded claim flags, surrounding reasoning stays clean", () => {
    const findings = detectClaims("I checked the catalog. The price is $4 per 1M. Next I will verify.");
    assert.equal(findings.length, 1);
    assert.match(findings[0]?.claim ?? "", /price/);
  });
});

describe("F15-RD-07 disclose-or-drop (never asserted silently)", () => {
  it("disclose mode reports no source found aloud", () => {
    const resolved = handleUnattributed("The price is $4 per 1M.", "disclose");
    assert.equal(resolved.verdict, "disclosed");
    assert.match(resolved.disclosure ?? "", /no source found/);
  });

  it("drop mode removes the claim", () => {
    const resolved = handleUnattributed("The price is $4 per 1M.", "drop");
    assert.equal(resolved.verdict, "dropped");
    assert.equal(resolved.disclosure, undefined);
  });

  it("no silent-assert verdict exists", () => {
    const verdicts = [handleUnattributed("x", "disclose").verdict, handleUnattributed("x", "drop").verdict];
    assert.deepEqual(verdicts, ["disclosed", "dropped"]);
  });
});

describe("F8-PS-13 skill build check (build-time gate on static skill text)", () => {
  it("procedure-only skill text passes with zero findings", () => {
    const result = checkSkillText("Run the tests. Read the failing file. Apply the smallest fix.");
    assert.equal(result.pass, true);
    assert.deepEqual(result.violations, []);
  });

  it("sourced claim-bearing skill text passes", () => {
    const result = checkSkillText("Query the pricing table; each search costs $0.007 USDC per https://example.com/pricing.");
    assert.equal(result.pass, true);
  });

  it("unsourced claim-bearing skill text refuses with the claim cited", () => {
    const result = checkSkillText("Each search costs $0.007 USDC.");
    assert.equal(result.pass, false);
    assert.equal(result.violations.length, 1);
    assert.match(result.violations[0] ?? "", /unsourced claim/);
  });
});

describe("F15-RD-04/05/06 detective check and review-gate hook", () => {
  it("detective findings report only: unattributed fresh facts flag", () => {
    const findings = detectClaims("The plugin targets pi v0.87.1 with no source.");
    assert.equal(findings.length, 1);
    assert.equal(findings[0]?.attribution, "none");
  });

  it("cold-read hook surfaces unattributed claims and stays non-blocking pre-promotion", () => {
    const hook = createReviewGateHook();
    assert.equal(hook.blocking, false);
    const findings = hook.coldRead("The plugin targets pi v0.87.1 with no source.");
    assert.equal(findings.length, 1);
  });

  it("cold-read findings carry their sources into the review record (F11-DM-10)", () => {
    const hook = createReviewGateHook();
    const findings = hook.coldRead("The plugin targets pi v0.87.1 with no source.");
    assert.deepEqual(findings[0]?.sources, []);
  });

  it("cited claims carry their sources into the review record (F11-DM-10)", () => {
    const records = citedClaimsWithSources("Each search costs $0.007 USDC per https://example.com/pricing.");
    assert.equal(records.length, 1);
    assert.deepEqual(records[0]?.sources, ["https://example.com/pricing"]);
    assert.match(records[0]?.claim ?? "", /USDC/);
    assert.deepEqual(citedClaimsWithSources("The plugin targets pi v0.87.1 with no source."), []);
  });

  it("source-link extraction preserves every embedded link", () => {
    assert.deepEqual(extractSourceLinks("See https://a.example/x and https://b.example/y."), [
      "https://a.example/x",
      "https://b.example/y",
    ]);
    assert.deepEqual(extractSourceLinks("No links here."), []);
  });

  it("blocking needs pilot evidence plus explicit user sign-off, never sooner", () => {
    assert.equal(createReviewGateHook({ pilotEvidence: true }).blocking, false);
    assert.equal(createReviewGateHook({ userSignoff: true }).blocking, false);
    assert.equal(createReviewGateHook({ pilotEvidence: true, userSignoff: true }).blocking, true);
  });

  it("English-first limitation is named and disclosed", () => {
    assert.match(DETECTOR_LANGUAGE_SCOPE, /English-first/);
  });

  it("English-first limitation discloses at the review-gate hook output (F4 build-check)", () => {
    const hook = createReviewGateHook();
    assert.match(hook.languageScope, /English-first/);
    assert.match(DETECTOR_LANGUAGE_SCOPE_PIN, /user's word/);
  });

  it("F3 residual: the claims path never stays silent across unattributed inputs", () => {
    const hook = createReviewGateHook();
    const inputs = [
      "The plugin targets pi v0.87.1 with no source.",
      "Each search costs $0.007 USDC, no citation given.",
      "The endpoint returns a rate-limit response and nothing cites it.",
    ];
    for (const input of inputs) {
      const findings = hook.coldRead(input);
      assert.ok(findings.length > 0, `expected a finding for: ${input}`);
      for (const finding of findings) {
        assert.ok(
          finding.sources.length > 0 || finding.disclosure !== undefined,
          `silent finding: ${finding.claim}`,
        );
      }
    }
    const dropped = carrySourcesStrict("luna pricing", [], "drop");
    assert.equal(dropped.dropped, true);
  });

  it("uncarried source discloses or drops, never silently (F3 claims path)", () => {
    const disclosed = carrySourcesStrict("luna pricing", [], "disclose");
    assert.equal(disclosed.dropped, false);
    assert.match(disclosed.disclosure ?? "", new RegExp(SOURCE_NOT_CARRIED_DISCLOSURE));
    const dropped = carrySourcesStrict("luna pricing", [], "drop");
    assert.equal(dropped.dropped, true);
    const hook = createReviewGateHook();
    const findings = hook.coldRead("The plugin targets pi v0.87.1 with no source.");
    assert.match(findings[0]?.disclosure ?? "", new RegExp(SOURCE_NOT_CARRIED_DISCLOSURE));
  });
});
