# Feature F4 — Beads integration (Dispatch)

Status: user-approved, independently reviewed, implementation unverified; requirements F4Q1–F4Q6 settled as directed (runtime unverified). No implementation. No installs. No code. User-approved with 2026-09-21 band-review amendment batch; band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved).
No commits or pushes. Fourth Stage B feature spec; remaining 9 areas stay stubs
(see `README.md`). All scenarios FUTURE, not executed. Ready for primary closure; tracker still open.
Historical Q1–Q51 and prior amendments are subordinate to settled F4Q1–F4Q6
where they conflict for this scope. Approved F1/F2/F3 requirements stand
untouched.

## 0. Objective

Define how Dispatch uses Beads as its sole task tracker without letting tracker
state substitute for approval, evidence, or verified completion: which issues
may be created before implementation approval, how an existing tracker is
adopted, how live human tracker edits govern running work, how run ownership
resolves collisions, how outages bound continuation, and how uncertain mutation
outcomes reconcile before retry. Covers pre-approval creation, compatible
adoption, live reconciliation, ownership, outage behavior, and safe retry.
CLI spellings, runtime APIs, lease TTLs, and store schemas are downstream, not this spec.

Stable requirement IDs `F4-BI-01` … `F4-BI-12`. Sources trace to settled F4Q1–F4Q6
plus F1/F2/F3 and prior Stage A amendments where noted; mappings are multi-source
where a rule draws on more than one source — no one-to-one fiction. Section 5 holds
the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (tracker contract, lifecycle rules, acceptance only):

1. Pre-approval issue creation scope and its execution boundary.
2. Existing-tracker adoption, compatibility and identity checks, damage handling.
3. Live-tracker reconciliation, ownership collision, outage, and retry rules.
4. Tracker lifecycle state versus journal versus evidence.
5. Dependency-graph validation and park rules for tracker-scheduling purposes.

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat responsibilities, review packets, repair budgets — F1 owns; here only
   ownership, ceiling, and budget invariance hold.
2. Permission configurability and fixed integrity — permissions spec owns; here
   only the scope/waiver boundary holds.
3. Approval gates, deviation classes, verdict binding, waiver shape — F3 owns;
   here only tracker linkage and evidence separation hold.
4. Worktree placement, identity algorithms, session mechanics, memory
   admission, model pins — unchanged, owned elsewhere.

Not in this feature:

1. Exact Beads CLI spellings, host API names, lease TTL values, database
   schemas, retry counters, worktree identity algorithms, journal store
   formats — all downstream (section 7).
2. Any claim that current Beads binaries, Pi hooks, guards, or adapters
   already implement sections 2–3. Proof is future work.
3. The integrated primary spec or any next-feature content. One feature at a
   time per user request; integration follows.

## 2. Interfaces

### 2.1 Pre-approval creation boundary

- F4-BI-01 — Planning, research, decision, and proposed-implementation issues
  MAY be created before implementation approval. Creation never authorizes
  execution. Research proceeds only inside its separately authorized scope.
  Implementation stays gated on the F3 combined approval plus valid authority.
  Issue text never counts as privileged approval. (F4Q1; F3-SD-01, F3-SD-08.)

### 2.2 Compatible adoption

- F4-BI-02 — An existing COMPATIBLE tracker is auto-adopted after a compatibility
  plus project-identity check. Adoption preserves issues, configuration, owners,
  dependencies, and history. No reinit, no silent migration, no unrelated claim.
  Incompatibility or store damage is disclosed; repair or migration is authorized
  separately from a missing-binary install. Scope, permission, and completion gates
  are never waived merely to repair the tracker. The compatibility plus project-identity check reads
  a first snapshot of the store being adopted as the adoption baseline (not "live state" in the
  F4-BI-09 sense); recording the adoption is the one permitted mutation exception, recorded; all other
  mutations wait. (F4Q2.)

### 2.3 Live tracker governs running work

