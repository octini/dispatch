# Feature F10 — Web, docs, and MCP retrieval (Dispatch)

Status: user-approved 2026-09-22 (F10-Q1 through F10-Q10 Agreed 2026-09-22, Q1 confirmed
after the thin-adapter mailroom explanation; band CONCERNS → 12 corrections → re-check READY); runtime
unverified; scenarios FUTURE. Requirements F10-WR-01 … F10-WR-13 settled as
directed 2026-09-22, plus F10-WR-14 (RD-Q2 surface-priming composition, Agreed
2026-09-23). No implementation, installs, code, commits, or pushes.
Tenth Stage B feature spec; 2 areas stay undone after this draft (F17 vision, F18 tracker — F16 council exists as a spec area; see `README.md`).
All scenarios
FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to
settled F10-Q1–F10-Q10 where they conflict for this scope. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9 requirements stand untouched.

## 0. Objective

Define the v1 hybrid retrieval stack and its policy shell: donsetch as the
primary fetch/crawl/PDF engine behind OUR thin policy adapter (the mailroom),
Context7 for versioned docs on its anonymous free tier by default, ONE
anonymous hosted search slot (Exa primary, Parallel named fallback), and a
keyless fetch fallback chain in the v1 default order markdown.new → Jina
(r.jina.ai) → TinyFish — under rules that REQUIRE per-seat access surfaces
(Seeker full, Writer Context7-direct plus approved adapter lookups,
Dispatcher/Expert list-only, no seat via bash), zero-paid default with BYOK
slots and never any auto paid escalation, read-only retrieval, citation stamps
(source URL + retrieval time, with a content hash/length binding) on every result, verbatim 429/403/captcha records
with back-off and down-chain fallback, Q8/Q18-governed exhaustion disclosure,
and a user-signed AGPL boundary review gating shipping and any shared build
(enforcement unverified until probes decide): the adapter owns seat access,
timeouts, cancellation, output limits, zero-paid enforcement,
version/capability checks, evidence stamping, and fallback routing while
donsetch owns engines, fetch/crawl/bot-wall handling, and PDF/document
extraction; the donsetch native Pi extension stays a NAMED FALLBACK admitted
only if probes prove both the AGPL boundary and F2-PE-13 enforceability; exact
artifacts pin at build per the F6 posture and on-record caps are probe-pinned,
never hard-coded as truth. Mechanism choice (adapter invocation shape, the
retrieval operation/target taxonomy, fallback switch mechanics, BYOK surface,
snippet shape, Context7 call shape, the MCP adapter pick, the artifact pin, the
AGPL review document shape) is downstream, not this spec.

Stable requirement IDs `F10-WR-01` … `F10-WR-14`. Sources trace to settled
F10-Q1–F10-Q10 (all Agreed 2026-09-22) plus Q8, Q18, Q46, Q49–Q51 and the
absorbed settled per-seat direction (provenance: web/MCP research + grilling
record — the package files previously lacked it, noted wherever it appears);
mappings are multi-source where a rule draws on more than one source — no
one-to-one fiction. Section 5 holds the trace table; section 6 organizes the
digest by requirement with source labels. The AGPL provenance-vs-amendment note
is recorded in `../DECISIONS.md`.

## 1. Files / artifact boundaries

Owned by this feature (retrieval stack, adapter policy, acceptance only):

1. Hybrid stack composition: donsetch primary + Context7 versioned docs + one
   anonymous hosted search slot + keyless fetch fallback chain, with reserves
   named and disqualified defaults excluded.
2. Thin-adapter integration form: per-call flow (permission check → subprocess
   invocation → evidence stamp → fallback routing on failure) and the
   adapter-owns / donsetch-owns split, with the native Pi extension as a named
   fallback under probe conditions.
3. Per-seat access surfaces: Seeker full retrieval; Writer Context7-direct plus
   approved adapter lookups; Dispatcher/Expert list-only (titles + URLs +
   snippets, no raw fetch); no seat retrieves via bash.
4. Zero-paid default with BYOK slots, no auto paid escalation ever, and the
   disabled-v1 captcha unlocker rule.
5. Context7 default posture: anonymous free tier default, BYOK slot raising
   quota, no auto-escalation.
6. Search slot rule: Exa anonymous primary + Parallel anonymous named fallback,
   falling on 429 or empty results, never eager-chaining.
7. Fetch fallback order: markdown.new → Jina → TinyFish as the v1 default,
   probe-may-reorder with disclosed build pin, never a silent swap.
8. Failure handling: verbatim 429/403/captcha records, back-off, down-chain
   fall, suspected-degraded garbage handling with reserve activation on
documented exhaustion only, plan-time criticality with fail-closed tiebreak,
   separately-budgeted probe calls, and Q8/Q18-governed exhaustion disclosure.
9. Citation discipline: source URL + retrieval time + content hash/length
   binding in the evidence record for every retrieval result; divergent
   tier content records both, never a silent winner.
10. Read-only retrieval: no posts, form submissions, state-changing calls, or
    external side effects.
