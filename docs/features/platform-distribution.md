# Feature F6 — Platform and distribution (Dispatch)

Status: user-approved 2026-09-21 (Horowitz READY, band-reviewed CONCERNS→corrected, re-check READY, BQ7/BQ8 resolved); runtime unverified; scenarios FUTURE. Requirements
F6Q1–F6Q7 settled as directed 2026-09-21, runtime unverified; issue OPEN. No implementation, installs,
code, commits, or pushes. Sixth Stage B feature spec; remaining 7 areas stay stubs (see `README.md`).
All scenarios FUTURE, not executed. Historical Q1–Q51 and prior amendments are subordinate to settled
F6Q1–F6Q7 where they conflict for this scope. Approved F1/F2/F3/F4/F5 requirements stand untouched.

## 0. Objective

Define how Dispatch ships, installs, pins, self-updates, splits its product repository, admits
reference-source material, bounds donsetch/AGPL exposure, and behaves on unsupported operating
systems — under rules that REQUIRE no silent drift, silent substitution, silent upgrade, or
unreviewed license/AGPL admission (enforcement unverified until probes decide): git-tag install
as the v1 primary and only required path, immutable pinned refs with warn-only drift, FULL COMMIT
SHA pinning in an install record with refuse-at-install/bump mismatch and warn-only drift, v1 self-update by staging-and-swap
as an explicit USER OVERRIDE of the notify-only recommendation, product-repo split on explicit
user word, verify-then-admit licensing, donsetch separate-process plus signed AGPL boundary review,
and refuse-vs-warn unsupported-OS behavior. Node floor, MANIFEST classes, always-trust limits, bd
install-when-missing, never-silent substitution, and keyless caps hold unchanged from settled
context. Mechanism choice (tag/URL shapes, staging paths, banner strings, check scheduling) is
downstream, not this spec.

Stable requirement IDs `F6-PD-01` … `F6-PD-12`. Sources trace to settled
F6Q1–F6Q7 plus Q6/Q14/Q45–Q51 plus F2/F4/F5 where noted; mappings are multi-source
where a rule draws on more than one source — no one-to-one fiction. Section 5
holds the trace table; section 6 organizes the digest by requirement with source
labels. F6Q2 self-update is a USER OVERRIDE of the notify-only recommendation,
recorded in `../DECISIONS.md`.

## 1. Files / artifact boundaries

Owned by this feature (distribution contract, platform rules, acceptance only):

1. Distribution paths: git-tag install as v1 primary and only required path; later npm path permitted, never required, never a blocker.
2. Pinned-ref immutability, FULL COMMIT SHA install record, bump re-verification, SHA-mismatch refuse at install/bump with warn-only drift, and recorded-SHA sole authority.
3. V1 self-update by staging-and-swap: startup check, staging slot, pre-swap SHA verification, next-restart activation, never-downgrade, logging, failure-keeps-current, kill-switch, one-prior revert.
4. Product-repo split trigger and content allocation (docs root plus future source/tests/artifacts vs tracker history and session links).
5. Reference-source verify-then-admit gate and the 11 pending LICENSE fetches.
6. donsetch pin plus AGPL boundary procedure (separate-process shape, signed review before v1).
7. Unsupported-OS refuse-vs-warn behavior, degraded banner, and experiment override flag.
8. Control classification of the above by actual function.

Touched but not owned (this spec constrains, downstream specs decide):

1. Beads lifecycle mechanics — Beads-integration spec owns; here only install-when-missing and never-auto-upgrade hold.
2. Seat responsibilities, review packets, repair budgets, ceilings — F1 owns; here only invariance holds.
3. Permission configurability, fixed integrity, always-trust scope — permissions spec owns; here only the not-permission boundary holds.
4. Approval gates, deviation classes, verdict binding, waiver shape — F3 owns; here only gate invariance holds.
5. Session reuse, cancellation, recovery, rollover — F5 owns; here only mid-session stability (never swap mid-session) holds.
6. Node floor value, extension picks, candidate backends — re-pinned at spec phase against live Pi drift, owned by the spec-phase pin record, never chosen here.

Not in this feature:

1. Exact tag names, URLs, SHA string formats (only "recorded in the install record"), update-check intervals (configurable, not invented), package names beyond those on record, CLI spellings, staging paths, banner strings — all downstream (section 7).
2. Any claim that current Pi APIs, hooks, guards, registries, or adapters already implement sections 2–3. Proof is future work.
3. The integrated primary spec or any next-feature content. One feature at a time per user request; integration follows.

