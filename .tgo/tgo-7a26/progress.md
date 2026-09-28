# tgo-7a26 progress — F13 S-suite build & run

## Objective
Write + run the 13-scenario S-suite (S1..S11, S9a/b/c) per PIN-RECORD §11 map, with the F13 mock boundary, real Dispatch modules.

## Touch set
- `src/tests/s-suite.test.ts` (new, 63 tests across 14 describes)

## Decisions
- Mock boundary: only streamFn/tool.execute/ctx.ui seams substituted (BootstrapEffects stub, recover() callbacks, CouncilSink route via runReviewGate routine path, no network); all modules real.
- F2-PE-11, F3-SD-05 kept PENDING-ADJUDICATION as acceptance-matrix rows in S10; P-series rows never claimed automated.
- Live probes marked PENDING-LIVE with exact blockers; only static halves execute.

## Blockers
- PS-GATE-06 TUI probe: headless (`tty` = "not a tty"), no interactive TUI; visibility unverifiable.
- PS-GATE-05 Magic run: `pi` CLI answers "No API key found for the selected model"; no keyed session in scope.

## Status
Adjudicated 2026-09-29 (issue tgo-7a26): F2-PE-11 + F3-SD-05 EXECUTABLE — P-HIDE-13 (hidden-tool branches, mock boundary) + SDD-08/09 (compact-record shape + promotion refusal, new src/sessions/tiny.ts). `npm test` 508/508 pass; `npx tsc --noEmit` clean. Committed + pushed (see log).
