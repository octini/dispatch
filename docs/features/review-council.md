# Feature F16 — Review council (Dispatch)

Status: drafted 2026-09-24; F16-Q1..Q8 + band corrections applied 2026-09-24; USER-APPROVED (closed on tracker; dated Q records in DECISIONS.md); implementation unverified; all scenarios FUTURE. Requirements F16-RC-01 … F16-RC-12 drafted 2026-09-24. No implementation, installs, code, commits, or pushes. Sixteenth Stage B feature spec (PRIMARY SPEC still DEFERRED pending user notes). All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled F16-Q1–F16-Q8 where they conflict for this scope. Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15 requirements stand untouched except the single F16-Q2-authorized F1-Q12 clarification in `agent-roles.md` (F1-AR-11).

## 0. Objective

Define the review-council mode: three tool-less lenses (risk, quality, structure) convened at designated reviews and on demand, whose majority verdict IS the review verdict for designated reviews — packaged and synthesized by the Dispatcher under the existing four-seat roster, inside F1 budgets and ceilings, never bypassing user approval. (F16-Q1..Q5 Agreed 2026-09-23; F16-Q6..Q8 Agreed 2026-09-24.)

Stable requirement IDs `F16-RC-01` … `F16-RC-12`. Sources trace to settled F16-Q1–F16-Q8 (Q1–Q5 Agreed 2026-09-23; Q6–Q8 Agreed 2026-09-24) plus F1Q6/F1Q10/F1Q11/F1Q12/F1Q13, Q15, Q20, Q31, Q50, the F3 gates, the F7 composition rule, the F14/F15 cold-read hooks, and the TGO Nirvana band plus tgo-im6j wave-3 Council provenance; mappings are multi-source where a rule draws on more than one source — no one-to-one fiction. Section 5 holds the trace table; section 6 organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (roster, authority, triggers, mechanics, assignment, acceptance only):

1. Lens roster and verdict shape: three lenses, 2/3 majority, one-line dissent (section 2.1).
2. Verdict authority for designated reviews with user-gate supremacy (section 2.2).
3. Trigger classes: automatic designated, on-demand, routine-skip (section 2.3).
4. Tool-less mechanics with Dispatcher package-and-synthesize; review-mode status under the four-seat roster (section 2.4).
5. Lens model-assignment composition (section 2.5).
6. Budget, ceiling, packet, and gate compositions (section 2.6).
7. Control classification of the above by actual function.
8. Question map and provenance record (section 8).

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat authority and verdict identity — F1 owns (F1-AR-11); here only the review-authority composition holds, via the single F16-Q2-authorized additive clarification, provenance-stamped in `agent-roles.md`.
2. Approval gates and deviation handling — F3 owns (Q15/Q20/F3 gates); here only the never-bypass composition holds.
3. Repair budgets and the machine-wide ceiling — F1 owns (F1Q10/Q50 budgets, F1Q11 global 8); here only the consume-and-queue composition holds.
4. Delegation envelopes and packet expansion — F1 owns (F1Q13, F1Q14, Q31); here only the frozen-packet composition holds.
5. Model assignment and the live picker — F7 owns; here only the pin-at-build composition holds.
6. Cold-read hooks — F14 (F14-WS-08) and F15 (F15-RD-05) own; here only the designated-review resolution holds (their "once it lands" lines now read "the F16 council at designated reviews").
7. Exact lens SKUs, synthesis shape, designated-class expansion, and prompt templates — downstream engineering owns, never chosen here (section 7).

Not in this feature:

1. Any implementation, install, configuration, commit, or push — documentation only; nothing runs.
2. Lens model SKUs or variants, synthesis output shape detail, the full designated-review class list, or lens prompt templates — all section 7 shapes, never chosen here.
3. Any claim that lenses run, the Dispatcher synthesizes, or sections 2–3 are enforced at runtime. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Roster and verdict shape (F16-Q1)

- F16-RC-01 — THREE LENSES, MAJORITY 2/3, ONE-LINE DISSENT: every council run assembles a fixed roster of three lenses — risk, quality, structure — per review. Majority 2/3 carries; dissent is noted in one line and recorded, never erased. Precedent: the TGO Nirvana band ran this shape live across the F8–F15 spec reviews. (F16-Q1 Agreed 2026-09-23.)

