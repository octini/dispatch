// F13 S-suite — executable failure-path scenarios S1…S11 incl. S9a/b/c (issue tgo-7a26).
//
// Authority: docs/features/validation-harness.md F13-VH-03 (Q20 + tgo-uz53 record)
// + docs/PIN-RECORD.md section 11 (S-scenario → requirement-ID map). Each scenario
// below names its PRIMARY requirement IDs from that map; secondary IDs ride the
// same behaviors and are listed in the scenario header.
//
// Mock boundary per F13 §7.8: ONLY the streamFn/tool.execute/ctx.ui seams are
// substituted — BootstrapEffects stub (tool.execute seam), recover() callbacks
// (streamFn seam), CouncilSink injection (ctx.ui seam), hostNow clock injection.
// Every Dispatch module under test is REAL (F5 sessions, F11 memory, F2 gate,
// F9 bootstrap, F12 context, F10 retrieval, F15 claims, F14 style, F16 council,
// F17 eyes, F18 tracker).
//
// Honesty notes (never silently resolved):
// - F2-PE-11 + F3-SD-05 adjudicated EXECUTABLE 2026-09-29 (issue tgo-7a26):
//   P-HIDE-13 runs through the harness mock boundary in S3; SDD-08/09 run as
//   record-shape checks in S10. The classification judgments themselves stay
//   RECORD-SHAPE (docs lint on the control table / justification text).
// - P-series rows stay the documented matrix (never claimed automated).
// - Live probes (PS-GATE-06 mount-visibility, PS-GATE-05 Magic cleanliness) are
//   PENDING-LIVE with exact blockers in the final describe; only their static
//   halves execute here.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateReuse,
  dispatchBackup,
  planRollover,
  chargeMidRolloverCrash,
  cancelTask,
  restartAfterCancel,
  releaseOwnership,
  preserveUntilHandback,
  cleanDisposable,
  decideRecovery,
  persistBudgets,
  guardTrackerAccess,
  requireRevisionEnvelope,
  validateLaunchAuthority,
  MAX_AUTO_RECOVERY_PER_TASK,
  checkCompactRecord,
  requirePromotion,
  type ReuseState,
} from "../sessions/index.js";
import { verifyMutation, validateLivingSpecEdit, type LiveStore, type LiveIssueState } from "../beads/index.js";
import { PermissionGate, type GateToolCall } from "../permission-gate.js";
import type { PolicyConfig } from "../config.js";
import {
  projectVault,
  machineVault,
  resolveRecord,
  refuseDatabaseAsRecord,
  checkAdmissionContract,
  runVerifierPass,
  userDirectWrite,
  stampScope,
  refuseImplicitPromotion,
  supersede,
  hardDelete,
  handleVaultPressure,
  recallWithSources,
  searchRecall,
  RECALL_BACKEND,
  admitRecallBackend,
} from "../memory/index.js";
import {
  MAGIC_PATH,
  assertSingleCompressor,
  gatePathPin,
  atomicArchivePass,
  assertZeroSidecars,
  taskArchive,
  archiveScope,
  gateArchivePromotion,
  purgeArchives,
} from "../context/index.js";
import {
  KEYLESS_TRIO,
  KEYED_SLOTS,
  isKeyedSlotActive,
  reservesActive,
  isRateClassRecord,
  trailDocumentsExhaustion,
  discloseGap,
  carrySources,
} from "../retrieval/stack.js";
import {
  carrySourcesStrict,
  SOURCE_NOT_CARRIED_DISCLOSURE,
  detectClaims,
  handleUnattributed,
} from "../claims/detector.js";
import { runReviewGate, advancePromotion } from "../claims/review-gate.js";
import { resolveInstructionConflict } from "../style/index.js";
import {
  synthesize,
  validateFindingIds,
  requireFullBody,
  shouldConvene,
  resolveLensFailure,
  reconcileContradiction,
  type LensReturn,
} from "../council/index.js";
import {
  resolveVisionFailure,
  checkSeatAvailability,
  checkEyelessReview,
} from "../eyes/failure.js";
import { rollback, rollbackVerdict, reentryGate, checkSignedString } from "../harness/index.js";
import { checkCoverage, checkRepin, admitFallback } from "../harness/index.js";
import { verifySha, recordInstall, checkDrift } from "../update/index.js";
import {
  PARK_SEMANTICS,
  SETUP_RETRY_CAP,
  DEFAULT_KILL_SWITCHES,
  evaluateTrigger,
  freshFailures,
  runBootstrap,
  type BootstrapEffects,
  type ProjectSignals,
} from "../bootstrap/index.js";
import { probeGate, probeHealth, STALENESS_MAX_AGE_MS } from "../tracker/index.js";
import * as dispatcher from "../seats/dispatcher.js";

const POLICY: PolicyConfig = {
  revision: "s-suite-1",
  protectedPaths: ["secrets/api.key"],
  scopedExceptions: [],
};

const IDENTITY = {
  model: "m1", variant: "v1", preset: "work", seatConfig: "s1", toolsSkills: "t1", hostVersion: "h1",
};

function partialReuse(): ReuseState {
  return {
    hasProgress: true, runTerminal: false, overBudget: false,
    identity: { ...IDENTITY }, expectedIdentity: { ...IDENTITY },
    permissionNarrowed: false, status: "partial", seat: "writer",
  };
}

function liveState(over: Partial<LiveIssueState> = {}): LiveIssueState {
  return { id: "bd-1", status: "open", assignee: null, runOwner: null, approvalValid: true, ...over };
}

function gateCall(over: Partial<GateToolCall> = {}): GateToolCall {
  return {
    seat: "writer",
    tool: "write",
    operation: "write",
    args: { path: "src/app.ts" },
    cwd: "/repo",
    taskId: "s-suite",
    scopePaths: ["/repo/src"],
    ...over,
  };
}

function setupSignals(over: Partial<ProjectSignals> = {}): ProjectSignals {
  return {
    gitRepoPresent: true,
    nestedInsideRepo: false,
    piSettingsPresent: true,
    piSettingsParseable: true,
    beadsPresent: true,
    beadsEmpty: false,
    bdInstalled: true,
    bdVersion: "0.59.0",
    doltVersion: "2.1.0",
    bdUpgradeRefused: false,
    pluginBlock: "present",
    adviceBlock: "present",
    settingsEntry: "present",
    gitignoreEntry: "present",
    markersCorrupt: false,
    ...over,
  };
}

function stubEffects(over: Partial<BootstrapEffects> = {}): BootstrapEffects & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    gitInit() { calls.push("gitInit"); return "ok"; },
    appendGitignore() { calls.push("appendGitignore"); return "ok"; },
    mergeSettings() { calls.push("mergeSettings"); return "ok"; },
    installBd() { calls.push("installBd"); return "ok"; },
    bdInit() { calls.push("bdInit"); return "ok"; },
    bdSetupAdvice() { calls.push("bdSetupAdvice"); return "ok"; },
    appendPluginBlock() { calls.push("appendPluginBlock"); return "ok"; },
    upgradeBd() { calls.push("upgradeBd"); return "ok"; },
    disclose(_m: string) {},
    ask(_m: string) { return true; },
    ...over,
  };
}

function councilReturns(ballots: ["pass" | "block", "pass" | "block", "pass" | "block"]): LensReturn[] {
  const lenses = ["risk", "quality", "structure"] as const;
  return ballots.map((ballot, i) => ({
    lens: lenses[i] ?? "risk",
    ballot,
    findings: [{ id: `F-0${i + 1}`, lens: lenses[i] ?? "risk", text: `finding ${i + 1}` }],
  }));
}

