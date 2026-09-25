// F11 recall channel (F11-DM-10): recalled memory carries its source links at
// use time. The archive + vault search carry their sources — every recall
// surfaces the entry's stored source links alongside the content (the DM-10
// source-carry wired into the Slice 3 claims path).

/** Recall backend (F11-DM-02): UNSELECTED pending the once-per-build
 * comparative probe (Mem0 / MemPalace / qmd hybrid / custom file-index).
 * Accuracy floor first, then cost, then latency; identity pin admits only
 * github.com/MemPalace/mempalace. */
export const RECALL_BACKEND =
  "UNSELECTED (once-per-build comparative probe; accuracy-floor-first; MemPalace identity pinned)" as const;

export { MEMPALACE_IDENTITY_PIN } from "./vault.js";
import { admitVaultBackend } from "./vault.js";

/** Recall-layer identity gate (F11-DM-02 mechanism): the pinned identity
 * admits; a lookalike is REFUSED + disclosed at the recall layer, matching
 * the vault-layer gate. Unrelated names pass through. */
export function admitRecallBackend(claimedBackend: string): { admitted: true } {
  try {
    return admitVaultBackend(claimedBackend);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`recall refused + disclosed: ${reason}`);
  }
}

export interface MemoryEntry {
  id: string;
  content: string;
  sources: string[];
}

export interface RecalledMemory {
  id: string;
  content: string;
  sources: string[];
}

/** Recall surfaces stored source links alongside content — never bare. */
export function recallWithSources(entry: MemoryEntry): RecalledMemory {
  return { id: entry.id, content: entry.content, sources: [...entry.sources] };
}

/** Archive + vault search results carry their sources through the recall channel. */
export function searchRecall(entries: MemoryEntry[], query: string): RecalledMemory[] {
  const lowered = query.toLowerCase();
  return entries
    .filter((e) => e.content.toLowerCase().includes(lowered))
    .map(recallWithSources);
}
