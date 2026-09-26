# tgo-esi6 progress — Dispatch build-pin Phase B (runtime probes)

## Objective
Run PS-GATE-01/02/03/04/05/06/07/09/11 live (installs allowed) + pin fills; records land in docs/PIN-RECORD.md section 7.

## Touch set
- docs/PIN-RECORD.md (added section 7; old GAPS section renumbered to 8)
- /tmp/psgate (probe installs only; never the repo)
- No src/config changes; no publish; no push.

## Decisions
- Probe installs isolated to /tmp/psgate per "no config changes beyond the probes".
- Code pin-constant flips (HARNESS_SHA_PIN etc.) deferred: tests assert UNVERIFIED; flipping needs a user-worded follow-up, not a probe side-effect.
- Pin-fill values recorded only where observed (HARNESS_SHA); all chosen-value pins stay UNVERIFIED with reasons.

## Blockers
- None. CI windows lane + node 22/24 cells untriggerable without push (by scope design).

## Status
Phase B COMPLETE (records in PIN-RECORD.md §7; 435/435 macOS arm64 node 26).

## Build-pin burst (user-worded 2026-09-28, agreed on all)

Objective: flip the five chosen-value pins + write the record (§9).
Touch set: src/beads, tracker, retrieval/stack, adapter/donsetch-adapter, prompt, release (comments) + tests (beads-tools, tracker, retrieval-stack, adapter, prompt-budget, release) + docs/PIN-RECORD.md (§9 only). No commits; no pushes.
Decisions: _PIN strings carry "PINNED <value> (user-worded 2026-09-28)" so the release gate (string PinValue) reads them without type churn; numeric _MS/_BOUND siblings drive enforcement; snippet alias kept for compat; exposure default enforced with 75% warn.
Blockers: none.
Status: DONE. npm test 438/438 pass, tsc --noEmit clean (verified once).

## Dispatch burst (repo create + push, fresh session)

Objective: create private GitHub repo `dispatch` + commit build-pin work + push (triggers CI matrix).
Touch set: docs/PIN-RECORD.md (path-(a) confirmation line only) + this file.
Decisions: local record line + scoped commit land; remote steps stop — no real `gh` on PATH (only the AFT shim; `gh auth status` EXIT 86).
Blockers: REPO NOT CREATED, NOT PUSHED — needs the user's manual step (see report).
Status: LOCAL COMMIT ONLY; remote dispatch blocked on `gh` auth/binary.
