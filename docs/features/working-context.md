# Feature F12 — Working context (Dispatch)

Status: user-approved 2026-09-23 (F12-Q1–Q9); independently reviewed; band-review corrections applied (CONCERNS 2/3 → 11 fixes + WC-09 → re-check READY); runtime unverified; all scenarios FUTURE. Closed-pending-issuance until issue closure. Requirements F12-WC-01 … F12-WC-09 settled as directed 2026-09-22 (F12-WC-09 additive 2026-09-23; no renumbering).
No implementation, installs, code, commits, or pushes. Twelfth Stage B
feature spec; F1–F12 approved (F11 closed-pending tgo-gc3n; F12 closed-pending-issuance tgo-ylvc); 0 stubs remain
(F13 validation harness opening — see `README.md`). All scenarios FUTURE, not executed.
Historical Q1–Q51 and prior amendments are subordinate to settled F12-Q1–F12-Q6
where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11
requirements stand untouched.

## 0. Objective

Define the v1 working-context record and its policy shell: a HYBRID
compressor-ownership rule (the native Pi compressor owns the working set,
Magic Context owns archive/retrieval, SINGLE compressor owner — NEVER both
summarizing, non-negotiable per the double-compress hazard), a build-phase
implementation-path probe with a RECORDED SELECTION GATE and a stated
preference order (path (a) disable-historian + native compaction first; path
(b) a session_before_compact custom archiver only as fallback, with the probe
result returning to the USER before anything pins), a Seeker-tier
archive/retrieval pass with per-pass cost/rate bounds (F7 composition, same
composition as the F11 verifier), a three-item must-follow re-injection set
riding every turn inside the F8-Q7 prompt-core budget (F12-Q7 refinement option (A): the ≤500/1000 binds seat instructions + thin always-on layer + re-injection set; skill bodies sit on the disclosed exposure budget), a session-archive
→ durable-memory boundary (archives are recall sources only; durable
promotion happens ONLY through F11 staged admission or user direct writes) plus a no-auto-deletion retention rule (F12-WC-09),
per-seat ctx_* surfaces mirroring the F10 pattern with bounded snippets,
manual /compact and /ctx-* escapes always available, and a zero-sidecar
print/headless rule (interactive-only v1) with F1's delegation-envelope evidence return as the DECLARED SOLE CHANNEL for headless children's work — with every block a SPEC
requirement whose enforcement is unverified until probes decide: recording
safety facts with provenance, absorbing the absorbed settled directions with
provenance labels, and leaving every invocation shape, record format, bound
value, and enforcement mechanism to section 7.

Stable requirement IDs `F12-WC-01` … `F12-WC-09` (F12-WC-09 additive 2026-09-23; no F12-WC-01…08 or P12-01…21 renumbering). Sources trace to settled
F12-Q1–F12-Q9 (all Agreed 2026-09-22 "Agreed on all") plus Q28, Q29, Q30,
Q9, and the absorbed settled directions (provenance: research + grilling
record — the package files previously lacked the recorded safety facts, noted
wherever they appear); mappings are multi-source where a rule draws on more
than one source — no one-to-one fiction. Section 5 holds the trace table;
section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (working set, session archives, re-injection,
per-seat surfaces, print/headless rule, acceptance only):

1. Hybrid compressor ownership: native Pi compressor owns the working set;
   Magic Context owns archive/retrieval; SINGLE compressor owner; NEVER both
   summarizing (non-negotiable).
2. Implementation-path selection gate: build-phase probe with preference
   (a) then (b); probe result returns to the user before anything pins.
3. Archive/retrieval pass: Seeker-tier composition with per-pass cost bound
   plus rate bound configured alongside.
4. Must-follow re-injection: exactly three items every turn inside the
   F8-Q7 prompt-core budget (≤500 target / 1000 hard cap binds the PROMPT
   CORE ONLY — seat instructions + thin always-on layer + re-injection
   set; F12-Q7 refinement option (A), user-approved 2026-09-22); REQUIRED
   content never trimmed (F11-Q7 exemption); skill bodies sit on the
   disclosed exposure budget where F8-Q9's trim order applies; over-budget
   runs hit F8-Q9 trim/park rules.
5. Archive→durable boundary: session archives never feed durable memory
   automatically; durable promotion only through F11 staged admission (with
   source link) or user direct writes.
6. ctx_* surfaces: manual /compact and /ctx-* escapes always available;
   per-seat surfaces mirror the F10 pattern with bounded snippets.
