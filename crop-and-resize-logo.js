import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const logoPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
console.log('Cropping logo padding for path:', logoPath);

const buffer = fs.readFileSync(logoPath);
const img = PNG.sync.read(buffer);

let minX = img.width;
let minY = img.height;
let maxX = 0;
let maxY = 0;

// Find bounding box of non-transparent pixels (Alpha > 20)
for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
        const idx = (img.width * y + x) * 4;
        const alpha = img.data[idx + 3];
        if (alpha > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
}

console.log('Bounding Box:', { minX, minY, maxX, maxY });

// Add subtle 8px padding around crop bounds
const pad = 8;
const cropX = Math.max(0, minX - pad);
const cropY = Math.max(0, minY - pad);
const cropW = Math.min(img.width - cropX, (maxX - minX) + pad * 2);
const cropH = Math.min(img.height - cropY, (maxY - minY) + pad * 2);

console.log('Cropped dimensions:', cropW, 'x', cropH);

const cropped = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
        const srcX = cropX + x;
        const srcY = cropY + y;
        const srcIdx = (img.width * srcY + srcX) * 4;
        const dstIdx = (cropW * y + x) * 4;

        cropped.data[dstIdx] = img.data[srcIdx];
        cropped.data[dstIdx + 1] = img.data[srcIdx + 1];
        cropped.data[dstIdx + 2] = img.data[srcIdx + 2];
        cropped.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
}

fs.writeFileSync(logoPath, PNG.sync.write(cropped));
console.log('Successfully cropped excess empty space from logo transparent PNG!');
