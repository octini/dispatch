# PRD — Dispatch (Stage A frame, revised draft)

Status: revised draft pending review. No implementation. Stage A
frame stands; Stage B first feature spec `features/agent-roles.md`
(draft pending independent review + user approval) carries the normative
agent-roles contract as F1-AR-01 … F1-AR-12. Where this frame and that
feature scope differ, the feature spec governs pending the integrated
primary spec. Sources: `DECISIONS.md` Q
numbers (verbatim history) plus the latest-decision amendments and the F1
digest, and
`EVIDENCE.md` citations. Every numbered choice below cites its Q or
citation. Active seats are the Product Dispatch seats: Dispatcher, Writer,
Seeker, Expert (see section 3.1; historical Q names mapped, not rewritten).

## 1. Goals and non-goals

Goals (Q1):

1. Autonomy first: bounded unattended work with persisted state (Q17).
2. Ease of use first: additive no-clobber bootstrap, prose-driven operation,
   no slash commands required (Q5, Q52-style standing rules).
3. Correctness first: spec approval plus independent review for consequential
   work, per-task acceptance gates, deviation alerts (Q7, Q15, Q48, Q50).
4. Continuity first: shared durable memory and working-context archive with
   single-owner compaction (Q19, Q24, Q28).
5. Token efficiency is secondary to the four goals above (Q1).

Non-goals for v1:

1. No voice cards (Q1).
2. No OMP fork (Q30).
3. No categorical v1 exclusion or deferral of Mem0, MemPalace, or qmd.
   Approved: file-vault durable record plus probe-selected recall aid
   (Q24, Q25). Mem0, MemPalace, qmd, and custom alternatives are candidate
   recall backends: compared before selection at spec phase, not selected
   dependencies and not necessarily optional user installs. No promise to
   adopt all. See section 7, review comment 1.
4. No tier or preset switching in v1; single fixed assignment per seat (Q10).
5. No ZDR constraint in v1 (Q44).
6. No npm publish in v1; git-tag install only (Q45).
7. No real-work test access during development; synthetic suite plus
   supervised pilot instead (Q2, Q20).

Scope note (additive, 2026-09-24; provenance: user notes batch 2026-09-23): Dispatch is batteries-included — a fresh Pi install plus Dispatch plus its auto-installed dependencies (bd, donsetch, AFT, Magic Context, the harness) equals a fully functional harness, which is the user's stated goal. Explicit no-scope carries forward: no UI/UX product features (the tracker is harness observability, not product UI), no language-specific features, no security-specific features, and no browser automation (named no-scope — the retrieval stack is retrieval-first).

## 2. Users and environments

1. General-purpose tool with DevOps focus (Q2).
2. Personal work tool. Common config ships in the plugin. Presets stay
   separate per machine type: OpenCode Go for personal, GitHub Copilot
   Business for work (Q3, Q10).
3. Required operating systems: Windows and macOS (Q14). Prerequisites are
   allowed (Node floor, bd CLI per OS; see MANIFEST.md).
4. Memory is shared across sessions, projects, and agents on each machine.
   Installations on different machines are entirely separate (Q19).
5. No added privacy partition. The tool is entirely open; employer network
   policies handle egress (Q4).
6. Model availability on record (Q41, Q42):
   - Work (Copilot Business, employer-controlled): Astra, GPT-5.6 family
     (Sol, Terra, Luna), GPT-5.5, GPT-5.4 mini and standard, GPT-5.3 Codex,
     GPT-5 mini, Gemini 3.8, 3.7, 3.6, 3.5 Flash, Claude Sonnet 5,
     Opus 5, 4.8, 4.7, Haiku 4.5.
   - Astra is absent from the OpenCode Go catalog (Q41).
   - Go subscription active. Use-balance is currently ON for unrelated
     testing and normally OFF; the plugin leaves it untouched and recommends
     off to prevent silent spend (Q42).
7. Seat model assignment for v1 (Q10): single fixed assignment per seat.
   Astra preference for high-performance seats, Luna for light seats.
   Exact SKU pins happen at spec phase via the live picker, because the
   `gpt-5.6` alias may route to Sol (EVIDENCE.md, untested assumptions).
   One named backup model per seat with logged notice before abort (Q43).

## 3. Architecture overview

### 3.1 Four seats with layered soft enforcement

1. Seats (Q11 as amended by `DECISIONS.md`): Product Dispatch seats —
   Dispatcher (plans/orchestrates; Beads lifecycle authority), Writer
   (sole agent editing project artifacts), Seeker (research and
   documentation drafts; read-only on project artifacts; the former
   researcher and documenter roles merged), Expert (independent review and complex-problem
   consultation; read-only; one fresh-context seat for reviews; Q21, Q22).
   Historical names (orchestrator-planner, implementer,
   researcher-documenter, reviewer) are preserved verbatim in
   `DECISIONS.md`. No folder, package, or npm rename. See section 7,
   review comment 2.
