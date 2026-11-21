// Quantity calculators for renovation materials. Pure functions, no dependencies.
// All lengths in metres unless a name says otherwise. Run `node calc.mjs help`.

import { pathToFileURL } from 'node:url';

const ceil = Math.ceil;
const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

/** Reserve (waste) percentages that worked in practice. Override per job. */
export const RESERVE = {
  floorStraight: 0.07, // laminate / SPC / engineered, plank laid straight
  floorDiagonal: 0.12,
  floorHerringbone: 0.15, // herringbone / chevron cut a lot of ends
  tileStraight: 0.10,
  tileDiagonal: 0.15,
  tileLarge: 0.12, // slabs 60x120 and up: breakage and cut planning
  paint: 0.10,
};

/** Sum of wall areas minus openings. walls: [{w,h}], openings: [{w,h}] */
export function netWallArea(walls, openings = []) {
  const gross = walls.reduce((s, x) => s + x.w * x.h, 0);
  const holes = openings.reduce((s, x) => s + x.w * x.h, 0);
  return Math.max(0, gross - holes);
}

/** Flooring or tile by area. Returns m2 to buy and packs (if packM2 given). */
export function areaMaterial({ areaM2, reserve = RESERVE.floorStraight, packM2 }) {
  const need = areaM2 * (1 + reserve);
  const out = { areaM2: round(areaM2), reserve, buyM2: round(need) };
  if (packM2) {
    out.packs = ceil(need / packM2 - 1e-9);
    out.buyM2 = round(out.packs * packM2);
    out.leftoverM2 = round(out.buyM2 - areaM2);
  }
  return out;
}

/** Tiles by piece. tileW/tileH in cm. Includes optional grout joint in mm. */
export function tilePieces({ areaM2, tileW, tileH, jointMm = 2, reserve = RESERVE.tileStraight, boxPcs }) {
  const w = (tileW + jointMm / 10) / 100;
  const h = (tileH + jointMm / 10) / 100;
  const pieces = ceil((areaM2 * (1 + reserve)) / (w * h) - 1e-9);
  const out = { pieces, tileM2: round(tileW * tileH / 10000, 4) };
  if (boxPcs) out.boxes = ceil(pieces / boxPcs);
  return out;
}

/**
 * Wallpaper rolls for one flat surface (or the sum width of several walls).
 * match: 'free' (plain, stripes) | 'straight' | 'half' (half-drop).
 * repeatCm: pattern repeat vertically. Shops often do not publish it: ask or assume.
 * Returns strips, strips per roll, rolls and a reserve-adjusted count to buy.
 */
export function wallpaperRolls({
  widthM, heightM, rollWidthCm = 53, rollLengthM = 10.05, repeatCm = 0, match = 'free',
  trimCm = 10, openingsM2 = 0, reserve = 'auto',
}) {
  let dropM = heightM + trimCm / 100; // 5 cm top + 5 cm bottom trim
  if (match !== 'free' && repeatCm > 0) {
    const r = repeatCm / 100;
    dropM = ceil(dropM / r - 1e-9) * r;
    if (match === 'half') dropM += r / 2;
  }
  const strips = ceil(widthM / (rollWidthCm / 100) - 1e-9);
  const stripsPerRoll = Math.max(1, Math.floor(rollLengthM / dropM + 1e-9));
  // Doors and windows save whole strips only where the strip is entirely over the hole.
  const saved = Math.floor(openingsM2 / (heightM * (rollWidthCm / 100)) / 3);
  const stripsNeeded = Math.max(1, strips - saved);
  const rolls = ceil(stripsNeeded / stripsPerRoll - 1e-9);
  const pct = reserve === 'auto' ? (match === 'free' ? 0 : match === 'straight' ? 0.10 : 0.15) : reserve;
  const spare = reserve === 'auto' && match === 'free' ? 1 : 0; // plain paper: one spare roll for repairs
  const buy = ceil(rolls * (1 + pct) - 1e-9) + spare;
  return { dropM: round(dropM), strips: stripsNeeded, stripsPerRoll, rolls, buy };
}

