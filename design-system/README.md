# RackTrack

**Ground truth, made visible.** RackTrack reads a physical rack from one phone sweep, then checks every device, port and cable against the live network and the records. The brand has one job: make the gap between *what's on file* and *what's in the cabinet* visible, and then show that gap closing.

This system replaces the previous navy/cyan look. It was designed with the new 3D home page, and all the choices below come from the data hall rather than from generic SaaS.

## The idea in one line

Records **describe** a rack; RackTrack **knows** it. Every visual device comes from that contrast:

- **The rack** is the protagonist: a pale-aluminium cabinet full of graphite equipment, the one light object in a dark room.
- **The record ghost** is a dashed steel-blue wireframe showing what the CMDB believes. It drifts away from the rack, then reconciles back into it.

## Colour: two states, borrowed from a switch

The palette is almost colourless on purpose: mineral **paper**, **graphite** ink and **hall** black. Colour is kept for meaning, and the meaning comes straight from the front panel of network gear:

| Token | Means | Rule |
|---|---|---|
| `link` / `link-ink` | **Verified**: the port LED of a live link | `link` is light (glows, outlines, LEDs, dots). `link-ink` is the text version. |
| `drift` / `drift-ink` | **Mismatch**: the records and the rack disagree | Always pair it with ▲ or a word. It's the only warm colour in the system. |
| `record` / `record-ink` | **What the paperwork says** | Dashed lines and wireframes, never solid fills. |

A unit's life on screen is *neutral → amber → green*. Don't use green or amber decoratively; if something is green, it has been verified.

**Themes.** `paper` is the default. `hall` is the same system with the lights down; the home page fades into it for the fleet chapter and back out for evidence. `hall` is fixed dark in both themes for the reticle, the phone screen and the dark chapter.

## Typography: one voice, one readout

- **Schibsted Grotesk** (sans) is used for everything a person reads: headlines, body, nav, buttons and figures. Headlines are **one weight (500), sentence case, one plain sentence**, tracked tight (−0.04 to −0.045em) with leading at 1.0 or below and a short measure (11–12ch). There are no bold/light splits, no italics and no gradient words.
- **JetBrains Mono** (machine) is only for what a device or a log would print: `U37`, `TOR-A`, `44/48 linked`, `2026-09-23 14:02 UTC`, the evidence slip and the 3D tags. If a label printer could have printed it, it's mono. Nothing else is mono, and nothing on the page is uppercase.

Load both from Google Fonts:
`family=Schibsted+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500`

**Copy length.** One headline and one sentence per section. No eyebrow labels, no chip lists, no paragraphs. The 3D does the explaining; words only name what you're looking at.

## Shape and space

- **Square corners.** Hardware is rectilinear: `radius-sm` (2px) for tags, `radius-md` (3px) for buttons. The only rounded object is the phone (`radius-device`), so it reads as a device, not UI.
- **Rules, not cards.** Use hairlines (`rule`) to separate content. The only thing that casts a shadow (`shadow-slip`) is an object resting on the page: the evidence slip or the phone dock.
- **Units are content.** Rack units, device IDs and port counts appear on the 3D and in the copy, never as decorative labels. Numbers are real figures from the product.

## Charts and analytics cards

Analytics cards use the same meaning rules as everything else: **green = verified, amber = mismatch, grey = neutral or free**. Values and labels are always ink, never the series colour.

- **Card:** `paper-raised` background, 1px `rule` border, radius 3px, 16px padding, no shadow. Title in sans 14px; source ("R07 · 12 sweeps") in mono 10.5px `ink-muted`; one headline figure in sans 34px.
- **Pick the form by the job:** line + area for change over time, the 42-unit strip for rack capacity, a donut for a two-part whole (linked vs free ports), a heatmap for mismatches by row × week, horizontal bars for comparing categories, and progress bars for coverage toward 100%.
- **Marks:** 2px lines, 8px bars with radius 4 on a `chart-track`, 2px gaps between cells, recessive `chart-grid` lines, and mono 9px axis text.
- **Heatmaps** use the single-hue amber ramp `heat-1` → `heat-4`, with zero shown as `chart-track`. Never use a rainbow.
- **Every chart has a hover tooltip** (hall background, mono). A legend appears whenever there are two series.
- Mark sample numbers as example data.

## Voice

Plainspoken, specific and slightly dry, like a senior network engineer:

- **Do:** use real units and IDs, and short declaratives. "Walk past it once." "When all three agree, it's verified."
- **Do:** name the rack, the port or the record. Specific beats clever.
- **Don't:** use "revolutionary", "seamless", "AI-powered" as an adjective, exclamation marks or emoji.
- **Positioning line:** *Not an audit tool. Not a DCIM replacement. The intelligence layer underneath both.*

## Motion and 3D

- **Scroll is the timeline.** Each 3D state is a function of scroll position, so scrolling back replays the story in reverse.
- **The cursor is a scanner.** A green reticle reads the device under the pointer, and a torch light follows it.
- **Colour changes carry the story.** Things fade, slide and flip from amber to green; nothing bounces.
- Respect `prefers-reduced-motion`: turn off smoothing, sway, parallax and blinking, and keep every state.

## Logo

The italic **R** mark is kept from the existing brand (Logos group). Use it white-on-black in a square tile at 26px in the nav, followed by the wordmark "RackTrack" in Schibsted Grotesk, weight 700, 17px, tracking −0.02em. Don't recolour the mark green.

## Assets

- **Logos:** `racktrack-mark.jpg`, the R mark on black (source: the current site's `assets/logo.jpg`). An SVG redraw is still to come.
