// ShapePickerMobileDrag.jsx
import { useState } from "react";
import styles from "./ShapePickerMobileDrag.module.css";

const MOBILE_COLORS = [
  "#34eb9b", // бірюзово-зелений
  "#2979ff", // яскраво-синій
  "#00e5ff", // бірюзовий
  "#ffeb3b", // жовтий
  "#ba68c8", // фіолетовий
  "#ff9100", // оранжевий
  "#ff1744", // червоний (рідкісний)
];

const getRandomMobileColor = () => {
  const rareChance = Math.random();
  if (rareChance < 0.05) return MOBILE_COLORS[6];
  return MOBILE_COLORS[Math.floor(Math.random() * 6)];
};

// ✅ Генерація масиву { cells, color }
export const generateMobileShapes = (count = 3) => {
  const templates = [
    [
      [1, 1],
      [1, 1],
    ], // квадрат
    [[1, 1, 1]], // лінія горизонт
    [[1], [1], [1]], // лінія вертик
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // Z-подібна
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ], // L-подібна
  ];

  return Array.from({ length: count }, () => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return { cells: template, color: getRandomMobileColor() };
  });
};

export default function ShapePickerMobileDrag({ shapes, onDrop }) {
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.setData("shapeIndex", index);
  };

  const handleDragEnd = e => {
    if (draggingIndex !== null && onDrop) {
      const shape = shapes[draggingIndex];
      onDrop(shape, e.clientX, e.clientY);
    }
    setDraggingIndex(null);
  };

  return (
    <div className={styles.shapePicker}>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`${styles.shape} ${
            draggingIndex === index ? styles.dragging : ""
          }`}
          draggable
          onDragStart={e => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
        >
          {shape.cells.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.shapeRow}>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={styles.shapeCell}
                  style={{
                    backgroundColor: cell ? shape.color : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// import { useState } from "react";
// import styles from "./ShapePicker.module.css";

// const MOBILE_COLORS = [
//   "#34eb9b", // бірюзово-зелений
//   "#2979ff", // яскраво-синій
//   "#00e5ff", // бірюзовий
//   "#ffeb3b", // жовтий
//   "#ba68c8", // фіолетовий
//   "#ff9100", // оранжевий
//   "#ff1744", // червоний
// ];

// const getRandomMobileColor = () => {
//   const rareChance = Math.random();
//   if (rareChance < 0.05) return MOBILE_COLORS[6];
//   return MOBILE_COLORS[Math.floor(Math.random() * 6)];
// };

// export const generateMobileShapes = (count = 3) => {
//   const templates = [
//     [
//       [1, 1],
//       [1, 1],
//     ],
//     [[1, 1, 1]],
//     [[1], [1], [1]],
//     [
//       [1, 1, 0],
//       [0, 1, 1],
//     ],
//     [
//       [1, 0],
//       [1, 0],
//       [1, 1],
//     ],
//   ];

//   const shapes = [];
//   for (let i = 0; i < count; i++) {
//     const template = templates[Math.floor(Math.random() * templates.length)];
//     const color = getRandomMobileColor();
//     shapes.push({ cells: template, color });
//   }
//   return shapes;
// };

// export default function ShapePickerMobileDrag({ shapes, onDrop }) {
//   const [draggingIndex, setDraggingIndex] = useState(null);

//   const handleDragStart = (e, index) => {
//     setDraggingIndex(index);
//     e.dataTransfer.setData("shapeIndex", index);
//   };

//   const handleDragEnd = e => {
//     if (draggingIndex !== null && onDrop) {
//       // ⚡ передаємо у onDrop сам shape і координати курсора (поки raw)
//       const shape = shapes[draggingIndex];
//       const dropX = e.clientX;
//       const dropY = e.clientY;
//       onDrop(shape, dropX, dropY);
//     }
//     setDraggingIndex(null);
//   };

//   return (
//     <div className={styles.shapePicker}>
//       {shapes.map((shape, index) => (
//         <div
//           key={index}
//           className={`${styles.shape} ${
//             draggingIndex === index ? styles.dragging : ""
//           }`}
//           draggable
//           onDragStart={e => handleDragStart(e, index)}
//           onDragEnd={handleDragEnd}
//         >
//           {shape.cells.map((row, rowIndex) => (
//             <div key={rowIndex} className={styles.shapeRow}>
//               {row.map((cell, cellIndex) => (
//                 <div
//                   key={cellIndex}
//                   className={styles.shapeCell}
//                   style={{
//                     backgroundColor: cell ? shape.color : "transparent",
//                   }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }
