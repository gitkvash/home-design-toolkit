// Clearance audit for one room layout. Measures geometry instead of trusting notes.
// Input: a room JSON (see ../../examples/example-flat/plan.json). Usage:
//   node audit.mjs <plan.json> [roomId]
// Coordinates: x runs west->east, z runs south->north, metres, origin at the room's SW inner corner.
// Reports per room:
//   out    items sticking through a wall (cm)
//   ovl    pairs interpenetrating by > 4 cm on all three axes (nested pairs are ignored)
//   swing  items standing in a door's swing arc
//   route  widest bottleneck (cm) from the door to each target (default: far corner of the room)
//   clear  free floor area (m2), obstacles = anything between 35 cm and head height (1.8 m)
// The plan is validated first (validatePlan, mirrors plan.schema.json); an invalid plan exits 3 with every problem listed.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const CELL = 0.04; // grid resolution
const OBST_LOW = 0.35, OBST_HIGH = 1.8;
const OVL_TOL = 0.04;

class MaxHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(k, v) {
    const a = this.a; a.push([k, v]);
    for (let i = a.length - 1; i > 0;) { const p = (i - 1) >> 1; if (a[p][0] >= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      for (let i = 0; ;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < a.length && a[l][0] > a[m][0]) m = l;
        if (r < a.length && a[r][0] > a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

// --- plan validation. Kept in this file (not imported) so the script still runs on its own from a temp copy.
// Mirrors plan.schema.json and adds what a schema cannot say: unique ids, nestIn targets, doors inside their wall.
const WALLS = ['S', 'N', 'W', 'E'];

export function validatePlan(plan) {
  const errs = [];
  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const num = (path, v, { min = -Infinity, gt = false, max = Infinity, need = true } = {}) => {
    if (v === undefined) { if (need) errs.push(`${path}: missing (number, metres)`); return false; }
    if (typeof v !== 'number' || !Number.isFinite(v)) { errs.push(`${path}: ${JSON.stringify(v)} is not a number`); return false; }
    if (gt ? v <= min : v < min) { errs.push(`${path}: ${v} must be ${gt ? '>' : '>='} ${min}`); return false; }
    if (v > max) {
      const cm = v / 100 <= max ? ' - looks like centimetres; lengths are metres' : '';
      errs.push(`${path}: ${v} is above ${max}${cm}`);
      return false;
    }
    return true;
  };
  const str = (path, v, need = true) => {
    if (v === undefined) { if (need) errs.push(`${path}: missing (string)`); return; }
    if (typeof v !== 'string' || !v) errs.push(`${path}: must be a non-empty string`);
  };
  const oneOf = (path, v, allowed, need = true) => {
    if (v === undefined) { if (need) errs.push(`${path}: missing (${allowed.join('|')})`); return; }
    if (!allowed.includes(v)) errs.push(`${path}: ${JSON.stringify(v)} is not one of ${allowed.join('|')}`);
  };
  const list = (path, v) => {
    if (v === undefined) return [];
    if (!Array.isArray(v)) { errs.push(`${path}: must be an array`); return []; }
    return v;
  };
  const label = (base, el, i) => `${base}[${isObj(el) && typeof el.id === 'string' ? el.id : i}]`;
  const unique = (path, arr) => {
    const seen = new Set();
    for (const el of arr) if (isObj(el) && typeof el.id === 'string') {
      if (seen.has(el.id)) errs.push(`${path}: id "${el.id}" is used twice`);
      seen.add(el.id);
    }
  };

  if (!isObj(plan)) return ['plan: must be a JSON object'];
  if (plan.ceiling !== undefined) num('ceiling', plan.ceiling, { min: 0, gt: true, max: 10 });
  if (!Array.isArray(plan.rooms) || !plan.rooms.length) return [...errs, 'rooms: must be a non-empty array'];
  unique('rooms', plan.rooms);

  plan.rooms.forEach((room, ri) => {
    const rp = label('rooms', room, ri);
    if (!isObj(room)) { errs.push(`${rp}: must be an object`); return; }
    str(`${rp}.id`, room.id);
    let W = NaN, D = NaN;
    if (!isObj(room.size)) errs.push(`${rp}.size: missing ({ w, d } in metres)`);
    else {
      if (num(`${rp}.size.w`, room.size.w, { min: 0, gt: true, max: 30 })) W = room.size.w;
      if (num(`${rp}.size.d`, room.size.d, { min: 0, gt: true, max: 30 })) D = room.size.d;
    }
    const wallLen = (wall) => (wall === 'S' || wall === 'N' ? W : wall === 'W' || wall === 'E' ? D : NaN);
    const inWall = (path, o) => {
      const L = wallLen(o.wall);
      if (Number.isFinite(L) && typeof o.pos === 'number' && typeof o.width === 'number'
        && (o.pos - o.width / 2 < -0.02 || o.pos + o.width / 2 > L + 0.02))
        errs.push(`${path}: opening ${o.pos} +/- ${o.width / 2} runs past the ${o.wall} wall (0..${L})`);
    };

    const doors = list(`${rp}.doors`, room.doors);
    unique(`${rp}.doors`, doors);
    doors.forEach((d, i) => {
      const p = label(`${rp}.doors`, d, i);
      if (!isObj(d)) { errs.push(`${p}: must be an object`); return; }
      str(`${p}.id`, d.id);
      oneOf(`${p}.wall`, d.wall, WALLS);
      num(`${p}.pos`, d.pos, { min: -1, max: 30 });
      num(`${p}.width`, d.width, { min: 0, gt: true, max: 3 });
      oneOf(`${p}.hinge`, d.hinge, ['start', 'end'], false);
      oneOf(`${p}.opens`, d.opens, ['in', 'out'], false);
      oneOf(`${p}.kind`, d.kind, ['swing', 'slide', 'arch'], false);
      inWall(p, d);
    });

    const windows = list(`${rp}.windows`, room.windows);
    windows.forEach((w, i) => {
      const p = label(`${rp}.windows`, w, i);
      if (!isObj(w)) { errs.push(`${p}: must be an object`); return; }
      str(`${p}.id`, w.id);
      oneOf(`${p}.wall`, w.wall, WALLS);
      num(`${p}.pos`, w.pos, { min: -1, max: 30 });
      num(`${p}.width`, w.width, { min: 0, gt: true, max: 10 });
      const sillOk = num(`${p}.sill`, w.sill, { min: 0, max: 10, need: false });
      const headOk = num(`${p}.head`, w.head, { min: 0, gt: true, max: 10, need: false });
      if (sillOk && headOk && w.sill !== undefined && w.head !== undefined && w.head <= w.sill)
        errs.push(`${p}: head ${w.head} must be above sill ${w.sill}`);
      inWall(p, w);
    });

    list(`${rp}.targets`, room.targets).forEach((t, i) => {
      const p = `${rp}.targets[${isObj(t) && typeof t.name === 'string' ? t.name : i}]`;
      if (!isObj(t)) { errs.push(`${p}: must be an object`); return; }
      str(`${p}.name`, t.name);
      num(`${p}.x`, t.x, { min: -1, max: 30 });
      num(`${p}.z`, t.z, { min: -1, max: 30 });
    });

    const items = list(`${rp}.items`, room.items);
    unique(`${rp}.items`, items);
    const ids = new Set(items.filter(isObj).map((it) => it.id));
    items.forEach((it, i) => {
      const p = label(`${rp}.items`, it, i);
      if (!isObj(it)) { errs.push(`${p}: must be an object`); return; }
      str(`${p}.id`, it.id);
      num(`${p}.x`, it.x, { min: -1, max: 30 });
      num(`${p}.z`, it.z, { min: -1, max: 30 });
      num(`${p}.w`, it.w, { min: 0, gt: true, max: 30 });
      num(`${p}.d`, it.d, { min: 0, gt: true, max: 30 });
      num(`${p}.h`, it.h, { min: 0, gt: true, max: 10 });
      num(`${p}.y0`, it.y0, { min: 0, max: 10, need: false });
      if (it.color !== undefined && typeof it.color !== 'string') errs.push(`${p}.color: must be a string`);
      if (it.nestIn !== undefined && (it.nestIn === it.id || !ids.has(it.nestIn)))
        errs.push(`${p}.nestIn: "${it.nestIn}" is not another item in this room`);
    });
  });
  return errs;
}

export function auditRoom(room) {
  const { w: RW, d: RD } = room.size; // interior width (x) and depth (z)
  const items = room.items || [];
  const doors = room.doors || [];
  const nx = Math.round(RW / CELL), nz = Math.round(RD / CELL);
  const faults = { out: [], ovl: [], swing: [] };

  // --- out: bbox beyond the walls
  for (const it of items) {
    const over = Math.max(-it.x, -it.z, it.x + it.w - RW, it.z + it.d - RD);
    if (over > 0.03) faults.out.push({ id: it.id, cm: Math.round(over * 100) });
  }

  // --- ovl: pairs interpenetrating on all axes; skip items marked nestIn the other
  const y0 = (i) => i.y0 || 0;
  for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
    const A = items[a], B = items[b];
    if (A.nestIn === B.id || B.nestIn === A.id) continue;
    const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
    const oz = Math.min(A.z + A.d, B.z + B.d) - Math.max(A.z, B.z);
    const oy = Math.min(y0(A) + A.h, y0(B) + B.h) - Math.max(y0(A), y0(B));
    if (ox > OVL_TOL && oz > OVL_TOL && oy > OVL_TOL) faults.ovl.push({ a: A.id, b: B.id, cm: [ox, oz, oy].map((v) => Math.round(v * 100)) });
  }

  // --- obstacle grid
  const blocked = new Uint8Array(nx * nz);
  const idx = (i, j) => j * nx + i;
  const owner = new Array(nx * nz);
  for (const it of items) {
    if (y0(it) >= OBST_HIGH || y0(it) + it.h <= OBST_LOW) continue;
    for (let j = Math.floor(it.z / CELL); j < Math.ceil((it.z + it.d) / CELL); j++)
      for (let i = Math.floor(it.x / CELL); i < Math.ceil((it.x + it.w) / CELL); i++)
        if (i >= 0 && j >= 0 && i < nx && j < nz) { blocked[idx(i, j)] = 1; owner[idx(i, j)] = it.id; }
  }

  // --- door geometry: hinge point, leaf length, swing quadrant
  const doorInfo = doors.map((d) => {
    const L = d.width;
    // wall: 'S' (z=0), 'N' (z=RD), 'W' (x=0), 'E' (x=RW). pos = centre along the wall, hinge: 'start' | 'end'
    const along = d.pos - L / 2 + (d.hinge === 'end' ? L : 0);
    let hx, hz, ax, az; // hinge point and unit step into the room
    if (d.wall === 'S') { hx = along; hz = 0; ax = 0; az = 1; }
    else if (d.wall === 'N') { hx = along; hz = RD; ax = 0; az = -1; }
    else if (d.wall === 'W') { hx = 0; hz = along; ax = 1; az = 0; }
    else { hx = RW; hz = along; ax = -1; az = 0; }
    const dir = d.hinge === 'end' ? -1 : 1; // direction along the wall away from the hinge
    const alongAxis = d.wall === 'S' || d.wall === 'N' ? [1, 0] : [0, 1];
    const into = d.opens === 'out' ? -1 : 1; // swing into the room or away from it
    return { d, hx, hz, ax: ax * into, az: az * into, bx: alongAxis[0] * dir, bz: alongAxis[1] * dir, L };
  });

  // --- swing: any obstacle inside the quarter disc swept by an inward leaf
  for (const g of doorInfo) {
    if (g.d.opens === 'out' || g.d.kind === 'slide' || g.d.kind === 'arch') continue;
    const hit = new Set();
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      if (!blocked[idx(i, j)]) continue;
      const px = (i + 0.5) * CELL - g.hx, pz = (j + 0.5) * CELL - g.hz;
      const u = px * g.bx + pz * g.bz; // along wall, away from hinge
      const v = px * g.ax + pz * g.az; // into room
      if (u >= -0.02 && v >= 0 && Math.hypot(u, v) <= g.L) hit.add(owner[idx(i, j)]);
    }
    if (hit.size) faults.swing.push({ door: g.d.id, items: [...hit] });
  }

  // --- clearance field (distance to nearest obstacle or wall, in cells), brute force limited radius
  const R = Math.ceil(0.6 / CELL);
  const clr = new Float64Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    if (blocked[idx(i, j)]) { clr[idx(i, j)] = 0; continue; }
    let best = Math.min(i + 1, j + 1, nx - i, nz - j); // distance to the wall in cells
    for (let dj = -R; dj <= R && best > 1; dj++) for (let di = -R; di <= R; di++) {
      const ii = i + di, jj = j + dj;
      if (ii < 0 || jj < 0 || ii >= nx || jj >= nz || !blocked[idx(ii, jj)]) continue;
      const dd = Math.hypot(di, dj);
      if (dd < best) best = dd;
    }
    clr[idx(i, j)] = Math.max(0, best - 0.5) * CELL; // metres from cell centre to the nearest obstacle edge (half the passage width)
  }

  // --- route: widest-bottleneck path from the door to each target (Dijkstra on min clearance)
  const door0 = doorInfo[0];
  const route = [];
  if (door0) {
    const mid = door0.d.pos;
    // start 0.5 m inside the door so the wall next to the doorway does not cap the width
    const sx = door0.d.wall === 'S' || door0.d.wall === 'N' ? mid : door0.d.wall === 'W' ? 0.5 : RW - 0.5;
    const sz = door0.d.wall === 'W' || door0.d.wall === 'E' ? mid : door0.d.wall === 'S' ? 0.5 : RD - 0.5;
    const src = idx(Math.min(nx - 1, Math.max(0, Math.floor(sx / CELL))), Math.min(nz - 1, Math.max(0, Math.floor(sz / CELL))));
    const width = new Float64Array(nx * nz).fill(-1);
    const doorCap = door0.d.width;
    width[src] = doorCap;
    const heap = new MaxHeap();
    heap.push(doorCap, src);
    while (heap.size) {
      const [wd, cur] = heap.pop();
      if (wd < width[cur]) continue;
      const ci = cur % nx, cj = (cur / nx) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = ci + di, nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= nx || nj >= nz) continue;
        const n = idx(ni, nj);
        if (blocked[n]) continue;
        const nw = Math.min(wd, clr[n] * 2);
        if (nw > width[n]) { width[n] = nw; heap.push(nw, n); }
      }
    }
    const targets = room.targets || [{ name: 'far corner', x: RW - 0.5, z: RD - 0.5 }];
    for (const t of targets) {
      const i = Math.min(nx - 1, Math.floor(t.x / CELL)), j = Math.min(nz - 1, Math.floor(t.z / CELL));
      route.push({ target: t.name, cm: Math.max(0, Math.round(width[idx(i, j)] * 100)) });
    }
  }

  let free = 0;
  for (let k = 0; k < blocked.length; k++) if (!blocked[k]) free++;
  return { room: room.id, faults, route, clearFloorM2: +(free * CELL * CELL).toFixed(2) };
}

