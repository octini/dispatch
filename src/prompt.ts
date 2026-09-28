// Prompt assembly. Authority: F8-Q7 (prompt core + budgets), F12-Q3 (three-item
// re-injection set), F12-Q7 (skill bodies on exposure budget), F14 (style core
// sandwich), F15-RD-03 (claim rule, once, one home), F8-Q9 (trim order).
//
// F8-Q7 prompt core = seat instructions + thin always-on layer +
// the F12-Q3 three-item re-injection set. Skill bodies ride the disclosed
// exposure budget (F12-Q7). Joint required-content overage = build refusal,
// never a silent trim (PS-SEAM-09).
//
// CAP SCOPE (PS-INV-05 alignment): the PROMPT_CORE_HARD_CAP binds the
// authored prompt core — seat instructions + thin always-on layer +
// re-injection set + TOP style copy + claim rule + always-on skill metadata
// (+ caller-kept evidence trims). The BOTTOM style copy counts in the
// EXPOSURE ledger with lazy skill bodies (STYLE-Q5 split); it never counts
// toward the 1000 prompt-core cap. Record: PS-INV-05 settles the split;
// the FIND-2 assembled-string note is superseded and not enforced.
//
// EXPOSURE BOUND (band re-check, unanimous) PINNED (user-worded 2026-09-28): The exposure budget (the lazy skill bodies + tool schemas + injected policy + handoff material per F8-PS-09) is a CONFIGURABLE BOUND — the default is 2000 tokens (DEFAULT_EXPOSURE_BOUND); warnings at 75%; the breach path is enforced now: the F8-Q9 trim order (evidence, then skill-meta) then park/escalate — never unbounded, never silent.

import type { SeatId } from "./config.js";
import * as dispatcher from "./seats/dispatcher.js";
import * as writer from "./seats/writer.js";
import * as seeker from "./seats/seeker.js";
import * as expert from "./seats/expert.js";

export const PROMPT_CORE_TARGET = 500;
export const PROMPT_CORE_HARD_CAP = 1000;
/** Slice-4 exposure ledger bound PINNED (user-worded 2026-09-28): default 2000 tokens, configurable; warnings at 75%; breach = the F8-Q9 trim/park path. */
export const DEFAULT_EXPOSURE_BOUND = 2000 as const;
export const EXPOSURE_WARN_FRACTION = 0.75 as const;
export const EXPOSURE_BOUND_PIN = "PINNED 2000 tokens (user-worded 2026-09-28; warnings at 75%; breach F8-Q9 trim/park)" as const;

type SeatModule = typeof dispatcher | typeof writer | typeof seeker | typeof expert;

const SEATS: Record<SeatId, SeatModule> = { dispatcher, writer, seeker, expert };

/**
 * F14-WS-01 shared core. EXACT approved core text from
 * docs/features/writing-style.md section 2.1 — never edited, never trimmed.
 */
export const STYLE_CORE =
  "1. Lead with the result or action. Outcome first, then reason. " +
  "2. Use active voice and simple tenses. Name the actor every sentence. " +
  "3. Prefer simple verbs and keep one word to one meaning. Never use pompous verbs: utilize, leverage, facilitate, commence, delve, or similar wording. " +
  "4. Keep instructions under 20 words and explanations under 25. Put one instruction in each sentence. " +
  "5. Write no preamble, recap, closer, em-dash, \"not X, it's Y\" contrast, rule-of-three list, or throat-clearing. " +
  "6. Cover one topic per paragraph of at most 6 sentences. Cap every list at 5 items. " +
  "7. In conversational output only, restate the current state each turn and end with one concrete next step. " +
  "8. Quote code, paths, errors, and user words verbatim. Accuracy beats brevity every time. " +
  "Escape hatch (Orwell rule 6): break any rule above sooner than say anything outright barbarous. Disclose the break. " +
  "Never compress to save space. Validation, error handling, auth, secrets, and deletes stay complete.";

/**
 * F15-RD-03 claim rule. Draft text from docs/features/retrieval-discipline.md
 * section 2.6. Exactly one home: the F8-Q7 prompt core, inside the F12-Q3
 * re-injection set. Counted ONCE.
 */
export const CLAIM_RULE =
  "Cite or fetch each outside fact. Each claim carries a source link, a file:line note, or user-instruction attribution. Drop a claim with no source. Disclose the gap aloud.";

/** F12-Q3 item 1: the thin always-on layer (the F9-Q2 AGENTS.md block). */
export const THIN_ALWAYS_ON_LAYER =
  "Dispatch seats act in scoped roles. Retrieve before asserting outside facts. Disclose gaps aloud. Never act past authority.";

/** Skill index: seat-filtered METADATA only. Bodies lazy-load onto the
 * exposure budget (F8-PS-05). Roster names per F8-PS-01; bodies are
 * downstream (inside-artifact shipment, F8-PS-08). */
