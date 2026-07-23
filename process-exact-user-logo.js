import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const brainDir = 'C:\\Users\\savio\\.gemini\\antigravity-ide\\brain\\a04733e9-5375-4429-838a-27aa99081018';
let inputPath = path.join(brainDir, 'media__1784646404237.png');
if (!fs.existsSync(inputPath)) {
    inputPath = path.join(brainDir, 'uploaded_media_1784646426126.img');
}

console.log('Processing exact user uploaded logo from:', inputPath);

const buffer = fs.readFileSync(inputPath);
const srcPng = PNG.sync.read(buffer);

console.log('Source Image dimensions:', srcPng.width, 'x', srcPng.height);

const outPng = new PNG({
    width: srcPng.width,
    height: srcPng.height
});

// Remove black / near-black background pixels (R<20, G<20, B<20)
for (let i = 0; i < srcPng.data.length; i += 4) {
    const r = srcPng.data[i];
    const g = srcPng.data[i + 1];
    const b = srcPng.data[i + 2];
    const a = srcPng.data[i + 3];

    // If black or near-black background pixel
    if (r < 25 && g < 25 && b < 25) {
        outPng.data[i] = 0;
        outPng.data[i + 1] = 0;
        outPng.data[i + 2] = 0;
        outPng.data[i + 3] = 0; // Fully Transparent
    } else {
        outPng.data[i] = r;
        outPng.data[i + 1] = g;
        outPng.data[i + 2] = b;
        outPng.data[i + 3] = a; // Keep original alpha/pixel
    }
}

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

const targetPngPath = path.join(assetsDir, 'wondrilla-logo-transparent.png');
fs.writeFileSync(targetPngPath, PNG.sync.write(outPng));

console.log('Successfully saved transparent version of exact user logo to:', targetPngPath);
