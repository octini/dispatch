# PIN-RECORD — Phase 1 candidate-pin record (Dispatch build)

## 0. Status

Phase 1 candidate-pin record (issue tgo-7lth). CANDIDATES ONLY — nothing
pins finally until Phase 2's confirm step (PS-GATE-08 record-then-confirm;
the primary spec's pin-order disambiguation). All values are
retrieval-recorded; every unverified field is labeled. All scenarios
FUTURE, not executed. No implementation. No installs. No code.

IDs: PIN-01..N for pin candidates, LIC-01..11 for licenses, SCHED-01..12
for the probe schedule.

## 1. THE PIN-CANDIDATE TABLE (grouped)

### (a) F7 work mapping — Copilot Business (docs.github.com/copilot/reference, verified)

Dispatcher/Expert = GPT-6 Astra (provider OpenAI, Powerful tier):

- PIN-01 GPT-6 Astra, per-1M <=272K context: $10 in / $1 cached / $12.50
  cache-write / $50 out.
- PIN-02 GPT-6 Astra, per-1M >272K context: $20 in / $2 cached / $25
  cache-write / $75 out.
- Business pooled AI credits: 1,900/user/mo.

Writer/Seeker = GPT-6 Luna (Lightweight tier):

- PIN-03 GPT-6 Luna, per-1M <=272K context: $0.10 in / $0.01 cached /
  $0.125 cache-write / $0.50 out.
- PIN-04 GPT-6 Luna, per-1M >272K context: $0.20 in / $0.02 cached / $0.25
  cache-write / $0.75 out.

Backups:

- PIN-05 GPT-5.6 Sol (Powerful): $4 in / $0.40 cached / $5 cache-write /
  $20 out per 1M.
- PIN-06 GPT-5.6 Terra (Versatile): $2 in / $0.20 cached / $2.50
  cache-write / $12 out per 1M.

Effort values (xhigh/max per Q41): NOT independently verified — the
public Copilot docs list no max/xhigh tiers; carried as Q41-reported.
Vision: unknown. Tokenizer: not listed.

### (b) F7 Go mapping — opencode.ai/docs/go, last updated 2026-09-24 (verified)

- PIN-07 Dispatcher = glm-5.3-flash (zen/go/v1/chat/completions,
  openai-compatible; $0.15 in / $0.50 out / $0.03 cached per 1M; $60/mo
  limit; est 6,320/5hr, 31,580/mo).
- PIN-08 Writer/Seeker = muse-spark-1.3-contributor (zen/go/v1/responses,
  openai; $0.10 in / $0.20 out / $0.002 cached per 1M; $60/mo limit; est
  45,300/5hr, 226,600/mo; limited regions; contributor tier trains on
  prompts).
- PIN-09 Expert = mimo-v2.6-pro (chat/completions; $0.435 in / $0.87 out /
  $0.003625 cached per 1M; $15/mo limit; est 3,250/5hr, 16,300/mo).
- PIN-10 Backup = deepseek-v4.1-flash (see the promo note in section
  1(f)).
- PIN-11 Backup = mimo-v2.6-flash ($0.14 in / $0.28 out / $0.0028 cached
  per 1M; $60/mo limit; est 30,100/5hr).
- PIN-12 Backup = qwen3.8-flash (zen/go/v1/messages, anthropic SDK; $0.15
  in / $0.47 out / $0.016 cached + $0.20 write per 1M; $30/mo limit; est
  5,400/5hr).

Effort values: Q41-reported, not listed on the sheet. Vision: unknown.
Tokenizer: not listed.

### (c) F16 lens candidates

Go cheap-to-mid provider-diverse (matching the TGO band precedent):

- PIN-13 muse-spark-1.3-contributor (Meta).
- PIN-14 qwen3.8-flash (Alibaba).
- PIN-15 deepseek-v4.1-flash (DeepSeek).

Work cheap-mid Business tier candidates (all GA per the
supported-models + pricing pages):

- PIN-16 GPT-5.6 Luna (Lightweight).
- PIN-17 GPT-5.6 Terra (Versatile).
- PIN-18 Grok 4.5/4.6 (Versatile; $2 in / $6 out per 1M).
- PIN-19 Kimi K2.7 Code ($0.95 in / $4 out per 1M).
- PIN-20 Gemini 3.6-3.8 Flash (promo $0.75 in / $3.75 out per 1M through
  Dec 31 2026).
- PIN-21 MAI-Code-1.1-Flash ($0.20 in / $1.20 out per 1M).

### (d) PS-GATE-10 gpt-5.6 alias — does NOT resolve to Sol

Evidence: the Copilot docs list three distinct SKUs (GPT-5.6 Luna vs Sol
vs Terra) with separate prices/categories; bare "GPT 5.6" is ambiguous.
The Go catalog + /v1/models list only gpt-5.6-luna (no Sol/Terra); a bare
alias on the Go path resolves to Luna if anything. No Sol-alias evidence
found.

Record: the alias is AMBIGUOUS on the work path and LUNA-resolving on the
Go path; the F7-MP-10 distrust rule stands (bare aliases never pin; exact
SKU ids only).

### (e) Thinking variants

