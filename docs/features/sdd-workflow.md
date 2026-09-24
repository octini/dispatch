# Feature F3 — SDD workflow and drift control (Dispatch)

Status: user-approved, independently reviewed, implementation unverified; requirements F3Q1–Q6 settled
and user-agreed, including section 2.5 applicability rule. No implementation. No installs. No code. No commits
or pushes. Third Stage B feature spec; remaining 10 areas stay stubs (see `README.md`). All scenarios FUTURE, not executed. User-approved with 2026-09-21 band-review amendment batch; band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved).
Historical Q1–Q51 and prior amendments are subordinate to settled F3Q1–F3Q6
where they conflict for this scope. Approved F1/F2 requirements stand
untouched.

## 0. Objective

Define how Dispatch approves, changes, and drifts from its specs: one combined
requirements-plus-execution-plan approval after Expert review, visible deviation
handling, compact revision-bound change records, conflict preservation with
explicit supersession, revision impact checks before continuation,
revision-bound verdicts and evidence, and scoped residual-risk acceptance.
Covers the approval gate, deviation classes, change records, conflict rule,
revision rule, evidence binding, and waiver shape. Mechanism choice (storage
APIs, hash algorithms, guard interception, drift detectors) is downstream, not
this spec.

Stable requirement IDs `F3-SD-01` … `F3-SD-12`. Sources trace to settled F3Q1–F3Q6 plus F1/F2
and prior Stage A amendments where noted; mappings are multi-source where a rule draws on more
than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes
the digest by requirement with source labels. Section 2.5 applicability rule is user-approved.

## 1. Files / artifact boundaries

Owned by this feature (workflow, gate, acceptance only):

1. Combined requirements-plus-execution-plan approval gate and its Expert-review precondition.
2. Deviation classes (nonmaterial vs material-or-uncertain) and their notice/record/pause duties.
3. Compact revision-bound change records, Beads linkage, promotion rule, and the no-parallel-tracker rule.
4. Conflicting-source preservation, supersession labelling, and the ask-human rule.
5. Spec/test revision impact checks, the re-approval rule, editorial handling, and explicit-change-instruction handling.
6. Verdict/evidence revision binding and the easier-test rule.
7. Scoped residual-risk acceptance shape (accepted-with-exceptions), waiver scope limits, and the fixed-authority boundary.
8. Preventive/detective/advisory labelling of the controls above by actual role.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only Dispatcher-exclusive typed mutation and Beads-linked sole tracking hold.
2. Seat responsibilities, review packets, and repair/re-review budgets — F1 owns; here only authorship/review/budget boundaries hold.
3. Permission configurability and fixed integrity — permissions spec owns; here only the waiver/authority boundary holds.
4. Worktree/branch mechanics, memory admission, retrieval chain, bootstrap order, model SKU pins — unchanged, owned elsewhere.

Not in this feature:

1. Exact storage paths beyond the repo-file source of truth, hash algorithms, revision-pointer
   formats, guard interception coverage, semantic-drift detectors, TTL values, cancellation/ledger
   mechanics — all downstream (section 7).
2. Any claim that Pi hooks, guards, models, or extensions already implement sections 2–3.
   Proof is future work.
3. The integrated primary spec or any next-feature content. One feature at a time per user
   request; integration follows.

## 2. Interfaces

### 2.1 Approval gate and deviation handling

- F3-SD-01 — One combined requirements-plus-execution-plan approval by default, after Expert
  review covers BOTH the requirements and the execution plan; one review session may cover both,
  with no two-invocation mandate. The gate packet holds the requirements text, the execution plan,
  the list of consequential unresolved choices (empty or surfaced per F3-SD-02), and Expert review(s)
  covering both artifacts. The approval record names the covered revisions of requirements and plan.
  Requirements approval to date covers intent; this spec is user-approved. The
  F3-SD-08 exception governs ordering for explicit user change requests. (F3Q1.)
- F3-SD-02 — Consequential unresolved choices are surfaced first, before the
  combined approval is sought: each names the decision, the options, and what
  the approval would assume. Arbitrary implementation detail is never treated
  as an automatic re-approval trigger; detail that leaves outcome, scope, acceptance, and
  consequences unchanged rides under the current approval. (F3Q1.)
