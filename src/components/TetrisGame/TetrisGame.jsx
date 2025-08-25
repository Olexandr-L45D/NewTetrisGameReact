// import { useEffect, useState } from "react";
// import css from "./TetrisGame.module.css";
// import { FcBusinessman } from "react-icons/fc";
// import { FiSettings } from "react-icons/fi";
// import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
// import GameBoard from "../GameBoard/GameBoard";
// import ShapePicker from "../ShapePicker/ShapePicker";
import { useEffect, useState } from "react";
import css from "./TetrisGame.module.css";
import { FcBusinessman } from "react-icons/fc";
import { FiSettings } from "react-icons/fi";

// старі функції
// import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
import { checkFullLines, clearLines, getCellFromCoords } from "../GameLogic";

// новий генератор
// import ShapePickerMobileDrag, {generateMobileShapes,} from "../ShapePicker/ShapePickerMobileDrag";

import GameBoard from "../GameBoard/GameBoard";
import ShapePickerMobileDrag, {
  generateMobileShapes,
} from "../ShapePickerMobileDrag/ShapePickerMobileDrag";
// старий ShapePicker (залишаємо, раптом треба буде порівняти)
// import ShapePicker from "../ShapePicker/ShapePicker";

const GRID_SIZE = 8;

const TetrisGame = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  // тут використовуємо НОВИЙ генератор
  const [shapes, setShapes] = useState(generateMobileShapes(3));

  // ініціалізація (витягнути рекорд з localStorage)
  useEffect(() => {
    const savedTotal = localStorage.getItem("totalScore");
    if (savedTotal) setTotalScore(Number(savedTotal));
  }, []);

  // збереження рекорду
  useEffect(() => {
    localStorage.setItem("totalScore", totalScore);
  }, [totalScore]);

  const handleDropShape = (shapeObj, row, col) => {
    const { cells, color } = shapeObj;
    const newGrid = grid.map(r => [...r]);
    let canPlace = true;

    // перевіряємо чи можна поставити
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (cells[r][c]) {
          if (
            !newGrid[row + r] ||
            newGrid[row + r][col + c] !== null ||
            col + c >= GRID_SIZE
          ) {
            canPlace = false;
          }
        }
      }
    }

    if (!canPlace) return;

    // ставимо фігуру
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (cells[r][c]) {
          newGrid[row + r][col + c] = color;
        }
      }
    }

    // перевірка заповнених рядків/стовпців
    const { fullRows, fullCols } = checkFullLines(newGrid);
    if (fullRows.length || fullCols.length) {
      const cleared = clearLines(newGrid, fullRows, fullCols);
      setGrid(cleared);

      const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2; // 1 клітинка = 2 бали
      setScore(prev => prev + points);
      setTotalScore(prev => prev + points);
    } else {
      setGrid(newGrid);
    }

    // нові фігури
    setShapes(generateMobileShapes(3));
  };

  return (
    <main className={css.containerGame}>
      <div className={css.container}>
        {/* Header */}
        <header className={css.headerContainer}>
          <section className={css.header}>
            <FcBusinessman className={css.logoGame} />

            <div className={css.scoreBox}>
              <div className={css.scoreBackgroun}>
                <span className={css.scoreLabel}></span>
                <span className={css.scoreValue}>{totalScore}</span>
              </div>
            </div>

            <FiSettings className={css.settingsIcon} />
          </section>
          <div className={css.scoreOverlay}>
            <div className={css.scoreSquare}></div>
            <span className={css.scoreValueto}>{score}</span>
          </div>
        </header>

        {/* Main Board */}
        <GameBoard grid={grid} onDropShape={handleDropShape} />

        {/* Shape Picker — використовуємо новий MobileDrag */}
        {/* <ShapePickerMobileDrag shapes={shapes} onDrop={handleDropShape} /> */}

        <ShapePickerMobileDrag
          shapes={shapes}
          onDrop={(shape, x, y) => {
            const { row, col } = getCellFromCoords(x, y);
            handleDropShape(shape.cells, row, col);
          }}
        />
        {/* якщо треба лишити старий, можна ось так */}
        {/* <ShapePicker shapes={generateShapes(3)} /> */}
      </div>
    </main>
  );
};

export default TetrisGame;
