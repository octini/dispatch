# tgo-580o — Dispatch BUILD SLICE 1 bounded corrections

## Objective
Apply council CONCERNS verdict fixes FIND-1..5 + cheap missed items, then the band
re-check's remaining record items (exposure bound, absence-path rebuttal,
fallback-list note). No commits.

## Touch set
- src/permission-gate.ts (FIND-1 derivation; 6a integrity; 6b TOCTOU note; 6c allowlist; 6e counter note; + absence-path rebuttal in header; + fallback-list one-liner on derivation comment)
- src/prompt.ts (FIND-2 cap clause + assembled enforcement; FIND-4 pinned guard; + exposure-bound record + test-configured bound enforcement: F8-Q9 trim above, park/escalate on breach, no numeric default)
- src/index.ts (FIND-3 fail-closed attach; 6d tool_result note)
- src/tests/gate.test.ts (derivation, integrity, honesty note)
- src/tests/prompt-budget.test.ts (assembled cap, migration, honesty note + exposure-bound record + 2 exposure tests)
- src/tests/session-attach.test.ts (new: attach-failure throw)

## Decisions
- docs/ untouched (read-only constraint); cap-scope clause lives in prompt.ts header.
- Expert gate set now derives from seat config (5 tools; drops beads_list/shell forms previously dual-homed).
- Redaction: fixed exact-name allowlist (normalized) + value-pattern best-effort.
- Exposure bound: no numeric default invented (pins at build, section 7); only a
  caller-supplied test bound enforces — existing default paths unchanged.
- Exposure breach returns refused + PARKED trim/park disclosure; core-cap trim
  order (evidence, then skill-meta) runs first, so breach past that parks.

## Blockers
- None. Beads snapshot unavailable from subagent seat; claim evidence per dispatch packet.

## Status
Complete. 51/51 tests pass (49 + 2 new exposure tests). tsc --noEmit clean.
Three record lines verified present. No commits.
