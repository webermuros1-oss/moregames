// ── Jugador ────────────────────────────────────────────────────────────────

export const PLAYER_W = 22;
export const PLAYER_H = 32;

const SPEED          = 2.2;
const JUMP_VY        = -6.5;
const GRAVITY        = 0.35;
const ARCABUZ_CD     = 1600;  // ms — recarga lenta, históricamente fiel
const PIKE_CD        = 450;   // ms — ataque cuerpo a cuerpo con pica
const PIKE_REACH     = 36;    // px de alcance de la pica hacia delante
const INVINCIBLE_MS  = 1800;
const MAX_HP         = 3;

export function createPlayer(x, y) {
  return {
    x, y,
    w: PLAYER_W,
    h: PLAYER_H,
    vx: 0, vy: 0,
    facing: 1,
    state: 'idle',   // idle|run|jump|fall|shoot|pike|dead
    hp: MAX_HP,
    onGround: false,
    invincible: false,
    invincibleUntil: 0,
    arcabuzCd: 0,      // timestamp hasta el que no puede disparar
    pikeCd: 0,
    reloading: false,  // animación de recarga visible
    score: 0,
    animFrame: 0,
    animTimer: 0,
    // Pike hitbox activo (null cuando no ataca)
    pikeHit: null,   // { x, y, w, h, expires }
    // Sprite frames — tercioProtagonista.png 848×1233, grid 4×5, frame 212×246
    spriteFrames: {
      idle:  [{ sx:0,       sy:0,       sw:212, sh:246 }],
      run:   [0,1,2,3].map(c => ({ sx:c*212, sy:0,   sw:212, sh:246 })),
      jump:  [{ sx:0,       sy:246*2,   sw:212, sh:246 }],
      fall:  [{ sx:212,     sy:246*2,   sw:212, sh:246 }],
      shoot: [{ sx:212*2,   sy:246,     sw:212, sh:246 }],
      pike:  [{ sx:212*3,   sy:246,     sw:212, sh:246 }],
      dead:  [{ sx:212*3,   sy:246*3,   sw:212, sh:246 }],
    },
  };
}

export function updatePlayer(player, keys, now, levelW) {
  if (player.state === 'dead') {
    player.vy += GRAVITY;
    player.y  += player.vy;
    return;
  }

  // ── Movimiento horizontal ──
  let moving = false;
  if (keys.left)  { player.vx = -SPEED; player.facing = -1; moving = true; }
  else if (keys.right) { player.vx = SPEED;  player.facing =  1; moving = true; }
  else player.vx = 0;

  // ── Salto ──
  if ((keys.jump || keys.jumpPressed) && player.onGround) {
    player.vy = JUMP_VY;
    player.onGround  = false;
    keys.jumpPressed = false;
  }

  // ── Gravedad ──
  player.vy = Math.min(player.vy + GRAVITY, 12);

  player.x += player.vx;
  player.y += player.vy;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > levelW) player.x = levelW - player.w;
  if (player.y > 500) { player.y = 500; player.vy = 0; }

  // ── Invencibilidad ──
  if (player.invincible && now >= player.invincibleUntil) player.invincible = false;

  // ── Recarga visible (arcabuz) ──
  player.reloading = player.arcabuzCd > now;

  // ── Pike hitbox caduca ──
  if (player.pikeHit && now > player.pikeHit.expires) player.pikeHit = null;

  // ── Estado animación ──
  if (player.pikeHit) {
    player.state = 'pike';
  } else if (player.state === 'shoot' && player.arcabuzCd > now - 300) {
    // mantener brevemente el frame de disparo
  } else if (!player.onGround) {
    player.state = player.vy < 0 ? 'jump' : 'fall';
  } else if (moving) {
    player.state = 'run';
  } else {
    player.state = 'idle';
  }

  // ── Avanzar frame ──
  player.animTimer++;
  const spd = { idle:12, run:6, jump:20, fall:20, shoot:8, pike:6, dead:10 };
  if (player.animTimer >= (spd[player.state] || 10)) {
    player.animTimer = 0;
    const frames = player.spriteFrames[player.state] || player.spriteFrames.idle;
    player.animFrame = (player.animFrame + 1) % frames.length;
  }
}

/** Disparar arcabuz. Devuelve bala o null. */
export function tryShoot(player, now) {
  if (player.state === 'dead') return null;
  if (player.arcabuzCd > now) return null;  // recargando
  player.arcabuzCd = now + ARCABUZ_CD;
  player.state     = 'shoot';
  player.animFrame = 0;

  const bx = player.facing === 1 ? player.x + player.w : player.x - 8;
  const by = player.y + player.h * 0.35;
  return {
    x: bx, y: by, w: 10, h: 5,
    vx: 8 * player.facing, vy: 0,
    owner: 'player', damage: 2, active: true,
  };
}

/** Ataque de pica (cuerpo a cuerpo). Devuelve true si activado. */
export function tryPike(player, now) {
  if (player.state === 'dead') return false;
  if (player.pikeCd > now) return false;
  player.pikeCd = now + PIKE_CD;
  player.state  = 'pike';
  player.animFrame = 0;

  const hx = player.facing === 1 ? player.x + player.w : player.x - PIKE_REACH;
  player.pikeHit = {
    x: hx, y: player.y + player.h * 0.2,
    w: PIKE_REACH, h: player.h * 0.6,
    expires: now + 200,
  };
  return true;
}

export function damagePlayer(player, amount, now) {
  if (player.invincible || player.state === 'dead') return;
  player.hp -= amount;
  if (player.hp <= 0) {
    player.hp    = 0;
    player.state = 'dead';
    player.vx    = 0;
    player.vy    = -3;
  } else {
    player.invincible      = true;
    player.invincibleUntil = now + INVINCIBLE_MS;
  }
}

export function getPlayerFrame(player) {
  const frames = player.spriteFrames[player.state] || player.spriteFrames.idle;
  return frames[player.animFrame % frames.length];
}
