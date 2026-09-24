# Feature F5 — Delegated sessions and recovery (Dispatch)

Status: user-approved, independently reviewed, implementation unverified.
Requirements F5Q1–F5Q5 settled as directed, runtime unverified; issue OPEN. No implementation, installs,
code, commits, or pushes. User-approved with 2026-09-21 band-review amendment batch; band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved). Fifth Stage B feature spec; remaining 8 areas stay stubs (see `README.md`).
All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled
F5Q1–F5Q5 where they conflict for this scope. Approved F1/F2/F3/F4 requirements stand untouched.

## 0. Objective

Define how Dispatch reuses, cancels, recovers, rolls over, and preserves
delegated Writer/Seeker sessions under rules that REQUIRE no authority leaks, effect replays,
or budget resets (enforcement unverified until probes decide): resumable bar and identity gates, completed/cancelled
ineligibility, Expert always-fresh rule, branch-vs-run cancellation, ownership
handover safety, bounded crash recovery, planned rollover, fresh/backup dispatch,
outage behavior, and handback preservation. Envelope, evidence, budget, ceiling,
Git, drift, and permission rules from F1–F4 hold unchanged. Mechanism choice
(session APIs, schemas, isolation internals, retention values) is downstream,
not this spec.

Stable requirement IDs `F5-DS-01` … `F5-DS-12`. Sources trace to settled
F5Q1–F5Q5 plus Q31–Q35 plus F1/F2/F3/F4 where noted; mappings are multi-source
where a rule draws on more than one source — no one-to-one fiction. Section 5
holds the trace table; section 6 organizes the digest by requirement with source
labels. Derived invariants are labeled derived.

## 1. Files / artifact boundaries

Owned by this feature (session contract, recovery rules, acceptance only):

1. Partial-session resume eligibility, identity gates, and fresh-dispatch fallback.
2. Cancellation scope (named task/branch vs whole run) and its stop/request/preserve/report duties.
3. Ownership handover safety: release only after stop or safe isolation.
4. Crash/timeout recovery budget, reconcile-before-recovery, and no-replay rule.
5. Planned rollover envelope, checkpoint content, and budget-persistence rule.
6. Backup-model freshness, authority revalidation, and park rule.
7. Handback preservation, retention classes, and disclosure-before-delete rule.
8. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only Dispatcher exclusivity and journal-as-memory hold.
2. Seat responsibilities, review packets, repair budgets, ceilings — F1 owns; here only invariance holds.
3. Permission configurability and fixed integrity — permissions spec owns; here only guard and no-restoration holds.
4. Approval gates, deviation classes, verdict binding, waiver shape — F3 owns; here only revision binding and applicability hold.
5. Worktree placement, memory admission, retrieval chain, bootstrap order, model SKU pins — unchanged, owned elsewhere.

Not in this feature:

1. Exact session APIs, schemas, isolation internals, retention numbers, retry timers, polling TTLs, CLI spellings — all downstream (section 7).
2. Any claim that current Pi APIs, hooks, guards, or adapters already implement sections 2–3. Proof is future work.
3. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Resume eligibility and identity

- F5-DS-01 — Partial Writer/Seeker sessions MAY resume only when all hold:
  recorded progress plus a non-terminal run record plus under the preset token
  budget plus equal identity plus current permission validation with no narrowing
  since capture; narrower permissions may allow a fresh authorized dispatch, never
  a relaxed resume. Normal lazy loading
  under the SAME verified tool/skill policy may be compatible; actual skill/tool
  definition, version, or grant drift remains subject to identity checks, and the
  exact adapter mechanics are unproven (section 7). Arbitrary definition changes
  are never treated as benign. (F5Q3, F5Q4; Q31, Q32, Q34.)
- F5-DS-02 — Identity equality covers model plus variant plus preset plus seat
  config plus tools/skills plus host version. A failed resume identity check
  means fresh revalidated dispatch, never a relaxed resume. A named backup model
  is always a fresh dispatch with logged notice, never an exception to equality.
  (F5Q4; Q32, Q34; Q43 backup.)
- F5-DS-03 — Completed sessions are never reused. Cancelled specialist sessions
  are never reused. Expert REVIEW sessions are always fresh and receive the
  approved spec, artifacts, tests, and findings — never the raw consultation
  transcript. No Expert consultation-reuse policy is invented here. (F5Q1; Q31,
  Q33; amendment B; F1-AR-03, F1-AR-11.)

