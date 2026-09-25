// F16 council run: the Dispatcher packages frozen revision-bound packets per
// lens and synthesizes under RECORD-NEVER-JUDGE — MECHANICAL RECORDING ONLY:
// the majority tally plus the lenses' own finding IDs copied plus the dissent
// line copied VERBATIM. Rewording and tie-breaking are FORBIDDEN.
import { LENSES, type CouncilVerdict, type LensFinding, type LensReturn, type Tally } from "./types.js";

/** Finding-ID uniqueness is validated at report assembly; duplicates fail. */
export function validateFindingIds(findings: LensFinding[]): string[] {
  const seen = new Set<string>();
  for (const finding of findings) {
    if (seen.has(finding.id)) throw new Error(`duplicate finding ID refused: ${finding.id}`);
    seen.add(finding.id);
  }
  return [...seen];
}

/** All three lenses must return for a verdict — never a degraded body. No
 * fifth seat: returns from outside the fixed roster are refused. */
export function requireFullBody(returns: LensReturn[]): LensReturn[] {
  for (const r of returns) {
    if (!(LENSES as readonly string[]).includes(r.lens)) {
      throw new Error(`council run refused: no fifth seat — unknown lens ${r.lens}`);
    }
  }
  for (const lens of LENSES) {
    if (!returns.some((r) => r.lens === lens)) {
      throw new Error(`council run refused: lens ${lens} did not return — no degraded body`);
    }
  }
  return returns;
}

export interface SynthesizeInput {
  caseId: string;
  artifactRevision: string;
  returns: LensReturn[];
  packetProvenance: string[];
}

/** Mechanical synthesis only: tally, copy IDs, copy dissent verbatim. */
export function synthesize(input: SynthesizeInput): CouncilVerdict {
  const returns = requireFullBody(input.returns);
  const tally: Tally = { pass: 0, block: 0 };
  for (const r of returns) tally[r.ballot]++;
  const verdict = tally.block >= 2 ? "block" : tally.pass >= 2 ? "pass" : null;
  if (verdict === null) throw new Error("council synthesis refused: no 2/3 majority — tie-breaking forbidden");
  const findings = returns.flatMap((r) => r.findings);
  const findingIds = validateFindingIds(findings);
  const minority = returns.find((r) => r.ballot !== verdict);
  const dissent = minority?.dissentLine ?? null;
  return {
    verdict,
    tally,
    dissent,
    findings,
    synthesis: {
      caseId: input.caseId,
      artifactRevision: input.artifactRevision,
      tally: { ...tally },
      findingIds,
      dissent,
      packetProvenance: [...input.packetProvenance],
    },
    requiresUserApproval: true,
  };
}
