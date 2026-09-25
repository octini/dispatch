// F6 self-update tests (F6-PD-01 … F6-PD-05, F6-PD-09; F6-Q2 versioning; BQ8).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEGRADED_BANNER,
  DEGRADED_BANNER_PIN,
  INSTALL_PATH_PRIMARY,
  NPM_PATH_STATUS,
  SHA_AUTHORITY,
  SELF_UPDATE_SWITCH,
  resolveDegradedBanner,
  activateStaged,
  bumpPin,
  checkDrift,
  classifyOs,
  compareVersions,
  healthGate,
  pruneBeyondKeptPrior,
  reconcileTarget,
  recordInstall,
  stageUpdate,
  userRevert,
  verifySha,
  type InstallRecord,
} from "../update/index.js";

function installed(over: Partial<InstallRecord> = {}): InstallRecord {
  return {
    tag: "v1.2.0",
    sha: "abc123fullsha",
    installedAt: "2026-09-28T00:00:00Z",
    selfUpdateEnabled: true,
    keptPrior: null,
    updateLog: [],
    consecutiveFailures: 0,
    parked: false,
    ...over,
  };
}

describe("install path + SHA sole authority (F6-PD-01/03)", () => {
  it("git-tag is the v1 primary and only required path; npm never blocks", () => {
    assert.equal(INSTALL_PATH_PRIMARY, "git-tag");
    assert.match(NPM_PATH_STATUS, /never required.*never a blocker/);
  });

  it("recorded SHA is the sole authority: integrity = authenticity", () => {
    assert.match(SHA_AUTHORITY, /sole authority/);
    assert.equal(verifySha("s", "s"), true);
    assert.equal(verifySha("s", "t"), false);
  });

  it("matching SHA installs with the FULL COMMIT SHA pinned", () => {
    const out = recordInstall({ tag: "v1.2.0", claimedSha: "abc", observedSha: "abc", at: "t" });
    assert.ok("record" in out && out.record.sha === "abc");
  });

  it("mismatched SHA at install REFUSES with disclosure, never silent", () => {
    const out = recordInstall({ tag: "v1.2.0", claimedSha: "abc", observedSha: "xyz", at: "t" });
    assert.ok(!("record" in out) && out.verdict === "refused");
    assert.ok(out.disclosure.length > 0);
  });

  it("a moved or retagged ref never changes the recorded SHA: mismatch or drift, always disclosed", () => {
    const rec = installed({ sha: "orig" });
    const drifted = checkDrift(rec.sha, "moved");
    assert.equal(drifted.verdict, "warned");
    assert.ok(drifted.disclosure.length > 0);
    assert.equal(rec.sha, "orig");
  });
});

describe("drift warn-only (F6-PD-02)", () => {
  it("drift warns and keeps serving the pin: no block, no auto-correct", () => {
    const out = checkDrift("pin", "live-diverged");
    assert.equal(out.verdict, "warned");
    assert.ok(out.disclosure.length > 0);
  });

  it("no drift is a silent no-op", () => {
    assert.equal(checkDrift("pin", "pin").verdict, "no-op");
  });
});

