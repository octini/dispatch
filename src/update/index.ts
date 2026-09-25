// Dispatch Slice 5 — F6 self-update (staging-and-swap).
// Spec authority: docs/features/platform-distribution.md (F6-PD-01 … F6-PD-05,
// F6-PD-09) + PRIMARY-SPEC PS-SEAM-07/14 + PIN-RECORD SCHED-01/11/12.
// Section-7 mechanisms (tag/URL shapes, staging paths, banner strings, check
// scheduling) arrive as injected values, never spec claims. Probes stay open
// (PS-GATE list); this module is the specified behavior, not proven runtime
// enforcement. Enforcement is unverified until probes decide (F6-PD-12).

/** F6-PD-01: git-tag install is the v1 primary and only required path. */
export const INSTALL_PATH_PRIMARY = "git-tag" as const;

/** F6-PD-01: npm is permitted later, never required, never a blocker. */
export const NPM_PATH_STATUS =
  "permitted-later, never required, never a blocker for the git-tag path" as const;

/**
 * F6-PD-03 (F6 band fix): the recorded FULL COMMIT SHA is the SOLE authority
 * for every later verification including pre-swap. Integrity = authenticity:
 * the same-channel SHA source risk is ACCEPTED for v1 (user-decided, BQ7);
 * the recorded SHA still catches honest drift and mistakes. No v1 signature
 * infrastructure (F6Q7).
 */
export const SHA_AUTHORITY =
  "recorded FULL COMMIT SHA is the sole authority; integrity = authenticity (same-channel risk accepted v1, BQ7)" as const;

/** F6-PD-10 settled context: Node floor value on record, re-pinned at spec phase. */
export const NODE_FLOOR = "22.19.0";

/** F6-PD-05: config kill-switch name (SEPARATE scope from the F9 setup switches). */
export const SELF_UPDATE_SWITCH = "selfUpdate.enabled" as const;

/** F6-PD-04: scope is the PLUGIN artifact only — bd is never auto-upgraded. */
export const SELF_UPDATE_SCOPE = "plugin-artifact-only; existing bd installs never auto-upgraded" as const;

/** F9-BS-10 composition via PS-SEAM-14: update refreshes of plugin-owned
 * project surfaces follow user-edit-wins + disclose-and-ask, never silent. */
export const SURFACE_POLICY = "F9-BS-10 user-edit-wins + disclose-and-ask (PS-SEAM-14)" as const;

export interface KeptPrior {
  tag: string;
  sha: string;
}

export interface UpdateLogEntry {
  from: string;
  to: string;
  trigger: string;
  at: string;
}

/** Install record: tag + FULL COMMIT SHA pinned at install (F6-PD-03). */
export interface InstallRecord {
  tag: string;
  sha: string;
  installedAt: string;
  selfUpdateEnabled: boolean;
  keptPrior: KeptPrior | null;
  updateLog: UpdateLogEntry[];
  /** BQ8 health gate: consecutive post-activation failures. */
  consecutiveFailures: number;
  /** Second consecutive failure parks for the user (no infinite loop). */
  parked: boolean;
}

export type UpdateVerdict =
  | "installed"
  | "staged"
  | "activated"
  | "reverted"
  | "parked"
  | "refused"
  | "warned"
  | "no-op";

export interface UpdateOutcome {
  verdict: UpdateVerdict;
  reason: string;
  /** NEVER SILENT (Q6): every install-changing outcome discloses. */
  disclosure: string;
}

/** SHA sole-authority comparison (F6-PD-03). */
export function verifySha(recordedSha: string, observedSha: string): boolean {
  return recordedSha === observedSha;
}

function semParts(v: string): number[] {
  return v.replace(/^v/, "").split(".").map((p) => {
    const n = parseInt(p, 10);
    return Number.isNaN(n) ? 0 : n;
  });
}

/** Version ordering for the never-downgrade gate (mechanism, not a value). */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const x = semParts(a);
  const y = semParts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const l = x[i] ?? 0;
    const r = y[i] ?? 0;
    if (l < r) return -1;
    if (l > r) return 1;
  }
  return 0;
}

/**
 * F6-PD-03 install: the FULL COMMIT SHA pins at install as sole authority.
 * A SHA mismatch at install REFUSES (install integrity); a moved or retagged
 * ref never changes the recorded SHA and surfaces as a mismatch here.
 */