11. AGPL sign-off gate: written boundary review gating shipping and any shared
    build (dogfood bundles included; shared = any artifact that could leave the
    build machine or the user's control — if it could leave, it is shared);
    pure-local fixtures and local-only CI artifacts count as internal
    build-time testing, which proceeds with the pinned artifact.
12. Adapter enforcement mapping: F2-PE-13 composition (capability + operation +
    arguments + resolved targets; unknown mappings park fail-closed); the
    retrieval taxonomy and verification steps are this spec's engineering item.
13. Invariance and spec-only status: F1–F9 unchanged; every block a SPEC
    requirement with enforcement unverified until probes decide.
14. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat responsibilities, ceilings, delegation envelopes — F1 owns; here only
   the per-seat surface composition holds.
2. Permission configurability, fixed integrity, trust-vs-permission boundary —
   permissions spec owns; here only the F2-PE-13 composition holds.
3. Approval gates, deviation classes, park lifecycle — F3 owns; here only the
   Q8/Q18 exhaustion composition holds.
4. Installer selection, checksum rules, self-update mechanics — F4/MANIFEST/F6
   own; here only the build-time artifact-pin composition holds.
5. License verdicts and the AGPL review procedure — F6 owns (F6-Q5/amendment
   procedure governs); here only the sign-off gate composition holds.
6. Exact adapter invocation shapes, taxonomy strings, BYOK config keys, snippet
   lengths, call shapes — downstream engineering owns, never chosen here.

Not in this feature:

1. Any implementation, install, configuration, commit, or push —
   documentation only; nothing runs.
2. Exact artifact pins (version + source URL + SHA), cap numbers beyond the
   probe-pinned on-record figures, config keys, or call shapes — all
   downstream (section 7).
3. Any claim that donsetch, Context7, Exa, Parallel, or any fallback tier
   currently enforces sections 2–3. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at a
   time per user request; integration follows.

## 2. Interfaces

### 2.1 Hybrid stack (Q51 + F10-Q2/Q3)

- F10-WR-01 — HYBRID STACK: donsetch is the PRIMARY fetch/crawl/PDF engine;
  Context7 serves versioned docs; ONE anonymous hosted search slot serves
  hosted search (Exa anonymous PRIMARY, Parallel anonymous NAMED FALLBACK —
  fall on 429 or empty results, never eager-chaining that burns both caps);
  the keyless fetch fallback chain runs in the v1 default order markdown.new
  (500/day on record) → Jina r.jina.ai (20 RPM on record) → TinyFish ($0/URL
  on record). Exact artifacts pin at build per the F6 posture
  (version + source URL + SHA). On-record caps are PROBE-PINNED — never
  hard-coded as truth. Tavily/Firecrawl keyless (1k credits/mo each on record)
  stand as RESERVES, activating only on DOCUMENTED chain exhaustion with disclosure (F10-WR-08) — never silently. BYOK storage stays a section-7 item. Brave/Serper remain DISQUALIFIED defaults
  (`EVIDENCE.md:22`). (Q51; F10-Q2/Q3 Agreed 2026-09-22; F6 posture;
  `EVIDENCE.md:22`.)

### 2.2 Thin adapter (F10-Q1, the "mailroom")

- F10-WR-02 — THIN ADAPTER: OUR thin policy adapter over the donsetch CLI/MCP
  subprocess is the PRIMARY integration form. Flow per call: permission check
  (seat + capability + operation + arguments + resolved target) → subprocess
  invocation → evidence stamp → fallback routing on failure. The adapter OWNS:
  seat access, timeouts, cancellation, output limits, zero-paid enforcement,
  version/capability checks, evidence stamping, fallback chain routing.
  donsetch OWNS: search engines, fetch/crawl/bot-wall handling, PDF/document
  extraction. NEVER linked as a library (separate-process AGPL boundary per
  F6-Q5). The donsetch NATIVE Pi extension stays a NAMED FALLBACK, admitted
  only if probes prove both the AGPL boundary and F2-PE-13 enforceability (the
  registerTool auto-activate race is on record). This shape was explained to
  the user as a mailroom/switchboard and confirmed. (F10-Q1 Agreed 2026-09-22,
  confirmed after the mailroom explanation; F6-Q5; F2-PE-13.)

### 2.3 Per-seat access surfaces (absorbed settled direction)

- F10-WR-03 — PER-SEAT ACCESS SURFACES: Seeker = FULL retrieval (search +
  fetch + docs); Writer = Context7 direct + approved adapter lookups;
  Dispatcher/Expert = LIST-ONLY surface — titles + URLs + snippets (F10-Q5), no
  raw fetch; list-only snippets are BOUNDED and the bound is DISCLOSED in the
  evidence record (the exact length is a section-7 build pin — F10-Q10). An
  "approved adapter lookup" is approved by exactly TWO bounded sources (F10-Q7):
  (a) NAMED in the approved plan or delegation envelope (F3/F1 composition), or
  (b) on the user's STANDING allowlist (user-only to edit per the F2-Q6 rule).
  Task-scoped approvals live in the task record and EXPIRE with the task (Q40
  session-scoped default). The Dispatcher may approve within an approved task's
  scope, never persistently. Revocation: user-only for standing entries; the
  Dispatcher may drop its own task-scoped entries. Registry locations: plugin
  config (standing, user-owned) + task record (session); the registry shape is
  a section-7 item. No seat gets web access via bash. ABSORBED SETTLED
  DIRECTION — provenance: web/MCP research + grilling record; the package files
  previously lacked it (noted here and in sections 5–6 and `../DECISIONS.md`).
  (Absorbed settled direction; F10-Q5 Agreed 2026-09-22; F10-Q7/F10-Q10 Agreed
  2026-09-22.)

### 2.4 Zero-paid + BYOK (Q51/Q8/Q46)

- F10-WR-04 — ZERO-PAID + BYOK: no paid keys used by default; BYOK slots
  documented (the user plugs in keys to raise quota); NO auto paid escalation
  EVER; always-trust does not authorize paid fallback (`DECISIONS.md:107`).
  The anonymous service caps are ONE SHARED POOL across all seats
  (service-global by physics) with PER-SEAT USAGE ACCOUNTING in the record;
  low-pool disclosure fires at a configurable threshold (no value set here);
  per-seat reservations/fairness knobs are a named v2 candidate (F10-Q9).
  Captchas are blocked WITHOUT the paid unlocker; the unlocker is DISABLED in
  v1 and never auto-enabled. Failures disclose rather than assume coverage
  (Q8). (Q51; Q8; Q46; F10-Q6 scope Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22.)

### 2.5 Context7 default (F10-Q4)

- F10-WR-05 — CONTEXT7 DEFAULT: the anonymous free tier (1k calls/mo on
  record) is the default; a user API-key BYOK slot raises the quota; no
  auto-escalation to paid. The anonymous tier participates in the F10-Q9
  shared-pool composition (one shared pool with per-seat usage accounting).
  On-record figure is probe-pinned, never truth.
  (F10-Q4 Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22.)

### 2.6 Search slot (F10-Q2)

- F10-WR-06 — SEARCH SLOT: Exa anonymous primary + Parallel anonymous named
  fallback (429/empty triggers the fallback; never eager-chaining that burns
  both caps); both probe-pinned for real limits (Exa code-vs-advertised drift
  is on record at `EVIDENCE.md:158-164` — probe, never assume). (F10-Q2 Agreed
  2026-09-22.)

### 2.7 Fetch fallback order (F10-Q3)

- F10-WR-07 — FETCH FALLBACK ORDER: markdown.new → Jina → TinyFish confirmed
  as the v1 default; live probes may REORDER by measured reliability — a
  disclosed change at the build pin, never a silent swap. (F10-Q3 Agreed
  2026-09-22.)

### 2.8 Failure handling (Q8/Q18)

- F10-WR-08 — FAILURE HANDLING: 429/403/captcha outcomes record VERBATIM,
  back off, and fall down the chain; empty/paywall-stub/truncated results are
  recorded as SUSPECTED-DEGRADED and the chain continues to the next tier
  (garbage is a failure trigger — never stamped clean); Tavily/Firecrawl
  RESERVES activate only on DOCUMENTED chain exhaustion, with disclosure —
  never silently. When all tiers exhaust, the Q8/Q18 composition governs —
  proceed with reversible work when the gap is not acceptance-critical, else
  stop the affected branch; disclose in both cases. Acceptance-criticality is
  decided AT PLAN TIME by the approved spec's acceptance criteria (the F3
  package binds them) — a seat NEVER self-labels (F10-Q8); if exhaustion hits
  a demand no criterion covers, the tiebreak is FAIL-CLOSED: treat as
  acceptance-critical, stop the affected branch, and disclose. Seat discretion
  is bounded to reversible non-acceptance work the plan already scoped.
  Build-time probe calls consume the same anonymous caps and are therefore
  BUDGETED and DISCLOSED SEPARATELY from runtime usage (probe-call accounting
  is a section-7 item). Retrieval gaps are disclosed, never assumed covered.
  (Q8; Q18; F10-Q2/Q3 composition; F10-Q8 Agreed 2026-09-22.)