## 2. Interfaces

### 2.1 Distribution paths

- F6-PD-01 — Distribution is git-tag install from GitHub as the v1 primary and
  only required path. npm publish is PERMITTED after v1 but never required and
  never a blocker for the git-tag path: an unavailable or unconfigured npm
  registry never blocks a git-tag install. No npm publish is promised for v1.
  (F6Q1; Q45 distribution.)
- F6-PD-02 — Pinned refs are immutable. Drift between the pinned ref and the
  live source is warn-only: drift notices warn and never block, refuse, or
  auto-correct the install. (Q45 pinned-refs; F6Q1.)

### 2.2 Version pinning and integrity

- F6-PD-03 — Version pinning records the FULL COMMIT SHA (not just the tag
  name) in an install record at install time; that recorded SHA is the SOLE
authority for every later verification including F6-PD-04 pre-swap. Branch
  rule: a SHA mismatch at install or bump REFUSES (install integrity); drift
  between the recorded pin and the live source WARNS per F6-PD-02, never
  blocks or auto-corrects. A moved or retagged ref never changes the recorded
  SHA and is itself a mismatch (install/bump) or drift (notice) event, always
  disclosed. The npm path (later, per F6-PD-01) carries npm's own
  integrity hashes; bd keeps its checksum rule; no signature infrastructure in
  v1. (F6Q7; Q6 never-silent.)

### 2.3 Self-update in v1 (USER OVERRIDE of the notify-only recommendation)

- F6-PD-04 — Self-update ships in v1 by explicit user decision, overriding the
  notify-only recommendation (see `../DECISIONS.md` F6 digest override note).
  The mechanism follows the proven TGO staging-and-swap pattern: startup
  version check against the pinned tag; a new version downloaded to a staging
  slot; integrity-verified against the recorded SHA BEFORE swap (same-channel
  SHA source risk ACCEPTED for v1, user-agreed 2026-09-21 (BQ7); the recorded
  SHA still catches honest drift and mistakes; no v1 signature infrastructure exists per F6Q7); the swap activates at NEXT
  RESTART only (never mid-session). Self-update authorization comes from this
  explicit user decision alone. Scope is the PLUGIN artifact only — an existing
  bd install is NEVER auto-upgraded (F4-BI-10: install-when-missing only).
  Updates carry no monetary charge (git path); network, disk, and restart time
  are real non-monetary costs, not claimed zero. (F6Q2 — USER OVERRIDE; Q6; F4-BI-10;
  F5 mid-session stability.)
- F6-PD-05 — Self-update safety gates, each required: NEVER downgrade except
  the SOLE sanctioned carve-out — an explicit user-commanded revert to the ONE
  kept prior version; every other downgrade remains refused. Every
  update logged with old→new versions and trigger; failure keeps the current
  version and warns (never bricks the install); a config kill-switch
  (selfUpdate.enabled-style) disables check and download; one prior version is
  kept for explicit user revert. NEVER SILENT (Q6): every check outcome that
  changes or would change the install is disclosed. Deleting old versions past
  the one kept prior is a destructive action gated per Q6 approval. No update
  interval is invented here — scheduling is configurable, downstream.
  (F6Q2 — USER OVERRIDE; Q6 approval/never-silent.)

### 2.4 Product-repo split

- F6-PD-06 — At build start, on explicit user word, a new product repository
  takes `docs/pi-successor/*` as its docs root plus all future source, tests,
  and release artifacts; the TGO repo keeps tracker history and session links
  only; the product repo initializes its own beads store at extraction;
  planning-issue references travel as links/exports, never as silent copies
  claiming live authority. After extraction the product repo owns its install
  records, update logs, license verdicts, and the AGPL boundary review;
  cross-repo references resolve via the links/exports manifest only; the
  reference-repair owner at extraction is the Dispatcher (recorded in the
  extraction checklist, section 7 item 4). No split happens without the explicit
  user word.
  (F6Q3.)

### 2.5 Reference-source licensing

