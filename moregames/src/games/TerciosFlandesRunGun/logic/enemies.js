// ── Enemigos ───────────────────────────────────────────────────────────────

const GRAVITY     = 0.35;
const SIGHT_RANGE = 220;   // px — distancia a la que detectan al jugador
const SHOOT_CD    = { pikeman: 99999, archer: 700, boss: 900 };
const SPEED       = { pikeman: 1.0,   archer: 0,   boss: 1.4  };
const MAX_HP      = { pikeman: 2,     archer: 3,   boss: 20   };

export function createEnemy({ type, x, y, patrolRange = 80 }) {
  return {
    type,
    x, y,
    w: type === 'boss' ? 40 : 20,
    h: type === 'boss' ? 48 : 28,
    vx: 0, vy: 0,
    facing: -1,
    state: 'patrol',   // patrol | alert | shoot | hit | dead
    hp: MAX_HP[type] ?? 2,
    maxHp: MAX_HP[type] ?? 2,
    onGround: false,
    shootCd: 0,
    animFrame: 0,
    animTimer: 0,
    patrolLeft:  x - patrolRange,
    patrolRight: x + patrolRange,
    _scored: false,
    chargeTimer: 0,
    chargeCooldown: 0,
  };
}

export function updateEnemy(enemy, player, now, levelW) {
  if (enemy.state === 'dead') {
    enemy.vy += GRAVITY;
    enemy.y  += enemy.vy;
    return;
  }

  // ── Gravedad ──
  if (!enemy.onGround) enemy.vy += GRAVITY;
  enemy.y += enemy.vy;

  // ── Distancia al jugador ──
  const dx      = player.x - enemy.x;
  const dist    = Math.abs(dx);
  const inSight = dist < SIGHT_RANGE && player.state !== 'dead';

  // ── IA según tipo ──
  if (enemy.type === 'boss') {
    updateBoss(enemy, player, dx, dist, inSight, now);
  } else if (enemy.type === 'archer') {
    // Arquero: estático, dispara en rango
    if (inSight) {
      enemy.facing = dx > 0 ? 1 : -1;
      enemy.state  = 'alert';
    } else {
      enemy.state = 'patrol';
    }
  } else {
    // Piquero: patrulla y se acerca al jugador para atacar por contacto
    if (inSight) {
      enemy.facing = dx > 0 ? 1 : -1;
      enemy.state  = dist > 30 ? 'alert' : 'shoot';
      if (dist > 30) {
        enemy.vx = SPEED.pikeman * enemy.facing;
      } else {
        enemy.vx = 0;
      }
    } else {
      enemy.state = 'patrol';
      enemy.vx    = SPEED.pikeman * enemy.facing;
      if (enemy.x <= enemy.patrolLeft)               enemy.facing =  1;
      if (enemy.x + enemy.w >= enemy.patrolRight)    enemy.facing = -1;
    }
    enemy.x += enemy.vx;
    enemy.x = Math.max(0, Math.min(levelW - enemy.w, enemy.x));
  }

  // ── Animación ──
  enemy.animTimer++;
  const frameSpeed = enemy.state === 'patrol' ? 8 : 6;
  if (enemy.animTimer >= frameSpeed) {
    enemy.animTimer = 0;
    enemy.animFrame = (enemy.animFrame + 1) % 4;
  }
}

function updateBoss(boss, _player, dx, dist, inSight, now) {
  if (!inSight) { boss.state = 'patrol'; boss.vx = 0; return; }

  boss.facing = dx > 0 ? 1 : -1;

  if (dist > 100 && now > boss.chargeCooldown) {
    boss.state          = 'alert';
    boss.vx             = SPEED.boss * 2.5 * boss.facing;
    boss.chargeCooldown = now + 2500;
  } else if (dist <= 80) {
    boss.vx    = 0;
    boss.state = 'shoot';
  } else {
    boss.vx = SPEED.boss * boss.facing;
  }

  boss.x += boss.vx;
}

/** Intentar disparar. Solo arqueros y boss disparan. */
export function tryEnemyShoot(enemy, player, now) {
  if (enemy.state === 'dead')  return null;
  if (enemy.type === 'pikeman') return null;  // piqueros no disparan
  if (enemy.state !== 'alert' && enemy.state !== 'shoot') return null;

  const cd = SHOOT_CD[enemy.type] ?? 1200;
  if (now < enemy.shootCd) return null;

  const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  if (dist > SIGHT_RANGE) return null;

  enemy.shootCd = now + cd;

  const bx = enemy.facing === 1 ? enemy.x + enemy.w : enemy.x - 6;
  const by = enemy.y + enemy.h * 0.4;
  const spd = enemy.type === 'boss' ? 5 : 3.5;

  let vx = spd * enemy.facing;
  let vy = 0;
  if (enemy.type === 'boss') {
    const ddx = player.x - bx;
    const ddy = player.y - by;
    const mag = Math.hypot(ddx, ddy) || 1;
    vx = (ddx / mag) * spd;
    vy = (ddy / mag) * spd;
  }

  return {
    x: bx, y: by, w: 6, h: 4,
    vx, vy,
    owner: 'enemy', damage: 1, active: true,
  };
}

export function damageEnemy(enemy, amount) {
  if (enemy.state === 'dead') return;
  enemy.hp -= amount;
  if (enemy.hp <= 0) {
    enemy.hp    = 0;
    enemy.state = 'dead';
    enemy.vy    = -4;
    enemy.vx    = 0;
  } else {
    enemy.state = 'hit';
    setTimeout(() => {
      if (enemy.state === 'hit') enemy.state = 'alert';
    }, 150);
  }
}