### 2.2 Cancellation and ownership handover

- F5-DS-04 — Cancellation targets the NAMED task or branch and its associated
  invocations only; the whole run cancels only when explicitly asked. Cancel
  stops new affected actions, requests cancellation of underway affected work,
  preserves artifacts and evidence, reports underway and uncertain outcomes, and
  parks the affected branch. Park clearance follows the F3 park lifecycle (BQ1+BQ2). Independent work
  continues. Cancellation promises no rollback of external effects. A restart after cancellation needs a user
  instruction plus a fresh session; an existing valid spec approval still in
  scope is not redundantly re-requested. (F5Q1; Q35 cancel-means-fresh; Q18,
  F3-SD-04 branch discipline.)
- F5-DS-05 — Ownership is not released until the previous Writer has stopped or
  is safely isolated. An old process still able to write blocks handover: the
  replacement does not own the work until stop or safe isolation is confirmed.
  Safe isolation is a state-safety requirement whose mechanism is unproven
  (section 7). A cancellation or kill-request acknowledgment is not proof that
  no process still writes; a planned checkpoint reference is not proof of an
  actual completed effect. When stop cannot be confirmed after bounded stop-request attempts, ownership
  stays withheld, the replacement does not act, and the situation escalates to the user under the park
  rules (F3-SD-04a); never an indefinite silent block. (F5Q1; derived handover invariant.)

### 2.3 Crash recovery and planned rollover

- F5-DS-06 — Crash/timeout infrastructure recovery allows at most TWO automatic
  attempts PER TASK. Earlier escalation fires on repeated non-progress ("repeated non-progress" means two
  or more consecutive progress evaluations showing no forward movement; detector mechanics downstream),
  uncertain external effects, or ownership conflict. This crash budget is
  separate from the task repair/re-review budget and the integration budget;
  none resets across sessions. Recovery reconciles against live evidence first;
  confirmed actions are never replayed. (F5Q2; Q35 bounded retries; F1-AR-12.)
- F5-DS-07 — Planned context rollover is a fresh Writer/Seeker dispatch with a
  validated F1 envelope plus a recorded checkpoint holding: the approved
  assignment, the relevant exact user instructions with provenance, artifacts,
  findings, open questions, and remaining budgets — never the full transcript.
  The outgoing session stops acting before the replacement owns the work.
  Planned rollover is not charged as a crash-budget attempt, but it resets no
  limit and conceals no non-progress: budgets persist and history travels. Any crash of the outgoing
  session before handover completes is charged to the outgoing task's crash count; any crash of the
  replacement after dispatch is charged to the replacement's task. (F5Q3; F1-AR-13 envelope.)

### 2.4 Fresh, backup, and authority validation

- F5-DS-08 — Failed identity, completed/cancelled ineligibility, revoked
  authority, or missing resumable state all prohibit in-place reuse. A fresh
  dispatch under the F1 envelope with revision-bound evidence follows ONLY when
  the work is actually authorized: cancelled work restarts only on user
  instruction per F5-DS-04, completed follow-ups need an authorized assignment —
  never an automatic restart. Current authority and assignment are validated
  before any launch; revoked or insufficient authority parks the work, never
  launch-then-validate. A fresh session does not redundantly re-request spec
  approval already validly covering the work. Quoted or retrieved text never grants authority.
  Context requests flow via the Dispatcher inside scope and remaining budget with no scope or budget
  escalation. The user-approved F3 editorial applicability assessment stands:
  an editorial change may carry a linked assessment instead of invalidating or
  stale-carrying a verdict; uncertain coverage blocks. (F5Q1, F5Q4; F1-AR-13,
  F1-AR-14; F2-PE-01, F2-PE-06; F3 section 2.5.)

### 2.5 Preservation, retention, and handback

- F5-DS-09 — Unmerged work, unresolved operation records, and needed
  recovery/review/exception evidence are preserved until verified handback or
  explicit disposition. Handback alone never authorizes automatic destructive
  deletion while evidence is still needed. Only disposable logs and safely
  superseded temporary material may be cleaned, and only under visible
  configurable limits. Protected data over a cap discloses and asks; it is
  never silently deleted. Exact retention values are NOT selected here and no
  prior numbers are reused. (F5Q5.)

### 2.6 Outage, tracker, and journal

