// Dispatch Slice 5 — F9 installer + dependency bootstrap.
// Spec authority: docs/features/bootstrap-init.md (F9-BS-08) + docs/MANIFEST.md
// (dependency classes, per-OS installers, version floors) + F6 checksum rule.
// Single-source: version floors, the step→switch table, and park semantics
// import from the Slice 2 bootstrap module — never redefined here. Probes
// stay open (PS-GATE list); this module is the specified behavior, not proven
// runtime enforcement.

import {
  BD_VERSION_FLOOR,
  DOLT_VERSION_FLOOR,
  PARK_SEMANTICS,
  STEP_SWITCH_TABLE,
  stepSwitchAllows,
  versionGte,
  type KillSwitches,
  type StepId,
} from "../bootstrap/index.js";

/** Floors are MANIFEST pins, single-sourced from the Slice 2 module. */
export { BD_VERSION_FLOOR, DOLT_VERSION_FLOOR, PARK_SEMANTICS, STEP_SWITCH_TABLE, stepSwitchAllows };
export type { KillSwitches, StepId };

/** F9-Q7 per-OS installer selection (MANIFEST audit tgo-8p1y). */
export type OsPlatform = "darwin" | "linux" | "win32" | "other";

export type BdInstaller =
  | "brew"
  | "install.sh"
  | "npm"
  | "install.ps1"
  | "go-install";

export const DARWIN_LINUX_INSTALLERS: BdInstaller[] = ["brew", "install.sh", "npm"];
export const WIN32_INSTALLERS: BdInstaller[] = ["install.ps1", "go-install"];

/**
 * Installer-selected bd provisioning (F9-BS-08): darwin/linux via
 * brew/install.sh/npm; win32 via install.ps1/go install. Unknown platforms
 * select nothing — the step parks, never improvises a command.
 */
export function selectInstallers(os: OsPlatform): BdInstaller[] {
  if (os === "darwin" || os === "linux") return [...DARWIN_LINUX_INSTALLERS];
  if (os === "win32") return [...WIN32_INSTALLERS];
  return [];
}

/** win32 verifies via checksums.txt; brew/install.sh/npm verify per-artifact. */
export function checksumSource(installer: BdInstaller): string {
  if (installer === "install.ps1" || installer === "go-install") return "checksums.txt verification (F9-Q7)";
  return "per-artifact checksum verification (F9-Q7)";
}

export interface ChecksumInput {
  installer: BdInstaller;
  expected: string;
  observed: string;
}

export type ChecksumVerdict = "verified" | "refused";

export interface ChecksumOutcome {
  verdict: ChecksumVerdict;
  reason: string;
  disclosure: string;
}

/**
 * MANIFEST verification-before-execution: the checksum verifies BEFORE any
 * install executes. A mismatch refuses with disclosure; nothing runs.
 */
export function verifyChecksum(input: ChecksumInput): ChecksumOutcome {
  if (input.expected === input.observed) {
    return {
      verdict: "verified",
      reason: `checksum verified via ${checksumSource(input.installer)} before execution`,
      disclosure: "",
    };
  }
  const reason = `checksum mismatch via ${checksumSource(input.installer)}: install refused before execution, disclosed (F9-BS-08)`;
  return { verdict: "refused", reason, disclosure: reason };
}

// --- Below-floor handling (the Slice 2 pattern: F9-BS-08) ---

export interface BdPresence {
  installed: boolean;
  bdVersion: string | null;
  doltVersion: string | null;
  upgradeRefused: boolean;
}

export type BdAssessment = "setup-ok" | "not-set-up";

export function assessBd(presence: BdPresence): BdAssessment {
  if (!presence.installed) return "not-set-up";
  if (!versionGte(presence.bdVersion, BD_VERSION_FLOOR)) return "not-set-up";
  if (!versionGte(presence.doltVersion, DOLT_VERSION_FLOOR)) return "not-set-up";
  return "setup-ok";
}

export interface ProvisionInput extends BdPresence {
  os: OsPlatform;
  kill: KillSwitches;
  checksum: ChecksumOutcome | null;
}

export type ProvisionVerdict = "installed" | "upgraded" | "skipped-killswitch" | "parked" | "refused";

