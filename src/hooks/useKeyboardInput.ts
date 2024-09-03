import { useState, useCallback, useEffect } from 'react';

export const useKeyboardInput = (isPlaying: boolean) => {
  const [textTyped, setTextTyped] = useState('');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;

    setTextTyped(prev => {
      if (e.key === 'Backspace') return prev.slice(0, -1);
      return e.key.length === 1 ? prev + e.key : prev;
    });
  }, [isPlaying]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetTextTyped = () => setTextTyped('');

  return { textTyped, resetTextTyped };
};