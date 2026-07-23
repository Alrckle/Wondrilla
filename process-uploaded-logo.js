import fs from 'node:fs';
import path from 'node:path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const imagePath = 'C:\\Users\\savio\\.gemini\\antigravity-ide\\brain\\a04733e9-5375-4429-838a-27aa99081018\\media__1784645133317.jpg';
const jpegData = fs.readFileSync(imagePath);
const rawImageData = jpeg.decode(jpegData, { useTArray: true });

console.log('Decoded JPEG:', rawImageData.width, 'x', rawImageData.height);

const png = new PNG({
    width: rawImageData.width,
    height: rawImageData.height
});

for (let i = 0; i < rawImageData.data.length; i += 4) {
    const r = rawImageData.data[i];
    const g = rawImageData.data[i + 1];
    const b = rawImageData.data[i + 2];

    // Check if pixel is white / near white
    if (r > 220 && g > 220 && b > 220) {
        png.data[i] = 255;
        png.data[i + 1] = 255;
        png.data[i + 2] = 255;
        png.data[i + 3] = 0; // Transparent alpha
    } else {
        png.data[i] = r;
        png.data[i + 1] = g;
        png.data[i + 2] = b;
        png.data[i + 3] = 255; // Solid alpha
    }
}

const outPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
fs.writeFileSync(outPath, PNG.sync.write(png));
console.log('Successfully saved transparent logo PNG to:', outPath);
