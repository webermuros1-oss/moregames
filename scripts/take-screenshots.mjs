// scripts/take-screenshots.mjs
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT  = path.resolve(__dirname, '../docs/screenshots');
const BASE = 'http://localhost:5173';
const VP   = { width: 1280, height: 720 };
const W    = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, file) {
  await page.screenshot({ path: path.join(OUT, file), fullPage: false });
  console.log(`✓ ${file}`);
}

async function openGame(page, emoji) {
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await W(400);
  await page.evaluate(em => {
    const el = [...document.querySelectorAll('.dash-card-emoji')]
      .find(e => e.textContent.trim() === em);
    el?.closest('button,[role=button],li,div[tabindex],.dash-card')?.click();
  }, emoji);
  await W(1800);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport(VP);

  // ── Dashboard ────────────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await W(600);
  await shot(page, 'dashboard.png');

  // ── Puzzle: espera a que haya piezas en el tablero ───────
  await openGame(page, '🧩');
  // Drag una pieza al tablero para mostrar algo de gameplay
  await W(500);
  await shot(page, 'puzzle.png');

  // ── Batalla Naval: mueve algunos barcos y captura ────────
  await openGame(page, '⚓');
  // Click en "Auto" para colocar la flota automáticamente
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => b.textContent.includes('Auto'));
    btn?.click();
  });
  await W(800);
  await shot(page, 'battleship.png');

  // ── Snow Kids: click READY para entrar al nivel ──────────
  await openGame(page, '❄');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => /ready|jugar|start|comenzar/i.test(b.textContent));
    btn?.click();
  });
  await W(1200);
  await shot(page, 'snowkids.png');

  // ── Rompe Queixos: click COMEZAR para entrar al juego ────
  await openGame(page, '🧀');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => /comezar|start|jugar|comenzar/i.test(b.textContent));
    btn?.click();
  });
  await W(1500);
  await shot(page, 'rompequeixos.png');

  await browser.close();
  console.log('\nListo — docs/screenshots/');
})();
