# Spec Delta

## MODIFIED Requirements

### Requirement: Media cover every step and platform shown on the page
The media set SHALL include, at minimum: captures (iOS or desktop) of video selection, playing-area selection, analysis in progress, editor with timeline and segments, and export; at least one desktop capture and one phone capture for the phone-and-computer section; and one desktop recording of the editor. The page SHALL NOT require a capture of the analysis log.

#### Scenario: Missing capture
- **WHEN** a step or platform shown on the page has neither a capture nor a placeholder file in the media set
- **THEN** the build fails with a message naming the missing media entry

#### Scenario: Desktop recording in the platforms section
- **WHEN** a visitor reaches the phone-and-computer section with motion allowed
- **THEN** the desktop frame plays a short silent recording of the desktop editor, with its poster shown until it plays

#### Scenario: Analysis log not required
- **WHEN** the analysis-log capture is removed from the media set
- **THEN** the build still succeeds
