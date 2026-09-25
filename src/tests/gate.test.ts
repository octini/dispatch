// Permission-gate unit tests (F2-PE-02/03/04/06/07/08/12/13).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Named-open paths stay explicit: the Writer grant-ask
// wiring (F2-PE-08), the Seeker shell matrix sign-off, the Pi hook live
// wiring. Those unbuilt paths are untestable until their probes land.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PermissionGate, hasTraversalEscape, resolveTargets, type GateToolCall } from "../permission-gate.js";
import type { PolicyConfig, SeatId } from "../config.js";
import * as dispatcher from "../seats/dispatcher.js";
import * as writer from "../seats/writer.js";
import * as seeker from "../seats/seeker.js";
import * as expert from "../seats/expert.js";

const POLICY: PolicyConfig = {
  revision: "test-1",
  protectedPaths: ["secrets/api.key"],
  scopedExceptions: [],
};

function call(over: Partial<GateToolCall>): GateToolCall {
  return {
    seat: "writer",
    tool: "write",
    operation: "write",
    args: { path: "src/app.ts" },
    cwd: "/repo",
    taskId: "t1",
    scopePaths: ["/repo/src"],
    ...over,
  };
}

describe("deny floor", () => {
  it("writer write to a protected credential path denies with reason", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ args: { path: "secrets/api.key" } }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /protected path/);
    assert.equal(d.parked, false);
  });

  it("raw .git edit denies; validated git-show read allows", () => {
    const gate = new PermissionGate(POLICY);
    const raw = gate.decide(call({ args: { path: ".git/HEAD" } }));
    assert.equal(raw.outcome, "deny-and-log");
    const ok = gate.decide(
      call({ seat: "seeker", tool: "shell_git_show", operation: "read", args: { command: "git show HEAD:README.md" }, scopePaths: ["/repo"] }),
    );
    assert.equal(ok.outcome, "allow");
  });

  it("seeker edit and beads mutation both refuse; scoped reads allow", () => {
    const gate = new PermissionGate(POLICY);
    assert.equal(gate.decide(call({ seat: "seeker" })).outcome, "deny-and-log");
    assert.equal(
      gate.decide(call({ seat: "seeker", tool: "beads_update", operation: "update", args: { id: "bd-1" } })).outcome,
      "deny-and-log",
    );
    assert.equal(
      gate.decide(call({ seat: "seeker", tool: "read", operation: "read", args: { path: "src/app.ts" } })).outcome,
      "allow",
    );
  });

  it("dispatcher holds no artifact-edit authority", () => {
    const gate = new PermissionGate(POLICY);
    assert.equal(gate.decide(call({ seat: "dispatcher" })).outcome, "deny-and-log");
  });

  it("evasive shell denies with typed alternative", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(
      call({ seat: "seeker", tool: "shell_rg", operation: "exec", args: { command: "rg foo | tee out; GIT_PAGER=less cat" }, scopePaths: ["/repo"] }),
    );
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /unclassifiable/);
  });
});