- F5-DS-10 — While the tracker is inaccessible there is NO new delegation and
  NO new recovery launch. The only exception is the already-running current
  bounded authorized reversible unit per F4, finished with artifacts preserved
  then parked — not an implicit stale permission for anything further.
  The bounded-unit finish is NOT an exception permitting new recovery or
  delegation launch. Same-run recovery is distinguished from the same human
  assignee: verified same-run recovery is allowed only after the tracker is
  available plus F4 live ownership/state/evidence reconciliation, while a
  possible other-run owner or ambiguous collision parks and asks per F4.
  Lifecycle mutations run in Beads only via the Dispatcher; the execution journal is memory only, never a
  second tracker; the Writer owns file edits; plugin services own the execution journal/recovery state
  as memory-only persistence (not Beads mutation, not Writer editing, never a second tracker).
  (F5Q2–F5Q4 read with F4Q4–F4Q6; F4-BI-04,
  F4-BI-05, F4-BI-07, F4-BI-09.)

### 2.7 Invariance holds (owned elsewhere, restated only as boundary)

- F5-DS-11 — Settled cross-feature holds, each owned elsewhere:
  1. Task review keeps initial plus at most two repair/re-review cycles; ONE
     separate shared integration budget covers newly introduced integration
     findings only; exhausted task failures are never rescued inside it; no
     automatic reset follows cancellation, revision, new model, new session,
     or rollover. (F1-AR-12.)
  2. Ceilings 3 Writers, 3 Seekers, 2 Experts per project plus configurable
     machine-wide 8 are limits, not utilization targets; old/new overlap must
     never create concurrent Writers for one ownership. (F1-AR-10.)
  3. Isolated Git worktree/branch/local commits/integration merge inside
     approved tasks only; applying to the target or user tree needs explicit
     approval; no automatic push, force-update, discard, or unmerged delete.
     (F1-AR-09; F2-PE-03.)
  4. Expert conflict authority is read-only: the Expert chooses, the Writer
     applies, a fresh Expert reviews the integrated result. (F1-AR-07.)
  5. Spec-drift approval and permission rules are unchanged (F2, F3).
  6. Pause and cancel stop new affected actions and promise no rollback.
  7. Per-task token/cost ceiling (BQ3, user-approved 2026-09-21) is unchanged by session events; breach
     discloses and escalates to the user, never a silent drop mid-review or mid-task.
- F5-DS-12 — Fresh and resumed runs use the F1 envelope with revision-bound
  evidence and return contract; packet expansion orphans stale verdicts;
  checkpoint references prove nothing about completed effects until reconciled
  against live evidence. Outage grants no launch authority: new delegation and
  new recovery stay refused until the tracker is available and F4 live
  ownership/state/evidence reconciliation completes. (F1-AR-13, F1-AR-14;
  F3-SD-09; F4-BI-09; derived proof invariant.)

