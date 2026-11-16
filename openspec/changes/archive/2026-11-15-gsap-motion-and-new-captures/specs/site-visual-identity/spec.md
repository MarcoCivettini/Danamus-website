# Spec Delta

## MODIFIED Requirements

### Requirement: Motion is subtle and tied to scrolling
Animations SHALL be reveals, fades, scale or position changes tied to scroll position or entry into the viewport, and transitions on interactive elements. Page scrolling MAY be smoothed, but SHALL follow the visitor's input without hijacking it: no scroll snapping, no locked sections, and the native scrollbar, keyboard scrolling and in-page anchor links SHALL keep working. Headlines MAY reveal word by word, device frames MAY move with a parallax of at most 10% of their height, and cards MAY show a pointer-following highlight on devices with a hovering pointer. Nothing SHALL animate in a continuous loop except loading or "analysis in progress" illustrations, and no animation SHALL block reading or scrolling.

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
- **THEN** no pointer-following highlight is shown and touch scrolling uses the device's native scrolling

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
