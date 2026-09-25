# tgo-kztc progress

## Objective

Bounded corrections pass on Dispatch BUILD SLICE 3 after council CONCERNS (2/3; F1..F5, F1+F2 HIGH). No commits.

## Touch set

- `src/retrieval/stack.ts`: `KeyedSlotGrant`, `KEYED_GRANT_CHECK_ORDER`, `KEYED_GRANT_SEMANTICS`, `isKeyedGrantLive`, `KEYED_GRANT_REVOCATION_RECORD`, `revokeKeyedGrant`, `TRAIL_FRESHNESS_WINDOW_PIN`, `ScopedTrailRecord`, `TrailScope`, scoped `trailDocumentsExhaustion`.
- `src/adapter/donsetch-adapter.ts`: `keyedSlotGrants` grant-check before key-presence (closed + disclosed), scoped+fresh reserve activation, `seat:taskId:at` trail scoping, frozen production runner + `runRetrievalTestOnly`, `RUNNER_INJECTION_SCOPE`, `revokeKeyedSlotGrant`/`KEYED_GRANT_REVOCATION_HOME`.
- `src/claims/detector.ts`: `carrySourcesStrict` disclose-or-drop in claims path, `SOURCE_NOT_CARRIED_DISCLOSURE`, `ColdReadFinding.disclosure`, `ReviewRecord.disclosure`, hook `languageScope`/`languageScopePin`, `DETECTOR_LANGUAGE_SCOPE_PIN`.
- Tests: `adapter.test.ts` (test-only runner swap, grant-gate, stale-trail, F5 production refusal, revocation), `retrieval-stack.test.ts` (grant liveness, revocation, scoped/fresh/stale/foreign), `claims.test.ts` (F4 hook disclosure, F3 disclose-or-drop).

## Decisions

- Grant-check precedes key-presence; both must pass; closed grants disclose via trail + disclosure.
- Trail scope = seat + taskId + fresh window; window value travels as explicit param, pin stays UNVERIFIED string; absent window fails closed (0).
- Production `runRetrieval` refuses any `runner` key; tests use `runRetrievalTestOnly`.
- Snippet bound 280 untouched (PS-INV-08); docs read-only; no decision changes.

## Blockers

None.

## Re-check residuals (N1..N5 + F3, 2026-09-28, no commits)

- N1: `TRAIL_HOST_CLOCK_ANCHOR` + `TRAIL_FORGERY_BOUNDARY` (stack.ts); `hostClockScope` builder; adapter stamps/scope on host `now` only; test: forged body timestamps ignored.
- N2: `TRAIL_FRESHNESS_RELEASE_GATING` (section-7 pin + UNVERIFIED + release tie); boundary test with test-configured window (edge passes, edge+1/future refuse).
- N3: `TEST_SEAM_PRODUCTION_RULE`; `runRetrievalTestOnly` throws when NODE_ENV=production; test: seam + production-refusal.
- N4: `KEYED_GRANT_OPEN_REVERIFY` + `reverifyKeyedGrant` re-check at open; test: revoked-between-check-and-open refuses.
- N5: explicit revoked-grant-closes-chain test.
- F3 residual: corpus-wide never-silent claims-path test (existing single-case test kept).
- Window + snippet bound untouched (section-7 pins, UNVERIFIED); docs read-only; zero decision changes.

## Status

Landed Slice 3 commit 2026-09-28 (user-approved). npm test: 242 pass / 0 fail. tsc --noEmit: clean. git status clean. NO push. NO npm publish.
