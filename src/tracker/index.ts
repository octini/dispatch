// Dispatch Slice 2 — F18 visual tracker.
// Spec authority: docs/features/visual-tracker.md (F18-VT-01 … F18-VT-10).
// Read-only v1: panel mutations refused; the F4-Q3 prose path is the way.
// The F4 Dispatcher-typed-tools-only rule stands unmoved (PS-SEAM-05).
// Dimensions, refresh intervals, command names, and statusline formats stay
// section-7 build pins (BUILD_PINS, all UNVERIFIED); the probe hooks stay
// UNVERIFIED until the PS-GATE-06 live wiring lands.

export type TrackerStatus = "open" | "in_progress" | "blocked" | "closed";

export interface TrackerIssue {
  id: string;
  title: string;
  status: TrackerStatus;
  assignee: string | null;
  priority: string | null;
  deps: string[];
  /** Creation time, milliseconds. Feeds the disclosed age tie-break. */
  createdAt: number;
}

export interface TrackerSnapshot {
  /** Current project's beads store only (F18-VT-06). */
  projectRoot: string;
  issues: TrackerIssue[];
  /** bd native ready order (priority + dependency-aware). */
  readyOrder: string[];
  currentTaskId: string | null;
  progressPath: string | null;
  progressPresent: boolean;
  lastRefreshedAt: number;
}

/** Section-7 build pins: named here, valued at build (C3 holds).
 * Verification plan: each pin closes via its PS-GATE probe path (notably
 * PS-GATE-06 for the TUI/prototype/probe shapes); until then every value
 * stays UNVERIFIED, never invented. */
export const BUILD_PINS = {
  panelDimensions: "UNVERIFIED",
  refreshIntervals: "UNVERIFIED",
  depDepthCap: "UNVERIFIED",
  retryCap: "UNVERIFIED",
  mountVisibilityThreshold: "UNVERIFIED",
} as const;

// --- 2.1 layered shape: statusline presence (F18-VT-01) ---

// RELEASE-GATING record (NB-4): the staleness max-age VALUE (STALENESS_MAX_AGE_PIN) + the park deadline/expiry VALUE (PARK_DEADLINE_PIN) are RELEASE-GATING — the v1 release gate (PRIMARY-SPEC section 8) requires the pin record complete; these cannot backlog past release; they pin at the PS-GATE/build-pin step.
/** Section-7 build pin PINNED (user-worded 2026-09-28): the F18 board/statusline stale threshold = 120s (C3 holds); the boundary holds now. */
export const STALENESS_MAX_AGE_MS = 120_000 as const;
export const STALENESS_MAX_AGE_PIN = "PINNED 120s (120000ms; user-worded 2026-09-28)" as const;

export interface Staleness {
  stale: boolean;
  /** Shown on the board + statusline when the threshold crosses — never just the timestamp. */
  disclosure: string | null;
}

/**
 * Staleness threshold (BN-5): the max-age VALUE stays the section-7 pin;
 * the crossing shows a "stale" disclosure, not just the timestamp.
 */
export function stalenessOf(lastRefreshedAt: number, now: number, maxAgeMs: number): Staleness {
  if (now - lastRefreshedAt > maxAgeMs) {
    return {
      stale: true,
      disclosure: "stale: last refresh exceeded the build-pinned max-age; manual refresh or the next session event re-reads",
    };
  }
  return { stale: false, disclosure: null };
}

export interface StalenessInput {
  now: number;
  maxAgeMs: number;
}

export interface Statusline {
  openCount: number;
  nextReadyId: string | null;
  /** Which rule picked nextReady: bd order, disclosed age tie-break, or none. */
  tieBreak: "bd-ready-order" | "age" | "none";
  lastRefreshedAt: number;
  stale: boolean;
  staleDisclosure: string | null;
}

export function renderStatusline(snap: TrackerSnapshot, staleness?: StalenessInput): Statusline {
  const freshness: Staleness =
    staleness === undefined ? { stale: false, disclosure: null } : stalenessOf(snap.lastRefreshedAt, staleness.now, staleness.maxAgeMs);
  const base = { lastRefreshedAt: snap.lastRefreshedAt, stale: freshness.stale, staleDisclosure: freshness.disclosure };
  const byId = new Map(snap.issues.map((i) => [i.id, i]));
  const openCount = snap.issues.filter((i) => i.status !== "closed").length;
  for (const id of snap.readyOrder) {
    const issue = byId.get(id);
    if (issue !== undefined && issue.status !== "closed") {
      return { openCount, nextReadyId: id, tieBreak: "bd-ready-order", ...base };
    }
  }
  // Disclosed age tie-break, scoped to bd's ready order ONLY (F18-VT-01/F18-Q6
  // + VT-18): the statusline always matches the board's ready list, so an open
  // issue outside readyOrder never surfaces here. Empty — or fully
  // closed/missing — readyOrder yields no next-ready.
  const readyIds = new Set(snap.readyOrder);
  const oldestReady = snap.issues
    .filter((i) => i.status !== "closed" && readyIds.has(i.id))
    .sort((a, b) => a.createdAt - b.createdAt)[0];
  if (oldestReady === undefined) {
    return { openCount, nextReadyId: null, tieBreak: "none", ...base };
  }
  return { openCount, nextReadyId: oldestReady.id, tieBreak: "age", ...base };
}

