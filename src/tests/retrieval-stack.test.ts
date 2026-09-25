// Retrieval-stack tests (F10-WR-01/04/05/06/07/08; SCHED-07/09; F11-DM-10).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Probe hooks stay UNVERIFIED; caps are probe pins,
// never truth.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CAPS,
  KEYED_GRANT_CHECK_ORDER,
  KEYED_GRANT_SEMANTICS,
  KEYED_SLOTS,
  KEYED_UPGRADE_DISCLOSURE,
  KEYLESS_TRIO,
  RESERVES,
  SOURCE_CARRY_NEXT_WIRING,
  TRAIL_FRESHNESS_RELEASE_GATING,
  TRAIL_FRESHNESS_WINDOW_PIN,
  carrySources,
  discloseGap,
  isKeyedGrantLive,
  isKeyedSlotActive,
  isRateClassRecord,
  recordVerbatim,
  reservesActive,
  revokeKeyedGrant,
  trailDocumentsExhaustion,
} from "../retrieval/stack.js";

describe("F10-WR-01/07 keyless trio (SCHED-09 user word 2026-09-28)", () => {
  it("v1 chain order is donsetch scraped-SERP search -> markdown.new -> Context7", () => {
    assert.deepEqual([...KEYLESS_TRIO], ["donsetch-search", "markdown.new", "context7"]);
  });
});

describe("F10-WR-01/06 keyed slots (Exa + Parallel BYOK upgrades)", () => {
  it("slots stay inactive without keys and activate only when keys exist", () => {
    assert.deepEqual([...KEYED_SLOTS], ["exa", "parallel"]);
    assert.equal(isKeyedSlotActive(false), false);
    assert.equal(isKeyedSlotActive(true), true);
  });

  it("keyed slots never auto-require: absence discloses, never escalates", () => {
    assert.equal(isKeyedSlotActive(false), false);
  });

  it("v1 DISCLOSURE record line: keyed upgrades are BYOK, never auto-required", () => {
    assert.match(KEYED_UPGRADE_DISCLOSURE, /BYOK/);
    assert.match(KEYED_UPGRADE_DISCLOSURE, /never auto-required/);
  });

  it("GRANT-CHECK runs before key-presence (F1 named order; F2-Q5 semantics)", () => {
    assert.match(KEYED_GRANT_CHECK_ORDER, /GRANT-CHECK/);
    assert.match(KEYED_GRANT_SEMANTICS, /F2-Q5/);
    const now = "2026-09-28T00:00:00.000Z";
    assert.equal(isKeyedGrantLive(undefined, now), false);
    assert.equal(isKeyedGrantLive({ granted: false }, now), false);
    assert.equal(isKeyedGrantLive({ granted: true }, now), true);
    assert.equal(isKeyedGrantLive({ granted: true, revoked: true }, now), false);
    assert.equal(isKeyedGrantLive({ granted: true, expiresAt: "2026-09-27T00:00:00.000Z" }, now), false);
    assert.equal(isKeyedGrantLive({ granted: true, expiresAt: "2026-09-29T00:00:00.000Z" }, now), true);
  });

  it("revocation clears the keyed grant (F10-Q7 named home)", () => {
    const revoked = revokeKeyedGrant({ exa: { granted: true } }, "exa");
    assert.equal(revoked.exa?.granted, false);
    assert.equal(isKeyedGrantLive(revoked.exa, "2026-09-28T00:00:00.000Z"), false);
  });
});

