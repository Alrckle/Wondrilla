import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const logoPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
const buffer = fs.readFileSync(logoPath);
const img = PNG.sync.read(buffer);

console.log('Original Logo Dimensions:', img.width, 'x', img.height);

// Let's check non-transparent bounding box
let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
        const idx = (img.width * y + x) * 4;
        if (img.data[idx + 3] > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
}

console.log('Bounding Box:', { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY });
