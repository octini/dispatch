// F14 style core (F14-WS-01): the sandwiched core with budget accounting.
// The core TEXT is single-sourced from prompt.ts STYLE_CORE — verbatim, never
// trimmed, never edited here. Accounting (STYLE-Q5; PS-SEAM-09): the TOP copy
// counts in the F8-Q7 authored-prompt budget; the BOTTOM copy counts in the
// whole-prompt exposure budget. The 150-250 band binds one copy, not instances.
// Joint required-content hard-cap breach = build refusal, then park/escalate.
import { STYLE_CORE, countOccurrences, estimateTokens_UNVERIFIED } from "../prompt.js";

export { STYLE_CORE };

/** The 150-250 band binds the core TEXT (one copy), not its instances. */
export const STYLE_CORE_WORD_BAND = { min: 150, max: 250 } as const;

export type SandwichLedger = "authored" | "exposure";

/** TOP-copy-in-authored / BOTTOM-copy-in-exposure (STYLE-Q5). */
export const SANDWICH_ACCOUNTING = {
  top: "authored",
  bottom: "exposure",
} as const satisfies Record<"top" | "bottom", SandwichLedger>;

/** Whitespace-token count of the single core copy (spec method: 159; prose-only 151). */
export function coreWordCount(): number {
  return estimateTokens_UNVERIFIED(STYLE_CORE);
}

/** True when the core text binds one copy inside the approved band. */
export function coreInBand(): boolean {
  const n = coreWordCount();
  return n >= STYLE_CORE_WORD_BAND.min && n <= STYLE_CORE_WORD_BAND.max;
}

/** Sandwich check: the core rides verbatim at TOP and BOTTOM (two instances). */
export function assertSandwich(prompt: string): boolean {
  return countOccurrences(prompt, STYLE_CORE) === 2;
}

/** Source reuse gated by F6-Q4 verify-then-admit (F14-WS-07): style sources
 * contribute adapted text ONLY after license verification; unverified sources
 * stay idea-level. The asd-ste100 dictionary is NEVER copied. */
export function admitStyleSource(verifiedPermissive: boolean): { reuse: "adapted" } | { reuse: "idea-level" } {
  if (verifiedPermissive) return { reuse: "adapted" };
  return { reuse: "idea-level" };
}

export interface RequiredBreach {
  refused: true;
  /** F8-Q9 path: park/escalate — never a silent trim. */
  path: "F8-Q9 park/escalate";
  detail: string;
}

/** Hard-breach refusal-to-park: required content over the cap refuses, then parks. */
export function refuseRequiredBreach(detail: string): RequiredBreach {
  return {
    refused: true,
    path: "F8-Q9 park/escalate",
    detail: `REFUSED: required style content over hard cap — ${detail}; park/escalate, never silent trim`,
  };
}
