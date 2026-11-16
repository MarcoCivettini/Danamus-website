// Copies dist/ to dist-preview/ with root-relative URLs ("/x") rewritten to
// relative ones ("./x"), so the build works at any path (private preview).
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const src = "dist";
const out = "dist-preview";
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

for (const file of walk(out)) {
  if (!/\.(html|css|js)$/.test(file)) continue;
  const depth = path.relative(out, path.dirname(file)).split(path.sep).filter(Boolean).length;
  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  let text = readFileSync(file, "utf8");
  if (file.endsWith(".html")) {
    text = text
      .replace(/(\s(?:src|href|poster|data-src)=")\/(?!\/)/g, `$1${prefix}`)
      .replace(/(\ssrcset=")([^"]+)"/g, (_, a, set) => a + set.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}`) + '"')
      // Page links ("./prezzi/", "../#per-chi") name the file explicitly: the
      // preview host does not map a directory to its index.html.
      .replace(/(\shref=")((?:\.\.?\/)+(?:[\w-]+\/)*)(#[^"]*)?"/g, (_, a, dir, hash = "") => `${a}${dir}index.html${hash}"`)
      // The preview host wraps the page in a frame that sets an unlayered
      // body { background: #fff; color: #000 }, which beats the site's layered
      // styles. The body must stay transparent (the page colour is on html),
      // otherwise it covers the pointer glow behind the content (preview only).
      .replace("</head>", "<style>body{background:transparent;color:var(--fg)}</style></head>");
  } else if (file.endsWith(".css")) {
    text = text.replace(/url\(\s*(["']?)\/(?!\/)/g, `url($1${prefix}`);
  } else {
    text = text.replace(/(["'`])\/assets\//g, `$1${prefix}assets/`);
  }
  writeFileSync(file, text);
}
console.log(`preview build ready in ${out}/`);
