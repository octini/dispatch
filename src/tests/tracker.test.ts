// Visual-tracker unit tests (F18-VT-01 … F18-VT-09).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. Named-open paths stay explicit: the TUI feasibility
// prototype (PS-GATE-06), the mount-visibility probe, and the section-7
// build pins (dimensions, intervals, caps). Those stay open until probes land.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BUILD_PINS,
  MANUAL_REFRESH_BYPASSES_RETRY_CAP,
  STALENESS_MAX_AGE_MS,
  STALENESS_MAX_AGE_PIN,
  createReadRetry,
  expandDeps,
  needsRefresh,
  panelAction,
  probeGate,
  probeHealth,
  renderBoard,
  renderReadError,
  renderStatusline,
  scopeAllows,
  seatPanelMutation,
  stalenessOf,
  surfaceWidening,
  type TrackerIssue,
  type TrackerSnapshot,
} from "../tracker/index.js";
import { SETUP_RETRY_CAP, freshFailures } from "../bootstrap/index.js";

function issue(over: Partial<TrackerIssue> & { id: string }): TrackerIssue {
  return {
    title: over.id,
    status: "open",
    assignee: null,
    priority: null,
    deps: [],
    createdAt: 1,
    ...over,
  };
}

function snap(over: Partial<TrackerSnapshot> = {}): TrackerSnapshot {
  return {
    projectRoot: "/repo",
    issues: [],
    readyOrder: [],
    currentTaskId: null,
    progressPath: null,
    progressPresent: false,
    lastRefreshedAt: 100,
    ...over,
  };
}

describe("statusline presence (F18-VT-01)", () => {
  it("shows the open count plus the next ready issue per the bd ready order", () => {
    const s = snap({
      issues: [issue({ id: "a" }), issue({ id: "b", status: "closed" }), issue({ id: "c" })],
      readyOrder: ["c", "a"],
    });
    const line = renderStatusline(s);
    assert.equal(line.openCount, 2);
    assert.equal(line.nextReadyId, "c");
    assert.equal(line.tieBreak, "bd-ready-order");
    assert.equal(line.lastRefreshedAt, 100);
  });

  it("empty bd order means no next-ready; nothing outside the ready list surfaces", () => {
    const s = snap({
      issues: [issue({ id: "new", createdAt: 20 }), issue({ id: "old", createdAt: 5 })],
      readyOrder: [],
    });
    const line = renderStatusline(s);
    assert.equal(line.nextReadyId, null);
    assert.equal(line.tieBreak, "none");
    assert.deepEqual(renderBoard(s, { depDepthCap: 3 }).ready, []);
  });

  it("the statusline always matches the board ready list", () => {
    const s = snap({
      issues: [issue({ id: "a" }), issue({ id: "b" })],
      readyOrder: ["b", "a"],
    });
    const line = renderStatusline(s);
    const board = renderBoard(s, { depDepthCap: 3 });
    assert.equal(line.nextReadyId, board.ready[0]?.id);
  });
});

describe("board render and selection (F18-VT-02)", () => {
  it("open/ready/blocked lists render with id, title, status, assignee, priority", () => {
    const s = snap({
      issues: [
        issue({ id: "a", title: "Alpha", assignee: "ryangking", priority: "1" }),
        issue({ id: "b", title: "Beta", status: "blocked" }),
      ],
      readyOrder: ["a"],
      currentTaskId: "a",
      progressPath: ".tgo/bd-a/progress.md",
      progressPresent: true,
    });
    const board = renderBoard(s, { depDepthCap: 3 });
    assert.equal(board.open.length, 2);
    assert.deepEqual(board.ready.map((r) => r.id), ["a"]);
    assert.deepEqual(board.blocked.map((r) => r.id), ["b"]);
    const row = board.open[0];
    assert.ok(row !== undefined);
    assert.deepEqual(Object.keys(row).sort(), ["assignee", "depChain", "id", "priority", "status", "title"]);
    assert.deepEqual(board.current, {
      issue: {
        id: "a",
        title: "Alpha",
        status: "open",
        assignee: "ryangking",
        priority: "1",
        depChain: { chain: [], truncated: false, depthCap: 3 },
      },
      progressPath: ".tgo/bd-a/progress.md",
    });
  });

  it("blocked covers status-blocked and unsatisfied deps", () => {
    const s = snap({
      issues: [issue({ id: "a" }), issue({ id: "b", deps: ["a"] }), issue({ id: "c", deps: ["b"] })],
      readyOrder: ["a"],
    });
    const board = renderBoard(s, { depDepthCap: 3 });
    assert.ok(board.blocked.some((r) => r.id === "b"));
    assert.ok(board.blocked.some((r) => r.id === "c"));
  });
});

