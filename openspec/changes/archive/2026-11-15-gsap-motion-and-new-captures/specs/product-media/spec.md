# Spec Delta

## ADDED Requirements

### Requirement: Captures are free of system interruptions
iOS captures SHALL be taken from the iOS Simulator with the status bar overridden to 9:41, full battery and full signal, recording only the simulated device screen. Desktop captures SHALL record only the Danamus window, so notifications, the menu bar, the Dock and other apps never appear in a screenshot or a recording.

#### Scenario: Notification during a desktop recording
- **WHEN** a system notification appears on the Mac while the desktop recording is running
- **THEN** the recorded video does not contain it

#### Scenario: iOS status bar
- **WHEN** a visitor looks at any iOS screenshot or clip
- **THEN** the status bar shows 9:41 and a full battery, and no notification banner is visible
