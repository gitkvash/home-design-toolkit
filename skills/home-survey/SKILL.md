---
name: home-survey
description: Turn a floor plan screenshot, photos and a few tape measurements into a trustworthy master plan with tolerances and an open-questions list. Use at the start of any renovation or layout job, when plan numbers disagree, or when deciding what to measure on site.
---

# Home survey

A plan that looks precise is often a phone screenshot. This skill builds the **source of truth** every later
design is checked against.

## 1. Collect, in order of trust

1. **Tape or laser measurements** you took (best).
2. **Photos of the stripped room** with a known reference (ceiling height by laser) — usable to about ±5 cm on heights, ±10 cm on widths.
3. **The architect's / developer's plan** (dimension chains beat drawn lines).
4. **A screenshot of a plan** scaled from pixels (±3 cm only if you can validate it, see step 2).
5. **Memory and assumption** (always flagged).

Write the winner for each number in `master-plan.md`, with its source. When a better source arrives, replace the
number and keep a one-line note of what changed and why. Never patch silently.

## 2. Validate scale before trusting a plan image

- Anchor the pixel scale on **two independent dimensions** (e.g. one room width and the total depth from the outer
  dimension chain). If they agree within ~0.5 %, the scale is good.
- Compute every room's area from your numbers and compare with **the area labels printed on the plan**. In the
  worked example six rooms matched their labels within 0.03 m², which is what justified quoting ±3 cm.
- If a label does not match, one of your numbers is wrong: find it before designing anything.

## 3. Photo survey (stripped room)

- One photo per wall, camera square to the wall, both ceiling line and floor line visible.
- Convert pixels to cm using the ceiling height as the vertical scale; a wall square to the camera has the same
  scale sideways.
- Cross-check: measure the same feature (a window head, a sill) on two different walls. In the example they agreed
  within 3 cm, which gave the tolerance.
- Photos often show openings **bigger than the plan says** (a 157 cm window was 210; a 189 cm pier was 110). Re-read
  every opening from photos before building on it.
- If photos and plan disagree on a wall length, keep the document you are being priced on, fit openings into it in
  the proportions the photos give, and put "corner to corner along that wall" on the measure list.

## 4. Things plans hide (check each)

- **Wall thickness varies.** A balcony back wall was 12 cm on the plan and ~51 cm once measured; the floor area gain of a
  glazing change swings by a factor of three. Measure at a door reveal.
- **Windows and doors are often not drawn at all.** Mark each as measured / photographed / proposed.
- **Boxed corners are usually pipes.** A notch in a bathroom corner is the soil stack; its size decides where the door and WC can go.
- **A "room" on the plan can be an alcove.** A 0.86 m² label next to a bedroom was the end of its wardrobe alcove.
- **Ceiling height:** slab-to-slab ≠ finished height. If you will lower the ceiling (lights, ducts), model the lowered one and record the gap.
- **Which way the front door opens** and what is behind it.

## 5. Output

`master-plan.md` containing: room table (name, interior W × D, area, ceiling), opening schedule (wall, offset from
corner, width, sill, head, source), fixed services (stack, gas, electrics board, radiators), tolerances, and a
**measure-on-site list** ordered by how many designs depend on each item. Put the two corner-to-corner diagonals
of the largest room first: they cost five minutes and settle everything.

Use `examples/example-flat/plan.json` as the machine-readable form; it feeds `tools/clash-audit` and `tools/room-viewer`.

## Lesson

Owners correct assumptions fast and sometimes twice in one day, in opposite directions. Treat the **latest explicit
statement** as current, flag the one thing a single photo could overturn, and keep the superseded reasoning in the
log so you can see why you moved.
