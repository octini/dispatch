# Feature F2 — Permissions and enforcement (Dispatch)

Status: Feature 2 user-approved; AFT compatibility addendum (F2-PE-13 + scenarios P-REPL-19 … P-REG-22) independently reviewed; implementation unverified. No installs. No code. All scenarios FUTURE, not executed. User-approved with 2026-09-21 band-review amendment batch; band-review amendment batch user-approved 2026-09-21 (Horowitz READY, user approved).
No commits or pushes. Second Stage B feature spec; remaining 11 areas stay stubs (see `README.md`).
Historical Q1–Q51 and prior amendments are subordinate to approved F2Q1–F2Q6 FINAL clarifications
where they conflict for this scope. Initial blanket-ban readings are superseded; section 6 records
the FINAL rule.

## 0. Objective

Define what the finished plugin must enforce before any seat acts: which fixed integrity rules never
yield, which action/path/duration policy the user may change, how ambiguous/missing/malformed policy
fails, which paths start protected, how denials escalate, how grants persist and revoke, and how
user-directed permission changes are applied without self-authorization. Covers the guard contract,
per-seat ceilings, and honesty rules (Windows, tool hiding, classification). Mechanism choice (APIs,
packages, scheduler locks, parsers) is downstream, not this spec.

Stable requirement IDs `F2-PE-01` … `F2-PE-13`. Sources trace to settled F2Q1–F2Q6 FINAL plus the user AFT replacement question (F2-PE-13 only) plus prior
Stage A amendments and F1 where noted; mappings are multi-source where a rule draws on more than one
source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by
requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (policy, guard contract, acceptance only):

1. Fixed integrity safeguards versus user-configurable action/path/duration policy.
2. Ambiguous/missing/malformed policy behavior; protected-path defaults and override shape.
3. Deny immediacy, recurring-pattern escalation, audit redaction rule.
4. Grant scope/duration/revocation representation; user-directed change flow with provenance.
5. Guard evaluation contract; per-seat ceiling enforcement; preventive/detective/advisory labels.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only Dispatcher exclusivity holds.
2. Seat responsibilities and handoff contracts — F1 owns; here only the ceilings enforcement holds.
3. Worktree/branch mechanics — sessions/delegated-work spec owns; here only the F1 Git exception holds.
4. Memory admission, retrieval chain, bootstrap order, model SKU pins — unchanged, owned elsewhere.

Not in this feature:

1. Exact host APIs, package selection, permission-extension choice, parser internals, scheduler locks,
   counter reset/window algorithm, TTL values, persistence store — all downstream (section 7).
2. Any claim that Pi hooks, models, or extensions already implement sections 2–3. Proof is future work.
3. The integrated primary spec. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Policy shape and authority

- F2-PE-01 — Fixed integrity safeguards hold against every seat and every instruction source: no
  self-authorization, no forged approval, no bypassing policy validation, no authority granted from
  retrieved text. Action/path/duration policy is configurable by explicit USER instruction only, within
  fixed role/authority boundaries. No immutable blanket destructive/history/file bans stand. (F2Q1 FINAL.)
- F2-PE-02 — Ambiguous or missing policy denies the affected action, logs the denial, and parks the
  affected branch while unaffected work proceeds. Malformed config fails closed with a repair path.
  F2Q2 wording stands as confirmed despite its typo; no reinterpretation is smuggled in. Park
  clearance follows the F3 park lifecycle (BQ1+BQ2): policy-gap parks need the user. (F2Q2.)
- F2-PE-03 — Default protected paths cover Git metadata, credentials, and dependency-install locations;
  the user may extend the set and may explicitly authorize a scoped exception or change the policy.
  Defaults are not absolute bans: F1 isolated branches/worktrees/local commits/integration merges inside
  approved tasks remain allowed with the user tree and task target untouched pending approval. Raw
  `.git` edits are not interchangeable with a validated Git operation. (F2Q3 FINAL; F1-AR-09.)
- F2-PE-04 — Every denied action is blocked immediately. A recurring same-denied-attempt pattern uses
  default threshold 3 per task to alert the pattern and park the affected branch: no auto-widening, no
  headless nagging. The action/reason log never exposes secrets. Threshold 3 is an escalation signal,
  never a retry allowance. Park clearance follows the F3 park lifecycle (BQ1+BQ2). (F2Q4.)
