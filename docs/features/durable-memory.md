# Feature F11 — Durable memory (Dispatch)

Status: user-approved 2026-09-22 (F11-Q1–Q6 + F11-Q7–Q10); independently reviewed; band-review corrections applied (CONCERNS 2/3 → 17 fixes → re-check READY); runtime unverified; all scenarios FUTURE. Not closed until issue closure. Requirements F11-DM-01 …
F11-DM-12 settled as directed 2026-09-22. No implementation, installs, code,
commits, or pushes. Eleventh Stage B feature spec; F1–F11 approved once tgo-gc3n closes; 2 areas remain (working context opening next, validation harness — see `README.md`). All
scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are
subordinate to settled F11-Q1–F11-Q10 where they conflict for this scope.
Approved F1/F2/F3/F4/F5/F6/F7/F8/F9/F10 requirements stand untouched.

## 0. Objective

Define the v1 durable-memory record and its policy shell: a DUAL-VAULT
git-tracked file record as the single source of truth (per-project vault
inside that project's repo so knowledge history travels with the code, plus a
machine-shared vault in its own user-level repo), wiki-pattern compilation
(raw/ immutable + wiki/ compiled + index + log) owned by an ephemeral
hook-driven service, databases restricted to recall-only, staged admission
with a required source link under a layered verifier (deterministic contract
checks + automatic contradiction lint + ephemeral semantic promotion, never a
standing seat), supersede-don't-overwrite corrections, a user-gated deletion
rule with tombstones and NO auto-deletion ever, automatic minimal scope-tag
stamping, versioned migration with a user-shown dry-run diff plus git/export
recovery, and recall-time source citations — with the recall backend itself
UNSELECTED pending a once-per-build comparative probe (accuracy floor first,
then cost, then latency) admitted only past the MemPalace identity pin
(enforcement unverified until probes decide): agents stage unverified entries
only, the user writes/promotes/deletes directly anytime, and no separate
Expert review gate stands between lint-plus-contract and promotion. Exact
paths, tag syntax, window lengths, invocation shapes, converter shapes, and
export formats are downstream, not this spec.

Stable requirement IDs `F11-DM-01` … `F11-DM-12`. Sources trace to settled
F11-Q1–F11-Q6 (all Agreed 2026-09-22 "Agreed on all") plus Q3, Q9, Q13, Q19,
Q24–Q27 and the absorbed settled directions (provenance: research + grilling
record — the package files previously lacked the MemPalace identity pin, the
malware warning, the qmd fact, the probe timing/weighting, the
migration/recovery standing demand, and the scope-stamp field, noted wherever
they appear); mappings are multi-source where a rule draws on more than one
source — no one-to-one fiction. Section 5 holds the trace table; section 6
organizes the digest by requirement with source labels.

## 1. Files / artifact boundaries

Owned by this feature (memory record, admission, recall selection, acceptance
only):

1. Dual-vault record form: per-project vault in its project repo +
   machine-shared vault in its own user-level repo, wiki pattern (raw/
   immutable, wiki/ compiled, index/log), databases recall-only.
2. Staged admission contract: UNVERIFIED staging with required source link +
   scope stamp, deterministic contract checks, automatic contradiction lint,
   ephemeral semantic promotion, direct user writes anytime.
3. Supersede model: corrections supersede with links retained; lint surfaces
   contradictions; explicit deletability.
4. Deletion policy: supersede default; user-only promoted hard-delete;
   verifier-may-delete failing staged entries within their window; worthless
   entries as tombstones with reasons; NO auto-deletion ever.
5. Wiki compile discipline: compile-once-keep-current on promotion +
   supersede + user request; deterministic immediate index/log; ephemeral
   owner, short-lived jobs.
6. Scope-tag discipline: minimal fixed tag set, automatic stamping from
   admitting context, any-combination filtering.
7. Memory properties: inspectable, correctable, deletable, source-linked;
   session history separate from durable knowledge.
