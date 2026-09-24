# Dispatch PRIMARY SPEC — integration across F1–F18

Status: draft 2026-09-24, band corrections applied 2026-09-24 (issue tgo-f9fy, in progress; awaiting Horowitz re-check + user approval). Integration only: this document INTEGRATES and cross-references the eighteen user-approved feature specs, never re-decides. All scenarios FUTURE, not executed. No implementation. No installs. No code. No commits or pushes.

## 0. Status + objective

This is the integration layer across all eighteen approved feature specs (F1–F18, all user-approved and closed 2026-09-21/24). Each feature spec owns its scope; where a feature rule and any earlier reading conflict inside that feature's scope, the feature governs (per-feature C1/C2 invariance chain, F1 through F18). This primary spec owns only what no single feature owns: the shared invariants (PS-INV), the cross-feature seams (PS-SEAM), the acceptance matrix, the compatibility-experiment gates (PS-GATE), the build order, the consolidated open items, and the v1 release gate.

Spec-only status: every block below is a spec requirement. Enforcement is UNVERIFIED until the probes decide (PS-GATE list, section 5). No claim is made that Pi hooks, models, extensions, or adapters already enforce anything here.

Verification chain per feature (unchanged): draft → Horowitz independent review → band review → corrections → re-check → user approval → issue close.

## 1. THE PRODUCT FRAME (batteries-included scope note)

This section is mirrored additively into `PRD.md` (one scope-note paragraph, provenance-stamped "user notes batch 2026-09-23"; the four verbatim user comments in PRD section 7 stay untouched).

Dispatch is batteries-included: a fresh Pi install plus Dispatch plus its auto-installed dependencies (bd, donsetch, AFT, Magic Context, the harness) equals a fully functional harness — the user's stated goal. Explicit no-scope carries forward: no UI/UX product features (the F18 tracker is harness observability, not product UI), no language-specific features, no security-specific features, and no browser automation (named no-scope — the F10 web stack is retrieval-first).

## 2. SHARED INVARIANTS

| ID | Invariant | Binding rule |
|---|---|---|
| PS-INV-01 | Never-silent (disclosure over assumption, everywhere) | Every state-changing, coverage-changing, or authority-changing outcome discloses (Q6; F2-PE-04/06; F7-MP-06; F10-WR-08; F15-RD-07). Silence blocks. |
| PS-INV-02 | Fail-closed defaults (missing/ambiguous policy denies and parks) | Ambiguous or missing policy denies the affected action, logs, and parks the affected branch while independent work proceeds; malformed config fails closed with a repair path (F2-PE-02; F3-SD-04; F10-WR-08 fail-closed tiebreak). |
| PS-INV-03 | User-approval supremacy (Q15/Q20/F3 gates — the council NEVER approves) | One combined requirements-plus-execution-plan approval after Expert coverage (F3-SD-01); synthetic suite then supervised pilot (Q20); the F16 council's majority verdict binds designated reviews but never approves, never waives, never bypasses the Q15/Q20/F3 gates (F16-RC-02). |
| PS-INV-04 | Spec-only status | Every block in every spec is a spec requirement; enforcement is unverified until probes decide (per-feature spec-only clauses F6-PD-12 … F18-VT-10). |
| PS-INV-05 | One budget ledger | F1's per-task budgets (initial review + at most two repair/re-review cycles) + the ONE shared integration budget (initial + at most two across newly introduced integration findings; neither resets; exhausted task failures never repaired inside the integration budget — F1-AR-12) + the F1-Q11 machine-wide global-8 ceiling (F1-AR-10) + the F8-Q7 prompt-core budget (≤500 target / 1000 hard cap binding seat instructions + thin always-on layer + the F12-Q3 three-item re-injection set — F12-Q7 refinement; the F14 style core rides sandwiched top+bottom with TOP-copy-in-authored / BOTTOM-copy-in-exposure accounting; the F15 claim rule rides ONCE with one home — the F8-Q7 prompt core, inside the F12-Q3 re-injection set) + the disclosed exposure budget (skill bodies, tool schemas, injected policy, handoff material, the F14 BOTTOM-copy-in-exposure — F8-PS-09). Task-vs-review charging split stated explicitly: the eyes consult bills TASK budgets + the F1-Q11 global-8, NEVER the F1 review repair-cycle budgets (the closed-loop "consumes no review budget" means the repair cycles specifically). The F14 sandwich's two-copy accounting exists to measure the AGGREGATE prompt footprint across the authored and exposure layers (the aggregate = the disclosed exposure figure). Closed-loop rules (F13 section 8; F14/F15/F16/F17/F18 section 8): style, claim, council, eyes, and tracker work consume no review budget and reset none. |
| PS-INV-06 | FUTURE-scenario discipline | All acceptance scenarios are FUTURE, not executed; nothing installs or runs until the user explicitly approves (per-feature section 4 headers). |
| PS-INV-07 | ID stability and additive-only amendments | Requirement and scenario IDs are stable; corrections land as clauses or additive sub-IDs only (F3-SD-03a/04a pattern); the single authorized cross-feature amendment is the F16-Q2 F1-AR-11 review-authority clarification, provenance-stamped in `agent-roles.md`. |
| PS-INV-08 | No invented values (section-7 pins stay open) | No SKUs, thresholds, token counts, formats, or dimensions beyond what the specs record; every section-7 pin stays open until its probe or build pin closes it. |
| PS-INV-09 | Decision-set roster (the full C2 list) | Q1–Q51; F1Q1–F1Q14; F2Q1–F2Q6; F3Q1–F3Q6; F4Q1–F4Q6; F5Q1–F5Q5; BQ1–BQ8; F6Q1–F6Q7; F7Q1–F7Q5; F8Q1–F8Q6 (plus agreed F8-Q7/Q8/Q9; F8-Q4 deferred); F9Q1–F9Q9; F10-Q1–F10-Q10; F11-Q1–F11-Q10; F12-Q1–F12-Q9; F13-Q1–F13-Q7; STYLE-Q1–STYLE-Q10; RD-Q1–RD-Q4; F16-Q1–F16-Q8; F17-Q1–F17-Q5; F18-Q1–F18-Q6. Recorded in `DECISIONS.md` with dated Q records; this roster is referenced here, never re-decided. |