### 2.9 Citation discipline

- F10-WR-09 — CITATION DISCIPLINE: every retrieval result carries source URL +
  retrieval time in the evidence record; citation stamps gain a content
  hash/length binding so conflicting content is detectable after the fact
  (stamp shape is a section-7 item). Divergent content across tiers: record
  BOTH and flag it — NEVER a silent winner. (Settled intake; Q8 disclosure
  composition.)

### 2.10 Read-only retrieval

- F10-WR-10 — READ-ONLY RETRIEVAL: web tools are READ-ONLY — no posts, no form
  submissions, no state-changing calls, no external side effects (composes with
  F2's external-action approval rules). (Q6; F2 composition.)

### 2.11 AGPL sign-off gate (F10-Q6 + F6-Q5)

- F10-WR-11 — AGPL SIGN-OFF GATE: the written AGPL boundary review gates
  SHIPPING and any SHARED build (dogfood bundles included) — "shared build"
  means ANY artifact that leaves the build machine or the user's control (CI
  uploads, shared fixtures, published samples — all gated by the sign-off);
  pure-local fixtures and local-only CI artifacts count as internal
  build-time testing. Gray-zone default: if it could leave, it is shared
  (fail-closed). Internal build-time testing proceeds with the pinned artifact
  (version + source URL + SHA); the review is user-signed; no blanket AGPL clearance exists on record
  (the `DECISIONS.md:110` "AGPL-3.0 acceptable" line is provenance — the
  amendment/F6-Q5 procedure governs). (F10-Q6 Agreed 2026-09-22; F6-Q5.)

