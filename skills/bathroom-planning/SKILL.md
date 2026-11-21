---
name: bathroom-planning
description: Plan a bathroom - fixture positions around the soil stack, boxed walls and niches, door, shower, WC, basin wall heights, tile choice and laying pattern, ventilation and zones. Use when laying out or reviewing a bathroom or choosing bathroom tiles.
---

# Bathroom planning

Start from the **pipes**, not the fixtures.

## 1. Fix what cannot move

- **Soil stack and waste pipes.** In the example the owner marked them on a screenshot: along one wall at one end.
  Everything else moves to suit. A stack notch on a plan can be much smaller in reality (115 cm drawn, 43 cm needed);
  photograph it before deciding the door.
- **Door position and swing.** In a small bathroom there may be only one workable door position; the swing arc
  decides where the WC can sit (outside the arc, within ~50 cm of the stack).
- **Window or none**: no window means mechanical extraction; decide the duct route now.

## 2. Layout pattern that worked (≈ 6.6 m²)

- Shower **cabin in the corner over the pipes**, mixer and rain head on the biggest wall of the cabin.
- Pipes hidden by a **boxed wall**: full-height 15 cm box over the stack, with lit niches (shelves) cut into it;
  half-height (1.10 m) box with a shelf behind the WC.
- **Basin on the plain wall** in the middle of the facing wall; no box behind it.
- **WC** wall-hung on a frame: in the corner nearest the stack; two variants (end of one wall or the other).
- **Washer** away from the cabin (≥ 110 cm) and next to the door or in the far corner; a slim (45 cm) machine fixes tight cases.
- **Towel warmer** on a wall that is not in a door swing and not on the middle of a boxed duct (it is not a wall).

## 3. Clearances

WC centre ≥ 45 cm from the nearest thing beside it; ≥ 60 cm free in front; basin aisle ≥ 70; washer ≥ 110 cm from the
cabin; door swing clear. Use `tools/clash-audit`; add the cabin as an item.

## 4. Basin wall elevation (everything is measured from the finished floor)

- Vanity top 80-85 cm. Mirror bottom edge 100-130 cm (≥ 110 if there is a wall tap at 100).
- Wall tap for vessel basins at ~100 cm; waste axis ~50 cm; supply ~55 cm.
- Light above the mirror: bar ≈ 80 % of mirror width, centre ≈ mirror top + 10 cm (≈ 210 cm default; 190-230). Side
  sconces 14 cm off the mirror, centre ≈ 165 cm. Within 60 cm of cabin glass use IP44 minimum; over the cabin IP65.
- Cabinet depth ≥ 46 for round / low bowls; cabinet width ≥ bowl width (60 minimum).
- Draw this as an elevation with a tradesman's table (axes, waste, supplies, mirror, light wire) and print it on A3.

## 5. Tile choice

- Choose **one dominant light wall tile** and let the laying pattern be the variable: horizontal, brick (running
  bond) and vertical read very differently. Compare in 3D with grout lines at real size before ordering.
- Floor darker than walls; a **different shower-floor tile** with small format for slope; check slip rating (R10+
  floors, R11 shower).
- Order **10 %** extra (12-15 % for diagonals, large formats). Keep a box for repairs.
- Check the real product: shops' photos differ from renders; one buyer had the floor tone darkened 20 % to match.
- Waterproof the whole shower and the floor with a membrane system before tiling; get this done by someone who warrants it.

## 6. Realism lessons if you model it in 3D

- Metals at metalness 1 render black without an environment map: use ~0.5 for chrome, ~0.65 brass.
- Extruded shapes grow with bevels: start WC pan back edges short of the wall.
- Niche items must stay inside the box's bounding box or the audit flags them.
- Use world-metre UVs for tile textures so grout is the right size on every wall.