- F6-PD-07 — Reference-source license posture is verify-then-admit: fetch the
  11 pending LICENSE files at spec phase (mattpocock, BMAD, GSD, spec-kit,
  MemPalace, magic-context, qmd, Graphiti, Letta, ECC, ruflo); verified-permissive
  sources may contribute adapted text/code; unverified sources remain idea-level
  inspiration only (no copied code or text). Verified exceptions on record:
  obra/superpowers MIT, addyosmani agent-skills 0.6.8 MIT. No blanket clearance
  beyond these named exceptions is claimed. (F6Q4.)

### 2.6 donsetch pin and AGPL boundary

- F6-PD-08 — donsetch handling: the owner is a dedicated build-phase task
  created and tracked by the orchestrator (engineering executes); acceptance
  bar = exact artifact pinned (version + source URL + SHA), donsetch runs ONLY
  as a separate process (CLI or MCP — never linked as a library into the
  plugin, avoiding derivative-work contagion), and a written AGPL boundary
  review the USER signs off before v1 ships. No blanket AGPL clearance exists
  on record — the review is mandatory, and v1 does not ship without the
  sign-off. (F6Q5; Q49–Q51 retrieval; amendment E — no new licensing
  guarantees.)

### 2.7 Unsupported-OS behavior

- F6-PD-09 — Unsupported-OS behavior under a declared prerequisite manifest
  (OS family + Node floor, carried by the plugin): at install, prerequisite
  check failure refuses with guidance; an OS in the supported set (Windows,
  macOS) or the best-effort set (Linux) proceeds, with the degraded-support
  banner on best-effort; any other OS refuses unless the explicit override flag
  is given (banner retained). When classification is uncertain, fall back to
  the STRICTER branch (refuse). Runtime shows the same banner (detective).
  Required set remains Windows+macOS with prerequisites allowed (Q14). The
  banner never waives fixed-integrity rules (BQ6, F2-PE-10). (F6Q6; Q14; Q39
  Windows path.)

### 2.8 Settled platform context (cross-referenced, not re-decided)

- F6-PD-10 — Node >= 22.19.0 floor holds, re-pinned at spec phase against live
  Pi drift; no new floor is set here. MANIFEST classes hold — required /
  extension-picks / candidate / optional / reference — with extension picks
  pinned at spec phase, never chosen here. (Settled context; Q14
  prerequisites; MANIFEST.)
- F6-PD-11 — Settled cross-feature holds, each owned elsewhere:
  1. Always-trust configuration is not permission: it never authorizes deployments, destructive actions, or paid fallback. (Q46; F2-PE-10.)
  2. bd installs with the plugin when missing; an existing install is never auto-upgraded. (Q47; F4-BI-10.)
  3. Never-silent substitution: no silent model, version, or ref swap anywhere in this feature. (Q6; Q43 backup notice.)
  4. Keyless retrieval caps are probed at build; observed 429s are recorded verbatim, never smoothed. (Q49–Q51; EVIDENCE.)

### 2.9 Invariance and spec-only status

- F6-PD-12 — F1/F2/F3/F4/F5 requirements stand unchanged by anything in this
  feature; no seat, budget, ceiling, gate, or evidence rule moves here. All
  blocking in sections 2.1–2.8 is a SPEC requirement, not proven runtime
  implementation — enforcement is unverified until probes decide (section 7).

### 2.10 Control classification (SPEC requirement; runtime unverified)

Each control is classed by actual function. Preventive means the SPEC requires
it to block; nothing here claims the runtime implements it — enforcement is
unverified until probes decide.

