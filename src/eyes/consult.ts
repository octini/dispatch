// F17 eyes flow (F17-VL-04/05): the multimodal Dispatcher reads directly (no
// routing, no invocation); otherwise a BOUNDED Seeker consult ("observe and
// report") returns a structured description plus image refs plus provenance.
// Consult semantics: NO verdict weight (Expert-consult pattern); the consult
// counts in the task's budgets + the F1-Q11 global-8 like any specialist
// invocation; the direct read consumes none. The eyes' description may serve a
// designated review as evidence with no verdict weight on the consult itself.

export type EyesPath = "direct-read" | "seeker-consult";

export interface EyesProvenance {
  images: string[];
  seat: "dispatcher" | "seeker";
  when: string;
}

export interface EyesDescription {
  description: string;
  imageRefs: string[];
  provenance: EyesProvenance;
  /** Revisable claim, never ground truth (F17-VL-11). */
  standing: "revisable-claim";
}

export interface RouteEyesInput {
  dispatcherMultimodal: boolean;
  independentEyesWanted: boolean;
}

/** The Dispatcher reads images itself when multimodal; otherwise — or when
 * independent eyes are wanted — a bounded consult goes to the Seeker. */
export function routeEyes(input: RouteEyesInput): EyesPath {
  if (input.dispatcherMultimodal && !input.independentEyesWanted) return "direct-read";
  return "seeker-consult";
}

/** The Dispatcher's direct-read notes carry the same provenance stamp. */
export function stampDirectRead(images: string[], when: string): EyesProvenance {
  return { images: [...images], seat: "dispatcher", when };
}

/** A consult return without refs or provenance is refused. */
export function assembleConsultReturn(input: {
  description: string;
  imageRefs: string[];
  provenance: EyesProvenance;
}): EyesDescription {
  if (input.imageRefs.length === 0) throw new Error("eyes consult refused: description without image refs");
  if (input.provenance.images.length === 0) throw new Error("eyes consult refused: description without provenance");
  return {
    description: input.description,
    imageRefs: [...input.imageRefs],
    provenance: { ...input.provenance, images: [...input.provenance.images] },
    standing: "revisable-claim",
  };
}

export interface EyesCharge {
  /** Task-budget invocations (direct read: none). Repair cycles: never. */
  taskInvocations: number;
  globalCeilingSlots: number;
  repairCycles: 0;
  verdictWeight: false;
}

/** Budget accounting: the consult bills task budgets + global-8, NEVER the
 * review repair cycles; the direct read consumes no invocation. */
export function chargeEyes(path: EyesPath): EyesCharge {
  if (path === "direct-read") {
    return { taskInvocations: 0, globalCeilingSlots: 0, repairCycles: 0, verdictWeight: false };
  }
  return { taskInvocations: 1, globalCeilingSlots: 1, repairCycles: 0, verdictWeight: false };
}
