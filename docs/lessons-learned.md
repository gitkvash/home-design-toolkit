# Lessons learned

From planning a 69 m² flat with an AI assistant over about three months. Dates are omitted on purpose.

## Survey

- **A screenshot of a plan is not a survey.** Seven assumptions were corrected by the owner in one day (window count, the
  door wall, facade line, recess depth, the hall opening, the bathroom door). All seven had been on the "worth asking" list.
- **Photos of the stripped room beat the plan** for openings: a window was a third wider than drawn, a wall pier 40 % narrower.
- **Validate scale with the labels printed on the plan.** Six rooms within 0.03 m² of their labels justified ±3 cm.
- **Wall thickness is a hidden variable.** A balcony wall drawn as 12 cm was about 51 cm; a glazing decision swung by 3×.
- **A boxed corner is usually a pipe** and it decides the door, the WC and the washer.
- The two most valuable five minutes: corner-to-corner diagonals of the largest room.

## Design

- Variants must be comparable. Four early schemes were struck out in a review because they relied on novelty (a floor-pole
  TV, a projector throwing onto the brightest wall) rather than on use.
- Clearance audits pass layouts that still fail on sightlines, glare and facade changes. Review those by hand.
- Doors are a first-class design element. Decide swings first and audit every arc in every scheme.
- Delete dead schemes, keep the letters as a record, never edit a scheme the owner has already compared.
- Fully furnish plain schemes. "Plain" means plain planning, not low detail.
- Owners change direction. Keep what they last said as the brief and the older direction in the log.

## Systems

- Kitchen: decide appliance states (on / reserve / off) so you do not rework walls later. Decide whether the island gets power on day one.
- Bath: start from the stack; boxed walls with niches turn a constraint into a feature.
- Lighting: plan per zone; check recessed fixtures against the real ceiling gap (6 cm leaves no room for most downlights).
- Gas, electrics, waterproofing: licensed trades, always.

## Materials and shops

- **Never auto-correct a suspicious unit**; flag it. An expensive product looks like a misread one.
- Dedupe strictly: a wrong merge hides the cheaper product.
- Hourly scraping was too heavy for shops; nightly was fine. Ask first, honour robots.txt, never republish scraped data.
- Wallpaper repeat and match are rarely published: assume, let the owner override, and always buy a reserve.
- A shop photo and a texture rendered from it can mislead; order a sample and look at it in the room's light.
- Once bought, freeze: update the 3D model with the real product and stop offering alternatives.

## Software

- Data-driven plans (one JSON) let the viewer, audit and calculators share truth.
- Test the audit on deliberately broken rooms; its own bugs hid real faults.
- Mobile-first: the owner reviewed designs on a phone, away from the flat. Every panel had to work at 760 px, and it had to be deployed.
- Keep old modules after a decision closes them (archive, do not delete): history is cheap and sometimes needed.
- Windows tooling tip: write source files with LF endings (Python `newline=''`), or every diff looks like a full rewrite.
