# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
