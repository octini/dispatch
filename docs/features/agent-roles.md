# Feature F1 — Agent roles and collaboration (Dispatch)

Status: approved and closed (tgo-dsjc) with 14 requirements (F1-AR-01 … F1-AR-14) and 24 FUTURE scenarios, not executed. No implementation. No installs. No code. User-approved with 2026-09-21 band-review amendment batch; band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved).
No commits or pushes. First Stage B feature spec; remaining 11 areas stay stubs (see `README.md`).
Historical Q1–Q51 are subordinate to approved F1 decisions where they conflict for this scope.

## 0. Objective

Define Dispatch seat responsibilities, authorities, handoff contracts, and collaboration flows so
concurrent work stays scoped, reviewable, reversible. Covers who may do what (roles + authority),
how work moves (handoffs), how advice and verdicts bind (consult / review / conflict), how parallel
work is bounded (overlap + ceilings + integration review). Enforcement mechanics (APIs, packages,
scheduler locks, allowlists, session persistence) are downstream, not this spec.

Stable requirement IDs `F1-AR-01` … `F1-AR-14`. Sources trace to settled F1 questions and, where
noted, to prior Stage A amendments (Beads authority = amendment D; proactive consult = amendment
B); mappings are multi-source where a rule draws on more than one source — no one-to-one
fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with
source labels.

## 1. Files / artifact boundaries

Owned by this feature (responsibilities, interfaces, acceptance only):

1. Seat definitions (Dispatcher, Writer, Seeker, Expert): role text, authority ceilings,
   read/write/mutation boundaries.
2. Handoff contracts: plan authorship and persistence, review packets, escalation routing.
3. Consult / review / conflict flows, verdict authority, repair/re-review budgets at policy level
   (counts only where F1 settled them; retry numbers downstream).
4. Concurrency ownership: overlap discipline, per-project and machine-wide ceilings, integration-review
   gate.
5. Isolated-version-control authority for finished-plugin work within approved tasks, plus user-tree
   protection.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only who may mutate or read.
2. Permission enforcement mechanics — permissions spec owns; here only the per-seat ceilings it must
   hold.
3. Worktree / branch mechanics — sessions/delegated-work spec owns; here only what the finished plugin
   may and may not do.
4. Memory admission, recall probes, retrieval chain, bootstrap order, model SKU pins — unchanged, owned
   elsewhere.

Not in this feature:

1. Exact host APIs, package choices, scheduler locks, worktree algorithms, permission allowlists,
   session-persistence schemas, fairness / preemption / TTL scheduling, bounded-retry numbers, cost
   accounting — all downstream (section 7).
2. Any claim that Pi hooks, models, or extensions already implement these rules. Worktree separation
   isolates file versions, not external services; implementation proof is future work.
3. The integrated primary spec. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Role + authority matrix

| Seat | Role | Artifacts | Beads | Persistence | Instances |
|---|---|---|---|---|---|
| Dispatcher | Single conversation entry; authors plans; routes consults, escalations, reviews; reconciles; never overrules unresolved blocking findings | No direct edits | Exclusive mutation, only via typed validated host tools | Lifecycle state via host tools only | One per task scope |
| Writer | Sole agent editing role for project artifacts; persists Dispatcher plans without silently changing intent; applies Expert-chosen resolutions | Edit in approved scope only | Scoped reads; no mutation | Project artifacts only; plugin-service state/memory persistence is distinct, not Writer-owned | Multiple parallel instances required v1 (F1-AR-06) |
| Seeker | Research and documentation drafts; read-only on artifacts | No edits; drafts ride in report packs | Scoped reads; no mutation | No writes | Multiple parallel instances required v1 (F1-AR-06) |
| Expert | Independent review + complex-problem consultation; read-only; chooses in-scope conflict resolutions | No edits | Scoped reads; no mutation | No writes | Bounded concurrent (F1-AR-10); one verdict per case + revision (F1-AR-11) |
| Plugin services (not a seat) | Authorized state/memory persistence, distinct from seat editing | Only as approved task directs | Only via typed validated path | Own the persistence the Writer explicitly does not own | N/A — excluded from specialist ceilings |

