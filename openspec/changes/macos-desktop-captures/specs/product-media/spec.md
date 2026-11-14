# Spec Delta

## MODIFIED Requirements

### Requirement: Media cover every step and platform shown on the page
The media set SHALL include, at minimum: captures (iOS or desktop) of video selection, playing-area selection, analysis in progress, editor with timeline and segments, and export; one capture per platform for the platforms section; and one desktop recording of the editor, shown in the platforms section's macOS frame.

#### Scenario: Missing capture
- **WHEN** a step or platform shown on the page has neither a capture nor a placeholder file in the media set
- **THEN** the build fails with a message naming the missing media entry

#### Scenario: Desktop recording in the platforms section
- **WHEN** a visitor reaches the platforms section with motion allowed
- **THEN** the macOS frame plays a short silent recording of the desktop editor, with its poster shown until it plays
