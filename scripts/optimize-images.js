import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEAM_IMAGES = [
  {
    input: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    output: 'src/assets/images/team/member1.webp',
    width: 400,
    height: 400
  },
  {
    input: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    output: 'src/assets/images/team/member2.webp',
    width: 400,
    height: 400
  },
  {
    input: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    output: 'src/assets/images/team/member3.webp',
    width: 400,
    height: 400
  }
];

async function optimizeImage({ input, output, width, height }) {
  try {
    // Letöltjük a képet
    const response = await fetch(input);
    const buffer = await response.arrayBuffer();

    // Optimalizáljuk a képet
    await sharp(Buffer.from(buffer))
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 80,
        effort: 6
      })
      .toFile(output);

    console.log(`✅ ${output} optimalizálva`);
  } catch (error) {
    console.error(`❌ Hiba a ${output} optimalizálásakor:`, error);
  }
}

async function optimizeAllImages() {
  try {
    // Ellenőrizzük/létrehozzuk a könyvtárakat
    await fs.mkdir(path.dirname(TEAM_IMAGES[0].output), { recursive: true });

    // Optimalizáljuk a képeket
    await Promise.all(TEAM_IMAGES.map(optimizeImage));

    console.log('🎉 Minden kép optimalizálva!');
  } catch (error) {
    console.error('❌ Hiba történt:', error);
    process.exit(1);
  }
}

optimizeAllImages(); 