7. Print/headless rule: ZERO sidecars in ANY non-interactive invocation
   (headless --print children AND print-inside-interactive).
8. Recorded safety facts with provenance labels.
9. Invariance and spec-only status: F1–F11 unchanged; every block a SPEC
   requirement with enforcement unverified until probes decide.
10. Control classification of the above by actual function.
11. Archive retention: no auto-deletion of session archives EVER; purge is
    user-only (F12-WC-09).
12. Band-review compositions: atomic archive pass, task-ID scoping,
    path-(a) bar, atomic lock release, path-switch migration, per-item
    cost attribution (section 7).

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat responsibilities and ceilings — F1 owns; here only the per-seat
   surface scoping holds.
2. Model assignment and quota disclosure — F7 owns; here only the
   Seeker-tier archiver composition plus cost/rate bound configuration
   holds.
3. Prompt budgets and trim/park rules — F8 owns; here only the
   inside-the-prompt-core-budget re-injection composition holds (F12-Q7 refinement).
4. Always-on layer content — F9 owns the AGENTS.md block; here only the
   every-turn re-injection composition holds.
5. Retrieval citation and snippet disciplines — F10 owns; here only the
   ctx_* surface mirroring plus bounded-snippet composition holds.
6. Durable record and admission — F11 owns; here only the
   no-implicit-promotion boundary holds.
7. Exact re-injection format, budget accounting mechanics, archive record
   and retrieval index shapes, ctx_* surface table plus snippet bound,
   probe procedure plus preference mechanics, cost/rate bound values, and
   print-mode enforcement mechanics — downstream engineering owns, never
   chosen here.

Not in this feature:

1. Any implementation, install, configuration, commit, or push —
   documentation only; nothing runs.
2. Exact invocation shapes, record formats, bound values, snippet lengths,
   probe thresholds, or enforcement mechanics — all downstream (section 7).
3. Any claim that an implementation path is selected or that sections 2–3
   are enforced at runtime. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at
   a time per user request; integration follows.

## 2. Interfaces

### 2.1 Hybrid compressor ownership (Q28 + F12-Q1)

- F12-WC-01 — HYBRID COMPRESSOR OWNERSHIP: the native Pi compressor owns
  the working set; Magic Context owns archive/retrieval; SINGLE compressor
  owner — NEVER both summarizing (non-negotiable; the double-compress
  hazard is on record). The implementation path is DELEGATED to the
  build-phase probe with a RECORDED SELECTION GATE and a preference order:
  path (a) disable-historian + native compaction (clean no-op — UNVERIFIED)
  FIRST; path (b) a session_before_compact custom archiver (correct
  firstKeptEntryId/tokensBefore) only as fallback. The probe result returns
   to the USER before anything pins. Must-follow rules re-inject per
   F12-WC-03. PATH-(a) CLEANLINESS BAR: ownership confinement + no data
   loss + no dual summarization — Magic Context writes its OWN
   archive/retrieval store freely but NEVER the working set or transcript;
   the probe's pass criteria are recorded and stated in section 7.
   CANCELLATION/TIMEOUT MID-COMPACTION: the single-owner lock releases
   ONLY after the in-flight pass aborts or completes (atomic release,
   recorded); any retry re-verifies compressor ownership before
   summarizing (closing the dual-compress window). A path (a)→(b) mid-life
   switch is a MIGRATION EVENT under F11-DM-09's dry-run-diff discipline
   (the user sees the diff before apply). (Q28; F12-Q1 Agreed 2026-09-22.)

### 2.2 Archiver model (F12-Q2 + F7 composition)

- F12-WC-02 — ARCHIVER MODEL: the archive/retrieval pass runs on the
  Seeker-tier pattern (Luna at work / Muse Spark on Go) — the same
  composition as the F11 verifier (F11-Q7); per-pass cost bound + rate
   bound configured alongside; the F7↔F12 composition is named in section 7.
   ATOMIC ARCHIVE PASS: a cost/rate-bound breach discards the pass CLEANLY
   — no partial archive entry ever persists — and parks for bounded retry
   under F5's infrastructure allowance; never silent truncation (failure
   shape in section 7). (F12-Q2 Agreed 2026-09-22.)

### 2.3 Must-follow re-injection (F12-Q3 + Q28)

