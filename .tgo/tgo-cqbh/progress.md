# tgo-cqbh progress

## Objective
Bounded corrections pass on Dispatch BUILD SLICE 4 after NEEDS REVISION (B1..B4).

## Touch set
- src/memory/vault.ts (installation binding + vault-layer lookalike gate)
- src/memory/recall.ts (recall-layer lookalike gate)
- src/council/packets.ts (transcript refusal + revision binding)
- src/council/failure.ts (structured LensFailure)
- src/claims/review-gate.ts (disclosure rides result)
- src/eyes/guards.ts (fail-closed describer)
- src/prompt.ts (PS-INV-05 split; FIND-2 retired)
- src/tests/slice4-revision.test.ts (new, 13 tests)
- src/tests/prompt-budget.test.ts (FIND-2 -> split assert)
- src/tests/slice4-coverage.test.ts (record line only)

## Decisions
- Kept machineVault signature backward-compatible via optional identity; new openMachineVault enforces the guard.
- Lookalike table lives once in vault.ts; recall.ts wraps it so each layer discloses in its own voice.
- LensFailure extends (never replaces) the old shape; old assertions still hold.
- EyesSeat type unchanged; writer/expert refused as non-eyes, unknowns refused outright.

## Blockers
None.

## Status
Complete. npm test 356/356 green; tsc --noEmit clean. No commits.