- F1-AR-01 — Dispatcher is the single conversation entry even when the user addresses a specialist by
  name, including natural named requests. (F1Q1.) Dispatcher authors spec/plan content; Writer
  persists it without changing intent. Silent intent change is a deviation: stop, disclose,
  re-approve. (F1Q2.)
- F1-AR-02 — Dispatcher holds exclusive Beads mutation via typed validated host tools only, never
  unrestricted shell. Writer is the sole agent editing role for project artifacts (many instances
  allowed). Specialists are read-only on artifacts with scoped Beads reads, no mutation. Plugin
  authorized persistence is distinct from Writer editing. (Prior DECISIONS amendment D; Stage A
  Q36/Q38 shell readings amended for this scope; Q21 read-only.)
- F1-AR-03 — Expert consults proactively on consequential uncertainty; blocked work escalates via
  Dispatcher. Specialists request escalation, never start uncontrolled nested delegation. Consultation
  is not approval and never resets a repair/re-review budget. A fresh review session receives spec,
  artifacts, tests, findings, decision record — not the raw consultation transcript. Residual
  same-model anchoring bias is acknowledged, not claimed fixed. (Prior DECISIONS amendment B, Expert
  two modes, plus seat-naming confirmation; Stage A Q22, Q50 as amended — not an F1Q.)
- F1-AR-04 — Reviews cover plans/specs AND implementations. Dispatcher cannot overrule an unresolved
  blocking finding or verdict-shop. Writer counterevidence goes to a fresh Expert; after the bounded
  budget is spent or an early trigger fires, the user arbitrates. An explicit user waiver is recorded
  as a waiver, never a clean pass. (F1Q3 disputed-findings rule; plans/specs AND implementations
  coverage per prior amendment B; Stage A Q7, Q15, Q50.)
- F1-AR-05 — Unavailable specialist, including its named model backup being unavailable, parks
  affected work. Independent work proceeds. No silent role substitution, no self-review. Bounded retry
  numbers are downstream. (F1Q4; Stage A Q35, Q43.)

### 2.2 Handoff contracts

- H1 User → Dispatcher (entry). User prose, even naming a specialist, lands with Dispatcher as entry
  and router. Evidence: routing record naming entry seat. (F1-AR-01.)
- H2 Dispatcher → Writer (plan persist). Approved plan (outcome, scope, acceptance, consequences)
  persists verbatim in intent; required deviation stops, discloses, waits for re-approval. Evidence:
  plan hash before/after as a best-effort byte-level signal plus disclosure duty, never intent proof;
  a mismatch or paraphrase triggers disclosure and impact assessment, never automatic pass. (F1-AR-01.)
- H3 Dispatcher → Seeker/Writer (dispatch pack). Scoped task plus artifact packet (spec, decisions,
  dead ends, open questions). Evidence: pack logged with dispatch. (F1-AR-01, F1-AR-06.)
- H4 Specialist → Dispatcher (escalation request). Blocked-work notice or uncertainty flag; Dispatcher
  routes to Expert; specialist never delegates sideways/downward. Evidence: request + routing record.
  (F1-AR-03.)
- H5 Expert → Dispatcher (consultation note). Advice only; binds nothing; budget counters unchanged.
  Evidence: note labeled consultation. (F1-AR-03.)
- H6 Expert → Dispatcher (review verdict). Fresh-session review of packet + tests + prior findings
  returns exactly one verdict (pass / blocking / non-blocking with conditions) per case + artifact
  revision. A second opinion is a separate case or explicitly requested second opinion, reconciled or
  escalated on contradiction. Evidence: verdict record with case ID + revision. (F1-AR-11, F1-AR-04.)
- H7 Dispatcher → Writer (resolution apply). Expert-chosen in-scope resolution applied by Writer;
  fresh Expert reviews integrated result; requirement changes park for human approval first. Evidence:
  applied diff + fresh verdict, or pending-approval park. (F1-AR-07.)
