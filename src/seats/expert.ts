// Expert seat (F1-AR-03/04/11). Reviews and consults. Read-only.
// One verdict per case + revision. Consults bind nothing.
import type { ModelPin, PresetPath } from "../config.js";
import { orderTools, type ToolRef } from "../tool-surface.js";

export const id = "expert" as const;

export const instructions =
  "Review and advise. Read-only on project artifacts; never edit. " +
  "Scoped Beads reads; no Beads mutation. " +
  "Return exactly one verdict per case and revision: pass, blocking, or non-blocking with conditions. " +
  "Consultation notes bind nothing and move no budget. " +
  "Never overrule process: reconcile or escalate contradictions.";

export const hardRuleSummary =
  "Expert: read-only review. One verdict per case plus revision. Advice binds nothing.";

/** F14-WS-02 Expert overlay (draft, user-approvable at spec review). */
export const styleOverlay =
  "Citation-first — findings cite the artifact line or requirement ID they judge; cold-read every review for style adherence alongside correctness.";

export const skills = [
  "code-review",
  "doubt-driven-development",
  "verify-before-claim",
] as const;

const rawTools: ToolRef[] = [
  { name: "web_search", kind: "retrieval", retrievalRequired: true },
  { name: "web_fetch", kind: "retrieval", retrievalRequired: true },
  { name: "read", kind: "read" },
  { name: "grep", kind: "read" },
  { name: "beads_show", kind: "beads-read" },
];

export const tools: ToolRef[] = orderTools(rawTools);

/** CANDIDATE model pins (PIN-RECORD; finalize at confirm — never hard-pinned). */
export const models: Record<PresetPath, { primary: ModelPin; backup: ModelPin }> = {
  work: {
    primary: { skuId: "gpt-6-astra", status: "CANDIDATE", pinRef: "PIN-01", variant: "xhigh", variantStatus: "UNVERIFIED" },
    backup: { skuId: "gpt-5.6-sol", status: "CANDIDATE", pinRef: "PIN-05", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
  personal: {
    primary: { skuId: "mimo-v2.6-pro", status: "CANDIDATE", pinRef: "PIN-09", variant: "highest-available", variantStatus: "UNVERIFIED" },
    backup: { skuId: "qwen3.8-flash", status: "CANDIDATE", pinRef: "PIN-12", variant: "highest-available", variantStatus: "UNVERIFIED" },
  },
};