| Control (requirement) | Class | Actual function |
|---|---|---|
| Git-tag-path sufficiency; npm never a blocker (F6-PD-01) | Preventive (SPEC requirement, NOT proven implementation) | refuses to gate a git-tag install on npm availability |
| Pinned-ref immutability; drift warn-only (F6-PD-02) | Preventive (SPEC requirement, NOT proven implementation) | blocks silent ref mutation; drift warns without blocking |
| SHA record as sole authority + bump re-verify + mismatch refuse at install/bump, drift warn-only (F6-PD-03) | Preventive (SPEC requirement, NOT proven implementation) | refuses a mismatched install or bump; drift warns without blocking, never silent |
| Staging-and-swap with pre-swap integrity verify against recorded SHA + next-restart-only + never-downgrade except sanctioned user revert (F6-PD-04) | Preventive (SPEC requirement, NOT proven implementation) | blocks unverified swaps, mid-session activation, and unsanctioned downgrades |
| Failure-keeps-current + kill-switch + one-prior revert (sole sanctioned downgrade) + Q6 delete gate (F6-PD-05) | Preventive (SPEC requirement, NOT proven implementation) | refuses bricked installs, ignored kill-switches, unsanctioned downgrades, and ungated old-version deletion |
| Product-split explicit-word gate (F6-PD-06) | Preventive (SPEC requirement, NOT proven implementation) | blocks any repo split without the explicit user word |
| Verify-then-admit license gate (F6-PD-07) | Preventive (SPEC requirement, NOT proven implementation) | blocks copied code/text from unverified sources |
| Separate-process-only + signed-review-before-ship (F6-PD-08) | Preventive (SPEC requirement, NOT proven implementation) | blocks library-linking and unsigned v1 shipment |
| Unsupported-OS refuse vs warn-and-banner under prerequisite manifest with stricter-on-uncertain fallback (F6-PD-09) | Preventive (SPEC requirement, NOT proven implementation) | refuses prerequisite-failed or unlisted installs without the override flag; banners degraded paths |
| Drift/disclosure surfacing: drift notices, update log, banners, 429 records (F6-PD-02, F6-PD-05, F6-PD-09, F6-PD-11) | Detective | surfaces a drift, update, banner, or cap event after the fact and routes it to the record |
| Records: install record, update log, adoption/split links, license verdicts, AGPL review | Detective (reporting) | leaves an after-the-fact evidence trail with no authority of its own |
| Compatibility and permissiveness assessments | Advisory judgment alone; preventive only when paired with the gate | classification advises, the gate enforces |

## 3. Constraints

C1. F6Q1–F6Q7 govern where they conflict with earlier readings inside this
scope; F1/F2/F3/F4/F5 stand where this spec does not narrow them. C2. No
re-deciding anything settled; no invented versions, URLs, SHA formats (only
"recorded in the install record"), update intervals (configurable, not
invented), or package names beyond those on record. C3. No npm requirement or
blocker for the git-tag path; no v1 npm promise. C4. No silent drift, silent
SHA mismatch, silent update, silent substitution, silent upgrade, or silent
delete — every install-changing outcome discloses. C5. No mid-session swap; no
downgrade except the sanctioned user revert to the kept prior; no bricked install; no
ignored kill-switch; no revert without a
kept prior. C6. No bd auto-upgrade; no scope beyond the plugin artifact. C7. No
repo split without the explicit user word; no live-authority claim by
links/exports. C8. No copied code or text from unverified sources; no blanket
clearance beyond the named MIT exceptions. C9. No donsetch library-linking; no
v1 shipment without the user-signed AGPL boundary review. C10. No supported-OS
claim beyond Windows+macOS required with prerequisites allowed; no banner-free
degraded path; no fixed-integrity waiver by banner. C11. No new Node floor,
extension pick, retention value, TTL, schema, or command invented here;
unknowns in section 7 stay open. C12. Controls are classed preventive,
detective, or advisory by actual function (section 2.10); SPEC-required
blocking is not proven implementation.

## 4. Verification (all FUTURE — not executed; no tests run)

Independent reviewer owns adversarial distribution consistency; this file owns
ID/link consistency only.
Format per scenario: input / observe-or-block / pass. Every scenario is FUTURE.