2. Enforcement is layered soft enforcement with no containers (Q12):
   one enforcement layer with four per-seat policies plus a global deny
   floor (Q36).
3. Seat ceilings (research tgo-7t1x, as corrected): Dispatcher holds Beads
   lifecycle mutation exclusively through typed validated host tools, not
   unrestricted shell; Writer is the sole agent editing project artifacts
   (plugin services own authorized state and memory persistence; Writer is
   not the sole component allowed persistent writes); Seeker defaults to
   typed local inspection with a bounded read-only shell for useful gaps
   (exact allowlist and security tests unresolved at spec phase, see item
   7); Expert is read-only. Specialists have no Beads mutation; scoped
   Beads reads are permitted. Git and bd reads do not inherently require
   shell; typed wrappers are possible. See section 7, review comment 3.
4. Interactive ask is allowed only for the Writer within approved
   scope; unattended seats deny rather than ask (Q37).
5. Grants are session-scoped by default; per-tool persistence only by
   explicit opt-in, logged (Q40).
6. Windows is soft-only enforcement with an explicit degraded banner; WSL2
   is the optional path (Q39).
7. Seeker inspection (Q38, audit tgo-8p1y): Seeker defaults to typed
   local-inspection tools; a bounded read-only shell covers useful gaps.
   The exact allowlist and its security tests are unresolved at spec phase
   and are pinned then. No claim that git or bd reads inherently require
   shell.

### 3.2 Memory and context split

1. Durable record (Q24): git-tracked file vault in the wiki pattern
   (raw/ immutable, wiki/ compiled, index and log), one vault per project
   plus one machine-shared vault with scope tags. Databases serve recall
   only, never as the record.
2. Recall aid (Q25): selected by synthetic probe comparing candidate
   backends (file-index-only versus hybrid search versus verbatim versus
   extraction, over Mem0, MemPalace, qmd, and custom alternatives); no
   backend is selected in this dispatch and none is promised adoption.
   Approval to date covers the file-vault record plus a probe-selected
   recall aid only. Backend selection is a spec-phase probe blocker. See
   section 7, review comment 1.
3. Admission contract (Q26): agents stage UNVERIFIED entries only with a
   required source link; a background verifier promotes; the user writes
   and deletes directly.
4. Revision rule (Q27): supersede, do not overwrite; the old claim stays
   with a supersedes link; lint surfaces contradictions; everything is
   explicitly deletable.
5. Session history stays separate from durable knowledge (Q9). Memory is
   inspectable, correctable, deletable, and source-linked (Q9).
6. Working context direction is hybrid (Q28): native Pi compressor plus
   Magic Context archive and retrieval, with a single compressor owner and
   per-turn re-injection of must-follow rules. This is an approved
   direction with unresolved compatibility, NOT a working integration:
   archive-only use needs custom adaptation and a runtime eval (audit
   tgo-vkcu; EVIDENCE.md), flagged as a selection/probe blocker.
7. Manual `/compact` and `/ctx-*` escapes are always available (Q29).
8. No standing memory agents; maintenance is hook-driven plus
   event-driven (Q13).

### 3.3 SDD workflow

1. One spec approval covering outcome, scope, acceptance, and consequences
   (Q15). Alert on ALL deviations. Re-approval is required for changed
   outcomes, scope, acceptance, or consequences (Q15).
2. Spec store is repo files `.planning/specs/NNN-slug/` as source of truth;
   Beads issues hold hash pointers; living-spec revisions happen in
   place (Q48).
3. Per-task acceptance gates apply. Review-then-repair budget: initial
   review then at most two automatic repair and re-review cycles; early
   escalation on no-progress, scope change, or side-effect ambiguity (Q50).
4. Expert consultation (Q22, Q50 as amended): proactive Expert input on
   consequential uncertainty, and escalation for blocked work. The
   Dispatcher routes; specialists request escalation, never nested
   delegation. The Expert is read-only. Consultation is not approval and
   never resets the repair/re-review budget. Reviews cover plans/specs AND
   implementations. A fresh review session receives the approved spec,
   artifacts, tests, and findings — not the consultation transcript.
   Acknowledged limitation: same-model review risks anchoring; the fresh
   session plus artifact packet is the mitigation on record, and residual
   risk is flagged in `EVIDENCE.md`.
5. Routing on record: proportional routing across tiny, standard, and heavy
   (Q7).
6. Standing authoring rules (Q52-style): Beads sole tracker; lean prompts
   (target 500 tokens or fewer, hard cap 1000); retrieval-led reasoning;
   prose-driven everything; no slash commands required.

