import fs from 'node:fs';
import path from 'node:path';

const faviconPngPath = path.join(process.cwd(), 'assets', 'wondrilla-favicon.png');
const pngData = fs.readFileSync(faviconPngPath);
const base64Png = pngData.toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 484 484" width="484" height="484">
  <image href="data:image/png;base64,${base64Png}" width="484" height="484" />
</svg>`;

const svgPath = path.join(process.cwd(), 'assets', 'wondrilla-icon.svg');
fs.writeFileSync(svgPath, svgContent);
console.log('Successfully updated assets/wondrilla-icon.svg with official logo emblem base64!');