// --- S1 interrupted sessions ------------------------------------------------
// P: F5-DS-01,04,05,06,07,08,09,10; F1-AR-05; F4-BI-05; F12-WC-01; F3-SD-04,04a
// S: F4-BI-03,04,06,09; F5-DS-12; F12-WC-09; F13-VH-08; F16-RC-10
// Setup: a partial writer run with progress, live record, budget, identity.
// Action: interrupt mid-run (named cancel), then drive handover + recovery +
// rollover + outage guard. Assertion: no rollback promised, no replay, no
// reset, outage refuses new work, dual compression refused.
describe("S1 interrupted sessions (F5-DS-01,04,05,06,07,08,09,10; F1-AR-05; F4-BI-05; F12-WC-01; F3-SD-04,04a)", () => {
  it("guarded partial work resumes; missing progress or terminal record refuses (F5-DS-01)", () => {
    assert.deepEqual(validateReuse(partialReuse()), { eligible: true, reasons: [] });
    assert.equal(validateReuse({ ...partialReuse(), hasProgress: false }).eligible, false);
    assert.equal(validateReuse({ ...partialReuse(), runTerminal: true }).eligible, false);
  });

  it("named cancel parks the branch with duties; whole-run cancel needs an explicit ask; no rollback promised (F5-DS-04)", () => {
    const outcome = cancelTask({ namedTask: "t1", wholeRun: false, wholeRunExplicitlyAsked: false });
    assert.deepEqual(outcome.parkedBranch, "t1");
    assert.equal(outcome.rollbackPromised, false);
    assert.throws(() => cancelTask({ namedTask: "t1", wholeRun: true, wholeRunExplicitlyAsked: false }));
    assert.deepEqual(restartAfterCancel(true), { fresh: true });
    assert.throws(() => restartAfterCancel(false));
  });

  it("still-writing blocks handover; unconfirmable stop escalates, never silent (F5-DS-05)", () => {
    assert.deepEqual(releaseOwnership(true, false), { released: true });
    assert.throws(() => releaseOwnership(false, false));
    assert.ok("escalate" in releaseOwnership(false, true));
  });

  it("third automatic recovery refuses and escalates; confirmed actions never replay; budgets persist (F5-DS-06/11; F1-AR-05 repair budget unmoved)", () => {
    assert.equal(MAX_AUTO_RECOVERY_PER_TASK, 2);
    const signals = { repeatedNonProgress: false, uncertainExternalEffects: false, ownershipConflict: false };
    assert.deepEqual(decideRecovery({ attempts: 2 }, signals, [], ["retry-a"]), {
      escalate: "third automatic recovery refused and escalated (F5-DS-06)",
    });
    assert.throws(() => decideRecovery({ attempts: 0 }, signals, ["done-a"], ["done-a"]));
    assert.deepEqual(persistBudgets({ repair: 1 }), { repair: 1 });
  });

  it("planned rollover carries envelope + checkpoint, never the transcript; mid-rollover crash charges the band-fix owner (F5-DS-07)", () => {
    const checkpoint = { assignment: "a", userInstructions: [], artifacts: [], findings: [], openQuestions: [], remainingBudgets: { repair: 2 } };
    const plan = planRollover(checkpoint, true, false);
    assert.equal(plan.freshDispatch, true);
    assert.equal(plan.crashCharged, false);
    assert.throws(() => planRollover(checkpoint, false, false));
    assert.throws(() => planRollover(checkpoint, true, true));
    assert.equal(chargeMidRolloverCrash("outgoing-before-handover"), "outgoing-task");
    assert.equal(chargeMidRolloverCrash("replacement-after-dispatch"), "replacement-task");
  });

  it("revoked authority parks, never launch-then-validate; outage refuses new delegation; evidence preserved until handback (F5-DS-08,10,09; F4-BI-05)", () => {
    assert.deepEqual(validateLaunchAuthority({ authorized: true, revoked: false }), { launch: true });
    assert.ok("parked" in validateLaunchAuthority({ authorized: false, revoked: false }));
    assert.ok("refused" in guardTrackerAccess(false));
    assert.deepEqual(guardTrackerAccess(true), { launch: true });
    assert.deepEqual(preserveUntilHandback(false, false), { preserved: true });
    const over = cleanDisposable(true, true);
    assert.equal(over.cleaned, false);
    assert.match(over.disclosure ?? "", /disclose and ask/);
    const unreachable: LiveStore = { reachable: false, readLive: () => null };
    assert.equal(verifyMutation(unreachable, { kind: "claim", issueId: "x", runId: "r" }).decision, "refuse");
  });

  it("runs need the F1 revision-bound envelope; dual compression refused; the single park semantics is F3-SD-04a (F5-DS-12; F12-WC-01; F3-SD-04,04a)", () => {
    assert.deepEqual(requireRevisionEnvelope(true), { bound: true });
    assert.throws(() => requireRevisionEnvelope(false));
    assert.throws(() => assertSingleCompressor(true, true));
    assertSingleCompressor(true, false);
    assert.equal(PARK_SEMANTICS, "F3-SD-04a");
  });
});

// --- S2 stale memories -------------------------------------------------------
// P: F11-DM-01,02,03,04,07,08,09,10,11; F12-WC-04; F4-BI-09
// S: F11-DM-05,06; F15-RD-01; F5-DS-01; F12-WC-03
// Setup: vaults + a staged entry with a stale (missing) scope stamp.
// Action: recall against the entry, then run admission. Assertion: stale
// entries never stage; recall carries sources; transcripts never promote.
describe("S2 stale memories (F11-DM-01,02,03,04,07,08,09,10,11; F12-WC-04; F4-BI-09)", () => {
  it("dual-vault SSOT: project vault in-repo, machine vault lazy-inits disclosed; databases recall-only (F11-DM-01)", () => {
    assert.equal(projectVault("acme/app").repo, "acme/app");
    assert.match(machineVault("~/.dispatch/vault", false).disclosure ?? "", /lazily initialized/);
    assert.equal(machineVault("~/.dispatch/vault", true).disclosure, null);
    assert.match(resolveRecord(projectVault("acme/app"), "raw/e1.md").file, /raw\/e1\.md/);
    assert.match(refuseDatabaseAsRecord().refused, /recall only/);
  });

  it("recall backend unselected; lookalike identity refused at vault and recall layers (F11-DM-02)", () => {
    assert.match(RECALL_BACKEND, /UNSELECTED/);
    assert.deepEqual(admitRecallBackend("github.com/MemPalace/mempalace"), { admitted: true });
    assert.throws(() => admitRecallBackend("github.com/evil/mempalace-fork"));
  });

  it("stale entries never stage: no link or no scope stamp refuses admission with reasons (F11-DM-03,11)", () => {
    const stale = checkAdmissionContract({ content: "stale note", sourceLink: null, scopeStamp: null, status: "UNVERIFIED" });
    assert.equal(stale.admitted, false);
    assert.ok(stale.reasons.some((r) => r.includes("no link, no staging")));
    assert.ok(stale.reasons.some((r) => r.includes("scope stamp required")));
    const fresh = checkAdmissionContract({ content: "fresh note", sourceLink: "https://example.com/x", scopeStamp: "project=a scope=work seat=user task=t status=open", status: "UNVERIFIED" });
    assert.equal(fresh.admitted, true);
  });

  it("verifier pass is ephemeral with contradictions surfaced and no standing seat; scope stamps are automatic (F11-DM-04,07; F12-WC-03 never-trim shape)", () => {
    const entry = { content: "note", sourceLink: "https://example.com/x", scopeStamp: "project=a scope=work seat=user task=t status=open", status: "UNVERIFIED" as const };
    const out = runVerifierPass(entry, () => ["contradiction: price moved"]);
    assert.equal(out.promoted, true);
    assert.deepEqual(out.contradictions, ["contradiction: price moved"]);
    assert.equal(out.standingSeat, false);
    assert.match(stampScope({ project: "a", scope: "work", seat: "user", task: "t", status: "open" }), /project=a/);
  });

  it("transcripts never promote implicitly; user-direct writes promote; verifier never hard-deletes promoted entries (F11-DM-08,09,05)", () => {
    assert.match(refuseImplicitPromotion().refused, /never promote implicitly/);
    assert.deepEqual(userDirectWrite("user note"), { written: true, status: "promoted" });
    assert.ok("refused" in hardDelete({ actor: "verifier", status: "promoted", contractFailing: false, inWindow: false, worthless: false }));
    assert.deepEqual(hardDelete({ actor: "user", status: "promoted", contractFailing: false, inWindow: false, worthless: false }), { deleted: true, tombstone: false });
  });

  it("supersede is same-repo only; pressure discloses and parks, never auto-deletes (F11-DM-05)", () => {
    assert.deepEqual(supersede({ oldId: "e1", newId: "e2", vaultRepo: "r1" }, "r1").newId, "e2");
    assert.throws(() => supersede({ oldId: "e1", newId: "e2", vaultRepo: "r1" }, "r2"));
    assert.equal(handleVaultPressure().deleted, false);
  });

  it("recall carries sources at use time; archive promotion needs F11 admission or user-direct; living-spec edits validate live (F11-DM-10; F12-WC-04; F4-BI-09)", () => {
    const entry = { id: "e1", content: "the price is $4 per 1M", sources: ["https://example.com/pricing"] };
    assert.deepEqual(recallWithSources(entry).sources, ["https://example.com/pricing"]);
    assert.deepEqual(searchRecall([entry], "price").length, 1);
    assert.deepEqual(searchRecall([entry], "unrelated").length, 0);
    assert.deepEqual(gateArchivePromotion("f11-admission"), { allowed: true });
    assert.throws(() => gateArchivePromotion("automatic"));
    const live: LiveStore = { reachable: true, readLive: () => liveState() };
    assert.equal(verifyMutation(live, { kind: "update", issueId: "bd-1", runId: "r1" }).decision, "proceed");
    assert.equal(validateLivingSpecEdit({ actor: "dispatcher", field: "status" }).decision, "proceed");
  });
});

