# Design

## Context

The motion layer today is `src/scripts/motion.ts` (IntersectionObserver reveals, lazy clips, walkthrough step tracking) plus CSS in `global.css` gated by `html.motion-ok`. The `landing-page` design ruled out animation libraries to save JS. This change reverses that decision (see proposal.md, Why). The progressive-enhancement contract stays: the inline script in `Base.astro` adds `motion-ok` only without reduced motion, and a 3 s safety net removes it if `window.__motionReady` is never set.

Captures: the iOS app (`com.danamus.app`) is installed on the booted iPhone 13 simulator. The app repo `~/Documents/progetti/Danamus` has a release bundle from 7 Nov that predates `5517d29`, and `src-tauri/target/release/ffmpeg` (ffmpeg 9.0 with libx264) can encode the clips, so Homebrew is not needed.

## Goals / Non-Goals

**Goals:**
- One motion system: Lenis for scrolling, with GSAP + ScrollTrigger + SplitText for everything else, all on one ticker.
- The same look in Safari, Chrome and Firefox, without depending on `animation-timeline`.
- Clean, reproducible captures, with commands recorded in the README.

**Non-Goals:**
- No new macOS captures in this change (deferred by the user); only the recorder script is added.
- No React, no React Bits package: effects are ported, not imported.
- No changes to texts, section order or layout.
- No Windows capture (it stays a placeholder).

## Decisions

### Lenis on the GSAP ticker
`new Lenis({ autoRaf: false, anchors: true })`, `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. This gives one rAF loop and keeps ScrollTrigger positions exact, following the pattern of the `cinematic-gsap-lenis-motion-system` and `gsap-scrolltrigger` skills. Lenis leaves touch scrolling native by default (`syncTouch: false`), which satisfies the touch scenario. Anchor clicks go through Lenis `anchors`, and on `complete` focus moves to the target (`tabindex="-1"` when needed).
Alternative considered: GSAP ScrollSmoother. It needs a wrapper/content DOM restructure and transforms the whole page, which breaks the `position: sticky` walkthrough and the fixed nav. Lenis scrolls the real document, so sticky positioning keeps working.

### Reveals with GSAP, initial state still from CSS
Elements keep `data-reveal`. CSS keeps `opacity: 0` under `html.motion-ok`, so there is no flash before JS runs. GSAP then animates with `ScrollTrigger.batch("[data-reveal]", { start: "top 85%", once: true })` and a stagger of 0.08 s, `power3.out`, 0.9 s, using translate and blur matching the current tokens. Headlines get `data-split`: `SplitText.create(el, { type: "words", mask: "words", aria: "auto" })` reveals words with a stagger of 0.05 s. This ports React Bits "Split Text" plus "Blur Text". `aria: "auto"` keeps the heading readable as a single text. Split runs after `document.fonts.ready` so Inter metrics are final (no CLS). The hero is the exception (see below).

### Motion off the critical path, hero intro in CSS
Measured during implementation: with GSAP + Lenis (about 53 KB gzip) in the page's entry module, Lighthouse mobile went from LCP 2.4 s and FCP 1.2 s to LCP 3.1–3.2 s, which is over budget. So:
- `src/scripts/boot.ts` (about 1 KB) is the only entry script. It dynamically imports `motion.ts` on the first interaction (wheel, touch, pointer, key, scroll) or 1.2 s after `load`, whichever comes first.
- The hero no longer waits for JS. Its headline is split into words at build time in `Hero.astro` (a static port of SplitText), and the eyebrow, headline words, lead and CTA rise with CSS keyframes gated by `html.motion-ok`. Below-the-fold headlines still use SplitText.
- Result: performance 98, LCP 2.3 s, CLS ≤ 0.002 over four runs. If the module arrives after the 3 s safety net, the page simply stays static, as the spec allows.

### Scroll-linked effects
- Hero phone: `gsap.fromTo` from `rotateX 14°, scale .9, opacity .5` to the final state with `scrub: 1`, `start: "top bottom"`, `end: "top 35%"`. The CSS `@supports (animation-timeline)` block is removed.
- Parallax: `[data-parallax]` frames move `yPercent: -6` with `scrub: 1.2`, within the 10% spec limit.
- Walkthrough: the existing step detection becomes ScrollTrigger (`onToggle` per step, `start: "top center"`). The media cross-fade becomes a short GSAP tween (opacity + scale .98 → 1 + blur), and a thin progress bar beside the sticky frame uses `scaleY` scrubbed over the walkthrough. Under 1024px (stacked layout) only reveals run.

### Spotlight cards
Platform cards get `data-spotlight`: a CSS radial-gradient driven by `--mx/--my` custom properties, updated with `gsap.quickSetter` on `pointermove`, only under `matchMedia("(hover: hover) and (pointer: fine)")`. This ports React Bits "Spotlight Card". It uses the accent `#00c573` at about 12% alpha.

### Everything inside `gsap.matchMedia()`
All motion is registered inside `mm.add("(prefers-reduced-motion: no-preference)", …)`. With reduced motion nothing is created, Lenis is not started and CSS leaves content visible. `window.__motionReady` is set only after setup succeeds, so the existing safety net covers failures.

### Desktop window recording without notifications
macOS `screencapture -v` records the whole display, so notifications would be visible. Instead, a small Swift script (`scripts/capture/record-window.swift`, run with `swift`) uses ScreenCaptureKit with `SCContentFilter(desktopIndependentWindow:)` on the Danamus window and writes an HEVC/H.264 `.mov` at 2x. Only that window's pixels are captured, so banners and other apps cannot appear. Stills use `screencapture -o -l<windowid>`, which also captures only the window. The app is driven during the recording through desktop control (computer-use) by the agent.
Alternative considered: turning on Do Not Disturb. That changes the user's system settings and still would not hide other windows, so it was rejected.

### iOS clips
`xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --batteryState charged --cellularBars 4 --wifiBars 3`, then `xcrun simctl io booted recordVideo --codec h264`. This records the simulated screen only, so Mac notifications never appear and simulator notifications are not triggered. Encoding follows the README ffmpeg command using the app's bundled ffmpeg.

### Production desktop build
Run `pnpm tauri build` in the app repo at `5517d29` (or later). Captures come from `target/release/bundle/macos/danamus.app` on the built-in Retina display. The window is sized so that the content is 1440×900 points, which gives 2880×1800 pixels.

## Risks / Trade-offs

- [JS weight grows by about 45 KB gzip] → The module is deferred and not render-blocking. LCP is the hero poster, which is unaffected. Lighthouse is checked against the existing budget.
- [Smooth scroll feels "floaty" or fights trackpads] → Use `lerp: 0.1`, wheel only, native touch, and the user reviews by hand.
- [SplitText changes line wraps → CLS] → Split after fonts load, use the `mask` wrapper with `overflow: clip`, and measure CLS in Lighthouse.
- [ScreenCaptureKit needs Screen Recording permission for the process running the script] → If it is denied, macOS shows its prompt and the user grants it. Nothing is changed silently.
- [A release build of the app takes long (Rust + Next build)] → Run it in the background while the motion work proceeds.
- [The match footage in recordings is ITTF/WTT] → Same footage and same `cleared: true` decision as the current captures.
