// Pi hook attach fail-closed (FIND-3).
//
// Conformance honesty note: green here = IMPLEMENTATION-complete, not
// conformance-complete. The Pi hook LIVE wiring stays named-open; this pins
// the specified failure mode (attach failure throws at session_start) until
// the live-wiring probe lands.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import createDispatchExtension from "../index.js";
import type { DispatchConfig } from "../config.js";

const CONFIG: DispatchConfig = {
  path: "work",
  models: [],
  policy: { revision: "test-1", protectedPaths: [], scopedExceptions: [] },
  tokenizer: { identity: "UNVERIFIED", unit: "whitespace-estimate" },
  retry: { status: "UNVERIFIED", maxAttempts: null },
  adapter: { status: "UNVERIFIED", form: null },
  globalCeiling: 8,
};

describe("session_start hook attach (FIND-3)", () => {
  it("attach failure throws fail-closed; the session never proceeds gateless", () => {
    const ext = createDispatchExtension(CONFIG);
    assert.throws(
      () =>
        ext.hooks.session_start({
          createGate: () => {
            throw new Error("host attach boom");
          },
        }),
      /fail-closed/,
    );
  });

  it("clean attach starts the session with a gate", () => {
    const ext = createDispatchExtension(CONFIG);
    const state = ext.hooks.session_start();
    assert.ok(state.gate !== undefined);
  });
});
