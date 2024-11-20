import React, { useState, useEffect, useCallback } from 'react';
import { GridCell } from '../types';
import clsx from 'clsx';

type WordGridProps = {
  grid: GridCell[][];
  selectedCells: boolean[][];
  onCellClick: (x: number, y: number) => void;
  foundWords: Set<string>;
};

type CellCoords = { x: number; y: number };

export function WordGrid({ grid, selectedCells, onCellClick, foundWords }: WordGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartCell, setTouchStartCell] = useState<CellCoords | null>(null);

  const getCellFromTouch = useCallback((touch: Touch): CellCoords | null => {
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    const coords = element?.dataset?.coords;
    if (coords) {
      const [x, y] = coords.split('-').map(Number);
      return { x, y };
    }
    return null;
  }, []);

  const handleTouchStart = (e: React.TouchEvent, x: number, y: number) => {
    e.preventDefault();
    setIsDragging(true);
    setTouchStartCell({ x, y });
    onCellClick(x, y);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !touchStartCell) return;

    const touch = e.touches[0];
    const currentCell = getCellFromTouch(touch);

    if (currentCell) {
      // Calculate direction and select cells in line
      const dx = currentCell.x - touchStartCell.x;
      const dy = currentCell.y - touchStartCell.y;

      // Determine the primary direction of movement
      if (Math.abs(dx) >= Math.abs(dy)) {
        // Horizontal movement
        const step = dx > 0 ? 1 : -1;
        for (let i = 0; i <= Math.abs(dx); i++) {
          onCellClick(touchStartCell.x + (i * step), touchStartCell.y);
        }
      } else {
        // Vertical movement
        const step = dy > 0 ? 1 : -1;
        for (let i = 0; i <= Math.abs(dy); i++) {
          onCellClick(touchStartCell.x, touchStartCell.y + (i * step));
        }
      }
    }
  }, [isDragging, touchStartCell, onCellClick, getCellFromTouch]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStartCell(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  return (
    <div className="grid grid-cols-12 gap-1 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto touch-none">
      {grid.map((row, y) => (
        row.map((cell, x) => {
          const isFound = cell.words.some(word => foundWords.has(word));
          return (
            <button
              key={`${x}-${y}`}
              data-coords={`${x}-${y}`}
              onTouchStart={(e) => handleTouchStart(e, x, y)}
              onClick={() => onCellClick(x, y)}
              className={clsx(
                'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center',
                'text-lg font-bold rounded transition-colors duration-200',
                'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400',
                {
                  'bg-blue-500 text-white': selectedCells[y][x],
                  'bg-green-100': isFound && !selectedCells[y][x],
                  'bg-gray-50': !isFound && !selectedCells[y][x]
                }
              )}
            >
              {cell.letter}
            </button>
          );
        })
      ))}
    </div>
  );
}