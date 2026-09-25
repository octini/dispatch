// Deterministic style lint (F14-WS-03): mechanical rules only, detective-first,
// with a per-rule promotion ladder. Scope: natural-language prose in any
// language is in scope (principles apply); the MECHANICAL lint is ENGLISH-ONLY
// (named limitation, STYLE-Q10); machine/structured formats are out of scope.
// Carved-out spans (F14-WS-04 verbatim; F14-WS-05 never-compress) never trigger
// findings. Semantic rules are NEVER lint-only — they judge through the
// review-gate cold read via the editorial-guidance path (advisory, never
// blocking). STYLE-Q9: an explicit user instruction outranks a user-signed
// promoted blocking rule FOR THAT OUTPUT (disclosed); the finding still records.

export const LINT_LANGUAGE_SCOPE =
  "English-only mechanical lint (STYLE-Q10); the review-gate cold read judges all languages" as const;

/** Length caps from the core (rule 4): instructions under 20, explanations under 25. */
export const INSTRUCTION_CAP = 20;
export const EXPLANATION_CAP = 25;

/** Draft banned-phrase list (F14-WS-03) — final wording is section 7, never chosen here. */
export const BANNED_PHRASES = [
  "Here's the thing",
  "Great question",
  "Let me be clear",
  "It's worth noting",
  "delve",
  "leverage",
  "utilize",
  "seamless",
  "robust",
] as const;

/** Banned pompous verbs (STYLE-Q6) feeding the lint. */
export const BANNED_POMPOUS_VERBS = [
  "utilize",
  "leverage",
  "facilitate",
  "commence",
  "delve",
] as const;

export type LintRuleState = "proposed" | "piloted" | "user-signed" | "blocking";

export interface PromotionEvidence {
  pilotEvidence: boolean;
  userSignoff: boolean;
}

/** A rule promotes to BLOCKING only after pilot evidence plus explicit user
 * sign-off — never sooner (F13 composition). */
export function advanceLintRule(state: LintRuleState, evidence: PromotionEvidence): LintRuleState {
  if (state === "proposed" && evidence.pilotEvidence) return "piloted";
  if (state === "piloted" && evidence.userSignoff) return "user-signed";
  if (state === "user-signed" && evidence.pilotEvidence && evidence.userSignoff) return "blocking";
  return state;
}

export interface CarvedSpan {
  start: number;
  end: number;
}

export interface LintFinding {
  rule: string;
  span: string;
  state: LintRuleState;
  /** Detective-first: true until the rule is user-signed blocking. */
  reportOnly: boolean;
}

/** Remove carved-out spans (verbatim quotes, never-compress spans) before checking. */
export function applyCarveOuts(text: string, carved: CarvedSpan[]): string {
  const sorted = [...carved].sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const span of sorted) {
    out += text.slice(cursor, Math.max(cursor, span.start));
    cursor = Math.max(cursor, span.end);
  }
  return out + text.slice(cursor);
}

/** Quoted spans (code, paths, errors, user words) are carved out verbatim. */
export function extractQuotedSpans(text: string): CarvedSpan[] {
  const spans: CarvedSpan[] = [];
  const pattern = /"[^"]*"|`[^`]*`|'[^']*'/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    spans.push({ start: match.index, end: match.index + match[0].length });
  }
  return spans;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function words(sentence: string): number {
  return sentence.split(/\s+/).filter((t) => t.length > 0).length;
}

function listRunLength(lines: string[], at: number): number {
  let n = 0;
  for (let i = at; i < lines.length; i++) {
    if (/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i] ?? "")) n++;
    else break;
  }
  return n;
}

/** Mechanical lint over prose with carve-outs applied. Findings are REPORT-ONLY
 * until the firing rule is promoted to blocking. */
export function lintProse(
  text: string,
  carved: CarvedSpan[],
  ruleState: LintRuleState = "proposed",
): LintFinding[] {
  const findings: LintFinding[] = [];
  const reportOnly = ruleState !== "blocking";
  const visible = applyCarveOuts(text, carved);
  for (const sentence of splitSentences(visible)) {
    const n = words(sentence);
    if (n > EXPLANATION_CAP) {
      findings.push({ rule: "length-cap", span: sentence, state: ruleState, reportOnly });
    } else if (n > INSTRUCTION_CAP) {
      findings.push({ rule: "length-cap-advisory", span: sentence, state: ruleState, reportOnly });
    }
    if (sentence.includes("—")) {
      findings.push({ rule: "em-dash", span: sentence, state: ruleState, reportOnly });
    }
    const lowered = sentence.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lowered.includes(phrase.toLowerCase())) {
        findings.push({ rule: "banned-phrase", span: sentence, state: ruleState, reportOnly });
        break;
      }
    }
    for (const verb of BANNED_POMPOUS_VERBS) {
      if (new RegExp(`\\b${verb}\\b`, "i").test(sentence)) {
        findings.push({ rule: "pompous-verb", span: sentence, state: ruleState, reportOnly });
        break;
      }
    }
    if (/\bnot\s+.+,\s*it'?s\s+/i.test(sentence)) {
      findings.push({ rule: "not-x-its-y", span: sentence, state: ruleState, reportOnly });
    }
  }
  const lines = visible.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i] ?? "") && listRunLength(lines, i) > 5) {
      findings.push({ rule: "list-cap", span: lines.slice(i, i + 6).join("\n"), state: ruleState, reportOnly });
      i += listRunLength(lines, i);
    }
  }
  return findings;
}

export interface EditorialNote {
  /** Advisory only — the editorial path never blocks. */
  blocking: false;
  note: string;
}

/** Editorial-guidance path: semantic judgment (voice, clarity) rides the
 * review-gate cold read as guidance, never as a lint block. */
export function editorialGuidance(text: string): EditorialNote[] {
  const notes: EditorialNote[] = [];
  if (/\b(passive|was|were|been)\b/i.test(text) && /by\b/i.test(text)) {
    notes.push({ blocking: false, note: "cold-read guidance: check active voice with a named actor" });
  }
  if (splitSentences(text).some((s) => words(s) > INSTRUCTION_CAP)) {
    notes.push({ blocking: false, note: "cold-read guidance: check one instruction per sentence" });
  }
  return notes;
}

export interface InstructionConflict {
  explicitUserInstruction: boolean;
  disclosed: boolean;
}

export interface ConflictResolution {
  /** Suppressed for that output only; the finding still records. */
  suppressed: boolean;
  recorded: boolean;
  /** Undisclosed overrides and undisclosed breaks fail the review-gate check. */
  reviewGateFailure: boolean;
}

/** Live-instruction-wins precedence (STYLE-Q9): an explicit user instruction
 * outranks a signed blocking rule FOR THAT OUTPUT with disclosure. */
export function resolveInstructionConflict(conflict: InstructionConflict): ConflictResolution {
  if (!conflict.explicitUserInstruction) {
    return { suppressed: false, recorded: true, reviewGateFailure: false };
  }
  if (conflict.disclosed) {
    return { suppressed: true, recorded: true, reviewGateFailure: false };
  }
  return { suppressed: false, recorded: true, reviewGateFailure: true };
}
