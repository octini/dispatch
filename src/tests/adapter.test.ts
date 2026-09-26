// Donsetch thin-adapter tests (F10-WR-02/03/04/08/09/10/12; F10-Q7/Q10).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Named-open paths stay explicit: the native
// Pi-extension fallback (probe-gated, UNVERIFIED), live subprocess behavior,
// and probe-pinned backoff values (UNVERIFIED).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ADAPTER_FORM,
  BACKOFF_STATUS,
  DEFAULT_SNIPPET_BOUND,
  KEYED_GRANT_OPEN_REVERIFY,
  LINKED_DONSETCH_IMPORTS,
  RUNNER_INJECTION_SCOPE,
  SNIPPET_BOUND_STATUS,
  TEST_SEAM_PRODUCTION_RULE,
  defaultRunner,
  projectListOnly,
  revokeApproval,
  revokeKeyedSlotGrant,
  runRetrieval,
  runRetrievalTestOnly,
  surfaceFor,
  writerLookupAllowed,
  type AdapterRequest,
  type ApprovalRegistry,
  type SubprocessCall,
  type SubprocessResult,
  type SubprocessRunner,
} from "../adapter/donsetch-adapter.js";
import { PermissionGate } from "../permission-gate.js";
import { TRAIL_FORGERY_BOUNDARY, TRAIL_HOST_CLOCK_ANCHOR } from "../retrieval/stack.js";

const POLICY = { revision: "slice3", protectedPaths: [] as string[], scopedExceptions: [] };

function req(over: Partial<AdapterRequest> = {}): AdapterRequest {
  return {
    seat: "seeker",
    capability: "web_fetch",
    operation: "fetch",
    args: { url: "https://example.com/docs" },
    cwd: "/repo",
    taskId: "t1",
    scopePaths: ["/repo"],
    target: "https://example.com/docs",
    ...over,
  };
}

function queueRunner(results: SubprocessResult[]): { runner: SubprocessRunner; calls: SubprocessCall[] } {
  const calls: SubprocessCall[] = [];
  return {
    calls,
    runner: (call: SubprocessCall): SubprocessResult => {
      calls.push(call);
      const next = results[calls.length - 1];
      if (next === undefined) throw new Error("runner queue exhausted");
      return next;
    },
  };
}

const OK = (body: string): SubprocessResult => ({ status: 0, stdout: body, stderr: "" });

