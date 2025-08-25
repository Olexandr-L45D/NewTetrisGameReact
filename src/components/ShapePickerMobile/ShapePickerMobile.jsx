// ShapePickerMobile.jsx
import { useState } from "react";
// import { getCellFromCoords } from "../utils/getCellFromCoords";
import css from "./ShapePickerMobile.module.css";
import { getCellFromCoords } from "../GameLogic";

// Функція очищає матрицю від пустих рядків/колонок
const trimShape = shape => {
  const rows = shape.length;
  const cols = shape[0].length;

  let top = rows,
    bottom = -1,
    left = cols,
    right = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c]) {
        if (r < top) top = r;
        if (r > bottom) bottom = r;
        if (c < left) left = c;
        if (c > right) right = c;
      }
    }
  }

  if (bottom === -1) return [[]]; // порожня фігура

  return shape.slice(top, bottom + 1).map(row => row.slice(left, right + 1));
};

const ShapePickerMobile = ({
  shapes,
  onDropShape,
  gridSize = 8,
  cellSize = 32,
  gap = 3,
}) => {
  const [dragging, setDragging] = useState(null);

  const handleTouchStart = (e, shape) => {
    e.preventDefault();
    const t = e.touches[0];
    const trimmed = trimShape(shape);
    setDragging({ shape: trimmed, x: t.clientX, y: t.clientY });
  };

  const handleTouchMove = e => {
    if (!dragging) return;
    e.preventDefault();
    const t = e.touches[0];
    setDragging(prev => ({ ...prev, x: t.clientX, y: t.clientY }));
  };

  const handleTouchEnd = () => {
    if (!dragging) return;

    const dropX = dragging.x;
    const dropY = dragging.y;

    const boardEl = document.getElementById("game-board");
    if (boardEl) {
      const rect = boardEl.getBoundingClientRect();
      const style = window.getComputedStyle(boardEl);
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const padTop = parseFloat(style.paddingTop) || 0;

      // Використовуємо утиліту getCellFromCoords
      const { row, col } = getCellFromCoords(
        dropX - rect.left - padLeft,
        dropY - rect.top - padTop,
        cellSize,
        gap
      );

      if (row >= 0 && col >= 0 && row < gridSize && col < gridSize) {
        onDropShape(dragging.shape, row, col);
      }
    }

    setDragging(null);
  };

  return (
    <footer className={css.shapePicker}>
      {shapes.map((shape, index) => {
        const trimmed = trimShape(shape);
        return (
          <div
            key={index}
            className={css.shape}
            onTouchStart={e => handleTouchStart(e, shape)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {trimmed.map((row, r) => (
              <div key={r} className={css.shapeRow}>
                {row.map((cell, c) =>
                  cell ? (
                    <div
                      key={c}
                      className={css.shapeCell}
                      style={{ backgroundColor: cell }}
                    />
                  ) : (
                    <div key={c} className={css.emptyCell} />
                  )
                )}
              </div>
            ))}
          </div>
        );
      })}

      {dragging && (
        <div
          className={css.dragPreview}
          style={{ top: dragging.y, left: dragging.x }}
        >
          {dragging.shape.map((row, r) => (
            <div key={r} className={css.shapeRow}>
              {row.map((cell, c) =>
                cell ? (
                  <div
                    key={c}
                    className={css.shapeCell}
                    style={{ backgroundColor: cell }}
                  />
                ) : null
              )}
            </div>
          ))}
        </div>
      )}
    </footer>
  );
};

export default ShapePickerMobile;

// ShapePickerMobile.jsx
// import { useState } from "react";
// import css from "./ShapePickerMobile.module.css";

// // Функція очищає матрицю від пустих рядків/колонок
// const trimShape = shape => {
//   const rows = shape.length;
//   const cols = shape[0].length;

//   let top = rows,
//     bottom = -1,
//     left = cols,
//     right = -1;

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       if (shape[r][c]) {
//         if (r < top) top = r;
//         if (r > bottom) bottom = r;
//         if (c < left) left = c;
//         if (c > right) right = c;
//       }
//     }
//   }

//   if (bottom === -1) return [[]]; // порожня фігура

//   // Вирізаємо тільки зайняту область
//   return shape.slice(top, bottom + 1).map(row => row.slice(left, right + 1));
// };

// const ShapePickerMobile = ({
//   shapes,
//   onDropShape,
//   gridSize = 8,
//   cellSize = 32,
//   gap = 3,
// }) => {
//   const [dragging, setDragging] = useState(null);

//   const handleTouchStart = (e, shape) => {
//     e.preventDefault();
//     const t = e.touches[0];
//     const trimmed = trimShape(shape); // 👈 тут чистимо
//     setDragging({ shape: trimmed, x: t.clientX, y: t.clientY });
//   };

//   const handleTouchMove = e => {
//     if (!dragging) return;
//     e.preventDefault();
//     const t = e.touches[0];
//     setDragging(prev => ({ ...prev, x: t.clientX, y: t.clientY }));
//   };

//   const handleTouchEnd = () => {
//     if (!dragging) return;

//     const dropX = dragging.x;
//     const dropY = dragging.y;

//     const boardEl = document.getElementById("game-board");
//     if (boardEl) {
//       const rect = boardEl.getBoundingClientRect();
//       const style = window.getComputedStyle(boardEl);
//       const padLeft = parseFloat(style.paddingLeft) || 0;
//       const padTop = parseFloat(style.paddingTop) || 0;

//       const col = Math.floor((dropX - rect.left - padLeft) / (cellSize + gap));
//       const row = Math.floor((dropY - rect.top - padTop) / (cellSize + gap));

//       if (row >= 0 && col >= 0 && row < gridSize && col < gridSize) {
//         onDropShape(dragging.shape, row, col);
//       }
//     }

//     setDragging(null);
//   };

//   return (
//     <footer className={css.shapePicker}>
//       {shapes.map((shape, index) => {
//         const trimmed = trimShape(shape); // 👈 теж чистимо перед рендером
//         return (
//           <div
//             key={index}
//             className={css.shape}
//             onTouchStart={e => handleTouchStart(e, shape)}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {trimmed.map((row, r) => (
//               <div key={r} className={css.shapeRow}>
//                 {row.map((cell, c) =>
//                   cell ? (
//                     <div
//                       key={c}
//                       className={css.shapeCell}
//                       style={{ backgroundColor: cell }}
//                     />
//                   ) : (
//                     <div key={c} className={css.emptyCell} /> // можеш взагалі не рендерити
//                   )
//                 )}
//               </div>
//             ))}
//           </div>
//         );
//       })}

//       {dragging && (
//         <div
//           className={css.dragPreview}
//           style={{ top: dragging.y, left: dragging.x }}
//         >
//           {dragging.shape.map((row, r) => (
//             <div key={r} className={css.shapeRow}>
//               {row.map((cell, c) =>
//                 cell ? (
//                   <div
//                     key={c}
//                     className={css.shapeCell}
//                     style={{ backgroundColor: cell }}
//                   />
//                 ) : null
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </footer>
//   );
// };

// export default ShapePickerMobile;

// ShapePickerMobile.jsx
// import { useState } from "react";
// import css from "./ShapePickerMobile.module.css";

// const ShapePickerMobile = ({
//   shapes,
//   onDropShape,
//   gridSize = 8,
//   cellSize = 32,
//   gap = 3, // має збігатися з CSS gap на .board
// }) => {
//   const [dragging, setDragging] = useState(null);

//   const handleTouchStart = (e, shape) => {
//     e.preventDefault(); // блокуємо скрол
//     const t = e.touches[0];
//     setDragging({ shape, x: t.clientX, y: t.clientY });
//   };

//   const handleTouchMove = e => {
//     if (!dragging) return;
//     e.preventDefault(); // блокуємо скрол під час перетягування
//     const t = e.touches[0];
//     setDragging(prev => ({ ...prev, x: t.clientX, y: t.clientY }));
//   };

//   const handleTouchEnd = () => {
//     if (!dragging) return;

//     const dropX = dragging.x;
//     const dropY = dragging.y;

//     // ⚠️ шукаємо саме по id (стабільно, без CSS-модулів)
//     const boardEl = document.getElementById("game-board");
//     if (boardEl) {
//       const rect = boardEl.getBoundingClientRect();

//       // якщо на .board є внутрішній padding — врахуй його:
//       const style = window.getComputedStyle(boardEl);
//       const padLeft = parseFloat(style.paddingLeft) || 0;
//       const padTop = parseFloat(style.paddingTop) || 0;

//       const col = Math.floor((dropX - rect.left - padLeft) / (cellSize + gap));
//       const row = Math.floor((dropY - rect.top - padTop) / (cellSize + gap));

//       if (row >= 0 && col >= 0 && row < gridSize && col < gridSize) {
//         // ✅ єдина правильна передача: матриця кольорів + row/col
//         onDropShape(dragging.shape, row, col);
//       }
//     }

//     setDragging(null);
//   };

//   return (
//     <footer className={css.shapePicker}>
//       {shapes.map((shape, index) => (
//         <div
//           key={index}
//           className={css.shape}
//           // жодних draggable / onDragStart — тільки touch
//           onTouchStart={e => handleTouchStart(e, shape)}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           {shape.map((row, r) => (
//             <div key={r} className={css.shapeRow}>
//               {row.map((cell, c) => (
//                 <div
//                   key={c}
//                   className={css.shapeCell}
//                   style={{ backgroundColor: cell || "transparent" }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}

//       {/* 👻 прев’ю під пальцем */}
//       {dragging && (
//         <div
//           className={css.dragPreview}
//           style={{ top: dragging.y, left: dragging.x }}
//         >
//           {dragging.shape.map((row, r) => (
//             <div key={r} className={css.shapeRow}>
//               {row.map((cell, c) => (
//                 <div
//                   key={c}
//                   className={css.shapeCell}
//                   style={{ backgroundColor: cell || "transparent" }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </footer>
//   );
// };

// export default ShapePickerMobile;
