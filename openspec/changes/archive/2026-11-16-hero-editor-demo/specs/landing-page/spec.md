# Spec Delta

## MODIFIED Requirements

### Requirement: The hero states what Danamus does
The hero SHALL show a headline saying that Danamus lets the visitor rewatch only the play of a table-tennis match, a subhead naming the use case (a phone on a tripod records the match and Danamus removes the pauses automatically), a short line saying it works on phone and computer, the primary call to action, and the interactive editor demo inside a phone frame (see capability `hero-editor-demo`).

#### Scenario: First screen on desktop
- **WHEN** the page is opened in a 1440x900 viewport
- **THEN** the headline, the subhead, the primary call to action and the top of the editor demo are visible without scrolling

#### Scenario: First screen on a phone
- **WHEN** the page is opened in a 390x844 viewport
- **THEN** the headline and the primary call to action are visible without scrolling

### Requirement: The problem section shows the dead time as a timeline
The problem section SHALL show a timeline drawn by the site from the rallies of a real analysed match, with a caption naming the match, as rallies separated by pauses, and SHALL show it reduced to the rallies only. With motion allowed, when the timeline comes into view it SHALL play once a short sequence: a playhead runs along the bar, the pauses fade and close up, the original length stays visible as an outline labelled with the removed time, and a counter goes from the video length to the play length. A control SHALL replay the sequence. The page SHALL NOT be locked or pinned. The timeline SHALL have a text alternative stating the numbers.

#### Scenario: Timeline compresses on scroll
- **WHEN** a visitor with motion allowed scrolls the timeline into view
- **THEN** within about four seconds the pauses disappear, the rallies close up into a bar about a quarter as long, the outline of the full length stays visible with the removed time, and the counter shows the play length

#### Scenario: Replay
- **WHEN** the sequence has finished and the visitor activates "Rivedi"
- **THEN** the timeline returns to the full video and the sequence plays again

#### Scenario: Timeline without motion
- **WHEN** the page is opened with reduced motion or without JavaScript
- **THEN** the timeline shows both the full video and the rallies only at once, labelled with their durations, with nothing moving

#### Scenario: Timeline for screen readers
- **WHEN** a screen reader reaches the timeline
- **THEN** it reads a single text giving the match, the video length and the play length

#### Scenario: Real data
- **WHEN** the timeline is compared with the curated project's saved edits
- **THEN** it has the same number of rallies, in the same order and proportions
