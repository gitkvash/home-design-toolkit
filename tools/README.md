# Tools

| Folder | What | Run |
|---|---|---|
| `clash-audit/` | `out` / `ovl` / `swing` / `route` / clear floor from a plan JSON | `node tools/clash-audit/audit.mjs <plan.json> [room]` · `node --test tools/clash-audit/audit.test.mjs` |

Plan format: see `examples/example-flat/plan.json`. Coordinates in metres, x west → east, z south → north, origin at each
room's south-west inner corner. Doors: `wall` (S/N/W/E), `pos` (centre along the wall), `width`, `hinge` (start/end),
`opens` (in/out), optional `kind` (`slide`/`arch` skip the swing check). Items: `x z w d h`, optional `y0` (height off
the floor), `color`, `nestIn`.
