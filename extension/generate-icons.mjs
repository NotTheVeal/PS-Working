/**
 * Generates the extension PNG icons using a headless browser.
 * Run once: node generate-icons.mjs
 */
import { chromium } from '/home/user/PS-Working/node_modules/playwright/index.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgTemplate = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1d4ed8"/>
      <stop offset="100%" style="stop-color:#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <!-- Gear icon -->
  <g transform="translate(${size/2}, ${size/2})">
    <circle r="${size*0.18}" fill="white" opacity="0.9"/>
    <circle r="${size*0.08}" fill="#1d4ed8"/>
    ${[0,45,90,135,180,225,270,315].map(deg => {
      const rad = deg * Math.PI / 180;
      const x = Math.cos(rad) * size * 0.23;
      const y = Math.sin(rad) * size * 0.23;
      return `<rect x="${x - size*0.055}" y="${y - size*0.055}" width="${size*0.11}" height="${size*0.11}" rx="${size*0.02}" fill="white" opacity="0.9" transform="rotate(${deg} ${x} ${y})"/>`;
    }).join('')}
  </g>
</svg>`;

const htmlTemplate = (size) => `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent">
${svgTemplate(size)}
</body></html>`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});

for (const size of [16, 48, 128]) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(htmlTemplate(size));
  const buffer = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  writeFileSync(path.join(__dirname, 'icons', `icon${size}.png`), buffer);
  await page.close();
  console.log(`Generated icon${size}.png`);
}

await browser.close();
console.log('Done.');