8. Migration + recovery: versioned converters with a user-shown dry-run diff
   before applying; git-history + explicit-export recovery.
9. Recall citations at use time (F10-WR-09 composition).
10. Recall-backend probe: once-per-build comparative run over Mem0 / MemPalace
    / qmd hybrid / custom file-index before any recall-aid code lands;
    accuracy-floor-first weighting; full matrix recorded; identity-pin
    admission.
11. Invariance and spec-only status: F1–F10 unchanged; every block a SPEC
    requirement with enforcement unverified until probes decide.
12. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Seat responsibilities and ceilings — F1 owns; here only the no-standing-seat
   rule and the seat/user stamp source hold.
2. Approval gates and deviation classes — F3 owns; here only the
   disclose-before-apply migration composition holds.
3. Installer selection and checksum rules — F4/MANIFEST/F6 own; here only the
   migration-converter build-phase composition holds.
4. Citation evidence shapes — F10 owns the stamp; here only the at-use-time
   recall-citation composition holds.
5. Exact vault paths, tag syntax, window lengths, verifier/worker invocation
   shapes, converter shapes, diff/export formats — downstream engineering
   owns, never chosen here.

Not in this feature:

1. Any implementation, install, configuration, commit, or push —
   documentation only; nothing runs.
2. Exact paths, schemas, tag syntax, window lengths, call shapes, converter
   mechanics, or export formats — all downstream (section 7).
3. Any claim that a recall backend is selected or that sections 2–3 are
   enforced at runtime. Proof is future work.
4. The integrated primary spec or any next-feature content. One feature at a
   time per user request; integration follows.

## 2. Interfaces

### 2.1 Dual-vault record (Q24 + F11-Q1)

- F11-DM-01 — DUAL-VAULT SSOT: the per-project vault lives IN that project's
  git repo — knowledge history travels with the code; the machine-shared vault
  lives in its OWN git repo at a stated user-level location (the path is a
  section-7 item — no path invented here). Both vaults follow the wiki pattern:
  raw/ immutable entries + wiki/ compiled pages + index + log. Databases are
  RECALL-ONLY — never the record: no database write ever counts as the durable
  record, and record reads resolve to vault files. (Q24; F11-Q1 Agreed
  2026-09-22.)

### 2.2 Recall-backend probe (Q25 + F11-Q5)

- F11-DM-02 — RECALL-BACKEND PROBE: the recall aid is UNSELECTED pending a
  comparative synthetic probe among Mem0 / MemPalace / qmd hybrid / custom
  file-index. The probe runs ONCE in the build phase as a dedicated recorded
  run BEFORE any recall-aid code lands, and re-runs only on candidate-set
  change — never per session, never silently. Weighting: ACCURACY FLOOR FIRST
  (below-floor candidates eliminated regardless of price), then cost, then
  latency among survivors; the full matrix is recorded. Candidate facts on
  record, labeled RECORDED FACTS: Mem0 v3 is ADD-only (verified on record at
  `EVIDENCE.md:23`); MemPalace identity is pinned to
  github.com/MemPalace/mempalace ONLY — the tech/net lookalikes are MALWARE
  (identity verification is part of probe admission; never fetch lookalikes);
  qmd requires local model downloads; vendor benchmarks are unverified.
  ABSORBED SETTLED DIRECTION — provenance: research + grilling record; the
  package files previously lacked the identity pin, the malware warning, the
  qmd fact, and the probe timing/weighting (noted here and in sections 5–6
  and `../DECISIONS.md`). (Q25; F11-Q5 Agreed 2026-09-22; RECORDED FACTS as
  labeled.)

### 2.3 Staged admission + verifier (Q26 + F11-Q3)