/** Paint litres. coverageM2PerL: 10 is typical for matt emulsion on primed wall. */
export function paintLitres({ areaM2, coats = 2, coverageM2PerL = 10, reserve = RESERVE.paint }) {
  const litres = (areaM2 * coats) / coverageM2PerL;
  return { litres: round(litres * (1 + reserve), 1) };
}

/**
 * Rough radiator heat load. wPerM2: 70 new insulated, 100 average, 130 old/exposed.
 * Scaled by ceiling height (reference 2.5 m). Add 10-20% for rooms with large glazing.
 */
export function radiatorWatts({ floorM2, ceilingM = 2.6, wPerM2 = 100, glazingBonus = 0 }) {
  return Math.round(floorM2 * wPerM2 * (ceilingM / 2.5) * (1 + glazingBonus));
}

/** Circuit loads: items [{name, watts}] against a breaker (A) at 230 V, 80% continuous limit. */
export function circuitLoad(items, breakerA = 16, volts = 230) {
  const watts = items.reduce((s, x) => s + x.watts, 0);
  const limit = breakerA * volts * 0.8;
  return { watts, limit: Math.round(limit), ok: watts <= limit };
}

/** Lux estimate for the average illuminance of a room: lumens * utilisation * maintenance / area. */
export function averageLux({ lumens, areaM2, utilisation = 0.45, maintenance = 0.8 }) {
  return Math.round((lumens * utilisation * maintenance) / areaM2);
}

/** Target average lux by room type (EN 12464-ish, residential practice). */
export const LUX_TARGET = {
  living: [100, 200], kitchen: [300, 500], bathroom: [200, 300], bedroom: [50, 150],
  hall: [100, 150], corridor: [75, 150], desk: [300, 500],
};

// ---- CLI ----
const HELP = `usage: node calc.mjs <command> [--key value ...]
  area      --area 28 --reserve 0.07 [--pack 2.4]
  tile      --area 14 --w 20 --h 60 [--joint 2] [--reserve 0.10] [--box 8]
  wallpaper --width 4.2 --height 2.6 [--roll-width 53] [--roll-length 10.05] [--repeat 32] [--match free|straight|half]
  paint     --area 38 [--coats 2] [--coverage 10]
  radiator  --floor 18 [--ceiling 2.7] [--wm2 100] [--glazing 0.1]
  lux       --lumens 4000 --area 18`;

function flags(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) o[argv[i].replace(/^--/, '')] = isNaN(+argv[i + 1]) ? argv[i + 1] : +argv[i + 1];
  return o;
}

// Run the CLI when this file is the entry point, whatever it is named (marketplaces run it from a temp file).
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  const f = flags(rest);
  const run = {
    area: () => areaMaterial({ areaM2: f.area, reserve: f.reserve, packM2: f.pack }),
    tile: () => tilePieces({ areaM2: f.area, tileW: f.w, tileH: f.h, jointMm: f.joint, reserve: f.reserve, boxPcs: f.box }),
    wallpaper: () => wallpaperRolls({ widthM: f.width, heightM: f.height, rollWidthCm: f['roll-width'], rollLengthM: f['roll-length'], repeatCm: f.repeat, match: f.match }),
    paint: () => paintLitres({ areaM2: f.area, coats: f.coats, coverageM2PerL: f.coverage }),
    radiator: () => ({ watts: radiatorWatts({ floorM2: f.floor, ceilingM: f.ceiling, wPerM2: f.wm2, glazingBonus: f.glazing }) }),
    lux: () => ({ lux: averageLux({ lumens: f.lumens, areaM2: f.area }) }),
  }[cmd];
  if (!run) console.log(HELP);
  else console.log(JSON.stringify(run(), null, 2));
}