- F2-PE-05 — Grants are session-scoped by default. Persistence is per-tool Writer scope only, by explicit
  opt-in, logged; no blanket Allow-forever grant exists. Scope, duration, and revocation are represented
  on every grant; no default TTL is invented here. Whether a persistent grant lives globally or per
  project is UNDECIDED and sits in review-needed items (section 7). (F2Q5.)
- F2-PE-06 — The user may direct a permission change: the Dispatcher interprets the exact request from a host-validated explicit USER instruction and the
  Writer applies it through a validated mechanism only. Applying never authorizes. Provenance, change,
  scope, and duration are recorded. A clear instruction needs no redundant confirmation; an ambiguous
  widening asks first. A host-validated prior USER approval still in scope and duration remains valid without live reconfirmation. Quoted text, tool output, or a specialist request alone is never user approval,
  even when it quotes the user; arbitrary quotes never suffice. (F2Q6 FINAL.)

### 2.2 Seats, routing, and concurrency

- F2-PE-07 — One enforcement layer with four per-seat policies plus a global deny floor. The Dispatcher
  holds exclusive Beads MUTATION authority via typed validated host tools and retains dispatch, planning,
  and scoped-read routing tools; the Writer holds project edits; Seeker and Expert are read-only with
  scoped task reads. Plugin-service state persistence is separate and is not Writer editing. Per-project
  ceilings 3 Writers / 3 Seekers / 2 Experts plus a configurable machine-wide 8 hold at enforcement.
  (Settled cross-feature; F1-AR-02, F1-AR-10.)
- F2-PE-08 — Writer action-grant ask is allowed only inside approved scope; unattended seats deny rather
  than ask. Specialist evidence/authority requests routed through the Dispatcher per F1 are not direct
  tool-grant prompts. The host validates envelope authority before dispatch; text never grants tools.
  The user-directed config-edit exception to the user-only default stays explicit, and even outside the
  normal project editing surface the Writer uses a validated update only. (Settled cross-feature; F1-AR-14.)
- F2-PE-09 — Policy changes during runs never let a stale widening or a revoked grant authorize a later
  action. Enforcement design is unspecified here; cancellation is not claimed to roll back side effects.
  Denials, grants, and context changes never move repair/re-review counters. (Settled cross-feature; F1-AR-12.)
- F2-PE-10 — Windows native enforcement is soft policy with an explicit degraded banner; no kernel
  containment is claimed. Fixed-integrity denials hold on EVERY platform including native Windows
  (they are policy-layer implementable without kernel containment); "soft" describes OS-containment
  gaps (process/filesystem races), not the authority rules. WSL2 is the optional path. Always-trust
  configuration is not permission. (Settled cross-feature; Stage A Q39, Q46; BQ6 user-approved 2026-09-21.)
- F2-PE-11 — Every control is classified preventive, detective, or advisory at spec phase. Tool hiding is
  context optimization, never a security control. Post-execution detection is never described as
  preventive. (Settled cross-feature.)

### 2.3 Guard evaluation contract (no invented internals)

- F2-PE-12 — Guard contract with no invented internals: envelope authority validated first, then protected-path matching on every tool, per-seat and read-only ceilings, grant scope/duration/revocation checks, and fixed integrity rules before configurable policy. Outcomes are allow, deny-and-log, deny-log-and-park, or fail-closed, with redacted reasons and a PROPOSED counting key. No full API interception is claimed until probes confirm it. (Draft details.)

Contract steps:

1. Inputs: seat identity, validated envelope authority (scope, approvals, budgets), requested
   action/tool with arguments, resolved target path(s), current policy revision, grant set with
   scope/duration/revocation state.
2. Order: validate envelope authority first; match protected paths across all tools; check per-seat
   ceiling and read-only ceilings; check grant scope/duration/revocation; apply fixed integrity rules
   before configurable policy.
3. Outcomes: allow, deny-and-log, or deny-log-and-park (ambiguous/missing) and fail-closed (malformed).
   Every deny names the policy reason without secrets; every recurring-pattern escalation records the
   normalized key below.
