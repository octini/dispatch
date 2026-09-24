# Feature F9 — Bootstrap and initialization (Dispatch)

Status: user-approved 2026-09-22 (band-reviewed NEEDS REVISION → 10 corrections → re-check READY); runtime unverified; scenarios FUTURE. Requirements
F9-BS-01 … F9-BS-14 settled as directed 2026-09-21/22 EXCEPT the Q5 parenthetical step reading SUPERSEDED by the canonical order (recorded as superseded in `../DECISIONS.md`);
runtime unverified; issue OPEN (tgo-geh3). No implementation, installs,
code, commits, or pushes. Ninth Stage B feature spec; 5 areas stay undone (this draft + 4 stubs — see `README.md`).
All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled
F9Q1–F9Q6 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8 requirements stand untouched.

## 0. Objective

Define the v1 additive no-clobber bootstrap: first-prose trigger with slash-command and re-check bails,
independent needsSetup signals, canonical four-step order, partial-state repair, nested-git guard,
git-init-only-if-absent, create-or-merge `.pi/settings.json` registration, Beads setup via installer plus
init plus setup-and-advice, plugin-owned `AGENTS.md` block, user-edit policy, prose-triggered re-check
surface, and always-trust posture with fail-closed race handling, plus a visible parked-failure retry cap — under rules
that REQUIRE only-missing-steps repair, zero git writes inside nested repos, no-clobber only-when-absent
appends, no automatic commits/pushes/global installs, user edits winning over re-adds on every plugin-owned surface, and trust-never-pausing
(enforcement unverified until probes decide): trigger and bail conditions (ANY user-authored non-command input counts as real prose, pastes and single words included, in the primary
session only — a first touch in a non-primary session waits for the primary session; slash-command input bails; re-check paths bail), four independent setup signals each driving
only its step with a minimal health check (empty `.beads`, unparseable `.pi/settings.json`, corrupt/marker-only state reads as NOT set up), the project root read as the session working directory (single-root v1), the PRD.md:229-235 canonical order (nested-git guard → settings registration → bd init/setup/advice →
AGENTS.md block), idempotent partial repair that never blind-reruns and never parks when the path is clear,
in-place operation with disclosure inside nested repos, installer-selected checksum-verified bd provisioning
with version floors enforced on the present branch too (below-floor reads as NOT set up — upgrade via the verified installer path with disclosure, refusal/failure parks under F3-SD-04a; never runs below-floor silently), a 50–100-line delimited plugin-owned AGENTS.md layer with provenance plus a SEPARATELY-marked Step 3 advice block (each absent-check keyed only on its own markers), first-pass appends with disclose-and-ask on any LATER absent block (a "no" is a recorded disclosed-skip — no re-ask loop, no silent skip),
prose-default re-check with an explicitly permitted command,
and bootstrap that never pauses for trust while the F2 permission system governs actions — an F2 denial or the trust
auto-install race parks THAT step fail-closed under F3-SD-04a while remaining independent steps continue with disclosure. Mechanism choice (exact marker strings, schema/merge
shapes, kill-switch wiring, retry bookkeeping) is downstream, not this spec.

Stable requirement IDs `F9-BS-01` … `F9-BS-14` (F9-BS-14 promotes constraint C8, additive only). Sources trace to settled
F9Q1–F9Q9 (F9Q1–F9Q6 2026-09-21; F9Q7–F9Q9 Agreed 2026-09-22) plus Q5, Q46, Q47, PRD.md section 4.1, and research-backed design items
labeled as such; mappings are multi-source where a rule draws on more than one source — no one-to-one
fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source
labels. The Q5 parenthetical supersession and the research-backed flags are noted in
`../DECISIONS.md`.

## 1. Files / artifact boundaries

Owned by this feature (bootstrap contract, ordering rules, acceptance only):