### 3.4 Delegated-session reuse

1. Role-sensitive reuse (Q31, names as amended): Writer and Seeker may
   resume partial sessions under guards; Expert review sessions are always
   fresh; Dispatcher holds no specialist sessions.
2. Resumable bar (Q32): progress file plus non-terminal run log plus under
   the preset token budget plus equal identity.
3. Completed sessions are never reused; follow-ups start fresh with an
   artifact packet holding the spec, decisions, dead ends, and open
   questions (Q33).
4. Resume gates (Q34): identity equality (model plus variant plus preset
   plus seat config plus tools and skills plus host version) AND no
   permission narrowing. Unconfirmed external actions are re-validated,
   never replayed.
5. Crash or timeout auto-recovers with bounded retries; repeated failure or
   side-effect ambiguity escalates; cancel means fresh (Q35).

### 3.5 Retrieval stack

Hybrid retrieval (Q49-Q51 as amended): donsetch as a pinned external
dependency plus a thin policy adapter — no vendored engine or fork
planned — plus Context7 plus one anonymous hosted search plus TinyFish,
Jina, and markdown.new fallbacks. The adapter controls seat access,
timeouts, cancel, output, zero-paid fallback, and version checks. CLI/MCP
versus native Pi extension is an unresolved compatibility choice pinned
at spec phase. Exact artifacts are pinned at build. Single-maintainer
risk is mitigated by pinning plus chain fallback. No new licensing
guarantees: AGPL obligations and the interface boundary require actual
license review; prior blanket clearance is not proof. See section 7,
review comment 4.

### 3.6 Beads authority

1. Verify-first host-tool lifecycle through typed validated host tools, not
   unrestricted shell (audit tgo-8p1y). The Dispatcher holds exclusive
   Beads lifecycle mutation; specialists have no Beads mutation while
   scoped Beads reads are permitted. The Writer is the sole agent editing
   project artifacts; plugin services own authorized state and memory
   persistence. See section 7, review comment 3.
2. Claim requires pre-show unowned and post-show confirm. Close requires
   in-progress plus assignee plus gate plus post-closed confirm. Reopen is
   closed-only. Dependencies verify both endpoints; self-edge refused.
   Updates edit living-spec fields only and refuse closed issues.
3. bd is a plugin dependency installed when missing, not a per-project
   prerequisite step (Q47).

### 3.7 Validation

1. Synthetic suite first, then supervised pilot; failure-path scenarios are
   required (Q20).
2. Recommended harness (research tgo-uz53): `@marcfargas/pi-test-harness`
   0.6.1, pinned at spec phase. See MANIFEST.md extension picks.
3. Rollback, pilot metrics, re-entry rule, and verbatim-string sign-off are
   defined in section 6.

## 4. Workflows

### 4.1 Auto-init

1. Trigger: first real prose in the primary session only. Bail on
   re-check paths per the bootstrap design (research tgo-dowi).
2. Steps in order:
   - Step 1. Nested-git guard, then `git init` only if absent (Q5).
   - Step 2. Create or merge `.pi/settings` registration without
     clobbering existing content (Q5).
   - Step 3. `bd init` when missing, then `bd setup` plus advice append
     (Q5, Q47).
   - Step 4. Append project `AGENTS.md` markers only when absent (Q5).
3. The bootstrap never creates automatic commits, pushes, or global
   installs (Q5).
4. needsSetup uses independent signals: `.beads` presence, Beads
   integration marker, advice markers, `.pi/settings.json`, `git rev-parse`.
   Attempted set plus inflight map plus failure cap parks repeated setup
   failures (research tgo-dowi).
5. Always-trust is pre-configured with user override. It does NOT authorize
   deployments, destructive actions, or paid fallback (Q46).
6. bd installs with the plugin when missing (Q47). Per-OS installers and
   version floor are in MANIFEST.md.

### 4.2 DevOps access

Named-environment authorization for external reads; separate mutation and
production approvals (Q16). Approval is required for destructive, external,
and paid actions; the plugin never performs silent model substitution
(Q6, Q43).

### 4.3 Unattended work

Bounded unattended work and retries; state persists; no silent side-effect
resumption after restart (Q17). Proportional routing (tiny, standard,
heavy) applies; spec approval plus independent review gate consequential
work (Q7).

### 4.4 Retrieval-failure behavior

1. Default is zero-paid web; disclose coverage gaps rather than assume (Q8).
2. When uncertainty is not acceptance-critical, proceed with reversible
   work. Otherwise stop the affected branch. Disclose in both cases (Q18).

## 5. v1-vs-later scope boundaries

v1 ships:

1. Interactive Pi only (Q30). Headless `--print` children run without a
   background historian.
