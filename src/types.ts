export type Direction = 'horizontal' | 'vertical' | 'diagonal' | 'reverse';
export type WordPlacement = {
  word: string;
  startX: number;
  startY: number;
  direction: Direction;
};

export type Category = {
  name: string;
  words: string[];
};

export type GridCell = {
  letter: string;
  isPartOfWord: boolean;
  words: string[];
};