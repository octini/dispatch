# EVIDENCE — citations, untested assumptions, gaps

Status: revised draft pending review. No implementation. Stage A
documentation only. Rule: every PRD and MANIFEST choice traces to
a Q number in `DECISIONS.md` (verbatim history plus latest-decision
amendments) or a citation here. Unsupported items are
labeled UNVERIFIED. Active seats are the Product Dispatch seats:
Dispatcher, Writer, Seeker, Expert.

## 1. Per-feature citation table

| Feature area | Research ticket + close reason | Memory IDs | Key verified facts used |
|---|---|---|---|
| platform/distribution | tgo-dowi: pi packages manifest and install (npm, git, local), GitHub git-tag install preferred, pin-immutable plus warn-only drift, Node floor 22.19.0 | 76 | pi package sources; COMMITTED dist requirement; trust file and prompts; bd per-OS installers |
| models/presets | tgo-rf5d: Astra is GPT-6 Astra, Luna is GPT-5.6 Luna; Astra absent from Go; assignment layers with modelScope as only true hard per-seat block; fallback A/B/C honoring never-silent | 75 | Copilot catalog pool; Go catalog gap; alias gotcha (gpt-5.6 may route to Sol); auth and budget inputs |
| roster/seats | tgo-h4y3: small stable roster plus lazily-loaded skills beats many specialists except parallel read-shaped gathering; provisional 4 seats | 69 | Four-role direction is user-accepted; agent-count numbers from the early survey are NOT evidence and are excluded |
| permissions/enforcement | tgo-7t1x: tool_call hard block versus setActiveTools hiding; 4 permission extensions compared; bypass truth table; Windows soft-only, macOS sandbox-exec | 74 | registerTool race (upstream 7406); before_agent_start skip on sendCustomMessage wake (5581); file tools bypass bash sandbox; protected-path backstop required |
| SDD/drift | tgo-97gi: repo-file spec store plus hash pointers, per-task acceptance hard gates, headless-safe approvals, routing, deviation detection | 77 | custom_message is in context, custom is not; approval UX must stay headless-safe; before_agent_start alone is not a backstop |
| prose/skills | tgo-vkcu: per-source influence table over 22 sources; TGO 19-skill seat map; Magic Context archive-only NOT supported as documented | 81 | obra MIT and addyosmani MIT verified; 11 licenses pending; skill dispositions per source |
| bootstrap/init | tgo-dowi: first-prose trigger, needsSetup signals, nested-git guard, no-clobber order, kill switches | 76 | TGO comparison: git init plus .pi/settings registration are additions; gaps: settings schema, Windows shell path, trust race |
| Beads integration | tgo-8p1y: lifecycle authority semantics, verify-first operations, install-time version and capability policy, Q50 review loop mapped to Pi, Seeker (formerly researcher) typed-local-inspection default plus bounded read-only shell for gaps with allowlist/security tests unresolved, 22-item omissions inventory | 82 | claim, close, reopen, dep, update rules; bd version floor; reconciliation and snapshot mechanics |
| web/docs/MCP retrieval | tgo-rfpi: zero-paid matrix plus per-seat MCP gating; tgo-rghl: donsetch direct-source audit with corrections; donsetch read as pinned external dependency plus thin policy adapter with CLI/MCP versus native Pi extension unresolved | 78, 80 | Tavily and Firecrawl keyless reserves; Exa and Parallel anonymous; Jina, markdown.new, TinyFish chain; MCP adapter pair; Brave and Serper disqualified as defaults |
| durable memory | tgo-u351: comparative matrix with pinned SHAs; file SSOT plus probe-selected recall aid plus admission contract; Mem0, MemPalace, qmd, and custom alternatives are unselected candidate backends compared before selection, none promised | 71 | Mem0 v3 ADD-only verified; wiki cost numbers unsourced; vendor benchmark claims separated from measured |
| working context | tgo-ngiy: compaction mechanics, Magic Context Pi package plus fail-safe, pi-safe-compact example; hybrid proposal as approved direction with unresolved compatibility, NOT a working integration | 72 | native Pi owns active compaction, Magic owns archive and retrieval, never dual-compress; --print historian loss; per-turn re-injection rule |
| delegated sessions | tgo-bapi: Pi session lifecycle plus TGO gap list; role-sensitive option D pending grilling, now decided Q31–Q35 | 73 | JSONL tree, switch and fork, RPC cursor; 8 synthetic probes |
| validation harness | tgo-uz53: harness pick plus 13 scenarios S1–S11 mapped to features, pre-pilot gates, watched metrics, rollback protocol | 79 | `@marcfargas/pi-test-harness` 0.6.1 primary, `@gaodes` fallback only; no macOS CI lane (add downstream); pins lag live Pi; verbatim strings deferred to spec review |
| models/presets operating assumption | Devin Fusion research, user-identified 2026-09-21: https://cognition.com/blog/devin-fusion (2026-06-29) | — | Sidekick pattern (frontier planner main + cost-effective sidekick, each with persistent cached contexts; main owns plan/ambiguity/final review) matches premise; VENDOR-CLAIMED FrontierCode 1.1 Extended (data 2026-08-07): Fusion 63.1 score / $1.35 per task vs Fable 5 xhigh 64.9/$10.53, Opus 5 medium 63.6/$3.51, GPT-5.6 Sol high 58.7/$3.41, Kimi K3 58.2/$3.12, Grok 4.5 high 56.6/$1.09; CRITICAL falsifier: judgment-as-deliverable delegation backfires (team-selector example: score 2754→27 at -28% cost); mechanical handoff clean (62%/32% savings at intact quality; hard-but-mechanical even beat solo) |
| models/presets cost source | OpenCode Go price sheet, authoritative cost source, read 2026-09-21: https://opencode.ai/docs/go/ | — | Kimi K3 = $3.00 input / $15.00 output per 1M, $15 monthly limit (~110 requests/5h); Qwen 3.8 Flash = $0.15/$0.47 per 1M, $30 monthly limit (~5,400 requests/5h); MiMo-V2.6-Pro = $0.435/$0.87 per 1M, $15 monthly limit (~3,250 requests/5h); DeepSeek V4.1 Flash quota promo ($15→$60) ENDS 2026-09-27 |
| platform/distribution | Same Go sheet, read 2026-09-21 | — | Pi is a listed VALIDATED CLIENT for Go (session-header support per that page) — platform-relevant |

