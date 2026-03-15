// ── Bucle de juego ─────────────────────────────────────────────────────────

import { LEVEL_1, LEVELS }                                              from './levelData.js';
import { createPlayer, updatePlayer, tryShoot, tryPike, damagePlayer, getPlayerFrame } from './player.js';
import { createEnemy, updateEnemy, tryEnemyShoot, damageEnemy }        from './enemies.js';
import { updateBullets, updateExplosions, cleanup }                     from './bullets.js';
import { createCamera, updateCamera }                                   from './camera.js';
import {
  resolvePlatforms,
  checkBulletsVsEnemies,
  checkBulletsVsPlayer,
  checkPlayerVsPrisoners,
  checkPlayerVsEnemyContact,
  overlaps,
} from './collisions.js';

export { getPlayerFrame };

export const CANVAS_W = 480;
export const CANVAS_H = 270;

export function createGameState(levelIndex = 0) {
  const lvl = LEVELS[levelIndex] ?? LEVEL_1;
  return {
    level:      lvl,
    levelIndex,
    player:     createPlayer(60, lvl.platforms[0].y - 34),
    enemies:    lvl.enemies.map(e => createEnemy(e)),
    prisoners:  lvl.prisoners?.map(p => ({ ...p, w: 14, h: 24, rescued: false })) ?? [],
    bullets:    [],
    explosions: [],
    camera:     createCamera(),
    tick:       0,
    over:       false,
    won:        false,
  };
}

export function tickGame(gs, keys, now, onScore, onDie, onWin) {
  if (gs.over || gs.won) return;

  const { player, enemies, bullets, explosions, level, camera } = gs;

  // ── Acciones del jugador ──
  updatePlayer(player, keys, now, level.width);

  if (keys.shoot) {
    const b = tryShoot(player, now);
    if (b) bullets.push(b);
  }
  if (keys.pikePressed) {
    keys.pikePressed = false;
    tryPike(player, now);
  }

  // ── Plataformas jugador ──
  player.onGround = resolvePlatforms(player, level.platforms);
  if (player.y + player.h > CANVAS_H + 100) {
    damagePlayer(player, 1, now);
    player.x  = Math.max(camera.x + 40, player.x);
    player.y  = level.platforms[0].y - player.h - 4;
    player.vy = 0;
  }

  // ── Enemigos ──
  for (const e of enemies) {
    updateEnemy(e, player, now, level.width);
    e.onGround = resolvePlatforms(e, level.platforms);
    const b = tryEnemyShoot(e, player, now);
    if (b) bullets.push(b);
  }

  // ── Balas ──
  updateBullets(bullets, level.width);
  updateExplosions(explosions, now);

  // ── Pica: colisión cuerpo a cuerpo ──
  if (player.pikeHit) {
    for (const e of enemies) {
      if (e.state === 'dead') continue;
      if (overlaps(player.pikeHit, e) && !e._pikeHit) {
        e._pikeHit = now + 300; // cooldown para no dañar 60 veces por frame
        damageEnemy(e, 1);
        if (e.state === 'dead' && !e._scored) {
          e._scored = true;
          player.score += e.type === 'boss' ? 5000 : 150;
          onScore?.(player.score);
        }
      }
    }
  }
  // Limpiar cooldown de hit de pica
  for (const e of enemies) {
    if (e._pikeHit && now > e._pikeHit) e._pikeHit = 0;
  }

  // ── Balas → enemigos ──
  checkBulletsVsEnemies(bullets, enemies, (e, dmg) => {
    damageEnemy(e, dmg);
    if (e.state === 'dead' && !e._scored) {
      e._scored = true;
      player.score += e.type === 'boss' ? 5000 : 200;
      onScore?.(player.score);
    }
  });

  // ── Balas → jugador ──
  checkBulletsVsPlayer(bullets, player, (p, dmg) => damagePlayer(p, dmg, now));

  // ── Contacto boss / piquero → jugador ──
  checkPlayerVsEnemyContact(player, enemies.filter(e => e.type === 'boss' || e.type === 'pikeman'), () => {
    damagePlayer(player, 1, now);
  });

  // ── Prisioneros ──
  checkPlayerVsPrisoners(player, gs.prisoners, () => {
    player.score += 500;
    onScore?.(player.score);
  });

  cleanup(bullets);
  cleanup(explosions);

  updateCamera(camera, player, level.width, CANVAS_W, CANVAS_H);

  // ── Victoria ──
  if (player.x + player.w >= level.flagX && !gs.won) {
    const boss = enemies.find(e => e.type === 'boss');
    if (!boss || boss.state === 'dead') {
      gs.won = true;
      onWin?.();
    }
  }

  // ── Derrota ──
  if (player.state === 'dead' && !gs.over) {
    setTimeout(() => { gs.over = true; onDie?.(); }, 1500);
  }

  gs.tick++;
}