The F7 rule (the highest available per seat; max where offered, xhigh
where capped) is Q41-reported; the public Copilot + Go docs list NO
max/xhigh variant range. The "Spark/Grok cap at xhigh" claim:
UNVERIFIED. Per-SKU variant ranges: not listed in either catalog (Copilot
uses Default/Long-context tiers by token threshold; Go lists no
variants). All variant values carried as Q41-reported candidates pending
the Phase-2 live-picker probe.

### (f) Go cost/quota current — the live sheet, 2026-09-24 (5hr = 20%, weekly = 50%)

The per-1M + monthly-limit + request-estimate figures in section 1(b)
stand, PLUS the DeepSeek V4.1 Flash note: the sheet still displays the
"$15 $60 4x - Ends Sep 27" promo at fetch time; the expiry date
(Sep 27) is future relative to the fetch date, CONTRADICTING the dispatch
brief's "EXPIRED 2026-09-27" framing. Conflict recorded honestly: the
sheet state at fetch shows the promo live; the expiry is 2026-09-27; the
brief's expired-framing is flagged as a brief error (the fetch date
(2026-09-24) precedes the expiry).

Peak/off-peak: $0.30 in / $1.20 out peak, $0.15 in / $0.60 out off-peak.

## 2. THE LICENSE-VERDICT TABLE (LIC-01..11, F6-Q4 verify-then-admit)

ALL 11 VERIFIED-PERMISSIVE:

- LIC-01 mattpocock/skills — MIT (github.com/mattpocock/skills/blob/main/LICENSE) — VERIFIED-PERMISSIVE.
- LIC-02 BMAD-METHOD (bmad-code-org/BMAD-METHOD) — MIT + trademark notice — VERIFIED-PERMISSIVE.
- LIC-03 GSD (gsd-build/get-shit-done, archived, moved to open-gsd/gsd-core) — MIT — VERIFIED-PERMISSIVE.
- LIC-04 spec-kit (github/spec-kit) — MIT — VERIFIED-PERMISSIVE.
- LIC-05 MemPalace (MemPalace/mempalace official ONLY, develop branch; impostor warning on repo) — MIT — VERIFIED-PERMISSIVE.
- LIC-06 magic-context (cortexkit/magic-context) — MIT — VERIFIED-PERMISSIVE.
- LIC-07 qmd (tobi/qmd) — MIT — VERIFIED-PERMISSIVE.
- LIC-08 Graphiti (getzep/graphiti) — Apache-2.0 — VERIFIED-PERMISSIVE.
- LIC-09 Letta (letta-ai/letta) — Apache-2.0 — VERIFIED-PERMISSIVE.
- LIC-10 ECC (affaan-m/ECC) — MIT — VERIFIED-PERMISSIVE on search-highlight evidence + repo metadata; the RAW LICENSE fetch is deferred to Phase 2 (noted gap).
- LIC-11 ruflo (ruvnet/ruflo) — MIT — VERIFIED-PERMISSIVE on the same basis; same raw-fetch deferral note.

(obra/superpowers + addyosmani/agent-skills remain the verified-MIT
exceptions on record.)

## 3. THE PROBE SCHEDULE (SCHED-01..12, the PS-GATE-01..11 owners + expected outputs + order)

Phase 2 runs the gates in the primary spec's section-5 order with these
additions:

- SCHED-01 the Pi core/harness re-pin (owner F6/F13; output the pinned
  revision + the harness SHA + drift disclosure).
- SCHED-02 the extension picks (F1/F2/F10/F13; the pinned set with
  provenance).
- SCHED-03 the donsetch adapter-form probe (F10; the recorded selection).
- SCHED-04 the AFT interception probe (F2; the verified mapping or parked
  capability).
