// Fails while the legal pages are drafts or still contain [placeholders].
// Runs in the GitHub Pages workflow before the build (spec: legal-pages).
// Private previews (pnpm build:preview) do not run it.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/site.config.ts", import.meta.url), "utf8");
const block = src.match(/\blegal:\s*\{([\s\S]*?)\n\s*\},/)?.[1];
if (!block) {
  console.error("check-legal: no `legal` block found in src/site.config.ts");
  process.exit(1);
}

const problems = [];
if (/\bdraft:\s*true\b/.test(block)) problems.push("draft is true");
for (const [, key, value] of block.matchAll(/^\s*(\w+):\s*"([^"]*)"/gm)) {
  const v = value.trim();
  // vat may be left empty when it does not apply; every other field is required.
  if (/^\[.*\]$/.test(v) || (v === "" && key !== "vat")) problems.push(`${key} is still a placeholder (${value || "empty"})`);
}

if (problems.length) {
  console.error(`Legal pages not ready for publication:\n  - ${problems.join("\n  - ")}`);
  console.error("Fill in `legal` in src/site.config.ts and set `draft: false` once the texts have been reviewed.");
  process.exit(1);
}
console.log("check-legal: legal details filled in, not a draft.");