- F11-DM-03 — STAGED ADMISSION + VERIFIER: agents stage UNVERIFIED entries
  only, each with a REQUIRED source link (no link, no staging) plus the
  F11-DM-11 scope stamp. The verifier is LAYERED: deterministic contract
  checks (source link present + scope stamp present + supersedes-link format
  valid) plus the Q27 contradiction lint run AUTOMATIC on every staged entry.
  Semantic promotion runs as an EPHEMERAL background verifier pass — a short
  model call that ends when the pass ends, never a standing seat (per Q13).
  The user writes, promotes, and deletes directly at any time (Q26). There is
  NO separate Expert review gate — lint + contract is the promotion bar; the
  user may demand deeper review per entry. (Q26; Q13; F11-Q3 Agreed
  2026-09-22.)

### 2.4 Supersede model (Q27)

- F11-DM-04 — SUPERSEDE MODEL: corrections and updates SUPERSEDE — the old
  claim stays with its supersedes link intact; the lint surfaces
  contradictions across the chain. Entries are explicitly deletable per
  F11-DM-05; supersession is never deletion. (Q27; F11-Q3 composition Agreed
  2026-09-22.)

### 2.5 Deletion policy (F11-Q4 + Q9)

- F11-DM-05 — DELETION POLICY: supersede for corrections/updates; hard-delete
  ONLY for (a) explicit user delete — promoted entries included; (b) staged
  entries failing the contract within their staging window — the verifier may
  delete those; (c) worthless entries — duplicates, junk, malware-shaped
  content — recorded as a TOMBSTONE with a reason while the content is gone.
  Nobody but the user hard-deletes a promoted entry — the verifier supersedes
  or flags instead. NO AUTO-DELETION OF MEMORY, EVER — age, size, or quota
  pressure never deletes; pressure discloses and parks for the user instead.
  The staging-window shape is a section-7 item — no values invented here.
  (F11-Q4 Agreed 2026-09-22; Q9.)

### 2.6 Wiki compile (F11-Q2 + Q13)

- F11-DM-06 — WIKI COMPILE: compile-once-keep-current — the compile trigger
  fires on PROMOTION + on SUPERSEDE + on USER REQUEST. Index/log updates are
  deterministic and immediate with each trigger. The owner is a plugin-managed
  EPHEMERAL service — hook/event-driven, never a standing seat (per Q13);
  wiki refreshes run as short-lived background jobs that end when the refresh
  ends. (F11-Q2 Agreed 2026-09-22; Q13.)

### 2.7 Scope tags (F11-Q6 + Q19)

- F11-DM-07 — SCOPE TAGS: a minimal FIXED tag set — project, scope
  (work|personal — the Q3 split), seat (or user), task (issue link), status
  (staged|promoted|superseded). Stamping is AUTOMATIC from the admitting
  context — the admitting agent or user never hand-writes tags to pass.
  Filtering is any combination of tags. The exact format is a section-7 item
  — no syntax invented here. Installations never share vaults (Q19).
  (F11-Q6 Agreed 2026-09-22; Q3; Q19.)

### 2.8 Memory properties (Q9)

- F11-DM-08 — MEMORY PROPERTIES: durable memory is inspectable, correctable,
  deletable, and source-linked. Session history is SEPARATE from durable
  knowledge — session transcripts never count as the record and never promote
  implicitly. (Q9.)

### 2.9 Migration + recovery (user standing demand + F11 design, ABSORBED)

- F11-DM-09 — MIGRATION + RECOVERY: versioned converters carry the vault
  across format changes, with a DRY-RUN DIFF shown to the user BEFORE applying
  — nothing applies silently. Recovery is git history plus explicit export.
  Converter mechanics, the diff format, and the export format are section-7
  items — no shapes invented here. ABSORBED — provenance note: the user's
  standing demand (a permanent maintainable solution with migration and
  recovery) was previously absent from the package files (noted here and in
  sections 5–6 and `../DECISIONS.md`). (Absorbed standing demand; F11 design
  Agreed 2026-09-22.)

### 2.10 Recall citations (F10-WR-09 composition)

- F11-DM-10 — RECALL CITATIONS: recalled memory carries its source links at
  use time — every recall surfaces the entry's stored source links alongside
  the content, composing F10-WR-09 citation discipline into memory recall.
  (F10-WR-09 composition; F11 design Agreed 2026-09-22.)

