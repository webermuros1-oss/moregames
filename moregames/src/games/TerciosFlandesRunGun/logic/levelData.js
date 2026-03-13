// ── Datos de nivel ─────────────────────────────────────────────────────────

export const TILE_SIZE = 32;
export const CANVAS_W  = 480;
export const CANVAS_H  = 270;
export const GROUND_Y  = 238;

// ── Nivel 1 — Campamento de Flandes (fondo oscuro: tiles2.png) ─────────────
export const LEVEL_1 = {
  width: 4800,
  height: CANVAS_H,
  bgIndex: 0,   // tiles2.png

  platforms: [
    { x: 0,    y: GROUND_Y, w: 4800, h: 32 },
    { x: 340,  y: 198, w: 112, h: 16 },
    { x: 560,  y: 172, w: 96,  h: 16 },
    { x: 780,  y: 190, w: 128, h: 16 },
    { x: 1100, y: 195, w: 96,  h: 16 },
    { x: 1320, y: 168, w: 96,  h: 16 },
    { x: 1520, y: 142, w: 96,  h: 16 },
    { x: 1720, y: 168, w: 96,  h: 16 },
    { x: 2100, y: 155, w: 200, h: 16 },
    { x: 2100, y: 192, w: 64,  h: 16 },
    { x: 2390, y: 155, w: 64,  h: 16 },
    { x: 2700, y: 122, w: 280, h: 16 },
    { x: 2700, y: 172, w: 80,  h: 16 },
    { x: 3040, y: 162, w: 80,  h: 16 },
    { x: 3380, y: 192, w: 160, h: 16 },
    { x: 3680, y: 168, w: 128, h: 16 },
    { x: 3970, y: 145, w: 160, h: 16 },
    { x: 4190, y: 172, w: 128, h: 16 },
  ],

  decorations: [
    { type:'tree',   x:80,   y:GROUND_Y-65, w:26, h:65 },
    { type:'tree',   x:240,  y:GROUND_Y-75, w:26, h:75 },
    { type:'tree',   x:870,  y:GROUND_Y-70, w:26, h:70 },
    { type:'tree',   x:2620, y:GROUND_Y-80, w:26, h:80 },
    { type:'house',  x:160,  y:GROUND_Y-78, w:68, h:78 },
    { type:'house',  x:1870, y:GROUND_Y-85, w:84, h:85 },
    { type:'tower',  x:2080, y:GROUND_Y-125,w:42, h:125 },
    { type:'tower',  x:2430, y:GROUND_Y-125,w:42, h:125 },
    { type:'cannon', x:310,  y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon', x:1080, y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon', x:2250, y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon', x:3580, y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon', x:4280, y:GROUND_Y-26, w:54, h:26 },
    { type:'barrel', x:448,  y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:468,  y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:1350, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:2430, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:3200, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:3220, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel', x:4140, y:GROUND_Y-22, w:18, h:22 },
  ],

  enemies: [
    { type:'archer',  x:420,  y:GROUND_Y-34, patrolRange:80 },
    { type:'pikeman', x:680,  y:GROUND_Y-34, patrolRange:60 },
    { type:'archer',  x:950,  y:GROUND_Y-34, patrolRange:80 },
    { type:'pikeman', x:1200, y:195-34,       patrolRange:60 },
    { type:'archer',  x:1400, y:GROUND_Y-34, patrolRange:70 },
    { type:'pikeman', x:1620, y:GROUND_Y-34, patrolRange:50 },
    { type:'archer',  x:1900, y:GROUND_Y-34, patrolRange:0  },
    { type:'pikeman', x:2200, y:155-34,       patrolRange:90 },
    { type:'archer',  x:2500, y:GROUND_Y-34, patrolRange:70 },
    { type:'pikeman', x:2760, y:122-34,       patrolRange:0  },
    { type:'archer',  x:3000, y:GROUND_Y-34, patrolRange:80 },
    { type:'pikeman', x:3200, y:GROUND_Y-34, patrolRange:80 },
    { type:'archer',  x:3500, y:GROUND_Y-34, patrolRange:0  },
    { type:'pikeman', x:3800, y:168-34,       patrolRange:80 },
    { type:'archer',  x:4100, y:145-34,       patrolRange:80 },
    { type:'boss',    x:4480, y:GROUND_Y-64 },
  ],

  prisoners: [
    { x:1080, y:GROUND_Y-34 },
    { x:2790, y:122-34 },
    { x:4030, y:145-34 },
  ],

  flagX: 4700,
};

// ── Nivel 2 — Campiña de Flandes (fondo verde: bg2.png) ────────────────────
export const LEVEL_2 = {
  width: 5200,
  height: CANVAS_H,
  bgIndex: 1,   // bg2.png

  platforms: [
    { x:0,    y:GROUND_Y, w:5200, h:32 },
    { x:320,  y:200, w:120, h:16 },
    { x:560,  y:175, w:100, h:16 },
    { x:820,  y:155, w:112, h:16 },
    { x:1100, y:180, w:96,  h:16 },
    { x:1380, y:155, w:112, h:16 },
    { x:1650, y:132, w:96,  h:16 },
    { x:1900, y:160, w:96,  h:16 },
    { x:2200, y:138, w:220, h:16 },
    { x:2200, y:190, w:64,  h:16 },
    { x:2500, y:140, w:64,  h:16 },
    { x:2800, y:115, w:300, h:16 },
    { x:3200, y:155, w:100, h:16 },
    { x:3500, y:185, w:160, h:16 },
    { x:3800, y:160, w:140, h:16 },
    { x:4100, y:138, w:180, h:16 },
    { x:4400, y:168, w:140, h:16 },
  ],

  decorations: [
    { type:'tree',  x:80,   y:GROUND_Y-80, w:28, h:80 },
    { type:'tree',  x:280,  y:GROUND_Y-90, w:28, h:90 },
    { type:'tree',  x:950,  y:GROUND_Y-75, w:28, h:75 },
    { type:'tree',  x:2100, y:GROUND_Y-85, w:28, h:85 },
    { type:'tree',  x:3600, y:GROUND_Y-80, w:28, h:80 },
    { type:'house', x:200,  y:GROUND_Y-90, w:80, h:90 },
    { type:'house', x:1800, y:GROUND_Y-90, w:80, h:90 },
    { type:'tower', x:2180, y:GROUND_Y-130,w:44, h:130 },
    { type:'tower', x:2520, y:GROUND_Y-130,w:44, h:130 },
    { type:'cannon',x:360,  y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon',x:1200, y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon',x:2700, y:GROUND_Y-26, w:54, h:26 },
    { type:'cannon',x:4200, y:GROUND_Y-26, w:54, h:26 },
    { type:'barrel',x:490,  y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel',x:510,  y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel',x:1480, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel',x:3300, y:GROUND_Y-22, w:18, h:22 },
    { type:'barrel',x:4480, y:GROUND_Y-22, w:18, h:22 },
  ],

  enemies: [
    { type:'pikeman', x:440,  y:GROUND_Y-34, patrolRange:80 },
    { type:'archer',  x:680,  y:GROUND_Y-34, patrolRange:60 },
    { type:'pikeman', x:900,  y:155-34,       patrolRange:60 },
    { type:'archer',  x:1150, y:GROUND_Y-34, patrolRange:70 },
    { type:'pikeman', x:1400, y:GROUND_Y-34, patrolRange:60 },
    { type:'archer',  x:1650, y:132-34,       patrolRange:50 },
    { type:'pikeman', x:1960, y:GROUND_Y-34, patrolRange:0  },
    { type:'archer',  x:2300, y:138-34,       patrolRange:80 },
    { type:'pikeman', x:2600, y:GROUND_Y-34, patrolRange:70 },
    { type:'archer',  x:2850, y:115-34,       patrolRange:0  },
    { type:'pikeman', x:3100, y:GROUND_Y-34, patrolRange:80 },
    { type:'archer',  x:3380, y:GROUND_Y-34, patrolRange:80 },
    { type:'pikeman', x:3650, y:185-34,       patrolRange:60 },
    { type:'archer',  x:3900, y:160-34,       patrolRange:80 },
    { type:'pikeman', x:4200, y:138-34,       patrolRange:80 },
    { type:'boss',    x:4950, y:GROUND_Y-64 },
  ],

  prisoners: [
    { x:1200, y:GROUND_Y-34 },
    { x:2900, y:115-34 },
    { x:4150, y:138-34 },
  ],

  flagX: 5100,
};

export const LEVELS = [LEVEL_1, LEVEL_2];