## 3. CROSS-FEATURE SEAMS

| ID | Seam | Features | Binding rule | Conflict resolution |
|---|---|---|---|---|
| PS-SEAM-01 | Review-authority verdict | F1↔F16 | One authoritative review-authority verdict per case + artifact revision: Expert solo, or council composite for designated reviews (F1-AR-11 as clarified by F16-Q2). | F16 governs designated reviews; F1 governs all else; user arbitrates past budget or early trigger (F1-AR-04). This precedence rule RESTATES the single authorized cross-feature amendment (F1-AR-11 as clarified by F16-Q2); it is not a second amendment — PS-INV-07's one-amendment count holds. |
| PS-SEAM-02 | Eyes consult + ceilings | F1↔F17 | A vision-blind Dispatcher routes a bounded Seeker consult ("observe and report"); the consult counts against task budgets and the F1-Q11 global-8 like any specialist invocation; the multimodal direct read consumes none (F17-VL-04/05). | Ceiling binds → queue, never drop (F16-RC-07 pattern; F1-AR-10). |
| PS-SEAM-03 | Tool-call enforcement + adapter gate | F2↔F10 | Permission follows verified capability + operation + arguments + resolved targets, never a trusted name (F2-PE-13); the F10 thin adapter runs permission-check → subprocess → evidence-stamp → fallback-routing per call (F10-WR-02/12). | Unknown mappings park the affected capability pending adapter verification, never a user waiver of fixed integrity (F2-PE-13). |
| PS-SEAM-04 | Plan-time criticality + cite-or-fetch at review | F3↔F15 | Acceptance-criticality is decided at plan time by the approved spec's acceptance criteria, never seat self-labels; uncovered demands fail closed as acceptance-critical (F10-WR-08; F15-RD-01/07). The Expert (solo; F16 council at designated reviews) cold-reads claim attribution at every review (F15-RD-05; F14-WS-08). | Uncertain coverage blocks the affected verdict (F3 section 2.5 applicability rule). |
| PS-SEAM-05 | Tracker surface vs typed-tools-only | F4↔F18 | The F18 panel is read-only v1: no user action and no seat mutation through the panel; the F4 Dispatcher-typed-tools-only rule stands unmoved (F18-VT-03/04). | Panel mutation attempts refused; the F4-Q3 prose path is the way (F18-VT-03). |
| PS-SEAM-06 | Rollover + task-scoped archive + re-injection | F5↔F12 | Planned rollover is a fresh dispatch with a validated envelope + recorded checkpoint, never the full transcript (F5-DS-07); the Writer's archive follows the TASK ID across rollover/reuse (F12-WC-05); the three-item re-injection set rides every turn inside the prompt-core budget (F12-WC-03). | Rollover resets no limit and conceals no non-progress; budgets persist and history travels (F5-DS-07). |
| PS-SEAM-07 | AGPL boundary + self-update staging | F6↔F10 | donsetch runs ONLY as a separate process (CLI or MCP, never linked); the written AGPL boundary review, user-signed, gates shipping and any shared build while pinned-artifact internal testing proceeds (F6-PD-08; F10-WR-11). Skills ship inside the plugin artifact and ride the F6-PD-04 staging-and-swap path (F8-PS-08). | Shipment without the signed review refused; library-linking refused (F6-PD-08). |
| PS-SEAM-08 | Lens models + vision flags at the build pin | F7↔F16/F17 | Lens models are provider-diverse cheap-to-mid models named at build via the F7 live picker (F16-RC-06); per-SKU vision flags are build-pin facts via the same picker, none asserted before the pin (F17-VL-03). | Pre-pin asserted SKUs refused as unpinned (F16 RC-14; F17 VL-07). |
| PS-SEAM-09 | Prompt-budget triple-bind | F8↔F14/F15 | The F8-Q7 prompt core holds the F14 style core (sandwiched, never trimmed, TOP-copy-in-authored / BOTTOM-copy-in-exposure) + the F15 claim rule (ONCE, one-home accounting) + the F12-Q3 re-injection set (never trimmed); skill bodies sit on the disclosed exposure budget (F12-Q7 refinement; F14-WS-01; F15-RD-03). | Joint hard-cap breach follows the deterministic F8-Q9 accounting procedure — trim order: non-required skill bodies first, then optional evidence; required-content joint overage = build refusal, then park/escalate; never silent trim. |
| PS-SEAM-10 | Bootstrap init + machine-vault lazy init | F9↔F11 | The F9 canonical four-step order (nested-guard/git-init → `.pi/settings.json` registration → bd init/setup/advice → AGENTS.md block) runs idempotent partial repair with user-edit-wins policy (F9-BS-03/04/10); the F11 machine vault lazily inits its own repo (F11 band record). | Missing/deleted plugin-owned surfaces disclose-and-ask, never silent re-add (F9-BS-10). |
| PS-SEAM-11 | Retrieval stack as claim drive + tool-ordering priming | F10↔F15 | Retrieval tools list FIRST in each seat's toolset order with a retrieval-required marker on fresh-fact categories (F10-WR-14; F15-RD-08); skill claim-bearing text meets the build check (F8-PS-13; F15-RD-02). | Unsourced claims disclose ("no source found") or drop, never assert silently (F15-RD-07). |
| PS-SEAM-12 | Memory/context boundary — no implicit promotion | F11↔F12 | Session archives are recall sources only; durable promotion happens ONLY through F11 staged admission (source link required) or user direct writes (F12-WC-04; F11-DM-08). No auto-deletion on either side: F11-DM-05 (memory) and F12-WC-09 (archives). | Archive→vault writes without F11 admission blocked (F12 P12-10). |
| PS-SEAM-13 | Acceptance matrix + pilot gates + signed strings | F13↔ALL | Requirement-complete coverage (section 4); pilot entry at one checkpoint (all-green both lanes + explicit user approval + verbatim sign-off) and pilot exit on user sign-off plus the objective floor (F13-VH-04/05); strings must match signed-off text at spec review AND pre-pilot gates (F13-VH-11). | Missing coverage, missing gate leg, or string mismatch blocks (F13-VH-02/04/11). |
| PS-SEAM-14 | Install-to-bootstrap handoff | F6↔F9 | The F6-PD-04/05 staging-and-swap may never blindly overwrite plugin-owned project surfaces (`.pi/settings.json` registration, the AGENTS.md blocks); any surface it refreshes follows the F9-Q8 / F9-BS-10 / F11-Q8 user-edit-wins + disclose-and-ask policy and re-runs F9's idempotent partial repair. | A user-edited surface is respected with divergence disclosed; a deleted block is disclose-and-ask, never silently re-added on update. |
| PS-SEAM-15 | Tokenizer pin | F7↔F8 | The F8-Q8 tokenizer/variant pin is a PS-GATE-08 output via the F7 live picker; the prompt-core cap's TOKEN UNIT = the pinned tokenizer; budget certification is REFUSED without the pin record. | An unpinned token unit refuses budget certification (F8-Q8 composition). |
| PS-SEAM-16 | Memory never carries authority | F2↔F11 | A durable memory write that would persist a permission elevation is REFUSED (the F1-AR-13 injection guard + the F2 config-authority-only-via-validated-mechanism rule apply to memory content); the F11-Q8 user-edit policy governs memory CONTENT, never permission grants. | Memory is evidence, never policy; an elevation recorded in memory is quarantined and disclosed. |

