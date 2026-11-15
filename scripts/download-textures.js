#!/usr/bin/env node
// Downloads planet textures from solarsystemscope.com to public/textures/
// Usage: node scripts/download-textures.js

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const TEXTURES_DIR = path.join(__dirname, '..', 'public', 'textures');

const DOWNLOADS = [
  // --- Planets (solarsystemscope.com) ---
  { url: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg', file: 'sun.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg', file: 'mercury.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg', file: 'venus.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg', file: 'earth_day.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg', file: 'earth_night.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg', file: 'moon.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg', file: 'mars.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg', file: 'jupiter.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg', file: 'saturn.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png', file: 'saturn_rings.png' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg', file: 'uranus.jpg' },
  { url: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg', file: 'neptune.jpg' },
  // --- Pluto (planetpixelemporium) ---
  // --- Jupiter moons (USGS Astrogeology — public domain) ---
  // --- Titan (Cassini ISS — public domain) ---
];

if (!fs.existsSync(TEXTURES_DIR)) {
  fs.mkdirSync(TEXTURES_DIR, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  SKIP  ${path.basename(dest)} (already exists)`);
      return resolve();
    }
    console.log(`  GET   ${path.basename(dest)} ...`);
    const file = fs.createWriteStream(dest);
    const request = (reqUrl) => {
      const getter = reqUrl.startsWith('https') ? https : http;
      getter.get(reqUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirect
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          fs.unlinkSync(dest);
          return reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(dest).size;
          console.log(`  OK    ${path.basename(dest)} (${(size / 1024).toFixed(0)} KB)`);
          resolve();
        });
      }).on('error', (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
    };
    request(url);
  });
}

async function main() {
  console.log(`\nDownloading ${DOWNLOADS.length} textures to ${TEXTURES_DIR}\n`);
  let ok = 0, fail = 0;
  for (const { url, file } of DOWNLOADS) {
    try {
      await download(url, path.join(TEXTURES_DIR, file));
      ok++;
    } catch (err) {
      console.error(`  FAIL  ${file}: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} downloaded, ${fail} failed\n`);
}

main();