- F3-SD-03 — Nonmaterial deviations — outcome, scope, acceptance, and consequences all
  unchanged — carry visible timely notice plus a record with Dispatcher explanation, and the run
  may continue. The record states what deviated, why it is classed nonmaterial against each of
  the four approval dimensions, and the Beads link where it is filed. (F3Q2.)
- F3-SD-03a — Materiality contest (BQ5, user-approved 2026-09-21). Any seat or the user may flag a
  nonmaterial classification; the flag promotes the deviation to material-or-uncertain until the Expert
  (consult mode) adjudicates the class; if still disputed the user arbitrates. A Dispatcher never has
  the last word on its own deviation's class.
- F3-SD-04 — Material or uncertain deviations pause AFFECTED work while
  independent work proceeds. The pause record names the affected branch, the park point,
  and what stays free to continue. Classification is justified per case: no blanket
  filename/typo safe classification stands, and no deviation is buried in a final report —
  notice plus record happen at deviation time. (F3Q2.)
- F3-SD-04a — Park lifecycle (BQ1+BQ2, user-approved 2026-09-21; F3 owns the pause/park lifecycle).
  The Dispatcher clears MECHANICAL parks (conditions satisfied plus evidence recorded) without asking
  the user; policy-gap, conflict, and ambiguous-ownership parks need the user. If the user is
  unavailable, work stays parked with a visible staleness clock; at the configured limit the plugin
  discloses and asks — never silent auto-cancel. The exact limit is configurable and is NOT set here
  (no numbers invented).

### 2.2 Change records and conflicting sources

- F3-SD-05 — ONLY tasks classified tiny MAY use a compact spec+plan: a tiny
  revision-bound record stating intent, boundaries, and acceptance, plus a
  classification justification describing tiny eligibility (why the task qualifies
  as tiny: bounded named touch set (single file or named equivalent), explicit
  transformation, reversibility, deterministic verification), linked from Beads
  as the sole tracker. Revision-bound means the record
  names the spec revision it applies to; intent states what changes and why;
  boundaries state what is untouched; acceptance states how the change is judged.
  Standard and heavy tasks use a fuller structure under the same gates. There is
  no `tasks.md` parallel tracker: spec requirement/acceptance lists are not a task
  database. Compactness never waives required review or approval; reclassification owner is the Dispatcher, on any
  deviation signal (wider scope, new acceptance, changed consequences), with promotion recorded and the
  required review completed before continuing. When the task is no longer tiny — wider scope, new
  acceptance, changed consequences — promote to the fuller structure and complete the required review
  before continuing. (F3Q3.)
- F3-SD-06 — Conflicting sources are preserved as originals with exact
  conflicting excerpts and provenance: both texts stay, each with where it came
  from and which revision it belongs to. Explicit supersession governs — a
  named override states what wins, over what range, from when. Otherwise the human is
  asked for the winner; no timestamp, detail-level, or summary precedence decides
  silently. Unaffected requirements proceed while the conflict parks, with the park record
  naming what waits and what moves. (F3Q4.)

### 2.3 Revisions, evidence, and waivers

- F3-SD-07 — Spec, test, or execution-plan revision changes trigger an impact check BEFORE affected
  continuation, enforced by the continuation gate (F3-SD-07) which blocks affected continuation until
  the impact check completes and its outcome is recorded. The check names the changed revision, the
  affected branches, and whether each affected item needs renewed approval (material: outcome, scope,
  acceptance, or consequences changed) or proceeds (editorial with a linked revision record). Material
  change needs renewed approval; editorial change with a linked revision needs no redundant human gate.
  Editing a file alone is never approval — only the gate or a qualifying explicit request per F3-SD-08
  approves. (F3Q5.)
