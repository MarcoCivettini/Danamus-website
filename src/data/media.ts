/**
 * Media manifest: every screenshot and recording shown on the site.
 * Pages reference media only by `id`. To replace a capture, overwrite its file
 * (same name) or change `file`, then update `capturedAt`, size and `footage`.
 *
 * Stills live in src/assets/media/ (optimized at build time).
 * Clips live in public/media/ (pre-encoded H.264, see README) with a poster still.
 */
import fs from "node:fs";
import path from "node:path";
import type { ImageMetadata } from "astro";
import { z } from "zod";

const Footage = z.object({
  /** Where the match footage visible in the capture comes from. */
  source: z.string().min(1),
  /** True only when the footage may be shown publicly. */
  cleared: z.boolean(),
});

const Base = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  platform: z.enum(["macos", "windows", "ios"]),
  /** How the platform was captured (e.g. Windows UI rendered in a browser on the Mac). */
  captureSource: z.string().min(1),
  screen: z.string().min(1),
  alt: z.string().min(8),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  capturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  footage: Footage,
});

const Still = Base.extend({
  kind: z.literal("still"),
  /** Path relative to src/assets/media/. */
  file: z.string(),
});

const Clip = Base.extend({
  kind: z.literal("clip"),
  /** Path relative to public/media/. */
  file: z.string().endsWith(".mp4"),
  /** Id of the still used as poster. */
  poster: z.string(),
  durationSeconds: z.number().max(15),
});

const Entry = z.discriminatedUnion("kind", [Still, Clip]);
export type MediaEntry = z.infer<typeof Entry>;
export type StillEntry = z.infer<typeof Still>;
export type ClipEntry = z.infer<typeof Clip>;

const ITTF = { source: "ITTF broadcast — Kim Kum Yong match (sample)", cleared: false };
const MAC = "Danamus desktop app on macOS (Mac.station)";
const IOS = "Danamus iOS app in the iOS Simulator (Mac.station)";
const WIN = "Danamus frontend in Chromium on the Mac, Windows-style title bar (platform `other`)";
const TBD = "2026-11-12"; // replaced with the real capture date when the files arrive

const raw = [
  { kind: "still", id: "macos-picker", platform: "macos", captureSource: MAC, screen: "video picker",
    file: "macos/picker.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Mac: la schermata per scegliere il video della partita da analizzare." },
  { kind: "still", id: "macos-area", platform: "macos", captureSource: MAC, screen: "playing area",
    file: "macos/area.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Mac: l'area di gioco segnata sul tavolo nel fotogramma della partita." },
  { kind: "still", id: "macos-analysis", platform: "macos", captureSource: MAC, screen: "analysis in progress",
    file: "macos/analysis.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Mac: l'analisi automatica della partita in corso, con la percentuale di avanzamento." },
  { kind: "still", id: "macos-editor", platform: "macos", captureSource: MAC, screen: "editor",
    file: "macos/editor.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Mac: l'editor con l'anteprima del video, la timeline e l'elenco degli scambi trovati." },
  { kind: "still", id: "macos-export", platform: "macos", captureSource: MAC, screen: "export",
    file: "macos/export.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Mac: la finestra di esportazione del video montato." },
  { kind: "still", id: "ios-editor", platform: "ios", captureSource: IOS, screen: "editor",
    file: "ios/editor.png", width: 1206, height: 2622, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su iPhone: l'editor con la timeline touch e gli scambi della partita." },
  { kind: "still", id: "ios-projects", platform: "ios", captureSource: IOS, screen: "project list",
    file: "ios/projects.png", width: 1206, height: 2622, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su iPhone: l'elenco dei progetti analizzati." },
  { kind: "still", id: "windows-editor", platform: "windows", captureSource: WIN, screen: "editor",
    file: "windows/editor.png", width: 2880, height: 1800, capturedAt: TBD, footage: ITTF,
    alt: "Danamus su Windows: l'editor con la barra del titolo in stile Windows." },
  { kind: "clip", id: "clip-analysis", platform: "macos", captureSource: MAC, screen: "analysis in progress",
    file: "analysis.mp4", poster: "macos-analysis", durationSeconds: 10, width: 1440, height: 900,
    capturedAt: TBD, footage: ITTF,
    alt: "Video: Danamus analizza la partita e trova gli scambi uno dopo l'altro." },
  { kind: "clip", id: "clip-editing", platform: "macos", captureSource: MAC, screen: "editor",
    file: "editing.mp4", poster: "macos-editor", durationSeconds: 12, width: 1440, height: 900,
    capturedAt: TBD, footage: ITTF,
    alt: "Video: nell'editor di Danamus si accorcia uno scambio trascinandone il bordo sulla timeline." },
] as const;

export const media: MediaEntry[] = z.array(Entry).parse(raw);

/** Ids the page needs; the build fails if any is missing or has no file. */
export const requiredMedia = [
  "macos-picker", "macos-area", "macos-analysis", "macos-editor", "macos-export",
  "ios-editor", "ios-projects", "windows-editor", "clip-analysis", "clip-editing",
] as const;
export type MediaId = (typeof requiredMedia)[number];

const stills = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/media/**/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

let validated = false;

/** Throws a single error listing every missing or inconsistent media entry. */
export function validateMedia(): void {
  if (validated) return;
  const problems: string[] = [];
  const ids = new Set(media.map((m) => m.id));
  if (ids.size !== media.length) problems.push("duplicate ids in the manifest");
  for (const id of requiredMedia) if (!ids.has(id)) problems.push(`${id}: not in the manifest`);

  for (const m of media) {
    if (m.kind === "still") {
      const img = stills[`../assets/media/${m.file}`]?.default;
      if (!img) {
        problems.push(`${m.id}: missing file src/assets/media/${m.file}`);
      } else if (img.width !== m.width || img.height !== m.height) {
        problems.push(`${m.id}: file is ${img.width}x${img.height}, manifest says ${m.width}x${m.height}`);
      }
    } else {
      const file = path.join(process.cwd(), "public/media", m.file);
      if (!fs.existsSync(file)) problems.push(`${m.id}: missing file public/media/${m.file}`);
      const poster = media.find((p) => p.id === m.poster);
      if (!poster || poster.kind !== "still") problems.push(`${m.id}: poster "${m.poster}" is not a still`);
    }
  }
  if (problems.length) {
    throw new Error(`Media manifest check failed:\n  - ${problems.join("\n  - ")}`);
  }
  validated = true;
}

export function getStill(id: MediaId): StillEntry & { image: ImageMetadata } {
  validateMedia();
  const m = media.find((e) => e.id === id);
  if (!m || m.kind !== "still") throw new Error(`Media "${id}" is not a still`);
  return { ...m, image: stills[`../assets/media/${m.file}`]!.default };
}

export function getClip(id: MediaId): ClipEntry & { posterStill: StillEntry & { image: ImageMetadata } } {
  validateMedia();
  const m = media.find((e) => e.id === id);
  if (!m || m.kind !== "clip") throw new Error(`Media "${id}" is not a clip`);
  return { ...m, posterStill: getStill(m.poster as MediaId) };
}
