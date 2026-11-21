---
name: layout-clearances
description: Check that a furniture layout actually works - door swings, walking routes, aisles, clearances, items through walls - using a geometric audit rather than eyeballing. Use when placing furniture, reviewing a layout, or before approving any design variant.
---

# Layout clearances

A render looks fine long after the layout stopped working. In the worked example the first audit pass found
**11 faults** in layouts that had been judged good by eye: plants in door swings, towel rails hung on a boxed duct
that was not a wall, chairs facing away from their desk, a lamp inside a bed, lockers projecting 24 cm into a corridor.

## Run the audit

```
node tools/clash-audit/audit.mjs examples/example-flat/plan.json [roomId]
```

It rasterises the room at 4 cm, treats anything between 35 cm and 1.8 m as an obstacle and reports:

- **out**: how far an item pokes through a wall.
- **ovl**: pairs interpenetrating by > 4 cm on all axes (mark intended nesting with `nestIn`).
- **swing**: obstacles inside a hinged door's quarter-circle (doors that open *out* or slide are skipped).
- **route**: widest bottleneck from the door to each target (window, bed side, far corner), capped by the door width.
- **clear floor**: free m².

Exit code 2 means a fault. Narrow routes are warnings you judge, not automatic failures.

## Benchmarks that held up

| Thing | Target |
|---|---|
| Main walking route | ≥ 90 cm comfortable, 75 cm minimum in secondary rooms |
| Kitchen aisle between runs/island | ≥ 100 cm, 120 cm if two people cook |
| Space in front of WC | ≥ 60 cm; WC centre ≥ 45 cm from any side face |
| Basin aisle | ≥ 70 cm |
| Strip at the foot / side of a bed | ≥ 60-90 cm on the side you enter from |
| Door leaf | 80 cm normal, 70-75 cm where wall is short; a flush lining if the wall beside the door is under ~90 cm |
| Door swing | whole arc clear of furniture, including plants and lamps |
| Seating to TV | 2-3 m for a 55-65" screen |

Tight numbers are fine when they are the room's own geometry (a laundry cupboard that leaves 57 cm to stand is what a
laundry cupboard is). Write that in the scheme's note.

## Rules that save rework

1. **Every door must open freely in every scheme.** Decide which way each opens first (a front door opening *into* a
   hall folds flat against a wall; opening out may block a landing). A hinged store door opening into the corridor
   cleared all 10 corridor schemes; a sliding leaf collided with furnished end walls.
2. **A wall you cannot furnish is not free.** Windows, radiators, openings and doors use up wall; count the solid
   metres before assigning a tall unit or a TV to it.
3. **Anything standing in front of glass backlights or mirrors it.** TVs on the glazed wall are a recurring bad idea.
4. **Don't trust a note that says "clears the radiator".** Measure it.
5. **Audit the audit.** Three of its own bugs hid real faults: a route seeded against the door wall (every room read
   64 cm), a clearance field with no wall margin, and a destination test that picked a 5 cm sliver behind a wardrobe.
   Test it on a deliberately bad room (see `tools/clash-audit/audit.test.mjs`).

## What the audit cannot measure (review these by hand)

Sightlines, glare and backlight, what a wall can structurally carry, whether a kitchen run needs the facade altered,
privacy from the neighbours, noise, and where the heat goes. See `interior-schemes` for the review checklist.
