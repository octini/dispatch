// Slice 4 revision tests (council verdict NEEDS REVISION, findings B1..B4):
// mechanism asserts for the vault-sharing guard + lookalike refusal (B1),
// the packet transcript refusal (B2), the failure/disclosure route fixes (B3),
// and the prompt-core/exposure split (B4).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  admitVaultBackend,
  assertSameInstallation,
  MEMPALACE_IDENTITY_PIN,
  openMachineVault,
} from "../memory/vault.js";
import { admitRecallBackend } from "../memory/recall.js";
import { freezePacket, isTranscriptShaped } from "../council/packets.js";
import { resolveLensFailure } from "../council/failure.js";
import { LENSES } from "../council/types.js";
import type { LensReturn } from "../council/types.js";
import { runReviewGate } from "../claims/review-gate.js";
import { DETECTOR_LANGUAGE_SCOPE } from "../claims/detector.js";
import { assertIndependentEyes } from "../eyes/guards.js";
import {
  buildPromptCore,
  estimateTokens_UNVERIFIED,
  STYLE_CORE,
  PROMPT_CORE_HARD_CAP,
} from "../prompt.js";

const HOME = { installPath: "/users/u/dispatch", artifactFingerprint: "fp-home" };
const FOREIGN = { installPath: "/users/u/other-checkout", artifactFingerprint: "fp-foreign" };

describe("B1(a) cross-installation vault-sharing guard", () => {
  it("a foreign-installation vault is REFUSED + disclosed, never merged", () => {
    assert.throws(
      () => openMachineVault({ repo: "vault", identity: HOME, storedIdentity: FOREIGN, exists: true }),
      /foreign-installation vault refused \+ disclosed/,
    );
    assert.throws(() => assertSameInstallation(HOME, FOREIGN));
  });

  it("the same installation opens and binds its identity", () => {
    const opened = openMachineVault({ repo: "vault", identity: HOME, storedIdentity: HOME, exists: true });
    assert.deepEqual(opened.vault.identity, HOME);
    const fresh = openMachineVault({ repo: "vault", identity: HOME, storedIdentity: null, exists: false });
    assert.match(fresh.disclosure ?? "", /lazily initialized/);
  });
});

describe("B1(b) MemPalace lookalike refusal is a mechanism at both layers", () => {
  it("the vault layer refuses a lookalike identity with disclosure", () => {
    assert.throws(() => admitVaultBackend("github.com/MemPalaceClone/mempalace"), /lookalike backend refused \+ disclosed/);
    assert.throws(
      () => openMachineVault({ repo: "vault", identity: HOME, storedIdentity: null, exists: false, backend: "mem-palace-fork" }),
      /lookalike backend refused \+ disclosed/,
    );
  });

  it("the recall layer refuses a lookalike identity with disclosure", () => {
    assert.throws(() => admitRecallBackend("github.com/evil/mempalace"), /recall refused \+ disclosed/);
  });

  it("the pinned identity admits at both layers; unrelated names pass through", () => {
    assert.deepEqual(admitVaultBackend(MEMPALACE_IDENTITY_PIN), { admitted: true });
    assert.deepEqual(admitRecallBackend(MEMPALACE_IDENTITY_PIN), { admitted: true });
    assert.deepEqual(admitRecallBackend("custom-file-index"), { admitted: true });
  });
});

describe("B2 council packet refusal is a mechanism, not a comment", () => {
  it("transcript-shaped content is REFUSED + disclosed", () => {
    const jsonl = `{"role":"user","content":"a"}\n{"role":"assistant","content":"b"}`;
    assert.equal(isTranscriptShaped(jsonl), true);
    assert.equal(isTranscriptShaped("session transcript of the consult"), true);
    assert.throws(
      () => freezePacket({ caseId: "c", artifactRevision: "r1", lens: "risk", evidence: jsonl, truncated: false }),
      /transcript-shaped content refused/,
    );
  });

  it("only the validated frozen envelope passes: revision-bound + truncation + evidence-only", () => {
    const packet = freezePacket({ caseId: "c", artifactRevision: "r1", lens: "risk", evidence: "diff here", truncated: false });
    assert.equal(packet.artifactRevision, "r1");
    assert.equal(packet.truncation, "complete");
    assert.equal(packet.evidenceOnly, true);
    assert.throws(() => freezePacket({ caseId: "", artifactRevision: "r1", lens: "risk", evidence: "diff", truncated: false }));
    assert.throws(() => freezePacket({ caseId: "c", artifactRevision: "", lens: "risk", evidence: "diff", truncated: false }));
  });
});