// --- 2.2 lean v1 board contents (F18-VT-02) ---

export interface BoardRow {
  id: string;
  title: string;
  status: TrackerStatus;
  assignee: string | null;
  priority: string | null;
  /** Bounded dep chain (issue → deps), expanded under bounds.depDepthCap. */
  depChain: { chain: string[]; truncated: boolean; depthCap: number };
}

export type BoardCurrent =
  | { issue: BoardRow; progressPath: string }
  | { issue: BoardRow; progressAbsent: true }
  | null;

export interface BoardView {
  open: BoardRow[];
  ready: BoardRow[];
  blocked: BoardRow[];
  /** Zero current tasks means no highlight, not an error. */
  current: BoardCurrent;
  lastRefreshedAt: number;
  stale: boolean;
  staleDisclosure: string | null;
  /** Empty store renders "no issues". */
  notice: string | null;
}

function rowOf(i: TrackerIssue, byId: Map<string, TrackerIssue>, depthCap: number): BoardRow {
  return {
    id: i.id,
    title: i.title,
    status: i.status,
    assignee: i.assignee,
    priority: i.priority,
    depChain: expandDeps(i.id, byId, depthCap),
  };
}

// Dep chains ride each board row, expanded under bounds.depDepthCap with the
// cycle guard + disclosed truncation (F18-VT-02). TUI composition of these
// chains stays a section-7 build pin under the PS-GATE-06 prototype gate.
export function renderBoard(
  snap: TrackerSnapshot,
  bounds: { depDepthCap: number },
  staleness?: StalenessInput,
): BoardView {
  const byId = new Map(snap.issues.map((i) => [i.id, i]));
  const isOpen = (i: TrackerIssue): boolean => i.status !== "closed";
  const depOpen = (id: string): boolean => {
    const d = byId.get(id);
    return d === undefined || d.status !== "closed";
  };
  const open = snap.issues.filter(isOpen).map((i) => rowOf(i, byId, bounds.depDepthCap));
  const ready = snap.readyOrder
    .map((id) => byId.get(id))
    .filter((i): i is TrackerIssue => i !== undefined && isOpen(i))
    .map((i) => rowOf(i, byId, bounds.depDepthCap));
  const blocked = snap.issues
    .filter((i) => i.status === "blocked" || (isOpen(i) && i.deps.some(depOpen)))
    .map((i) => rowOf(i, byId, bounds.depDepthCap));
  let current: BoardCurrent = null;
  if (snap.currentTaskId !== null) {
    const issue = byId.get(snap.currentTaskId);
    if (issue !== undefined) {
      current =
        snap.progressPresent && snap.progressPath !== null
          ? { issue: rowOf(issue, byId, bounds.depDepthCap), progressPath: snap.progressPath }
          : { issue: rowOf(issue, byId, bounds.depDepthCap), progressAbsent: true };
    }
  }
  const freshness: Staleness =
    staleness === undefined ? { stale: false, disclosure: null } : stalenessOf(snap.lastRefreshedAt, staleness.now, staleness.maxAgeMs);
  return {
    open,
    ready,
    blocked,
    current,
    lastRefreshedAt: snap.lastRefreshedAt,
    stale: freshness.stale,
    staleDisclosure: freshness.disclosure,
    notice: snap.issues.length === 0 ? "no issues" : null,
  };
}

/**
 * Bounded dep-chain expansion: depth cap + cycle guard + disclosed
 * truncation. A cycle never loops; no deps expands to an empty chain.
 */
export function expandDeps(
  issueId: string,
  byId: Map<string, TrackerIssue>,
  depthCap: number,
): { chain: string[]; truncated: boolean; depthCap: number } {
  const chain: string[] = [];
  const seen = new Set<string>([issueId]);
  let truncated = false;
  let frontier: string[] = [...(byId.get(issueId)?.deps ?? [])];
  for (let depth = 0; depth < depthCap; depth++) {
    const next: string[] = [];
    for (const id of frontier) {
      if (seen.has(id)) {
        truncated = true;
        continue;
      }
      seen.add(id);
      chain.push(id);
      next.push(...(byId.get(id)?.deps ?? []));
    }
    frontier = next;
    if (frontier.length === 0) return { chain, truncated, depthCap };
  }
  if (frontier.length > 0) truncated = true;
  return { chain, truncated, depthCap };
}

// --- 2.3 read-only v1 + seats' no-mutation rule (F18-VT-03/04) ---

