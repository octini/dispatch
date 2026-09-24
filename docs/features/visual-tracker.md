# Feature F18 — Visual tracker (Dispatch)

Status: drafted 2026-09-24; F18-Q1..Q6 + band corrections applied 2026-09-24; awaiting Horowitz re-check + user approval; implementation unverified; all scenarios FUTURE. Requirements F18-VT-01 … F18-VT-10 drafted 2026-09-24 (kept at 10; corrections land as clauses, not new rows). Scenarios VT-01 … VT-22 (22 FUTURE, not executed). No implementation, installs, code, commits, or pushes. Eighteenth Stage B feature spec (FINAL feature; PRIMARY SPEC still DEFERRED pending user notes). Historical Q1–Q51 and prior amendments are subordinate to settled F18-Q1–F18-Q6 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16/F17 requirements stand untouched; no cross-feature amendment.

## 0. Objective

Define the visual tracker: a layered task-state surface — a slim always-on statusline presence (open count plus the bd-ready-order next ready issue, with a last-refreshed indicator) plus an on-demand full board, with the panel/tab as the target form gated on the TUI feasibility prototype (gate includes a mount-visibility probe) — carrying the lean v1 board contents (open/ready/blocked lists, the current task with its progress-file path, bounded expandable dependency chains, a last-refreshed indicator, disclosed edge states), read-only in v1 under the F4 authority rules, refreshed on session events plus manual (a true tracker-change push is a named v2 item), scoped to the current project's beads store, framed as harness observability (not product UI), with a disclosed fallback if the prototype fails and an explicit error state with build-pinned bounded backoff retry. (F18-Q1..Q6 all Agreed 2026-09-24.)

Stable requirement IDs `F18-VT-01` … `F18-VT-10` (10 requirements; band corrections extend by clause — no new rows). Sources trace to settled F18-Q1–F18-Q6 (all Agreed 2026-09-24) plus the approved design details plus the F4-Q3 direct path and the F4 Dispatcher-typed-tools-only rule, the F9 per-project scope, the F11 memory-vault separation, and the tgo-im6j wave-3 Pi TUI surface verdict plus the TGO BeadsPanel analog and the memory #18 / tgo-hv6 error-state provenance plus the user's sidebar desire; mappings are multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (layered shape, contents, read-only rule, cadence, scope, framing, gate, error state only):