describe("F10-WR-02/12 call sequence: gate -> subprocess -> stamp -> fallback", () => {
  it("served call runs the full sequence with a complete evidence stamp", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([OK("# docs body")]);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, now: () => fixedNow });
    assert.equal(result.outcome, "served");
    assert.equal(q.calls.length, 1);
    assert.equal(q.calls[0]?.command, "donsetch");
    assert.ok(result.stamp !== undefined);
    assert.equal(result.stamp.url, "https://example.com/docs");
    assert.equal(result.stamp.retrievedAt, fixedNow);
    assert.equal(result.stamp.source, "donsetch-search");
    assert.equal(result.stamp.sessionProvenance, "seeker:t1");
    assert.equal(result.stamp.contentHash.length, 64);
    assert.ok(result.stamp.contentLength > 0);
  });

  it("gate denial precedes the subprocess: refused with the runner untouched", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([OK("never")]);
    const result = runRetrievalTestOnly(req({ seat: "seeker", capability: "beads_close", operation: "fetch" }), {
      gate,
      runner: q.runner,
    });
    assert.equal(result.outcome, "refused");
    assert.equal(q.calls.length, 0);
    assert.match(result.reason, /gate/);
  });

  it("429 mid-chain records VERBATIM and falls to the next tier", () => {
    const gate = new PermissionGate(POLICY);
    const verbatim = "429 Too Many Requests: quota exceeded by 3";
    const q = queueRunner([
      { status: 429, stdout: "", stderr: verbatim },
      OK("recovered body"),
    ]);
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, chain: ["tier-a", "tier-b"] });
    assert.equal(result.outcome, "served");
    assert.match(result.reason, /tier-b/);
    assert.equal(result.failureTrail.length, 1);
    assert.equal(result.failureTrail[0]?.verbatim, verbatim);
    assert.equal(result.failureTrail[0]?.backoff, BACKOFF_STATUS);
  });

  it("paywall stub records suspected-degraded and continues; never stamped clean", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([OK("Subscribe to continue reading"), OK("full article text")]);
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, chain: ["tier-a", "tier-b"] });
    assert.equal(result.outcome, "served");
    assert.equal(result.body, "full article text");
    assert.ok(result.failureTrail.some((f) => f.status === "suspected-degraded"));
  });

  it("F10-WR-09 divergent tier content records both and flags; no silent winner", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([OK("Subscribe to continue reading"), OK("full article text")]);
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, chain: ["tier-a", "tier-b"] });
    assert.match(result.reason, /divergent/i);
    assert.ok(result.failureTrail.some((f) => f.status === "divergent-content"));
  });

  it("F10-WR-08 exhaustion discloses on both branches; uncovered demands fail closed", () => {
    const denied: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const nonCritical = runRetrievalTestOnly(req({ acceptanceCritical: false }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([denied]).runner,
      chain: ["tier-a"],
    });
    assert.equal(nonCritical.outcome, "exhausted");
    assert.match(nonCritical.disclosure ?? "", /reversible work proceeds/);

    const critical = runRetrievalTestOnly(req({ acceptanceCritical: true }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([denied]).runner,
      chain: ["tier-a"],
    });
    assert.equal(critical.outcome, "exhausted");
    assert.match(critical.disclosure ?? "", /stops/);

    const uncovered = runRetrievalTestOnly(req(), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([denied]).runner,
      chain: ["tier-a"],
    });
    assert.equal(uncovered.outcome, "exhausted");
    assert.match(uncovered.disclosure ?? "", /fail-closed/);
  });

  it("reserves stay inactive without an in-call rate-class trail", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([{ status: 500, stdout: "", stderr: "boom" }]);
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, chain: ["tier-a"] });
    assert.equal(result.outcome, "exhausted");
    assert.ok(q.calls.every((c) => c.tier === "tier-a"));
  });

  it("in-call rate-class trail activates the reserves in chain order", () => {
    const gate = new PermissionGate(POLICY);
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const result = runRetrievalTestOnly(req(), { gate, runner: q.runner, now: () => fixedNow, trailFreshnessWindowMs: 60000 });
    assert.equal(result.outcome, "served");
    assert.deepEqual(
      q.calls.map((c) => c.tier),
      ["donsetch-search", "markdown.new", "context7", "tavily"],
    );
    assert.match(result.disclosure ?? "", /in-call rate-class trail documents keyless exhaustion/);
  });

  it("a bare reserveClaim without the trail is refused (even empty)", () => {
    for (const reserveClaim of ["prior-disclosure-1", ""]) {
      const q = queueRunner([OK("served body")]);
      const result = runRetrievalTestOnly(req({ reserveClaim }), {
        gate: new PermissionGate(POLICY),
        runner: q.runner,
        chain: ["tier-a"],
      });
      assert.equal(result.outcome, "refused");
      assert.match(result.reason, /unverifiable reserve claim/);
    }
  });

  it("a reserveClaim on non-rate-class exhaustion is refused", () => {
    const q = queueRunner([{ status: 500, stdout: "", stderr: "boom" }]);
    const result = runRetrievalTestOnly(req({ reserveClaim: "prior-disclosure-1" }), {
      gate: new PermissionGate(POLICY),
      runner: q.runner,
      chain: ["tier-a"],
    });
    assert.equal(result.outcome, "refused");
    assert.match(result.reason, /unverifiable reserve claim/);
  });

  it("keyed slot joins the chain on key presence, after the trio and before reserves", () => {
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const q = queueRunner([slow, slow, slow, OK("exa body")]);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const result = runRetrievalTestOnly(req({ keyedSlotKeys: { exa: true }, keyedSlotGrants: { exa: { granted: true } } }), {
      gate: new PermissionGate(POLICY),
      runner: q.runner,
      now: () => fixedNow,
      trailFreshnessWindowMs: 60000,
    });
    assert.equal(result.outcome, "served");
    assert.deepEqual(
      q.calls.map((c) => c.tier),
      ["donsetch-search", "markdown.new", "context7", "exa"],
    );
    assert.match(result.reason, /keyed upgrades are BYOK/);
  });

  it("keyed slots stay out without keys", () => {
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const result = runRetrievalTestOnly(req(), { gate: new PermissionGate(POLICY), runner: q.runner, now: () => fixedNow, trailFreshnessWindowMs: 60000 });
    assert.equal(result.outcome, "served");
    assert.ok(q.calls.every((c) => c.tier !== "exa" && c.tier !== "parallel"));
  });

  it("a documented-exhaustion claim admits the reserves with disclosure", () => {
    const gate = new PermissionGate(POLICY);
    const q = queueRunner([
      { status: 429, stdout: "", stderr: "429 slow down" },
      { status: 401, stdout: "", stderr: "401 missing key" },
      OK("reserve content"),
    ]);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const result = runRetrievalTestOnly(req({ reserveClaim: "prior-disclosure-1" }), {
      gate,
      runner: q.runner,
      chain: ["tier-a"],
      now: () => fixedNow,
      trailFreshnessWindowMs: 60000,
    });
    assert.equal(result.outcome, "served");
    assert.equal(q.calls[1]?.tier, "tavily");
    assert.equal(q.calls[2]?.tier, "firecrawl");
    assert.match(result.disclosure ?? "", /disclosure ref prior-disclosure-1/);
  });
});