// --- S3 denied tools ----------------------------------------------------------
// P: F2-PE-01,02,03,04,05,07,08,09,12,13; F10-WR-10,12; F1-AR-02
// S: F1-AR-14; F2-PE-06,10,11; F13-VH-08; F10-WR-02
// Setup: a writer call against a protected credential path with the F13 mock
// boundary (no tool executes: the gate decides on the call record).
// Action: decide allow/deny/park across seats, tools, scopes, and the keyed
// retrieval slots. Assertion: deny-and-log by default, park on ambiguity,
// audit redacted. F2-PE-11 runs executable as P-HIDE-13 below (S3-adjacent).
describe("S3 denied tools (F2-PE-01,02,03,04,05,07,08,09,12,13; F10-WR-10,12; F1-AR-02)", () => {
  it("protected credential paths deny with reason; dispatcher holds no artifact-edit authority (F2-PE-01,02,03; F1-AR-02)", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(gateCall({ args: { path: "secrets/api.key" } }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /protected path/);
    assert.equal(d.parked, false);
    assert.equal(gate.decide(gateCall({ seat: "dispatcher" })).outcome, "deny-and-log");
  });

  it("seeker edit and beads mutation refuse; scoped reads allow; evasive shell denies with a typed alternative (F2-PE-04,07,12)", () => {
    const gate = new PermissionGate(POLICY);
    assert.equal(gate.decide(gateCall({ seat: "seeker" })).outcome, "deny-and-log");
    assert.equal(gate.decide(gateCall({ seat: "seeker", tool: "beads_update", operation: "update", args: { id: "bd-1" } })).outcome, "deny-and-log");
    assert.equal(gate.decide(gateCall({ seat: "seeker", tool: "read", operation: "read", args: { path: "src/app.ts" } })).outcome, "allow");
    const evasive = gate.decide(gateCall({ seat: "seeker", tool: "shell_rg", operation: "exec", args: { command: "rg foo | tee out" }, scopePaths: ["/repo"] }));
    assert.equal(evasive.outcome, "deny-and-log");
  });

  it("missing scope authority and unmapped tools deny-log-and-park; recurring denial parks on the third attempt (F2-PE-05,08,09)", () => {
    const gate = new PermissionGate(POLICY);
    assert.equal(gate.decide(gateCall({ args: {}, scopePaths: [] })).outcome, "deny-log-and-park");
    const unmapped = gate.decide(gateCall({ tool: "brand_new_tool", operation: "run", scopePaths: ["/repo"] }));
    assert.equal(unmapped.outcome, "deny-log-and-park");
    assert.match(unmapped.reason, /no verified mapping/);
    const recurring = new PermissionGate({ ...POLICY });
    const c = gateCall({ args: { path: "secrets/api.key" }, taskId: "t-pattern" });
    assert.equal(recurring.decide(c).outcome, "deny-and-log");
    assert.equal(recurring.decide(c).outcome, "deny-and-log");
    const third = recurring.decide(c);
    assert.equal(third.outcome, "deny-log-and-park");
    assert.match(third.reason, /recurring pattern/);
  });

  it("traversal escapes deny; out-of-scope absolutes fail on scope; audit redacts credentials (F2-PE-12,13)", () => {
    const gate = new PermissionGate(POLICY);
    const escaped = gate.decide(gateCall({ args: { path: "../../etc/passwd" }, cwd: "/repo/a" }));
    assert.equal(escaped.outcome, "deny-and-log");
    assert.match(escaped.reason, /traversal/);
    const absolute = gate.decide(gateCall({ args: { path: "/other/place.ts" } }));
    assert.equal(absolute.outcome, "deny-and-log");
    assert.match(absolute.reason, /scope/);
    gate.decide(gateCall({ seat: "dispatcher", tool: "read", operation: "read", args: { path: "docs/x.md", api_key: "s3cr3t-value" }, scopePaths: ["/repo"] }));
    const auditEntry = gate.audit[gate.audit.length - 1];
    assert.ok(auditEntry !== undefined && !auditEntry.argsPreview.includes("s3cr3t-value"));
  });

  it("P-HIDE-13a hidden-but-authorized direct call allows under the same guard; hiding never cited (F2-PE-11)", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(gateCall({ seat: "writer", tool: "read", operation: "read", args: { path: "src/app.ts" } }));
    assert.equal(d.outcome, "allow");
    assert.ok(!/hid/i.test(d.reason));
  });

  it("P-HIDE-13b hidden-and-prohibited direct call denies by policy; hiding never cited (F2-PE-11)", () => {
    const gate = new PermissionGate(POLICY);
    const d = gate.decide(gateCall({ args: { path: "secrets/api.key" } }));
    assert.equal(d.outcome, "deny-and-log");
    assert.match(d.reason, /protected path/);
    assert.ok(!/hid/i.test(d.reason));
  });

  it("keyed slots stay inactive without keys; reserves stay inactive without documented exhaustion (F10-WR-10,12)", () => {
    assert.deepEqual([...KEYED_SLOTS], ["exa", "parallel"]);
    assert.equal(isKeyedSlotActive(false), false);
    assert.equal(isKeyedSlotActive(true), true);
    assert.equal(reservesActive(false), false);
    assert.equal(isRateClassRecord("429", "rate limited, retry later"), true);
    assert.equal(isRateClassRecord("200", "ok"), false);
    assert.equal(trailDocumentsExhaustion([], [...KEYLESS_TRIO]), false);
  });
});