4. Counting key (PROPOSED for review, engineering choice annotated): normalized
   role/action/target/policy-reason per task. Exact reset/window algorithm is NOT finalized here; the
   key shape is proposed so reviewers can confirm or replace it without disturbing sections 2.1–2.2.
5. No guaranteed interception of every host API surface is claimed until probes confirm it (section 7).

### 2.4 Replacement/extension-tool compatibility (approval policy architecture only)

- F2-PE-13 — Replacement/extension tools: permission follows the verified implementation — capability plus operation plus arguments plus resolved targets — never a trusted name or prefix. A same-name replacement or a namespaced alias inherits no authorization without a validated mapping; an unknown implementation, schema, or operation parks the affected capability pending mapping, never trusting the whole installed extension. Read/search operations may stay read-only only as verified; import, organize, refactor, AST replace, delete, move, undo, and restore mutate. Mixed tools split by operation: safety history/list differ from undo/restore, and checkpoint is a state write needing separate authority, never automatically read-only. A preview/dryRun flag is read-only only if the actual backend behavior is verified; an omitted flag follows the verified default and never universal-denies authorized Writer writes. Shell lifecycle write/kill/send-input capabilities are judged separately from status/watch. Backend/proxy delegation and dynamic registration never bypass the guard. Scope spans affected source plus destination and multiple paths. Existing role boundaries, user-authorized policy changes, and F1 workflow are unchanged. This is approval policy architecture only and guarantees nothing about current AFT runtime behavior. An unknown mapping needs adapter verification, never a user waiver of fixed integrity. A tool mapping counts as verified only with adapter/probe evidence tying capability plus operation plus arguments plus resolved targets to actual backend behavior; names, prefixes, and declarations alone are never sufficient; the standard's probe procedure is named in section 7. (Derived compatibility requirement from the user AFT replacement question plus F2-PE-01/07/12; not a fabricated F2Q7.)

Evidence note: the audit read published declarations and docs only — https://github.com/cortexkit/aft/blob/main/packages/pi-plugin/README.md, docs/tools.md, plus published declaration files such as https://cdn.jsdelivr.net/npm/@cortexkit/aft-pi@0.49.4/dist/tools/safety.d.ts — with version mismatch across sources; the exact executable implementation plus Pi runtime interception stands unverified. This addendum selects no dependency and grants no config defaults; persistent-grant lifetime/store and all other section 7 items stay explicitly unresolved.

### 2.5 PROPOSED Seeker read-only matrix (for sign-off, not approved)

Preferred path is typed read/search/git-metadata operations; constrained shell covers useful gaps only.
Expert inherits the same read-only ceiling; its rows are identical minus documentation-draft outputs.

| Capability | Typed preferred | Constrained shell (gaps only) | Never |
|---|---|---|---|
| File reads | typed read/search with path scope | `git show <rev>:<path>`-shaped read via allowlisted form only | bare `cat`/`less`/pager fallback as general reader |
| Search | typed search (ripgrep-backed where offered) | constrained `rg`-shaped query via allowlisted form only | interpreter pipelines that re-parse results |
| Git metadata | typed status/log/diff wrappers | `git status`/`log`/`show` allowlisted forms only | `git` subcommands that write, plus raw `.git/` edits |
| Issue reads | typed `bd show`/`list`/`ready` scoped reads | none proposed | any `bd` mutation; `bd` bookkeeping writes stay denied |
| Shell general | none | deny unclassifiable shell | compound/redirection/interpreter commands, `PAGER`/`EDITOR`/`GIT_*` tricks, option injection, symlink/traversal escapes, Windows-shell equivalents, executable overrides |

Names such as `git show`, `rg`, or `bd show` are not proof of no side effects: external helpers,
pagers, config files, option injection, compound/redirection/interpreter wrapping, symlink/traversal
and Windows cases, `bd` bookkeeping writes, and executable overrides all require tests or typed
alternatives. Deny any unclassifiable shell command. Wildcard prefix allowlists are not proposed.
Protected-path matching applies to every tool including MCP servers, proxies, and worktree aliases —
not to bash alone. Registry, hook, parser, and library claims from earlier reports remain unverified
version-specific assumptions; no current API or package selection is invented here.

## 3. Constraints

