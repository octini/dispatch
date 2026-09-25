// Dispatch Slice 2 — F9 bootstrap and initialization.
// Spec authority: docs/features/bootstrap-init.md (F9-BS-01 … F9-BS-14).
// Section-7 mechanisms (exact marker strings, settings schema/merge shape,
// kill-switch wiring, retry bookkeeping) arrive as injected values, never
// spec claims. Probes stay open (PRIMARY-SPEC PS-GATE list); this module is
// the specified behavior, not proven runtime enforcement. No implementation
// here commits, pushes, or installs globally — the effects surface has no
// commit/push/install-global path by construction.

/** F9-BS-14: 3 failures then a VISIBLE parked-failure (research-recorded, promoted).
 * Retry-counter separation: this bootstrap cap (per-step, caller-persisted
 * across restarts — the parked-failure persists and the counter never resets,
 * never unbounded replay) is a SEPARATE surface from the tracker failed-read
 * backoff (F18-VT-09); neither charges the other. */
export const SETUP_RETRY_CAP = 3;

/** F9-BS-08 version floors (MANIFEST pin), enforced on the present branch too. */
export const BD_VERSION_FLOOR = "0.59.0";
export const DOLT_VERSION_FLOOR = "2.1.0";

/** Single park semantics in this spec: F3-SD-04a (F9-BS-14). No second kind. */
export const PARK_SEMANTICS = "F3-SD-04a" as const;

// --- 2.1 trigger and bail (F9-BS-01) ---
//
// Design line (NB-3): setup.enabled:false records the SUPPRESSED STATE (the
// missing surfaces plus disabled by switch) and never re-fires within the
// session; each session start re-evaluates (the switch is re-read) but NEVER
// auto-fires while disabled (the user's re-enable is the way).

export type TriggerVerdict = "fire" | "bail-slash" | "bail-recheck" | "wait-primary" | "bail-disabled";

export interface TriggerInput {
  /** Raw first input. ANY user-authored non-command input counts as real prose. */
  input: string;
  isPrimarySession: boolean;
  isRecheckPath: boolean;
  /** setup.enabled:false suppresses the ENTIRE bootstrap — the trigger included, not just the writes. */
  setupEnabled?: boolean;
}

export function evaluateTrigger(t: TriggerInput): TriggerVerdict {
  // setup.enabled:false suppresses the entire bootstrap, trigger included.
  if (t.setupEnabled === false) return "bail-disabled";
  // A first touch in a non-primary session waits for the primary session.
  if (!t.isPrimarySession) return "wait-primary";
  // Re-check paths bail per PRD.md:227-228 — no fresh bootstrap fires.
  if (t.isRecheckPath) return "bail-recheck";
  // Slash-command input bails (research-recorded "bail on /").
  if (t.input.startsWith("/")) return "bail-slash";
  // Pastes and single words included: non-command input is real prose.
  return "fire";
}

// --- 2.2 needsSetup signals (F9-BS-02) ---

export type SurfaceState = "absent" | "present" | "modified" | "deleted";

export interface ProjectSignals {
  /** git rev-parse. */
  gitRepoPresent: boolean;
  nestedInsideRepo: boolean;
  piSettingsPresent: boolean;
  /** Unparseable settings read as NOT set up. */
  piSettingsParseable: boolean;
  beadsPresent: boolean;
  /** Empty .beads reads as NOT set up. */
  beadsEmpty: boolean;
  bdInstalled: boolean;
  bdVersion: string | null;
  doltVersion: string | null;
  bdUpgradeRefused: boolean;
  /** Step 4 plugin block, under its own marker namespace. */
  pluginBlock: SurfaceState;
  /** Step 3 advice block, under a SEPARATE marker namespace (F9-BS-08/09). */
  adviceBlock: SurfaceState;
  /** .pi/settings.json registration entry. */
  settingsEntry: SurfaceState;
  /** .gitignore additions. */
  gitignoreEntry: SurfaceState;
  /** Corrupt/marker-only state reads as NOT set up. */
  markersCorrupt: boolean;
}

