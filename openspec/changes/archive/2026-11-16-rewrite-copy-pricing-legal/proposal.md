# Proposal

## Why

The landing page describes the app's steps, but it never states the problem it solves: a typical amateur match video lasts about 20 minutes with only about 5 minutes of actual play, and cutting it by hand takes about an hour. It also never says who the app is for. Its copy leans on negation lists ("Nessun abbonamento. Mai.", "nessun upload") that the copywriting guidance treats as an AI tell. That claim also stops being true once Danamus gets paid plans. A Pro plan is planned, so the site needs a pricing page now. Before going public, the site also needs a privacy notice and terms of service that match what the site and the app actually do with data.

## What Changes

- Rewrite all landing-page copy in Italian, following the copywriting skill (coreyhaines31/marketingskills) and the humanizer skill (blader/humanizer). New messages:
  - The problem: in a typical match, about 20 minutes of video and about 5 minutes of play. Editing it by hand takes about an hour per video. One rally lasts 3–4 seconds on average.
  - Why it matters: watching yourself play is how you improve, but nobody wants to sit through the pauses to get there.
  - Who it is for: creators who promote the sport, players who record themselves to improve, and anyone who wants to rewatch the play and share it with friends. The use case is a phone on a tripod: record, then watch only the play.
  - Danamus does most of the work automatically. The result can be refined by hand in an editor built for table tennis.
  - Analysis runs on the device. The video leaves it only when the user chooses to share it.
  - Analysis time depends a lot on the device.
  - Danamus works on both phone and computer.
  - The price claim is only "Gratis". No mention of subscriptions, neither for nor against.
- **BREAKING** (page structure): new section order. The "no subscription" section is removed. A "problem" section, a "who it is for" section and a short pricing teaser are added. The platforms section becomes a lighter "phone and computer" section that no longer has to show one capture per platform.
- Remove the analysis-log screenshot (`ios-log`) from the privacy section and from the media the page requires.
- Add a pricing page (`/prezzi`): the Free plan (analysis, editor, export of the full cut video) and the Pro plan (€5/month, marked "In arrivo"; single-segment export, more precise analysis, an analysis queue that processes videos automatically, automatic upload to YouTube).
- Add a privacy notice (`/privacy`) covering the site and the app, and terms of service (`/termini`). Both are drafts with clearly marked placeholders for the data controller's identity and contact, to be reviewed by a lawyer before publication.
- Keep the site free of cookies, analytics and third-party requests, so no consent banner is needed. Make that a requirement.
- Navigation and footer gain links to the new pages, and the in-page links also work from the sub-pages.

## Capabilities

### New Capabilities
- `pricing-page`: the pricing page, with its plans, what each includes, the "In arrivo" state of paid plans, and how the landing page links to it.
- `legal-pages`: the privacy notice and the terms of service, what they must state, placeholders for the controller's details, and the site's cookie-free, tracker-free data-protection baseline.

### Modified Capabilities
- `landing-page`: new section sequence and copy messages, the problem/audience/pricing-teaser sections, a privacy claim reworded around on-device analysis, the no-subscription requirement removed, a platforms requirement relaxed to "phone and computer", and navigation and footer links to the new pages.
- `product-media`: the minimum media set no longer includes one capture per platform or the analysis log.

## Impact

- `src/components/sections/*`: Hero, HowItWorks and Privacy (copy and no log screenshot), Platforms (simplified), FinalCta. `NoSubscription.astro` is removed. New `Problem`, `Audience` and `PricingTeaser` sections.
- `src/components/Nav.astro`, `Footer.astro`: links to `/prezzi`, `/privacy`, `/termini`. Hash links are prefixed with the base path so they work from the sub-pages.
- `src/pages/`: new `prezzi.astro`, `privacy.astro`, `termini.astro`. A small shared layout for text pages.
- `src/site.config.ts`: title and description without the subscription claim; plan data and legal placeholders (controller name, email, country, policy date).
- `src/data/media.ts`: `ios-log` removed from `requiredMedia` (the file can stay or be deleted).
- `src/layouts/Base.astro`: per-page title, description and canonical.
- No new dependencies. The app repository (`marcocivettini/danamus`) is not changed. The privacy notice describes its current behaviour (no network access, no telemetry) and has to be updated when Pro, accounts, auto-update or the YouTube upload ship.
