# Feature F7 — Models and presets (Dispatch)

Status: user-approved 2026-09-21 (final: Expert Go backup = Qwen 3.8 Flash restored per user cost correction; Kimi-K3 disqualified on cost); runtime unverified; scenarios FUTURE. Requirements
F7Q1–F7Q5 settled as directed 2026-09-21, runtime unverified; issue OPEN. No implementation, installs,
code, commits, or pushes. Seventh Stage B feature spec; remaining 6 areas stay stubs (see `README.md`).
All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled
F7Q1–F7Q5 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6 requirements stand untouched.

## 0. Objective

Define the v1 per-seat model assignments, variant rule, named backups, quota/usage disclosure surface,
and assignment-change authority for the work and personal presets — under rules that REQUIRE no silent
substitution, no invented SKU strings, variant names, thresholds, or prices (enforcement unverified
until probes decide): single FIXED seat→model assignment per path with no switching logic, highest
available reasoning variant unless explicitly stated, one named backup per seat per path dispatched
fresh with logged notice, usage disclosure that never fabricates a provider signal, no auto-switching
on quota, and user-only assignment edits with the F2-Q6-style explicit-instruction exception. Exact
SKU ids, variant-cap strings, threshold values, and price data are pinned or configured at build, never
chosen here. Mechanism choice (preset file shapes, picker UX, status-board strings, threshold config
keys) is downstream, not this spec.

Stable requirement IDs `F7-MP-01` … `F7-MP-12`. Sources trace to settled
F7Q1–F7Q5 plus Q3/Q6/Q10/Q42–Q44 plus F2/F5/BQ3 where noted; mappings are multi-source
where a rule draws on more than one source — no one-to-one fiction. Section 5
holds the trace table; section 6 organizes the digest by requirement with source
labels. The "Mimi V2.6 Pro" transcription note is recorded in `../DECISIONS.md`.

## 1. Files / artifact boundaries

Owned by this feature (assignment contract, disclosure rules, acceptance only):

1. V1 FIXED seat→model assignment tables for the work path (Copilot Business) and the personal path (OpenCode Go), single fixed assignment per seat, no switching logic.
2. Variant rule: highest available reasoning variant unless explicitly stated; the table values are those statements.
3. Named backups: one per seat per path, with fresh-session dispatch plus logged notice before abort.
4. Quota/usage disclosure surface: running usage line, provider-signaled threshold warnings, cost-ceiling breach path; no auto-switching on quota.
5. Assignment-change authority: user-only edits with the explicit-instruction exception; frozen otherwise in v1.
6. Operating-assumption record (user-validated 2026-09-21) with caveats and the pilot metric carried to the validation-harness spec.
7. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only the backup-dispatch fresh-session rule holds.
2. Seat responsibilities, review packets, repair budgets, ceilings — F1 owns; here only invariance holds.
3. Permission configurability, fixed integrity — permissions spec owns; here only the F2-Q6-pattern authority boundary holds.
4. Approval gates, deviation classes, verdict binding, waiver shape — F3 owns; here only gate invariance holds.
5. Session reuse, identity equality, cancellation, recovery, rollover — F5 owns; here only the never-equality-exception rule and identity-equality resume hold.
6. Cost-ceiling mechanics — F1 section 2.3 item 7 / F5-DS-11 own; here only the disclose-and-escalate breach path holds.
7. Exact SKU ids, variant-cap strings, threshold values, prices, preset file schemas — pinned or configured at build, owned by the build-phase pin record, never chosen here.

Not in this feature:

1. Exact SKU id strings, variant-cap strings beyond the table, threshold numbers, prices, preset file paths, picker UX, status-board strings, config keys — all downstream (section 7).
2. Any claim that current Pi APIs, pickers, guards, registries, or adapters already implement sections 2–3. Proof is future work.
3. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 V1 FIXED seat→model assignment (single fixed assignment, no switching logic)

