# Spec Delta

## MODIFIED Requirements

### Requirement: The walkthrough follows the app's real flow
The "come funziona" section SHALL present five steps in the order of the app: choose the video, mark the playing area, automatic AI analysis, manual refinement in the editor, export. Each step SHALL have a short title, one or two sentences and a small illustration drawn by the site (not a capture of the app). The section SHALL NOT contain device frames. The section SHALL say that Danamus does most of the work automatically and that the editor is built for table tennis, so the result can be refined by hand.

#### Scenario: Walkthrough steps
- **WHEN** a visitor reads the "come funziona" section
- **THEN** it shows the five steps in the order video, area di gioco, analisi, rifinitura, export, each with its own title, text and illustration

#### Scenario: Automatic work and manual refinement
- **WHEN** a visitor reads the analysis and editor steps
- **THEN** they say that the analysis finds the rallies on its own and that the editor lets the visitor adjust each rally by hand

#### Scenario: No app captures in the walkthrough
- **WHEN** a visitor looks at the "come funziona" section on any viewport
- **THEN** no device frame, screenshot or recording of the app is shown in it

#### Scenario: Compact on desktop
- **WHEN** the section is viewed in a 1440x900 viewport
- **THEN** all five steps fit within about one and a half viewport heights, with no sticky stage

### Requirement: The privacy section states that videos never leave the device
The privacy section SHALL state that the analysis runs entirely on the user's device and that the video leaves the device only when the user chooses to share or export it elsewhere. It SHALL NOT claim certifications or guarantees beyond that, and SHALL NOT show the app's analysis log. It SHALL illustrate the claim with a diagram drawn by the site, in which the video, the analysis and the cut video stay inside the device and nothing goes to a server, instead of a capture of the app.

#### Scenario: Privacy claim
- **WHEN** a visitor reads the privacy section
- **THEN** it says that the AI runs on the device and that the video is not sent anywhere unless the user shares it

#### Scenario: No analysis log
- **WHEN** a visitor looks at the privacy section
- **THEN** no capture of the analysis log is shown

#### Scenario: Privacy diagram
- **WHEN** a visitor looks at the privacy section
- **THEN** a diagram shows video, analysis and cut video inside a boundary labelled as the visitor's device, no app capture is shown, and the diagram has a text alternative stating the same claim

### Requirement: The platforms section shows Windows, macOS and iOS
The phone-and-computer section SHALL state that Danamus works on both a phone and a computer, and name the supported systems (Windows, macOS, iOS). It SHALL show one composition in which a desktop window plays a recording of the editor and a phone shows the editor, overlapping as a single group, and SHALL NOT need a separate capture for every system.

#### Scenario: Three platforms shown
- **WHEN** a visitor reads the phone-and-computer section
- **THEN** it says the app works on phone and computer, names Windows, macOS and iOS, and shows at least one real capture

#### Scenario: Single composition
- **WHEN** the section is viewed in a 1440x900 viewport
- **THEN** the desktop window and the phone appear as one overlapping group, not as two separate items with their own labels

#### Scenario: Composition on a phone
- **WHEN** the section is viewed in a 390x844 viewport
- **THEN** both devices stay visible and legible without horizontal scrolling

### Requirement: The audience section names who Danamus is for
The audience section SHALL name three groups: creators who promote table tennis, players who record themselves to improve, and people who want to rewatch the play or share it with friends. It SHALL describe the basic use: a phone on a tripod, record, then watch or share only the play. Each group SHALL be shown as a card with its own illustration drawn by the site.

#### Scenario: Three audiences
- **WHEN** a visitor reads the audience section
- **THEN** it names creators, players who want to improve, and people who want to rewatch or share, and mentions recording with a phone on a tripod

#### Scenario: Audience cards
- **WHEN** a visitor looks at the audience section
- **THEN** each of the three groups is a separate card with its own illustration, title and text

## ADDED Requirements

### Requirement: The problem section shows the dead time as a timeline
The problem section SHALL show a timeline drawn by the site that represents a match video of about 20 minutes as rallies separated by pauses, and SHALL show it reduced to the rallies only, about 5 minutes long. With motion allowed, the pauses SHALL collapse as the visitor scrolls through the section, in step with the scroll position, without locking or pinning the page. The timeline SHALL have a text alternative stating the same numbers.

#### Scenario: Timeline compresses on scroll
- **WHEN** a visitor with motion allowed scrolls through the problem section
- **THEN** the pauses in the timeline shrink until only the rallies remain, and scrolling back expands them again

#### Scenario: Timeline without motion
- **WHEN** the page is opened with reduced motion or without JavaScript
- **THEN** the timeline shows both the full 20-minute video and the 5 minutes of play at once, labelled, with nothing moving

#### Scenario: Timeline for screen readers
- **WHEN** a screen reader reaches the timeline
- **THEN** it reads a single text saying that about 20 minutes of video hold about 5 minutes of play

### Requirement: The landing page shows few app captures
The landing page SHALL show at most three device frames: one in the hero and at most two in the phone-and-computer section. Other sections SHALL illustrate their content with typography or graphics drawn by the site.

#### Scenario: Counting device frames
- **WHEN** the landing page markup is inspected at any viewport
- **THEN** it contains at most three device frames, located in the hero and the phone-and-computer section
