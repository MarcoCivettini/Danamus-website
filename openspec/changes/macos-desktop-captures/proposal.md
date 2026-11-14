# Proposal

## Why

The site's macOS media is weak: a 1x screenshot of a development build, cropped above the dev indicator, and no desktop recording at all. Visitors therefore cannot see how the desktop editor works. On 14 Nov 2026 the user agreed to new captures from the production build, recorded window-only so that no notification or private project name could appear.

## What Changes

- Replace the macOS still with a new 1280×800 capture of the editor. It comes from the production build (`5517d29`), shows the full window, has no dev indicator, and uses a demo library with only one neutral project ("Progetto senza titolo"). The ITTF/WTT Doha 2025 clip is already cleared.
- Add a 15 s desktop recording of the editor. It shows a rally selected on the timeline, its end lengthened from 0:57 to 1:02, then playback. It is H.264, silent, 1280×800, about 0.6 MB, with a poster taken from its first frame.
- The platforms section's macOS window frame plays this recording through the existing `Clip` component: lazy loaded, muted autoplay with motion allowed, poster only with reduced motion.
- Fix `scripts/capture/record-window.swift`: a command-line process must open its window-server connection (`NSApplication.shared`) before ScreenCaptureKit streams, otherwise CoreGraphics asserts. The script was verified: a notification shown on screen during a recording did not appear in the video.
- Document the capture procedure in the README (temporary demo library, compiled recorder).

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `product-media`: the media set must include a desktop recording of the editor, shown in the platforms section's macOS frame.

## Impact

- `src/data/media.ts` (new `macos-editor` still, `poster-macos-editor`, `clip-macos-editor`; `macos-home` removed), `src/components/sections/Platforms.astro`, `src/assets/media/macos/`, `public/media/macos-editor.mp4`, `scripts/capture/record-window.swift`, README.
- Retina 2x captures are not possible on this Mac (external 1080p display at 1x). The captures are 1x, as before, but uncropped and from the production build.