### 2.12 Adapter enforcement mapping (F2-PE-13 composition)

- F10-WR-12 — ADAPTER ENFORCEMENT MAPPING: permission follows verified
  capability + operation + arguments + resolved targets, never a trusted name
  or prefix; unknown mappings park the affected capability pending adapter
  verification (fail-closed); the retrieval-specific operation/target taxonomy
  and verification steps are THIS spec's engineering item (section 7).
  (F2-PE-13; F10-Q1 composition.)

### 2.13 Invariance and spec-only status

- F10-WR-13 — F1–F9 requirements stand unchanged by anything in this feature;
  no seat, budget, ceiling, gate, evidence, license, platform, model, prose,
  skill, or bootstrap rule moves here. All blocking in sections 2.1–2.12, 2.14,
  and 2.15 is a SPEC requirement, not proven runtime implementation — enforcement
  is unverified until probes decide (section 7). (F1–F9 invariance; spec-only
  status.)

### 2.14 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Per-seat surface enforcement: list-only blocks raw fetch; no bash web (F10-WR-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks over-privileged retrieval and shell-mediated web access |
| Zero-paid / no-auto-escalation gate; always-trust never authorizes paid (F10-WR-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks paid spend and silent paid fallback |
| Separate-process AGPL boundary, never linked as a library (F10-WR-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks library-linking license exposure |
| Read-only retrieval enforcement (F10-WR-10) | Preventive (SPEC requirement, NOT proven implementation) | blocks posts, submissions, and state-changing calls |
| Adapter capability+op+arg+target gate; name never sufficient (F10-WR-12) | Preventive (SPEC requirement, NOT proven implementation) | blocks name-spoofed tool activation |
| Unknown-mapping fail-closed park (F10-WR-12) | Preventive (SPEC requirement, NOT proven implementation) | blocks unverified capabilities pending verification |
| Unlocker disabled in v1, never auto-enabled; captchas blocked without it (F10-WR-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks paid captcha-unlocking side paths |
| 429/403/captcha verbatim records; cap-probe records (F10-WR-08) | Detective | surfaces rate-limit, denial, and captcha outcomes after the fact |
| Citation stamps, URL + time (F10-WR-09) | Detective | surfaces provenance for every result after the fact |
| Gap disclosures; fallback-trail records (F10-WR-08) | Detective | surfaces coverage gaps and chain behavior after the fact |
| Retrieval-quality or coverage assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.15 Surface priming (RD-Q2 composition, Agreed 2026-09-23)

- F10-WR-14 — SURFACE PRIMING: retrieval tools are listed FIRST in each seat's toolset order; the adapter's surface carries a retrieval-required marker on the fresh-fact categories (versions, prices, APIs, library behavior, standards, release dates). The marker's exact format is a section-7 item. The normative claim rule lives in `retrieval-discipline.md` (F15-RD-08); this section holds the surface composition only. Provenance: the wave-1 tool-ordering gap (what is visible gets used; agents skip options) from tgo-im6j. (RD-Q2 Agreed 2026-09-23.)

## 3. Constraints

C1. F10-Q1–F10-Q6 govern where they conflict with earlier readings inside this
scope; F1/F2/F3/F4/F5/F6/F7/F8/F9 stand where this spec does not narrow them.
C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7,
F7Q1–F7Q5, F8Q1–F8Q9 (F8-Q4 deferred), F9Q1–F9Q9 stand; this spec
cross-references, never re-decides. C3. Never link donsetch as a library —
separate-process-only (CLI or MCP subprocess) per F6-Q5. C4. No invented caps,
tool names, URLs, config keys, or values beyond those on record — on-record
numbers read as probe-pinned, never as truth; probes decide. C5. The MCP
adapter pick (@pi-unipi/mcp direct vs pi-mcp-adapter single-proxy) stays a
spec-phase pin (`MANIFEST.md:48-50`) — no selection here. C6. Free
websearch/fetch is first-class (settled intake) — the stack never assumes a
paid key exists. C7. Capture 429s verbatim at probes — code-vs-advertised
drift is on record, never smoothed over; build-time probe calls consume the
same anonymous caps and are budgeted and disclosed separately from runtime
usage (F10-WR-08). C8. No auto paid escalation EVER —
always-trust never authorizes paid fallback. C9. Captchas blocked without the
paid unlocker; the unlocker is DISABLED in v1 and never auto-enabled. C10.
Spec-only status: every block is a SPEC requirement with enforcement
unverified until probes decide. C11. Controls are classed preventive,
detective, or advisory by actual function (section 2.14); SPEC-required
blocking is not proven implementation. C12. All scenarios FUTURE — not
executed; no tests run.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial retrieval consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P10-01 (F10-WR-01). Input: retrieval demand with the full hybrid stack
  available / Observe: stack resolution runs / Pass: donsetch serves
  fetch/crawl/PDF, Context7 serves versioned docs, the search slot serves
  hosted search, and the fetch chain stands in its pinned order. FUTURE.
- P10-02 (F10-WR-02). Input: a Seeker fetch call through the adapter / Observe:
  per-call flow runs / Pass: permission check (seat + capability + operation +
  arguments + resolved target) precedes subprocess invocation, the evidence
  stamp records, and failure routes to fallback. FUTURE.
- P10-03 (F10-WR-02). Input: a build proposing donsetch linked as a library /
  Observe: boundary check runs / Pass: refused — separate-process-only per
  F6-Q5. FUTURE.
- P10-04 (F10-WR-03). Input: Seeker search + fetch + docs demand / Observe:
  seat-surface check runs / Pass: full retrieval allowed. FUTURE.
- P10-05 (F10-WR-03). Input: Writer versioned-docs demand plus an approved
  adapter lookup / Observe: seat-surface check runs / Pass: Context7 direct and
  the approved lookup allowed; unapproved raw fetch blocked. FUTURE.
- P10-06 (F10-WR-03). Input: Dispatcher raw-fetch demand / Observe:
  seat-surface check runs / Pass: blocked — titles + URLs + snippets only, no
  raw fetch. FUTURE.
- P10-07 (F10-WR-03). Input: any seat attempting web access via bash / Observe:
  seat-surface check runs / Pass: blocked — no seat gets web access via bash.
  FUTURE.
- P10-08 (F10-WR-04). Input: retrieval demand with no BYOK keys configured /
  Observe: zero-paid gate runs / Pass: no paid endpoint touched; quota failure
  discloses rather than assuming coverage. FUTURE.
- P10-09 (F10-WR-04). Input: captcha wall with the unlocker disabled / Observe:
  unlocker check runs / Pass: blocked and recorded; the unlocker never
  auto-enables. FUTURE.
- P10-10 (F10-WR-05). Input: versioned-docs demand, anonymous tier within its
  probed quota / Observe: Context7 path runs / Pass: anonymous default serves;
  no escalation to paid with or without a BYOK key absent. FUTURE.
- P10-11 (F10-WR-06). Input: Exa demand returning 429 / Observe: search-slot
  routing runs / Pass: verbatim 429 recorded, Parallel fallback serves, and
  both caps burn only on the fall — never eager-chaining. FUTURE.
- P10-12 (F10-WR-06). Input: Exa demand returning empty results / Observe:
  search-slot routing runs / Pass: Parallel named fallback serves. FUTURE.
- P10-13 (F10-WR-07). Input: fetch demand with markdown.new failing / Observe:
  fetch-chain routing runs / Pass: falls markdown.new → Jina → TinyFish in the
  pinned order; any reorder arrives only as a disclosed build-pin change.
  FUTURE.
- P10-14 (F10-WR-08). Input: 429/403 mid-chain / Observe: failure handling runs
  / Pass: outcome recorded VERBATIM, back-off observed, fall continues down
  the chain. FUTURE.
- P10-15 (F10-WR-08). Input: all tiers exhausted on a non-acceptance-critical
  gap / Observe: exhaustion composition runs / Pass: reversible work proceeds
  with the gap disclosed. FUTURE.
- P10-16 (F10-WR-08). Input: all tiers exhausted on an acceptance-critical gap
  / Observe: exhaustion composition runs / Pass: the affected branch stops with
  the gap disclosed; nothing assumed covered. FUTURE.
- P10-17 (F10-WR-09). Input: any successful retrieval / Observe: citation check
  runs / Pass: source URL + retrieval time present in the evidence record.
  FUTURE.
- P10-18 (F10-WR-10). Input: a retrieval-shaped POST/form-submission demand /
  Observe: read-only check runs / Pass: blocked — no state-changing calls.
  FUTURE.
- P10-19 (F10-WR-11). Input: ship or shared-build demand without a user-signed
  AGPL review / Observe: sign-off gate runs / Pass: gated — blocked until the
  written review is user-signed; internal build-time testing with the pinned
  artifact still proceeds. FUTURE.
- P10-20 (F10-WR-12). Input: name-spoofed tool presenting a trusted name with
  mismatched capability/arguments/targets / Observe: adapter gate runs / Pass:
  blocked; unknown mappings park the affected capability fail-closed pending
  verification. FUTURE.
- P10-21 (F10-WR-13). Input: retrieval-spec change candidate touching seat,
  permission, or bootstrap behavior / Observe: invariance check runs / Pass:
  F1–F9 requirements read unchanged; the change narrows to this feature or
  parks. FUTURE.
- P10-22 (F10-WR-03, F10-Q7). Input: Writer requests a lookup named in its
  approved delegation envelope / Observe: approval check runs / Pass: allowed
  and logged to the task record. FUTURE.
- P10-23 (F10-Q7). Input: Writer requests a lookup neither named in the
  envelope nor on the standing allowlist / Observe: approval check runs /
  Pass: blocked; the lookup may be added only by the user (standing) or a
  Dispatcher task-scope approval (logged, expiring). FUTURE.
- P10-24 (F10-Q7). Input: a task-scoped approval after its task closed /
  Observe: expiry check runs / Pass: expired — blocked; standing entries
  unaffected. FUTURE.
- P10-25 (F10-WR-08, F10-Q8). Input: exhaustion on a demand no acceptance
  criterion covers / Observe: criticality tiebreak runs / Pass: fail-closed —
  treated as acceptance-critical, the affected branch stops and the gap
  discloses; the seat never self-labels. FUTURE.
- P10-26 (F10-Q9). Input: two seats consuming the shared anonymous pool
  concurrently / Observe: quota accounting runs / Pass: one shared pool
  decrements with per-seat usage recorded; low-pool disclosure fires at the
  configured threshold. FUTURE.
- P10-27 (F10-WR-03, F10-Q10). Input: list-only response whose snippet would
  exceed the bound / Observe: snippet bound check runs / Pass: truncated to
  the disclosed bound; the bound appears in the evidence record. FUTURE.
- P10-28 (F10-WR-08). Input: a tier returning a paywall stub / Observe:
  content sanity check runs / Pass: recorded suspected-degraded, the chain
  continues to the next tier; never stamped clean. FUTURE.
- P10-29 (F10-WR-09). Input: two tiers returning divergent content / Observe:
  divergence handling runs / Pass: both results recorded and flagged; no
  silent winner; the hash/length binding exposes the conflict. FUTURE.
- P10-30 (F10-WR-11). Input: CI artifact proposed for upload outside the
  build machine / Observe: shared-build classification runs / Pass: gated by
  the user-signed AGPL review — "if it could leave, it is shared"; a
  pure-local fixture passes as internal. FUTURE.
- P10-31 (F10-WR-14). Input: a seat toolset assembles with retrieval tools available / Observe: ordering and surface checks run / Pass: retrieval tools listed first in the seat toolset order; fresh-fact categories carry the retrieval-required marker. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F10 source | Stage A / F1–F9 relation |
|---|---|---|
| F10-WR-01 hybrid stack; Exa primary + Parallel named fallback; markdown.new → Jina → TinyFish default; reserves (documented-exhaustion activation only, never silent); Brave/Serper disqualified; probe-pinned caps; build pin | Q51; F10-Q2/Q3 Agreed 2026-09-22; F6 posture | F6-PD artifact pin; `EVIDENCE.md:22` disqualification |
| F10-WR-02 thin adapter primary form; per-call flow; adapter-owns/donsetch-owns split; never linked; native extension named fallback under probe conditions | F10-Q1 Agreed 2026-09-22 (confirmed after the mailroom explanation) | F6-Q5 boundary; F2-PE-13 enforceability |
| F10-WR-03 per-seat surfaces (Seeker full; Writer Context7 + approved lookups via the two-source approval rule; Dispatcher/Expert list-only with bounded disclosed snippets; no bash web) — ABSORBED, previously absent from package files | Absorbed settled direction (web/MCP research + grilling record); F10-Q5 Agreed 2026-09-22; F10-Q7/F10-Q10 Agreed 2026-09-22 | F1 seat authority; F2 per-seat policies (untouched); Q40 session-scoped default; F2-Q6 user-only edits |
| F10-WR-04 zero-paid default; BYOK slots; no auto escalation ever; always-trust never authorizes paid; ONE SHARED anonymous pool with per-seat accounting + configurable low-pool disclosure (v2 fairness candidate); unlocker disabled v1 never auto-enabled; captcha blocked; disclose-not-assume | Q51; Q8; Q46; F10-Q6 scope Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22 | `DECISIONS.md:107`; F2 external-action rules (untouched) |
| F10-WR-05 Context7 anonymous default; BYOK raises quota; no auto-escalation; shared-pool composition; probe-pinned figure | F10-Q4 Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22 | F10-WR-04 composition |
| F10-WR-06 search slot mechanics; 429/empty fall; never eager-chaining; probe-pinned limits | F10-Q2 Agreed 2026-09-22 | `EVIDENCE.md:158-164` Exa drift |
| F10-WR-07 fetch order default; probe-may-reorder with disclosed pin; never silent swap | F10-Q3 Agreed 2026-09-22 | F6-PD build pin |
| F10-WR-08 verbatim records; back-off; down-chain fall; suspected-degraded garbage continues the chain; reserves on documented exhaustion only; plan-time criticality with fail-closed tiebreak (seat never self-labels); separately-budgeted probe calls; Q8/Q18 exhaustion composition; disclose both cases | Q8; Q18; F10-Q2/Q3 composition Agreed 2026-09-22; F10-Q8 Agreed 2026-09-22 | F3 park semantics for the stop branch (untouched); F3 package binds acceptance criteria |
| F10-WR-09 citation stamps (URL + time + content hash/length binding) on every result; divergent tier content records both, never a silent winner | Settled intake; Q8 composition | Evidence record (downstream shape — section 7) |
| F10-WR-10 read-only retrieval; no posts/submissions/state changes/side effects | Q6; F2 composition | F2 external-action approval rules (untouched) |
| F10-WR-11 AGPL review gates shipping + shared builds (shared = any artifact that could leave the build machine or the user's control; pure-local = internal); internal testing proceeds pinned; user-signed; no blanket clearance (DECISIONS.md:110 is provenance) | F10-Q6 Agreed 2026-09-22; F6-Q5 | Amendment E / F6-Q5 procedure governs |
| F10-WR-12 capability+op+arg+target gate; name never sufficient; unknown-mapping fail-closed park; taxonomy + verification are section 7 | F2-PE-13; F10-Q1 composition Agreed 2026-09-22 | F2-PE-13 (untouched); section 7 engineering |
| F10-WR-13 F1–F9 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP; F8-PS; F9-BS; section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (Q51; F10-Q2/Q3 Agreed 2026-09-22; F6 posture; `EVIDENCE.md:22`; F10-WR-01)
   The stack is donsetch primary for fetch/crawl/PDF plus Context7 for
   versioned docs plus one anonymous hosted search slot (Exa primary, Parallel
   named fallback — falling on 429 or empty, never eager) plus the keyless
   fetch chain markdown.new → Jina → TinyFish ($0/URL on record) as the v1
   default — artifacts pinned at build, on-record caps probe-pinned never
   truth, Tavily/Firecrawl keyless as reserves activating only on documented
   chain exhaustion with disclosure (never silently), BYOK storage a section-7
   item, Brave/Serper disqualified.
2. (F10-Q1 Agreed 2026-09-22, confirmed after the mailroom explanation; F6-Q5;
   F2-PE-13; F10-WR-02) Our thin policy adapter over the donsetch CLI/MCP
   subprocess — explained as a mailroom/switchboard — is the primary form:
   permission check then subprocess then stamp then fallback routing; the
   adapter owns policy surfaces while donsetch owns engines and extraction;
   never linked as a library; the native Pi extension is a named fallback only
   if probes prove the AGPL boundary and F2-PE-13 enforceability.
3. (Absorbed settled direction — web/MCP research + grilling record, previously
   absent from the package files; F10-Q5 Agreed 2026-09-22; F10-Q7/F10-Q10 Agreed
   2026-09-22; F10-WR-03) Seats split as Seeker full retrieval, Writer
   Context7-direct plus approved adapter lookups, Dispatcher/Expert list-only
   with titles, URLs, and snippets and no raw fetch — and no seat reaches the
   web through bash. An approved lookup is named in the approved plan or
   delegation envelope or on the user's standing allowlist (user-only edits);
   task-scoped approvals expire with the task, the Dispatcher approves only
   within task scope, and standing revocation is user-only. List-only snippets
   are bounded with the bound disclosed in the evidence record.
4. (Q51; Q8; Q46; F10-Q6 scope Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22;
   F10-WR-04) Nothing paid runs by default — BYOK slots let the user raise
   quota, escalation to paid never happens automatically, always-trust never
   authorizes it, the anonymous caps are one shared pool across all seats with
   per-seat usage accounting and low-pool disclosure at a configured threshold
   (per-seat reservations a v2 candidate), captchas stay blocked without the
   paid unlocker while the unlocker sits disabled in v1 and never self-enables,
   and failures disclose instead of assuming.
5. (F10-Q4 Agreed 2026-09-22; F10-Q9 Agreed 2026-09-22; F10-WR-05) Context7
   defaults to the anonymous free tier with a user-key slot raising quota and
   no path to paid without the user, participating in the shared-pool
   composition (one shared pool with per-seat accounting).
6. (F10-Q2 Agreed 2026-09-22; `EVIDENCE.md:158-164`; F10-WR-06) Search runs Exa
   first with Parallel as the named fallback on 429 or empty results — the two
   caps never burn together — and both limits get probe-pinned given the
   recorded Exa drift.
7. (F10-Q3 Agreed 2026-09-22; F10-WR-07) Fetch falls markdown.new to Jina to
   TinyFish unless probes reorder it by measured reliability, and any reorder
   ships as a disclosed build-pin change.
8. (Q8; Q18; F10-Q2/Q3 composition; F10-Q8 Agreed 2026-09-22; F10-WR-08)
   Rate-limits, denials, and captchas record verbatim, back off, and fall down
   the chain; empty/paywall-stub/truncated results record suspected-degraded
   and continue down-chain, reserves fire only on documented exhaustion with
   disclosure, and probe calls budget and disclose separately — and when every
   tier is spent, reversible work continues past non-critical gaps while
   critical gaps stop their branch, both disclosed. Criticality is set at plan
   time by the acceptance criteria (never seat self-labels); uncovered demands
   fail closed as acceptance-critical with the branch stopped and disclosed.
9. (Settled intake; Q8; F10-WR-09) Every result carries its source URL,
   retrieval time, and content hash/length binding in the evidence record;
   divergent tier content records both sides flagged, never a silent winner.
10. (Q6; F2; F10-WR-10) Retrieval only reads — posts, submissions,
    state-changing calls, and side effects are out, composing with F2's
    external-action approvals.
11. (F10-Q6 Agreed 2026-09-22; F6-Q5; F10-WR-11) A written, user-signed AGPL
    boundary review gates shipping and every shared build — shared meaning any
    artifact that could leave the build machine or the user's control
    (fail-closed gray-zone rule), pure-local fixtures counting as internal —
    while pinned-artifact internal testing proceeds — and no blanket clearance
    exists, the old acceptable-line being provenance only.
12. (F2-PE-13; F10-Q1; F10-WR-12) The adapter gates on verified capability plus
    operation plus arguments plus resolved targets — a trusted name alone never
    suffices — and unmapped capabilities park fail-closed until verified, with
    the retrieval taxonomy and verification steps as this spec's engineering
    item.
13. (Derived; F10-WR-13) F1–F9 rules do not move for retrieval work, and every
    block here is a spec requirement awaiting probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Adapter CLI/MCP invocation shape plus error mapping (no shapes set here).
2. The F2-PE-13 retrieval operation/target taxonomy plus verification steps
   (this spec's engineering item — strings pinned at build).
3. Fallback-chain switch mechanics (trigger evaluation order, back-off values,
   trail record shape — no values set here).
4. Cap-probe procedure plus verbatim 429 capture format (procedure downstream;
   C7 holds).
5. BYOK config surface (slot names, storage, scope — no keys invented here).
6. List-only snippet length and shape (titles + URLs + snippets; bounds
   downstream).
7. Context7 call shape (anonymous vs keyed paths — no call strings set here).
8. The MCP adapter pick: @pi-unipi/mcp direct vs pi-mcp-adapter single-proxy
   (spec-phase pin per `MANIFEST.md:48-50` — no selection here).
9. The donsetch artifact pin (version + source URL + SHA) plus the Cargo 4.1.1
   vs npm/pi 3.x drift resolution (pinned at build per the F6 posture).
10. The AGPL review document shape plus sign-off record (procedure per F6-Q5;
    no clearance invented here).
11. Approval-lookup registry shape (F10-Q7): the standing allowlist in plugin
    config (user-owned, user-only edits) plus task-record session entries with
    expiry; Dispatcher task-scope approval and revocation shapes — shapes only,
    no values invented here.
12. Citation-stamp hash/length binding shape (F10-WR-09) — shape only, no hash
    algorithm selected here.
13. List-only snippet bound pin (F10-Q10): the exact length pins at build; the
    bound discloses in the evidence record — no length invented here.
14. Probe-call accounting shape (F10-WR-08/C7): build-time probe usage budgeted
    and disclosed separately from runtime usage — shape only, no values set
here.

Implementation probes (runtime evidence before build claims):

1. Adapter-gate adversarial proof: name-spoofed tools blocked on
   capability+op+arg+target mismatch.
2. Separate-process boundary proof: no library-linked donsetch path exists in
   the build.
3. Fallback-chain proof: 429 at each tier falls to the next in pinned order.
4. List-only enforcement proof: Dispatcher/Expert raw-fetch attempts blocked
   with snippet-only surfaces intact.
5. Zero-paid proof: no paid endpoints touched across the full chain with BYOK
   absent.
6. Citation-stamp proof: every result carries URL + retrieval time + content hash/length binding.
7. Captcha-block proof: captcha walls block with the unlocker disabled and the
   unlocker never auto-enables.
8. Exhaustion gap-disclosure proof: spent-chain gaps disclose under the Q8/Q18
   composition on both branches.
9. Empirical proof that the chosen adapter, pin, and tiers enforce sections
   2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. On-record caps (markdown.new 500/day, Jina 20 RPM, TinyFish $0/URL,
   Tavily/Firecrawl 1k credits/mo, Context7 1k calls/mo) are probe-pinned
   claims, never truth — probes decide at build.
2. Exa code-vs-advertised drift is on record (`EVIDENCE.md:158-164`) — probe,
   never assume.
3. Brave/Serper disqualification stands (`EVIDENCE.md:22`) — not relitigated
   here.
4. The registerTool auto-activate race conditions the native-extension fallback
   — unverified until probes prove both boundary and enforceability.
5. Same-model review anchoring risk remains; the fresh-session artifact packet
   is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
6. Artifact pins, taxonomy strings, BYOK keys, snippet bounds, and call shapes
   are explicitly unknown here — downstream, never invented.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8/F9 digests
  and the F10 digest (this feature's authority where they differ; the absorbed
  per-seat provenance note and the AGPL provenance-vs-amendment note recorded).
- `../PRD.md` — Stage A frame; retrieval scope cross-referenced here (no
  re-decision here).
- `../MANIFEST.md` — the MCP adapter pick pinned at spec phase (48-50);
  cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; Brave/Serper
  disqualification (:22) and Exa drift (:158-164) stay open there.
- `README.md` — Stage B index; this is feature 10 of 13.
