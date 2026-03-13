import { BOARD_SIZE } from '../logic/boardUtils';

const GAP = 2;

const DragGhost = ({ piece, x, y, cellSize = 56, hoverCell, boardRef }) => {
  if (!piece) return null;

  const cols = Math.max(...piece.shape.map((row) => row.length));
  const rows = piece.shape.length;

  let left, top;

  if (hoverCell && boardRef?.current) {
    // Snapeado al tablero: posición exacta de la celda hoverCell
    const rect = boardRef.current.getBoundingClientRect();
    const cs = rect.width / BOARD_SIZE;
    left = rect.left + hoverCell.col * cs;
    top  = rect.top  + hoverCell.row * cs;
  } else {
    // Fuera del tablero: centrado en el cursor
    const offsetX = (cols * (cellSize + GAP)) / 2;
    const offsetY = (rows * (cellSize + GAP)) / 2;
    left = x - offsetX;
    top  = y - offsetY;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        pointerEvents: 'none',
        zIndex: 9999,
        filter: `drop-shadow(0 0 10px ${piece.color}) drop-shadow(0 6px 18px rgba(0,0,0,0.7))`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: `${GAP}px`,
        }}
      >
        {piece.shape.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="piece-cell-slot">
              {cell ? (
                <div
                  className="cell-dot"
                  style={{ '--dot-color': piece.color, width: '100%', height: '100%' }}
                />
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DragGhost;