- F4-BI-03 — Live human tracker changes govern task state. The Dispatcher
  reconciles the running assignment against the live tracker before affected
  continuation: an edit that withdraws or contradicts an assignment stops new
  affected actions, preserves artifacts and evidence, reports underway effects,
  and parks the affected branch. No silent undo, no silent reopen. A manual
  close never reads as tests-passed, Expert verdict, or deployment permission,
  and never deploys directly. A manual reopen neither renews approval by itself
  nor revokes a still-valid prior approval by itself: missing or revoked
  approval blocks, while a valid covering approval still in scope and duration
  may resume after the required live ownership and evidence checks without
  redundant human approval. When work resumes after a manual reopen under a valid covering approval,
  the resume is recorded and disclosed (notice that work resumed after a tracker change) so the user
  sees it; scope plus duration alone is not proof of continued intent. Independent work proceeds.
  (F4Q3; F1-AR-14; F3-SD-07.)

### 2.4 Run ownership and collisions

- F4-BI-04 — Run ownership stays distinct from the human assignee field. No takeover
  follows from idleness alone or from a matching username alone. A verified same-run
  recovery may proceed per existing session policy. A possible other-run owner or an
  ambiguous collision parks the conflicting assignment and asks before any transfer;
  independent work continues. Park clearance follows the F3 park lifecycle (BQ1+BQ2): ambiguous-ownership
  parks need the user. Requirements and planning stay authoritative over
  scheduling. (F4Q4; F1 delegation envelope and session rules.)

### 2.5 Outage behavior

- F4-BI-05 — During a tracker outage: NO new claims, delegations, lifecycle
  mutations, or completion declarations. An already-running specialist MAY
  finish the CURRENT already-authorized bounded reversible unit, then preserve
  artifacts and evidence and park — no next task, no consequential external
  action — and only with no independent authority or ownership doubt. Cached
  state never grants new authority. Authority or ownership uncertainty, or
  revoked approval, still stops affected work; the outage exception never
  bypasses it. The outage is disclosed. After restore, ownership, state, and
  evidence reconcile before resume. A durable pending-operation and result
  journal is allowed as memory, never as a second task authority; no offline
  completed claims. A bounded reversible unit means a unit of work named in the assignment with recorded
  preconditions, postconditions, and effects confined to the approved scope; its effects are
  reversible-or-compensatable within that scope; the unit is declared before it starts (recorded in the
  dispatch or park record). (F4Q5.)

### 2.6 Uncertain outcomes and safe retry

- F4-BI-06 — An uncertain typed lifecycle mutation outcome (create, claim, close, update, dep, reopen,
  and any others in the validated set) reconciles BEFORE retry against live evidence. Confirmed original
  success reconciles without replay and is never retried. Confirmed nonexecution may retry. Remaining
  ambiguity parks the operation: no blind replay, no suspected-duplicate
  delete, no orphan-close cleanup. A retry is safe only when supported by
  operation identity plus live evidence — never on a bare assertion that Beads
  supports idempotency keys. Similar title or close time alone is not identity.
  F1 concurrency and repair budgets never grow on retry. (F4Q6; F1-AR-10,
  F1-AR-12.)

### 2.7 Cross-feature holds

- F4-BI-07 — Beads is the sole task tracker. Repo spec files are the
  requirements source of truth with revision and hash references; no markdown
  task database stands beside Beads. Only the Dispatcher performs typed
  validated lifecycle mutations; specialists hold scoped reads, no mutation.
  The Writer owns project artifacts; plugin-service journal persistence is
  separate and is not Writer editing. (Settled cross-feature; Q48;
   DECISIONS standing-rules record; amendment D; F1-AR-02; F3-SD-05,
   F3-SD-12.)
- F4-BI-08 — Execution, approval, and review evidence are distinct kinds,
  each linked to its revision. Clean completion, accepted-with-exceptions,
  and blocked or partial outcomes stay distinct. A task waiver never covers
  its feature. Manual closed tracker state never equals Dispatch verified
  completion, which needs the applicable required checks plus covering review
  plus valid approval — never a universal code-test execution for non-code
  tasks or already-authorized waivers, and never a fabricated test pass.
  (Settled cross-feature; F1-AR-04, F1-AR-11; F3-SD-09, F3-SD-10.)
