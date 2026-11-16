# Tasks

## 0. Precondition

- [x] 0.1 Archive `landing-visual-rhythm` (with spec sync) and confirm that `openspec/specs/landing-page/spec.md` contains "The problem section shows the dead time as a timeline" (`grep`)

## 1. Data and media from the curated project

- [x] 1.1 Write `scripts/make-demo-media.mjs` (read-only `sqlite3`, ffprobe and ffmpeg from the app bundle or PATH, flags for db, project, range and ffmpeg) and the `make:demo` script in package.json; verify that `pnpm make:demo` produces `src/data/demo-project.json` with 19 `intervals` and 7 `excerptIntervals`, and that the `md5` of `danamus.db` is unchanged before and after
- [x] 1.2 Verify that `public/media/demo-match.mp4` has no audio track and is ≤ 3 MB (ffprobe and `ls -l`), and that `src/assets/media/demo/poster.jpg` shows a frame of play
- [x] 1.3 Add `demo-poster` and `demo-match` to `src/data/media.ts` (footage ITTF with the excerpt range) and replace `clip-preview`/`poster-preview` in `requiredMedia`; verify that `pnpm build` and `pnpm check:media-rights` pass, and that temporarily renaming `demo-project.json` makes the build fail with the file name
- [x] 1.4 Document `pnpm make:demo` in the README (what it reads, what it writes, when to re-run it); verify that the documented command matches package.json

## 2. Fake editor in the hero

- [x] 2.1 Create `src/components/EditorDemo.astro` with the static layout of the app's mobile editor (em units on `100cqw / 39`, segments in the HTML, poster as `img`); verify with JS disabled at 1440 and 390 px that the screen looks like `ios-editor.png`, scales with the frame and shows the green segments
- [x] 2.2 Add the demo script: play/pause, rAF loop, fixed-playhead timeline with a scrolling track, seek bar, "Segmento N di M" counter and segment highlight; verify in headless Chrome that after a seek to the start of each `excerptInterval` the counter shows the right segment and the video `currentTime` matches within 1/30 s
- [x] 2.3 Add drag (Pointer Events, pause during the drag, `touch-action: pan-y`, `data-lenis-prevent-horizontal`) and keyboard (slider with arrows, PageUp/PageDown, Home/End, `aria-valuetext`); verify by dragging with the mouse, using the keys, and with a vertical wheel over the demo that scrolls the page
- [x] 2.4 Make the app controls inert (Esporta, undo/redo, +, segment actions: `aria-disabled`, `tabindex="-1"`, `inert`, no listeners); verify that clicking them changes no state and fires no requests, and that the demo contains no `<a>`
- [x] 2.5 Lazy loading and autoplay (src after `load` and idle, IntersectionObserver, no auto-resume after a manual pause, no autoplay with reduced motion); verify in the network log that `demo-match.mp4` is requested after `load`, and with `prefers-reduced-motion: reduce` only after play
- [x] 2.6 Replace `Clip id="clip-preview"` in `Hero.astro` with `EditorDemo` and soften `data-scroll-zoom` for the hero (opacity 1, 8°, 0.94); verify the first screen at 1440x900 (top of the demo visible) and 390x844 (headline and CTA visible)

## 2b. Feedback round (16 Nov)

- [x] 2b.1 Playback jumps between segments (end of segment → next, play from a pause → next, last → first) and the excerpt is re-encoded with a keyframe every second for quick seeks; verify in headless Chrome that during 20 s of playback `currentTime` is never inside a pause for more than 0.1 s and that the counter goes through consecutive segments
- [x] 2b.2 Preview build: body transparent instead of opaque, so the glow shows on claude.ai too; verify in `dist-preview/index.html` that the injected rule is `background:transparent`

- [x] 2b.3 Re-record `macos-editor.mp4` with the production build on the curated project, in a temporary library holding only that project (original library backed up and restored); verify that the clip shows the 19 segments of the project, that no other project name is visible, and that the original library has its 13 projects back

## 3. Problem timeline: sequence and real data

- [x] 3.1 Rewrite `Timeline.astro` on `demo-project.json` (19 rallies, real pauses, labels 7:07 and 1:45, caption with the match, ghost, "Rivedi" button `hidden`), removing the `wide-only` class; verify without JS that the two bars show the real durations and that the screen reader text names match, video and play
- [x] 3.2 Replace the scrub in `setupTimeline()` with the sequence in design decision 3 (ScrollTrigger `once`, playhead, pauses fading, compression, ghost, counter, "Rivedi" with `restart`); verify in headless Chrome that within 4 s of entry the track is about 24% wide, the label reads "1:45", "Rivedi" is visible, and that clicking it brings the track back to 100% and replays the sequence
- [x] 3.3 Verify with `prefers-reduced-motion: reduce` that the timeline is static, with both bars, no ghost and no "Rivedi"

## 4. Site-wide pointer glow

- [x] 4.1 Add `.cursor-glow` to `Base.astro` and its styles to `global.css`, and make `.band` translucent; verify that the element is `aria-hidden`, has `pointer-events: none`, and that the Nav and footer links still respond with the pointer over the glow
- [x] 4.2 Add the glow to `motion.ts` (hover, fine pointer and motion only, `quickTo`, opacity on enter and leave) and remove `setupSpotlight()`, `data-spotlight` and `.combo::before`; verify on all 4 pages (1440 px) that moving the mouse moves the glow, that it shows through the bands, and with `hasTouch` / without hover that it is not shown (`grep -rn spotlight src/` returns nothing)
- [x] 4.3 Measure the contrast of `--soft` and `--muted` over the glow at full intensity (computed colours); verify that both are ≥ 4.5:1

## 5. Integration checks

- [x] 5.1 No cookies, no storage, no third-party requests and no horizontal overflow at 390 px on all 4 pages; no console errors
- [x] 5.2 Device frames on the landing page ≤ 3, only in `#top` and `#piattaforme`
- [x] 5.3 Lighthouse mobile on the landing page, repeated: Performance ≥ 95, CLS < 0.1, LCP on the demo poster and not on the video
- [x] 5.4 Publish the private preview (`pnpm build:preview`, including `demo-match.mp4`) to the existing artifact and share the link

## Workflow follow-up

- The user verifies the preview by hand, confirms the rights to the 140 s excerpt, and then archives with `/opsx:archive`.
- Security review per CLAUDE.md before any push.