export interface SkillMeta {
  name: string;
  seats: SeatId[];
  required: boolean;
}

export const SKILL_INDEX: SkillMeta[] = [
  { name: "grilling", seats: ["dispatcher"], required: false },
  { name: "to-tickets", seats: ["dispatcher"], required: false },
  { name: "to-questionnaire", seats: ["dispatcher"], required: false },
  { name: "wayfinder", seats: ["dispatcher"], required: false },
  { name: "verification-planning", seats: ["dispatcher"], required: false },
  { name: "tdd", seats: ["writer"], required: false },
  { name: "diagnosing-bugs", seats: ["writer"], required: false },
  { name: "receiving-code-review", seats: ["writer"], required: false },
  { name: "api-and-interface-design", seats: ["writer"], required: false },
  { name: "security-and-hardening", seats: ["writer"], required: false },
  { name: "code-simplification", seats: ["writer"], required: false },
  { name: "finishing-a-development-branch", seats: ["writer"], required: false },
  { name: "bmad-build-auto", seats: ["writer"], required: false },
  { name: "source-grounding", seats: ["seeker"], required: false },
  { name: "deep-recon", seats: ["seeker"], required: false },
  { name: "web-retrieval", seats: ["seeker"], required: false },
  { name: "code-review", seats: ["expert"], required: false },
  { name: "doubt-driven-development", seats: ["expert"], required: false },
  { name: "verify-before-claim", seats: ["dispatcher", "writer", "seeker", "expert"], required: false },
];

/** Seat-filtered skill metadata for one seat. */
export function skillIndexFor(seat: SeatId): SkillMeta[] {
  return SKILL_INDEX.filter((s) => s.seats.includes(seat));
}

/**
 * Lazy skill-body load. Bodies ride the exposure budget; this stub reports
 * the lazy contract (real bodies ship inside the artifact per F8-PS-08).
 */
export function loadSkillBody(name: string): { name: string; body: string; budget: "exposure" } {
  const meta = SKILL_INDEX.find((s) => s.name === name);
  if (meta === undefined) throw new Error(`unknown skill: ${name}`);
  return { name, body: `[lazy body for ${name}; ships inside the plugin artifact]`, budget: "exposure" };
}

/**
 * Token estimate. The TOKEN UNIT is UNVERIFIED overall (PIN-RECORD 10.1; PS-SEAM-15:
 * budget certification REFUSED without the pin record). Retrieval-recorded 2026-09-29:
 * the work-path unit (the three gpt-5.6 SKUs) is o200k_base; Go-path seats stay
 * UNVERIFIED. Whitespace-separated tokens are the declared placeholder only.
 */
export function estimateTokens_UNVERIFIED(text: string): number {
  const tokens = text.split(/\s+/).filter((t) => t.length > 0);
  return tokens.length;
}

export function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  return haystack.split(needle).length - 1;
}

export interface PromptCoreInput {
  seat: SeatId;
  /** Caller-supplied living-spec pointer (F12-Q3 item 3); revision supplied, never invented. */
  livingSpecPointer: string;
  /** Optional evidence trims FIRST under pressure (F8-Q9 order). */
  optionalEvidence?: string[];
  /** Non-required skill metadata lines trims SECOND. Required content never trims. */
  extraSkillMeta?: string[];
  /** Lazy skill bodies charged to the exposure budget (F8-PS-09). Absent by
   * default; supplied by the caller when bodies load for a turn. */
  exposureBodies?: string[];
  /** Test-configured exposure bound. Absent = the pinned default
   * DEFAULT_EXPOSURE_BOUND (2000, user-worded 2026-09-28). */
  exposureBoundForTest?: number;
  /** PS-GATE-08 migration guard (UNVERIFIED): a pinned-tokenizer count for the
   * required text, when known. The budget assert refuses on the HIGHER of the
   * placeholder and pinned counts — an undercount never silently trims. */
  pinnedTokens_UNVERIFIED?: number;
}

export interface PromptCoreResult {
  /** Assembled prompt: style core TOP + seat + re-injection set + claim-once + style BOTTOM. */
  prompt: string;
  /** F8-Q7 authored-prompt figure: seat + thin layer + re-injection set + style TOP + claim. */
  coreTokens: number;
  /** Exposure figure: skill bodies + style BOTTOM copy. */
  exposureTokens: number;
  warnings: string[];
  /** True only when REQUIRED content jointly exceeds the hard cap (F8-Q9). */
  refused: boolean;
  claimCount: number;
}

/** F12-Q3 three-item re-injection set, assembled for one seat. Never trimmed. */
export function buildReinjectionSet(seat: SeatId, livingSpecPointer: string): string[] {
  const summaries = (Object.keys(SEATS) as SeatId[]).map((id) => SEATS[id].hardRuleSummary);
  return [
    `Always-on layer: ${THIN_ALWAYS_ON_LAYER}`,
    `Seat hard rules: ${summaries.join(" | ")}`,
    `Living spec: ${livingSpecPointer}`,
  ];
}

