import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate Ultra-Crisp White & Green SVG Logo (wondrilla-logo.svg)
// Text: Crisp White (#FFFFFF)
// Circle: Glowing Emerald / Neon Green Gradient
// Backdrop: Transparent background that blends seamlessly into dark theme
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 160" width="540" height="160">
  <defs>
    <!-- Vibrant Emerald / Neon Green Gradient -->
    <linearGradient id="neonGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F050" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>

    <!-- Subtle Glow for Green Circle -->
    <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <!-- Text Shadow for Depth -->
    <filter id="textDepth" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <g id="WondrillaBrandLogo" filter="url(#textDepth)">
    <!-- Glowing Green Circle -->
    <circle cx="80" cy="80" r="66" fill="url(#neonGreenGrad)" filter="url(#emeraldGlow)" />
    
    <!-- Dark Inner Accent in Circle -->
    <circle cx="80" cy="80" r="64" fill="url(#neonGreenGrad)" />

    <!-- 3D Shadow Layer for Wondrilla Text -->
    <text x="64" y="107" 
          font-family="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif" 
          font-size="78" 
          font-weight="800" 
          letter-spacing="-1px" 
          fill="#000000" 
          opacity="0.6">Wondrilla</text>

    <!-- Crisp White Wondrilla Text Layer -->
    <text x="62" y="105" 
          font-family="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif" 
          font-size="78" 
          font-weight="800" 
          letter-spacing="-1px" 
          fill="#FFFFFF">Wondrilla</text>
  </g>
</svg>`;

// 2. Generate White & Green Icon SVG (wondrilla-icon.svg) for Favicons
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="iconGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F050" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="#0e100d" />
  <circle cx="50" cy="50" r="36" fill="url(#iconGreen)" />
  <!-- Crisp White 'W' Mark -->
  <text x="31" y="67" font-family="'Manrope', sans-serif" font-size="50" font-weight="900" fill="#000" opacity="0.5">W</text>
  <text x="29" y="65" font-family="'Manrope', sans-serif" font-size="50" font-weight="900" fill="#FFFFFF">W</text>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'wondrilla-logo.svg'), logoSvg, 'utf8');
fs.writeFileSync(path.join(assetsDir, 'wondrilla-icon.svg'), iconSvg, 'utf8');

console.log('Refined White & Green SVG Logos created successfully!');