- SCHED-05 the Magic Context path-(a)/(b) gate (F12; the recorded path
  WITH THE USER'S WORD before pinning).
- SCHED-06 the TUI tracker prototype (F18; the placement verdict or
  disclosed fallback).
- SCHED-07 the keyless caps probes (F10; the probe-pinned cap record, all
  8 targets, Tavily/Firecrawl as reserves).
- SCHED-08 the SKU + vision-flags confirm (F7/F17; the FINAL pin record —
  this is the Phase-1 candidates' confirm step).
- SCHED-09 the search-slot pin (F10; Exa/Parallel).
- SCHED-10 the gpt-5.6 alias check (F7; the alias-resolution evidence —
  the Phase-1 finding (ambiguous/Luna) gets confirmed or corrected).
- SCHED-11 the OS matrix (F13; both-lanes green).
- SCHED-12 (additive): the ECC + ruflo raw LICENSE fetch (closing the
  Phase-1 gap).

## 4. THE VERIFICATION-CHAIN NOTE + THE PHASE-2 CONFIRM RULE

Phase 1 retrieval executed under the documented TGO chain (berstein
orchestration with claim gates + horowitz independent review + nirvana
band review with the lens substitution recoveries + dylan implementation
+ nas retrieval, all GAPS-reported); every pin candidate carries its
verification state; nothing pins finally until Phase 2.

Phase-2 confirm rule: record-then-confirm; the user sees the pin record
before it finalizes where the specs require it.

## 5. GAPS (carried into Phase 2)

1. The effort/variant values (Q41-reported, unverified).
2. The vision flags (unknown except the model-comparison visuals note).
3. The tokenizer identities (not listed).
4. The ECC/ruflo raw LICENSE fetch (SCHED-12).
5. The DeepSeek promo-date conflict (recorded in section 1(f)).

## 6. Phase 2 — build-experiment records (SCHED-01..12, issue tgo-mxyg, 2026-09-28)

Phase 2 records complete; Phase 3 planning next. Both probe passes landed; this section is the record half. All values retrieval-recorded; all scenarios FUTURE, not executed. No implementation. No installs. No code. Zero decision changes beyond the two recorded user words (SCHED-05 path (a), SCHED-09 keyless trio).

### SCHED-01 the re-pin

- Harness marcfargas/pi-test-harness tag v0.6.1 = 72af5484cdc4bac1c421c86929782fa8a45db959 -> commit b99b1944e4421eedddc25201f93116bbff76af21; HEAD = the same SHA (NO DRIFT). VERIFIED.
- npm @marcfargas/pi-test-harness latest 0.6.1. VERIFIED.
- Pi core live state: npm @mariozechner/pi 0.70.6; npm pi 2.0.5; @earendil-works/pi-agent-core dist-tags {legacy-node20: 0.74.2, latest: 0.87.1}; badlogic/pi-mono HEAD 7cf037c (tags to v0.9.4). VERIFIED.
- The harness CI matrix pins @earendil-works/* 0.74.2 + 0.75.4 — the fork line lags the 0.87.1 latest. VERIFIED (drift disclosed).
- DESIGN NOTE (user-framed): the product targets the CURRENT Pi (the batteries frame's "fresh Pi install"); the harness's CI matrix gains the current line as a named Phase-3 task with the drift risk disclosed.

### SCHED-02 the extension picks

- pi-subagents 0.71.0 (github.com/nicobailon/pi-subagents) — subagents.modelScope enforce:true confirmed (docs/models.md:189; global + per-agent allow-lists; project-over-user). VERIFIED.
- The permissions enforcement surface NOT LOCATED (the F2-PE-13 surface unpinned — the candidate file was wrong; a Phase-3 hunt must find it before any seat-scoped grants pin). UNPINNED — Phase-3 hunt.
- The harness macOS lane ABSENT. VERIFIED (see SCHED-11).
- The MCP adapters: @pi-unipi/mcp 2.20.5 (direct multi-server) vs pi-mcp-adapter 2.37.0 (single-proxy) — both live on npm; the selection is a Phase-3 spec call (candidates recorded). RECORDED, selection open.

### SCHED-03 the donsetch adapter form

- donsetch 4.3.3 (npm dondai1234; a 28.7 kB tarball) ships bin/donsetch.js (CLI spawning the native binary, stdio inherit, signal forwarding), `donsetch mcp` (stdio JSON-RPC), and pi-extension.ts (spawns `donsetch mcp` at session_start, dynamic tools/list -> pi.registerTool() proxy, SHA256-verified binary download from github.com/dondai44423/donsetch releases). VERIFIED.
- Four tools: web_fetch / web_search / web_crawl / web_screenshot. VERIFIED.
- PRIMARY = the CLI/MCP subprocess adapter (the AGPL separate-process boundary). RECORDED (probe result, not a final pin).
- The native pi-extension = fallback candidate only (it registers dynamically-discovered tools in-process), needing BOTH the AGPL-boundary ruling and F2-PE-13 enforceability. RECORDED.
- The LICENSE-text fetch is CLOSED 2026-09-29 (issue tgo-esi6; see PS-GATE-03 pin block): AGPL-3.0-only, sourced. Boundary ruling now sourced (still UNSIGNED pending signature).

### SCHED-04 the AFT interception

- @cortexkit/aft-pi 0.57.2 (cortexkit/aft, MIT) hoists Pi built-ins read/write/edit/grep (+ bash companions bash_status/watch/write/kill). VERIFIED.
- Mutate: write, edit, aft_import write ops, aft_safety restore, ast_grep_replace, aft_delete, aft_move. VERIFIED.
- Read: aft_inspect, aft_zoom, aft_search, aft_outline, aft_conflicts, aft_callgraph, ast_grep_search, lsp_diagnostics. VERIFIED.
- F2-PE-13 note: tool-registration.ts predicates are ONLY "canonical name not in disabled list" — names/prefixes alone under-specify enforcement; the capability+operation+arguments+resolved-targets mapping must be authored per tool before any seat-scoped grants pin (a named Phase-3 task). RECORDED.

### SCHED-05 the Magic Context path gate — USER WORD RECORDED 2026-09-28: PIN PATH (a) (disable-historian + native compaction)

- The probe: @cortexkit/pi-magic-context 0.43.0 exists; path (a)'s mechanism is available (the historian is config-gated; native compaction host-owned); path (b)'s session_before_compact hook is UNCONFIRMED (not found in pi-mono core at probed paths; the ExtensionAPI exposes compact({customInstructions,onComplete,onError}) + read-only sessionManager — a custom-archiver shape is plausible but unproven). VERIFIED (availability) / UNCONFIRMED (path b hook).
- The live cleanliness run (no dual summarization, no data loss, Magic writes confined to its own store) = a Phase-3 VERIFICATION, not a gate (per the user's pin). RECORDED.

### SCHED-06 the TUI tracker prototype

- The Pi ExtensionAPI surface confirmed (core/extensions/types.ts: setStatus, setWidget, setHeader/setFooter/setTitle, registerMessageRenderer/registerEntryRenderer/appendEntry, registerCommand/registerShortcut/registerFlag, dialogs, autocomplete, compact trigger). VERIFIED.
- The mount-visibility probe NOT RUN (needs a live Pi TUI) — a fuller prototype needed; the disclosed rendered-board fallback stands until a panel mounts AND renders visibly (the tgo-hv6 lesson). NOT RUN — Phase 3.

### SCHED-07 the keyless caps (verbatim)

- markdown.new 200 (works keyless). VERIFIED.
- Jina r.jina.ai 401 AuthenticationRequiredError ("blocked from performing anonymous queries due to bad network reputation (AS9009)") — keyless dead from this network. VERIFIED.
- Context7 200 (anonymous search works). VERIFIED.
- TinyFish: api.tinyfish.io unreachable directly (http=000); reaches us indirectly via pi-webaio 1.0.7 (bundles TinyFish Fetch + Firecrawl Keyless Scrape). VERIFIED (indirect only; direct endpoint open).
- Exa x402 PAYMENT_REQUIRED ($0.007 USDC per search on Base/Solana — NO keyless tier). VERIFIED.
- Parallel 401 (failed to resolve API key). VERIFIED.
- Tavily (reserve) 401 (missing or invalid API key). VERIFIED.
- Firecrawl (reserve) 403 ("your IP address looks suspicious... Sign up for a free API key... 1000 credits"). VERIFIED.
- The reserves stay inactive. RECORDED.

### SCHED-08 the SKU + vision-flags confirm

- The Go endpoint (opencode.ai/zen/go/v1/models, 41 ids) exposes gpt-5.6-luna + gpt-6-luna ONLY of the GPT families (NO -sol/-terra). VERIFIED.
- The Zen endpoint (opencode.ai/zen/v1/models, 83 ids) exposes gpt-5.6-sol/-terra/-luna + gpt-6-luna/-sol/-astra. VERIFIED.
- Prices confirmed (the Go sheet 2026-09-24; the usage rule 5h=20%/weekly=50%/monthly=100%). VERIFIED.
- Sol vision = YES (developers.openai.com/api/docs/models/gpt-5.6-sol lists text+image input; image_input supported). VERIFIED.
- Terra/Luna vision = UNKNOWN (the OpenAI detail pages not fetched; the Copilot visuals table lists only GPT-5 mini + Sonnet 4.6). UNKNOWN — open at the confirm.
- The tokenizer = UNVERIFIED (no catalog publishes a token unit). UNVERIFIED.
- The effort vocabulary RESOLVED (the OpenAI reasoning guide): none/low/medium (default)/high/xhigh/max — minimal dropped on 5.6+, max requires 5.6+, ultra is NOT an effort value (it names the product orchestrator / Responses multi-agent beta). VERIFIED.
- The variant values remain API-determined-at-runtime candidates. RECORDED.
- The DeepSeek promo: the sheet STILL displays the "$15 $60 4x - Ends Sep 27" rows one day past the end date (the enforcement unknown; the ZDR footnote: valid through Sep 30 2026). VERIFIED (display state); enforcement UNKNOWN.

### SCHED-09 the search slot — USER WORD RECORDED 2026-09-28: the keyless trio (donsetch scraped-SERP search -> markdown.new -> Context7) CARRIES V1 (the Q8 zero-paid posture holds)

- Exa primary + Parallel fallback remain the KEYED diversity slot (the BYOK upgrades; the F2-Q5 grant rules govern when keys exist). RECORDED.
- The chain-degradation rule: the documented-exhaustion fallback to the Tavily/Firecrawl reserves stands (F10's reserve rule). RECORDED.

### SCHED-10 the gpt-5.6 alias — CONFIRMED + refined

- OpenAI's docs state the bare `gpt-5.6` alias routes to GPT-5.6 Sol; the Go path resolves bare gpt-5.6 to Luna in practice (only gpt-5.6-luna exists there). VERIFIED.
- The PIN RULE: suffixed SKU ids ONLY (gpt-5.6-sol / -terra / -luna); bare aliases never pin (the F7-MP-10 distrust vindicated and sharpened). RECORDED.

### SCHED-11 the OS matrix

- The harness ci.yml (v0.6.1 = HEAD): the verify job ubuntu-latest; the integration matrix os [ubuntu-latest, windows-latest] x node [22,24] x pi [0.74.2, 0.75.4]. NO macOS lane. VERIFIED.
- Per the F13-Q1 override (Windows AND macOS green in v1), a macos-latest lane needs authoring — one matrix entry plus mac-specific install handling (a named Phase-3 task). RECORDED.

### SCHED-12 the raw LICENSE fetches

- ECC (raw.githubusercontent.com/affaan-m/ECC/main/LICENSE) = MIT, Copyright (c) 2026 Affaan Mustafa — CONFIRMED. VERIFIED.
- ruflo (raw.githubusercontent.com/ruvnet/ruflo/main/LICENSE) = MIT, Copyright (c) 2024-2026 ruvnet — CONFIRMED. VERIFIED.
- The Phase-1 gap closes. RECORDED.

## 7. Phase B — RUNTIME PROBES (issue tgo-esi6, live installs + runs; installs per the user's go)

Probe installs ran in /tmp/psgate (never in the repo); no publish, no push, no config changes. npm latests re-checked at probe time.

### PS-GATE-01 Pi core / harness re-pin — VERIFIED, NO DRIFT

- @marcfargas/pi-test-harness: npm latest STILL 0.6.1; installed 0.6.1 OK (macOS/arm64, node 26). dist.shasum 084b400b1d8be9c0a2498728246f511ce3ee2a8c. Tag record stands (v0.6.1 = 72af548 -> b99b194). NO DRIFT vs the 0.6.1 record.
- Pi core live: npm pi 2.0.5; @mariozechner/pi 0.70.6 (installed OK; deprecation note: @mariozechner/pi-ai -> @earendil-works/pi-ai); @earendil-works/pi-agent-core + pi-coding-agent 0.87.1 (installed via harness deps). VERIFIED.
- Fork-line lag stands (harness CI pins 0.74.2/0.75.4 vs 0.87.1 latest). RECORDED.

### PS-GATE-02 extension picks — VERIFIED except selection-open MCP call

- pi-subagents 0.71.0 (npm; tarball packed + inspected): modelScope {enforce, strict, allow-globs, per-agent lists}, project-over-user, load-time rejection of empty allow. VERIFIED (code + docs/models.md:189).
- Permissions surface: exhaustive hunt across pi-agent-core 0.87.1, pi-coding-agent 0.87.1, @mariozechner/pi 0.70.6 (agent loop, TUI modes, ExtensionAPI types) finds NO programmatic tool-permission gate (--approve only trusts project-local files). The earlier gap is now a VERIFIED ABSENCE: F2-PE-13 enforcement lives Dispatch-side (Slice 1 permission-gate.ts). RECORDED.
- Harness macOS lane: Phase-2 ABSENT record stands; the lane is authored in Slice 5 ci.yml (see PS-GATE-11). RECORDED.
- MCP adapters: @pi-unipi/mcp 2.20.5 (direct multi-server) vs pi-mcp-adapter 2.37.0 (single-proxy), npm latests unchanged. Selection stays a Phase-3 spec call. RECORDED.

### PS-GATE-03 donsetch adapter form — VERIFIED live

- donsetch@4.3.3 installed; live `donsetch mcp` stdio run: initialize -> serverInfo donsetch 4.3.3; tools/list -> web_fetch / web_search / web_crawl / web_screenshot. CLI/MCP-subprocess primary VERIFIED (AGPL separate-process boundary). Native pi-extension stays fallback BEHIND the gate.
- donsetch 4.3.3 tarball + license pin — CLOSED 2026-09-29 (issue tgo-esi6, Nas pass verified 2026-09-29): version 4.3.3; integrity `sha512-WKI+LvuZmcejFXJ0Vsh87r6OUIOD4VMneL/67xRBFI4sI7AgqjyuQwnl2bY05NVntPey0HtC08RoJHnbqvglrw==`; shasum `58ddb6156224e7fb636683af33a94b4f7e2f7b9c`; tarball https://registry.npmjs.org/donsetch/-/donsetch-4.3.3.tgz; gitHead `bcbcc488b0310211a0aa977b232659f9dd7d4811`; license AGPL-3.0-only (npm registry license field + tarball package.json + source repo LICENSE at https://github.com/dondai44423/donsetch gitHead bcbcc488b0310211a0aa977b232659f9dd7d4811 + README "AGPL-3.0. Copyright (c) 2026 Bishesh Bhandari."); "or any later version" wording ONLY in FSF template text, never the applied grant (applied grant `-only` per package.json; npm/repo LICENSE copies identical, no conflict).

### PS-GATE-04 AFT interception — VERIFIED (Dispatch-side mapping)

- @cortexkit/aft-pi 0.57.2 bundle inspected: the Pi-path prepareToolDefinitionForRegistration returns the tool UNCHANGED (zero predicate); only a canonical-name disabled-set gates registration; bindToolRegistrationFunnel proxies registerTool (the hook point). No capability/operation/argument/target enforcement exists in AFT — confirmed in code, not assumed.
- F2-PE-13 mapping VERIFIED Dispatch-side: permission-gate.ts (GateToolCall/GateDecision/resolveTargets, deny-log-and-park on unmapped tools). Tool inventory recorded (aft_zoom/delete/search/safety/outline/move/callgraph/inspect/read/grep/bash/powershell/import/edit/conflicts + hoisted read/write/edit/grep/bash).

### PS-GATE-05 Magic Context path (a) — PIN STANDS; live run NOT RUN

- @cortexkit/pi-magic-context latest 0.43.2 (record said 0.43.0): historian is config-gated (config.historian) -> path-(a) mechanism available. session_before_compact IS present in the 0.43.2 bundle (compaction-off mode yields to native compaction) — CORRECTS the Phase-2 UNCONFIRMED.
- Live cleanliness run NOT RUN (needs a keyed model session; no keys in scope) — stays the Phase-3 verification per the user's pin. Reason recorded.

### PS-GATE-06 TUI tracker — NOT RUN; fallback stands

- ExtensionAPI 0.87.1 types: setStatus/setWidget/setHeader/setFooter/registerCommand; NO panel/tab API. Mount-visibility probe NOT RUN (needs a live Pi TUI) — placement UNPINNED; disclosed fallback (statusline + rendered board) stands.

### PS-GATE-07 keyless caps — RE-VERIFIED live (all 8 match Phase 2)

- markdown.new 200. Jina 401 AuthenticationRequiredError, AS9009 bad-reputation block (verbatim captured). Context7 200. TinyFish direct unreachable (000). Exa X402_PAYMENT_REQUIRED ($0.007 USDC). Parallel {"code":16,"message":"No API key provided (C.0)"}. Tavily 401 missing/invalid key. Firecrawl 403 suspicious-IP (verbatim captured). Reserves stay inactive. VERIFIED.

### PS-GATE-09 search slot — user word stands + live support

- Keyless trio carries v1 (SCHED-09 word); live `donsetch search` ran keyless OK just now (7 results, local provider, 3.9s; yahoo/mojeek/google blocked from this network — disclosed). Exa/Parallel remain the keyed BYOK slots under F2-Q5. RECORDED.

### PS-GATE-11 CI lanes — macOS local GREEN; rest CI-only

- dispatch `npm run build` clean + `npm test` 435/435 pass, macOS arm64, node 26.0.0 (engines floor >=22.19 satisfied; matrix asks 22/24 — version skew disclosed, only node 26 on host). VERIFIED (local cell).
- windows-latest + node 22/24 cells NOT RUN (need CI runners; untriggerable without push — refused by scope). ci.yml authors [windows,macos]x[22,24] with mac install handling. Reason recorded.

### THE PIN FILLS

- HARNESS_SHA (F13): RESOLVED-BY-PROBE -> 0.6.1 / shasum 084b400b1d8be9c0a2498728246f511ce3ee2a8c / tag 72af548 -> b99b194 / no drift. (src HARNESS_SHA_PIN flip deferred: tests assert UNVERIFIED; needs a user-worded follow-up.)
- LOCK_TTL + PARK_DEADLINE (F4/Slice 2), STALENESS_MAX_AGE (F18), SNIPPET_BOUND (F10-Q10), FRESHNESS_WINDOW (F15/F10): UNVERIFIED — no probe resolves a chosen value. Snippet evidence only: live keyless snippets observed ~100-200 chars, under the disclosed 280 default.

## 8. GAPS (Phase-B carried)

1. The permissions-enforcement surface hunt (Phase 3).
2. The donsetch LICENSE fetch — CLOSED 2026-09-29 (AGPL-3.0-only, sourced; see PS-GATE-03). Boundary ruling now sourced; only the user signature stays open.
3. The Magic path-(a) live cleanliness run + the TUI mount-visibility prototype (Phase 3).
4. The TinyFish direct endpoint (indirect only).
5. The Terra/Luna vision flags + the tokenizer identity (open at the confirm).
6. The DeepSeek promo post-expiry enforcement (unknown).

## 9. Build-pin — user-worded 2026-09-28 (issue tgo-esi6)

Agreed on all. Supersedes the section-7 PIN FILLS deferred note: the five chosen-value pins below are user words, not probe outputs. Zero decision changes beyond these pins.

### 9.1 Corrections (recorded, supersede earlier lines where stated)

- Writer/Seeker price record: Writer/Seeker = gpt-5.6-luna $0.20 in / $1.20 out per 1M short-context. The section-1(a) "GPT-6 Luna $0.10/$0.50" record is RETIRED (it matched no catalog).
- GATE-05: session_before_compact IS present in the Magic 0.43.2 bundle (compaction-off mode yields to native compaction). The Phase-2 "UNCONFIRMED" was wrong. The path-(a) pin stands pending the user's path-(b) exploration; the Magic path-(a) pin CONFIRMED by the user 2026-09-28 (the path-(b) custom-archiver exploration = the documented F12 fallback; the pilot watches for a fidelity gap).
- GATE-02: the Pi permission surface = VERIFIED ABSENCE (agent loop, TUI, ExtensionAPI hunt across pi-agent-core 0.87.1, pi-coding-agent 0.87.1, @mariozechner/pi 0.70.6). F2-PE-13 enforcement = Dispatch-side (our permission-gate).
- GATE-01: harness 0.6.1 + SHA 084b400b + NO DRIFT (tag v0.6.1 = 72af548 -> b99b194; dist.shasum 084b400b1d8be9c0a2498728246f511ce3ee2a8c). Pi core 0.87.1 (the fork-line lag stands: harness CI pins 0.74.2/0.75.4).
- GATE-03: donsetch 4.3.3 MCP stdio verified (initialize -> serverInfo 4.3.3; tools/list -> web_fetch / web_search / web_crawl / web_screenshot). Subprocess primary (AGPL separate-process boundary); native pi-extension stays fallback behind the gate.
- GATE-04: the AFT funnel is name-only (prepareToolDefinitionForRegistration returns the tool unchanged; only a canonical-name disabled-set gates registration). The capability+operation+arguments+resolved-targets mapping = Dispatch-side (permission-gate.ts).
- GATE-07: the 8 caps re-verified live, all matching Phase 2 (verbatims captured: markdown.new 200; Jina 401 AS9009; Context7 200; TinyFish direct 000/indirect via pi-webaio; Exa X402 $0.007 USDC; Parallel 401 C.0; Tavily 401; Firecrawl 403 suspicious-IP). Reserves stay inactive.
- GATE-09: the keyless trio stands and is live (donsetch search ran keyless OK: 7 results, local provider, 3.9s; yahoo/mojeek/google blocked from this network — disclosed). Exa/Parallel remain the keyed BYOK slots under F2-Q5.
- GATE-11: dispatch build clean + 435/435 pass, macOS arm64, node 26.0.0 (engines floor >=22.19 satisfied; matrix-skew disclosed). windows-latest + node 22/24 cells CI-only (untriggerable without push; the push pass triggers them).

### 9.2 Pin fills (user-worded 2026-09-28)

- Exposure budget (Slice 4 ledger): default 2000 tokens, configurable; warnings at 75% (1500); breach = the F8-Q9 trim/park path. Src: DEFAULT_EXPOSURE_BOUND / EXPOSURE_BOUND_PIN.
- Lock TTL / deadline (F4 per-issue lock crash-release): 30s (30000ms). Src: LOCK_TTL_MS / LOCK_TTL_PIN, PARK_DEADLINE_MS / PARK_DEADLINE_PIN.
- Staleness max-age (F18 board/statusline stale threshold): 120s (120000ms). Src: STALENESS_MAX_AGE_MS / STALENESS_MAX_AGE_PIN.
- Freshness window (retrieval claims fresh bound, F10/F15): 24h (86400000ms). Src: TRAIL_FRESHNESS_WINDOW_MS / TRAIL_FRESHNESS_WINDOW_PIN.
- Snippet bound (F10-Q10 disclosed default): 280 chars (live snippets measured 100-200, under the default). Src: DEFAULT_SNIPPET_BOUND / SNIPPET_BOUND_STATUS.

### 9.3 Open items (honest list)

1. Tokenizer unit: all SKUs UNVERIFIED (no catalog publishes it). REFINED by the 2026-09-29 retrieval (section 10.1) — work-path gpt-5.6 SKUs record o200k_base; Go-path seats stay UNVERIFIED.
2. Lens effort floors: values remain API-determined-at-runtime candidates. REFINED by the 2026-09-29 retrieval (section 10.2) — per-SKU floors recorded; confirm stays Phase-2.
3. mimo-v2.6-pro + glm-5.3-flash vision flags: UNKNOWN. REFINED by the 2026-09-29 retrieval (section 10.3) — mimo YES/YES, glm provider-level YES but GO FLAG UNVERIFIED.
4. DeepSeek Go-promo post-Sep-27 enforcement: UNKNOWN (sheet still displayed the promo one day past the end date).
5. AGPL boundary sign-off: the user's ship blocker (LICENSE AGPL-3.0-only sourced + tarball pinned 2026-09-29; ruling sourced; only the signature stays open).
6. Magic path-(b) exploration: in flight (user's).
7. TUI mount-visibility: needs a live TUI (placement UNPINNED; disclosed fallback stands).

## 10. Build-pin retrievals (issue tgo-esi6, Nas retrieval 2026-09-29, record-only)

Retrieval-recorded 2026-09-29; nothing pins finally until the Phase-2 confirm (SCHED-08). Refines (never rewrites) the 9.3 open items 1-3. Sources: the OpenAI model/vision/effort pages, QwenCloud, DeepSeek thinking_mode docs, Xiaomi deep-thinking docs, the rust-tiktoken crate, the HF READMEs, the Go sheet (opencode.ai/docs/go; the Go /v1/models exposes no tokenizer field).

### 10.1 Tokenizer units (F8-Q8 prompt-core 500/1000 budget unit)

- gpt-5.6-sol = o200k_base (WORK-PATH unit).
- gpt-5.6-terra = o200k_base (WORK-PATH unit).
- gpt-5.6-luna = o200k_base (WORK-PATH unit).
- deepseek-v4.1-flash = deepseek_v4 (V3 vocab + V4 specials).
- glm-5.3-flash = UNVERIFIED (the crate lists glm5 for GLM-5/5.2 only).
- muse-spark-1.3-contributor = UNVERIFIED.
- mimo-v2.6-pro = UNVERIFIED.
- mimo-v2.6-flash = UNVERIFIED.
- qwen3.8-flash = UNVERIFIED (the crate lists qwen2 for Qwen 2.5/3 only).
- The Go /v1/models exposes no tokenizer field (recorded gap, not a value).

### 10.2 Lens effort floors (F16-RC-06; SCHED-08 vocabulary)

- muse-spark-1.3-contributor = minimal/low/medium/high/xhigh (NO max; xhigh-cap CONFIRMED, max-cap REFUTED; "off" disables).
- qwen3.8-flash = low/medium/xhigh (default xhigh; max/high auto-map to xhigh).
- deepseek-v4.1-flash = low/high/max (default high; none disables; numeric 1-100, low=50/high=75/max=100; medium→high, xhigh→high).
- gpt-5.6-sol/terra/luna = none/low/medium/high/xhigh/max (default medium).
- glm-5.3-flash = low/high/max (default max).
- mimo-v2.6-pro/flash = NO graded effort (thinking.type enabled/disabled only; low/medium/high accepted no-op; max 400s timeout not an effort level). SCHED-08 map: none=disabled, low/medium/high=enabled-indistinguishable, xhigh/max unsupported.

### 10.3 Vision flags (F17-VL-03 image_input)

- gpt-5.6-sol = YES.
- gpt-5.6-terra = YES.
- gpt-5.6-luna = YES.
- muse-spark-1.3-contributor = YES.
- mimo-v2.6-pro = YES.
- mimo-v2.6-flash = YES.
- glm-5.3-flash = provider-level YES (HF natively multimodal) but the GO FLAG UNVERIFIED (the Go sheet has no image_input column).

## 11. S-SUITE → REQUIREMENT-ID MAPPING (recorded 2026-09-29, issue tgo-7a26)

Draft from the 2026-09-29 pass. P = primary, S = secondary. The invariance rows are P-series by nature.

- S1 interrupted: P F5-DS-01,04,05,06,07,08,09,10; F1-AR-05; F4-BI-05; F12-WC-01; F3-SD-04,04a / S F4-BI-03,04,06,09; F5-DS-12; F12-WC-09; F13-VH-08; F16-RC-10
- S2 stale memories: P F11-DM-01,02,03,04,07,08,09,10,11; F12-WC-04; F4-BI-09 / S F11-DM-05,06; F15-RD-01; F5-DS-01; F12-WC-03
- S3 denied tools: P F2-PE-01,02,03,04,05,07,08,09,12,13; F10-WR-10,12; F1-AR-02 / S F1-AR-14; F2-PE-06,10,11; F13-VH-08; F10-WR-02
- S4 model unavailable: P F1-AR-05; F7-MP-04,05,06,07,08; F16-RC-10; F17-VL-08,10 / S F7-MP-01,02,03,09; F5-DS-06; F3-SD-04; F17-VL-01,04,05
- S5 conflicting instructions: P F1-AR-07; F3-SD-06,03a; F2-PE-06; F14-WS-06; F1-AR-13 / S F1-AR-03,04,11; F16-RC-11; F3-SD-10,11
- S6 failed verification: P F1-AR-04,11,12; F3-SD-09,10; F16-RC-01,02,04,05; F13-VH-08; F4-BI-08 / S F3-SD-01,02; F16-RC-10,11; F17-VL-05; F14-WS-08; F15-RD-05; F5-DS-11
- S7 bootstrap idempotence: P F9-BS-01–12,14 / S F3-SD-04a; F4-BI-02,10; F6-PD-06
- S8 compressor single-owner: P F12-WC-01,02,04,05,07 / S F12-WC-03,06,08,09; F5-DS-07; F8-PS-03
- S9a reuse identity: P F5-DS-01,02,08 / S F7-MP-06; F5-DS-12
- S9b reuse permission: P F5-DS-01,08,10,12; F2-PE-05,09 / S F4-BI-05,09
- S9c reuse completed: P F5-DS-03,08; F12-WC-09 / S F4-BI-08; F5-DS-04
- S10 spec drift: P F3-SD-03,03a,04,07; F1-AR-01; F6-PD-02,03; F13-VH-10 / S F3-SD-01,02,08,09; F4-BI-07; F6-PD-04,05; F1-AR-07,08
- S11 zero-web disclosure: P F10-WR-01,02,07,08,09; F15-RD-01,07; F13-VH-05,11 / S F10-WR-03,04,05,06,10,11,14; F15-RD-02,03,04,05,06,08; F8-PS-13; F11-DM-10

Coverage per feature (S-covered of total; the rest = P-series rows): F1 10/14 (gap 06,08,09,10); F2 13/13; F3 11/12 (12); F4 9/12 (01,11,12); F5 11/12 (11); F6 4/12 (01,05,07,08,09,10,11,12); F7 9/12 (10,11,12); F8 1/13 (rest); F9 13/14 (13); F10 13/14 (13); F11 11/12 (12); F12 9/9 (08 secondary-only); F13 4/12 (04,05,06,07,09,10,11,12); F14 2/9 (01,02,03,04,05,07,09); F15 8/9 (09); F16 6/12 (03,06,07,08,09,12); F17 5/11 (02,03,06,07,09,11); F18 0/10 (all). HEADLINE: ~139/212 IDs S-covered (~66%); ~73 P-series rows.

Adjudication 2026-09-29 (issue tgo-7a26, orchestrator call): F2-PE-11 = EXECUTABLE — P-HIDE-13 runs through the harness mock boundary (hidden-but-authorized allows under the same guard; hidden-and-prohibited denies by policy; hiding never cited as the control).
Adjudication 2026-09-29 (issue tgo-7a26, orchestrator call): F3-SD-05 = EXECUTABLE — SDD-08/SDD-09 run as record-shape checks (compact revision-bound record present and correctly shaped; promotion to the fuller structure when no longer tiny, compactness-as-waiver refused).
