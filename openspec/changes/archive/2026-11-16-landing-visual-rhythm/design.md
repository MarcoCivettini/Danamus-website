# Design

## Context

See proposal.md (Why). Current state, from the code:

- **Sections** (`src/components/sections/`), in this order: Hero, Problem, HowItWorks, Audience, Privacy, Platforms, PricingTeaser, FinalCta. All of them use `eyebrow` + `text-section` + `text-lead` and the same `mt-[var(--section-gap)]`, on the same `--bg` background.
- **Device frames**:
  - Hero has 1;
  - HowItWorks has 10 in the markup: 5 inline for mobile and 5 in the sticky stage for desktop, driven by `setupWalkthrough()` in `motion.ts`;
  - Privacy has 1 (`ios-projects`, with `data-parallax`);
  - Platforms has 2, shown as separate items with labels.
- **Media**: `requiredMedia` in `src/data/media.ts` lists 17 entries. The build fails if one of them is missing.
- **Motion**: GSAP, ScrollTrigger, SplitText and Lenis are already loaded lazily. Reveals use `data-reveal`; the safety net is `html.motion-ok` with 3 s.
- **Constraints**:
  - dark theme only, `#00c573` as the only accent;
  - no new dependencies needed;
  - no third-party requests at runtime;
  - content must be visible with reduced motion and without JS.

## Goals / Non-Goals

**Goals:**
- Each section has its own layout, and the page's visual idea is drawn in code, not captured.
- Every new visual has a static form that is complete and readable without JS.

**Non-Goals:**
- Changing the copy (apart from new visual labels).
- Changing the section order.
- Changing the pricing and legal pages, apart from the shared `text-section-sm` heading token if it suits them.
- New captures.
- An icon or illustration library as a dependency.

## Decisions

### 1. Layout map

| Section | Background | Header | Headline | Visual |
|---|---|---|---|---|
| Hero | page | centered | `text-hero` | phone + preview recording (unchanged) |
| Problem | **band** | left | `text-section` | **timeline** + 3 numbers + paragraph |
| Come funziona | page | centered | `text-section-sm` | 5 steps in a row (desktop) or a vertical list (mobile), with icons |
| Per chi è | page | left | `text-section-sm` | 3 filled cards with icons |
| Privacy | **band** | left, split with the diagram | `text-section-sm` | **diagram** device → analysis → video |
| Telefono e computer | page | centered | `text-section-sm` | **composite** of window + phone |
| Prezzi (teaser) | page | left, split with the link | `text-section-sm` | none |
| Final CTA | page | centered | `text-section-sm` | logo (unchanged) |

Alignment sequence: C L C L L C L C. No more than two consecutive sections share an alignment, as the spec requires.

A band is a `.band` class: full width, `background: var(--surface)`, vertical padding `clamp(96px, 12vw, 160px)`. A band section uses padding instead of `margin-top`, so the colour fills the whole height.

New token `--text-section-sm: clamp(2rem, 1.4rem + 2.6vw, 3.5rem)`, with line height 1.08, letter spacing -0.025em and weight 600, in the same `@theme` as the other sizes.

*Alternative considered:* alternating light and dark sections. Rejected, because the spec requires the dark theme as the only theme. The `--surface` band gives contrast without breaking the palette.

### 2. Timeline: HTML and CSS bars, compressed by a GSAP scrub

- **Markup**: a `Timeline.astro` component with a fixed array of about 30 rallies and the pauses between them. The durations are hand-chosen and illustrative, with play adding up to about 25% of the total. Each segment is a `span` with `flex-grow` equal to its duration. Rallies are `--accent`, pauses are `--border`.
- **Static state (no JS, reduced motion)**: two labelled bars.
  1. "Video registrato · 20 min", at full width.
  2. "Con Danamus · 5 min", with rallies only and a width equal to the share of play.

  Both are always in the HTML.
- **With `motion-ok`**:
  - the second bar is hidden;
  - a ScrollTrigger with `scrub` (start `top 75%`, end `center 40%`, no `pin`) tweens the pauses' `flexGrow` to 0 and the track's width from 100% to the share of play;
  - the label goes from "20 min" to "5 min" with a numeric tween (`tabular-nums`).

  Scrolling back reverses the tween, because a scrub is bidirectional.
