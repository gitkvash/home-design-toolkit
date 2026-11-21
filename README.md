# Home Design Toolkit

Skills, an agent and a tool for planning and renovating a home with an AI assistant. They come from a real project:
a complete 69 m² flat, from bare shell to bought finishes, planned room by room with 3D models, audits and a lot of
corrected assumptions.

The method works anywhere: measure first, write decisions down, audit the geometry, compare products by price per
m², and freeze a decision once you buy.

*Georgian version: [README.ka.md](README.ka.md)*

## Free in this repo

| | |
|---|---|
| **Skills** | `home-design-guide` (where to start, the order of work) · `home-survey` (turn a plan screenshot, photos and tape measurements into a plan you can trust) · `layout-clearances` (door swings, walking routes, clearances) |
| **Agent** | `layout-auditor`: runs the audit, explains each fault, proposes the smallest fix |
| **Tool** | `tools/clash-audit`: finds furniture through walls, overlaps, blocked door swings and narrow routes in a JSON plan |
| **Example** | `examples/example-flat/plan.json`: an invented 2-room flat |
| **Docs** | `docs/lessons-learned.md`: what went wrong and what we would do differently |

## Pro edition (paid)

Eight more skills and three more agents: kitchen planning (appliances, sockets, circuits, gas, tile cuts, carpenter
list), bathroom planning, lighting (lux, ceiling-gap fit, zones), finishes and quantities with a tested calculator
(floor, tile, wallpaper repeat and reserve, paint, radiators), product price research across shops, interior scheme
generation, a renovation decision log, and a three.js 3D room viewer. Open an issue if you are interested.

## Install in Claude Code

```
/plugin marketplace add gitkvash/home-design-toolkit
/plugin install home-design@home-design-toolkit
```

The audit runs on plain Node 18+, no installs:

```
node tools/clash-audit/audit.mjs examples/example-flat/plan.json
node --test tools/clash-audit/audit.test.mjs
```

Other assistants: the skills are plain Markdown with a short front-matter, so you can paste a `SKILL.md` into any
agent that supports instruction files.

## The method in eight lines

1. Measure before designing; every number gets a source and a tolerance.
2. Write the brief as rules the layout can be checked against.
3. Make several comparable schemes per room, always one plain baseline.
4. Audit geometry (doors, routes, walls), not impressions.
5. Plan kitchen, bath and lighting from services and rules, not pictures.
6. Choose finishes once for the whole home; compare products by price per m² with a reserve.
7. Keep an append-only decision log; after a purchase, freeze that category.
8. Hand each trade a drawing, not a render.

## Honest limits

These are planning aids, not structural, electrical, gas or waterproofing engineering. Confirm with licensed
professionals and local code. Photo-derived dimensions are ±5-10 cm; a tape measure beats everything here.

## License

MIT, see [LICENSE](LICENSE). The Pro edition is licensed separately.
