# Feature F14 — Writing style (Dispatch)

Status: corrections applied 2026-09-23 (STYLE-Q1..Q10 Agreed 2026-09-23); USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); implementation unverified; all scenarios FUTURE. Requirements F14-WS-01 … F14-WS-09 drafted 2026-09-23. No implementation, installs, code, commits, or pushes. Fourteenth Stage B feature spec (PRIMARY SPEC still DEFERRED pending user notes). All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled STYLE-Q1–STYLE-Q10 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13 requirements stand untouched.

## 0. Objective

Define an always-on style layer for ALL agent-authored prose — chat output, docs, comments, commit messages (STYLE-Q4): a shared core (150–250 words, 8 rules) sandwiched top+bottom in the F12-Q3 re-injection set, per-seat thin overlays, a deterministic lint that starts detective-first with a recorded promotion ladder, and a review-gate cold read at every review — with verbatim and never-compress carve-outs, an explicit-instruction override, and an Orwell escape hatch, all disclosed where used.

Stable requirement IDs `F14-WS-01` … `F14-WS-09`. Sources trace to settled STYLE-Q1–STYLE-Q10 (all Agreed 2026-09-23) plus the tgo-im6j wave-2 research provenance; mappings are multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (core wording draft, overlays, lint shape, review-gate composition, carve-outs, override and escape-hatch disclosure):

