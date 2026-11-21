# Tools

| Folder | What | Run |
|---|---|---|
| `clash-audit/` | `out` / `ovl` / `swing` / `route` / clear floor from a plan JSON | `node tools/clash-audit/audit.mjs <plan.json> [room]` · `npm test` |

Plan format: `clash-audit/plan.schema.json` (JSON Schema), example in `examples/example-flat/plan.json`. The audit
validates the plan first and exits 3 on a bad one (missing fields, unknown walls, duplicate ids, centimetres). Coordinates in metres, x west → east, z south → north, origin at each
room's south-west inner corner. Doors: `wall` (S/N/W/E), `pos` (centre along the wall), `width`, `hinge` (start/end),
`opens` (in/out), optional `kind` (`swing`, or `slide`/`arch` to skip the swing check). Items: `x z w d h`, optional `y0` (height off
the floor), `color`, `nestIn`.