describe("F10-WR-01/08 reserve pair (Tavily + Firecrawl)", () => {
  it("reserves activate only on documented chain exhaustion, never silently", () => {
    assert.deepEqual([...RESERVES], ["tavily", "firecrawl"]);
    assert.equal(reservesActive(false), false);
    assert.equal(reservesActive(true), true);
  });

  it("the failure trail IS the documentation: all rate-class failures activate", () => {
    const trail = [
      { tier: "donsetch-search", status: "429", verbatim: "429 slow down" },
      { tier: "markdown.new", status: "403", verbatim: "403 blocked" },
      { tier: "context7", status: "429", verbatim: "rate limited" },
    ];
    assert.equal(trailDocumentsExhaustion(trail, [...KEYLESS_TRIO]), true);
  });

  it("partial trails, non-rate failures, and empty scopes never activate", () => {
    const partial = [{ tier: "donsetch-search", status: "429", verbatim: "429 slow down" }];
    assert.equal(trailDocumentsExhaustion(partial, [...KEYLESS_TRIO]), false);
    const nonRate = [...KEYLESS_TRIO].map((tier) => ({ tier, status: "500", verbatim: "boom" }));
    assert.equal(trailDocumentsExhaustion(nonRate, [...KEYLESS_TRIO]), false);
    assert.equal(trailDocumentsExhaustion([], [...KEYLESS_TRIO]), false);
    assert.equal(trailDocumentsExhaustion(partial, []), false);
  });

  it("rate-class audit matches the live chain classifier", () => {
    assert.equal(isRateClassRecord("429", "429 slow down"), true);
    assert.equal(isRateClassRecord("403", "captcha required"), true);
    assert.equal(isRateClassRecord("500", "boom"), false);
    assert.equal(isRateClassRecord("spawn-error", "unknown spawn error"), false);
  });

  it("scoped check requires current-call scope in a fresh window (F2)", () => {
    assert.match(TRAIL_FRESHNESS_WINDOW_PIN, /UNVERIFIED/);
    const now = "2026-09-28T00:00:00.000Z";
    const scope = { seat: "seeker", taskId: "t1", now, windowMs: 60000 };
    const fresh = [...KEYLESS_TRIO].map((tier) => ({ tier, status: "429", verbatim: "429 slow down", seat: "seeker", taskId: "t1", at: now }));
    assert.equal(trailDocumentsExhaustion(fresh, [...KEYLESS_TRIO], scope), true);
  });

  it("stale trail is refused (F2)", () => {
    const scope = { seat: "seeker", taskId: "t1", now: "2026-09-28T01:00:00.000Z", windowMs: 60000 };
    const stale = [...KEYLESS_TRIO].map((tier) => ({ tier, status: "429", verbatim: "429 slow down", seat: "seeker", taskId: "t1", at: "2026-09-28T00:00:00.000Z" }));
    assert.equal(trailDocumentsExhaustion(stale, [...KEYLESS_TRIO], scope), false);
  });

  it("N2 window edge verified with a test-configured value (production stays the section-7 pin)", () => {
    assert.match(TRAIL_FRESHNESS_WINDOW_PIN, /UNVERIFIED/);
    assert.match(TRAIL_FRESHNESS_RELEASE_GATING, /RELEASE-GATING/);
    const windowMs = 60000; // TEST-CONFIGURED only; the production value stays the section-7 pin.
    const nowMs = Date.parse("2026-09-28T00:01:00.000Z");
    const scope = { seat: "seeker", taskId: "t1", now: new Date(nowMs).toISOString(), windowMs };
    const trailAt = (at: string) =>
      [...KEYLESS_TRIO].map((tier) => ({ tier, status: "429", verbatim: "429 slow down", seat: "seeker", taskId: "t1", at }));
    assert.equal(trailDocumentsExhaustion(trailAt(new Date(nowMs - 60000).toISOString()), [...KEYLESS_TRIO], scope), true);
    assert.equal(trailDocumentsExhaustion(trailAt(new Date(nowMs - 60001).toISOString()), [...KEYLESS_TRIO], scope), false);
    assert.equal(trailDocumentsExhaustion(trailAt(new Date(nowMs + 1000).toISOString()), [...KEYLESS_TRIO], scope), false);
  });

  it("foreign-scope trail is refused (F2)", () => {
    const now = "2026-09-28T00:00:00.000Z";
    const scope = { seat: "seeker", taskId: "t1", now, windowMs: 60000 };
    const foreign = [...KEYLESS_TRIO].map((tier) => ({ tier, status: "429", verbatim: "429 slow down", seat: "writer", taskId: "t2", at: now }));
    assert.equal(trailDocumentsExhaustion(foreign, [...KEYLESS_TRIO], scope), false);
  });
});

describe("SCHED-07 probe-pinned caps with UNVERIFIED markers", () => {
  it("every tier carries a verbatim probe pin with a labeled status", () => {
    const tiers = CAPS.map((c) => c.tier);
    for (const tier of ["markdown.new", "jina", "context7", "tinyfish", "exa", "parallel", "tavily", "firecrawl"]) {
      assert.ok(tiers.includes(tier), `missing cap pin for ${tier}`);
    }
    for (const cap of CAPS) {
      assert.ok(cap.probe.length > 0);
      assert.ok(cap.status === "VERIFIED" || cap.status === "UNVERIFIED");
      assert.ok(cap.note.length > 0);
    }
  });

  it("429-class outcomes record verbatim, never smoothed", () => {
    const exa = CAPS.find((c) => c.tier === "exa");
    assert.match(exa?.probe ?? "", /x402 PAYMENT_REQUIRED/);
    const firecrawl = CAPS.find((c) => c.tier === "firecrawl");
    assert.match(firecrawl?.probe ?? "", /403/);
    const jina = CAPS.find((c) => c.tier === "jina");
    assert.match(jina?.probe ?? "", /401 AuthenticationRequiredError/);
  });

  it("recordVerbatim preserves the outcome exactly", () => {
    const raw = '429 {"error":"slow down","retry":3}';
    const record = recordVerbatim("markdown.new", "429", raw, () => "2026-09-28T00:00:00.000Z");
    assert.equal(record.verbatim, raw);
    assert.equal(record.at, "2026-09-28T00:00:00.000Z");
  });
});

describe("F10-WR-08/F10-Q8 Q8/Q18 gap disclosure", () => {
  it("non-acceptance-critical exhaustion proceeds reversible with disclosure", () => {
    const gap = discloseGap(false);
    assert.equal(gap.action, "proceed-reversible");
    assert.match(gap.disclosure, /disclosed/);
  });

  it("acceptance-critical exhaustion stops the branch with disclosure", () => {
    const gap = discloseGap(true);
    assert.equal(gap.action, "stop-branch");
    assert.match(gap.disclosure, /disclosed/);
  });

  it("uncovered demands fail closed as acceptance-critical; seats never self-label", () => {
    const gap = discloseGap(null);
    assert.equal(gap.action, "stop-branch");
    assert.match(gap.disclosure, /fail-closed/);
  });
});

describe("F10-WR-04/05 zero-paid posture and Context7 default", () => {
  it("anonymous default serves with no key; quota failure discloses rather than assuming", () => {
    const context7 = CAPS.find((c) => c.tier === "context7");
    assert.match(context7?.probe ?? "", /200 \(anonymous search works\)/);
    assert.equal(isKeyedSlotActive(false), false);
  });
});

describe("F11-DM-10 source-carry composition", () => {
  it("recalled content surfaces its stored source links alongside", () => {
    const carried = carrySources("luna pricing", ["https://example.com/pricing"]);
    assert.equal(carried.content, "luna pricing");
    assert.deepEqual(carried.sources, ["https://example.com/pricing"]);
  });

  it("recall/envelope wiring is the named Slice 4 next step", () => {
    assert.match(SOURCE_CARRY_NEXT_WIRING, /Slice 4/);
    assert.match(SOURCE_CARRY_NEXT_WIRING, /F11\/F12/);
  });
});
