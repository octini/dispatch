# Feature F15 — Retrieval discipline (Dispatch)

Status: drafted 2026-09-23 (RD-Q1..Q4 + band corrections applied 2026-09-23); USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); implementation unverified; all scenarios FUTURE. Requirements F15-RD-01 … F15-RD-09 drafted 2026-09-23. No implementation, installs, code, commits, or pushes. Fifteenth Stage B feature spec (PRIMARY SPEC still DEFERRED pending user notes). All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled RD-Q1–RD-Q4 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14 requirements stand untouched.

## 0. Objective

Define the drive layer over the F10 retrieval stack: every external factual claim in delivered output carries a source link, a workspace citation (file:line), or a user-instruction attribution, or it is disclosed or dropped. Skill text asserting external facts follows the same cite-or-fetch rule (the F8 amendment). Surface priming lists retrieval tools first in each seat toolset order with a retrieval-required marker on fresh-fact categories (the F10 amendment). Enforcement mirrors F14's proven four layers: an always-on core rule, a detective claim check, a review-gate cold read, and a promotion ladder. (RD-Q1..Q4 Agreed 2026-09-23.)

Stable requirement IDs `F15-RD-01` … `F15-RD-09`. Sources trace to settled RD-Q1–RD-Q4 (all Agreed 2026-09-23) plus Q8, Q18, F10-WR-08, F12-Q3, F12-Q7, F13-Q4/Q5, the F14 precedent, and the tgo-im6j research provenance; mappings are multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (claim rule, enforcement shape, acceptance only):

