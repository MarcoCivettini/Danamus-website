# Design

## Context

- The repository holds only a placeholder `index.html`; there is no build, no stack, no assets. See proposal.md for motivation.
- The brand and design language already exist in the Danamus repository: logo kit and favicons in `design/logo/` (`danamus-*-reversed.svg`, `web/` favicon set and `site.webmanifest`), colour tokens in `src/app/globals.css` (`--accent: #00c573`, `--accent-soft: #3cc789`, `--bg`, `--fg`), rules in `DESIGN.md` (dark theme, Inter, glass, spacing over boxes, 4px grid).
- The app's real flow (spec `project-flow` in Danamus) is: video picker → playing-area page → analysis status page → editor; export from the editor. The walkthrough mirrors it.
- The app runs as a Tauri desktop build on macOS and Windows (custom title bar, spec `window-chrome`: macOS traffic lights on the left, Windows controls on the right, chosen at runtime) and as an iOS app built from the Mac (spec `ios-app`, development mode, runs in the iOS Simulator). When the same frontend runs outside Tauri, it renders the Windows-style controls (platform `other`).
- Captures need the user's Mac (Mac.station). The Remote Control folders "Danamus" and "Video" are listed but currently not offered to cloud sessions. The sample match is an ITTF broadcast (rights not cleared for public use).
- This cloud container has Node 22, pnpm via corepack, ffmpeg and Playwright/Chromium.

## Goals / Non-Goals

**Goals:**
- An Apple-style product page whose motion is CSS-first and costs almost no JavaScript.
- A media pipeline where replacing footage means replacing files and one manifest entry.
- The same build serving a private preview now and GitHub Pages later.

**Non-Goals:**
- Multiple pages, blog, English version, analytics, cookie banner, newsletter or waitlist backend.
- Light theme.
- Changing the Danamus app (captures use it as it is).
- A real download channel (store listings, signed installers): out of this change; links are configuration.

## Decisions

### Stack: Astro (static) + Tailwind CSS v4, pnpm
Astro ships zero JavaScript by default and renders components to static HTML; the few interactive pieces are small scripts. Tailwind v4 (via `@tailwindcss/vite`) lets the site reuse the app's token names and utility vocabulary. pnpm matches the Danamus repo.
- *Alternative: Next.js static export* — same stack as the app, but ships the React runtime for a page that has almost no state; worse performance budget for no gain.
- *Alternative: hand-written HTML/CSS* — lightest, but no image pipeline, no components, harder to maintain the media manifest.
The decision is recorded in `openspec/config.yaml` (Tech stack).

