// Shared tool-surface shape. F10-WR-14: retrieval tools list FIRST in each
// seat's toolset order, with a retrieval-required marker on fresh-fact
// categories. Authority: F2-PE-13 (capability + operation + args + targets).

export type ToolKind =
  | "retrieval"
  | "read"
  | "beads-read"
  | "beads-mutation"
  | "edit"
  | "shell-bounded"
  | "dispatch";

export interface ToolRef {
  /** Capability name. Names alone never authorize (F2-PE-13). */
  name: string;
  kind: ToolKind;
  /** F10-WR-14 marker: set on fresh-fact categories (versions, prices, APIs,
   * library behavior, standards, release dates). */
  retrievalRequired?: boolean;
}

/** Fresh-fact categories carrying the retrieval-required marker. */
export const FRESH_FACT_CATEGORIES = [
  "versions",
  "prices",
  "apis",
  "library-behavior",
  "standards",
  "release-dates",
] as const;

/** Order a seat toolset: retrieval tools first (F10-WR-14), stable within kind. */
export function orderTools(tools: ToolRef[]): ToolRef[] {
  return [...tools].sort((a, b) => {
    const ra = a.kind === "retrieval" ? 0 : 1;
    const rb = b.kind === "retrieval" ? 0 : 1;
    return ra - rb;
  });
}
