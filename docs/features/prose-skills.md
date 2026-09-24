# Feature F8 — Prose and skills (Dispatch)

Status: user-approved 2026-09-21 (band-reviewed, corrected, re-check READY), plus F8-PS-13 (RD-Q2 Agreed 2026-09-23); runtime unverified; scenarios FUTURE. Requirements
F8Q1–F8Q6 settled as directed 2026-09-21 EXCEPT F8-Q4 DEFERRED (the house prose-discipline/voice layer is not part of this feature — it sits on the user's later question/feature list; no prose-discipline content ships here); runtime unverified; issue OPEN. No implementation, installs,
code, commits, or pushes. Eighth Stage B feature spec; 2 areas stay stubs (F17 vision, F18 tracker — F16 council exists as a spec area; see `README.md`).
All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled
F8Q1–F8Q6 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7 requirements stand untouched.

## 0. Objective

Define the v1 seat skill roster, lean prompt budgets, breach handling, required-workflow designation,
lazy/progressive loading, prose-driven invocation, user-added skills, and skill lifecycle — under rules
that REQUIRE license-gated admission, build-time budget refusal, trim-and-disclose (never silent),
deterministic required loading, permissions outside skill text, and whole-artifact updates (enforcement
unverified until probes decide): one roster requirement with the per-seat table (LICENSE-GATED per
F6-PD-07 for the mattpocock family), <=500-token per-agent-prompt target with a 1000 hard cap on the prompt core (seat instructions + thin always-on layer + F12 re-injection set; skill bodies on the disclosed exposure budget — F12-Q7 refinement, user-approved 2026-09-22) enforced at build schema, build-time refusal plus runtime trim-and-disclose in priority order with user
escalation (park under F3-SD-04a when unattended), design-time required-workflow declaration the Dispatcher never drops, thin always-on rules
with seat-filtered metadata and on-demand bodies, prose invocation with no slash commands required, a
local user-managed directory with no auto-fetch and no skill store in v1, and skills shipped INSIDE the
plugin artifact riding the F6-PD-04 self-update path. Skill BODIES are never written here — roster
NAMES only. Mechanism choice (schemas, directory paths, config keys, measurement tooling) is
downstream, not this spec.

Stable requirement IDs `F8-PS-01` … `F8-PS-13`. Sources trace to settled
F8Q1–F8Q6 (except deferred F8-Q4) plus the settled intake budget, the user-approved lazy-loading
direction, the SpecPi whole-prompt direction, F6-PD-04/F6-PD-07, and F2 where noted; mappings are
multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5
holds the trace table; section 6 organizes the digest by requirement with source
labels. The F8-Q4 deferral (ALWAYS-ON layer preference recorded for later) is noted in
`../DECISIONS.md`.

## 1. Files / artifact boundaries

Owned by this feature (skill contract, budget rules, acceptance only):

1. V1 seat skill roster table (NAMES only — no procedural skill bodies written here).
2. Lean prompt budget: <=500-token target per agent prompt, 1000 hard cap on authored content for the largest agents, enforced at build schema per seat.
3. Hard-cap breach handling: build-time refusal at assembly; runtime trim-and-disclose in priority order (required bodies exempt); user escalation, park under F3-SD-04a when unattended; never silent.
4. Required-workflow designation: design-time declaration with deterministic loading the Dispatcher never drops.
5. Lazy/progressive loading: thin always-on hard rules + seat-filtered skill metadata + on-demand skill bodies + deterministic loading for required workflows.
6. Prose-driven invocation: skills invoked through prose; no slash commands required.
7. User-added skills: local user-managed directory with its three rules; no auto-fetch and no skill store in v1.
8. Skill lifecycle: skills ship INSIDE the plugin artifact and ride the F6-PD-04 self-update path; no separate skill channel in v1.
9. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only invariance holds.
2. Seat responsibilities, review packets, repair budgets, ceilings — F1 owns; here only invariance holds.
3. Permission configurability, fixed integrity, text-grants-nothing — permissions spec owns; here only the skill-text-never-grants-authority composition holds.
4. Approval gates, deviation classes, verdict binding, waiver shape — F3 owns; here only gate invariance holds.
5. Session reuse, identity equality, cancellation, recovery, rollover — F5 owns; here only invariance holds.
6. Reference-source verify-then-admit gate, self-update mechanics — F6 owns; here only the F6-PD-07 license gate and the F6-PD-04 update path hold.
7. Model assignments, variants, backups — F7 owns; here only invariance holds.
8. Exact schemas, directory paths, config keys, measurement tooling, skill bodies — downstream engineering owns, never chosen here.

Not in this feature:

1. Skill bodies or procedural skill content — roster NAMES only; no procedural content written into this spec.
2. Token counts beyond the recorded 500/1000; directory paths; config keys; file schemas; measurement procedures — all downstream (section 7).
3. The house prose-discipline/voice layer (F8-Q4 DEFERRED) — sits on the user's later question/feature list; no voice cards regardless (Q1).
4. Any claim that current Pi APIs, registries, loaders, or adapters already implement sections 2–3. Proof is future work.
5. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 V1 skill roster (NAMES only; LICENSE-GATED per F6-PD-07)

- F8-PS-01 — V1 SKILL ROSTER, one requirement with the per-seat table below. NAMES
  only — no procedural skill bodies are written into this spec. The mattpocock-family
  items (grilling, wizard, to-tickets, wayfinder, to-questionnaire,
  verification-planning) ship ONLY if the F6Q4 license fetch passes — otherwise they
are rewritten from scratch as idea-level adaptations with no copied text. Rewritten-from-scratch
items KEEP their roster seats and required-workflow designations: the designation binds the
WORKFLOW, not the source text. Unconditional
named verified exceptions: obra/superpowers MIT family and addyosmani agent-skills
0.6.8 MIT family. (F8Q1; F6-PD-07 verify-then-admit.)

| Seat | Skills |
|---|---|
| Dispatcher | grilling, to-tickets, to-questionnaire, wayfinder, verification-planning |
| Writer | tdd, diagnosing-bugs, receiving-code-review, api-and-interface-design, security-and-hardening, code-simplification, finishing-a-development-branch, bmad-build-auto (adapted for unattended work) |
| Seeker | source-grounding, deep-recon, web-retrieval |
| Expert | code-review, doubt-driven-development |
| Any seat | verify-before-claim |
| Human-only steps | wizard |

  Name-equivalence record: deep-recon is the CANONICAL name; "bmad-deep-recon" is
  the source-family label for the same skill — one skill, not two. bmad-build-auto
  ships adapted for unattended work. No other roster addition, rename, or second
  skill is invented here.

### 2.2 Lean prompt budget (settled intake)

- F8-PS-02 — LEAN PROMPT BUDGET: <=500 tokens per agent prompt target, 1000 hard cap
  for the largest agents; the cap binds the PROMPT CORE ONLY (seat instructions +
  the thin always-on layer + the F12 three-item re-injection set) — SKILL BODIES sit
  on the separate DISCLOSED EXPOSURE BUDGET (F8-PS-09) where F8-Q9's trim order
  applies (F12-Q7 refinement, user-approved 2026-09-22 — amends the F8-Q7
  interpretation with provenance; rationale: matches the user's original "custom
  agent prompt… 500 tokens each" wording; prevents chronic skill starvation),
  counted with the assigned model's tokenizer at build
  and recorded in the pin record — backup dispatches inherit the measured size (no re-trim
  on substitution); a disclosure is issued if a backup tokenizer would inflate past the cap.
  Enforced at build schema per seat — over-cap PROMPT-CORE prompts never
  assemble (build-time refusal). No other token count is invented here. No tokenizer
  names are invented here. (Settled
  intake; Q52-style standing rules; F8-Q7/F8-Q8.)

### 2.3 Hard-cap breach (F8Q2)

- F8-PS-03 — HARD-CAP BREACH: build-time refusal at assembly; if runtime composition
  would exceed the authored cap, trim-and-disclose in priority order (NON-required skill
  bodies first, then optional evidence — required-workflow bodies are EXEMPT from trim
  per F8-PS-04 precedence); if still over, escalate to the user; when no user is present
  for the escalation step, the affected branch PARKS under the F3-SD-04a park lifecycle
  (disclose-and-ask at the configured staleness limit); if required content jointly exceeds
  the authored cap, that is a build refusal (design error) — escalate or park per this rule.
  Never a silent trim in either case.
  (F8Q2; F8Q3 precedence; F8-Q9.)

### 2.4 Required-workflow designation (F8Q3)

- F8-PS-04 — REQUIRED-WORKFLOW DESIGNATION: design-time declaration in the spec — a
  workflow marked required loads its skill deterministically; the Dispatcher may load
  ADDITIONAL skills on demand but never drops a required one. Required-workflow bodies are
  EXEMPT from F8-PS-03 trim ("never drops a required one" wins over trim order); the trim
  order applies to NON-required skill bodies first, then optional evidence. The designation
  binds the WORKFLOW, not the source text — rewritten-from-scratch license-gate items keep
  their designations. (F8Q3.)

### 2.5 Lazy/progressive loading (user-approved direction, recorded as settled)

- F8-PS-05 — LAZY/PROGRESSIVE LOADING: thin always-on hard rules + seat-filtered
  skill metadata + on-demand skill bodies + deterministic loading for required
  workflows. Permissions live OUTSIDE skills — skill text never grants authority, and
  loading or skipping a skill never changes permissions (composition of F2 plus the
  SpecPi direction). (User-approved direction; F2 text-grants-nothing.)

### 2.6 Prose-driven invocation (settled)

- F8-PS-06 — PROSE-DRIVEN INVOCATION: skills are invoked through prose; no slash
  commands required. Prose-invocation ambiguity (multiple skills matching one request)
  resolves by explicit selection or asking the user — never a silent pick. (Settled; Q52-style standing rules.)

### 2.7 User-added skills (F8Q5)

- F8-PS-07 — USER-ADDED SKILLS: a local user-managed directory governed by three
  rules — skill text never grants permissions; licensing of user additions is the
  user's responsibility; no auto-fetch and no skill store in v1. Roster skill names are
  RESERVED — a user-added skill with a colliding name REFUSES to load with disclosure.
  User additions follow the same seat filtering and cap accounting as roster skills. Their
  lifecycle is user-managed (outside the F6-PD-04 artifact path): "no separate skill
  channel" (C8) means the PLUGIN ships no second channel. No directory path
  is invented here. (F8Q5.)

### 2.8 Skill lifecycle (F8Q6)

- F8-PS-08 — SKILL LIFECYCLE: skills ship INSIDE the plugin artifact and ride the
  F6-PD-04 self-update path (staging-and-swap updates the whole artifact); no
  separate skill channel in v1. Skill rollback is covered by the F6-PD-05 kept-prior
  revert; loaded-version observability rides the F8-PS-09 record mandate. (F8Q6; F6-PD-04; F6-PD-05.)

### 2.9 Whole-prompt measurement (SpecPi direction, recorded)

- F8-PS-09 — WHOLE-PROMPT MEASUREMENT: the 500-target/1000-hard-cap binds the PROMPT CORE ONLY (seat instructions +
  thin always-on layer + F12 three-item re-injection set); SKILL BODIES sit on the separate DISCLOSED EXPOSURE BUDGET where F8-Q9's trim order
  applies (F12-Q7 refinement, user-approved 2026-09-22); whole-prompt size (tool schemas +
  injected policy + handoff material) is measured and DISCLOSED under a separate configurable
  exposure budget with warnings — no exposure-budget values are invented here. Build refusal
  (over-cap never assembles) applies to the PROMPT-CORE cap. The trim/escalation/budget/license
  records named in the section 2.12 detective rows MUST exist and persist; record shapes remain
  section 7. Repeatability target
  = per-seat budget check at build (measurement procedure is engineering, listed in
  section 7). No measurement tooling is chosen here. (SpecPi direction; F8-Q7.)

### 2.10 Out of scope — F8-Q4 DEFERRED

- F8-PS-10 — OUT OF SCOPE (F8-Q4, DEFERRED): the house prose-discipline/voice layer
  is NOT part of this feature — it sits on the user's later question/feature list.
  The user's recorded preference for when that discussion happens: an ALWAYS-ON
  layer. No prose-discipline content ships from this spec. No voice cards (Q1)
  regardless. (F8-Q4 deferred; Q1.)

### 2.11 Invariance and spec-only status

- F8-PS-11 — F1–F7 requirements stand unchanged by anything in this feature; no seat,
  budget, ceiling, gate, evidence, license, platform, or model rule moves here.
- F8-PS-12 — All blocking in sections 2.1–2.10 and 2.13 is a SPEC requirement, not proven
  runtime implementation — enforcement is unverified until probes decide
  (section 7). (F1–F7 invariance; spec-only status.)

### 2.12 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| License gate on the mattpocock family; idea-level-only default (F8-PS-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks copied text from unverified sources |
| Build-schema budget enforcement; over-cap prompts never assemble (F8-PS-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks over-cap prompt assembly at build |
| Build-time refusal; trim-and-disclose priority order; escalate-if-still-over; never silent (F8-PS-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent over-cap composition and silent trims |
| Required-workflow deterministic loading; never dropped (F8-PS-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks Dispatcher-dropped required skills |
| Skill text never grants authority; load/skip never changes permissions (F8-PS-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks permission change via skill text or loading |
| User-added three rules: never-grants, user-licensed, no auto-fetch/store (F8-PS-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks permission grants, auto-fetch, and store pulls |
| Inside-artifact shipment; whole-artifact update path; no separate channel (F8-PS-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks out-of-artifact skill delivery in v1 |
| Whole-prompt accounting incl. schemas, policy, handoff (F8-PS-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks seat-instructions-only budget accounting |
| F8-Q4 exclusion; no voice cards (F8-PS-10) | Preventive (SPEC requirement, NOT proven implementation) | blocks prose-discipline content shipping from this spec |
| Trim/escalation disclosures, budget-check record, license verdicts (F8-PS-01, F8-PS-03, F8-PS-09) | Detective | surfaces a trim, escalation, budget, or license event after the fact and routes it to the record |
| Roster table, budget record, required-workflow declarations | Detective (reporting) | leaves an after-the-fact evidence trail with no authority of its own |
| Retrieval-led and prose-driven working assessments | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.13 Skill claim discipline (RD-Q2 composition, Agreed 2026-09-23)

- F8-PS-13 — SKILL CLAIM DISCIPLINE: skill text asserting external facts carries source links (the F6-Q4 license-gated adaptation rule extended to claims); a build check flags a skill asserting unsourced external facts. Procedure-only skill text passes the check. The normative claim rule lives in `retrieval-discipline.md` (F15-RD-02); this section holds the build-check composition only. (RD-Q2 Agreed 2026-09-23.)

## 3. Constraints

C1. F8Q1–F8Q6 (except deferred F8-Q4) govern where they conflict with earlier readings
inside this scope; F1/F2/F3/F4/F5/F6/F7 stand where this spec does not narrow them. C2. No
re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5 stand;
this spec cross-references, never re-decides. C3. No invented skill bodies: roster NAMES
only — no procedural content written into this spec. C4. No invented token counts beyond
the recorded 500/1000; no invented directories, config keys, schemas, or measurement
tooling — unknowns in section 7 stay open. C5. No silent trim, silent drop of a required
skill, silent permission change, or silent over-cap composition — every budget-changing
outcome discloses or escalates. C6. No skill text that grants authority; no permission
change via loading or skipping a skill. C7. No auto-fetch and no skill store in v1; user
additions licensed by the user; roster names reserved — colliding user additions refused. C8. No separate skill channel in v1 — inside the plugin
artifact via F6-PD-04 only; the PLUGIN ships no second channel while user additions stay user-managed outside the artifact path. C9. No prose-discipline/voice content ships from this spec
(F8-Q4 deferred); no voice cards regardless. C10. The mattpocock-family license gate is
explicit and visible wherever that family appears. C11. Controls are classed preventive,
detective, or advisory by actual function (section 2.12); SPEC-required
blocking is not proven implementation.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial skill/budget consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P8-01 (F8-PS-01). Input: Dispatcher task touching planning artifacts / Observe: skill loading runs / Pass: only the Dispatcher roster names load (grilling, to-tickets, to-questionnaire, wayfinder, verification-planning, subject to the license gate); no Writer/Seeker/Expert skill loads for the Dispatcher seat. FUTURE.
- P8-02 (F8-PS-01). Input: Writer, Seeker, and Expert tasks dispatched / Observe: skill loading runs per seat / Pass: Writer loads only its eight roster names, Seeker only source-grounding/deep-recon/web-retrieval, Expert only code-review/doubt-driven-development; verify-before-claim available to any seat; wizard runs human-only steps, never a seat. FUTURE.
- P8-03 (F8-PS-01). Input: F6Q4 license fetch passes for the mattpocock family / Observe: admission runs / Pass: grilling, wizard, to-tickets, wayfinder, to-questionnaire, verification-planning ship with the verdict recorded. FUTURE.
- P8-04 (F8-PS-01). Input: F6Q4 license fetch fails or stays pending for the mattpocock family / Observe: admission runs / Pass: those items ship only as rewrites from scratch as idea-level adaptations with no copied text; obra/superpowers MIT and addyosmani agent-skills 0.6.8 MIT families still admitted under their recorded exceptions. FUTURE.
- P8-05 (F8-PS-02). Input: seat AUTHORED content proposed over its build-schema budget / Observe: build assembly runs / Pass: refused at build — over-cap AUTHORED prompts never assemble. FUTURE.
- P8-06 (F8-PS-03). Input: runtime composition would exceed the authored cap / Observe: trim handling runs / Pass: trimmed-and-disclosed in priority order (NON-required skill bodies first, then optional evidence; required-workflow bodies EXEMPT) with the trim recorded. FUTURE.
- P8-07 (F8-PS-03). Input: composition still over cap after trimming / Observe: escalation runs / Pass: escalated to the user; never a silent trim — silence blocks. FUTURE.
- P8-08 (F8-PS-04). Input: workflow marked required in the spec; Dispatcher proposes extra skills and proposes dropping one required skill / Observe: loading runs / Pass: the required skill loads deterministically; additional on-demand loads pass; the drop is refused. FUTURE.
- P8-09 (F8-PS-05). Input: seat dispatched with lazy loading; skill loaded vs skipped / Observe: permission check runs in both cases / Pass: thin always-on rules plus seat-filtered metadata hold; bodies load on demand; permissions identical whether the skill loaded or was skipped. FUTURE.
- P8-10 (F8-PS-06). Input: user asks for skill-guided work without naming any command / Observe: invocation runs / Pass: the skill engages through prose; no slash command demanded. FUTURE.
- P8-11 (F8-PS-07). Input: user-added skill text claiming new permissions / Observe: authority check runs / Pass: refused — skill text never grants permissions; the F2 authority boundary holds. FUTURE.
- P8-12 (F8-PS-07). Input: user-added skill proposed with unclear licensing; store fetch proposed / Observe: admission runs / Pass: licensing recorded as the user's responsibility; auto-fetch and skill-store pulls refused in v1. FUTURE.
- P8-13 (F8-PS-08). Input: skill update proposed outside the plugin artifact path / Observe: lifecycle check runs / Pass: refused — skills ship INSIDE the plugin artifact and update only via the F6-PD-04 staging-and-swap whole-artifact path; no separate skill channel in v1. FUTURE.
- P8-14 (F8-PS-09). Input: per-seat budget check at build / Observe: measurement runs / Pass: authored content checked against the 500-target/1000-hard-cap while whole-prompt size (tool schemas plus injected policy plus handoff material) is measured and disclosed under the separate configurable exposure budget; seat-instructions-only accounting refused. FUTURE.
- P8-15 (F8-PS-10). Input: prose-discipline/voice-layer content proposed for this feature / Observe: scope check runs / Pass: refused — F8-Q4 is DEFERRED to the user's later question/feature list (ALWAYS-ON preference recorded); no voice cards regardless per Q1. FUTURE.
- P8-16 (F8-PS-11, F8-PS-12). Input: change proposed to an F1–F7 rule inside this feature's scope / Observe: invariance check runs / Pass: refused — F1–F7 stand unchanged; every block here is a SPEC requirement with enforcement unverified until probes decide. FUTURE.
- P8-17 (F8-PS-03). Input: unattended session, composition still over the authored cap after trimming / Observe: the escalation path runs with no user present / Pass: the affected branch parks under F3-SD-04a with disclosure and a staleness clock; never a silent trim. FUTURE.
- P8-18 (F8-PS-07). Input: user-added skill whose name collides with a roster name / Observe: admission runs / Pass: refused to load with disclosure (roster names reserved); non-colliding user additions load under the same seat filtering and cap accounting. FUTURE.
- P8-19 (F8-PS-13). Input: skill text asserting an external fact with no source; procedure-only skill text / Observe: build check runs / Pass: claim-bearing text flagged with the unsourced claim cited; procedure-only text passes. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F8 source | Stage A / F1–F7 relation |
|---|---|---|
| F8-PS-01 v1 skill roster per-seat table (NAMES only); mattpocock family LICENSE-GATED; deep-recon canonical equivalence; bmad-build-auto unattended adaptation; obra/superpowers + agent-skills MIT exceptions | F8Q1 | F6-PD-07 verify-then-admit |
| F8-PS-02 <=500 target, 1000 hard cap on AUTHORED content, assigned-model tokenizer counted at build with pin record, backup inherits size, build-schema per-seat enforcement, never assemble over cap | Settled intake; F8-Q7/F8-Q8 | Q52-style standing rules (lean prompts) |
| F8-PS-03 build-time refusal; runtime trim-and-disclose (NON-required bodies first, evidence second; required EXEMPT); escalate-if-still-over; unattended parks under F3-SD-04a; required-over-cap is build refusal; never silent | F8Q2; F8Q3 precedence; F8-Q9 | Q6 never-silent; F3-SD-04a park |
| F8-PS-04 design-time required declaration; deterministic loading; Dispatcher may add, never drops; trim-exempt; designation binds workflow not source text | F8Q3 | F1 Dispatcher routing |
| F8-PS-05 thin rules + filtered metadata + on-demand bodies + deterministic required loading; skill text never grants authority; load/skip never changes permissions | User-approved direction (settled) | F2 text-grants-nothing; SpecPi direction |
| F8-PS-06 prose invocation; no slash commands required; ambiguity resolves by selection or asking, never silent pick | Settled | Q52-style standing rules (prose-driven) |
| F8-PS-07 local user-managed directory; never-grants; user-licensed; no auto-fetch/store v1; roster names reserved (collisions refused); same seat filtering and cap accounting; user-managed lifecycle | F8Q5 | F2 authority boundary; F6-PD-07 posture |
| F8-PS-08 inside-artifact shipment; F6-PD-04 staging-and-swap whole-artifact path; no separate channel v1; rollback via F6-PD-05 kept-prior revert | F8Q6 | F6-PD-04 self-update; F6-PD-05 |
| F8-PS-09 authored cap + whole-prompt measured/disclosed under separate configurable exposure budget; build refusal on authored cap; records MUST exist and persist, shapes downstream | SpecPi direction (recorded); F8-Q7 | F8-PS-02 budget composition |
| F8-PS-10 F8-Q4 DEFERRED; ALWAYS-ON preference recorded for later; nothing ships; no voice cards | F8-Q4 deferred | Q1 no voice cards |
| F8-PS-11 F1–F7 invariance | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP |
| F8-PS-12 spec-only blocking, enforcement unverified until probes | Derived | Section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F8Q1; F8-PS-01) Each seat carries its named skills only — Dispatcher five, Writer eight, Seeker three, Expert two, verify-before-claim anywhere, wizard human-only — with deep-recon canonical ("bmad-deep-recon" the same skill's family label) and bmad-build-auto adapted for unattended work; the mattpocock family ships only on a passed F6Q4 fetch, else rewritten from scratch with no copied text; obra/superpowers MIT and agent-skills 0.6.8 MIT excepted unconditionally.
2. (Settled intake; F8-PS-02; F12-Q7 refinement user-approved 2026-09-22) Agent prompts target <=500 tokens with a 1000 hard cap on the PROMPT CORE ONLY (seat instructions + thin always-on layer + F12 re-injection set) for the largest agents, counted with the assigned model's tokenizer at build and recorded in the pin record (backups inherit the size; disclosure if a backup tokenizer would inflate past the cap), enforced per seat at build schema — over-cap prompt-core prompts never assemble; skill bodies sit on the disclosed exposure budget.
3. (F8Q2; F8-PS-03) Over-cap assembly refuses at build; runtime over-cap trims-and-discloses NON-required bodies first then optional evidence (required-workflow bodies EXEMPT), escalates if still over, parks under F3-SD-04a when no user is present, and never trims silently in either case.
4. (F8Q3; F8-PS-04) A required workflow loads its skill deterministically by design-time declaration; the Dispatcher may add skills on demand but never drops a required one; required bodies are trim-exempt and the designation binds the workflow, not the source text.
5. (User-approved direction; F8-PS-05) Loading stays lazy and progressive — thin always-on rules, seat-filtered metadata, on-demand bodies, deterministic required loads — while permissions live outside skills: text never grants authority and loading or skipping changes nothing.
6. (Settled; F8-PS-06) Skills engage through prose; no slash command is required.
7. (F8Q5; F8-PS-07) User skills live in a local user-managed directory where text never grants permissions, licensing is the user's responsibility, and v1 performs no auto-fetch and runs no skill store.
8. (F8Q6; F8-PS-08) Skills ship inside the plugin artifact and update only through the F6-PD-04 staging-and-swap whole-artifact path — no separate skill channel in v1.
9. (SpecPi direction; F8-PS-09; F12-Q7 refinement, user-approved 2026-09-22) The cap binds the prompt core only (seat instructions + thin always-on layer + F12 re-injection set) while skill bodies sit on the disclosed exposure budget and whole-prompt size (tool schemas, injected policy, handoff material) is measured and disclosed under a separate configurable exposure budget — with a per-seat build check as the repeatability target and measurement procedure left to engineering; the trim/escalation/budget/license records MUST exist and persist.
10. (F8-Q4 deferred; F8-PS-10) The house prose-discipline/voice layer is deferred to the user's later list with the ALWAYS-ON preference recorded — nothing ships here, and no voice cards exist regardless.
11. (Derived; F8-PS-11) F1–F7 rules do not move for prose/skills work.
12. (Derived; F8-PS-12) Every block in this spec is a spec requirement awaiting probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Build-schema shape for per-seat budget enforcement (targets, caps, refusal behavior) — no values beyond the recorded 500/1000 set here.
2. Trim-and-disclose record shape (what was trimmed, in what order, what was disclosed) and user-escalation verbatim strings.
3. Required-workflow declaration schema and deterministic-loading mechanics (how "required" is marked, how the Dispatcher proves no drop).
4. Seat-filtered skill-metadata shape and on-demand body-loading mechanics (what metadata ships per seat, what triggers a body load).
5. Local user-managed directory layout and admission checks (never-grants enforcement, user-license recording, auto-fetch/store refusal) — no paths set here.
6. Whole-prompt measurement procedure (how schemas, policy, and handoff material are counted at build; exposure-budget values and warnings are configuration, no values set here) — procedure is engineering, owned here as an open item.
7. Skill-packaging layout inside the plugin artifact and whole-artifact update proof via the F6-PD-04 path.
8. Prose-invocation recognition behavior (how prose maps to skills without slash commands) — recognition only, never permission.

Implementation probes (runtime evidence before build claims):

1. Build-schema proof: over-cap prompts actually refuse assembly per seat.
2. Runtime breach proof: trim-and-disclose order (bodies first, evidence second), disclosure record, user escalation when still over, no silent trim.
3. Required-loading proof: required skills load deterministically; Dispatcher-added extras allowed; drops refused.
4. Permission-invariance proof: loading or skipping a skill changes no permission; skill text grants nothing under adversarial text.
5. Lifecycle proof: skills ship inside the artifact and update only through the whole-artifact staging-and-swap path.
6. Empirical proof that chosen Pi hooks, registries, loaders, or adapters enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. Skill bodies, token counts beyond 500/1000, directory paths, config keys, schemas, and measurement tooling are explicitly unknown here — downstream, never invented.
2. Same-model review anchoring risk remains; the fresh-session artifact packet is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
3. License verdicts for the 11 pending fetches (F6Q4) are spec-phase pins, explicitly not decided here — the mattpocock-family gate stays conditional until then.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7 digests and F8 digest (this feature's authority where they differ; F8-Q4 deferral noted).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; budget, loading, license, and interception gaps stay open there.
- `README.md` — Stage B index; this is feature 8 of 13.
