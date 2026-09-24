# Feature areas — Stage B index (eighteen user-approved (F1–F18) + the primary spec drafted (the integration layer; awaiting band + user approval); 18/18 feature specs approved and closed; 0 stubs; runtime unverified; scenarios FUTURE)

Status: Feature 1 approved and closed (tgo-dsjc) with requirements F1-AR-01 … F1-AR-14 (14 requirements, 24 FUTURE scenarios, not executed). Feature 2 user-approved and closed (tgo-929c) with its spec (`permissions.md`, second Stage B spec, no implementation, 13 requirements, 22 FUTURE scenarios, not executed); AFT compatibility addendum (F2-PE-13 + P-REPL-19 … P-REG-22) independently reviewed; implementation unverified. Feature 3 SDD/drift user-approved (`sdd-workflow.md`, third Stage B spec, no implementation, 12 requirements, 19 FUTURE scenarios, not executed; F3Q1–F3Q6 settled, including section 2.5 applicability rule, independently reviewed, implementation unverified). Feature 4 Beads integration user-approved (`beads-integration.md`, no implementation, 12 requirements F4-BI-01 … F4-BI-12, 19 FUTURE scenarios, not executed; F4Q1–F4Q6 settled, independently reviewed, implementation unverified). Feature 5 delegated sessions user-approved 2026-09-21 (`delegated-sessions.md`, fifth Stage B spec, no implementation, 12 requirements F5-DS-01 … F5-DS-12, 20 FUTURE scenarios, not executed; F5Q1–F5Q5 settled, band-review amendment batch user-approved 2026-09-21, Horowitz READY, user approved; issue closed tgo-0l7p). Feature 6 user-approved 2026-09-21 (`platform-distribution.md`, sixth Stage B spec, no implementation, F6-PD-01 … F6-PD-12, 12 requirements, 18 FUTURE scenarios, not executed; F6Q1–F6Q7 settled, F6Q2 USER OVERRIDE of notify-only; user-approved 2026-09-21 (Horowitz READY, band-reviewed CONCERNS→corrected, re-check READY, BQ7/BQ8 resolved); runtime unverified; scenarios FUTURE, issue closed tgo-r7ve). Feature 7 models/presets user-approved 2026-09-21 (`models-presets.md`, seventh Stage B spec, no implementation, 12 requirements, 18 FUTURE scenarios (P7-01…P7-18), not executed; F7Q1–F7Q5 settled; user-approved 2026-09-21 (final: Expert Go backup = Qwen 3.8 Flash restored per user cost correction; Kimi-K3 disqualified on cost); runtime unverified; scenarios FUTURE, issue closed tgo-5opj). F12 working context user-approved 2026-09-23 (tgo-ylvc, closed-pending-issuance); F13 validation harness user-approved 2026-09-23 as corrected (`validation-harness.md`, F13-Q1..Q7 settled (F13-Q1 USER OVERRIDE: both CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break; band-review corrections applied CONCERNS 2/3 → 7 fixes + refinement → re-check READY); F13-VH-01 … F13-VH-12, 12 requirements, 18 FUTURE scenarios, not executed; issue tgo-k3dj closed); 0 stubs remain; 17/18 specs approved and closed (F18 drafted, awaiting review); PRIMARY SPEC DEFERRED pending user notes. Each area below gets one spec file in Stage B. User-approved with 2026-09-21 band-review amendment batch (Horowitz READY, user approved).
Active seats are the Product Dispatch seats (Dispatcher, Writer, Seeker,
Expert).

1. platform/distribution — Pi package shape, git-tag install, pinned refs,
   drift warn-only, Node and per-OS prerequisites. Spec: `platform-distribution.md`
   (user-approved sixth 2026-09-21 (Horowitz READY, band-reviewed CONCERNS→corrected, re-check READY, BQ7/BQ8 resolved); runtime unverified; scenarios FUTURE, implementation unverified; F6-PD-01 … F6-PD-12;
   12 requirements, 18 FUTURE scenarios, not executed; F6Q1–F6Q7 settled, F6Q2 USER OVERRIDE).
2. models/presets — per-seat fixed assignment, SKU pins, named backup,
   never-silent substitution rule. Spec: `models-presets.md`
    (user-approved seventh 2026-09-21 (final: Expert Go backup = Qwen 3.8 Flash restored per user cost correction; Kimi-K3 disqualified on cost); runtime unverified; scenarios FUTURE;
    F7-MP-01 … F7-MP-12; 12 requirements, 18 FUTURE scenarios, not executed;
   F7Q1–F7Q5 settled; issue closed tgo-5opj).
