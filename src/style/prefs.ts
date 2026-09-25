// Standing vs one-off style preferences (F14-WS-09; STYLE-Q8) + scope note (STYLE-Q7).
// Standing preferences live in user-managed config (only the user creates or
// changes them) and disclose ONCE at session start and on change — never per
// output. One-off overrides apply per output with an in-output disclosure note.

export type PreferenceKind = "standing" | "one-off";

export interface StylePreference {
  kind: PreferenceKind;
  text: string;
  revoked: boolean;
}

/** One style overall (STYLE-Q7): chat follows all eight core rules; artifacts
 * (docs, comments, commit messages) follow the other seven plus the Writer overlay. */
export const STYLE_SCOPE: string =
  "One style overall: conversational output follows all eight core rules; " +
  "artifacts follow the other seven plus the Writer overlay.";

/** Standing prefs noted at session start (and on change) — never per output. */
export function discloseAtSessionStart(prefs: StylePreference[]): string[] {
  return prefs
    .filter((p) => p.kind === "standing" && !p.revoked)
    .map((p) => `standing style preference: ${p.text}`);
}

/** One-off overrides carry an in-output disclosure note. */
export function oneOffNote(pref: StylePreference): string {
  return `style override for this output only: ${pref.text}`;
}

/** Only the user creates, changes, or revokes standing preferences. */
export function setStandingPreference(
  prefs: StylePreference[],
  text: string,
  actor: "user",
): StylePreference[] {
  if (actor !== "user") throw new Error("standing style preferences are user-managed only");
  return [...prefs.filter((p) => p.text !== text), { kind: "standing", text, revoked: false }];
}

export function revokeStandingPreference(
  prefs: StylePreference[],
  text: string,
  actor: "user",
): StylePreference[] {
  if (actor !== "user") throw new Error("standing style preferences are user-managed only");
  return prefs.map((p) => (p.text === text ? { ...p, revoked: true } : p));
}
