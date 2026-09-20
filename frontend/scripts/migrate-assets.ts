import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.resolve(ROOT, '../legacy-codebase');
const PUBLIC_DIR = path.resolve(ROOT, 'public');

// 1. Migrate Geist fonts
const fontsSrc = path.join(LEGACY_DIR, 'assets/cdn/fonts.gstatic.com/s/geist/v4');
const fontsDest = path.join(PUBLIC_DIR, 'fonts/geist');
fs.mkdirSync(fontsDest, { recursive: true });

if (fs.existsSync(fontsSrc)) {
  const fontFiles = fs.readdirSync(fontsSrc);
  for (const file of fontFiles) {
    fs.copyFileSync(path.join(fontsSrc, file), path.join(fontsDest, file));
    console.log(`Copied font: ${file}`);
  }
}

// 2. Migrate images and SVGs
const imagesSrc = path.join(LEGACY_DIR, 'assets/cdn/framerusercontent.com/images');
const imagesDest = path.join(PUBLIC_DIR, 'images');
fs.mkdirSync(imagesDest, { recursive: true });

if (fs.existsSync(imagesSrc)) {
  const imageFiles = fs.readdirSync(imagesSrc);
  for (const file of imageFiles) {
    fs.copyFileSync(path.join(imagesSrc, file), path.join(imagesDest, file));
  }
  console.log(`Copied ${imageFiles.length} images into public/images/`);
}

// 3. Copy favicon if exists
const iconSrc = path.join(imagesSrc, 'raYSVHk1C0dQhjqZ7D07J5oriI.svg');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(PUBLIC_DIR, 'favicon.svg'));
  console.log('Copied favicon.svg');
}

console.log('Asset migration completed successfully.');
