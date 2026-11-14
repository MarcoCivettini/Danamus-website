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
  /** True while the file is a labelled stand-in (scripts/make-placeholders.mjs). */
  placeholder: z.boolean().default(false),
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

// Footage cleared for public use by the site owner's decision (12 Nov 2026).
const ITTF = { source: "ITTF/WTT broadcast, Doha 2025 (Kim Kum Yong match, 2-minute clip)", cleared: true };
const NOFOOTAGE = { source: "none (no match frame visible)", cleared: true };
const NONE = { source: "none (placeholder)", cleared: true };
const MAC = "Danamus 0.1.0 (5517d29) desktop dev build on macOS, 1x window capture, cropped above the dev indicator";
const IOS = "Danamus 0.1.0 (5517d29) iOS release build, iPhone 13 simulator, status bar 9:41";
const IOS_REC = "Danamus 0.1.0 (5517d29) iOS release build, iPhone 13 simulator, status bar override 9:41/full battery, simctl recordVideo (simulated screen only)";
const WIN = "Danamus frontend in Chromium on the Mac, Windows-style title bar (platform `other`)";
const SHOT = "2026-11-12";
const CLIPS = "2026-11-14";

const raw = [
  { kind: "still", id: "ios-picker", platform: "ios", captureSource: IOS, screen: "video picker",
    file: "ios/picker.png", width: 1170, height: 2532, capturedAt: SHOT, footage: NOFOOTAGE,
    alt: "Danamus su iPhone: la schermata Scegli il video della partita, mentre il modello si prepara sul dispositivo." },
  { kind: "still", id: "ios-area", platform: "ios", captureSource: IOS, screen: "playing area",
    file: "ios/area.png", width: 1170, height: 2532, capturedAt: SHOT, footage: ITTF,
    alt: "Danamus su iPhone: il rettangolo dell'area di gioco attorno al tavolo, con i pulsanti Cambia video e Analizza." },
  { kind: "still", id: "ios-analysis", platform: "ios", captureSource: IOS, screen: "analysis in progress",
    file: "ios/analysis.png", width: 1170, height: 2532, capturedAt: SHOT, footage: NOFOOTAGE,
    alt: "Danamus su iPhone: analisi in corso all'11%, circa 4 minuti rimanenti." },
  { kind: "still", id: "ios-editor", platform: "ios", captureSource: IOS, screen: "editor",
    file: "ios/editor.png", width: 1170, height: 2532, capturedAt: SHOT, footage: ITTF,
    alt: "Danamus su iPhone: l'editor con il video della partita, la timeline e il segmento 1 di 11." },
  { kind: "still", id: "ios-export", platform: "ios", captureSource: IOS, screen: "export completed",
    file: "ios/export.png", width: 1170, height: 2532, capturedAt: SHOT, footage: ITTF,
    alt: "Danamus su iPhone: esportazione completata, video salvato nel Rullino." },
  { kind: "still", id: "ios-projects", platform: "ios", captureSource: IOS, screen: "project list",
    file: "ios/projects.png", width: 1170, height: 2532, capturedAt: SHOT, footage: NOFOOTAGE,
    alt: "Danamus su iPhone: l'elenco dei progetti, con quello nuovo pronto in cima." },
  { kind: "still", id: "ios-log", platform: "ios", captureSource: IOS, screen: "analysis log",
    file: "ios/log.png", width: 1170, height: 2532, capturedAt: SHOT, footage: NOFOOTAGE,
    alt: "Danamus su iPhone: il log di analisi del modello YOLO eseguito sul dispositivo, con 11 scambi trovati." },
  { kind: "still", id: "ios-fullscreen", platform: "ios", captureSource: IOS, screen: "full-screen preview",
    file: "ios/fullscreen.png", width: 2532, height: 1170, capturedAt: SHOT, footage: ITTF,
    alt: "Danamus su iPhone: l'anteprima della partita a schermo intero." },
  { kind: "still", id: "macos-home", platform: "macos", captureSource: MAC, screen: "home with project list",
    file: "macos/home.png", width: 1280, height: 730, capturedAt: SHOT, footage: NOFOOTAGE,
    alt: "Danamus su Mac: la barra laterale con i progetti recenti e la schermata Scegli il video della partita." },
  { kind: "still", id: "windows-editor", platform: "windows", captureSource: WIN, screen: "editor",
    file: "windows/editor.png", width: 2880, height: 1800, capturedAt: SHOT, footage: NONE, placeholder: true,
    alt: "Danamus su Windows: l'editor con la barra del titolo in stile Windows." },
  { kind: "still", id: "poster-analysis", platform: "ios", captureSource: IOS_REC, screen: "analysis in progress",
    file: "ios/posters/analysis.png", width: 720, height: 1558, capturedAt: CLIPS, footage: NOFOOTAGE,
    alt: "Danamus su iPhone: l'analisi della partita appena partita, all'1 per cento." },
  { kind: "still", id: "poster-editing", platform: "ios", captureSource: IOS_REC, screen: "editor",
    file: "ios/posters/editing.png", width: 720, height: 1558, capturedAt: CLIPS, footage: ITTF,
    alt: "Danamus su iPhone: l'editor con la timeline dei segmenti." },
  { kind: "still", id: "poster-preview", platform: "ios", captureSource: IOS_REC, screen: "preview playback",
    file: "ios/posters/preview.png", width: 720, height: 1558, capturedAt: CLIPS, footage: ITTF,
    alt: "Danamus su iPhone: l'anteprima della partita montata." },
  { kind: "clip", id: "clip-analysis", platform: "ios", captureSource: IOS_REC, screen: "analysis in progress",
    file: "analysis.mp4", poster: "poster-analysis", durationSeconds: 12, width: 720, height: 1558,
    capturedAt: CLIPS, footage: NOFOOTAGE,
    alt: "Video: l'analisi della partita avanza sul telefono, dall'1 al 9 per cento." },
  { kind: "clip", id: "clip-editing", platform: "ios", captureSource: IOS_REC, screen: "editor",
    file: "editing.mp4", poster: "poster-editing", durationSeconds: 10, width: 720, height: 1558,
    capturedAt: CLIPS, footage: ITTF,
    alt: "Video: nell'editor si seleziona uno scambio sulla timeline e se ne allunga la fine." },
  { kind: "clip", id: "clip-preview", platform: "ios", captureSource: IOS_REC, screen: "preview playback",
    file: "preview.mp4", poster: "poster-preview", durationSeconds: 15, width: 720, height: 1558,
    capturedAt: CLIPS, footage: ITTF,
    alt: "Video: l'anteprima riproduce la partita saltando da uno scambio all'altro, senza i tempi morti." },
] as const;