1. Trigger scope: which delivered claims require attribution (section 2.1).
2. Procedure/claim split for skill text (section 2.2).
3. Four-layer enforcement shape: core rule, detective check, cold read, ladder (section 2.3).
4. Claim-failure behavior as confirmation of the settled composition (section 2.4).
5. Surface-priming composition (section 2.5; normative text in F10).
6. Draft always-on rule text, labeled draft (section 2.6).
7. Control classification of the above by actual function.
8. Question map and provenance record (section 8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Build-check mechanics for skill text — F8 owns (F8-PS-13); here only the claim rule holds.
2. Toolset order and the adapter surface — F10 owns (F10-WR-14); here only the priming composition holds.
3. Re-injection set membership, prompt-core budget, trim/park order — F12 owns (F12-Q3 home, F12-Q7 budget, F8-Q9 order); here only the core rule's required-content composition holds.
4. Review gates and deviation handling — F3 owns; here only the cold-read composition holds.
5. Pilot entry/exit gates and record-only instrumentation — F13 owns; here only the promotion-gate composition holds.
6. F16 council review authority — F16 owns; here only the cold-read hook holds (Expert solo; the F16 council at designated reviews).
7. Exact detector implementation, threshold values, marker format, and token bound — downstream engineering owns, never chosen here (section 7).

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Detector precision/recall values, marker format, token bound, council wiring, or build-check mechanics — all section 7 shapes, never chosen here.
3. Any claim that the core rule is injected, the check blocks, or sections 2–3 are enforced at runtime. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Trigger scope (RD-Q1)

- F15-RD-01 — TRIGGER SCOPE: every EXTERNAL factual claim in delivered output (chat answers, docs, code comments asserting facts) requires one of: a source link, a workspace citation (file:line), or a user-instruction attribution. Fresh-fact categories always count as external: versions, prices, APIs, library behavior, standards, release dates. Internal reasoning and procedures are free — thoughts are not claims. The trigger covers delegation reports (F1's STATUS/CHANGES/VERIFIED/GAPS return contract) and envelope evidence. Attribution splits by claim class: EXTERNAL factual claims in reports follow the trigger (source link | file:line | user-instruction attribution); claims about the agent's OWN work follow F1's evidence contract (the return's evidence field). Claims carry their attributions through delegation envelopes and summarization chains (the F11-DM-02 sibling rule). (RD-Q1 Agreed 2026-09-23.)

- Quoted text inherits its source attribution (the citation travels with the quote); re-asserted or paraphrased claims need fresh attribution.
- file:line citations bind to the revision they referenced (F3 review-evidence binding); a stale citation is a detective finding at review (section 7 shape).
- Source-link validity: the retrieval-time stamp (F10-WR-09) records the status at fetch; no automatic re-fetch at review (section 7 shape).
- Mixed prose: claims embedded in reasoning still count; the detector scans mixed prose; reasoning stays free.

### 2.2 Procedure vs claim (RD-Q2)

- F15-RD-02 — PROCEDURE VS CLAIM: skill bodies encode PROCEDURES (fine as static text); factual CLAIMS inside skill text follow the same cite-or-fetch rule; the build check enforces (the F8 amendment, F8-PS-13). Surface priming (the F10 amendment, F10-WR-14) rides this section. Enforcement split: the promotion ladder (F15-RD-06, detective-first) governs claim rules on DELIVERED OUTPUT at runtime; the skill BUILD CHECK (F8-PS-13) is a BUILD-TIME gate on STATIC skill text, consistent with F8's established build-time asserts. Two surfaces, two timelines; no contradiction. (RD-Q2 Agreed 2026-09-23.)

### 2.3 Four-layer enforcement (RD-Q3), mirroring F14's proven architecture

- F15-RD-03 — (a) ALWAYS-ON CORE RULE: the 1–2 line rule (draft text in section 2.6, labeled draft, user-approvable at spec review) lives ONCE in the F12-Q3 re-injection set as required content, counted ONCE in the F8-Q7 authored-prompt budget; F14's sandwich accounting applies only to F14's core. The set holds both rules under one permanent prompt cost. The set itself is never trimmed. (RD-Q3 Agreed 2026-09-23; F12-Q3 home; F12-Q7; F14-WS-01 precedent.)
- F15-RD-04 — (b) DETECTIVE CLAIM CHECK: a heuristic check over fresh-fact categories plus sentence patterns flags unattributed external claims in delivered output. Findings are REPORT-ONLY until promotion (section 2.3 ladder). English-first is a NAMED LIMITATION (mirroring STYLE-Q10): principles apply in any language; the mechanical check covers English. (RD-Q3 Agreed 2026-09-23.)
- F15-RD-05 — (c) REVIEW-GATE COLD READ: the Expert reads cold and checks claim attribution in every review; findings join the review report — non-blocking unless a promoted claim rule fires. The F16 council takes this hook at designated reviews (touched-not-owned hook, like F14-WS-08). (RD-Q3 Agreed 2026-09-23; F3 owns review gates.)
- F15-RD-06 — (d) PROMOTION LADDER: proposed to piloted to user-signed to blocking, per rule (composing F13's pilot gates). A claim rule becomes blocking ONLY after pilot evidence plus explicit user sign-off — never sooner. Semantic claim judgment is NEVER check-only; it judges through the review-gate cold read. (RD-Q3 Agreed 2026-09-23; F13-Q4/Q5 composition.)

### 2.4 Claim-failure behavior (RD-Q4)

- F15-RD-07 — CLAIM-FAILURE BEHAVIOR: an unsourced claim is disclosed ("no source found") or DROPPED — never asserted silently. The Q8/Q18 gap rules govern: reversible work proceeds when the gap is not acceptance-critical; the affected branch stops otherwise; both cases disclose. This records the settled F10-WR-08 composition as confirmation — no new rule. (RD-Q4 Agreed 2026-09-23; F10-WR-08; Q8; Q18.)

### 2.5 Surface priming (RD-Q2 composition; F10 owns)

- F15-RD-08 — SURFACE PRIMING: retrieval tools are listed FIRST in each seat's toolset order, and the adapter's surface carries a retrieval-required marker on the fresh-fact categories. Normative text lives in F10-WR-14; this section holds the composition only. Provenance: the wave-1 tool-ordering gap (what is visible gets used; agents skip options) from tgo-im6j. (RD-Q2 Agreed 2026-09-23; F10 composition.)

### 2.6 THE DRAFT RULE TEXT (labeled draft — user-approvable at spec review)

> Cite or fetch each outside fact. Each claim carries a source link, a file:line note, or user-instruction attribution. Drop a claim with no source. Disclose the gap aloud.

Method note: 28 words in 4 sentences (6/12/6/4 — each under the F14 20/25 caps). Self-consistency check: active voice throughout, simple verbs (cite, fetch, carries, drop, disclose), zero em-dashes, zero banned phrases from the F14 lint list (no pompous verbs, no throat-clearing, no "not X, it's Y" contrast). The three-item attribution list restates the RD-Q1 options, not padding.

### 2.7 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block; nothing here claims the runtime implements it — enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Core rule in the re-injection set, never trimmed (F15-RD-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks trim paths from removing the claim rule |
| Disclose-or-drop on unsourced claims; never silent (F15-RD-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent assertion of unsourced claims |
| Promoted claim rule fires at review (F15-RD-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks acceptance on a fired promoted rule |
| Skill build check on claim-bearing text (F15-RD-02; F8-PS-13) | Preventive (SPEC requirement, NOT proven implementation) | blocks unsourced external facts in skill text at BUILD TIME (static-text gate; the F15-RD-06 ladder governs delivered output at runtime — two surfaces, two timelines) |
| Detective claim-check findings (F15-RD-04) | Detective | surfaces unattributed claims after the fact; never gates pre-promotion |
| Review-gate cold-read findings (F15-RD-05) | Detective | surfaces attribution drift after the fact; non-blocking unless a promoted rule fires |
| Surface-priming order and marker (F15-RD-08; F10-WR-14) | Detective (reporting) | leaves an after-the-fact ordering and marking trail with no authority of its own |
| Retrieval-quality or coverage assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.8 Invariance and spec-only status

- F15-RD-09 — F1–F14 requirements stand unchanged by anything in this feature; no seat, budget, ceiling, gate, evidence, license, platform, model, prose, skill, retrieval, memory, context, harness, or style rule moves here. All blocking in sections 2.1–2.5 is a SPEC requirement, not proven runtime implementation — enforcement is unverified until probes decide (section 7). (F1–F14 invariance; spec-only status.)

## 3. Constraints

C1. RD-Q1–RD-Q4 govern where they conflict with earlier readings inside this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14 stand where this spec does not narrow them. C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10 stand; this spec cross-references, never re-decides. C3. No invented numbers: no detector thresholds, no marker format, no token bound, no false-positive rate — unknowns in section 7 stay open. C4. No silent claim: every unsourced external claim discloses or drops. C5. Claim rules start detective-only; no rule blocks without pilot evidence plus explicit user sign-off. C6. Controls are classed preventive, detective, or advisory by actual function (section 2.7); SPEC-required blocking is not proven implementation. C7. Spec-only status: every block is a SPEC requirement with enforcement unverified until probes decide. C8. All scenarios FUTURE — not executed; no tests run. C9. Documentation only — no implementation, installs, code, config, commits, or pushes. C10. IDs stable and additive: F15-RD-01…09, RD-01…15; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial claim-rule consistency; this file owns ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- RD-01 (F15-RD-01). Input: delivered answer asserts an external claim with a source link / Observe: attribution check runs / Pass: claim passes with its link recorded. FUTURE.
- RD-02 (F15-RD-04). Input: delivered answer asserts a fresh-fact claim (a library version) with no source / Observe: detective check runs / Pass: claim flagged as unattributed; acceptance unaffected pre-promotion. FUTURE.
- RD-03 (F15-RD-05, F15-RD-07). Input: unsourced claim reaches review / Observe: cold read and failure handling run / Pass: claim disclosed ("no source found") or dropped; never asserted silently. FUTURE.
- RD-04 (F15-RD-02). Input: procedure-only skill text goes to the build check / Observe: claim scan runs / Pass: skill passes with zero claim findings. FUTURE.
- RD-05 (F15-RD-02). Input: skill text asserts an external fact with no source / Observe: build check runs / Pass: build refuses with the unsourced claim cited. FUTURE.
- RD-06 (F15-RD-08). Input: a seat toolset assembles / Observe: ordering check runs / Pass: retrieval tools listed first in the seat toolset order. FUTURE.
- RD-07 (F15-RD-07). Input: offline run with no source for a non-acceptance-critical claim / Observe: failure handling runs / Pass: claim dropped with disclosure; reversible work proceeds. FUTURE.
- RD-08 (F15-RD-07). Input: retrieval gap on an acceptance-critical demand / Observe: gap handling runs / Pass: affected branch stops with disclosure; independent work proceeds. FUTURE.
- RD-09 (F15-RD-01). Input: delivered answer asserts a workspace fact with a file:line citation / Observe: attribution check runs / Pass: claim passes with its citation recorded. FUTURE.
- RD-10 (F15-RD-01). Input: delivered answer asserts a fact on the user's word / Observe: attribution check runs / Pass: claim passes with user-instruction attribution recorded. FUTURE.
- RD-11 (F15-RD-01). Input: delivered output carries internal reasoning with no external assertion / Observe: attribution check runs / Pass: reasoning unflagged; thoughts are not claims. FUTURE.
- RD-12 (F15-RD-06). Input: a claim rule with pilot evidence plus user sign-off fires / Observe: gate check runs / Pass: BLOCKED until the violation clears; without both legs a firing rule still reports only. FUTURE.
- RD-13 (F15-RD-04). Input: non-English prose goes through the mechanical check / Observe: scope check runs / Pass: English-only limitation recorded and disclosed; the Expert cold read judges all languages. FUTURE.
- RD-14 (F15-RD-01). Input: a delegation report asserts an external fact in a GAPS line with a source link / Observe: attribution check runs / Pass: attribution recorded; an unattributed external claim in a report flags like any delivered output. FUTURE.
- RD-15 (F15-RD-01, F15-RD-04). Input: mixed prose embeds an unattributed fresh-fact claim inside reasoning / Observe: detective check runs / Pass: the embedded claim flags; surrounding reasoning stays unflagged. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | RD source | F1–F14 relation |
|---|---|---|
| F15-RD-01 trigger scope; cite-or-fetch-or-attribute; fresh-fact categories always external; thoughts free | RD-Q1 Agreed 2026-09-23 | Semantic-Anchors citation anchor (provenance) |
| F15-RD-02 procedure/claim split; claims in skill text cite-or-fetch; build check enforces | RD-Q2 Agreed 2026-09-23 | F8-PS-13 composition (F8 owns mechanics) |
| F15-RD-03 always-on core rule ONCE in the F12-Q3 set; counted ONCE in the F8-Q7 authored-prompt budget (one-home accounting; F14's core keeps its own accounting) | RD-Q3 Agreed 2026-09-23 | F12-Q3 home; F12-Q7 budget; F8-Q9 order; F14-WS-01 precedent (all untouched) |
| F15-RD-04 detective claim check; heuristic; English-first named limitation | RD-Q3 Agreed 2026-09-23 | STYLE-Q10 precedent (untouched); F13 promotion posture (untouched) |
| F15-RD-05 review-gate cold read (Expert solo; the F16 council at designated reviews) | RD-Q3 Agreed 2026-09-23 | F3 review gates; F14-WS-08 hook shape (untouched) |
| F15-RD-06 promotion ladder; pilot evidence + sign-off before blocking | RD-Q3 Agreed 2026-09-23 | F13-Q4/Q5 pilot gates (untouched) |
| F15-RD-07 disclose-or-drop; Q8/Q18 gap rules; F10-WR-08 confirmation | RD-Q4 Agreed 2026-09-23 | F10-WR-08 (untouched); Q8; Q18 |
| F15-RD-08 surface priming composition (tools first; marker on fresh-fact categories) | RD-Q2 Agreed 2026-09-23 | F10-WR-14 (F10 owns normative text) |
| F15-RD-09 F1–F14 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP; F8-PS; F9-BS; F10-WR; F11-DM; F12-WC; F13-VH; F14-WS; section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (RD-Q1; F15-RD-01) Each outside fact in delivered output carries a source link, a file:line note, or user words; fresh-fact categories always count as outside; thoughts stay free.
2. (RD-Q2; F15-RD-02; F8) Skill procedures ship as plain text while skill claims cite or fetch, with the build check as the gate.
3. (RD-Q3; F15-RD-03; F12; F14) The 1–2 line rule rides the re-injection set ONCE as required content, counted ONCE in the F8-Q7 authored-prompt budget; F14's core keeps its own accounting.
4. (RD-Q3; F15-RD-04; STYLE-Q10) A heuristic check flags unattributed claims and reports only; the mechanical check covers English first.
5. (RD-Q3; F15-RD-05; F3) Each review cold-reads attribution (Expert solo; the F16 council at designated reviews); only a promoted rule blocks.
6. (RD-Q3; F15-RD-06; F13) Each rule climbs proposed to piloted to user-signed to blocking; pilot proof plus sign-off precede any block.
7. (RD-Q4; F15-RD-07; F10-WR-08; Q8; Q18) An unsourced claim discloses or drops, never asserts; gaps follow the reversible-proceed / stop-branch split.
8. (RD-Q2; F15-RD-08; F10) Retrieval tools head each seat toolset; fresh-fact categories carry the retrieval-required marker.
9. (Derived; F15-RD-09) F1–F14 rules do not move for retrieval-discipline work, and every block here awaits probe proof.

## 7. Downstream unresolved contracts (not decided here)

Open items only — no invented values:

1. Claim-detector precision/recall tradeoff: the false-positive rate ships as a pilot metric, mirroring F13's record-only posture — no rate set here.
2. Retrieval-required marker exact format — shape only, no format chosen here.
3. Always-on rule exact token bound at the build pin — no bound set here.
4. Council hook wiring (Expert-to-F16 handoff of the cold read at designated reviews) — resolved per F16; mechanics downstream.
5. Build-check mechanics for skill text (scan shape, refusal strings, record shape) — F8 owns; shapes only.
6. Cross-boundary items with F17/F18 not yet spec'd — named, never decided here (F16 now drafted; composition per F16).
7. Fetch budgets, timeouts, and offline fallback — F10-owned contracts (F10-WR-08/09) named here as gaps, never decided here.
8. Promotion criterion — pilot evidence PLUS user sign-off; the detector's precision records as an input the user weighs at sign-off; no numeric threshold set here.

Implementation probes (runtime evidence before build claims):

1. Trigger-scope proof: sourced claims pass; unattributed outside claims flag.
2. Procedure/claim proof: procedure-only skills pass; claim-bearing unsourced skills refuse at build.
3. Rule-presence proof: claim core rule present ONCE in the re-injection set under budget pressure.
4. Detective-first proof: pre-promotion findings gate nothing.
5. Promotion proof: a signed-off rule with pilot evidence blocks.
6. Failure-behavior proof: unsourced claims disclose or drop; gaps split reversible-proceed vs stop-branch.
7. Priming proof: retrieval tools head each seat toolset; markers ride fresh-fact categories.

Evidence limitations carried from Stage A:

1. Rule text is UNAPPROVED until spec review — no signed-off wording exists yet.
2. All enforcement is UNVERIFIED — probe-verified at build before any gate relies on it.
3. All pilot evidence is FUTURE — nothing measured, nothing promoted.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: claim checks consume NO review budget and reset none — F1 task budgets (initial plus at most two repair/re-review cycles) and the ONE shared integration budget stand unchanged by claim findings; an exhausted task failure is never repaired inside a claim re-check window, and approvals are never bypassed by claim work.

Question map (all Agreed 2026-09-23; paraphrase, not user quotes):

- RD-Q1 — Trigger scope: every EXTERNAL factual claim in delivered output needs a source link, a workspace citation, or user-instruction attribution; fresh-fact categories (versions, prices, APIs, library behavior, standards, release dates) always count as external; internal reasoning and procedures are free. (Normative: F15-RD-01.)
- RD-Q2 — Procedure vs claim: skill bodies encode PROCEDURES as static text; factual CLAIMS in skill text follow cite-or-fetch with build-check enforcement (the F8 amendment); surface priming rides alongside (the F10 amendment). (Normative: F15-RD-02/08.)
- RD-Q3 — Four-layer enforcement mirroring F14: always-on core rule ONCE in the F12-Q3 set, counted ONCE in the F8-Q7 authored-prompt budget (one-home accounting; F14's core keeps its own accounting); detective heuristic check (English-first limitation); review-gate cold read (Expert solo; the F16 council at designated reviews); promotion ladder on F13 pilot gates. (Normative: F15-RD-03/04/05/06.)
- RD-Q4 — Claim-failure behavior: unsourced claims disclose or drop, never assert silently; Q8/Q18 gap rules govern the split; settled F10-WR-08 composition confirmed, no new rule. (Normative: F15-RD-07.)

User notes / delta: F15 is a user-notes mini-project (later-list notes 2026-09-23) — it adds a feature spec plus two additive compositions (F8-PS-13, F10-WR-14) without moving any prior decision: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10 all stand; this spec cross-references, never re-decides. Awaiting review + USER approval of this draft; Horowitz + band review follow per the per-feature flow.

Provenance (tgo-im6j waves 1–2 + Semantic-Anchors anchor + F14 precedent):

- Semantic-Anchors citation anchor (wave 1): the plain-english anchor REQUIRES SOURCE LINKS on external claims — the direct ancestor of the RD-Q1 trigger scope.
- Tool-ordering gap (wave 1): what is visible gets used while agents skip options — hence surface priming (retrieval tools first, retrieval-required markers), not capability alone.
- Surfacing findings (waves 1–2): retrieval capacity goes unused unless the surface presents it where the seat already looks — hence the adapter-surface marker composition.
- F14 four-layer precedent: the always-on core plus detective lint plus review-gate cold read plus promotion ladder already passed grill for style — RD-Q3 copies the shape for claims instead of inventing new machinery.
- Why claim rules start detective-only: drift evidence (unanchored output drifts within rounds) plus self-activation evidence (0/10 observed skill self-activation) from tgo-im6j show that unprompted discipline fades — so the rule rides always-on while enforcement earns blocking status through pilot proof, mirroring F13's record-only posture.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1–F14 digests and the RD digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame cross-referenced here (no re-decision here).
- `../MANIFEST.md` — license-gated reuse per F6-Q4 cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; detector, marker, and enforcement gaps stay open there.
- `README.md` — Stage B index; this is feature 15 of 15, drafted awaiting review.
