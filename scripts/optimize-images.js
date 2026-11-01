const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'assets', 'images');
const images = [
  'campus_hero.jpg',
  'montessori_class.jpg',
  'robotics_lab.jpg',
  'science_lab.jpg',
  'sports_complex.jpg'
];

async function optimize() {
  console.log('Optimizing images in:', imgDir);
  let totalOrig = 0;
  let totalWebp = 0;
  let totalJpg = 0;

  for (const file of images) {
    const inputPath = path.join(imgDir, file);
    const origStats = fs.statSync(inputPath);
    totalOrig += origStats.size;

    const baseName = path.basename(file, path.extname(file));
    const webpPath = path.join(imgDir, `${baseName}.webp`);
    const tempJpgPath = path.join(imgDir, `${baseName}.opt.jpg`);

    // 1. Generate WebP (quality 75, effort 6)
    await sharp(inputPath)
      .webp({ quality: 75, effort: 6 })
      .toFile(webpPath);
    const webpStats = fs.statSync(webpPath);
    totalWebp += webpStats.size;

    // 2. Generate optimized MozJPEG (quality 75, progressive)
    await sharp(inputPath)
      .jpeg({ quality: 75, progressive: true, mozjpeg: true })
      .toFile(tempJpgPath);
    
    // Replace original JPG with optimized version
    fs.renameSync(tempJpgPath, inputPath);
    const optJpgStats = fs.statSync(inputPath);
    totalJpg += optJpgStats.size;

    console.log(`[${file}]`);
    console.log(`  Orig JPG: ${(origStats.size / 1024).toFixed(1)} KB`);
    console.log(`  Opt  JPG: ${(optJpgStats.size / 1024).toFixed(1)} KB (-${((1 - optJpgStats.size / origStats.size) * 100).toFixed(1)}%)`);
    console.log(`  WebP:     ${(webpStats.size / 1024).toFixed(1)} KB (-${((1 - webpStats.size / origStats.size) * 100).toFixed(1)}%)`);
  }

  console.log('--------------------------------------------------');
  console.log(`TOTAL Original: ${(totalOrig / 1024 / 1024).toFixed(2)} MB`);
  console.log(`TOTAL Opt JPG:  ${(totalJpg / 1024 / 1024).toFixed(2)} MB (-${((1 - totalJpg / totalOrig) * 100).toFixed(1)}%)`);
  console.log(`TOTAL WebP:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB (-${((1 - totalWebp / totalOrig) * 100).toFixed(1)}%)`);
}

optimize().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});
