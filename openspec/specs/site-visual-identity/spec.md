# Site Visual Identity Specification

## Purpose

Defines how the website applies the Danamus brand and the app's design language: logo usage, colours, typography, layout, glass surfaces and motion, so that the site looks like the same product as the app.

## Requirements

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
Sections and content groups SHALL be separated mainly by whitespace, as in the app's design system. Borders and boxed cards SHALL be limited to device frames, glass surfaces, full-width section bands, and filled cards for the audience groups and the pricing plans. Filled cards SHALL use the app's elevated surface colours, with at most a hairline border.

#### Scenario: Feature list
- **WHEN** a section lists several benefits
- **THEN** they are separated by spacing, not by bordered boxes

#### Scenario: Audience cards
- **WHEN** the audience section is shown
- **THEN** its cards use an elevated surface colour from the app palette and no border thicker than a hairline

### Requirement: The navigation bar is a glass surface
The navigation bar SHALL stay at the top of the viewport and use the app's glass effect (translucent dark background with blur and a 10%-white hairline border).

#### Scenario: Scrolling over media
- **WHEN** the page scrolls under the navigation bar
- **THEN** the bar stays fixed and the content behind it shows blurred

### Requirement: Motion is subtle and tied to scrolling
Animations SHALL be reveals, fades, scale or position changes tied to scroll position or entry into the viewport, and transitions on interactive elements. Page scrolling MAY be smoothed, but SHALL follow the visitor's input without hijacking it: no scroll snapping, no locked sections, and the native scrollbar, keyboard scrolling and in-page anchor links SHALL keep working. Headlines MAY reveal word by word, device frames MAY move with a parallax of at most 10% of their height, the page background MAY show a glow that follows a hovering pointer, and drawn illustrations such as the problem timeline MAY play a short sequence once when they enter the viewport. Nothing SHALL animate in a continuous loop except loading or "analysis in progress" illustrations and the hero editor demo's video, and no animation SHALL block reading or scrolling.

#### Scenario: Section enters the viewport
- **WHEN** a section scrolls into view
- **THEN** its content fades and rises into place once, without blocking scrolling

#### Scenario: Headline reveal
- **WHEN** a section headline scrolls into view
- **THEN** its words appear in reading order within about one second and the full headline stays readable to screen readers as a single text

#### Scenario: Anchor link with smooth scrolling
- **WHEN** a visitor activates an in-page link such as "Vai al contenuto" or a navigation link
- **THEN** the page scrolls smoothly to the target and keyboard focus moves to it

#### Scenario: Hero device on scroll
- **WHEN** the visitor scrolls the hero in any supported browser, including Safari
- **THEN** the phone frame straightens and scales to its final size in step with the scroll position

#### Scenario: Touch device
- **WHEN** the page is used on a device without a hovering pointer
- **THEN** no pointer-following glow is shown and touch scrolling uses the device's native scrolling

#### Scenario: Scroll-linked illustration
- **WHEN** the problem timeline enters the viewport
- **THEN** its sequence plays once while the page keeps scrolling normally, and the section is never pinned

### Requirement: Reduced motion and no-JavaScript show static content
When the visitor's system requests reduced motion, or JavaScript is unavailable, the site SHALL show all content in its final state without scroll-driven, entry or pointer-following animations, and page scrolling SHALL be the browser's native scrolling. If the motion script fails to run, all content SHALL become visible within 3 seconds.

#### Scenario: Reduced motion
- **WHEN** the page is opened with `prefers-reduced-motion: reduce`
- **THEN** all sections and media are visible in their final state, nothing moves on scroll and scrolling is not smoothed

#### Scenario: JavaScript disabled
- **WHEN** the page is opened with JavaScript disabled
- **THEN** all text and media are visible and readable

#### Scenario: Motion script fails
- **WHEN** the motion script does not load or throws before initialising
- **THEN** all content is visible in its final state within 3 seconds

### Requirement: Sections vary in layout and rhythm
Consecutive sections of the landing page SHALL NOT all share the same layout. The page SHALL include at least two full-width bands on an elevated surface colour, SHALL alternate centered and left-aligned section headers, and SHALL keep the largest headline size for the hero and the problem section only, with other section headlines one step smaller.

#### Scenario: Bands
- **WHEN** a visitor scrolls the whole landing page
- **THEN** at least two sections span the full viewport width on a surface colour different from the page background

#### Scenario: Alignment
- **WHEN** the section headers are compared from top to bottom
- **THEN** no more than two consecutive sections use the same alignment

#### Scenario: Headline sizes
- **WHEN** the section headlines are compared
- **THEN** only the hero and the problem section use the largest size; the other sections use a smaller one

### Requirement: A green glow follows the pointer behind the content
On every page, with a hovering pointer and motion allowed, the site SHALL show a soft, blurred accent-coloured glow on the page background that follows the pointer smoothly, including over the full-width bands. It SHALL sit behind text, media and cards, SHALL NOT capture pointer events and SHALL NOT lower body text contrast below 4.5:1. Otherwise no glow SHALL be shown.

#### Scenario: Moving the mouse
- **WHEN** a visitor moves the mouse over any page
- **THEN** a green glow on the background follows the pointer, behind the content, and links and buttons under it still work

#### Scenario: Over a band
- **WHEN** the pointer is over the problem or privacy band
- **THEN** the glow is visible on the band's background too

#### Scenario: No glow
- **WHEN** the page is used on a touch-only device, with reduced motion, or with JavaScript disabled
- **THEN** no glow is shown

#### Scenario: Text contrast with the glow
- **WHEN** the glow is directly behind secondary text
- **THEN** that text still has a contrast ratio of at least 4.5:1
