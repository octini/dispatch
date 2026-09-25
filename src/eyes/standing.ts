// F17 epistemic standing + challenge path (F17-VL-11): the description is the
// eyes' BEST READING — a revisable claim, NEVER ground truth. Anyone (user,
// seat, review) may flag a description DISPUTED, forcing a re-read under the
// existing budgets; the original reading is preserved, never erased; a
// challenged reading is never silently accepted.
import type { EyesDescription } from "./consult.js";

export type ReadingStatus = "current" | "disputed";

export interface ChallengedReading {
  original: EyesDescription;
  status: ReadingStatus;
  /** Re-read runs under the existing budgets (fresh consult or user eyes). */
  reread: "fresh-consult" | "user-eyes";
}

/** Flag a description disputed: the original is preserved with its stamp. */
export function flagDisputed(
  reading: EyesDescription,
  reread: ChallengedReading["reread"],
): ChallengedReading {
  return { original: reading, status: "disputed", reread };
}

/** A challenged reading is never silently accepted — acceptance needs the re-read. */
export function acceptReading(challenge: ChallengedReading, rereadDone: boolean): EyesDescription {
  if (!rereadDone) throw new Error("challenged reading refused: re-read under existing budgets first");
  return challenge.original;
}