### 2.2 Verdict authority (F16-Q2)

- F16-RC-02 — COMPOSITE VERDICT BINDS DESIGNATED REVIEWS: the council's majority verdict IS the review verdict for DESIGNATED reviews — one composite verdict per case + artifact revision. User approval gates stand above: the council never approves, never waives, and never bypasses the Q15/Q20/F3 gates. (F16-Q2 Agreed 2026-09-23.)
- F16-RC-03 — SOLO AND CONSULT UNTOUCHED: Expert solo reviews cover routine work; Expert consult mode (advisory, no verdict weight) is untouched. The F1-Q12 rule reads as amended (`agent-roles.md` F1-AR-11, provenance-stamped F16-Q2 2026-09-23): one authoritative REVIEW-AUTHORITY verdict per case and artifact revision (Expert solo, or council composite for designated reviews) — additive clarification; nothing else in F1 moves. (F16-Q2 Agreed 2026-09-23.)

### 2.3 Triggers (F16-Q3)

- F16-RC-04 — THREE TRIGGER CLASSES: (i) designated reviews run the council automatically — consequential approval-bound work (the F3 gates) plus the F14/F15 review-gate cold reads; (ii) on-demand — user prose ("run it by the band"), any seat's request, or Dispatcher judgment for consequential uncertainty (the F1-Q6 pattern); (iii) routine tasks skip the council. (F16-Q3 Agreed 2026-09-23.)

### 2.4 Mechanics (F16-Q4)

