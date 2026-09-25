# tgo-sgm8 progress — bounded corrections (PIN-01 / BAN-02 / objective-floor gap)

## Objective
Apply the three council-verdict bounded corrections on Dispatch BUILD SLICE 5, no decision changes, no invented values, docs/ read-only, no commits.

## Touch set
- src/installer/index.ts — admitDependency pin gate extended to extension-pick (PIN-01).
- src/update/index.ts — DEGRADED_BANNER as disclosed UNVERIFIED default + resolveDegradedBanner injection seam; classifyOs honors PrereqInput.degradedBanner (BAN-02).
- src/release/index.ts — checkObjectiveFloor imports bothLanesGreen + pilotExitBar explicitly; releaseGate delegates floor legs to it (gap).
- src/tests/installer.test.ts, update.test.ts, release.test.ts — one test per fix.

## Decisions
- Banner default string kept verbatim; UNVERIFIED marker carried by DEGRADED_BANNER_PIN + seam docs, not a new string.
- checkObjectiveFloor isolates floor legs via pilotExitBar (metrics all-recorded, sign-off true) + bothLanesGreen so existing reason-shape tests hold.

## Blockers
- None.

## Status
- Edits + tests applied; running the single end verification (npm test, tsc --noEmit).
