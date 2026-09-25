// F11 durable-memory tests (F11-DM-01..12) + F12 working-context tests (F12-WC-01..09).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  projectVault,
  machineVault,
  resolveRecord,
  refuseDatabaseAsRecord,
  compileWiki,
  migrationDryRun,
  checkAdmissionContract,
  runVerifierPass,
  userDirectWrite,
  SCOPE_TAGS,
  stampScope,
  refuseImplicitPromotion,
  supersede,
  hardDelete,
  handleVaultPressure,
  STAGING_WINDOW,
  recallWithSources,
  searchRecall,
  RECALL_BACKEND,
} from "../memory/index.js";
import {
  MAGIC_PATH,
  assertSingleCompressor,
  gatePathPin,
  ARCHIVER_TIER,
  ARCHIVER_BOUNDS,
  atomicArchivePass,
  assertZeroSidecars,
  SAFETY_FACTS,
  taskArchive,
  archiveScope,
  neverTrimSet,
  gateArchivePromotion,
  purgeArchives,
} from "../context/index.js";

describe("F11-DM-01 dual-vault SSOT; databases recall-only", () => {
  it("project vault lives in-repo; machine vault lazy-inits disclosed", () => {
    assert.equal(projectVault("acme/app").repo, "acme/app");
    const fresh = machineVault("~/.dispatch/vault", false);
    assert.match(fresh.disclosure ?? "", /lazily initialized/);
    assert.equal(machineVault("~/.dispatch/vault", true).disclosure, null);
  });

  it("record reads resolve to files; database writes never count", () => {
    assert.match(resolveRecord(projectVault("acme/app"), "raw/e1.md").file, /raw\/e1\.md/);
    assert.match(refuseDatabaseAsRecord().refused, /recall only/);
  });
});

describe("F11-DM-02 recall backend unselected pending the build probe", () => {
  it("no backend selected; accuracy-floor-first probe owns selection", () => {
    assert.match(RECALL_BACKEND, /UNSELECTED/);
  });
});

describe("F11-DM-03 staged admission plus layered verifier; user direct path", () => {
  it("link-less staging blocks; linked plus stamped admits UNVERIFIED only", () => {
    const blocked = checkAdmissionContract({ content: "x", sourceLink: null, scopeStamp: "s", status: "UNVERIFIED" });
    assert.equal(blocked.admitted, false);
    const admitted = checkAdmissionContract({ content: "x", sourceLink: "https://e.com", scopeStamp: "s", status: "UNVERIFIED" });
    assert.equal(admitted.admitted, true);
  });

  it("verifier pass is ephemeral — never a standing seat; no Expert gate", () => {
    const pass = runVerifierPass({ content: "x", sourceLink: "https://e.com", scopeStamp: "s", status: "UNVERIFIED" }, () => []);
    assert.deepEqual([pass.promoted, pass.standingSeat], [true, false]);
    assert.deepEqual(userDirectWrite("user note"), { written: true, status: "promoted" });
  });
});

describe("F11-DM-04 supersede-not-overwrite; one-home rule", () => {
  it("old claims stay linked; cross-repo supersedes refuse", () => {
    const chain = supersede({ oldId: "e1", newId: "e2", vaultRepo: "r1" }, "r1");
    assert.equal(chain.newId, "e2");
    assert.throws(() => supersede({ oldId: "e1", newId: "e2", vaultRepo: "r1" }, "r2"));
  });
});

describe("F11-DM-05 user-only promoted hard-delete; tombstones; never auto-delete", () => {
  it("user deletes promoted; verifier blocked on promoted", () => {
    assert.deepEqual(hardDelete({ actor: "user", status: "promoted", contractFailing: false, inWindow: false, worthless: false }), { deleted: true, tombstone: false });
    const refused = hardDelete({ actor: "verifier", status: "promoted", contractFailing: false, inWindow: false, worthless: false });
    assert.ok("refused" in refused);
  });

  it("failing staged entries delete in the never-renewing window; worthless tombstones", () => {
    assert.match(STAGING_WINDOW, /never renews/);
    assert.deepEqual(hardDelete({ actor: "verifier", status: "staged", contractFailing: true, inWindow: true, worthless: false }), { deleted: true, tombstone: false });
    const tomb = hardDelete({ actor: "verifier", status: "staged", contractFailing: false, inWindow: false, worthless: true });
    assert.ok("tombstone" in tomb && tomb.tombstone === true);
    assert.deepEqual(handleVaultPressure(), { deleted: false, disclosure: "vault pressure discloses and parks for the user; nothing auto-deletes (F11-DM-05)" });
  });
});

describe("F11-DM-06 wiki compile on promotion, supersede, user request", () => {
  it("every trigger recompiles through a short-lived job", () => {
    for (const trigger of ["promotion", "supersede", "user-request"] as const) {
      assert.deepEqual(compileWiki(trigger), { recompiled: true, standingSeat: false });
    }
  });
});

