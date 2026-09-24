# DECISIONS — Q1–Q51 recorded digest (verbatim history) + latest-decision amendments

Status: revised draft pending review. No implementation. Stage A
documentation only.

Q1–Q51 below are HISTORY: wording is verbatim from the Stage A dispatch
and is not edited to match later corrections. The source pointer on each
line is the dispatch record. Active docs (`PRD.md`, `MANIFEST.md`,
`EVIDENCE.md`, `features/README.md`) follow the latest-decision amendments
in the next section. Where an amendment and a Q line differ, the amendment
governs the active reading; the Q line stands as provenance. No new Q
numbers are assigned in this dispatch. No folder, package, or npm rename.

## Latest-decision amendments (revised draft; govern active reading)

A. Product name and seat names. Product name: Dispatch (user-selected).
Active seats: Dispatcher
(plans/orchestrates; Beads lifecycle authority), Writer (sole agent
editing project artifacts), Seeker (research and documentation drafts;
read-only on project artifacts), Expert (independent review and
complex-problem consultation; read-only). Historical Q wording
(orchestrator-planner, implementer, researcher-documenter, reviewer) is
retained verbatim below; read those names as Dispatcher, Writer, Seeker,
Expert respectively in active docs.
B. Expert two modes. Proactive consultation on consequential uncertainty
and escalation for blocked work; the Dispatcher routes and specialists
request escalation, never nested delegation. Consultation is not approval
and never resets the repair/re-review budget. Initial review plus at most
two automatic repair/re-review cycles; earlier escalation on
no-progress, scope change, or side-effect ambiguity. Reviews cover
plans/specs AND implementations; a fresh review session receives the
approved spec, artifacts, tests, and findings, not the consultation
transcript. Same-model anchoring limitation acknowledged (see PRD
section 3.3 and `EVIDENCE.md`).
C. Memory backends. No categorical v1 exclusion or deferral of Mem0,
MemPalace, or qmd. Approved: file-vault durable record plus
probe-selected recall aid (Q24, Q25). Mem0, MemPalace, qmd, and custom
alternatives are candidate backends compared before selection at spec
phase — not selected dependencies, not necessarily optional user
installs, no promise to adopt all. Magic Context plus native compression
remains the approved working-context direction with unresolved
compatibility, NOT a working integration; selection/probe blocker flagged
(see PRD sections 3.2 and 7, review comment 1).
D. Beads and artifact authority. The Dispatcher holds exclusive Beads
lifecycle mutation through typed validated host tools, not unrestricted
shell. The Writer is the sole agent editing project artifacts; plugin
services own authorized state and memory persistence (the Writer is not
the sole component allowed persistent writes). Specialists have no Beads
mutation; scoped Beads reads are permitted. The Seeker defaults to typed
local inspection with a bounded read-only shell for useful gaps; the
exact allowlist and security tests are unresolved at spec phase. Git and
bd reads do not inherently require shell; typed wrappers are possible
(see PRD sections 3.1, 3.6 and section 7, review comment 3).
E. donsetch shape. Pinned external dependency plus a thin policy adapter;
no vendored engine or fork planned. The adapter controls seat access,
timeouts, cancel, output, zero-paid fallback, and version checks. CLI/MCP
versus native Pi extension is an unresolved compatibility choice pinned
at spec phase. No new licensing guarantees: AGPL obligations and the
interface boundary require actual license review; prior blanket clearance
is not proof (see PRD section 3.5 and section 7, review comment 4).

- Q1: prioritize autonomy, ease of use, correctness, continuity; token efficiency secondary; no voice cards. — Source: Stage A dispatch, recorded user decision Q1.
- Q2: general-purpose, DevOps focus; no real-work test access — synthetic suite + supervised pilot instead. — Source: Stage A dispatch, recorded user decision Q2.
- Q3: personal work tool; common config ships in plugin; presets separate per machine type (OpenCode Go + GitHub Copilot). — Source: Stage A dispatch, recorded user decision Q3.
- Q4: entirely open; no added privacy partition; employer network policies handle egress. — Source: Stage A dispatch, recorded user decision Q4.
- Q5: additive no-clobber bootstrap (git init, project AGENTS.md, beads init, .pi/settings); no automatic commits/pushes/global installs. — Source: Stage A dispatch, recorded user decision Q5.
- Q6: approval required for destructive/external/paid actions; never silent model substitution. — Source: Stage A dispatch, recorded user decision Q6.
- Q7: proportional routing tiny/standard/heavy; spec approval + independent review for consequential work. — Source: Stage A dispatch, recorded user decision Q7.
- Q8: zero-paid web default; disclose coverage gaps rather than assume. — Source: Stage A dispatch, recorded user decision Q8.
- Q9: memory inspectable/correctable/deletable/source-linked; session history separate from durable knowledge. — Source: Stage A dispatch, recorded user decision Q9.
- Q10: work=Copilot Business; personal=OpenCode Go; single fixed assignment per seat for v1 (Astra preference for high-performance seats, Luna for light seats). — Source: Stage A dispatch, recorded user decision Q10.
- Q11: four seats; planner merged into orchestrator; researcher+documenter merged; reviewer independent. — Source: Stage A dispatch, recorded user decision Q11.
- Q12: layered soft enforcement; no containers. — Source: Stage A dispatch, recorded user decision Q12.
- Q13: no standing memory agents; hook-driven + event-driven maintenance. — Source: Stage A dispatch, recorded user decision Q13.
- Q14: Windows+macOS required; prerequisites allowed. — Source: Stage A dispatch, recorded user decision Q14.
- Q15: one spec approval (outcome/scope/acceptance/consequences); alert ALL deviations; reapprove changed outcomes/scope/acceptance/consequences. — Source: Stage A dispatch, recorded user decision Q15.
- Q16: named-environment authorization for external reads; separate mutation and production approvals. — Source: Stage A dispatch, recorded user decision Q16.
- Q17: bounded unattended work/retries; persist state; no silent side-effect resumption after restart. — Source: Stage A dispatch, recorded user decision Q17.
- Q18: proceed reversible work when uncertainty not acceptance-critical; stop affected branch otherwise; disclose. — Source: Stage A dispatch, recorded user decision Q18.
- Q19: memory shared across sessions/projects/agents on each machine; installations entirely separate. — Source: Stage A dispatch, recorded user decision Q19.
- Q20: synthetic suite then supervised pilot; failure-path scenarios required. — Source: Stage A dispatch, recorded user decision Q20.
- Q21: researcher strictly read-only; doc content rides in report packs; implementer commits. — Source: Stage A dispatch, recorded user decision Q21.
- Q22: one fresh-context reviewer seat; multi-lens band only if pilot shows misses. — Source: Stage A dispatch, recorded user decision Q22.
- Q23: decomposed into Q24–Q28. — Source: Stage A dispatch, recorded user decision Q23.
- Q24: durable record = git-tracked file vault, wiki pattern (raw/ immutable, wiki/ compiled, index/log); per-project + machine-shared vault with scope tags; DBs serve recall only. — Source: Stage A dispatch, recorded user decision Q24.
- Q25: recall aid selected by synthetic probe (file-index-only vs hybrid search vs verbatim vs extraction); lean file-index + hybrid if cheap. — Source: Stage A dispatch, recorded user decision Q25.
- Q26: agents stage UNVERIFIED entries only (source link required); background verifier promotes; user writes/deletes directly. — Source: Stage A dispatch, recorded user decision Q26.
- Q27: supersede-don't-overwrite; old claim retained with supersedes link; lint surfaces contradictions; explicit deletable. — Source: Stage A dispatch, recorded user decision Q27.
- Q28: hybrid context — native Pi compressor + Magic Context archive/retrieval; single compressor owner; per-turn re-injection of must-follow rules. NOTE (audit tgo-vkcu): archive-only needs custom adaptation — runtime eval required. — Source: Stage A dispatch, recorded user decision Q28.
- Q29: manual /compact and /ctx-* escapes always available. — Source: Stage A dispatch, recorded user decision Q29.
- Q30: v1 interactive Pi only; OMP fork out; headless --print children without background historian. — Source: Stage A dispatch, recorded user decision Q30.
- Q31: role-sensitive session reuse — researcher/implementer may resume partial sessions under guards; reviewer always fresh; orchestrator holds no specialist sessions. — Source: Stage A dispatch, recorded user decision Q31.
- Q32: resumable bar = progress file + non-terminal run log + under preset token budget + identity equal. — Source: Stage A dispatch, recorded user decision Q32.
- Q33: completed sessions never reused; follow-ups start fresh with artifact packet (spec, decisions, dead ends, open questions). — Source: Stage A dispatch, recorded user decision Q33.
- Q34: resume gates = identity equality (model+variant+preset+seat config+tools/skills+host version) AND no permission narrowing; unconfirmed external actions re-validated, never replayed. — Source: Stage A dispatch, recorded user decision Q34.
- Q35: crash/timeout auto-recover with bounded retries; repeated failure or side-effect ambiguity escalates; cancel → fresh. — Source: Stage A dispatch, recorded user decision Q35.
- Q36: one enforcement layer with four per-seat policies; global deny floor. — Source: Stage A dispatch, recorded user decision Q36.
- Q37: interactive ask allowed only for implementer within approved scope; unattended seats deny. — Source: Stage A dispatch, recorded user decision Q37.
- Q38: researcher gets minimal read-only bash allowlist (git metadata, file stats, bd reads) per audit tgo-8p1y; enforced as tool_call hard block (deny compound unless every segment allowlisted; deny PAGER/EDITOR/GIT_* env tricks). — Source: Stage A dispatch, recorded user decision Q38.
- Q39: Windows = soft-only enforcement with explicit degraded banner; WSL2 optional path. — Source: Stage A dispatch, recorded user decision Q39.
- Q40: session-scoped grants default; per-tool persistence only by explicit opt-in, logged. — Source: Stage A dispatch, recorded user decision Q40.
- Q41: Copilot Business, employer-controlled; available: Astra, GPT-5.6 family (Sol/Terra/Luna), GPT-5.5, GPT-5.4 mini/standard, GPT-5.3 Codex, GPT-5 mini, Gemini 3.8/3.7/3.6/3.5 Flash, Claude Sonnet 5, Opus 5/4.8/4.7, Haiku 4.5. Astra ABSENT from OpenCode Go. — Source: Stage A dispatch, recorded user decision Q41.
- Q42: Go subscription active; Use-balance currently ON for unrelated testing, normally OFF — leave untouched; recommend off to prevent silent spend. — Source: Stage A dispatch, recorded user decision Q42.
- Q43: one named backup model per seat with logged notice before abort. — Source: Stage A dispatch, recorded user decision Q43.
- Q44: no ZDR constraint for v1. — Source: Stage A dispatch, recorded user decision Q44.
- Q45: distribution = git-tag install from GitHub; no npm publish for v1; pinned refs immutable; drift warn-only. — Source: Stage A dispatch, recorded user decision Q45.
- Q46: always-trust pre-configured (user override; does NOT authorize deployments/destructive actions/paid fallback). — Source: Stage A dispatch, recorded user decision Q46.
- Q47: bd is a plugin dependency installed when missing (not per-project prerequisite step). — Source: Stage A dispatch, recorded user decision Q47.
- Q48: spec store = repo files .planning/specs/NNN-slug/ source of truth; beads issues hold hash pointers; living-spec revisions in place. — Source: Stage A dispatch, recorded user decision Q48.
- Q49→Q51: hybrid retrieval — donsetch primary + Context7 + one anonymous hosted search + TinyFish/Jina/markdown.new fallbacks; exact artifacts pinned at build; AGPL-3.0 acceptable; single-maintainer risk mitigated by pinning + chain fallback. — Source: Stage A dispatch, recorded user decision Q49–Q51.
- Q50: initial review then at most two automatic repair/re-review cycles; early escalation on no-progress/scope-change/side-effect ambiguity. — Source: Stage A dispatch, recorded user decision Q50.
- Q52-style standing rules: beads sole tracker; lean prompts (target ≤500 tokens, hard cap 1000); retrieval-led reasoning; prose-driven everything; no slash commands required. — Source: Stage A dispatch, recorded standing rules.

## F1 digest — agent roles and collaboration (paraphrase; governs feature F1)

Status: settled F1 decisions F1Q1–F1Q14, user-approved concurrency boundaries and delegation envelope included; approved and closed (tgo-dsjc); scenarios FUTURE.
Paraphrase only; no user quotes reproduced. Numbered by accurate F1 question; Beads authority
(amendment D) and proactive Expert consult (amendment B plus seat-naming confirmation) are prior
amendments, not F1Qs. Normative text lives in `features/agent-roles.md` as `F1-AR-01` …
`F1-AR-14`, whose trace table allows multi-source mappings; this digest is the decision
record, not the spec. Where a Q1–Q51 line and an F1 decision conflict inside
feature-F1 scope, F1 governs.

1. F1Q1: single conversation entry stays with the Dispatcher even when the user
   addresses a specialist, including natural named requests.
2. F1Q2: spec/plan content is authored by the Dispatcher and persisted by the
   Writer with intent unchanged; deviations stop, disclose, and re-approve.
3. F1Q3: disputed review findings — Writer counterevidence earns fresh Expert
   reconsideration; the Dispatcher cannot overrule unresolved blockers; the user
   arbitrates past budget or early trigger; waivers record as waivers, never clean
   passes.
4. F1Q4: unavailable seats only — an unavailable specialist, backup included,
   parks affected work while independent work proceeds, with no silent role
   substitution; retry numbers stay downstream.
5. F1Q5: multiple parallel Writers and Seekers are required in v1.
6. F1Q6: read-only Expert conflict decision — the Expert chooses inside scope,
   the Writer applies, and a fresh Expert reviews the integrated result; scope
   changes wait for human approval.
7. F1Q7: deliberate overlap policy — disjoint preferred; intentional overlap needs
   identified overlap plus a pre-dispatch Expert integration recommendation;
   clashing assumptions run in sequence; surprise overlap pauses the affected
   integration only.
8. F1Q8: isolated local version-control authority — within approved tasks the
   finished plugin may use worktrees, branches, and local commits of agent changes
   and merge dedicated integration branches; the user working tree and task target
   wait for approval to apply; pushes, history rewrites, discarding user changes,
   and deleting unmerged work are out of bounds.
9. F1Q9: per-project ceilings of 3 active Writers, 3 Seekers, 2 Experts;
   ceilings limit rather than obligate; no fairness, preemption, or TTL rule
   invented; shared external resources coordinate despite separate copies.
