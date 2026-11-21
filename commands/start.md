---
description: Interview the owner and set up a home-design project (master plan, brief, decision log)
argument-hint: [country or city]
---

Start a home-design project. Use the `home-design-guide` skill.

1. Ask, one short group at a time: country/city and currency; flat or house; floor area and number of rooms; what is fixed
   (shell, bare, partly renovated); what has already been bought; budget range; who lives there and how they use each room;
   must-haves and dealbreakers; measurements and photos available.
2. Create in the current folder: `master-plan.md` (rooms, openings, services, tolerances, measure-on-site list),
   `brief.md` (hard constraints per room), `decision-log.md` (append-only), and `plan.json` (copy `examples/example-flat/plan.json`
   as a template and fill what is known).
3. Run `node tools/clash-audit/audit.mjs plan.json` if rooms have items, and open `tools/room-viewer/index.html` for a first look.
4. Finish with the five measurements that would improve accuracy most, and the next three actions.

Local arguments: $ARGUMENTS
