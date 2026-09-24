# Dispatch planning — handoff (2026-09-23)

## What this is

Dispatch = Pi successor plugin for the Pi coding agent (@earendil-works/pi-coding-agent). Four seats: Dispatcher (orchestrator-planner), Writer (implementer), Seeker (researcher-documenter), Expert (reviewer + complex-problem escalation). Personal work tool; Windows+macOS required; planning phase only — no installs, no implementation, no runtime configuration. The product will ultimately live in a SEPARATE repository from TGO (extraction pending user authorization; this package is self-contained and portable).

## Decision state (all user-approved; see DECISIONS.md for the full record)

- Q1–Q51 epic decisions: all approved 2026-09-17 (recorded in DECISIONS.md with sources).
- F1 agent roles (issue tgo-dsjc closed): F1-AR-01..14, 24 FUTURE scenarios. Parallel Writers/Seekers v1; 3W/3S/2E per project + machine-wide 8; Expert read-only authority, one verdict per case+revision; delegation envelope F1-AR-13/14.
- F2 permissions (tgo-929c closed): F2-PE-01..13, 22 FUTURE scenarios. Fixed authority vs user-configurable policy split; user-instructed permission changes honored; AFT compatibility addendum (capability/op/argument validation). Grant persistence lifetime/store OPEN.
- F3 SDD workflow (tgo-0sqg closed): F3-SD-01..12, 19 FUTURE scenarios; section 2.5 editorial-revision applicability rule user-approved.
- F4 Beads integration (tgo-0joe closed): F4-BI-01..12, 19 FUTURE scenarios. Outage bounded-unit exception; reconcile-before-retry; tracker state ≠ approval/evidence/completion.
- F5 delegated sessions user-approved 2026-09-21 (issue tgo-0l7p closed): F5-DS-01..12, 20 FUTURE scenarios; independently reviewed READY (Horowitz READY, user approved); band-review amendment batch approved 2026-09-21, BQ1–BQ6 recorded in DECISIONS.md.
- F6 platform/distribution user-approved 2026-09-21 (issue tgo-r7ve closed): F6-PD-01..12, 18 FUTURE scenarios; F6Q2 USER OVERRIDE (v1 self-update); BQ7/BQ8 resolved.
- F7 models/presets user-approved 2026-09-21 (issue tgo-5opj closed): F7-MP-01..12, 18 FUTURE scenarios (final: Expert Go backup = Qwen 3.8 Flash restored per user cost correction; Kimi-K3 disqualified on cost).
- F8 prose/skills user-approved 2026-09-21 (issue tgo-6h5i closed): F8-PS-01..13, 19 FUTURE scenarios; F8Q1–F8Q6 settled except deferred F8-Q4 (band-reviewed, corrected, re-check READY).
- F9 bootstrap/init user-approved 2026-09-22 (issue tgo-geh3 closed): F9-BS-01..14, 26 FUTURE scenarios; F9Q1–F9Q9 settled (F9Q1–F9Q6 2026-09-21, F9Q7–F9Q9 2026-09-22); band-reviewed NEEDS REVISION → 10 corrections → re-check READY.
- F10 web/docs/MCP retrieval user-approved 2026-09-22 (issue tgo-ddlm closed): F10-WR-01..14, 31 FUTURE scenarios (P10-01…31); F10-Q1–F10-Q10 Agreed 2026-09-22 (Q1 confirmed after the mailroom-adapter explanation); band CONCERNS → 12 corrections → re-check READY → user-approved 2026-09-22. Every spec runs the Nirvana band stage (tool-less lenses get content inline).
- F11 durable memory user-approved 2026-09-22 (issue tgo-gc3n, closed-pending): F11-DM-01..12, 22 FUTURE scenarios (P11-01…22); F11-Q1–F11-Q10 Agreed 2026-09-22; band CONCERNS 2/3 → 17 fixes → re-check READY; runtime unverified; scenarios FUTURE.
- F12 working context user-approved 2026-09-23 as corrected (issue tgo-ylvc, closed-pending-issuance): F12-WC-01..09, 30 FUTURE scenarios (WC-01…30); F12-Q1–Q9 Agreed 2026-09-22; band CONCERNS 2/3 → 11 fixes + WC-09 → re-check READY; runtime unverified; scenarios FUTURE.
- F13 validation harness user-approved 2026-09-23 as corrected (issue tgo-k3dj closed): F13-VH-01..12, 18 FUTURE scenarios (P13-01…18); F13-Q1–Q7 settled 2026-09-23 (F13-Q1 USER OVERRIDE: both Windows and macOS CI lanes ship IN v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break); band-review corrections applied (CONCERNS 2/3 → 7 fixes + refinement → re-check READY); runtime unverified; scenarios FUTURE.
- F14 writing style USER-APPROVED (closed on tracker tgo-7ipx; dated Q records in DECISIONS.md): F14-WS-01..09, 12 FUTURE scenarios (WS-01…12); STYLE-Q1..Q10 Agreed 2026-09-23; runtime unverified; scenarios FUTURE.
- F15 retrieval discipline USER-APPROVED (closed on tracker tgo-lyxh; dated Q records in DECISIONS.md): F15-RD-01..09, 15 FUTURE scenarios (RD-01…15); RD-Q1..Q4 + band corrections applied 2026-09-23; runtime unverified; scenarios FUTURE.
- F16 review council USER-APPROVED (closed on tracker tgo-dx5t; dated Q records in DECISIONS.md): F16-RC-01..12, 23 FUTURE scenarios (RC-01…23); F16-Q1..Q5 Agreed 2026-09-23; F16-Q6..Q8 Agreed 2026-09-24; three tool-less lenses (risk/quality/structure), 2/3 composite verdict binds designated reviews, Dispatcher synthesizes, no fifth seat; one additive F1-AR-11 clarification (provenance-stamped F16-Q2); runtime unverified; scenarios FUTURE.
- F17 vision lane USER-APPROVED (closed on tracker tgo-di7d; dated Q records in DECISIONS.md): F17-VL-01..11, 22 FUTURE scenarios (VL-01…22); F17-Q1..Q5 + band corrections applied 2026-09-24; runtime unverified; scenarios FUTURE.
- F18 visual tracker USER-APPROVED and closed 2026-09-24 (issue tgo-nf8p closed): F18-VT-01..10, 22 FUTURE scenarios (VT-01…22); F18-Q1..Q6 + band corrections applied 2026-09-24; Horowitz re-check + user approval complete; runtime unverified; scenarios FUTURE.
- Primary spec drafted 2026-09-24, band corrections applied 2026-09-24 (issue tgo-f9fy in progress): `PRIMARY-SPEC.md` integrates F1–F18 (invariants PS-INV, seams PS-SEAM-01..16, acceptance matrix, gates PS-GATE, build order, open items, v1 release gate) — zero decision changes; awaiting Horowitz re-check + user approval.

