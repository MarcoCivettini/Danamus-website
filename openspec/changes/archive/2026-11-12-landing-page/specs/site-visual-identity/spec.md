# Spec Delta

## Purpose

Defines how the website applies the Danamus brand and the app's design language: logo usage, colours, typography, layout, glass surfaces and motion, so that the site looks like the same product as the app.

## ADDED Requirements

### Requirement: The site uses the official Danamus logo files
The site SHALL show the Danamus logo only from the official logo kit of the Danamus repository (symbol, horizontal and wordmark, reversed versions on dark backgrounds), unmodified, with clear space of at least the ball's diameter, and the symbol-only version below 96px of width.

#### Scenario: Logo in the navigation bar
- **WHEN** the navigation bar is shown on the dark background
- **THEN** it shows the reversed horizontal logo from the kit, or the reversed symbol when the space is narrower than 96px

#### Scenario: Favicon
- **WHEN** the site is opened in a browser tab
- **THEN** the tab shows the Danamus favicon from the kit

### Requirement: The site uses the app's colour palette
The site SHALL use the app's dark theme as its only theme: background `#0A0A0B` (or the app's `--bg`), elevated surfaces from the app palette, white primary text, the app's secondary and tertiary text greys, and `#00c573` as the only accent colour.

#### Scenario: Accent colour
- **WHEN** any element of the site is coloured with an accent
- **THEN** that colour is `#00c573` (or its soft variant `#3cc789` from the app)

### Requirement: Text meets contrast and size minimums
Body text SHALL have a contrast ratio of at least 4.5:1 against its background, and no text SHALL be smaller than 12px.

#### Scenario: Secondary text
- **WHEN** secondary text is shown on the page background
- **THEN** its contrast ratio is at least 4.5:1

### Requirement: The site uses Inter
The site SHALL set text in Inter, served from the site itself, with the system sans-serif stack as fallback, using weights 400, 500 and 600.

#### Scenario: Font loading
- **WHEN** the page loads
- **THEN** Inter is loaded from the site's own origin, not from a third-party font CDN

### Requirement: Layout separates content with space, not boxes
Sections and content groups SHALL be separated mainly by whitespace, as in the app's design system; borders and boxed cards SHALL be limited to device frames and glass surfaces.

#### Scenario: Feature list
- **WHEN** a section lists several benefits
- **THEN** they are separated by spacing, not by bordered boxes

### Requirement: The navigation bar is a glass surface
The navigation bar SHALL stay at the top of the viewport and use the app's glass effect (translucent dark background with blur and a 10%-white hairline border).

#### Scenario: Scrolling over media
- **WHEN** the page scrolls under the navigation bar
- **THEN** the bar stays fixed and the content behind it shows blurred

### Requirement: Motion is subtle and tied to scrolling
Animations SHALL be reveals, fades, scale or position changes tied to scroll position or entry into the viewport, and transitions on interactive elements. Nothing SHALL animate in a continuous loop except loading or "analysis in progress" illustrations, and no animation SHALL block reading or scrolling.

#### Scenario: Section enters the viewport
- **WHEN** a section scrolls into view
- **THEN** its content fades and rises into place once, without blocking scrolling

### Requirement: Reduced motion and no-JavaScript show static content
When the visitor's system requests reduced motion, or JavaScript is unavailable, the site SHALL show all content in its final state without scroll-driven or entry animations.

#### Scenario: Reduced motion
- **WHEN** the page is opened with `prefers-reduced-motion: reduce`
- **THEN** all sections and media are visible in their final state and nothing moves on scroll

#### Scenario: JavaScript disabled
- **WHEN** the page is opened with JavaScript disabled
- **THEN** all text and media are visible and readable