1. Trigger and bail conditions: ANY user-authored non-command input counts as real prose (pastes and single words included) in the primary session only — a first touch in a non-primary session waits for the primary session; slash-command input bails; re-check paths bail.
2. NeedsSetup signal set: four independent signals (`.beads` presence, AGENTS.md integration markers, `.pi/settings.json` presence, `git rev-parse`), each driving only its step; a minimal health check treats empty `.beads`, unparseable `.pi/settings.json`, or corrupt/marker-only state as NOT set up. Project root is the session working directory (single-root v1).
3. Canonical four-step order per PRD.md:229-235: (1) nested-git guard then git init only if absent → (2) create-or-merge `.pi/settings.json` registration → (3) bd init when missing then bd setup + advice append → (4) append project AGENTS.md block only when absent.
4. Partial-state repair: only missing steps run, in canonical order; idempotent rerun that detects already-set-up and skips; never blind full rerun; never park when the path is clear.
5. Nested-git guard: in-place operation with zero git writes inside a nested repo; Step 1 skipped only, Steps 2–4 continue, nested context disclosed; never create a nested repo.
6. Git init rule: only if a repo is absent; no initial commit, no push ever; `.gitignore` appended only if absent.
7. `.pi/settings.json` create-or-merge: one file path (`.pi/settings.json`), packages registration entry merged without clobbering user content.
8. Beads setup: installer-selected checksum-verified bd provisioning when missing (MANIFEST/F4/F6), bd init when `.beads` absent, then bd setup + advice append into its OWN delimited AGENTS.md block under a SEPARATE marker namespace from the Step 4 plugin block; version floors bd >= 0.59.0 / dolt >= 2.1.0 (MANIFEST pin) enforced on the present branch too — below-floor reads as NOT set up.
9. AGENTS.md plugin-owned block: clearly delimited, appended only when absent; 50–100-line target; thin always-on layer + provenance line (plugin version + date) + pointers to plugin docs; user content outside the block never touched; extensions belong outside the block.
10. User-edit policy over ALL plugin-owned surfaces (both AGENTS.md blocks, the `.pi/settings.json` registration entry, `.gitignore` additions, the Beads advice block): absent/deleted surface → next check discloses and asks (never silent re-add); modified surface → user edit wins with divergence disclosed; never overwrite a user edit; never silently skip a missing layer.
11. Re-check surface: prose-triggered re-check is the default ("check and fix the setup" re-runs the idempotent pass); an explicit user-invoked command is permitted; no slash command required.
12. Trust posture: bootstrap never pauses for a trust prompt (always-trust pre-configured); trust is not permission — F2 governs actions; the trust auto-install race resolves fail-closed (affected step parks and discloses under F3-SD-04a, never prompts); an F2 permission denial mid-step parks THAT step fail-closed the same way while remaining independent steps continue with disclosure.
13. Retry cap: after 3 failures a step parks as a VISIBLE parked-failure under the single F3-SD-04a park semantics — never labeled already-set-up; re-attemptable via re-check or explicit user action.
14. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only the bd-init/setup/advice composition and installer/version-floor invariance hold.
2. Seat responsibilities, review packets, repair budgets, ceilings — F1 owns; here only invariance holds.
3. Permission configurability, fixed integrity, trust-vs-permission boundary — permissions spec owns; here only the trust-is-not-permission composition holds.
4. Approval gates, deviation classes, park lifecycle, verdict binding — F3 owns; here only the F3-SD-04a park composition holds.
5. Installer selection, checksum rules, self-update mechanics — F4/MANIFEST/F6 own; here only the installer-plus-checksum and version-floor composition hold.
6. Session reuse, identity equality, cancellation, recovery, rollover — F5 owns; here only invariance holds.
7. Reference-source verify-then-admit gate, prerequisite posture — F6 owns; here only the Linux best-effort composition holds.
8. Model assignments, variants, backups — F7 owns; here only invariance holds.
9. Skill roster, budgets, prose invocation — F8 owns; here only the thin-layer content composition holds.
10. Exact marker strings, schema/merge shapes, kill-switch wiring, retry bookkeeping — downstream engineering owns, never chosen here.

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Exact marker strings, schema/merge shapes, kill-switch wiring, retry bookkeeping, installer commands — all downstream (section 7).
3. Any claim that current Pi hooks, installers, or adapters already implement sections 2–3. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Trigger and bail (F9Q1–Q6 scope; PRD.md:227-228)

- F9-BS-01 — TRIGGER + BAIL: the bootstrap trigger fires on ANY user-authored non-command input
  as real prose (pastes and single words included) in the PRIMARY session ONLY — a project whose
  first touch is in a non-primary session waits for the primary session's first real prose, and
  non-primary sessions never bootstrap. Slash-command input bails the trigger (research-recorded "bail on /" — labeled
  RESEARCH-BACKED in section 5). Re-check paths also bail (PRD.md:227-228). No other trigger is
  invented here. (F9Q1–F9Q6 scope; F9Q9 Agreed 2026-09-22; PRD.md:227-228; research tgo-dowi.)

### 2.2 NeedsSetup signals