// --- S4 model unavailable ------------------------------------------------------
// P: F1-AR-05; F7-MP-04,05,06,07,08; F16-RC-10; F17-VL-08,10
// S: F7-MP-01,02,03,09; F5-DS-06; F3-SD-04; F17-VL-01,04,05
// Setup: specialist + named backup both unavailable; no vision-capable seat.
// Action: route through backup dispatch, lens retry path, and vision failure
// semantics (recover() is the streamFn seam: substituted, everything else real).
// Assertion: affected work parks with disclosure, independent work proceeds,
// nothing fabricated, lens failure escalates after one bounded retry.
describe("S4 model unavailable (F1-AR-05; F7-MP-04,05,06,07,08; F16-RC-10; F17-VL-08,10)", () => {
  it("model pins are CANDIDATE exact SKUs with unverified variants; backup dispatches fresh with notice, never on revoked authority (F7-MP-04,05,06,07,08; F1-AR-05)", () => {
    assert.equal(dispatcher.models.work.primary.skuId, "gpt-6-astra");
    assert.equal(dispatcher.models.work.primary.status, "CANDIDATE");
    assert.equal(dispatcher.models.work.primary.variantStatus, "UNVERIFIED");
    assert.equal(dispatcher.models.work.backup.skuId, "gpt-5.6-sol");
    const backup = dispatchBackup("m-backup", false);
    assert.equal(backup.fresh, true);
    assert.match(backup.notice, /logged notice/);
    assert.throws(() => dispatchBackup("m-backup", true));
    assert.equal(validateReuse({ ...partialReuse(), overBudget: true }).eligible, false);
  });

  it("lens failure carries reason + route + budget, escalates after one bounded retry, never degrades the verdict (F16-RC-10)", () => {
    const clean = resolveLensFailure({ returns: councilReturns(["pass", "pass", "pass"]), failedLens: null }, { consumed: 0 }, () => councilReturns(["pass", "pass", "pass"]));
    assert.ok(!("failed" in clean));
    const recovered = resolveLensFailure({ returns: [], failedLens: "risk" }, { consumed: 0 }, () => councilReturns(["pass", "pass", "pass"]));
    assert.ok(!("failed" in recovered));
    const persistent = resolveLensFailure({ returns: [], failedLens: "risk" }, { consumed: 1 }, () => councilReturns(["pass", "pass", "pass"]));
    assert.ok("failed" in persistent && persistent.escalateTo === "user");
  });

  it("unreadable vision input gets one bounded infra retry inside F5's allowance; spent allowance parks with disclosure, never fabricated (F17-VL-08)", () => {
    const first = resolveVisionFailure({ f5AttemptsConsumed: 0 }, () => true);
    assert.equal(first.outcome.ok, true);
    const failed = resolveVisionFailure({ f5AttemptsConsumed: 0 }, () => false);
    assert.equal(failed.outcome.ok, false);
    if (!failed.outcome.ok) assert.match(failed.outcome.disclosure, /never fabricated/);
    const spent = resolveVisionFailure({ f5AttemptsConsumed: 2 }, () => true);
    assert.equal(spent.outcome.ok, false);
    if (!spent.outcome.ok) assert.match(spent.outcome.disclosure, /allowance spent/);
  });

  it("no vision-capable seat parks vision work with disclosure while text-only work continues; eyeless designated review BLOCKS (F17-VL-10)", () => {
    const none = checkSeatAvailability({ dispatcherVisionCapable: false, seekerAvailable: false });
    assert.equal(none.parked, true);
    assert.match(none.disclosure ?? "", /text-only work continues/);
    assert.equal(checkSeatAvailability({ dispatcherVisionCapable: true, seekerAvailable: false }).parked, false);
    assert.equal(checkEyelessReview({ dispatcherVisionCapable: false, seekerAvailable: false }, true).blocked, true);
    assert.equal(checkEyelessReview({ dispatcherVisionCapable: false, seekerAvailable: false }, false).blocked, false);
  });
});

// --- S5 conflicting instructions ------------------------------------------------
// P: F1-AR-07; F3-SD-06,03a; F2-PE-06; F14-WS-06; F1-AR-13
// S: F1-AR-03,04,11; F16-RC-11; F3-SD-10,11
// Setup: two results disagree in scope; a lint finding collides with an
// explicit user instruction. Action: Expert chooses read-only-first, Writer
// applies under a validated user-directed change, style conflict resolves with
// disclosure. Assertion: user instruction wins for that output only, recorded,
// undisclosed overrides fail the review gate.
describe("S5 conflicting instructions (F1-AR-07; F3-SD-06,03a; F2-PE-06; F14-WS-06; F1-AR-13)", () => {
  it("disclosed user instruction outranks a blocking rule for that output, recorded; undisclosed override fails the review gate (F14-WS-06)", () => {
    assert.deepEqual(resolveInstructionConflict({ explicitUserInstruction: true, disclosed: true }), {
      suppressed: true, recorded: true, reviewGateFailure: false,
    });
    assert.equal(resolveInstructionConflict({ explicitUserInstruction: true, disclosed: false }).reviewGateFailure, true);
    assert.equal(resolveInstructionConflict({ explicitUserInstruction: false, disclosed: false }).suppressed, false);
  });

  it("writer applies only a validated user-directed change; self-authored widening denies (F2-PE-06)", () => {
    const gate = new PermissionGate(POLICY);
    const change = {
      userDirect: true, interpretedBy: "dispatcher" as const, appliedBy: "writer" as const,
      provenance: "user 2026-09-24", change: "extend one dependency path", scope: "/repo/vendor", duration: "session",
    };
    assert.equal(gate.decide(gateCall({ tool: "config_update", operation: "update", args: {}, configChange: change })).outcome, "allow");
    assert.equal(gate.decide(gateCall({ seat: "dispatcher", tool: "config_update", operation: "update", args: {}, configChange: change })).outcome, "deny-and-log");
    const selfAuthored = gate.decide(gateCall({ tool: "config_update", operation: "update", args: {}, configChange: { ...change, userDirect: false } }));
    assert.equal(selfAuthored.outcome, "deny-and-log");
    assert.match(selfAuthored.reason, /USER instruction/);
  });

  it("dispatcher never overrules an unresolved blocking finding; delegation carries the revision-bound envelope (F1-AR-07; F1-AR-13)", () => {
    assert.match(dispatcher.hardRuleSummary, /blocking finding/);
    assert.match(dispatcher.instructions, /Never overrule an unresolved blocking finding/);
    assert.deepEqual(requireRevisionEnvelope(true), { bound: true });
    assert.throws(() => requireRevisionEnvelope(false));
  });

  it("typed living-spec edits proceed against live state; unknown live state parks for reconcile-first (F3-SD-06,03a)", () => {
    const live: LiveStore = { reachable: true, readLive: () => liveState() };
    assert.equal(validateLivingSpecEdit({ actor: "dispatcher", field: "status" }).decision, "proceed");
    assert.equal(validateLivingSpecEdit({ actor: "writer", field: "not-a-field" }).decision, "refuse");
    const unknown: LiveStore = { reachable: true, readLive: () => null };
    assert.equal(verifyMutation(unknown, { kind: "claim", issueId: "bd-1", runId: "r1" }).decision, "park");
  });
});