## 4. THE ACCEPTANCE MATRIX

REQUIREMENT-COMPLETE COVERAGE RULE (extends F13-VH-02 across all 18): every requirement ID F1-AR-01 … F18-VT-10 maps to ≥1 executable suite item; every Preventive control maps to its full adversarial scenario (a preventive control with no adversarial scenario is a coverage violation and blocks). The un-automatable P-series remainder stands as the documented acceptance matrix — traceable row-by-row, not claimed as automated.

The S-suite (13 named scenarios from the tgo-uz53 record, PRD section 6): S1 interrupted sessions; S2 stale memories; S3 denied tools; S4 model unavailable; S5 conflicting instructions; S6 failed verification; S7 bootstrap idempotence; S8 compressor single-owner; S9a reuse-gate identity; S9b reuse-gate permission; S9c reuse-gate completed; S10 spec drift; S11 zero-web disclosure. S-suite green on BOTH lanes gates pilot entry (F13-VH-03/04).

P-series totals (per-spec FUTURE scenario counts from the feature indexes; total 380):

| Feature | Requirements | Scenarios |
|---|---|---|
| F1 agent roles | F1-AR-01…14 (14) | 24 (A-ENTRY-01…A-HAND-24) |
| F2 permissions | F2-PE-01…13 (13) | 22 (P-MAL-01…P-REG-22) |
| F3 SDD workflow | F3-SD-01…12 (12) | 19 (SDD-01…19) |
| F4 Beads integration | F4-BI-01…12 (12) | 19 (BI-01…19) |
| F5 delegated sessions | F5-DS-01…12 (12) | 20 (DS-01…20) |
| F6 platform/distribution | F6-PD-01…12 (12) | 18 (P6-01…18) |
| F7 models/presets | F7-MP-01…12 (12) | 18 (P7-01…18) |
| F8 prose/skills | F8-PS-01…13 (13) | 19 (P8-01…19) |
| F9 bootstrap/init | F9-BS-01…14 (14) | 26 (P9-01…26) |
| F10 web/MCP retrieval | F10-WR-01…14 (14) | 31 (P10-01…31) |
| F11 durable memory | F11-DM-01…12 (12) | 22 (P11-01…22) |
| F12 working context | F12-WC-01…09 (9) | 30 (P12-01…30) |
| F13 validation harness | F13-VH-01…12 (12) | 18 (P13-01…18) |
| F14 writing style | F14-WS-01…09 (9) | 12 (WS-01…12) |
| F15 retrieval discipline | F15-RD-01…09 (9) | 15 (RD-01…15) |
| F16 review council | F16-RC-01…12 (12) | 23 (RC-01…23) |
| F17 vision lane | F17-VL-01…11 (11) | 22 (VL-01…22) |
| F18 visual tracker | F18-VT-01…10 (10) | 22 (VT-01…22) |
| Total | 212 | 380 |

