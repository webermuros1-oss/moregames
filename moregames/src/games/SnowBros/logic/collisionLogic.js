import { GROUND_Y } from './levelData.js';

// AABB básico
export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// Resuelve colisión vertical de una entidad con plataformas y suelo.
// Solo aterriza si la entidad viene cayendo (vy >= 0) y su borde inferior
// cruza la plataforma en este frame.
export function landOnPlatforms(entity, platforms) {
  // Suelo
  if (entity.y + entity.h >= GROUND_Y) {
    entity.y = GROUND_Y - entity.h;
    entity.vy = 0;
    entity.onGround = true;
    return;
  }

  entity.onGround = false;

  if (entity.vy < 0) return; // subiendo → no aterriza

  const prevBottom = entity.y + entity.h - entity.vy;
  const currBottom = entity.y + entity.h;

  for (const p of platforms) {
    const horizOverlap =
      entity.x + entity.w > p.x + 2 &&
      entity.x < p.x + p.w - 2;

    if (
      horizOverlap &&
      prevBottom <= p.y + 4 &&
      currBottom >= p.y
    ) {
      entity.y = p.y - entity.h;
      entity.vy = 0;
      entity.onGround = true;
      return;
    }
  }
}

// Colisión lateral de proyectil con paredes
export function bounceProjectileWalls(proj, CANVAS_W) {
  if (proj.x <= 0 || proj.x + proj.w >= CANVAS_W) {
    proj.active = false;
  }
}