- H8 Any seat → user (arbitration/waiver). Exhausted budget or early trigger (no progress, scope
  change, side-effect ambiguity) routes to user. Evidence: arbitration or waiver record; waiver never
  relabeled pass. (F1-AR-04, F1-AR-12.)

### 2.3 Review / consult / conflict flow

1. Consult (advisory). Dispatcher routes on consequential uncertainty; Expert reads and advises; work
   continues under current approval; advice carries no verdict weight. (F1-AR-03.)
2. Review (binding). Fresh Expert session reviews packet and returns the single authoritative verdict
   for that case + revision. (F1-AR-04, F1-AR-11, F1-AR-12.)
3. Counterevidence. Writer dispute with evidence → fresh Expert reconsiders; surviving dispute past
   budget or early trigger → user arbitrates. (F1-AR-04.)
4. In-scope content conflict. Parallel results disagree inside scope → Expert (read-only) chooses,
   Writer applies, fresh Expert reviews integrated result. Outcome/scope/acceptance/consequence changes
   park for human approval. (F1-AR-07.)
5. Contradictory verdict. Second Expert blocking finding contradicting the first on same case +
   revision → reconcile or escalate; convenient-verdict pick refused. (F1-AR-11.)
6. Budgets. Task review: initial + at most two repair/re-review cycles. Integration review: ONE
   budget per combined-result/integration case — initial + at most two repair/re-review cycles shared
   across newly introduced integration findings. A new finding or artifact revision never resets either
   budget. Integration cycles never repair an exhausted task failure, never reset the task budget, and
   never bypass approvals. (F1-AR-12; Stage A Q50.)
7. Per-task cost ceiling (BQ3, user-approved 2026-09-21). A configurable per-task token/cost ceiling
   applies alongside the review budgets; breach discloses and escalates to the user; never a silent
   drop mid-review or mid-task. No amounts are set here; the limit is configurable downstream.

### 2.4 Concurrency ownership

Definitions (load-bearing terms used in A-CEIL-* and A-VERDICT-17): "active" (ceiling counting)
means an invocation dispatched and not in a terminal or parked state (terminal = complete/failed/cancelled;
parked frees the slot); "case" (verdict identity) means one review assignment covering a named artifact
set at a named revision plus any recorded packet expansion; "revision" means a recorded content version
of an artifact (hash or pointer).

- F1-AR-06 — Parallel execution support is required in v1 (multiple instances implementable and
  exercised when independent work exists); parallel use is triggered by task shape, not a floor.
  (F1Q5; Stage A Q11 instances clarified.)
- F1-AR-07 — In-scope conflicts resolve read-only-first (Expert chooses, Writer applies, fresh Expert
  reviews); requirement changes need human approval. (F1Q6.)
- F1-AR-08 — Disjoint preferred. Intentional overlap allowed only with overlap identified + Expert
  integration recommendation BEFORE dispatch. Incompatible assumptions sequenced. Unexpected overlap
  pauses affected integration only; unrelated work continues. (F1Q7.)
- F1-AR-09 — Within approved tasks the finished plugin may create worktrees/branches/local commits of
  agent changes and merge dedicated integration branches. User working tree and task target stay
  untouched until user approves applying the result. Automatic pushes, force-updates, discarding user
  changes, deleting unmerged work refused. This spec does not authorize git mutations in the
  spec-authoring session. (F1Q8; Stage A Q5, Q17.)
- F1-AR-10 — Ceilings per project: max 3 active Writers, 3 Seekers, 2 Experts. Machine-wide: max 8
  active specialist invocations across projects, configurable. Slots are ceilings, not required
  activity. No fairness/preemption/TTL rule set here. Shared external resources coordinated/serialized
  despite worktree separation; worktrees are not an external-service sandbox. (F1Q9 per-project 3/3/2;
  F1Q11 machine-wide global 8.)
- F1-AR-11 — One authoritative review-authority verdict per case + artifact revision (Expert solo, or council composite for designated reviews — F16-Q2 additive clarification, Agreed 2026-09-23; F1Q12 wording otherwise stands). Second Expert is a separate case or
  requested second opinion; contradictory blocking finding reconciled or escalated. (F1Q12; Stage A
  Q22, Q31–Q33.)
