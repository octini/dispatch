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
- The LICENSE text not fetched this pass — the boundary ruling stays provisional (a named Phase-3 fetch). UNVERIFIED — Phase 3.

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

## 7. GAPS (Phase-2 carried)

1. The permissions-enforcement surface hunt (Phase 3).
2. The donsetch LICENSE fetch + the AGPL boundary ruling (Phase 3).
3. The Magic path-(a) live cleanliness run + the TUI mount-visibility prototype (Phase 3).
4. The TinyFish direct endpoint (indirect only).
5. The Terra/Luna vision flags + the tokenizer identity (open at the confirm).
6. The DeepSeek promo post-expiry enforcement (unknown).