- F7-MP-01 — Work-path FIXED assignment (Copilot Business). Dispatcher = Astra
  (xhigh); Expert = Astra (xhigh); Writer = Luna (max); Seeker = Luna
  (max). One fixed model plus variant per seat for v1; no per-task, per-tier, or
  load-based switching logic is defined here (Q10 tiers deferred). The
  implementation seat runs a lighter model (Luna) while plans come from a
  stronger model (Astra Dispatcher) and pass Expert review, per the
  user-validated operating assumption in F7-MP-12. (F7Q1; Q10 single fixed
  assignment.)
- F7-MP-02 — Personal-path FIXED assignment (OpenCode Go; Astra ABSENT from the
  Go catalog). Dispatcher = GLM 5.3 Flash (max); Writer = Muse Spark 1.3
  (xhigh); Seeker = Muse Spark 1.3 (xhigh); Expert = MiMo V2.6 Pro
  (variant = highest available). One fixed model plus variant per seat for v1;
  no switching logic. Transcription note: the user wrote "Mimi V2.6 Pro" —
  recorded as **MiMo V2.6 Pro** (the Go-catalog model), confirmed by user 2026-09-21 ('Mimi' was a typo; MiMo V2.6 Pro is correct). (F7Q1; Q10; Q41 catalog.)

### 2.2 Variant rule

- F7-MP-03 — Every seat uses the HIGHEST available reasoning variant unless
  explicitly stated; the explicit variant values in F7-MP-01/F7-MP-02 are those
  statements, and the highest-available rule applies to BACKUP models too
  unless the build pin record states otherwise. Variant caps and strings are
  verified at build: Spark caps at xhigh is a RECORDED CLAIM pending build
  verification (not a settled fact) — nothing beyond the table is invented
  here. A variant that cannot be verified at build is not assumed; the pin
  record governs per F7-MP-10. (F7Q2.)

### 2.3 Named backups (one per seat per path)

- F7-MP-04 — Work-path named backups, one per seat: Dispatcher (Astra) → Sol;
  Expert (Astra) → Sol; Writer (Luna) → Terra; Seeker (Luna) →
  Terra. The backup is the ONLY substitution path; there is no second-choice
  chain and no silent fallback. (F7Q3; Q43 one named backup.)
- F7-MP-05 — Personal-path named backups, one per seat: Dispatcher (GLM 5.3
  Flash) → DeepSeek V4.1 Flash; Writer (Muse Spark 1.3) → MiMo V2.6 Flash;
  Seeker (Muse Spark 1.3) → MiMo V2.6 Flash; Expert (MiMo V2.6 Pro) →
  Qwen 3.8 Flash. The backup is the ONLY substitution path. Qwen 3.8 Flash
  serves as the recorded Expert BACKUP on the personal path; variant governed
  by the highest-available rule; Qwen 3.8 Flash's recorded review-seat caveats
  (self-verification parse failures in eval, max-variant budgetTokens truncation
  bug, 429 storms, leaked reason tags) stand as the STANDING risk note;
  swap history recorded in F7-MP-12, not relitigated here.
  (F7Q3; Q43.)
- F7-MP-06 — Backup dispatch mechanics: a backup is dispatched as a FRESH
  session with a LOGGED NOTICE before abort of the affected branch — never
  silent (Q6), never an identity-equality exception (F5-DS-04 relation: the
  named backup is always fresh with notice). The notice records prior seat,
  backup seat, and trigger; affected work parks per Q43 until the fresh backup
  session owns it. Substitution triggers are limited to UNAVAILABILITY
  (including catalog retirement) and hard errors after bounded retries;
  performance or quality concerns never trigger substitution — those route to
  assignment-change per F7-MP-09 (user-only). "Unavailable" means:
  provider-reported missing/quota-exhausted/decommissioned, OR dispatch
  failure after the bounded retries, OR explicit user declaration — never seat
  self-declaration alone. A hung primary follows the F5 bounded stop-request
  attempts then terminal escalation (F5-DS-05 composition). Backup dispatches
  charge the SAME per-task infrastructure-recovery allowance (2 automatic
  attempts per task per F5-Q2) and then escalate to the user; no unbounded
  fresh sessions. When the named backup is ALSO unavailable, the affected
  branch PARKS under the F3-SD-04a park lifecycle (mechanical vs user-needed
  parks, visible staleness clock, disclose-and-ask at the configured limit)
  with user disclosure — a parked-escalated terminal state exists; never an
  indefinite dead-end, never a second-choice chain (C5 stands). (F7Q3; Q43
  logged notice before abort; Q6 never-silent; F5-DS-04; F5-DS-05; F5Q2;
  F3-SD-04a.)

