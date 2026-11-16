# Tasks

## 0. Precondition

- [x] 0.1 Confirm that `rewrite-copy-pricing-legal` is archived and that `openspec/specs/landing-page/spec.md` contains the requirement "The audience section names who Danamus is for" (check with `grep`)

## 1. Shared foundations

- [x] 1.1 Add the `--text-section-sm` token (size, line height, letter spacing, weight) and the `.band` class (full width, `--surface`, vertical padding) to `src/styles/global.css`; verify with `pnpm build` and by checking that the `text-section-sm` and `band` utilities appear in the generated CSS
- [x] 1.2 Create `src/components/Icon.astro` with the icons from design decision 3 (inline SVG, `currentColor`, `aria-hidden`, Lucide ISC notice in a comment); verify by rendering every `name` in a test build with no errors and no external requests

## 2. Problem: timeline on a band

- [x] 2.1 Create `src/components/Timeline.astro` with fixed rally and pause data (play about 25% of the total), two static labelled bars and a `figure role="img"` with an `aria-label` stating the numbers; verify with JS disabled that both bars show "20 min" and "5 min" and that the second one is about a quarter of the width
- [x] 2.2 Reduce the number of segments below 640 px while keeping the ratio (design, Risks); verify at 390 px that no segment is narrower than 2 px and there is no horizontal overflow
- [x] 2.3 Put the problem section on a band with a left-aligned header (`text-section`), followed by the timeline, the three numbers and the paragraph; verify visually at 1440 and 390 px
- [x] 2.4 Add `setupTimeline()` to `src/scripts/motion.ts` inside the motion `matchMedia` block (hide the second bar, scrub the pauses' `flexGrow`, the track width and the label, no `pin`); verify in headless Chrome that scrolling down compresses the bar to about 25%, scrolling back expands it, and with `prefers-reduced-motion: reduce` both static bars stay visible

## 3. Come funziona: compact steps

- [x] 3.1 Rewrite `HowItWorks.astro` as an `ol` of 5 steps with number, `Icon`, title and text (the step 3 note stays), centered header in `text-section-sm`, 5 columns from 1024 px and a vertical list below; verify that the section contains no `.device` and that at 1440x900 all five steps fit within about 1.5 viewport heights
- [x] 3.2 Remove `setupWalkthrough()` from `motion.ts` and the `walkthrough__*` styles; verify with `grep -rn walkthrough src/` (no results) and `pnpm build` passing

## 4. Per chi è: cards

- [x] 4.1 Turn the three groups in `Audience.astro` into filled cards (`--surface-2`, at most a hairline border, large radius), each with its own `Icon`; header left-aligned in `text-section-sm`; verify visually at 1440 and 390 px and that the copy is unchanged (diff of the texts only)

## 5. Privacy: diagram on a band

- [x] 5.1 Replace the phone in `Privacy.astro` with the HTML diagram from design decision 5 (device box with Video → Analisi → Video tagliato, interrupted server, sr-only `figcaption`), with the section on a band, the header on the left and the diagram on the right from 1024 px; verify that the section has no `.device`, the layout is vertical at 390 px with no overflow, and the `figcaption` is read by the accessibility tree

## 6. Phone and computer: composite

- [x] 6.1 Rewrite `Platforms.astro` as a single group: window with `clip-macos-editor` and an overlapping phone with `ios-editor` (bottom right, `data-parallax` only on the phone, `data-spotlight` on the group, labels removed); verify at 1440 and 390 px that both devices are visible, nothing overflows sideways, the phone doesn't overlap the next section, and the clip still plays with its poster

## 7. Rhythm and remaining sections

- [x] 7.1 Change the headlines of PricingTeaser and FinalCta to `text-section-sm`, and make the pricing teaser left-aligned with the link beside it on desktop; verify that only Hero (`text-hero`) and Problem (`text-section`) use the largest sizes, with `grep -n "text-section\b" src/components/sections/`
- [x] 7.2 Check the alignment sequence C L C L L C L C and the presence of the two bands; verify with a full-page screenshot at 1440 px

## 8. Media

- [x] 8.1 Reduce `requiredMedia` in `src/data/media.ts` to `clip-preview`, `poster-preview`, `clip-macos-editor`, `poster-macos-editor`, `ios-editor`, `ios-fullscreen`, keeping the other manifest entries; verify that `pnpm build` passes and that temporarily removing the `ios-picker` entry still leaves the build passing (then restore it)
- [x] 8.2 Update the media section of the README if it mentions the walkthrough captures as required; verify that the README text matches the new `requiredMedia`

## 9. Integration checks

- [x] 9.1 Count the device frames on the landing page (`document.querySelectorAll('.device').length` ≤ 3, only in `#top` and `#piattaforme`) at 1440 and 390 px
- [x] 9.2 Check reduced motion and no-JS on the landing page: all content visible, timeline with both bars, nothing moving
- [x] 9.3 Check that there are no cookies, no storage and no third-party requests, and no horizontal overflow at 390 px, on all 4 pages
- [x] 9.4 Run Lighthouse mobile on the landing page: Performance ≥ 95 on a repeated run, CLS < 0.1, LCP still on the hero poster
- [x] 9.5 Publish the private preview (`pnpm build:preview`) to the existing artifact and share the link with the user

## Workflow follow-up

- The user verifies the preview by hand.
- Security review per CLAUDE.md before any push.
- `/opsx:archive` after the user's verification.
