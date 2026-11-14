# Tasks

## 1. Motion foundation

- [x] 1.1 Add `gsap` and `lenis` with pnpm (exact versions); verify `pnpm build` passes and the built JS loads only from the site origin
- [x] 1.2 Rewrite `src/scripts/motion.ts`: register ScrollTrigger and SplitText, start Lenis on the GSAP ticker inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, set `__motionReady` only after setup; verify in Playwright that wheel scrolling is smoothed and `window.__motionReady === true`
- [x] 1.3 Route in-page anchors through Lenis and move focus to the target; verify with the keyboard that "Vai al contenuto" and the nav links scroll and focus their targets

## 2. Effects

- [x] 2.1 Port reveals to `ScrollTrigger.batch` keeping the CSS initial state, and remove the IntersectionObserver reveal code; verify each section reveals once and content is visible at the end of a full scroll
- [x] 2.2 Add `data-split` word reveals to the hero and section headlines (SplitText with mask and aria) after `document.fonts.ready`; verify with Playwright that headings expose their full text to the accessibility tree
- [x] 2.3 Replace the CSS `view()` hero zoom with a scrubbed GSAP tween and add `data-parallax` to device frames (≤10%); verify in WebKit (Playwright) that the hero phone transforms with scroll
- [x] 2.4 Move walkthrough step detection to ScrollTrigger with a GSAP media cross-fade and a scrubbed progress bar (≥1024px only); verify the active step order 0-4 while scrolling at 1440px
- [x] 2.5 Add the spotlight effect to the platform cards for `(hover: hover) and (pointer: fine)` only; verify it follows the pointer at 1440px and is absent in the mobile emulation
- [x] 2.6 Keep lazy loading and autoplay of clips (`data-clip`) working with the new script; verify clip files are not requested before scrolling near them

## 3. iOS captures

- [x] 3.1 Override the simulator status bar (9:41, full battery and signal) and re-record the analysis, editing and preview clips with `simctl io recordVideo`; verify each raw clip shows 9:41 and no banner
- [x] 3.2 Encode the clips with the app's bundled ffmpeg (H.264, no audio, ≤15 s, faststart) and extract posters; verify sizes and durations with ffprobe and that the files are about 2 MB or less each

## 4. Manifest, docs, checks

- [x] 4.1 Update `src/data/media.ts` (sizes, durations, `capturedAt`, `captureSource` of the new iOS clips) and the README capture notes and commands (including `scripts/capture/record-window.swift` for the deferred desktop captures); verify `pnpm build` and `pnpm check:media-rights` pass
- [x] 4.2 Check reduced motion and no-JS in Playwright; verify all content is visible, nothing moves and scrolling is native
- [x] 4.3 Visual check at 360/390/768/1024/1440 px in Chromium and WebKit; verify there is no horizontal scroll or overlap, and hero title and CTA are above the fold
- [x] 4.4 Run Lighthouse mobile on the Pages build; verify performance ≥ 90, LCP < 2.5 s, CLS < 0.1
- [x] 4.5 Record a desktop (1440px) and an iPhone (simulator Safari) scroll-through video of the new site for the user's review, with no notifications visible; verify both play to the end
- [x] 4.6 Run the pre-push security review (CLAUDE.md) and open a PR `feat: ...`; verify `.claude/.security-review-ok` matches HEAD and the PR exists

## Workflow follow-up

- Desktop captures deferred by the user (14 Nov 2026), to be done in a later change: a 2x macOS home still and a ≤15 s editor recording from the production build (already built at `5517d29`), recorded window-only with `scripts/capture/record-window.swift` (first verify that a notification posted during a test recording does not appear), then shown in the platforms section's macOS frame.

- User reviews the motion by hand (desktop and iPhone) and the new captures.
- Archive the change with `/opsx:archive` after the user's verification.