// --- S6 failed verification -----------------------------------------------------
// P: F1-AR-04,11,12; F3-SD-09,10; F16-RC-01,02,04,05; F13-VH-08; F4-BI-08
// S: F3-SD-01,02; F16-RC-10,11; F17-VL-05; F14-WS-08; F15-RD-05; F5-DS-11
// Setup: a designated review fails (block majority) with a contradicted verdict.
// Action: synthesize, reconcile, roll back. Assertion: block binds with user
// approval, no self-reconciliation, rollback flips + revokes + preserves,
// re-entry blocked until reproduced-green, manual closed never reads as verified.
describe("S6 failed verification (F1-AR-04,11,12; F3-SD-09,10; F16-RC-01,02,04,05; F13-VH-08; F4-BI-08)", () => {
  it("2/3 majority carries with dissent recorded verbatim; block binds mandatory user approval (F16-RC-01,02; F1-AR-11)", () => {
    const verdict = synthesize({ caseId: "s6", artifactRevision: "r1", returns: councilReturns(["pass", "pass", "block"]), packetProvenance: [] });
    assert.equal(verdict.verdict, "pass");
    assert.deepEqual(verdict.tally, { pass: 2, block: 1 });
    const blocked = synthesize({ caseId: "s6b", artifactRevision: "r1", returns: councilReturns(["block", "block", "pass"]), packetProvenance: [] });
    assert.equal(blocked.verdict, "block");
    assert.equal(blocked.requiresUserApproval, true);
  });

  it("finding IDs validate; partial bodies refuse; routine work never convenes (F16-RC-04,05)", () => {
    assert.deepEqual(validateFindingIds([{ id: "F-1", lens: "risk", text: "x" }]), ["F-1"]);
    assert.throws(() => validateFindingIds([
      { id: "F-1", lens: "risk", text: "x" },
      { id: "F-1", lens: "quality", text: "y" },
    ]));
    assert.throws(() => requireFullBody(councilReturns(["pass", "pass", "pass"]).slice(0, 2)));
    assert.equal(shouldConvene({ kind: "routine" }), false);
    assert.equal(shouldConvene({ kind: "designated", gate: "F3" }), true);
  });

  it("a seat never adjudicates its own verdict: self-reconciliation blocked, user escalation open (F1-AR-04; F3-SD-09,10)", () => {
    const contradiction = { caseId: "s6", artifactRevision: "r1", authorityVerdict: "pass", authorityAuthor: "expert", secondOpinion: "block" };
    assert.throws(() => reconcileContradiction(contradiction, "expert"));
    assert.deepEqual(reconcileContradiction(contradiction, "user"), { path: "escalate-user", reconciler: "user" });
    assert.deepEqual(reconcileContradiction(contradiction, "council"), { path: "fresh-council-run", repairCycles: 1 });
    assert.match(dispatcher.hardRuleSummary, /No overrule of blocking findings/);
  });

  it("rollback flips to harness-only, revokes grants, preserves ledgers; re-entry without reproduced-green BLOCKED (F13-VH-08)", () => {
    const done = rollback({ mode: "supervised", grantsRevoked: false, ledgersPreserved: false });
    assert.deepEqual(done, { mode: "harness-only", grantsRevoked: true, ledgersPreserved: true });
    assert.equal(rollbackVerdict(done).done, true);
    assert.equal(rollbackVerdict({ mode: "supervised", grantsRevoked: false, ledgersPreserved: false }).done, false);
    assert.equal(reentryGate(false).enter, false);
    assert.equal(reentryGate(true).enter, true);
  });

  it("manual closed never reads as verified completion; cold-read attribution runs at every review (F4-BI-08; F15-RD-05)", () => {
    const live: LiveStore = { reachable: true, readLive: () => liveState({ status: "closed" }) };
    const verdict = verifyMutation(live, { kind: "close", issueId: "bd-1", runId: "r1" });
    assert.equal(verdict.decision, "refuse");
    assert.match(verdict.reason, /never reads as verified completion/);
    const gate = runReviewGate({ kind: "routine", output: "The price is $4 per 1M, see https://example.com/pricing.", caseId: "s6", promotion: "proposed" });
    assert.equal(gate.routedTo, "expert-solo");
    assert.equal(gate.blocking, false);
  });
});

// --- S7 bootstrap idempotence -----------------------------------------------------
// P: F9-BS-01–12,14 (F9-BS-13 excluded by the map; stays matrix-only)
// Setup: varied project signals with the tool.execute seam stubbed (real
// runBootstrap logic). Action: run twice + drive failure/deny/kill paths.
// Assertion: second run writes nothing new, retry cap parks visible at 3,
// F2 denial parks only that step, corrupt markers disclose-and-ask.
describe("S7 bootstrap idempotence (F9-BS-01–12,14)", () => {
  it("trigger fires on first real prose in the primary session; slash and re-check paths bail (F9-BS-01)", () => {
    assert.equal(evaluateTrigger({ input: "check the setup", isPrimarySession: true, isRecheckPath: false }), "fire");
    assert.equal(evaluateTrigger({ input: "/setup", isPrimarySession: true, isRecheckPath: false }), "bail-slash");
    assert.equal(evaluateTrigger({ input: "fix it", isPrimarySession: true, isRecheckPath: true }), "bail-recheck");
    assert.equal(evaluateTrigger({ input: "hello", isPrimarySession: false, isRecheckPath: false }), "wait-primary");
  });

  it("fully-set-up project passes with zero writes; rerun after setup writes nothing (F9-BS-02,04 idempotence)", () => {
    const first = stubEffects();
    const report = runBootstrap({ signals: setupSignals(), kill: DEFAULT_KILL_SWITCHES, firstPass: true, failures: freshFailures(), reattemptParked: false, effects: first });
    assert.deepEqual(first.calls, []);
    assert.ok(report.steps.every((s) => s.status === "skipped-setup"));
    const second = stubEffects();
    const report2 = runBootstrap({ signals: setupSignals(), kill: DEFAULT_KILL_SWITCHES, firstPass: false, failures: freshFailures(), reattemptParked: false, effects: second });
    assert.deepEqual(second.calls, []);
    assert.ok(report2.steps.every((s) => s.status === "skipped-setup"));
  });

  it("only the missing step runs; dual-surface append then clean rerun is idempotent per-surface (F9-BS-02,04)", () => {
    const effects = stubEffects();
    const report = runBootstrap({ signals: setupSignals({ piSettingsPresent: false, settingsEntry: "absent" }), kill: DEFAULT_KILL_SWITCHES, firstPass: true, failures: freshFailures(), reattemptParked: false, effects });
    assert.deepEqual(effects.calls, ["mergeSettings"]);
    assert.equal(report.steps.find((s) => s.step === "step2-settings")?.status, "ran");
    const dual = stubEffects();
    runBootstrap({ signals: setupSignals({ adviceBlock: "absent", pluginBlock: "absent" }), kill: DEFAULT_KILL_SWITCHES, firstPass: true, failures: freshFailures(), reattemptParked: false, effects: dual });
    assert.deepEqual(dual.calls, ["bdSetupAdvice", "appendPluginBlock"]);
    const rerun = stubEffects();
    runBootstrap({ signals: setupSignals(), kill: DEFAULT_KILL_SWITCHES, firstPass: false, failures: freshFailures(), reattemptParked: false, effects: rerun });
    assert.deepEqual(rerun.calls, []);
  });

  it("nested repo skips git with zero git writes and disclosure; below-floor bd upgrades via the verified path (F9-BS-05,08)", () => {
    const effects = stubEffects();
    const report = runBootstrap({ signals: setupSignals({ gitRepoPresent: false, nestedInsideRepo: true }), kill: DEFAULT_KILL_SWITCHES, firstPass: true, failures: freshFailures(), reattemptParked: false, effects });
    assert.ok(!effects.calls.includes("gitInit"));
    assert.equal(report.steps.find((s) => s.step === "step1-git")?.status, "skipped-nested");
    assert.ok(report.disclosures.some((d) => d.includes("nested")));
    const upgrade = stubEffects();
    runBootstrap({ signals: setupSignals({ bdVersion: "0.58.0" }), kill: DEFAULT_KILL_SWITCHES, firstPass: true, failures: freshFailures(), reattemptParked: false, effects: upgrade });
    assert.ok(upgrade.calls.includes("upgradeBd"));
  });

  it("user edits win with divergence disclosed; deleted blocks disclose-and-ask, never silently re-add (F9-BS-10)", () => {
    const effects = stubEffects();
    const report = runBootstrap({ signals: setupSignals({ pluginBlock: "modified" }), kill: DEFAULT_KILL_SWITCHES, firstPass: false, failures: freshFailures(), reattemptParked: false, effects });
    assert.equal(report.steps.find((s) => s.step === "step4-agents")?.status, "skipped-user-edit");
    assert.ok(report.disclosures.some((d) => d.includes("user edit wins")));
    const asked: string[] = [];
    const deleted = stubEffects({ ask: (m: string) => { asked.push(m); return false; } });
    const report2 = runBootstrap({ signals: setupSignals({ pluginBlock: "deleted" }), kill: DEFAULT_KILL_SWITCHES, firstPass: false, failures: freshFailures(), reattemptParked: false, effects: deleted });
    assert.equal(report2.steps.find((s) => s.step === "step4-agents")?.status, "awaiting-user");
    assert.ok(!deleted.calls.includes("appendPluginBlock"));
  });

  it("F2 denial parks THAT step fail-closed while independent steps continue (F9-BS-12)", () => {
    const effects = stubEffects();
    const report = runBootstrap({
      signals: setupSignals({ gitRepoPresent: false, pluginBlock: "absent" }), kill: DEFAULT_KILL_SWITCHES,
      firstPass: true, failures: freshFailures(), reattemptParked: false,
      effects: { ...effects, gitInit: () => { effects.calls.push("gitInit"); return "denied-f2"; } },
    });
    assert.equal(report.steps.find((s) => s.step === "step1-git")?.status, "parked");
    assert.equal(report.steps.find((s) => s.step === "step4-agents")?.status, "ran");
  });

  it("retry cap is 3: the third failure parks visible under F3-SD-04a, never already-set-up; parked stays without re-attempt (F9-BS-14)", () => {
    assert.equal(SETUP_RETRY_CAP, 3);
    const effects = stubEffects();
    const failures = freshFailures();
    failures["step1-git"] = 2;
    const report = runBootstrap({
      signals: setupSignals({ gitRepoPresent: false }), kill: DEFAULT_KILL_SWITCHES,
      firstPass: true, failures, reattemptParked: false,
      effects: { ...effects, gitInit: () => { effects.calls.push("gitInit"); return "failed"; } },
    });
    assert.equal(report.steps.find((s) => s.step === "step1-git")?.status, "parked");
    assert.equal(report.parks[0]?.park, "F3-SD-04a");
    assert.equal(report.parks[0]?.visible, true);
    assert.equal(report.parks[0]?.readsAsSetup, false);
  });
});