export function format(r, minRoute = 75) {
  const lines = [`# ${r.room}  clear floor ${r.clearFloorM2} m2`];
  const ok = (arr) => (arr.length ? 'FAIL' : 'ok');
  lines.push(`out   ${ok(r.faults.out)} ${JSON.stringify(r.faults.out)}`);
  lines.push(`ovl   ${ok(r.faults.ovl)} ${JSON.stringify(r.faults.ovl)}`);
  lines.push(`swing ${ok(r.faults.swing)} ${JSON.stringify(r.faults.swing)}`);
  for (const t of r.route) lines.push(`route ${t.cm >= minRoute ? 'ok' : 'NARROW'} ${t.target}: ${t.cm} cm (min ${minRoute})`);
  return lines.join('\n');
}

// Run the CLI when this file is the entry point, whatever it is named (marketplaces run it from a temp file).
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const [file, only] = process.argv.slice(2);
  if (!file) { console.log('usage: node audit.mjs <plan.json> [roomId]'); process.exit(1); }
  let plan;
  try { plan = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(3); }
  const errs = validatePlan(plan);
  if (errs.length) {
    console.error(`${file}: invalid plan (${errs.length} problem${errs.length > 1 ? 's' : ''}), see plan.schema.json`);
    for (const e of errs) console.error(`  ${e}`);
    process.exit(3);
  }
  let bad = 0;
  for (const room of plan.rooms) {
    if (only && room.id !== only) continue;
    const r = auditRoom(room);
    console.log(format(r));
    bad += r.faults.out.length + r.faults.ovl.length + r.faults.swing.length;
  }
  process.exit(bad ? 2 : 0);
}
