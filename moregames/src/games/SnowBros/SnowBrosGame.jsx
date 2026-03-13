import { useState, useRef, useCallback } from 'react';
import GameCanvas from './GameCanvas.jsx';
import HUD        from './HUD.jsx';
import { LEVELS } from './logic/levelData.js';
import './styles/snowbros.css';

export default function SnowBrosGame({ onBack }) {
  const [level,      setLevel]      = useState(0);
  const [score,      setScore]      = useState(0);
  const [lives,      setLives]      = useState(3);
  const [screen,     setScreen]     = useState('ready');
  // gameKey fuerza re-mount del GameCanvas al reiniciar (soluciona bug de reintentar)
  const [gameKey,    setGameKey]    = useState(0);
  const canvasRef = useRef(null);

  // ── Callbacks del canvas ────────────────────────────────────
  const handleLevelClear = useCallback(() => {
    const next = level + 1;
    if (next >= LEVELS.length) {
      setScreen('win');
    } else {
      setLevel(next);
      setScreen('ready');
    }
  }, [level]);

  const handleGameOver = useCallback(() => {
    setScreen('over');
  }, []);

  // ── Botones táctiles ────────────────────────────────────────
  const press   = (key) => canvasRef.current?._virtualKey?.(key, true);
  const release = (key) => canvasRef.current?._virtualKey?.(key, false);

  const btnProps = (key) => ({
    onPointerDown:   (e) => { e.preventDefault(); press(key);   },
    onPointerUp:     (e) => { e.preventDefault(); release(key); },
    onPointerLeave:  (e) => { e.preventDefault(); release(key); },
    onPointerCancel: (e) => { e.preventDefault(); release(key); },
  });

  // ── Pantallas ────────────────────────────────────────────────
  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(0);
    setGameKey(k => k + 1); // fuerza re-mount del GameCanvas
    setScreen('ready');
  };

  const nextLevel = () => setScreen('playing');

  return (
    <div className="snow-wrapper">
      {/* Header */}
      <div className="snow-topbar">
        <button className="snow-back-btn" onClick={onBack}>← VOLVER</button>
        <span className="snow-title-small">❄ SNOW BROS</span>
      </div>

      {/* HUD */}
      <HUD score={score} lives={lives} level={level} />

      {/* Canvas */}
      <div className="snow-canvas-wrap" ref={(el) => {
        if (el) canvasRef.current = el.querySelector('canvas');
      }}>
        <GameCanvas
          key={gameKey}
          levelIndex={level}
          paused={screen !== 'playing'}
          onScoreChange={setScore}
          onLivesChange={setLives}
          onLevelClear={handleLevelClear}
          onGameOver={handleGameOver}
        />

        {screen === 'ready' && (() => {
          const isBoss = LEVELS[level]?.isBossLevel;
          return (
            <div className="snow-overlay">
              <div className={`snow-overlay-box${isBoss ? ' boss-stage' : ''}`}>
                {isBoss && <p className="snow-overlay-title gold">♛ BOSS STAGE ♛</p>}
                <p className="snow-overlay-level">LEVEL {level + 1}</p>
                <p className="snow-overlay-sub">
                  {isBoss ? '¡Cuidado! ¡El Super Jefe te espera!' : '¡A por los monstruos!'}
                </p>
                <button className="snow-overlay-btn" onClick={nextLevel}>▶ READY!</button>
              </div>
            </div>
          );
        })()}

        {screen === 'over' && (
          <div className="snow-overlay">
            <div className="snow-overlay-box">
              <p className="snow-overlay-title red">GAME OVER</p>
              <p className="snow-overlay-sub">Puntuación: {String(score).padStart(6,'0')}</p>
              <button className="snow-overlay-btn" onClick={startGame}>↺ REINTENTAR</button>
              <button className="snow-overlay-btn secondary" onClick={onBack}>← MENÚ</button>
            </div>
          </div>
        )}

        {screen === 'win' && (
          <div className="snow-overlay">
            <div className="snow-overlay-box">
              <p className="snow-overlay-title gold">¡GANASTE!</p>
              <p className="snow-overlay-sub">Puntuación: {String(score).padStart(6,'0')}</p>
              <button className="snow-overlay-btn" onClick={startGame}>↺ JUGAR DE NUEVO</button>
              <button className="snow-overlay-btn secondary" onClick={onBack}>← MENÚ</button>
            </div>
          </div>
        )}
      </div>

      {/* Controles táctiles */}
      <div className="snow-controls">
        <div className="snow-dpad">
          <button className="snow-btn dpad-left"  {...btnProps('left')}>◀</button>
          <button className="snow-btn dpad-right" {...btnProps('right')}>▶</button>
        </div>
        <div className="snow-actions">
          <button className="snow-btn action-jump"  {...btnProps('jump')}>▲<br/><small>SALTO</small></button>
          <button className="snow-btn action-shoot" {...btnProps('shoot')}>❄<br/><small>NIEVE</small></button>
        </div>
      </div>
    </div>
  );
}
