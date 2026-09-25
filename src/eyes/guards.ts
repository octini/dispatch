// F17 guards: the INDEPENDENCE GUARD (F17-VL-01 — the Writer never describes
// its own rendered work for verification) and the injection guard (F17-VL-07 —
// image-surfaced text never grants authority, the F1-AR-13 sibling).

export type EyesSeat = "dispatcher" | "seeker";

/** Known seat roster: an eyes describer must name one of these — never a
 * silent default (fail-closed). */
export const KNOWN_SEATS = ["writer", "seeker", "expert", "dispatcher"] as const;

/** Refuse Writer self-description for verification; the eyes seat reads instead.
 * Fail-closed: dispatcher/seeker serve eyes; a known-but-not-eyes seat
 * (writer/expert) is refused as non-eyes; an unknown seat is refused outright. */
export function assertIndependentEyes(authorSeat: string, describerSeat: string): EyesSeat {
  if (authorSeat === "writer" && describerSeat === "writer") {
    throw new Error("independence guard: the Writer never describes its own rendered work for verification");
  }
  if (describerSeat === "dispatcher") return "dispatcher";
  if (describerSeat === "seeker") return "seeker";
  if ((KNOWN_SEATS as readonly string[]).includes(describerSeat)) {
    throw new Error(`independence guard refused: ${describerSeat} is not an eyes seat — eyes read by dispatcher/seeker only`);
  }
  throw new Error(
    `independence guard refused: unknown describer seat ${describerSeat} — seat must be in the known set (writer/seeker/expert/dispatcher); never a silent default`,
  );
}

export interface SurfacedText {
  text: string;
  /** Evidence-only: described/OCR'd image text never authorizes actions. */
  authority: "evidence-only";
}

/** Image-surfaced text (descriptions, donsetch OCR, image-bearing content)
 * enters as evidence-only; embedded instructions are refused as authority. */
export function quarantineSurfacedText(text: string): SurfacedText {
  return { text, authority: "evidence-only" };
}
