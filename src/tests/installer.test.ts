// F9 installer + dependency bootstrap tests (F9-BS-08; F9-Q7; MANIFEST; F9 C7).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BD_VERSION_FLOOR,
  DOLT_VERSION_FLOOR,
  PARK_SEMANTICS,
  STEP_SWITCH_TABLE,
  admitDependency,
  assessBd,
  checksumSource,
  provisionBd,
  selectInstallers,
  stepSwitchAllows,
  verifyChecksum,
} from "../installer/index.js";
import { DEFAULT_KILL_SWITCHES } from "../bootstrap/index.js";

describe("per-OS installer selection (F9-Q7)", () => {
  it("darwin and linux install via brew, install.sh, or npm", () => {
    assert.deepEqual(selectInstallers("darwin"), ["brew", "install.sh", "npm"]);
    assert.deepEqual(selectInstallers("linux"), ["brew", "install.sh", "npm"]);
  });

  it("win32 installs via install.ps1 or go install with checksums.txt verification", () => {
    assert.deepEqual(selectInstallers("win32"), ["install.ps1", "go-install"]);
    assert.match(checksumSource("install.ps1"), /checksums\.txt/);
    assert.match(checksumSource("go-install"), /checksums\.txt/);
  });

  it("unknown platforms select nothing and park instead of improvising", () => {
    assert.deepEqual(selectInstallers("other"), []);
    const out = provisionBd({
      installed: false, bdVersion: null, doltVersion: null, upgradeRefused: false,
      os: "other", kill: DEFAULT_KILL_SWITCHES,
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(out.verdict, "parked");
  });
});

describe("checksum-verified install (verification-before-execution)", () => {
  it("a verified checksum admits execution", () => {
    assert.equal(verifyChecksum({ installer: "brew", expected: "a", observed: "a" }).verdict, "verified");
  });

  it("a mismatch refuses before execution with disclosure", () => {
    const out = verifyChecksum({ installer: "install.ps1", expected: "a", observed: "b" });
    assert.equal(out.verdict, "refused");
    assert.ok(out.disclosure.length > 0);
  });

  it("provisioning refuses without a verified checksum", () => {
    const out = provisionBd({
      installed: false, bdVersion: null, doltVersion: null, upgradeRefused: false,
      os: "darwin", kill: DEFAULT_KILL_SWITCHES, checksum: null,
    });
    assert.equal(out.verdict, "refused");
  });
});

describe("below-floor handling: not-set-up plus verified upgrade or park (Slice 2 pattern)", () => {
  it("floors hold per MANIFEST", () => {
    assert.equal(BD_VERSION_FLOOR, "0.59.0");
    assert.equal(DOLT_VERSION_FLOOR, "2.1.0");
  });

  it("missing or below-floor reads as NOT set up", () => {
    assert.equal(assessBd({ installed: false, bdVersion: null, doltVersion: null, upgradeRefused: false }), "not-set-up");
    assert.equal(assessBd({ installed: true, bdVersion: "0.58.0", doltVersion: "2.1.0", upgradeRefused: false }), "not-set-up");
    assert.equal(assessBd({ installed: true, bdVersion: "0.59.0", doltVersion: "2.1.0", upgradeRefused: false }), "setup-ok");
  });

  it("missing bd installs through the verified path with disclosure", () => {
    const out = provisionBd({
      installed: false, bdVersion: null, doltVersion: null, upgradeRefused: false,
      os: "linux", kill: DEFAULT_KILL_SWITCHES,
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(out.verdict, "installed");
    assert.ok(out.disclosure.length > 0);
  });

  it("below-floor upgrades through the verified path with disclosure", () => {
    const out = provisionBd({
      installed: true, bdVersion: "0.58.0", doltVersion: "2.1.0", upgradeRefused: false,
      os: "darwin", kill: DEFAULT_KILL_SWITCHES,
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(out.verdict, "upgraded");
    assert.ok(out.disclosure.length > 0);
  });

  it("refusal or failure parks under F3-SD-04a, never below-floor silently", () => {
    const out = provisionBd({
      installed: true, bdVersion: "0.58.0", doltVersion: "2.1.0", upgradeRefused: true,
      os: "darwin", kill: DEFAULT_KILL_SWITCHES,
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(out.verdict, "parked");
    assert.equal(out.park, PARK_SEMANTICS);
  });
});

describe("dependency classes (MANIFEST verification-before-execution)", () => {
  it("required dependencies admit once verified", () => {
    assert.equal(admitDependency({ name: "bd", class: "required", pin: "PINNED", checksumVerified: true }).admitted, true);
  });

  it("unverified dependencies refuse before execution", () => {
    assert.equal(admitDependency({ name: "bd", class: "required", pin: "PINNED", checksumVerified: false }).admitted, false);
  });

  it("reference-only sources never execute", () => {
    assert.equal(admitDependency({ name: "BMAD", class: "reference-only", pin: "PINNED", checksumVerified: true }).admitted, false);
  });

  it("unselected candidate backends never execute before the probe selects", () => {
    const out = admitDependency({ name: "qmd", class: "candidate-backend", pin: "UNVERIFIED", checksumVerified: true });
    assert.equal(out.admitted, false);
  });

  it("PIN-01: an extension-pick with UNVERIFIED pin is refused even with a verified checksum", () => {
    const out = admitDependency({ name: "harness", class: "extension-pick", pin: "UNVERIFIED", checksumVerified: true });
    assert.equal(out.admitted, false);
  });

  it("PIN-01: a PINNED extension-pick with a verified checksum admits", () => {
    const out = admitDependency({ name: "harness", class: "extension-pick", pin: "PINNED", checksumVerified: true });
    assert.equal(out.admitted, true);
  });
});

describe("kill switches: the Slice 2 step→switch table applies (F9 C7)", () => {
  it("step3-beads maps to autoInstallBeads plus setupEnabled", () => {
    assert.deepEqual(STEP_SWITCH_TABLE["step3-beads"], ["autoInstallBeads", "setupEnabled"]);
  });

  it("autoInstallBeads gates BOTH the install and the below-floor upgrade", () => {
    assert.equal(stepSwitchAllows("step3-beads", { ...DEFAULT_KILL_SWITCHES, autoInstallBeads: false }), false);
    const fresh = provisionBd({
      installed: false, bdVersion: null, doltVersion: null, upgradeRefused: false,
      os: "darwin", kill: { ...DEFAULT_KILL_SWITCHES, autoInstallBeads: false },
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(fresh.verdict, "skipped-killswitch");
    const below = provisionBd({
      installed: true, bdVersion: "0.58.0", doltVersion: "2.1.0", upgradeRefused: false,
      os: "darwin", kill: { ...DEFAULT_KILL_SWITCHES, autoInstallBeads: false },
      checksum: { verdict: "verified", reason: "", disclosure: "" },
    });
    assert.equal(below.verdict, "skipped-killswitch");
  });
});
