import { Direction, WordPlacement, GridCell } from '../types';

const GRID_SIZE = 12;

export function generateEmptyGrid(): GridCell[][] {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      letter: '',
      isPartOfWord: false,
      words: []
    }))
  );
}

function canPlaceWord(
  grid: GridCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction
): boolean {
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    let x = startX;
    let y = startY;

    switch (direction) {
      case 'horizontal':
        x += i;
        break;
      case 'vertical':
        y += i;
        break;
      case 'diagonal':
        x += i;
        y += i;
        break;
      case 'reverse':
        x -= i;
        break;
    }

    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return false;
    }

    if (grid[y][x].letter !== '' && grid[y][x].letter !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: GridCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction
): void {
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    let x = startX;
    let y = startY;

    switch (direction) {
      case 'horizontal':
        x += i;
        break;
      case 'vertical':
        y += i;
        break;
      case 'diagonal':
        x += i;
        y += i;
        break;
      case 'reverse':
        x -= i;
        break;
    }

    grid[y][x].letter = word[i];
    grid[y][x].isPartOfWord = true;
    grid[y][x].words.push(word);
  }
}

export function generateWordSearch(words: string[]): {
  grid: GridCell[][],
  placements: WordPlacement[]
} {
  const grid = generateEmptyGrid();
  const placements: WordPlacement[] = [];
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal', 'reverse'];

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startX = direction === 'reverse' 
        ? Math.floor(Math.random() * (GRID_SIZE - 1)) + word.length - 1
        : Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
      const startY = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));

      if (canPlaceWord(grid, word, startX, startY, direction)) {
        placeWord(grid, word, startX, startY, direction);
        placements.push({ word, startX, startY, direction });
        placed = true;
      }

      attempts++;
    }
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x].letter === '') {
        grid[y][x].letter = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placements };
}