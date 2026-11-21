---
name: finishes-and-quantities
description: Choose floors, wall tiles, wallpaper, paint, skirting and radiators for a whole home, check colour and undertone harmony, and calculate how much to buy with sensible reserves. Use when selecting finishes, comparing materials, or computing quantities and budget for materials.
---

# Finishes and quantities

## Decide finishes at home level, once

Floors, windows and skirting are bought once for the flat. Store them at **home level** and let them override a
design's own choice in every view. Don't carry floor pickers in every room design: after purchase, the picker should
disappear. A typical plan from the example: one hardwood-look laminate through living areas and bedrooms (also the
kitchen zone), porcelain in the entrance and bath, outdoor tile on the balcony.

Check each choice against use:

- **Kitchen / hall / bath:** porcelain stoneware or water-resistant laminate (class 33 / AC5, moisture-resistant).
  Hall at the front door takes the most abuse; a wood-look porcelain is a safe pairing with laminate inside.
- **Underfloor heating:** check the product allows it (and its thermal resistance).
- **Herringbone and chevron** cost more waste (12-15 %), more laying labour, and show tone differences.

## Colour logic

- **60-30-10:** 60 % wall/floor base, 30 % furniture/secondary, 10 % accent.
- **Keep a single undertone family** between floor, wallpaper and wood furniture (warm with warm). A red-brown hickory floor
  fights a cool grey-green paper.
- **Light reflectance (LRV):** north rooms want warmer, lighter papers; small windowless spaces take a bolder colour.
- Order a **sample** and look at it on the wall in morning and evening light before committing. Photos in shops lie.
- Compute **tone from the product photo** if you scrape: colour (average of the photo's middle), tone (warm/neutral/cool from
  CIE Lab: warm = b* ≥ 5 and a* ≥ -4, or a* ≥ 12) and "plainness" (contrast and fine detail). Room-scene photos read less plain than the product.

## Wallpaper rules

- **Feature wall** on the wall you face when you enter or the bed wall; not on a window or opening wall.
- Plain and warm is the safest start; use a pattern where the room is not busy. Large repeats, thin stripes and
  enveloping colour are current; check trend articles for the year.
- **Hanging style changes quantity.** Free match (plain, stripes), straight match, half-drop, reverse hang
  (textile/linen). Shops rarely publish the repeat: ask or assume (stripes free, geometric straight 53, floral
  half-drop 53 cm). Let the owner override per product.
- Always buy a **reserve**: plain +1 roll for repairs; straight match +10 %; half-drop or textile +15 %; liquid +10 %; murals 0
  (sold as sets sized to the wall).
- Extras: glue (≈ 30 m² per pack, heavy paper 20), primer (≈ 10 l per 83 m²), labour (+15 % straight, +30 % drop, +50 %
  textile/mural).
- Run the rules as a checker (feature wall not on a window wall, north light, windowless spaces, corridor end wall,
  flow across arches, floor undertone, durability): the example set 31 rules and made every proposal pass.

## Skirting and radiators

- Skirting height 6-12 cm matches door casing and ceiling height; **buy lengths, not pieces**, and check the
  accessories (corners, end caps, connectors) are sold separately.
- Radiator power: floor m² × W/m² (70 new insulated, 100 average, 130 old or exposed) scaled by ceiling height
  (reference 2.5 m), +10-20 % for large glazing. Compare shops by **price per kW**, because panel radiators and
  sections are sold per piece and per section.

## Quantities

`tools/quantities/calc.mjs` (tests included):

```
node tools/quantities/calc.mjs area --area 28 --reserve 0.07 --pack 2.4
node tools/quantities/calc.mjs tile --area 14 --w 20 --h 60 --reserve 0.10 --box 8
node tools/quantities/calc.mjs wallpaper --width 4.2 --height 2.6 --repeat 64 --match straight
node tools/quantities/calc.mjs paint --area 38
node tools/quantities/calc.mjs radiator --floor 18 --ceiling 2.7
```

Default reserves: laminate/SPC straight 7 %; diagonal 12 %; herringbone 15 %; tiles 10 % (large formats 12 %,
diagonal 15 %). **Pool by product across rooms** (drops and reserves), then round up to whole packs once.

## Ask the owner once, then record

For each room: floor, wall finish, skirting, ceiling, radiators. Put the chosen product, shop, unit price, quantity
and "bought" flag in the decision log (`renovation-decisions`).
