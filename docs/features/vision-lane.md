# Feature F17 — Vision lane (Dispatch)

Status: drafted 2026-09-24; F17-Q1..Q5 + band corrections applied 2026-09-24; awaiting Horowitz re-check + user approval; implementation unverified; all scenarios FUTURE. Requirements F17-VL-01 … F17-VL-11 drafted 2026-09-24. No implementation, installs, code, commits, or pushes. Seventeenth Stage B feature spec (PRIMARY SPEC still DEFERRED pending user notes). All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled F17-Q1–F17-Q5 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16 requirements stand untouched; no cross-feature amendment.

## 0. Objective

Define the vision lane: who reads images (the judgment seat when multimodal, otherwise the Seeker as designated eyes under an independence guard), how vision capability is pinned per preset, the two-path eyes flow (direct read vs bounded Seeker consult), the evidence standing of the eyes' description, the vision-work classes and no-scope boundaries, budget/ceiling accounting, failure semantics that park with disclosure and never fabricate, runtime seat availability, and the description's epistemic standing plus its challenge path. (F17-Q1..Q5 all Agreed 2026-09-24.)

Stable requirement IDs `F17-VL-01` … `F17-VL-11`. Sources trace to settled F17-Q1–F17-Q5 (all Agreed 2026-09-24) plus F1Q11 (global-8 ceiling), amendment-B/F1 consult precedent, F1-AR-13 (injection guard), F3-SD-04a (park lifecycle), F5-Q2 (infrastructure retry allowance), F7 (live picker build pins), F10 (donsetch/document-text boundary), F11-DM-02 (source-carry rule), and the TGO vision-routing discrepancy plus tgo-im6j wave-3 Observer inventory provenance; mappings are multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (eyes seat, pins, flow, evidence standing, classes, budgets, failure only):

