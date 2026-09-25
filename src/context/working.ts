// F12 working context (F12-WC-01..09): the Magic path-(a) pin (disable-historian
// + native compaction, recorded selection gate — the probe result returns to
// the user before anything pins), the task-scoped archive (the archive follows
// the TASK ID across rollover/reuse, F12-WC-05), the NEVER-TRIM set (the F12-Q3
// three-item re-injection in the prompt-core budget), the NO-implicit-promotion
// rule (archives are recall sources only; F11 admission is the gate), and the
// user-only purge (F12-WC-09 — no auto-deletion, ever).
import { buildReinjectionSet } from "../prompt.js";

export type SeatScope = "seeker-full" | "writer-task-scoped" | "list-only";

/** Magic path-a pinned per SCHED-05: disable-historian + native compaction. */
export const MAGIC_PATH = "a (disable-historian + native compaction)" as const;

/** Single compressor owner — NEVER both summarizing (non-negotiable). */
export function assertSingleCompressor(nativeSummarizing: boolean, magicSummarizing: boolean): void {
  if (nativeSummarizing && magicSummarizing) {
    throw new Error("dual compress refused: single compressor owner, never both summarizing (F12-WC-01)");
  }
}

/** Selection gate (F12-WC-01): the probe result returns to the USER before
 * anything pins — no path lock-in without user review. */
export function gatePathPin(userSawProbeResult: boolean): { pinned: typeof MAGIC_PATH } {
  if (!userSawProbeResult) throw new Error("path pin refused: probe result returns to the user first (F12-WC-01)");
  return { pinned: MAGIC_PATH };
}

/** Archiver model (F12-WC-02): the Seeker-tier pattern, same composition as the
 * F11 verifier. Per-pass cost + rate bound VALUES are UNVERIFIED section-7 pins. */
export const ARCHIVER_TIER = "seeker-tier" as const;
export const ARCHIVER_BOUNDS = "UNVERIFIED (per-pass cost + rate bounds; no values set here)" as const;

/** Atomic archive pass: a bound breach discards CLEANLY — no partial entry —
 * and parks for bounded F5 retry; never silent truncation. */
export function atomicArchivePass(boundBreached: boolean): { persisted: boolean; parked: boolean } {
  if (boundBreached) return { persisted: false, parked: true };
  return { persisted: true, parked: false };
}

/** Print/headless rule (F12-WC-06): ZERO sidecars in ANY non-interactive
 * invocation; F1's delegation-envelope evidence return is the DECLARED SOLE
 * CHANNEL for headless children's work. */
export function assertZeroSidecars(sidecars: string[]): void {
  if (sidecars.length > 0) throw new Error(`print/headless refused: zero sidecars, found ${sidecars.length} (F12-WC-06)`);
}

/** Recorded safety facts (F12-WC-07) with provenance — probe/install
 * verification per fact, never asserted as proven here. */
export const SAFETY_FACTS =
  "UNVERIFIED record: cancellable summarization; overflow retry; 2000-char tool-result cap (probe-verified before build); firstKeptEntryId/tokensBefore (probe-verified at build); Pi min-version drift + token defaults (live-verify at install); gpt-5.6 alias distrusted until live picker pins" as const;

/** The Writer's archive follows the TASK ID across F5 rollover and reuse. */
export function taskArchive(taskId: string): { key: string; scope: SeatScope } {
  return { key: `task-archive:${taskId}`, scope: "writer-task-scoped" };
}

/** Per-seat archive surfaces mirror the F10 pattern (bounded snippets). */
export function archiveScope(seat: "seeker" | "writer" | "dispatcher" | "expert"): SeatScope {
  if (seat === "seeker") return "seeker-full";
  if (seat === "writer") return "writer-task-scoped";
  return "list-only";
}

/** NEVER-TRIM set: exactly the F12-Q3 three-item re-injection set, single-sourced. */
export function neverTrimSet(seat: "dispatcher" | "writer" | "seeker" | "expert", livingSpecPointer: string): string[] {
  const set = buildReinjectionSet(seat, livingSpecPointer);
  if (set.length !== 3) throw new Error("never-trim set violated: exactly three re-injection items (F12-WC-03)");
  return set;
}

/** NO-implicit-promotion: archives are recall sources only; durable promotion
 * happens ONLY through F11 staged admission (source link) or user direct writes. */
export function gateArchivePromotion(path: "f11-admission" | "user-direct" | "automatic"): { allowed: boolean } {
  if (path === "automatic") throw new Error("archive promotion blocked: F11 staged admission is the gate (F12-WC-04)");
  return { allowed: true };
}

/** Archive retention: no auto-deletion EVER; purge is an explicit USER-ONLY
 * disposition; only disposable diagnostics follow F5-Q5 limits. */
export function purgeArchives(disposition: { userDirected: boolean }): { purged: boolean } {
  if (!disposition.userDirected) throw new Error("archive purge refused: user-only disposition (F12-WC-09)");
  return { purged: true };
}
