import fs from 'node:fs';
import path from 'node:path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const imagePath = 'C:\\Users\\savio\\.gemini\\antigravity-ide\\brain\\a04733e9-5375-4429-838a-27aa99081018\\media__1784645133317.jpg';
const jpegData = fs.readFileSync(imagePath);
const rawImageData = jpeg.decode(jpegData, { useTArray: true });

const png = new PNG({
    width: rawImageData.width,
    height: rawImageData.height
});

for (let i = 0; i < rawImageData.data.length; i += 4) {
    const r = rawImageData.data[i];
    const g = rawImageData.data[i + 1];
    const b = rawImageData.data[i + 2];

    // 1. White background check -> Transparent
    if (r > 215 && g > 215 && b > 215) {
        png.data[i] = 255;
        png.data[i + 1] = 255;
        png.data[i + 2] = 255;
        png.data[i + 3] = 0; // Transparent
    } 
    // 2. Green circle check (where Green is higher than Red and Blue)
    else if (g > r + 15 && g > b + 15) {
        // Keep vibrant neon green circle
        png.data[i] = Math.min(255, Math.floor(r * 0.9));
        png.data[i + 1] = Math.min(255, Math.floor(g * 1.15));
        png.data[i + 2] = Math.min(255, Math.floor(b * 0.9));
        png.data[i + 3] = 255;
    }
    // 3. Purple text ("Won" + "drilla") -> Crisp White Text!
    else {
        png.data[i] = 255;
        png.data[i + 1] = 255;
        png.data[i + 2] = 255;
        png.data[i + 3] = 255; // Solid White Text
    }
}

const outPath = path.join(process.cwd(), 'assets', 'wondrilla-logo-transparent.png');
fs.writeFileSync(outPath, PNG.sync.write(png));
console.log('Successfully saved transparent PNG logo with "Won" inside green circle!');
