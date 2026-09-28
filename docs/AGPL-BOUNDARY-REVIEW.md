# AGPL BOUNDARY REVIEW — Dispatch / donsetch (SIGNED 2026-09-29 — user's sign-off)

Status: **SIGNED 2026-09-29 (the user's sign-off) — the v1 release gate's AGPL ship-blocker (PS-SEAM-07) is satisfied.**
This is a factual boundary review, not a legal opinion. Nothing here is legal advice.

## 1. Scope + date

- Subject: donsetch (AGPL-3.0, per the audit records) and its role in Dispatch as the primary fetch/crawl/PDF engine behind our thin policy adapter (F10-WR-01/02).
- Shipping context: the product repo is public (github.com/octini/dispatch, user-created 2026-09-29, per the task packet). A public repo plus any network-facing deployment puts the AGPL remote-network-interaction clause materially in scope — addressed in section 3.
- Draft date: 2026-09-28.
- The rule: per PS-SEAM-07 (F6-PD-08 / F10-WR-11), the written AGPL boundary review, user-signed, gates shipping and any shared build. Unsigned = does not ship. Internal pinned-artifact testing (pure-local fixtures, local-only CI artifacts) proceeds while unsigned (F10-WR-11); anything that could leave the build machine or the user's control counts as shared (fail-closed gray-zone rule).

## 2. The boundary as designed and implemented

Design (F6-PD-08; F10-WR-02; PS-SEAM-07): donsetch runs ONLY as a separate process — CLI or MCP subprocess — never linked as a library into the plugin. Library-linking is refused (verification P6-13 / P10-03, both FUTURE).

Implementation (`src/adapter/donsetch-adapter.ts`):

- `ADAPTER_FORM = "cli-subprocess"` (line 33); `LINKED_DONSETCH_IMPORTS: string[] = []` — empty by construction (line 35).
- The module imports only `node:child_process` (`spawnSync`), `node:crypto`, and Dispatch-internal modules (`permission-gate.js`, `config.js`, seat modules, `retrieval/stack.js`). No donsetch import exists anywhere in the import block (lines 9–30).
- Contact with donsetch flows exclusively through `SubprocessRunner` (default `spawnSync "donsetch"`, lines 108–116); the command is pinned to `"donsetch"` and anything else throws — a structural boundary.
- Per-call flow: permission check (F2-PE-13 gate) → subprocess call → evidence stamp (F10-WR-09) → fallback routing with verbatim failure records (F10-WR-08).

Obligations this posture is designed to satisfy: the work-as-a-whole is NOT a combined work with donsetch, under the FSF's "separate programs" reading of the GPL/AGPL aggregation rules — Dispatch and donsetch remain separate programs communicating at arm's length. The interface exchange (CLI arguments in, tool results out over stdio/JSON-RPC) is the communication boundary. No donsetch code is vendored, forked, or linked (MANIFEST: "no vendored engine or fork planned").

## 3. The public-repo dimension (remote-network-interaction analysis)

The AGPL's remote-network-interaction clause (the packet's "paragraph 6") paraphrased: if you modify an AGPL program and let users interact with the modified version over a network, you must offer those users the corresponding source. (Full text: https://www.gnu.org/licenses/agpl-3.0.html. This review paraphrases; it does not reproduce license text.)

Two facts bound the exposure for the shipping posture:

- (a) We do not modify donsetch. It is a stock pinned release — donsetch 4.3.3 (npm `dondai1234`, 28.7 kB tarball; PIN-RECORD SCHED-03 / Phase-B PS-GATE-03). Tarball pin — CLOSED 2026-09-29 (issue tgo-esi6): integrity `sha512-WKI+LvuZmcejFXJ0Vsh87r6OUIOD4VMneL/67xRBFI4sI7AgqjyuQwnl2bY05NVntPey0HtC08RoJHnbqvglrw==`; shasum `58ddb6156224e7fb636683af33a94b4f7e2f7b9c`; tarball https://registry.npmjs.org/donsetch/-/donsetch-4.3.3.tgz; gitHead `bcbcc488b0310211a0aa977b232659f9dd7d4811`.
- (b) We do not run donsetch as a service for third parties. In the shipping posture it is a local subprocess on the user's own machine during their own sessions (local fetch/crawl/PDF engine behind the adapter).

Residual case, stated explicitly: if the user — or anyone — deploys a Dispatch instance as a shared network service whose sessions drive donsetch for remote users, the remote-network-interaction clause may attach to that deployment's donsetch. That deployment class is OUT OF SCOPE for this shipping posture. Pursuing it requires a separate decision and its own review. This review admits no shared-network-service deployment.

## 4. The fallback gate

The native Pi extension form of donsetch (`pi-extension.ts`: spawns `donsetch mcp` at session start, proxies dynamically-discovered tools via `pi.registerTool()` — PIN-RECORD SCHED-03) is NOT admitted by default. Per F10-WR-02/GATE-03 (PS-GATE-03), it may be admitted only if probes prove BOTH the AGPL boundary AND F2-PE-13 enforceability.

Current status: the fallback is ungated — never shipped as default. The primary remains the CLI/MCP subprocess adapter (live-verified: `donsetch mcp` stdio run, serverInfo 4.3.3, four tools; PIN-RECORD Phase-B PS-GATE-03). The LICENSE-text fetch is CLOSED 2026-09-29 (AGPL-3.0-only, sourced — see section 5); the boundary ruling is now sourced (still UNSIGNED pending the signature).

## 5. The license record

- donsetch license identity: AGPL-3.0-only — CLOSED 2026-09-29 (issue tgo-esi6, Nas pass verified 2026-09-29). Confirmed from: npm registry license field + tarball package.json + source repo LICENSE (https://github.com/dondai44423/donsetch at gitHead bcbcc488b0310211a0aa977b232659f9dd7d4811 — raw LICENSE at that commit) + README ("AGPL-3.0. Copyright (c) 2026 Bishesh Bhandari."). The "or any later version" wording appears ONLY inside the FSF license file's own section-0/appendix template text, never as an applied grant — the applied grant is `-only` per package.json. npm and repo LICENSE copies are identical standard AGPL-3.0 text (no conflict).
- Pin: donsetch 4.3.3, npm `dondai1234` (28.7 kB tarball), `bin/donsetch.js` CLI + `donsetch mcp` stdio JSON-RPC + `pi-extension.ts`; four tools (web_fetch / web_search / web_crawl / web_screenshot). Source of binary download on record: github.com/dondai44423/donsetch releases (SHA256-verified binary download, per the probe record). Tarball pin — CLOSED 2026-09-29: integrity `sha512-WKI+LvuZmcejFXJ0Vsh87r6OUIOD4VMneL/67xRBFI4sI7AgqjyuQwnl2bY05NVntPey0HtC08RoJHnbqvglrw==`; shasum `58ddb6156224e7fb636683af33a94b4f7e2f7b9c`; tarball https://registry.npmjs.org/donsetch/-/donsetch-4.3.3.tgz; gitHead `bcbcc488b0310211a0aa977b232659f9dd7d4811`.
- Shipped donsetch code in our artifact: NONE. donsetch is a pinned external dependency invoked as a separate process; our artifact contains only the thin adapter, never donsetch code.
- Separate and NOT part of this review: the F6-Q4 verify-then-admit license list (LIC-01..11 — mattpocock, BMAD, GSD, spec-kit, MemPalace, magic-context, qmd, Graphiti, Letta, ECC, ruflo; PIN-RECORD section 2 records all 11 VERIFIED-PERMISSIVE, ECC/ruflo raw fetches confirmed in SCHED-12). They concern reference-source admission, not the donsetch boundary.

## 6. Signature block

By signing, the user agrees to the following statement:

> "I have read this review and accept the AGPL boundary posture for shipping Dispatch: donsetch as a separate unlinked subprocess, unmodified and pinned (4.3.3), not offered as a network service by this project; the native-extension fallback is not shipped as default; any shared network deployment is out of scope and requires a separate decision."

- Signed: the user (ryangking)
- Date: 2026-09-29
- Status: SIGNED 2026-09-29 — PS-SEAM-07 satisfied.

## 7. Open items

- The tokenizer pins, other model/extension pins, keyless-cap figures, and the five user-worded value pins (PIN-RECORD section 9.2) are NOT this review's concern.
- CLOSED 2026-09-29 (issue tgo-esi6): donsetch LICENSE identity (AGPL-3.0-only, sourced — see section 5) and tarball pin (integrity + shasum + tarball URL + gitHead — see sections 3/5 and PIN-RECORD). The boundary ruling is now sourced.
- CLOSED 2026-09-29 (the user's sign-off): the user's signature. PS-SEAM-07 satisfied; no open items remain.
