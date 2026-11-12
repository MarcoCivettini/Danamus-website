# Tasks

## 1. Project setup

- [x] 1.1 Scaffold an Astro project with pnpm (TypeScript strict), remove the placeholder `index.html`, add `@tailwindcss/vite` and `@fontsource-variable/inter`; verify `pnpm build` produces `dist/index.html`
- [x] 1.2 Add `src/site.config.ts` (site URL, `SITE_BASE` base path, per-platform CTA entries with `href: null` → "In arrivo") and wire `base`/`site` in `astro.config.mjs`; verify `SITE_BASE=/Danamus-website/ pnpm build` emits asset URLs prefixed with `/Danamus-website/`
- [x] 1.3 Record the stack (Astro + Tailwind v4, pnpm, static output) in `openspec/config.yaml` and add a README with dev/build commands; verify the commands in the README run as written

## 2. Visual identity

- [x] 2.1 Copy the reversed logo SVGs to `public/brand/` and the `web/` favicon kit (favicons, icons, `site.webmanifest`) to `public/` from `Danamus/design/logo/`, unmodified; verify file hashes match the Danamus repo
- [x] 2.2 Create `src/styles/tokens.css` with the app tokens (bg, surfaces, text greys, `#00c573`/`#3cc789`, glass, radii, spacing, type roles + site display sizes) and a source/commit header; expose them as Tailwind v4 theme values; verify secondary text reaches 4.5:1 contrast on the background (computed check)
- [x] 2.3 Add the base layout (`lang="it"`, Inter, meta/OG/Twitter/canonical tags, favicons) and the glass navigation bar with the logo rules (horizontal ≥96px, symbol below); verify in a 1440px and a 360px viewport screenshot
- [x] 2.4 Add the motion layer: inline `motion-ok` script, `@supports (animation-timeline: view())` reveals, IntersectionObserver fallback, transitions.dev motion tokens; verify with Playwright that content is in final state with `reducedMotion: 'reduce'` and with JavaScript disabled
- [x] 2.5 Build the CSS/SVG device frames (laptop, desktop window, phone) as components sized from the media manifest; verify each renders a test image without distortion at 1x and 2x

## 3. Media capture on the Mac (Remote Control)

- [x] 3.1 Attach this session to the Mac folder "Danamus" via Remote Control (or run these steps in a Claude session on the Mac); verify a command runs on Mac.station and lists the Danamus repo
- [x] 3.2 On the Mac, prepare demo state: projects analyzed with the ITTF Kim Kum Yong match renamed to demo names, clean desktop, notifications off; verify a test capture shows no personal names, paths or notifications
- [ ] 3.3 Capture the macOS desktop app at 1440x900: video picker, playing-area page, analysis in progress, editor with timeline and segments, export dialog (stills + 5–15 s clips of analysis and editing); verify every capture listed in design is in `media-src/macos/`
- [x] 3.4 Capture the iOS app in the iOS Simulator (clean status bar 9:41): editor with an analyzed project and one more screen, plus a short clip; verify files are in `media-src/ios/` at native simulator resolution
- [ ] 3.5 Capture the Windows-style UI from the frontend in a Chromium window on the Mac (platform `other`, project analyzed in that browser) for the platforms section; verify the Windows title-bar controls are visible in `media-src/windows/`
- [x] 3.6 Transfer the raw captures into the repo `media-src/`, encode clips with ffmpeg (H.264, no audio, faststart, ≤15 s, ≤2 MB) with poster frames; verify sizes and durations with `ffprobe`

## 4. Media manifest

- [x] 4.1 Create `src/data/media.ts` with a zod-validated manifest (id, file, platform, screen, Italian alt, size, date, footage source, `cleared`) covering every step and platform, all ITTF items `cleared: false`; verify the build fails with a clear message when an entry's file is removed
- [x] 4.2 Build the `<Screenshot>` (Astro `<Picture>`, AVIF/WebP 1x/2x, eager only for hero) and `<Clip>` (preload none, src on approach, autoplay muted only with `motion-ok`, poster otherwise) components; verify in Playwright that clips below the fold are not requested on load
- [x] 4.3 Add the `check:media-rights` script that fails when any item has `cleared: false`; verify it fails on the current manifest and passes when all flags are true