### 2.8 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Resume bar + identity gate + fresh fallback (F5-DS-01, F5-DS-02, F5-DS-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks resume on missing progress, non-terminal absence, over-budget, drift, or narrowed permission |
| Completed/cancelled/Expert-fresh refusal (F5-DS-03) | Preventive (SPEC requirement, NOT proven implementation) | refuses in-place reuse; fresh follow-up only when authorized (cancelled: user instruction per F5-DS-04; completed: authorized assignment), never automatic |
| Cancellation stop/request/preserve/park (F5-DS-04) | Preventive (SPEC requirement, NOT proven implementation) | stops new affected actions; parks affected branch |
| Handover release gate (F5-DS-05) | Preventive (SPEC requirement, NOT proven implementation) | withholds ownership until stop or safe isolation confirmed |
| Crash-budget cap + reconcile-before-retry + no-replay (F5-DS-06) | Preventive (SPEC requirement, NOT proven implementation) | refuses third auto-attempt and any replay of confirmed effects |
| Rollover envelope + checkpoint + budget persistence (F5-DS-07) | Preventive (SPEC requirement, NOT proven implementation) | refuses rollover without validated envelope and recorded checkpoint |
| Authority validation + park on insufficiency (F5-DS-08) | Preventive (SPEC requirement, NOT proven implementation) | validates before any launch; parks on revoked or insufficient authority, never launch-then-validate |
| Preservation + disclose-and-ask over cap (F5-DS-09) | Preventive (SPEC requirement, NOT proven implementation) | refuses destructive delete while evidence needed or over cap without ask |
| Outage new-launch block (F5-DS-10) | Preventive (SPEC requirement, NOT proven implementation) | refuses new delegation/recovery while tracker inaccessible |
| Post-hoc detection: uncertain-outcome surfacing, still-writing detection, checkpoint-vs-effect mismatch (F5-DS-04, F5-DS-05, F5-DS-12) | Detective | surfaces an outcome or mismatch after the fact and routes it to reconcile |
| Records: cancel, handover, recovery, rollover, handback, disclosure records | Detective (reporting) | leaves an after-the-fact evidence trail with no authority of its own |
| Materiality and compatibility assessments | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F5Q1–F5Q5 govern where they conflict with earlier readings inside this
scope; F1/F2/F3/F4 stand where this spec does not narrow them. C2. No resume
of completed or cancelled sessions; no Expert review reuse; no invented
consultation-reuse rule. C3. No whole-run cancel without explicit ask; no
rollback promise; no restart without user instruction plus fresh session. C4. No
ownership release while the old process may still write; no acknowledgment or
checkpoint reference read as proof of effects. C5. No third automatic crash
attempt per task; no earlier-escalation skip; no confirmed-effect replay; no
budget reset across sessions by any event. C6. No rollover without validated
envelope plus recorded checkpoint; no full-transcript carry; no limit reset or
non-progress concealment. C7. No backup as equality exception; no revoked-right
restoration; no redundant approval demand for already-covering approval. C8. No
destructive delete while evidence needed; no silent over-cap delete of
protected data; no resurrected retention numbers. C9. No new delegation or
recovery launch while the tracker is inaccessible; the narrowed F4
bounded-unit finish permits no new launch, and same-run recovery waits for
tracker-available F4 reconciliation. C10. No Beads mutation outside Dispatcher typed tools; no
journal as second tracker; no concurrent Writers for one ownership. C11.
Controls are classed preventive, detective, or advisory by actual function
(section 2.8); SPEC-required blocking is not proven implementation. C12. No
invented session APIs, schemas, timers, TTLs, parsers, or commands; unknowns in
section 7 stay open.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial session consistency; this file owns
ID/link consistency only.
Format per scenario: setup/action/observable-result. Every scenario is FUTURE.