describe("F11-DM-07 scope tags stamped automatically", () => {
  it("fixed tag set stamps from context", () => {
    assert.deepEqual([...SCOPE_TAGS], ["project", "scope", "seat", "task", "status"]);
    assert.match(stampScope({ project: "p", scope: "work", seat: "writer", task: "t1", status: "staged" }), /seat=writer/);
  });
});

describe("F11-DM-08 session history separate from durable knowledge", () => {
  it("transcripts never promote implicitly", () => {
    assert.match(refuseImplicitPromotion().refused, /never promote implicitly/);
  });
});

describe("F11-DM-09 migration dry-run before apply", () => {
  it("nothing applies without the user-shown diff approval", () => {
    assert.deepEqual(migrationDryRun("diff", false), { applied: false });
    assert.deepEqual(migrationDryRun("diff", true), { applied: true });
  });
});

describe("F11-DM-10 recall carries sources; DM-11 stamp required at admission", () => {
  it("recall surfaces stored sources alongside content", () => {
    const recalled = recallWithSources({ id: "e1", content: "Luna pricing notes https://e.com", sources: ["https://e.com"] });
    assert.deepEqual(recalled.sources, ["https://e.com"]);
    assert.equal(searchRecall([{ id: "e1", content: "Luna pricing", sources: ["https://e.com"] }], "Luna").length, 1);
  });

  it("stamp-less staging fails the contract", () => {
    const result = checkAdmissionContract({ content: "x", sourceLink: "https://e.com", scopeStamp: null, status: "UNVERIFIED" });
    assert.equal(result.admitted, false);
  });
});

describe("F11-DM-12 memory moves no F1-F10 rule", () => {
  it("memory ops narrow to this feature: vault, admission, recall only", () => {
    assert.equal(projectVault("r").kind, "project");
    assert.match(RECALL_BACKEND, /UNSELECTED/);
  });
});

describe("F12-WC-01 hybrid ownership; path-a pin behind the user-gated probe", () => {
  it("dual compress refuses; path pins only after the user sees the probe", () => {
    assert.throws(() => assertSingleCompressor(true, true));
    assertSingleCompressor(true, false);
    assert.equal(MAGIC_PATH, "a (disable-historian + native compaction)");
    assert.throws(() => gatePathPin(false));
    assert.deepEqual(gatePathPin(true), { pinned: MAGIC_PATH });
  });
});

describe("F12-WC-02 Seeker-tier archiver with bounds; atomic pass", () => {
  it("tier composed; bound values unpinned; breach discards cleanly", () => {
    assert.equal(ARCHIVER_TIER, "seeker-tier");
    assert.match(ARCHIVER_BOUNDS, /UNVERIFIED/);
    assert.deepEqual(atomicArchivePass(true), { persisted: false, parked: true });
    assert.deepEqual(atomicArchivePass(false), { persisted: true, parked: false });
  });
});

describe("F12-WC-03 never-trim three-item re-injection in the prompt-core budget", () => {
  it("exactly three items, single-sourced from prompt assembly", () => {
    assert.equal(neverTrimSet("writer", "rev t1").length, 3);
  });
});

describe("F12-WC-04 no-implicit-promotion; F11 admission is the gate", () => {
  it("automatic promotion blocks; F11 admission and user writes pass", () => {
    assert.throws(() => gateArchivePromotion("automatic"));
    assert.deepEqual(gateArchivePromotion("f11-admission"), { allowed: true });
    assert.deepEqual(gateArchivePromotion("user-direct"), { allowed: true });
  });
});

describe("F12-WC-05 task-scoped archives with per-seat surfaces", () => {
  it("Writer archive follows the task ID; Seeker full, Dispatcher/Expert list-only", () => {
    assert.equal(taskArchive("tgo-1").key, "task-archive:tgo-1");
    assert.equal(archiveScope("seeker"), "seeker-full");
    assert.equal(archiveScope("writer"), "writer-task-scoped");
    assert.equal(archiveScope("dispatcher"), "list-only");
    assert.equal(archiveScope("expert"), "list-only");
  });
});

describe("F12-WC-06 zero sidecars in non-interactive invocations", () => {
  it("any sidecar refuses", () => {
    assertZeroSidecars([]);
    assert.throws(() => assertZeroSidecars(["historian-write"]));
  });
});

describe("F12-WC-07 recorded safety facts stay probe-gated", () => {
  it("facts record with provenance, never as proven", () => {
    assert.match(SAFETY_FACTS, /UNVERIFIED/);
  });
});

describe("F12-WC-08 boundary holds: durable record is F11's", () => {
  it("archive promotion still gates through F11 admission", () => {
    assert.throws(() => gateArchivePromotion("automatic"));
  });
});

describe("F12-WC-09 user-only purge; no auto-deletion ever", () => {
  it("close and roll never purge without user disposition", () => {
    assert.throws(() => purgeArchives({ userDirected: false }));
    assert.deepEqual(purgeArchives({ userDirected: true }), { purged: true });
  });
});
