// Claim/cite rules (F15-RD-01/02/04/07; F8-PS-13; F10-WR-09; F11-DM-10).
// Cite-or-fetch detector: heuristic over fresh-fact categories plus sentence
// patterns. English-first is a NAMED LIMITATION (mirrors STYLE-Q10):
// principles hold in any language; the mechanical check covers English.
// Failure behavior is disclose-or-drop (F15-RD-07): an unsourced claim is
// disclosed ("no source found") or dropped, never asserted silently.


/** Fresh-fact categories: always external (F15-RD-01). */
export const FRESH_FACT_CATEGORIES = [
  "versions",
  "prices",
  "apis",
  "library-behavior",
  "standards",
  "release-dates",
] as const;
export type FreshFactCategory = (typeof FRESH_FACT_CATEGORIES)[number];

/** Mechanical-check scope: English first (named limitation). */
export const DETECTOR_LANGUAGE_SCOPE = "English-first (mirrors STYLE-Q10); the Expert cold read judges all languages" as const;

/** Build-pin record (F4): the English-first scope may be narrowed or widened
 * only at the pin with the user's word. */
export const DETECTOR_LANGUAGE_SCOPE_PIN =
  "UNVERIFIED (section-7 build pin; narrowed or widened only at the pin with the user's word)" as const;

/** Uncarried-source disclosure (F3): never silently shed. */
export const SOURCE_NOT_CARRIED_DISCLOSURE = "source not carried" as const;

export type CarryMode = "disclose" | "drop";

export interface CarriedClaim {
  content: string;
  sources: string[];
  disclosure?: string;
  dropped: boolean;
}

/** Disclose-or-drop in the claims path (F3): an uncarried source is disclosed
 * ("source not carried") or the claim drops — never silently. Slice 4
 * next-wiring label stays (SOURCE_CARRY_NEXT_WIRING). */
export function carrySourcesStrict(content: string, sources: string[], mode: CarryMode = "disclose"): CarriedClaim {
  if (sources.length > 0) return { content, sources: [...sources], dropped: false };
  if (mode === "disclose") {
    return { content, sources: [], disclosure: `${SOURCE_NOT_CARRIED_DISCLOSURE}: ${content}`, dropped: false };
  }
  return { content: "", sources: [], dropped: true };
}

const CATEGORY_PATTERNS: { category: FreshFactCategory; pattern: RegExp }[] = [
  { category: "versions", pattern: /\bv\d+\.\d+|\bversion\s+\d|\b\d+\.\d+\.\d+/i },
  { category: "prices", pattern: /\$\s?\d|\bUSD\b|\bUSDC\b|\bcredits?\s*\/\s*mo\b|\bper\s+1M\b/i },
  { category: "apis", pattern: /\bAPI\b|\bendpoint\b|\b(GET|POST|PUT|DELETE)\b\s*\/?[a-z]|\brequest\b.*\bresponse\b/i },
  { category: "library-behavior", pattern: /\breturns?\b|\bthrows?\b|\bdefaults?\s+to\b|\bbehaves?\b/i },
  { category: "standards", pattern: /\bRFC\s*\d+|\bISO\b|\bW3C\b|\bspec\s+(says|requires|states)\b/i },
  { category: "release-dates", pattern: /\brelease[sd]?\b|\b20\d\d-\d\d-\d\d|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/i },
];

/** Sentence patterns asserting external facts. */
const CLAIM_PATTERNS: RegExp[] = [
  /\bis\s+(version|priced|released|available)\b/i,
  /\bcosts?\b/i,
  /\bwas\s+released\b/i,
  /\bas\s+of\b/i,
  /\bsupports?\b/i,
  /\baccording\s+to\b/i,
];

export type AttributionKind = "source-link" | "file:line" | "user-instruction";

