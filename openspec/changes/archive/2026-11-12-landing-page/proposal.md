# Proposal

## Why

Danamus has no public face: the website repository only holds a "Hello world" page. The product has a clear story to tell (automatic dead-time removal for table-tennis videos, AI that runs on the user's device, manual correction in the editor, no subscription, on Windows, macOS and iOS), and it needs a showcase page that tells it with the same care as the app's own design, in the style of Apple product pages.

## What Changes

- Replace the placeholder `index.html` with a single-page landing site built with **Astro + Tailwind CSS v4**, output as static files (no runtime backend). This is the site's first stack decision and is recorded in `openspec/config.yaml`.
- Landing page sections, in Italian: hero, "how it works" sticky-scroll walkthrough (video → playing area → AI analysis → manual correction → export), "everything stays on your device", "no subscription, no extra costs", "Windows · macOS · iOS", final call to action, footer.
- Visual identity taken from the app: the official Danamus logo files and favicon kit (from `Danamus/design/logo/`), the app's dark palette and `#00c573` accent, Inter typography, glass navigation, spacing-over-boxes layout.
- Motion in the style of Apple product pages: scroll-driven reveals, device frames whose screen changes while scrolling, subtle transitions from the transitions.dev skill; everything degrades to static content under `prefers-reduced-motion` and without JavaScript.
- Real product media: screenshots and short screen recordings of the running app, captured on the user's Mac (desktop app and iOS Simulator, with already analyzed projects) through Remote Control, optimized for the web and stored in the repo. Media are kept replaceable because the sample match footage (ITTF broadcast) may not be cleared for public use.
- Publishing: a GitHub Actions workflow that builds the site and deploys it to GitHub Pages; a private preview of the built site on claude.ai so the user can review it before the repository is made public.

## Capabilities

### New Capabilities
- `landing-page`: the content and structure of the landing page — sections, messages, platform presentation, calls to action, language and SEO metadata.
- `site-visual-identity`: how the site applies the Danamus brand — logo usage, colours, typography, layout rules, and the motion rules (including reduced-motion behaviour).
- `product-media`: how app screenshots and recordings are produced, stored, formatted and shown, and how they can be replaced.
- `site-publishing`: how the site is built and published — static build, GitHub Pages deployment, preview.

### Modified Capabilities
<!-- None: the site has no specs yet. -->

## Impact

- Danamus-website: new Astro project (`package.json`, `astro.config.mjs`, `src/`, `public/`), removal of the placeholder `index.html`, new `.github/workflows/` deploy workflow, `openspec/config.yaml` updated with the chosen stack.
- Assets copied from the Danamus repository (logo, favicons); the Danamus app code is not changed.
- Depends on Remote Control access to the user's Mac (Mac.station, folder "Danamus") to capture media; today that folder is listed but not offered to cloud sessions, so the capture tasks need either an updated Claude app on the Mac or a session running on the Mac.
- GitHub Pages on a free plan requires the repository to be public: the user makes that switch and enables Pages; the workflow is ready before then.
- Download links: no public download channel exists yet (iOS installs are development-mode only). The calls to action read their targets from one configuration file and show an "in arrivo" state until real links exist.