- F3-SD-08 — An explicit clear user change request CAN serve as approval with
  validated provenance: a clear explicit scoped request may record user authorization
  before the required updated review completes, but affected execution stays gated
  on that review plus valid authority — no rubber stamp of incomplete work, and no
  redundant human confirmation demanded solely because authorization was recorded first.
  Validated provenance means the request is a host-validated explicit USER instruction, not a
  quote, tool output, or specialist request alone. Ambiguous widening still asks first per the
  F2 flow. (F3Q5; F2-PE-06 provenance rule.)
- F3-SD-09 — Verdict and evidence stay revision-bound: a verdict covers only
  the revision actually reviewed with the checks actually executed and other
  evidence actually inspected, and the verdict record names the revision and the
  evidence standing behind it. An easier replacement test never proves the original
  requirement; passing a substitute is reported as a substitute pass, never as
  original coverage. Machine evidence (executed checks), model evidence (Expert
  judgment), and user evidence (approval/waiver) are separate kinds of standing —
  no claim that tests ran follows from an Expert verdict alone, and a verdict never
  claims more than the executed checks and inspected evidence support. (F3Q5.)
- F3-SD-10 — Explicit scoped residual-risk acceptance yields accepted-with-exceptions,
  never a clean pass. The acceptance record names the scope, the residual risks, and the
  exceptions. A task waiver is never a feature waiver: it covers its task only. Without
  acceptance, blockers remain blockers; partial progress never reads as complete. (F3Q6.)
- F3-SD-11 — A waiver never authorizes a fixed-authority bypass: no self-authorization, forged
  approval, validation bypass, or text-granted authority becomes valid because a waiver exists.
  Configurable permissions change only through the separate validated change flow per F2, with
  provenance, change, scope, and duration recorded. (F3Q6; F2-PE-01, F2-PE-06.)

### 2.4 Cross-feature holds

- F3-SD-12 — Settled cross-feature holds, each owned elsewhere and restated
  here only as boundary:
  1. Dispatcher authors, Writer persists, Expert independently reviews
     (F1-AR-01 … F1-AR-04).
  2. Only the Dispatcher performs typed Beads lifecycle mutations; specialists
     hold scoped reads, no mutation (F1-AR-02).
  3. The repo spec is the source of truth with revision/hash references; exact
     storage and hash APIs are TBD (Stage A Q48).
  4. Task review gets initial plus at most two repair cycles and integration gets ONE separate
     initial-plus-max-two budget across newly introduced integration findings, with no resets by
     spec/test revision, context request, waiver, or deviation; exhausted task failures are never
     rescued by the integration budget (F1-AR-12).
  5. Context-request and packet-growth rules hold: expansion is recorded and
     orphans stale verdicts; requests reset no budget and widen no permission
     (F1-AR-14).
  6. Pause stops new affected actions and never rolls back external effects;
     cancellation and ledger mechanics are downstream. (F3Q1–F3Q6 read with
     F1-AR-02, F1-AR-12, F1-AR-14; Stage A Q15, Q48, Q50.)
### 2.5 Packet-validity applicability rule (user-approved)

User-approved applicability rule. Frozen review-packet validity follows actual
coverage — an editorial change may carry a linked applicability assessment for the prior verdict
instead of blindly invalidating everything or carrying a stale material verdict; uncertainty about
coverage blocks the affected verdict.

