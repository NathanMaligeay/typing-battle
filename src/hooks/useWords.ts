import { useState, useEffect, useCallback, useRef } from 'react';

const WORDS_ARRAY = [
  "apple", "banana", "orange", "grape", "pineapple", "strawberry", "melon", "kiwi", "mango", "pear", 
  "peach", "plum", "cherry", "lemon", "lime", "watermelon", "blueberry", "raspberry", "blackberry", "apricot",
  "cucumber", "carrot", "broccoli", "cauliflower", "spinach", "lettuce", "celery", "pepper", "onion", "tomato",
  "potato", "radish", "pumpkin", "beetroot", "zucchini", "squash", "cabbage", "peas", "asparagus", "corn",
  "pizza", "burger", "sandwich", "pasta", "spaghetti", "tacos", "burrito", "sushi", "noodles", "rice",
  "steak", "chicken", "pork", "beef", "lamb", "duck", "shrimp", "lobster", "crab", "salmon",
  "milk", "cheese", "butter", "yogurt", "cream", "dumbbell", "chocolate", "cake", "cookies", "donut",
  "coffee", "tea", "juice", "water", "soda", "wine", "beer", "whiskey", "vodka", "rum",
  "soccer", "basketball", "tennis", "golf", "cricket", "rugby", "hockey", "swimming", "running", "cycling",
  "fast", "slow", "big", "small", "tall", "short", "wide", "narrow", "heavy", "light",
  "blue", "red", "green", "yellow", "purple", "pink", "brown", "black", "white", "gray",
  "sun", "moon", "stars", "cloud", "rain", "snow", "storm", "wind", "fog", "lightning",
  "dog", "cat", "bird", "fish", "hamster", "rabbit", "horse", "cow", "sheep", "goat",
  "train", "car", "bus", "bike", "plane", "boat", "subway", "truck", "motorcycle", "scooter",
  "house", "apartment", "building", "school", "hospital", "church", "museum", "restaurant", "library", "store",
  "pen", "pencil", "paper", "book", "notebook", "laptop", "phone", "tablet", "camera", "watch",
  "chair", "table", "bed", "sofa", "desk", "shelf", "drawer", "cabinet", "lamp", "fan",
  "happy", "sad", "angry", "excited", "bored", "tired", "nervous", "scared", "proud", "jealous"
];
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
  const addWordIntervalRef = useRef<number>(2000);

  const addWord = useCallback(() => {
    setWords(prevWords => [...prevWords, createWord()]);
  }, []); 

  const resetWordIntervalRef = useCallback(() => {
    addWordIntervalRef.current = 2000;
  },[])

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

    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    //addWord(); //you can spam pause to generate words, but i dont want to remove the initial word generation, need to find a workaround
    intervalRef.current = setInterval(addWord, addWordIntervalRef.current);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); //### mais quel component ? car useWords est un hook =/= component?
    }
  }, [isPlaying, isPaused, addWord, addWordIntervalRef.current]);

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
      y: 0,
      wordIsPaused: false,
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

  return { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef };
};