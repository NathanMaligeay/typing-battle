import { useState, useEffect, useCallback, useRef } from 'react';
import { generate } from 'random-words';

const MAX_X_POSITION = 800;

export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
  wordIsPaused: boolean;
}

export const useWords = (isPlaying: boolean, isPaused: boolean) => {
  const [words, setWords] = useState<Word[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<Word | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [addWordInterval, setAddWordInterval] = useState<number>(2000);

  const addWord = useCallback(() => {
    setWords(prevWords => [...prevWords, createWord()]);
  }, []);

  const resetWordIntervalRef = useCallback(() => {
    setAddWordInterval(2000);
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const newHighlightedWord = words.reduce((lowest, word) =>
      word.y > lowest.y ? word : lowest, words[0] || { y: 0 });

    if (!highlightedWord ||  !words.find(word => word.id === highlightedWord.id)) {
      setHighlightedWord(newHighlightedWord);
    }
  }, [words, isPlaying, setHighlightedWord, highlightedWord]);

  useEffect(() => {
    if (!isPlaying) {
      setWords([]);
      return;
    }

    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    
    const createInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(addWord, addWordInterval);
    }
    
    createInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying, isPaused, addWord, addWordInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null;
    if (isPlaying && !isPaused && intervalRef.current) {
      interval = setInterval(() => {
        if (addWordInterval > 200) setAddWordInterval((prev) => prev - 100);
      }, 30000)
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused, intervalRef, addWordInterval])

  const measureWordWidthWithCanvas = (word: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      context.font = "15px silkscreen";
      return context.measureText(word).width;
    }

    return 0;
  };

  const createWord = (): Word => {
    const text = getRandomWord();
    return {
      id: Math.random().toString(36),
      text: text,
      x: Math.max(Math.random() * 5, Math.min(Math.floor(Math.random() * MAX_X_POSITION), MAX_X_POSITION - measureWordWidthWithCanvas(text) - Math.random() * 5)),
      y: 0,
      wordIsPaused: false,
    };
  };

  const getRandomWord = (): string => {
    const word = generate({minLength: 3});
  
    if (Array.isArray(word)) {
      return word.join('');
    } else {
      return word;
    }
  }

  const removeWord = useCallback((id: string) => {
    setWords(prevWords => prevWords.filter(word => word.id !== id));
  }, [setWords]);

  const updateWordPosition = useCallback((id: string, y: number) =>
    setWords(prevWords => prevWords.map(word =>
      word.id === id ? { ...word, y } : word
    )), [setWords]);


  return { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef };
};