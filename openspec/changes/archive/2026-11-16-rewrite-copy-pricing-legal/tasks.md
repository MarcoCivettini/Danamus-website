# Tasks

## 1. Configuration and layout groundwork

- [x] 1.1 In `src/site.config.ts`, replace title and description with the design's metadata (no "abbonamento"), add `plans` (Free, Pro with `status: "soon"`, price 5, features) and `legal` (placeholders, `draft: true`); verify `pnpm build` passes and `grep -ri abbonament src` returns nothing from config
- [x] 1.2 Add optional `title`, `description`, `ogImage` props to `src/layouts/Base.astro`, defaulting to the site config; verify the built `dist/index.html` keeps the same title, canonical and OG tags as before except for the new copy
- [x] 1.3 Make `Nav.astro` and `Footer.astro` page-aware: on the landing page section links stay `#id`, elsewhere `withBase("/#id")`; nav shows Come funziona, Per chi è, Prezzi, Scarica; footer shows Prezzi, Privacy, Termini; verify by clicking every link on the landing page and on a sub-page in `pnpm dev`

## 2. Landing page copy and sections

- [x] 2.1 Rewrite `Hero.astro` with the design's eyebrow, H1 (split words at build time as today), subhead and "Gratis, su telefono e computer."; verify the 1440x900 and 390x844 first-screen scenarios in the browser
- [x] 2.2 Add `sections/Problem.astro` (id `perche`) with the three figures, body text and a code comment citing the 3–4 s sources; verify it renders after the hero with reveal motion and is fully visible with reduced motion
- [x] 2.3 Update `HowItWorks.astro`: new H2, lead line, step titles and texts, and the muted analysis-time note under step 3; verify the five steps and the note in both the desktop sticky layout and the mobile inline layout
- [x] 2.4 Add `sections/Audience.astro` (id `per-chi`) with the three audiences, reusing the list style of the removed NoSubscription section; verify layout at 390px and 1440px
- [x] 2.5 Update `Privacy.astro`: new copy, remove the figures block, replace `ios-log` with `ios-projects`; verify no log capture appears
- [x] 2.6 Rewrite `Platforms.astro` as "Sul telefono o sul computer." with only `clip-macos-editor` and `ios-editor`; verify the clip still plays with motion and shows its poster with reduced motion
- [x] 2.7 Add `sections/PricingTeaser.astro` with the copy and a "Confronta i piani" link to `/prezzi/`; delete `NoSubscription.astro`; update `FinalCta.astro` copy
- [x] 2.8 Update `src/pages/index.astro` to the new section order (nav, hero, problem, come funziona, per chi è, privacy, telefono e computer, prezzi, final CTA, footer); verify the order by scrolling the page and that `grep -ri abbonament src` returns nothing
- [x] 2.9 Run a copy pass on every changed string against the copywriting and humanizer checklists (no negation lists, no "non X ma Y", no colon reveals beyond the one in the problem body, no em dashes in short copy, no restated headings); record any line changed from the design in the design's copy section

## 3. Media

- [x] 3.1 Remove `ios-log` from `requiredMedia` and the manifest in `src/data/media.ts`, delete `src/assets/media/ios/log.png`, update the README capture list; verify `pnpm build` and `pnpm check:media-rights` still pass

## 4. Pricing page

- [x] 4.1 Create `src/pages/prezzi.astro` from `site.plans` with the design's copy: Free with "Scarica Danamus" linking to the landing `#scarica`, Pro with "In arrivo" badge and no action, notes on on-device analysis, device-dependent speed and "Prezzi IVA inclusa."; verify the page at `/prezzi/` on 390px and 1440px, that Pro has no link or button, and that changing the Pro price in config changes the page
- [x] 4.2 Give `/prezzi/` its own title, description and canonical; verify in the built HTML

## 5. Legal pages and data-protection baseline

- [x] 5.1 Create a `TextPage` layout (Base, Nav, prose column, Footer, draft banner while `legal.draft` is true); verify the banner shows with the default config
- [x] 5.2 Write `src/pages/privacy.astro` following the design outline (controller, site with GitHub Pages logs and US transfer, app with on-device processing and no telemetry, future features, email contacts, rights, Garante complaint, last update), with values from `site.legal`; check GitHub's current Data Privacy Framework status and link the GitHub Privacy Statement; verify every section in the spec scenario is present
- [x] 5.3 Write `src/pages/termini.astro` following the design outline; verify every topic in the spec scenario is present
- [x] 5.4 Add `scripts/check-legal.mjs` (fails on `draft: true` or bracketed values, naming the fields), a `check:legal` script in `package.json`, and a step in `.github/workflows/deploy.yml` next to `check:media-rights`; verify it exits non-zero with the default config, exits zero with sample real values (reverted afterwards), and that `pnpm build:preview` still succeeds
- [x] 5.5 Verify the no-cookies, no-third-party baseline: load each built page in Playwright with an empty profile and check that no cookie is set and every request goes to the site's origin
- [x] 5.6 Document in the README where the legal details live, that the deploy is blocked until they are filled in, and that the privacy notice must be updated before the app ships data-sending features

## 6. Integration checks

- [x] 6.1 Run `pnpm build` and `pnpm build:preview`; open the preview and check every page, every nav/footer link from every page, and the reduced-motion and no-JavaScript rendering of the landing page
- [x] 6.2 Run Lighthouse mobile on the built landing page; verify performance is at least 90, LCP under 2.5 s and CLS under 0.1
- [x] 6.3 Send the user a private preview link for manual review

## Workflow follow-up

- Security review of the diff with the `security-audit` skill (guidance mode) before any push, as CLAUDE.md requires.
- Archive the change with `/opsx:archive` after the user has verified the result by hand.
- Before going public: the user fills in the controller details, has the legal texts reviewed, and clears `legal.draft`.
