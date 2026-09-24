# Feature F13 — Validation harness (Dispatch)

Status: user-approved 2026-09-23 (F13-Q1..Q7, Q1 a USER OVERRIDE both OS CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break); independently reviewed; band-review corrections applied (CONCERNS 2/3 → 7 fixes + refinement → re-check READY); runtime unverified; all scenarios FUTURE. 13/13 feature specs approved — the PRIMARY SPEC is DEFERRED pending the user's later-list notes (which may add feature specs). Requirements F13-VH-01 … F13-VH-12 approved as corrected 2026-09-23. No implementation, installs, code, commits, or pushes. Thirteenth and LAST Stage B feature spec. All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled F13-Q1–F13-Q7 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12 requirements stand untouched.

## 0. Objective

Define the v1 validation harness and its policy shell: a BOTH-OS CI lane in
v1 (Windows plus macOS — F13-Q1 USER OVERRIDE of the recommendation; the
harness's macOS lane is a v1 build requirement since the pinned harness has
none on record), a requirement-complete coverage rule (every requirement ID
across F1–F12 maps to ≥1 executable suite item; every preventive control
maps to its full adversarial scenario; remaining P-series items stand as the
documented acceptance matrix — traceable, not automated), the S-suite as the
named failure-path suite with per-scenario setup/action/assertion (drafted
from the tgo-uz53 record, then reviewed), a pilot entry gate (all-green +
explicit user approval + verbatim sign-off at ONE checkpoint), a pilot exit
bar (user sign-off on evidence + the objective floor — all watched metrics
recorded over the pilot window, zero unexplained rollbacks, strings behave
as signed-off; NO invented numeric thresholds in v1), record-only
instrumentation for the F7 falsifier metric (implementer tier vs first-pass
review-pass rate, plan-shaped vs judgment-heavy class split) and the BQ4
resume-hit rate, rollback automation (harness-only flip + grant revocation +
ledger preservation + reproduced-green re-entry per PRD:306-308), a
verify-then-admit gaodes fallback (commit/scope pinned at spec phase;
provenance failure drops the fallback), a spec-phase harness re-pin (0.74
floor vs live 0.84 — exact version + SHA + drift disclosure), and a
counters-and-logs-only instrumentation rule (instrumentation never gates) —
with every block a SPEC requirement whose enforcement is unverified until
probes decide: recording coverage facts with provenance, absorbing the
absorbed settled directions with provenance labels, and leaving every
procedure text, string draft, table row, bound value, and enforcement
mechanism to section 7.

Stable requirement IDs `F13-VH-01` … `F13-VH-12`. Sources trace to settled
F13-Q1–F13-Q5 (all Agreed 2026-09-23, Q1 a USER OVERRIDE) plus Q2, Q14, Q20,
BQ4, the F7 falsifier boundary, and the tgo-uz53 validation record (PRD
section 6 source); mappings are multi-source where a rule draws on more than
one source — no one-to-one fiction. Section 5 holds the trace table;
section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (harness lanes, coverage rule, S-suite, pilot gates,
counters, rollback, fallback admission, re-pin, acceptance only):

1. Both-OS CI lane: Windows plus macOS green in v1 (F13-Q1 override).
2. Requirement-complete coverage rule: every F1–F12 requirement ID maps to
   ≥1 executable suite item; every preventive control maps to its full
   adversarial scenario; the remaining P-series stands as the documented
   acceptance matrix (traceable, not automated).
3. S-suite: the named failure-path suite (S1 interrupted … S11 zero-web;
   S9a/b/c identity/permission/completed) with per-scenario
   setup/action/assertion procedure drafts (section 7).
4. Pilot entry gate: all-green + explicit user approval + verbatim sign-off
   at ONE checkpoint (F13-Q3).
5. Pilot exit bar: user sign-off on evidence + the objective floor, no
   numeric thresholds (F13-Q4).
6. Record-only falsifier counters: implementer tier vs first-pass
   review-pass rate with the plan-shaped vs judgment-heavy class split
   (F13-Q5); BQ4 resume-hit-rate instrumentation.