Slot-comparison facts used by PRD section 3.1 and MANIFEST extension
picks: memory 67 (Pi core hooks and slots) and memory 68 (subagent,
permission, and MCP comparison outcomes).

## 2. Untested assumptions and runtime-test list

Each item needs a live probe or a spec-phase pin before build. All are
UNVERIFIED.

1. Pi outputSchema typed findings — parity unproven (audit tgo-8p1y).
2. parentID lineage parity — unproven (audit tgo-8p1y).
3. pi.exec parity — unproven (audit tgo-8p1y).
4. Packaging auto-install parity on Windows and macOS (research tgo-dowi
   gaps: settings schema, Windows shell path, trust auto-install race).
5. Magic Context archive-only custom adaptation, two paths (audit tgo-vkcu;
   memory 81): (a) native compaction on plus Magic historian disabled,
   clean no-op UNVERIFIED; (b) session_before_compact cancel plus custom
   archiver with correct firstKeptEntryId and tokensBefore. Both need a
   build-phase eval. Approved direction with unresolved compatibility,
   NOT a working integration; selection/probe blocker.
6. Windows shell-glue per-segment matching — unproven; TGO allowlist is
   posix-only (research tgo-97gi).
7. Keyless caps live probes: Exa anonymous, Parallel anonymous, Jina 20 RPM
   no-key, markdown.new 500/day/IP, TinyFish free fetch rate, Tavily and
   Firecrawl keyless 1k/month reserves. Recorded numbers drift; capture
   429 verbatim at probe time (research tgo-rfpi; audit tgo-rghl).
8. License verifications — 11 LICENSE files to fetch at spec phase:
   mattpocock, BMAD, GSD, spec-kit, MemPalace, magic-context, qmd,
   Graphiti, Letta, ECC, ruflo (audit tgo-vkcu).
9. Model SKU pins via live picker at build; the gpt-5.6 alias may route to
   Sol, so pin exact SKU ids (research tgo-rf5d; Q10, Q41).
10. Pi subagent, permission, and test package pins: deep-dive citations
    versus audit fetch gap — resolve at spec phase (audit tgo-vkcu).
