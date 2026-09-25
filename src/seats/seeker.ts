// Seeker seat (F1-AR-02). Researches. Read-only on artifacts.
// Scoped Beads reads via TYPED tools (beads_show / beads_list; F2 section
// 2.5 — bd show/list/ready/search have no shell form). Bounded read-only
// shell: allowlisted `git show` / `rg` forms only; every unclassifiable
// shell command denies.
import type { ModelPin, PresetPath } from "../config.js";
import { orderTools, type ToolRef } from "../tool-surface.js";

export const id = "seeker" as const;

/** F10-WR-03 retrieval surface (single source for the adapter matrix). */
export const retrievalSurface = "full" as const;

export const instructions =
  "Research and report. Read-only on project artifacts; never edit. " +
  "Scoped Beads reads via typed tools; no Beads mutation. " +
  "Shell only in allowlisted read-only forms: git show, rg queries. " +
  "Deny every unclassifiable shell command. " +
  "Request added evidence through the Dispatcher.";

export const hardRuleSummary =
  "Seeker: read-only. No edits, no Beads mutation. Shell allowlisted forms only; unclassifiable shell denied.";

/** F14-WS-02 Seeker overlay (draft, user-approvable at spec review). */
export const styleOverlay =
  "Source-first — every claim carries its source; snippets stay bounded; never present an unverified source as verified.";

export const skills = [
  "source-grounding",
  "deep-recon",
  "web-retrieval",
  "verify-before-claim",
] as const;

const rawTools: ToolRef[] = [
  { name: "web_search", kind: "retrieval", retrievalRequired: true },
  { name: "web_fetch", kind: "retrieval", retrievalRequired: true },
  { name: "web_crawl", kind: "retrieval", retrievalRequired: true },
  { name: "read", kind: "read" },
  { name: "grep", kind: "read" },
  { name: "beads_show", kind: "beads-read" },
  { name: "beads_list", kind: "beads-read" },
  { name: "shell_git_show", kind: "shell-bounded" },
  { name: "shell_rg", kind: "shell-bounded" },
];

export const tools: ToolRef[] = orderTools(rawTools);

/** CANDIDATE model pins (PIN-RECORD; finalize at confirm — never hard-pinned). */
export const models: Record<PresetPath, { primary: ModelPin; backup: ModelPin }> = {
  work: {
    primary: { skuId: "gpt-6-luna", status: "CANDIDATE", pinRef: "PIN-03", variant: "max", variantStatus: "UNVERIFIED" },
    backup: { skuId: "gpt-5.6-terra", status: "CANDIDATE", pinRef: "PIN-06", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
  personal: {
    primary: { skuId: "muse-spark-1.3-contributor", status: "CANDIDATE", pinRef: "PIN-08", variant: "xhigh", variantStatus: "UNVERIFIED" },
    backup: { skuId: "mimo-v2.6-flash", status: "CANDIDATE", pinRef: "PIN-11", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
};