3. roster/seats — Product Dispatch seats (Dispatcher, Writer, Seeker,
Expert): merged former planner and researcher roles, independent Expert
review plus consultation, per-seat tool ceilings. Spec: `agent-roles.md`
(approved and closed tgo-dsjc; F1-AR-01 … F1-AR-14; 14 requirements, 24 FUTURE scenarios).
4. permissions/enforcement — one layer with four per-seat policies, global
deny floor, ask and deny rules, Windows degraded banner. Spec: `permissions.md`
(drafted second, user-approved, closed tgo-929c; F2-PE-01 … F2-PE-13; AFT addendum independently reviewed, implementation unverified; all scenarios FUTURE, not executed).
5. SDD/drift — repo-file spec store, hash pointers, approval gate,
   per-task acceptance gates, deviation alerts, repair budget. Spec: `sdd-workflow.md`
   (approved third, user-approved, independently reviewed, implementation unverified; F3-SD-01 … F3-SD-12;
   12 requirements, 19 FUTURE scenarios, not executed).
6. prose/skills — seat skill map, lean prompt budgets, retrieval-led
   reasoning, prose-driven operation. Spec: `prose-skills.md`
   (user-approved eighth 2026-09-21 (band-reviewed, corrected, re-check READY); F8Q1–F8Q6 settled except deferred F8-Q4, F8-PS-01 … F8-PS-13,
    13 requirements, 19 FUTURE scenarios, not executed; runtime unverified; scenarios FUTURE; issue closed tgo-6h5i).
7. bootstrap/init — additive no-clobber init, needsSetup signals, ordering,
   kill switches, always-trust scope. Spec: `bootstrap-init.md`
(ninth; user-approved 2026-09-22 (band-reviewed NEEDS REVISION → 10 corrections → re-check READY); runtime unverified; scenarios FUTURE; F9Q1–F9Q9 settled (F9Q1–F9Q6 2026-09-21, F9Q7–F9Q9 2026-09-22), F9-BS-01 … F9-BS-14,
      14 requirements, 26 FUTURE scenarios, not executed;
      issue closed tgo-geh3).
8. Beads integration — verify-first lifecycle, Dispatcher-exclusive
   mutation via typed host tools, install-with-plugin, living-spec
   pointers, review loop wiring. Spec: `beads-integration.md`
   (user-approved fourth, independently reviewed, implementation unverified; F4-BI-01 … F4-BI-12;
   12 requirements, 19 FUTURE scenarios, not executed; F4Q1–F4Q6 settled).
9. web/docs/MCP retrieval — hybrid chain (donsetch pinned external
   dependency plus thin policy adapter), per-seat MCP gating, zero-paid
   default, gap disclosure, fallback order. Spec: `web-mcp-retrieval.md`
    (user-approved tenth 2026-09-22 (F10-Q1–F10-Q10 Agreed 2026-09-22; band CONCERNS → 12 corrections → re-check READY); runtime unverified; scenarios FUTURE; F10-WR-01 … F10-WR-14,
   14 requirements, 31 FUTURE scenarios, not executed; issue tgo-ddlm).
10. durable memory — dual-vault file record, once-per-build probe comparison
    (none selected, none promised), staged admission, supersede rule,
    user-gated deletion, wiki compile, scope tags. Spec: `durable-memory.md`
    (user-approved eleventh 2026-09-22 (F11-Q1–Q6 + F11-Q7–Q10 Agreed 2026-09-22; band CONCERNS 2/3 → 17 fixes → re-check READY); runtime unverified; scenarios FUTURE; F11-DM-01 … F11-DM-12,
    12 requirements, 22 FUTURE scenarios, not executed; issue tgo-gc3n).
11. working context — hybrid compressor ownership (native working set plus
     Magic Context archive/retrieval; SINGLE owner, never dual-compress),
     probed implementation path with recorded selection gate, Seeker-tier
     archiver with cost/rate bounds, 3-item re-injection inside the F8-Q7
     prompt-core budget (F12-Q7 refinement), no-implicit-promotion boundary, per-seat ctx_* surfaces,
     zero-sidecar print/headless. Spec: `working-context.md`
     (user-approved 2026-09-23 (F12-Q1–Q9 Agreed 2026-09-22; band CONCERNS 2/3 → 11 fixes + WC-09 → re-check READY);
     runtime unverified; scenarios FUTURE; F12-WC-01 … F12-WC-09,
     9 requirements, 30 FUTURE scenarios, not executed; issue tgo-ylvc, closed-pending-issuance).
