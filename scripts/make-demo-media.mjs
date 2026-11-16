// Builds the hero editor demo media from a Danamus project curated by hand
// (spec: product-media, "Demo media come from a curated project").
//
//   pnpm make:demo [--db <path>] [--project <name>] [--start 0] [--end 140]
//                  [--ffmpeg <path>] [--ffprobe <path>] [--video <path>]
//
// Reads the app's SQLite database read-only (macOS /usr/bin/sqlite3) and
// writes, all committed to the repo:
//   src/data/demo-project.json          segments of the whole match + excerpt
//   public/media/demo-match.mp4         excerpt, H.264, no audio, <= 3 MB
//   src/assets/media/demo/poster.jpg    a frame of play from the excerpt
// A keyframe at each segment start keeps the demo's jumps between segments quick.
// Re-run it after changing the project's segments in the app.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const home = os.homedir();
const db = args.db ?? path.join(home, "Library/Application Support/com.danamus.app/danamus.db");
const project = args.project ?? "KIM KUM YONG vs CHRISTINA KALLBERG";
const start = Number(args.start ?? 0);
const end = Number(args.end ?? 140);
const appBin = path.resolve("../Danamus/src-tauri/binaries");
const pick = (flag, bundled, name) => args[flag] ?? (existsSync(bundled) ? bundled : name);
const ffmpeg = pick("ffmpeg", path.join(appBin, "ffmpeg-aarch64-apple-darwin"), "ffmpeg");
const ffprobe = pick("ffprobe", path.join(appBin, "ffprobe-aarch64-apple-darwin"), "ffprobe");
const MAX_BYTES = 3 * 1024 * 1024;

const fail = (msg) => {
  console.error(`make-demo-media: ${msg}`);
  process.exit(1);
};
if (!existsSync(db)) fail(`database not found: ${db}`);

// Read-only: -readonly opens the file without write access.
const sql = (q) => execFileSync("sqlite3", ["-readonly", "-json", db, q], { encoding: "utf8" });
const esc = (s) => s.replaceAll("'", "''");
const rows = JSON.parse(
  sql(`select p.video_path, e.intervals_json from projects p join project_edits e on e.project_id = p.id where p.name = '${esc(project)}' limit 1;`) || "[]",
);
if (!rows.length) fail(`project "${project}" not found or without edits`);
const video = args.video ?? rows[0].video_path;
if (!existsSync(video)) fail(`source video not found: ${video}`);

const round = (n) => Math.round(n * 1000) / 1000;
const intervals = JSON.parse(rows[0].intervals_json)
  .map((i) => ({ start: round(i.start), end: round(i.end) }))
  .sort((a, b) => a.start - b.start);
const duration = round(Number(execFileSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video], { encoding: "utf8" })));
if (!(end > start && end <= duration)) fail(`excerpt ${start}-${end}s is outside the video (0-${duration}s)`);

// Intervals inside the excerpt, clipped to it and made relative to its start.
const excerptIntervals = intervals
  .filter((i) => i.end > start && i.start < end)
  .map((i) => ({ start: round(Math.max(i.start, start) - start), end: round(Math.min(i.end, end) - start) }));
if (!excerptIntervals.length) fail("no segment falls inside the excerpt");

const out = {
  project,
  match: "Kim Kum Yong contro Christina Kallberg, WTT Finals Doha 2025",
  source: path.basename(video),
  duration,
  intervals,
  excerpt: { start, end },
  excerptIntervals,
  generatedAt: new Date().toISOString().slice(0, 10),
};

const mp4 = "public/media/demo-match.mp4";
const poster = "src/assets/media/demo/poster.jpg";
mkdirSync(path.dirname(poster), { recursive: true });
const run = (a) => execFileSync(ffmpeg, ["-v", "error", "-y", ...a], { stdio: "inherit" });

run(["-ss", String(start), "-i", video, "-t", String(end - start), "-vf", "scale=640:360,fps=30",
  "-c:v", "libx264", "-crf", "30", "-force_key_frames", excerptIntervals.map((i) => i.start.toFixed(3)).join(","), "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", mp4]);
const size = statSync(mp4).size;
if (size > MAX_BYTES) fail(`${mp4} is ${(size / 1048576).toFixed(2)} MB, over 3 MB: shorten the excerpt or raise -crf`);

// Poster: a frame in the middle of the first segment, so it shows play.
const first = excerptIntervals[0];
run(["-ss", String(start + (first.start + first.end) / 2), "-i", video, "-frames:v", "1", "-vf", "scale=640:360", "-q:v", "3", poster]);

writeFileSync("src/data/demo-project.json", `${JSON.stringify(out, null, 2)}\n`);
console.log(`demo media ready: ${intervals.length} segments (${excerptIntervals.length} in the excerpt), ${mp4} ${(size / 1048576).toFixed(2)} MB`);