### 2.11 Scope stamp (absorbed with provenance)

- F11-DM-11 — SCOPE STAMP: the scope-stamp admission field derives from the
  F11-DM-07 tag set and is REQUIRED at admission (Q26 composition) — a staged
  entry without its stamp fails the contract check. ABSORBED with provenance:
  research + grilling record; previously absent from the package files as an
  explicit admission field (noted here and in sections 5–6 and
  `../DECISIONS.md`). (Absorbed; Q26; F11-DM-07 composition.)

### 2.12 Invariance and spec-only status

- F11-DM-12 — F1–F10 requirements stand unchanged by anything in this feature;
  no seat, permission, gate, evidence, license, platform, model, prose,
  bootstrap, or retrieval rule moves here. All blocking in sections 2.1–2.11
  and 2.13 is a SPEC requirement, not proven runtime implementation —
  enforcement is unverified until probes decide (section 7). (F1–F10
  invariance; spec-only status.)

### 2.13 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Source-link-required staging: no link, no staging (F11-DM-03) | Preventive (SPEC requirement, NOT proven implementation) | blocks unsourced entries from entering the vault |
| Scope-stamp-required admission (F11-DM-11) | Preventive (SPEC requirement, NOT proven implementation) | blocks unstamped entries from staging |
| Database-never-record rule (F11-DM-01) | Preventive (SPEC requirement, NOT proven implementation) | blocks database writes from counting as the record |
| No-auto-deletion rule; age/size/quota pressure discloses and parks (F11-DM-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent memory loss under pressure |
| User-only promoted hard-delete; verifier supersedes or flags (F11-DM-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks non-user destruction of promoted knowledge |
| Malware-shaped content → tombstone, never promote (F11-DM-05) | Preventive (SPEC requirement, NOT proven implementation) | blocks malicious content from reaching promoted status |
| Identity-pin probe admission: lookalike URLs refused, never fetched (F11-DM-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks malware-lookalike sources from entering the probe |
| No-standing-seat rule: verifier and wiki owner ephemeral only (F11-DM-03/06) | Preventive (SPEC requirement, NOT proven implementation) | blocks standing memory agents per Q13 |
| No-cross-installation vault sharing (F11-DM-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks vault reads/writes across installations |
| Contradiction lint records (F11-DM-03/04) | Detective | surfaces conflicting claims after the fact |
| Contract-check records (F11-DM-03) | Detective | surfaces admission pass/fail after the fact |
| Tombstone records with reasons (F11-DM-05) | Detective | surfaces what was removed and why after the fact |
| Migration dry-run diffs (F11-DM-09) | Detective | surfaces pending format changes before they apply |
| Supersedes-chain trails (F11-DM-04) | Detective | surfaces correction lineage after the fact |
| Recall-quality assessments alone | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F11-Q1–F11-Q6 govern where they conflict with earlier readings inside this
scope; F1/F2/F3/F4/F5/F6/F7/F8/F9/F10 stand where this spec does not narrow
them. C2. No re-deciding anything settled — Q1–Q51, F1Q1–F5Q5, BQ1–BQ8,
F6Q1–F6Q7, F7Q1–F7Q5, F8Q1–F8Q9, F9Q1–F9Q9, F10Q1–F10Q10 stand; this spec
cross-references, never re-decides. C3. Databases are recall-only — never the
record. C4. NO standing memory seats (Q13) — verifier and wiki owner are
ephemeral passes and short-lived jobs only. C5. NO auto-deletion of memory
ever — pressure discloses and parks for the user. C6. Installations never
share vaults (Q19). C7. No invented paths, schemas, tag syntax, window
lengths, invocation shapes, converter shapes, diff/export formats, or values
— shapes only, section 7. C8. The MemPalace identity pin plus malware warning
is non-negotiable probe-admission content — lookalike URLs are refused and
never fetched. C9. Spec-only status: every block is a SPEC requirement with
enforcement unverified until probes decide. C10. Controls are classed
preventive, detective, or advisory by actual function (section 2.13);
SPEC-required blocking is not proven implementation. C11. All scenarios
FUTURE — not executed; no tests run. C12. Documentation only — no
implementation, installs, code, config, commits, or pushes.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial memory consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P11-01 (F11-DM-01). Input: project knowledge write in a project repo /
  Observe: vault routing runs / Pass: the entry lands in that project's
  in-repo vault with history traveling alongside the code. FUTURE.
- P11-02 (F11-DM-01, F11-DM-07). Input: machine-shared knowledge write /
  Observe: vault routing runs / Pass: the entry lands in the machine-shared
  repo vault, never in another installation's vault. FUTURE.
- P11-03 (F11-DM-01). Input: a database write proposed as the durable record /
  Observe: record-resolution check runs / Pass: refused — databases serve
  recall only; record reads resolve to vault files. FUTURE.
- P11-04 (F11-DM-02). Input: build phase reaches recall-aid selection /
  Observe: probe scheduling runs / Pass: one dedicated recorded comparative
  run completes across the candidate set BEFORE any recall-aid code lands,
  with the full matrix recorded. FUTURE.
- P11-05 (F11-DM-02). Input: a cheap candidate scoring below the accuracy
  floor / Observe: weighting runs / Pass: eliminated regardless of price;
  cost then latency order only the survivors. FUTURE.
- P11-06 (F11-DM-02). Input: a tech/net MemPalace lookalike URL offered at
  probe admission / Observe: identity-pin check runs / Pass: refused and
  never fetched — only github.com/MemPalace/mempalace admits. FUTURE.
- P11-07 (F11-DM-03). Input: agent stages an entry with no source link /
  Observe: contract check runs / Pass: blocked — no link, no staging. FUTURE.
- P11-08 (F11-DM-03). Input: agent stages a linked, scope-stamped entry /
  Observe: admission runs / Pass: admitted UNVERIFIED only; deterministic
  checks pass, contradiction lint runs automatic, and semantic promotion waits
  for the ephemeral verifier pass. FUTURE.
- P11-09 (F11-DM-03). Input: user writes/promotes/deletes an entry directly /
  Observe: user-path check runs / Pass: allowed at any time with no gate
  between the user and the vault. FUTURE.
- P11-10 (F11-DM-04). Input: correction to a promoted claim / Observe:
  supersede handling runs / Pass: the old claim stays with its supersedes
  link, the new claim links forward, and lint surfaces any contradiction.
  FUTURE.
- P11-11 (F11-DM-05). Input: explicit user delete of a promoted entry /
  Observe: deletion-authority check runs / Pass: hard-delete allowed. FUTURE.
- P11-12 (F11-DM-05). Input: non-user actor attempts hard-delete of a
  promoted entry / Observe: deletion-authority check runs / Pass: blocked —
  the verifier supersedes or flags instead. FUTURE.
- P11-13 (F11-DM-05). Input: duplicate/junk entry identified / Observe:
  worthless-entry handling runs / Pass: content gone with a TOMBSTONE plus
  reason recorded; nothing promoted from it. FUTURE.
- P11-14 (F11-DM-05). Input: adversarial age/size/quota pressure against the
  vault / Observe: pressure handling runs / Pass: nothing auto-deletes —
  pressure discloses and parks for the user. FUTURE.
- P11-15 (F11-DM-06). Input: entry promotion lands / Observe: compile trigger
  runs / Pass: wiki recompiles with deterministic immediate index/log
  updates via a short-lived background job; no standing seat exists after the
  job ends. FUTURE.
- P11-16 (F11-DM-07). Input: entry admitted from a seat context / Observe:
  stamp check runs / Pass: project/scope/seat/task/status tags stamped
  automatically from the admitting context; any-combination filtering
  resolves. FUTURE.
- P11-17 (F11-DM-08). Input: inspect/correct/delete demand against a
  promoted entry / Observe: property check runs / Pass: entry surfaces with
  its source links, corrects via supersede, deletes per F11-DM-05; session
  transcripts never promote implicitly. FUTURE.
- P11-18 (F11-DM-09). Input: vault format change with versioned converters /
  Observe: migration runs / Pass: the dry-run diff shows to the user first
  and nothing applies silently; recovery resolves to git history plus
  explicit export. FUTURE.
- P11-19 (F11-DM-10). Input: memory recall served at use time / Observe:
  citation check runs / Pass: the recalled content carries its source links
  alongside. FUTURE.
- P11-20 (F11-DM-11). Input: staged entry missing its scope stamp / Observe:
  contract check runs / Pass: blocked — the stamp is required at admission.
  FUTURE.
- P11-21 (F11-DM-05). Input: malware-shaped staged content / Observe:
  content-safety handling runs / Pass: tombstoned with reason, never
  promoted. FUTURE.
- P11-22 (F11-DM-12). Input: memory-spec change candidate touching seat,
  permission, or retrieval behavior / Observe: invariance check runs / Pass:
  F1–F10 requirements read unchanged; the change narrows to this feature or
  parks. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F11 source | Stage A / F1–F10 relation |
|---|---|---|
| F11-DM-01 dual vaults (in-repo project vault; own-repo machine vault, path downstream); wiki pattern; databases recall-only | Q24; F11-Q1 Agreed 2026-09-22 | Q24 file-vault direction; Q19 installation separation |
| F11-DM-02 once-per-build comparative probe (Mem0 / MemPalace / qmd hybrid / custom file-index); accuracy-floor-first weighting; full matrix; identity-pin admission; RECORDED FACTS (Mem0 v3 ADD-only; MemPalace pin + malware warning; qmd local downloads; vendor benchmarks unverified) — ABSORBED, partially absent from package files | Q25; F11-Q5 Agreed 2026-09-22; absorbed settled direction (research + grilling record) | `EVIDENCE.md:23` Mem0 ADD-only; F6-Q4 license fetch (MemPalace/qmd pending) |
| F11-DM-03 UNVERIFIED staging with required source link; layered verifier (contract checks + automatic lint + ephemeral promotion pass); user direct path anytime; NO Expert gate | Q26; Q13; F11-Q3 Agreed 2026-09-22 | Q26 admission direction; Q13 no-standing-seats |
| F11-DM-04 supersede-don't-overwrite; old claim retained with link; lint surfaces contradictions; explicitly deletable | Q27; F11-Q3 composition Agreed 2026-09-22 | F11-DM-03 lint composition; F11-DM-05 deletion |
| F11-DM-05 supersede default; user-only promoted hard-delete; verifier-may-delete failing staged entries in-window; worthless entries as tombstones; NO auto-deletion ever; window shape downstream | F11-Q4 Agreed 2026-09-22; Q9 | Q9 deletability; Q27 explicit-deletable |
| F11-DM-06 compile-once-keep-current (promotion + supersede + user request); deterministic immediate index/log; ephemeral hook-driven owner; short-lived jobs | F11-Q2 Agreed 2026-09-22; Q13 | Q13 hook/event-driven maintenance |
| F11-DM-07 minimal fixed tag set (project / scope work-or-personal / seat-or-user / task issue-link / status); automatic stamping; any-combination filtering; format downstream; installations never share | F11-Q6 Agreed 2026-09-22; Q3; Q19 | Q3 work/personal split; Q19 installation separation |
| F11-DM-08 inspectable/correctable/deletable/source-linked; session history separate from durable knowledge | Q9 | Q9 memory properties verbatim direction |
| F11-DM-09 versioned converters; user-shown dry-run diff before apply; git-history + explicit-export recovery; mechanics downstream — ABSORBED, previously absent from package files | Absorbed standing demand; F11 design Agreed 2026-09-22 | Git-history recovery composes with repo-tracked vaults (F11-DM-01) |
| F11-DM-10 recall carries source links at use time | F11 design Agreed 2026-09-22 | F10-WR-09 composition |
| F11-DM-11 scope-stamp admission field from the F11-DM-07 set; required at admission — ABSORBED, previously absent as an explicit field | Absorbed (research + grilling record); Q26 composition | F11-DM-07 tag set; F11-DM-03 contract |
| F11-DM-12 F1–F10 invariance; spec-only blocking, enforcement unverified until probes | Derived | F1-AR; F2-PE; F3-SD; F4-BI; F5-DS; F6-PD; F7-MP; F8-PS; F9-BS; F10-WR; section 7 probes |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (Q24; F11-Q1 Agreed 2026-09-22; F11-DM-01) Each project's vault lives
   inside that project's git repo so knowledge history travels with the code,
   while the machine-shared vault lives in its own repo at a stated
   user-level location whose path pins downstream — both in the wiki pattern
   of immutable raw entries plus compiled pages plus index plus log — and
   databases serve recall only, never the record.
2. (Q25; F11-Q5 Agreed 2026-09-22; absorbed settled direction — research +
   grilling record, partially absent from the package files; F11-DM-02) No
   recall backend is selected: one recorded build-phase probe compares Mem0,
   MemPalace, qmd hybrid, and custom file-index before any recall-aid code
   lands, re-running only when the candidate set changes, eliminating
   below-accuracy-floor candidates regardless of price before weighing cost
   then latency, and recording the full matrix — with Mem0 v3 ADD-only, the
   MemPalace identity pinned to github.com/MemPalace/mempalace with the
   tech/net lookalikes flagged as malware that is never fetched, qmd needing
   local model downloads, and vendor benchmarks unverified.
3. (Q26; Q13; F11-Q3 Agreed 2026-09-22; F11-DM-03) Agents stage unverified
   entries only with a mandatory source link, a layered verifier runs
   deterministic contract checks plus automatic contradiction lint, semantic
   promotion happens in an ephemeral background pass rather than a standing
   seat, the user writes and promotes and deletes directly at any time, and no
   separate Expert review gate stands in the way — lint plus contract is the
   bar unless the user demands deeper review on an entry.
4. (Q27; F11-Q3 composition; F11-DM-04) Corrections supersede rather than
   overwrite: the old claim remains with its supersedes link, the lint
   surfaces contradictions, and deletion follows the deletion policy rather
   than arriving through the back door of an update.
5. (F11-Q4 Agreed 2026-09-22; Q9; F11-DM-05) Supersede is the default for
   corrections; hard-delete happens only on explicit user delete, verifier
   removal of contract-failing staged entries inside their window, or
   tombstoning of worthless entries with a recorded reason — nobody but the
   user hard-deletes a promoted entry, and memory never auto-deletes under any
   pressure.
6. (F11-Q2 Agreed 2026-09-22; Q13; F11-DM-06) The wiki compiles once and stays
   current: promotion, supersession, and user request each trigger a refresh
   with deterministic immediate index and log updates, owned by an ephemeral
   plugin-managed hook-driven service running short-lived background jobs.
7. (F11-Q6 Agreed 2026-09-22; Q3; Q19; F11-DM-07) Every entry carries the
   minimal fixed tags — project, work-or-personal scope, seat or user, task
   issue link, staged/promoted/superseded status — stamped automatically from
   the admitting context and filterable in any combination, while
   installations never share vaults.
8. (Q9; F11-DM-08) Memory stays inspectable, correctable, deletable, and
   source-linked, and session history remains separate from durable knowledge
   with no implicit promotion from transcripts.
9. (Absorbed standing demand — previously absent from the package files; F11
   design Agreed 2026-09-22; F11-DM-09) Format changes ride versioned
   converters whose dry-run diff the user sees before anything applies, and
   recovery rests on git history plus explicit export.
10. (F10-WR-09 composition; F11 design Agreed 2026-09-22; F11-DM-10) Recalled
    memory arrives with its source links attached at use time.
11. (Absorbed — research + grilling record, previously absent as an explicit
    field; Q26 composition; F11-DM-11) Admission requires the scope stamp
    drawn from the tag set — a stamp-less staged entry fails the contract.
12. (Derived; F11-DM-12) F1–F10 rules do not move for memory work, and every
    block here is a spec requirement awaiting probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Vault paths + repo locations: the in-repo project vault path and the
   machine-shared repo's user-level location (F11-DM-01; F11-Q1) — shapes
   only, no paths invented here.
2. Tag format + stamp validation: exact tag syntax and the automatic-stamp
   validation rule (F11-DM-07/11; F11-Q6) — shapes only, no syntax invented
   here.
3. Staging-window shape: window length, expiry behavior, failing-entry
   removal mechanics (F11-DM-05; F11-Q4) — shape only, no values invented
   here.
4. Verifier invocation shape: the ephemeral promotion-pass trigger, context,
   and record format (F11-DM-03; F11-Q3) — shape only, no call strings set
   here.
5. Wiki compile job shape: trigger wiring, job bounds, index/log write format
   (F11-DM-06; F11-Q2) — shape only, no mechanics set here.
6. Migration converter shape + dry-run diff format + export format
   (F11-DM-09) — shapes only, no mechanics invented here.
7. Recall-adapter isolation + fallback: how the probe-selected recall aid
   plugs in without becoming the record, and the fallback when recall is
   unavailable (F11-DM-02 composition) — shape only.
8. Probe harness + matrix format: synthetic probe procedure, accuracy-floor
   definition, cost/latency measures, matrix record shape (F11-DM-02;
   F11-Q5) — shapes only, no thresholds invented here.
9. Tombstone shape: tombstone record fields and retention (F11-DM-05) — shape
   only, no schema invented here.

Implementation probes (runtime evidence before build claims):

1. Contract-check proof: staging without a source link blocks.
2. Supersedes-chain proof: corrections retain the old claim with intact
   forward/back links and lint surfacing.
3. Lint-contradiction proof: contradictory staged entries surface via the
   automatic lint.
4. No-auto-delete proof: adversarial age/size/quota pressure deletes nothing
   and parks with disclosure.
5. Dual-vault routing proof: project writes land in-repo, shared writes land
   in the machine vault, cross-installation access blocked.
6. Tag-stamp proof: admission stamps the full tag set automatically from
   context; stamp-less staging blocked.
7. Verifier-ephemeral proof: no standing seat exists after the promotion pass
   completes.
8. Migration dry-run proof: the diff shows before apply; nothing applies
   silently.
9. Identity-pin proof: a lookalike MemPalace URL is refused at probe
   admission and never fetched.
10. Recall-citation proof: recalled memory carries its source links at use
    time.
11. Empirical proof that the chosen recall aid, vault wiring, and verifier
    enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. No recall backend is selected — Mem0, MemPalace, qmd hybrid, and custom
   file-index are candidates only; vendor benchmarks are unverified.
2. Mem0 v3 ADD-only is verified on record (`EVIDENCE.md:23`) — probe design
   must account for it.
3. MemPalace lookalike domains are malware — identity verification is probe
   admission content, and lookalikes are never fetched for comparison.
4. qmd requires local model downloads — the probe environment must account
   for that cost.
5. Same-model review anchoring risk remains; the fresh-session artifact packet
   is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
6. Vault paths, tag syntax, window lengths, invocation shapes, converter
   mechanics, diff/export formats, and probe thresholds are explicitly unknown
   here — downstream, never invented.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5/F6/F7/F8/F9/F10
  digests and the F11 digest (this feature's authority where they differ; the
  absorbed-direction provenance notes recorded).
- `../PRD.md` — Stage A frame; memory scope cross-referenced here (no
  re-decision here).
- `../MANIFEST.md` — candidate-backend classes; recall backends stay
  candidates here (no selection here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; Mem0 v3 ADD-only (:23)
  stays open there.
- `README.md` — Stage B index; this is feature 11 of 13.
