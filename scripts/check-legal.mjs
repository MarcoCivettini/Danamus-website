// Checks the `legal` block of src/site.config.ts before the public deployment
// (spec: legal-pages, "The public deployment warns about draft legal pages").
//
// - draft: true  → the drafts are published: one warning per placeholder
//                  field (GitHub Actions annotation), exit 0.
// - draft: false → strict: any placeholder or empty field (vat may be empty)
//                  fails the deployment, exit 1.
// Private previews (pnpm build:preview) do not run it.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/site.config.ts", import.meta.url), "utf8");
const block = src.match(/\blegal:\s*\{([\s\S]*?)\n\s*\},/)?.[1];
if (!block) {
  console.error("::error title=Legal pages::no `legal` block found in src/site.config.ts");
  process.exit(1);
}

const draft = /\bdraft:\s*true\b/.test(block);
const missing = [];
for (const [, key, value] of block.matchAll(/^\s*(\w+):\s*"([^"]*)"/gm)) {
  const v = value.trim();
  // vat may be left empty when it does not apply; every other field is required.
  if (/^\[.*\]$/.test(v) || (v === "" && key !== "vat")) missing.push(`${key} is still a placeholder (${value || "empty"})`);
}

if (draft) {
  for (const m of missing) console.log(`::warning title=Legal pages draft::${m}`);
  console.log(
    missing.length
      ? `check-legal: publishing the legal pages as drafts (${missing.length} fields to fill in src/site.config.ts).`
      : "check-legal: details filled in, pages still marked as draft: set `draft: false` once the texts are reviewed.",
  );
  process.exit(0);
}

if (missing.length) {
  for (const m of missing) console.log(`::error title=Legal pages::${m}`);
  console.error("Legal pages are marked final (draft: false) but details are missing. Fill them in src/site.config.ts.");
  process.exit(1);
}
console.log("check-legal: legal details filled in, not a draft.");
