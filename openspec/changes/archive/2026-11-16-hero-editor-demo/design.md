# Design

## Context

See proposal.md (Why). Current state, from the code and the data:

- **Hero.** The phone frame holds `Clip id="clip-preview"` (the app's preview recording, 720×1558). It has `data-scroll-zoom`: tilt 14°, scale 0.9 and opacity 0.55, which straighten on scroll. Its poster is the LCP element.
- **Timeline.** `Timeline.astro` draws 30 illustrative rallies. `setupTimeline()` in `motion.ts` scrubs `flexGrow` and the track width between `top 75%` and `center 35%`.
- **Spotlight.** `setupSpotlight()` sets `--mx`, `--my` and `--spot` on `[data-spotlight]`, which today is only the composite in `Platforms.astro`.
- **Curated project.** In the app's database (`~/Library/Application Support/com.danamus.app/danamus.db`, SQLite), the table `projects` has `name = "KIM KUM YONG vs CHRISTINA KALLBERG"`, `id cdddbcdf-…` and `video_path` pointing to `~/Documents/Video/ITTF WTT … KALLBERG_720p.mp4`. The table `project_edits.intervals_json` holds 19 intervals `{start, end}` in seconds. Source: 427.3 s, 1280×720, 30 fps. Play: 104.5 s (24.4%).
- **Tools.** macOS has `/usr/bin/sqlite3`. ffmpeg and ffprobe are in `../Danamus/src-tauri/binaries/` (the README already points to the app's ffmpeg). A test encode of 140 s at 640×360, CRF 30, came to 1.86 MB.

## Goals / Non-Goals

**Goals:**
- The demo feels like the real app and is fully explorable.
- It remains a static site: no backend, no third-party requests.
- The demo data can be regenerated with one command when the user changes the project.

**Non-Goals:**
- Simulating editing, export or the app's other screens.
- Re-recording `macos-editor.mp4` with the new project. That needs the app running; it can be done later following the README.
- Shipping the full match: an excerpt is enough.

## Decisions

### 1. Data script: `scripts/make-demo-media.mjs`

- It reads the project by name from the database with `sqlite3 -readonly` and gets `video_path` and `intervals_json`. The database path, project name, excerpt range and ffmpeg path are overridable with flags.
- It writes `src/data/demo-project.json`:
  - `project`, `match` (display name), `source` (file name only, not the full path);
  - `duration` (from ffprobe);
  - `intervals` (all 19, for the problem timeline);
  - `excerpt: { start: 0, end: 140 }`;
  - `excerptIntervals` (the intervals that fall within the excerpt, clipped to it);
  - `generatedAt`.
- It encodes `public/media/demo-match.mp4`: `-ss 0 -t 140`, `scale=640:360,fps=30`, libx264 CRF 30, preset slow, `yuv420p`, `-an`, `+faststart`. It fails if the result is over 3 MB.
- It extracts the poster `src/assets/media/demo/poster.jpg` at 640×360, from a frame inside the first segment, so it shows play and not a pause.
- It adds `pnpm make:demo` to package.json. The script is not part of the build: the JSON and the media are committed. The build doesn't depend on the Mac or on the app.

*Alternative considered:* the user exports the intervals by hand. Rejected, because it can't be repeated and is easy to get wrong.

*Excerpt choice:* 0–140 s holds 7 segments (38.3 s of play, 27%). That's enough to explore pause and play, at about 1.9 MB.

### 2. Fake editor: `EditorDemo.astro`

**Layout.** It copies the app's mobile editor screen (`ios-editor`), from top to bottom:
- status bar 9:41;
- header with the project name and "Oggi · Pronto";
- 16:9 video with an overlay of play/pause, the counter `00:14 / 02:20` and the seek bar;
- a toolbar with undo/redo/+ and the green "Esporta" button;
- an info row with the precise time and "Segmento N di M";
- the timeline;
- the bottom actions (Inizia qui, Finisci qui, Dividi, Elimina).

**Scale without JS.** The screen has `container-type: inline-size`, and the demo's root uses `font-size: calc(100cqw / 39)`. Every size is in `em`, designed on a 390 px wide screen, so the whole interface scales with the frame and needs no ResizeObserver.

**Timeline like the app's.** The playhead stays fixed in the centre, and a track 30 s wide scrolls under it with `translateX`. It has the green segments and a ruler with marks every 10 s.

**Inert controls.**
- Real `button` elements with `aria-disabled="true"` and `tabindex="-1"`, and no listeners.
- `inert` on the bottom actions and on the toolbar except the play button.
- The demo contains no links.

**Interaction** (a small vanilla script, loaded with the motion script but independent of `motion-ok` for the basic controls):
- **Play/pause:** a `button` with `aria-pressed`.
- **Timeline:** `role="slider"`, with `aria-valuemin/max/now` and an `aria-valuetext` like "0:14 di 2:20, segmento 1 di 7".
  - Arrow keys move ±2 s, PageUp/PageDown ±10 s, Home/End to the ends.
  - Drag uses Pointer Events: `setPointerCapture` and `touch-action: pan-y`, so vertical swipes scroll the page. During the drag the video pauses, then stays paused; the visitor decides whether to resume.
- **Seek bar:** click and drag, same logic.
- **Updates:** one `requestAnimationFrame` loop while the video plays updates the playhead, the counters and the highlight of the current segment. Seeking updates everything immediately.

**Autoplay and loading.**
- The video has `preload="none"` and no `src` until `load` fires plus `requestIdleCallback`.
- Then, if motion is allowed, it sets `src`, `muted`, `loop` and `playsinline`, and plays when the hero is visible (IntersectionObserver). It pauses when the hero leaves the view, and doesn't resume on its own if the visitor paused it.
- With reduced motion, `src` is set only when play is pressed.

**No JS.** The poster `<img>` in the video area and the segments rendered in the HTML of the track, positioned at the start, are enough to show "the editor with the green segments". The controls are hidden (`html.no-js`).

**Hero.** The `data-scroll-zoom` effect stays, but it starts from opacity 1, tilt 8° and scale 0.94, so the demo is immediately readable and usable. The spec scenario "Hero device on scroll" stays true.

*Alternatives considered:*
- A real `<video controls>`: it doesn't look like the app and doesn't show the segments.
- A canvas: no fallback without JS, and harder to make accessible.

### 3. Problem timeline: a sequence on entry, with real data

- **Data:** `Timeline.astro` takes rallies and pauses from `demo-project.json.intervals` and `duration`, including the leading and trailing pause. That's 19 rallies, so on mobile there's no need to thin them out (the `wide-only` class is removed).
- **Static labels and caption:**
  - "La registrazione · 7:07" and "Solo il gioco · 1:45";
  - caption: "Una partita vera: Kim Kum Yong contro Christina Kallberg, WTT Finals Doha 2025. Il gioco è circa un quarto del video, come nella partita tipica."
- **Sequence** (GSAP timeline, `paused`, started by a ScrollTrigger `once` at `top 70%`), about 3.8 s:
  1. 0–1.4 s: a white playhead sweeps the bar. Each rally lights up as it passes.
  2. 1.4–1.8 s: the pauses go from grey to transparent with a dashed outline ("these get removed").
  3. 1.8–3.0 s: `flexGrow` of the pauses goes to 0. The track shrinks to the play share, left-aligned. A ghost element (dashed outline at 100% width) stays still behind it.
  4. 2.4–3.4 s: the counter goes from 7:07 to 1:45. In the freed-up area of the ghost, the label "−5:22 di pause" appears.
  5. At the end, the "Rivedi" button appears (`hidden` until then). It restarts the timeline from zero with `tl.restart()`.
- **Static (reduced motion, no JS):** the current two bars, with real data. The ghost and "Rivedi" are not shown.

*Alternative considered:* a scrub with `pin`. Rejected, because the spec forbids locked sections. A scrub without pin, as now, is too short to understand: that's the user's feedback.

### 4. Site-wide pointer glow

- **Element:** one `<div class="cursor-glow" aria-hidden="true">` in `Base.astro`, at the start of `body`:
  - `position: fixed`, `top/left: 0`, 720×720 px;
  - `radial-gradient(circle, rgb(0 197 115 / 0.16), transparent 65%)` and `filter: blur(40px)`;
  - `pointer-events: none`, `z-index: -1`, `opacity: 0` by default.
- **Behind the content:** `z-index: -1` in the root stacking context paints above the `html` background and below the content. `main`, `section` and `footer` must not create opaque stacking contexts above it. `.band` becomes `background: color-mix(in oklch, var(--surface) 70%, transparent)` with the hairline, so the glow shows through it. The cards (`--surface-2`) stay opaque and cover it, which is fine.
- **Motion:** in `motion.ts`, inside `matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)")`:
  - `gsap.quickTo` on `x` and `y` (duration 0.6, ease `power3.out`), centred on the pointer;
  - opacity 1 on the first `pointermove`, 0 on `pointerleave` of the document.
- **Removed:** `setupSpotlight()`, `data-spotlight` and the `.combo::before` style.
- **Contrast:** 16% accent on `#0f0f0f` gives about `#0f2a1f`. The `--soft` text (`#b4b4b4`) is above 7:1, and `--muted` (`#898989`) is above 4.5:1. To be checked with the computed colours.

### 5. Manifest and requirements

- **New entries in `media.ts`:** a `demo-poster` still and a `demo-match` clip (platform `ios`, with a `captureSource` that says "excerpt of the source video used in the project …, rendered in the site's demo UI"). The `footage` is `ITTF`, updated with "excerpt 0–140 s".
- **`requiredMedia`:** `clip-preview` and `poster-preview` are replaced by `demo-match` and `demo-poster`.
- **Build failure:** `demo-project.json` is imported statically, so if it's missing the build fails and names the file.
- The rights check (`check:media-rights`) covers the new entries automatically.

## Risks / Trade-offs

- **Autoplay blocked** (iOS in Low Power Mode, browser settings) → `play()` is in a try/catch. On failure the play button stays visible and the counter shows the start. The demo still works by hand.
- **Drag conflicts with Lenis or page scrolling** → `data-lenis-prevent-horizontal` on the timeline, plus `touch-action: pan-y`. Test on desktop with the mouse wheel over the demo: it must scroll the page.
- **Video weight on mobile data** → about 1.9 MB loaded only after `load` and on idle. If it's a problem, a 480×270 version for screens below 640 px, to decide after measuring.
- **The demo's UI drifts from the real app** as the app evolves → the components are isolated in one file, and `ios-editor.png` stays in the repo as the reference.
- **Rights to the excerpt** → it's the same ITTF/WTT broadcast already marked `cleared`, but longer. The user confirms before publishing.

## Migration Plan

No data migration. To roll back, revert the commit. `preview.mp4` and `clip-preview` stay in the repo and in the manifest.

## Open Questions

- Whether to re-record `macos-editor.mp4` on the new project, so the two devices show the same match. To do with the app, outside this change.
