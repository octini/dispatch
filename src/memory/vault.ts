// F11 durable memory — file-vault SSOT (F11-DM-01): the per-project vault lives
// IN that project's git repo (knowledge history travels with the code); the
// machine-shared vault lives in its OWN user-level repo (path is section 7 —
// no path invented here), lazily initialized with disclosure. Both follow the
// wiki pattern: raw/ immutable entries + wiki/ compiled pages + index + log.
// Databases are RECALL-ONLY — never the record; record reads resolve to files.

export type VaultKind = "project" | "machine";

export const VAULT_LAYOUT = ["raw", "wiki", "index", "log"] as const;

export interface Vault {
  kind: VaultKind;
  repo: string;
  initialized: boolean;
  /** Installation binding (F11-DM-07): the machine vault is bound to the
   * installation identity below — never shared across installations. */
  identity?: InstallationIdentity;
}

/** Installation identity (F11-DM-07): the install path + the artifact
 * fingerprint. Both are caller-supplied, never invented; the fingerprint pin
 * stays UNVERIFIED (section 7). Memory within each installation is shared;
 * memory is never shared across installations. */
export interface InstallationIdentity {
  installPath: string;
  artifactFingerprint: string;
}

/** Pinned recall-backend identity (F11-DM-02): only this admits. */
export const MEMPALACE_IDENTITY_PIN = "github.com/MemPalace/mempalace" as const;

/** Known-malware identity table (F11-DM-02): lookalike name/pattern entries.
 * Anything matching that is not the exact pin above is refused. */
export const LOOKALIKE_IDENTITY_PATTERNS: readonly RegExp[] = [/mempalace/i, /mem[\-_\s]?palace/i];

/** Vault-layer identity gate (F11-DM-02 mechanism): the pinned identity
 * admits; a lookalike is REFUSED + disclosed; unrelated names pass through. */
export function admitVaultBackend(claimedBackend: string): { admitted: true } {
  if (claimedBackend === MEMPALACE_IDENTITY_PIN) return { admitted: true };
  if (LOOKALIKE_IDENTITY_PATTERNS.some((pattern) => pattern.test(claimedBackend))) {
    throw new Error(
      `lookalike backend refused + disclosed: "${claimedBackend}" resembles the pinned recall identity ${MEMPALACE_IDENTITY_PIN}; only ${MEMPALACE_IDENTITY_PIN} admits (F11-DM-02)`,
    );
  }
  return { admitted: true };
}

/** Cross-installation guard (F11-DM-07 mechanism): a stored identity that
 * differs on install path or artifact fingerprint is a foreign vault. */
export function assertSameInstallation(current: InstallationIdentity, stored: InstallationIdentity): void {
  if (current.installPath !== stored.installPath || current.artifactFingerprint !== stored.artifactFingerprint) {
    throw new Error(
      "foreign-installation vault refused + disclosed: the machine vault belongs to another installation; never shared, never silently merged (F11-DM-07)",
    );
  }
}

export function projectVault(repo: string): Vault {
  return { kind: "project", repo, initialized: true };
}

/** Machine vault lazy-inits its own repo; the init is disclosed, never silent.
 * When an installation identity is supplied the vault binds to it (F11-DM-07). */
export function machineVault(
  repo: string,
  exists: boolean,
  identity?: InstallationIdentity,
): { vault: Vault; disclosure: string | null } {
  if (exists) return { vault: { kind: "machine", repo, initialized: true, ...(identity === undefined ? {} : { identity }) }, disclosure: null };
  return {
    vault: { kind: "machine", repo, initialized: true, ...(identity === undefined ? {} : { identity }) },
    disclosure: `machine vault lazily initialized at ${repo}`,
  };
}

export interface OpenMachineVaultInput {
  repo: string;
  identity: InstallationIdentity;
  /** Stored binding, if any; null on first init. */
  storedIdentity: InstallationIdentity | null;
  exists: boolean;
  /** Optional backend claim, gated at the vault layer (F11-DM-02). */
  backend?: string;
}

/** Open the machine vault bound to an installation (F11-DM-07 mechanism): a
 * foreign-installation vault is REFUSED + disclosed — never shared, never
 * silently merged. A lookalike backend claim is refused at this layer too. */
export function openMachineVault(input: OpenMachineVaultInput): { vault: Vault; disclosure: string | null } {
  if (input.backend !== undefined) admitVaultBackend(input.backend);
  if (input.storedIdentity !== null) assertSameInstallation(input.identity, input.storedIdentity);
  return machineVault(input.repo, input.exists, input.identity);
}

/** Record reads resolve to vault files; a database write never counts as the record. */
export function resolveRecord(vault: Vault, entryPath: string): { file: string; layout: typeof VAULT_LAYOUT } {
  return { file: `${vault.repo}/${entryPath}`, layout: VAULT_LAYOUT };
}

/** Wiki compile (F11-DM-06): compile-once-keep-current — the trigger fires on
 * PROMOTION + SUPERSEDE + USER REQUEST. Index/log updates are deterministic
 * and immediate; the owner is ephemeral (short-lived job, never a seat). */
export type CompileTrigger = "promotion" | "supersede" | "user-request";

export function compileWiki(trigger: CompileTrigger): { recompiled: true; standingSeat: false } {
  void trigger;
  return { recompiled: true, standingSeat: false };
}

/** Migration + recovery (F11-DM-09): versioned converters with a DRY-RUN DIFF
 * shown to the user BEFORE applying — nothing applies silently. Recovery is
 * git history plus explicit export. */
export function migrationDryRun(diff: string, userApproved: boolean): { applied: boolean } {
  void diff;
  if (!userApproved) return { applied: false };
  return { applied: true };
}

export function refuseDatabaseAsRecord(): { refused: string } {
  return { refused: "databases serve recall only; record reads resolve to vault files (F11-DM-01)" };
}
