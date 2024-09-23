import { useState, useCallback, useEffect, useRef } from 'react';
import { Word } from './useWords';

export const useKeyboardInput = (isPlaying: boolean, highlightedWord: Word | null, isPaused: boolean) => {
  const [textTyped, setTextTyped] = useState('');
  const entireStringTyped = useRef('');
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;
    if (isPaused) return;

    if (e.key.length === 1 && isNaN(Number(e.key))) {
      entireStringTyped.current = entireStringTyped.current + e.key;
    }

    setTextTyped(prev => {
      if (e.key === 'Backspace') return prev.slice(0, -1);
      
      if (highlightedWord?.text && textTyped.length < highlightedWord.text.length) {
        if (e.key.length === 1 && isNaN(Number(e.key))) {
          return prev + e.key;
        }
      }

      return prev;
    });

  }, [isPlaying, highlightedWord, textTyped, isPaused]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const calculateWordAccuracy = useCallback(() => {
    if (highlightedWord?.text && entireStringTyped.current) {
      return (highlightedWord.text.length / entireStringTyped.current.length)
    }
  },[entireStringTyped.current])

  const resetTextTyped = useCallback(() => setTextTyped(''), [setTextTyped]);
  const resetEntireStringTyped = useCallback(() => entireStringTyped.current = '',[]);

  return { textTyped, resetTextTyped, setTextTyped, resetEntireStringTyped, calculateWordAccuracy };
};