- DS-01 (F5-DS-01). Partial Writer session with progress plus non-terminal record, under budget, equal identity, guards pass / resume requested / resume proceeds with prior artifacts and remaining budgets intact. FUTURE.
- DS-02 (F5-DS-02). Partial session with changed model variant, all else equal / resume requested / resume refused as identity drift, fresh revalidated dispatch offered instead. FUTURE.
- DS-03 (F5-DS-08). Named backup available after primary failure / dispatch attempted / fresh session with logged notice, equality fully applied, revoked rights not restored. FUTURE.
- DS-04 (F5-DS-03). Completed session with valid packet / follow-up requested / reuse refused, fresh run with artifact packet required. FUTURE.
- DS-05 (F5-DS-03). Cancelled Seeker session / resume requested / reuse refused; restart only on user instruction as fresh session without redundant approval where valid covering approval holds. FUTURE.
- DS-06 (F5-DS-03). Expert review requested after prior consultation / review launched / fresh review receives spec, artifacts, tests, findings — never raw consultation transcript. FUTURE.
- DS-07 (F5-DS-04). Cancel names one task branch with two Writers active / cancel issued / named branch stops, preserves, reports, parks while independent branch continues; whole-run cancel refused without explicit ask. FUTURE.
- DS-08 (F5-DS-05). Cancel issued but old Writer still writes / handover attempted / ownership withheld until stop or safe isolation confirmed; kill acknowledgment alone does not release. FUTURE.
- DS-09 (F5-DS-04, F5-DS-06). Cancellation with uncertain external effects / continuation attempted / uncertainty reported and reconciled against live evidence; no automatic restart and no effect replay; any restart user-directed per F5-DS-04. FUTURE.
- DS-10 (F5-DS-06). Task crashes three times, consuming two automatic recovery attempts / third recovery attempted / third refused and escalated; infrastructure attempt count stands at two; repair/integration budgets unchanged with no fresh-session reset. FUTURE.
- DS-11 (F5-DS-07). Long task nears context limit with clean history / rollover requested / fresh Writer from validated envelope plus recorded checkpoint without full transcript; outgoing stops first; no crash charge, budgets persist. FUTURE.
- DS-12 (F5-DS-10). Tracker inaccessible, new recovery proposed / launch attempted / new delegation and recovery both refused with disclosure; only already-running bounded reversible unit may finish then park. FUTURE.
- DS-13 (F5-DS-10). Same-username second runner appears during recovery / transfer attempted / username alone transfers nothing; ambiguous owner parks and asks per F4; verified same-run recovery proceeds only after tracker-available F4 reconciliation. FUTURE.
- DS-14 (F5-DS-12, F5-DS-08). Spec revision lands mid-recovery / resumed work continues / impact check runs first; revision-bound evidence required; editorial change carries linked F3 assessment, uncertain coverage blocks. FUTURE.
- DS-15 (F5-DS-09). Protected recovery evidence over configured cap / cleanup attempted / deletion refused without disclosure and ask; disposable logs clean only under visible configurable limits. FUTURE.
- DS-16 (F5-DS-09). Handback done while review evidence still needed / prune attempted / unmerged work and needed evidence preserved until verified handback or explicit disposition; handback alone deletes nothing. FUTURE.
- DS-17 (F5-DS-06). Ownership conflict surfaces during crash recovery / recovery continued / earlier escalation fires before the two-attempt cap, conflicting assignment parked. FUTURE.
- DS-18 (F5-DS-08). Fresh session after drift with revoked grant / dispatch attempted / revoked rights stay revoked, insufficient authority parks, no redundant covering-approval demand. FUTURE.
- DS-19 (F5-DS-05, F5-DS-11). Old/new overlap proposes two concurrent Writers for one ownership / dispatch attempted / overlap refused by the ownership gate, with 3/3/2 plus global-8 ceilings acting as limits; shared-owner overlap is not allowed by ceilings alone. FUTURE.
- DS-20 (F5-DS-09, F5-DS-12). Handback cites checkpoint as proof of external effect / completion claimed / refused: checkpoint reconciles against live evidence first; verified handback only after reconcile. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F5 source | Stage A / F1 / F2 / F3 / F4 relation |
|---|---|---|
| F5-DS-01 partial resume bar; same-policy lazy load compatible; definition drift checked | F5Q3, F5Q4 | Q31 reuse; Q32 bar; Q34 gates; F1-AR-13 envelope |
| F5-DS-02 identity equality; drift means fresh; backup fresh | F5Q4 | Q32, Q34; Q43 backup; F1-AR-10 ceilings |
| F5-DS-03 completed/cancelled never reuse; Expert always fresh | F5Q1 | Q31, Q33; amendment B; F1-AR-03, F1-AR-11 |
| F5-DS-04 named cancel scope; stop/request/preserve/report/park; no rollback; user-instruction restart | F5Q1 | Q35 cancel-fresh; Q18 branch; F3-SD-04; F1-AR-12 |
| F5-DS-05 handover release gate; still-writing blocks; unproven isolation (derived handover invariant) | F5Q1 | Derived; Q17 bounded work; EVIDENCE gaps |
| F5-DS-06 two-attempt crash budget; early escalation; separate budgets; reconcile; no replay | F5Q2 | Q35 retries; Q32 bar; F1-AR-12; F4-BI-06 |
| F5-DS-07 planned rollover envelope+checkpoint; stop-before-own; no charge; budgets persist | F5Q3 | Q31–Q32; F1-AR-13, F1-AR-14 |
| F5-DS-08 reuse barred states; authorized-only fresh dispatch; validate-before-launch; park; quote rule; F3 applicability | F5Q1, F5Q4 | Q34, Q35; F1-AR-13/14; F2-PE-01/06; F3 section 2.5 |
| F5-DS-09 preservation until handback/disposition; retention classes; disclose-and-ask; no numbers | F5Q5 | Q17 persist; F1-AR-09 unmerged; F4-BI-05 preserve |
| F5-DS-10 outage no-new-launch; bounded finish permits no new launch; tracker-available same-run reconcile; Dispatcher-only journal rule | F5Q2–F5Q4 read with F4 | F4Q4–F4Q6; F4-BI-04/05/07/09; amendment D |
| F5-DS-11 budgets/ceilings/Git/Expert-apply/drift/permission invariance | Cross-feature | F1-AR-07/09/10/12; F2-PE-03; F3-SD-07/12 |
| F5-DS-12 envelope/evidence binding; checkpoint-not-proof; outage grants no launch authority (derived proof invariant) | Derived | F1-AR-13/14; F3-SD-09; F4-BI-06/09 |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F5Q3+F5Q4; F5-DS-01) Only guarded partial Writer/Seeker work resumes, on
   progress plus a live record plus budget plus equal identity; normal lazy
   loading under the same verified policy may be compatible, while actual
   definition, version, or grant drift stays subject to identity checks.