- P6-01 (F6-PD-01). Input: fresh machine, GitHub reachable, npm registry unavailable / Observe: git-tag install attempted / Pass: install completes from the git tag; npm absence blocks nothing. Channel outage (GitHub unreachable or auth failure) during install or check keeps the current state and warns — never a partial install. FUTURE.
- P6-02 (F6-PD-02). Input: installed pin vs live source diverged / Observe: drift check runs / Pass: warn-only notice recorded; install keeps serving the pin with no block or auto-correct. FUTURE.
- P6-03 (F6-PD-03). Input: install record holding tag plus FULL COMMIT SHA; bump proposed; live source later diverged / Observe: bump re-verification and drift check run / Pass: matching SHA installs; mismatched SHA at install or bump refuses with disclosure; drift between the recorded pin and the live source warns per F6-PD-02 with no block or auto-correct — never silent. FUTURE.
- P6-04 (F6-PD-03). Input: later npm path configured; bd present / Observe: integrity check runs / Pass: npm artifacts verify under npm's own hashes, bd under its checksum rule; no v1 signature infra claimed. FUTURE.
- P6-05 (F6-PD-04). Input: startup finds a newer pinned tag mid-session work underway / Observe: download stages, integrity-verified against the recorded SHA BEFORE swap, activation deferred / Pass: current session finishes on the old version; new version activates at next restart only. FUTURE.
- P6-06 (F6-PD-05). Input: staged version older than current / Observe: update-driven downgrade attempted / Pass: refused with disclosure; current version untouched (the sole sanctioned downgrade is the explicit user revert in P6-08). FUTURE.
- P6-07 (F6-PD-05). Input: staged download corrupt or verify-failed / Observe: update attempted / Pass: current version kept, warn issued, old→new attempt with trigger logged — install never bricked. FUTURE.
- P6-08 (F6-PD-05). Input: kill-switch off; prior version kept / Observe: check proposed; then explicit user revert proposed / Pass: no check or download runs while disabled; explicit user revert to the kept prior passes under the sole sanctioned-downgrade carve-out with disclosure; deleting anything past the kept prior requires Q6 approval. FUTURE.
- P6-09 (F6-PD-04, F6-PD-11). Input: update available; existing bd install present / Observe: self-update runs / Pass: plugin artifact updates; bd install byte-identical (install-when-missing only); update logged with old→new versions and trigger; no monetary charge. FUTURE.
- P6-10 (F6-PD-06). Input: explicit user word to split at build start / Observe: extraction runs / Pass: product repo holds docs root plus future source/tests/artifacts with its own beads store; TGO repo holds tracker history and session links only; planning refs travel as links/exports. FUTURE.
- P6-11 (F6-PD-06). Input: no explicit user word / Observe: split proposed / Pass: refused; single-repo layout unchanged. FUTURE.
- P6-12 (F6-PD-07). Input: verified-permissive source (named MIT exception) vs unverified source / Observe: admission attempted for each / Pass: verified source may contribute adapted text/code with verdict recorded; unverified source contributes idea-level inspiration only — copied code/text refused. FUTURE.
- P6-13 (F6-PD-08). Input: donsetch integration proposed as linked library; v1 ship proposed without signed review / Observe: boundary check runs / Pass: library-linking refused (separate process only: CLI or MCP); shipment without the user-signed AGPL boundary review refused; pinned artifact (version + source URL + SHA) recorded. FUTURE.
- P6-14 (F6-PD-09). Input: (a) prerequisite check failure; (b) supported OS (Windows, macOS) or best-effort OS (Linux); (c) any other OS, with and without the explicit override flag; (d) uncertain classification / Observe: install and runtime attempted / Pass: (a) refused at install with guidance; (b) proceeds, with the degraded-support banner at install and runtime on best-effort; (c) refused unless the override flag is given, banner retained; (d) falls back to the STRICTER branch (refuse). FUTURE.
- P6-15 (F6-PD-10, F6-PD-11). Input: machine below the Node floor; always-trust configured; bd missing; keyless retrieval 429s / Observe: install and privileged actions attempted / Pass: below-floor install refuses with prerequisite guidance (floor re-pinned at spec phase, not here); destructive/paid actions still ask (always-trust is not permission); missing bd installs with the plugin; 429s recorded verbatim. FUTURE.
- P6-16 (F6-PD-05, F6-PD-11). Input: update path attempts a version change with no disclosure / Observe: disclosure check runs / Pass: blocked or disclosed with logging — NEVER SILENT per Q6. FUTURE.
- P6-17 (F6-PD-03). Input: live ref moved or retagged after install / Observe: verification against the recorded SHA runs / Pass: the recorded SHA never changes; the moved tag surfaces as a mismatch (install/bump, refused) or drift (notice, warned), always disclosed. FUTURE.
- P6-18 (F6-PD-05). Input: startup failure after activation of a staged update / Observe: health gate runs / Pass: ONE automatic revert to the kept prior with logging and disclosure; a second consecutive failure parks for the user. FUTURE.

## 5. Requirement-to-source traceability