## Remaining work (0 stubs; 18/18 feature specs approved and closed; primary spec drafted tgo-f9fy, band corrections applied 2026-09-24, awaiting Horowitz re-check + user approval)

F10 web/docs/MCP retrieval user-approved 2026-09-22 (`web-mcp-retrieval.md`); F11 durable memory user-approved 2026-09-22 (`durable-memory.md`, tgo-gc3n closed-pending). F12 working context user-approved 2026-09-23 as corrected (`working-context.md`, tgo-ylvc closed-pending-issuance; Q28 hybrid — Magic Context archive-only requires custom adaptation, unverified; both implementation paths UNVERIFIED, probe decides) and F13 validation harness user-approved 2026-09-23 as corrected (`validation-harness.md`, F13-Q1..Q7 settled, F13-Q1 USER OVERRIDE: both CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break; band-review corrections applied CONCERNS 2/3 → 7 fixes + refinement → re-check READY; issue tgo-k3dj closed): 0 stubs remain; 18/18 specs approved and closed (@marcfargas/pi-test-harness 0.6.1 pin). F1–F18 user-approved and closed (tgo-nf8p closed); the PRIMARY SPEC is drafted (tgo-f9fy in progress). Planning COMPLETE 2026-09-24 (18 features + primary spec user-approved). Next: the build's Slice 1 (the plugin skeleton + the four seat configs + the F8 prompt assembly + the F2 permission gate) in this repo.

## Process contract

Per-feature mini-projects: audit settled-vs-open → grilling round with recommendations → user answers → Dylan draft → Horowitz independent review → corrections → user approval → close issue. Then user notes arrive → triage (new feature mini-projects / existing-spec amendments / PRD-level scope notes) → any new specs through the same pipeline (audit → grill → draft → Horowitz → band → corrections → approval) → THEN the primary spec integrates all features; then compatibility experiments (Pi install) after user approval; implementation only after that. Beads is the sole tracker; issues live in the TGO repo's tracker (tgo-* IDs). Nothing installs or runs until the user explicitly approves; all acceptance scenarios are FUTURE.

## Explicitly unresolved (do not assume)

Pi extension picks (subagents/permissions/test harness) pinned at spec phase; AFT dependency undecided (runtime interception unverified); 11 licenses pending LICENSE-file verification; Magic Context archive-only compatibility; runtime probe list in EVIDENCE.md; grant persistence lifetime/store; retention values; exact Seeker shell allowlist.

## Separate concern

tgo-nyo5 (Bernstein manual model reset in active session) open and unrelated to planning; user preference: no background delegations while it is unresolved.

## Repo layout

~/opencode/dispatch/docs/ (extracted from the tgo repo 2026-09-28): README.md (reading order), PRD.md, DECISIONS.md, MANIFEST.md, EVIDENCE.md, PRIMARY-SPEC.md (integration across F1–F18, drafted), PIN-RECORD.md (Phase-1 candidate-pin record plus Phase-2 build-experiment records; Phase 2 records complete; Phase 3 planning next), features/ (18 specs, all user-approved and closed (F1–F18) + README), HANDOFF.md (this file). .tgo/tgo-*/progress.md are per-issue progress files (gitignored, local-only). Epic tgo-x7yn open.

## Recovery instructions for the next agent

1. Read docs/pi-successor/README.md reading order, then PRIMARY-SPEC.md (drafted 2026-09-24, integration across F1–F18; tgo-f9fy in progress), then features/validation-harness.md (user-approved 2026-09-23 as corrected; F13-Q1..Q7 settled 2026-09-23, F13-Q1 USER OVERRIDE).
2. Check the board (bd ready; issues tgo-ylvc, tgo-x7yn, tgo-nyo5).
3. Resume the per-feature flow exactly as contracted above; never re-ask settled decisions; never claim a FUTURE scenario was executed.