2. Four seats with single fixed model assignment per seat (Q10, Q11).
3. File-vault durable record plus probe-selected recall aid (Q24, Q25).
4. Hybrid working context with single compressor owner (Q28).
5. Repo-file spec store with hash pointers in Beads (Q48).
6. Hybrid retrieval chain (Q51).
7. Git-tag install from GitHub; pinned refs immutable; drift warn-only;
   no npm publish (Q45).
8. Synthetic suite plus supervised pilot with rollback (Q20, section 6).

Deferred to later:

1. Tiers and preset switching (Q10).
2. ZDR constraint (Q44).
3. OMP fork (Q30).
4. No memory-backend bundling decision (spec-phase probe compares Mem0,
   MemPalace, qmd, and custom alternatives; none selected, none promised;
   see section 3.2).
5. npm publish (Q45).
6. Voice cards (Q1).
7. Multi-lens review band: only if the pilot shows misses (Q22).

## 6. Acceptance criteria

Source: validation research close reason on tgo-uz53.

1. All 13 synthetic scenarios S1–S11 are green on Windows and macOS.
   Scenario coverage includes interrupted sessions, stale memories, denied
   tools, model unavailable, conflicting instructions, failed verification,
   bootstrap idempotence, compressor single-owner, reuse gates (identity,
   permission, completed), spec drift, and zero-web disclosure.
2. Supervised pilot follows with watched metrics: refusal samples with
   reason codes, resume decisions, compaction contests, verifier fails,
   unavailability episodes, web-fallback disclosures, repeat-call canary.
3. Rollback means flip to harness-only mode, revoke grants, preserve
   ledgers.
4. Re-entry requires the failing scenario reproduced green.
5. Refusal and disclosure verbatim strings get sign-off at spec review plus
   the pre-pilot gate.

Traceability note: each numbered item above maps to the Q number or ticket
cited beside it. `EVIDENCE.md` holds the full citation table. Anything
without a Q or citation is labeled UNVERIFIED.

## 7. Review comments (verbatim, with resolutions)

The four user comments below are preserved verbatim. Each gives its
original location, the comment text, and the Resolution applied in this
revised draft. The inline parentheticals were moved here, not removed.

1. Original location: section 1, non-goals item 3.
   User comment: Is this accurate? We investigated and decided on a hybrid memory approach that incorporated elements of these plugins, didn't we?
   Resolution: corrected. No categorical v1 exclusion or deferral of
   Mem0, MemPalace, or qmd stands. Approved scope is the file-vault
durable record plus a probe-selected recall aid (Q24, Q25); Mem0,
MemPalace, qmd, and custom alternatives are candidate backends compared
before selection at spec phase, not selected dependencies and not
necessarily optional user installs, with no promise to adopt all (see
sections 1 and 3.2 and section 5).

2. Original location: section 3.1, seats item 1.
   User comments: Can we find better names for these seats? For that matter, can we come up with a name for the new plugin? I don't really want to call it TGO v2.
   Resolution: names adopted — product name Dispatch (user-selected);
seat names Dispatcher (plans/orchestrates; Beads lifecycle authority),
Writer (sole agent editing project artifacts), Seeker (research and
documentation drafts; read-only on project artifacts), Expert
(independent review and complex-problem consultation; read-only).
Historical Q names are preserved verbatim in `DECISIONS.md` and mapped,
not rewritten. Filesystem, package, folder, and npm identifiers are
unchanged and not selected in this dispatch. This dispatch is restricted
to revision only; the user has authorized proceeding to the next step.

3. Original location: section 3.1, seat ceilings item 3.
   User comment: Who will be the beads writer? In TGO it's Bernstein, and some permissions had to be modified to allow that. Doesn't have to be the same way here, but we'll need to know the answer.
   Resolution: answered. The Dispatcher holds exclusive Beads lifecycle
mutation through typed validated host tools, not unrestricted shell. The
Writer is the sole agent editing project artifacts; plugin services own
authorized state and memory persistence. Specialists have no Beads
mutation; scoped Beads reads are permitted. The Seeker defaults to typed
local inspection with a bounded read-only shell for useful gaps; the
exact allowlist and security tests are unresolved at spec phase (see
sections 3.1 item 3, 3.1 item 7, and 3.6).

4. Original location: section 3.5, retrieval stack.
   User comment: How is donsetch being implemented? Is it a dependency, or are we adapting it and integrating it into the plugin code?
   Resolution: answered. donsetch is a pinned external dependency plus a
thin policy adapter; no vendored engine or fork is planned. The adapter
controls seat access, timeouts, cancel, output, zero-paid fallback, and
version checks. CLI/MCP versus native Pi extension is an unresolved
compatibility choice pinned at spec phase. No new licensing guarantees:
AGPL obligations and the interface boundary require actual license
review (see section 3.5).