C1. F2Q1–F2Q6 FINAL govern where they conflict with earlier readings inside this scope. C2. No seat
exceeds section 2.2 ceilings; no specialist mutates Beads; only the Writer edits artifacts, in scope,
via a validated path. C3. No self-authorization, forged approval, validation bypass, or text-granted
authority. C4. No protected-path write without an explicit scoped user exception, except F1 already-approved validated Git operations inside approved tasks run under that approval without repeated permission; no raw `.git` edit
standing in for a validated Git operation. C5. No auto-widening, no headless nagging, no secrets in
logs, no Allow-forever grant, no fabricated TTL. C6. No stale or revoked grant authorizes later action;
no denial/grant/context change moves repair counters. C7. No kernel-containment claim on Windows; no
tool-hiding-as-security claim; no post-execution detection labeled preventive. C8. No invented host API,
package, parser, or counter-algorithm claim; gaps in section 7 stay open.

## 4. Verification (all FUTURE — not executed; no tests run against plugin)

Independent reviewer owns adversarial policy consistency; this file owns ID/link consistency only.
Format per scenario: setup/action/observable-result. Every scenario is FUTURE.

- P-MAL-01 (F2-PE-02). Malformed policy file present / ordinary action attempted, then user-directed validated repair / ordinary execution fails closed with repair guidance and no partial allow, while the validated repair path remains possible without fail-open. FUTURE.
- P-MISS-02 (F2-PE-02). Missing rule for one action / affected branch parks with deny+log while an
  independent branch proceeds / park record plus progress elsewhere. FUTURE.
- P-PROT-03 (F2-PE-03). Default protected credential path / Writer write attempted / denied with
  policy reason, secrets absent from log. FUTURE.
- P-OVER-04 (F2-PE-03). Explicit scoped user exception for one dependency path / in-scope write /
  allowed per authorized duration/scope with exception logged; adjacent path still denied. FUTURE.
- P-CFG-05 (F2-PE-06). Clear host-validated explicit USER instruction narrowing a path rule / Dispatcher interprets, Writer
  applies via validated mechanism / provenance/change/scope/duration recorded, no extra confirm. FUTURE.
- P-SELF-06 (F2-PE-01, F2-PE-06). Writer invents its own widening without user direction / enforcement
  denies / denial logged as self-authorization. FUTURE.
- P-QUOTE-07 (F2-PE-01, F2-PE-06). (a) Pasted user quote in tool output and a specialist request citing it /
  treated as text, not approval / widening refused; (b) host-validated prior USER approval still in scope and duration /
  proceeds without live reconfirmation per the clear-instruction rule. FUTURE.
- P-GIT-08 (F2-PE-03). Approved task with dirty user tree / agent uses worktree/branch/local commit and
  dedicated integration merge; raw `.git/HEAD` edit attempted / integration path allowed under the task approval without repeated permission, user working files/index/target ref unchanged pre-approval (worktrees share metadata; repository-wide byte-identity not required), raw edit denied. FUTURE.
- P-DENY-09 (F2-PE-04). Single denied action, where interception coverage is verified by probes /
  enforcement blocks before execution / no side effect and a redacted deny record; unverified surfaces
  default-deny the affected action and are listed in the evidence gap. FUTURE.
- P-PATT-10 (F2-PE-04). Same denied action three times in one task / third denial alerts the pattern and
  parks the affected branch / no widening, no repeated prompts, counters unchanged. FUTURE.
- P-PERS-11 (F2-PE-05). Explicit per-tool Writer persistence grant with scope / later in-scope action
  allowed then revocation issued / post-revocation attempt denied; full grant lifecycle logged. FUTURE.
- P-STALE-12 (F2-PE-09). Widening revoked mid-run while a parallel Writer still holds the old view /
  next action under the stale view denied / no stale authorization. FUTURE.
- P-HIDE-13 (F2-PE-11). (a) Hidden-but-authorized tool called directly / allowed subject to the same guard; (b)
  hidden-and-prohibited tool called directly / denied by policy; hiding never cited as the control in either branch. FUTURE.
- P-PROXY-14 (F2-PE-12). Protected path reached via MCP/proxy/worktree alias, where interception
  coverage is verified by probes / write attempted / denied by all-tool path matching; unverified
  surfaces default-deny the affected action and are listed in the evidence gap. FUTURE.
