---
name: build-3d-room-model
description: Build an interactive 3D model of a room or flat in the browser (three.js) from a plan JSON - walls with openings, doors that open, furniture, cut-away views, materials - and use it for design review and audits. Use when the owner wants to see a layout, compare variants in 3D, or build a viewer/app for their home.
---

# Build a 3D room model

Quick start (no build step):

```
python -m http.server 8000
# open http://localhost:8000/tools/room-viewer/index.html   (loads examples/example-flat/plan.json)
# or ?plan=path/to/your-plan.json, or press Load… and pick a file
```

`tools/room-viewer/index.html` is one file: three.js from a CDN, orbit controls, cut-away of the walls nearest the
camera, ceiling toggle, plan view, doors that open and close, click an item for its size. Extend it rather than
starting over.

## Data first

Keep the model **data-driven**: a plan JSON (see `examples/example-flat/plan.json`) with rooms, doors, windows and
items. The viewer, the clash audit and the quantity calculators all read it. Never bury dimensions in drawing code.

Conventions that avoid half the bugs:

- x runs west → east, z south → north, y up, origin at the room's SW inner corner. In three.js map model z to -z so
  north is away from the camera.
- Wall letters are the true bearings (S, N, W, E); all positions are measured from the inner face.
- One flat → one shell module, each room a design that plugs into it. Store the **home-level choices** (floors,
  windows, kitchen zone) once and let every view apply them.
- Convert from the owner's plan coordinates with one function and test it on two known points.

## Things worth modelling for real

- **Doors that open** (closed / half / open) so the swing is visible and audit-able. Front door direction matters.
- **Windows and glazing from a spec:** frame colour and system, number of sections, which leaf opens, top light, sill.
- **Curtains and blinds that draw**, because they decide where a hob or TV can go.
- **Cut-away walls** so you can see in from any angle, and a **plan view** for dimensions.
- A **"services" overlay** (sockets, pipes, ducts) and an **X-ray** mode for kitchens and baths.

## Materials and rendering lessons

- Tile textures use **world-metre UVs** so board width and grout are correct on every surface.
- Make real flooring textures from the manufacturer's decor scan: cut boards to the real width, tile and stagger
  them into a seamless sheet; set the colour to white so the map is not tinted.
- Metals: metalness 1 renders black without an environment map. Use ~0.5 for chrome, ~0.65 for brass, env intensity ~1.8.
- Keep each furniture piece as **one group** (or deliberately separate groups where parts overlap) or audits report
  false clashes.
- Lazy-load textures and cap pixel ratio at 2; phones were the main device used to review the model, so every panel
  must work at 760 px wide (bottom sheets, 3D above) and the page must be deployed, not only local.

## Verify

1. Open on a phone-width viewport, check console for errors.
2. Run `tools/clash-audit` on the same plan.
3. Compare computed room areas to the plan's labels.
4. Open every door and check the arc is clear.

If you ship it as an app: a PWA (manifest + service worker caching data) covers most phone needs without a store.
An Android WebView wrapper is an option for a local APK; keep the web build as the source of truth.