function semParts(v: string): number[] {
  return v.split(".").map((p) => {
    const n = parseInt(p, 10);
    return Number.isNaN(n) ? 0 : n;
  });
}

export function versionGte(version: string | null, floor: string): boolean {
  if (version === null) return false;
  const a = semParts(version);
  const b = semParts(floor);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return true;
}

/** Below-floor reads as NOT set up (F9-BS-08). Null versions never pass. */
export function bdFloorOk(s: ProjectSignals): boolean {
  return (
    s.bdInstalled &&
    versionGte(s.bdVersion, BD_VERSION_FLOOR) &&
    versionGte(s.doltVersion, DOLT_VERSION_FLOOR)
  );
}

export interface StepNeed {
  step1Git: boolean;
  step2Settings: boolean;
  step3Beads: boolean;
  step4Agents: boolean;
}

/**
 * Marker-namespace independence invariant (F9-BS-08/09): the step-3 advice
 * append keys ONLY on the advice markers; the step-4 plugin block keys ONLY
 * on the plugin markers; neither absent-check reads the other's markers.
 * markersCorrupt is shared-file health, not the other block's markers: it
 * forces BOTH surfaces to re-verify and never masks either reading silently.
 * The single-run dual-append is idempotent per-surface: each surface appends
 * at most once per run, and a later run finds both present and skips.
 */
/** Four INDEPENDENT signals, each driving only its step (F9-BS-02/04).
 * A modified surface still needs its step: no write runs, but the user-wins
 * divergence disclosure does (F9-BS-10). */
export function computeNeed(s: ProjectSignals): StepNeed {
  const settingsFileOk = s.piSettingsPresent && s.piSettingsParseable;
  const settingsEntryOk = s.settingsEntry === "present";
  const beadsOk = s.beadsPresent && !s.beadsEmpty && bdFloorOk(s);
  const adviceOk = s.adviceBlock === "present" && !s.markersCorrupt;
  const pluginOk = s.pluginBlock === "present" && !s.markersCorrupt;
  return {
    step1Git:
      !s.gitRepoPresent || s.gitignoreEntry !== "present",
    step2Settings: !settingsFileOk || !settingsEntryOk,
    step3Beads: !beadsOk || !adviceOk,
    step4Agents: !pluginOk,
  };
}

// --- Canonical order, kill switches, effects, runner (F9-BS-03/04, C7) ---

export type StepId = "step1-git" | "step2-settings" | "step3-beads" | "step4-agents";

/** Kill-switch names per the record (F9 C7, research-recorded, pinned at build). */
export interface KillSwitches {
  setupEnabled: boolean;
  autoInstallBeads: boolean;
  autoInitGit: boolean;
  autoInitPiSettings: boolean;
}

/**
 * Step→switch table (F9 C7, research-recorded, pinned at build):
 * step1-git → autoInitGit; step2-settings → autoInitPiSettings;
 * step3-beads → autoInstallBeads (the install AND the below-floor upgrade) +
 * setup.enabled; step4-agents → setup.enabled. setup.enabled:false suppresses
 * the ENTIRE bootstrap (the trigger bail plus the runBootstrap early return).
 * A killed step = skipped + DISCLOSED, never silently re-run.
 */
export const STEP_SWITCH_TABLE: Record<StepId, Array<keyof KillSwitches>> = {
  "step1-git": ["autoInitGit"],
  "step2-settings": ["autoInitPiSettings"],
  "step3-beads": ["autoInstallBeads", "setupEnabled"],
  "step4-agents": ["setupEnabled"],
};

/**
 * The 5 needsSetup signals' distinct failure modes (F9-BS-02), each driving
 * only its step: .beads presence = the tracker store exists; BEGIN marker =
 * the integration installed; settings registration = the config registered;
 * advice marker = the beads setup ran; git rev-parse = the repo exists.
 */
