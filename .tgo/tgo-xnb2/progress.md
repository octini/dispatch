# tgo-xnb2 progress

## Objective
Bounded corrections pass on Dispatch BUILD SLICE 2 (RE-CHECK NB-1..4). No commits.

## Touch set
- src/beads/index.ts (NB-1 lock domain named: LOCK_DOMAIN_RECORD + LOCK_TTL_PIN + TTL crash-release on tryAcquire/releaseIfExpired + LockedMutationRequest nowMs/lockTtlMs passthrough; NB-2 expiry-releases-lock-only design line; NB-4 RELEASE-GATING record line)
- src/bootstrap/index.ts (NB-3 SuppressedState + suppressed report field + disabled-path suppressed disclosure; NB-3 design line)
- src/tracker/index.ts (NB-4 RELEASE-GATING record line at STALENESS_MAX_AGE_PIN)
- src/tests/beads-tools.test.ts (NB-1: +5 TTL/authority tests)
- src/tests/bootstrap.test.ts (NB-2: +2 expiry-vs-park tests; NB-3: +3 suppressed-trigger tests)

## Decisions
Docs untouched (read-only); TTL/deadline/max-age values stay UNVERIFIED section-7 pins; NB-4 ties them to the PRIMARY-SPEC section-8 release gate instead of backlogging; zero decision changes; no commits.

## Blockers
None.

## Status
Complete — npm test 154 pass 0 fail, tsc --noEmit clean, NB-4 record lines present. No commits.