- P-SHELL-15 (F2-PE-12). Compound command with redirection plus `GIT_PAGER` override and a
  symlink-traversal read / enforcement denies as unclassifiable/evasive / typed alternative suggested.
  FUTURE.
- P-WIN-16 (F2-PE-10; BQ6). Windows native run / soft-policy enforcement with the degraded banner
  visible / banner claims soft policy only (fixed-integrity denials still hold on native Windows;
  "soft" describes OS-containment gaps, not the authority rules) and offers WSL2; always-trust cited
  as non-permission. FUTURE.
- P-RED-17 (F2-PE-04). Denial involving a credential-bearing argument / audit inspected / action and
  reason present, secret values absent. FUTURE.
- P-READ-18 (F2-PE-07). Seeker/Expert artifact edit and non-typed Beads write attempted / both refused,
  scoped reads succeed / refusals logged, reads allowed. FUTURE.
- P-REPL-19 (F2-PE-13). Same-name replacement tool and namespaced alias over a mutating implementation / Seeker read attempted then Writer mutating call attempted / read allowed as verified read-only, mutating call denied by seat with no name-inherited authorization. FUTURE.
- P-MIX-20 (F2-PE-13). Mixed safety tool called for history/list, then for checkpoint / history and list allowed per read-only authority, checkpoint denied as a state write needing separate authority / split outcomes logged per operation. FUTURE.
- P-PREV-21 (F2-PE-13). AST replace with preview/dryRun flag versus omitted flag: Seeker attempt and authorized Writer attempt / Seeker denied (preview read-only only where backend behavior verified), Writer allowed only within verified default and scope with no universal-deny of the authorized write / seat-split outcomes logged. FUTURE.
- P-REG-22 (F2-PE-13). Newly registered capability (or changed tool schema) plus proxy delegation to a secondary target outside scope / call attempted / fails closed with the affected capability parked pending validated mapping, unaffected capabilities proceed. FUTURE.

## 5. Requirement-to-F2Q traceability

| Requirement | F2 source | Stage A / F1 relation |
|---|---|---|
| F2-PE-01 fixed integrity vs configurable policy; no blanket bans | F2Q1 FINAL (supersedes initial blanket-ban reading) | Q36 one layer/four policies; Q6 approval scope |
| F2-PE-02 ambiguous/missing deny-log-park; malformed fail closed | F2Q2 (typo confirmed, wording stands) | Q18 branch discipline |
| F2-PE-03 protected defaults + scoped override; F1 Git exception; raw `.git` rule | F2Q3 FINAL | Q5 no auto commit/push; F1-AR-09 |
| F2-PE-04 immediate deny; threshold-3 pattern + park; redaction; no retry reading | F2Q4 | Q20 failure paths |
| F2-PE-05 session default; per-tool Writer persistence logged; scope/duration/revocation; store undecided | F2Q5 | Q40 grants; lifetime/store open (section 7) |
| F2-PE-06 Dispatcher-interprets/Writer-applies on host-validated USER instruction; provenance; clear-vs-ambiguous; quote rule | F2Q6 FINAL | Q37 ask scope; F1-AR-13/14 envelope |
| F2-PE-07 one layer/four seats; Dispatcher exclusive Beads MUTATION, retains dispatch/planning/reads; Writer edits; read-only specialists; services separate; 3/3/2+8 | Settled cross-feature | Amendment D; F1-AR-02, F1-AR-10; Q36 |
| F2-PE-08 Writer-ask-in-scope, unattended-deny; evidence requests not grants; host-validated envelope; explicit config-edit exception | Settled cross-feature | Q37; F1-AR-14; host envelope rule |
| F2-PE-09 stale/revoked grants never authorize later; no rollback claim; counters unchanged | Settled cross-feature | F1-AR-12 budgets; cancellation open |
| F2-PE-10 Windows soft + banner + WSL2; always-trust != permission | Settled cross-feature | Q39, Q46 |
| F2-PE-11 preventive/detective/advisory; hiding is optimization; post-exec never preventive | Settled cross-feature | — |
| F2-PE-12 guard contract; all-tool path matching; shell-evasion deny; no interception guarantee | Draft details | Q38 allowlist unresolved; EVIDENCE probes |
| F2-PE-13 replacement/extension-tool compatibility; capability+operation+args+targets, never name | User AFT replacement question (derived, not F2Q7) | F2-PE-01 fixed integrity; F2-PE-07 seat ceilings; F2-PE-12 guard contract |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F2Q1 FINAL; F2-PE-01) Integrity rules are fixed; action/path/duration policy moves only on explicit
   user direction inside role boundaries. Old blanket bans do not stand.
