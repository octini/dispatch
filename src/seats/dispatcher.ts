// Dispatcher seat (F1-AR-01/02). Plans, orchestrates, owns Beads lifecycle
// mutations via typed validated host tools. No direct artifact edits.
import type { ModelPin, PresetPath } from "../config.js";
import { orderTools, type ToolRef } from "../tool-surface.js";

export const id = "dispatcher" as const;

export const instructions =
  "Dispatch plans and routes. Author the plan. Dispatch scoped packs. " +
  "Route consults, escalations, and reviews. Reconcile results. " +
  "Mutate Beads only through typed validated host tools. " +
  "Never edit project artifacts directly. " +
  "Never overrule an unresolved blocking finding.";

export const hardRuleSummary =
  "Dispatcher: single entry. Beads mutation typed-tools only. No artifact edits. No overrule of blocking findings.";

/** F14-WS-02 Dispatcher overlay (draft, user-approvable at spec review). */
export const styleOverlay =
  "Restate assignment state at each turn boundary and end with one concrete next step; no status without an owner and a next action.";

export const skills = [
  "grilling",
  "to-tickets",
  "to-questionnaire",
  "wayfinder",
  "verification-planning",
  "verify-before-claim",
] as const;

const rawTools: ToolRef[] = [
  { name: "web_search", kind: "retrieval", retrievalRequired: true },
  { name: "web_fetch", kind: "retrieval", retrievalRequired: true },
  { name: "beads_create", kind: "beads-mutation" },
  { name: "beads_update", kind: "beads-mutation" },
  { name: "beads_claim", kind: "beads-mutation" },
  { name: "beads_close", kind: "beads-mutation" },
  { name: "beads_reopen", kind: "beads-mutation" },
  { name: "beads_dep", kind: "beads-mutation" },
  { name: "beads_show", kind: "beads-read" },
  { name: "beads_list", kind: "beads-read" },
  { name: "beads_search", kind: "beads-read" },
  { name: "beads_ready", kind: "beads-read" },
  { name: "beads_blocked", kind: "beads-read" },
  { name: "beads_memories", kind: "beads-read" },
  { name: "dispatch", kind: "dispatch" },
  { name: "read", kind: "read" },
];

export const tools: ToolRef[] = orderTools(rawTools);

/** CANDIDATE model pins (PIN-RECORD; finalize at confirm — never hard-pinned). */
export const models: Record<PresetPath, { primary: ModelPin; backup: ModelPin }> = {
  work: {
    primary: { skuId: "gpt-6-astra", status: "CANDIDATE", pinRef: "PIN-01", variant: "xhigh", variantStatus: "UNVERIFIED" },
    backup: { skuId: "gpt-5.6-sol", status: "CANDIDATE", pinRef: "PIN-05", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
  personal: {
    primary: { skuId: "glm-5.3-flash", status: "CANDIDATE", pinRef: "PIN-07", variant: "max", variantStatus: "UNVERIFIED" },
    backup: { skuId: "deepseek-v4.1-flash", status: "CANDIDATE", pinRef: "PIN-10", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
};
