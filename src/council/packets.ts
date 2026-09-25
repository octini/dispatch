// F16 council packets: the F1 frozen envelopes — revision-bound, carrying
// truncation status, under the injection guard.
import type { LensId, LensPacket } from "./types.js";

export interface FreezePacketInput {
  caseId: string;
  artifactRevision: string;
  lens: LensId;
  evidence: string;
  truncated: boolean;
}

/** Raw-transcript detection (F16-RC-08/09 mechanism): JSONL bodies and
 * transcript markers never enter a packet. */
export function isTranscriptShaped(evidence: string): boolean {
  if (/\btranscript\b/i.test(evidence)) return true;
  if (/<transcript/i.test(evidence)) return true;
  if (/tool_result/i.test(evidence)) return true;
  const lines = evidence.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  if (
    lines.length >= 2 &&
    lines.every((line) => {
      try {
        const parsed: unknown = JSON.parse(line);
        return parsed !== null && typeof parsed === "object";
      } catch {
        return false;
      }
    })
  ) {
    return true;
  }
  if (/^\s*\{[\s\S]*\}\s*$/.test(evidence)) {
    try {
      const parsed: unknown = JSON.parse(evidence);
      if (parsed !== null && typeof parsed === "object" && ("transcript" in parsed || "messages" in parsed || "role" in parsed)) {
        return true;
      }
    } catch {
      // Not JSON — fall through to the marker checks above, which already ran.
    }
  }
  return false;
}

/** Freeze a lens packet: revision-bound, truncation status rides the packet,
 * quoted/retrieved text is evidence-only (never authority). Raw consultation
 * transcripts are refused + disclosed; only the frozen-envelope validated
 * fields pass (revision binding + truncation status + evidence-only). */
export function freezePacket(input: FreezePacketInput): LensPacket {
  if (input.evidence.length === 0) throw new Error("lens packet refused: empty evidence");
  if (input.caseId.length === 0 || input.artifactRevision.length === 0) {
    throw new Error("lens packet refused: revision binding required — caseId + artifactRevision (F16-RC-08)");
  }
  if (isTranscriptShaped(input.evidence)) {
    throw new Error(
      "lens packet refused + disclosed: transcript-shaped content refused; only the F1 frozen-envelope validated fields pass (revision-bound + truncation status + evidence-only) (F16-RC-08/09)",
    );
  }
  return {
    caseId: input.caseId,
    artifactRevision: input.artifactRevision,
    lens: input.lens,
    evidence: input.evidence,
    truncation: input.truncated ? "truncated" : "complete",
    evidenceOnly: true,
  };
}

/** Packet-selection provenance (what the lenses saw) records in the review report. */
export function packetProvenance(packet: LensPacket): string {
  return `case ${packet.caseId} rev ${packet.artifactRevision} lens ${packet.lens} truncation ${packet.truncation}`;
}