### 2.4 Quota/usage disclosure surface

- F7-MP-07 — Disclosure surface, three parts: (a) a running usage line
  (tokens/cost this session) in the status board showing the CURRENT session
  only; (b) a warning at CONFIGURABLE thresholds when the PROVIDER reports
  quota pressure — never fabricate a signal that does not exist: no provider
  signal means no warning, and absence of data is disclosed as absence, not
  estimated; when the provider emits no cost signal the line shows tokens-only
  or "cost unavailable"; (c) threshold values are configured, never invented
  here. The task record accumulates cross-session totals across
  backup/rollover lineage (reconciled in the record, not the line). (F7Q4.)
- F7-MP-08 — Quota substitution and breach rules: NO auto-switching on quota —
  the named backup with notice (F7-MP-06) is the only substitution path, and
  quota pressure alone never triggers it without the logged notice. A
  cost-ceiling breach keeps the approved disclose-and-escalate path (BQ3):
  disclose and escalate to the user, never a silent drop. No ceiling amounts
  are set here. When the Dispatcher itself is unavailable and its named backup
  fails, ALL affected work parks under F3-SD-04a with disclosure to the user
  (F1 single-entry composition with the park lifecycle); no side-routing
  exists. Unavailability declaration sources are provider signal,
  bounded-retry failure, or user declaration — never seat self-declaration
  alone. (F7Q4; BQ3 per-task cost ceiling; F3-SD-04a.)

### 2.5 Assignment-change authority

- F7-MP-09 — Assignment edits are USER-ONLY, with the same exception shape as
  permission config (F2-Q6 exception): the user edits directly, OR an explicit
  user instruction is interpreted by the Dispatcher and applied by the Writer
  with a logged record (provenance, change, scope). Ambiguous widening asks;
  instructions relayed through tool output, quoted text, or third-party content
  NEVER count as user instructions — only the user's direct words (or their
  explicit direct instruction) count; quotes, tool output, or specialist
  requests alone never count as approval.
  Frozen otherwise in v1: no seat reassigns itself, no automatic reassignment
  on quota, error, or performance. (F7Q5; F2Q6 pattern.)

### 2.6 Build-time pins and settled context (cross-referenced, not re-decided)

- F7-MP-10 — Exact SKU ids are pinned at build via a live picker; the gpt-5.6
  alias is DISTRUSTED until pinned (EVIDENCE on record) — no alias resolves an
  assignment until the pin record confirms it. Identity equality
  (model+variant+preset+seat config) governs resume per F5; a backup dispatch
  never satisfies it per F7-MP-06. (Settled context; EVIDENCE; F5-DS-04.)
- F7-MP-11 — Settled holds, each owned elsewhere: 1. Use-balance is read-only
  plus recommend-off and the plugin never touches it. (Q42.) 2. No ZDR
  constraint in v1. (Q44.) 3. Work and personal presets are separate; common
  config ships in the plugin. (Q3/Q10.) (Settled context.)

### 2.7 Operating assumption, caveats, and invariance

