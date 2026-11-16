# Proposal

## Why

The landing page works, but its motion is minimal: CSS fades, one scroll-zoom that only runs where `animation-timeline` is supported (not Safari), and native scrolling. The site needs to feel as polished as the product. The desktop captures are also weak: the macOS screenshot is a 1x dev build cropped above the dev indicator, there is no desktop recording at all, and the iOS clips need re-recording with a clean status bar and no notifications.

## What Changes

- Add Lenis smooth scrolling, driven by the GSAP ticker so that ScrollTrigger stays in sync with it. In-page anchor links (nav, "Vai al contenuto") scroll smoothly and still move focus.
- Replace the CSS/IntersectionObserver reveal layer with GSAP + ScrollTrigger:
  - Headlines reveal word by word (SplitText). This is a port of the React Bits "Split Text" / "Blur Text" effects to vanilla GSAP, with no React.
  - Groups (benefit lists, platform cards) reveal with a stagger.
  - The hero phone straightens and scales on scroll (scrub) in every browser, replacing the CSS-only `view()` effect.
  - The walkthrough frame cross-fades between steps with a GSAP timeline, and a progress indicator follows scroll.
  - There is subtle parallax on device frames.
  - Platform cards get a pointer spotlight (port of the React Bits "Spotlight Card"), on hover devices only.
- Keep the progressive-enhancement contract: content is visible without JavaScript, with reduced motion nothing moves on scroll and smooth scrolling is off, and a safety net shows everything if the motion script fails.
- Re-record the three iOS clips (analysis, editing, preview) in the iOS Simulator with a status-bar override (9:41, full battery), capturing only the simulator screen so no notification can appear.
- Add a window-only recorder (`scripts/capture/record-window.swift`, ScreenCaptureKit) for future desktop captures, so system notifications and other apps are never recorded. The macOS captures themselves (2x home still, editor recording) are deferred to a later change by the user's decision of 14 Nov 2026.
- Update the media manifest (sizes, dates, capture source) and the README capture notes.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `site-visual-identity`: the motion requirement changes to allow smooth scrolling, scroll-scrubbed and word-level text reveals, parallax and a pointer spotlight. The reduced-motion and no-JS requirement now also covers smooth scrolling and pointer effects.
- `product-media`: adds a capture-hygiene requirement (clean iOS status bar, window-only desktop capture, no notifications).

## Impact

- Code: `src/scripts/motion.ts` (rewritten), `src/styles/global.css` (motion section), section components (data attributes only), `src/data/media.ts`, README.
- Dependencies: `gsap` (includes ScrollTrigger and SplitText, free since 3.13) and `lenis`. Both are bundled by Astro and served from the site's own origin, so there is no runtime CDN. The measured cost is about 53 KB gzip of JS, loaded as a deferred module.
- Media: `public/media/*.mp4`, `src/assets/media/ios/posters/*`.
- Performance budget unchanged: Lighthouse mobile ≥ 90, LCP < 2.5 s, CLS < 0.1.
- The captures need the Danamus app repo (`~/Documents/progetti/Danamus`, commit `5517d29` or later), the booted iPhone 13 simulator with the app installed, and the ffmpeg binary already in the app's `src-tauri/target/release/`.
