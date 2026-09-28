// CI workflow guard (run #1 invalid-yaml lesson: the workflow file was
// never parsed by the test suite, so `//` comments shipped as YAML).
//
// Dependency-free structural check: no YAML parser is in package.json, so
// this asserts the file has no non-YAML `//` comments and that the designed
// [windows-latest, macos-latest] x node 22/24 matrix plus the mac install
// step are present. Full YAML validity is verified in CI itself.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const WORKFLOW_URL = new URL("../../.github/workflows/ci.yml", import.meta.url);

function readWorkflow(): { text: string; lines: string[] } {
  const text = readFileSync(WORKFLOW_URL, "utf8");
  return { text, lines: text.split("\n") };
}

describe("ci workflow", () => {
  it("parses as YAML-shaped content with no // comments", () => {
    const { lines } = readWorkflow();
    assert.ok(lines.length > 10, "workflow file should be non-trivial");
    for (const [i, line] of lines.entries()) {
      assert.ok(
        !line.trimStart().startsWith("//"),
        `line ${i + 1} uses non-YAML // comment: ${line}`,
      );
    }
  });

  it("keeps the windows + macos lanes and the node 22/24 matrix", () => {
    const { text } = readWorkflow();
    assert.match(text, /name:\s*dispatch-ci/);
    assert.match(text, /runs-on:\s*\$\{\{\s*matrix\.os\s*\}\}/);
    assert.ok(text.includes("windows-latest"), "windows lane present");
    assert.ok(text.includes("macos-latest"), "macos lane present");
    assert.match(text, /node:\s*\[22,\s*24\]/);
    assert.match(text, /strategy:/);
    assert.match(text, /matrix:/);
  });

  it("keeps the checkout/setup-node steps and the mac install step", () => {
    const { text } = readWorkflow();
    assert.ok(text.includes("actions/checkout@v4"), "checkout step present");
    assert.ok(text.includes("actions/setup-node@v4"), "setup-node step present");
    assert.ok(
      text.includes("mac-specific install handling"),
      "mac install step present",
    );
    assert.match(text, /runner\.os\s*==\s*'macOS'/);
    assert.match(text, /npm ci/);
    assert.match(text, /npm test/);
  });
});