| Requirement | F6 source | Stage A / F1–F5 relation |
|---|---|---|
| F6-PD-01 git-tag primary/only-required; npm permitted-later never required/blocker | F6Q1 | Q45 distribution |
| F6-PD-02 pinned refs immutable; drift warn-only | F6Q1 | Q45 pinned refs |
| F6-PD-03 FULL COMMIT SHA record at install as SOLE authority; bump re-verify; mismatch REFUSES at install/bump, drift WARNS; moved/retagged ref never changes recorded SHA; npm hashes; bd checksum; no sig infra | F6Q7 | Q6 never-silent |
| F6-PD-04 v1 self-update USER OVERRIDE; staging-and-swap; integrity verify vs recorded SHA pre-swap (same-channel risk accepted for v1, user-decided 2026-09-21 (BQ7)); next-restart; plugin-only; bd never auto-upgraded; no monetary charge | F6Q2 (OVERRIDE) | Q6; F4-BI-10 install-when-missing; F5 mid-session stability |
| F6-PD-05 never-downgrade except sole sanctioned user revert to kept prior; update log; failure-keeps-current; kill-switch; one-prior revert; Q6 delete gate; never silent | F6Q2 (OVERRIDE) | Q6 approval/never-silent |
| F6-PD-06 product-repo split on explicit word; content allocation; own beads store; links/exports; product repo owns install records/update logs/license verdicts/AGPL review; Dispatcher owns reference repair at extraction | F6Q3 | Q48 spec store; amendment D beads authority |
| F6-PD-07 verify-then-admit; 11 pending LICENSE fetches; idea-only default; named MIT exceptions | F6Q4 | EVIDENCE citations |
| F6-PD-08 donsetch pin (version+URL+SHA); separate-process-only; signed AGPL review before v1 | F6Q5 | Q49–Q51 retrieval; amendment E licensing |
| F6-PD-09 prerequisite manifest; refuse on check failure or unlisted OS without override; Win+macOS supported, Linux best-effort with banner; stricter-on-uncertain; runtime banner | F6Q6 | Q14 required set; Q39 Windows; BQ6/F2-PE-10 fixed integrity |
| F6-PD-10 Node floor + spec-phase re-pin; MANIFEST classes; extension picks at spec phase | Settled context | Q14 prerequisites; MANIFEST |
| F6-PD-11 always-trust not permission; bd install-when-missing; never-silent; keyless 429s verbatim | Settled context | Q46/F2-PE-10; Q47/F4-BI-10; Q6/Q43; Q49–Q51 |
| F6-PD-12 F1–F5 invariance; spec-only blocking, enforcement unverified | Derived | F1-AR-10/12; F2-PE-01; F3 gates; F4-BI-05/09; F5-DS-04/06 |

## 6. Digest by requirement (paraphrase, not user quotes; labels show true sources)

1. (F6Q1; F6-PD-01) The plugin installs from a git tag on GitHub as the v1 primary and only required path; npm may publish later but is never required and never blocks the git-tag path.
2. (F6Q1; F6-PD-02) Pinned refs never mutate in place; drift gets a warn-only notice, never a block or auto-fix.
3. (F6Q7; F6-PD-03) The install record pins the FULL COMMIT SHA at install time as the SOLE authority for every later verification including pre-swap; a SHA mismatch at install or bump refuses, drift between the recorded pin and the live source warns per F6-PD-02 — never silent; a moved or retagged ref never changes the recorded SHA; later npm uses its own hashes, bd keeps checksums, v1 builds no signature infra.
4. (F6Q2 USER OVERRIDE; F6-PD-04) V1 self-updates by staging-and-swap — check at startup, stage, integrity-verify against the recorded SHA before swap, activate next restart — for the plugin artifact only; same-channel SHA source risk accepted for v1 (user-decided 2026-09-21 (BQ7)); the recorded SHA still catches honest drift and mistakes; bd is never auto-upgraded; the git path carries no monetary charge, with network, disk, and restart time as real non-monetary costs.
5. (F6Q2 USER OVERRIDE; F6-PD-05) Updates never downgrade except the sole sanctioned carve-out — an explicit user-commanded revert to the ONE kept prior; every other downgrade is refused; updates always log old→new plus trigger, keep the current version on failure with a warn, honor the kill-switch, keep one prior for explicit revert, and gate deeper deletion on Q6 approval — never silent.
6. (F6Q3; F6-PD-06) On the explicit user word at build start, docs plus future source/tests/artifacts move to a product repo with its own beads store; the product repo owns install records, update logs, license verdicts, and the AGPL boundary review; cross-repo refs resolve via the links/exports manifest only with the Dispatcher owning reference repair at extraction; TGO keeps tracker history and session links; refs travel as links/exports.
7. (F6Q4; F6-PD-07) License admission is verify-then-admit: 11 LICENSE files fetched at spec phase; only verified-permissive sources contribute adapted material; the rest stay idea-level; obra/superpowers MIT and addyosmani agent-skills 0.6.8 MIT are the recorded exceptions.
8. (F6Q5; F6-PD-08) donsetch is pinned exactly (version + source URL + SHA), runs only as a separate process, and ships in v1 only after the user signs the written AGPL boundary review — no blanket clearance exists.
9. (F6Q6; F6-PD-09) A declared prerequisite manifest (OS family + Node floor) governs install: prerequisite failure refuses with guidance; Windows+macOS supported and Linux best-effort proceed (degraded banner on best-effort at install and runtime); any other OS refuses without the explicit override flag; uncertain classification falls back to the stricter branch (refuse).
10. (Settled context; F6-PD-10) The Node floor holds and is re-pinned at spec phase; MANIFEST classes hold with extension picks pinned at spec phase — nothing chosen here.
11. (Settled context; F6-PD-11) Always-trust never authorizes destructive/paid/deployment actions; bd installs when missing; nothing substitutes silently; keyless 429s are recorded verbatim.
12. (Derived; F6-PD-12) F1–F5 rules do not move for platform work, and every block in this spec is a spec requirement awaiting probe proof.