describe("ambiguity parks", () => {
  it("missing scope authority on a mutation denies, logs, parks", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ args: {}, scopePaths: [] }));
    assert.equal(d.outcome, "deny-log-and-park");
    assert.equal(d.parked, true);
  });

  it("unknown tool parks the capability pending mapping", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ tool: "brand_new_tool", operation: "run", scopePaths: ["/repo"] }));
    assert.equal(d.outcome, "deny-log-and-park");
    assert.match(d.reason, /no verified mapping/);
  });

  it("recurring same-denial parks on the third attempt", () => {
    const gate = new PermissionGate({ ...POLICY });
    const c = call({ args: { path: "secrets/api.key" }, taskId: "t-pattern" });
    const first = gate.decide(c);
    assert.equal(first.outcome, "deny-and-log");
    const second = gate.decide(c);
    assert.equal(second.outcome, "deny-and-log");
    const third = gate.decide(c);
    assert.equal(third.outcome, "deny-log-and-park");
    assert.match(third.reason, /recurring pattern/);
  });

  it("allows never count toward the recurring-denial pattern", () => {
    const gate = new PermissionGate({ ...POLICY });
    const change = {
      userDirect: true,
      interpretedBy: "dispatcher" as const,
      appliedBy: "writer" as const,
      provenance: "user 2026-09-24",
      change: "read env",
      scope: "/repo",
      duration: "session",
    };
    // Same counter key (seat/tool/operation/first-target), excused twice → allows.
    const allowed = call({ tool: "read", operation: "read", args: { path: "/repo/.env" }, scopePaths: ["/repo"], taskId: "t-mixed", configChange: change });
    assert.equal(gate.decide(allowed).outcome, "allow");
    assert.equal(gate.decide(allowed).outcome, "allow");
    // Same key without the exception → first denial must NOT park.
    const denied = call({ tool: "read", operation: "read", args: { path: "/repo/.env" }, scopePaths: ["/repo"], taskId: "t-mixed" });
    const first = gate.decide(denied);
    assert.equal(first.outcome, "deny-and-log");
    assert.equal(first.parked, false);
  });

  it("protected paths match on path segments, not substrings", () => {
    const gate = new PermissionGate({ ...POLICY });
    // /.github/workflows/x is NOT the .git internals: no over-denial.
    const nearMiss = gate.decide(
      call({ seat: "seeker", tool: "read", operation: "read", args: { path: ".github/workflows/x.yml" }, scopePaths: ["/repo"] }),
    );
    assert.equal(nearMiss.outcome, "allow");
    // /a/credentials.txt IS protected: no under-denial.
    const credName = gate.decide(call({ args: { path: "/a/credentials.txt" } }));
    assert.equal(credName.outcome, "deny-and-log");
    assert.match(credName.reason, /protected path/);
  });

  it("a persisted scoped exception authorizes inside its scope, inert outside", () => {
    const change = {
      userDirect: true,
      interpretedBy: "dispatcher" as const,
      appliedBy: "writer" as const,
      provenance: "user 2026-09-24",
      change: "read vendored env",
      scope: "/repo",
      duration: "session",
    };
    const gate = new PermissionGate({ ...POLICY, scopedExceptions: [change] });
    const inside = gate.decide(
      call({ tool: "read", operation: "read", args: { path: "/repo/.env" }, scopePaths: ["/repo"] }),
    );
    assert.equal(inside.outcome, "allow");
    const outside = gate.decide(
      call({ tool: "read", operation: "read", args: { path: "/other/.env" }, scopePaths: ["/other"] }),
    );
    assert.equal(outside.outcome, "deny-and-log");
    assert.match(outside.reason, /protected path/);
  });

  it("expert narrows out web_crawl; seeker keeps it", () => {
    const gate = new PermissionGate({ ...POLICY });
    assert.deepEqual(gate.narrowTools("expert", ["web_search", "web_crawl", "read"]), ["web_search", "read"]);
    assert.deepEqual(gate.narrowTools("seeker", ["web_search", "web_crawl", "read"]), ["web_search", "web_crawl", "read"]);
  });

  it("traversal escapes deny; absolute out-of-scope paths fail on scope", () => {
    const gate = new PermissionGate({ ...POLICY });
    assert.equal(hasTraversalEscape({ path: "../../etc/passwd" }, "/repo/a"), true);
    assert.equal(hasTraversalEscape({ path: "src/app.ts" }, "/repo"), false);
    const escaped = gate.decide(call({ args: { path: "../../etc/passwd" }, cwd: "/repo/a" }));
    assert.equal(escaped.outcome, "deny-and-log");
    assert.match(escaped.reason, /traversal/);
    const absolute = gate.decide(call({ args: { path: "/other/place.ts" } }));
    assert.equal(absolute.outcome, "deny-and-log");
    assert.match(absolute.reason, /scope/);
  });
});

describe("argument and target resolution", () => {
  it("resolves relative args against cwd through our own resolver", () => {
    assert.deepEqual(resolveTargets({ path: "src/../.env" }, "/repo"), ["/repo/.env"]);
    assert.deepEqual(resolveTargets({ path: "../../etc/passwd" }, "/repo/a"), ["/etc/passwd"]);
  });

  it("write outside approved scope denies", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ args: { path: "/other/place.ts" } }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /scope/);
  });

  it("audit redacts credential-bearing inputs", () => {
    const gate = new PermissionGate(POLICY);
    gate.decide(call({ seat: "dispatcher", tool: "read", operation: "read", args: { path: "docs/x.md", api_key: "s3cr3t-value" }, scopePaths: ["/repo"] }));
    const entry = gate.audit[gate.audit.length - 1];
    assert.ok(entry !== undefined);
    assert.ok(!entry.argsPreview.includes("s3cr3t-value"));
    assert.ok(entry.argsPreview.includes("[redacted]"));
  });

  it("audit redacts credential-shaped values under plain keys", () => {
    const gate = new PermissionGate(POLICY);
    gate.decide(
      call({
        seat: "dispatcher",
        tool: "read",
        operation: "read",
        args: { path: "docs/x.md", note: "ghp_1234567890abcdef" },
        scopePaths: ["/repo"],
      }),
    );
    const entry = gate.audit[gate.audit.length - 1];
    assert.ok(entry !== undefined);
    assert.ok(!entry.argsPreview.includes("ghp_1234567890abcdef"));
    assert.ok(entry.argsPreview.includes("[redacted]"));
  });
});