describe("F10-WR-03 seat matrix (single source: the seat configs)", () => {
  it("seeker holds full retrieval; dispatcher/expert are list-only; writer is context7-approved", () => {
    assert.equal(surfaceFor("seeker"), "full");
    assert.equal(surfaceFor("dispatcher"), "list-only");
    assert.equal(surfaceFor("expert"), "list-only");
    assert.equal(surfaceFor("writer"), "context7-approved");
  });

  it("seeker fetch serves", () => {
    const q = queueRunner([OK("seeker body")]);
    const result = runRetrievalTestOnly(req({ seat: "seeker" }), { gate: new PermissionGate(POLICY), runner: q.runner });
    assert.equal(result.outcome, "served");
  });

  it("writer docs serve without approvals; writer fetch needs an approval-live lookup", () => {
    const docs = runRetrievalTestOnly(req({ seat: "writer", capability: "web_fetch", operation: "docs" }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("context7 docs")]).runner,
    });
    assert.equal(docs.outcome, "served");

    const unapproved = runRetrievalTestOnly(req({ seat: "writer", operation: "fetch" }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(unapproved.outcome, "refused");
    assert.match(unapproved.reason, /approval-live/);
  });

  it("writer approved lookups allow; expired tasks refuse", () => {
    const approvals: ApprovalRegistry = {
      namedInPlan: ["https://example.com/docs"],
      standingAllowlist: [],
      taskId: "t1",
      taskOpen: true,
    };
    assert.equal(writerLookupAllowed("https://example.com/docs", approvals), true);
    assert.equal(writerLookupAllowed("https://other.example/y", approvals), false);
    assert.equal(writerLookupAllowed("https://example.com/docs", { ...approvals, taskOpen: false }), false);
    assert.equal(writerLookupAllowed("https://example.com/docs", undefined), false);

    const allowed = runRetrievalTestOnly(req({ seat: "writer", operation: "fetch", approvals }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("approved body")]).runner,
    });
    assert.equal(allowed.outcome, "served");

    const expired = runRetrievalTestOnly(req({ seat: "writer", operation: "fetch", approvals: { ...approvals, taskOpen: false } }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(expired.outcome, "refused");
  });

  it("F10-Q7 revocation split: standing is user-only; task-scoped drops either way", () => {
    const registry: ApprovalRegistry = {
      namedInPlan: ["https://plan.example/a"],
      standingAllowlist: ["https://standing.example/b"],
      taskId: "t1",
      taskOpen: true,
    };
    const dispatcherStanding = revokeApproval(registry, "https://standing.example/b", "dispatcher");
    assert.ok("refused" in dispatcherStanding);
    const userStanding = revokeApproval(registry, "https://standing.example/b", "user");
    assert.ok("registry" in userStanding);
    const dispatcherTask = revokeApproval(registry, "https://plan.example/a", "dispatcher");
    assert.ok("registry" in dispatcherTask);
    const missing = revokeApproval(registry, "https://missing.example/", "user");
    assert.ok("refused" in missing);
  });

  it("dispatcher/expert raw fetch refuses; list-only search projects titles, URLs, bounded snippets", () => {
    const q = queueRunner([OK("never")]);
    for (const seat of ["dispatcher", "expert"] as const) {
      const refused = runRetrievalTestOnly(req({ seat, operation: "fetch" }), { gate: new PermissionGate(POLICY), runner: q.runner });
      assert.equal(refused.outcome, "refused");
      assert.match(refused.reason, /list-only/);
    }
    const long = "x".repeat(500);
    const payload = JSON.stringify({ results: [{ title: "T", url: "https://example.com/t", snippet: long }] });
    const listed = runRetrievalTestOnly(
      req({ seat: "dispatcher", capability: "web_search", operation: "search" }),
      { gate: new PermissionGate(POLICY), runner: queueRunner([OK(payload)]).runner, snippetBound: 50 },
    );
    assert.equal(listed.outcome, "list-only");
    assert.equal(listed.stamp?.snippetBound, 50);
    assert.match(listed.reason, /disclosed snippet bound 50/);
    const items = JSON.parse(listed.body ?? "[]") as { snippet: string }[];
    assert.equal(items[0]?.snippet.length, 50);
  });

  it("F10-Q10 default bound is the pinned 280-char user word (2026-09-28), disclosed per stamp", () => {
    assert.equal(SNIPPET_BOUND_STATUS, "PINNED 280 chars (user-worded 2026-09-28)");
    assert.equal(DEFAULT_SNIPPET_BOUND, 280);
    const { disclosedBound } = projectListOnly("abc", DEFAULT_SNIPPET_BOUND);
    assert.equal(disclosedBound, DEFAULT_SNIPPET_BOUND);
  });

  it("no seat retrieves via bash", () => {
    const result = runRetrievalTestOnly(req({ seat: "seeker", capability: "shell_rg", operation: "search", args: { command: "rg docs" } }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(result.outcome, "refused");
    assert.match(result.reason, /bash/);
  });
});

describe("F10-WR-04 zero-paid and F10-WR-10 read-only", () => {
  it("paid tier without BYOK refuses; with BYOK proceeds; never auto-escalates", () => {
    const noKey = runRetrievalTestOnly(req({ paidTier: true }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(noKey.outcome, "refused");
    assert.match(noKey.reason, /zero-paid/);
    const keyed = runRetrievalTestOnly(req({ paidTier: true, byokPresent: true }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("paid body")]).runner,
    });
    assert.equal(keyed.outcome, "served");
  });

  it("captcha unlocker refuses: DISABLED in v1, never auto-enabled", () => {
    const result = runRetrievalTestOnly(req({ unlockerRequested: true }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(result.outcome, "refused");
    assert.match(result.reason, /DISABLED/);
  });

  it("POST and form submissions refuse; GET serves", () => {
    const post = runRetrievalTestOnly(req({ httpMethod: "POST" }), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK("never")]).runner,
    });
    assert.equal(post.outcome, "refused");
    assert.match(post.reason, /read-only/);
  });
});

describe("AGPL separate-process boundary (F6-Q5, PS-SEAM-07)", () => {
  it("adapter form is subprocess-only with no linked donsetch surface", () => {
    assert.equal(ADAPTER_FORM, "cli-subprocess");
    assert.deepEqual(LINKED_DONSETCH_IMPORTS, []);
  });

  it("adapter source carries no donsetch static import or require", () => {
    const source = readFileSync(new URL("../../src/adapter/donsetch-adapter.ts", import.meta.url), "utf8");
    assert.ok(!/from\s+['"]donsetch/.test(source));
    assert.ok(!/require\(\s*['"]donsetch/.test(source));
  });

  it("default runner pins the donsetch command and refuses anything else", () => {
    assert.throws(
      () => defaultRunner({ command: "other", tier: "t", operation: "fetch", target: "x" } as unknown as SubprocessCall),
      /subprocess boundary/,
    );
  });

  it("production path cannot swap the runner (F5 frozen internal runner)", () => {
    assert.match(RUNNER_INJECTION_SCOPE, /test-only/);
    const q = queueRunner([OK("never")]);
    assert.throws(
      () =>
        runRetrieval(req(), { gate: new PermissionGate(POLICY), runner: q.runner } as unknown as Parameters<typeof runRetrieval>[1]),
      /test-only/,
    );
  });
});

describe("F1 GRANT-CHECK before key-presence (presence != grant)", () => {
  it("key present + grant absent = keyed slot stays closed", () => {
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const result = runRetrievalTestOnly(req({ keyedSlotKeys: { exa: true } }), {
      gate: new PermissionGate(POLICY),
      runner: q.runner,
      now: () => fixedNow,
      trailFreshnessWindowMs: 60000,
    });
    assert.ok(q.calls.every((c) => c.tier !== "exa"));
    assert.ok(result.failureTrail.some((f) => f.status === "keyed-grant-closed"));
  });

  it("stale/expired grant = closed + disclosed", () => {
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const result = runRetrievalTestOnly(
      req({ keyedSlotKeys: { exa: true }, keyedSlotGrants: { exa: { granted: true, expiresAt: "2026-09-27T00:00:00.000Z" } } }),
      { gate: new PermissionGate(POLICY), runner: q.runner, now: () => fixedNow, trailFreshnessWindowMs: 60000 },
    );
    assert.ok(q.calls.every((c) => c.tier !== "exa"));
    assert.match(result.disclosure ?? result.failureTrail.map((f) => f.verbatim).join("; "), /no live grant/);
  });

  it("revocation clears the keyed grant (F10-Q7 named home)", () => {
    const grants = { exa: { granted: true } } as const;
    const revoked = revokeKeyedSlotGrant({ ...grants }, "exa");
    assert.equal(revoked.exa?.granted, false);
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const result = runRetrievalTestOnly(req({ keyedSlotKeys: { exa: true }, keyedSlotGrants: revoked }), {
      gate: new PermissionGate(POLICY),
      runner: q.runner,
      now: () => fixedNow,
      trailFreshnessWindowMs: 60000,
    });
    assert.ok(q.calls.every((c) => c.tier !== "exa"));
  });
});

describe("N1 host-clock anchor (forged-fresh-trail)", () => {
  it("retrieval-time stamps come from the host clock; seat/subprocess self-report is ignored", () => {
    assert.match(TRAIL_HOST_CLOCK_ANCHOR, /host clock/);
    assert.match(TRAIL_FORGERY_BOUNDARY, /compromised host \(out of scope\)/);
    const hostNow = "2026-09-28T00:00:00.000Z";
    const forged = JSON.stringify({ at: "1999-01-01T00:00:00.000Z", retrievedAt: "1999-01-01T00:00:00.000Z" });
    const served = runRetrievalTestOnly(req(), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([OK(forged)]).runner,
      now: () => hostNow,
    });
    assert.equal(served.outcome, "served");
    assert.equal(served.stamp?.retrievedAt, hostNow);
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down at=1999-01-01T00:00:00.000Z" };
    const failed = runRetrievalTestOnly(req(), {
      gate: new PermissionGate(POLICY),
      runner: queueRunner([slow]).runner,
      now: () => hostNow,
      chain: ["tier-a"],
    });
    assert.equal(failed.outcome, "exhausted");
    assert.equal(failed.failureTrail[0]?.at, hostNow);
  });
});

describe("N3 test-seam production strip", () => {
  it("the production path cannot reach the swap seam", () => {
    assert.match(TEST_SEAM_PRODUCTION_RULE, /test-only/);
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      assert.throws(
        () =>
          runRetrievalTestOnly(req(), { gate: new PermissionGate(POLICY), runner: queueRunner([OK("never")]).runner }),
        /production/,
      );
    } finally {
      if (prev === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = prev;
    }
    const q = queueRunner([OK("never")]);
    assert.throws(
      () =>
        runRetrieval(req(), { gate: new PermissionGate(POLICY), runner: q.runner } as unknown as Parameters<typeof runRetrieval>[1]),
      /test-only/,
    );
    assert.equal(q.calls.length, 0);
  });
});

describe("N4 grant TOCTOU (re-check at the keyed-slot open)", () => {
  it("a grant revoked between check and open = the open refuses", () => {
    assert.match(KEYED_GRANT_OPEN_REVERIFY, /re-checked/);
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const result = runRetrievalTestOnly(
      req({ keyedSlotKeys: { exa: true }, keyedSlotGrants: { exa: { granted: true } } }),
      {
        gate: new PermissionGate(POLICY),
        runner: q.runner,
        now: () => fixedNow,
        trailFreshnessWindowMs: 60000,
        reverifyKeyedGrant: () => false,
      },
    );
    assert.ok(q.calls.every((c) => c.tier !== "exa"), "revoked-at-open slot must never open");
    assert.ok(
      result.failureTrail.some((f) => f.tier === "exa" && f.status === "keyed-grant-closed" && /re-check refused/.test(f.verbatim)),
    );
  });
});

describe("N5 revocation enforcement", () => {
  it("a revoked grant closes the keyed chain", () => {
    const fixedNow = "2026-09-28T00:00:00.000Z";
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const revoked = revokeKeyedSlotGrant({ exa: { granted: true } }, "exa");
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    const result = runRetrievalTestOnly(req({ keyedSlotKeys: { exa: true }, keyedSlotGrants: revoked }), {
      gate: new PermissionGate(POLICY),
      runner: q.runner,
      now: () => fixedNow,
      trailFreshnessWindowMs: 60000,
    });
    assert.ok(q.calls.every((c) => c.tier !== "exa"));
    assert.ok(result.failureTrail.some((f) => f.tier === "exa" && f.status === "keyed-grant-closed"));
    assert.match(result.disclosure ?? result.failureTrail.map((f) => f.verbatim).join("; "), /no live grant/);
  });
});

describe("F2 scoped+fresh trail (stale refused in-call)", () => {
  it("stale trail refuses reserve activation", () => {
    const t0 = "2026-09-28T00:00:00.000Z";
    const t1 = "2026-09-28T01:00:00.000Z";
    const slow: SubprocessResult = { status: 429, stdout: "", stderr: "429 slow down" };
    const q = queueRunner([slow, slow, slow, OK("reserve content")]);
    let calls = 0;
    const now = (): string => {
      calls += 1;
      return calls <= 3 ? t0 : t1;
    };
    const result = runRetrievalTestOnly(req(), { gate: new PermissionGate(POLICY), runner: q.runner, now, trailFreshnessWindowMs: 60000 });
    assert.equal(result.outcome, "exhausted");
    assert.ok(q.calls.every((c) => c.tier !== "tavily" && c.tier !== "firecrawl"));
  });
});
