---
name: lighting-planning
description: Plan home lighting room by room - layers, zones, fixture types, average lux, uniformity, colour temperature, ceiling-gap fit for recessed fixtures, mirror and kitchen lighting, switching and a shopping list. Use when choosing or reviewing lighting for any room or the whole flat.
---

# Lighting planning

Light the flat **zone by zone**, not with one grid. A concept is just one pick per zone; swapping one zone must not
disturb the others.

## Zones that worked

- **Kitchen-living (studio):** kitchen run (spots / track / linear / under-cabinet) · island (2-3 pendants, one big
  pendant, linear pendant, spots, ceiling raft with hidden LED, or none) · lounge (spot grid, wall washing, cove,
  track, linear lines, plafond + sconces) · extras (TV wall, curtain pelmet LED, table pendant, LED under the island,
  sofa floor lamp, desk spot).
- **Bathroom:** ceiling (3 or 2 spots, linear, cove, plafond) · cabin (IP65 spot / linear / niche LED) · mirror
  (light above, backlit mirror, sconces both sides, mirror cabinet with LED) · extras (LED under vanity, night light
  with sensor).
- **Corridor:** ceiling (spot row, linear, shadow lines, wall washing, surface track) · wall (sconces, picture lights,
  wardrobe fronts) · night (foot lights, skirting LED).
- **Bedrooms:** ambient (central or cove), bedside (both sides, own switch), wardrobe, night path; keep it dimmable.

## Numbers (residential, average on the working plane)

| Room | Average lux |
|---|---|
| Living | 100-200 (+ task) |
| Kitchen | 300-500 on worktops |
| Bathroom | 200-300 (mirror task 400+ vertical) |
| Bedroom | 50-150 |
| Hall / corridor | 75-150 |
| Desk | 300-500 |

`tools/quantities/calc.mjs lux --lumens 4000 --area 18` gives a first estimate (utilisation 0.45, maintenance 0.8).
A better model uses cos^n beam spread per fixture, E = I·cosθ/d², plus an indirect part Φ·ρ/(S(1-ρ)) with ρ ≈ 0.55.
That is good to about ±20 %: enough to compare concepts and size fittings, not a DIALux replacement.

## Checks to run on every plan

- Room average ≥ target; **uniformity ≥ 0.40** (0.30 in an open studio).
- Each furniture zone meets its minimum.
- **Recessed fixtures fit the ceiling gap.** Typical heights: downlight 5 cm, adjustable 7, track 5.5, profile 3.5, +1 cm
  for clearance. A flat with a 2.84 m slab and 2.78 m finished ceiling has only 6 cm: plan the ceiling per room
  (concrete = nothing recessed; plasterboard at 2.78 / 2.74 / 2.70 / 2.64 / 2.60) and pick the highest ceiling the chosen
  recessed fixtures fit under.
- Cove light needs plasterboard; pendants 60-85 cm over a table top or ≥ 2.05 m where people walk; spots ≥ 25 cm from a wall.
- **Colour:** spread ≤ 500 K within a room (general + task); 2700-3000 K living and bedrooms, 3000-4000 K kitchen
  and bath task; **CRI ≥ 90** in kitchen, bath and anywhere you judge colour.
- Bathroom: **IP65 over the cabin, IP44 within 60 cm** of it (check your local zones), a mirror light.
- Under-cabinet light whenever there are wall cabinets.
- Window rooms: north light is soft, not "all-day"; do not rely on daylight for the evening plan.

## Switching and wiring

Group fixtures by **scene** (S1 ambient, S2 task, S3 accent...), mark switch points on the plan, and produce a wiring
sheet. Ask for dimmable drivers up front: retrofitting dimming is expensive. Use one sensor-driven night light path
(bedroom → bathroom).

## Handoff

For the electrician: plan with fixture symbols coloured by switching group, ceiling build-up per room, dimension chains
from inner wall faces. For shopping: a bill of materials listing driver counts and lumens.