describe("bounded dep expansion (F18-VT-02)", () => {
  it("expands issue to deps; no deps expands to an empty chain, never an error", () => {
    const byId = new Map([
      ["a", issue({ id: "a" })],
      ["b", issue({ id: "b", deps: ["a"] })],
    ]);
    assert.deepEqual(expandDeps("a", byId, 3), { chain: [], truncated: false, depthCap: 3 });
    assert.deepEqual(expandDeps("b", byId, 3).chain, ["a"]);
  });

  it("stops at the disclosed bound with truncation shown; a cycle never loops", () => {
    const byId = new Map([
      ["a", issue({ id: "a", deps: ["b"] })],
      ["b", issue({ id: "b", deps: ["a"] })],
    ]);
    const cyclic = expandDeps("a", byId, 5);
    assert.ok(cyclic.chain.length <= 2);
    assert.equal(cyclic.truncated, true);
    const deep = new Map([
      ["n0", issue({ id: "n0", deps: ["n1"] })],
      ["n1", issue({ id: "n1", deps: ["n2"] })],
      ["n2", issue({ id: "n2", deps: ["n3"] })],
      ["n3", issue({ id: "n3" })],
    ]);
    const capped = expandDeps("n0", deep, 1);
    assert.deepEqual(capped.chain, ["n1"]);
    assert.equal(capped.truncated, true);
  });

  it("renderBoard wires bounds.depDepthCap into each row chain", () => {
    const s = snap({
      issues: [
        issue({ id: "n0", deps: ["n1"] }),
        issue({ id: "n1", deps: ["n2"] }),
        issue({ id: "n2", deps: ["n3"] }),
        issue({ id: "n3" }),
      ],
      readyOrder: ["n0"],
    });
    const row = renderBoard(s, { depDepthCap: 1 }).open.find((r) => r.id === "n0");
    assert.deepEqual(row?.depChain, { chain: ["n1"], truncated: true, depthCap: 1 });
  });
});

describe("read-only v1 (F18-VT-03/04)", () => {
  it("panel claim/close/defer are refused; the F4-Q3 prose path is the way", () => {
    for (const action of ["claim", "close", "defer"] as const) {
      const r = panelAction(action);
      assert.equal(r.refused, true);
      assert.match(r.way, /F4-Q3/);
    }
  });

  it("no seat ever mutates through the panel", () => {
    for (const seat of ["dispatcher", "writer", "seeker", "expert"]) {
      const r = seatPanelMutation(seat);
      assert.equal(r.refused, true);
      assert.match(r.way, /typed-tools-only/);
    }
  });

  it("charts, history, and cross-project views are refused", () => {
    assert.equal(surfaceWidening("charts").refused, true);
    assert.equal(surfaceWidening("history").refused, true);
    assert.equal(surfaceWidening("cross-project").refused, true);
    assert.equal(scopeAllows("/repo", "/other").allowed, false);
    assert.equal(scopeAllows("/repo", "/repo").allowed, true);
  });
});

describe("refresh cadence and staleness (F18-VT-05)", () => {
  it("session events and manual refresh; outside-event edits wait", () => {
    assert.equal(needsRefresh("session_start", false), true);
    assert.equal(needsRefresh("tool_call", true), true);
    assert.equal(needsRefresh("tool_result", true), true);
    assert.equal(needsRefresh("tool_call", false), false);
    assert.equal(needsRefresh("manual", false), true);
    assert.equal(needsRefresh("external-edit", false), false);
  });

  it("board and statusline carry the last-refreshed indicator", () => {
    const s = snap({ issues: [issue({ id: "a" })], lastRefreshedAt: 4242 });
    assert.equal(renderStatusline(s).lastRefreshedAt, 4242);
    assert.equal(renderBoard(s, { depDepthCap: 3 }).lastRefreshedAt, 4242);
  });
});

describe("error state and bounded retry (F18-VT-09)", () => {
  it("an unreadable store renders an explicit error row, never blank", () => {
    const err = renderReadError("beads store unreadable", 2);
    assert.equal(err.error, true);
    assert.equal(err.neverBlank, true);
    assert.ok(err.message.length > 0);
  });

  it("backoff retry stops at the build-pinned cap", () => {
    const retry = createReadRetry(2);
    assert.deepEqual(retry.recordFailure(), { retry: true, backoff: "bounded" });
    assert.deepEqual(retry.recordFailure(), { retry: false, backoff: "bounded" });
    assert.equal(retry.exhausted, true);
  });

  it("manual refresh works independent of the retry cap", () => {
    assert.equal(MANUAL_REFRESH_BYPASSES_RETRY_CAP, true);
    assert.equal(needsRefresh("manual", false), true);
  });
});