11. Context-rewrite survival across compaction — unverified (research
    tgo-97gi).
12. Per-turn message transform on Pi — unproven (audit tgo-8p1y).
13. PowerShell and CMD classifier coverage; allowed-tools SKILL.md
    enforcement; directTools cache restart; modelScope with agentOverrides
    nested inherit — all unverified (research tgo-7t1x).
14. Magic Context Pi minimum-version drift (>= 0.71 versus >= 0.74) and
    OpenCode-derived token defaults — verify live at install (research
    tgo-ngiy).
15. Node floor 22.19.0 and harness peer floor pi >= 0.74.0 with lag behind
    live Pi 0.84.x — re-pin at spec phase (research tgo-dowi, tgo-uz53).
16. donsetch exact artifact pin: Cargo 4.1.1 versus npm and pi 3.x drift
    (audit tgo-rghl). Read as pinned external dependency plus thin policy
    adapter (seat access, timeouts, cancel, output, zero-paid fallback,
    version checks); no vendored engine or fork planned. CLI/MCP versus
    native Pi extension unresolved; AGPL obligations and interface
    boundary require actual license review, prior blanket clearance is
    not proof.

## 3. Constraints gaps from audit tgo-8p1y (omissions inventory)

Recorded as the 22-item omissions inventory. One line each, wording from
memory 82.

1. Multi-root and worktree identity pinning — open.
2. Convoy and manifest scope overlap — open.
3. Cancellation propagation to child plus lease release — open.
4. Approval expiry TTL — open.
5. Memory and .tgo schema migration versioning — open.
6. Side-effect ledger (pre and post show plus gate verdict plus close
   reason plus diff) — open.
7. Offline bd cache — open.
8. Cross-process .tgo mutex (current is in-process only) — open.
9. Orphan create-versus-claim crash window — open.
10. bd show last-touched perturbation looping pollers — open.
11. Await timer mid-sleep wake plus superseded-generation races — open.
12. Progress-lock stale takeover — open.
13. Dolt server versus embedded mismatch — open.
14. Raw dolt CLI corruption risk — open.
15. issues.jsonl is not SSOT — open.
16. Protected-branch and sync-branch modes — open.
17. Prune and compact checkpoint — open.
18. Band lens dropout naming and truncation — open.
19. Model and variant drift caps — open.
20. Background env required at process start — open.
21. Global versus managed-root upgrade ownership — open.
22. Shell-profile write consent — open.
23. Cost and metrics drift across presets — open.

Note: the source list contains 23 lines against a recorded 22-item label;
both are reproduced here without editing so Stage B can reconcile the
count. This note is the only reconciliation; no item is dropped.

## 4. Open spec-phase items

1. Pin Pi core revision (MANIFEST required).
2. Pin permission extension, subagent framework, MCP adapter, test harness
   (MANIFEST extension picks).
3. Pick the one anonymous hosted search: Exa or Parallel MCP anonymous
   (Q51).
4. Pin exact model SKU ids per seat via live picker plus one named backup
   per seat (Q10, Q43).
5. Run the Q25 recall-aid synthetic probe comparing candidate backends
   (Mem0, MemPalace, qmd, custom alternatives) and record the selection.
   Selection is a probe blocker: none selected, none promised, until the
   probe decides.
6. Run the Magic Context archive-only adaptation eval and record the path
   (Q28 note). Approved direction with unresolved compatibility, NOT a
   working integration; selection/probe blocker.
7. Sign off refusal and disclosure verbatim strings at spec review plus the
   pre-pilot gate (tgo-uz53).
8. Add the missing macOS CI lane downstream (tgo-uz53).
9. Fetch the 11 pending LICENSE files (audit tgo-vkcu).
10. Probe all keyless caps and record 429 verbatim (research tgo-rfpi).
11. Reconcile the omissions count note in section 3.
12. Pin the Seeker bounded read-only shell allowlist and its security
    tests (Q38 as amended; PRD sections 3.1, 3.6).
13. Pin the donsetch interface choice (CLI/MCP versus native Pi extension)
    and complete actual AGPL license review for obligations and the
    interface boundary (PRD section 3.5).
14. Record the residual same-model review anchoring risk and its handling
    in the fresh-review artifact packet (PRD section 3.3).