F13 harness mapping: `@marcfargas/pi-test-harness` 0.6.1 pin with spec-phase re-pin (exact version + SHA + drift disclosure; undisclosed drift fails coverage — F13-VH-10) + the substitution boundary (`@gaodes` fork fallback-only, verify-then-admit — F13-VH-09) + the pilot protocol (synthetic-then-supervised per Q20; rollback flip + grant revocation + ledger preservation; reproduced-green re-entry — F13-VH-08) + the two CI lanes (Windows AND macOS green in v1 per the F13-Q1 USER OVERRIDE — F13-VH-01).

## 5. THE COMPATIBILITY-EXPERIMENT GATES

| ID | Probe gate | Owner (spec) | Output |
|---|---|---|---|
| PS-GATE-01 | Pi core/harness re-pin (live drift) | F6/F13 (F6-PD-10; F13-VH-10) | Pinned Pi core revision + re-pinned harness (exact version + SHA + drift disclosure vs the 0.6.1 record) |
| PS-GATE-02 | Extension picks: subagents (modelScope enforce as the only true hard per-seat block) + permissions (F2-PE-13 enforcement surface) + test harness with macOS lanes + MCP adapters (`@pi-unipi/mcp` direct vs pi-mcp-adapter single-proxy) — pinned at spec phase per MANIFEST, never chosen in specs | F1/F2/F10/F13 (MANIFEST extension picks) | Pinned extension set with provenance |
| PS-GATE-03 | donsetch adapter-form probe: our thin CLI/MCP-subprocess adapter as primary vs the native Pi extension as fallback — fallback admitted only if probes prove both the AGPL boundary and F2-PE-13 enforceability (F10-Q1) | F10 (F10-WR-02) | Recorded adapter-form selection |
| PS-GATE-04 | AFT interception probe: F2-PE-13's capability + operation + arguments + resolved-targets mapping — names, prefixes, and declarations alone never sufficient | F2 (F2-PE-13) | Verified tool mapping or parked capability |
| PS-GATE-05 | Magic Context path-(a)/(b) selection gate: preference order (a) disable-historian + native compaction first, then (b) session_before_compact custom archiver; the user sees the probe result before anything pins (F12-Q1) | F12 (F12-WC-01) | Recorded path selection with user word |
| PS-GATE-06 | TUI tracker prototype: panel/tab placement gated on feasibility incl. the mount-visibility probe (a panel that mounts but renders invisible FAILS); disclosed fallback (statusline + rendered board) if it fails (F18-VT-08) | F18 (F18-VT-08) | Prototype verdict + placement or disclosed fallback; mount-visibility criteria recorded |
| PS-GATE-07 | Keyless caps probes: markdown.new / Jina / Context7 / TinyFish / Exa / Parallel / Tavily / Firecrawl — recorded verbatim (429s captured verbatim), never hard-coded as truth (Tavily + Firecrawl are the Q51 reserve pair — activate only on documented chain exhaustion per the F10 reserve-activation rule) | F10 (F10-WR-01/08) | Probe-pinned cap record |
| PS-GATE-08 | SKU + vision-flags pins via the F7 live picker (F7; F17-VL-03); the gpt-5.6 alias stays distrusted until the pin record confirms exact SKU ids | F7/F17 (F7-MP-10; F17-VL-03) | Pin record per seat per path + per-SKU vision flags + the F8-Q8 tokenizer/variant pin (budget certification refused without it) |
| PS-GATE-09 | Search-provider selection: Exa anonymous primary with Parallel anonymous named fallback (F10-Q2) | F10 (F10-WR-06) | Recorded search-slot pin |
| PS-GATE-10 | gpt-5.6 alias check (may route to Sol — EVIDENCE on record) | F7 (F7-MP-10) | Alias-resolution evidence in the pin record |
| PS-GATE-11 | OS matrix: Windows CI + macOS CI both green in v1 per the F13-Q1 override (F13-VH-01/04) | F13 (F13-VH-01) | Both-lanes-green evidence |

