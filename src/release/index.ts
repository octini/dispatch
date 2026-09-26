// Dispatch Slice 5 — V1 release gate.
// Spec authority: PRIMARY-SPEC section 8 (F13-Q4's bar) + F13-VH-05/01 +
// PS-SEAM-07/13 + PS-GATE-08. The gate CHECKS the pin record, never fills it:
// open pins stay open here; an incomplete pin record blocks
// shipment. Enforcement is unverified until probes decide.

import { LOCK_TTL_PIN, PARK_DEADLINE_PIN } from "../beads/index.js";
import { STALENESS_MAX_AGE_PIN } from "../tracker/index.js";
import { SNIPPET_BOUND_STATUS, BACKOFF_STATUS } from "../adapter/donsetch-adapter.js";
import { TRAIL_FRESHNESS_WINDOW_PIN } from "../retrieval/stack.js";
import { PER_SKU_VISION_FLAGS } from "../eyes/classes.js";
import { bothLanesGreen, pilotExitBar, WATCHED_METRICS, type WatchedMetric } from "../harness/index.js";
import type { CiLane, LaneResult } from "../harness/index.js";

/**
 * Release-gating pins (PRIMARY-SPEC section 8 + PS-GATE-08 confirm): the lock
 * TTL/deadline, the staleness max-age, the snippet bound, the freshness
 * window, the lens SKUs. Single-sourced from their owning modules — the
 * gate reads them, never values them.
 */
export const RELEASE_GATING_PINS = {
  lockTtl: LOCK_TTL_PIN,
  parkDeadline: PARK_DEADLINE_PIN,
  stalenessMaxAge: STALENESS_MAX_AGE_PIN,
  snippetBound: SNIPPET_BOUND_STATUS,
  backoff: BACKOFF_STATUS,
  freshnessWindow: TRAIL_FRESHNESS_WINDOW_PIN,
  lensSkus: PER_SKU_VISION_FLAGS,
} as const;

export type PinValue = string;

export interface PinRecordInput {
  lockTtl: PinValue;
  parkDeadline: PinValue;
  stalenessMaxAge: PinValue;
  snippetBound: PinValue;
  freshnessWindow: PinValue;
  lensSkus: PinValue;
  tokenizer: PinValue;
}

/** Current pin-record state, read live from the owning modules (build-pin five pinned user-worded 2026-09-28; lens + tokenizer stay open). */
export function currentPinRecord(): PinRecordInput {
  return {
    lockTtl: LOCK_TTL_PIN,
    parkDeadline: PARK_DEADLINE_PIN,
    stalenessMaxAge: STALENESS_MAX_AGE_PIN,
    snippetBound: SNIPPET_BOUND_STATUS,
    freshnessWindow: TRAIL_FRESHNESS_WINDOW_PIN,
    lensSkus: PER_SKU_VISION_FLAGS,
    tokenizer: "UNVERIFIED",
  };
}

/** A pin counts as open while its value is UNVERIFIED in any suffixed shape. */
export function isPinOpen(value: PinValue): boolean {
  return value === "UNVERIFIED" || value.startsWith("UNVERIFIED") || value.trim() === "";
}

/** The gate never fills pins: an UNVERIFIED value in reads as UNVERIFIED out. */
export function checkPinRecord(pins: PinRecordInput): { complete: boolean; missing: string[] } {
  const missing = (Object.entries(pins) as Array<[string, string]>)
    .filter(([, v]) => isPinOpen(v))
    .map(([k]) => k);
  return { complete: missing.length === 0, missing };
}