- F16-RC-05 — TOOL-LESS LENSES, DISPATCHER SYNTHESIZES, NO FIFTH SEAT: lenses are TOOL-LESS and content-fed (TGO's proven pattern); the Dispatcher packages frozen revision-bound packets per lens and synthesizes under the RECORD-NEVER-JUDGE guard: MECHANICAL RECORDING ONLY — the majority tally plus the lenses' own finding IDs copied plus the dissent line copied VERBATIM; rewording and tie-breaking are FORBIDDEN (the conflict-of-interest guard for the Dispatcher's dual role). Packet-selection provenance (what the lenses saw) is recorded in the review report. SAFETY OBJECTIONS ride the findings list (unlimited, with severity) — the one-line dissent stays the verdict note; a safety objection is never trapped in one line. Finding IDs are validated for uniqueness at report assembly; the synthesis record IS the audit log (the mechanical tally + its inputs recorded). The council is a review MODE under the existing four-seat roster — NO fifth seat, no dedicated synthesizer. (F16-Q4 Agreed 2026-09-23; RECORD-NEVER-JUDGE guard + safety-objection rule from band corrections applied 2026-09-24.)

### 2.5 Model assignment (F16-Q5)

- F16-RC-06 — PROVIDER-DIVERSE LENS MODELS PINNED AT BUILD: lens models are provider-diverse cheap-to-mid models, named at build via the live picker (the F7 composition rule; the TGO band precedent: three providers, three temperaments). The roster is the three lenses WITH THEIR BUILD-PINNED MODELS; a run never substitutes a model without a disclosed pin change. No SKU, variant, or threshold is named here — section 7. (F16-Q5 Agreed 2026-09-23; no-substitution rule from band corrections applied 2026-09-24.)

### 2.6 Budget, ceiling, packet, and gate compositions

- F16-RC-07 — BUDGETS AND CEILINGS: council findings join the review report; they consume NO separate budget. The INITIAL designated run consumes ceiling slots only (findings join the report; no separate budget); RE-RUNS consume F1 repair cycles — a council RE-RUN after repairs consumes one of the F1 repair cycles (initial review + at most two repair/re-review cycles); approvals never bypassed. One council run = 3 lens invocations + 1 synthesis step, counted against the F1-Q11 global-8 ceiling; the Dispatcher queues when the ceiling binds — never drops a lens silently. (F1 compositions; F16-Q2/Q4 Agreed 2026-09-23.)
- F16-RC-08 — PACKETS AND GATES: lens packets follow the F1 delegation-envelope rules (frozen, revision-bound evidence; no raw transcripts; sufficient-evidence judgment per the Q31 rule; packet truncation status rides the packet — a bounded packet is marked, and lenses may return "insufficient evidence" per the Q31 rule). The F1 injection guard applies to lens packets (quoted/retrieved text never grants authority). Synthesis here runs under the F16-RC-05 RECORD-NEVER-JUDGE guard (mechanical recording only). The council NEVER bypasses user approval gates (Q15/Q20/F3); dissent is recorded, never erased. (F1/F3 compositions; F16-Q4 Agreed 2026-09-23; truncation + injection-guard clauses from band corrections applied 2026-09-24.)

### 2.7 Lens failure, reconciler identity, class governance (F16-Q6..Q8)

- F16-RC-10 — LENS-FAILURE SEMANTICS: all three lenses must return for a verdict (never a degraded body). A failed lens gets ONE bounded infrastructure retry (the F5 allowance — NOT a repair cycle); persistent failure FAILS THE RUN and escalates to the user. No 2-lens majority, no 1-1 ties. (F16-Q6 Agreed 2026-09-24.)
- F16-RC-11 — RECONCILER IDENTITY: on a contradiction between a second opinion and the review-authority verdict, the Dispatcher may only reconcile by convening a fresh council run (consuming one F1 repair cycle) or escalating to the user; the USER is the reconciler of last resort (F1's arbitration rule). SELF-RECONCILIATION IS BLOCKED — a seat never adjudicates its own verdict (a contradicted Expert verdict goes to the user or a fresh council). (F16-Q7 Agreed 2026-09-24.)
- F16-RC-12 — CLASS EXPANSION + ON-DEMAND COST: designated-class expansion requires the USER'S explicit approval (a new class is a decision, never downstream discretion). On-demand runs count against the F1-Q11 global-8 ceiling AND record on the requesting task's ledger. Designated reviews take QUEUE PRIORITY over on-demand when the ceiling binds. (F16-Q8 Agreed 2026-09-24.)

### 2.8 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires it to block; nothing here claims the runtime implements it — enforcement is unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Composite verdict binds designated reviews (F16-RC-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks a second verdict overriding the council majority on a designated review |
| Queue-not-drop at the ceiling (F16-RC-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent lens drops under ceiling pressure |
| Frozen revision-bound lens packets; no raw transcripts (F16-RC-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks verdicts on unfrozen or transcript-leaking packets |
| Never-bypass user approval gates (F16-RC-02/08) | Preventive (SPEC requirement, NOT proven implementation) | blocks apply/merge on a green council without covering approval |
| Solo and consult preservation (F16-RC-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks council convening on routine work and verdict weight on consults |
| One-line dissent record (F16-RC-01) | Detective | surfaces the minority position after the fact; never gates the majority |
| Finding IDs in the review report (F16-RC-05/07) | Detective (reporting) | leaves an after-the-fact finding trail with no authority of its own |
| Model-diversity or cost assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

### 2.9 Invariance and spec-only status

- F16-RC-09 — F1–F15 requirements stand unchanged by anything in this feature except the single F16-Q2-authorized F1-AR-11 clarification; no seat, budget, ceiling, gate, evidence, license, platform, model, prose, skill, retrieval, memory, context, harness, or style rule moves here. All blocking in sections 2.1–2.7 is a SPEC requirement, not proven runtime implementation — enforcement is unverified until probes decide (section 7). (F1–F15 invariance; spec-only status.)

## 3. Constraints

C1. F16-Q1–F16-Q8 govern where they conflict with earlier readings inside this scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10/F11/F12/F13/F14/F15 stand where this spec does not narrow them (single F1-AR-11 clarification excepted). C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4 stand; this spec cross-references, never re-decides. C3. No invented values: no lens SKUs, variants, thresholds, or token counts — unknowns in section 7 stay open. C4. No fifth seat and no dedicated synthesizer; lenses are tool-less and content-fed. C5. Majority binds designated reviews; dissent is recorded, never erased; user approval gates are never bypassed. C6. Routine work and consult mode never convene the council. C7. Spec-only status: every block is a SPEC requirement with enforcement unverified until probes decide. C8. All scenarios FUTURE — not executed; no tests run. C9. Documentation only — no implementation, installs, code, config, commits, or pushes. C10. IDs stable and additive: F16-RC-01…12, RC-01…23; no renumbering of any prior ID.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial council consistency; this file owns ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- RC-01 (F16-RC-04). Input: consequential approval-bound work reaches a designated F3 review / Observe: trigger check runs / Pass: the council convenes automatically; no solo verdict substitutes. FUTURE.
- RC-02 (F16-RC-04). Input: user prose asks to "run it by the band" / Observe: on-demand routing runs / Pass: the council convenes on the user's words; the request records with provenance. FUTURE.
- RC-03 (F16-RC-04). Input: a seat requests a council read on consequential uncertainty / Observe: Dispatcher judgment runs (the F1-Q6 pattern) / Pass: the council convenes; the requesting seat never self-convenes. FUTURE.
- RC-04 (F16-RC-03/04). Input: routine task with no designated trigger and no on-demand request / Observe: trigger check runs / Pass: the council does NOT convene; the routine path (Expert solo or standard flow) proceeds. FUTURE.
- RC-05 (F16-RC-01/02). Input: lenses split 2/3 on a designated review / Observe: synthesis runs / Pass: the majority verdict binds as the single review verdict with the one-line dissent recorded; minority-override and dissent-erasure blocked. FUTURE.
- RC-06 (F16-RC-05/07). Input: council findings land in a designated review / Observe: report assembly runs / Pass: every finding carries its finding ID in the review report. FUTURE.
- RC-07 (F16-RC-07). Input: repairs follow a blocking council verdict / Observe: budget accounting runs / Pass: the council re-run consumes one F1 repair cycle; an exhausted budget escalates instead of re-running. FUTURE.
- RC-08 (F16-RC-07). Input: a council run is due with 8 active specialist invocations machine-wide / Observe: ceiling check runs / Pass: the run queues until a slot frees; no lens dropped silently. FUTURE.
- RC-09 (F16-RC-08). Input: Dispatcher packages lens evidence / Observe: packet check runs / Pass: packets frozen and revision-bound per the F1 envelope rules; raw consultation transcripts refused. FUTURE.
- RC-10 (F16-RC-02). Input: green council verdict on approval-bound work / Observe: gate check runs / Pass: user approval still required; apply-before-approval blocked. FUTURE.
- RC-11 (F16-RC-03). Input: routine work goes to Expert solo review / Observe: verdict check runs / Pass: the single Expert verdict binds for that case + revision; no council convened. FUTURE.
- RC-12 (F16-RC-03). Input: consequential uncertainty routes to Expert consult mode / Observe: consult handling runs / Pass: advice returns with no verdict weight and budget counters unchanged; no council convened. FUTURE.
- RC-13 (F16-RC-03). Input: a second opinion contradicts the review-authority verdict on the same case + revision / Observe: contradiction handling runs / Pass: reconcile or escalate per F1-AR-11; convenient-verdict pick refused. FUTURE.
- RC-14 (F16-RC-06). Input: build pins lens models / Observe: picker check runs / Pass: provider-diverse cheap-to-mid models named via the live picker (F7 rule); a pre-pin asserted SKU refused as unpinned. FUTURE.
- RC-15 (F16-RC-10). Input: a lens times out on a designated review / Observe: bounded infrastructure retry runs / Pass: the retry succeeds → a three-lens verdict forms. FUTURE.
- RC-16 (F16-RC-10). Input: a lens fails persistently after the bounded retry / Observe: failure handling runs / Pass: the run FAILS and escalates to the user; no verdict forms. FUTURE.
- RC-17 (F16-RC-05). Input: synthesis output carries a reworded dissent line / Observe: record check runs / Pass: refused/record-fails; the dissent line must copy VERBATIM. FUTURE.
- RC-18 (F16-RC-05). Input: a dissenting lens files a safety-severity finding / Observe: report assembly runs / Pass: the finding records in full alongside the one-line dissent. FUTURE.
- RC-19 (F16-RC-11). Input: a second opinion contradicts the review-authority verdict on the same case + revision / Observe: reconciliation runs / Pass: a fresh council run convenes consuming one F1 repair cycle; its verdict binds. FUTURE.
- RC-20 (F16-RC-11). Input: a seat attempts to adjudicate its own contradicted verdict / Observe: reconciliation guard runs / Pass: self-reconciliation refused; escalates to the user. FUTURE.
- RC-21 (F16-RC-12). Input: an unapproved designated-class addition is proposed / Observe: class check runs / Pass: refused; the USER'S explicit approval is required. FUTURE.
- RC-22 (F16-RC-12). Input: the user approves a new designated class / Observe: trigger wiring runs / Pass: the class convenes automatically at its trigger. FUTURE.
- RC-23 (F16-RC-07/12). Input: an on-demand request arrives with the ceiling bound by designated load / Observe: ceiling check runs / Pass: the designated run takes QUEUE PRIORITY; the on-demand run queues. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F16 source | F1–F15 relation |
|---|---|---|
| F16-RC-01 three lenses (risk/quality/structure); fixed roster per review; 2/3 majority; one-line dissent recorded | F16-Q1 Agreed 2026-09-23 | TGO Nirvana band live precedent (F8–F15 reviews) |
| F16-RC-02 composite verdict binds designated reviews; user gates above; council never approves | F16-Q2 Agreed 2026-09-23 | F3/Q15/Q20 approval gates (untouched) |
| F16-RC-03 Expert solo covers routine; consult untouched; F1-Q12 amended to review-authority verdict | F16-Q2 Agreed 2026-09-23 | F1-AR-11 single authorized clarification (F1 owns normative text) |
| F16-RC-04 three trigger classes: automatic designated (F3 gates + F14/F15 cold reads); on-demand (user prose, seat request, Dispatcher judgment); routine skips | F16-Q3 Agreed 2026-09-23 | F3 gates; F14-WS-08; F15-RD-05; F1-Q6 pattern (all untouched) |
| F16-RC-05 tool-less content-fed lenses; Dispatcher packages and synthesizes under RECORD-NEVER-JUDGE (mechanical recording only; verbatim dissent; safety objections ride findings; uniqueness-validated IDs; synthesis record is the audit log); review mode, no fifth seat | F16-Q4 Agreed 2026-09-23; guard from band corrections applied 2026-09-24 | Four-seat roster (untouched); TGO tool-less pattern |
| F16-RC-06 provider-diverse cheap-to-mid lens models named at build via live picker; roster carries build-pinned models, no substitution without a disclosed pin change | F16-Q5 Agreed 2026-09-23 | F7 composition rule (F7 owns picker) |
| F16-RC-07 findings join report with no separate budget; INITIAL run ceiling-slots-only, RE-RUNS spend F1 repair cycles; 3+1 counted vs global-8, queue-not-drop | F16-Q2/Q4 Agreed 2026-09-23; split stated 2026-09-24 | F1Q10/Q50 budgets; F1Q11 ceiling (untouched) |
| F16-RC-08 frozen revision-bound packets, no raw transcripts (Q31 judgment); truncation status rides packet ("insufficient evidence" per Q31); F1 injection guard applies; never-bypass gates; dissent never erased | F16-Q4 Agreed 2026-09-23; clauses from band corrections applied 2026-09-24 | F1Q13/Q31 envelope; Q15/Q20/F3 gates (untouched) |
| F16-RC-09 F1–F15 invariance (single F1-AR-11 clarification excepted); spec-only blocking, enforcement unverified until probes | Derived | F1-AR … F15-RD; section 7 probes |
| F16-RC-10 all three lenses return for a verdict; ONE bounded infrastructure retry (F5 allowance, not a repair cycle); persistent failure fails the run + escalates; no degraded majorities, no ties | F16-Q6 Agreed 2026-09-24 | F5 retry allowance (composed, untouched) |
| F16-RC-11 Dispatcher reconciles second-opinion contradictions only via fresh council run (one F1 repair cycle) or user escalation; user is reconciler of last resort; self-reconciliation blocked | F16-Q7 Agreed 2026-09-24 | F1-AR-11 + F1 arbitration rule (composed, untouched) |
| F16-RC-12 designated-class expansion needs USER explicit approval; on-demand runs count vs global-8 + requesting task ledger; designated takes QUEUE PRIORITY at ceiling bind | F16-Q8 Agreed 2026-09-24 | F1Q11 ceiling (composed, untouched) |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F16-Q1; F16-RC-01) Each run seats risk, quality, and structure; two of three carry and the minority gets one recorded line.
2. (F16-Q2; F16-RC-02) The majority speaks as the review verdict on designated reviews only; human approval still sits above it.
3. (F16-Q2; F16-RC-03; F1) Routine reviews stay solo and consults stay advisory; F1-Q12 now reads review-authority verdict (solo or composite) with nothing else in F1 moved.
4. (F16-Q3; F16-RC-04; F3/F14/F15) Big gates convene the council on their own; anyone may call it on demand; routine work skips it.
5. (F16-Q4; F16-RC-05) Lenses read content with no tools while the Dispatcher wraps packets and verdicts; no new seat exists.
6. (F16-Q5; F16-RC-06; F7) Lens models spread across providers in the cheap-to-mid band, picked live at build.
7. (F16-Q2/Q4; F16-RC-07; F1) Findings ride the review report for free while re-runs spend repair cycles; a full house queues the run rather than dropping a lens.
8. (F16-Q4; F16-RC-08; F1/F3) Packets freeze at a revision with no transcript leaks; gates and dissent survive every run.
9. (Derived; F16-RC-09) F1–F15 rules do not move for council work (one stamped F1 clarification aside), and every block here awaits probe proof.
10. (F16-Q6; F16-RC-10) All three lenses return or no verdict forms; one bounded retry, then the run fails to the user.
11. (F16-Q7; F16-RC-11) Contradictions reconcile only through a fresh council run or the user; no seat judges its own verdict.
12. (F16-Q8; F16-RC-12) New designated classes need user approval; on-demand runs bill the ceiling and the requesting task; designated runs queue first.

## 7. Downstream unresolved contracts (not decided here)

Open items only — no invented values:

1. Lens SKUs and variants build pin: exact model identities and per-lens variants named at build via the live picker — no SKU named here.
2. Synthesis output shape detail: verdict-plus-findings-plus-dissent record shape (fields, ordering, ID format) — shapes only, no format chosen here.
3. Designated-review class list expansion: the full enumeration beyond F3 gates and F14/F15 cold reads — named, never decided here.
4. Lens prompt templates as shapes: per-lens packet layout and instruction scaffolding — shapes only, no template text written here.
5. Finding-ID uniqueness-validation mechanism and synthesis-record audit-log field shape — shapes only, no format chosen here.

## 8. Closed-loop budget + question map + user notes

Closed-loop budget: council findings consume NO review budget and reset none — F1 task budgets (initial plus at most two repair/re-review cycles) and the ONE shared integration budget stand unchanged by council findings; a council re-run after repairs consumes one F1 repair cycle; an exhausted task failure is never repaired inside a council window, and approvals are never bypassed by council work.

Question map (Q1–Q5 Agreed 2026-09-23; Q6–Q8 Agreed 2026-09-24; paraphrase, not user quotes):

- F16-Q1 — Lens roster: THREE lenses — risk, quality, structure. Majority 2/3; dissent noted in one line; fixed roster assembled per review (TGO Nirvana precedent proven live in this session's F8–F15 spec reviews). (Normative: F16-RC-01.)
- F16-Q2 — Verdict authority: the council's majority verdict IS the review verdict for DESIGNATED reviews — one composite verdict. User approval gates stand above (the council never approves). Expert solo reviews cover routine work; Expert consult mode untouched. ONE cross-feature amendment (authorized by this answer, provenance-stamped): F1-Q12's "one authoritative Expert verdict per case and revision" becomes "one authoritative REVIEW-AUTHORITY verdict per case and artifact revision (Expert solo, or council composite for designated reviews)" — additive clarification in `agent-roles.md`; nothing else in F1 moves. (Normative: F16-RC-02/03.)
- F16-Q3 — Triggers (three): (i) designated reviews run the council automatically — consequential approval-bound work (the F3 gates) + the F14/F15 review-gate cold reads; (ii) on-demand — user prose ("run it by the band"), any seat's request, or Dispatcher judgment for consequential uncertainty (the F1-Q6 pattern); (iii) routine tasks skip it. (Normative: F16-RC-04.)
- F16-Q4 — Mechanics: TOOL-LESS lenses (content-fed; TGO's proven pattern) + the DISPATCHER packages and synthesizes (majority verdict + finding IDs + one-line dissent). The council is a review MODE under the existing four-seat roster — NO fifth seat, no dedicated synthesizer. (Normative: F16-RC-05/07/08.)
- F16-Q5 — Model assignment: provider-diverse cheap-to-mid lens models, named at build via the live picker (the F7 composition rule; the TGO band precedent: three providers, three temperaments). (Normative: F16-RC-06.)
- F16-Q6 — Lens failure: all three lenses must return for a verdict (never a degraded body); a failed lens gets ONE bounded infrastructure retry (the F5 allowance — NOT a repair cycle); persistent failure FAILS THE RUN and escalates to the user; no 2-lens majority, no 1-1 ties. (Normative: F16-RC-10.)
- F16-Q7 — Reconciler identity: on a second-opinion contradiction the Dispatcher reconciles only by convening a fresh council run (consuming one F1 repair cycle) or escalating to the user; the USER is the reconciler of last resort; SELF-RECONCILIATION IS BLOCKED — a seat never adjudicates its own verdict. (Normative: F16-RC-11.)
- F16-Q8 — Class expansion + on-demand cost: designated-class expansion requires the USER'S explicit approval (a new class is a decision, never downstream discretion); on-demand runs count against the F1-Q11 global-8 ceiling AND record on the requesting task's ledger; designated reviews take QUEUE PRIORITY over on-demand when the ceiling binds. (Normative: F16-RC-12.)
- Band review (council band, NEEDS REVISION 2/3): cobain + novoselic NEEDS REVISION, grohl CONCERNS with the one-line dissent "the fixed-roster/no-fifth-seat design is the minimal shape; the hole is the failure path, not the design"; findings F-01 (lens failure) / F-02 (synthesis guard) / F-03 (reconciler) / F-04 (class expansion) / F-05 (on-demand cost); corrected in this pass 2026-09-24 with the missed-consideration compositions (initial-vs-rerun budget split, pinned-model roster, truncation status, injection guard, ID validation, synthesis audit log). (Normative: F16-RC-05/06/07/08/10/11/12.)

Scope clarity: this spec's own band review ran as a documentation-pipeline review (the per-feature flow), NOT a runtime designated review.

User notes / delta: F16 adds a feature spec plus one additive F1 clarification (F1-AR-11, provenance-stamped F16-Q2 2026-09-23) without moving any prior decision: Q1–Q51, F1Q1–F5Q5, BQ1–BQ8, F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10, F11Q1–F11Q10, F12Q1–F12Q9, F13Q1–F13Q7, STYLE-Q1–STYLE-Q10, RD-Q1–RD-Q4 all stand; this spec cross-references, never re-decides. F16-Q1..Q8 + band corrections applied 2026-09-24; awaiting Horowitz re-check + user approval.

Provenance (TGO Nirvana band live results F8–F15 + tgo-im6j wave-3 Council inventory + F1 precedent):

- TGO Nirvana band, live in this session's F8–F15 spec reviews: three tool-less lenses on a fixed per-review roster with Dispatcher synthesis — the proven pattern behind the F16-Q1 roster and F16-Q4 mechanics.
- oh-my-opencode-slim Council inventory (tgo-im6j wave 3): inventoried Council shape composed into the roster and mechanics above — provenance only, no values imported.
- F1 precedent: verdict identity (F1Q12), repair budgets (Q50/F1Q10), the global-8 ceiling (F1Q11), the delegation envelope with the Q31 sufficient-evidence rule (F1Q13), and the consult/review split (amendment B) — composed, never re-decided.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1–F15 digests and the F16 digest (this feature's authority where they differ).
- `../PRD.md` — Stage A frame cross-referenced here (no re-decision here).
- `../MANIFEST.md` — live-picker model pinning per F7 cross-referenced here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; lens models, synthesis, and enforcement gaps stay open there.
- `README.md` — Stage B index; this is feature 16 of 16, drafted awaiting review.
