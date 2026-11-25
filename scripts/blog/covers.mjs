// Branded covers for posts without an uploaded image: dark Vizitor background, the site's orange
// line art (unique per post, seeded) and the site's own 3D object rendered at high resolution.
// Deterministic: the same post always produces the same image, so builds stay cache-friendly.
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const require = createRequire(path.join(root, 'blog/package.json'));
const sharp = require('sharp');
const ART_DIR = path.join(root, 'blog/art');

function rng(seedText) {
  let h = createHash('sha256').update(seedText).digest().readUInt32LE(0) || 1;
  return () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function backdrop(width, height, rand, objectX, objectY) {
  const r = (min, max) => min + rand() * (max - min);
  const s = width / 1600; // stroke/size scale
  // Two flowing double strokes hugging opposite corners, like the home page's light section art.
  const curve = (x0, y0, flip) => {
    const k = flip ? -1 : 1;
    const c1x = x0 + k * r(140, 260) * s, c1y = y0 + r(120, 240) * s;
    const c2x = x0 + k * r(-80, 120) * s, c2y = y0 + r(360, 520) * s;
    const x1 = x0 + k * r(160, 300) * s, y1 = y0 + r(520, 700) * s;
    return `M${x0} ${y0}C${c1x} ${c1y} ${c2x} ${c2y} ${x1} ${y1}`;
  };
  const a = curve(r(-0.06, 0.04) * width, -0.12 * height, false);
  const b = curve(r(0.96, 1.06) * width, r(0.3, 0.55) * height, true);
  const glowR = Math.round(height * r(0.55, 0.7));
  const ring = Math.round(height * r(0.3, 0.42));
  const ringX = Math.round(r(0.06, 0.18) * width), ringY = Math.round(r(0.78, 0.95) * height);
  const sq = { x: Math.round(r(0.72, 0.9) * width), y: Math.round(r(0.1, 0.22) * height), a: Math.round(r(10, 40)) };
  const plus = (x, y) => `M${x} ${y - 9 * s}v${18 * s}M${x - 9 * s} ${y}h${18 * s}`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1014"/><stop offset=".55" stop-color="#141a1f"/><stop offset="1" stop-color="#1c262d"/></linearGradient>
    <radialGradient id="glow" cx="${objectX / width}" cy="${objectY / height}" r="${glowR / width}" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#ff5c35" stop-opacity=".16"/><stop offset="1" stop-color="#ff5c35" stop-opacity="0"/></radialGradient>
    <radialGradient id="floor" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g fill="none" stroke="#ff5c35" stroke-width="${2 * s}">
    <path d="${a}" opacity=".34"/><path d="${a}" transform="translate(${26 * s} ${18 * s})" opacity=".15"/>
    <path d="${b}" opacity=".3"/><path d="${b}" transform="translate(${-24 * s} ${20 * s})" opacity=".13"/>
    <circle cx="${ringX}" cy="${ringY}" r="${ring}" stroke-width="${1.4 * s}" opacity=".14"/>
    <g opacity=".5" stroke-width="${1.8 * s}"><path d="${plus(r(0.04, 0.12) * width, r(0.2, 0.35) * height)}"/><path d="${plus(r(0.86, 0.95) * width, r(0.72, 0.9) * height)}"/></g>
  </g>
  <circle cx="${ringX}" cy="${ringY}" r="${ring * 0.78}" fill="#ff5c35" opacity=".05"/>
  <rect x="${sq.x}" y="${sq.y}" width="${26 * s}" height="${26 * s}" rx="${5 * s}" transform="rotate(${sq.a} ${sq.x} ${sq.y})" fill="#ff5c35" opacity=".22"/>
  <ellipse cx="${objectX}" cy="${objectY + height * 0.27}" rx="${height * 0.3}" ry="${height * 0.045}" fill="url(#floor)"/>
</svg>`);
}

/** Compose one cover at an exact size. */
export async function renderCover({ seed, art, width, height }) {
  const rand = rng(seed + ':' + width + 'x' + height);
  const wide = width / height > 1.7;
  const objectX = Math.round(width * (wide ? 0.66 : 0.6) + (rand() - 0.5) * width * 0.04);
  const objectY = Math.round(height * 0.47);
  const file = path.join(ART_DIR, `${art}.webp`);
  const meta = await sharp(file).metadata();
  const targetH = Math.round(height * (art === 'signature' ? 0.5 : 0.62));
  const targetW = Math.round(meta.width * (targetH / meta.height));
  const object = await sharp(file).resize(targetW, targetH).toBuffer();
  return sharp(backdrop(width, height, rand, objectX, objectY))
    .composite([{ input: object, left: Math.round(objectX - targetW / 2), top: Math.round(objectY - targetH / 2) }])
    .png()
    .toBuffer();
}