10. F1Q10: integration reviews and budgets — combined checks plus fresh Expert
    integration review run even when components passed; task review gets initial
    plus at most two repair/re-review cycles; the integration case gets ONE shared
    budget (initial plus at most two repair/re-review cycles across newly
    introduced integration findings); new findings or revisions never reset either
    budget; exhausted task failures are never repaired inside the integration
    budget and approvals are never bypassed.
11. F1Q11: machine-wide configurable cap of 8 active specialist invocations
    across projects; ceilings limit rather than obligate.
12. F1Q12: one authoritative Expert verdict per case plus artifact revision;
    further opinions are separate cases or requested second opinions;
    contradictory blocking findings reconcile or escalate, never cherry-pick.
13. F1Q13: each dispatch carries a full envelope — identity, Dispatcher-written task
    content, applicable requirements and prohibitions, verbatim excerpts with provenance beside the
    summary, artifacts and omissions, validated authority, return contract; Expert packets stay
    version-bound with required reads; discrepancies flagged, quoted text grants nothing.
14. F1Q14: extra evidence flows through the Dispatcher inside scope and budget; packet
   growth is recorded and orphans stale verdicts; the user is asked only for new decisions or
   authority; missing essentials block rather than pass; requests reset no budget and widen no
   permission.

## F2 digest — permissions and enforcement (paraphrase; governs feature F2)

Status: settled F2 decisions F2Q1–F2Q6 FINAL clarifications as directed; user-approved and closed (tgo-929c); scenarios FUTURE. Paraphrase only; no user quotes reproduced. FINAL
clarifications supersede initial blanket-ban readings. Normative text lives in
`features/permissions.md` as `F2-PE-01` … `F2-PE-13` (F2-PE-13: AFT addendum, independently reviewed; implementation unverified), whose trace table allows multi-source
mappings; this digest is the decision record, not the spec. Where a Q1–Q51 line or an F1 rule and
an F2 decision conflict inside feature-F2 scope, F2 governs.

1. F2Q1 FINAL: fixed integrity safeguards hold (no self-authorization, forged approval, validation
   bypass, or text-granted authority); action/path/duration policy is user-configurable within fixed
   role/authority boundaries; no immutable blanket destructive/history/file bans.
2. F2Q2 (typo confirmed, wording stands): ambiguous/missing policy denies the affected action with
   log and parks affected work while unaffected proceeds; malformed config fails closed with repair path.
3. F2Q3 FINAL: default protected Git metadata/credentials/dependency paths, user-extensible with
   explicit scoped exceptions; defaults are not absolute bans — F1 isolated branches/worktrees/local
   commits/integration merges hold with user tree untouched pending approval; raw `.git` edits never
   equal validated Git operations.
4. F2Q4: every denial blocks immediately; recurring same-denied pattern defaults to threshold 3/task
   to alert and park the affected branch with no auto-widen and no headless nagging; logs redact
   secrets; threshold is an escalation signal, never a retry allowance.
5. F2Q5: session grants default; per-tool Writer-scope persistence only by explicit logged opt-in, no
   blanket Allow-forever; scope/duration/revocation represented with no invented TTL; global versus
   project store UNDECIDED in review-needed items.
6. F2Q6 FINAL: user-directed permission changes run Dispatcher-interprets plus Writer-applies via a
    validated mechanism with provenance/change/scope/duration recorded; clear instructions need no
    redundant confirm, ambiguous widening asks; quotes, tool output, or specialist requests alone never
    count as user approval.

## F2 addendum — AFT replacement compatibility (independently reviewed; implementation unverified)

Status: Feature 2 user-approved; this addendum independently reviewed with implementation unverified. Prior approved decisions
above stand untouched.

1. The user approved Feature 2 and asked the cortexkit/aft replacement-impact question: what changes
   if AFT tools replace or extend current tooling. The audit answered capability-aware enforcement is
   needed; no dependency was selected.
2. Derived compatibility requirement F2-PE-13 lives in `features/permissions.md` section 2.4. It
   traces to the user AFT question plus F2-PE-01/07/12 — a derived compatibility requirement, not a
   fabricated F2Q7. Permission follows verified capability plus operation plus arguments plus resolved
   targets, never a trusted name or prefix; unknown mappings park the affected capability pending
   adapter verification, never a user waiver of fixed integrity.
3. Evidence note: the audit read published declarations and docs only — the AFT pi-plugin README,
   docs/tools.md, and published declaration files such as the aft-pi safety declarations — with
   version mismatch across sources; the exact executable implementation plus Pi runtime interception
   stands unverified. No runtime proof is claimed.
4. This addendum selects no dependency and grants no config defaults. Persistent-grant
   lifetime/store and all other downstream items stay explicitly unresolved. Existing role
   boundaries, user-authorized policy changes, and F1 workflow are unchanged.

## F3 digest — SDD workflow and drift control (paraphrase; governs feature F3)

Status: settled F3 decisions F3Q1–F3Q6, user-agreed; user-approved, independently reviewed,
implementation unverified; scenarios FUTURE. Section 2.5 packet-validity applicability rule
user-approved: editorial change can retain prior review applicability via recorded assessment;
uncertain coverage blocks, no stale material verdict. Paraphrase only; no user quotes reproduced.
Normative text lives in `features/sdd-workflow.md` as `F3-SD-01` … `F3-SD-12`, whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2 rule and an F3 decision conflict inside feature-F3 scope, F3 governs.
Approved F1/F2 requirements stand untouched.

1. F3Q1: one combined requirements-plus-execution-plan approval by default, after Expert coverage
   of both artifacts (one session may cover both, no two-invocation mandate); consequential
   unresolved choices surface first; arbitrary implementation detail never triggers automatic
   re-approval; ordering for explicit user change requests follows the F3Q5 exception.
2. F3Q2: nonmaterial deviations (outcome/scope/acceptance/consequences unchanged) carry visible
   timely notice plus a record with Dispatcher explanation and may continue; material or uncertain
   deviations pause affected work while independent work proceeds; no blanket filename/typo safe
   class, no burying deviations in a final report.
3. F3Q3: ONLY tasks classified tiny may use a compact spec+plan (intent/boundaries/acceptance plus
   tiny-eligibility justification) linked from Beads as the sole tracker; standard/heavy tasks use a
   fuller structure under the same gates; compactness never waives required review or approval;
   promote to the fuller structure with its review before continuing when the task is no longer tiny.
4. F3Q4: conflicting sources are preserved as originals with exact conflicting excerpts and
   provenance; explicit supersession governs, otherwise the human is asked for the winner; no
   timestamp/detail/summary precedence; unaffected requirements proceed.
5. F3Q5: spec/test revision changes trigger an impact check before affected continuation; material
   change needs renewed approval, editorial change with a linked revision needs no redundant human
   gate; editing a file alone is never approval; an explicit clear scoped user change request can
   record authorization with validated provenance even before the required updated review completes,
   while affected execution stays gated on that review plus valid authority (no rubber stamp, no
   redundant confirmation for ordering alone); verdict and evidence stay revision-bound to the
   reviewed revision, executed checks, and inspected evidence (machine/model/user separate), and an
   easier replacement test never proves the original requirement.
6. F3Q6: explicit scoped residual-risk acceptance yields accepted-with-exceptions, never a clean
   pass; a task waiver is never a feature waiver; without acceptance blockers remain and partial
   progress never reads as complete; no waiver authorizes a fixed-authority bypass — configurable
   permissions change only through the separate validated change flow per F2.

## F4 digest — Beads integration (paraphrase; governs feature F4)

Status: settled F4 decisions F4Q1–F4Q6, user-approved, independently reviewed,
implementation unverified; scenarios FUTURE. Ready for primary closure; tracker still open. Paraphrase only; no user quotes reproduced.
Normative text lives in `features/beads-integration.md` as `F4-BI-01` … `F4-BI-12`, whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2/F3 rule and an F4 decision conflict inside feature-F4 scope, F4 governs.
Approved F1/F2/F3 requirements stand untouched.

1. F4Q1: planning, research, decision, and proposed-implementation issues may be created before
   implementation approval; creation never authorizes execution; research stays inside its
   separately authorized scope; implementation waits for the F3 gate; issue text never approves.
2. F4Q2: an existing COMPATIBLE tracker is auto-adopted after compatibility plus project-identity
   checks with issues, config, owners, deps, and history preserved; no reinit, silent migration,
   unrelated claim, or silent upgrade; incompatibility or damage is disclosed and its repair or
   migration authorized separately from a missing-binary install.
3. F4Q3: live human tracker changes govern task state — reconcile running assignments, stop new
   affected actions on withdrawal or contradiction, preserve artifacts, report underway effects,
   park affected branches; no silent undo or reopen; manual close never equals tests-passed,
   Expert verdict, or deployment permission; manual reopen neither renews approval alone
   nor revokes still-valid approval alone — missing or revoked approval blocks, while a
   valid covering approval still in scope and duration resumes after live ownership and
   evidence checks without redundant human approval.
4. F4Q4: run ownership is distinct from the human assignee; no takeover on idleness or matching
   username alone; verified same-run recovery proceeds per existing policy; possible other-run
   owner or ambiguity parks the conflicting assignment and asks before transfer.
5. F4Q5: outage bars new claims, delegations, lifecycle mutations, and completion declarations;
   the current bounded authorized reversible unit may finish with artifacts preserved, then park;
   no next task or consequential external action; uncertain or revoked authority still stops work;
   disclose, restore, reconcile ownership/state/evidence before resume; the durable journal is
   memory only, never task authority; no offline completed claims.
6. F4Q6: uncertain create/claim/close outcomes reconcile against live evidence before retry;
   confirmed original success reconciles without replay and is never retried, confirmed
   nonexecution may retry, remaining ambiguity parks; safe retry needs operation identity
   plus live evidence, never a bare idempotency-key assertion; title/time similarity alone
   is not identity; no blind replay, suspected-duplicate delete, or orphan-close cleanup.

## F5 digest — Delegated sessions and recovery (paraphrase; governs feature F5)

Status: user-approved 2026-09-21 (settled F5 decisions F5Q1–F5Q5 as directed, independently reviewed, band-review amendment batch user-approved 2026-09-21, Horowitz READY, user approved); scenarios FUTURE, runtime unverified;
issue OPEN. Paraphrase only; no user quotes reproduced. Normative text lives in
`features/delegated-sessions.md` as `F5-DS-01` … `F5-DS-12`, whose trace table
allows multi-source mappings; this digest is the decision record, not the spec.
Where a Q1–Q51 line or an F1/F2/F3/F4 rule and an F5 decision conflict inside
feature-F5 scope, F5 governs. Approved F1/F2/F3/F4 requirements stand untouched.

1. F5Q1: cancellation targets the NAMED task or branch and its invocations,
   whole run only when explicitly asked; stop new affected actions, request
   cancellation of underway affected work, preserve artifacts, report underway
   and uncertain outcomes, independent work continues. Ownership stays until the
   previous Writer stopped or is safely isolated (isolation mechanism unproven);
   no rollback promised. Cancelled sessions never reused; restart needs user
   instruction plus a fresh session, with still-valid spec approval not
   redundantly re-requested.
2. F5Q2: at most TWO automatic infrastructure recovery attempts PER TASK, with
   earlier escalation on repeated non-progress, uncertain external effects, or
   ownership conflict. Crash budget is separate from task and integration review
   budgets; none resets across sessions. Reconcile against live evidence before
   recovery; confirmed actions never replayed.
3. F5Q3: planned context rollover is a fresh Writer/Seeker dispatch with a
   validated envelope plus a recorded checkpoint (approved assignment, relevant
   exact user instructions with provenance, artifacts, findings, questions,
   remaining budgets — never the full transcript). Outgoing stops before the
   replacement owns work. Rollover costs no crash-budget attempt but resets no
   limit and conceals no non-progress.
4. F5Q4: failed resume identity check, completed/cancelled ineligibility, revoked
   authority, or missing resumable state prohibit in-place reuse; a fresh
   revalidated dispatch follows only when the work is actually authorized
   (cancelled: user restart instruction; completed: authorized assignment) —
   never automatic. The named backup is always fresh with notice, never an
   equality exception. Current authority and assignment are validated before any
   launch; revoked rights never restored; revoked or insufficient authority
   parks. Fresh sessions skip redundant demands for already-covering approval.
5. F5Q5: unmerged work, unresolved operation records, and needed
   recovery/review/exception evidence persist until verified handback or
   explicit disposition; handback alone never authorizes destructive deletion
   while evidence is needed. Only disposable logs and safely superseded
   temporary material clean up, under visible configurable limits; protected
   data over cap discloses and asks, never silently deletes. Exact retention
   values NOT selected.

## BQ record — user-approved band-review questions BQ1–BQ8 (2026-09-21)

User approvals: BQ1 Agreed; BQ2 Agreed; BQ3 Agreed; BQ4 Agreed; BQ5 Agreed; BQ6 Agreed; BQ7 Agreed; BQ8 Agreed (all 2026-09-21).
Paraphrase only; no decision change to F1Q1–F1Q14, F2Q1–F2Q6, F3Q1–F3Q6, F4Q1–F4Q6, F5Q1–F5Q5.
Normative text lives in the feature specs; this section is the decision record.

1. BQ1+BQ2 — park lifecycle (F3-SD-04a owns; cross-referenced from F2-PE-02/04, F4-BI-04, F5-DS-04):
   Dispatcher clears MECHANICAL parks without asking the user; policy-gap, conflict, and
   ambiguous-ownership parks need the user; unavailable-user work stays parked with a visible staleness
   clock, disclosing and asking at the configured limit, never silent auto-cancel; the limit is
   configurable, no numbers set here.
2. BQ3 — per-task cost ceiling (F1 section 2.3 item 7; noted in F5-DS-11): configurable per-task
   token/cost ceiling; breach discloses and escalates to the user, never a silent drop; no amounts set here.
3. BQ4 — resume economy (F5 section 7 review-needed item 5): pilot measures the F5-DS-01 resume-hit rate;
   near-zero keeps resume for v1 with always-fresh dispatch as a v2 simplification candidate.
4. BQ5 — materiality contest (F3-SD-03a): any seat or the user may flag a nonmaterial class; the flag
   promotes to material-or-uncertain until the Expert (consult mode) adjudicates, then the user arbitrates
   if still disputed; a Dispatcher never has the last word on its own deviation's class.
5. BQ6 — Windows fixed integrity (F2-PE-10; tied to P-WIN-16): fixed-integrity denials hold on EVERY
   platform including native Windows; "soft" describes OS-containment gaps, not the authority rules.
