import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

type WordListProps = {
  words: string[];
  foundWords: Set<string>;
};

export function WordList({ words, foundWords }: WordListProps) {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Words to Find:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {words.map((word) => (
          <div
            key={word}
            className={clsx(
              'flex items-center gap-2 p-2 rounded',
              foundWords.has(word) ? 'text-green-600 bg-green-50' : 'text-gray-700'
            )}
          >
            {foundWords.has(word) && <Check className="w-4 h-4" />}
            <span className={foundWords.has(word) ? 'line-through' : ''}>
              {word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}