// --- S8 compressor single-owner -----------------------------------------------------
// P: F12-WC-01,02,04,05,07
// S: F12-WC-03,06,08,09; F5-DS-07; F8-PS-03
// Setup: native + Magic summarizers both active (a compaction contest).
// Action: assert the single-compressor gate, path pin, archive pass, and purge.
// Assertion: exactly one compressor, path pinned only after the user saw the
// probe result, breach discards cleanly + parks, purge is user-only.
describe("S8 compressor single-owner (F12-WC-01,02,04,05,07)", () => {
  it("exactly one compressor: dual summarization throws; path pins only after the user saw the probe result (F12-WC-01,02)", () => {
    assert.throws(() => assertSingleCompressor(true, true));
    assertSingleCompressor(true, false);
    assertSingleCompressor(false, true);
    assert.throws(() => gatePathPin(false));
    assert.deepEqual(gatePathPin(true), { pinned: MAGIC_PATH });
    assert.equal(MAGIC_PATH, "a (disable-historian + native compaction)");
  });

  it("bound breach discards cleanly with no partial entry and parks; headless work uses zero sidecars (F12-WC-05,06)", () => {
    assert.deepEqual(atomicArchivePass(true), { persisted: false, parked: true });
    assert.deepEqual(atomicArchivePass(false), { persisted: true, parked: false });
    assert.throws(() => assertZeroSidecars(["sidecar.md"]));
    assertZeroSidecars([]);
  });

  it("writer archive follows the task id across rollover and reuse; per-seat scopes mirror the F10 pattern (F12-WC-04; F5-DS-07 rollover side)", () => {
    assert.deepEqual(taskArchive("t1"), { key: "task-archive:t1", scope: "writer-task-scoped" });
    assert.equal(archiveScope("seeker"), "seeker-full");
    assert.equal(archiveScope("writer"), "writer-task-scoped");
    assert.equal(archiveScope("dispatcher"), "list-only");
    assert.equal(archiveScope("expert"), "list-only");
  });

  it("purge is an explicit user-only disposition; archives are recall sources only (F12-WC-09; F12-WC-04)", () => {
    assert.throws(() => purgeArchives({ userDirected: false }));
    assert.deepEqual(purgeArchives({ userDirected: true }), { purged: true });
    assert.deepEqual(gateArchivePromotion("user-direct"), { allowed: true });
    assert.throws(() => gateArchivePromotion("automatic"));
  });
});

// --- S9a reuse-gate identity ----------------------------------------------------------
// P: F5-DS-01,02,08
// S: F7-MP-06; F5-DS-12
// Setup: a partial run whose model identity drifted mid-flight.
// Action: validate reuse against the expected identity. Assertion: drift
// refuses resume and dispatches the named backup fresh with logged notice.
describe("S9a reuse-gate identity (F5-DS-01,02,08)", () => {
  it("identity equality gates resume: model drift refuses; backup dispatches fresh with logged notice (F5-DS-01,02)", () => {
    assert.deepEqual(validateReuse(partialReuse()), { eligible: true, reasons: [] });
    assert.equal(validateReuse({ ...partialReuse(), identity: { ...IDENTITY, model: "m2" } }).eligible, false);
    assert.equal(validateReuse({ ...partialReuse(), identity: { ...IDENTITY, variant: "v9" } }).eligible, false);
    const backup = dispatchBackup("m-backup", false);
    assert.equal(backup.fresh, true);
    assert.match(backup.notice, /logged notice/);
    assert.throws(() => dispatchBackup("m-backup", true));
  });

  it("fresh dispatch needs live authority: revoked or insufficient authority parks (F5-DS-08; F5-DS-12 envelope side)", () => {
    assert.deepEqual(validateLaunchAuthority({ authorized: true, revoked: false }), { launch: true });
    assert.ok("parked" in validateLaunchAuthority({ authorized: false, revoked: false }));
    assert.ok("parked" in validateLaunchAuthority({ authorized: true, revoked: true }));
    assert.deepEqual(requireRevisionEnvelope(true), { bound: true });
  });
});