- F9-BS-02 — NEEDSSETUP SIGNALS: four INDEPENDENT signals — `.beads` presence, AGENTS.md
  integration markers, `.pi/settings.json` presence, `git rev-parse`. Any one absent drives ONLY its
  step (composition with F9-BS-04: absent git → Step 1 candidacy; absent settings file → Step 2;
  absent `.beads`/markers → Step 3; absent AGENTS.md block → Step 4). Signals never jointly force a
  full rerun. Minimal health check: empty `.beads`, unparseable `.pi/settings.json`, or
  corrupt/marker-only state reads as NOT set up (validation depth stays section 7). Project root is
  the session working directory (single-root v1); monorepo/multi-root determination is a recorded gap
  (section 7). (PRD.md:238-240; F9Q1 composition; band correction 2026-09-22.)

### 2.3 Canonical step order (superseding reading)

- F9-BS-03 — CANONICAL STEP ORDER: (1) nested-git guard then git init only if absent → (2)
  create-or-merge `.pi/settings.json` registration → (3) bd init when missing then bd setup + advice
  append → (4) append project AGENTS.md block only when absent. This order SUPERSEDES the earlier Q5
  parenthetical step reading, which is recorded as SUPERSEDED in `../DECISIONS.md` — the parenthetical
  stands as provenance, the PRD.md:229-235 order governs. (PRD.md:229-235 canonical; Q5 parenthetical superseded.)

### 2.4 Partial-state repair (F9Q1)

- F9-BS-04 — PARTIAL-STATE REPAIR: only the missing steps run, in canonical order. Never a blind
  full rerun (clobber risk); never park when the path is clear. Idempotent rerun detects already-set-up
  and skips — a fully-set-up project passes through with zero writes. Timing boundary: the FIRST
  bootstrap pass appends under the only-when-absent rule; any LATER check finding an absent block
  discloses-and-asks per F9-BS-10, and a "no" answer is a RECORDED disclosed-skip in the disclosure
  record — no re-ask loop, no silent skip. (F9Q1 Agreed 2026-09-21; band correction 2026-09-22.)

### 2.5 Nested-git guard (F9Q3)

- F9-BS-05 — NESTED-GIT GUARD: inside a subdirectory of an existing repo, operate in place with ZERO
  git writes — Step 1 is skipped ONLY, Steps 2–4 continue, and the nested context is disclosed. Never
  create a nested repo. (F9Q3 Agreed 2026-09-21.)

### 2.6 Git init

- F9-BS-06 — GIT INIT: `git init` runs only if a repo is absent; no initial commit, no push ever
  (Q5 additive posture). `.gitignore` is appended only if absent (RESEARCH-BACKED rule — labeled in
  section 5). (Q5; research tgo-dowi.)

### 2.7 `.pi/settings.json` registration

- F9-BS-07 — `.pi/settings.json`: create-or-merge a packages registration entry without clobbering
  user content. ONE file path: `.pi/settings.json` (the earlier ".pi/settings registration" string is
  the ACTION; the file is `.pi/settings.json` — resolution recorded in `../DECISIONS.md`).
  Schema/merge shape pinned at build (section 7). (Q5; PRD.md:231-232.)

### 2.8 Beads setup (Q47 + research-backed, flagged)

- F9-BS-08 — BEADS SETUP: bd installed with the plugin when missing (installer selection + checksum
  verify per MANIFEST/F4/F6); bd init when `.beads` absent; then bd setup + advice append into its OWN
  clearly delimited AGENTS.md block under a SEPARATE marker namespace from the Step 4 plugin block
  (composition with F9-BS-09: each absent-check keys ONLY on its own markers; the F9-BS-10 policy
  applies to both blocks independently; marker string shapes stay section 7)
  (RESEARCH-BACKED DESIGN — no Q-line records this exact composition; flagged in sections 5–6 and
  `../DECISIONS.md`). Version floors bd >= 0.59.0 / dolt >= 2.1.0 (MANIFEST pin) run on the PRESENT
  branch too: a below-floor installation reads as NOT set up — upgrade is attempted through the same
  checksum-verified installer path with disclosure, bounded by the F9-BS-14 retry cap; refusal or
  failure parks under F3-SD-04a with disclosure. Never runs below-floor silently. (Q47; MANIFEST; F9Q7 Agreed 2026-09-22; research-flagged.)

### 2.9 AGENTS.md block (F9Q2)

