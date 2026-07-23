import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate High-Res Vector SVG Logo (wondrilla-logo.svg)
// Vector graphics are infinitely scalable (4K, Retina, 8K) and 100% transparent background!
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" width="520" height="180">
  <defs>
    <!-- Vibrant Green Gradient for the circle -->
    <linearGradient id="greenCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F048" />
      <stop offset="100%" stop-color="#00C832" />
    </linearGradient>
    
    <!-- Purple Gradient for Wondrilla text -->
    <linearGradient id="purpleTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9D38FF" />
      <stop offset="100%" stop-color="#7B1FA2" />
    </linearGradient>
    
    <!-- Soft Glow Filter -->
    <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="4" stdDeviation="3" flood-color="#110022" flood-opacity="0.6" />
    </filter>
  </defs>

  <g id="WondrillaLogoGroup">
    <!-- Green Circle Icon -->
    <circle cx="90" cy="90" r="76" fill="url(#greenCircleGrad)" />

    <!-- 3D Shadow Text Layer -->
    <text x="65" y="116" 
          font-family="'Manrope', 'DM Sans', 'Trebuchet MS', 'Arial Black', sans-serif" 
          font-size="82" 
          font-weight="900" 
          font-style="normal"
          letter-spacing="-1.5px" 
          fill="#1c0033">Wondrilla</text>
    <text x="64" y="115" 
          font-family="'Manrope', 'DM Sans', 'Trebuchet MS', 'Arial Black', sans-serif" 
          font-size="82" 
          font-weight="900" 
          font-style="normal"
          letter-spacing="-1.5px" 
          fill="#1c0033">Wondrilla</text>

    <!-- Main Purple Text Layer -->
    <text x="62" y="113" 
          font-family="'Manrope', 'DM Sans', 'Trebuchet MS', 'Arial Black', sans-serif" 
          font-size="82" 
          font-weight="900" 
          font-style="normal"
          letter-spacing="-1.5px" 
          fill="url(#purpleTextGrad)">Wondrilla</text>
  </g>
</svg>`;

// 2. Generate Icon Only SVG (wondrilla-icon.svg) for Favicons & Mark Avatars
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F048" />
      <stop offset="100%" stop-color="#00C832" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="26" fill="#0e100d" />
  <circle cx="50" cy="50" r="38" fill="url(#iconGrad)" />
  <text x="32" y="68" font-family="'Manrope', sans-serif" font-size="52" font-weight="900" fill="#1c0033">W</text>
  <text x="30" y="66" font-family="'Manrope', sans-serif" font-size="52" font-weight="900" fill="#9D38FF">W</text>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'wondrilla-logo.svg'), logoSvg, 'utf8');
fs.writeFileSync(path.join(assetsDir, 'wondrilla-icon.svg'), iconSvg, 'utf8');

console.log('SVG Vector Logos created successfully in assets/ directory!');