## 5. Landing page sections

- [x] 5.1 Hero: headline on automatic dead-time removal, platforms line, primary CTA from config, macOS screenshot in the laptop frame; verify all are above the fold at 1440x900 and headline + CTA at 390x844
- [x] 5.2 "Come funziona" sticky walkthrough with the five steps (video, area di gioco, analisi, correzione, export) and media cross-fade, collapsing to stacked steps on narrow screens; verify step order and active-media switching while scrolling in Playwright
- [x] 5.3 Privacy section (AI on the device, no upload) and no-subscription section (no subscription, no extra costs, no prices); verify the copy against the `landing-page` spec
- [x] 5.4 Platforms section with Windows, macOS and iOS captures in their frames; verify the three names and captures are visible at desktop and phone widths
- [x] 5.5 Final CTA and footer (logo, copyright, link to privacy statement in-page); verify CTA "In arrivo" state renders as non-link for platforms with `href: null`
- [ ] 5.6 Polish pass with the `transitions-polish` and `make-interfaces-feel-better` guidance (timings, easing, hover states, optical alignment); verify no continuous animations other than analysis illustrations

## 6. Publishing

- [x] 6.1 Add `.github/workflows/deploy.yml` (push to `main` + manual: install, media-rights check, build with `SITE_BASE=/Danamus-website/`, upload-pages-artifact, deploy-pages); verify the workflow passes `actionlint` (or YAML schema check) and the check step blocks on uncleared media
- [x] 6.2 Add a preview build mode with relative asset URLs and publish `dist/` as a private claude.ai Artifact; verify the page, styles, fonts and media load from the preview link
- [x] 6.3 Document in the README how to make the repo public, enable Pages (Source: GitHub Actions), and mark/replace footage; verify the steps match the GitHub settings names

## 7. Integration checks

- [x] 7.1 Serve the Pages build under `/Danamus-website/` locally and crawl it; verify no 404 for any asset or link
- [x] 7.2 Run Lighthouse (mobile) on the built page; verify performance ≥ 90, LCP < 2.5 s, CLS < 0.1
- [x] 7.3 Visual review screenshots at 360, 390, 768, 1024, 1440 px with motion on and reduced; verify no horizontal scroll and no overlapping content
- [x] 7.4 Run the pre-push security review (CLAUDE.md) on the branch diff before pushing; verify findings are reported and `.claude/.security-review-ok` matches HEAD

## 8. Temporary publishing with placeholders

- [x] 8.1 Add a `placeholder` flag to the manifest (alt text prefixed as placeholder, footage "none", cleared) and a script that generates labelled "SEGNAPOSTO" stills and clips at the manifest sizes; verify `pnpm build` and `pnpm check:media-rights` pass with only placeholders
- [x] 8.2 Open a PR to `main` (title `feat: ...`) after the pre-push security review; verify the PR exists and the branch build passes
- [ ] 8.3 After the user makes the repo public, enables Pages and merges, verify the site answers at `https://marcocivettini.github.io/Danamus-website/`

## 9. Real captures (iPhone-first)

- [x] 9.1 Import the iOS stills, the cropped macOS home and trimmed clips with extracted posters into `src/assets/media/` and `public/media/`; verify sizes and durations with a script/ffprobe and that no file shows the dev indicator
- [x] 9.2 Update the manifest (ids, files, sizes, capture date 2026-11-12, footage source, `cleared: true` by owner decision, placeholder only for Windows); verify the build passes and `check:media-rights` passes
- [x] 9.3 Switch hero and walkthrough to phone frames, privacy to the analysis log, platforms macOS to the desktop capture; verify in Playwright at 360/390/1024/1440 (no horizontal scroll, walkthrough order 0-4, hero title and CTA above the fold)
- [x] 9.4 Rerun Lighthouse mobile on the Pages build; verify performance >= 90, LCP < 2.5 s, CLS < 0.1

## Workflow follow-up

- User reviews the private preview and verifies the site by hand.
- User makes the repository public and enables GitHub Pages; footage is cleared or replaced before the first public deploy.
- Archive the change with `/opsx:archive` after the user's verification.