export function buildPromptCore(input: PromptCoreInput): PromptCoreResult {
  const seat = SEATS[input.seat];
  const warnings: string[] = [];

  const requiredParts = [
    `Style core (top): ${STYLE_CORE}`,
    `Seat ${seat.id}: ${seat.instructions}`,
    `Seat style: ${seat.styleOverlay}`,
    ...buildReinjectionSet(input.seat, input.livingSpecPointer).map((item) => `Re-inject: ${item}`),
    `Claim rule: ${CLAIM_RULE}`,
  ];
  const requiredText = requiredParts.join("\n");
  const requiredTokens = estimateTokens_UNVERIFIED(requiredText);
  // PS-GATE-08 migration guard: the pinned count, when supplied, joins the
  // assert — refusal on the higher count, never a silent trim on an undercount.
  const effectiveRequired = Math.max(requiredTokens, input.pinnedTokens_UNVERIFIED ?? requiredTokens);

  // F8-Q9: required-content joint overage = build refusal, never silent trim.
  if (effectiveRequired > PROMPT_CORE_HARD_CAP) {
    return {
      prompt: "",
      coreTokens: requiredTokens,
      exposureTokens: estimateTokens_UNVERIFIED(STYLE_CORE),
      warnings: [`REFUSED: required prompt core ${effectiveRequired} exceeds hard cap ${PROMPT_CORE_HARD_CAP}`],
      refused: true,
      claimCount: 1,
    };
  }

  // Trimmable, in F8-Q9 order: optional evidence first, then non-required skill meta.
  let trimmable = [...(input.optionalEvidence ?? []), ...(input.extraSkillMeta ?? [])];
  let evidenceNote = "";
  if (trimmable.length > 0) {
    const fullText = `${requiredText}\n${trimmable.join("\n")}`;
    if (estimateTokens_UNVERIFIED(fullText) > PROMPT_CORE_HARD_CAP) {
      const droppedEvidence = (input.optionalEvidence ?? []).length;
      if (droppedEvidence > 0) warnings.push(`trimmed ${droppedEvidence} optional evidence item(s)`);
      trimmable = [...(input.extraSkillMeta ?? [])];
      const retry = `${requiredText}\n${trimmable.join("\n")}`;
      if (trimmable.length > 0 && estimateTokens_UNVERIFIED(retry) > PROMPT_CORE_HARD_CAP) {
        warnings.push(`trimmed ${trimmable.length} non-required skill item(s)`);
        trimmable = [];
      }
    }
    if (trimmable.length > 0) evidenceNote = `\n${trimmable.join("\n")}`;
  }

  // Sandwich (STYLE-Q5 / PS-INV-05 alignment): TOP counts authored (in
  // requiredText above); BOTTOM counts exposure only — never the core cap.
  const prompt = `${requiredText}${evidenceNote}\nStyle core (bottom): ${STYLE_CORE}`;
  const coreTokens = estimateTokens_UNVERIFIED(`${requiredText}${evidenceNote}`);
  const bodiesTokens =
    (input.exposureBodies ?? []).length > 0 ? estimateTokens_UNVERIFIED((input.exposureBodies ?? []).join("\n")) : 0;
  const exposureTokens = estimateTokens_UNVERIFIED(STYLE_CORE) + bodiesTokens;
  // EXPOSURE BOUND enforcement PINNED (user-worded 2026-09-28): the F8-Q9 trim order (evidence, then
  // skill-meta) already ran above against the core cap; an exposure-ledger
  // breach past the bound parks/escalates here — never unbounded, never silent.
  // The bound is configurable per call; the default is DEFAULT_EXPOSURE_BOUND (2000).
  const exposureBound = input.exposureBoundForTest ?? DEFAULT_EXPOSURE_BOUND;
  if (exposureTokens > exposureBound) {
    return {
      prompt: "",
      coreTokens,
      exposureTokens,
      warnings: [
        ...warnings,
        `PARKED: exposure ${exposureTokens} exceeds bound ${exposureBound}: F8-Q9 trim/park path — lazy bodies never run unbounded`,
      ],
      refused: true,
      claimCount: 1,
    };
  }
  if (exposureTokens > exposureBound * EXPOSURE_WARN_FRACTION) {
    warnings.push(`exposure ${exposureTokens} exceeds 75% of bound ${exposureBound} (warn threshold ${exposureBound * EXPOSURE_WARN_FRACTION})`);
  }
  if (coreTokens > PROMPT_CORE_TARGET) {
    warnings.push(`core ${coreTokens} exceeds ${PROMPT_CORE_TARGET} target (hard cap ${PROMPT_CORE_HARD_CAP})`);
  }

  return {
    prompt,
    coreTokens,
    exposureTokens,
    warnings,
    refused: false,
    claimCount: countOccurrences(prompt, CLAIM_RULE),
  };
}