- F12-WC-03 — MUST-FOLLOW RE-INJECTION: exactly three items ride every
  turn — (1) the thin always-on layer (the F9-Q2 AGENTS.md block),
  (2) each seat's hard-rule summary (policy ceiling in a few lines — never
  the full seat prompt), (3) the living-spec pointer (current approved spec
  revision, per F3). Skills stay on-demand (F8); full specs never
   re-inject. COST TREATMENT: the re-injected set counts INSIDE the F8-Q7
   prompt-core budget — the ≤500 target / 1000 hard cap binds the PROMPT
   CORE ONLY (seat instructions + the thin always-on layer + the three-item
   re-injection set); SKILL BODIES sit on the separate DISCLOSED EXPOSURE
   BUDGET (F8-PS-09) where F8-Q9's trim order applies (F12-Q7 refinement, user-approved 2026-09-22 — option (A); amends the F8-Q7 interpretation
   with provenance; rationale: matches the user's original "custom agent
   prompt… 500 tokens each" wording; prevents chronic skill starvation).
   The re-injection set is REQUIRED content and never trimmed (the F11-Q7
   required-bodies exemption applies). Over-budget runs hit F8-Q9 trim/park
   rules. (F12-Q3 Agreed 2026-09-22; Q28.)

### 2.4 Archive→durable boundary (F12-Q4 + F11-DM-08 sibling, RATIFIED)

- F12-WC-04 — ARCHIVE→DURABLE BOUNDARY: session archiving NEVER feeds
  durable memory automatically — archives are recall sources only; durable
  promotion happens ONLY through F11's staged admission (with source link)
  or user direct writes. (F12-Q4 Agreed 2026-09-22; Q9; F11-DM-08 sibling.)

### 2.5 ctx_* surfaces (F12-Q5 + Q29 + F10 composition)

- F12-WC-05 — ctx_* SURFACES: Q29 manual escapes (/compact, /ctx-*) always
  available to the user. Per-seat surfaces mirror the F10 pattern: Seeker
   full archive retrieval; Writer scoped (its TASK-ID-scoped archive +
   shared lookups — the Writer's task-scoped archive follows the TASK ID,
   not the session ID: F5 rollover and reuse keep the same task's archive
   accessible); Dispatcher/Expert LIST-ONLY (titles + timestamps +
  BOUNDED snippets per the F10-Q10 discipline). (F12-Q5 Agreed 2026-09-22;
  Q29.)

### 2.6 Print/headless (F12-Q6 + Q30)

- F12-WC-06 — PRINT/HEADLESS: interactive-only v1 (OMP out of scope); ZERO
  sidecars in ANY non-interactive invocation (headless --print children AND
  print-inside-interactive) — no archive writes, no historian, no
   retrieval sidecars; native compaction follows the host default inline;
   the interactive session's own archive continues independently. F1's
   delegation-envelope evidence return is the DECLARED SOLE CHANNEL for
   headless children's work (zero sidecars implies it; now stated
   explicitly). (F12-Q6 Agreed 2026-09-22; Q30; F12-Q9 Agreed 2026-09-22.)

### 2.7 Recorded safety facts (absorbed with provenance)

- F12-WC-07 — RECORDED SAFETY FACTS: summarization is cancellable;
  overflow triggers retry; tool results carry a cap (the 2000-char figure
  on record — probe-verified before build); archiver correctness params
  firstKeptEntryId/tokensBefore are probe-verified at build; Pi min-version
  drift (>=0.71 vs >=0.74) and token defaults live-verify at install; the
  gpt-5.6 alias is distrusted until the live picker pins. ABSORBED SETTLED
  DIRECTION — provenance: research + grilling record; the package files
  previously lacked them (noted here and in sections 5–6 and
  `../DECISIONS.md`). (Absorbed; probe/install verification per fact.)

### 2.8 Boundary + invariance and spec-only status

- F12-WC-08 — BOUNDARY + INVARIANCE: the durable record is F11's; the
  working set + session-history retrieval are F12's; F1–F11 requirements
  stand unchanged; every block is a SPEC requirement with enforcement
  unverified until probes decide. (F1–F11 invariance; spec-only status.)

### 2.9 Archive retention (F12-Q8)

- F12-WC-09 — ARCHIVE RETENTION: no auto-deletion of session archives
  EVER; task close and session roll never purge (archives are recall
  sources and review evidence); purge is an explicit USER-ONLY
  disposition; only truly disposable diagnostics follow F5-Q5's
  configurable limits. (F12-Q8 Agreed 2026-09-22; F5-Q5 composition.)