export function recordInstall(input: {
  tag: string;
  claimedSha: string;
  observedSha: string;
  at: string;
}): { record: InstallRecord } | UpdateOutcome {
  if (!verifySha(input.claimedSha, input.observedSha)) {
    const reason = `install refused: SHA mismatch for ${input.tag} (F6-PD-03)`;
    return { verdict: "refused", reason, disclosure: reason };
  }
  return {
    record: {
      tag: input.tag,
      sha: input.observedSha,
      installedAt: input.at,
      selfUpdateEnabled: true,
      keptPrior: null,
      updateLog: [],
      consecutiveFailures: 0,
      parked: false,
    },
  };
}

/**
 * F6-PD-02 drift: warn-only. The install keeps serving the pin with no block
 * or auto-correct; the notice is recorded.
 */
export function checkDrift(recordedSha: string, liveSha: string): UpdateOutcome {
  if (verifySha(recordedSha, liveSha)) {
    return { verdict: "no-op", reason: "no drift: live source matches the recorded SHA", disclosure: "" };
  }
  const reason = "drift: live source diverged from the recorded pin; warn-only, install keeps serving the pin (F6-PD-02)";
  return { verdict: "warned", reason, disclosure: reason };
}

/**
 * F6Q2 versioning: the manual bump ADVANCES the pin (notify-only path); the
 * self-update RECONCILES to the pin and never advances beyond it. A bump
 * re-verifies: mismatch REFUSES (F6-PD-03).
 */
export function bumpPin(
  record: InstallRecord,
  input: { newTag: string; claimedSha: string; observedSha: string; at: string; userApproved: boolean },
): { record: InstallRecord } | UpdateOutcome {
  if (!input.userApproved) {
    const reason = "bump refused: manual pin advance needs the user's word (F6-Q2 notify-only)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  if (!verifySha(input.claimedSha, input.observedSha)) {
    const reason = `bump refused: SHA mismatch for ${input.newTag} (F6-PD-03)`;
    return { verdict: "refused", reason, disclosure: reason };
  }
  return {
    record: {
      ...record,
      keptPrior: { tag: record.tag, sha: record.sha },
      tag: input.newTag,
      sha: input.observedSha,
      updateLog: [...record.updateLog, { from: record.tag, to: input.newTag, trigger: "manual-bump", at: input.at }],
    },
  };
}

/** Self-update reconciliation target: the pin only, never beyond it. */
export function reconcileTarget(record: InstallRecord): { tag: string; sha: string } {
  return { tag: record.tag, sha: record.sha };
}

export interface StageInput {
  record: InstallRecord;
  /** Candidate now in the staging slot. */
  stagedTag: string;
  stagedSha: string;
  /** Integrity of the staged bytes against the recorded SHA, checked pre-swap. */
  stagedBytesMatchRecordedSha: boolean;
  /** Never swap mid-session (F5 stability): activation defers to next restart. */
  midSession: boolean;
  /** Channel outage (GitHub unreachable/auth failure): keep current, warn. */
  channelReachable: boolean;
  trigger: string;
  at: string;
}

/**
 * F6-PD-04/05 staging-and-swap: startup check, staging slot, pre-swap SHA
 * verification against the recorded SHA, next-restart-only activation,
 * never-downgrade, kill-switch, failure-keeps-current. Every outcome that
 * changes or would change the install discloses (NEVER SILENT, Q6).
 * The returned record carries the update-log append on every path that logs;
 * the outcome carries the verdict + disclosure.
 */
export interface StageResult {
  record: InstallRecord;
  outcome: UpdateOutcome;
}

export function stageUpdate(input: StageInput): StageResult {
  const { record } = input;
  if (!record.selfUpdateEnabled) {
    const reason = `no check or download runs: kill-switch ${SELF_UPDATE_SWITCH} off (F6-PD-05)`;
    return { record, outcome: { verdict: "refused", reason, disclosure: reason } };
  }
  if (!input.channelReachable) {
    const reason = "channel outage: current state kept, warned; never a partial install (F6 §7.7)";
    return { record, outcome: { verdict: "warned", reason, disclosure: reason } };
  }
  if (compareVersions(input.stagedTag, record.tag) < 0) {
    const reason = `downgrade refused: staged ${input.stagedTag} older than current ${record.tag} (F6-PD-05; sole carve-out is the explicit user revert)`;
    return { record, outcome: { verdict: "refused", reason, disclosure: reason } };
  }
  if (compareVersions(input.stagedTag, record.tag) === 0) {
    return {
      record,
      outcome: { verdict: "no-op", reason: "already reconciled to the pin; self-update never advances (F6-Q2)", disclosure: "" },
    };
  }
  if (!input.stagedBytesMatchRecordedSha || !verifySha(input.stagedSha, record.sha)) {
    const reason = "staged version failed pre-swap SHA verification: current kept, warned; install never bricked (F6-PD-04/05)";
    const kept: InstallRecord = {
      ...record,
      updateLog: [...record.updateLog, { from: record.tag, to: input.stagedTag, trigger: `${input.trigger} (verify-failed, kept-current)`, at: input.at }],
    };
    return {
      record: kept,
      outcome: { verdict: "warned", reason, disclosure: `${reason}; old→new attempt ${record.tag}→${input.stagedTag} logged` },
    };
  }
  // Staging keeps the pre-swap record intact until next-restart activation;
  // the staged bytes live in the staging slot only (F6-PD-04).
  const staged: InstallRecord = {
    ...record,
    updateLog: [...record.updateLog, { from: record.tag, to: input.stagedTag, trigger: input.trigger, at: input.at }],
  };
  if (input.midSession) {
    const reason = `staged ${input.stagedTag}: activation deferred to next restart; current session finishes on ${record.tag} (F6-PD-04)`;
    return { record: staged, outcome: { verdict: "staged", reason, disclosure: reason } };
  }
  return {
    record: staged,
    outcome: { verdict: "staged", reason: `staged ${input.stagedTag}: activates at next restart (F6-PD-04)`, disclosure: `staged ${input.stagedTag} from ${record.tag} via ${input.trigger} (F6-PD-04)` },
  };
}