// --- S9b reuse-gate permission ----------------------------------------------------------
// P: F5-DS-01,08,10,12; F2-PE-05,09
// S: F4-BI-05,09
// Setup: a partial run whose grant narrowed after dispatch; tracker down.
// Action: validate reuse under narrowed permission + outage + live re-check.
// Assertion: narrowed permission refuses, outage refuses launches, stale never
// authorizes, same-run recovery proceeds only against verified live state.
describe("S9b reuse-gate permission (F5-DS-01,08,10,12; F2-PE-05,09)", () => {
  it("narrowed permission refuses resume; recurring denial parks (F5-DS-01; F2-PE-05,09)", () => {
    assert.equal(validateReuse({ ...partialReuse(), permissionNarrowed: true }).eligible, false);
    assert.equal(validateReuse({ ...partialReuse(), overBudget: true }).eligible, false);
    const gate = new PermissionGate(POLICY);
    assert.equal(gate.decide(gateCall({ args: {}, scopePaths: [] })).outcome, "deny-log-and-park");
  });

  it("tracker outage refuses launches; reachable tracker validates live before any mutation (F5-DS-10; F4-BI-05,09)", () => {
    assert.ok("refused" in guardTrackerAccess(false));
    const unreachable: LiveStore = { reachable: false, readLive: () => null };
    assert.equal(verifyMutation(unreachable, { kind: "claim", issueId: "bd-1", runId: "r1" }).decision, "refuse");
    const live: LiveStore = { reachable: true, readLive: (id: string) => (id === "bd-1" ? liveState() : null) };
    assert.equal(verifyMutation(live, { kind: "claim", issueId: "bd-1", runId: "r1" }).decision, "proceed");
    assert.equal(verifyMutation(live, { kind: "claim", issueId: "bd-unknown", runId: "r1" }).decision, "park");
  });

  it("other-run ownership parks-and-asks; same-run recovery proceeds; envelope binds the run (F5-DS-12)", () => {
    const live: LiveStore = {
      reachable: true,
      readLive: (id: string) => (id === "bd-1" ? liveState({ status: "in_progress", runOwner: "other-run" }) : null),
    };
    assert.equal(verifyMutation(live, { kind: "claim", issueId: "bd-1", runId: "r1" }).decision, "park");
    const sameRun: LiveStore = {
      reachable: true,
      readLive: (id: string) => (id === "bd-1" ? liveState({ status: "in_progress", runOwner: "r1" }) : null),
    };
    assert.equal(verifyMutation(sameRun, { kind: "claim", issueId: "bd-1", runId: "r1" }).decision, "proceed");
    assert.deepEqual(requireRevisionEnvelope(true), { bound: true });
  });
});

// --- S9c reuse-gate completed -------------------------------------------------------------
// P: F5-DS-03,08; F12-WC-09
// S: F4-BI-08; F5-DS-04
// Setup: completed, cancelled, and Expert-review runs presented for in-place reuse.
// Action: validate reuse on each terminal state. Assertion: terminal states
// never reuse, Expert always fresh, needed evidence preserved until verified
// handback, archives purge only on user disposition.
describe("S9c reuse-gate completed (F5-DS-03,08; F12-WC-09)", () => {
  it("completed and cancelled never reuse; Expert reviews always dispatch fresh (F5-DS-03)", () => {
    assert.equal(validateReuse({ ...partialReuse(), status: "completed" }).eligible, false);
    assert.equal(validateReuse({ ...partialReuse(), status: "cancelled" }).eligible, false);
    assert.equal(validateReuse({ ...partialReuse(), seat: "expert" }).eligible, false);
    assert.deepEqual(validateReuse(partialReuse()), { eligible: true, reasons: [] });
  });

  it("needed evidence stays until verified handback or disposition; restart needs a user instruction plus a fresh session (F5-DS-09,04; F4-BI-08 separation side)", () => {
    assert.deepEqual(preserveUntilHandback(false, false), { preserved: true });
    assert.deepEqual(preserveUntilHandback(true, false), { preserved: false });
    assert.deepEqual(restartAfterCancel(true), { fresh: true });
    assert.throws(() => restartAfterCancel(false));
  });

  it("archives purge only on explicit user disposition (F12-WC-09)", () => {
    assert.throws(() => purgeArchives({ userDirected: false }));
    assert.deepEqual(purgeArchives({ userDirected: true }), { purged: true });
  });
});

// --- S10 spec drift --------------------------------------------------------------------------
// P: F3-SD-03,03a,04,07; F1-AR-01; F6-PD-02,03; F13-VH-10
// S: F3-SD-01,02,08,09; F4-BI-07; F6-PD-04,05; F1-AR-07,08
// Setup: live source diverged from the recorded pin; harness re-pin due.
// Action: drift check, install record, re-pin, fallback admission, coverage
// mapping. Assertion: drift warns but keeps serving the pin, SHA mismatch
// refuses install, undisclosed harness drift fails coverage, unverified
// fallback drops, F2-PE-11/F3-SD-05 run executable (P-HIDE-13/SDD-08/09).
describe("S10 spec drift (F3-SD-03,03a,04,07; F1-AR-01; F6-PD-02,03; F13-VH-10)", () => {
  it("drift warns warn-only and keeps serving the pin; SHA mismatch refuses install; equal SHAs verify (F6-PD-02,03; F3-SD-03,03a)", () => {
    const drifted = checkDrift("sha-recorded", "sha-live");
    assert.equal(drifted.verdict, "warned");
    assert.match(drifted.disclosure, /keeps serving the pin/);
    assert.equal(checkDrift("sha-same", "sha-same").verdict, "no-op");
    assert.equal(verifySha("a", "a"), true);
    assert.equal(verifySha("a", "b"), false);
    const refused = recordInstall({ tag: "v1", claimedSha: "a", observedSha: "b", at: "2026-09-28" });
    assert.ok("verdict" in refused && refused.verdict === "refused");
    const recorded = recordInstall({ tag: "v1", claimedSha: "a", observedSha: "a", at: "2026-09-28" });
    assert.ok("record" in recorded);
  });

  it("harness re-pin records exact version + SHA + disclosure; undisclosed drift fails coverage (F13-VH-10)", () => {
    assert.equal(checkRepin({ version: "0.6.1", sha: "b99b1944e4421eedddc25201f93116bbff76af21", driftDisclosure: "HEAD equals the pin record: no drift" }).verdict, "recorded");
    assert.equal(checkRepin({ version: "0.6.1", sha: "UNVERIFIED", driftDisclosure: "" }).verdict, "coverage-violation");
  });

  it("provenance failure drops the fallback to primary-only; verified provenance admits it (F13-VH-09 composition for drifted sources)", () => {
    assert.equal(admitFallback({ commit: "c", scope: "s" }, { commitVerifiable: false, scopeWithinPin: true, sourceReachable: true }).admitted, false);
    assert.equal(admitFallback({ commit: "c", scope: "s" }, { commitVerifiable: true, scopeWithinPin: true, sourceReachable: true }).admitted, true);
  });

  it("dispatcher stays the single entry; unknown live state parks for reconcile-first, never blind replay (F1-AR-01; F3-SD-04,07)", () => {
    assert.match(dispatcher.hardRuleSummary, /single entry/);
    const unknown: LiveStore = { reachable: true, readLive: () => null };
    const verdict = verifyMutation(unknown, { kind: "update", issueId: "bd-1", runId: "r1" });
    assert.equal(verdict.decision, "park");
    assert.match(verdict.reason, /never blind replay/);
  });

  it("adjudicated IDs map to executable suite items (F2-PE-11 P-HIDE-13, F3-SD-05 SDD-08/09)", () => {
    const out = checkCoverage([
      { requirementId: "F2-PE-11", control: "preventive", adversarialScenario: "P-HIDE-13", targets: [{ kind: "suite-item", item: "P-HIDE-13a" }, { kind: "suite-item", item: "P-HIDE-13b" }] },
      { requirementId: "F3-SD-05", control: "preventive", adversarialScenario: "SDD-08/SDD-09", targets: [{ kind: "suite-item", item: "SDD-08" }, { kind: "suite-item", item: "SDD-09" }] },
      { requirementId: "F5-DS-01", control: "preventive", adversarialScenario: "S1", targets: [{ kind: "suite-item", item: "S1" }] },
    ]);
    assert.equal(out.pass, true);
    assert.equal(checkCoverage([{ requirementId: "F2-PE-11", control: "preventive", adversarialScenario: null, targets: [] }]).pass, false);
  });

  it("SDD-08 tiny-classified task records the compact revision-bound record, no parallel tracker (F3-SD-05)", () => {
    const tiny = {
      revision: "spec-r3", intent: "rename one flag", boundaries: "touches src/flag.ts only",
      acceptance: "unit test green", beadsLink: "bd-7a",
      tinyJustification: "bounded-touch-set single file; explicit-transformation rename; reversibility revert-clean; deterministic-verification unit test",
      tasksMdEntry: false,
    };
    assert.deepEqual(checkCompactRecord(tiny), { present: true });
    assert.throws(() => checkCompactRecord({ ...tiny, intent: "" }));
    assert.throws(() => checkCompactRecord({ ...tiny, tinyJustification: "small task" }));
    assert.throws(() => checkCompactRecord({ ...tiny, beadsLink: "" }));
    assert.throws(() => checkCompactRecord({ ...tiny, tasksMdEntry: true }));
  });

  it("SDD-09 task no longer tiny promotes before continuing; compactness-as-waiver refused (F3-SD-05)", () => {
    const clean = { widerScope: false, newAcceptance: false, changedConsequences: false };
    assert.deepEqual(requirePromotion(clean, true), { promoted: true });
    assert.throws(() => requirePromotion({ ...clean, widerScope: true }, true));
    assert.throws(() => requirePromotion({ ...clean, newAcceptance: true }, true));
    assert.deepEqual(requirePromotion({ ...clean, changedConsequences: true }, false), { promoted: true });
  });
});