describe("staging-and-swap (F6-PD-04)", () => {
  it("pre-swap SHA verification stages; mid-session defers to next restart", () => {
    const rec = installed();
    const r = stageUpdate({
      record: rec, stagedTag: "v1.3.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: true, midSession: true,
      channelReachable: true, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "staged");
    assert.match(r.outcome.disclosure, /next restart/);
    assert.equal(rec.tag, "v1.2.0");
  });

  it("corrupt staged bytes keep the current version with warn + logged old→new attempt", () => {
    const rec = installed();
    const r = stageUpdate({
      record: rec, stagedTag: "v1.3.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: false, midSession: false,
      channelReachable: true, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "warned");
    assert.equal(r.record.tag, "v1.2.0");
    assert.equal(r.record.updateLog.length, 1);
    assert.ok(r.outcome.disclosure.length > 0);
  });

  it("channel outage keeps the current state and warns, never a partial install", () => {
    const rec = installed();
    const r = stageUpdate({
      record: rec, stagedTag: "v1.3.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: true, midSession: false,
      channelReachable: false, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "warned");
    assert.equal(r.record.tag, "v1.2.0");
  });

  it("kill-switch off runs no check or download", () => {
    const rec = installed({ selfUpdateEnabled: false });
    const r = stageUpdate({
      record: rec, stagedTag: "v1.3.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: true, midSession: false,
      channelReachable: true, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "refused");
    assert.match(r.outcome.reason, new RegExp(SELF_UPDATE_SWITCH.replace(".", "\\.")));
  });

  it("activation runs at next restart only, never mid-session", () => {
    const rec = installed();
    const mid = activateStaged(rec, { tag: "v1.3.0", sha: rec.sha }, { midSession: true, at: "t" });
    assert.ok(!("record" in mid) && mid.verdict === "refused");
    const next = activateStaged(rec, { tag: "v1.3.0", sha: rec.sha }, { midSession: false, at: "t" });
    assert.ok("record" in next && next.record.tag === "v1.3.0");
    assert.deepEqual(next.record.keptPrior, { tag: "v1.2.0", sha: rec.sha });
  });
});

describe("never-downgrade + sole carve-out + BQ8 (F6-PD-05)", () => {
  it("update-driven downgrades refuse with disclosure", () => {
    assert.equal(compareVersions("v1.1.0", "v1.2.0"), -1);
    const rec = installed();
    const r = stageUpdate({
      record: rec, stagedTag: "v1.1.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: true, midSession: false,
      channelReachable: true, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "refused");
  });

  it("explicit user revert to the ONE kept prior passes; uncommanded downgrades refuse", () => {
    const rec = installed({ keptPrior: { tag: "v1.1.0", sha: "prior-sha" } });
    const cold = userRevert(rec, { userCommanded: false, at: "t" });
    assert.ok(!("record" in cold) && cold.verdict === "refused");
    const ok = userRevert(rec, { userCommanded: true, at: "t" });
    assert.ok("record" in ok && ok.record.tag === "v1.1.0");
    const none = userRevert(installed(), { userCommanded: true, at: "t" });
    assert.ok(!("record" in none) && none.verdict === "refused");
  });

  it("BQ8: ONE automatic revert with disclosure, then park on the second failure", () => {
    const rec = installed({ tag: "v1.3.0", keptPrior: { tag: "v1.2.0", sha: "s" } });
    const first = healthGate(rec, { healthy: false, at: "t" });
    assert.equal(first.parked, false);
    assert.equal(first.record.tag, "v1.2.0");
    assert.ok(first.disclosure.length > 0);
    const second = healthGate(first.record, { healthy: false, at: "t" });
    assert.equal(second.parked, true);
    assert.ok(second.disclosure.length > 0);
  });

  it("healthy activation clears the failure count", () => {
    const out = healthGate(installed({ consecutiveFailures: 1 }), { healthy: true, at: "t" });
    assert.equal(out.record.consecutiveFailures, 0);
  });

  it("deleting past the kept prior needs Q6 approval", () => {
    assert.equal(pruneBeyondKeptPrior({ userApproved: false }).verdict, "refused");
    assert.ok(pruneBeyondKeptPrior({ userApproved: true }).disclosure.length > 0);
  });
});

describe("versioning: manual bump advances, self-update reconciles (F6-Q2)", () => {
  it("the manual bump advances the pin with re-verification; mismatch refuses", () => {
    const rec = installed();
    const bad = bumpPin(rec, { newTag: "v1.3.0", claimedSha: "a", observedSha: "b", at: "t", userApproved: true });
    assert.ok(!("record" in bad) && bad.verdict === "refused");
    const noWord = bumpPin(rec, { newTag: "v1.3.0", claimedSha: "a", observedSha: "a", at: "t", userApproved: false });
    assert.ok(!("record" in noWord) && noWord.verdict === "refused");
    const ok = bumpPin(rec, { newTag: "v1.3.0", claimedSha: "a", observedSha: "a", at: "t", userApproved: true });
    assert.ok("record" in ok && ok.record.tag === "v1.3.0");
  });

  it("self-update reconciles to the pin and never advances beyond it", () => {
    const rec = installed();
    assert.deepEqual(reconcileTarget(rec), { tag: "v1.2.0", sha: rec.sha });
    const r = stageUpdate({
      record: rec, stagedTag: "v1.2.0", stagedSha: rec.sha,
      stagedBytesMatchRecordedSha: true, midSession: false,
      channelReachable: true, trigger: "startup-check", at: "t",
    });
    assert.equal(r.outcome.verdict, "no-op");
  });
});

describe("unsupported-OS behavior (F6-PD-09)", () => {
  it("prerequisite failure refuses with guidance", () => {
    const out = classifyOs({ os: "macos", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: false });
    assert.equal(out.verdict, "refused");
  });

  it("below-floor Node refuses", () => {
    const out = classifyOs({ os: "windows", nodeVersion: "20.0.0", overrideFlag: false, prereqsOk: true });
    assert.equal(out.verdict, "refused");
  });

  it("Windows and macOS proceed banner-free", () => {
    assert.equal(classifyOs({ os: "windows", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: true }).verdict, "proceed");
    assert.equal(classifyOs({ os: "macos", nodeVersion: "24.0.0", overrideFlag: false, prereqsOk: true }).verdict, "proceed");
  });

  it("Linux proceeds with the degraded banner", () => {
    const out = classifyOs({ os: "linux", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: true });
    assert.equal(out.verdict, "proceed-banner");
    assert.ok((out.banner ?? "").length > 0);
  });

  it("other OS refuses without the flag, proceeds banner-retained with it", () => {
    const refused = classifyOs({ os: "other", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: true });
    assert.equal(refused.verdict, "refused");
    const over = classifyOs({ os: "other", nodeVersion: "22.19.0", overrideFlag: true, prereqsOk: true });
    assert.equal(over.verdict, "proceed-banner");
    assert.ok((over.banner ?? "").length > 0);
  });

  it("uncertain classification falls back to the stricter branch", () => {
    assert.equal(classifyOs({ os: "uncertain", nodeVersion: "22.19.0", overrideFlag: true, prereqsOk: true }).verdict, "refused");
  });

  it("BAN-02: an injected banner value wins over the disclosed default fallback", () => {
    const out = classifyOs({ os: "linux", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: true, degradedBanner: "injected-banner" });
    assert.equal(out.verdict, "proceed-banner");
    assert.equal(out.banner, "injected-banner");
  });

  it("BAN-02: absent injection falls back to the disclosed UNVERIFIED default", () => {
    const out = classifyOs({ os: "linux", nodeVersion: "22.19.0", overrideFlag: false, prereqsOk: true });
    assert.equal(out.verdict, "proceed-banner");
    assert.equal(out.banner, DEGRADED_BANNER);
    assert.equal(DEGRADED_BANNER_PIN, "UNVERIFIED");
    assert.equal(resolveDegradedBanner(null), DEGRADED_BANNER);
  });
});
