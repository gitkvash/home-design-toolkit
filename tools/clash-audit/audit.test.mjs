import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditRoom, validatePlan } from './audit.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const EXAMPLE = here('../../examples/example-flat/plan.json');
const AUDIT = here('./audit.mjs');

const base = () => ({
  id: 't', size: { w: 4, d: 3 },
  doors: [{ id: 'd', wall: 'S', pos: 0.8, width: 0.8, hinge: 'start', opens: 'in' }],
  items: [],
});

test('clean room reports nothing', () => {
  const r = auditRoom(base());
  assert.deepEqual(r.faults, { out: [], ovl: [], swing: [] });
  assert.ok(r.route[0].cm >= 75);
});

test('item through a wall is reported', () => {
  const room = base();
  room.items.push({ id: 'wardrobe', x: 3.5, z: 1, w: 0.8, d: 0.6, h: 2 });
  assert.equal(auditRoom(room).faults.out[0].id, 'wardrobe');
});

test('overlap is reported, nested pair is not', () => {
  const room = base();
  room.items.push({ id: 'a', x: 1, z: 1, w: 1, d: 1, h: 0.8 }, { id: 'b', x: 1.5, z: 1.5, w: 1, d: 1, h: 0.8 });
  assert.equal(auditRoom(room).faults.ovl.length, 1);
  room.items[1].nestIn = 'a';
  assert.equal(auditRoom(room).faults.ovl.length, 0);
});

test('plant in the door swing is reported; same plant behind the hinge is not', () => {
  const room = base();
  room.items.push({ id: 'plant', x: 0.9, z: 0.4, w: 0.4, d: 0.4, h: 1 });
  assert.deepEqual(auditRoom(room).faults.swing[0].items, ['plant']);
  room.items[0].x = 2.5;
  assert.equal(auditRoom(room).faults.swing.length, 0);
});

test('furniture pinching the route narrows it', () => {
  const room = base();
  room.items.push({ id: 'sofa', x: 0, z: 1.0, w: 3.2, d: 0.9, h: 0.8 }, { id: 'shelf', x: 3.6, z: 0, w: 0.4, d: 3, h: 1.5 });
  room.targets = [{ name: 'far', x: 3.0, z: 2.5 }];
  assert.ok(auditRoom(room).route[0].cm < 75);
});

// --- plan validation

test('example plan is valid and the CLI audits it with exit 0', () => {
  assert.deepEqual(validatePlan(JSON.parse(readFileSync(EXAMPLE, 'utf8'))), []);
  const run = spawnSync(process.execPath, [AUDIT, EXAMPLE], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /# living/);
});

test('centimetres instead of metres are caught with a hint', () => {
  const errs = validatePlan({ rooms: [{ id: 'r', size: { w: 520, d: 4.6 }, items: [{ id: 'sofa', x: 1, z: 1, w: 2, d: 0.9, h: 85 }] }] });
  assert.equal(errs.length, 2);
  assert.ok(errs.every((e) => e.includes('centimetres')), errs.join('\n'));
  assert.match(errs[0], /rooms\[r\]\.size\.w/);
  assert.match(errs[1], /items\[sofa\]\.h/);
});

test('missing fields, bad enums, duplicate ids and broken nestIn are reported', () => {
  const errs = validatePlan({ rooms: [{
    id: 'r', size: { w: 4, d: 3 },
    doors: [{ id: 'd', wall: 'X', pos: 0.5, width: 0.8, hinge: 'left' }],
    items: [{ id: 'a', x: 0, z: 0, w: 1, d: 1 }, { id: 'a', x: 2, z: 0, w: 1, d: 1, h: 1, nestIn: 'ghost' }],
  }] });
  for (const want of ['wall: "X"', 'hinge: "left"', 'items[a].h: missing', 'id "a" is used twice', 'nestIn: "ghost"'])
    assert.ok(errs.some((e) => e.includes(want)), `expected "${want}" in:\n${errs.join('\n')}`);
});

test('a door running past the end of its wall is reported', () => {
  const room = { ...base(), doors: [{ id: 'd', wall: 'E', pos: 2.8, width: 0.8 }] };
  assert.match(validatePlan({ rooms: [room] }).join('\n'), /runs past the E wall/);
});

test('not an object / no rooms', () => {
  assert.deepEqual(validatePlan(null), ['plan: must be a JSON object']);
  assert.deepEqual(validatePlan({ rooms: [] }), ['rooms: must be a non-empty array']);
});

test('CLI exits 3 and lists problems for an invalid plan', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hdt-'));
  const bad = join(dir, 'bad.json');
  writeFileSync(bad, JSON.stringify({ rooms: [{ id: 'r', size: { w: 400, d: 3 } }] }));
  const run = spawnSync(process.execPath, [AUDIT, bad], { encoding: 'utf8' });
  assert.equal(run.status, 3);
  assert.match(run.stderr, /invalid plan/);
  assert.match(run.stderr, /centimetres/);
});

test('plan.schema.json parses and names every field the example uses', () => {
  const schema = JSON.parse(readFileSync(here('./plan.schema.json'), 'utf8'));
  const plan = JSON.parse(readFileSync(EXAMPLE, 'utf8'));
  const keys = (o) => Object.keys(o || {});
  const d = schema.$defs;
  const check = (objs, props, where) => {
    for (const o of objs) for (const k of keys(o)) assert.ok(k in props, `${where}.${k} is not in plan.schema.json`);
  };
  check([plan], schema.properties, 'plan');
  check(plan.rooms, d.room.properties, 'room');
  check(plan.rooms.flatMap((r) => r.doors || []), d.door.properties, 'door');
  check(plan.rooms.flatMap((r) => r.windows || []), d.window.properties, 'window');
  check(plan.rooms.flatMap((r) => r.targets || []), d.target.properties, 'target');
  check(plan.rooms.flatMap((r) => r.items || []), d.item.properties, 'item');
});