describe("ask-only writer (F2-PE-06/08)", () => {
  const change = {
    userDirect: true,
    interpretedBy: "dispatcher" as const,
    appliedBy: "writer" as const,
    provenance: "user 2026-09-24",
    change: "extend one dependency path",
    scope: "/repo/vendor",
    duration: "session",
  };

  it("writer applies a validated user-directed change", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ tool: "config_update", operation: "update", args: {}, configChange: change }));
    assert.equal(d.outcome, "allow");
  });

  it("non-writer seats hold no apply authority even with a valid change", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ seat: "dispatcher", tool: "config_update", operation: "update", args: {}, configChange: change }));
    assert.equal(d.outcome, "deny-and-log");
  });

  it("self-authored widening without user direction denies", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(
      call({ tool: "config_update", operation: "update", args: {}, configChange: { ...change, userDirect: false } }),
    );
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /USER instruction/);
  });
});

describe("gate-level seat-toolset membership (defense in depth)", () => {
  it("writer beads_search refuses at the gate: outside the seat toolset", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(call({ tool: "beads_search", operation: "search", args: { query: "ready work" } }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /outside the seat toolset/);
    assert.equal(d.parked, false);
  });
});

describe("single-source toolsets (FIND-1)", () => {
  it("gate set === seat config set for every seat", () => {
    const gate = new PermissionGate(POLICY);
    const mods: Record<SeatId, { tools: Array<{ name: string }> }> = { dispatcher, writer, seeker, expert };
    for (const seat of Object.keys(mods) as SeatId[]) {
      assert.deepEqual([...gate.seatTools(seat)].sort(), mods[seat].tools.map((t) => t.name).sort());
    }
  });
});

describe("scoped-exception integrity (store check before use)", () => {
  it("malformed stored exceptions are inert, never authorizing", () => {
    const malformed = {
      userDirect: true,
      interpretedBy: "dispatcher" as const,
      appliedBy: "writer" as const,
      provenance: "user 2026-09-24",
      change: "read env",
      scope: "relative/path-no-leading-slash",
      duration: "session",
    };
    const gate = new PermissionGate({ ...POLICY, scopedExceptions: [malformed] });
    const d = gate.decide(call({ tool: "read", operation: "read", args: { path: "/repo/.env" }, scopePaths: ["/repo"] }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /protected path/);
  });

  it("empty-provenance stored exceptions are inert", () => {
    const malformed = {
      userDirect: true,
      interpretedBy: "dispatcher" as const,
      appliedBy: "writer" as const,
      provenance: "",
      change: "read env",
      scope: "/repo",
      duration: "session",
    };
    const gate = new PermissionGate({ ...POLICY, scopedExceptions: [malformed] });
    const d = gate.decide(call({ tool: "read", operation: "read", args: { path: "/repo/.env" }, scopePaths: ["/repo"] }));
    assert.equal(d.outcome, "deny-and-log");
  });
});

describe("fail-closed and narrowing", () => {
  it("thrown errors fail closed", () => {
    const gate = new PermissionGate(POLICY);
    const evil: Record<string, unknown> = {};
    Object.defineProperty(evil, "boom", { enumerable: true, get(): unknown { throw new Error("poison"); } });
    const d = gate.decide(call({ args: evil }));
    assert.equal(d.outcome, "fail-closed");
    assert.equal(d.parked, true);
  });

  it("before_agent_start narrowing restricts only, never adds", () => {
    const gate = new PermissionGate(POLICY);
    const narrowed = gate.narrowTools("seeker", ["read", "write", "shell_git_show", "mystery_tool"]);
    assert.deepEqual(narrowed, ["read", "shell_git_show"]);
  });
});