### Design tokens copied, not linked
`src/styles/tokens.css` restates the app tokens (colours, radii, glass, type roles adapted to marketing sizes) with a header comment naming the source file and commit in the Danamus repo. Cross-repo imports would couple the site's build to the app's checkout. Larger display sizes for headlines are a site-only extension of the type scale (the app's scale tops at 48px).

### Logo and favicons copied from the kit
The reversed SVGs and the `web/` favicon kit are copied into `public/brand/` and `public/` unchanged; components reference them as images (no inline redraws), which keeps the "do not modify" rules of the logo README.

### Fonts self-hosted
Inter via `@fontsource-variable/inter` (SIL OFL), bundled by the build; `font-display: swap`, with the system stack fallback. No Google Fonts request.

### Motion: CSS scroll-driven animations with a progressive enhancement layer
- Entry reveals use an IntersectionObserver that adds `is-visible` once per element (a `view()` timeline would replay the reveal when scrolling back up, while the spec asks for "once"). Continuous scroll-linked effects (the hero device straightening as it scrolls in) use `animation-timeline: view()` inside `@supports`, and are simply absent where unsupported.
- A safety net removes `motion-ok` if the motion script has not run within 3 s, so a failed script never leaves content hidden.
- Initial "hidden" states are applied only when `html` has the class `motion-ok`, set by an inline script when `prefers-reduced-motion` is not `reduce`. Without JavaScript or with reduced motion, content is in its final state (spec `site-visual-identity`).
- The "come funziona" walkthrough is a tall section with a `position: sticky` device frame; each step's text block scrolls past it, and an IntersectionObserver marks the active step, cross-fading the frame's media (opacity + slight scale/blur using the transitions.dev motion tokens from `transitions-polish/_root.css`). On narrow screens the sticky layout collapses to text + media per step.
- No animation library (GSAP, Framer Motion): the effects needed are achievable in CSS, and the budget favours none.

### Device frames drawn in CSS/SVG
Generic frames (laptop with a thin bezel, desktop window, phone with rounded screen and island) are built in CSS/SVG, so screenshots sit in them at exact pixel sizes. Apple and Microsoft product imagery is not used (trademarks, licensing, weight). The desktop captures already contain the app's own title bar, so the "window" frame is only shadow and radius.

### Media capture via Remote Control on the Mac
Captures run in a session attached to the Mac folder "Danamus" (Remote Control). On the Mac:
- **macOS desktop**: run the desktop app (`pnpm tauri dev` or the installed build) at a fixed window size (1440x900 logical), use projects already analyzed with the ITTF match, capture windows with `screencapture -l<windowid> -o` (no shadow) and record with `screencapture -v` or QuickTime for short clips.
- **iOS**: boot an iPhone simulator (e.g. iPhone 16 Pro), run `pnpm tauri ios dev`, capture with `xcrun simctl io booted screenshot` and `xcrun simctl io booted recordVideo`; set the simulator status bar to a clean state with `xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100`.
- **Windows**: no Windows machine is available. The Windows captures use the same frontend served by `pnpm dev` and opened in a Chromium window on the Mac at the desktop size: the app then renders its real Windows-style title bar (platform `other`). Projects for these captures are analyzed in that browser session (inference is client-side, so the browser build analyzes the same way). If the user later provides a Windows PC, real captures replace them via the manifest.
- Demo project names (e.g. "Finale — demo") and a clean desktop/notification state before capturing. Final stills (PNG) are committed in `src/assets/media/<platform>/`; raw screen recordings stay in `media-src/` (git-ignored) and only the encoded MP4s are committed in `public/media/`.

### Media manifest and pipeline
- `src/data/media.ts` exports the manifest (id, file, platform, screen, Italian alt text, size, capture date, footage source, `cleared` flag), validated with a zod schema at build time: a missing file or a missing required id fails the build (spec `product-media`).
- Screenshots go through Astro's `<Picture>` (sharp) to AVIF + WebP at 1x/2x of their display width; the hero image is eager with `fetchpriority="high"`, the rest lazy.
- Recordings are encoded once with ffmpeg (H.264, `-an`, `+faststart`, ≤15 s, ≤1440px wide, target < 2 MB each) plus a poster frame; a `<video>` component sets `preload="none"`, assigns `src` when near the viewport, and autoplays muted only under `motion-ok`.
- A `check:media-rights` script runs in the deploy workflow and fails when any item is `cleared: false`. The private preview does not run it.

### Site configuration
`src/site.config.ts` holds the site URL, base path, and per-platform call-to-action entries (`{ label, href | null }`); `null` renders the "In arrivo" state. The base path comes from an env var (`SITE_BASE`), defaulting to `/`, set to `/Danamus-website/` in the Pages workflow.

### Publishing
- **GitHub Pages**: `.github/workflows/deploy.yml` on push to `main` and `workflow_dispatch`: checkout → pnpm install → media-rights check → `astro build` → `actions/upload-pages-artifact` → `actions/deploy-pages`. A failed job never reaches the deploy step, so the live site stays.
- **Private preview**: `pnpm build:preview` builds and copies `dist/` to `dist-preview/`, rewriting root-relative URLs to relative ones (HTML, CSS, JS), so the build works at any path; that folder is published as a multi-file claude.ai Artifact.

## Risks / Trade-offs

- [Remote Control folders not offered to cloud sessions] → capture tasks come first and can also be done from a Claude session running on the Mac; everything else is built against the manifest in parallel, and the build refuses to finish without real media rather than shipping placeholders.
- [ITTF footage cannot go public] → `cleared` flag + deploy check; the private preview is still possible; replacing footage is a manifest change.
- [Windows captures come from the browser, not a Windows PC] → the rendered UI is the app's own Windows chrome; the manifest marks their platform source so they can be swapped for real Windows captures later.
- [Scroll-driven animations unsupported in Safari/Firefox versions] → IntersectionObserver fallback; content visible without either.
- [Video weight hurting LCP] → videos never in the LCP slot (hero uses a still), `preload="none"`, size budget per clip.
- [Artifact preview limits (files per publish, page size)] → keep the build lean (one page, hashed bundles, media within budget); split the upload across publishes if over 255 files.
- [GitHub Pages needs a public repo on the free plan] → the user switches visibility and enables Pages ("Source: GitHub Actions"); the workflow is committed beforehand and does nothing harmful until then.

## Migration Plan

1. Build and review the site through the private preview.
2. Merge to `main`; the user makes the repository public and sets Pages source to GitHub Actions.
3. Mark footage as cleared (or replace it) so the deploy check passes; the workflow publishes to `https://marcocivettini.github.io/Danamus-website/`.
Rollback: re-run the deploy workflow on a previous commit, or disable Pages.

## Open Questions

- Final download destinations per platform (store pages, installers): filled into `site.config.ts` when they exist.
- Replacement footage for the public site (own match or cleared clip): swapped via the manifest when available.