### 2.10 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC
requires it to block; nothing here claims the runtime implements it —
enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Never-dual-compress: single compressor owner (F12-WC-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks the second summarizer from running |
| No-implicit-promotion: archive→durable bar (F12-WC-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks session archives from entering the durable vault without F11 admission |
| Zero-sidecar print/headless rule (F12-WC-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks archive/historian/retrieval sidecars in non-interactive invocations |
| Bounded-snippet list-only surfaces for Dispatcher/Expert (F12-WC-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks full-archive reads outside the scoped seats |
| Re-injection set capped by the F8-Q7 prompt-core budget; over-budget runs cannot silently exceed; per-item cost attribution recorded (F12-WC-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent prompt growth past the prompt-core cap |
| Recorded selection-gate rule: no pin before the user sees the probe result (F12-WC-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks implementation-path lock-in without user review |
| Compressor-ownership records (F12-WC-01) | Detective | surfaces which compressor ran after the fact |
| Promotion-attempt records from archives (F12-WC-04) | Detective | surfaces blocked or attempted archive→vault promotions after the fact |
| Re-injection budget accounting (F12-WC-03) | Detective | surfaces per-turn re-injection cost after the fact |
| Print-mode sidecar absence checks (F12-WC-06) | Detective | surfaces any sidecar a non-interactive run left behind |
| Atomic archive pass: bound breach discards cleanly and parks for retry (F12-WC-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks partial archive entries and silent truncation |
| Archive retention: no auto-deletion; user-only purge (F12-WC-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks close/roll purges and silent archive deletion |
| Sole headless channel: delegation-envelope evidence return (F12-WC-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks sidecar evidence paths for headless work |
| Per-item re-injection cost attribution (F12-WC-03) | Detective | surfaces per-item spend to prove F8-Q7 prompt-core compliance |
| Probe matrix records (F12-WC-01/07) | Detective | surfaces path-(a)/(b) evidence and correctness-param proof |
| Archive-quality assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F12-Q1–F12-Q9 govern where they conflict with earlier readings inside
this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11 stand where this spec does
not narrow them. C2. No re-deciding anything settled — Q1–Q51,
F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9,
F10Q1–F10Q10, F11Q1–F11Q10 stand; this spec cross-references, never
re-decides. C3. NEVER dual-compress (non-negotiable) — one compressor
owner; both summarizing is refused. C4. No implicit promotion from session
history to durable memory — archives are recall sources only. C5. Zero
sidecars in non-interactive invocations — headless --print children and
print-inside-interactive alike. C6. No invented mechanisms, APIs, token
budgets, paths, or shapes — shapes only, section 7. C7. Absorbed facts
carry provenance labels wherever they appear. C8. The recorded
selection-gate rule holds — no implementation-path pin before the user sees
the probe result. C9. Spec-only status: every block is a SPEC requirement
with enforcement unverified until probes decide. C10. Controls are classed
preventive, detective, or advisory by actual function (section 2.10);
SPEC-required blocking is not proven implementation. C11. All scenarios
FUTURE — not executed; no tests run. C12. Documentation only — no
implementation, installs, code, config, commits, or pushes. C13. Band-review
corrections (2026-09-23, additive only): prompt-core budget binding per
F12-Q7 option (A); no-auto-deletion retention per F12-Q8; envelope sole
channel per F12-Q9; atomic pass, required-set-never-trimmed, task-ID
scoping, path-(a) bar, atomic lock release with ownership re-verify,
path-switch migration, per-item cost attribution.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial working-context consistency; this
file owns ID/label consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P12-01 (F12-WC-01). Input: compaction triggers with both summarizers
  armed / Observe: compressor-ownership check runs / Pass: exactly one
  compressor summarizes; the dual-summary attempt is refused. FUTURE.
- P12-02 (F12-WC-01). Input: build phase reaches implementation-path
  selection / Observe: probe scheduling runs / Pass: path (a)
  disable-historian + native compaction probes FIRST; path (b) runs only
  if (a) fails its cleanliness bar. FUTURE.
- P12-03 (F12-WC-01). Input: probe completes with a winning path /
  Observe: selection-gate check runs / Pass: nothing pins until the probe
  result returns to the user; the user's word gates the pin. FUTURE.
- P12-04 (F12-WC-01). Input: path (a) probe — historian disabled, native
  compaction on / Observe: no-op cleanliness probe runs / Pass: no
  double-compress and no data loss recorded. FUTURE.
- P12-05 (F12-WC-01). Input: path (b) probe — session_before_compact
  custom archiver / Observe: archiver-correctness probe runs / Pass:
  firstKeptEntryId/tokensBefore exactness verified. FUTURE.
- P12-06 (F12-WC-02). Input: archive/retrieval pass dispatched / Observe:
  model-tier check runs / Pass: the pass runs at Seeker tier (Luna at work
  / Muse Spark on Go) with per-pass cost bound + rate bound enforced.
  FUTURE.
- P12-07 (F12-WC-03). Input: any turn assembles its prompt / Observe:
  re-injection check runs / Pass: exactly the three items ride — thin
  always-on layer, per-seat hard-rule summaries, living-spec pointer; no
  full seat prompt, no full spec, skills on-demand only. FUTURE.
- P12-08 (F12-WC-03). Input: re-injected set assembles within budget /
  Observe: budget accounting runs / Pass: the set counts inside the F8-Q7
  prompt-core budget (F12-Q7 refinement) (≤500 target / 1000 hard cap). FUTURE.
- P12-09 (F12-WC-03). Input: re-injected set would exceed the F8-Q7 hard
  cap / Observe: trim/park handling runs / Pass: F8-Q9 trim/park rules
  fire; nothing silently exceeds. FUTURE.
- P12-10 (F12-WC-04). Input: session archive write proposes durable
  promotion / Observe: promotion-path check runs / Pass: blocked — the
  archive stays a recall source; promotion requires F11 staged admission
  with a source link or a user direct write. FUTURE.
- P12-11 (F12-WC-04). Input: user direct-writes archive content to the
  durable vault / Observe: user-path check runs / Pass: allowed at any
  time with no gate between the user and the vault. FUTURE.
- P12-12 (F12-WC-05). Input: user invokes /compact or /ctx-* / Observe:
  escape check runs / Pass: the manual escape is always available to the
  user. FUTURE.
- P12-13 (F12-WC-05). Input: Seeker requests archive retrieval / Observe:
  surface check runs / Pass: full archive retrieval served. FUTURE.
- P12-14 (F12-WC-05). Input: Writer requests archive retrieval / Observe:
  surface check runs / Pass: scoped service only — its own task's session
  archive plus shared lookups; nothing wider. FUTURE.
- P12-15 (F12-WC-05). Input: Dispatcher or Expert requests archive
  retrieval / Observe: surface check runs / Pass: LIST-ONLY — titles +
  timestamps + BOUNDED snippets per the F10-Q10 discipline; no full reads.
  FUTURE.
- P12-16 (F12-WC-06). Input: headless --print child invoked / Observe:
  sidecar check runs / Pass: no archive writes, no historian, no retrieval
  sidecars; native compaction follows the host default inline. FUTURE.
- P12-17 (F12-WC-06). Input: print invoked inside an interactive session /
  Observe: sidecar check runs / Pass: zero sidecars from the print call;
  the interactive session's own archive continues independently. FUTURE.
- P12-18 (F12-WC-07). Input: summarization runs long / Observe:
  cancellation check runs / Pass: summarization cancels on demand. FUTURE.
- P12-19 (F12-WC-07). Input: context overflow mid-session / Observe:
  overflow handling runs / Pass: retry triggers per the recorded fact.
  FUTURE.
- P12-20 (F12-WC-07). Input: tool result exceeds the recorded cap /
  Observe: cap check runs / Pass: the 2000-char figure holds (probe
  verification pending at build). FUTURE.
- P12-21 (F12-WC-08). Input: working-context change candidate touching
  seat, permission, retrieval, or memory behavior / Observe: invariance
  check runs / Pass: F1–F11 requirements read unchanged; the change
  narrows to this feature or parks. FUTURE.
- P12-22 (F12-WC-03). Input: any turn assembles its prompt with skill
  bodies loaded / Observe: budget-binding check runs / Pass: the
  ≤500/1000 binds the PROMPT CORE ONLY (seat instructions + thin
  always-on layer + three-item set); skill bodies land on the disclosed
  exposure budget; the re-injection set never trims (F11-Q7 exemption).
  FUTURE.
- P12-23 (F12-WC-02). Input: archive pass breaches its cost/rate bound /
  Observe: failure handling runs / Pass: the pass discards CLEANLY with no
  partial archive entry persisting, and parks for bounded retry under F5's
  infrastructure allowance; never silent truncation. FUTURE.
- P12-24 (F12-WC-05). Input: F5 rollover or session reuse on the same task
  / Observe: archive-scope check runs / Pass: the Writer's archive follows
  the TASK ID — the same task's archive stays accessible across
  rollover/reuse. FUTURE.
- P12-25 (F12-WC-01). Input: path-(a) probe with Magic Context writes
  attempted / Observe: ownership-confinement bar runs / Pass: Magic's
  own-store writes pass; any working-set or transcript write FAILS the
  bar; no data loss, no dual summarization. FUTURE.
- P12-26 (F12-WC-01). Input: cancellation/timeout lands mid-compaction /
  Observe: lock handling runs / Pass: the single-owner lock releases ONLY
  after the in-flight pass aborts or completes (atomic release, recorded);
  the retry re-verifies compressor ownership before summarizing. FUTURE.
- P12-27 (F12-WC-01). Input: path (a)→(b) switch proposed mid-life /
  Observe: migration handling runs / Pass: treated as a MIGRATION EVENT —
  the user sees the F11-DM-09 dry-run diff before apply. FUTURE.
- P12-28 (F12-WC-06). Input: headless child completes work / Observe:
  evidence-return check runs / Pass: the work returns SOLELY through the
  F1 delegation-envelope evidence contract; no sidecar channel carries it.
  FUTURE.
- P12-29 (F12-WC-09). Input: task close and session roll under storage
  pressure / Observe: retention check runs / Pass: no archive
  auto-deletes; purge occurs ONLY as an explicit user disposition; only
  disposable diagnostics follow F5-Q5 limits. FUTURE.
- P12-30 (F12-WC-03). Input: any turn assembles the re-injection set /
  Observe: cost-attribution check runs / Pass: PER-ITEM re-injection cost
  attribution is recorded, proving F8-Q7 prompt-core compliance. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F12 source | Stage A / F1–F11 relation |
|---|---|---|
| F12-WC-01 single compressor owner; native owns working set, Magic Context owns archive/retrieval; never both summarizing (non-negotiable); path (a) then (b) probe with recorded selection gate; probe result to user before pin; must-follow re-injection per F12-WC-03; path-(a) bar, atomic lock release + ownership re-verify, path-switch migration (2026-09-23 compositions) | Q28; F12-Q1 Agreed 2026-09-22 | Q28 hybrid direction; double-compress hazard on record |
| F12-WC-02 Seeker-tier archive/retrieval pass (Luna at work / Muse Spark on Go); per-pass cost + rate bounds; atomic pass (breach discards cleanly, parks for bounded F5 retry); F7↔F12 composition named in section 7 | F12-Q2 Agreed 2026-09-22 | F7 composition; same composition as the F11 verifier (F11-Q7) |
| F12-WC-03 three-item every-turn re-injection (always-on layer; per-seat hard-rule summaries; living-spec pointer); skills on-demand; full specs never re-inject; cost inside F8-Q7 prompt-core budget (F12-Q7 refinement: skill bodies on exposure budget; set never trimmed per F11-Q7); per-item cost attribution in section 7; over-budget hits F8-Q9 trim/park | F12-Q3 Agreed 2026-09-22; Q28; F12-Q7 Agreed 2026-09-22 | F9-Q2 AGENTS.md block; F3 living-spec pointer; F8 skills on-demand + F8-Q7 budget + F8-Q9 trim/park |
| F12-WC-04 session archives never auto-feed durable memory; durable promotion only via F11 staged admission (source link) or user direct writes — RATIFIED | F12-Q4 Agreed 2026-09-22; Q9 | Q9 session/durable separation; F11-DM-08 sibling |
| F12-WC-05 manual /compact + /ctx-* escapes always available; per-seat surfaces mirror F10 (Seeker full; Writer task-ID-scoped; Dispatcher/Expert list-only with bounded snippets per F10-Q10) | F12-Q5 Agreed 2026-09-22; Q29 | Q29 manual escapes; F10 pattern + F10-Q10 snippet discipline |
| F12-WC-06 interactive-only v1; zero sidecars in any non-interactive invocation (headless --print children and print-inside-interactive); envelope evidence return is the DECLARED SOLE headless channel (F12-Q9); native compaction follows host default inline; interactive archive continues independently | F12-Q6 Agreed 2026-09-22; Q30; F12-Q9 Agreed 2026-09-22 | Q30 interactive-only + headless --print without historian |
| F12-WC-07 recorded safety facts (cancellable summarization; overflow retry; 2000-char tool-result cap probe-verified before build; firstKeptEntryId/tokensBefore probe-verified at build; Pi min-version drift and token defaults live-verify at install; gpt-5.6 alias distrusted until live picker pins) — ABSORBED, previously absent from package files | Absorbed settled direction (research + grilling record); F12 design Agreed 2026-09-22 | F7 gpt-5.6 alias distrust; install-time verification compositions |
| F12-WC-08 durable record is F11's; working set + session-history retrieval are F12's; F1–F11 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP; F8-PS; F9-BS; F10-WR; F11-DM; section 7 probes |
| F12-WC-09 no auto-deletion of session archives EVER; close/roll never purge; user-only purge; disposable diagnostics under F5-Q5 limits | F12-Q8 Agreed 2026-09-22 | F5-Q5 configurable limits; Q9 session/durable separation |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (Q28; F12-Q1 Agreed 2026-09-22; F12-WC-01) One compressor owns the
   working set at a time: native Pi compacts, Magic Context archives and
   retrieves, and both never summarize together — with the build-phase
   probe trying disable-historian-plus-native-compaction first and the
   session_before_compact custom archiver only as fallback, and with the
   probe result shown to the user before any path pins; the path-(a) bar
   (ownership confinement, no data loss, no dual summarization), atomic
   lock release with ownership re-verify, and path-switch migration
   (F11-DM-09 dry-run diff) ride with it.
2. (F12-Q2 Agreed 2026-09-22; F12-WC-02) Archive and retrieval passes run
   at Seeker tier — Luna at work, Muse Spark on Go, the same composition
   as the F11 verifier — with a per-pass cost bound and a rate bound set
   beside it; a bound breach discards the pass cleanly with no partial
   entry and parks for bounded F5 retry (never silent truncation).
3. (F12-Q3 Agreed 2026-09-22; Q28; F12-WC-03) Every turn carries exactly
   three must-follow items — the thin always-on layer, each seat's
   few-line hard-rule summary, and the living-spec pointer — while skills
   stay on-demand and full specs never re-inject; the set spends from
   inside the F8-Q7 prompt-core budget (F12-Q7 refinement option (A): skill
   bodies on the disclosed exposure budget) and never trims (F11-Q7
   exemption); over-budget runs take the
   F8-Q9 trim-or-park path, with per-item cost attribution recorded.
4. (F12-Q4 Agreed 2026-09-22; Q9; F11-DM-08 sibling; F12-WC-04) Session
   archives never promote themselves into durable memory: they serve
   recall only, and anything durable arrives through F11 staged admission
   with its source link or by the user's own direct write.
5. (F12-Q5 Agreed 2026-09-22; Q29; F12-WC-05) The user keeps manual
   /compact and /ctx-* escapes at all times; seats see archives through
   the F10 mirror — Seeker in full, Writer scoped to its task-ID archive
   (follows the TASK ID across F5 rollover/reuse) plus shared lookups,
   Dispatcher and Expert list-only
   with titles, timestamps, and bounded snippets.
6. (F12-Q6 Agreed 2026-09-22; Q30; F12-WC-06) Version one is
   interactive-only: headless --print children and print-inside-interactive
   alike write no archive, run no historian, and leave no retrieval
   sidecars; headless children's work returns solely through F1's
   delegation-envelope evidence contract (F12-Q9); native compaction follows the host default inline, and the
   interactive session's own archive carries on independently.
7. (Absorbed settled direction — research + grilling record, previously
   absent from the package files; F12-WC-07) The recorded safety facts
   ride with provenance: cancellable summarization, retry on overflow, the
   2000-char tool-result cap awaiting probe proof, archiver correctness
   params firstKeptEntryId/tokensBefore pinned by the build probe, Pi
   min-version drift and token defaults settled by live install checks,
   and the gpt-5.6 alias distrusted until the live picker pins.
8. (Derived; F12-WC-08) F1–F11 rules do not move for working-context work:
   the durable record stays F11's, the working set and session-history
   retrieval are F12's, and every block here is a spec requirement
   awaiting probe proof.
9. (F12-Q8 Agreed 2026-09-22; F12-WC-09) Session archives never
   auto-delete: task close and session roll never purge — archives serve
   recall and review evidence; only the user purges by explicit
   disposition, and only truly disposable diagnostics follow F5-Q5's
   configurable limits.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Implementation-path selection-gate shape: probe procedure + preference
   (a) then (b) + the user-facing result format (F12-WC-01; F12-Q1) —
   shapes only, no mechanics invented here.
2. Archiver invocation + cost/rate bound shapes: the F7 composition item —
   invocation form, bound values, accounting mechanics (F12-WC-02; F12-Q2)
   — shapes only, no values invented here.
3. Re-injection set format + budget accounting mechanics: item encodings,
   per-turn assembly, inside-budget spend tracking, F8-Q9 trim/park
   wiring (F12-WC-03; F12-Q3) — shapes only, no mechanics invented here.
4. Archive record + retrieval index shapes: archive write format, index
   form, recall resolution (F12-WC-02/05) — shapes only, no schemas
   invented here.
5. ctx_* surface table + snippet bound: per-seat surface matrix and the
   exact snippet length, shared with the F10-Q10 pin (F12-WC-05; F12-Q5)
   — shapes only, no values invented here.
6. Print-mode zero-sidecar enforcement mechanics: how non-interactive
   invocations prove sidecar absence (F12-WC-06; F12-Q6) — shape only, no
   mechanics invented here.
7. Archive-pass atomic-failure shape: bound-breach discard + park wiring
   (F12-WC-02; F12-Q2) — shape only, no mechanics invented here.
8. Per-item re-injection cost-attribution shape: per-item spend records
   proving F8-Q7 prompt-core compliance (F12-WC-03; F12-Q7) — shape only,
   no mechanics invented here.

Path-(a) probe pass criteria (STATED per composition 4): ownership
confinement (Magic Context writes its own archive/retrieval store only —
any working-set or transcript write fails the bar), no data loss, no dual
summarization.

Implementation probes (runtime evidence before build claims):

1. Path-(a) no-op cleanliness probe: historian disabled + native
   compaction on = no double-compress, no data loss.
2. Path-(b) archiver correctness probe: firstKeptEntryId/tokensBefore
   exactness.
3. Never-dual-compress proof: adversarial dual-summary attempt refused.
4. No-implicit-promotion proof: archive write attempt to the durable vault
   blocks without F11 admission.
5. Re-injection budget compliance proof: per-turn set spends inside the
   F8-Q7 budget; over-budget run takes the F8-Q9 path.
6. Zero-sidecar print proof: print invocation writes no
   archive/historian/retrieval sidecar.
7. ctx_* per-seat surface proof: Seeker full, Writer scoped,
   Dispatcher/Expert list-only with bounded snippets.
8. Cancellable-summarization proof.
9. Overflow-retry proof.
10. Tool-result-cap proof.
11. Empirical proof that the chosen implementation path, archiver wiring,
    re-injection set, surfaces, and print rule enforce sections 2–3;
    probes and pilot decide.
12. Path-(a) bar proof: Magic own-store writes pass; working-set/transcript
    writes fail; no data loss, no dual summarization.
13. Atomic-pass + lock-release proof: bound breach discards cleanly with no
    partial entry and parks for bounded retry; the lock releases only after
    abort/complete; the retry re-verifies ownership.
14. Retention + sole-channel + migration proof: close/roll under pressure
    deletes no archive (purge only by user disposition); headless work
    returns only via envelope evidence; a path switch shows the dry-run
    diff before apply.

Evidence limitations carried from Stage A:

1. Both implementation paths are UNVERIFIED at runtime — the probe
   decides; path (a) clean no-op is UNVERIFIED.
2. Magic Context archive-only is NOT a supported native mode — custom
   adaptation required.
3. The double-compress hazard is on record.
4. Vendor version claims (0.71 vs 0.74) conflict and live-verify at
   install.
5. Safety facts (cancellable/overflow/caps) are research-recorded claims
   pending probe proof.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11
  digests and the F12 digest (this feature's authority where they differ;
  the absorbed-direction provenance notes recorded).
- `../PRD.md` — Stage A frame; working-context scope cross-referenced here
  (no re-decision here).
- `../MANIFEST.md` — candidate-backend classes; implementation paths stay
  candidates here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; both paths plus safety
  facts stay open there.
- `README.md` — Stage B index; this is feature 12 of 13.