- **Accessibility**:
  - `figure` with `role="img"` and an `aria-label` that states the numbers ("Circa 20 minuti di video contengono circa 5 minuti di gioco");
  - the segments are `aria-hidden`.

*Alternatives considered:*
- an SVG with path morphing: harder to make responsive;
- a canvas: no static form without JS.

Flex bars resize on their own, from 390 px to 1440 px.

### 3. Icons drawn inline, with no dependency

An `Icon.astro` component with a `name` prop that returns inline SVG: 24×24 viewBox, `stroke="currentColor"`, stroke 1.5, `aria-hidden`.

The set:
- the steps: video, table with corners, analysis (ball with a trail), segments with handles, export;
- the audience: creator, player, friends;
- the privacy diagram: device, server.

The paths come from Lucide (ISC licence, so it's enough to keep the notice in a comment in the file), copied and not installed.

*Alternative considered:* installing `lucide-astro` or `astro-icon`. Rejected, because it adds a dependency for about 10 icons.

### 4. Compact "Come funziona"

- An `ol` with 5 `li` elements. Each has its number, an icon in a 40 px accent circle, an `h3` (`text-lead`, semibold) and its text.
- **Desktop (≥1024 px)**: a 5-column grid. A horizontal hairline above the numbers links the steps.
- **Mobile**: a vertical list with a vertical line on the left.
- The step 3 note stays.
- Removed:
  - `setupWalkthrough()` and the `[data-walkthrough]` CSS;
  - the `walkthrough__*` styles;
  - the inline and stage device frames.

### 5. Privacy diagram in HTML

- A rounded box with a dashed hairline border, labelled "Il tuo telefono o computer". It holds three nodes in a row: Video → Analisi → Video tagliato, each with an icon and a label, joined by CSS arrows.
- Outside the box, a dimmed "Server" node with a dashed line interrupted by a ✕ and the label "Nessun upload".
- **Mobile**: the nodes stack vertically, and the server sits below, interrupted the same way.
- **Accessibility**: the labels are visible text, and an sr-only `figcaption` restates the claim.
- The `ios-projects` frame and its `data-parallax` are removed.

### 6. Platforms composite

- A relative wrapper. The window with `clip-macos-editor` is about 88% wide, on the left. The phone with `ios-editor` is about 26% wide (34% on mobile), absolutely positioned at the bottom right and pushed down by about 12%.
- `data-parallax` only on the phone, for depth within the spec's 10% limit.
- The "Computer" and "Telefono" labels are removed, and `data-spotlight` is applied to the whole group.
- There is room at the bottom so the phone doesn't overlap the next section.

### 7. Media: `requiredMedia` follows the page

`requiredMedia` becomes `clip-preview`, `poster-preview`, `clip-macos-editor`, `poster-macos-editor`, `ios-editor`, `ios-fullscreen` (sharing image). The other entries stay in the manifest and are still validated if present, but they are no longer required. The files stay in the repository.

## Risks / Trade-offs

- **The timeline gets too dense on mobile** (30 rallies at 390 px means segments about 3 px wide) → keep a minimum width of 2 px and fewer segments below 640 px, using `hidden` on half the pauses and rallies (alternating) while keeping the 25% ratio.
- **Flex-grow tweens can trigger layout on scroll** → only one track with about 60 elements, so the cost is negligible. If it shows up in Lighthouse (TBT or INP), switch to `scaleX` on the pauses and `transform` on the rallies.
- **Lucide icons are generic** → use them only as small marks in accent circles. The site's identity rests on the timeline and the diagram, which are custom.
- **The phone in the composite covers part of the editor recording** → place it over the bottom-right corner of the window, where the recording shows less important parts of the interface. Check against the real clip before finishing.
- **This change modifies requirements added by a change that hasn't been archived yet** → archive `rewrite-copy-pricing-legal` before running this change's apply.

## Migration Plan

Static deploy, nothing to migrate. To roll back, revert the commit. The removed captures are still in the repository and in the manifest, so the old walkthrough can be restored without new files.
