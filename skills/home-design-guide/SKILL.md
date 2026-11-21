---
name: home-design-guide
description: Entry point for planning or renovating a home with AI help. Use when someone wants to design a flat or house, choose layouts, furniture, finishes or products, plan a renovation, or asks "where do I start". Routes to the specialist skills and sets the working method (measure first, decide in writing, audit before buying).
---

# Home design guide

This toolkit packages the method used to plan a complete 69 m² flat from a bare shell: survey, layouts,
3D models, kitchen, bathroom, lighting, finishes, product research and purchase decisions. Most of the value is
the **order of work** and the **checks**, not any single design.

## The method in one page

1. **Measure before you design.** Layouts built on a screenshot of a plan went wrong in 7 places in one day. Start
   with `home-survey`. Everything else depends on it.
2. **Write the brief as rules, not wishes.** "Kitchen on the east wall, gas hob mid-run, no power to the island,
   TV on the south wall" is a brief a layout can be checked against. Keep it in a decision log (`renovation-decisions`, Pro).
3. **Make several comparable schemes per room**, plus one plain baseline (`interior-schemes`, Pro). Variants that all use
   clever tricks give you nothing to compare against.
4. **Audit geometry, not notes** (`layout-clearances`). Doors must swing, routes must be wide enough, nothing may
   poke through a wall. Run `tools/clash-audit`.
5. **Plan the wet and technical rooms by rules** (`kitchen-planning`, `bathroom-planning`, `lighting-planning`, Pro).
6. **Choose finishes once, for the whole home** (`finishes-and-quantities`, Pro), then **research products** by price per
   m² and real availability (`product-research`, Pro).
7. **Freeze decisions when you buy.** A bought tile or a booked window ends the discussion: update the model, drop
   the alternatives, stop proposing new ones.
8. **Hand trades a drawing, not a render** (carpenter piece list, tiler layout, electrician sheet).

## Which skill when

| You want to... | Use |
|---|---|
| get dimensions and a trustworthy plan | `home-survey` |
| place furniture, check doors and routes | `layout-clearances` (agent: `layout-auditor`) |

The Pro edition adds `interior-schemes`, `kitchen-planning`, `bathroom-planning`, `lighting-planning`,
`finishes-and-quantities`, `product-research`, `renovation-decisions` and `build-3d-room-model`. Without it, apply
the method above directly: write the brief as rules, keep a decision log, compare products by price per m² with a
reserve, and audit every layout.

## Ground rules for the assistant

- Metric units, centimetres for furniture and clearances, metres for rooms. Convert if the owner uses feet.
- State every number's source and tolerance ("tape-measured", "read off a photo ±10 cm", "assumed").
- Never invent an opening, a pipe position or a wall thickness. Mark it as an assumption and add it to the
  "measure on site" list.
- Local standards beat this toolkit: electrical code, gas rules, fire and waterproofing rules differ by country.
  Say so and tell the owner to confirm with a licensed tradesperson for gas, electrics, structure and waterproofing.
- Do not give personalised financial advice; budgets here are planning tools.