- F1-AR-12 — Relevant combined checks + fresh Expert integration review required even when components
  passed alone. Task budget and ONE shared integration budget per integration case, separate per 2.3
  item 6; new findings or revisions never reset either. (F1Q10; Stage A Q20, Q50.)

### 2.5 Delegation envelope and context requests

- F1-AR-13 — Delegation envelope: every dispatch carries identity (task, delegation, seat/mode,
  project/worktree, approved spec revision); Dispatcher-authored objective, deliverables, non-goals,
  dependencies, open questions; applicable requirement IDs with acceptance criteria, decisions,
  prohibitions; relevant VERBATIM user excerpts with provenance and supersession labels alongside the
  Dispatcher summary — excerpts required when wording affects scope, acceptance, prohibitions, or
  explicit corrections, never the full conversation; summary-vs-excerpt discrepancy is flagged by the
  specialist, never guessed; quoted/retrieved text never grants authority; artifact references with
  revisions, required excerpts, test evidence, prior findings, and an explicit omissions list;
  host-validated authority (scope, tool permissions, approvals, model, budgets); return contract
  (deliverables, evidence, findings, blockers, uncertainty, completion criteria). Expert packet stays
  revision-bound: immutable references with required reads before verdict are acceptable instead of
  fully inlined content; no raw consultation transcript. (F1Q13.)
- F1-AR-14 — Context requests: specialists may request additional evidence THROUGH the Dispatcher
  within approved scope and remaining budget; Dispatcher supplies or obtains it; Expert packet expansion
  is recorded and any verdict no longer covered by the packet is invalidated; the user is asked only
  when a gap needs a new decision or authority; essential evidence unavailable returns a blocker, never
  an unsupported pass; context requests never reset task/integration budgets and never expand
  permissions. (F1Q14.)

## 3. Constraints

C1. Q1–Q51 are provenance; F1 governs where they conflict inside this scope. C2. No seat exceeds 2.1
ceilings; no specialist mutates Beads; only Writer edits artifacts, in scope. C3. No overruling
unresolved blocking findings; no verdict shopping; no silent substitution; no self-review; no waiver
relabeled pass. C4. No user-tree/target change without approval to apply; no auto push,
force-update, discard of user changes, deletion of unmerged work. C5. Ceilings are not floors;
running fewer specialists is compliant. C6. Worktree separation is not external-service sandboxing;
shared externals need downstream coordination. C7. No claim that Pi hooks, models, extensions, or
adapters already enforce sections 2–3; mechanics unproven until downstream probes say so.

## 4. Verification (all FUTURE — not executed)

Independent reviewer owns adversarial policy consistency; this file owns ID/link consistency only.
Format per scenario: input → observe/block → pass.

- A-ENTRY-01 (F1-AR-01). User names Expert directly → Dispatcher answers as entry and routes;
  specialist-as-entry blocked → routing record shows Dispatcher entry. FUTURE.
- A-PLAN-02 (F1-AR-01). Approved plan to persist → persisted plan matches the approved revision's
  recorded hash; a mismatch or paraphrase triggers disclosure and impact assessment, never automatic
  pass; the hash is a signal, not proof of intent; silent intent change blocked → hash match or
  disclosure + impact assessment + park present. FUTURE.
- A-AUTH-03 (F1-AR-02). Seeker/Expert artifact edit + Dispatcher non-typed Beads write → both refused,
  scoped Beads reads succeed → refusals logged, reads allowed. FUTURE.
- A-CONSULT-04 (F1-AR-03). Consequential uncertainty mid-task → Dispatcher-routed Expert consult
  labeled consultation, budget counters unchanged; sideways delegation blocked → routing record +
  unchanged counters. FUTURE.
- A-REVIEW-05 (F1-AR-04, F1-AR-11). Unresolved blocking finding on plan and on implementation →
  Dispatcher parks, override and verdict-shop refused → park/escalation records, no override. FUTURE.