- F4-BI-09 — While the tracker is reachable, scheduling, claims, delegations,
  lifecycle mutations, completion declarations, and affected authorization
  boundaries validate against live tracker state before proceeding; a stale
  cached board view never authorizes. During an outage only the narrowed
  F4-BI-05 exception governs: the current already-authorized bounded
  reversible unit may finish with no independent authority or ownership doubt,
  and cached state never grants new authority. No zero-race or atomicity
  guarantee is claimed unless proven; run-level coordination mechanisms are
  downstream. No polling TTL is set here. (Settled cross-feature; F1-AR-14;
  F3-SD-07.)
- F4-BI-10 — A missing Beads binary installs with the plugin on Windows and macOS.
  An existing install or store is never silently upgraded or migrated. No exact versions
  or install commands are invented here; prior unverified version claims are not sources. (Q47; MANIFEST required class.)
- F4-BI-11 — Dependency edges and ready work validate before scheduling.
  A cycle or a contradictory-ownership edge parks affected scheduling while
  independent work proceeds. A parked cycle resumes on mechanical resolution
  or on a human decision where a decision is needed; no human approval is
  demanded for a mechanically explained cycle alone. No automatic rewrite of
  user-authored dependencies; requirements and planning stay authoritative
  per F3. (Derived requirement; F3-SD-06, F3-SD-12.)
- F4-BI-12 — F1 ceilings (3 Writers, 3 Seekers, 2 Experts per project plus
  configurable machine-wide 8) are unchanged by outage, retry, ownership, or
  spec revision. The task budget (initial plus at most two repair/re-review
  cycles) and ONE shared integration budget (initial plus at most two across
  newly introduced integration findings) are unchanged; an exhausted task
  failure is never rescued inside the integration budget and neither budget
  resets. Cross-worktree project identity is required behavior; its algorithm
  is downstream. Tracker lifecycle state, the execution journal cache, and
  review evidence explain each other without duplicating authority.
  (Settled cross-feature; F1-AR-10, F1-AR-12.)

