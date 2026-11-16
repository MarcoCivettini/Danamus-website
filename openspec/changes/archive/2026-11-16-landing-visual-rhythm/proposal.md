# Proposal

## Why

The landing page reads like a collection of mockups rather than a product page. It shows nine device frames, eight of them phones with the same dark UI, and every section follows the same pattern: eyebrow, huge headline, grey paragraph, device. Meanwhile the product's core idea, 20 minutes of video that become 5 minutes of play, exists only as text. There is no real photography (for example a phone on a tripod by the table), so the variety has to come from graphics and motion drawn in code.

## What Changes

- **Timeline as the main visual.** The problem section gets a timeline drawn in code. A 20-minute bar of rallies and pauses collapses as you scroll, leaving only the 5 minutes of play. It sits on a full-width band with a different surface colour.
- **Far fewer app captures.** The landing page goes from 9 device frames to 3: the phone in the hero (preview recording) and one composite in the phone-and-computer section (Mac window with the editor recording plus a phone with the editor screenshot).
- **Compact "Come funziona".** The five steps stay in the app's order, each with a title, a sentence and a small icon drawn in code. The sticky stage with five phones and the five inline phones are removed. **BREAKING** for the walkthrough requirement: steps no longer have their own capture.
- **Privacy as a diagram.** The phone with the project-list screenshot is replaced by a diagram drawn in code. Video, analysis and cut video stay inside the device, and nothing goes to a server. Like the problem section, it sits on a full-width band.
- **Audience cards.** "Per chi è" shows the three groups as cards on a filled surface, each with its own icon.
- **Varied rhythm.** Sections alternate between centered and left-aligned text and between page background and full-width bands. Headings come in different sizes, with the largest size kept for the hero and the problem section.
- **Media requirements follow the page.** The manifest keeps every existing capture, but the build only requires the media the page actually shows.

The copy written in `rewrite-copy-pricing-legal` does not change, apart from labels that the new visuals need (timeline legend, diagram labels).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `landing-page`:
  - new timeline requirement in the problem section;
  - limit on device frames;
  - walkthrough without per-step captures;
  - privacy diagram instead of a capture;
  - platforms composite;
  - audience cards.
- `site-visual-identity`:
  - sections must vary in layout and rhythm;
  - filled cards allowed for the audience and the pricing plans;
  - the motion requirement covers the timeline compression.
- `product-media`: the required media set shrinks to what the landing page shows.

## Impact

- **Precondition:** `rewrite-copy-pricing-legal` must be archived first, so its delta specs (audience, problem section, walkthrough wording) are in `openspec/specs/` before this change modifies them.
- **Code:**
  - `src/components/sections/` (Problem, HowItWorks, Audience, Privacy, Platforms, plus spacing and alignment in the others);
  - a new `Timeline` component and a small set of inline SVG icons;
  - `src/scripts/motion.ts` (timeline scrub);
  - `src/styles/global.css` (band and card styles, a smaller heading size);
  - `src/data/media.ts` (`requiredMedia`).
- **Media:** no new captures. Unused captures stay in the repository and in the manifest.
- **Dependencies:** none new. GSAP, ScrollTrigger and Lenis are already present.
- **Performance:** fewer images on the page. Expected lighter page weight, and LCP stays on the hero poster.
