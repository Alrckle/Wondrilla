import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate High-Res SVG Logo with "Won" inside Green Circle & "drilla" to the right!
// Text: Crisp White (#FFFFFF) with 3D drop shadow
// Circle: Glowing Emerald Green behind "Won"
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160" width="560" height="160">
  <defs>
    <!-- Vibrant Emerald / Neon Green Gradient -->
    <linearGradient id="wonGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F050" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>

    <!-- Outer Emerald Glow for Circle -->
    <filter id="circleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <!-- Crisp 3D Text Drop Shadow -->
    <filter id="textShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <g id="WondrillaLogoGroup" filter="url(#textShadow)">
    <!-- Green Circle Encasing "Won" -->
    <circle cx="118" cy="80" r="68" fill="url(#wonGreenGrad)" filter="url(#circleGlow)" />
    <circle cx="118" cy="80" r="66" fill="url(#wonGreenGrad)" />

    <!-- 3D Shadow Layer for Wondrilla -->
    <text x="34" y="108" 
          font-family="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif" 
          font-size="82" 
          font-weight="900" 
          letter-spacing="-1px" 
          fill="#000000" 
          opacity="0.65">Wondrilla</text>

    <!-- Crisp White Text Layer: "Won" inside green circle + "drilla" to the right -->
    <text x="32" y="106" 
          font-family="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif" 
          font-size="82" 
          font-weight="900" 
          letter-spacing="-1px" 
          fill="#FFFFFF">Wondrilla</text>
  </g>
</svg>`;

// 2. Generate Matching Icon SVG (wondrilla-icon.svg) with "Won" in Green Circle!
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="iconWonGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F050" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="32" fill="#0e100d" />
  <!-- Green Circle -->
  <circle cx="60" cy="60" r="46" fill="url(#iconWonGreen)" />
  <!-- Crisp White "Won" text centered inside circle -->
  <text x="61" y="74" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="40" font-weight="900" fill="#000" opacity="0.55">Won</text>
  <text x="60" y="72" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="40" font-weight="900" fill="#FFFFFF">Won</text>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'wondrilla-logo.svg'), logoSvg, 'utf8');
fs.writeFileSync(path.join(assetsDir, 'wondrilla-icon.svg'), iconSvg, 'utf8');

console.log('Successfully generated "Won" inside Green Circle SVG Logo & Icon!');
