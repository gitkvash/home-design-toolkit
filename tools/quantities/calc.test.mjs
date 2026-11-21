import { test } from 'node:test';
import assert from 'node:assert/strict';
import { areaMaterial, tilePieces, wallpaperRolls, paintLitres, radiatorWatts, circuitLoad, averageLux, netWallArea } from './calc.mjs';

test('area rounds up to whole packs', () => {
  const r = areaMaterial({ areaM2: 28, reserve: 0.07, packM2: 2.4 });
  assert.equal(r.packs, 13); // 29.96 / 2.4 = 12.48 -> 13
  assert.equal(r.buyM2, 31.2);
});

test('tile pieces include joint and reserve', () => {
  const r = tilePieces({ areaM2: 10, tileW: 20, tileH: 60, jointMm: 2, reserve: 0.1, boxPcs: 8 });
  assert.equal(r.pieces, 91); // 11 m2 / (0.202 * 0.602) = 90.5
  assert.equal(r.boxes, 12);
});

test('wallpaper: straight match with repeat needs fewer strips per roll', () => {
  const free = wallpaperRolls({ widthM: 4.2, heightM: 2.6, match: 'free' });
  const straight = wallpaperRolls({ widthM: 4.2, heightM: 2.6, match: 'straight', repeatCm: 64 });
  assert.equal(free.dropM, 2.7);
  assert.equal(free.strips, 8);
  assert.equal(free.stripsPerRoll, 3);
  assert.equal(free.rolls, 3);
  assert.equal(free.buy, 4); // plain: +1 spare roll
  assert.ok(straight.dropM >= 2.7 && straight.dropM % 0.64 < 1e-6);
  assert.ok(straight.rolls >= free.rolls);
});

test('paint litres', () => {
  assert.equal(paintLitres({ areaM2: 38 }).litres, 8.4);
});

test('radiator watts scale with ceiling and glazing', () => {
  assert.equal(radiatorWatts({ floorM2: 18, ceilingM: 2.5, wPerM2: 100 }), 1800);
  assert.ok(radiatorWatts({ floorM2: 18, ceilingM: 2.8, glazingBonus: 0.1 }) > 2100);
});

test('circuit load flags overload', () => {
  assert.equal(circuitLoad([{ watts: 2200 }, { watts: 1000 }], 16).ok, false);
  assert.equal(circuitLoad([{ watts: 2200 }], 16).ok, true);
});

test('lux and net wall area', () => {
  assert.equal(averageLux({ lumens: 4000, areaM2: 18 }), 80);
  assert.equal(netWallArea([{ w: 4, h: 2.6 }], [{ w: 0.9, h: 2.1 }]), 8.51);
});