export const NEEDS_SETUP_SIGNAL_MAP: ReadonlyArray<{ signal: string; means: string; step: StepId }> = [
  { signal: ".beads presence", means: "tracker store exists", step: "step3-beads" },
  { signal: "BEGIN marker", means: "integration installed", step: "step4-agents" },
  { signal: "settings registration", means: "config registered", step: "step2-settings" },
  { signal: "advice marker", means: "beads setup ran", step: "step3-beads" },
  { signal: "git rev-parse", means: "repo exists", step: "step1-git" },
];

/** A killed step never runs: skipped + disclosed, never silently re-run. */
export function stepSwitchAllows(step: StepId, kill: KillSwitches): boolean {
  return STEP_SWITCH_TABLE[step].every((name) => kill[name]);
}

export const DEFAULT_KILL_SWITCHES: KillSwitches = {
  setupEnabled: true,
  autoInstallBeads: true,
  autoInitGit: true,
  autoInitPiSettings: true,
};

export type EffectResult = "ok" | "failed" | "denied-f2";
export type SurfaceResult = "ok" | "user-edit-wins" | "failed" | "denied-f2";

export interface BootstrapEffects {
  gitInit(): EffectResult;
  appendGitignore(): SurfaceResult;
  /** Create-or-merge: user content never clobbered (F9-BS-07; F9-Q8). */
  mergeSettings(): SurfaceResult;
  /** Installer-selected checksum-verified provisioning (MANIFEST/F4/F6). */
  installBd(): EffectResult;
  bdInit(): EffectResult;
  /** bd setup + advice append into its OWN marker namespace (F9-BS-08). */
  bdSetupAdvice(): SurfaceResult;
  appendPluginBlock(): SurfaceResult;
  /** Below-floor upgrade via the verified installer path, with disclosure. */
  upgradeBd(): EffectResult;
  disclose(message: string): void;
  /** Disclose-and-ask. True = the user said re-add. */
  ask(message: string): boolean;
}

export type StepStatus =
  | "ran"
  | "skipped-setup"
  | "skipped-nested"
  | "skipped-killswitch"
  | "skipped-user-edit"
  | "awaiting-user"
  | "failed"
  | "parked";

export interface StepReport {
  step: StepId;
  status: StepStatus;
  detail: string;
  failures: number;
}

/** VISIBLE parked-failure: never labeled already-set-up (F9-BS-14). */
export interface ParkRecord {
  step: StepId;
  park: typeof PARK_SEMANTICS;
  visible: true;
  readsAsSetup: false;
  failures: number;
  reason: string;
}

/**
 * Closed log vocabulary. Logs carry step + event literal only — file
 * contents can never reach them (privacy guard). The merge effects see
 * content; they never log it.
 */
export type BootstrapEvent =
  | "step-skipped-setup"
  | "step-skipped-nested"
  | "step-skipped-killswitch"
  | "step-skipped-user-edit"
  | "step-ran"
  | "step-failed"
  | "step-denied-f2"
  | "step-parked"
  | "surface-ask"
  | "surface-user-edit-wins"
  | "upgrade-attempted"
  | "upgrade-refused";

export interface BootstrapLogEntry {
  step: StepId | "bootstrap";
  event: BootstrapEvent;
}

export interface BootstrapInput {
  signals: ProjectSignals;
  kill: KillSwitches;
  /** First pass appends only-when-absent; later absent discloses-and-asks. */
  firstPass: boolean;
  /** Caller-persisted across re-checks; mutated in place. */
  failures: Record<StepId, number>;
  /** Parked steps re-run only via re-check or explicit user action. */
  reattemptParked: boolean;
  effects: BootstrapEffects;
}

