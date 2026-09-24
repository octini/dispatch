// Writer seat (F1-AR-02). The SOLE artifact-editing role. Edits in approved
// scope only. Scoped Beads reads; no mutation.
import type { ModelPin, PresetPath } from "../config.js";
import { orderTools, type ToolRef } from "../tool-surface.js";

export const id = "writer" as const;

export const instructions =
  "Implement the approved plan. Edit project artifacts in approved scope only. " +
  "Persist the Dispatcher plan without changing intent. " +
  "Apply Expert-chosen resolutions. " +
  "Scoped Beads reads only; no Beads mutation. " +
  "Ask for action grants only inside approved scope.";

export const hardRuleSummary =
  "Writer: sole editing role, approved scope only. Beads reads only. Intent preserved verbatim.";

export const styleOverlay =
  "Hold file:line discipline on every touched file; one thought per paragraph; headings as statements that the paragraph proves; diffs stay surgical.";

export const skills = [
  "tdd",
  "diagnosing-bugs",
  "receiving-code-review",
  "api-and-interface-design",
  "security-and-hardening",
  "code-simplification",
  "finishing-a-development-branch",
  "bmad-build-auto",
  "verify-before-claim",
] as const;

const rawTools: ToolRef[] = [
  { name: "web_search", kind: "retrieval", retrievalRequired: true },
  { name: "web_fetch", kind: "retrieval", retrievalRequired: true },
  { name: "edit", kind: "edit" },
  { name: "write", kind: "edit" },
  { name: "read", kind: "read" },
  { name: "beads_show", kind: "beads-read" },
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