7. Rollback automation: harness-only flip + grant revocation + ledger
   preservation + reproduced-green re-entry (PRD:306-308).
8. gaodes fallback verify-then-admit: commit/scope pinned at spec phase;
   provenance failure drops the fallback.
9. Harness re-pin at spec phase: exact version + SHA + drift disclosure
   (0.74 floor vs live 0.84).
10. Verbatim-string sign-off gates: spec review + pre-pilot; strings must
    match the signed-off text at both gates.
11. Control classification of the above by actual function.
12. Closed-loop budget, question map, and user-notes/delta record
    (section 8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat responsibilities, review packets, repair budgets, ceilings — F1
   owns; here only the closed-loop budget composition holds.
2. Model assignment and quota disclosure — F7 owns; here only the
   falsifier-counter composition holds (record-only, no binding rule).
3. Session resume and recovery — F5 owns; here only the resume-hit-rate
   instrumentation composition holds.
4. Spec store, approval gates, deviation handling — F3 owns; here only the
   spec-review sign-off gate composition holds.
5. Permission grants and revocation mechanics — F2 owns; here only the
   rollback grant-revocation composition holds.
6. Exact procedure texts, string drafts, table rows, counter schemas, lane
   configs, pin values, and gate enforcement mechanics — downstream
   engineering owns, never chosen here.

Not in this feature:

1. Any implementation, install, configuration, commit, or push —
   documentation only; nothing runs.
2. Exact scenario scripts, refusal/disclosure string wording, metric
   thresholds, lane YAML, pin SHAs, or enforcement mechanics — all
   downstream (section 7).
3. Any claim that a lane is green, the S-suite passes, or sections 2–3 are
   enforced at runtime. Proof is future work.
4. The integrated primary spec. Thirteen specs drafted; integration
   follows.

## 2. Interfaces

### 2.1 Both-OS CI lane (Q14 + F13-Q1 USER OVERRIDE)

- F13-VH-01 — BOTH-OS CI LANE IN v1: the harness runs a Windows lane AND a
  macOS lane, and BOTH must green before pilot entry. F13-Q1 is a USER
  OVERRIDE of the recommendation (macOS-later): the macOS lane ships IN v1
  as a build requirement, because the pinned harness
  (@marcfargas/pi-test-harness 0.6.1) has no macOS CI lane on record
  (EVIDENCE.md:26; open item EVIDENCE.md:135). A missing or red macOS lane
  blocks pilot entry exactly as a missing or red Windows lane does.
  (Q14; F13-Q1 USER OVERRIDE Agreed 2026-09-23.)

### 2.2 Requirement-complete coverage rule (F13-Q2)

- F13-VH-02 — REQUIREMENT-COMPLETE COVERAGE: every requirement ID across
  F1–F12 maps to ≥1 executable suite item; every preventive control maps to
  its FULL adversarial scenario (a preventive control with no adversarial
  scenario is a coverage violation and blocks). Remaining P-series scenarios
  that the suite cannot execute stand as the DOCUMENTED ACCEPTANCE MATRIX —
  traceable row-by-row to requirement IDs, but NOT claimed as automated.
  The coverage-mapping table (requirement ID → suite item or
  acceptance-matrix row) is a section 7 engineering shape. (F13-Q2 Agreed
  2026-09-23.)

### 2.3 S-suite failure-path suite (Q20 + tgo-uz53)

- F13-VH-03 — S-SUITE: the named failure-path suite carries the 13 coverage
  names from the tgo-uz53 record (PRD:298-302): S1 interrupted sessions; S2
  stale memories; S3 denied tools; S4 model unavailable; S5 conflicting
  instructions; S6 failed verification; S7 bootstrap idempotence; S8
  compressor single-owner; S9a reuse-gate identity; S9b reuse-gate
  permission; S9c reuse-gate completed; S10 spec drift; S11 zero-web
  disclosure. Each scenario ships a per-scenario setup/action/assertion
  procedure draft (section 7), drafted from the tgo-uz53 record, then
  REVIEWED — the drafts are review targets, never self-certifying. S-suite
  green on BOTH lanes is required for pilot entry. (Q20; F13-Q2
  composition; tgo-uz53 record.)

### 2.4 Pilot entry gate (F13-Q3)

- F13-VH-04 — PILOT ENTRY GATE: the supervised pilot starts ONLY at ONE
  checkpoint where THREE conditions hold together — (1) all-green on both
  OS lanes (S-suite plus coverage-rule executable items), (2) EXPLICIT user
  approval to start the pilot, (3) verbatim sign-off on the refusal and
  disclosure strings. Entry without any one of the three is BLOCKED; a
  partial gate (green without approval, approval without green, either
  without sign-off) never starts the pilot. (F13-Q3 Agreed 2026-09-23;
  Q20 synthetic-then-pilot order.)

### 2.5 Pilot exit bar (F13-Q4)

- F13-VH-05 — PILOT EXIT BAR: the pilot exits ONLY on user sign-off over
  the pilot evidence PLUS the objective floor — all watched metrics
  recorded over the pilot window (PRD:303-305: refusal samples with reason
  codes, resume decisions, compaction contests, verifier fails,
  unavailability episodes, web-fallback disclosures, repeat-call canary),
  ZERO unexplained rollbacks, and strings behaving as signed-off. NO
  invented numeric thresholds in v1: the floor is stated as recorded-vs-
  missing, explained-vs-unexplained, as-signed-off-vs-deviated — never as
  invented pass percentages, latency bounds, or sample counts. Exit without
  user sign-off is BLOCKED even when the floor holds. (F13-Q4 Agreed
  2026-09-23.)

### 2.6 Record-only falsifier counters (F13-Q5 + F7)

- F13-VH-06 — REVIEW-PASS-RATE RECORD-ONLY: the pilot instruments the F7
  falsifier metric — implementer-model tier vs first-pass review-pass rate,
  measured SEPARATELY for plan-shaped/mechanical and judgment-heavy task
  classes per the Fusion falsifier boundary — as class-split counters plus
  logs. RECORD-ONLY in v1: the counters NEVER gate pilot exit, rollback, or
  re-entry; any future binding threshold is a v2 candidate requiring its
  own user decision. Counter and log shapes are section 7. (F13-Q5 Agreed
  2026-09-23; F7-MP-12 boundary.)

### 2.7 Resume-hit-rate instrumentation (BQ4)

- F13-VH-07 — RESUME-HIT-RATE: the pilot measures the F5-DS-01 resume-hit
  rate per BQ4 (Agreed 2026-09-21) — counters plus logs, record-only like
  F13-VH-06, never a gate. Near-zero keeps resume for v1 with
  always-fresh dispatch as a v2 simplification candidate (BQ4 direction
  quoted, not re-decided). (BQ4; F5-DS-01 composition.)

### 2.8 Rollback and re-entry (PRD:306-308)

- F13-VH-08 — ROLLBACK + RE-ENTRY: rollback flips to HARNESS-ONLY mode,
  REVOKES grants, and PRESERVES ledgers (PRD:306-307). Rollback automation
  covers the flip, the revocation (F2 composition), and ledger preservation
  (side-effect ledger per the audit inventory); automation shapes are
  section 7. RE-ENTRY requires the failing scenario REPRODUCED GREEN
  (PRD:308) — re-entry without reproduced-green is BLOCKED. Rollback and
  re-entry consume no review budget and reset none (section 8). (PRD:306-308;
  F13-Q4 composition — an unexplained rollback fails the exit floor.)

### 2.9 gaodes fallback verify-then-admit (MANIFEST + tgo-uz53)

- F13-VH-09 — GAODES FALLBACK ADMISSION: the @gaodes fork stays
  FALLBACK-ONLY (MANIFEST.md:51-53; EVIDENCE.md:26). Verify-then-admit: the
  fallback's exact commit/scope pins at SPEC PHASE; provenance failure
  (unverifiable commit, scope beyond the pin, or unreachable source) DROPS
  the fallback — the harness runs primary-only, never on an unverified
  fallback. The pin record shape is section 7. (MANIFEST extension pick;
  tgo-uz53 record.)

### 2.10 Harness re-pin at spec phase (EVIDENCE.md:73-74)

- F13-VH-10 — HARNESS RE-PIN: the 0.6.1 pin LAGS live Pi — the harness peer
  floor (pi >= 0.74.0) vs live Pi 0.84.x (EVIDENCE.md:73-74). At SPEC
  PHASE the harness re-pins: exact version + SHA + drift disclosure (what
  moved between the 0.6.1 record and the re-pin, and what the drift means
  for S-suite coverage). No silent drift: undisclosed drift is a coverage
  violation under F13-VH-02. (EVIDENCE.md:73-74; F6-PD-10 re-pin
  composition.)

### 2.11 Verbatim-string sign-off gates (PRD:309-310)

- F13-VH-11 — VERBATIM-STRING GATES: refusal and disclosure verbatim
  strings get sign-off at SPEC REVIEW plus the PRE-PILOT gate (PRD:309-310;
  open item EVIDENCE.md:133-134). At BOTH gates the runtime strings must
  MATCH the signed-off text — a mismatch blocks (pilot entry at the
  pre-pilot gate; acceptance at spec review). String drafts for both gates
  are section 7 shapes; wording is chosen there, never here. (PRD:309-310;
  F13-Q3 composition.)

### 2.12 Boundary + counters-only instrumentation

- F13-VH-12 — BOUNDARY + COUNTERS-ONLY: F1–F12 requirements stand
  unchanged; this spec adds lanes, gates, counters, and procedures only.
  INSTRUMENTATION IS COUNTERS AND LOGS ONLY — no counter, log line, or
  metric value gates anything in v1 (F13-Q4/Q5 composition). Every block is
  a SPEC requirement with enforcement unverified until probes decide.
  (F1–F12 invariance; spec-only status.)

### 2.13 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC
requires it to block; nothing here claims the runtime implements it —
enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Both-OS green required for pilot entry (F13-VH-01/04) | Preventive (SPEC requirement, NOT proven implementation) | blocks pilot entry on a missing or red lane on either OS |
| Coverage rule: preventive control with no adversarial scenario blocks (F13-VH-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks acceptance on uncovered preventive controls |
| Pilot entry triple gate: all-green + approval + sign-off (F13-VH-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks pilot start on any missing gate leg |
| Pilot exit bar: no exit without user sign-off (F13-VH-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks pilot exit without user sign-off on evidence |
| Re-entry requires reproduced-green (F13-VH-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks re-entry until the failing scenario reproduces green |
| gaodes provenance failure drops the fallback (F13-VH-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks primary-only drift into an unverified fallback |
| Verbatim mismatch blocks at both gates (F13-VH-11) | Preventive (SPEC requirement, NOT proven implementation) | blocks pilot entry / acceptance on string mismatch |
| Rollback flip + grant revocation + ledger preservation (F13-VH-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks further supervised operation and stale-grant use after rollback |
| Counters and logs: falsifier, resume-hit, watched metrics (F13-VH-05/06/07) | Detective | surfaces pilot evidence after the fact; never gates |
| Coverage-mapping table + acceptance matrix (F13-VH-02) | Detective | surfaces uncovered requirements after the fact |
| Re-pin drift disclosure (F13-VH-10) | Detective | surfaces harness-vs-live-Pi drift after the fact |
| Quality assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F13-Q1–F13-Q5 govern where they conflict with earlier readings inside
this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12 stand where this spec
does not narrow them. C2. No re-deciding anything settled — Q1–Q51,
F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9,
F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9 stand; this spec cross-references,
never re-decides. C3. F13-Q1 is a USER OVERRIDE: both CI lanes ship IN v1
— macOS-later was the recommendation, the user chose both-in-v1. C4. No
numeric thresholds invented for the pilot exit floor — recorded/missing,
explained/unexplained, as-signed-off/deviated only. C5. Counters and logs
never gate in v1. C6. No invented procedures, strings, table rows,
thresholds, lane configs, pin values, or shapes — shapes only, section 7.
C7. Absorbed facts carry provenance labels wherever they appear. C8.
Spec-only status: every block is a SPEC requirement with enforcement
unverified until probes decide. C9. Controls are classed preventive,
detective, or advisory by actual function (section 2.13); SPEC-required
blocking is not proven implementation. C10. All scenarios FUTURE — not
executed; no tests run. C11. Documentation only — no implementation,
installs, code, config, commits, or pushes. C12. IDs stable and additive:
F13-VH-01…12, P13-01…18; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial harness consistency; this file owns
ID/label consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P13-01 (F13-VH-01). Input: both CI lanes run the suite / Observe: lane
  check runs / Pass: Windows AND macOS lanes green — the macOS lane ships
  IN v1 (F13-Q1 override); a missing macOS lane fails. FUTURE.
- P13-02 (F13-VH-02). Input: a preventive control with no adversarial
  scenario reaches acceptance / Observe: coverage-rule check runs / Pass:
  BLOCKED as a coverage violation until the scenario exists. FUTURE.
- P13-03 (F13-VH-03/04). Input: pilot entry proposed with an S-suite red /
  Observe: entry-gate check runs / Pass: BLOCKED — S-suite green on both
  lanes is required for entry. FUTURE.
- P13-04 (F13-VH-04). Input: pilot entry proposed all-green but without
  explicit user approval / Observe: entry-gate check runs / Pass: BLOCKED
  until the user approves. FUTURE.
- P13-05 (F13-VH-04). Input: pilot entry proposed all-green and approved
  but without verbatim sign-off / Observe: entry-gate check runs / Pass:
  BLOCKED until the strings are signed off. FUTURE.
- P13-06 (F13-VH-05). Input: pilot exit proposed with the floor holding but
  without user sign-off on evidence / Observe: exit-bar check runs / Pass:
  BLOCKED until the user signs off. FUTURE.
- P13-07 (F13-VH-05). Input: pilot exit proposed with an unrecorded watched
  metric, an unexplained rollback, or a string deviating from signed-off
  text / Observe: exit-floor check runs / Pass: floor UNMET — exit refused;
  no numeric threshold is consulted. FUTURE.
- P13-08 (F13-VH-06). Input: review-pass-rate counters read low for a task
  class / Observe: gate check runs / Pass: NOTHING gates — the reading
  records only; pilot exit, rollback, and re-entry proceed on their own
  rules. FUTURE.
- P13-09 (F13-VH-08). Input: rollback triggers / Observe: rollback handling
  runs / Pass: flips to harness-only mode, revokes grants, preserves
  ledgers. FUTURE.
- P13-10 (F13-VH-08). Input: re-entry proposed without reproduced-green /
  Observe: re-entry check runs / Pass: BLOCKED until the failing scenario
  reproduces green. FUTURE.
- P13-11 (F13-VH-09). Input: gaodes fallback with unverifiable commit,
  out-of-pin scope, or unreachable source / Observe: admission check runs /
  Pass: the fallback DROPS — harness runs primary-only. FUTURE.
- P13-12 (F13-VH-10). Input: spec phase reaches the harness pin / Observe:
  re-pin check runs / Pass: exact version + SHA recorded with drift from
  the 0.6.1 record disclosed; undisclosed drift fails coverage. FUTURE.
- P13-13 (F13-VH-11). Input: spec-review gate convenes / Observe: string
  check runs / Pass: runtime refusal/disclosure strings MATCH the text
  signed off at spec review; mismatch blocks acceptance. FUTURE.
- P13-14 (F13-VH-11). Input: pre-pilot gate convenes / Observe: string
  check runs / Pass: runtime strings MATCH the text signed off at the
  pre-pilot gate; mismatch blocks pilot entry. FUTURE.
- P13-15 (F13-VH-05). Input: pilot window closes / Observe: watched-metric
  check runs / Pass: all seven watched metrics (PRD:303-305) recorded over
  the window — refusal samples with reason codes, resume decisions,
  compaction contests, verifier fails, unavailability episodes,
  web-fallback disclosures, repeat-call canary. FUTURE.
- P13-16 (F13-VH-06). Input: pilot tasks complete in both classes /
  Observe: falsifier-counter check runs / Pass: class-split counters plus
  logs recorded SEPARATELY for plan-shaped/mechanical and judgment-heavy
  tasks. FUTURE.
- P13-17 (F13-VH-07). Input: pilot resume decisions close / Observe:
  resume-rate check runs / Pass: F5-DS-01 resume-hit rate recorded per BQ4;
  never a gate. FUTURE.
- P13-18 (F13-VH-02). Input: acceptance review convenes / Observe:
  mapping check runs / Pass: every F1–F12 requirement ID traces to ≥1
  executable suite item or an acceptance-matrix row; no orphan IDs.
  FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F13 source | Stage A / F1–F12 relation |
|---|---|---|
| F13-VH-01 both-OS CI lane in v1 (Windows + macOS; macOS lane a v1 build requirement — pinned harness has none on record) — F13-Q1 USER OVERRIDE | F13-Q1 USER OVERRIDE Agreed 2026-09-23; Q14 | Q14 Windows+macOS required; EVIDENCE.md:26 (no macOS lane) + :135 (add downstream) |
| F13-VH-02 requirement-complete coverage rule (every ID → ≥1 executable item; every preventive control → full adversarial scenario; P-series remainder = documented acceptance matrix, traceable not automated) | F13-Q2 Agreed 2026-09-23 | F1–F12 requirement IDs (untouched); F3 acceptance gates |
| F13-VH-03 S-suite with 13 coverage names (S1…S11, S9a/b/c) + per-scenario setup/action/assertion drafts from the tgo-uz53 record, then reviewed; green on both lanes gates pilot entry | Q20; F13-Q2 composition Agreed 2026-09-23 | PRD:298-302 (tgo-uz53 source); Q20 failure-path scenarios required |
| F13-VH-04 pilot entry gate: all-green + explicit user approval + verbatim sign-off at ONE checkpoint | F13-Q3 Agreed 2026-09-23 | Q20 synthetic-then-pilot order; PRD:309-310 sign-off |
| F13-VH-05 pilot exit bar: user sign-off on evidence + objective floor (metrics recorded, zero unexplained rollbacks, strings as signed-off); no numeric thresholds | F13-Q4 Agreed 2026-09-23 | PRD:303-308 pilot metrics + rollback + re-entry |
| F13-VH-06 review-pass-rate record-only (implementer tier vs first-pass review-pass rate; plan-shaped vs judgment-heavy split); binding threshold = v2 candidate | F13-Q5 Agreed 2026-09-23 | F7-MP-12 Fusion falsifier boundary (untouched) |
| F13-VH-07 resume-hit-rate instrumentation (BQ4); record-only, never a gate | BQ4 Agreed 2026-09-21 | F5-DS-01 resume bar (untouched) |
| F13-VH-08 rollback (harness-only flip + grant revocation + ledger preservation) + re-entry (reproduced-green required); budgets unchanged | Derived (PRD:306-308) | F2 grant rules; F1 budgets (untouched); audit ledger inventory |
| F13-VH-09 gaodes fallback verify-then-admit (commit/scope pinned at spec phase; provenance failure drops the fallback) | Derived (MANIFEST + tgo-uz53) | MANIFEST.md:51-53 fallback-only; EVIDENCE.md:26 |
| F13-VH-10 harness re-pin at spec phase (exact version + SHA + drift disclosure; 0.74 floor vs live 0.84) | Derived (EVIDENCE.md:73-74) | F6-PD-10 re-pin composition; EVIDENCE.md:73-74 |
| F13-VH-11 verbatim-string gates (spec review + pre-pilot; match-or-block at both) | Derived (PRD:309-310) | EVIDENCE.md:133-134 open item; F13-Q3 composition |
| F13-VH-12 F1–F12 invariance; instrumentation is counters and logs only, never gates; spec-only status | Derived | F1-AR … F12-WC (untouched); F13-Q4/Q5 composition |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (Q14; F13-Q1 USER OVERRIDE Agreed 2026-09-23; F13-VH-01) BOTH CI lanes
   ship in v1 — Windows and macOS must green before pilot entry; the macOS
   lane is a v1 build requirement because the pinned harness has none on
   record; a missing or red macOS lane blocks exactly like Windows.
2. (F13-Q2 Agreed 2026-09-23; F13-VH-02) Coverage is requirement-complete:
   every requirement ID across F1–F12 maps to at least one executable suite
   item, every preventive control maps to its full adversarial scenario
   (missing coverage blocks), and the un-automatable P-series remainder
   stands as the documented acceptance matrix — traceable, not automated.
3. (Q20; tgo-uz53 record; F13-VH-03) The S-suite names the failure paths —
   S1 interrupted through S11 zero-web with S9a/b/c
   identity/permission/completed — each with a setup/action/assertion draft
   taken from the tgo-uz53 record and then reviewed; green on both lanes
   gates pilot entry.
4. (F13-Q3 Agreed 2026-09-23; Q20; F13-VH-04) The pilot starts at ONE
   checkpoint holding all-green plus explicit user approval plus verbatim
   sign-off; any missing leg blocks entry.
5. (F13-Q4 Agreed 2026-09-23; F13-VH-05) The pilot exits on user sign-off
   over the evidence plus the objective floor — watched metrics recorded,
   zero unexplained rollbacks, strings as signed-off — with NO numeric
   thresholds invented in v1; exit without sign-off blocks regardless.
6. (F13-Q5 Agreed 2026-09-23; F7 boundary; F13-VH-06) The F7 falsifier
   metric records only in v1 — class-split counters plus logs, never a
   gate; a binding threshold waits for its own v2 user decision.
7. (BQ4 Agreed 2026-09-21; F13-VH-07) The pilot measures the F5-DS-01
   resume-hit rate — record-only, never a gate; near-zero keeps resume
   with always-fresh dispatch as the v2 candidate.
8. (PRD:306-308; F13-VH-08) Rollback flips to harness-only, revokes grants,
   and preserves ledgers; re-entry needs the failing scenario reproduced
   green — and neither touches review budgets.
9. (MANIFEST + tgo-uz53; F13-VH-09) The gaodes fork stays fallback-only and
   admits only verified-then-pinned (commit/scope at spec phase);
   provenance failure drops it to primary-only.
10. (EVIDENCE.md:73-74; F13-VH-10) The harness re-pins at spec phase —
    exact version plus SHA plus drift disclosure against the 0.6.1 record
    (0.74 floor vs live 0.84); undisclosed drift fails coverage.
11. (PRD:309-310; F13-VH-11) Refusal and disclosure strings earn sign-off at
    spec review AND the pre-pilot gate; runtime text must match the
    signed-off text at both, or the gate blocks.
12. (Derived; F13-VH-12) F1–F12 do not move for harness work, and
    instrumentation stays counters and logs — nothing measured gates
    anything in v1; every block here awaits probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Coverage-mapping table shape: requirement ID → suite item or
   acceptance-matrix row (F13-VH-02; F13-Q2) — shapes only, no rows
   invented here.
2. S-suite per-scenario procedure drafts: setup/action/assertion per
   scenario S1…S11 incl. S9a/b/c (F13-VH-03) — shapes only, no scripts
   invented here.
3. Verbatim refusal/disclosure string drafts for the TWO sign-off gates:
   spec review + pre-pilot (F13-VH-11; F13-Q3) — shapes only, no wording
   invented here.
4. Watched-metric list (PRD:303-305) plus the two falsifier counters
   (F13-VH-06) and the BQ4 resume counter (F13-VH-07): record schemas and
   log wiring — shapes only, no values invented here.
5. Rollback automation shape: harness-only flip + grant revocation + ledger
   preservation wiring (F13-VH-08) — shape only, no mechanics invented
   here.
6. gaodes pin-record shape: commit/scope pin plus provenance check
   (F13-VH-09) — shape only, no values invented here.
7. Harness re-pin record shape: exact version + SHA + drift disclosure
   (F13-VH-10) — shape only, no values invented here.
8. Mock-boundary, serial, real-CLI, and persistence claims — ABSORBED
   research directions (provenance: tgo-uz53 record; the package files
   previously lacked them): UNVERIFIED in the package files;
   probe-verified at build before any suite item relies on them.

Implementation probes (runtime evidence before build claims):

1. Both-lane green proof: suite green on Windows AND macOS (F13-VH-01).
2. Coverage-completeness proof: every ID mapped; every preventive control
   adversarially exercised (F13-VH-02).
3. S-suite green proof per scenario incl. S9a/b/c (F13-VH-03).
4. Entry-gate proof: missing-leg entries refused (F13-VH-04).
5. Exit-floor proof: unrecorded metric / unexplained rollback / string
   deviation refuses exit (F13-VH-05).
6. Record-only proof: low counters gate nothing (F13-VH-06/07).
7. Rollback proof: flip + revocation + ledger preservation observed
   (F13-VH-08).
8. Re-entry proof: reproduced-green precedes return (F13-VH-08).
9. Fallback proof: provenance failure drops gaodes; verified pin admits it
   (F13-VH-09).
10. Re-pin proof: version + SHA + drift disclosure recorded (F13-VH-10).
11. String-match proof at both gates (F13-VH-11).
12. Empirical proof that lanes, gates, counters, rollback, and admission
    enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. The harness pin (0.6.1) lags live Pi (0.84.x); the peer floor is 0.74 —
   re-pin at spec phase, never assume currency.
2. The pinned harness has no macOS CI lane on record — the v1 macOS lane
   is UNPROVEN until built.
3. Mock-boundary/serial/real-CLI/persistence claims are UNVERIFIED —
   probe-verified at build.
4. Verbatim strings are deferred to spec review — no signed-off text
   exists yet.
5. All pilot evidence is FUTURE — nothing measured, nothing gated.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: rollback and re-entry consume NO review budget and
reset none — F1 task budgets (initial + at most two repair/re-review
cycles) and the ONE shared integration budget stand unchanged by pilot
incidents; an exhausted task failure is never repaired inside a rollback
or re-entry window, and approvals are never bypassed by either.

Question map (all Agreed 2026-09-23; paraphrase, not user quotes):

- F13-Q1 — USER OVERRIDE: BOTH Windows and macOS CI lanes ship IN v1
  (macOS-later was the recommendation; the user chose both-in-v1).
  (Normative: F13-VH-01.)
- F13-Q2 — S-suite + requirement-complete coverage rule: every
  requirement ID maps to ≥1 executable suite item; every preventive
  control maps to its full adversarial scenario; the P-series remainder is
  the documented acceptance matrix. (Normative: F13-VH-02/03.)
- F13-Q3 — pilot entry = all-green + explicit user approval + verbatim
  sign-off at ONE checkpoint. (Normative: F13-VH-04 + F13-VH-11.)
- F13-Q4 — pilot exit = user sign-off on evidence + the objective floor
  (metrics recorded, zero unexplained rollbacks, strings as signed-off);
  NO invented numeric thresholds in v1. (Normative: F13-VH-05.)
- F13-Q5 — review-pass-rate RECORD-ONLY in v1 (class-split counters +
  logs); a binding threshold is a v2 candidate. (Normative: F13-VH-06.)

User notes / delta: F13-Q1 reverses the macOS-later staging direction
(EVIDENCE.md:135) by explicit user override — the macOS lane is now a v1
build requirement, and the "add downstream" item closes into F13-VH-01.
No other prior decision moves: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7,
F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9
all stand; this spec cross-references, never re-decides. Awaiting USER
approval of this draft; band/independent review may follow per the
per-feature flow.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12
  digests and the F13 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; validation scope (section 3.7) and
  acceptance criteria (section 6, PRD:298-310) cross-referenced here
  (no re-decision here).
- `../MANIFEST.md` — test-harness extension pick (@marcfargas/pi-test-harness
  0.6.1 primary, @gaodes fallback-only); re-pin stays a spec-phase item
  here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; harness currency,
  macOS lane, strings, and absorbed claims stay open there.
- `README.md` — Stage B index; this is feature 13 of 13, the LAST spec.