export interface BootstrapReport {
  enabled: boolean;
  steps: StepReport[];
  parks: ParkRecord[];
  disclosures: string[];
  log: BootstrapLogEntry[];
  /** Suppressed state (NB-3): set only when setup.enabled:false suppresses the run. */
  suppressed: SuppressedState | null;
}

/** Suppressed-trigger record (NB-3): what is hidden and by which switch. */
export interface SuppressedState {
  disabledBySwitch: "setup.enabled";
  missingSteps: StepId[];
}

const STEP_ORDER: StepId[] = ["step1-git", "step2-settings", "step3-beads", "step4-agents"];

export function freshFailures(): Record<StepId, number> {
  return { "step1-git": 0, "step2-settings": 0, "step3-beads": 0, "step4-agents": 0 };
}

type SurfaceResolution =
  | { done: false; report: StepReport }
  | { done: true; result: SurfaceResult };

export function runBootstrap(input: BootstrapInput): BootstrapReport {
  const { signals: s, kill, firstPass, failures, reattemptParked, effects } = input;
  const report: BootstrapReport = {
    enabled: kill.setupEnabled,
    steps: [],
    parks: [],
    disclosures: [],
    log: [],
    suppressed: null,
  };
  const disclose = (message: string): void => {
    report.disclosures.push(message);
    effects.disclose(message);
  };
  const log = (step: StepId | "bootstrap", event: BootstrapEvent): void => {
    report.log.push({ step, event });
  };

  if (!kill.setupEnabled) {
    // Suppressed-trigger rediscovery (NB-3): record WHAT is suppressed and BY
    // which switch; never re-fire within the session (no effect runs below).
    // Each session start re-runs this path (the switch is re-read) but never
    // auto-fires while disabled; the user's re-enable is the way.
    const need = computeNeed(s);
    const missingSteps = STEP_ORDER.filter((step) => {
      if (step === "step1-git") return need.step1Git;
      if (step === "step2-settings") return need.step2Settings;
      if (step === "step3-beads") return need.step3Beads;
      return need.step4Agents;
    });
    report.suppressed = { disabledBySwitch: "setup.enabled", missingSteps };
    disclose(
      "suppressed surfaces (disabled by switch setup.enabled): " +
        (missingSteps.length > 0 ? missingSteps.join(", ") : "none pending") +
        "; re-enable to run; never auto-fires while disabled",
    );
    disclose("bootstrap disabled via setup.enabled; no step runs");
    log("bootstrap", "step-skipped-killswitch");
    return report;
  }

  const need = computeNeed(s);

  const parkVisible = (step: StepId, reason: string): StepReport => {
    const park: ParkRecord = {
      step,
      park: PARK_SEMANTICS,
      visible: true,
      readsAsSetup: false,
      failures: failures[step],
      reason,
    };
    report.parks.push(park);
    log(step, "step-parked");
    disclose(
      `parked failure on ${step} after ${failures[step]} failure(s) (${PARK_SEMANTICS}); re-check or explicit user action may re-attempt`,
    );
    return { step, status: "parked", detail: reason, failures: failures[step] };
  };

  /** Single failure-accounting point: 3 failures park, fewer report failed. */
  const fail = (step: StepId, reason: string): StepReport => {
    failures[step] += 1;
    if (failures[step] >= SETUP_RETRY_CAP) return parkVisible(step, reason);
    log(step, "step-failed");
    return { step, status: "failed", detail: reason, failures: failures[step] };
  };

  /** F2 denial or trust race mid-step: THAT step parks fail-closed, rest continue. */
  const denyPark = (step: StepId, reason: string): StepReport => {
    log(step, "step-denied-f2");
    const park: ParkRecord = {
      step,
      park: PARK_SEMANTICS,
      visible: true,
      readsAsSetup: false,
      failures: failures[step],
      reason,
    };
    report.parks.push(park);
    disclose(`${reason} (${PARK_SEMANTICS}); independent steps continue`);
    return { step, status: "parked", detail: reason, failures: failures[step] };
  };

  const settle = (step: StepId, result: EffectResult, reason: string): StepReport => {
    if (result === "ok") {
      failures[step] = 0;
      log(step, "step-ran");
      return { step, status: "ran", detail: reason, failures: failures[step] };
    }
    if (result === "denied-f2") return denyPark(step, reason);
    return fail(step, reason);
  };

  /** A parked step stays parked until a re-check re-attempts it. */
  const stillParked = (step: StepId): StepReport | null => {
    if (failures[step] >= SETUP_RETRY_CAP && !reattemptParked) {
      return parkVisible(step, "parked failure persists; no re-attempt requested");
    }
    return null;
  };

  const skipped = (step: StepId, status: StepStatus, detail: string): StepReport => {
    const event: BootstrapEvent =
      status === "skipped-setup"
        ? "step-skipped-setup"
        : status === "skipped-nested"
          ? "step-skipped-nested"
          : status === "skipped-killswitch"
            ? "step-skipped-killswitch"
            : "step-skipped-user-edit";
    log(step, event);
    return { step, status, detail, failures: failures[step] };
  };

  /**
   * One plugin-owned surface, exactly one effect call. First pass applies
   * under only-when-absent; a later absent/deleted surface discloses-and-asks
   * (never silent re-add); a user edit wins with divergence disclosed.
   */
  const resolveSurface = (
    step: StepId,
    question: string,
    apply: () => SurfaceResult,
  ): SurfaceResolution => {
    // Corrupt AGENTS.md markers never reach this path silently: the step-3
    // advice and step-4 plugin legs route corrupt surfaces through
    // disclose-and-ask first (rewrite-eligible, never silent).
    if (firstPass) {
      const r = apply();
      if (r === "user-edit-wins") {
        disclose(`${question} kept: user edit wins, divergence disclosed`);
        log(step, "surface-user-edit-wins");
        return {
          done: false,
          report: skipped(step, "skipped-user-edit", "user edit wins with divergence disclosed"),
        };
      }
      return { done: true, result: r };
    }
    disclose(question);
    log(step, "surface-ask");
    if (!effects.ask(question)) {
      // A "no" is a RECORDED disclosed-skip — no re-ask loop, no silent skip.
      return {
        done: false,
        report: { step, status: "awaiting-user", detail: "recorded disclosed-skip", failures: failures[step] },
      };
    }
    const r = apply();
    if (r === "user-edit-wins") {
      disclose(`${question} kept: user edit wins, divergence disclosed`);
      log(step, "surface-user-edit-wins");
      return {
        done: false,
        report: skipped(step, "skipped-user-edit", "user edit wins with divergence disclosed"),
      };
    }
    return { done: true, result: r };
  };

  /** user-edit-wins surfaces settle as ok: the surface stands, divergence disclosed. */
  const surfaceToEffect = (r: SurfaceResult): EffectResult => (r === "user-edit-wins" ? "ok" : r);

  // --- Step 1: nested-guard then git init only if absent (F9-BS-05/06) ---
  const runStep1 = (): StepReport => {
    const step: StepId = "step1-git";
    if (!need.step1Git) return skipped(step, "skipped-setup", "repo and gitignore present");
    const held = stillParked(step);
    if (held !== null) return held;
    if (!s.gitRepoPresent) {
      if (!stepSwitchAllows(step, kill)) {
        disclose("step1-git refused: autoInitGit disabled");
        return skipped(step, "skipped-killswitch", "autoInitGit disabled");
      }
      // Zero git writes inside a nested repo — Step 1 skipped only (F9-BS-05).
      if (s.nestedInsideRepo) {
        disclose("nested repo context: in-place operation, zero git writes; step 1 skipped only");
        return skipped(step, "skipped-nested", "nested repo: steps 2-4 continue");
      }
      // No initial commit, no push ever: the effects surface has neither.
      const r = effects.gitInit();
      if (r !== "ok") return settle(step, r, "git init failed");
    }
    // .gitignore appended only if absent (research-backed rule).
    if (s.gitignoreEntry === "modified") {
      disclose("gitignore additions differ from shipped version; user edit wins");
      log(step, "surface-user-edit-wins");
      failures[step] = 0;
      log(step, "step-ran");
      return { step, status: "ran", detail: "git work complete; gitignore user edit wins", failures: failures[step] };
    }
    if (s.gitignoreEntry === "absent" || s.gitignoreEntry === "deleted") {
      const resolved = resolveSurface(step, "gitignore additions missing — re-add?", () =>
        effects.appendGitignore(),
      );
      if (!resolved.done) return resolved.report;
      if (resolved.result !== "ok") return settle(step, surfaceToEffect(resolved.result), "gitignore append failed");
    }
    failures[step] = 0;
    log(step, "step-ran");
    return { step, status: "ran", detail: "step 1 work complete", failures: failures[step] };
  };

  // --- Step 2: create-or-merge .pi/settings.json (F9-BS-07; F9-Q8) ---
  const runStep2 = (): StepReport => {
    const step: StepId = "step2-settings";
    if (!need.step2Settings) return skipped(step, "skipped-setup", "settings present and parseable");
    const held = stillParked(step);
    if (held !== null) return held;
    if (!stepSwitchAllows(step, kill)) {
      disclose("step2-settings refused: autoInitPiSettings disabled");
      return skipped(step, "skipped-killswitch", "autoInitPiSettings disabled");
    }
    const fileMissing = !s.piSettingsPresent || !s.piSettingsParseable;
    if (!fileMissing && s.settingsEntry === "modified") {
      disclose("settings registration differs from shipped version; user edit wins");
      log(step, "surface-user-edit-wins");
      return skipped(step, "skipped-user-edit", "user edit wins with divergence disclosed");
    }
    const resolved = resolveSurface(step, "settings registration missing — re-add?", () =>
      effects.mergeSettings(),
    );
    if (!resolved.done) return resolved.report;
    return settle(
      step,
      surfaceToEffect(resolved.result),
      "settings registration merged without clobbering user content",
    );
  };

  // --- Step 3: bd init/setup/advice in its OWN marker namespace (F9-BS-08) ---
  const runStep3 = (): StepReport => {
    const step: StepId = "step3-beads";
    if (!need.step3Beads) return skipped(step, "skipped-setup", "beads present with advice block");
    const held = stillParked(step);
    if (held !== null) return held;
    if (!s.bdInstalled) {
      if (!kill.autoInstallBeads) {
        disclose("step3-beads refused: autoInstallBeads disabled");
        return skipped(step, "skipped-killswitch", "autoInstallBeads disabled");
      }
      const r = effects.installBd();
      if (r !== "ok") return settle(step, r, "bd provision failed");
    } else if (!bdFloorOk(s)) {
      // Below-floor reads as NOT set up — verified upgrade or park, never silent.
      disclose(
        `bd below version floor (bd >= ${BD_VERSION_FLOOR}, dolt >= ${DOLT_VERSION_FLOOR}); treated as not-set-up`,
      );
      if (!kill.autoInstallBeads) {
        // The kill switch gates upgrades too (F9 C7): neither install nor
        // upgrade; the below-floor state parks per the F3-SD-04a path.
        disclose("step3-beads refused: autoInstallBeads disabled; below-floor upgrade not attempted");
        log(step, "upgrade-refused");
        return parkVisible(step, "below-floor upgrade refused: autoInstallBeads disabled");
      }
      log(step, "upgrade-attempted");
      if (s.bdUpgradeRefused) {
        log(step, "upgrade-refused");
        return parkVisible(step, "below-floor upgrade refused");
      }
      const u = effects.upgradeBd();
      if (u !== "ok") return settle(step, u, "verified upgrade failed");
    }
    if (!s.beadsPresent || s.beadsEmpty) {
      const r = effects.bdInit();
      if (r !== "ok") return settle(step, r, "bd init failed");
    }
    if (s.adviceBlock === "modified") {
      disclose("advice block differs from shipped version; user edit wins");
      log(step, "surface-user-edit-wins");
      failures[step] = 0;
      log(step, "step-ran");
      return { step, status: "ran", detail: "install/init ran; advice user edit wins", failures: failures[step] };
    }
    // Shared-corrupt-AGENTS.md: corrupt reads as not-set-up even when the
    // block looks present — disclose-and-ask, never a silent rewrite and
    // never both markers masked silently. (Modified above still wins: a user
    // edit is never overwritten.)
    if (s.markersCorrupt) {
      disclose("AGENTS.md markers corrupt: advice surface treated as not-set-up; rewrite needs confirmation — never silent");
      log(step, "surface-ask");
      if (!effects.ask("advice block markers corrupt — repair/re-add?")) {
        return { step, status: "awaiting-user", detail: "recorded disclosed-skip", failures: failures[step] };
      }
      return settle(step, surfaceToEffect(effects.bdSetupAdvice()), "bd setup + advice append complete (corrupt markers repaired with confirmation)");
    }
    if (s.adviceBlock === "absent" || s.adviceBlock === "deleted") {
      const resolved = resolveSurface(step, "advice block missing — re-add?", () =>
        effects.bdSetupAdvice(),
      );
      if (!resolved.done) return resolved.report;
      return settle(step, surfaceToEffect(resolved.result), "bd setup + advice append complete");
    }
    failures[step] = 0;
    log(step, "step-ran");
    return { step, status: "ran", detail: "step 3 work complete", failures: failures[step] };
  };

  // --- Step 4: AGENTS.md plugin block only-when-absent (F9-BS-09) ---
  const runStep4 = (): StepReport => {
    const step: StepId = "step4-agents";
    if (!need.step4Agents) return skipped(step, "skipped-setup", "plugin block present");
    const held = stillParked(step);
    if (held !== null) return held;
    // Step 4 maps to setup.enabled in the step→switch table, enforced by the
    // global gate above; user content outside the block is never touched —
    // the effect appends the delimited block only.
    if (s.pluginBlock === "modified") {
      disclose("plugin block differs from shipped version; user edit wins");
      log(step, "surface-user-edit-wins");
      return skipped(step, "skipped-user-edit", "user edit wins with divergence disclosed");
    }
    // Shared-corrupt-AGENTS.md: corrupt reads as not-set-up even when the
    // block looks present — disclose-and-ask, never a silent rewrite and
    // never both markers masked silently.
    if (s.markersCorrupt) {
      disclose("AGENTS.md markers corrupt: plugin surface treated as not-set-up; rewrite needs confirmation — never silent");
      log(step, "surface-ask");
      if (!effects.ask("plugin block markers corrupt — repair/re-add?")) {
        return { step, status: "awaiting-user", detail: "recorded disclosed-skip", failures: failures[step] };
      }
      return settle(step, surfaceToEffect(effects.appendPluginBlock()), "plugin block appended with confirmation (corrupt markers repaired); user content outside the block untouched");
    }
    const resolved = resolveSurface(step, "plugin block missing — re-add?", () =>
      effects.appendPluginBlock(),
    );
    if (!resolved.done) return resolved.report;
    return settle(
      step,
      surfaceToEffect(resolved.result),
      "plugin block appended; user content outside the block untouched",
    );
  };

  const runners: Record<StepId, () => StepReport> = {
    "step1-git": runStep1,
    "step2-settings": runStep2,
    "step3-beads": runStep3,
    "step4-agents": runStep4,
  };
  // Canonical order per PRD.md:229-235; only missing steps run (F9-BS-03/04).
  for (const step of STEP_ORDER) report.steps.push(runners[step]());
  return report;
}