6. BQ7 — SHA source channel (F6-PD-04; tied to section 7 v2 item): same-channel SHA risk ACCEPTED for v1, Agreed 2026-09-21; the recorded SHA still catches honest drift and mistakes; out-of-band SHA publication or signing is a named v2 hardening item.
7. BQ8 — boot-loop handling (F6-PD-05/P6-18; tied to section 7 health-gate item): ONE automatic revert to the kept prior on post-activation startup failure (logged, disclosed), Agreed 2026-09-21; a second consecutive failure parks for the user (no infinite loop).

## Amendment-batch note — 2026-09-21 band-review batch (band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved))

Scope: ONE documentation-only amendment batch covering 18 mechanical drafting fixes (enumerated below as 17 bullets; the F3-SD-07 gate-naming and trigger-widening items share a bullet; F1-AR-06
reword; F1 load-bearing definitions; A-PLAN-02 plus H2 hash-signal softening; P-WIN-16 soft-policy
wording; P-DENY-09 and P-PROXY-14 verified-interception conditioning; F2-PE-13 verification standard;
F3-SD-07 continuation gate plus spec/test/execution-plan trigger; F3-SD-05 tiny eligibility plus
Dispatcher reclassification owner; F5 section 0 required-not-proven qualifier; F5-DS-05 terminal
escalation; F5-DS-06 repeated-non-progress definition; F5-DS-07 mid-rollover crash assignment; F5-DS-10
memory-only recovery-state ownership; F4-BI-06 all-typed-mutations widening; F4-BI-05 bounded reversible
unit; F4-BI-03 reopen-resume disclosure; F4-BI-02 first-snapshot carve-out) PLUS the 6 user-approved BQ
additions above (BQ1–BQ6). No decision changes; all scenarios stay FUTURE/unexecuted; requirement and
scenario IDs stable (new sub-clauses only: F3-SD-03a, F3-SD-04a, F1 section 2.3 item 7, F5-DS-11 item 7,
F5 section 7 item 5); PRD.md untouched with its four verbatim user comments preserved.

## F6 digest — Platform and distribution (paraphrase; governs feature F6)

Status: settled F6 decisions F6Q1–F6Q7, user-approved 2026-09-21; draft spec
`features/platform-distribution.md` user-approved 2026-09-21 (Horowitz READY, band-reviewed CONCERNS→corrected, re-check READY, BQ7/BQ8 resolved);
scenarios FUTURE, runtime unverified; issue OPEN (tgo-r7ve). Paraphrase only; no user quotes reproduced.
Normative text lives in `features/platform-distribution.md` as `F6-PD-01` … `F6-PD-12`, whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2/F3/F4/F5 rule and an F6 decision conflict inside feature-F6 scope, F6 governs.
Approved F1/F2/F3/F4/F5 requirements stand untouched.

1. F6Q1: distribution is git-tag install from GitHub as the v1 primary and only required path; npm
   publish is PERMITTED after v1 but never required and never a blocker for the git-tag path; pinned
   refs are immutable; drift notices are warn-only. (Q45 distribution, narrowed: npm permitted-later.)
2. F6Q2 — USER OVERRIDE (user explicitly chose v1 self-update over the notify-only recommendation):
   self-update ships in v1 on the proven TGO staging-and-swap pattern — startup check against the pinned
   tag, staging slot, SHA/commit-pin verified BEFORE swap, activation at NEXT RESTART only (never
   mid-session), NEVER downgrade, every update logged with old→new versions and trigger, failure keeps
   the current version and warns (never bricks), config kill-switch, one prior version kept for explicit
   user revert; NEVER SILENT (Q6). Scope is the PLUGIN artifact only — an existing bd install is NEVER
   auto-upgraded (F4-BI-10). Self-update authorization comes from this explicit user decision.
