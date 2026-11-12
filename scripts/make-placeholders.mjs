// Generates labelled "SEGNAPOSTO" stand-ins for captures that do not exist yet
// (spec product-media: placeholders show no interface and say what they stand for).
// Never overwrites an existing file: real captures are safe. Use --force to regenerate.
// Requires ffmpeg on PATH for the clips.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");
const symbol = readFileSync("public/brand/danamus-symbol-reversed.svg", "utf8")
  .replace(/<\?xml[^>]*>/, "")
  .match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);

const stills = [
  ["macos/picker.png", 2880, 1800, "Scelta del video", "macOS"],
  ["macos/area.png", 2880, 1800, "Area di gioco", "macOS"],
  ["macos/analysis.png", 2880, 1800, "Analisi in corso", "macOS"],
  ["macos/editor.png", 2880, 1800, "Editor", "macOS"],
  ["macos/export.png", 2880, 1800, "Esportazione", "macOS"],
  ["ios/editor.png", 1206, 2622, "Editor", "iOS"],
  ["ios/projects.png", 1206, 2622, "Progetti", "iOS"],
  ["windows/editor.png", 2880, 1800, "Editor", "Windows"],
];
const clips = [
  ["analysis.mp4", "macos/analysis.png", 10],
  ["editing.mp4", "macos/editor.png", 12],
];

const svgFor = (w, h, screen, platform) => {
  const u = Math.min(w, h) / 100; // layout unit
  const s = u * 14; // symbol size
  const [, viewBox, inner] = symbol;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <pattern id="g" width="${u * 6}" height="${u * 6}" patternUnits="userSpaceOnUse">
      <path d="M ${u * 6} 0 L 0 0 0 ${u * 6}" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="${u * 0.12}"/>
    </pattern>
    <radialGradient id="v" cx="50%" cy="45%" r="70%">
      <stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#0f0f0f"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <svg x="${(w - s) / 2}" y="${h / 2 - s - u * 6}" width="${s}" height="${s}" viewBox="${viewBox}">${inner}</svg>
  <text x="50%" y="${h / 2 + u * 3}" text-anchor="middle" fill="#00c573" font-family="Inter, sans-serif" font-weight="600" font-size="${u * 2.6}" letter-spacing="${u * 0.5}">SEGNAPOSTO</text>
  <text x="50%" y="${h / 2 + u * 10}" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-weight="600" font-size="${u * 5.6}">${screen}</text>
  <text x="50%" y="${h / 2 + u * 15.5}" text-anchor="middle" fill="#898989" font-family="Inter, sans-serif" font-size="${u * 2.8}">${platform} · screenshot reale in arrivo</text>
</svg>`;
};

for (const [file, w, h, screen, platform] of stills) {
  const out = path.join("src/assets/media", file);
  if (existsSync(out) && !force) { console.log(`skip ${out} (exists)`); continue; }
  mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svgFor(w, h, screen, platform))).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${out}`);
}

for (const [file, still, seconds] of clips) {
  const out = path.join("public/media", file);
  if (existsSync(out) && !force) { console.log(`skip ${out} (exists)`); continue; }
  mkdirSync(path.dirname(out), { recursive: true });
  // Slow push-in on the placeholder still: H.264, no audio, faststart, 1440 wide.
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y", "-loop", "1", "-i", path.join("src/assets/media", still),
    "-t", String(seconds), "-vf",
    "scale=2880:-2,zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1440x900:fps=30",
    "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", out,
  ]);
  console.log(`wrote ${out}`);
}