12. delegated sessions — role-sensitive reuse, resumable bar, resume gates,
   completed-session rule, crash recovery. Spec: `delegated-sessions.md`
   (user-approved fifth 2026-09-21, independently reviewed, band-review amendment batch user-approved 2026-09-21, Horowitz READY, user approved, implementation unverified; F5-DS-01 … F5-DS-12;
   12 requirements, 20 FUTURE scenarios, not executed; F5Q1–F5Q5 settled).
13. validation harness — S-suite S1–S11 (S9a/b/c), BOTH-OS CI green in v1
    (F13-Q1 USER OVERRIDE), requirement-complete coverage, pilot entry/exit
    gates, record-only counters, rollback/re-entry. Spec: `validation-harness.md`
    (user-approved 2026-09-23 as corrected (F13-Q1..Q7 settled
    2026-09-23 (F13-Q1 USER OVERRIDE: both CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break); band-review corrections applied CONCERNS 2/3 → 7 fixes + refinement → re-check READY; runtime unverified;
    scenarios FUTURE; F13-VH-01 … F13-VH-12, 12 requirements, 18 FUTURE scenarios,
     not executed; issue tgo-k3dj closed; 17/18 feature specs approved and closed (F18 drafted, awaiting review); PRIMARY SPEC DEFERRED pending user notes; 0 stubs).
14. writing style — always-on style layer for ALL agent-authored prose (chat output, docs, comments, commit messages): shared 8-rule core sandwiched top+bottom in the F12-Q3 re-injection set, per-seat thin overlays, detective-first deterministic lint with promotion ladder, review-gate cold read. Spec: `writing-style.md`
      (drafted 2026-09-23, corrections applied 2026-09-23 (STYLE-Q1..Q10 Agreed 2026-09-23); USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); runtime unverified; scenarios FUTURE; F14-WS-01 … F14-WS-09,
      9 requirements, 12 FUTURE scenarios, not executed; issue tgo-7ipx closed).
15. retrieval discipline — drive layer over the F10 retrieval stack: claim trigger scope, procedure/claim split, four-layer enforcement mirroring F14, disclose-or-drop failure behavior, surface priming. Spec: `retrieval-discipline.md`
      (drafted 2026-09-23 (RD-Q1..Q4 + band corrections applied 2026-09-23); USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); runtime unverified; scenarios FUTURE; F15-RD-01 … F15-RD-09,
      9 requirements, 15 FUTURE scenarios, not executed; issue tgo-lyxh closed).
16. review council — three tool-less lenses (risk, quality, structure) convened at designated reviews and on demand: 2/3 majority composite verdict binds designated reviews, Dispatcher packages and synthesizes, no fifth seat, inside F1 budgets and ceilings, approvals never bypassed. Spec: `review-council.md`
      (drafted 2026-09-24 (F16-Q1..Q8 + band corrections applied 2026-09-24); USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); runtime unverified; scenarios FUTURE; F16-RC-01 … F16-RC-12,
      12 requirements, 23 FUTURE scenarios, not executed; issue tgo-dx5t closed).
17. vision lane — the eyes seat (judgment seat when multimodal, Seeker designated otherwise, Writer self-description refused), vision-capable pins, direct-read vs bounded-consult flow, description-as-evidence (both paths stamped, image-surfaced text evidence-only), classes and no-scope boundaries, budget accounting (vision retry consumes one F5-Q2 attempt), park-with-disclosure failure semantics, runtime seat availability, epistemic standing + challenge path. Spec: `vision-lane.md`
      (drafted 2026-09-24 (F17-Q1..Q5 all Agreed 2026-09-24; band CONCERNS 2/3 → corrections BR-01..05 applied 2026-09-24); awaiting Horowitz re-check + user approval; runtime unverified; scenarios FUTURE; F17-VL-01 … F17-VL-11,
      11 requirements, 22 FUTURE scenarios, not executed; USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); issue tgo-di7d closed).