/**
 * Next-restart activation: the staged version becomes current; the replaced
 * version becomes the ONE kept prior (F6-PD-05).
 */
export function activateStaged(
  record: InstallRecord,
  staged: { tag: string; sha: string },
  input: { midSession: boolean; at: string },
): { record: InstallRecord } | UpdateOutcome {
  if (input.midSession) {
    const reason = "activation refused mid-session: next restart only (F6-PD-04)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  if (!verifySha(staged.sha, record.sha)) {
    const reason = "activation refused: staged SHA no longer matches the recorded SHA (F6-PD-04 pre-swap)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  return {
    record: {
      ...record,
      keptPrior: { tag: record.tag, sha: record.sha },
      tag: staged.tag,
      consecutiveFailures: 0,
      parked: false,
    },
  };
}

/**
 * F6-PD-05 sole sanctioned downgrade: an explicit user-commanded revert to
 * the ONE kept prior. Every other downgrade stays refused.
 */
export function userRevert(
  record: InstallRecord,
  input: { userCommanded: boolean; at: string },
): { record: InstallRecord } | UpdateOutcome {
  if (!input.userCommanded) {
    const reason = "downgrade refused: only an explicit user-commanded revert to the kept prior passes (F6-PD-05)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  if (record.keptPrior === null) {
    const reason = "revert refused: no kept prior (F6-PD-05)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  const prior = record.keptPrior;
  return {
    record: {
      ...record,
      keptPrior: { tag: record.tag, sha: record.sha },
      tag: prior.tag,
      sha: prior.sha,
      consecutiveFailures: 0,
      parked: false,
      updateLog: [...record.updateLog, { from: record.tag, to: prior.tag, trigger: "explicit-user-revert", at: input.at }],
    },
  };
}

/**
 * BQ8 health gate: a startup failure after activation triggers ONE automatic
 * revert to the kept prior (logged, disclosed); a second consecutive failure
 * parks for the user (no infinite loop).
 */
export interface HealthResult {
  record: InstallRecord;
  /** BQ8: the automatic revert discloses; a park discloses; healthy is silent. */
  disclosure: string;
  parked: boolean;
}

export function healthGate(record: InstallRecord, input: { healthy: boolean; at: string }): HealthResult {
  if (input.healthy) {
    return { record: { ...record, consecutiveFailures: 0 }, disclosure: "", parked: false };
  }
  const failures = record.consecutiveFailures + 1;
  if (failures === 1) {
    if (record.keptPrior === null) {
      const reason = "post-activation failure with no kept prior: parked for the user (BQ8)";
      return { record: { ...record, consecutiveFailures: failures, parked: true }, disclosure: reason, parked: true };
    }
    const prior = record.keptPrior;
    const reverted: InstallRecord = {
      ...record,
      keptPrior: { tag: record.tag, sha: record.sha },
      tag: prior.tag,
      sha: prior.sha,
      consecutiveFailures: failures,
      parked: false,
      updateLog: [...record.updateLog, { from: record.tag, to: prior.tag, trigger: "automatic-revert (BQ8, disclosed)", at: input.at }],
    };
    return {
      record: reverted,
      disclosure: `ONE automatic revert to the kept prior ${prior.tag} (BQ8); logged and disclosed`,
      parked: false,
    };
  }
  const reason = `second consecutive failure: parked for the user, no further automatic revert (BQ8)`;
  return { record: { ...record, consecutiveFailures: failures, parked: true }, disclosure: reason, parked: true };
}

/** Deleting old versions past the one kept prior is Q6-gated (F6-PD-05). */
export function pruneBeyondKeptPrior(input: { userApproved: boolean }): UpdateOutcome {
  if (!input.userApproved) {
    const reason = "deletion past the one kept prior refused: Q6 approval required (F6-PD-05)";
    return { verdict: "refused", reason, disclosure: reason };
  }
  return { verdict: "no-op", reason: "prune approved under Q6; the one kept prior stands", disclosure: "prune past kept prior ran under Q6 approval (F6-PD-05)" };
}

// --- Unsupported-OS behavior (F6-PD-09) ---

export type OsFamily = "windows" | "macos" | "linux" | "other" | "uncertain";

export interface PrereqInput {
  os: OsFamily;
  nodeVersion: string | null;
  /** Explicit experiment override flag. */
  overrideFlag: boolean;
  /** Prerequisite manifest check (OS family + Node floor) passed. */
  prereqsOk: boolean;
  /** Section-7 injected banner value; absent/null falls back to the disclosed default below. */
  degradedBanner?: string | null;
}

export type OsVerdict = "proceed" | "proceed-banner" | "refused";

export interface OsOutcome {
  verdict: OsVerdict;
  reason: string;
  disclosure: string;
  /** The degraded banner rides install AND runtime wherever it applies. */
  banner: string | null;
}

/**
 * Disclosed default fallback for the Section-7 degraded banner: the banner
 * string arrives as an injected value per the module header contract; this
 * hardcoded string is the default used while no value is injected. Pin state:
 * UNVERIFIED draft pending the build pin — never a spec claim.
 */
export const DEGRADED_BANNER = "degraded support: best-effort OS; fixed-integrity rules still apply (F6-PD-09; BQ6)";
/** Pin state of the default banner fallback: UNVERIFIED draft pending the build pin. */
export const DEGRADED_BANNER_PIN = "UNVERIFIED" as const;

/**
 * Injection seam: an injected Section-7 banner value wins; otherwise the
 * disclosed default fallback above applies (marked UNVERIFIED via
 * DEGRADED_BANNER_PIN pending the build pin).
 */
export function resolveDegradedBanner(injected?: string | null): string {
  if (typeof injected === "string" && injected.length > 0) return injected;
  return DEGRADED_BANNER;
}

function nodeOk(version: string | null): boolean {
  if (version === null) return false;
  return compareVersions(version, NODE_FLOOR) >= 0;
}

/**
 * F6-PD-09: prerequisite failure refuses with guidance; Windows+macOS
 * proceed; Linux proceeds with the degraded banner; any other OS refuses
 * unless the override flag is given (banner retained). Uncertain falls back
 * to the STRICTER branch (refuse). The banner never waives fixed integrity.
 */
export function classifyOs(input: PrereqInput): OsOutcome {
  if (!input.prereqsOk || !nodeOk(input.nodeVersion)) {
    const reason = `install refused: prerequisite check failed (OS family + Node >= ${NODE_FLOOR}); guidance issued (F6-PD-09)`;
    return { verdict: "refused", reason, disclosure: reason, banner: null };
  }
  switch (input.os) {
    case "windows":
    case "macos":
      return { verdict: "proceed", reason: `supported OS (${input.os}): proceeds (F6-PD-09)`, disclosure: "", banner: null };
    case "linux":
      return {
        verdict: "proceed-banner",
        reason: "best-effort OS (Linux): proceeds with the degraded-support banner at install and runtime (F6-PD-09)",
        disclosure: "best-effort OS: degraded-support banner shown (F6-PD-09)",
        banner: resolveDegradedBanner(input.degradedBanner),
      };
    case "other":
      if (input.overrideFlag) {
        return {
          verdict: "proceed-banner",
          reason: "unlisted OS with the explicit override flag: proceeds, banner retained (F6-PD-09)",
          disclosure: "override flag used on an unlisted OS: banner retained (F6-PD-09)",
          banner: resolveDegradedBanner(input.degradedBanner),
        };
      }
      return {
        verdict: "refused",
        reason: "install refused: unlisted OS without the explicit override flag (F6-PD-09)",
        disclosure: "install refused: unlisted OS without the explicit override flag (F6-PD-09)",
        banner: null,
      };
    case "uncertain":
      return {
        verdict: "refused",
        reason: "install refused: uncertain classification falls back to the STRICTER branch (F6-PD-09)",
        disclosure: "install refused: uncertain classification falls back to the STRICTER branch (F6-PD-09)",
        banner: null,
      };
  }
}
