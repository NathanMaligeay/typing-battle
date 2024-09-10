import { useState, useCallback, useEffect } from 'react';

export const useKeyboardInput = (isPlaying: boolean) => {
  const [textTyped, setTextTyped] = useState('');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;

    setTextTyped(prev => {
      if (e.key === 'Backspace') return prev.slice(0, -1);

       // Check if the input key is a single character and not a number
      if (e.key.length === 1 && isNaN(Number(e.key))) {
        return prev + e.key; // Only add non-number characters
      }

      return prev; // Do nothing if it's a number or another special key
    });
  }, [isPlaying]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetTextTyped = useCallback(() => setTextTyped(''), [setTextTyped]);

  return { textTyped, resetTextTyped };
};