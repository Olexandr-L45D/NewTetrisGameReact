// ShapePickerMobile.jsx
import { useState } from "react";
import css from "./ShapePickerMobile.module.css";

const ShapePickerMobile = ({
  shapes,
  onDropShape,
  gridSize = 8,
  cellSize = 32,
  gap = 3, // має збігатися з CSS gap на .board
}) => {
  const [dragging, setDragging] = useState(null);

  const handleTouchStart = (e, shape) => {
    e.preventDefault(); // блокуємо скрол
    const t = e.touches[0];
    setDragging({ shape, x: t.clientX, y: t.clientY });
  };

  const handleTouchMove = e => {
    if (!dragging) return;
    e.preventDefault(); // блокуємо скрол під час перетягування
    const t = e.touches[0];
    setDragging(prev => ({ ...prev, x: t.clientX, y: t.clientY }));
  };

  const handleTouchEnd = () => {
    if (!dragging) return;

    const dropX = dragging.x;
    const dropY = dragging.y;

    // ⚠️ шукаємо саме по id (стабільно, без CSS-модулів)
    const boardEl = document.getElementById("game-board");
    if (boardEl) {
      const rect = boardEl.getBoundingClientRect();

      // якщо на .board є внутрішній padding — врахуй його:
      const style = window.getComputedStyle(boardEl);
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const padTop = parseFloat(style.paddingTop) || 0;

      const col = Math.floor((dropX - rect.left - padLeft) / (cellSize + gap));
      const row = Math.floor((dropY - rect.top - padTop) / (cellSize + gap));

      if (row >= 0 && col >= 0 && row < gridSize && col < gridSize) {
        // ✅ єдина правильна передача: матриця кольорів + row/col
        onDropShape(dragging.shape, row, col);
      }
    }

    setDragging(null);
  };

  return (
    <footer className={css.shapePicker}>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={css.shape}
          // жодних draggable / onDragStart — тільки touch
          onTouchStart={e => handleTouchStart(e, shape)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {shape.map((row, r) => (
            <div key={r} className={css.shapeRow}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={css.shapeCell}
                  style={{ backgroundColor: cell || "transparent" }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* 👻 прев’ю під пальцем */}
      {dragging && (
        <div
          className={css.dragPreview}
          style={{ top: dragging.y, left: dragging.x }}
        >
          {dragging.shape.map((row, r) => (
            <div key={r} className={css.shapeRow}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={css.shapeCell}
                  style={{ backgroundColor: cell || "transparent" }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </footer>
  );
};

export default ShapePickerMobile;