### 2.8 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block;
nothing here claims the runtime implements it — enforcement is unverified until probes decide, and no transition observation is claimed.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Pre-approval execution block; creation never authorizes (F4-BI-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks affected execution until F3 approval plus valid authority hold |
| Live validation of scheduling/claims/delegations/lifecycle/completion (F4-BI-09; F4-BI-05 outage exception) | Preventive (SPEC requirement, NOT proven implementation) | refuses affected action on stale or missing live confirmation; outage permits only the narrowed bounded-unit finish |
| Outage new-work block; uncertain-outcome retry block (F4-BI-05, F4-BI-06) | Preventive (SPEC requirement, NOT proven implementation) | refuses new claims/mutations/completions and blind replays |
| Ownership-collision park-and-ask; dependency-cycle park (F4-BI-04, F4-BI-11) | Preventive (SPEC requirement, NOT proven implementation) | parks conflicting scheduling for a human decision; parked cycles resume on mechanical resolution or a human decision where needed |
| Live-change detection: manual close/reopen/edit surfacing (F4-BI-03) | Detective | surfaces a tracker change after the fact and routes it to reconcile |
| Journal, park records, disclosure records (F4-BI-03, F4-BI-05, F4-BI-06) | Detective (reporting) | leaves an after-the-fact evidence trail with no authority of its own |
| Compatibility and identity assessment; damage disclosure (F4-BI-02) | Advisory judgment alone; preventive only when paired with the adoption gate | classification advises, the gate enforces |

## 3. Constraints

C1. F4Q1–F4Q6 govern where they conflict with earlier readings inside this
scope; F1/F2/F3 stand where this spec does not narrow them. C2. Creation never
authorizes execution; issue text never approves; research stays in separately
authorized scope. C3. No reinit, silent migration, unrelated claim, silent
upgrade of an existing install or store, or silent undo/reopen. C4. No takeover
on idle or username match alone; no transfer before park-and-ask on ambiguity.
C5. No new claims, delegations, mutations, or completion declarations during
outage; no next task or consequential external action past the current bounded
unit; no offline completed claims. C6. No retry before live reconcile; no
identity from title/time similarity; no duplicate delete or orphan-close
cleanup. C7. No stale-board authorization outside the narrowed F4-BI-05 outage exception; no zero-race claim unless proven; no invented polling TTL.
C8. No task-database markdown; no tracker-state-as-verdict; no task-waiver-
as-feature-waiver; no deploy from task close; no scope/permission/completion
waiver merely to repair the tracker. C9. No budget or ceiling change by outage,
retry, ownership, or revision. C10. No invented CLI spellings, APIs, TTLs,
schemas, versions, or install commands; unknowns in section 7 stay open.
C11. Controls are classed preventive, detective, or advisory by actual function
(section 2.8); SPEC-required blocking is not proven implementation.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial tracker consistency; this file owns
ID/link consistency only.
Format per scenario: setup/action/observable-result. Every scenario is FUTURE.

- BI-01 (F4-BI-01). Planning issue drafted before implementation approval, then
  execution attempted / creation allowed with research inside authorized scope,
  execution refused until F3 approval; issue present, research bounded, gate holds. FUTURE.
- BI-02 (F4-BI-02). Existing tracker with issues, config, owners, deps / adoption attempted /
  compatibility plus project-identity check recorded, all content preserved, no reinit or migration. FUTURE.
- BI-03 (F4-BI-02). Damaged store detected / adoption attempted / damage
  disclosed with repair/migration parked for separate authorization; silent
  repair refused. FUTURE.
- BI-04 (F4-BI-03). Manual close lands mid-run / affected continuation attempted /
  running assignment reconciled, artifacts preserved, underway effects reported,
  affected branch parked, no verified-completion claim. FUTURE.
- BI-05 (F4-BI-03). (a) Manual reopen lands with missing or revoked approval /
  continuation attempted / affected work stays parked until the F3 gate passes;
  (b) manual reopen lands with a valid covering approval still in scope and
  duration / continuation attempted / required live ownership and evidence
  checks run, then work resumes without redundant human approval. FUTURE.
- BI-06 (F4-BI-04). Same-username second runner appears while the run holds the
  assignment / transfer attempted / takeover on username alone refused, conflicting
  assignment parked, human asked, independent work proceeds. FUTURE.
- BI-07 (F4-BI-04). Verified same-run recovery versus ambiguous other-run owner /
  recovery attempted in each case / same-run recovery proceeds per session policy
  while the ambiguous case parks and asks before transfer. FUTURE.
- BI-08 (F4-BI-05). Outage declared mid-run / new claim, delegation,
  mutation, and completion attempted / all four refused with disclosure.
  FUTURE.
- BI-09 (F4-BI-05). Bounded authorized reversible unit underway at outage /
  run continues / current unit finishes with artifacts preserved then parks;
  next task and consequential external action refused. FUTURE.
- BI-10 (F4-BI-05). Restore reveals the assignment was revoked during the
  outage / resume attempted / affected work stays stopped until fresh
  authority; outage exception cited as no bypass. FUTURE.
- BI-11 (F4-BI-06). Uncertain typed lifecycle mutation outcome (create, claim, close, update, dep,
  reopen, or any other in the validated set) reconciled against live evidence: (a) confirmed original
  success reconciles without replay and is not retried; (b) confirmed nonexecution retries safely on
  operation identity; (c) remaining ambiguity parks with no replay and no duplicate created. FUTURE.
- BI-12 (F4-BI-06). Two similar-titled issues created near the same time /
  dedup attempted / both preserved as distinct absent identity evidence; no
  suspected-duplicate delete or orphan-close cleanup. FUTURE.
- BI-13 (F4-BI-11). Dependency cycle plus contradictory-ownership edge /
  scheduling attempted / affected scheduling parked with the cycle named;
  independent work proceeds; user deps unrewritten; parked cycle resumes on
  mechanical resolution or a human decision where needed. FUTURE.
- BI-14 (F4-BI-09). Stale cached board shows an open assignment the live
  tracker closed while the tracker is reachable / claim attempted / live state
  governs, stale view refused. FUTURE.
- BI-15 (F4-BI-08). Residual risk accepted on one task, feature closure
  attempted / closure / task recorded accepted-with-exceptions with scope
  named; feature blockers remain, never a clean pass. FUTURE.
- BI-16 (F4-BI-08). Manual closed state with thin evidence / verified
  completion claimed / refused: applicable required checks plus covering review
  plus valid approval required — no universal code-test demand, no fabricated
  pass; manual closed stays distinct. FUTURE.
- BI-17 (F4-BI-10). Missing binary on a fresh machine versus existing store
  present / install attempted / missing case installs with the plugin while
  the existing case sees no silent upgrade or migration. FUTURE.
- BI-18 (F4-BI-05). Pending-operation journal held offline through an outage /
  completion claimed from the journal / refused: journal reads as memory,
  reconciliation after restore required first. FUTURE.
- BI-19 (F4-BI-03). Live edit withdraws the assignment's scope mid-run / new affected
  action attempted / new affected actions stop, artifacts preserved, underway effects reported, affected branch parked. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F4 source | Stage A / F1 / F2 / F3 relation |
|---|---|---|
| F4-BI-01 pre-approval creation; creation != execution; research in authorized scope | F4Q1 | Q15 approval; DECISIONS standing-rules record; F3-SD-01, F3-SD-08 gates |
| F4-BI-02 compatible auto-adopt; preserve all; disclose damage; separate repair auth | F4Q2 | Q47 install-with-plugin; Q48 hash pointers; F1-AR-09 user-tree protection |
| F4-BI-03 live governs; reconcile; stop-new-affected; preserve/report/park; close/reopen limits | F4Q3 | Q15 re-approval; Q18 branch discipline; F1-AR-14; F3-SD-07 |
| F4-BI-04 distinct run ownership; no idle/username takeover; park-and-ask | F4Q4 | Q31–Q35 session rules; F1-AR-13 envelope identity |
| F4-BI-05 outage no-new-work; bounded finish then park; disclose; reconcile; journal as memory | F4Q5 | Q17 bounded work; Q35 crash/timeout; F1-AR-12 budgets |
| F4-BI-06 paired reconcile: confirmed-success no-replay, confirmed-nonexecution retry, ambiguity parks | F4Q6 | Q35 bounded retry; Q32 resumable bar; F1-AR-10 ceilings |
| F4-BI-07 sole tracker; repo SSOT; Dispatcher-exclusive mutation; scoped reads | Settled cross-feature | Q48 store; DECISIONS standing-rules record; amendment D; F1-AR-02; F3-SD-05, F3-SD-12 |
| F4-BI-08 evidence separation; applicable checks; clean vs exceptions vs blocked; task vs feature; manual vs verified | Settled cross-feature | F1-AR-04, F1-AR-11; F3-SD-09, F3-SD-10 |
| F4-BI-09 narrowed live validation; stale never authorizes; F4-BI-05 outage exception; no race guarantee, no TTL | Settled cross-feature | F1-AR-14; F3-SD-07; F4-BI-05; EVIDENCE open items |
| F4-BI-10 missing-binary install with plugin; never silent upgrade/migrate | Settled cross-feature | Q47; MANIFEST required class |
| F4-BI-11 dependency validation; cycle/contradiction parks; mechanical-or-human resume; no auto rewrites | Derived requirement | F3-SD-06, F3-SD-12; requirements authoritative |
| F4-BI-12 ceilings unchanged; task + ONE shared integration budget; no rescue/reset; identity required; state vs journal vs evidence | Settled cross-feature | F1-AR-10, F1-AR-12; EVIDENCE omissions inventory |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F4Q1; F4-BI-01) Planning, research, decision, and proposed-implementation issues may be created before implementation approval; creation authorizes nothing; research stays inside its separately authorized scope; implementation waits for the F3 gate; issue text is never approval.
2. (F4Q2; F4-BI-02) An existing compatible tracker is adopted after compatibility and project-identity checks with issues, configuration, owners, dependencies, and history preserved; no reinit, silent migration, unrelated claim, or silent upgrade; incompatibility or damage is disclosed and repaired only under separate authorization.
3. (F4Q3; F4-BI-03) Live human tracker changes govern running work: withdrawn or contradicted assignments stop new affected actions; artifacts and evidence are preserved; underway effects are reported; affected branches park; nothing is silently undone or reopened; manual close is never a test result, verdict, or deployment permission; manual reopen neither grants approval nor revokes still-valid approval alone.
4. (F4Q4; F4-BI-04) Run ownership is distinct from the assignee field; idleness or a matching username alone transfers nothing; verified same-run recovery follows existing session policy; possible other-run ownership or ambiguity parks the conflicting assignment for a human decision before any transfer.
5. (F4Q5; F4-BI-05) During an outage there are no new claims, delegations, mutations, or completion declarations; only the current already-authorized bounded reversible unit may finish when no authority or ownership doubt exists, then parks with artifacts preserved; cached state grants no new authority; the outage is disclosed; restore requires ownership, state, and evidence reconciliation first; the journal is memory only.
6. (F4Q6; F4-BI-06) Uncertain typed lifecycle mutation outcomes (create, claim, close, update, dep, reopen, and any others in the validated set) reconcile against live evidence before any retry: confirmed success is recorded without replay, confirmed nonexecution may retry, remaining ambiguity parks; retries need operation identity plus live evidence; title or time similarity is not identity; no blind replay, duplicate deletion, or orphan-close cleanup.
7. (Cross-feature; F4-BI-07) Beads is the sole tracker; repo spec files are the requirements source of truth with revision and hash references; no markdown task database stands beside Beads; only the Dispatcher mutates lifecycle state through typed validated tools; specialists read in scope; artifact editing and journal persistence are separate.
8. (Cross-feature; F4-BI-08) Execution, approval, and review evidence are distinct and revision-linked; clean completion, accepted-with-exceptions, and blocked or partial outcomes are recorded distinctly; a task waiver covers only its task; manual closed state is distinct from verified completion, which requires the applicable required checks, covering review, and valid approval.
9. (Cross-feature; F4-BI-09) While the tracker is reachable, scheduling, claims, delegations, lifecycle mutations, completions, and affected authorization boundaries validate against live state; stale cached views never authorize; during outage only the narrowed F4-BI-05 exception applies; no zero-race guarantee is claimed and no polling TTL is set.
10. (Cross-feature; F4-BI-10) A missing binary installs with the plugin on Windows and macOS; an existing install or store is never silently upgraded or migrated; no versions or commands are invented here.
11. (Derived; F4-BI-11) Dependency edges and ready work validate before scheduling; cycles and contradictory ownership park affected scheduling while independent work proceeds; parked cycles resume on mechanical resolution or a human decision where needed; user-authored dependencies are never rewritten automatically; requirements and planning govern.
12. (Cross-feature; F4-BI-12) Ceilings and both repair budgets are unchanged by outage, retry, ownership, or revision; the integration budget is ONE shared initial-plus-max-two across newly introduced integration findings; exhausted task failures are never rescued inside it and neither budget resets; cross-worktree identity is required with its algorithm downstream; tracker state, journal cache, and review evidence do not duplicate authority.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Typed operation set and validation schemas for Dispatcher Beads mutations
   and scoped specialist reads.