export interface ProvisionOutcome {
  verdict: ProvisionVerdict;
  reason: string;
  disclosure: string;
  park: typeof PARK_SEMANTICS | null;
}

/**
 * Install-with-plugin for bd (F9-Q7): checksum-verified install when missing;
 * below-floor reads as NOT set up — the verified upgrade runs with
 * disclosure, and refusal/failure parks under F3-SD-04a. Never runs
 * below-floor silently. The Slice 2 step→switch table applies: autoInstallBeads
 * gates BOTH the install and the below-floor upgrade.
 */
export function provisionBd(input: ProvisionInput): ProvisionOutcome {
  const assessed = assessBd(input);
  if (assessed === "setup-ok") {
    return { verdict: "refused", reason: "bd present at floor: no reinstall, no reinit (F9-BS-08)", disclosure: "", park: null };
  }
  if (!stepSwitchAllows("step3-beads", input.kill)) {
    const reason = "bd provisioning refused: autoInstallBeads disabled (F9 C7 step→switch table)";
    return { verdict: "skipped-killswitch", reason, disclosure: reason, park: null };
  }
  if (selectInstallers(input.os).length === 0) {
    const reason = `bd provisioning parks: no installer selected for ${input.os} (F9-Q7); never improvises a command`;
    return { verdict: "parked", reason, disclosure: `${reason} (${PARK_SEMANTICS})`, park: PARK_SEMANTICS };
  }
  if (input.checksum === null || input.checksum.verdict !== "verified") {
    const reason = "bd provisioning refused: checksum unverified before execution (MANIFEST verification-before-execution)";
    return { verdict: "refused", reason, disclosure: reason, park: null };
  }
  if (!input.installed) {
    return {
      verdict: "installed",
      reason: `bd provisioned via the installer selection with checksum verify (floors bd >= ${BD_VERSION_FLOOR} / dolt >= ${DOLT_VERSION_FLOOR}) (F9-BS-08)`,
      disclosure: `bd installed with the plugin via checksum-verified installer path (F9-BS-08)`,
      park: null,
    };
  }
  if (input.upgradeRefused) {
    const reason = "below-floor upgrade refused: parks under F3-SD-04a; never runs below-floor silently (F9-BS-08)";
    return { verdict: "parked", reason, disclosure: `${reason} (${PARK_SEMANTICS})`, park: PARK_SEMANTICS };
  }
  return {
    verdict: "upgraded",
    reason: `below-floor bd treated as not-set-up; upgrade attempted through the checksum-verified installer path with disclosure (F9-BS-08)`,
    disclosure: `bd below version floor (bd >= ${BD_VERSION_FLOOR}, dolt >= ${DOLT_VERSION_FLOOR}); verified upgrade ran with disclosure (F9-BS-08)`,
    park: null,
  };
}

// --- Dependency classes (MANIFEST verification-before-execution) ---

export type DependencyClass =
  | "required"
  | "extension-pick"
  | "candidate-backend"
  | "optional-user-installed"
  | "reference-only";

export interface DependencyEntry {
  name: string;
  class: DependencyClass;
  /** Pin state: spec-phase pins stay open until the probe/build pin closes them. */
  pin: "PINNED" | "UNVERIFIED";
  checksumVerified: boolean;
}

/**
 * MANIFEST classes with verification-before-execution: no dependency executes
 * before its checksum/pin verifies. Reference-only sources never execute —
 * they stay idea-level inspiration (F6-PD-07 verify-then-admit composition).
 * Candidate backends never execute until the spec-phase probe selects one.
 */
export function admitDependency(entry: DependencyEntry): { admitted: boolean; reason: string } {
  if (entry.class === "reference-only") {
    return { admitted: false, reason: `${entry.name}: reference-only never executes (idea-level only, F6-PD-07)` };
  }
  if ((entry.class === "candidate-backend" || entry.class === "extension-pick") && entry.pin !== "PINNED") {
    return { admitted: false, reason: `${entry.name}: unpinned pick (${entry.class}) unselected at spec phase — a verified checksum never admits an unpinned pick (MANIFEST)` };
  }
  if (!entry.checksumVerified) {
    return { admitted: false, reason: `${entry.name}: checksum unverified — verification-before-execution refuses (MANIFEST)` };
  }
  return { admitted: true, reason: `${entry.name}: verified before execution (${entry.class})` };
}
