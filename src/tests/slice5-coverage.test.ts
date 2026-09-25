// Slice 5 rule-coverage index: every F6/F9-installer/F13/release rule maps to
// >=1 test. This file asserts the index is complete; the named tests hold the
// behavior. Record: this index is NOT coverage evidence; the named tests are.
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const RULES = [
  "F6-PD-01",
  "F6-PD-02",
  "F6-PD-03",
  "F6-PD-04",
  "F6-PD-05",
  "F6-PD-09",
  "F6-Q2",
  "BQ8",
  "F9-BS-08",
  "F9-Q7",
  "MANIFEST-CLASSES",
  "F9-C7",
  "F13-VH-01",
  "F13-VH-02",
  "F13-VH-03",
  "F13-VH-04",
  "F13-VH-05",
  "F13-VH-06",
  "F13-VH-07",
  "F13-VH-08",
  "F13-VH-09",
  "F13-VH-10",
  "F13-VH-11",
  "PS-SEAM-07",
  "PS-SEAM-13",
  "PS-GATE-08",
] as const;

const COVERAGE: Record<string, string> = {
  "F6-PD-01": "update.test.ts: git-tag primary, npm never a blocker",
  "F6-PD-02": "update.test.ts: drift warn-only, keeps serving the pin",
  "F6-PD-03": "update.test.ts: SHA sole authority, mismatch refuses, moved tag disclosed",
  "F6-PD-04": "update.test.ts: staging-and-swap, pre-swap verify, next-restart, outage keeps current",
  "F6-PD-05": "update.test.ts: never-downgrade, user revert carve-out, kept prior, Q6 prune gate",
  "F6-PD-09": "update.test.ts: refuse/warn/override, stricter-on-uncertain",
  "F6-Q2": "update.test.ts: manual bump advances, self-update reconciles never advances",
  "BQ8": "update.test.ts: ONE automatic revert with disclosure, park on the second failure",
  "F9-BS-08": "installer.test.ts: below-floor not-set-up, verified upgrade or park",
  "F9-Q7": "installer.test.ts: per-OS selection, checksum-verified install",
  "MANIFEST-CLASSES": "installer.test.ts: verification-before-execution, reference-only never executes",
  "F9-C7": "installer.test.ts: step→switch table gates install and upgrade",
  "F13-VH-01": "harness.test.ts: both lanes green in v1; ci.yml matrix windows+macos",
  "F13-VH-02": "harness.test.ts: requirement-complete coverage, adversarial scenario required",
  "F13-VH-03": "harness.test.ts: 13 S-scenarios, reviewed drafts",
  "F13-VH-04": "harness.test.ts: triple entry gate",
  "F13-VH-05": "harness.test.ts: exit bar, no numeric thresholds; release.test.ts: objective floor",
  "F13-VH-06": "harness.test.ts: falsifier counters record-only",
  "F13-VH-07": "harness.test.ts: resume-hit record-only",
  "F13-VH-08": "harness.test.ts: rollback flip+revoke+preserve, reproduced-green re-entry",
  "F13-VH-09": "harness.test.ts: gaodes fallback-only verify-then-admit",
  "F13-VH-10": "harness.test.ts: re-pin version+SHA+drift, undisclosed drift violates",
  "F13-VH-11": "harness.test.ts: match-or-block at both gates",
  "PS-SEAM-07": "release.test.ts: signed AGPL boundary review ship blocker",
  "PS-SEAM-13": "harness.test.ts: coverage mapping; slice5-coverage index",
  "PS-GATE-08": "release.test.ts: pin-record complete check, never fills",
};

describe("slice 5 rule coverage", () => {
  it("every slice-5 rule maps to >=1 test", () => {
    for (const id of RULES) assert.ok(COVERAGE[id] !== undefined && COVERAGE[id].length > 0, `no test for ${id}`);
  });
});
