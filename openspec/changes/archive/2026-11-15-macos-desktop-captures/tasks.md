# Tasks

## 1. Media

- [x] 1.1 Copy the editor still to `src/assets/media/macos/editor.png`, the poster to `src/assets/media/macos/posters/editor.png` and the clip to `public/media/macos-editor.mp4` (from `media-src/macos-2026-11-14/`), and remove `macos/home.png`; verify sizes (1280×800) and duration (15 s) with ffprobe/sips
- [x] 1.2 Update `src/data/media.ts` (`macos-editor`, `poster-macos-editor`, `clip-macos-editor` with the production-build capture source, date 2026-11-14, ITTF footage; drop `macos-home`); verify `pnpm build` and `pnpm check:media-rights` pass

## 2. Page

- [x] 2.1 Show `clip-macos-editor` in the platforms section's macOS window frame (1280×800 aspect) through `Clip`; verify in Playwright that the file is not requested at load, plays when in view, and shows the poster with play button under reduced motion

## 3. Tooling and docs

- [x] 3.1 Keep the `NSApplication.shared` fix in `scripts/capture/record-window.swift` and document in the README the demo-library procedure and the compiled recorder (`swiftc -O ... -o record-window`); verify the README commands match the script's usage
- [x] 3.2 Update the README "Catture attuali" list (macOS editor still and clip, 1x production build); verify it matches the manifest

## 4. Checks

- [x] 4.1 Visual check of the platforms section at 390 and 1440 px in Chromium and WebKit; verify there is no horizontal scroll and the macOS frame keeps its aspect ratio
- [x] 4.2 Run Lighthouse mobile on the Pages build; verify performance ≥ 90, LCP < 2.5 s, CLS < 0.1
- [x] 4.3 Run the pre-push security review (CLAUDE.md) and open a PR `feat: ...`; verify `.claude/.security-review-ok` matches HEAD and the PR exists

## Workflow follow-up

- User reviews the new desktop media by hand.
- Archive this change (and `gsap-motion-and-new-captures`) with `/opsx:archive` after the user's verification.