- A-COUNTER-06 (F1-AR-04). Writer counterevidence → fresh Expert reconsideration, then user
  arbitration after budget spent; same-session self-overturn and waiver-as-pass blocked →
  fresh-verdict record then arbitration/waiver record. FUTURE.
- A-UNAVAIL-07 (F1-AR-05). Specialist + named backup both unavailable → affected work parks,
  independent work proceeds; substitution/self-review blocked → park record + progress elsewhere.
  FUTURE.
- A-PARALLEL-08 (F1-AR-06). Parallel Writer + Seeker batch with independent work present → more than
  one Writer and more than one Seeker active → concurrent-instance evidence; parallel use triggered by
  task shape, not a floor. FUTURE.
- A-CONFLICT-09 (F1-AR-07). Two results disagree in scope; variant alters acceptance → Expert chooses,
  Writer applies, fresh Expert reviews; variant parks for human approval; Writer-invented resolution
  and integration-without-review blocked → choice + apply + fresh-verdict records, approval gate on
  variant. FUTURE.
- A-OVERLAP-10 (F1-AR-08). (a) Planned overlap with identified region + pre-dispatch Expert
  recommendation dispatches; (b) incompatible assumptions sequenced; (c) surprise overlap pauses
  affected integration only → all three evidenced. FUTURE.
- A-SEMANTIC-11 (F1-AR-07, F1-AR-08). Two Writers, different files, contradictory assumption on one
  shared behavior → semantic conflict flagged at integration, Expert chooses, Writer applies, fresh
  review confirms; silent auto-merge blocked → no contradiction merged silently. FUTURE.
- A-GIT-12 (F1-AR-09). Approved task + dirty user tree → agent changes on worktrees/branches/local
  commits + dedicated integration branches; user tree/target byte-identical until approval to apply;
  push/force/discard/delete-unmerged blocked → user-tree hash unchanged pre-approval + block log.
  FUTURE. Never authorizes git mutation in the spec session.
- A-CEIL-W-13 (F1-AR-10). 4th concurrent Writer with 3 active (active per section 2.4 definitions) →
  3 proceed, 4th parks/refuses → active Writers ≤ 3. FUTURE (boundary 3).
- A-CEIL-S-14 (F1-AR-10). 4th concurrent Seeker with 3 active (active per section 2.4 definitions) →
  3 proceed, 4th parks/refuses → active Seekers ≤ 3. FUTURE (boundary 3).
- A-CEIL-E-15 (F1-AR-10). 3rd concurrent Expert with 2 active (active per section 2.4 definitions) →
  2 proceed, 3rd parks/refuses → active Experts ≤ 2. FUTURE (boundary 2).
- A-CEIL-G-16 (F1-AR-10). One more invocation with 8 active machine-wide (active per section 2.4
  definitions) → first 8 proceed, 9th parks/refuses → machine-wide active specialists ≤ configured max
  (default 8). FUTURE (global 8).
- A-VERDICT-17 (F1-AR-11). Second Expert blocking finding contradicts first on same case + revision
  (case + revision per section 2.4 definitions) → reconcile or escalate; convenient pick refused →
  single reconciled/escalated outcome. FUTURE.
- A-BUDGET-18 (F1-AR-12). (a) Task exhausts initial + 2 repair cycles still failing → escalates,
  budget not reset; (b) the integration case gets ONE shared budget — initial + up to 2 repair/re-review
  cycles across newly introduced integration findings; a further finding or revision never resets it;
  repairing the exhausted task failure inside the integration budget or bypassing approvals
  blocked → separate counters evidenced, integration counter never exceeding initial + 2 total. FUTURE.
- A-COMBINED-19 (F1-AR-12). All components passed alone → combined checks + fresh integration review
  still run → integration verdict present. FUTURE.