2. (F2Q2; F2-PE-02) Unclear or absent rules deny and park the affected branch, never the whole run;
   broken config closes ordinary execution until repaired, with the user-directed validated repair path still available and no fail-open.
3. (F2Q3 FINAL; F2-PE-03) Sensitive paths start protected and user-extensible; scoped exceptions are
   explicit. F1 isolated version-control work still fits; raw metadata edits never equal Git operations.
4. (F2Q4; F2-PE-04) Denials land at once; the third same-denial in a task raises the pattern and parks
   the branch. Logs stay secret-free; three is a signal, not an allowance.
5. (F2Q5; F2-PE-05) Grants die with the session unless the user explicitly persists one Writer tool scope
   with logging. Scope, duration, and revocation travel with the grant; lifetime and store await review.
6. (F2Q6 FINAL; F2-PE-06) Permission edits start from a host-validated explicit USER instruction (not necessarily a new live-user quote), pass through Dispatcher
   interpretation, and land via validated Writer application with full provenance. Quotes never approve.
7. (Cross-feature; F2-PE-07) Seats keep F1 ceilings at enforcement time; the Dispatcher keeps exclusive Beads mutation plus dispatch/planning/reads; services own their own state.
8. (Cross-feature; F2-PE-08) Asks stay in approved Writer scope; unattended seats deny; evidence flow is
   not a grant flow; the host checks the envelope, not the prose.
9. (Cross-feature; F2-PE-09) Revoked or superseded authority never authorizes the next step; budgets do
   not move on enforcement events; cancellation promises no rollback.
10. (Cross-feature; F2-PE-10) Windows tells the truth about soft enforcement and offers WSL2;
    always-trust never counts as permission.
11. (Cross-feature; F2-PE-11) Labels stay honest: hiding trims context, detection reports after the fact.
12. (Draft details; F2-PE-12) The guard checks envelope, paths on every tool, ceilings, grants, then
    integrity before policy; evasive shell is denied; full interception awaits probes.
13. (User AFT question + F2-PE-01/07/12; F2-PE-13) Replacement tools earn nothing by name: capability,
    operation, arguments, and resolved targets decide; unknown mappings park the capability pending
    adapter verification; mixed operations and lifecycle sides split by verified behavior; no runtime
    guarantee, no dependency selected.

## 7. Downstream unresolved contracts (not decided here)

Review-needed decisions (user confirms before build):

1. Seeker/Expert read-only matrix in section 2.5 (typed set, gap-shell shape, no wildcard prefixes).
2. Normalized counting key role/action/target/policy-reason per task (section 2.3 item 4).
3. Persistent-grant lifetime and store: global versus project, exact TTL shape — no default set here.
4. Protected-path default list extensions beyond Git metadata/credentials/dependency locations.
5. Machine-wide cap configuration surface and default-change procedure (default 8).

Implementation probes (runtime evidence before build claims):

1. Pi interception coverage for every tool/API surface including MCP/proxy/worktree aliases.
2. Shell-evasion battery: compound/redirection/interpreter, env overrides, pagers, option injection,
   symlink/traversal, Windows-shell equivalents, `bd` bookkeeping, executable overrides — or typed
   alternatives where tests fail.
3. Registry/hook/parser/library behavior as version-specific assumptions, re-verified live.
4. donsetch/permission-extension/subagent-adapter pins and AGPL boundary review (owned elsewhere).
5. Cancellation and side-effect ledger behavior; no rollback promised until measured.
6. Refusal/disclosure verbatim strings at spec review plus the pre-pilot gate.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1 digest and F2 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; interception, shell, registry, and package gaps stay open there.
- `README.md` — Stage B index; this is feature 2 of 13.
