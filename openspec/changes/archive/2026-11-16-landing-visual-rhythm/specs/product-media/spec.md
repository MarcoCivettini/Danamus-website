# Spec Delta

## MODIFIED Requirements

### Requirement: Media cover every step and platform shown on the page
The media set SHALL include, at minimum, every capture the site shows: the hero recording of the app's preview with its poster, one desktop recording of the editor with its poster for the phone-and-computer section, one phone capture of the editor, and the still used as the sharing preview image. Captures that the page no longer shows MAY stay in the manifest without being required. The page SHALL NOT require a capture of the analysis log.

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
