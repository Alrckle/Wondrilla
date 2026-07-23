import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const logoPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
const buffer = fs.readFileSync(logoPath);
const img = PNG.sync.read(buffer);

// Extract the icon mark (x: 8 to 491)
const iconMinX = 8;
const iconMaxX = 491;
let iconMinY = img.height, iconMaxY = 0;

for (let y = 0; y < img.height; y++) {
    for (let x = iconMinX; x <= iconMaxX; x++) {
        const idx = (img.width * y + x) * 4;
        if (img.data[idx + 3] > 20) {
            if (y < iconMinY) iconMinY = y;
            if (y > iconMaxY) iconMaxY = y;
        }
    }
}

const markW = iconMaxX - iconMinX + 1;
const markH = iconMaxY - iconMinY + 1;
const size = Math.max(markW, markH);

console.log('Icon Mark Size:', markW, 'x', markH, '-> Square Container Size:', size);

// Create square image with centered icon mark and small padding
const padding = 16;
const squareDim = size + padding * 2;
const squareImg = new PNG({ width: squareDim, height: squareDim });

const offsetX = Math.floor((squareDim - markW) / 2);
const offsetY = Math.floor((squareDim - markH) / 2);

for (let y = 0; y < markH; y++) {
    for (let x = 0; x < markW; x++) {
        const srcX = iconMinX + x;
        const srcY = iconMinY + y;
        const srcIdx = (img.width * srcY + srcX) * 4;

        const dstX = offsetX + x;
        const dstY = offsetY + y;
        const dstIdx = (squareDim * dstY + dstX) * 4;

        squareImg.data[dstIdx] = img.data[srcIdx];
        squareImg.data[dstIdx + 1] = img.data[srcIdx + 1];
        squareImg.data[dstIdx + 2] = img.data[srcIdx + 2];
        squareImg.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
}

// Save square icon PNG
const iconPngPath = path.join(process.cwd(), 'assets', 'wondrilla-favicon.png');
fs.writeFileSync(iconPngPath, PNG.sync.write(squareImg));

// Also save as favicon.png and apple-touch-icon.png in root and assets
fs.writeFileSync(path.join(process.cwd(), 'favicon.png'), PNG.sync.write(squareImg));
fs.writeFileSync(path.join(process.cwd(), 'assets', 'wondrilla-icon-official.png'), PNG.sync.write(squareImg));

console.log('Successfully generated official Wondrilla square favicon PNG files!');