export const media: MediaEntry[] = z.array(Entry).parse(raw);

/** Ids the page needs; the build fails if any is missing or has no file. */
export const requiredMedia = [
  "ios-picker", "ios-area", "ios-analysis", "ios-editor", "ios-export", "ios-projects", "ios-log",
  "ios-fullscreen", "macos-home", "windows-editor",
  "poster-analysis", "poster-editing", "poster-preview",
  "clip-analysis", "clip-editing", "clip-preview",
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

const altFor = (m: MediaEntry) => (m.placeholder ? `Segnaposto, in attesa della cattura reale. ${m.alt}` : m.alt);

export function getStill(id: MediaId): StillEntry & { image: ImageMetadata } {
  validateMedia();
  const m = media.find((e) => e.id === id);
  if (!m || m.kind !== "still") throw new Error(`Media "${id}" is not a still`);
  return { ...m, alt: altFor(m), image: stills[`../assets/media/${m.file}`]!.default };
}

export function getClip(id: MediaId): ClipEntry & { posterStill: StillEntry & { image: ImageMetadata } } {
  validateMedia();
  const m = media.find((e) => e.id === id);
  if (!m || m.kind !== "clip") throw new Error(`Media "${id}" is not a clip`);
  return { ...m, alt: altFor(m), posterStill: getStill(m.poster as MediaId) };
}