### 2.6 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block;
nothing here claims the runtime implements it — enforcement is unverified until probes decide,
and no claim is made that any model detects all drift.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Combined approval + authority + required-review dispatch gate (F3-SD-01, F3-SD-02, F3-SD-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks affected execution until required review and valid authority hold |
| Revision-change detection: impact check on spec/test/execution-plan revision; packet-growth orphaning (F3-SD-07, F3-SD-12) | Detective | surfaces a change after the fact and routes it to the gate; does not itself block |
| Continuation gate (F3-SD-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks affected continuation until the impact check completes and its outcome is recorded |
| Semantic materiality assessment: nonmaterial vs material-or-uncertain call (F3-SD-03, F3-SD-04) | Advisory judgment alone; preventive only when paired with the pause/re-approval gate | classification advises, the gate enforces |
| Notice and audit records: deviation, pause/park, waiver records (F3-SD-03, F3-SD-04, F3-SD-10) | Detective (reporting) | leaves an after-the-fact evidence trail |
| Waiver and budget closure checks: exceptions-noted shape, no waiver past fixed authority, no budget reset or integration rescue (F3-SD-10, F3-SD-11, F3-SD-12) | Preventive (desired mechanism, runtime unverified) | must refuse clean-pass, bypass, and reset claims |

## 3. Constraints

C1. F3Q1–F3Q6 govern where they conflict with earlier readings inside this
scope; F1/F2 stand where this spec does not narrow them. C2. Default approval
follows Expert coverage of both requirements and plan (one session may cover both);
the F3-SD-08 explicit-request ordering exception still gates affected execution on the
required review; no re-approval invented for arbitrary detail; consequential choices
surface first. C3. No silent or
buried deviation; no blanket safe class; uncertain means pause-affected, not
proceed; independent work is the only thing that continues. C4. No parallel
task tracker; no compactness waiver of review; no file-edit-as-approval; no
quote, tool-output, or specialist-request text as user approval. C5. No
stale-verdict carry across material revision; no easier-test substitution; no
clean pass from a waiver; no task-waiver-as-feature-waiver; no
partial-as-complete. C6. No waiver past fixed authority; no permission change
outside the F2 validated flow. C7. No budget reset by revision, context,
waiver, or deviation; no integration rescue of exhausted task failures; no
rollback promised by pause. C8. No invented storage/hash APIs, models,
packages, TTLs, guard coverage, or drift-detection claims; gaps in section 7
stay open. C9. Controls are classed preventive, detective, or advisory by actual function (section 2.6
table); SPEC-required blocking is not proven implementation; detection is never labeled
preventive and hiding is never labeled a control.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial workflow consistency; this file owns
ID/link consistency only.
Format per scenario: setup/action/observable-result. Every scenario is FUTURE.

- SDD-01 (F3-SD-01). Requirements plus execution plan ready, one Expert session covers
  both / combined approval sought / single approval record covering both revisions, gated
  on the covering review; no second invocation demanded. FUTURE.
- SDD-02 (F3-SD-01, F3-SD-02). Plan ready, consequential choice unresolved and unflagged /
  approval sought / approval refused until the choice is surfaced first with Expert coverage. FUTURE.
- SDD-03 (F3-SD-02). Arbitrary implementation detail changed,
  outcome/scope/acceptance/consequences unchanged / continuation attempted / proceeds under
  current approval with no automatic re-approval demanded or claimed. FUTURE.
- SDD-04 (F3-SD-03). Nonmaterial deviation in one branch / Writer continues under approval / visible
  timely notice plus record with Dispatcher explanation, classed against all four approval dimensions. FUTURE.
- SDD-05 (F3-SD-04). Material deviation in one branch / run continues / affected branch pauses
  with a park record naming the park point while an independent branch proceeds. FUTURE.
- SDD-06 (F3-SD-04). Deviation of uncertain materiality / run continues / affected branch
  pauses as if material until classified; uncertainty never authorizes proceeding. FUTURE.
- SDD-07 (F3-SD-04). Filename/typo-only change claimed blanket-safe and noted only in
  the final report / review / refused: classification per case, notice plus record at
  deviation time, never buried. FUTURE.
- SDD-08 (F3-SD-05). Tiny-classified task / Writer records compact spec+plan with
  tiny-eligibility justification and Beads link, no `tasks.md` entry / record present
  and linked, no parallel tracker created. FUTURE.
- SDD-09 (F3-SD-05). Task no longer tiny with wider scope / continuation attempted / promotion
  to the fuller structure with required review completed first; compactness-as-waiver refused. FUTURE.
- SDD-10 (F3-SD-06). Two sources conflict on scope / resolution attempted / both originals
  plus exact conflicting excerpts with provenance preserved; explicit supersession recorded
  as governing over a named range. FUTURE.
- SDD-11 (F3-SD-06). Conflict with no governing supersession; newer summary contradicts
  older detail / resolution attempted / human asked for the winner, no precedence applied;
  unaffected requirements proceed with progress elsewhere. FUTURE.
- SDD-12 (F3-SD-07). Spec revision lands mid-task / affected work continues / impact check
  naming changed revision and affected branches recorded BEFORE continuation; material change
  parks for renewed approval. FUTURE.
- SDD-13 (F3-SD-07). Editorial revision with linked record; silent direct file edit as
  second case / continuation / editorial proceeds without redundant gate, file-edit-alone
  grants nothing. FUTURE.
- SDD-14 (F3-SD-08). Explicit clear scoped user change instruction with validated
  provenance, variant arriving after Expert review started / applied / authorization recorded
  without redundant reconfirmation, but affected execution proceeds only after the required
  Expert review of the changed plan/result completes; incomplete work never rubber-stamped. FUTURE.
- SDD-15 (F3-SD-09). Original requirement with a harder test; easier replacement test
  passes / completion claimed / refused: verdict stays bound to the reviewed revision, executed
  checks, and inspected evidence; replacement pass reported as substitute only, never proof. FUTURE.
- SDD-16 (F3-SD-10). Scoped residual-risk acceptance with blockers open / closure attempted /
  recorded as accepted-with-exceptions with scope and exceptions named; partial progress never
  labeled complete or clean pass. FUTURE.
- SDD-17 (F3-SD-10). Task waiver granted; feature closure attempted without
  feature acceptance / closure / task waiver covers the task only; feature
  blockers remain until scoped acceptance or resolution. FUTURE.
- SDD-18 (F3-SD-11). Waiver citing fixed-authority bypass; separate user-directed
  configurable permission change / attempted / bypass refused, configurable change proceeds
  only via the F2 validated flow with provenance recorded. FUTURE.
- SDD-19 (F3-SD-12). Exhausted task budget plus a spec revision; pause issued over an
  external side effect / recovery attempted / neither budget resets, exhausted task failure not
  repaired inside the integration budget, pause stops new affected actions, no rollback. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F3 source | Stage A / F1 / F2 relation |
|---|---|---|
| F3-SD-01 combined requirements+plan approval after Expert covers both (one session may cover both); F3-SD-08 ordering exception | F3Q1 | Q15 one approval; Q7 review gate; F1-AR-04 reviews cover plans/specs AND implementations |
| F3-SD-02 consequential-first; no auto-reapproval for arbitrary detail | F3Q1 | Q15 re-approval scope; F1-AR-08 surprise handling |
| F3-SD-03 nonmaterial notice+record, may continue | F3Q2 | Q15 alert deviations; Q18 branch discipline |
| F3-SD-04 material/uncertain pause-affected, independent proceeds; no blanket safe class, no burying | F3Q2 | Q18 branch discipline; Q15 re-approval |
| F3-SD-05 tiny-only compact spec+plan with tiny-eligibility justification, Beads sole tracker; standard/heavy fuller structure; no waiver; promote when no longer tiny | F3Q3 | Q48 living-spec revisions; Q52-style Beads sole tracker |
| F3-SD-06 preserve originals+excerpts/provenance; supersession governs else ask; no precedence shortcuts | F3Q4 | Q27 supersede-don't-overwrite; F1-AR-13 verbatim excerpts with provenance |
| F3-SD-07 revision impact check before continuation; material reapprove; editorial linked no redundant gate; edit != approval | F3Q5 | Q15 re-approval; Q48 living-spec; F1-AR-14 packet growth orphans stale verdicts |
| F3-SD-08 explicit user change request as approval with provenance; authorization may precede updated review, execution gated on it; retained Expert review | F3Q5 | F2-PE-06 validated USER instruction flow; Q15 approval |
| F3-SD-09 revision-bound verdict; executed checks + inspected evidence; machine/model/user separate; easier test never proves original | F3Q5 | F1-AR-11 one verdict per case + revision; F1-AR-12 combined checks |
| F3-SD-10 scoped acceptance as accepted-with-exceptions; task != feature waiver; no partial-as-complete | F3Q6 | F1-AR-04 waiver never clean pass; Q15 acceptance |
| F3-SD-11 no waiver past fixed authority; configurable via F2 validated flow | F3Q6 | F2-PE-01 fixed integrity; F2-PE-06 change flow |
| F3-SD-12 roles/store/budgets/evidence separation/pause-no-rollback | F3Q1–F3Q6 read with F1/F2 | Amendment D; F1-AR-02, F1-AR-12, F1-AR-14; Q48 store; Q50 budgets |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F3Q1; F3-SD-01) Requirements and execution plan approve together, once, after Expert coverage
   of both artifacts in one session if suitable; the approval names both revisions, with ordering
   for explicit requests per F3-SD-08. Intent approval is not draft approval.
2. (F3Q1; F3-SD-02) Hard choices come out before approval with options and assumptions stated;
   trivia that moves none of the four approval dimensions never forces a second gate by itself.
3. (F3Q2; F3-SD-03) Harmless drift is still shown promptly with a Dispatcher-signed record argued
   against outcome, scope, acceptance, and consequences, then work continues under the same approval.
4. (F3Q2; F3-SD-04) Harmful or unclear drift stops its own branch at a named park point while clean
   branches keep moving; nothing is pre-cleared by kind, and nothing waits until the final report.
5. (F3Q3; F3-SD-05) ONLY tiny tasks may use a compact spec+plan with a tiny-eligibility case,
   never a second tracker. Standard/heavy use the fuller structure under the same gates; grown
   work gets grown structure plus its review first.
6. (F3Q4; F3-SD-06) Both sides of a clash stay on file with exact excerpts and origins; a named
   override with range and start wins, otherwise a human picks. Age and brevity never vote.
7. (F3Q5; F3-SD-07) A changed page means check-then-continue with affected branches named first;
   big changes re-approve, linked typos do not, and touching a file approves nothing by itself.
8. (F3Q5 + F2-PE-06; F3-SD-08) A clear scoped user "change it" with proven origin records
   authorization even before the updated review completes, but execution waits for that review —
   no rubber stamp, no redundant reconfirmation, pasted quotes never count.
9. (F3Q5; F3-SD-09) A verdict belongs to the exact revision reviewed, the checks executed, and
   the other evidence inspected; an easy stand-in pass is a stand-in, never proof of the hard
   original. Machine, model, and user evidence stand apart.
10. (F3Q6; F3-SD-10) Named leftover risk closes as exceptions-noted with scope and exceptions
    on record, per task not per feature; open blockers stay open and half-done stays half-done.
11. (F3Q6 + F2; F3-SD-11) Waivers stop at fixed authority — no signature, validation, or text
    trick becomes valid by waiver; adjustable policy moves only through the F2 change flow.
12. (Cross-feature; F3-SD-12) Old roles, stores, budgets, and evidence separations hold; pause
    freezes new affected action and promises no undo of the outside world.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Revision-pointer and hash-reference formats for spec revisions, verdicts, and Beads links.
2. Refusal/disclosure verbatim strings for deviation, pause, conflict-ask, and waiver outcomes.
3. Machine-wide cap and ceiling interplay with pause/park pressure (F1-AR-10 counts hold; queuing under pause is unspecified).

Implementation probes (runtime evidence before build claims):

1. Runtime guard interception coverage across every tool/API surface; coverage
   unresolved here.
2. Semantic-drift detection capability; detection is not guaranteed by this
   spec.
3. Cancellation propagation and side-effect ledger behavior; pause promises no
   rollback.
4. Empirical proof that chosen Pi hooks, guards, models, or adapters enforce
   sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. Same-model review anchoring risk remains; the fresh-session artifact packet is the mitigation
   on record, not a fix (`EVIDENCE.md` section 5 item 8).
2. Seeker allowlist, permission-extension choice, and registry/hook/parser behavior stay unverified
   until probes (`EVIDENCE.md` sections 2–4).
3. Donsetch pinning, interface choice, and AGPL boundary review are owned
   elsewhere and unchanged here.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2 digests and F3 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; guard coverage, semantic
  drift, cancellation, and anchoring gaps stay open there.
- `README.md` — Stage B index; this is feature 3 of 13.