## 5. Decision tensions (recorded, decisions unchanged)

1. Q28 hybrid context versus audit tgo-vkcu: archive-only Magic Context is
   NOT supported as documented. Tension recorded; Q28 stands; custom
   adaptation plus runtime eval required. Read as approved direction with
   unresolved compatibility, NOT a working integration; selection/probe
   blocker.
2. Q38 Seeker (formerly researcher) shell versus audit tgo-8p1y
   typed-tools-only default: the bounded read-only shell covers useful
   gaps only. Tension recorded; Q38 stands as amended; the exact allowlist
   and security tests are unresolved at spec phase.
3. Q51 hybrid retrieval versus single-maintainer and drift evidence:
   donsetch Cargo versus npm drift and Exa code-versus-advertised caps are
   on record. Tension recorded; Q51 stands with pinning plus chain
   fallback. donsetch reads as pinned external dependency plus thin
   policy adapter (no vendored engine or fork); CLI/MCP versus native Pi
   extension unresolved; AGPL obligations and interface boundary require
   actual license review.

## 6. Phase-1 retrieval provenance (issue tgo-7lth, 2026-09-24)

Sources fetched: the OpenCode Go price sheet (opencode.ai/docs/go, last
updated 2026-09-24); docs.github.com/copilot/reference/
{copilot-billing/models-and-pricing, ai-models/supported-models,
ai-models/model-comparison}; the 11 LICENSE URLs (LIC-01..11 in
`PIN-RECORD.md` section 2; LIC-10 ECC + LIC-11 ruflo raw fetches deferred
to Phase 2 as SCHED-12).

Verification-chain note: "Phase 1 retrieval executed under the documented
TGO chain (berstein orchestration with claim gates + horowitz independent
review + nirvana band review with the lens substitution recoveries +
dylan implementation + nas retrieval, all GAPS-reported); every pin
candidate carries its verification state; nothing pins finally until
Phase 2."

Phase 1 record complete; Phase 2 records complete; Phase 3 planning next. Full candidate tables in
`PIN-RECORD.md` (pin candidates PIN-01..21, license verdicts LIC-01..11,
probe schedule SCHED-01..12).
4. Q45 git-tag install versus trust auto-install race and Windows shell
   gaps (research tgo-dowi). Tension recorded; Q45 stands; probes required.
5. Early roster survey numbers (3–5 seats, instruction-line counts,
   coordination percentages, review bug rates) versus memory 69: those
   numbers are NOT evidence. Tension recorded; Q11 four-seat decision
   stands on the recorded decision, not on those numbers.
6. Wiki ingest and break-even cost numbers versus memory 71: no source
   found, anecdotal only. Tension recorded; Q24 and Q25 stand; probe
   decides the recall aid.
7. Vendor benchmark claims (Mem0, MemPalace, Zep comparisons) versus
   independent ranks (memory 71). Tension recorded; no decision depends on
   those numbers.
8. Same-model review anchoring: a fresh Expert review session receiving
   the approved spec, artifacts, tests, and findings (not the consultation
   transcript) is the mitigation on record; residual anchoring risk is
   flagged, not fixed, in this dispatch.

## 7. Phase-2 provenance (issue tgo-mxyg, 2026-09-28)

Phase 2 records complete; Phase 3 planning next. Both probe passes landed; this section records provenance only -- outputs live in PIN-RECORD.md section 6 (SCHED-01..12 with verification states), gaps in section 7.

Sources probed: harness git tag v0.6.1 + HEAD SHA via ls-remote; npm registry views for the harness, Pi core packages, pi-subagents, MCP adapters, donsetch tarball, AFT and Magic packages; Pi ExtensionAPI core extensions types; anonymous curl caps across the eight keyless targets; Go plus Zen model catalogs; OpenAI model docs plus reasoning guide; harness ci.yml; ECC plus ruflo raw LICENSE fetches.

Probe-chain note: dry probes only (git ls-remote, GitHub REST, npm view/search/pack, anonymous curl) -- no pi install, no harness npm install, no live Pi session, no live-config writes. Live-session experiments (Magic path-(a) cleanliness run, TUI mount-visibility) deferred to a session with Pi install authorization. Two user decisions recorded 2026-09-28: SCHED-05 path (a), SCHED-09 keyless trio. All scenarios FUTURE.
