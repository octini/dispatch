// Retrieval stack (F10-WR-01/04/05/06/07/08; SCHED-07/09 pins).
// v1 keyless trio per the 2026-09-28 user word (SCHED-09): donsetch
// scraped-SERP search -> markdown.new -> Context7. Exa + Parallel are the
// KEYED diversity slot (BYOK upgrades only). Tavily + Firecrawl are RESERVES,
// active only on documented chain exhaustion (F10 reserve-activation rule).
// Caps are SCHED-07 probe pins; every unverified field is labeled and 429-class
// outcomes record verbatim (F10-WR-08). No invented values.

/** v1 default chain order (SCHED-09 user word 2026-09-28). */
export const KEYLESS_TRIO = ["donsetch-search", "markdown.new", "context7"] as const;
export type KeylessTier = (typeof KEYLESS_TRIO)[number];

/** Keyed diversity slot (SCHED-09): BYOK upgrades, never auto-required. */
export const KEYED_SLOTS = ["exa", "parallel"] as const;
export type KeyedSlot = (typeof KEYED_SLOTS)[number];

/** Reserve pair (F10-WR-01/08): documented-exhaustion activation only. */
export const RESERVES = ["tavily", "firecrawl"] as const;
export type ReserveTier = (typeof RESERVES)[number];

export type ChainTier = KeylessTier | KeyedSlot | ReserveTier;

export interface CapRecord {
  tier: string;
  /** Probe outcome, recorded verbatim from PIN-RECORD SCHED-07. */
  probe: string;
  status: "VERIFIED" | "UNVERIFIED";
  note: string;
}

/** SCHED-07 probe-pinned caps. Pre-probe F10 on-record figures stay
 * probe-pinned, never truth; where they differ, SCHED-07 governs. */
export const CAPS: CapRecord[] = [
  { tier: "markdown.new", probe: "200 (works keyless)", status: "VERIFIED", note: "SCHED-07" },
  {
    tier: "jina",
    probe: '401 AuthenticationRequiredError ("blocked from performing anonymous queries due to bad network reputation (AS9009)")',
    status: "VERIFIED",
    note: "SCHED-07: keyless dead from this network",
  },
  { tier: "context7", probe: "200 (anonymous search works)", status: "VERIFIED", note: "SCHED-07" },
  {
    tier: "tinyfish",
    probe: "api.tinyfish.io unreachable directly (http=000); indirect via pi-webaio 1.0.7",
    status: "VERIFIED",
    note: "SCHED-07: indirect only; direct endpoint open",
  },
  {
    tier: "exa",
    probe: "x402 PAYMENT_REQUIRED ($0.007 USDC per search on Base/Solana; NO keyless tier)",
    status: "VERIFIED",
    note: "SCHED-07; keyed diversity slot per SCHED-09",
  },
  {
    tier: "parallel",
    probe: "401 (failed to resolve API key)",
    status: "VERIFIED",
    note: "SCHED-07; keyed diversity slot per SCHED-09",
  },
  {
    tier: "tavily",
    probe: "401 (missing or invalid API key)",
    status: "VERIFIED",
    note: "SCHED-07 reserve; inactive until documented exhaustion",
  },
  {
    tier: "firecrawl",
    probe: '403 ("your IP address looks suspicious... Sign up for a free API key... 1000 credits")',
    status: "VERIFIED",
    note: "SCHED-07 reserve; inactive until documented exhaustion",
  },
];

/** Verbatim 429-class record (F10-WR-08): stored unmodified, never smoothed. */
export interface VerbatimRecord {
  tier: string;
  status: string;
  verbatim: string;
  at: string;
}

export function recordVerbatim(tier: string, status: string, verbatim: string, now?: () => string): VerbatimRecord {
  return { tier, status, verbatim, at: now?.() ?? new Date().toISOString() };
}

/** Keyed-slot grant (F2-Q5 semantics: session default; logged persistence;
 * expiry/revocation enforcement). Presence of a key never implies a grant. */
export interface KeyedSlotGrant {
  granted: boolean;
  revoked?: boolean;
  expiresAt?: string;
  persistedLogged?: boolean;
}

/** Named chain order (F1 grant-gate fix): the keyless trio -> the GRANT-CHECK
 * -> the key-presence check -> the keyed slot (only when both pass) -> the
 * reserves (on documented exhaustion). */
export const KEYED_GRANT_CHECK_ORDER =
  "keyless trio -> GRANT-CHECK -> key-presence check -> keyed slot (only when both pass) -> reserves (on documented exhaustion)" as const;