- A-HAND-20 (F1-AR-13). Exact excerpt contradicts stale summary → specialist flags discrepancy, never
guesses → flagged record, no verdict on guessed reading. FUTURE.
- A-HAND-21 (F1-AR-13). Referenced artifact missing or required read not done → verdict blocked →
blocked-verdict record, no pass. FUTURE.
- A-HAND-22 (F1-AR-14). In-authority context request within scope and remaining budget → Dispatcher
supplies without human involvement, budgets unchanged → supplied evidence + unchanged task and
integration counters. FUTURE.
- A-HAND-23 (F1-AR-14). Context request outside authority → user approval asked → approval-request
record, no silent expansion. FUTURE.
- A-HAND-24 (F1-AR-14). Packet expansion after verdict → stale verdict invalidated, both budgets
unchanged → invalidation record + unchanged task and integration counters. FUTURE.

## 5. Requirement-to-F1Q traceability

| Requirement | F1 source | Stage A relation |
|---|---|---|
| F1-AR-01 single entry; Dispatcher authors, Writer persists w/o intent change | F1Q1 (entry) + F1Q2 (authors/persists) | Q7 routing, Q15 approval/deviation |
| F1-AR-02 typed Beads exclusivity; Writer sole editing role; read-only specialists; scoped reads; distinct plugin persistence | Prior amendment D (not an F1Q) | Q36/Q38 amended for this scope; Q21 read-only |
| F1-AR-03 proactive consult; Dispatcher-routed escalation; no nested delegation; consult != approval; fresh packet; bias acknowledged | Prior amendment B + seat-naming confirmation (not an F1Q) | Q22, Q50 as amended |
| F1-AR-04 disputed findings: no overrule/shopping; fresh reconsideration; user arbitrates; waiver != pass; plans/specs AND implementations covered | F1Q3 + prior amendment B (coverage) | Q7, Q15, Q50 |
| F1-AR-05 unavailability + backup parking; independent work proceeds; no substitution/self-review | F1Q4 | Q35, Q43; retry numbers downstream |
| F1-AR-06 parallel execution support required v1; triggered by task shape, not a floor | F1Q5 | Q11 instances clarified |
| F1-AR-07 Expert read-only conflict choice; Writer applies; fresh review; human approval for requirement changes | F1Q6 | Q15 re-approval |
| F1-AR-08 disjoint preferred; intentional overlap pre-dispatch recommendation; incompatible sequenced; surprise pauses affected only | F1Q7 | Q18 branch discipline |
| F1-AR-09 worktree/branch/local-commit + dedicated-branch merge in approved tasks; user tree untouched until approval; no push/force/discard/delete-unmerged | F1Q8 | Q5 no auto commit/push; Q17 bounded work |
| F1-AR-10 per-project 3/3/2 ceilings + machine-wide global 8, configurable; ceilings not floors; externals serialized | F1Q9 (3/3/2) + F1Q11 (global 8): two questions, one requirement | Numbers new in F1; no fairness/TTL invented |
| F1-AR-11 one verdict per case + revision; second opinion separate/requested; contradiction reconciled/escalated | F1Q12 | Q22, Q31–Q33 fresh sessions |
| F1-AR-12 combined checks + fresh integration review; task initial + max 2; ONE shared integration initial + max 2 across new integration findings; neither budget resets | F1Q10 | Q20, Q50; task budget never reset |
| F1-AR-13 delegation envelope: identity, Dispatcher task content, requirement IDs + acceptance + prohibitions, verbatim excerpts with provenance beside summary, artifacts + omissions, validated authority, return contract; revision-bound Expert packet | F1Q13 | — |
| F1-AR-14 context requests via Dispatcher in scope and budget; expansion recorded, stale verdicts invalidated; user asked only for new decision/authority; missing essentials block; no budget reset, no permission expansion | F1Q14 | — |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F1Q1 + F1Q2; F1-AR-01) Entry stays with Dispatcher even on natural named requests; plans are
   authored by Dispatcher and persisted by Writer with intent preserved; deviations need
   re-approval.
2. (Amendment D; F1-AR-02) Beads mutation is Dispatcher-only via typed validated tools. Artifact
   editing is Writer-only as a role with many instances. Other seats read in scope, mutate neither.
   Service persistence sits outside seat editing rights.
