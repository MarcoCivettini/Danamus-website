# hero-editor-demo Specification

## Purpose
Defines the interactive editor demo shown in the landing page hero: a read-only imitation of the Danamus mobile editor that plays a real analysed match and lets visitors explore its segments.

## Requirements

### Requirement: The demo shows a real analysed match
The hero demo SHALL show, inside a phone frame, an imitation of the app's mobile editor: a video excerpt of a real match, a timeline in which the valid segments of that match's Danamus project are drawn in green, a playhead, play and pause, a seek bar with current time and duration, and a counter of the current segment. The segments SHALL come from the project's saved edits, not be drawn by hand.

#### Scenario: Segments match the project
- **WHEN** the demo is shown
- **THEN** every green segment on the timeline starts and ends at the times saved in the project, within one video frame

#### Scenario: Current segment
- **WHEN** the playhead is inside a green segment
- **THEN** the counter reads "Segmento N di M" for that segment and the segment is highlighted; outside a segment the counter says it is a pause

### Requirement: The demo plays on its own
With motion allowed, the demo SHALL start playing the excerpt muted and in a loop once the hero is in view, without any action from the visitor. With reduced motion, it SHALL NOT start on its own and SHALL show a play control instead.

#### Scenario: Autoplay
- **WHEN** a visitor opens the page with motion allowed
- **THEN** the excerpt plays muted, the playhead moves along the timeline and the time counter advances

#### Scenario: Reduced motion
- **WHEN** the page is opened with `prefers-reduced-motion: reduce`
- **THEN** the demo shows the first frame and the segments, and plays only after the visitor activates play

### Requirement: Playback jumps from one segment to the next
While the demo plays, it SHALL show only the valid segments: when playback reaches the end of a segment, or starts from a pause, it SHALL jump to the start of the next segment, and after the last segment it SHALL return to the first. The visitor SHALL still be able to scrub into a pause while paused.

#### Scenario: End of a segment
- **WHEN** playback reaches the end of segment N
- **THEN** the video continues from the start of segment N+1 without showing the pause in between, and the counter reads "Segmento N+1 di M"

#### Scenario: Play from a pause
- **WHEN** the visitor scrubs into a pause and presses play
- **THEN** playback starts from the start of the next segment

#### Scenario: After the last segment
- **WHEN** playback reaches the end of the last segment
- **THEN** it continues from the start of the first segment

### Requirement: The visitor can pause and move through the match
The visitor SHALL be able to pause and resume playback, drag the timeline or the playhead to any point, and click or drag the seek bar. Seeking SHALL update the video, the playhead, the time counter and the segment counter together. Dragging the timeline on a touch screen SHALL NOT block vertical page scrolling.

#### Scenario: Scrub the timeline
- **WHEN** the visitor pauses and drags the timeline to a green segment
- **THEN** the video shows that moment, the playhead sits on it and the counter names that segment

#### Scenario: Vertical swipe over the demo
- **WHEN** a visitor on a phone swipes vertically over the timeline
- **THEN** the page scrolls as usual

### Requirement: The demo is read-only and stays on the page
The demo SHALL NOT let the visitor change segments, export, open other screens or leave the page. Controls the app has for those actions MAY be shown for realism but SHALL be inert and SHALL be marked as not available to assistive technology. The demo SHALL make no network request outside the site.

#### Scenario: Pressing Esporta
- **WHEN** the visitor clicks or taps the demo's "Esporta" button or a segment-editing control
- **THEN** nothing changes: no file is produced, no segment changes and the page stays where it is

#### Scenario: Requests
- **WHEN** the demo loads and plays
- **THEN** every request it makes goes to the site's own origin

### Requirement: The demo is usable without a pointer and without JavaScript
Play and pause SHALL be a keyboard-operable button, and the timeline SHALL be operable as a slider with the arrow keys, announcing the current time. Without JavaScript the demo SHALL show a still frame of the match with the segments drawn on the timeline, and the hero SHALL stay complete.

#### Scenario: Keyboard
- **WHEN** a keyboard user tabs into the demo and presses the arrow keys on the timeline
- **THEN** the playhead moves by a few seconds per key press and the new time is announced

#### Scenario: JavaScript disabled
- **WHEN** the page is opened with JavaScript disabled
- **THEN** the demo shows the poster frame and the green segments, and no control appears to work

### Requirement: The demo does not slow down the first view
The demo SHALL show its poster frame immediately and SHALL start downloading the video only after the page has loaded. The largest contentful paint SHALL NOT depend on the video.

#### Scenario: First load
- **WHEN** the landing page is loaded on a throttled mobile connection
- **THEN** the hero is painted from the poster and the video request starts after the load event