3. F6Q3: product-repo split at build start on explicit user word — new product repository takes
   docs/pi-successor/* as docs root plus all future source, tests, and release artifacts; TGO repo keeps
   tracker history and session links only; product repo initializes its own beads store; refs travel as
   links/exports.
4. F6Q4: verify-then-admit licensing — fetch the 11 pending LICENSE files at spec phase (mattpocock,
   BMAD, GSD, spec-kit, MemPalace, magic-context, qmd, Graphiti, Letta, ECC, ruflo); verified-permissive
   sources may contribute adapted text/code; unverified sources stay idea-level only. Verified exceptions
   on record: obra/superpowers MIT, addyosmani agent-skills 0.6.8 MIT.
5. F6Q5: donsetch pin plus AGPL boundary procedure — dedicated build-phase task owned by the orchestrator
   (engineering executes); acceptance bar = exact artifact pinned (version + source URL + SHA),
   separate-process-only (CLI or MCP, never linked as a library), and a written AGPL boundary review the
   USER signs off before v1 ships. No blanket AGPL clearance exists on record.
6. F6Q6: unsupported-OS behavior — refuse at install where prerequisites are known-unavailable;
   warn-and-continue with a degraded-support banner on plausible-but-unlisted OSes (Linux = best-effort);
   explicit override flag for experiments; runtime shows the same banner. Required set remains
   Windows+macOS with prerequisites allowed (Q14).
7. F6Q7: version pinning records the FULL COMMIT SHA (not just the tag name) in an install record;
   re-verify on bump; SHA mismatch refuses or warns — never silent. Later npm path carries npm's own
   integrity hashes; bd keeps its checksum rule; no signature infrastructure in v1.

## F6 band-review record — Nirvana corrections applied 2026-09-21 (documentation only)

Band verdict 2026-09-21: unanimous CONCERNS (5 findings plus missed considerations plus gaps).
Corrections applied in this pass as ONE documentation-only correction round: branch rule for
F6-PD-03/P6-03 (mismatch REFUSES at install/bump, drift WARNS per F6-PD-02) with recorded-SHA sole
authority; F6-PD-05/P6-06/P6-08 downgrade-vs-revert carve-out (explicit user revert to the ONE kept
prior is the sole sanctioned downgrade); F6-PD-04 honesty reword (integrity-verified vs recorded SHA,
same-channel risk accepted for v1 per BQ7 user decision 2026-09-21, no v1 signatures; no monetary charge with real non-monetary costs);
F6-PD-06 record ownership (product repo owns install records/update logs/license verdicts/AGPL review;
Dispatcher owns reference repair at extraction); F6-PD-09 prerequisite-manifest matrix with
stricter-on-uncertain fallback; user-decided engineering design 2026-09-21 (BQ8 health gate:
 one auto-revert then park; install-record survival plus activation lock, configurable kept-prior disk bound, channel-outage
keeps-current); additive scenarios P6-17/P6-18. No decision changes: F6Q1–F6Q7 (incl. the F6Q2 self-update
USER OVERRIDE), Q1–Q51, F1Q1–F5Q5, BQ1–BQ6 remain fixed.

BQ7 — SHA source identity (same-channel risk accepted for v1; out-of-band SHA or signing is a v2 hardening item) — Agreed 2026-09-21; BQ8 —
boot-loop handling (ONE automatic revert to the kept prior, logged and disclosed; second consecutive failure parks for the user) — Agreed 2026-09-21.

## F7 digest — Models and presets (paraphrase; governs feature F7)

Status: settled F7 decisions F7Q1–F7Q5, user-approved 2026-09-21 (final: Expert Go backup = Qwen 3.8 Flash restored per user cost correction; Kimi-K3 disqualified on cost); runtime unverified; scenarios FUTURE;
spec `features/models-presets.md` with band-review corrections applied 2026-09-21;
issue OPEN (tgo-5opj). Paraphrase only; no user quotes reproduced.
Normative text lives in `features/models-presets.md` as `F7-MP-01` … `F7-MP-12`, whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2/F3/F4/F5/F6 rule and an F7 decision conflict inside feature-F7 scope, F7 governs.
Approved F1/F2/F3/F4/F5/F6 requirements stand untouched.

1. F7Q1: v1 FIXED seat→model assignment, single fixed assignment per seat, no switching logic
   (Q10 tiers deferred). Work path (Copilot Business): Dispatcher = Astra (xhigh);
   Expert = Astra (xhigh); Writer = Luna (max); Seeker = Luna (max).
   Personal path (OpenCode Go; Astra ABSENT from the Go catalog): Dispatcher = GLM 5.3 Flash (max);
   Writer = Muse Spark 1.3 (xhigh); Seeker = Muse Spark 1.3 (xhigh);
   Expert = MiMo V2.6 Pro (highest available). Transcription note: the user wrote "Mimi V2.6 Pro" —
   recorded as **MiMo V2.6 Pro** (the Go-catalog model), confirmed by user 2026-09-21 ('Mimi' was a typo; MiMo V2.6 Pro is correct).
2. F7Q2: highest available reasoning variant for every seat unless explicitly stated; the explicit
   values in F7Q1 are those statements. Variant caps/strings verified at build (Spark caps at xhigh
   on record; nothing invented).
3. F7Q3: one named backup per seat per path (Q43 logged notice before abort; never-silent Q6).
   Work: Dispatcher/Expert (Astra) → Sol; Writer/Seeker (Luna) → Terra.
   Personal: Dispatcher → DeepSeek V4.1 Flash; Writer → MiMo V2.6 Flash; Seeker → MiMo V2.6 Flash;
   Expert → Qwen 3.8 Flash. Backup dispatch = fresh session + logged notice; never an
   identity-equality exception (F5-DS-04 relation).
4. F7Q4: quota/usage disclosure surface — (a) running usage line (tokens/cost this session) in the
   status board; (b) warning at configurable thresholds when the provider reports quota pressure,
   never fabricating a nonexistent signal; (c) cost-ceiling breach keeps the approved
   disclose-and-escalate path (BQ3). NO auto-switching on quota: the named backup with notice is the
   only substitution path. No thresholds invented.
5. F7Q5: assignment-change authority follows the F2-Q6 exception shape — user-only edits, OR an
   explicit user instruction interpreted by the Dispatcher and applied by the Writer with a logged
   record. Frozen otherwise in v1.
6. Settled context cross-referenced not re-decided: Use-balance read-only + recommend-off, plugin
   never touches it (Q42); no ZDR constraint v1 (Q44); exact SKU ids pinned at build via live picker
   with the gpt-5.6 alias distrusted until pinned (EVIDENCE on record); identity equality
   (model+variant+preset+seat config) governs resume (F5); work/personal presets are separate, common
   config ships in the plugin (Q3/Q10).
7. Operating assumption, labeled user-validated operating assumption, 2026-09-21: the implementation
   seat may run a lighter model when plans come from a stronger model (Dispatcher) and pass Expert
   review — accepted as the v1 mapping basis on the work path. Recorded caveats: (a) on the personal
   path the index ordering inverts (Spark Writer ≥ GLM 5.3 Flash Dispatcher on recorded AA/τ³ numbers) —
   a cost-balancing choice, same pilot measure applies; (b) Expert personal-path backup two-step swap history 2026-09-21: Kimi-K3 was picked on stale tier data (the recorded "cheap $15 tier" was WRONG — $15 is Kimi K3's MONTHLY LIMIT, not cheapness) and reversed the same day by the user back to Qwen 3.8 Flash; verified Go sheet facts (https://opencode.ai/docs/go/, read 2026-09-21): Kimi K3 = $3.00 input / $15.00 output per 1M, $15 monthly limit (~110 requests/5h) — among the most expensive and tightest-quota models on Go; Qwen 3.8 Flash = $0.15/$0.47 per 1M, $30 monthly limit (~5,400 requests/5h) — the sensible backup; user direction is to stick with Qwen for now and pick something else later if wanted; Qwen 3.8 Flash's recorded review-seat caveats (self-verification parse failures in eval, max-variant budgetTokens truncation bug, 429 storms, leaked reason tags) return as the STANDING risk note; operating-assumption source now identified (user: the Cognition post IS the Devin Fusion research): https://cognition.com/blog/devin-fusion (2026-06-29) — sidekick pattern (frontier planner main + cost-effective sidekick, each with persistent cached contexts; main owns plan/ambiguity/final review) matches our premise; VENDOR-CLAIMED FrontierCode 1.1 Extended (data 2026-08-07): Fusion 63.1 score / $1.35 per task vs Fable 5 xhigh 64.9/$10.53, Opus 5 medium 63.6/$3.51, GPT-5.6 Sol high 58.7/$3.41, Kimi K3 58.2/$3.12, Grok 4.5 high 56.6/$1.09; CRITICAL falsifier: when judgment IS the deliverable, delegating it backfires (team-selector example: score 2754→27 at -28% cost); mechanical work hands off cleanly (62%/32% savings at intact quality; hard-but-mechanical even beat solo); mapping as recorded not relitigated. Pilot metric carried to the validation-harness spec: implementer-model
   tier vs first-pass review-pass rate, measured SEPARATELY for plan-shaped/mechanical and judgment-heavy task classes per the Fusion falsifier boundary.

## F7 band-review record — Nirvana corrections applied 2026-09-21 (documentation only)

Band verdict 2026-09-21: majority CONCERNS with one NEEDS REVISION dissent
(F7-MP-06 terminal gap). Findings 1–5 (terminal rule, quota-dead Dispatcher
path, backup-variant/Spark-cap tension, usage-line scoping, flapping-primary
bound) plus three missed considerations (substitution-trigger taxonomy,
pilot-metric status, indirect-instruction hardening) plus two gaps
(model-retirement path, shared event-record shape). Corrections applied in
this pass as ONE documentation-only correction round: defined "unavailable"
(provider signal, bounded-retry failure, or user declaration — never seat
self-declaration alone), hung-primary F5-DS-05 composition, dual-unavailable
park under F3-SD-04a with disclosure (parked-escalated terminal state; C5
no-second-chain stands); quota-dead Dispatcher parks all affected work with
disclosure, no side-routing; highest-available rule covers backups unless the
pin record states otherwise, Spark xhigh reclassified as recorded claim
pending build verification; current-session line vs cross-session task-record
totals, tokens-only/"cost unavailable" on absent cost signal; same 2-attempt
allowance per F5-Q2 then escalate; performance/quality concerns route to
F7-MP-09 user-only change, never substitution; pilot metric record-only in v1
(binding threshold needs a user decision); relayed/quoted/tool-output/
third-party instructions never count as user instructions; retirement =
unavailability trigger plus additive scenarios P7-17/P7-18; shared

## F8 digest — Prose and skills (paraphrase; governs feature F8)

Status: settled F8 decisions F8Q1–F8Q6 EXCEPT F8-Q4 DEFERRED, as directed 2026-09-21; user-approved 2026-09-21 (band NEEDS REVISION 2–1 → 8 corrections applied → Horowitz re-check READY);
scenarios FUTURE, runtime unverified; issue OPEN (tgo-6h5i). Paraphrase only; no user quotes reproduced.
Normative text lives in `features/prose-skills.md` as `F8-PS-01` … `F8-PS-13` (F8-PS-13: RD-Q2 composition, Agreed 2026-09-23), whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2/F3/F4/F5/F6/F7 rule and an F8 decision conflict inside feature-F8 scope, F8 governs.
Approved F1/F2/F3/F4/F5/F6/F7 requirements stand untouched.

1. F8Q1: v1 skill roster, LICENSE-GATED per F6-PD-07 — Dispatcher: grilling, to-tickets,
   to-questionnaire, wayfinder, verification-planning; Writer: tdd, diagnosing-bugs,
   receiving-code-review, api-and-interface-design, security-and-hardening,
   code-simplification, finishing-a-development-branch, bmad-build-auto (adapted for
   unattended work); Seeker: source-grounding, deep-recon (CANONICAL name;
   "bmad-deep-recon" is the source-family label for the same skill — one skill not two),
   web-retrieval; Expert: code-review, doubt-driven-development; any seat:
   verify-before-claim; human-only steps: wizard. The mattpocock-family items (grilling,
   wizard, to-tickets, wayfinder, to-questionnaire, verification-planning) ship ONLY if the
   F6Q4 license fetch passes — otherwise rewritten from scratch as idea-level adaptations
   (no copied text). Unconditional named verified exceptions: obra/superpowers MIT family
   and addyosmani agent-skills 0.6.8 MIT family.
2. Settled intake: lean prompt budget <=500 tokens per agent prompt target, 1000 hard cap
   for the largest agents; enforced at build schema per seat (build-time refusal — over-cap
   prompts never assemble).
3. F8Q2: hard-cap breach — build-time refusal at assembly; runtime trim-and-disclose in
   priority order (skill bodies first, then optional evidence); if still over, escalate to
   the user; never a silent trim.
4. F8Q3: required-workflow designation by design-time declaration in the spec — a workflow
   marked required loads its skill deterministically; the Dispatcher may load ADDITIONAL
   skills on demand but never drops a required one.
5. User-approved direction, recorded as settled: lazy/progressive loading — thin always-on
   hard rules + seat-filtered skill metadata + on-demand skill bodies + deterministic loading
   for required workflows. Permissions live OUTSIDE skills — skill text never grants authority,
   and loading or skipping a skill never changes permissions (composition of F2 + the SpecPi direction).
6. Settled: prose-driven invocation — skills invoked through prose; no slash commands required.
7. F8Q5: user-added skills in a local user-managed directory; three rules — skill text never
   grants permissions; licensing of user additions is the user's responsibility; no auto-fetch
   and no skill store in v1.
8. F8Q6: skill lifecycle — skills ship INSIDE the plugin artifact and ride the F6-PD-04
   self-update path (staging-and-swap updates the whole artifact); no separate skill channel in v1.
9. SpecPi direction, recorded: whole-prompt measurement — the token budget accounts for tool
   schemas + injected policy + handoff material, not just seat instructions; repeatability target =
   per-seat budget check at build (measurement procedure is engineering).
10. OUT OF SCOPE (F8-Q4, DEFERRED): the house prose-discipline/voice layer is NOT part of this
    feature — it sits on the user's later question/feature list. The user's recorded preference
    for when that discussion happens: an ALWAYS-ON layer. No prose-discipline content ships
    from this spec. No voice cards (Q1) regardless.
11. F8-Q7 (budget binding) — Agreed 2026-09-21: the 500-target/1000-hard-cap binds AUTHORED
    seat content (agent instructions + skill bodies + always-on rules); whole-prompt size
    (tool schemas + injected policy + handoff material) is measured and DISCLOSED under a
    separate configurable exposure budget with warnings; build refusal applies to the AUTHORED cap.
12. F8-Q8 (tokenizer + backups) — Agreed 2026-09-21: the authored cap counts with the assigned
    model's tokenizer at build, recorded in the pin record; backup dispatches inherit the measured
    size (no re-trim on substitution); a disclosure is issued if a backup tokenizer would inflate
    past the cap.
13. F8-Q9 (unattended breach) — Agreed 2026-09-21: when no user is present for the escalation step,
    the affected branch PARKS under the F3-SD-04a park lifecycle (disclose-and-ask at the configured
    staleness limit); never a silent trim in either case.

## F8 band-review record — Nirvana corrections applied 2026-09-21 (documentation only)

Band verdict 2026-09-21: NEEDS REVISION (2–1). Findings F-1…F-5 plus the three asked
considerations (answered as F8-Q7/Q8/Q9 above, all Agreed 2026-09-21) plus gaps
(prose-invocation ambiguity, skill rollback). Corrections applied in this pass as ONE
documentation-only correction round: compositions of approved rules plus the three answers —
budget/exposure split, tokenizer/pin-record/backup inheritance, unattended park under F3-SD-04a,
required-workflow trim exemption with build-refusal design-error rule, license-gate designation binding
the workflow not the source text, roster-name reservation with user-added collision refusal, section 2.12
record-persistence mandate, ambiguity-by-selection and F6-PD-05 rollback clauses, additive scenarios
P8-17/P8-18. No decision changes: F8Q1–F8Q6 (F8-Q4 deferred), the 500/1000 numbers, the roster table,
Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5 remain fixed.

## F9 digest — Bootstrap and initialization (paraphrase; governs feature F9)

Status: settled F9 decisions F9Q1–F9Q9 (F9Q1–F9Q6 Agreed 2026-09-21; F9Q7–F9Q9 Agreed 2026-09-22); spec
`features/bootstrap-init.md` user-approved 2026-09-22 (band-reviewed NEEDS REVISION → 10 corrections → re-check READY); runtime unverified; scenarios FUTURE; issue OPEN (tgo-geh3). Paraphrase only; no user quotes reproduced.
Normative text lives in `features/bootstrap-init.md` as `F9-BS-01` … `F9-BS-14`, whose trace
table allows multi-source mappings; this digest is the decision record, not the spec. Where a
Q1–Q51 line or an F1/F2/F3/F4/F5/F6/F7/F8 rule and an F9 decision conflict inside feature-F9 scope, F9 governs.
Approved F1/F2/F3/F4/F5/F6/F7/F8 requirements stand untouched.

1. F9Q1: partial-state repair — only the missing steps run, in canonical order; never a blind full
   rerun, never park when the path is clear; idempotent rerun skips already-set-up work.
2. F9Q2: project AGENTS.md gains a clearly delimited plugin-owned block appended only when absent —
   thin always-on layer (retrieval-led priority, prose-first, Beads sole tracker) plus provenance
   (plugin version + date) plus plugin-doc pointers; 50–100-line target; user content outside the
   block never touched.
3. F9Q3: nested-git guard — inside a subdirectory of an existing repo, operate in place with zero
   git writes (Step 1 skipped only, Steps 2–4 continue, nested context disclosed); never create a
   nested repo.
4. F9Q4: prose-triggered re-check is the default ("check and fix the setup" re-runs the idempotent
   pass); an explicit user-invoked command is also permitted; no slash command required.
5. F9Q5: user-edit policy — absent block/marker discloses and asks (never silent re-add); modified
   block (markers intact) means the user edit wins with divergence disclosed; never overwrite a user
   edit, never silently skip a missing layer.
6. F9Q6: bootstrap never pauses for a trust prompt (always-trust pre-configured); trust is not
   permission (F2 governs); the trust auto-install race fails closed into an F3-SD-04a park with
   disclosure, never a prompt.
7. F9Q7 (below-floor bd) — Agreed 2026-09-22: the version floors (bd >= 0.59.0 / dolt >= 2.1.0)
   run on the PRESENT branch too; a below-floor installation reads as NOT set up — upgrade attempted
   through the same checksum-verified installer path with disclosure, bounded by the retry cap;
   refusal or failure parks under F3-SD-04a with disclosure; never runs below-floor silently.
   (Normative: F9-BS-08.)
8. F9Q8 (user-edit policy scope) — Agreed 2026-09-22: the policy covers ALL plugin-owned surfaces —
   both AGENTS.md blocks, the `.pi/settings.json` registration entry, `.gitignore` additions, and the
   Beads advice block; deletions disclose-and-ask, modifications keep the user edit winning with
   divergence disclosed; never overwrite, never a silent re-add. (Normative: F9-BS-10.)
9. F9Q9 (real-prose definition) — Agreed 2026-09-22: any user-authored non-command input counts as
   real prose (pastes and single words included); only the PRIMARY session's first prose triggers;
   a first touch in a non-primary session waits for the primary session; non-primary sessions never
   bootstrap. (Normative: F9-BS-01.)

Transcription note: the user's reply labeled these "F8Q7/Q8/Q9" — recorded as a typo mapping 1:1 to
F9-Q7/Q8/Q9 (this feature's open questions, asked pre-band-review).

## F9 band-review record — Nirvana corrections applied 2026-09-22 (documentation only)

Band verdict 2026-09-22: NEEDS REVISION (1–2 split, with the risk-lens severity override on record).
Findings F1–F5 plus gaps (incl. project-root determination). Corrections applied in this pass as ONE
documentation-only correction round: compositions of approved rules plus the three answers (F9Q7–F9Q9
above) — below-floor present-branch floors with verified-upgrade-or-park (F9-BS-08), full-surface
user-edit policy (F9-BS-10), real-prose breadth with primary-only trigger and non-primary wait
(F9-BS-01), dual-block SEPARATE marker namespaces with independent absent-checks (F9-BS-08/09),
retry-cap promotion to F9-BS-14 as a VISIBLE parked-failure under the single F3-SD-04a semantics
(never already-set-up; reconciled — no second park kind), first-pass-append vs later-absent
disclose-and-ask with recorded disclosed-skip (F9-BS-04/10), F2-denial mid-step fail-closed park with
independent steps continuing (F9-BS-12), minimal presence health check (F9-BS-02), project root as
session working directory with monorepo/multi-root a recorded gap (section 7), additive scenarios
P9-19…P9-26. No decision changes: F9Q1–F9Q6, the Q5-parenthetical supersession, the research-backed
flags, and all prior decisions (Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9) remain
fixed. Canonical-seat correction on record: cobain is the risk lens.

## F9 design-details record — settled readings and research-backed flags (2026-09-21/22)

1. Q5 parenthetical step reading SUPERSEDED by the PRD.md:229-235 canonical order — the parenthetical
   stands as provenance; the four-step canonical order governs (F9-BS-03).
2. bd setup + advice-append composition is RESEARCH-BACKED DESIGN (research tgo-dowi) — no Q-line
   records that exact composition; flagged in the spec trace/digest (F9-BS-08).
3. `.pi/settings.json` one-file resolution — the ".pi/settings registration" string names the ACTION;
   `.pi/settings.json` is the ONE file path; schema/merge shape pinned at build (F9-BS-07).
4. Setup retry cap = 3 failures then VISIBLE parked-failure under F3-SD-04a — RESEARCH-RECORDED (tgo-dowi), not
   user-decided; promoted to requirement F9-BS-14 by the 2026-09-22 band correction (the earlier
   "park as already-set-up" reading is SUPERSEDED — never labeled already-set-up).
5. Slash-command bail ("bail on /") — RESEARCH-RECORDED (tgo-dowi), not user-decided (F9-BS-01).
6. `.gitignore`-appended-only-if-absent — RESEARCH-BACKED rule (tgo-dowi), labeled (F9-BS-06).
7. Kill-switch names (setup.enabled, autoInstallBeads, autoInitGit, autoInitPiSettings) —
   RESEARCH-RECORDED, pinned at build; scope SEPARATE from the F6 self-update switch (constraint C7).
8. HANDOFF refreshed 2026-09-22: F1–F8 user-approved and closed-or-closing (tracker states per
   HANDOFF), F9 drafting (tgo-geh3), 5 areas undone (this draft + 4 stubs).
## F10 digest — Web, docs, and MCP retrieval (paraphrase; governs feature F10)

Status: settled F10 decisions F10-Q1–F10-Q10, all Agreed 2026-09-22 (Q1
confirmed after the mailroom-adapter explanation); spec
`features/web-mcp-retrieval.md` user-approved 2026-09-22 (band CONCERNS → 12 corrections → re-check READY);
runtime unverified; scenarios FUTURE; issue tgo-ddlm. Paraphrase only; no user
quotes reproduced. Normative text lives in `features/web-mcp-retrieval.md` as
`F10-WR-01` … `F10-WR-14` (F10-WR-14: RD-Q2 composition, Agreed 2026-09-23), whose trace table allows multi-source mappings;
this digest is the decision record, not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9 rule and an F10 decision conflict inside
feature-F10 scope, F10 governs. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9 requirements
stand untouched.

1. F10-Q1: OUR thin policy adapter over the donsetch CLI/MCP subprocess is the
   PRIMARY integration form — explained as a mailroom/switchboard and
   confirmed: permission check (seat + capability + operation + arguments +
   resolved target) then subprocess then evidence stamp then fallback routing;
   the adapter owns seat access, timeouts, cancellation, output limits,
   zero-paid enforcement, version/capability checks, evidence stamping, and
   fallback routing while donsetch owns engines, fetch/crawl/bot-wall handling,
   and PDF/document extraction; never linked as a library (separate-process
   AGPL boundary per F6-Q5); the native Pi extension is a named fallback
   admitted only if probes prove both the AGPL boundary and F2-PE-13
   enforceability. (Normative: F10-WR-02.)
2. F10-Q2: the hosted-search slot runs Exa anonymous primary with Parallel
   anonymous as the named fallback — falling on 429 or empty results, never
   eager-chaining both caps; both limits probe-pinned. (Normative: F10-WR-06,
   composed into F10-WR-01.)
3. F10-Q3: the keyless fetch fallback order markdown.new → Jina → TinyFish is
   confirmed as the v1 default; live probes may reorder by measured
   reliability as a disclosed build-pin change, never a silent swap.
   (Normative: F10-WR-07, composed into F10-WR-01.)
4. F10-Q4: Context7 defaults to the anonymous free tier with a user API-key
   BYOK slot raising the quota and no auto-escalation to paid. (Normative:
   F10-WR-05.)
5. F10-Q5: Dispatcher/Expert get a LIST-ONLY surface — titles + URLs +
   snippets, no raw fetch. (Normative: F10-WR-03, composed with the absorbed
   per-seat direction.)
6. F10-Q6: the written AGPL boundary review gates shipping and any shared
   build while pinned-artifact internal testing proceeds; the review is
   user-signed and no blanket clearance exists. (Normative: F10-WR-11 with
   F6-Q5.)

## F10 design-details record — settled readings and absorbed directions (2026-09-22)

1. Per-seat access surfaces absorbed as settled direction — provenance: web/MCP
   research + grilling record; previously absent from the package files:
   Seeker full retrieval, Writer Context7-direct plus approved adapter lookups,
   Dispatcher/Expert list-only, no seat via bash (F10-WR-03).
2. Read-only retrieval — no posts, form submissions, state-changing calls, or
   external side effects; composes with F2's external-action approval rules
   (F10-WR-10).
3. Citation stamps — every result carries source URL + retrieval time in the
   evidence record (F10-WR-09).
4. Probe-pinned caps — on-record figures (markdown.new 500/day, Jina 20 RPM,
   TinyFish $0/URL, Tavily/Firecrawl 1k credits/mo, Context7 1k calls/mo) are
   probe targets, never truth; Exa code-vs-advertised drift is on record —
   probe, never assume (F10-WR-01/05/06).
5. Brave/Serper disqualified as defaults (`EVIDENCE.md:22`) — not relitigated
   here (F10-WR-01).
6. MCP adapter pick stays a spec-phase pin (@pi-unipi/mcp direct vs
   pi-mcp-adapter single-proxy; `MANIFEST.md:48-50`) — no selection here
   (constraint C5).
7. Fetch order probe-may-reorder-with-disclosure — any reorder ships as a
   disclosed build-pin change, never silent (F10-WR-07).
8. AGPL provenance-vs-amendment note — the `DECISIONS.md:110` "AGPL-3.0
   acceptable" line is provenance; the amendment/F6-Q5 procedure governs
   (F10-WR-11).
9. HANDOFF refreshed 2026-09-22: F1–F10 user-approved (F10 user-approved 2026-09-22: band CONCERNS → 12 corrections → re-check READY; runtime unverified; scenarios FUTURE), 3 stubs remain (durable memory, working context, validation
    harness — verified against `features/README.md`).

## F10 follow-up record — F10-Q7/Q8/Q9/Q10 (all Agreed 2026-09-22)

Paraphrase only; no user quotes reproduced. No decision change to F10-Q1–F10-Q6
or any prior decision. Normative text lives in `features/web-mcp-retrieval.md`
as `F10-WR-01` … `F10-WR-13` (compositions).

1. F10-Q7 (Writer lookup approval surface) — an approved adapter lookup is
   approved by exactly two bounded sources: named in the approved plan or
   delegation envelope, or on the user's standing allowlist (user-only edits);
   task-scoped approvals live in the task record and expire with the task.
   (Normative: F10-WR-03.)
2. F10-Q8 (exhaustion criticality owner) — acceptance-criticality is decided at
   plan time by the approved spec's acceptance criteria, never seat self-labels;
   uncovered demands fail closed as acceptance-critical with the branch stopped
   and disclosed. (Normative: F10-WR-08.)
3. F10-Q9 (quota model) — the anonymous service caps are one shared pool across
   all seats with per-seat usage accounting and low-pool disclosure at a
   configurable threshold; per-seat reservations are a v2 candidate.
   (Normative: F10-WR-04/05.)
4. F10-Q10 (snippet bounds) — list-only snippets are bounded with the bound
   disclosed in the evidence record; the exact length is a section-7 build pin.
   (Normative: F10-WR-03.)

## F10 band-review record — Nirvana corrections applied 2026-09-22 (documentation only)

Band verdict 2026-09-22: CONCERNS (2/3, majority rule applied — no averaging)
with cobain's NEEDS REVISION dissent recorded. Findings 1–5 plus missed
considerations 1–3 plus gaps 1–3; grohl truncated mid-output with its tail noted
as dissent. Corrections applied in this pass as ONE documentation-only correction
round: compositions of approved rules plus the four answers (F10-Q7–F10-Q10
above) — two-source approval registry with task expiry (F10-WR-03), plan-time
criticality with fail-closed tiebreak (F10-WR-08), shared-pool quota with
per-seat accounting (F10-WR-04/05), disclosed snippet bound (F10-WR-03),
suspected-degraded garbage with both-sides divergence records and hash/length
stamp binding (F10-WR-08/09), fail-closed shared-build boundary (F10-WR-11),
WR-01 tail cleanup, separately-budgeted probe calls, documented-exhaustion
reserve activation, citation-anchor and staleness nits, additive scenarios
P10-22…P10-30. No decision changes: F10-Q1–F10-Q6, the Q51 hybrid, the mailroom
adapter shape, the per-seat surfaces, and all prior decisions (Q1–Q51,
F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9) remain fixed.
Canonical-seat note stands: cobain = risk lens.

## F11 digest — Durable memory (paraphrase; governs feature F11)

Status: settled F11 decisions F11-Q1–F11-Q10, all Agreed 2026-09-22; spec
`features/durable-memory.md` user-approved 2026-09-22 as corrected (band CONCERNS 2/3 → 17 fixes → re-check READY);
runtime unverified; scenarios FUTURE; issue tgo-gc3n (not closed until issue closure). Paraphrase only; no user quotes
reproduced. Normative text lives in `features/durable-memory.md` as
`F11-DM-01` … `F11-DM-12`, whose trace table allows multi-source mappings;
this digest is the decision record, not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10 rule and an F11 decision conflict inside
feature-F11 scope, F11 governs. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10
requirements stand untouched.

1. F11-Q1: vault git homes — the per-project vault lives in that project's
   git repo (knowledge history travels with the code); the machine-shared
   vault lives in its own git repo at a stated user-level location (path
   downstream, never invented). (Normative: F11-DM-01 with Q24.)
2. F11-Q2: wiki compile trigger + owner — compile-once-keep-current on
   promotion, supersede, and user request, owned by a plugin-managed
   ephemeral hook-driven service running short-lived background jobs, never a
   standing seat. (Normative: F11-DM-06 with Q13.)
3. F11-Q3: verifier shape — agents stage UNVERIFIED entries with a required
   source link; the layered verifier runs deterministic contract checks plus
   automatic contradiction lint with semantic promotion in an ephemeral
   background pass; no separate Expert review gate. (Normative: F11-DM-03
   with Q26/Q13.)
4. F11-Q4: deletion policy — supersede for corrections; hard-delete only on
   explicit user delete, verifier removal of contract-failing staged entries
   in-window, or tombstoned worthless entries; nobody but the user
   hard-deletes a promoted entry; NO auto-deletion ever. (Normative:
   F11-DM-05 with Q9.)
5. F11-Q5: probe timing + weighting — the recall-backend probe runs once in
   the build phase as a dedicated recorded run before any recall-aid code
   lands (re-run only on candidate-set change), eliminating below-accuracy-
   floor candidates regardless of price before weighing cost then latency.
   (Normative: F11-DM-02 with Q25.)
6. F11-Q6: scope tags — a minimal fixed set (project / scope work-or-personal
   / seat-or-user / task issue-link / status) stamped automatically from the
   admitting context and filterable in any combination; installations never
   share vaults. (Normative: F11-DM-07 with Q3/Q19.)

## F11 design-details record — settled readings and absorbed directions (2026-09-22)

1. Migration dry-run + git-history recovery — versioned converters show a
   dry-run diff to the user before applying; recovery is git history plus
   explicit export (F11-DM-09).
2. Recall citations at use time — recalled memory carries its source links
   alongside the content (F11-DM-10; F10-WR-09 composition).
3. MemPalace identity pin + Mem0/qmd facts absorbed — provenance: research +
   grilling record; the package files previously lacked the identity pin
   (github.com/MemPalace/mempalace ONLY; tech/net lookalikes are MALWARE,
   never fetched), the Mem0 v3 ADD-only fact, and the qmd local-download
   fact (F11-DM-02).
4. Scope-stamp admission field absorbed — provenance: research + grilling
   record; previously absent as an explicit field; derives from the F11-DM-07
   tag set and is required at admission (F11-DM-11).
5. Migration/recovery standing demand absorbed — the user's permanent
   maintainable-solution demand (with migration and recovery) was previously
   absent from the package files (F11-DM-09).
6. Vault git homes per F11-Q1 — in-repo project vault; own-repo machine
   vault at a stated user-level location (F11-DM-01).
7. Probe timing/weighting per F11-Q5 — once before recall-aid code lands;
   accuracy floor first, then cost, then latency; full matrix recorded
   (F11-DM-02).
8. HANDOFF refreshed 2026-09-22: F1–F11 user-approved (F11 user-approved 2026-09-22 as corrected; not closed until tgo-gc3n closes), F12 working context opening next, 1 stub remains (validation harness — verified against `features/README.md`).

## F11 follow-up record — F11-Q7/Q8/Q9/Q10 (all Agreed 2026-09-22)

Paraphrase only; no user quotes reproduced. No decision change to F11-Q1–F11-Q6
or any prior decision. Normative text lives in `features/durable-memory.md`
as `F11-DM-01` … `F11-DM-12` (compositions).

1. F11-Q7 (verifier resourcing) — the verifier runs at Seeker tier with
   per-pass cost/rate bounds, one pass per admission batch.
   (Normative: F11-DM-03.)
2. F11-Q8 (tombstone authority) — tombstones are verifier-proposes with
   user-confirms, held under quarantine with forever reason records.
   (Normative: F11-DM-05.)
3. F11-Q9 (vault git split) — the machine vault auto-commits while project
   vaults stay file-only.
   (Normative: F11-DM-01/09.)
4. F11-Q10 (entry homes + recall scope) — one home per entry with
   both-vault recall.
   (Normative: F11-DM-01/10.)

## F11 band-review record — Nirvana corrections applied 2026-09-22 (documentation only)

Band verdict 2026-09-22: CONCERNS (2/3, majority rule applied — no averaging).
Corrections applied in this pass as ONE documentation-only correction
round: compositions of approved rules plus the four answers (F11-Q7–F11-Q10
above) — bounded non-self-renewing staging window with park-and-disclose at
expiry (F11-DM-05), machine-vault lazy repo init (F11-DM-01), zero-survivor
means the custom file-index guaranteed floor (F11-DM-02), cross-repo
supersedes forbidden (F11-DM-04), verifier failure leaves entries staged plus
recorded (F11-DM-03), quota-pressure parks under F3-SD-04a (F11-DM-05),
overclaim caution accepted (F11-DM-12). No decision changes: F11-Q1–F11-Q10
and all prior decisions (Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5,
F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10) remain fixed.

## F12 digest — Working context (paraphrase; governs feature F12)

Status: settled F12 decisions F12-Q1–F12-Q9, all Agreed 2026-09-22 "Agreed
on all" (Q7 option (A), Q8, Q9); spec `features/working-context.md` user-approved 2026-09-23 as corrected (band CONCERNS 2/3 → 11 fixes + WC-09 → re-check READY);
runtime unverified; scenarios FUTURE; issue tgo-ylvc (closed-pending-issuance). Paraphrase
only; no user quotes reproduced. Normative text lives in
`features/working-context.md` as `F12-WC-01` … `F12-WC-09` (WC-09 additive 2026-09-23), whose trace
table allows multi-source mappings; this digest is the decision record, not
the spec. Where a Q1–Q51 line or an F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11 rule
and an F12 decision conflict inside feature-F12 scope, F12 governs.
Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11 requirements stand untouched.

1. F12-Q1: hybrid compressor ownership — the native Pi compressor owns the
   working set, Magic Context owns archive/retrieval, SINGLE compressor
   owner, NEVER both summarizing (non-negotiable double-compress hazard);
   the implementation path goes to a build-phase probe with a recorded
   selection gate and preference order (disable-historian + native
   compaction first, session_before_compact custom archiver as fallback),
   and the probe result returns to the user before anything pins.
   (Normative: F12-WC-01 with Q28.)
2. F12-Q2: archiver model — the archive/retrieval pass runs the Seeker-tier
   pattern (Luna at work / Muse Spark on Go), the same composition as the
   F11 verifier, with per-pass cost bound + rate bound configured
   alongside. (Normative: F12-WC-02 with F7.)
3. F12-Q3: must-follow re-injection — exactly three items ride every turn
   (thin always-on layer, per-seat hard-rule summaries, living-spec
   pointer); skills stay on-demand, full specs never re-inject; the set
   counts inside the F8-Q7 prompt-core budget (F12-Q7 refinement: the
   ≤500/1000 binds seat instructions + thin always-on layer +
   re-injection set; skill bodies on the disclosed exposure budget) with
   over-budget runs taking the F8-Q9 trim/park path, and the set itself
   never trimmed (F11-Q7 exemption). (Normative: F12-WC-03 with Q28.)
4. F12-Q4: archive→durable boundary — RATIFIED: session archiving never
   feeds durable memory automatically; durable promotion happens only
   through F11 staged admission (with source link) or user direct writes.
   (Normative: F12-WC-04 with Q9; F11-DM-08 sibling.)
5. F12-Q5: ctx_* surfaces — manual /compact and /ctx-* escapes always
   available; per-seat surfaces mirror F10 (Seeker full, Writer scoped,
   Dispatcher/Expert list-only with bounded snippets per F10-Q10).
   (Normative: F12-WC-05 with Q29.)
6. F12-Q6: print/headless — interactive-only v1; ZERO sidecars in any
   non-interactive invocation (headless --print children and
   print-inside-interactive alike). (Normative: F12-WC-06 with Q30.)
7. F12-Q7 (budget refinement, option (A)) — Agreed 2026-09-22 "Agreed on all":
   the ≤500 target / 1000 hard cap binds the PROMPT CORE ONLY (seat
   instructions + thin always-on layer + three-item re-injection set);
   SKILL BODIES move to the separate DISCLOSED EXPOSURE BUDGET where
   F8-Q9's trim order applies — amends the F8-Q7 interpretation with
   provenance (rationale: matches the user's original "custom agent
   prompt… 500 tokens each" wording; prevents chronic skill starvation).
   (Normative: F12-WC-03; authorized F8-PS-02 amendment in
   `features/prose-skills.md`.)
8. F12-Q8 (archive retention) — Agreed 2026-09-22 "Agreed on all": no
   auto-deletion of session archives EVER; task close and session roll
   never purge (archives are recall sources and review evidence); purge is
   an explicit USER-ONLY disposition; only truly disposable diagnostics
   follow F5-Q5's configurable limits. (Normative: F12-WC-09.)
9. F12-Q9 (headless recall channel) — Agreed 2026-09-22 "Agreed on all":
   F1's delegation-envelope evidence return is the DECLARED SOLE CHANNEL
   for headless children's work. (Normative: F12-WC-06.)

## F12 design-details record — settled readings and absorbed directions (2026-09-22)

1. Probe with preference (a) then (b) + user-facing gate — path (a)
   disable-historian + native compaction (clean no-op, UNVERIFIED) probes
   first; path (b) session_before_compact custom archiver (correct
   firstKeptEntryId/tokensBefore) only as fallback; nothing pins before
   the user sees the probe result (F12-WC-01).
2. Seeker-tier archiver with cost/rate bounds — F7 composition; same
   composition as the F11 verifier (F11-Q7) (F12-WC-02).
3. Three-item re-injection set inside the F8-Q7 prompt-core budget (F12-Q7
   refinement option (A), Agreed 2026-09-22) — always-on layer +
   hard-rule summaries + living-spec pointer; skill bodies on the disclosed
   exposure budget; the set never trimmed (F11-Q7 exemption); F8-Q9
   trim/park on breach (F12-WC-03).
4. No-implicit-promotion ratified — archives are recall sources only; F11
   admission or user direct writes promote (F12-WC-04; F11-DM-08 sibling).
5. ctx_* surfaces mirror F10 with bounded snippets — Snippet bound shared
   with the F10-Q10 pin (F12-WC-05).
6. Zero sidecars non-interactive — headless --print children AND
   print-inside-interactive; native compaction follows host default
   inline; the interactive archive continues independently (F12-WC-06).
7. Absorbed safety facts with provenance — provenance: research + grilling
   record; the package files previously lacked them: cancellable
   summarization; overflow retry; 2000-char tool-result cap (probe-verified
   before build); firstKeptEntryId/tokensBefore probe-verified at build;
   Pi min-version drift (>=0.71 vs >=0.74) and token defaults live-verify
   at install; gpt-5.6 alias distrusted until the live picker pins
   (F12-WC-07).
8. HANDOFF refreshed 2026-09-23: F1–F12 user-approved (F11 closed-pending tgo-gc3n; F12 user-approved 2026-09-23 as corrected, closed-pending-issuance tgo-ylvc), F13 validation harness opening; 0 stubs remain (verified against `features/README.md`).
9. Atomic archive pass — a cost/rate-bound breach discards the pass CLEANLY
   (no partial archive entry persists) and parks for bounded retry under
   F5's infrastructure allowance; never silent truncation (failure shape in
   section 7) (F12-WC-02).
10. Required-set never trimmed — the F11-Q7 required-bodies exemption
    applies to the re-injection set (F12-WC-03).
11. Task-ID scoping — the Writer's task-scoped archive follows the TASK ID,
    not the session ID; F5 rollover and reuse keep the same task's archive
    accessible (F12-WC-05).
12. Path-(a) cleanliness bar — ownership confinement + no data loss + no
    dual summarization; Magic Context writes its OWN archive/retrieval
    store freely but NEVER the working set or transcript; probe pass
    criteria stated in section 7 (F12-WC-01).
13. Atomic lock release + ownership re-verify — cancellation/timeout
    mid-compaction releases the single-owner lock ONLY after the in-flight
    pass aborts or completes (recorded); any retry re-verifies compressor
    ownership before summarizing (F12-WC-01).
14. Path-switch migration — a path (a)→(b) mid-life switch is a MIGRATION
    EVENT under F11-DM-09's dry-run-diff discipline (F12-WC-01).
15. Per-item cost attribution — per-item re-injection cost attribution joins
    the section 7 engineering contracts, proving F8-Q7 compliance
    (F12-WC-03).

## F13 digest — Validation harness (paraphrase; governs feature F13)

Status: settled F13 decisions F13-Q1–F13-Q7, all Agreed 2026-09-23
(F13-Q1 a USER OVERRIDE of the recommendation); spec
`features/validation-harness.md` user-approved as corrected 2026-09-23
(12 requirements F13-VH-01 … F13-VH-12, 18 FUTURE scenarios P13-01 … P13-18,
not executed); independently reviewed; band-review corrections applied
(CONCERNS 2/3 → 7 fixes + refinement → re-check READY); runtime unverified;
scenarios FUTURE; issue tgo-k3dj (closed). Paraphrase only; no user quotes reproduced. Normative
text lives in `features/validation-harness.md` as `F13-VH-01` …
`F13-VH-12`, whose trace table allows multi-source mappings; this digest
is the decision record, not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12 rule and an F13 decision conflict
inside feature-F13 scope, F13 governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12 requirements stand untouched.

1. F13-Q1 — USER OVERRIDE (user explicitly chose both CI lanes in v1 over
   the macOS-later recommendation): the harness runs a Windows lane AND a
   macOS lane in v1, and BOTH must green before pilot entry; the macOS
   lane is a v1 build requirement because the pinned harness
   (@marcfargas/pi-test-harness 0.6.1) has none on record. (Normative:
   F13-VH-01 with Q14.)
2. F13-Q2: requirement-complete coverage — every requirement ID across
   F1–F12 maps to ≥1 executable suite item; every preventive control maps
   to its full adversarial scenario (missing coverage blocks); the
   un-automatable P-series remainder stands as the documented acceptance
   matrix (traceable, not automated). (Normative: F13-VH-02/03.)
3. F13-Q3: pilot entry at ONE checkpoint holding all-green (both lanes) +
   explicit user approval + verbatim sign-off; any missing leg blocks
   entry. (Normative: F13-VH-04 with F13-VH-11.)
4. F13-Q4: pilot exit on user sign-off over the pilot evidence PLUS the
   objective floor — all watched metrics recorded over the window, zero
   unexplained rollbacks, strings behaving as signed-off; NO invented
   numeric thresholds in v1; exit without sign-off blocks regardless.
   (Normative: F13-VH-05.)
5. F13-Q5: review-pass-rate RECORD-ONLY in v1 — the F7 falsifier metric
   (implementer tier vs first-pass review-pass rate, plan-shaped vs
   judgment-heavy split) records as class-split counters plus logs and
   never gates; a binding threshold is a v2 candidate needing its own user
   decision. (Normative: F13-VH-06 with the F7 boundary.)
6. F13-Q6 Agreed 2026-09-23: rollback user-initiated — rollback initiation
   is user-only; the permission layer executes revocation via the validated
   config mechanism (F2 composition); record-only readings never trigger
   rollback. (Normative: F13-VH-08 with F2.)
7. F13-Q7 Agreed 2026-09-23: bounded retry with no tie-break — one retry
   per item per lane; a persistent red blocks; correlated both-lane reds
   are defects; no tie-break. (Normative: F13-VH-01/04 composition.)

## F13 design-details record — settled readings and absorbed directions (2026-09-23)

1. S-suite 13 coverage names from the tgo-uz53 record (PRD:298-302): S1
   interrupted sessions; S2 stale memories; S3 denied tools; S4 model
   unavailable; S5 conflicting instructions; S6 failed verification; S7
   bootstrap idempotence; S8 compressor single-owner; S9a reuse-gate
   identity; S9b reuse-gate permission; S9c reuse-gate completed; S10 spec
   drift; S11 zero-web disclosure — each with a setup/action/assertion
   draft from the record, then reviewed (F13-VH-03).
2. Pilot protocol: synthetic-then-supervised (Q20); all-green both OSes →
   supervised pilot with watched metrics → harness-only rollback on
   trigger → reproduced-green re-entry (PRD:303-308; F13-VH-04/05/08).
3. Watched metrics (PRD:303-305): refusal samples with reason codes,
   resume decisions, compaction contests, verifier fails, unavailability
   episodes, web-fallback disclosures, repeat-call canary (F13-VH-05).
4. BQ4 resume-hit-rate instrumentation: F5-DS-01 resume-hit rate measured
   in the pilot, record-only, never a gate (F13-VH-07).
5. Rollback automation shape: harness-only flip + grant revocation + ledger
   preservation; re-entry needs reproduced-green; neither consumes nor
   resets review budgets (F13-VH-08; section 8 closed-loop budget).
6. gaodes fallback verify-then-admit: commit/scope pinned at spec phase;
   provenance failure drops the fallback to primary-only (F13-VH-09).
7. Harness re-pin at spec phase: exact version + SHA + drift disclosure
   against the 0.6.1 record (0.74 floor vs live 0.84); undisclosed drift
   fails coverage (F13-VH-10).
8. Verbatim-string gates: spec review + pre-pilot; runtime text must match
   the signed-off text at both or the gate blocks (F13-VH-11).
9. Counters-and-logs-only instrumentation: nothing measured gates anything
   in v1 (F13-VH-12; F13-Q4/Q5 composition).
10. HANDOFF refreshed 2026-09-23: F1–F12 user-approved (F11 closed-pending
    tgo-gc3n; F12 closed-pending-issuance tgo-ylvc) + F13 draft awaiting
    USER approval (tgo-k3dj); 0 stubs remain; 13/13 specs drafted
    (verified against `features/README.md`).

## F13 approval record — user-approved as corrected 2026-09-23 (documentation only)

User approved the F13 validation harness spec as corrected 2026-09-23 ("Approved."). 12 requirements F13-VH-01 … F13-VH-12, 18 FUTURE scenarios P13-01 … P13-18, not executed. F13-Q1..Q7 settled (Q1 a USER OVERRIDE: both OS CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break). Independently reviewed; band-review corrections applied (CONCERNS 2/3 → 7 fixes + refinement → re-check READY). Runtime unverified; all scenarios FUTURE. 13/13 feature specs approved — the PRIMARY SPEC is DEFERRED pending the user's later-list notes (which may add feature specs). No decision changes; no implementation, installs, code, commits, or pushes.

## F13 composition record — band-review corrections applied 2026-09-23 (documentation only)

Band re-check READY after corrections applied as ONE documentation-only correction round (CONCERNS 2/3 → 7 fixes + refinement): explanation record with user acceptor; S-suite floor label + cost/budget lines; checkpoint map + string version binding; macOS build-cost line; ledger integrity shapes; coverage-map regeneration; re-pin acceptance at spec review. No decision changes: F13-Q1–F13-Q7, Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9 stand; requirement and scenario IDs stable (F13-VH-01…12, P13-01…18).

## F13 closeout record — HANDOFF refreshed 2026-09-23

HANDOFF refreshed 2026-09-23: 13/13 feature specs approved and closed (issue tgo-k3dj closed); 0 stubs remain; PRIMARY SPEC DEFERRED pending user notes (verified against `features/README.md`).

## F14 digest — Writing style (paraphrase; governs feature F14)

Status: settled F14 decisions STYLE-Q1–STYLE-Q10, all Agreed 2026-09-23
(first user-notes mini-project, later-list notes 2026-09-23); spec
`features/writing-style.md` drafted 2026-09-23 as an independently
reviewed draft with corrections applied 2026-09-23 (9 requirements F14-WS-01 …
F14-WS-09, 12 FUTURE scenarios WS-01 … WS-12, not executed);
awaiting Horowitz re-check + user approval; implementation unverified;
scenarios FUTURE; issue tgo-7ipx (open).
Paraphrase only; no user quotes reproduced. Normative text lives in
`features/writing-style.md` as `F14-WS-01` … `F14-WS-09`, whose trace
table allows multi-source mappings; this digest is the decision record,
not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13 rule and an F14 decision
conflict inside feature-F14 scope, F14 governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13 requirements stand untouched.

1. STYLE-Q1: shared always-on core (150–250 words, 8 rules) sandwiched
   top+bottom in the F12-Q3 re-injection set as required content in the
   F8-Q7 budget (never trimmed) + per-seat thin overlays (Dispatcher,
   Writer, Seeker, Expert) + deterministic lint (detective-first;
   individual rules promote to blocking ONLY on F13 pilot evidence plus
   explicit user sign-off) + review-gate cold read at every review
   (Expert now, F16 council once landed); rewrite passes and skill-only
   enforcement rejected. (Normative: F14-WS-01/02/03/08 with F12-Q3,
   F12-Q7, F8-Q9, F1, F3, F13.)
2. STYLE-Q2: source stack — Strunk & White + Orwell six + STE subset
   (20/25-word caps, one instruction per sentence, one word one meaning)
   + ISO 24495-1 four principles; NOT AP/Chicago; Orwell rule-6 escape
   hatch (break any rule sooner than say anything outright barbarous,
   with disclosure).
   (Normative: F14-WS-06.)
3. STYLE-Q3: 8-rule core content — (1) lead with result/action; (2)
   active voice, simple tenses; (3) prefer simple verbs, one word one
   meaning, never pompous verbs (utilize, leverage, facilitate,
   commence, delve, similar); (4) 20-word instructions / 25-word
   instruction per sentence; (5) no preamble, recap, closer, em-dash,
   "not X, it's Y", rule-of-three, or throat-clearing; (6) one topic
   per paragraph (≤6 sentences), lists capped at 5; (7) in conversational
   output only, restate state each turn, end with one concrete next
   step; (8) code/paths/errors/
   quotes verbatim; accuracy beats brevity. Core wording is draft —
   user-approvable at spec review. Honey-for-devs never-compress
   carve-out (validation, error handling, auth, secrets, deletes stay
   complete). (Normative: F14-WS-01/05.)
4. STYLE-Q4: scope is ALL agent-authored prose (chat output, docs,
   comments, commit messages) + verbatim carve-out (code/paths/errors/
   quotes never restyled) + Writer technical overlay (file:line
   discipline, one thought per paragraph, headings as statements).
   (Normative: F14-WS-02/04.)
5. STYLE-Q5: sandwich double-count arithmetic (band-quotable): core
   ≈157 words × 2 ≈ 314 words ≈ 440 tokens; TOP copy counts in the
   F8-Q7 authored-prompt budget, BOTTOM copy in the whole-prompt
   exposure budget (F8-Q7's disclosed second layer); the 150–250 band
   binds the core TEXT (one copy), not its instances; joint hard-cap
   (1000) breach of required content (core + overlays + seat
   instructions + re-injection set) = build refusal → F8-Q9
   park/escalate, never silent trim. (Normative: F14-WS-01.)
6. STYLE-Q6: rule 3 recast — closed verb list becomes
   prefer-simple-verbs + small banned-pompous-verbs list (utilize,
   leverage, facilitate, commence, delve, and similar) while keeping
   one-word-one-meaning; the banned-pompous list feeds the lint.
   (Normative: F14-WS-01/03.)
7. STYLE-Q7 (clarified): rule 7 scoped to CONVERSATIONAL output only
   (chat messages to the user); artifacts (durable written outputs:
   docs, comments, commit messages) follow the other seven rules plus
   the Writer overlay. One style overall. (Normative: F14-WS-01/02.)
8. STYLE-Q8 (clarified): standing user style preferences live in
   user-managed config (persistent until the user revokes by
   instruction; only the user creates/changes them), disclosed ONCE at
   session start and on change, never per output; one-off overrides
   apply per output with an in-output disclosure note.
   (Normative: F14-WS-09.)
9. STYLE-Q9: an explicit user instruction outranks a user-signed
   promoted blocking lint rule FOR THAT OUTPUT (disclosed); the lint
   finding still records. (Normative: F14-WS-03/06.)
10. STYLE-Q10: natural-language prose in any language is in scope
    (principles apply); the mechanical lint is ENGLISH-ONLY (named
    limitation); machine/structured formats (JSON, code, config) are
    out of style scope. (Normative: F14-WS-03.)

## F14 design-details record — settled readings and absorbed directions (2026-09-23)

1. Sandwich placement — core at TOP of the system prompt AND repeated
   at the BOTTOM; home is the F12-Q3 re-injection set; counted in the
   F8-Q7 always-on budget as required content, never trimmed — the
   F8-Q9 trim/park order applies to other content first
   (F14-WS-01).
2. Per-seat overlays — Dispatcher (state-restate + concrete next),
   Writer (file:line discipline + technical overlay), Seeker
   (source-first + bounded snippets per F10-Q10), Expert
   (citation-first + cold read) (F14-WS-02).
3. Deterministic lint — mechanical rules only (20/25 length caps,
   em-dash detection, list-cap detection, banned-phrase list drafted
   from the house-style AI-tells); REPORT-ONLY at review until a rule
   earns promotion; promotion ladder recorded (proposed → piloted →
   user-signed → blocking, per rule); never lint-only for semantic
   rules (F14-WS-03).
4. Review-gate style check — cold read at every review; findings join
   the review report, non-blocking unless a promoted lint rule fires
   (F14-WS-08; F3 composition).
5. Explicit-instruction override (per-output, disclosed) + Orwell
   escape hatch (disclosed); undisclosed deviation fails the
   review-gate check (F14-WS-06).
6. License-gated reuse — F6-Q4 verify-then-admit; 4/9 licenses pending;
   asd-ste100's ~900-word dictionary NEVER copied (copyright); rules
   written fresh (F14-WS-07).
7. Provenance — tgo-im6j wave 2 + Semantic-Anchors
   plain-english-strunk-white anchor (Apache-2.0): drift within 8
   rounds; attention −27–48% over turns; ICLR26 −39% multi-turn;
   repetition +15–20%; position first-200-tokens 94% vs middle 71%;
   skill self-activation 0/10 (Caveman 8.5% vs 65% claimed); concision
   ≠ cost saving. Sources: asd-ste100-skill MIT (ste-lint.py; no
   dictionary), attention-control MIT, elements-of-style-for-agents
   CC0, honey-for-devs MIT (carve-out), headroom Apache-2.0 (style
   note at END of system prompt for cache hits), Semantic-Anchors
   plain-english-strunk-white anchor Apache-2.0 + Pullum critique
   noted.
8. HANDOFF refreshed 2026-09-23: F1–F13 user-approved and closed
(tgo-k3dj closed) + F14/F15 drafts awaiting USER approval (tgo-7ipx, tgo-lyxh
    open); 0 stubs remain; 13/15 specs approved (F14/F15 drafted; verified against
   `features/README.md`).

## F14 band-review record — corrections applied 2026-09-23 (documentation only)

Band verdict: NEEDS REVISION 2/1 (cobain NEEDS REVISION, grohl NEEDS
REVISION, novoselic CONCERNS); 7 findings. Corrections applied in this
pass as ONE documentation-only correction round (the 17-item F14
corrections pass in `features/writing-style.md`: STYLE-Q3 carve-out
re-label, core self-violation rewrite, word-count method + padding,
STYLE-Q5 sandwich arithmetic, STYLE-Q6 verb recast, STYLE-Q7
conversational scope, STYLE-Q8 standing/one-off disclosure with
F14-WS-09 + WS-12, WS-11 clean-pass scenario, overlay meter, STYLE-Q9
rank carve-out, STYLE-Q10 lint scope). Single-injection fix REJECTED
(it would relitigate the approved sandwich). No decision changes:
STYLE-Q1–STYLE-Q10, Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5,
F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9,
F13Q1–F13Q7 stand; requirement and scenario IDs stable and additive
(F14-WS-09, WS-11, WS-12 added; nothing renumbered). Awaiting
Horowitz re-check + user approval.

## RD digest — Retrieval discipline (paraphrase; governs feature F15)

Status: settled RD decisions RD-Q1–RD-Q4, all Agreed 2026-09-23
(user-notes mini-project, later-list notes 2026-09-23); spec
`features/retrieval-discipline.md` drafted 2026-09-23 (9 requirements F15-RD-01 …
F15-RD-09, 15 FUTURE scenarios RD-01 … RD-15, not executed);
RD-Q1..Q4 + band corrections applied 2026-09-23; awaiting Horowitz re-check + user approval; implementation unverified;
scenarios FUTURE; issue tgo-lyxh (open).
Paraphrase only; no user quotes reproduced. Normative text lives in
`features/retrieval-discipline.md` as `F15-RD-01` … `F15-RD-09`, plus two
additive compositions (`prose-skills.md` F8-PS-13, `web-mcp-retrieval.md`
F10-WR-14), whose trace table allows multi-source mappings; this digest
is the decision record, not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14 rule and an RD decision
conflict inside feature-F15 scope, RD governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14 requirements stand untouched.

1. RD-Q1: trigger scope — every EXTERNAL factual claim in delivered
   output (chat answers, docs, code comments asserting facts) needs a
   source link, a workspace citation (file:line), or user-instruction
   attribution; fresh-fact categories (versions, prices, APIs, library
   behavior, standards, release dates) always count as external;
   internal reasoning and procedures are free. (Normative: F15-RD-01.)
2. RD-Q2: procedure vs claim — skill bodies encode PROCEDURES as static
   text; factual CLAIMS in skill text follow the same cite-or-fetch
   rule with build-check enforcement (the F8 amendment, F8-PS-13);
   surface priming rides alongside (the F10 amendment, F10-WR-14:
   retrieval tools first in each seat toolset order, retrieval-required
   marker on fresh-fact categories). (Normative: F15-RD-02/08.)
3. RD-Q3: four-layer enforcement mirroring F14 — always-on core rule
   (1–2 lines) in the F12-Q3 re-injection set, counted ONCE in the F8-Q7 authored-prompt budget
   (one-home accounting; F14's core keeps its own accounting); detective heuristic claim check
   (English-first named limitation); review-gate cold read (Expert now,
   F16 council once landed); promotion ladder on F13 pilot gates (pilot
   evidence plus user sign-off before any claim rule blocks).
   (Normative: F15-RD-03/04/05/06.)
4. RD-Q4: claim-failure behavior — an unsourced claim is disclosed
   ("no source found") or DROPPED, never asserted silently; the
   Q8/Q18 gap rules govern the split; settled F10-WR-08 composition
   confirmed, no new rule. (Normative: F15-RD-07.)

Provenance: the Semantic-Anchors citation anchor (REQUIRES SOURCE
LINKS on external claims, tgo-im6j wave 1); the Vercel surfacing
findings; F14's four-layer precedent (always-on core plus detective
lint plus review-gate cold read plus promotion ladder); claim rules
start detective-only per the drift plus self-activation evidence from
tgo-im6j.

## F15 band-review record — corrections applied 2026-09-23 (documentation only)

Band verdict 2026-09-23: NEEDS REVISION 2/3 (cobain NEEDS REVISION, grohl NEEDS REVISION, novoselic CONCERNS); 5 findings RD-F-01…RD-F-05 (one-home accounting, enforcement split, report scope, mixed prose, rule-text terms) plus missed-consideration compositions plus section 7 shapes; 0 user questions (all composed from approved rules). Corrections applied in this pass as ONE documentation-only correction round: one-home core-rule accounting with the shared budget-home note and rule-presence probe rename (RD-F-01); runtime/build-time enforcement split in 2.2 plus the control-table note (RD-F-02); delegation-report trigger scope with claim-class attribution split plus RD-14 (RD-F-03); mixed-prose scope clause plus RD-15 (RD-F-04); settled-terms rule-text rewrite with honest recount (RD-F-05); quote inheritance, revision-bound citations, fetch-time stamp validity, all-languages cold read, and carry-through clauses; fetch/timeout/offline and promotion-criterion section 7 shapes. No decision changes: RD-Q1–RD-Q4, Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10 stand; requirement and scenario IDs stable and additive (RD-14, RD-15 added; nothing renumbered). Awaiting Horowitz re-check + user approval.

## F16 digest — Review council (paraphrase; governs feature F16)

Status: settled F16 decisions F16-Q1–F16-Q8 (Q1–Q5 Agreed 2026-09-23;
Q6–Q8 Agreed 2026-09-24); spec `features/review-council.md` drafted
2026-09-24 (12 requirements F16-RC-01 … F16-RC-12, 23 FUTURE scenarios
RC-01 … RC-23, not executed);
awaiting Horowitz re-check + user approval; implementation unverified;
scenarios FUTURE; issue tgo-dx5t (open).
Paraphrase only; no user quotes reproduced. Normative text lives in
`features/review-council.md` as `F16-RC-01` … `F16-RC-12`, plus one
additive cross-feature clarification (`agent-roles.md` F1-AR-11, provenance-stamped
F16-Q2 2026-09-23), whose trace table allows multi-source mappings; this digest
is the decision record, not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15 rule and an F16 decision
conflict inside feature-F16 scope, F16 governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15 requirements stand untouched
except the single F16-Q2-authorized F1-AR-11 clarification.

1. F16-Q1: lens roster — THREE lenses (risk, quality, structure); majority 2/3;
   dissent noted in one line; fixed roster assembled per review (TGO Nirvana
   precedent proven live in this session's F8–F15 spec reviews).
   (Normative: F16-RC-01.)
2. F16-Q2: verdict authority — the council's majority verdict IS the review
   verdict for DESIGNATED reviews (one composite verdict); user approval gates
   stand above (the council never approves); Expert solo reviews cover routine
   work; Expert consult mode untouched. ONE cross-feature amendment (authorized
   by this answer, provenance-stamped): F1-Q12's "one authoritative Expert
   verdict per case and revision" becomes "one authoritative REVIEW-AUTHORITY
   verdict per case and artifact revision (Expert solo, or council composite for
   designated reviews)" — additive clarification in `agent-roles.md`; nothing
   else in F1 moves. (Normative: F16-RC-02/03.)
3. F16-Q3: triggers (three) — (i) designated reviews run the council
   automatically (consequential approval-bound work — the F3 gates — plus the
   F14/F15 review-gate cold reads); (ii) on-demand — user prose ("run it by the
   band"), any seat's request, or Dispatcher judgment for consequential
   uncertainty (the F1-Q6 pattern); (iii) routine tasks skip it.
   (Normative: F16-RC-04.)
4. F16-Q4: mechanics — TOOL-LESS lenses (content-fed; TGO's proven pattern) +
   the DISPATCHER packages and synthesizes (majority verdict + finding IDs +
   one-line dissent). The council is a review MODE under the existing four-seat
   roster — NO fifth seat, no dedicated synthesizer. (Normative: F16-RC-05/07/08.)
5. F16-Q5: model assignment — provider-diverse cheap-to-mid lens models, named
   at build via the live picker (the F7 composition rule; the TGO band
   precedent: three providers, three temperaments). (Normative: F16-RC-06.)
6. F16-Q6: lens-failure semantics — all three lenses must return for a verdict
   (never a degraded body); ONE bounded infrastructure retry (the F5 allowance,
   NOT a repair cycle); persistent failure FAILS THE RUN and escalates to the
   user; no 2-lens majority, no 1-1 ties. (Normative: F16-RC-10.)
7. F16-Q7: reconciler identity — on a second-opinion contradiction the
   Dispatcher reconciles only via a fresh council run (consuming one F1 repair
   cycle) or user escalation; the USER is the reconciler of last resort (F1's
   arbitration rule); SELF-RECONCILIATION IS BLOCKED — a seat never adjudicates
   its own verdict. (Normative: F16-RC-11.)
8. F16-Q8: class expansion + on-demand cost — designated-class expansion
   requires the USER'S explicit approval (a new class is a decision, never
   downstream discretion); on-demand runs count against the F1-Q11 global-8
   ceiling AND record on the requesting task's ledger; designated reviews take
   QUEUE PRIORITY over on-demand when the ceiling binds. (Normative: F16-RC-12.)

F16 amendment note: the F1-AR-11 clarification above is the ONLY F16 edit to
`agent-roles.md` (additive, provenance-stamped F16-Q2 Agreed 2026-09-23); all
other F1 requirement and scenario IDs stand. The F14 (F14-WS-08) and F15
(F15-RD-05) "once it lands" hooks resolve to "the F16 council at designated
reviews" per F16-Q3 — hook-line wording only, no decision change in F14/F15.

## F16 band-review record — corrections applied 2026-09-24 (documentation only)

Band verdict: NEEDS REVISION 2/3 (cobain NEEDS REVISION, novoselic NEEDS
REVISION, grohl CONCERNS with the one-line dissent "the fixed-roster/no-fifth-seat
design is the minimal shape; the hole is the failure path, not the design").
Findings F-01 (lens failure semantics) / F-02 (synthesis RECORD-NEVER-JUDGE
guard + packet-selection provenance + safety-objection routing) / F-03
(reconciler identity) / F-04 (designated-class expansion) / F-05 (on-demand
cost), plus missed-consideration compositions (initial-vs-rerun budget split at
RC-07; pinned-model roster at RC-06; packet truncation status + "insufficient
evidence" per Q31 at RC-08; F1 injection guard on lens packets at RC-08;
finding-ID uniqueness validation + synthesis record as audit log at RC-05).
Corrections applied in this pass as ONE documentation-only correction round:
F16-RC-10 (F16-Q6), F16-RC-11 (F16-Q7), F16-RC-12 (F16-Q8), the RC-05/RC-08
guard, and scenarios RC-15 … RC-23. No decision changes: F16-Q1–F16-Q8,
Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9,
F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10,
RD-Q1–RD-Q4 stand; requirement and scenario IDs stable and additive
(F16-RC-10/11/12 + RC-15 … RC-23 added; nothing renumbered). Awaiting Horowitz
re-check + user approval.

Provenance: TGO Nirvana band live results F8–F15 + the oh-my-opencode-slim
Council inventory from tgo-im6j wave 3 + F1 precedent (F1Q12 verdict identity,
Q50/F1Q10 repair budgets, F1Q11 global-8 ceiling, F1Q13/Q31 envelope,
amendment-B consult/review split).

## F17 digest — Vision lane (paraphrase; governs feature F17)

Status: settled F17 decisions F17-Q1–F17-Q5, all Agreed 2026-09-24;
spec `features/vision-lane.md` drafted 2026-09-24 (11 requirements F17-VL-01 …
F17-VL-11, 22 FUTURE scenarios VL-01 … VL-22, not executed);
awaiting Horowitz re-check + user approval; implementation unverified;
scenarios FUTURE; issue tgo-di7d (open).
Paraphrase only; no user quotes reproduced. Normative text lives in
`features/vision-lane.md` as `F17-VL-01` … `F17-VL-11`, whose trace
table allows multi-source mappings; this digest is the decision record,
not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16 rule and an F17 decision
conflict inside feature-F17 scope, F17 governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16 requirements stand untouched;
no cross-feature amendment.

1. F17-Q1: the eyes seat — the TGO shape: the judgment seat reads images
   when multimodal, plus a designated eyes seat otherwise. SEEKER is the
   designated eyes. Three reasons on record: (1) the TGO routing
   discrepancy, (2) the INDEPENDENCE GUARD — the Writer never describes
   its own rendered work for verification (self-review risk),
   (3) observe-and-report is research-shaped work. The Dispatcher reads
   images DIRECTLY when its model is multimodal (the frontier path, no
   routing). NO fifth Observer seat (the four-seat roster + the F16
   council mode stand). (Normative: F17-VL-01/02.)
2. F17-Q2: vision-capable pins — at least ONE of Dispatcher/Seeker must be
   vision-capable in every preset (both preferred). Per-SKU vision flags
   are BUILD-PIN FACTS via the F7 live picker — none named or asserted
   here. (Normative: F17-VL-03.)
3. F17-Q3: the eyes flow — the Dispatcher reads images itself when
   multimodal (no routing). Otherwise, or when independent eyes are
   wanted, a BOUNDED CONSULT to the Seeker ("observe these images and
   report X") returns a structured description + image references +
   provenance (which images, which seat, when). Consult semantics: NO
   verdict weight (like Expert consult); counted in the task's budgets +
   the F1-Q11 global-8 ceiling like any specialist invocation.
   (Normative: F17-VL-04/05.)
4. F17-Q4: runtime seat availability — when NO vision-capable seat is
   available at runtime (a vision-blind Dispatcher plus an
   unavailable/exhausted Seeker), vision work parks per the F3-SD-04a
   lifecycle with disclosure ("no vision-capable seat available") while
   independent text-only work continues; a designated review of visual
   evidence with no eyes available blocks (insufficient evidence is not
   a pass). (Normative: F17-VL-10.)
5. F17-Q5: epistemic standing + challenge path — the description is the
   eyes' best reading, a revisable claim never ground truth, stamp
   riding it; anyone (user, seat, review) may flag a description
   disputed for a re-read under the existing budgets (fresh consult or
   the user's own eyes), the original reading preserved never erased,
   a challenged reading never silently accepted. (Normative: F17-VL-11.)

## F17 design-details record — approved details encoded as requirements (2026-09-24)

Provenance: approved with "Agreed on all" alongside F17-Q1..Q3; encoded as
requirements/constraints, not new questions.

1. Vision-work classes — screenshots, UI renders, design mocks, diagrams,
   charts, scanned/handwritten docs, image-bearing PDFs. donsetch OCR owns
   document TEXT extraction (F10); the vision lane owns visual
   UNDERSTANDING. (F17-VL-07.)
2. Image intake — user-supplied files/URLs + workspace files. NO web image
   search (the F10 retrieval stack is text-first). No-scope:
   image generation/editing, video, OCR-engine replacement. (F17-VL-07.)
3. The eyes' description is EVIDENCE — provenance-stamped like every
   citation (the F10/F11-DM-02 source-carry rule applies through envelopes
   and summarization). (F17-VL-06.)
4. Failure semantics — an unreadable/refused/timed-out read gets ONE
   bounded infrastructure retry (the F5 allowance, not a repair cycle);
   persistent failure parks the affected branch per the F3-SD-04a park
   lifecycle with disclosure — NEVER a fabricated description. (F17-VL-08.)
5. The direct-read path (multimodal Dispatcher) consumes no specialist
   invocation (it is the Dispatcher's own turn); the eyes consult counts
   normally. (F17-VL-05.)

## F17 provenance note — TGO vision-routing discrepancy (recorded honestly 2026-09-24)

The user's note recalled the implementer (Writer/Dylan) as the seat that
reads images; the current TGO encoding routes vision to the researcher
seat. Both readings are preserved here as provenance. The DECISION per
F17-Q1 is SEEKER as the designated eyes (research-shaped work +
the independence guard govern). This note changes no requirement and
renumbers nothing: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5,
F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9,
F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8 all stand.

## F17 band-review record — corrections applied 2026-09-24 (documentation only)

Band verdict 2026-09-24: CONCERNS 2/3 (grohl CONCERNS, novoselic CONCERNS,
cobain NEEDS REVISION with the one-line dissent's CB-01/CB-02 highs absorbed
as BR-01/BR-04). Findings BR-01 (injection guard unlinked) / BR-02
(direct-read standing) / BR-03 (F5 accounting) / BR-04 (runtime availability)
/ BR-05 (epistemic standing), plus the missed-consideration fix (F17-VL-02
and F17-VL-09 scenario gaps → VL-21/22). Corrections applied in this pass as
ONE documentation-only correction round: image-surfaced-text evidence-only
clause under the F1-AR-13 injection guard (BR-01) in F17-VL-07 plus scenario
VL-16; direct-read notes carry the same provenance stamp as consults (BR-02)
in F17-VL-06 plus scenario VL-14 and the VL-04 stamp-carry extension; the
vision retry consumes one F5-Q2 attempt with a spent allowance meaning no
retry (BR-03) in F17-VL-08 plus the section 8 budget line plus scenario
VL-15; new F17-VL-10 runtime seat availability (BR-04/F17-Q4, Agreed
2026-09-24) plus scenarios VL-17/18; new F17-VL-11 epistemic standing +
challenge path (BR-05/F17-Q5, Agreed 2026-09-24) plus scenarios VL-19/20;
missed-consideration scenarios VL-21 (no fifth seat) and VL-22 (invariance).
No decision changes: F17-Q1–F17-Q5, Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7,
F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9,
F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8 stand;
requirement and scenario IDs stable and additive (F17-VL-10/11 + VL-14 …
VL-22 added — VL-14/15 verify the BR-02/BR-03 clauses; nothing renumbered).
Awaiting Horowitz re-check + user approval.

## F18 digest — Visual tracker (paraphrase; governs feature F18)

Status: settled F18 decisions F18-Q1–F18-Q6, all Agreed 2026-09-24;
spec `features/visual-tracker.md` drafted 2026-09-24 (10 requirements F18-VT-01 …
F18-VT-10, 22 FUTURE scenarios VT-01 … VT-22, not executed);
band CONCERNS 2/3 → corrections applied 2026-09-24; awaiting Horowitz re-check +
user approval; implementation unverified;
scenarios FUTURE; issue tgo-nf8p (open).
Paraphrase only; no user quotes reproduced. Normative text lives in
`features/visual-tracker.md` as `F18-VT-01` … `F18-VT-10`, whose trace
table allows multi-source mappings; this digest is the decision record,
not the spec. Where a Q1–Q51 line or an
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16/F17 rule and an F18 decision
conflict inside feature-F18 scope, F18 governs. Approved
F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16/F17 requirements stand untouched;
no cross-feature amendment.

1. F18-Q1: the layered shape — (1) a slim STATUSLINE PRESENCE always-on
   (open count + the next ready issue) + (2) an ON-DEMAND FULL BOARD
   (a command or quick-context render: open/ready/blocked lists). The
   PANEL/TAB is the TARGET form (the sidebar the user wants), gated on
   the TUI feasibility prototype (plausible but NOT proven — likely a
   separate TUI tab/panel, not a simple sidebar widget); if the prototype
   fails, the fallback is statusline + rendered board, DISCLOSED — never
   a silent downgrade. (Normative: F18-VT-01/08.)
2. F18-Q2: board contents (lean v1) — the board mirror (the TGO panel
   analog): open/ready/blocked lists (id, title, status, assignee,
   priority), the CURRENT TASK highlighted + its progress-file path, and
   expandable DEPENDENCY CHAINS (issue → deps). Nothing more in v1 (no
   charts, no history views). (Normative: F18-VT-02.)
3. F18-Q3: read-only v1 — observability only (SEE, not act). User actions
   (claim/close/defer through the panel) are a FUTURE extension under the
   F4-Q3 direct-path rules (the user's manual tracker authority). The
   SEATS never get a mutation path — the F4 Dispatcher-typed-tools-only
   rule stands. (Normative: F18-VT-03/04.)
4. F18-Q4: update cadence — refresh-on-session-events (the Pi hooks that
   exist: session_start, tool_call/tool_result after a bd mutation, and
   the other documented hooks) + a MANUAL refresh always available (the
   command/quick-context surface). A change landing outside a session
   event waits for manual or the next event (staleness shown on the
   last-refreshed indicator); a true tracker-change push is a named v2
   item, not refused by the v1 no-polling rule. (Normative: F18-VT-05.)
5. F18-Q5: the honest event baseline (Agreed 2026-09-24) — v1 recast to
   the implementable surface above (fixes the event-refresh overpromise);
   the no-polling rule governs v1 only. (Normative: F18-VT-05.)
6. F18-Q6: the next-ready selection rule (Agreed 2026-09-24) — the
   statusline's next ready issue follows bd's native ready order
   (priority + dependency-aware — the `bd ready` sequence) with a
   disclosed age tie-break; the statusline always matches the board's
   ready list. (Normative: F18-VT-01.)

## F18 design-details record — approved details encoded as requirements (2026-09-24)

Provenance: approved with "Agreed on all" alongside F18-Q1..Q4; encoded as
requirements/constraints, not new questions.

1. Data scope — the current project's beads store (F9's per-project
   scope). No cross-project aggregation (F11's memory vault is a separate
   surface). A cross-view request is refused in v1. (F18-VT-06.)
2. Observability, not product UI — the panel is harness observability
   (task-state visibility); the no-UI/UX-product no-scope stands. The
   sidebar desire is the placement goal, not a product-UI feature.
   (F18-VT-07.)
3. Prototype gate + fallback disclosure — the TUI feasibility prototype
   (a section-7 build pin) decides the placement (panel/tab vs rendered
   view); a fallback is always DISCLOSED (never a silent downgrade).
   (F18-VT-08.)
4. Error-state lesson (from TGO's own panel history, memory #18 / tgo-hv6)
   — the panel renders an EXPLICIT ERROR STATE (never blank) with BOUNDED
   BACKOFF RETRY (capped, independent of the data signature). Provenance:
   the TGO BeadsPanel's render-nothing visibility bug + its fix.
   (F18-VT-09.)
5. Refresh economics — the refresh is cheap (bd queries); no polling loops
   invented (the event path where available + manual always). The exact
   refresh mechanics (hooks vs poll) are section-7 shapes. (F18-VT-05.)
6. No invented values — panel dimensions, refresh intervals, command names,
   statusline format = section-7 shapes only. (Section 7.)

## F18 provenance note — wave-3 verdict + BeadsPanel analog + F4 rule (recorded 2026-09-24)

The wave-3 Pi TUI surface verdict (tgo-im6j: statusline + quick-context
addons + custom views + interactive widgets/commands, no native sidebar;
sidebar-class view plausible but NOT proven) gates the panel/tab target
form on the feasibility prototype. The TGO BeadsPanel analog shapes the
lean v1 board; its render-nothing visibility bug + fix (memory #18 /
tgo-hv6) shapes the explicit-error-state rule. The F4-Q3 direct path and
the Dispatcher-typed-tools-only rule shape read-only v1. The user's
sidebar desire (see open issues without asking the agent) is the placement
goal. This note changes no requirement and renumbers nothing: Q1–Q51,
F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9,
F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10,
RD-Q1–RD-Q4, F16-Q1–F16-Q8, F17-Q1–F17-Q5 all stand.

## F18 band-review record — corrections applied 2026-09-24 (documentation only)

Band verdict 2026-09-24: CONCERNS 2/3 (cobain CONCERNS, grohl CONCERNS,
novoselic NEEDS REVISION with the one-line dissent: "escalates on the
strength of BAND-1/4"). Findings F18-BAND-1 (event-refresh overpromise)
/ F18-BAND-2 (the next-ready selection rule) / F18-BAND-3 (unbounded dep
expansion) / F18-BAND-4 (the retry cap unverifiable) / F18-BAND-5 (the
visibility-probe gap), plus the missed considerations (staleness
indicator / VT-07 zero scenarios / empty-vs-unreadable / retry-vs-manual
/ the statusline trigger set). Corrections applied in this pass as ONE
documentation-only correction round: the honest event baseline
(F18-Q5/BAND-1, Agreed 2026-09-24) in F18-VT-05 plus rewritten scenario
VT-09 and new scenario VT-15, with the true tracker-change push as a
named section-7 v2 item; the next-ready selection rule (F18-Q6/BAND-2,
Agreed 2026-09-24) in F18-VT-01 plus scenario VT-18; bounded dep-chain
expansion (depth cap + cycle guard + disclosed truncation, section-7
shapes) in F18-VT-02 plus scenario VT-19; the retry cap as a section-7
build pin plus the retry-vs-refresh boundary plus manual-always in
F18-VT-09 plus scenarios VT-10/VT-16 and the section-8 budget line;
the mount-visibility probe in the prototype gate (F18-VT-08) plus
scenario VT-20; the last-refreshed indicator on the board and the
statusline plus the edge states (empty store / zero current / missing
progress file) in F18-VT-01/02 plus scenarios VT-17/VT-21; the VT-07
observability-framing scenario VT-22. No decision changes: F18-Q1–F18-Q6,
Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9,
F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10,
RD-Q1–RD-Q4, F16-Q1–F16-Q8, F17-Q1–F17-Q5 stand; requirement and scenario
IDs stable and additive (clauses only, no new rows; VT-15 … VT-22 added
— nothing renumbered). Awaiting Horowitz re-check + user approval.