## 6. THE BUILD ORDER

1. Phase 1 — spec-pins: the live picker RECORDS its outputs as CANDIDATE pins (model SKUs per F7-MP-10, lens models per F16-RC-06, per-SKU vision flags per F17-VL-03) + the license verification (F6-Q4's 11: mattpocock, BMAD, GSD, spec-kit, MemPalace, magic-context, qmd, Graphiti, Letta, ECC, ruflo) + probe scheduling (EVIDENCE section 2 + PS-GATE-01…11).
2. Phase 2 — build-experiments: the PS-GATE list (section 5), each with owner and recorded output; PS-GATE-08 CONFIRMS AND FINALIZES the pins after the probes (record-then-confirm; ONE authoritative pin record; no duplicate pinning); nothing pins before its probe result returns to the user where the spec requires it (notably PS-GATE-05, and every other gate whose spec requires the user's word).
3. Phase 3 — implementation: the plugin + the adapters (donsetch thin adapter, MCP) + the bootstrap (implementation of the F9 canonical order) + the self-update staging-and-swap (F6-PD-04/05, under PS-SEAM-14) + the tracker (F18 layered shape, read-only v1).
4. Phase 4 — the S-suite: the requirement-complete mapping executed (section 4: S-suite + P-series + harness lanes).
5. Phase 5 — the supervised pilot: F13's protocol — all-green on both OSes first, then watched metrics with the user watching (F13-VH-04/05).
6. Phase 6 — release: the F6 install path (git-tag, SHA-pinned install record) + the F9 bootstrap release-path integration CHECK (idempotent, never a second implementation) + the v1 release gate below (section 8).

## 7. THE CONSOLIDATED OPEN ITEMS

Referenced by spec, not duplicated (normative text stays in the feature specs' section 7). OWNER references are by spec; no due dates:

- Section-7 pins across all 18 (F1 item 12 … F18 items 1–9): storage/hash formats, host APIs, allowlists, scheduler mechanics, retry numbers, tag/URL shapes, preset schemas, picker UX, marker strings, adapter shapes, vault paths, probe procedures, lint thresholds, detector shapes, lens SKUs, image bounds, TUI prototype pin.
- Deferred + seamed question items: F8-Q4 deferred (parked for the user's later list); the now-seamed F8-Q8 (tokenizer pin, PS-SEAM-15) and F2-Q6 items ride their seams.
- The EVIDENCE.md UNVERIFIED list: the 16-item runtime-test list (EVIDENCE section 2) + the 22/23-item omissions inventory (EVIDENCE section 3, count note preserved — the ambiguity is a recorded EVIDENCE note, not resolvable here) + the open spec-phase items (EVIDENCE section 4).
- The 11 pending licenses (verify-then-admit per F6-Q4/F6-PD-07): mattpocock, BMAD, GSD, spec-kit, MemPalace, magic-context, qmd, Graphiti, Letta, ECC, ruflo. Verified exceptions on record: obra/superpowers MIT, addyosmani agent-skills 0.6.8 MIT.
- The runtime probes: the EVIDENCE 16-item list + the PS-GATE-01…11 additions (section 5).
- Suite/gate EXECUTION COSTS cross-reference the BQ3 per-task cost ceiling + the F13 suite-cost/dual-lane budget line (no new budget surface).

## 8. THE V1 RELEASE GATE (F13-Q4's bar)

The pilot exits — and v1 ships — ONLY on: the PS-GATE list's recorded outputs as Phase-2 evidence (section 5, incl. the PS-GATE-06 mount-visibility activation criteria) + the user's sign-off on the watched metrics (refusal samples with reason codes, resume decisions, compaction contests, verifier fails, unavailability episodes, web-fallback disclosures, repeat-call canary — PRD section 6) + the OBJECTIVE FLOOR: zero unexplained rollbacks + the refusal-string samples behaving as signed-off + both OSes green (F13-VH-05; F13-VH-01) + the PS-SEAM-07 SIGNED AGPL BOUNDARY REVIEW as ship blocker (v1 cannot ship without the user-signed review) + the F13-VH-08 MECHANICS (rollback flip + grant revocation + ledger preservation + reproduced-green re-entry) + the S-SUITE REGRESSION RE-GREEN at pilot exit. Record-only metrics stay record-only (F13-Q5: the F7 falsifier tier-vs-pass-rate counters; BQ4 resume-hit rate — F13-VH-06/07) until real data supports a threshold, which needs its own user decision.

## 9. DECISION-SET ROSTER + PROVENANCE

The full C2 list: Q1–Q51, F1Q1–F1Q14, F2Q1–F2Q6, F3Q1–F3Q6, F4Q1–F4Q6, F5Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q6 (plus agreed F8-Q7/Q8/Q9; F8-Q4 deferred), F9Q1–F9Q9, F10-Q1–F10-Q10, F11-Q1–F11-Q10, F12-Q1–F12-Q9, F13-Q1–F13-Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8, F17-Q1–F17-Q5, F18-Q1–F18-Q6 (normative text in the feature specs; decision record in `DECISIONS.md`).

The four PRD section-7 comments are preserved verbatim in `PRD.md` (untouched by this integration). The batteries-included frame carries its provenance stamp (user notes batch 2026-09-23 + the wave-3 gap analysis). Verification chains: every feature ran draft → Horowitz → band → corrections → re-check → user approval (per-feature records in `DECISIONS.md`).

## References

- `PRD.md` — Stage A frame (product frame mirrored additively; section-7 comments intact).
- `DECISIONS.md` — Q1–Q51 plus all eighteen feature digests (decision record, not the spec).
- `MANIFEST.md` — dependency classes and spec-phase pins (nothing selected here).
- `EVIDENCE.md` — citations, the 16-item UNVERIFIED probe list, omissions inventory, open items.
- `features/` — the eighteen normative feature specs (F1-AR-01 … F18-VT-10).