1. Eyes-seat rule and independence guard: judgment seat reads when multimodal, Seeker is the designated eyes otherwise; the Writer never describes its own rendered work for verification (section 2.1).
2. Vision-capable pin rule: at least one of Dispatcher/Seeker vision-capable in every preset, both preferred (section 2.2).
3. Eyes-flow mechanics: direct read vs bounded consult with structured return (section 2.3).
4. Evidence/provenance standing of the eyes' description (section 2.4).
5. Vision-work classes, intake sources, and no-scope boundaries (section 2.5).
6. Budget/ceiling accounting for both paths (section 2.6).
7. Failure semantics: one bounded retry, then park with disclosure, never fabricated (section 2.7).
8. Runtime seat availability: vision work parks with disclosure when no vision-capable seat is available at runtime; a designated review of visual evidence with no eyes blocks (section 2.8).
9. Epistemic standing of the description as a revisable best reading plus the challenge path (section 2.9).
10. Control classification of the above by actual function.
11. Question map and provenance record (section 8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Per-seat model assignment and SKU pins — F7 owns (live picker); here only the vision-flag build-pin composition holds (section 7 item 1).
2. Specialist-invocation budgets and the machine-wide ceiling — F1 owns (F1Q10/Q50 budgets, F1Q11 global 8); here only the count-the-consult composition holds.
3. Infrastructure retry allowance — F5 owns (F5-Q2); here only the one-retry composition holds.
4. Park lifecycle — F3 owns (F3-SD-04a/BQ1); here only the park-with-disclosure composition holds.
5. Document text extraction — F10 owns (donsetch adapter); here only the text-vs-visual class boundary holds.
6. Source-carry through envelopes and summarization — F10/F11 own (F11-DM-02); here only the description-rides-along composition holds.
7. Structured-description field shape, image size/format bounds, consult token bound — downstream engineering owns, never chosen here (section 7).
8. Injection guard — F1 owns (F1-AR-13); here only the image-surfaced-text evidence-only composition holds.

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Per-SKU vision flags, image size/format bounds, description field shapes, or token bounds — all section 7 pins, never asserted here.
3. Web image search, image generation/editing, video handling, or OCR-engine replacement — out of scope, refused (section 2.5).
4. Any claim that the Dispatcher reads images, the Seeker consults, or sections 2–3 are enforced at runtime. Proof is future work.
5. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Eyes seat (F17-Q1)

- F17-VL-01 — THE EYES SEAT: the TGO shape — the judgment seat reads images when multimodal, plus a designated eyes seat otherwise. The Dispatcher reads images DIRECTLY when its model is multimodal (the frontier path, no routing). Otherwise the designated eyes is the SEEKER. Three reasons on record: (1) the TGO routing discrepancy (see provenance, section 8 — the current TGO encoding routes vision to the researcher seat while the user's note recalled the implementer; the DECISION is Seeker per this Q1 answer); (2) the INDEPENDENCE GUARD — the Writer never describes its own rendered work for verification (self-review risk); (3) observe-and-report is research-shaped work. (F17-Q1 Agreed 2026-09-24.)
- F17-VL-02 — NO FIFTH OBSERVER SEAT: the four-seat roster plus the F16 council mode stand. No dedicated Observer seat is created for vision work; the eyes function rides the existing seats per F17-VL-01. (F17-Q1 Agreed 2026-09-24.)

### 2.2 Vision-capable pins (F17-Q2)

- F17-VL-03 — VISION-CAPABLE PINS: at least ONE of Dispatcher/Seeker is vision-capable in every preset (both preferred). A preset with neither Dispatcher nor Seeker vision-capable is a pin violation and the vision lane refuses. Per-SKU vision flags are BUILD-PIN FACTS via the F7 live picker — none named or asserted here (section 7 item 1). (F17-Q2 Agreed 2026-09-24.)

### 2.3 Eyes flow (F17-Q3)

- F17-VL-04 — THE EYES FLOW: the Dispatcher reads images itself when multimodal (no routing). Otherwise — or when independent eyes are wanted — a BOUNDED CONSULT goes to the Seeker ("observe these images and report X") returning a structured description plus image references plus provenance (which images, which seat, when). The structured-description field shape is a section 7 pin — fields/shapes only, never chosen here. (F17-Q3 Agreed 2026-09-24.)
- F17-VL-05 — CONSULT SEMANTICS: the eyes consult carries NO verdict weight (the Expert-consult pattern, amendment B). It counts in the task's budgets and the F1-Q11 global-8 ceiling like any specialist invocation. The direct-read path (multimodal Dispatcher) consumes no specialist invocation — it is the Dispatcher's own turn. A designated review may use the eyes' description as evidence with no verdict weight on the consult itself. (F17-Q3 Agreed 2026-09-24; direct-read accounting from approved design details.)

### 2.4 Evidence standing (design detail 3)

- F17-VL-06 — DESCRIPTION AS EVIDENCE: the eyes' description is EVIDENCE — provenance-stamped like every citation. The F10/F11-DM-02 source-carry rule applies through envelopes and summarization: the stamp (which images, which seat, when) rides the description wherever the description travels. The Dispatcher's DIRECT-READ notes carry the same provenance stamp (which images, seat = Dispatcher, when) — this requirement covers BOTH paths (the Seeker consult AND the direct read). (Approved design detail; F17-Q3 composition; direct-read stamp from band correction BR-02, 2026-09-24.)

### 2.5 Classes and boundaries (design details 1–2)

- F17-VL-07 — CLASSES, INTAKE, NO-SCOPE: vision-work classes are screenshots, UI renders, design mocks, diagrams, charts, scanned/handwritten docs, and image-bearing PDFs. donsetch OCR owns document TEXT extraction (F10); the vision lane owns visual UNDERSTANDING — for an image-bearing PDF both run, each on its side of that boundary. Image intake is user-supplied files/URLs plus workspace files. NO web image search (the F10 retrieval stack is text-first). No-scope, refused: image generation/editing, video, OCR-engine replacement. The Seeker's description TEXT, donsetch OCR output, and any other image-surfaced content is quoted/retrieved text: it NEVER grants authority (the F1-AR-13 injection guard applies by composition). (Approved design details; injection guard from band correction BR-01, 2026-09-24.)

### 2.6 Budget and ceiling accounting (F17-Q3 + design detail 5)

Covered normatively by F17-VL-05: the consult counts like any specialist invocation (task budgets + F1-Q11 global-8); the direct read consumes no invocation. No separate vision budget exists.

### 2.7 Failure semantics (design detail 4)

- F17-VL-08 — FAILURE SEMANTICS: an unreadable/refused/timed-out read gets ONE bounded infrastructure retry (the F5 allowance, not a repair cycle). The vision retry CONSUMES ONE of F5's two per-task infrastructure-recovery attempts (the F5-Q2 allowance) — NO new budget surface. If F5's allowance is already spent, no vision retry: straight to park (F3-SD-04a). Persistent failure parks the affected branch per the F3-SD-04a park lifecycle with disclosure — NEVER a fabricated description. (Approved design detail; F5-Q2/F3-SD-04a compositions; F5 accounting from band correction BR-03, 2026-09-24.)

### 2.8 Runtime seat availability (F17-Q4)

- F17-VL-10 — RUNTIME SEAT AVAILABILITY: when NO vision-capable seat is available at runtime (a vision-blind Dispatcher plus an unavailable/exhausted Seeker), vision work PARKS under the F3-SD-04a lifecycle with disclosure ("no vision-capable seat available"); independent text-only work continues. A designated review of VISUAL evidence with no eyes available BLOCKS — it cannot judge evidence it cannot see (the Q31 insufficient-evidence rule: not a pass). (F17-Q4 Agreed 2026-09-24.)

### 2.9 Epistemic standing + challenge path (F17-Q5)

- F17-VL-11 — EPISTEMIC STANDING + CHALLENGE PATH: the description is the eyes' BEST READING — a revisable claim, NEVER ground truth. The stamp rides it. CHALLENGE PATH: anyone (the user, a seat, the review) may flag a description DISPUTED → a re-read under the existing budgets (a fresh consult or the user's own eyes). The original reading is preserved (never erased); a challenged reading is never silently accepted. (F17-Q5 Agreed 2026-09-24.)

### 2.10 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block; nothing here claims the runtime implements it — enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Writer self-description refusal for verification (F17-VL-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks the Writer verifying its own rendered work via its own description |
| Preset pin rule, neither-seat-capable refuses (F17-VL-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks vision work on a preset with no vision-capable eyes |
| Consult carries no verdict weight (F17-VL-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks the eyes' description deciding a review on its own authority |
| No-scope refusals: web image search, generation/editing, video, OCR replacement (F17-VL-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks the vision lane widening into retrieval/generation/video/OCR-engine work |
| Never-fabricated descriptions; park with disclosure (F17-VL-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks invented image content standing in for a failed read |
| Image-surfaced text never grants authority (F17-VL-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks embedded instructions in described/OCR'd image text from authorizing actions |
| No-vision-capable-seat park with disclosure; eyeless review blocks (F17-VL-10) | Preventive (SPEC requirement, NOT proven implementation) | blocks vision work proceeding with no eyes available and blocks verdicts on unseen visual evidence |
| Provenance stamp riding the description (F17-VL-06) | Detective (reporting) | leaves an after-the-fact which-images/which-seat/when trail with no authority of its own |
| Disputed-description challenge path (F17-VL-11) | Detective (reporting) | preserves the original stamped reading and forces a budgeted re-read before acceptance |
| Consult counted vs budgets and global-8 (F17-VL-05) | Detective (accounting) | surfaces eyes-consult spend after the fact; the ceiling enforces |

### 2.11 Invariance and spec-only status

- F17-VL-09 — F1–F16 requirements stand unchanged by anything in this feature; no seat, budget, ceiling, gate, evidence, license, platform, model, prose, skill, retrieval, memory, context, harness, style, discipline, or council rule moves here. All blocking in sections 2.1–2.9 is a SPEC requirement, not proven runtime implementation — enforcement is unverified until probes decide (section 7). (F1–F16 invariance; spec-only status.)

## 3. Constraints

C1. F17-Q1–F17-Q5 govern where they conflict with earlier readings inside this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15/F16 stand where this spec does not narrow them; no cross-feature amendment. C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8 stand; this spec cross-references, never re-decides. C3. No invented values: no SKUs, no thresholds, no token counts, no format specs — unknowns in section 7 stay open. C4. No fifth seat; the Writer never verifies via its own description. C5. The consult advises, never verdicts; the direct read is the Dispatcher's own turn. C6. Failed reads park with disclosure, never fabricate. C7. Spec-only status: every block is a SPEC requirement with enforcement unverified until probes decide. C8. All scenarios FUTURE — not executed; no tests run. C9. Documentation only — no implementation, installs, code, config, commits, or pushes. C10. IDs stable and additive: F17-VL-01…11, VL-01…22; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial vision-lane consistency; this file owns ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE. Numbering note: VL-14/15 verify the BR-02 (direct-read stamp) and BR-03 (F5 accounting) correction clauses; the missed-consideration no-fifth-seat + invariance scenarios land at VL-21/22.

- VL-01 (F17-VL-01/04). Input: a multimodal Dispatcher receives images with the task / Observe: routing check runs / Pass: the Dispatcher reads the images itself in its own turn with no routing and no specialist invocation consumed. FUTURE.
- VL-02 (F17-VL-01/04). Input: a vision-blind Dispatcher receives images / Observe: routing check runs / Pass: a bounded consult goes to the Seeker ("observe these images and report X"); the Dispatcher does not read the images itself. FUTURE.
- VL-03 (F17-VL-04). Input: the Seeker completes an eyes consult / Observe: return-packet check runs / Pass: a structured description plus image references plus provenance (which images, which seat, when) returns; a description without refs or provenance refused. FUTURE.
- VL-04 (F17-VL-06). Input: the eyes' description enters an envelope and a summarization pass / Observe: stamp-carry check runs / Pass: the provenance stamp rides the description through both, per the F10/F11-DM-02 source-carry rule; the Dispatcher's direct-read notes carry the same stamp (which images, seat = Dispatcher, when); a stripped description refused. FUTURE.
- VL-05 (F17-VL-01). Input: the Writer is asked to describe its own rendered UI work for verification / Observe: independence-guard check runs / Pass: refused — the Writer never describes its own rendered work for verification; the eyes seat reads instead. FUTURE.
- VL-06 (F17-VL-03). Input: a preset pins neither Dispatcher nor Seeker vision-capable and vision work arrives / Observe: pin check runs / Pass: pin violation refused; no unflagged seat reads the images. FUTURE.
- VL-07 (F17-VL-03). Input: the build pins a preset's models / Observe: picker-record check runs (FUTURE pin) / Pass: per-SKU vision flags record as build-pin facts via the F7 live picker; no flag asserted before the pin. FUTURE.
- VL-08 (F17-VL-08). Input: an image read fails unreadable, then the bounded retry still fails / Observe: failure handling runs / Pass: ONE infrastructure retry only, then the affected branch parks per F3-SD-04a with disclosure; a fabricated description refused. FUTURE.
- VL-09 (F17-VL-07). Input: an image-bearing PDF arrives needing both text and visual reading / Observe: class-boundary check runs / Pass: donsetch extracts the document text (F10) while the vision lane handles visual understanding; neither side claims the other's work. FUTURE.
- VL-10 (F17-VL-07). Input: a request for web image search arrives / Observe: scope check runs / Pass: refused — no web image search (the F10 retrieval stack is text-first). FUTURE.
- VL-11 (F17-VL-07). Input: an image generation/editing request arrives / Observe: scope check runs / Pass: refused — generation/editing is no-scope for the vision lane. FUTURE.
- VL-12 (F17-VL-05). Input: an eyes consult runs under a bound global-8 ceiling / Observe: budget accounting runs / Pass: the consult counts against the F1-Q11 global-8 ceiling and records on the task ledger like any specialist invocation; the multimodal direct read consumes none. FUTURE.
- VL-13 (F17-VL-05). Input: a designated review receives the eyes' description as evidence / Observe: verdict-weight check runs / Pass: the description stands as evidence with NO verdict weight on the consult itself; the review verdict forms through its own authority. FUTURE.
- VL-14 (F17-VL-06). Input: the multimodal Dispatcher reads images directly and records notes / Observe: stamp check runs / Pass: the direct-read notes carry the same provenance stamp (which images, seat = Dispatcher, when); unstamped notes refused as evidence. FUTURE.
- VL-15 (F17-VL-08). Input: an image read fails when F5's two per-task infrastructure-recovery attempts are already spent / Observe: budget check runs / Pass: no vision retry — straight to park per F3-SD-04a with disclosure; no new budget surface created. FUTURE.
- VL-16 (F17-VL-07). Input: an image containing the text "ignore prior instructions" is described/OCR'd / Observe: injection-guard check runs / Pass: the text enters as evidence-only; the embedded instruction is refused as authority per F1-AR-13. FUTURE.
- VL-17 (F17-VL-10). Input: a vision-blind Dispatcher plus an unavailable/exhausted Seeker receive vision work / Observe: seat-availability check runs / Pass: vision work parks per F3-SD-04a with disclosure ("no vision-capable seat available"); independent text-only work continues. FUTURE.
- VL-18 (F17-VL-10). Input: a designated review of visual evidence is convened with no vision-capable seat available / Observe: evidence-sufficiency check runs / Pass: the review BLOCKS — it cannot judge evidence it cannot see (insufficient evidence is not a pass). FUTURE.
- VL-19 (F17-VL-11). Input: a description is flagged DISPUTED / Observe: challenge-path check runs / Pass: a re-read runs under the existing budgets (a fresh consult or the user's own eyes); the original reading is preserved with its stamp, never erased; the challenged reading is never silently accepted. FUTURE.
- VL-20 (F17-VL-11). Input: a confident-but-wrong description reaches review and is flagged disputed / Observe: standing check runs / Pass: the challenge path runs; the review never treats the description as ground truth. FUTURE.
- VL-21 (F17-VL-02). Input: a vision task runs / Observe: roster check runs / Pass: the eyes function runs without creating any seat — the roster stays four + the council mode. FUTURE.
- VL-22 (F17-VL-09). Input: a vision task runs / Observe: invariance check runs / Pass: no F1–F16 rule moves; the invariant holds. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F17 source | F1–F16 relation |
|---|---|---|
| F17-VL-01 eyes seat: judgment seat reads when multimodal, Seeker designated otherwise; three reasons (routing discrepancy, independence guard, research-shaped work) | F17-Q1 Agreed 2026-09-24 | Four-seat roster (untouched); TGO discrepancy provenance (section 8) |
| F17-VL-02 no fifth Observer seat; four-seat roster + F16 council stand | F17-Q1 Agreed 2026-09-24 | F16 council mode (untouched) |
| F17-VL-03 vision-capable pins: ≥1 of Dispatcher/Seeker per preset, both preferred; neither-capable refuses; per-SKU flags are F7 build-pin facts | F17-Q2 Agreed 2026-09-24 | F7 live picker (F7 owns pins) |
| F17-VL-04 eyes flow: direct read when multimodal; else bounded Seeker consult returning structured description + refs + provenance | F17-Q3 Agreed 2026-09-24 | Delegation-envelope pattern (composed, untouched) |
| F17-VL-05 consult has no verdict weight; counts vs task budgets + global-8; direct read consumes no invocation; designated review may use description as evidence | F17-Q3 Agreed 2026-09-24; direct-read accounting from approved design details | Amendment-B/F1 Expert-consult pattern; F1Q11 ceiling (composed, untouched) |
| F17-VL-06 description is provenance-stamped evidence; F10/F11-DM-02 source-carry through envelopes and summarization | Approved design detail; F17-Q3 composition | F10/F11-DM-02 (composed, untouched) |
| F17-VL-07 classes (screenshots, renders, mocks, diagrams, charts, scans, image PDFs); donsetch owns text, lane owns visual; intake user files/URLs + workspace files; no web search; generation/editing, video, OCR replacement refused | Approved design details | F10 donsetch/text-first stack (composed, untouched) |
| F17-VL-08 one bounded infrastructure retry (F5, not repair) consuming one F5-Q2 attempt, spent allowance means no retry; persistent failure parks per F3-SD-04a with disclosure; never fabricated | Approved design detail; band correction BR-03 | F5-Q2 allowance; F3-SD-04a park (composed, untouched) |
| F17-VL-09 F1–F16 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR … F16-RC; section 7 probes |
| F17-VL-10 runtime seat availability: no vision-capable seat at runtime parks vision work per F3-SD-04a with disclosure, text-only work continues; eyeless designated review of visual evidence blocks | F17-Q4 Agreed 2026-09-24 | F3-SD-04a park; Q31 insufficient-evidence rule (composed, untouched) |
| F17-VL-11 description is the eyes' revisable best reading, never ground truth; stamp rides it; anyone may flag DISPUTED → budgeted re-read, original preserved | F17-Q5 Agreed 2026-09-24 | Existing task budgets (composed, untouched) |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F17-Q1; F17-VL-01) Images go to the judgment seat when it can see, otherwise to the Seeker — kept honest by the recorded routing discrepancy, the Writer's self-review ban, and the research shape of the work.
2. (F17-Q1; F17-VL-02) No new seat exists for eyes work; the four seats and the council mode cover it.
3. (F17-Q2; F17-VL-03; F7) Every preset keeps at least one seeing eyes (both preferred); the per-model flags pin at build, never here.
4. (F17-Q3; F17-VL-04) A seeing Dispatcher reads in its own turn; otherwise the Seeker reports back structure, references, and provenance.
5. (F17-Q3; F17-VL-05; F1) The consult advises without verdict force and bills like any specialist call; the direct read bills nothing.
6. (Design; F17-VL-06; F10/F11) The description travels as stamped evidence and keeps its stamp through every envelope and summary.
7. (Design; F17-VL-07; F10) The lane understands pictures across seven classes while donsetch keeps the text; search, generation, video, and OCR engines stay outside.
8. (Design; F17-VL-08; F5/F3) A failed read retries once inside F5's two-attempt allowance, then parks openly; invented descriptions never substitute.
9. (Derived; F17-VL-09) F1–F16 rules do not move for vision work, and every block here awaits probe proof.
10. (F17-Q4; F17-VL-10; F3) With no seeing seat at runtime, vision work parks openly while text-only work continues; an eyeless review of visual evidence blocks rather than passes.
11. (F17-Q5; F17-VL-11) The description is a revisable best reading, never ground truth; anyone may flag it disputed to force a budgeted re-read, original preserved.

## 7. Downstream unresolved contracts (not decided here)

Open items only — no invented values:

1. Per-SKU vision flags build pin: exact per-model vision capability flags named at build via the F7 live picker — no SKU named here.
2. Structured-description shape: the consult return's fields and shapes (description, image references, provenance) — shapes only, no field list chosen here.
3. Image size/format bounds build pin: maximum image size, accepted formats, and page/attachment bounds named at build — no bound asserted here.
4. Consult token bound shape: the bounded consult's budget envelope shape (input images plus return description) — shape only, no count chosen here.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: the eyes consult consumes NO review budget and resets none — F1 task budgets (initial plus at most two repair/re-review cycles) and the ONE shared integration budget stand unchanged by eyes consults; the consult counts as a specialist invocation against the task ledger and the F1-Q11 global-8 ceiling; the multimodal direct read consumes no invocation at all. The vision retry consumes ONE of F5's two per-task infrastructure-recovery attempts (the F5-Q2 allowance) — no new budget surface; a spent allowance means no vision retry, straight to park per F3-SD-04a. An exhausted budget escalates instead of consulting, and approvals are never bypassed by vision work.

Question map (F17-Q1..Q5 all Agreed 2026-09-24; paraphrase, not user quotes):

- F17-Q1 — THE EYES SEAT: the TGO shape — the judgment seat reads images when multimodal plus a designated eyes seat otherwise. SEEKER is the designated eyes. Three reasons on record: (1) the TGO routing discrepancy, (2) the INDEPENDENCE GUARD — the Writer never describes its own rendered work for verification (self-review risk), (3) observe-and-report is research-shaped work. The Dispatcher reads images DIRECTLY when its model is multimodal (the frontier path, no routing). NO fifth Observer seat (the four-seat roster + the F16 council mode stand). (Normative: F17-VL-01/02.)
- F17-Q2 — VISION-CAPABLE PINS: at least ONE of Dispatcher/Seeker must be vision-capable in every preset (both preferred). Per-SKU vision flags are BUILD-PIN FACTS via the F7 live picker — none named or asserted here (section 7 item 1). (Normative: F17-VL-03.)
- F17-Q3 — THE EYES FLOW: the Dispatcher reads images itself when multimodal (no routing). Otherwise — or when independent eyes are wanted — a BOUNDED CONSULT to the Seeker ("observe these images and report X") returning a structured description + image references + provenance (which images, which seat, when). Consult semantics: NO verdict weight (like Expert consult); counted in the task's budgets + the F1-Q11 global-8 ceiling like any specialist invocation. (Normative: F17-VL-04/05.)
- F17-Q4 — RUNTIME SEAT AVAILABILITY: when NO vision-capable seat is available at runtime (a vision-blind Dispatcher plus an unavailable/exhausted Seeker), vision work PARKS under the F3-SD-04a lifecycle with disclosure ("no vision-capable seat available"); independent text-only work continues. A designated review of VISUAL evidence with no eyes available BLOCKS — it cannot judge evidence it cannot see (the Q31 insufficient-evidence rule: not a pass). (Normative: F17-VL-10.)
- F17-Q5 — EPISTEMIC STANDING + CHALLENGE PATH: the description is the eyes' BEST READING — a revisable claim, NEVER ground truth. The stamp rides it. CHALLENGE PATH: anyone (the user, a seat, the review) may flag a description DISPUTED → a re-read under the existing budgets (a fresh consult or the user's own eyes). The original reading is preserved (never erased); a challenged reading is never silently accepted. (Normative: F17-VL-11.)

Scope clarity: this spec is a documentation-lane draft (the per-feature flow); it ran council band review (CONCERNS 2/3 → corrections BR-01..05 applied 2026-09-24) plus F17-Q4/Q5 answers.

User notes / delta: F17 adds a feature spec without moving any prior decision: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4, F16-Q1–F16-Q8 all stand; this spec cross-references, never re-decides. F17-Q1..Q5 + band corrections applied 2026-09-24; awaiting Horowitz re-check + user approval.

Provenance (TGO vision-routing discrepancy + tgo-im6j wave-3 Observer inventory + F1 consult precedent):

- TGO vision-routing discrepancy, recorded honestly: the user's note recalled the implementer (Writer/Dylan) as the seat that reads images, while the current TGO encoding routes vision to the researcher seat. The DECISION per F17-Q1 is Seeker (the research-shaped-work and independence-guard reasons govern); the recall-vs-encoding mismatch stands as provenance, not as a second reading.
- oh-my-opencode-slim Observer inventory (tgo-im6j wave 3): inventoried Observer shape considered and REFUSED — no fifth seat (F17-VL-02) — provenance only, no values imported.
- F1 precedent: the Expert consult/review split (amendment B — advisory consults carry no verdict weight), the delegation envelope pattern behind the bounded consult (F1Q13), and the global-8 ceiling the consult counts against (F1Q11) — composed, never re-decided.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1–F16 digests and the F17 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame cross-referenced here (no re-decision here).
- `../MANIFEST.md` — live-picker model pinning per F7 cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; per-SKU vision flags, description shape, image bounds, consult bound, and enforcement gaps stay open there.
- `README.md` — Stage B index; this is feature 17 of 17, drafted awaiting review.
