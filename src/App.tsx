import React, { useState, useEffect } from 'react';
import { Gamepad2, RefreshCw } from 'lucide-react';
import { WordGrid } from './components/WordGrid';
import { WordList } from './components/WordList';
import { generateWordSearch } from './utils/wordSearch';
import { categories } from './data/categories';
import { GridCell } from './types';

const GRID_SIZE = 12;

export default function App() {
  const [category, setCategory] = useState<keyof typeof categories>('premierLeague');
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    generateNewPuzzle();
  }, [category]);

  const generateNewPuzzle = () => {
    const { grid: newGrid, placements } = generateWordSearch(categories[category]);
    setGrid(newGrid);
    setWords(categories[category]);
    setFoundWords(new Set());
    clearSelection();
    setSelectionStart(null);
  };

  const clearSelection = () => {
    setSelectedCells(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)));
  };

  const handleCellInteraction = (x: number, y: number, isNewSelection: boolean = false) => {
    if (isNewSelection || !selectionStart) {
      clearSelection();
      setSelectionStart({ x, y });
      const newSelectedCells = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
      newSelectedCells[y][x] = true;
      setSelectedCells(newSelectedCells);
      return;
    }

    // Clear previous selection and create new one
    const newSelectedCells = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    
    // Calculate direction and select cells in line
    const dx = x - selectionStart.x;
    const dy = y - selectionStart.y;
    
    if (Math.abs(dx) >= Math.abs(dy)) {
      // Horizontal selection
      const startX = Math.min(x, selectionStart.x);
      const endX = Math.max(x, selectionStart.x);
      for (let i = startX; i <= endX; i++) {
        newSelectedCells[selectionStart.y][i] = true;
      }
    } else {
      // Vertical selection
      const startY = Math.min(y, selectionStart.y);
      const endY = Math.max(y, selectionStart.y);
      for (let i = startY; i <= endY; i++) {
        newSelectedCells[i][selectionStart.x] = true;
      }
    }

    setSelectedCells(newSelectedCells);

    // Check if word is found
    const selectedWord = getSelectedWord(newSelectedCells);
    if (words.includes(selectedWord)) {
      setFoundWords(new Set([...foundWords, selectedWord]));
      clearSelection();
      setSelectionStart(null);
    }
  };

  const getSelectedWord = (cells: boolean[][]): string => {
    let word = '';
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (cells[y][x]) {
          word += grid[y][x].letter;
        }
      }
    }
    return word;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10 text-indigo-600" />
            Word Search Generator
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as keyof typeof categories)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="premierLeague">Premier League Teams</option>
              <option value="elements">Periodic Elements</option>
              <option value="countries">Countries</option>
              <option value="athletes">Famous Athletes</option>
            </select>
            
            <button
              onClick={generateNewPuzzle}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              New Puzzle
            </button>
          </div>
        </div>

        <WordGrid
          grid={grid}
          selectedCells={selectedCells}
          onCellClick={handleCellInteraction}
          foundWords={foundWords}
        />

        <WordList
          words={words}
          foundWords={foundWords}
        />

        {foundWords.size === words.length && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Congratulations! You found all the words!
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}