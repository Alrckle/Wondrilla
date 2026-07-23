import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const logoPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
const buffer = fs.readFileSync(logoPath);
const img = PNG.sync.read(buffer);

// Analyze column opacity density to see if there is an icon mark separate from text
const colDensity = [];
for (let x = 0; x < img.width; x++) {
    let count = 0;
    for (let y = 0; y < img.height; y++) {
        const idx = (img.width * y + x) * 4;
        if (img.data[idx + 3] > 20) count++;
    }
    colDensity.push(count);
}

// Find gaps (vertical empty space between icon mark and text)
let inObject = false;
let objects = [];
let start = 0;
for (let x = 0; x < colDensity.length; x++) {
    if (colDensity[x] > 5 && !inObject) {
        inObject = true;
        start = x;
    } else if (colDensity[x] <= 5 && inObject) {
        inObject = false;
        objects.push({ start, end: x });
    }
}
if (inObject) objects.push({ start, end: colDensity.length - 1 });

console.log('Objects found horizontally:', objects);