describe("B3(a) retry-path failure carries the structured fail+escalate shape", () => {
  it("persistent failure carries reason + escalation route + budget state", () => {
    const failed = resolveLensFailure({ returns: [], failedLens: "risk" }, { consumed: 1 }, () => []);
    assert.ok("failed" in failed && failed.failed === true);
    if ("failed" in failed) {
      assert.match(failed.reason, /persistently failed/);
      assert.equal(failed.escalateTo, "user");
      assert.deepEqual(failed.retry, { consumed: 1 });
      assert.match(failed.escalate, /fails \+ escalates/);
    }
  });

  it("a throwing retry path returns the structured shape instead of throwing", () => {
    const failed = resolveLensFailure(
      { returns: [], failedLens: "quality" },
      { consumed: 0 },
      () => {
        throw new Error("boom");
      },
    );
    assert.ok("failed" in failed && failed.failed === true);
    if ("failed" in failed) {
      assert.match(failed.reason, /retry-path failure for lens quality/);
      assert.equal(failed.escalateTo, "user");
      assert.deepEqual(failed.retry, { consumed: 1 });
    }
  });

  it("a recovered body missing a lens returns the structured shape instead of a generic throw", () => {
    const partial = LENSES.slice(0, 2).map((lens) => ({ lens, ballot: "pass", findings: [] }) as LensReturn);
    const failed = resolveLensFailure({ returns: [], failedLens: "structure" }, { consumed: 0 }, () => partial);
    assert.ok("failed" in failed && failed.failed === true);
  });
});

describe("B3(b) the hook disclosure rides the review-gate result", () => {
  it("routine and designated results carry the English-first disclosure", () => {
    const routine = runReviewGate({ kind: "routine", output: "I will check the file next.", caseId: "c1", promotion: "proposed" });
    assert.equal(routine.disclosure, DETECTOR_LANGUAGE_SCOPE);
    const designated = runReviewGate({
      kind: "designated",
      output: "I will check the file next.",
      caseId: "c2",
      promotion: "proposed",
      council: { conveneDesignated: (r) => ({ convened: true, caseId: r.caseId }) },
    });
    assert.equal(designated.disclosure, DETECTOR_LANGUAGE_SCOPE);
  });
});

describe("B3(c) unknown eyes describers are refused fail-closed", () => {
  it("dispatcher/seeker serve eyes; writer/expert/unknown never silently default", () => {
    assert.equal(assertIndependentEyes("writer", "dispatcher"), "dispatcher");
    assert.equal(assertIndependentEyes("writer", "seeker"), "seeker");
    assert.throws(() => assertIndependentEyes("writer", "observer"), /unknown describer seat/);
    assert.throws(() => assertIndependentEyes("expert", "expert"), /not an eyes seat/);
  });
});

describe("B4 prompt-core/exposure split (STYLE-Q5/PS-INV-05)", () => {
  it("core counts authored + TOP; BOTTOM counts exposure only", () => {
    const result = buildPromptCore({ seat: "writer", livingSpecPointer: "dispatch-spec rev test-1" });
    assert.equal(result.refused, false);
    assert.ok(result.coreTokens <= PROMPT_CORE_HARD_CAP);
    assert.equal(result.exposureTokens, estimateTokens_UNVERIFIED(STYLE_CORE));
    assert.ok(estimateTokens_UNVERIFIED(result.prompt) > result.coreTokens);
  });
});