- F9-BS-09 — AGENTS.md BLOCK: a clearly delimited, plugin-owned block appended only when absent —
  content: the thin always-on layer (retrieval-led priority, prose-first, Beads as the sole task
  tracker) + a provenance line (plugin version + date) + pointers to plugin docs. Target 50–100 lines
  (approved target, not an exact count). The Step 3 advice block (F9-BS-08) and this Step 4 plugin block
  use SEPARATE marker namespaces — neither absent-check reads the other's markers. User content OUTSIDE the blocks is never touched. Extensions
  belong outside the block. Exact marker strings and layer text = section 7 (shapes only, no invented
  strings). (F9Q2 Agreed 2026-09-21.)

### 2.10 User-edit policy (F9Q5)

- F9-BS-10 — USER-EDIT POLICY (ALL plugin-owned surfaces — both AGENTS.md blocks, the `.pi/settings.json`
  registration entry, `.gitignore` additions, the Beads advice block): absent/deleted surface → the
  next check DISCLOSES and ASKS ("block missing — re-add?") — never a silent re-add. Modified surface
  (markers intact, content changed) → the user's edit WINS; disclose divergence from the shipped version.
  Never overwrite a user edit; never silently skip a missing layer. Each AGENTS.md block is governed
  independently under its own markers. (F9Q5 Agreed 2026-09-21; F9Q8 Agreed 2026-09-22.)

### 2.11 Re-check surface (F9Q4)

- F9-BS-11 — RE-CHECK SURFACE: prose-triggered re-check is the default ("check and fix the setup"
  re-runs the idempotent pass); an explicit user-invoked command is also permitted (prose-driven means
  none required, not none allowed). No slash command required (settled prose rule). (F9Q4 Agreed 2026-09-21.)

### 2.12 Trust posture (F9Q6 + Q46)

- F9-BS-12 — TRUST POSTURE: bootstrap NEVER pauses for a trust prompt (always-trust pre-configured);
  trust is not permission — the permission system (F2) governs actions. The recorded trust auto-install
  race resolves FAIL-CLOSED: the affected step parks and discloses under the F3-SD-04a park lifecycle —
  never prompts. An F2 permission denial mid-step parks THAT step fail-closed the same way while
  remaining independent steps continue with disclosure — a mid-order park never aborts the whole pass
  when independent steps remain. (F9Q6 + Q46 Agreed 2026-09-21; band correction 2026-09-22.)

### 2.13 Invariance and spec-only status

- F9-BS-13 — F1–F8 requirements stand unchanged by anything in this feature; no seat,
  budget, ceiling, gate, evidence, license, platform, model, or prose/skill rule moves here. All
  blocking in sections 2.1–2.12 and 2.15 is a SPEC requirement, not proven runtime implementation —
  enforcement is unverified until probes decide (section 7). (F1–F8 invariance; spec-only status.)