/** F2-Q5 grant semantics record line: the session default; logged persistence. */
export const KEYED_GRANT_SEMANTICS =
  "F2-Q5: session default; logged persistence; expiry/revocation enforcement" as const;

/** Named GRANT-CHECK step (F1): runs BEFORE the key-presence check. Ungranted,
 * revoked, or stale (expired) grants never open the keyed chain. */
export function isKeyedGrantLive(grant: KeyedSlotGrant | undefined, nowIso?: string): boolean {
  if (grant === undefined) return false;
  if (grant.granted !== true) return false;
  if (grant.revoked === true) return false;
  if (grant.expiresAt !== undefined) {
    const now = nowIso ?? new Date().toISOString();
    const expiry = Date.parse(grant.expiresAt);
    const at = Date.parse(now);
    if (Number.isNaN(expiry) || Number.isNaN(at)) return false;
    if (at >= expiry) return false;
  }
  return true;
}

/** F10-Q7 revocation record line: revocation clears the keyed grant. */
export const KEYED_GRANT_REVOCATION_RECORD =
  "F10-Q7: revocation clears the keyed grant; the next keyed activation re-checks the grant" as const;

/** Named revocation home (F10-Q7): clears a keyed grant on revocation. */
export function revokeKeyedGrant(
  grants: Partial<Record<KeyedSlot, KeyedSlotGrant>> | undefined,
  slot: KeyedSlot,
): Partial<Record<KeyedSlot, KeyedSlotGrant>> {
  return { ...(grants ?? {}), [slot]: { granted: false, revoked: true } };
}

/** Key-presence check (F1 second gate): runs AFTER the GRANT-CHECK. A present
 * key opens the slot only when the grant is also live. */
export function isKeyedSlotActive(hasKey: boolean): boolean {
  return hasKey === true;
}

/** v1 DISCLOSURE record line: keyed upgrades are BYOK (active only with
 * keys; never auto-required). Chain order: keyless trio -> keyed slot
 * (when its key is active) -> reserves (on documented exhaustion only). */
export const KEYED_UPGRADE_DISCLOSURE =
  "keyed upgrades are BYOK: active only with keys, never auto-required (F2-Q5 session default; logged persistence)" as const;

/** Reserves activate ONLY on documented chain exhaustion, with disclosure
 * (F10-WR-08 reserve-activation rule); never silently. */
export function reservesActive(documentedExhaustion: boolean): boolean {
  return documentedExhaustion === true;
}

const RATE_CLASS_PATTERN = /429|403|captcha|rate.?limit|payment_required|authenticationrequired/i;

/** Rate-class audit on a stored trail record (F10-WR-08): the same class the
 * live chain classifies, re-checked against the verbatim trail. */
export function isRateClassRecord(status: string, verbatim: string): boolean {
  return RATE_CLASS_PATTERN.test(`${status} ${verbatim}`);
}

/** Section-7 build pin PINNED (user-worded 2026-09-28): the retrieval-claims fresh bound (F10/F15) = 24h; the boundary (scope + freshness required) holds now. */
export const TRAIL_FRESHNESS_WINDOW_MS = 86_400_000 as const;
export const TRAIL_FRESHNESS_WINDOW_PIN = "PINNED 24h (86400000ms; user-worded 2026-09-28)" as const;

/** RELEASE-GATING record (N2): the trail-freshness window VALUE is the
 * section-7 pin PINNED 24h (user-worded 2026-09-28); the v1 release gate (PRIMARY-SPEC section 8)
 * requires the pin record complete — it cannot backlog past release. */
export const TRAIL_FRESHNESS_RELEASE_GATING =
  "RELEASE-GATING: the trail-freshness window VALUE is the section-7 pin (PINNED 24h user-worded 2026-09-28); the v1 release gate requires the pin record complete" as const;

/** Host-clock anchor (N1): the trail's freshness stamps come from the host
 * clock API, never a seat- or subprocess-supplied timestamp; the scope
 * binding (seat:taskId) holds with it. */
export const TRAIL_HOST_CLOCK_ANCHOR =
  "trail freshness anchors to the host clock: retrieval-time stamps come from the host clock API, never seat or subprocess self-report; scope binding seat:taskId holds" as const;

/** Forgery boundary (N1): with the host-clock anchor + scope binding, the
 * residual forgery exposure reduces to a compromised host (out of scope). */
export const TRAIL_FORGERY_BOUNDARY =
  "forgery exposure reduces to a compromised host (out of scope)" as const;

