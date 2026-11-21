---
name: interior-schemes
description: Generate, compare, review and prune interior layout variants for a room or whole home (living room, kitchen-living, bedrooms, hall, corridor, storage). Use when the owner wants design options, a second opinion on a layout, or help choosing between schemes.
---

# Interior schemes

The example project produced ~50 layouts for six rooms and then deleted about half. What survived was shaped by
a few rules about *how* to generate and prune variants.

## 1. Turn the brief into hard constraints first

Ask for, and write down, in this order:

1. Fixed things: doors (and which way they open), windows, radiators, pipes, gas, the room's real dimensions.
2. Non-negotiables stated by the owner ("kitchen on the east wall, full run to the corner", "no door from the
   hall into the studio", "bed head on the east wall", "bedroom 2 is a workshop for now, a bedroom later").
3. Appliance and furniture list with real sizes.
4. Use pattern: who cooks, who works from home, where guests sit, what must be hidden.

When the owner does not say an orientation, default to their last stated preference and *ask before switching*.

## 2. Generate comparable schemes

- Produce 3-6 per room. **At least one is plain**: ordinary arrangement, ordinary furniture, no novel devices.
  A set of only clever answers (swivel TV poles, projectors, bar ledges) gives nothing to compare against.
- "Plain" means no planning devices, **not** low detail. Furnish every scheme fully: real-size pieces, rug, curtains,
  lamps, a palette and key-pieces list.
- Make each scheme fill a gap the others leave (a table instead of a sink under a big window, an L-kitchen with
  island-like benefits but no island services, somewhere to work, storage beyond the kitchen).
- Give each a one-line note naming the **tight side** and the trade-off. Honest notes are what the owner uses.
- Build every piece as one object, or as separate objects where they legitimately overlap (sofa + chaise,
  lamp stem + arc). Otherwise the audit reports false overlaps.

## 3. Review against more than clearances

The audit passes schemes that still fail on:

- **Sightlines and glare.** A TV between two windows is backlit all day and a mirror at night. A projector aimed at
  the brightest wall with no blackout fails.
- **Wall capacity.** A 355 cm glazed wall has two piers; a "TV pier" 110 cm wide holds a 92 cm unit with 9 cm margins.
- **Can it be built without altering the facade?** A 92 cm worktop crossing a 90 cm sill needs a facade cut.
  That is not a kitchen option.
- **Obstruction of the thing it protects.** A TV on a floor pole 48 cm from glass blocks the view it was for.
- **Collision with a later decision.** A kitchen unit planned where a second door might open.

## 4. Pruning rules (learned the hard way)

- **Never edit an existing scheme in place** once the owner has compared or priced it. Add new ones.
- **Delete, don't patch,** a scheme whose premise a survey or decision killed. Leave a one-line comment saying
  why, and **do not re-letter survivors**: the gaps are the record of what was tried.
- Exception: a rule that must hold in all schemes (every door opens freely, new window position) *does* justify
  editing; then re-run the audit and confirm unaffected schemes' numbers are unchanged.
- When the owner says "delete everything that doesn't have X", do it in one pass and archive the old file.

## 5. Typical decisions that came out of this process

- Kitchen run on the long solid wall to the corner; tall units (fridge, oven tower, larder) at the end that is
  furthest from the door; hob mid-run, never at a glazed end that will have curtains.
- An island needs ~100 cm aisle on the run side and stools on the room side; give it **no power** if floor chasing is not
  wanted, and say so in every scheme.
- Bedroom bed head on the wall that gives the longest unobstructed side; keep ≥ 60-90 cm strip at the foot.
- A second bedroom can be an office/workshop with a fold-out sofa now and a bed later: design for the end state
  but furnish for now.
- Hall/corridor: treat as a hub; furnish only what the swings allow; storage over doors and shallow wardrobes beat
  floor-standing pieces.

## 6. Output format per scheme

```
id, name, one-line idea
plan notes: tight side, route cm, clear floor m2
furniture list with sizes
palette + key pieces
audit: out 0 / ovl 0 / swing 0 / route cm
cost class (cheap / mid / premium)
```