### 2.14 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Nested-guard zero git writes; never create a nested repo (F9-BS-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks git writes and nested-repo creation inside an existing repo |
| No-clobber only-when-absent appends; user content outside the block never touched (F9-BS-06, F9-BS-07, F9-BS-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks clobbering of user files and user AGENTS.md content |
| No automatic commits, pushes, or global installs (F9-BS-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks commit/push/install side effects from bootstrap |
| Never pause for a trust prompt; fail-closed race park, never prompts (F9-BS-12) | Preventive (SPEC requirement, NOT proven implementation) | blocks trust-prompt interruption and fail-open race resolution |
| Never overwrite a user edit; never silent re-add, on any plugin-owned surface (F9-BS-10) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent user-edit overwrite and silent block re-add |
| Retry-cap park as visible parked-failure, never already-set-up (F9-BS-14) | Detective | surfaces repeated failure after the fact and routes it to a visible F3-SD-04a park |
| Blind full rerun refused; already-set-up skips (F9-BS-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks clobber-risk full reruns |
| Slash-command and re-check bails (F9-BS-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks bootstrap firing on command input or re-check paths |
| NeedsSetup signal checks per step (F9-BS-02) | Detective | surfaces which steps are missing after the fact and routes each to its step |
| Divergence and nested-context disclosures; failure-cap records (F9-BS-05, F9-BS-10) | Detective | surfaces divergence, nesting, and repeated failures after the fact and routes them to disclosure or park |
| Roster-independent prose assessments of setup state | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.15 Retry cap (research-recorded rule, promoted)

- F9-BS-14 — RETRY CAP: after 3 failures a step parks as a VISIBLE parked-FAILURE under the single
  F3-SD-04a park semantics — never labeled already-set-up, never readable as success by later passes.
  The park is re-attemptable via re-check or explicit user action. ONE park semantics in this spec
  (F3-SD-04a); no second kind. (Research-recorded tgo-dowi, promoted from constraint C8; band correction 2026-09-22.)

## 3. Constraints

C1. F9Q1–F9Q6 govern where they conflict with earlier readings
inside this scope; F1/F2/F3/F4/F5/F6/F7/F8 stand where this spec does not narrow them. C2. No
re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9 (F8-Q4
deferred) stand; this spec cross-references, never re-decides. C3. No automatic
commits, pushes, or global installs — settled (Q5); no invented installer commands. C4. No invented
marker strings, schema/merge shapes, config keys, kill-switch wiring, retry bookkeeping, or line counts
beyond the approved 50–100-line target — unknowns in section 7 stay open. C5. Never a blind full rerun;
never park when the path is clear; idempotent rerun required. C6. Never overwrite a user edit; never a
silent re-add; never silently skip a missing layer — every user-edit outcome discloses or asks, on every
plugin-owned surface (both AGENTS.md blocks, the `.pi/settings.json` registration entry, `.gitignore`
additions, the Beads advice block). C7. Kill
switches exist (setup.enabled, autoInstallBeads, autoInitGit, autoInitPiSettings — RESEARCH-RECORDED
names, pinned at build; SEPARATE scope from the F6 self-update switch). C8. Setup retry cap = 3 failures then park as a VISIBLE parked-failure under F3-SD-04a (research-recorded; promoted to F9-BS-14) — never labeled already-set-up. C9. Linux follows the F6-PD-09 best-effort posture
(composition); no platform rule moves here. C10. Spec-only status: every block is a SPEC requirement
with enforcement unverified until probes decide. C11. Controls are classed preventive,
detective, or advisory by actual function (section 2.14); SPEC-required
blocking is not proven implementation. C12. All scenarios FUTURE — not executed; no tests run.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial bootstrap consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P9-01 (F9-BS-01). Input: first real prose in the primary session on an uninitialized project / Observe: trigger check runs / Pass: the bootstrap pass fires once. FUTURE.
- P9-02 (F9-BS-01). Input: slash-command input as the first input / Observe: trigger check runs / Pass: the trigger bails — no bootstrap fires. FUTURE.
- P9-03 (F9-BS-01). Input: a re-check path invocation / Observe: trigger check runs / Pass: the trigger bails per PRD.md:227-228 — no fresh bootstrap fires. FUTURE.
- P9-04 (F9-BS-02). Input: project missing only `.pi/settings.json`, all other signals present / Observe: needsSetup check runs / Pass: only Step 2 runs; Steps 1, 3, 4 skip. FUTURE.
- P9-05 (F9-BS-03, F9-BS-04). Input: project missing git repo and AGENTS.md block, settings and beads present / Observe: repair runs / Pass: Step 1 then Step 4 run in canonical order; Steps 2–3 skip; no blind full rerun. FUTURE.
- P9-06 (F9-BS-04). Input: fully-set-up project, bootstrap re-run / Observe: idempotent pass runs / Pass: every step detects already-set-up and skips — zero writes, no park. FUTURE.
- P9-07 (F9-BS-05). Input: bootstrap inside a subdirectory of an existing repo / Observe: nested-guard check runs / Pass: in-place operation with zero git writes — Step 1 skipped only, Steps 2–4 continue, nested context disclosed; no nested repo created. FUTURE.
- P9-08 (F9-BS-06). Input: project with no repo present / Observe: Step 1 runs / Pass: `git init` runs with no initial commit and no push; `.gitignore` appended. FUTURE.
- P9-09 (F9-BS-06). Input: project with an existing repo and existing `.gitignore` / Observe: Step 1 runs / Pass: no `git init`, no `.gitignore` write, no commit, no push. FUTURE.
- P9-10 (F9-BS-07). Input: existing `.pi/settings.json` with user content, no packages registration entry / Observe: Step 2 runs / Pass: the registration entry merges in with user content intact — nothing clobbered. FUTURE.
- P9-11 (F9-BS-08). Input: bd missing, `.beads` absent / Observe: Step 3 runs / Pass: bd provisions via the installer selection with checksum verify (version floors bd >= 0.59.0 / dolt >= 2.1.0), then bd init, then bd setup + advice append. FUTURE.
- P9-12 (F9-BS-08). Input: compatible bd present, `.beads` present / Observe: Step 3 runs / Pass: no reinstall, no reinit — setup + advice append only. FUTURE.
- P9-13 (F9-BS-09). Input: project AGENTS.md exists without the plugin block / Observe: Step 4 runs / Pass: the delimited block appends (thin layer + provenance line + doc pointers, 50–100-line target); user content outside the block byte-identical. FUTURE.
- P9-14 (F9-BS-10). Input: next check finds the plugin block/markers absent (user deleted) / Observe: user-edit policy runs / Pass: discloses and asks ("block missing — re-add?") — never a silent re-add. FUTURE.
- P9-15 (F9-BS-10). Input: next check finds markers intact with user-modified content / Observe: user-edit policy runs / Pass: the user edit wins with divergence from the shipped version disclosed — never overwritten. FUTURE.
- P9-16 (F9-BS-11). Input: user prose "check and fix the setup" / Observe: re-check runs / Pass: the idempotent pass re-runs and repairs only missing steps; no slash command demanded. FUTURE.
- P9-17 (F9-BS-12). Input: bootstrap reaches a step requiring trust context / Observe: trust handling runs / Pass: never pauses for a trust prompt — always-trust applies while F2 governs the action. FUTURE.
- P9-18 (F9-BS-12). Input: trust auto-install race detected mid-step / Observe: race handling runs / Pass: the affected step parks and discloses under F3-SD-04a — fail-closed, never prompts. FUTURE.
- P9-19 (kill switches). Input: a bootstrap step whose kill switch is disabled (e.g. autoInitGit) / Observe: switch check runs / Pass: that step refuses to run and is disclosed; other enabled steps continue. FUTURE.
- P9-20 (F9-BS-14). Input: a step failing repeatedly / Observe: retry cap runs / Pass: after 3 failures the step parks as a VISIBLE parked-failure under F3-SD-04a with disclosure — never recorded as already-set-up; re-check or explicit user action may re-attempt. FUTURE.
- P9-21 (F9-BS-08). Input: bd installed but below the version floor / Observe: floor check on the present branch runs / Pass: treated as not-set-up — upgrade attempted via the verified installer path with disclosure; failure/refusal parks under F3-SD-04a; never runs below-floor silently. FUTURE.
- P9-22 (F9-BS-02). Input: `.beads` present but empty / Observe: health check runs / Pass: treated as not-set-up — Step 3 runs; never accepted as already-set-up. FUTURE.
- P9-23 (F9-BS-08/09). Input: AGENTS.md with only the Beads advice block present / Observe: Step 4 absent-check runs / Pass: the plugin block is still recognized as absent (its own marker namespace) and appends per policy; no cross-block misfires. FUTURE.
- P9-24 (F9-BS-10). Input: user deleted the `.pi/settings.json` registration entry / Observe: next check runs / Pass: discloses and asks — never a silent re-add. FUTURE.
- P9-25 (F9-BS-01). Input: first user touch is in a non-primary session / Observe: trigger check runs / Pass: no bootstrap fires; it waits for the primary session's first real prose. FUTURE.
- P9-26 (F9-BS-01). Input: a one-word or pasted user message as first input / Observe: trigger check runs / Pass: counts as real prose — bootstrap fires once; slash-command input still bails. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F9 source | Stage A / F1–F8 relation |
|---|---|---|
| F9-BS-01 trigger (ANY user-authored non-command input as real prose, primary session only; non-primary first touch waits) + slash-command bail + re-check bail | F9Q1–F9Q6 scope; F9Q9 Agreed 2026-09-22; PRD.md:227-228; RESEARCH-BACKED (slash-bail, research tgo-dowi) | Q52-style standing rules (prose-driven) |
| F9-BS-02 four independent needsSetup signals, each driving only its step; minimal health check (empty/unparseable/corrupt reads as NOT set up); project root = session working directory (single-root v1) | F9Q1 composition; band correction 2026-09-22; PRD.md:238-240 | F9-BS-04 composition |
| F9-BS-03 canonical four-step order; Q5 parenthetical SUPERSEDED | PRD.md:229-235 canonical; Q5 parenthetical recorded as superseded | Q5 provenance |
| F9-BS-04 partial-state repair; only missing steps; never blind rerun; never park when clear; idempotent skip; first-pass appends, later-absent discloses-and-asks with recorded disclosed-skip | F9Q1; band correction 2026-09-22 | Q5 additive no-clobber |
| F9-BS-05 nested-git guard; in-place, zero git writes, Step 1 skipped only, disclose | F9Q3 | Q5; F1 isolated-VC authority (untouched) |
| F9-BS-06 git init only-if-absent; no commit/push ever; .gitignore-if-absent RESEARCH-BACKED | Q5; RESEARCH-BACKED (.gitignore-if-absent, research tgo-dowi) | Q5 additive posture |
| F9-BS-07 `.pi/settings.json` create-or-merge; one-file resolution; user content never clobbered | Q5; PRD.md:231-232 | Downstream schema (section 7) |
| F9-BS-08 bd install-when-missing (installer + checksum) + bd init + bd setup/advice in its OWN marker namespace; floors bd >= 0.59.0 / dolt >= 2.1.0 on the present branch too (below-floor = NOT set up, verified upgrade, F3-SD-04a park) | Q47; MANIFEST pin; F9Q7 Agreed 2026-09-22; RESEARCH-BACKED DESIGN (setup+advice composition flagged) | MANIFEST/F4-BI/F6 installer + checksum |
| F9-BS-09 delimited plugin-owned AGENTS.md block only-when-absent; thin layer + provenance + pointers; 50–100-line target; SEPARATE marker namespace from the Step 3 advice block | F9Q2; band correction 2026-09-22 | F8 thin always-on layer (content composition) |
| F9-BS-10 absent/deleted → disclose-and-ask; modified → user wins with divergence disclosed; never overwrite; never silent skip; covers ALL plugin-owned surfaces; both AGENTS.md blocks independent | F9Q5; F9Q8 Agreed 2026-09-22 | Q6 never-silent |
| F9-BS-11 prose-default re-check; explicit command permitted; no slash command required | F9Q4 | Q52-style standing rules (prose-driven) |
| F9-BS-12 never pause for trust; trust ≠ permission (F2 governs); race fail-closed parks under F3-SD-04a; F2 denial mid-step parks THAT step fail-closed, independent steps continue | F9Q6; Q46; band correction 2026-09-22 | F2 permission system; F3-SD-04a park |
| F9-BS-14 retry cap: 3 failures → VISIBLE parked-failure under the single F3-SD-04a semantics, never already-set-up; re-attemptable | Research-recorded tgo-dowi, promoted from C8; band correction 2026-09-22 | F3-SD-04a park |
| F9-BS-13 F1–F8 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP; F8-PS; section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F9Q1–F9Q6 scope; F9Q9 Agreed 2026-09-22; PRD.md:227-228; RESEARCH-BACKED slash-bail; F9-BS-01) Bootstrap fires on any user-authored non-command input as real prose — pastes and single words included — in the primary session only; a non-primary first touch waits for the primary session — slash-command input bails the trigger and re-check paths bail too.
2. (F9Q1 composition; band correction 2026-09-22; F9-BS-02) Four independent setup signals (`.beads`, AGENTS.md markers, `.pi/settings.json`, `git rev-parse`) each drive only their own step — no signal forces a full rerun; empty `.beads`, unparseable settings, or corrupt/marker-only state reads as NOT set up; the project root is the session working directory (single-root v1).
3. (PRD.md:229-235 canonical, Q5 parenthetical SUPERSEDED; F9-BS-03) The canonical order — nested-guard/git-init, settings registration, bd init/setup/advice, AGENTS.md block — supersedes the earlier Q5 parenthetical reading, which stands as provenance only.
4. (F9Q1; band correction 2026-09-22; F9-BS-04) Only missing steps run in canonical order — never a blind full rerun, never a park when the path is clear, and idempotent reruns skip what is already set up; the FIRST pass appends only-when-absent while a LATER absent block discloses-and-asks with a "no" recorded as a disclosed-skip.
5. (F9Q3; F9-BS-05) Inside a nested repo the bootstrap works in place with zero git writes — Step 1 alone skips, Steps 2–4 continue, the nesting is disclosed, and no nested repo is ever created.
6. (Q5; RESEARCH-BACKED .gitignore rule; F9-BS-06) Git initializes only when no repo exists — no initial commit, no push ever — and `.gitignore` appends only when absent.
7. (Q5; one-file resolution; F9-BS-07) `.pi/settings.json` gains its packages registration entry by create-or-merge — the ".pi/settings registration" string names the action, `.pi/settings.json` is the one file — with user content never clobbered.
8. (Q47; MANIFEST; F9Q7 Agreed 2026-09-22; RESEARCH-BACKED DESIGN flagged; F9-BS-08) Beads sets up as installer-verified bd when missing (checksum per MANIFEST/F4/F6, floors bd >= 0.59.0 / dolt >= 2.1.0 enforced on the present branch too — below-floor reads as NOT set up with a disclosed verified upgrade, refusal/failure parking under F3-SD-04a), bd init when `.beads` is absent, then bd setup plus advice append into its OWN marker-namespaced block — the setup-plus-advice composition is research-backed design with no Q-line behind that exact shape.
9. (F9Q2; band correction 2026-09-22; F9-BS-09) The project AGENTS.md gains a delimited plugin-owned block only when absent — thin always-on layer (retrieval-led, prose-first, Beads sole tracker) plus provenance (plugin version + date) plus plugin-doc pointers, targeting 50–100 lines, in a marker namespace SEPARATE from the Step 3 advice block — while user content outside the blocks stays untouched and extensions live outside them.
10. (F9Q5; F9Q8 Agreed 2026-09-22; F9-BS-10) A missing or deleted plugin-owned surface (either AGENTS.md block, the settings registration entry, `.gitignore` additions, the advice block) discloses and asks instead of silently re-adding; a user-modified surface (markers intact) wins with its divergence disclosed — user edits are never overwritten and missing layers never silently skipped; each AGENTS.md block is governed independently.
11. (F9Q4; F9-BS-11) Re-checks run on prose by default with an explicit command permitted — prose-driven means none required, not none allowed.
12. (F9Q6 + Q46; band correction 2026-09-22; F9-BS-12) Bootstrap never pauses for trust — always-trust is pre-configured, F2 governs actions because trust is not permission — and the trust auto-install race fails closed into an F3-SD-04a park with disclosure, never a prompt; an F2 denial mid-step parks THAT step the same way while independent steps continue.
13. (Derived; F9-BS-13) F1–F8 rules do not move for bootstrap work, and every block here is a spec requirement awaiting probe proof.
14. (Research-recorded, promoted; F9-BS-14) After 3 failures a step parks as a VISIBLE parked-failure under the single F3-SD-04a semantics — never labeled already-set-up, never readable as success — re-attemptable via re-check or explicit user action.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Exact AGENTS.md marker strings and thin-layer text (shapes only here — no strings invented).
2. `.pi/settings.json` schema/merge shape for the packages registration entry (no schema set here).
3. Kill-switch wiring for setup.enabled, autoInstallBeads, autoInitGit, autoInitPiSettings (RESEARCH-RECORDED names, pinned at build; scope SEPARATE from the F6 self-update switch).
4. Retry bookkeeping for the setup retry cap (3 failures then VISIBLE parked-failure under F3-SD-04a per F9-BS-14, research-recorded) — counting scope and park record shape.
5. bd setup + advice-append composition mechanics (RESEARCH-BACKED design — confirm the exact command sequence at build).
6. Installer selection and checksum-verify mechanics shared with MANIFEST/F4/F6 (no commands set here).
7. Explicit user-invoked re-check command shape (permitted, not required — name and binding downstream).
8. Provenance-line format (plugin version + date) and plugin-doc pointer targets.
9. Monorepo/multi-root project-root determination (v1 assumes the session working directory as single root).

Implementation probes (runtime evidence before build claims):

1. Trigger proof: first-prose fires once; slash-command input bails; re-check paths bail.
2. Partial-repair proof: only missing steps run in canonical order; already-set-up passes with zero writes.
3. Nested-guard proof: zero git writes inside a nested repo; Steps 2–4 still complete with disclosure.
4. No-clobber proof: existing settings, git state, and AGENTS.md user content survive adversarial pre-existing content.
5. User-edit proof: missing block discloses-and-asks; modified block wins with divergence disclosed.
6. Trust proof: no trust-prompt pause across a full bootstrap; injected race parks fail-closed under F3-SD-04a.
7. Empirical proof that chosen Pi hooks, installers, or adapters enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. Marker strings, schema/merge shapes, kill-switch wiring, retry bookkeeping, installer commands, and exact line counts beyond the 50–100 target are explicitly unknown here — downstream, never invented.
2. Same-model review anchoring risk remains; the fresh-session artifact packet is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
3. The bd setup + advice-append composition, slash-bail, `.gitignore`-if-absent, retry cap 3, and kill-switch names are research-recorded (tgo-dowi), not user-decided — flagged wherever they appear.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8 digests and F9 digest (this feature's authority where they differ; Q5 parenthetical supersession and research-backed flags noted).
- `../PRD.md` — Stage A frame; section 4.1 auto-init (trigger, canonical order, signals) cross-referenced here (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; bootstrap, installer, and interception gaps stay open there.
- `README.md` — Stage B index; this is feature 9 of 13.
