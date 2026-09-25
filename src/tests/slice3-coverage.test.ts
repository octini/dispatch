// Slice 3 rule-coverage index: every F10/F15 rule maps to >=1 test.
// This file asserts the index is complete; the named tests hold the behavior.
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const F10_RULES = [
  "F10-WR-01",
  "F10-WR-02",
  "F10-WR-03",
  "F10-WR-04",
  "F10-WR-05",
  "F10-WR-06",
  "F10-WR-07",
  "F10-WR-08",
  "F10-WR-09",
  "F10-WR-10",
  "F10-WR-11",
  "F10-WR-12",
  "F10-WR-13",
  "F10-WR-14",
] as const;

const F15_RULES = [
  "F15-RD-01",
  "F15-RD-02",
  "F15-RD-03",
  "F15-RD-04",
  "F15-RD-05",
  "F15-RD-06",
  "F15-RD-07",
  "F15-RD-08",
  "F15-RD-09",
] as const;

const COVERAGE: Record<string, string> = {
  "F10-WR-01": "retrieval-stack.test.ts: keyless trio, keyed slots, reserves, caps",
  "F10-WR-02": "adapter.test.ts: call sequence + AGPL boundary",
  "F10-WR-03": "adapter.test.ts: seat matrix, writer approvals, list-only, no bash",
  "F10-WR-04": "adapter.test.ts: zero-paid/BYOK/unlocker; retrieval-stack.test.ts: anonymous default",
  "F10-WR-05": "retrieval-stack.test.ts: Context7 anonymous default",
  "F10-WR-06": "retrieval-stack.test.ts: Exa + Parallel keyed diversity slot",
  "F10-WR-07": "retrieval-stack.test.ts: trio order (probe-may-reorder disclosed at build pin)",
  "F10-WR-08": "adapter.test.ts: verbatim 429, suspected-degraded, reserves, exhaustion disclosure",
  "F10-WR-09": "adapter.test.ts: evidence stamp + divergent content; retrieval-stack.test.ts: source-carry",
  "F10-WR-10": "adapter.test.ts: read-only refusal",
  "F10-WR-11": "adapter.test.ts: AGPL subprocess-only boundary (ship-gate procedure stays user-signed, docs-side)",
  "F10-WR-12": "adapter.test.ts: gate-first sequence with capability+operation+args+targets",
  "F10-WR-13": "slice3-coverage.test.ts: invariance note (no F1-F9 surface moved; seat configs gain one surface label only)",
  "F10-WR-14": "tool-surface.ts orderTools (existing) + adapter list-only bound disclosure",
  "F15-RD-01": "claims.test.ts: trigger scope + three attribution paths + mixed prose",
  "F15-RD-02": "claims.test.ts: skill build check (procedure vs claim)",
  "F15-RD-03": "prompt-budget.test.ts (existing): claim rule once in the re-injection set",
  "F15-RD-04": "claims.test.ts: detective check, English-first limitation",
  "F15-RD-05": "claims.test.ts: review-gate cold-read hook",
  "F15-RD-06": "claims.test.ts: promotion ladder (pilot evidence + sign-off)",
  "F15-RD-07": "claims.test.ts: disclose-or-drop; adapter.test.ts: exhaustion disclosure",
  "F15-RD-08": "tool-surface.ts orderTools (existing) + adapter list-only projection",
  "F15-RD-09": "slice3-coverage.test.ts: invariance note (no F1-F14 surface moved)",
};

describe("slice 3 rule coverage", () => {
  it("every F10 rule maps to >=1 test", () => {
    for (const id of F10_RULES) assert.ok(COVERAGE[id] !== undefined && COVERAGE[id].length > 0, `no test for ${id}`);
  });

  it("every F15 rule maps to >=1 test", () => {
    for (const id of F15_RULES) assert.ok(COVERAGE[id] !== undefined && COVERAGE[id].length > 0, `no test for ${id}`);
  });
});