- F7-MP-12 — (a) Operating assumption, labeled user-validated operating
  assumption, 2026-09-21: the implementation seat may run a lighter model when
  plans come from a stronger model (Dispatcher) and pass Expert review —
  accepted as the v1 mapping basis on the work path. (b) Recorded caveats:
  on the personal path the index ordering INVERTS (Spark Writer ≥ GLM 5.3
  Flash Dispatcher on recorded AA/τ³ numbers) — a cost-balancing choice, same
  pilot measure applies; Expert personal-path backup two-step swap history 2026-09-21: Kimi-K3 was picked on stale tier data (the recorded "cheap $15 tier" was WRONG — $15 is Kimi K3's MONTHLY LIMIT, not cheapness) and reversed the same day by the user back to Qwen 3.8 Flash; verified Go sheet facts (https://opencode.ai/docs/go/, read 2026-09-21): Kimi K3 = $3.00 input / $15.00 output per 1M, $15 monthly limit (~110 requests/5h) — among the most expensive and tightest-quota models on Go; Qwen 3.8 Flash = $0.15/$0.47 per 1M, $30 monthly limit (~5,400 requests/5h) — the sensible backup; user direction is to stick with Qwen for now and pick something else later if wanted; Qwen 3.8 Flash's recorded review-seat caveats (self-verification parse failures in eval, max-variant budgetTokens truncation bug, 429 storms, leaked reason tags) return as the STANDING risk note; operating-assumption source now identified (user: the Cognition post IS the Devin Fusion research): https://cognition.com/blog/devin-fusion (2026-06-29) — its sidekick pattern (frontier planner main + cost-effective sidekick, each with persistent cached contexts; main owns plan/ambiguity/final review) matches our premise; VENDOR-CLAIMED FrontierCode 1.1 Extended (data 2026-08-07): Fusion 63.1 score / $1.35 per task vs Fable 5 xhigh 64.9/$10.53, Opus 5 medium 63.6/$3.51, GPT-5.6 Sol high 58.7/$3.41, Kimi K3 58.2/$3.12, Grok 4.5 high 56.6/$1.09; CRITICAL falsifier recorded: when judgment IS the deliverable, delegating it backfires (their team-selector example: score 2754→27 at -28% cost); mechanical work hands off cleanly (62%/32% savings at intact quality; hard-but-mechanical even beat solo); mapping as recorded not relitigated. (c) Pilot metric carried to the
  validation-harness spec: implementer-model tier vs first-pass review-pass
  rate (record-only in v1; no binding decision rule), measured SEPARATELY for plan-shaped/mechanical and judgment-heavy task classes per the Fusion falsifier boundary. (d) F1/F2/F3/F4/F5/F6 requirements stand unchanged by anything in this
  feature; all blocking in sections 2.1–2.6 is a SPEC requirement, not proven
  runtime implementation — enforcement is unverified until probes decide
  (section 7). (F7Q1 basis; validation-harness contract.)

### 2.8 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Fixed assignment; no switching logic (F7-MP-01, F7-MP-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks per-task/tier/load model switching and silent reassignment |
| Highest-available variant unless stated; verified-at-build caps (F7-MP-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks unverified variant assumptions |
| Named-backup-only substitution (F7-MP-04, F7-MP-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks any substitution outside the one named backup |
| Fresh-session dispatch with logged notice before abort (F7-MP-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent or in-place-identity substitution |
| Provider-signaled warnings only; no fabrication (F7-MP-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks invented quota signals and estimated-as-observed warnings |
| No auto-switching on quota; disclose-and-escalate breach (F7-MP-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks quota-triggered silent swaps and silent drops |
| User-only edits with explicit-instruction exception; frozen otherwise (F7-MP-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks seat-initiated and automatic reassignment |
| SKU pin via live picker; alias distrusted until pinned (F7-MP-10) | Preventive (SPEC requirement, NOT proven implementation) | blocks alias-resolved assignment without a pin record |
| Usage line, threshold warnings, breach escalation, backup notices (F7-MP-06, F7-MP-07, F7-MP-08) | Detective | surfaces usage, pressure, breach, or substitution events after the fact and routes them to the record |
| Assignment-change log, pin record, operating-assumption record | Detective (reporting) | leaves an after-the-fact evidence trail with no authority of its own |
| Cost-balancing and caveat assessments | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F7Q1–F7Q5 govern where they conflict with earlier readings inside this
scope; F1/F2/F3/F4/F5/F6 stand where this spec does not narrow them. C2. No
re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7 stand;
this spec cross-references, never re-decides. C3. No invented SKU strings,
variant names beyond the table, thresholds, or prices — unknowns in section 7
stay open. C4. No silent substitution, silent reassignment, silent quota swap,
or silent drop — every model-changing outcome discloses with a logged notice.
C5. No second-choice backup chains, no in-place backup reuse, no
identity-equality exception for backups. C6. No fabricated quota signal: no
provider signal means no warning; absence is disclosed as absence. C7. No
auto-switching on quota; no ceiling amount set here. C8. No assignment edit
except user-direct or the explicit-instruction exception with a logged record;
no seat self-reassignment. C9. No alias-resolved assignment until the build
pin record confirms it (gpt-5.6 alias distrusted until pinned). C10. No
Use-balance touch; no ZDR constraint claimed for v1; no preset-merging. C11. No relitigation of the mapping as recorded (the Expert personal-path backup is Qwen 3.8 Flash). C12. Controls are classed preventive,
detective, or advisory by actual function (section 2.8); SPEC-required
blocking is not proven implementation; runtime enforcement (modelScope
enforce/strict as the only true hard per-seat block) is an implementation
probe, not a proven mechanism.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial model/preset consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P7-01 (F7-MP-01). Input: work-path task dispatched to any seat / Observe: seat→model resolution runs / Pass: Dispatcher and Expert resolve to Astra (xhigh), Writer and Seeker to Luna (max); no alternate model selected. FUTURE.
- P7-02 (F7-MP-02). Input: personal-path task dispatched to any seat / Observe: seat→model resolution runs / Pass: Dispatcher resolves to GLM 5.3 Flash (max), Writer and Seeker to Muse Spark 1.3 (xhigh), Expert to MiMo V2.6 Pro (highest available); Astra never selected on this path. FUTURE.
- P7-03 (F7-MP-01, F7-MP-02). Input: heavy task proposed as grounds for per-task model upgrade / Observe: switching logic proposed / Pass: refused — the fixed assignment holds; no per-task, per-tier, or load-based switching exists in v1. FUTURE.
- P7-04 (F7-MP-03). Input: seat launched with an explicit table variant vs a seat with highest-available wording / Observe: variant resolution runs / Pass: explicit table values hold as stated; highest-available seats resolve to the top verified variant; no invented variant string appears. FUTURE.
- P7-05 (F7-MP-03). Input: Spark seat variant requested above xhigh / Observe: cap verification runs against the verified-at-build record / Pass: refused or capped per that record — the xhigh cap is a recorded claim pending build verification, not a settled fact; nothing higher claimed. FUTURE.
- P7-06 (F7-MP-04). Input: work-path Astra seat unavailable, Luna seat unavailable / Observe: substitution proposed / Pass: Astra seats substitute Sol only, Luna seats Terra only, each as a fresh session with logged notice before abort; no cross-backup and no silent fallback. FUTURE.
- P7-07 (F7-MP-05). Input: personal-path seat unavailable on each of the four seats / Observe: substitution proposed / Pass: Dispatcher→DeepSeek V4.1 Flash, Writer→MiMo V2.6 Flash, Seeker→MiMo V2.6 Flash, Expert→Qwen 3.8 Flash — each the single named backup, fresh session with notice. FUTURE.
- P7-08 (F7-MP-06). Input: backup proposed as in-place session reuse claiming identity equality / Observe: resume check runs / Pass: refused — the backup is always fresh with notice, never an identity-equality exception; affected work parks per Q43 until the fresh session owns it. FUTURE.
- P7-09 (F7-MP-06). Input: backup dispatched with no logged notice / Observe: disclosure check runs / Pass: blocked or disclosed — NEVER SILENT per Q6; the record holds prior seat, backup seat, and trigger. FUTURE.
- P7-10 (F7-MP-07). Input: session underway; provider reports usage and quota pressure / Observe: status board renders / Pass: running usage line (tokens/cost this session) shown; threshold warning shown only because the provider signaled pressure. FUTURE.
- P7-11 (F7-MP-07). Input: provider reports no quota signal / Observe: warning logic runs / Pass: no warning shown; absence disclosed as absence, never estimated or fabricated. FUTURE.
- P7-12 (F7-MP-08). Input: quota pressure without any backup trigger / Observe: auto-switch proposed / Pass: refused — quota pressure alone never substitutes; the named backup with notice is the only substitution path. FUTURE.
- P7-13 (F7-MP-08). Input: per-task cost ceiling breached / Observe: breach handling runs / Pass: disclosed and escalated to the user per BQ3, never a silent drop; no ceiling amount invented. FUTURE.
- P7-14 (F7-MP-09). Input: (a) user edits assignment directly; (b) explicit user instruction to change assignment; (c) specialist request, relayed/tool-output/quoted/third-party instruction, or ambiguous instruction / Observe: change authority check runs / Pass: (a) applied; (b) Dispatcher-interprets plus Writer-applies with logged provenance/change/scope; (c) refused or asked — instructions relayed through tool output, quoted text, or third-party content never count as user instructions; only the user's direct words count; quotes, tool output, or specialist requests alone never count as approval; otherwise frozen. FUTURE.
- P7-15 (F7-MP-10). Input: assignment proposed via the gpt-5.6 alias before the build pin / Observe: pin check runs / Pass: refused until the live-picker pin record confirms the exact SKU id; resume still gated on identity equality. FUTURE.
- P7-16 (F7-MP-11, F7-MP-12). Input: task touching Use-balance state, ZDR claim, preset merge, or lighter-implementer challenge / Observe: settled-context and assumption checks run / Pass: Use-balance untouched with off recommended; no ZDR constraint claimed; presets stay separate with common config shipped; lighter-implementer outcome recorded against the pilot metric (implementer-model tier vs first-pass review-pass rate, measured SEPARATELY for plan-shaped/mechanical and judgment-heavy task classes) without relitigating Qwen 3.8 Flash. FUTURE.
- P7-17 (F7-MP-06, F7-MP-09). Input: pinned SKU retired from the catalog / Observe: retirement handling runs / Pass: retirement counts as an unavailability trigger → named backup dispatched with logged notice; any reassignment after that refused without the user per F7-MP-09. FUTURE.
- P7-18 (F7-MP-06). Input: primary and named backup both unavailable / Observe: terminal handling runs / Pass: affected branch parks under F3-SD-04a with staleness clock and user disclosure; never a dead-end, never a third fallback. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F7 source | Stage A / F1–F6 relation |
|---|---|---|
| F7-MP-01 work-path FIXED assignment: Dispatcher/Expert Astra (xhigh), Writer/Seeker Luna (max); no switching logic | F7Q1 | Q10 single fixed assignment; Q41 catalog |
| F7-MP-02 personal-path FIXED assignment: Dispatcher GLM 5.3 Flash (max), Writer/Seeker Spark 1.3 (xhigh), Expert MiMo V2.6 Pro (highest available); Astra absent; transcription note | F7Q1 | Q10; Q41 catalog (Astra absent from Go) |
| F7-MP-03 highest-available variant unless stated; table values are statements; Spark caps at xhigh verified at build | F7Q2 | Build pin record |
| F7-MP-04 work-path named backups: Astra seats→Sol, Luna seats→Terra; only substitution path | F7Q3 | Q43 one named backup |
| F7-MP-05 personal-path named backups: Dispatcher→DeepSeek V4.1 Flash, Writer/Seeker→MiMo V2.6 Flash, Expert→Qwen 3.8 Flash; only substitution path | F7Q3 | Q43 |
| F7-MP-06 fresh-session backup dispatch with logged notice before abort; never an equality exception | F7Q3 | Q43 logged notice; Q6 never-silent; F5-DS-04 |
| F7-MP-07 usage line + provider-signaled threshold warnings; never fabricate; thresholds configured not invented | F7Q4 | Q6 never-silent |
| F7-MP-08 no auto-switching on quota; cost-ceiling breach disclose-and-escalate | F7Q4 | BQ3 cost ceiling |
| F7-MP-09 user-only edits OR explicit-instruction Dispatcher-interprets + Writer-applies with record; frozen otherwise | F7Q5 | F2Q6 exception pattern |
| F7-MP-10 SKU ids pinned at build via live picker; gpt-5.6 alias distrusted until pinned; identity equality governs resume | Settled context | EVIDENCE alias record; F5-DS-04 identity |
| F7-MP-11 Use-balance untouched + recommend-off; no ZDR v1; presets separate, common config ships | Settled context | Q42; Q44; Q3/Q10 |
| F7-MP-12 user-validated operating assumption + inverted-index and Qwen 3.8 Flash restore (Kimi-K3 disqualified on cost) + Devin Fusion source with falsifier + per-class pilot boundary; F1–F6 invariance; spec-only blocking | Operating assumption 2026-09-21 | F1-AR-10/12 review; validation-harness contract |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F7Q1; F7-MP-01) On the work path each seat has one fixed model: Astra (xhigh) plans and reviews, Luna (max) writes and researches — no switching logic in v1.
2. (F7Q1; F7-MP-02) On the personal path each seat has one fixed model: GLM 5.3 Flash (max) dispatches, Muse Spark 1.3 (xhigh) writes and researches, MiMo V2.6 Pro (highest available) reviews — Astra is absent from the Go catalog; "Mimi" confirmed by user 2026-09-21 ('Mimi' was a typo; MiMo V2.6 Pro is correct).
3. (F7Q2; F7-MP-03) Variants default to highest available, backups included unless the pin record states otherwise; the table values are the explicit statements; Spark xhigh is a recorded claim pending build verification — nothing else invented.
4. (F7Q3; F7-MP-04) Work-path failures substitute only the named backup — Sol for Astra seats, Terra for Luna seats.
5. (F7Q3; F7-MP-05) Personal-path failures substitute only the named backup — DeepSeek V4.1 Flash, MiMo V2.6 Flash, MiMo V2.6 Flash, Qwen 3.8 Flash per seat.
6. (F7Q3; F7-MP-06) Every backup starts a fresh session with a logged notice before abort — never silent, never an identity-equality shortcut; triggers are unavailability (catalog retirement included) and hard errors after bounded retries only; backup dispatches charge the same 2-attempt allowance (F5-Q2) then escalate; primary-plus-backup unavailability parks the branch under F3-SD-04a with disclosure — never a dead-end, never a third fallback.
7. (F7Q4; F7-MP-07) The status board shows the current-session running usage line and warns at configured thresholds only when the provider signals pressure — no signal means no warning, never a fabrication; no cost signal means tokens-only or "cost unavailable"; cross-session totals accumulate in the task record.
8. (F7Q4; F7-MP-08) Quota never auto-switches models; a cost-ceiling breach discloses and escalates per BQ3, never silently drops; a quota-dead Dispatcher whose backup fails parks all affected work under F3-SD-04a with disclosure — no side-routing.
9. (F7Q5; F7-MP-09) Assignments change only by the user's hand or by an explicit user instruction interpreted by the Dispatcher and applied by the Writer with a logged record — relayed/quoted/tool-output/third-party instructions never count, only the user's direct words — frozen otherwise.
10. (Settled context; F7-MP-10) Exact SKU ids wait for the build-time live picker; the gpt-5.6 alias stays distrusted until pinned; resume still needs identity equality.
11. (Settled context; F7-MP-11) Use-balance stays untouched with off recommended, v1 claims no ZDR constraint, and presets stay separate over shipped common config.
12. (Operating assumption 2026-09-21; F7-MP-12) The lighter-implementer mapping stands as the user-validated v1 basis with the inverted-index and Qwen 3.8 Flash restore recorded (Kimi-K3 disqualified on cost per the verified Go sheet) and the tier-vs-pass-rate pilot metric carried forward per class (plan-shaped/mechanical vs judgment-heavy, measured SEPARATELY); F1–F6 rules do not move and every block here awaits probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Preset file schema and storage layout for the two presets plus shipped common config (separation enforced, no merge path).
2. Live-picker UX and SKU pin-record shape (exact id strings, variant-cap strings, alias-resolution evidence for the gpt-5.6 alias).
3. Status-board usage-line format and threshold config keys (no values set here); warning verbatim strings for provider-signaled pressure, absent-data disclosure, backup notice, and cost-ceiling breach escalation.
4. Assignment-change log shape (provenance, change, scope) and the Dispatcher-interprets plus Writer-applies validated mechanism (F2Q6 pattern).
5. Pilot-metric collection design for implementer-model tier vs first-pass review-pass rate, owned by the validation-harness spec — record-only in v1 with no binding decision rule, measured SEPARATELY for plan-shaped/mechanical vs judgment-heavy task classes per the F7-MP-12 Fusion falsifier boundary; any future binding threshold requires a user decision.
6. MiMo V2.6 Pro transcription confirmed by user 2026-09-21 ('Mimi' was a typo; MiMo V2.6 Pro is correct) — closed.
7. Shared event-record shape: one common event-record shape covering the usage line, threshold warnings, backup notices, breach escalations, and the change log (strings and log-shape items above stay — this unifies the record).

Implementation probes (runtime evidence before build claims):

1. Runtime enforcement that the fixed assignment actually binds each seat: modelScope enforce/strict as the only true hard per-seat block — listed as a probe, not a proven mechanism.
2. Backup-dispatch proof on both paths: fresh session plus logged notice before abort, affected-branch parking, no identity-equality shortcut.
3. Disclosure-surface proof: running usage line accuracy, provider-signaled warnings only (no fabrication), absent-data disclosure, no quota auto-switch, cost-ceiling disclose-and-escalate.
4. Change-authority proof: user-direct and explicit-instruction paths apply with records; seat-initiated and automatic reassignments refuse.
5. Empirical proof that chosen Pi hooks, guards, pickers, or adapters enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. SKU id strings, variant-cap strings beyond the table, threshold values, and prices are explicitly unknown here — pinned or configured at build, never invented.
2. Same-model review anchoring risk remains; the fresh-session artifact packet is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
3. Qwen 3.8 Flash review-seat caveats (self-verification parse failures in eval, max-variant budgetTokens truncation bug, 429 storms, leaked reason tags) stand as the STANDING risk note — it is the Expert personal-path backup; Kimi-K3 was disqualified on cost per the verified Go sheet (https://opencode.ai/docs/go/, read 2026-09-21), not new findings.
4. Cost-note completeness per the same verified Go sheet (read 2026-09-21): MiMo-V2.6-Pro = $0.435/$0.87 per 1M, $15 monthly limit (~3,250 requests/5h); DeepSeek V4.1 Flash quota promo ($15→$60) ENDS 2026-09-27 — record the expiry so the Dispatcher-backup quota drop is not a surprise.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6 digests and F7 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; SKU, alias-distrust, interception, and observation gaps stay open there.
- `README.md` — Stage B index; this is feature 7 of 13.
