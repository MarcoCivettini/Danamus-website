# Spec Delta

## MODIFIED Requirements

### Requirement: Layout separates content with space, not boxes
Sections and content groups SHALL be separated mainly by whitespace, as in the app's design system. Borders and boxed cards SHALL be limited to device frames, glass surfaces, full-width section bands, and filled cards for the audience groups and the pricing plans. Filled cards SHALL use the app's elevated surface colours, with at most a hairline border.

#### Scenario: Feature list
- **WHEN** a section lists several benefits
- **THEN** they are separated by spacing, not by bordered boxes

#### Scenario: Audience cards
- **WHEN** the audience section is shown
- **THEN** its cards use an elevated surface colour from the app palette and no border thicker than a hairline

### Requirement: Motion is subtle and tied to scrolling
Animations SHALL be reveals, fades, scale or position changes tied to scroll position or entry into the viewport, and transitions on interactive elements. Page scrolling MAY be smoothed, but SHALL follow the visitor's input without hijacking it: no scroll snapping, no locked sections, and the native scrollbar, keyboard scrolling and in-page anchor links SHALL keep working. Headlines MAY reveal word by word, device frames MAY move with a parallax of at most 10% of their height, cards MAY show a pointer-following highlight on devices with a hovering pointer, and drawn illustrations such as the problem timeline MAY change shape in step with the scroll position. Nothing SHALL animate in a continuous loop except loading or "analysis in progress" illustrations, and no animation SHALL block reading or scrolling.

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

#### Scenario: Scroll-linked illustration
- **WHEN** the visitor scrolls through the problem section
- **THEN** the timeline changes in step with the scroll position, the page keeps scrolling normally, and the section is never pinned

## ADDED Requirements

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