/** Scoped trail record (F2): per-call/per-task scoping + a freshness record
 * (the call's retrieval-time stamp + the seat:taskId binding). */
export interface ScopedTrailRecord {
  tier: string;
  status: string;
  verbatim: string;
  seat?: string;
  taskId?: string;
  at?: string;
}

/** Current-call scope the trail must match (F2): seat + task + a fresh window.
 * N1: `now` is host-clock time — build the scope via hostClockScope, never
 * from a seat- or subprocess-supplied timestamp. */
export interface TrailScope {
  seat: string;
  taskId: string;
  now: string;
  windowMs: number;
}

/** Host-clock scope builder (N1): binds seat:taskId with host-clock now + a
 * caller-supplied (test-configured or pinned) window. Seats never supply
 * `now` or record `at` themselves. */
export function hostClockScope(seat: string, taskId: string, hostNow: () => string, windowMs: number): TrailScope {
  return { seat, taskId, now: hostNow(), windowMs };
}

/** Reserve-activation check (F10-WR-08 + F2 scoping): every listed tier holds a
 * rate-class failure in the trail. The failure trail IS the documentation;
 * a caller claim never substitutes. When the attempted chain holds no
 * keyless tier (custom test chains), the caller passes the attempted tiers.
 * When a scope is supplied, each covering record must also match the CURRENT
 * call (seat + taskId) within the fresh window; a stale or foreign-scope
 * trail is refused. Unscoped calls keep the legacy tier-only check. */
export function trailDocumentsExhaustion(
  trail: Array<{ tier: string; status: string; verbatim: string; seat?: string; taskId?: string; at?: string }>,
  tiers: readonly string[],
  scope?: TrailScope,
): boolean {
  if (tiers.length === 0) return false;
  if (scope === undefined) {
    return tiers.every((tier) =>
      trail.some((record) => record.tier === tier && isRateClassRecord(record.status, record.verbatim)),
    );
  }
  const nowMs = Date.parse(scope.now);
  if (Number.isNaN(nowMs)) return false;
  return tiers.every((tier) =>
    trail.some((record) => {
      if (record.tier !== tier) return false;
      if (!isRateClassRecord(record.status, record.verbatim)) return false;
      if (record.seat !== scope.seat || record.taskId !== scope.taskId) return false;
      if (record.at === undefined) return false;
      const atMs = Date.parse(record.at);
      if (Number.isNaN(atMs)) return false;
      const age = nowMs - atMs;
      return age >= 0 && age <= scope.windowMs;
    }),
  );
}

export type GapAction = "proceed-reversible" | "stop-branch";

/** Q8/Q18 exhaustion disclosure. Criticality is decided AT PLAN TIME by the
 * approved spec's acceptance criteria; a seat never self-labels (F10-Q8).
 * An uncovered demand (null) fails closed as acceptance-critical. */
export function discloseGap(acceptanceCritical: boolean | null): { action: GapAction; disclosure: string } {
  if (acceptanceCritical === false) {
    return {
      action: "proceed-reversible",
      disclosure: "retrieval chain exhausted on a non-acceptance-critical gap: reversible work proceeds with this gap disclosed",
    };
  }
  return {
    action: "stop-branch",
    disclosure:
      acceptanceCritical === null
        ? "retrieval chain exhausted on a demand no acceptance criterion covers: fail-closed as acceptance-critical; affected branch stops with this gap disclosed"
        : "retrieval chain exhausted on an acceptance-critical gap: affected branch stops with this gap disclosed",
  };
}

/** Source-carry (F11-DM-10 composition): recalled memory surfaces its stored
 * source links alongside the content at use time.
 * Label note: DM-10 is the source-carry cite; DM-02 is the recall-backend
 * probe (review-prompt label corrected here, no behavior change).
 * Next wiring: the true recall/envelope wiring belongs to Slice 4 (the
 * F11/F12 memory work); see SOURCE_CARRY_NEXT_WIRING. */
export function carrySources(content: string, sources: string[]): { content: string; sources: string[] } {
  return { content, sources: [...sources] };
}

/** Named next wiring (F11-DM-10): the recall/envelope path that feeds stored
 * sources into carrySources lands in Slice 4 (the F11/F12 memory work);
 * until then carrySources is wired into the claims path only. */
export const SOURCE_CARRY_NEXT_WIRING =
  "recall/envelope -> carrySources wiring belongs to Slice 4 (F11/F12 memory work); claims-path wiring only until then" as const;
