// Dispatch Pi extension entry — v1 default-export factory pattern.
// The factory wires hooks only. NO background resources start here; session
// state lazily inits on session_start. Internal functions stay module-local:
// this entry NEVER re-exports internals (the TGO legacy-loader lesson).
import type { DispatchConfig, PolicyOutcome, SeatId } from "./config.js";
import { PermissionGate, type GateDecision, type GateToolCall } from "./permission-gate.js";

export interface SessionState {
  gate: PermissionGate;
  config: DispatchConfig;
  livingSpecPointer: string;
}

export interface DispatchExtension {
  name: "dispatch";
  hooks: {
    session_start(deps?: { createGate?: () => PermissionGate }): SessionState;
    before_agent_start(state: SessionState, seat: SeatId, tools: string[]): string[];
    tool_call(state: SessionState, call: GateToolCall): GateDecision;
    tool_result(state: SessionState, taskId: string, seat: SeatId, tool: string, outcome: PolicyOutcome, detail: string): void;
  };
}

/** v1 default-export factory. Wires hooks; starts nothing. */
export default function createDispatchExtension(config: DispatchConfig): DispatchExtension {
  return {
    name: "dispatch",
    hooks: {
      session_start(deps?: { createGate?: () => PermissionGate }): SessionState {
        // FAIL-CLOSED hook attach (FIND-3): the session never proceeds without
        // the gate. Any attach failure throws at session_start — a silent
        // attach failure would be a fail-open bypass of the deny floor.
        try {
          const gate = deps?.createGate?.() ?? new PermissionGate(config.policy);
          if (gate === undefined || gate === null) throw new Error("gate attach failed: no gate");
          return {
            gate,
            config,
            livingSpecPointer: "dispatch-spec rev pending",
          };
        } catch (err) {
          throw new Error(`dispatch session_start refused (fail-closed): ${err instanceof Error ? err.message : "hook attach failed"}`);
        }
      },

      before_agent_start(state: SessionState, seat: SeatId, tools: string[]): string[] {
        // Restrict-only tool narrowing as defense in depth (F2-PE-07).
        return state.gate.narrowTools(seat, tools);
      },

      tool_call(state: SessionState, call: GateToolCall): GateDecision {
        return state.gate.decide(call);
      },

      tool_result(
        state: SessionState,
        taskId: string,
        seat: SeatId,
        tool: string,
        outcome: PolicyOutcome,
        detail: string,
      ): void {
        // Pass-through audit hook by design, not a no-op: it hosts the F10
        // citation stamping in Slice 3 — currently audit-only, unwired yet.
        state.gate.logResult(taskId, seat, tool, outcome, detail);
      },
    },
  };
}