1. Layered shape: statusline presence plus on-demand board; panel/tab as the gated target form (section 2.1).
2. Board contents for lean v1: lists, current-task highlight with progress-file path, expandable dependency chains (section 2.2).
3. Read-only v1 rule plus the seats'-no-mutation rule (section 2.3).
4. Update cadence plus refresh economics (section 2.4).
5. Data scope: current-project beads store, no cross-project aggregation (section 2.5).
6. Observability-not-product-UI framing (section 2.6).
7. Prototype gate plus fallback disclosure (section 2.7).
8. Error state plus bounded backoff retry (section 2.8).
9. Control classification of the above by actual function.
10. Question map and provenance record (section 8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle and mutation authority — F4 owns (F4-Q3 direct path, Dispatcher-typed-tools-only); here only the read-only composition holds (section 2.3).
2. Per-project store scope — F9 owns; here only the scope composition holds (section 2.5).
3. Memory-vault surface — F11 owns; here only the separation holds (section 2.5).
4. TUI panel/tab construction and the feasibility prototype — downstream engineering owns, never built here (section 7).
5. Statusline string format, refresh mechanics, manual-refresh command name — downstream engineering owns, never chosen here (section 7).

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Panel dimensions, refresh intervals, command names, or statusline formats — all section 7 shapes, never asserted here.
3. Panel-driven user actions (claim/close/defer), cross-project views, or charts/history views — refused in v1 (sections 2.2/2.3/2.5).
4. Any claim that the statusline renders, the board renders, or refresh runs at runtime. Proof is future work.
5. The integrated primary spec or any next-feature content. F18 is the FINAL feature spec; integration follows.

## 2. Interfaces

### 2.1 Layered shape (F18-Q1)

- F18-VT-01 — THE LAYERED SHAPE: (1) a slim STATUSLINE PRESENCE, always on — open count plus the next ready issue (the cheap always-there surface); plus (2) an ON-DEMAND FULL BOARD — a command or quick-context render carrying the open/ready/blocked lists. The PANEL/TAB is the TARGET form (the sidebar the user wants), gated on the TUI feasibility prototype (section 2.7). NEXT-READY SELECTION RULE: the statusline's next ready issue follows bd's NATIVE READY ORDER (priority + dependency-aware — the `bd ready` sequence) with a disclosed AGE tie-break; the statusline always matches the board's ready list. LAST-REFRESHED INDICATOR: the statusline carries a last-refreshed indicator (age/timestamp — diagnostic metadata, not a surface widening) so external-edit staleness is visible. (F18-Q1 Agreed 2026-09-24; F18-Q6 Agreed 2026-09-24; band composition BAND-2; missed-consideration composition.)

### 2.2 Board contents (F18-Q2)

- F18-VT-02 — LEAN V1 CONTENTS: the board mirrors the TGO panel analog — open/ready/blocked lists with id, title, status, assignee, priority per issue; the CURRENT TASK highlighted plus its progress-file path; expandable DEPENDENCY CHAINS (issue → deps). DEP-CHAIN EXPANSION IS BOUNDED: a depth cap plus a CYCLE GUARD plus disclosed TRUNCATION — cap and guard values are section-7 shapes, nothing invented here; expansion stops at the disclosed bound with truncation shown, and a cycle never loops. LAST-REFRESHED INDICATOR: the board carries the same last-refreshed indicator as the statusline (diagnostic metadata). EDGE STATES (states, NOT errors): an EMPTY store renders "no issues"; ZERO current tasks means no highlight (not an error); a MISSING progress file renders as absent (disclosed). Nothing more in v1: charts and history views are refused (the lean contract). (F18-Q2 Agreed 2026-09-24; band composition BAND-3; missed-consideration composition.)

### 2.3 Read-only v1 (F18-Q3)

- F18-VT-03 — READ-ONLY V1: observability only (the desire is to SEE, not to act). Panel-driven user actions — claim/close/defer through the panel — are refused in v1; they are a FUTURE extension under the F4-Q3 direct-path rules (the user's manual tracker authority). (F18-Q3 Agreed 2026-09-24.)
- F18-VT-04 — SEATS' NO-MUTATION RULE: the seats never get a mutation path through the panel — the F4 Dispatcher-typed-tools-only rule stands, unmoved. A seat attempting a panel mutation is refused. (F18-Q3 Agreed 2026-09-24; F4 composition.)

### 2.4 Update cadence + refresh economics (F18-Q4 + design detail 5)

- F18-VT-05 — UPDATE CADENCE (honest event baseline): v1 = REFRESH-ON-SESSION-EVENTS — the Pi hooks that exist (session_start, tool_call/tool_result after a bd mutation, and the other documented hooks) — plus a MANUAL refresh always available (the command/quick-context surface). A tracker change landing OUTSIDE a session event does NOT auto-refresh the view; the manual refresh or the next session event surfaces it, and the last-refreshed indicator shows the staleness. A true tracker-change PUSH (a watcher or a bounded poll) is a NAMED v2 item (a section-7 future design, NOT refused by the no-polling rule — the no-polling rule governs v1 only). Refresh economics: the refresh is cheap (bd queries); no polling loops are invented in v1. (F18-Q4 Agreed 2026-09-24; F18-Q5 Agreed 2026-09-24; band composition BAND-1.)

### 2.5 Data scope (design detail 1)

- F18-VT-06 — DATA SCOPE: the current project's beads store (F9's per-project scope). No cross-project aggregation (F11's memory vault is a separate surface). A cross-view request is refused in v1. (Approved design detail.)

### 2.6 Observability framing (design detail 2)

- F18-VT-07 — OBSERVABILITY, NOT PRODUCT UI: the panel is harness observability (task-state visibility); the no-UI/UX-product no-scope stands. The sidebar desire is the placement goal, not a product-UI feature. (Approved design detail.)

### 2.7 Prototype gate (design detail 3)

- F18-VT-08 — PROTOTYPE GATE + FALLBACK DISCLOSURE + MOUNT-VISIBILITY PROBE: the TUI feasibility prototype (a section-7 build pin) decides the placement — panel/tab vs rendered view. The gate proves the panel is not just constructible but VISIBLE after mount (the panel-present-but-invisible class from the tgo-hv6 lesson): a panel that mounts but renders invisible FAILS the gate. If the prototype fails, the fallback is statusline plus rendered board, DISCLOSED — never a silent downgrade. (Approved design detail; F18-Q1 composition; band composition BAND-5.)

### 2.8 Error state (design detail 4)

- F18-VT-09 — ERROR STATE + BOUNDED BACKOFF RETRY: the panel renders an EXPLICIT ERROR STATE (never blank) with BOUNDED BACKOFF RETRY. The retry cap is a section-7 BUILD PIN — the shape is named here, the value pins at build (C3 holds). RETRY-VS-REFRESH BOUNDARY: retry is the backoff retry of a FAILED READ; the refresh loop is a separate mechanism. The MANUAL refresh always works, INDEPENDENT of the retry cap. Provenance: the TGO BeadsPanel's render-nothing visibility bug plus its fix (memory #18 / tgo-hv6). (Approved design detail; band composition BAND-4.)

### 2.9 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block; nothing here claims the runtime implements it — enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Read-only v1; panel claim/close/defer refused (F18-VT-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks tracker mutation through the panel |
| Seats never mutate via the panel (F18-VT-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks any seat-side panel mutation path |
| Cross-project view refused; charts/history refused (F18-VT-02/06) | Preventive (SPEC requirement, NOT proven implementation) | blocks the v1 surface widening past the lean contract and the project boundary |
| Fallback always disclosed, never silent (F18-VT-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks a silent downgrade if the prototype fails |
| Explicit error state, never blank (F18-VT-09) | Preventive (SPEC requirement, NOT proven implementation) | blocks the render-nothing visibility failure |
| Statusline presence + board contents as specified (F18-VT-01/02) | Detective (reporting) | surfaces open count, next ready issue, lists, current task, and dep chains after the fact |
| Refresh-on-session-events + manual refresh (F18-VT-05) | Detective (reporting) | surfaces tracker changes at session events with a manual re-read always available; staleness shows on the last-refreshed indicator |

### 2.10 Invariance and spec-only status

- F18-VT-10 — F1–F17 requirements stand unchanged by anything in this feature; no seat, budget, ceiling, gate, evidence, license, platform, model, prose, skill, retrieval, memory, context, harness, style, discipline, council, or vision rule moves here. All blocking in sections 2.1–2.8 is a SPEC requirement, not proven runtime implementation — enforcement is unverified until probes decide (section 7). (F1–F17 invariance; spec-only status.)

## 3. Constraints

C1. F18-Q1–F18-Q6 govern where they conflict with earlier readings inside this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16/F17 stand where this spec does not narrow them; no cross-feature amendment. C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8, F17-Q1–F17-Q5 stand; this spec cross-references, never re-decides. C3. No invented values: no panel dimensions, no refresh intervals, no command names, no statusline formats — unknowns in section 7 stay open. C4. Read-only v1: no user action and no seat mutation through the panel. C5. A failed prototype falls back disclosed, never silent. C6. The lean contract holds: no charts, no history views. C7. Spec-only status: every block is a SPEC requirement with enforcement unverified until probes decide. C8. All scenarios FUTURE — not executed; no tests run. C9. Documentation only — no implementation, installs, code, config, commits, or pushes. C10. IDs stable and additive: F18-VT-01…10, VT-01…22; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial tracker consistency; this file owns ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- VT-01 (F18-VT-01). Input: a project with open issues, tracker idle / Observe: statusline check runs / Pass: the slim presence shows the open count plus the next ready issue; nothing else asserted about its string shape. FUTURE.
- VT-02 (F18-VT-01/02). Input: the user invokes the on-demand board / Observe: board render runs / Pass: open/ready/blocked lists render with id, title, status, assignee, priority per issue. FUTURE.
- VT-03 (F18-VT-02). Input: a task is current with a progress file / Observe: highlight check runs / Pass: the current task renders highlighted with its progress-file path beside it. FUTURE.
- VT-04 (F18-VT-02). Input: an issue with recorded deps / Observe: expansion runs / Pass: the dependency chain expands (issue → deps); an issue with no deps expands to an empty chain, never an error. FUTURE.
- VT-05 (F18-VT-08). Input: the TUI feasibility prototype passes / Observe: placement decision runs / Pass: the panel/tab target form is adopted per the prototype's proven placement. FUTURE.
- VT-06 (F18-VT-08). Input: the TUI feasibility prototype fails / Observe: fallback handling runs / Pass: statusline plus rendered board serves as the fallback WITH disclosure; a silent downgrade refused. FUTURE.
- VT-07 (F18-VT-03). Input: a panel tracker-action request arrives (claim/close) / Observe: action check runs / Pass: refused in v1 (read-only); the F4-Q3 prose path is the way. FUTURE.
- VT-08 (F18-VT-04). Input: a seat attempts a panel mutation / Observe: authority check runs / Pass: refused — Dispatcher-typed-tools-only; no seat-side mutation path exists. FUTURE.
- VT-09 (F18-VT-05). Input: a tracker change lands OUTSIDE a session event / Observe: refresh behavior runs / Pass: the view does NOT auto-refresh; the manual refresh or the next session event surfaces the change; the last-refreshed indicator shows the staleness. FUTURE.
- VT-10 (F18-VT-05). Input: the user invokes manual refresh / Observe: command/quick-context surface runs / Pass: the board re-reads from the beads store on demand — always, INDEPENDENT of the retry cap (even with the retry allowance spent). FUTURE.
- VT-11 (F18-VT-06). Input: a cross-project view request arrives / Observe: scope check runs / Pass: refused in v1 — current project's beads store only (F11's vault is a separate surface). FUTURE.
- VT-12 (F18-VT-02). Input: a v1-surface widening request arrives (charts/history) / Observe: scope check runs / Pass: refused — the lean contract holds. FUTURE.
- VT-13 (F18-VT-09). Input: the beads store is unreadable / Observe: error handling runs / Pass: an EXPLICIT ERROR STATE renders (never blank) with bounded backoff retry per the section-7 build-pinned cap; retry is the backoff retry of the FAILED READ (the refresh loop is separate). FUTURE.
- VT-14 (F18-VT-10). Input: a tracker task runs / Observe: invariance check runs / Pass: no F1–F17 rule moves; the invariant holds. FUTURE.
- VT-15 (F18-VT-05). Input: a session event fires after a bd mutation (session_start, tool_call/tool_result) / Observe: refresh path runs / Pass: the view refreshes off the session event with cheap bd queries; no polling loop invented in v1. FUTURE.
- VT-16 (F18-VT-09). Input: a read fails repeatedly / Observe: retry accounting runs / Pass: backoff retry stops at the build-pinned cap; the retry-vs-refresh boundary holds (the refresh loop is not charged against the retry cap). FUTURE.
- VT-17 (F18-VT-01/02). Input: an external edit lands between refreshes / Observe: indicator check runs / Pass: the board AND the statusline carry the last-refreshed indicator (age/timestamp) showing the staleness — diagnostic metadata, no surface widening. FUTURE.
- VT-18 (F18-VT-01). Input: a tracker with mixed priorities and deps / Observe: selection check runs / Pass: the statusline's next-ready matches `bd ready`'s first entry; the age tie-break is deterministic and disclosed; the statusline always matches the board's ready list. FUTURE.
- VT-19 (F18-VT-02). Input: a deep or cyclic dep graph / Observe: expansion runs / Pass: expansion stops at the disclosed bound with truncation shown; a cycle never loops. FUTURE.
- VT-20 (F18-VT-08). Input: the panel mounts but renders invisible / Observe: visibility probe runs / Pass: the probe FAILS the gate; the disclosed fallback serves; the error state renders — never a silent blank. FUTURE.
- VT-21 (F18-VT-02). Input: an empty store plus zero current tasks plus a missing progress file / Observe: edge-state render runs / Pass: the empty store renders "no issues", zero current tasks renders no highlight, the missing progress file renders as absent — each its disclosed state, none an error. FUTURE.
- VT-22 (F18-VT-07). Input: a product-UI/dashboard widening request arrives through the panel / Observe: framing check runs / Pass: refused — the no-scope stands; the surface stays harness observability. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F18 source | F1–F17 relation |
|---|---|---|
| F18-VT-01 layered shape: slim statusline presence (open count + next ready per the bd-ready-order selection rule with disclosed age tie-break) + on-demand full board; panel/tab is the gated target form; last-refreshed indicator on the statusline | F18-Q1 + F18-Q6 Agreed 2026-09-24; band composition | TGO panel analog; tgo-im6j wave-3 Pi TUI surface verdict (composed, untouched) |
| F18-VT-02 lean v1 contents: open/ready/blocked lists (id/title/status/assignee/priority); current task highlighted + progress-file path; bounded expandable dep chains (depth cap + cycle guard + disclosed truncation); last-refreshed indicator; disclosed edge states; charts/history refused | F18-Q2 Agreed 2026-09-24; band + missed-consideration compositions | TGO panel analog (composed, untouched) |
| F18-VT-03 read-only v1; panel claim/close/defer refused; future extension under F4-Q3 | F18-Q3 Agreed 2026-09-24 | F4-Q3 direct path; user's manual tracker authority (composed, untouched) |
| F18-VT-04 seats never mutate via the panel; F4 Dispatcher-typed-tools-only stands | F18-Q3 Agreed 2026-09-24 | F4 Dispatcher-typed-tools-only rule (composed, untouched) |
| F18-VT-05 refresh-on-session-events (the Pi hooks that exist) + manual refresh always; cheap bd-query refresh; no polling loops in v1 (no-polling governs v1 only); true tracker-change push is a named v2 item | F18-Q4 + F18-Q5 Agreed 2026-09-24; band composition | None moved |
| F18-VT-06 current-project beads store; no cross-project aggregation; cross-view refused | Approved design detail | F9 per-project scope; F11 vault separation (composed, untouched) |
| F18-VT-07 harness observability; no-UI/UX-product no-scope stands; sidebar desire is the placement goal | Approved design detail | No-scope rule (composed, untouched) |
| F18-VT-08 prototype decides panel/tab vs rendered view; mount-visibility probe in the gate; failed prototype falls back disclosed, never silent | Approved design detail; F18-Q1 composition; band composition | tgo-im6j wave-3 verdict (composed, untouched) |
| F18-VT-09 explicit error state never blank; bounded backoff retry per the section-7 build-pinned cap; retry-vs-refresh boundary; manual refresh independent of the cap | Approved design detail; band composition | TGO BeadsPanel render-nothing bug + fix; memory #18 / tgo-hv6 (composed, untouched) |
| F18-VT-10 F1–F17 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR … F17-VL; section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F18-Q1/Q6; F18-VT-01) A slim statusline stays always on while the full board waits on demand; the next-ready follows bd's native ready order with a disclosed age tie-break; a last-refreshed indicator rides along; the wanted panel/tab form waits on the prototype.
2. (F18-Q2; F18-VT-02) The v1 board lists open/ready/blocked with five fields, spotlights the current task with its progress file, and unfolds dep chains inside a disclosed bound with truncation — plus a last-refreshed indicator and disclosed edge states; nothing heavier.
3. (F18-Q3; F18-VT-03; F4) The panel shows without touching: claim/close/defer stay refused until a future F4-Q3 extension.
4. (F18-Q3; F18-VT-04; F4) No seat ever mutates through the panel; the Dispatcher's typed-tools monopoly stands.
5. (F18-Q4/Q5; F18-VT-05) Session events plus a manual re-read drive v1 refresh; outside-event changes wait for manual or the next event with staleness shown; a true push is a named v2 item; polling is never invented in v1.
6. (Design; F18-VT-06; F9/F11) One project's store feeds the view; cross-project asks stop at the boundary.
7. (Design; F18-VT-07) The surface watches the harness; the sidebar wish places it without becoming product UI.
8. (Design; F18-VT-08) The prototype picks panel/tab or rendered view and proves visibility after mount; failure lands openly, never as a quiet step down.
9. (Design; F18-VT-09) Failure shows itself as an explicit state with build-pinned capped retry, per the BeadsPanel lesson; retry is failed-read backoff only, and manual refresh never depends on the cap.
10. (Derived; F18-VT-10) F1–F17 rules do not move for tracker work, and every block here awaits probe proof.

## 7. Downstream unresolved contracts (not decided here)

Open items only — no invented values:

1. TUI feasibility prototype build pin: the prototype verdict plus the panel/tab form, size, and placement it proves — no dimension or placement asserted here.
2. Session-event trigger set shape: the documented Pi hooks the v1 refresh rides (session_start, tool_call/tool_result after a bd mutation, and the other documented hooks) — shape only, no hook invented here.
3. Statusline string format shape: the open-count plus next-ready-issue string composition — shape only, no format chosen here.
4. Manual-refresh command-name shape: the command/quick-context invocation identity — shape only, no name chosen here.
5. Dep-expansion bound shapes: the depth-cap shape plus the cycle-guard shape plus the truncation-disclosure shape — shapes only, no values chosen here.
6. Retry-cap build pin: the bounded-backoff-retry cap shape is named here; the value pins at build (C3 holds).
7. Mount-visibility probe shape: the panel-visible-after-mount proof composition — shape only, no threshold chosen here.
8. Last-refreshed indicator shape: the age/timestamp composition riding the board and the statusline — shape only, no format chosen here.
9. v2 tracker-change PUSH (NAMED future design, not refused): a watcher or a bounded poll that pushes tracker changes to the view — the v1 no-polling rule does not refuse this v2 item; design and values stay open.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: tracker reads consume NO review budget and reset none — F1 task budgets (initial plus at most two repair/re-review cycles) and the ONE shared integration budget stand unchanged by tracker views; refresh cost is the cheap bd query (F18-VT-05); no new budget surface exists. Retry is the backoff retry of a FAILED READ; the refresh loop is a separate mechanism (never charged against the retry cap). The MANUAL refresh always works, INDEPENDENT of the retry cap. An exhausted budget escalates instead of refreshing, and approvals are never bypassed by tracker work.

Question map (F18-Q1..Q6 all Agreed 2026-09-24; paraphrase, not user quotes):

- F18-Q1 — THE LAYERED SHAPE: (1) a slim STATUSLINE PRESENCE always-on (open count + the next ready issue — the cheap always-there surface) + (2) an ON-DEMAND FULL BOARD (a command or quick-context render: open/ready/blocked lists). The PANEL/TAB is the TARGET form (the sidebar the user wants), gated on the TUI feasibility prototype (the wave-3 verdict: plausible but NOT proven — "likely a separate TUI tab/panel, not a simple sidebar widget"); if the prototype fails, the fallback is statusline + rendered board, DISCLOSED — never a silent downgrade. (Normative: F18-VT-01/08.)
- F18-Q2 — BOARD CONTENTS (lean v1): the board mirror (the TGO panel analog) — open/ready/blocked lists (id, title, status, assignee, priority), the CURRENT TASK highlighted + its progress-file path, and expandable DEPENDENCY CHAINS (issue → deps). Nothing more in v1 (no charts, no history views). (Normative: F18-VT-02.)
- F18-Q3 — READ-ONLY V1: observability only (the desire is to SEE, not to act). User actions (claim/close/defer through the panel) are a FUTURE extension under the F4-Q3 direct-path rules (the user's manual tracker authority). The SEATS never get a mutation path — the F4 Dispatcher-typed-tools-only rule stands. (Normative: F18-VT-03/04.)
- F18-Q4 — UPDATE CADENCE: refresh-on-session-events (the Pi hooks that exist: session_start, tool_call/tool_result after a bd mutation, and the other documented hooks) + a MANUAL refresh always available (the command/quick-context surface). A change landing outside a session event waits for manual or the next event (staleness shown); a true tracker-change push is a named v2 item. (Normative: F18-VT-05.)
- F18-Q5 — THE HONEST EVENT BASELINE (Agreed 2026-09-24): v1 recast to the implementable surface above (fixes the event-refresh overpromise); the no-polling rule governs v1 only. (Normative: F18-VT-05.)
- F18-Q6 — THE NEXT-READY SELECTION RULE (Agreed 2026-09-24): the statusline's next ready issue follows bd's native ready order (priority + dependency-aware — the `bd ready` sequence) with a disclosed age tie-break; the statusline always matches the board's ready list. (Normative: F18-VT-01.)

Band record (CONCERNS 2/3, 2026-09-24): cobain + grohl CONCERNS; novoselic NEEDS REVISION with the one-line dissent ("escalates on the strength of BAND-1/4"). Findings F18-BAND-1 (event-refresh overpromise) / F18-BAND-2 (next-ready selection rule) / F18-BAND-3 (unbounded dep expansion) / F18-BAND-4 (retry cap unverifiable) / F18-BAND-5 (visibility-probe gap), plus the missed considerations (staleness indicator / VT-07 zero scenarios / empty-vs-unreadable / retry-vs-manual / the statusline trigger set) — all corrected by clause above; no new requirement rows.

Scope clarity: this spec is a documentation-lane draft (the per-feature flow); it has run band review (CONCERNS 2/3 → corrections applied 2026-09-24) and awaits Horowitz re-check + user approval.

User notes / delta: F18 adds a feature spec without moving any prior decision: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8, F17-Q1–F17-Q5 all stand; this spec cross-references, never re-decides. F18-Q1..Q6 + band corrections applied 2026-09-24; awaiting Horowitz re-check + user approval.

Provenance (tgo-im6j wave-3 Pi TUI surface verdict + TGO BeadsPanel analog + error-state lesson + F4 authority rule + user's sidebar desire):

- oh-my-opencode-slim wave-3 Pi TUI surface verdict (tgo-im6j): statusline + quick-context addons + custom message-type views + interactive widgets/commands, no native sidebar; a sidebar-class view is plausible but NOT proven until a Pi TUI prototype exists (likely a separate TUI tab/panel, not a simple sidebar widget) — provenance only, no values imported.
- TGO BeadsPanel analog: the open/ready/blocked board shape behind F18-VT-02 — provenance only, no values imported.
- TGO error-state lesson (memory #18 / tgo-hv6): the BeadsPanel's render-nothing visibility bug plus its fix — behind the explicit-error-state plus bounded-backoff rule (F18-VT-09); composed, never re-decided.
- F4 authority rule: the F4-Q3 direct path (user's manual tracker authority) plus Dispatcher-typed-tools-only — composed, never re-decided.
- The user's sidebar desire: see open issues in the sidebar without asking the agent — recorded as the placement goal (F18-VT-01/07), not a product-UI feature.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1–F17 digests and the F18 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame cross-referenced here (no re-decision here).
- `../MANIFEST.md` — runtime dependencies cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; prototype, mechanics, format, command-name, and enforcement gaps stay open there.
- `README.md` — Stage B index; this is feature 18 of 18, drafted awaiting review.
