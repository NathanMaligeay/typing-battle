import { useState, useEffect, useCallback, useRef } from 'react';

const WORDS_ARRAY = ["chicken", "fast", "extravagant"];
const MAX_X_POSITION = 800;

export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
}

export const useWords = (isPlaying: boolean) => {
  const [words, setWords] = useState<Word[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<Word | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const addWordIntervalRef = useRef<number>(2000);

  const addWord = useCallback(() => {
    setWords(prevWords => [...prevWords, createWord()]);
  }, []); 

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const newHighlightedWord = words.reduce((lowest, word) =>
      word.y > lowest.y ? word : lowest, words[0] || { y: 0 });

    if (!highlightedWord || !words.find(word => word.id === highlightedWord.id)) { 
      setHighlightedWord(newHighlightedWord);
    }
  }, [words, highlightedWord, isPlaying]);
  // ### ici je comprend pas pq on a besoin de words pour que ça fonctionne qd on tape le mot (je comprends pr le cas où ça sort de l'écran)
  
  useEffect(() => {
    if (!isPlaying) {
      setWords([]);
      return;
    }

    addWord();
    intervalRef.current = setInterval(addWord, addWordIntervalRef.current);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); //### mais quel component ? car useWords est un hook =/= component?
    }
  }, [isPlaying, addWord, addWordIntervalRef.current]);

  useEffect(() => {
    let interval : NodeJS.Timeout | null;
    if (isPlaying && intervalRef.current) {
      interval = setInterval(() => {
        if (addWordIntervalRef.current > 200) addWordIntervalRef.current = addWordIntervalRef.current - 100;
      },30000)
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  },[isPlaying])

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
      x: Math.max(Math.random()*5, Math.min(Math.floor(Math.random() * MAX_X_POSITION), MAX_X_POSITION - measureWordWidthWithCanvas(text)-Math.random()*5)),
      y: 0
    };
  };

  const getRandomWord = (): string =>
    WORDS_ARRAY[Math.floor(Math.random() * WORDS_ARRAY.length)];

  const removeWord = useCallback((id: string) => {
    setWords(prevWords => prevWords.filter(word => word.id !== id));
  }, [setWords]);

  const updateWordPosition = useCallback((id: string, y: number) =>
    setWords(prevWords => prevWords.map(word =>
      word.id === id ? { ...word, y } : word
    )), [setWords]);

  return { words, highlightedWord, removeWord, updateWordPosition };
};