18. visual tracker — layered shape (slim statusline presence + on-demand full board; panel/tab target gated on the TUI feasibility prototype with disclosed fallback), lean v1 contents (open/ready/blocked lists with id/title/status/assignee/priority, current task + progress-file path, expandable dep chains), read-only v1 (no user or seat mutation; F4 rules stand), event-driven + manual refresh on the current-project store. Spec: `visual-tracker.md`
      (drafted 2026-09-24 (F18-Q1..Q6 + band corrections applied 2026-09-24); awaiting Horowitz re-check + user approval; runtime unverified; scenarios FUTURE; F18-VT-01 … F18-VT-10,
      10 requirements, 22 FUTURE scenarios, not executed; issue tgo-nf8p open; F18 drafted, awaiting re-check).

Sources: `../DECISIONS.md` Q numbers and F1–F14 digests + RD digest + F16 digest + F17 digest + F18 digest plus `../EVIDENCE.md` citation table.
Stub entries add no new content; `agent-roles.md` is approved and closed, `permissions.md` is user-approved and closed (tgo-929c) with AFT addendum independently reviewed, implementation unverified, `sdd-workflow.md` is user-approved, independently reviewed, implementation unverified, `beads-integration.md` is user-approved fourth, independently reviewed, implementation unverified, `delegated-sessions.md` is user-approved fifth 2026-09-21, independently reviewed (band-review amendment batch user-approved 2026-09-21, Horowitz READY, user approved; implementation unverified; issue closed tgo-0l7p), `platform-distribution.md` is user-approved sixth 2026-09-21 (Horowitz READY, band-reviewed CONCERNS→corrected, re-check READY, BQ7/BQ8 resolved); runtime unverified; scenarios FUTURE (F6Q1–F6Q7 settled, F6Q2 USER OVERRIDE; implementation unverified; issue closed tgo-r7ve), `models-presets.md` is user-approved seventh 2026-09-21 (F7Q1–F7Q5 settled, F7-MP-01 … F7-MP-12; implementation unverified; issue closed tgo-5opj), `prose-skills.md` is user-approved eighth 2026-09-21 (F8-PS-01 … F8-PS-13; user-approved 2026-09-21 (band-reviewed, corrected, re-check READY); issue closed tgo-6h5i); `bootstrap-init.md` is user-approved ninth 2026-09-22 (F9-BS-01 … F9-BS-14; band-reviewed NEEDS REVISION → 10 corrections → re-check READY; issue closed tgo-geh3); `web-mcp-retrieval.md` is user-approved tenth 2026-09-22 (band CONCERNS → 12 corrections → re-check READY; F10-WR-01 … F10-WR-14; issue tgo-ddlm); `durable-memory.md` is user-approved eleventh 2026-09-22 (F11-Q1–Q6 + F11-Q7–Q10 Agreed 2026-09-22; band CONCERNS 2/3 → 17 fixes → re-check READY; F11-DM-01 … F11-DM-12; issue tgo-gc3n); F12 working context user-approved 2026-09-23 (tgo-ylvc, closed-pending-issuance); F13 validation harness user-approved 2026-09-23 (`validation-harness.md`, user-approved as corrected; F13-Q1..Q7 settled, F13-Q1 USER OVERRIDE: both CI lanes in v1; Q6 rollback user-initiated + permission-layer revocation; Q7 bounded retry no tie-break; band-review corrections applied CONCERNS 2/3 → 7 fixes + refinement → re-check READY; F13-VH-01 … F13-VH-12, 12 requirements, 18 FUTURE scenarios, not executed; issue tgo-k3dj closed); F14 writing style user-approved (`writing-style.md`, STYLE-Q1..Q10 Agreed 2026-09-23, F14-WS-01 … F14-WS-09, 9 requirements, 12 FUTURE scenarios, not executed; issue tgo-7ipx closed); F15 retrieval discipline user-approved (`retrieval-discipline.md`, RD-Q1..Q4 Agreed 2026-09-23, F15-RD-01 … F15-RD-09, 9 requirements, 15 FUTURE scenarios, not executed; issue tgo-lyxh closed); F16 review council user-approved (`review-council.md`, F16-Q1..Q8 + band corrections applied 2026-09-24, F16-RC-01 … F16-RC-12, 12 requirements, 23 FUTURE scenarios, not executed; issue tgo-dx5t closed); F17 vision lane user-approved (`vision-lane.md`, F17-Q1..Q5 + band corrections applied 2026-09-24, F17-VL-01 … F17-VL-11, 11 requirements, 22 FUTURE scenarios, not executed; issue tgo-di7d closed; F17 user-approved); 0 stubs remain; 17/18 specs approved and closed (F18 drafted, awaiting review).