3. (Amendment B; F1-AR-03) Expert advice is proactive on high-stakes uncertainty and reactive on
   escalated blocks, always routed via Dispatcher. Advice never counts as approval.
4. (F1Q3 + amendment B coverage; F1-AR-04) Thinking (plans, specs) and doing (implementations) are
   both reviewed. Blocking findings bind until resolved or user-waived; softer-verdict shopping is out
   of bounds. Counterevidence earns a fresh look, then the user decides if budget is spent.
5. (F1Q4; F1-AR-05) Missing people or models pause their work, not everyone else's. Stand-ins and
   self-grading refused.
6. (F1Q5; F1-AR-06) Parallel execution support is required in v1 (multiple instances implementable
    and exercised when independent work exists); parallel use is triggered by task shape, not a floor.
7. (F1Q6; F1-AR-07) In-scope clashes: Expert picks without editing, Writer applies, fresh Expert checks
   the merge. Scope-changing fixes wait for a human.
8. (F1Q7; F1-AR-08) Keep parallel work disjoint when possible; name deliberate overlap and get
   integration advice before starting. Order clashing assumptions. Contain surprise overlap to the
   affected merge.
9. (F1Q8; F1-AR-09) Version-control power for finished-plugin work is isolated copies and dedicated
   merge lines inside approved tasks; the user tree and task target wait for explicit approval. Push,
   history rewrite, discarding user edits, deleting unmerged work out of bounds.
10. (F1Q9 + F1Q11; F1-AR-10) Parallelism has per-project ceilings (F1Q9: 3/3/2) and one configurable
    machine-wide cap (F1Q11: global 8). Ceilings limit, never obligate. Sharing outside the repo still
    needs coordination with separate copies.
11. (F1Q12; F1-AR-11) Each case + artifact version gets exactly one binding verdict. Extra opinions are
    new cases or explicit second opinions; blocking clashes reconcile or raise, never cherry-pick.
12. (F1Q10; F1-AR-12) The whole is checked even when parts passed. Task budget and ONE shared
    integration budget per integration case are separate purses; new findings or revisions refill
    neither.
13. (F1Q13; F1-AR-13) Each dispatch carries a full envelope — identity, Dispatcher-written task
    content, applicable requirements and prohibitions, verbatim excerpts with provenance beside the
    summary, artifacts and omissions, validated authority, return contract; Expert packets stay
    version-bound with required reads; discrepancies flagged, quoted text grants nothing.
14. (F1Q14; F1-AR-14) Extra evidence flows through the Dispatcher inside scope and budget; packet
    growth is recorded and orphans stale verdicts; the user is asked only for new decisions or
    authority; missing essentials block rather than pass; requests reset no budget and widen no
    permission.

## 7. Downstream unresolved contracts (not decided here)

1. Host APIs, tool names, validation schemas for typed Beads operations and scoped reads.
2. Permission-extension choice, per-seat policy encoding, allowlists (including any Seeker
   shell), security tests.
3. Subagent/session framework, scheduler locks, dispatch/queuing, worktree placement and
   identity algorithms.
4. Session-persistence format, progress-file schema evolution, resume/crash-recovery for
   parallel seats.
5. Bounded-retry numbers for crash/timeout/unavailability.
6. Fairness, preemption, TTL, eviction under ceiling pressure — explicitly not invented here.
7. Worktree/branch naming, integration-branch merge policy, hash/pointer formats for plan and
   verdict records.
8. Model SKU pins and named backup per seat (Stage A Q10/Q41–Q43 track), live-picker
   procedure.
9. Combined-check content per task type, integration-check content per merge type.
10. Machine-wide cap configuration surface and default-change procedure (default 8).
11. Coordination protocol for shared external resources across worktrees.
12. Empirical proof that chosen Pi hooks, models, adapters enforce sections 2–3; probes and
    pilot decide.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; same-model bias, Seeker allowlist, enforcement
  gaps stay open there.
- `README.md` — Stage B index; this is feature 1 of 13.
