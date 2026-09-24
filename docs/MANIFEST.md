# MANIFEST — bundled skills, MCP servers, runtime dependencies

Status: revised draft pending review. No implementation. Stage A
documentation only. Classes: required, candidate-backends (not selected),
optional-user-installed, reference-only. Items marked "pin at spec phase"
are NOT chosen.

## Required

1. Pi core, pin at spec phase. Harness on record:
   `@earendil-works/pi-coding-agent`, Node >= 22.19.0 (Q14, Q45; research
   tgo-dowi; memory 76). Pi packages support npm, git, and local sources;
   GitHub git-tag install is the v1 path (Q45).
2. bd CLI, install-with-plugin policy (Q47). Version floor: bd >= 0.59.0,
   dolt >= 2.1.0 (audit tgo-8p1y; memory 82). Per-OS installers per audit
   tgo-8p1y: darwin and linux via brew, install.sh, mise, or npm
   `@beads/bd`; Windows via install.ps1 with checksum verify or
   CGO_ENABLED=0 go install. Verify checksums. The bd.cmd shim needs
   shell:true in Node spawn.
3. donsetch (Q51 as amended; audit tgo-rghl; memory 80). Pinned external
   dependency plus a thin policy adapter; no vendored engine or fork
   planned. The adapter controls seat access, timeouts, cancel, output,
   zero-paid fallback, and version checks. CLI/MCP versus native Pi
   extension is an unresolved compatibility choice pinned at spec phase.
   Pin the exact artifact at build: Cargo 4.1.1 versus npm and pi 3.x
   drift is on record. No new licensing guarantees: AGPL obligations and
   the interface boundary require actual license review; prior blanket
   clearance is not proof.
4. Context7 for docs retrieval, free tier (Q51; research tgo-rfpi;
   memory 78). Free tier on record: 1k calls per month.
5. One anonymous hosted search, pick at spec phase (Q51): Exa MCP anonymous
   or Parallel MCP anonymous. Caps on record are UNVERIFIED pending live
   probe (memory 78, 80).
6. Fallback fetch chain (Q51; research tgo-rfpi; memory 78, 80):
   markdown.new 500 per day, then Jina r.jina.ai 20 RPM keyless, then
   TinyFish $0 per URL. Tavily keyless 1k credits per month and Firecrawl
   keyless 1k credits per month stand as reserves. All keyless caps need
   live probes before build.

## Extension picks — pin at spec phase (NOT chosen)

1. Permission extension — pin at spec phase. Candidates compared in
   research tgo-7t1x; no extension preselected per that ticket.
2. Subagent framework — pin at spec phase. Candidates compared in slot
   research (memory 68): pi-subagents, pi-subagents-lite,
   pi-subagents-j0k3r. Per-seat model pinning uses modelScope enforce or
   strict as the only true hard block (memory 75).
3. MCP adapter — pin at spec phase. Candidates: `@pi-unipi/mcp` direct
   registration versus pi-mcp-adapter single-proxy with lazy connect
   (research tgo-rfpi; memory 78).
4. Test harness — pin at spec phase. Validation research tgo-uz53
   recommends `@marcfargas/pi-test-harness` 0.6.1; `@gaodes` fork is
   fallback only (memory 79).

## Candidate recall backends (not selected; compare at spec phase)

Recall-backend selection is a spec-phase probe blocker. Mem0, MemPalace,
qmd, and custom alternatives are candidates — not selected dependencies
and not necessarily optional user installs; no promise to adopt all. The
probe under Q25 compares them before any selection (see PRD sections 3.2
and 7, review comment 1).

## Optional-user-installed

1. Magic Context — approved direction with unresolved compatibility, NOT a
   working integration. Archive-only use needs custom adaptation and a
   runtime eval (Q28 note; audit tgo-vkcu; memory 81). Two adaptation
   paths are on record and both are UNVERIFIED (EVIDENCE.md); the
   selection/probe blocker is flagged in PRD section 3.2.

## Reference-only

1. Research sources behind EVIDENCE.md: obra/superpowers, mattpocock/skills,
   addyosmani/agent-skills, Karpathy llm-wiki gist, Vercel agents-md evals,
   Cognition cost study, BMAD, spec-kit, GSD, deepagents/LangGraph, ECC,
   ruflo, oh-my-pi, MemPalace docs, magic-context docs, mem0 docs,
   Graphiti, Letta, Cognee (audit tgo-vkcu; memory 81). Dispositions
   (adopt, adapt, reference, exclude) are recorded in that audit.
2. Licenses pending LICENSE-file verification — 11 items from audit
   tgo-vkcu (memory 81): mattpocock, BMAD, GSD, spec-kit, MemPalace,
   magic-context, qmd, Graphiti, Letta, ECC, ruflo. UNVERIFIED until the
   LICENSE files are fetched at spec phase.

## Proposed seat map for Dispatch (Product Dispatch seats)

1. Dispatcher (formerly orchestrator-planner): grilling, to-tickets, to-questionnaire, wayfinder,
   verification-planning (audit tgo-vkcu).
2. Writer (formerly implementer): tdd, diagnosing-bugs, receiving-code-review,
   api-and-interface-design, security-and-hardening gate,
   code-simplification, finishing-a-development-branch, bmad-build-auto
   (adapted for unattended work per audit tgo-vkcu).
3. Seeker (formerly researcher-documenter; read-only on project artifacts): source-grounding, deep-recon (audit tgo-vkcu); web-retrieval
   (research tgo-rfpi).
4. Expert (formerly reviewer; read-only): code-review, doubt-driven-development.
5. Any seat: verify-before-claim.
6. Human-only steps: wizard.
7. License note: obra/superpowers skills are MIT (verified); addyosmani
   agent-skills 0.6.8 is MIT (verified). Remaining skill-source licenses
   are pending per the 11-item list above and are UNVERIFIED until fetched.
8. Reconciliation note: TGO's current bundle holds 21 skills; the tgo-vkcu
   audit recorded 19. Dispositions of the four left out of the earlier map:
   bmad-build-auto is listed above under Writer; implement is
   TGO-specific implementation runner, superseded by pi-native Writer
   instructions, not bundled; tgo-setup is TGO-specific setup, superseded by
   pi-native bootstrap (research tgo-dowi), not bundled; to-questionnaire is
   listed above under Dispatcher.

Traceability: each item cites its Q number or its research ticket and
memory ID beside it. Items without either are marked UNVERIFIED.
