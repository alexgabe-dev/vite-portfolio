import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
const svg = await readFile('public/og/vizitor.svg', 'utf8');
const renderer = new Resvg(svg, { font: { defaultFontFamily: 'Arial', loadSystemFonts: true } });
const png = renderer.render().asPng();
await writeFile('public/og/vizitor.png', png);
await writeFile('public/og/vizitor-share-2026.png', png);
console.log(`Social card: 1200 × 630, ${Math.round(png.length / 1024)} KB`);
