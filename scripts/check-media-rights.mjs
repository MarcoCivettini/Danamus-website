// Fails when any media item shows footage that is not cleared for public use.
// Runs in the GitHub Pages workflow before the build (spec: product-media).
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/data/media.ts", import.meta.url), "utf8");
const body = src.slice(src.indexOf("const raw = ["), src.indexOf("] as const;"));
const consts = Object.fromEntries(
  [...src.matchAll(/^const (\w+) = \{[^}]*cleared:\s*(true|false)[^}]*\};/gm)].map((m) => [m[1], m[2] === "true"]),
);
const entries = body.split(/\n\s*\{ kind:/).slice(1);
const blocked = [];
for (const e of entries) {
  const id = e.match(/id:\s*"([^"]+)"/)?.[1] ?? "?";
  const ref = e.match(/footage:\s*(\w+)/)?.[1];
  const inline = e.match(/footage:\s*\{[^}]*cleared:\s*(true|false)/)?.[1];
  const cleared = inline ? inline === "true" : ref ? consts[ref] : undefined;
  if (cleared !== true) blocked.push(id);
}
if (entries.length === 0) {
  console.error("check-media-rights: no media entries found in src/data/media.ts");
  process.exit(1);
}
if (blocked.length) {
  console.error(`Footage not cleared for public use: ${blocked.join(", ")}`);
  console.error("Replace the footage or set `cleared: true` in src/data/media.ts once the rights are confirmed.");
  process.exit(1);
}
console.log(`check-media-rights: ${entries.length} items, all cleared.`);
