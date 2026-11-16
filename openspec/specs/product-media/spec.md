# Product Media Specification

## Purpose

Defines how screenshots and screen recordings of the Danamus app are produced, stored, formatted and shown on the website, so that the site shows the real product and its media can be replaced without touching the page structure.

## Requirements

### Requirement: Media show the real app
Every screenshot and recording on the site SHALL be captured from the running Danamus app (desktop build on macOS or Windows, or the iOS app in the iOS Simulator or on an iPhone). Captures MAY be cropped or trimmed, but no pixels SHALL be painted over or redrawn. The site SHALL NOT show mock-ups or redrawn interfaces presented as the app.

#### Scenario: Editor screenshot
- **WHEN** the site shows the editor
- **THEN** the image is a capture of the Danamus editor with an analyzed project, not a recreated interface

#### Scenario: Development overlay in a capture
- **WHEN** a capture shows a development-only overlay at its edge
- **THEN** the capture is cropped to exclude it, and no pixels are painted over it

### Requirement: Placeholders stand in for captures not made yet
Until a capture exists, its manifest entry MAY be marked as a placeholder and point to an image or clip that shows no interface and is visibly labelled "SEGNAPOSTO" with the screen it stands for. Its alternative text SHALL say it is a placeholder. Replacing it with the real capture SHALL only change the manifest entry and its file.

#### Scenario: Capture not made yet
- **WHEN** the iOS editor capture does not exist yet
- **THEN** the page shows an image labelled "SEGNAPOSTO" for that screen, and its alternative text says it is a placeholder

#### Scenario: Real capture arrives
- **WHEN** the real capture is added and its entry is no longer marked as a placeholder
- **THEN** the page shows the capture without changes to the page code

### Requirement: Media cover every step and platform shown on the page
The media set SHALL include, at minimum, every capture the site shows: the video excerpt and poster frame of the hero editor demo with the demo's segment data, one desktop recording of the editor with its poster for the phone-and-computer section, one phone capture of the editor, and the still used as the sharing preview image. Captures that the page no longer shows MAY stay in the manifest without being required. The page SHALL NOT require a capture of the analysis log.

#### Scenario: Missing capture
- **WHEN** a capture shown on the page has neither a file nor a placeholder file in the media set
- **THEN** the build fails with a message naming the missing media entry

#### Scenario: Desktop recording in the platforms section
- **WHEN** a visitor reaches the phone-and-computer section with motion allowed
- **THEN** the desktop frame plays a short silent recording of the desktop editor, with its poster shown until it plays

#### Scenario: Analysis log not required
- **WHEN** the analysis-log capture is removed from the media set
- **THEN** the build still succeeds

#### Scenario: Unused capture removed
- **WHEN** a walkthrough capture that the page no longer shows (for example the video picker) is removed from the media set
- **THEN** the build still succeeds

#### Scenario: Demo data missing
- **WHEN** the demo excerpt, its poster or its segment data file is missing
- **THEN** the build fails with a message naming the missing file

### Requirement: Media are listed in one manifest
Every media item SHALL be declared in a single manifest that gives its id, file, platform, app screen, alternative text in Italian, pixel size and capture date. Pages SHALL reference media only by manifest id.

#### Scenario: Replacing the footage
- **WHEN** a capture is replaced by a new file with the same manifest id
- **THEN** the page shows the new capture without changes to the page code

### Requirement: Media are optimized for the web
Screenshots SHALL be served in modern formats (AVIF or WebP with a fallback) at sizes matching their display width, including 2x versions. Recordings SHALL be short silent loops (at most 15 seconds) in MP4 (H.264) with a poster image, and SHALL load only when near the viewport.

#### Scenario: Recording below the fold
- **WHEN** the page loads and a recording is far below the viewport
- **THEN** the recording file is not downloaded until the visitor scrolls near it

#### Scenario: Recording before it plays
- **WHEN** a recording is in view but not yet playing
- **THEN** its poster image is shown in its place

### Requirement: Recordings respect reduced motion
Recordings SHALL autoplay muted only when reduced motion is not requested; with reduced motion they SHALL show the poster image and play only on explicit request.

#### Scenario: Reduced motion
- **WHEN** a visitor with `prefers-reduced-motion: reduce` reaches a recording
- **THEN** the poster is shown and the video does not start by itself

### Requirement: Media carry no private data
Captures SHALL NOT show personal file paths, user names, notifications, other apps or private project names; project names visible in captures SHALL be neutral demo names.

#### Scenario: Project list capture
- **WHEN** a capture shows the project list
- **THEN** project names are demo names and no personal path or notification is visible

### Requirement: Footage rights are tracked
The manifest SHALL record the source of the match footage shown in each capture and whether it is cleared for public use. The site SHALL NOT be published at a public URL with footage marked as not cleared.

#### Scenario: Uncleared footage
- **WHEN** a capture's footage is marked as not cleared and the public deployment runs
- **THEN** the deployment fails and names the capture

### Requirement: Captures are free of system interruptions
iOS captures SHALL be taken from the iOS Simulator with the status bar overridden to 9:41, full battery and full signal, recording only the simulated device screen. Desktop captures SHALL record only the Danamus window, so notifications, the menu bar, the Dock and other apps never appear in a screenshot or a recording.

#### Scenario: Notification during a desktop recording
- **WHEN** a system notification appears on the Mac while the desktop recording is running
- **THEN** the recorded video does not contain it

#### Scenario: iOS status bar
- **WHEN** a visitor looks at any iOS screenshot or clip
- **THEN** the status bar shows 9:41 and a full battery, and no notification banner is visible

### Requirement: Demo media come from a curated project
The hero demo's video excerpt and segment data, and the problem timeline's rallies, SHALL be generated by a repository script from a Danamus project whose segments the author curated by hand, reading the app's data without modifying it. The data file SHALL record the project name, source file, excerpt range and generation date. The excerpt SHALL be H.264 with no audio, at most 3 MB, and its footage SHALL be tracked in the media manifest.

#### Scenario: Regenerating the demo
- **WHEN** the author runs the script after changing the project's segments in the app
- **THEN** the data file and the excerpt are rewritten with the new segments, and the app's database is unchanged

#### Scenario: Excerpt size
- **WHEN** the excerpt is generated
- **THEN** it has no audio track and is at most 3 MB

#### Scenario: Footage not cleared
- **WHEN** the demo footage is marked as not cleared in the manifest
- **THEN** the rights check fails and the site is not published