// --- S11 zero-web disclosure ---------------------------------------------------------------------
// P: F10-WR-01,02,07,08,09; F15-RD-01,07; F13-VH-05,11
// S: F10-WR-03,04,05,06,10,11,14; F15-RD-02,03,04,05,06,08; F8-PS-13; F11-DM-10
// Setup: the full retrieval chain exhausted with zero web results (all tiers
// rate-class or unreachable; the ctx.ui seam substituted by injected grant +
// trail records — no network touched). Action: walk keyless trio → keyed slots
// → reserves → gap disclosure → claim carry. Assertion: every fallback
// discloses, uncovered demand fails closed, unattributed claims disclose or
// drop (never silent), runtime strings match signed-off text at both gates.
describe("S11 zero-web disclosure (F10-WR-01,02,07,08,09; F15-RD-01,07; F13-VH-05,11)", () => {
  it("v1 chain order is donsetch scraped-SERP search -> markdown.new -> Context7; keyed slots need keys; reserves need documented exhaustion (F10-WR-01,07,08)", () => {
    assert.deepEqual([...KEYLESS_TRIO], ["donsetch-search", "markdown.new", "context7"]);
    assert.equal(isKeyedSlotActive(false), false);
    assert.equal(reservesActive(false), false);
    assert.equal(reservesActive(true), true);
  });

  it("exhaustion on an uncovered demand fails closed as acceptance-critical; non-critical gaps proceed reversibly with disclosure (F10-WR-02,09)", () => {
    assert.deepEqual(discloseGap(null).action, "stop-branch");
    assert.match(discloseGap(null).disclosure, /fail-closed as acceptance-critical/);
    assert.deepEqual(discloseGap(false).action, "proceed-reversible");
    assert.deepEqual(discloseGap(true).action, "stop-branch");
  });

  it("sources carry through the chain; uncarried sources disclose, never silently (F15-RD-01; F10-WR-03 list-only side)", () => {
    assert.deepEqual(carrySources("content", ["https://example.com/x"]), { content: "content", sources: ["https://example.com/x"] });
    const carried = carrySourcesStrict("claim text", [], "disclose");
    assert.equal(carried.dropped, false);
    assert.match(carried.disclosure ?? "", new RegExp(SOURCE_NOT_CARRIED_DISCLOSURE));
    const dropped = carrySourcesStrict("claim text", [], "drop");
    assert.equal(dropped.dropped, true);
    assert.equal(dropped.content, "");
  });

  it("fresh-fact claims surface for the cold read; unattributed claims disclose or drop; promotion needs pilot evidence plus sign-off (F15-RD-07; F10-WR-11)", () => {
    assert.ok(detectClaims("The price is $4 per 1M.").length > 0);
    assert.equal(handleUnattributed("bare claim", "disclose").verdict, "disclosed");
    assert.equal(handleUnattributed("bare claim", "drop").verdict, "dropped");
    assert.equal(advancePromotion("proposed", { pilotEvidence: false, userSignoff: false }), "proposed");
    assert.equal(advancePromotion("proposed", { pilotEvidence: true, userSignoff: false }), "piloted");
    assert.equal(advancePromotion("piloted", { pilotEvidence: false, userSignoff: true }), "user-signed");
  });

  it("runtime strings must match signed-off text at spec review AND pre-pilot; staleness bound is the pinned 120s (F13-VH-11,05)", () => {
    assert.equal(checkSignedString({ text: "a", gate: "spec-review", signedOffText: "a" }).pass, true);
    assert.equal(checkSignedString({ text: "a", gate: "spec-review", signedOffText: "b" }).pass, false);
    assert.equal(checkSignedString({ text: "a", gate: "pre-pilot", signedOffText: "b" }).pass, false);
    assert.equal(STALENESS_MAX_AGE_MS, 120_000);
  });
});

// --- Live probes: PENDING-LIVE with exact blockers -------------------------------------------------
// Attempted 2026-09-28 in this session against /tmp/psgate (harness 0.6.1 +
// @mariozechner/pi 0.70.6 + pi-agent-core 0.87.1 installed):
// (a) PS-GATE-06 TUI mount-visibility: `tty` reports "not a tty" (headless,
//     no interactive TUI possible); the `pi` CLI runs but any panel mount
//     needs a live TUI to observe visibility. Visibility unverifiable here.
// (b) PS-GATE-05 Magic cleanliness (path-(a) pin): piped `pi --provider google`
//     answers "No API key found for the selected model" — no keyed model
//     session exists in scope, and the run needs one. Not runnable here.
// Only the static halves execute below; neither probe is claimed green.
describe("live probes PENDING-LIVE (PS-GATE-06 mount-visibility; PS-GATE-05 Magic cleanliness)", () => {
  it("PS-GATE-06 static rule: null probe stays UNVERIFIED; mounted-but-invisible serves the disclosed fallback, never a silent downgrade", () => {
    assert.deepEqual(probeGate(null), { form: "UNVERIFIED", note: "PS-GATE-06 live wiring pending; mount-visibility criteria unproven" });
    assert.deepEqual(probeGate({ mounted: true, visible: false }), { form: "fallback-disclosed" });
    assert.deepEqual(probeGate({ mounted: false, visible: false }), { form: "fallback-disclosed" });
    assert.deepEqual(probeGate({ mounted: true, visible: true }), { form: "panel-tab" });
    assert.equal(probeHealth(null).verified, false);
    assert.match(probeHealth(null).banner ?? "", /UNVERIFIED/);
    assert.equal(probeHealth({ mounted: true, visible: true }).verified, true);
  });

  it("PS-GATE-05 static half: path-(a) pin stands gated on the user having seen the probe result; live cleanliness run needs a keyed session", () => {
    assert.deepEqual(gatePathPin(true), { pinned: MAGIC_PATH });
    assert.throws(() => gatePathPin(false));
  });
});
