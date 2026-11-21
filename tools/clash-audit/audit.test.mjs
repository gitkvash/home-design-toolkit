import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditRoom } from './audit.mjs';

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