1. Shared always-on core: 8-rule draft wording (section 2.1), labeled draft — user-approvable at spec review.
2. Placement: top of the system prompt AND repeated at the bottom (the sandwich); home is the F12-Q3 re-injection set (STYLE-Q1).
3. Per-seat thin overlays: Dispatcher, Writer, Seeker, Expert (section 2.2).
4. Deterministic lint: mechanical rules + banned-phrase list + detective-first promotion ladder (section 2.3).
5. Review-gate style check at every review (section 2.4).
6. Verbatim carve-out and never-compress carve-out (sections 2.1, 2.5).
7. Explicit user style-instruction override (disclosed) and Orwell escape hatch (disclosed) (section 2.5).
8. License-gated source reuse per F6-Q4 (section 2.6).
9. Closed-loop budget, question map, and user-notes/delta record (section 8).
10. Standing vs one-off style-preference disclosure (section 2.8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Re-injection set membership, prompt-core budget, trim/park order — F12 owns (F12-Q3 home, F12-Q7 budget refinement, F8-Q9 order); here only the core's required-content composition holds (never trimmed — the F12-Q3 set).
2. Seat responsibilities and review packets — F1 owns; here only the overlay composition holds.
3. Approval gates and deviation handling — F3 owns; here only the review-gate style-check composition holds.
4. Pilot entry/exit gates and record-only instrumentation — F13 owns; here only the lint-promotion-gate composition holds (promotion needs pilot evidence + explicit user sign-off).
5. Exact lint implementation, threshold values, banned-phrase final wording, and enforcement mechanics — downstream engineering owns, never chosen here (section 7).
6. F16 council review authority — F16 owns; here only the cold-read composition holds (Expert solo; the F16 council at designated reviews) (F14-WS-08).

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Final banned-phrase list, lint thresholds, promotion criteria values, or signed-off core wording — all section 7 shapes, chosen at spec review / pilot, never here.
3. Any claim that the core is injected, the lint blocks, or sections 2–3 are enforced at runtime. Proof is future work.
4. The integrated primary spec. Fourteen specs drafted; integration follows.

## 2. Interfaces

### 2.1 THE DELIVERABLE — the always-on core (STYLE-Q1/Q2/Q3/Q5/Q6/Q7)

- F14-WS-01 — SHARED CORE, SANDWICHED TOP+BOTTOM: the wording below rides at the TOP of the system prompt AND repeated at the BOTTOM (the sandwich), as required content inside the F8-Q7 always-on budget — never trimmed, including under budget pressure (the F12-Q3 set; F8-Q9 trim order applies to everything else first). Sandwich arithmetic (STYLE-Q5 Agreed 2026-09-23; band-quotable): core ≈157 words × 2 instances ≈ 314 words ≈ 440 tokens. Accounting: the TOP copy counts in the F8-Q7 authored-prompt budget; the BOTTOM copy counts in the whole-prompt exposure budget (F8-Q7's disclosed second layer). The 150–250 band binds the core TEXT (one copy), not its instances. Joint hard-cap (1000) breach by required content (core + overlays + seat instructions + re-injection set) = build refusal → F8-Q9 park/escalate — never a silent trim. The band's single-injection fix was REJECTED (it would relitigate the approved sandwich). Wording status: draft — user-approvable at spec review. (STYLE-Q1/Q3/Q5 Agreed 2026-09-23; F12-Q3 home.)

Core draft (8 rules, 159 words; prose-only 151; method in section 7):

> 1. Lead with the result or action. Outcome first, then reason. 2. Use active voice and simple tenses. Name the actor every sentence. 3. Prefer simple verbs and keep one word to one meaning. Never use pompous verbs: utilize, leverage, facilitate, commence, delve, or similar wording. 4. Keep instructions under 20 words and explanations under 25. Put one instruction in each sentence. 5. Write no preamble, recap, closer, em-dash, "not X, it's Y" contrast, rule-of-three list, or throat-clearing. 6. Cover one topic per paragraph of at most 6 sentences. Cap every list at 5 items. 7. In conversational output only, restate the current state each turn and end with one concrete next step. 8. Quote code, paths, errors, and user words verbatim. Accuracy beats brevity every time. Escape hatch (Orwell rule 6): break any rule above sooner than say anything outright barbarous. Disclose the break. Never compress to save space. Validation, error handling, auth, secrets, and deletes stay complete.

Scope definitions (STYLE-Q7 Agreed 2026-09-23, clarified): conversational output = chat messages to the user (rule 7 applies here only); artifacts = durable written outputs (docs, comments, commit messages), which follow the other seven rules plus the Writer overlay. One style overall.

### 2.2 Per-seat thin overlays (STYLE-Q1; F1 composition)

- F14-WS-02 — PER-SEAT OVERLAYS APPLIED: each seat applies the shared core PLUS its thin overlay (a few lines each, normative text below — drafts, user-approvable at spec review):
  - Dispatcher: restate assignment state at each turn boundary and end with one concrete next step; no status without an owner and a next action.
  - Writer: hold file:line discipline on every touched file; one thought per paragraph; headings as statements that the paragraph proves; diffs stay surgical.
  - Seeker: source-first — every claim carries its source; snippets stay bounded (F10-Q10 bound shared); never present an unverified source as verified.
  - Expert: citation-first — findings cite the artifact line or requirement ID they judge; cold-read every review for style adherence alongside correctness. (STYLE-Q1 Agreed 2026-09-23; F1 owns seat authority.)

### 2.3 The deterministic lint (STYLE-Q1; F13 promotion-gate composition)

- F14-WS-03 — LINT DETECTIVE-FIRST WITH PROMOTION LADDER: the lint checks MECHANICAL rules only — instruction/explanation length caps (20/25), em-dash detection, list-cap (>5 items) detection, and the banned-phrase list below (drafted from the house-style AI-tells): "Here's the thing", "Great question", "Let me be clear", "It's worth noting", "delve", "leverage", "utilize", "seamless", "robust", "not X, it's Y" contrasts, rule-of-three padding. The lint EXEMPTS carved-out spans (F14-WS-04/05): verbatim quotes and never-compress spans never trigger findings. The banned-pompous-verbs list (STYLE-Q6: utilize, leverage, facilitate, commence, delve, and similar) feeds the lint. Findings are REPORT-ONLY at review (detective); an individual rule promotes to BLOCKING only after F13 pilot evidence plus explicit user sign-off — never sooner. Semantic rules (voice, clarity, judgment) are NEVER lint-only; they judge through the review-gate cold read (section 2.4). The promotion ladder (proposed → piloted → user-signed → blocking, per rule) is recorded; exact thresholds and list finalization are section 7. Lint scope (STYLE-Q10 Agreed 2026-09-23): natural-language prose in any language is in scope (principles apply); the mechanical lint is ENGLISH-ONLY (named limitation); machine/structured formats (JSON, code, config) are out of style scope. An explicit user instruction outranks a user-signed promoted blocking lint rule FOR THAT OUTPUT (disclosed); the lint finding still records (STYLE-Q9 Agreed 2026-09-23). (STYLE-Q1/Q6/Q9/Q10 Agreed 2026-09-23; F13-Q4/Q5 composition.)

### 2.4 Review-gate style check (STYLE-Q1; F3 composition)

- F14-WS-08 — REVIEW-GATE STYLE CHECK: the Expert reads cold — solo, or the F16 council at designated reviews — and checks style adherence in every review; findings join the review report — non-blocking unless a promoted lint rule fires (section 2.3). (STYLE-Q1 Agreed 2026-09-23; F3 owns review gates.)

### 2.5 Carve-outs, override, escape hatch (STYLE-Q2/Q3/Q4)

- F14-WS-04 — VERBATIM CARVE-OUT: code, paths, errors, and quotes are NEVER restyled — quoted exactly, even when they break a core rule. (STYLE-Q4 Agreed 2026-09-23.)
- F14-WS-05 — NEVER-COMPRESS CARVE-OUT: validation, error handling, auth, secrets, and deletes are NEVER compressed for brevity (provenance: honey-for-devs MIT). (STYLE-Q3 Agreed 2026-09-23.)
- F14-WS-06 — EXPLICIT-INSTRUCTION OVERRIDE + ESCAPE HATCH: an explicit user style instruction overrides the core FOR THAT OUTPUT ONLY, and the output discloses the override; the Orwell rule-6 escape hatch (break any rule sooner than say anything outright barbarous) is usable WITH disclosure of which rule broke and why. Undisclosed overrides and undisclosed breaks fail the review-gate check. STYLE-Q9: the override also outranks a user-signed promoted blocking lint rule FOR THAT OUTPUT; the lint finding still records. (STYLE-Q2/Q9 Agreed 2026-09-23.)

### 2.6 License-gated source reuse (F6-Q4 composition)

- F14-WS-07 — SOURCE REUSE GATED BY F6-Q4 VERIFY-THEN-ADMIT: style sources contribute adapted text ONLY after the F6-Q4 license fetch verifies them permissive; unverified sources stay idea-level. 4/9 licenses pending on record; asd-ste100's ~900-word dictionary is NEVER copied (copyright) — rules above are written fresh. Verified exceptions on record carry (obra/superpowers MIT, addyosmani agent-skills MIT, plus the section 9 provenance licenses). (F6-Q4; STYLE-Q2 Agreed 2026-09-23.)

### 2.7 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block; nothing here claims the runtime implements it — enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Core sandwiched top+bottom, never trimmed (F14-WS-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks budget-trim paths from removing the core |
| Promoted lint rule fires at review (F14-WS-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks acceptance on a fired promoted rule |
| Verbatim / never-compress carve-outs (F14-WS-04/05) | Preventive (SPEC requirement, NOT proven implementation) | blocks restyling and compression in carved-out spans |
| Undisclosed override or break fails review-gate (F14-WS-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks a clean pass on undisclosed deviation |
| Detective lint findings (F14-WS-03) | Detective | surfaces style findings after the fact; never gates pre-promotion |
| Review-gate cold-read findings (F14-WS-08) | Detective | surfaces style drift after the fact; non-blocking unless a promoted rule fires |
| Standing style preference applied without session-start disclosure (F14-WS-09) | Detective | surfaces an undisclosed standing preference after the fact; never gates pre-disclosure |
| Quality assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.8 Standing vs one-off style preferences (STYLE-Q8)

- F14-WS-09 — STANDING VS ONE-OFF PREFERENCES: standing user style preferences live in user-managed config (persistent until the user revokes by instruction; only the user creates or changes them) and are disclosed ONCE at session start and on change — never per output. One-off overrides apply per output with an in-output disclosure note. Distinction = surprise: standing settings are visible up front; one-off deviations get per-output notes. (STYLE-Q8 Agreed 2026-09-23.)

## 3. Constraints

C1. STYLE-Q1–STYLE-Q10 govern where they conflict with earlier readings inside this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13 stand where this spec does not narrow them. C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7 stand; this spec cross-references, never re-decides. C3. Quoted research values carry provenance (section 9) — no invented numbers. C4. Core wording is draft until user sign-off at spec review — no enforcement claim before then. C5. Lint is detective-first; no rule blocks without pilot evidence + explicit user sign-off. C6. Semantic rules are never lint-only. C7. Carve-out spans are never restyled or compressed. C8. No invented thresholds, final lists, promotion values, or shapes — shapes only, section 7. C9. Absorbed facts carry provenance labels wherever they appear. C10. Spec-only status: every block is a SPEC requirement with enforcement unverified until probes decide. C11. All scenarios FUTURE — not executed; no tests run. C12. Documentation only — no implementation, installs, code, config, commits, or pushes. C13. IDs stable and additive: F14-WS-01…09, WS-01…12; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial style-layer consistency; this file owns ID/label consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- WS-01 (F14-WS-01). Input: a system prompt assembles under budget pressure / Observe: sandwich check runs / Pass: core present at TOP and BOTTOM verbatim; trim took the F8-Q9 path against other content. FUTURE.
- WS-02 (F14-WS-02). Input: each seat emits prose / Observe: overlay check runs / Pass: Dispatcher state-restate + next step; Writer file:line + statement headings; Seeker sources + bounded snippets; Expert citations. FUTURE.
- WS-03 (F14-WS-03). Input: output breaches a mechanical rule pre-promotion / Observe: lint runs / Pass: finding REPORTED only; acceptance unaffected. FUTURE.
- WS-04 (F14-WS-03). Input: a lint rule with pilot evidence + user sign-off fires / Observe: gate check runs / Pass: BLOCKED until the violation clears. FUTURE.
- WS-05 (F14-WS-04/05). Input: carved-out spans carry rule-breaking text / Observe: carve-out check runs / Pass: code/paths/errors/quotes verbatim; validation/errors/auth/secrets/deletes complete. FUTURE.
- WS-06 (F14-WS-06). Input: explicit user style instruction conflicts with the core / Observe: override check runs / Pass: output follows the instruction FOR THAT OUTPUT and discloses the override. FUTURE.
- WS-07 (F14-WS-06). Input: a rule forces barbarous wording / Observe: escape-hatch check runs / Pass: rule broken WITH disclosure of which rule and why. FUTURE.
- WS-08 (F14-WS-08). Input: review convenes / Observe: cold-read check runs / Pass: style findings join the review report; non-blocking unless a promoted rule fired. FUTURE.
- WS-09 (F14-WS-01). Input: prompt-core budget breaches with the F8-Q9 trim order invoked / Observe: trim check runs / Pass: core NEVER trimmed — the F12-Q3 set holds; other content trims or parks. FUTURE.
- WS-10 (F14-WS-07). Input: an unverified source offers style text / Observe: admission check runs / Pass: REFUSED for reuse beyond idea-level until the F6-Q4 fetch verifies it permissive. FUTURE.
- WS-11 (F14-WS-03/08). Input: a fully conforming output goes to review / Observe: lint and cold read run / Pass: lint reports zero findings and the cold read passes clean. FUTURE.
- WS-12 (F14-WS-09). Input: a standing preference is set and a one-off override is requested / Observe: disclosure check runs / Pass: standing preference disclosed once at session start and on change, never per output; one-off override carries an in-output disclosure note. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | STYLE source | Stage A / F1–F13 relation |
|---|---|---|
| F14-WS-01 shared core sandwiched top+bottom; required content in the F8-Q7 budget, never trimmed (F12-Q3 set) | STYLE-Q1/Q3/Q5 Agreed 2026-09-23 | F12-Q3 home (untouched); F12-Q7 budget refinement; F8-Q7 authored-prompt + exposure budgets; F8-Q9 trim order (untouched) |
| F14-WS-02 per-seat thin overlays applied (Dispatcher/Writer/Seeker/Expert) | STYLE-Q1 Agreed 2026-09-23 | F1 seat authority (untouched); F10-Q10 snippet bound (untouched) |
| F14-WS-03 deterministic lint detective-first + per-rule promotion ladder; carved-out spans exempt; ENGLISH-ONLY mechanical lint | STYLE-Q1/Q6/Q9/Q10 Agreed 2026-09-23 | F13-Q4/Q5 pilot-evidence + sign-off composition (untouched) |
| F14-WS-04 verbatim carve-out (code/paths/errors/quotes never restyled) | STYLE-Q4 Agreed 2026-09-23 | — |
| F14-WS-05 never-compress carve-out (validation/errors/auth/secrets/deletes) | STYLE-Q3 Agreed 2026-09-23 | honey-for-devs MIT (provenance) |
| F14-WS-06 explicit-instruction override (disclosed, per-output; outranks signed blocking rule for that output) + Orwell escape hatch (disclosed) | STYLE-Q2/Q9 Agreed 2026-09-23 | Orwell six rules (provenance) |
| F14-WS-07 license-gated reuse (F6-Q4 verify-then-admit; asd-ste100 dictionary never copied) | STYLE-Q2 Agreed 2026-09-23 | F6-Q4 (untouched); 4/9 licenses pending |
| F14-WS-08 review-gate cold-read style check at every review (Expert solo; the F16 council at designated reviews) | STYLE-Q1 Agreed 2026-09-23 | F3 review gates (untouched) |
| F14-WS-09 standing vs one-off style-preference disclosure (once at session start/on change; per-output notes for one-offs) | STYLE-Q8 Agreed 2026-09-23 | user-managed config (untouched; only the user creates/changes) |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F14-WS-01; STYLE-Q1/Q3/Q5; F12-Q3) Shared core rides twice (top AND bottom) as required content no trim path removes; sandwich ≈157×2 ≈314 words ≈440 tokens; TOP counts in the authored-prompt budget, BOTTOM in the exposure budget; the band binds one copy; hard-cap breach = refusal → park/escalate.
2. (F14-WS-02; STYLE-Q1/Q7; F1) Each seat adds its thin overlay to the core; artifacts follow the other seven rules plus the Writer overlay.
3. (F14-WS-03; STYLE-Q1/Q6/Q9/Q10; F13) Lint checks mechanical rules and reports only until pilot evidence plus sign-off promotes one rule; carved-out spans exempt; pompous-verb list feeds the lint; lint ENGLISH-ONLY; an explicit instruction outranks a signed blocking rule per output with disclosure.
4. (F14-WS-04; STYLE-Q4) Quoted matter stays exact.
5. (F14-WS-05; STYLE-Q3; honey-for-devs MIT) Safety-critical spans stay whole.
6. (F14-WS-06; STYLE-Q2/Q9; Orwell) User outranks the core per output, Orwell outranks every rule, both only with disclosure.
7. (F14-WS-07; STYLE-Q2; F6-Q4) Borrowed wording waits for license proof; the asd-ste100 dictionary is never copied.
8. (F14-WS-08; STYLE-Q1; F3) Every review cold-reads style (Expert solo; the F16 council at designated reviews); only a promoted rule blocks.
9. (F14-WS-09; STYLE-Q8) Standing preferences disclosed once at session start and on change; one-off overrides carry in-output notes.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Exact banned-phrase list finalization: additions, removals, and per-phrase scope (F14-WS-03) — shapes only, no final list invented here.
2. Lint thresholds: length-cap counting rules (hyphenation, code spans, quotes), list-cap counting, detection mechanics (F14-WS-03) — shapes only, no values invented here.
3. Promotion criteria at the pilot: what evidence quantity and sign-off form promote one rule (F14-WS-03; F13 composition) — shapes only, no criteria invented here.
4. Core wording pending user sign-off: the section 2.1 draft is approvable at spec review — no enforcement wording chosen here.

Implementation probes (runtime evidence before build claims):

1. Sandwich-presence proof: core verbatim at top AND bottom under budget pressure (F14-WS-01).
2. Overlay proof per seat: Dispatcher/Writer/Seeker/Expert behaviors observed (F14-WS-02).
3. Detective-first proof: pre-promotion findings gate nothing (F14-WS-03).
4. Promotion proof: a signed-off rule with pilot evidence blocks (F14-WS-03).
5. Carve-out proof: carved-out spans arrive verbatim and complete (F14-WS-04/05).
6. Disclosure proof: overrides and escape-hatch uses disclose; silent ones fail review (F14-WS-06).
7. Admission proof: unverified-source text refused beyond idea-level (F14-WS-07).
8. Review-gate proof: cold-read style findings join every review report (F14-WS-08).
9. Preference-disclosure proof: standing preferences disclosed once at session start and on change; one-off overrides carry in-output notes (F14-WS-09).

Evidence limitations carried from Stage A:

1. Core wording is UNAPPROVED until spec review — no signed-off text exists yet.
2. All enforcement is UNVERIFIED — probe-verified at build before any gate relies on it.
3. 4/9 style-source licenses pending — reuse beyond idea-level waits for the F6-Q4 fetch.
4. All pilot evidence is FUTURE — nothing measured, nothing promoted.

Measurements recorded 2026-09-23 (corrections pass; no new decisions):

1. Core word-count method: whitespace-separated tokens including rule numerals and dashes. Core = 159 whitespace tokens; prose-only = 151 words. Both hold inside the 150–250 band.
2. Per-overlay meter (measured 2026-09-23): Dispatcher 23, Writer 21, Seeker 20, Expert 20 words. Disclosed bound: each overlay holds at most 30 words. Unit clarification: drafted overlay bounds are in WORDS; at build the meter enforces in TOKENS — the F8-Q7 budget's unit — with the token bound recorded in the build pin.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: style checks consume NO review budget and reset none — F1 task budgets (initial + at most two repair/re-review cycles) and the ONE shared integration budget stand unchanged by style findings; an exhausted task failure is never repaired inside a style re-check window, and approvals are never bypassed by style work.

Question map (all Agreed 2026-09-23; paraphrase, not user quotes):

- STYLE-Q1 — Shared always-on core (150–250 words) sandwiched top+bottom in the F12-Q3 re-injection set + per-seat thin overlays + deterministic lint (detective-first; promotion to blocking only on pilot evidence) + review-gate cold read; rewrite passes and skill-only enforcement rejected. (Normative: F14-WS-01/02/03/08.)
- STYLE-Q2 — Source stack: Strunk & White + Orwell six + STE subset (20/25-word caps, one instruction per sentence, one word one meaning) + ISO 24495-1 four principles; NOT AP/Chicago; Orwell rule-6 escape hatch. (Normative: F14-WS-06.)
- STYLE-Q3 — 8-rule core content: lead with result/action; active simple tenses; prefer simple verbs + banned pompous verbs (utilize, leverage, facilitate, commence, delve, similar), one word one meaning; 20/25 caps; no preamble/recap/closer/em-dash/not-X-its-Y/rule-of-three/throat-clearing; one topic per paragraph (≤6) with lists capped at 5; conversational-only restate state + one concrete next; verbatim code/paths/errors/quotes; accuracy beats brevity; honey-for-devs never-compress carve-out. (Normative: F14-WS-01/05.)
- STYLE-Q4 — Scope: ALL agent-authored prose (chat, docs, comments, commit messages) + verbatim carve-out + Writer technical overlay (file:line, one thought per paragraph, headings as statements). (Normative: F14-WS-02/04.)
- STYLE-Q5 — Sandwich double-count arithmetic (band-quotable): core ≈157 words × 2 ≈ 314 words ≈ 440 tokens. Accounting: TOP copy counts in the F8-Q7 authored-prompt budget; BOTTOM copy counts in the whole-prompt exposure budget (F8-Q7's disclosed second layer). The 150–250 band binds the core TEXT (one copy), not its instances. Joint hard-cap (1000) breach of required content (core + overlays + seat instructions + re-injection set) = build refusal → F8-Q9 park/escalate — never a silent trim. The band's single-injection fix was REJECTED (it would relitigate the approved sandwich). (Normative: F14-WS-01.)
- STYLE-Q6 — Rule 3 recast: the closed verb list becomes prefer-simple-verbs + a small banned-pompous-verbs list (utilize, leverage, facilitate, commence, delve, and similar) while keeping one-word-one-meaning. The banned-pompous list feeds the lint. (Normative: F14-WS-01/03.)
- STYLE-Q7 (clarified) — Rule 7 scoped to CONVERSATIONAL output only (chat messages to the user). Artifacts (durable written outputs: docs, comments, commit messages) follow the other seven rules plus the Writer overlay. One style overall. (Normative: F14-WS-01/02.)
- STYLE-Q8 (clarified) — Standing user style preferences live in user-managed config (persistent until the user revokes by instruction; only the user creates/changes them) and are disclosed ONCE at session start and on change — never per output. One-off overrides apply per output with an in-output disclosure note. Distinction = surprise: standing settings are visible up front; one-off deviations get per-output notes. (Normative: F14-WS-09.)
- STYLE-Q9 — An explicit user instruction outranks a user-signed promoted blocking lint rule FOR THAT OUTPUT (disclosed); the lint finding still records. (Normative: F14-WS-03/06.)
- STYLE-Q10 — Natural-language prose in any language is in scope (principles apply); the mechanical lint is ENGLISH-ONLY (named limitation); machine/structured formats (JSON, code, config) are out of style scope. (Normative: F14-WS-03.)

User notes / delta: F14 is the first user-notes mini-project (later-list notes 2026-09-23) — it adds a feature spec without moving any prior decision: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7 all stand; this spec cross-references, never re-decides. Awaiting USER approval of this draft; Horowitz + band review follow per the per-feature flow.

## 9. Provenance (tgo-im6j wave 2 + Semantic-Anchors anchor; quoted values with sources)

- "drift within 8 rounds" — writing-style research wave (tgo-im6j): unanchored long-turn style drifts inside ~8 rounds without re-injection; hence the always-on sandwich, not post-hoc cleanup.
- "attention −27–48% over turns" — attention-control source (MIT): measured attention decay across turns; hence per-turn re-injection rather than front-load-only.
- "ICLR26 −39% multi-turn" — ICLR26 multi-turn finding via the research wave: −39% multi-turn degradation; hence the restate-state rule (WS-07 / rule 7).
- "repetition +15–20%" — repetition finding via the research wave: +15–20% repetition without constraints; hence caps (list cap 5, paragraph cap 6, 20/25-word caps).
- "position first-200-tokens 94% vs middle 71%" — position finding via the research wave: first-200-token recall 94% vs middle 71%; hence core at TOP plus repetition at BOTTOM (the sandwich).
- "skill self-activation 0/10 (Caveman 8.5% vs 65% claimed)" — skill-activation finding via the research wave: observed 0/10 self-activation (Caveman 8.5% measured vs 65% claimed); hence STYLE-Q1 rejects skill-only enforcement — the core rides in the prompt, not in an on-demand skill.
- "concision ≠ cost saving" — cost finding via the research wave: concision alone does not save cost; hence the never-compress carve-out stays complete even under budget pressure.

Sources: asd-ste100-skill MIT (ste-lint.py reference; dictionary NOT copied — copyright); attention-control MIT; elements-of-style-for-agents CC0; honey-for-devs MIT (never-compress carve-out); headroom Apache-2.0 (style note at END of system prompt for cache hits — sandwich bottom placement); Semantic-Anchors plain-english-strunk-white anchor Apache-2.0 + Pullum critique noted (Strunk & White adopted with the critique on record).

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13 digests and the F14 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame cross-referenced here (no re-decision here).
- `../MANIFEST.md` — license-gated reuse per F6-Q4 cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; style-source licenses and enforcement stay open there.
- `README.md` — Stage B index; this is feature 14 of 14, drafted awaiting review.
