// F15 review-gate hooks (F15-RD-05/06): the attribution cold read at every
// review, the promotion-ladder state, and designated-review routing to the F16
// council. Extends the Slice 3 claims module (detector.ts) at its seams:
// detector-first (the mechanical check runs before any block), and blocking
// promotion requires pilot evidence plus the user's sign-off (RD-Q3).
import {
  carrySourcesStrict,
  createReviewGateHook,
  detectClaims,
  extractSourceLinks,
  type ColdReadFinding,
} from "./detector.js";

export type { ColdReadFinding };

/** Promotion ladder per rule: proposed to piloted to user-signed to blocking. */
export type PromotionState = "proposed" | "piloted" | "user-signed" | "blocking";

export interface PromotionEvidence {
  pilotEvidence: boolean;
  userSignoff: boolean;
}

/** A claim rule becomes blocking ONLY after pilot evidence plus explicit user
 * sign-off — never sooner. Semantic claim judgment is NEVER check-only; it
 * judges through the review-gate cold read. */
export function advancePromotion(state: PromotionState, evidence: PromotionEvidence): PromotionState {
  if (state === "proposed" && evidence.pilotEvidence) return "piloted";
  if (state === "piloted" && evidence.userSignoff) return "user-signed";
  if (state === "user-signed" && evidence.pilotEvidence && evidence.userSignoff) return "blocking";
  return state;
}

export type ReviewKind = "routine" | "designated";

export type ReviewRoute = "expert-solo" | "council";

/** Designated reviews route the cold-read hook to the F16 council. The council
 * sink is injected — this module owns the route, never the council mechanics. */
export interface CouncilSink {
  conveneDesignated(report: { caseId: string; findings: ColdReadFinding[] }): { convened: boolean; caseId: string };
}

export interface ReviewGateResult {
  findings: ColdReadFinding[];
  routedTo: ReviewRoute;
  /** Detector-first: blocking only when the promoted rule fires on a finding. */
  blocking: boolean;
  council?: { convened: boolean; caseId: string };
  /** The hook's English-first limitation disclosure rides the result (F4). */
  disclosure: string;
}

export interface RunReviewGateInput {
  kind: ReviewKind;
  output: string;
  caseId: string;
  promotion: PromotionState;
  council?: CouncilSink;
}

/** Review-gate hook: cold-read attribution at every review (F15-RD-05).
 * Expert solo takes routine reviews; the F16 council takes designated ones. */
export function runReviewGate(input: RunReviewGateInput): ReviewGateResult {
  const hook = createReviewGateHook({
    pilotEvidence: input.promotion === "blocking",
    userSignoff: input.promotion === "blocking",
  });
  const raw = detectClaims(input.output);
  const findings: ColdReadFinding[] = raw.map((f) => {
    const carried = carrySourcesStrict(f.claim, extractSourceLinks(f.claim), "disclose");
    return carried.disclosure !== undefined
      ? { claim: carried.content, attribution: f.attribution, sources: carried.sources, disclosure: carried.disclosure }
      : { claim: carried.content, attribution: f.attribution, sources: carried.sources };
  });
  const blocking = input.promotion === "blocking" && findings.length > 0;
  if (input.kind === "designated") {
    if (input.council === undefined) {
      throw new Error("designated review requires the F16 council route — no council sink");
    }
    const council = input.council.conveneDesignated({ caseId: input.caseId, findings });
    return { findings, routedTo: "council", blocking, council, disclosure: hook.languageScope };
  }
  return { findings, routedTo: "expert-solo", blocking, disclosure: hook.languageScope };
}