## 7. Downstream unresolved contracts (not decided here)

Review-needed engineering proposals (confirm before build):

1. Startup check scheduling and trigger taxonomy (configurable intervals — no values set here), staging-slot layout, and next-restart activation mechanics.
2. Install-record schema and update-log shape (old→new versions plus trigger), kept-prior retention under a configurable disk bound with disclose-and-ask over cap (the F5-DS-09 pattern; no values set here), kill-switch config key, and activation-lock behavior (concurrent activation refused). The kill-switch state, kept prior, and revert capability live in the install record and survive both updates and the split. Design, recorded 2026-09-21; user may object.
3. Refusal/disclosure verbatim strings for SHA-mismatch, downgrade-refuse, failure-keeps-current, kill-switch-off, unsupported-OS refuse, degraded banner, and override-flag outcomes.
4. Product-repo extraction checklist: docs-root move, source/test/artifact cutover, beads-store init, links/exports manifest, and reference repair owned by the Dispatcher.
5. AGPL boundary review outline for user sign-off; donsetch artifact pin record shape (version + source URL + SHA).
6. Health gate (user-decided 2026-09-21 (BQ8)) — startup failure after activation triggers ONE automatic revert to the kept prior (logged, disclosed); a second consecutive failure parks for the user (no infinite loop).
7. Channel outage (GitHub unreachable or auth failure) during install or check keeps the current state and warns — never a partial install. Design, recorded 2026-09-21; user may object.
8. Out-of-band SHA publication or signing as a v2 hardening item (same-channel risk accepted for v1 per BQ7). User-decided 2026-09-21.

Implementation probes (runtime evidence before build claims):

1. Git-tag install, SHA verification, and drift-notice behavior on Windows and macOS under real Pi runtime conditions.
2. Staging-and-swap proof: pre-swap integrity verification against the recorded SHA, next-restart-only activation, failure-keeps-current with no bricked state, and kill-switch enforcement.
3. Unsupported-OS detection accuracy: prerequisite-failure refusal vs best-effort warn-and-continue, banner display at install and runtime, override-flag path, stricter-on-uncertain fallback.
4. Keyless retrieval cap behavior with verbatim 429 recording.
5. Empirical proof that chosen Pi hooks, guards, installers, or adapters enforce sections 2–3; probes and pilot decide.

Evidence limitations carried from Stage A:

1. Same-model review anchoring risk remains; the fresh-session artifact packet is the mitigation on record, not a fix (`EVIDENCE.md` section 5 item 8).
2. Tag names, URLs, SHA string formats, intervals, package names beyond those on record, CLI spellings, paths, and banner strings are explicitly unknown here.
3. Extension picks, Node re-pin, candidate-backend selection, and exact donsetch artifact are spec-phase pins, explicitly not selected here.

## References

- `../DECISIONS.md` — Q1–Q51 history plus F1/F2/F3/F4/F5 digests and F6 digest (this feature's authority where they differ; F6Q2 override noted).
- `../PRD.md` — Stage A frame; minimal cross-reference to this feature (no re-decision here).
- `../EVIDENCE.md` — citations and UNVERIFIED list; install, interception, observation, license, and AGPL gaps stay open there.
- `README.md` — Stage B index; this is feature 6 of 13.
