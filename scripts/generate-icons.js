const sharp = require('sharp');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'assets', 'images');

const svg512 = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="108" fill="#0a1128"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#f59e0b" stroke-width="12" opacity="0.85"/>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="220">🎓</text>
</svg>
`);

async function makeIcons() {
  await sharp(svg512).resize(512, 512).png().toFile(path.join(imgDir, 'icon-512.png'));
  await sharp(svg512).resize(192, 192).png().toFile(path.join(imgDir, 'icon-192.png'));
  console.log('PWA icons icon-512.png and icon-192.png created.');
}

makeIcons().catch(console.error);
