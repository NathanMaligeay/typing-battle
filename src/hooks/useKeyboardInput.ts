import { useState, useCallback, useEffect } from 'react';
import { Word } from './useWords';

export const useKeyboardInput = (isPlaying: boolean, highlightedWord: Word | null) => {
  const [textTyped, setTextTyped] = useState('');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;

    setTextTyped(prev => {
      if (e.key === 'Backspace') return prev.slice(0, -1);

      if (highlightedWord && textTyped.length < highlightedWord.text.length) {
        if (e.key.length === 1 && isNaN(Number(e.key))) {
          return prev + e.key;
        }
      }

      return prev;
    });
  }, [isPlaying, highlightedWord, textTyped]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetTextTyped = useCallback(() => setTextTyped(''), [setTextTyped]);

  return { textTyped, resetTextTyped };
};