2. Compatibility plus project-identity check content and its record shape.
3. Pending-operation and result journal schema, retention, and explicit non-authority marking.
4. Dependency validation content and ready-work computation for scheduling.
5. Refusal/disclosure verbatim strings for adoption, reconcile, outage, ownership-ask, and retry-park outcomes.

Implementation probes (runtime evidence before build claims):

1. Live-tracker read freshness and pre-action check coverage across every
   tool/API surface; observation gaps stay open.
2. Outage detection and restore-reconcile behavior under real disconnects.
3. Operation-identity availability in live Beads evidence; no idempotency-key
   support asserted until observed.
4. Cross-worktree project-identity algorithm and multi-root behavior
   (EVIDENCE omissions inventory item 1 only; item 2 scope overlap is not identity).
5. Run-level coordination and residual race behavior; no atomicity claimed
   until measured.
6. Empirical proof that chosen Beads binaries, Pi hooks, guards, or adapters
   enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. CLI spellings, API shapes, lease TTLs, store schemas, and exact install commands
   are explicitly unknown here; prior unverified version claims (including remembered bd or dolt floors) are not reused as sources.
2. Same-model review anchoring risk remains; the fresh-session artifact packet
   is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
3. Donsetch pinning, interface choice, and AGPL boundary review are owned
   elsewhere and unchanged here.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3 digests and F4 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; Beads lifecycle, install,
  observation, and multi-root gaps stay open there.
- `README.md` — Stage B index; this is feature 4 of 13.