export interface PanelRefusal {
  refused: true;
  way: string;
}

export function panelAction(requested: "claim" | "close" | "defer"): PanelRefusal {
  void requested;
  return { refused: true, way: "read-only v1: the F4-Q3 prose path is the way" };
}

export function surfaceWidening(requested: "charts" | "history" | "cross-project"): PanelRefusal {
  void requested;
  return { refused: true, way: "lean contract holds: no charts, no history views, current project only" };
}

export function seatPanelMutation(seat: string): PanelRefusal {
  void seat;
  return {
    refused: true,
    way: "dispatcher typed-tools-only stands (F4-BI-07); no seat-side panel mutation path exists",
  };
}

// --- 2.4 update cadence: session events + manual (F18-VT-05) ---

export type RefreshTrigger =
  | "session_start"
  | "tool_call"
  | "tool_result"
  | "manual"
  | "external-edit"
  | "other-hook";

/**
 * Honest event baseline: refresh on session events plus manual, always.
 * A tracker change landing OUTSIDE a session event does NOT auto-refresh;
 * the manual refresh or the next session event surfaces it, with staleness
 * visible on the last-refreshed indicator. No polling loops in v1.
 */
export function needsRefresh(trigger: RefreshTrigger, afterBdMutation: boolean): boolean {
  switch (trigger) {
    case "manual":
      return true;
    case "session_start":
      return true;
    case "other-hook":
      return true;
    case "tool_call":
    case "tool_result":
      return afterBdMutation;
    case "external-edit":
      return false;
  }
}

// --- 2.5 data scope (F18-VT-06) ---

export function scopeAllows(
  currentRoot: string,
  requestedRoot: string,
): { allowed: boolean; reason: string } {
  if (currentRoot === requestedRoot) {
    return { allowed: true, reason: "current project's beads store (F18-VT-06)" };
  }
  return { allowed: false, reason: "cross-project view refused in v1 (F18-VT-06)" };
}

// --- 2.7 prototype gate + mount-visibility probe (F18-VT-08) ---

export type MountProbe = { mounted: boolean; visible: boolean } | null;

export type ProbeGate =
  | { form: "UNVERIFIED"; note: string }
  | { form: "panel-tab" }
  | { form: "fallback-disclosed" };

/**
 * PS-GATE-06 form gate. Null probe (no live wiring) stays UNVERIFIED. A
 * panel that mounts but renders invisible FAILS the gate (tgo-hv6 lesson):
 * the disclosed fallback serves, never a silent downgrade or blank.
 */
export function probeGate(probe: MountProbe): ProbeGate {
  if (probe === null) {
    return { form: "UNVERIFIED", note: "PS-GATE-06 live wiring pending; mount-visibility criteria unproven" };
  }
  if (probe.mounted && probe.visible) return { form: "panel-tab" };
  return { form: "fallback-disclosed" };
}

export interface ProbeHealth {
  verified: boolean;
  /** A null probe result shows a DISCLOSED UNVERIFIED banner — never silent health. */
  banner: string | null;
}

/** Null fail-open guard: no probe result never reads as healthy. */
export function probeHealth(probe: MountProbe): ProbeHealth {
  if (probe === null) {
    return {
      verified: false,
      banner: "UNVERIFIED: no live mount-visibility wiring (PS-GATE-06 pending); tracker health unverified — disclosed, never silent",
    };
  }
  if (probe.mounted && probe.visible) return { verified: true, banner: null };
  return { verified: false, banner: "fallback-disclosed: panel not visibly mounted; the rendered board serves with disclosure" };
}

// --- 2.8 error state + bounded backoff retry (F18-VT-09) ---

export interface ReadRetry {
  attempts: number;
  cap: number;
  exhausted: boolean;
  /** Bounded backoff retry of the FAILED READ only. */
  recordFailure(): { retry: boolean; backoff: "bounded" };
}

/** The cap value pins at build (C3); the boundary holds now. */
export function createReadRetry(cap: number): ReadRetry {
  const state: ReadRetry = {
    attempts: 0,
    cap,
    exhausted: false,
    recordFailure(): { retry: boolean; backoff: "bounded" } {
      state.attempts += 1;
      if (state.attempts >= state.cap) {
        state.exhausted = true;
        return { retry: false, backoff: "bounded" };
      }
      return { retry: true, backoff: "bounded" };
    },
  };
  return state;
}

export interface ReadError {
  error: true;
  message: string;
  retriesLeft: number;
  /** Never blank (memory #18 / tgo-hv6). */
  neverBlank: true;
}

/** Explicit error state, never blank. */
export function renderReadError(message: string, retriesLeft: number): ReadError {
  return { error: true, message, retriesLeft, neverBlank: true };
}

/** The MANUAL refresh always works, INDEPENDENT of the retry cap. */
export const MANUAL_REFRESH_BYPASSES_RETRY_CAP = true;