export interface ReleaseGateInput {
  pins: PinRecordInput;
  /** F13-VH-05 objective floor: zero unexplained rollbacks. */
  unexplainedRollbacks: number;
  /** Refusal-string samples behaving as signed-off. */
  refusalStringsAsSignedOff: boolean;
  /** Both OSes green (F13-VH-01). */
  lanes: Record<CiLane, LaneResult>;
  /** PS-SEAM-07 ship blocker: the user-signed AGPL boundary review. */
  agplReviewSigned: boolean;
  /** F13-VH-08 mechanics present: flip + revocation + preservation + reproduced-green re-entry. */
  rollbackMechanicsDone: boolean;
  /** S-suite regression re-green at pilot exit. */
  sSuiteRegreen: boolean;
  /** User sign-off on the watched metrics. */
  userSignedOff: boolean;
}

/**
 * Objective-floor bar, IMPORTED explicitly from the harness (F13-VH-05/01):
 * zero unexplained rollbacks + refusal-string samples (via pilotExitBar) +
 * both-OSes green (via bothLanesGreen). Named here and checked by the gate.
 */
export interface ObjectiveFloorCheck {
  pass: boolean;
  reasons: string[];
}

export function checkObjectiveFloor(input: {
  unexplainedRollbacks: number;
  refusalStringsAsSignedOff: boolean;
  lanes: Record<CiLane, LaneResult>;
}): ObjectiveFloorCheck {
  const reasons: string[] = [];
  const lanesCheck = bothLanesGreen(input.lanes);
  if (!lanesCheck.pass) {
    reasons.push(`objective floor unmet (F13-VH-01, via harness bothLanesGreen): ${lanesCheck.reason}`);
  }
  const exitCheck = pilotExitBar({
    metricsRecorded: Object.fromEntries(WATCHED_METRICS.map((m) => [m, true])) as Record<WatchedMetric, boolean>,
    unexplainedRollbacks: input.unexplainedRollbacks,
    stringsAsSignedOff: input.refusalStringsAsSignedOff,
    userSignedOff: true,
  });
  if (!exitCheck.exit) {
    reasons.push(`objective floor unmet (F13-VH-05, via harness pilotExitBar): ${exitCheck.reason}`);
  }
  return { pass: reasons.length === 0, reasons };
}

export type ReleaseVerdict = "ship" | "blocked";

export interface ReleaseOutcome {
  verdict: ReleaseVerdict;
  reasons: string[];
}

/**
 * The pilot exits — and v1 ships — ONLY on the full bar (PRIMARY-SPEC
 * section 8). Any missing leg blocks; reasons name every missing leg.
 */
export function releaseGate(input: ReleaseGateInput): ReleaseOutcome {
  const reasons: string[] = [];
  const pinCheck = checkPinRecord(input.pins);
  if (!pinCheck.complete) {
    reasons.push(`pin record incomplete (PS-GATE-08 confirm): ${pinCheck.missing.join(", ")} UNVERIFIED — the gate checks pins, never fills them`);
  }
  const floor = checkObjectiveFloor({
    unexplainedRollbacks: input.unexplainedRollbacks,
    refusalStringsAsSignedOff: input.refusalStringsAsSignedOff,
    lanes: input.lanes,
  });
  reasons.push(...floor.reasons);
  if (!input.agplReviewSigned) {
    reasons.push("ship blocker: the SIGNED AGPL boundary review is missing — v1 cannot ship without the user-signed review (PS-SEAM-07)");
  }
  if (!input.rollbackMechanicsDone) {
    reasons.push("F13-VH-08 mechanics incomplete: rollback flip + grant revocation + ledger preservation + reproduced-green re-entry all required");
  }
  if (!input.sSuiteRegreen) {
    reasons.push("S-suite regression re-green at pilot exit missing (PRIMARY-SPEC section 8)");
  }
  if (!input.userSignedOff) {
    reasons.push("pilot exit BLOCKED without user sign-off on evidence, even when the floor holds (F13-VH-05)");
  }
  if (reasons.length > 0) return { verdict: "blocked", reasons };
  return { verdict: "ship", reasons: ["v1 release bar met: pins complete, floor holds, AGPL review signed, both lanes green, mechanics done, S-suite re-green, user signed off"] };
}