2. (F5Q4; F5-DS-02) Identity means the full stack matches; any drift forces a
   fresh validated start, and backups start fresh with notice.
3. (F5Q1; F5-DS-03) Done or cancelled work never resumes; Expert verdicts always
   start fresh from artifacts, never from consultation text.
4. (F5Q1; F5-DS-04) Cancel names its branch, stops new affected work, asks
   underway work to stop, keeps evidence, reports the uncertain, parks the
   branch, promises no undo, and restarts only on user word as a fresh session.
5. (F5Q1 + derived; F5-DS-05) Ownership waits until the old Writer is stopped or safely
   isolated; a lingering writer blocks handover, and acknowledgments and checkpoint references
   alone establish neither that a process has stopped nor that an external action completed; reconcile against evidence.
6. (F5Q2; F5-DS-06) Crashes get two automatic tries per task, fewer when stuck,
   murky, or contested; tries reconcile first, never replay the confirmed, and
   never touch review counters.
7. (F5Q3; F5-DS-07) Planned handoffs carry a validated envelope plus a compact
   checkpoint instead of the transcript, switch owners cleanly, cost no crash
   try, and keep every budget and the honest history.
8. (F5Q1+F5Q4; F5-DS-08) Barred states prohibit in-place reuse; fresh dispatch only when
   authorized (cancelled: user instruction; completed: authorized assignment); validate
   before launch, restore nothing revoked, park when short, skip redundant approval, quotes grant nothing, honor F3.
9. (F5Q5; F5-DS-09) Unmerged work and needed evidence stay until verified
   handback or explicit say-so; only disposable material cleans under visible
   limits, and protected over-cap data asks first.
10. (F5Q2–F5Q4 + F4; F5-DS-10) No tracker means no new sessions or recoveries;
    the bounded-unit finish permits no new launch; verified same-run recovery
    waits for tracker-available F4 reconciliation; same-run and same-assignee
    stay distinct; Beads writes stay Dispatcher-only and the journal stays memory.
11. (Cross-feature; F5-DS-11) Review budgets, ceilings, Git isolation,
    read-only Expert choice, drift gates, and permission guards do not move for
    sessions work.
12. (Derived; F5-DS-12) Every run carries the F1 envelope with revision-bound evidence; growth orphans stale verdicts and checkpoints await reconcile.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Safe-isolation mechanism for handover when stop cannot be confirmed.
2. Adapter mechanics distinguishing same-policy lazy loading from skill/tool definition, version, or grant drift subject to identity checks.
3. Visible configurable retention limits by class; exact values NOT selected.
4. Refusal/disclosure verbatim strings for resume-refuse, cancel, handover-block,
   recovery-escalate, rollover, authority-park, and over-cap-ask outcomes.
5. Resume economy pilot metric (BQ4, user-approved 2026-09-21): the pilot must measure the resume-hit
   rate (how often the F5-DS-01 resume path actually fires under identity equality); if near-zero,
   always-fresh dispatch is a v2 simplification candidate. Resume stays for v1.

Implementation probes (runtime evidence before build claims):

1. Session resume, identity comparison, and stop/isolation behavior under real
   Pi runtime conditions.
2. Crash/timeout detection, reconcile coverage, and no-replay enforcement across
   every tool/API surface.
3. Outage detection and restore-reconcile behavior under real disconnects.
4. Operation-identity availability in live evidence; no idempotency-key support
   asserted until observed.
5. Empirical proof that chosen Pi hooks, guards, or adapters enforce sections
   2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. Same-model review anchoring risk remains; the fresh-session artifact packet
   is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
2. CLI spellings, API shapes, store schemas, and exact install commands are
   explicitly unknown here.
3. Donsetch pinning, interface choice, and AGPL boundary review are owned
   elsewhere and unchanged here.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4 digests and F5 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; session, interception, observation, and multi-root gaps stay open there.
- `README.md` — Stage B index; this is feature 5 of 13.