const SOURCE_LINK = /https?:\/\/\S+/;
const FILE_LINE = /(?:^|[\s(])([\w./-]+\.[A-Za-z0-9]+:\d+(?::\d+)?)/;
const USER_INSTRUCTION = /\bper\s+(the\s+)?user\b|\buser-directed\b|\buser\s+instruction\b|\bon\s+the\s+user'?s\s+word\b|\buser\s+approved\b/i;
const QUOTED = /["'`„“]/;

export function freshFactCategories(sentence: string): FreshFactCategory[] {
  const found: FreshFactCategory[] = [];
  for (const { category, pattern } of CATEGORY_PATTERNS) {
    if (pattern.test(sentence)) found.push(category);
  }
  return found;
}

export function looksLikeClaim(sentence: string): boolean {
  if (freshFactCategories(sentence).length > 0) return true;
  return CLAIM_PATTERNS.some((p) => p.test(sentence));
}

/** Attribution split (F15-RD-01): source link, workspace file:line, or
 * user-instruction attribution. Quoted text inherits the traveling citation. */
export function classifyAttribution(sentence: string): AttributionKind | "none" {
  if (SOURCE_LINK.test(sentence)) return "source-link";
  if (FILE_LINE.test(sentence)) return "file:line";
  if (USER_INSTRUCTION.test(sentence)) return "user-instruction";
  return "none";
}

export interface ClaimFinding {
  claim: string;
  categories: FreshFactCategory[];
  attribution: AttributionKind | "none";
  /** True when a quote carries no traveling citation. */
  quotedWithoutSource: boolean;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Detective claim check (F15-RD-04): heuristic, report-only until promotion.
 * Internal reasoning and procedures stay free; thoughts are not claims. */
export function detectClaims(text: string): ClaimFinding[] {
  const findings: ClaimFinding[] = [];
  for (const sentence of splitSentences(text)) {
    if (!looksLikeClaim(sentence)) continue;
    const attribution = classifyAttribution(sentence);
    if (attribution !== "none") continue;
    findings.push({
      claim: sentence,
      categories: freshFactCategories(sentence),
      attribution: "none",
      quotedWithoutSource: QUOTED.test(sentence),
    });
  }
  return findings;
}

export type ClaimVerdict = "attributed" | "disclosed" | "dropped";

export interface ResolvedClaim {
  verdict: ClaimVerdict;
  /** Present only on disclose: the aloud gap text. */
  disclosure?: string;
}

/** Disclose-or-drop (F15-RD-07): never asserted silently. */
export function handleUnattributed(claim: string, mode: "disclose" | "drop"): ResolvedClaim {
  if (mode === "disclose") {
    return { verdict: "disclosed", disclosure: `no source found for: ${claim}` };
  }
  return { verdict: "dropped" };
}

/** Skill build check (F8-PS-13, build-time gate on static skill text):
 * procedures pass as plain text; claim-bearing lines must carry source links. */
export function checkSkillText(skillText: string): { pass: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const sentence of splitSentences(skillText)) {
    if (!looksLikeClaim(sentence)) continue;
    if (!SOURCE_LINK.test(sentence)) violations.push(`unsourced claim: ${sentence}`);
  }
  return { pass: violations.length === 0, violations };
}

export interface ColdReadFinding {
  claim: string;
  attribution: AttributionKind | "none";
  /** F11-DM-10: the claim's cited sources, carried into the review record
   * (empty for unattributed findings; recall/envelope wiring is Slice 4). */
  sources: string[];
  /** F3 disclose-or-drop: uncarried sources disclose here, never silently. */
  disclosure?: string;
}

const SOURCE_LINK_GLOBAL = /https?:\/\/\S+/g;

/** Source links embedded in a claim sentence (trailing sentence punctuation
 * stripped; it never belongs to the URL). */
export function extractSourceLinks(claim: string): string[] {
  return (claim.match(SOURCE_LINK_GLOBAL) ?? []).map((link) => link.replace(/[.,;:!?)]+$/, ""));
}

/** Review record entry (F11-DM-10): the cited claim with its sources. */
export interface ReviewRecord {
  claim: string;
  sources: string[];
  /** F3 disclose-or-drop: present when a source failed to carry. */
  disclosure?: string;
}

/** F11-DM-10 source-carry wiring into the claims path: cited claims carry
 * their sources into the review record. The true recall/envelope wiring
 * belongs to Slice 4 (the F11/F12 memory work). Disclose-or-drop (F3) holds
 * here now: an uncarried source discloses or the claim drops. */
export function citedClaimsWithSources(text: string, mode: CarryMode = "disclose"): ReviewRecord[] {
  const records: ReviewRecord[] = [];
  for (const sentence of splitSentences(text)) {
    if (!looksLikeClaim(sentence) || classifyAttribution(sentence) !== "source-link") continue;
    const carried = carrySourcesStrict(sentence, extractSourceLinks(sentence), mode);
    if (carried.dropped) continue;
    records.push(
      carried.disclosure !== undefined
        ? { claim: carried.content, sources: carried.sources, disclosure: carried.disclosure }
        : { claim: carried.content, sources: carried.sources },
    );
  }
  return records;
}

/** Review-gate cold-read hook (F15-RD-05): the interface, not the review
 * seats. Findings join the review report; blocking needs a promoted rule
 * (pilot evidence plus explicit user sign-off, F15-RD-06). */
export interface ReviewGateHook {
  coldRead(output: string): ColdReadFinding[];
  readonly blocking: boolean;
  /** F4 anchor: the English-first limitation discloses at the hook output. */
  readonly languageScope: typeof DETECTOR_LANGUAGE_SCOPE;
  readonly languageScopePin: typeof DETECTOR_LANGUAGE_SCOPE_PIN;
}

export function createReviewGateHook(options?: { pilotEvidence?: boolean; userSignoff?: boolean }): ReviewGateHook {
  const blocking = options?.pilotEvidence === true && options?.userSignoff === true;
  return {
    blocking,
    languageScope: DETECTOR_LANGUAGE_SCOPE,
    languageScopePin: DETECTOR_LANGUAGE_SCOPE_PIN,
    coldRead(output: string): ColdReadFinding[] {
      return detectClaims(output).map((f) => {
        const carried = carrySourcesStrict(f.claim, extractSourceLinks(f.claim), "disclose");
        return carried.disclosure !== undefined
          ? { claim: carried.content, attribution: f.attribution, sources: carried.sources, disclosure: carried.disclosure }
          : { claim: carried.content, attribution: f.attribution, sources: carried.sources };
      });
    },
  };
}
