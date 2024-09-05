import { useState, useEffect, useCallback } from 'react';

const WORDS_ARRAY = ["chicken", "fast", "extravagant"];
const MAX_X_POSITION = 750;
const ADD_WORD_INTERVAL = 1000;

export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
}

export const useWords = (isPlaying: boolean) => { // très grande fct "hooks" qui prend en entrée si le jeu est on/off et fait plein de choses
  const [words, setWords] = useState<Word[]>([]); //initialise le state words comme un array de Word vide
  const [highlightedWord, setHighlightedWord] = useState<Word | null>(null);

  const addWord = useCallback(() => { //addWord est une fct qui ajoute un Word au array words
    setWords(prevWords => [...prevWords, createWord()]);
  }, []); //comme dep array est vide, cette fonction reste cached de manière identique tt le temps, même avec des rerender (evite de recalculer la valeur de la fonction a chaque fois)

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const newHighlightedWord = words.reduce((lowest, word) => //lowest = accumulator, word= current value (ie dans la loop)
      word.y > lowest.y ? word : lowest, words[0] || { y: 0 }); //value initiale = premier mot ou bien y=0 ie tout en haut

    if (!highlightedWord || !words.find(word => word.id === highlightedWord.id)) { //si il n'y a pas encore d'highlightedword ou si le highlightedword n'est plus dans le words array
      setHighlightedWord(newHighlightedWord);
    }
  }, [words, highlightedWord, isPlaying]); //ce useEffect s'appelle à chaque fois qu'un Word de words est modifié (par exemple la position du Word), ou si le mot highlighted change
  // ### ici je comprend pas pq on a besoin de words pour que ça fonctionne qd on tape le mot (je comprends pr le cas où ça sort de l'écran)
  useEffect(() => {
    if (!isPlaying) {
      setWords([]);
      return;
    }

    addWord();
    const interval = setInterval(addWord, ADD_WORD_INTERVAL);

    return () => clearInterval(interval); //a l'unmount du component, remove l'interval ie arrête de rajouter des Word dans words ### mais quel component ? car useWords est un hook =/= component?
  }, [isPlaying, addWord]);

  const createWord = (): Word => ({ //fct sans arg qui retourne une instance de l'objet Word
    id: Math.random().toString(36),
    text: getRandomWord(),
    x: Math.floor(Math.random() * MAX_X_POSITION),
    y: 0
  });

  const getRandomWord = (): string => //fct qui récupère un mot random du WORDS_ARRAY
    WORDS_ARRAY[Math.floor(Math.random() * WORDS_ARRAY.length)];

  const removeWord = useCallback((id: string) => {  //fct qui enlève le Word avec l'id correspondant du array
    setWords(prevWords => prevWords.filter(word => word.id !== id));
  }, [setWords]);

  const updateWordPosition = useCallback((id: string, y: number) =>
    setWords(prevWords => prevWords.map(word =>
      word.id === id ? { ...word, y } : word // destructure l'objet word si le word correspond à l'id passé en argument, et change le y, sinon ne fait rien
    )), [setWords]);

  return { words, highlightedWord, removeWord, updateWordPosition }; // useWords hook renvoie un objet qui contient un array de Word, un Word particulier, ainsi que 2 fns
};