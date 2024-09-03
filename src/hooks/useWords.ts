import { useState, useEffect, useCallback } from 'react';

const WORDS_ARRAY = ["thisisaveryslowword", "fast", "iammedium"];
const MAX_X_POSITION = 750;
const ADD_WORD_INTERVAL = 5000;

export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
}

export const useWords = (isPlaying: boolean) => {
  const [words, setWords] = useState<Word[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<Word | null>(null);

  const addWord = useCallback(() => {
    setWords(prevWords => [...prevWords, createWord()]);
  }, []);

  useEffect(() => {
    const newHighlightedWord = words.reduce((lowest, word) => 
      word.y > lowest.y ? word : lowest, words[0] || { y: 0 });

    if (!highlightedWord || !words.find(word => word.id === highlightedWord.id)) {
      setHighlightedWord(newHighlightedWord);
    }
  }, [words, highlightedWord]);

  useEffect(() => {
    if (!isPlaying) {
      setWords([]);
      return;
    }

    addWord();
    const interval = setInterval(addWord, ADD_WORD_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, addWord]);

  const createWord = (): Word => ({
    id: Math.random().toString(36).substr(2, 9),
    text: getRandomWord(),
    x: Math.floor(Math.random() * MAX_X_POSITION),
    y: 0
  });

  const getRandomWord = (): string => 
    WORDS_ARRAY[Math.floor(Math.random() * WORDS_ARRAY.length)];

  const removeWord = (id: string) => 
    setWords(prevWords => prevWords.filter(word => word.id !== id));

  const updateWordPosition = (id: string, y: number) => 
    setWords(prevWords => prevWords.map(word => 
      word.id === id ? { ...word, y } : word
    ));

  return { words, highlightedWord, removeWord, updateWordPosition };
};