describe("edge states (F18-VT-02)", () => {
  it("empty store renders no issues; zero current means no highlight; missing progress is disclosed", () => {
    const empty = renderBoard(snap(), { depDepthCap: 3 });
    assert.equal(empty.notice, "no issues");
    assert.equal(empty.current, null);
    const noCurrent = renderBoard(snap({ issues: [issue({ id: "a" })] }), { depDepthCap: 3 });
    assert.equal(noCurrent.current, null);
    assert.equal(noCurrent.notice, null);
    const noProgress = renderBoard(
      snap({ issues: [issue({ id: "a" })], currentTaskId: "a", progressPath: null, progressPresent: false }),
      { depDepthCap: 3 },
    );
    assert.deepEqual(noProgress.current, {
      issue: {
        id: "a",
        title: "a",
        status: "open",
        assignee: null,
        priority: null,
        depChain: { chain: [], truncated: false, depthCap: 3 },
      },
      progressAbsent: true,
    });
  });
});

describe("prototype gate and build pins (F18-VT-08)", () => {
  it("the probe hook stays UNVERIFIED without live wiring", () => {
    const gate = probeGate(null);
    assert.equal(gate.form, "UNVERIFIED");
  });

  it("mount-but-invisible fails the gate into the disclosed fallback", () => {
    assert.deepEqual(probeGate({ mounted: true, visible: true }), { form: "panel-tab" });
    assert.deepEqual(probeGate({ mounted: true, visible: false }), { form: "fallback-disclosed" });
    assert.deepEqual(probeGate({ mounted: false, visible: false }), { form: "fallback-disclosed" });
  });

  it("dimensions and intervals stay section-7 build pins", () => {
    assert.deepEqual(Object.values(BUILD_PINS), ["UNVERIFIED", "UNVERIFIED", "UNVERIFIED", "UNVERIFIED", "UNVERIFIED"]);
  });
});

describe("staleness legibility (BN-5)", () => {
  it("the threshold crossing shows a stale disclosure on the statusline, not just the timestamp", () => {
    const s = snap({ issues: [issue({ id: "a" })], readyOrder: ["a"], lastRefreshedAt: 100 });
    const fresh = renderStatusline(s, { now: 150, maxAgeMs: 1000 });
    assert.equal(fresh.stale, false);
    assert.equal(fresh.staleDisclosure, null);
    assert.equal(fresh.lastRefreshedAt, 100);
    const stale = renderStatusline(s, { now: 5000, maxAgeMs: 1000 });
    assert.equal(stale.stale, true);
    assert.match(stale.staleDisclosure ?? "", /stale/);
  });

  it("the board carries the same stale disclosure", () => {
    const s = snap({ issues: [issue({ id: "a" })], lastRefreshedAt: 100 });
    const fresh = renderBoard(s, { depDepthCap: 3 }, { now: 150, maxAgeMs: 1000 });
    assert.equal(fresh.stale, false);
    assert.equal(fresh.staleDisclosure, null);
    const stale = renderBoard(s, { depDepthCap: 3 }, { now: 5000, maxAgeMs: 1000 });
    assert.equal(stale.stale, true);
    assert.match(stale.staleDisclosure ?? "", /stale/);
  });

  it("the staleness max-age value is the pinned 120s user word (2026-09-28)", () => {
    assert.equal(STALENESS_MAX_AGE_MS, 120_000);
    assert.equal(STALENESS_MAX_AGE_PIN, "PINNED 120s (120000ms; user-worded 2026-09-28)");
    assert.deepEqual(stalenessOf(0, 10, 100), { stale: false, disclosure: null });
    assert.equal(stalenessOf(0, 1000, 100).stale, true);
  });
});

describe("probe null fail-open guard (missed item)", () => {
  it("a null probe shows a disclosed UNVERIFIED banner, never silent health", () => {
    const h = probeHealth(null);
    assert.equal(h.verified, false);
    assert.ok((h.banner ?? "").includes("UNVERIFIED"));
  });

  it("mounted-and-visible verifies with no banner; invisible falls back disclosed", () => {
    assert.deepEqual(probeHealth({ mounted: true, visible: true }), { verified: true, banner: null });
    const fallback = probeHealth({ mounted: true, visible: false });
    assert.equal(fallback.verified, false);
    assert.match(fallback.banner ?? "", /fallback-disclosed/);
  });
});

describe("retry-counter separation (missed item)", () => {
  it("tracker failed-read backoff is a separate surface from the bootstrap cap", () => {
    const retry = createReadRetry(1);
    assert.deepEqual(retry.recordFailure(), { retry: false, backoff: "bounded" });
    assert.equal(retry.exhausted, true);
    assert.equal(SETUP_RETRY_CAP, 3);
    assert.deepEqual(freshFailures(), { "step1-git": 0, "step2-settings": 0, "step3-beads": 0, "step4-agents": 0 });
  });
});
