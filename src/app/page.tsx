"use client"; // Add this directive to mark this file as a Client Component


import React, { useState, useEffect } from 'react';
import Word from '@/components/word';
import PlayButton from '@/components/playbutton';
import Meteor from '@/components/meteor';
import "../styles/main.css";

// const wordsArray = ["apple", "banana", "cherry", "date", "elderberry"]
const wordsArray = ["thisisaveryveryslowword", "fast"]


export default function Main() {

  const [play, setPlay] = useState<boolean>(false);
  const [words, setWords] = useState<{ text: string; x: number; y: number }[]>([]);
  const [meteors, setMeteors] = useState<{ id: string }[]>([]);
  const [textTyped, setTextTyped] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);


  const removeMeteorite = (event: React.AnimationEvent<HTMLImageElement>) => {
    const meteorId = event.currentTarget.id;
    setMeteors(prevMeteors =>
      prevMeteors.filter(meteor => meteor.id !== meteorId)
    );
  };

  const togglePlaying = () => {
    setPlay(!play)
  }

  useEffect(() => {
    const checkPositions = () => {
      // Find the word with the highest y value (lowest on screen)
      const lowestWordIndex = words.reduce((lowestIndex, word, index) => {
        return word.y > words[lowestIndex].y ? index : lowestIndex;
      }, 0);

      setHighlightedIndex(lowestWordIndex);
    };

    // Check positions initially and on window resize
    checkPositions();
    window.addEventListener('resize', checkPositions);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', checkPositions);
    };
  }, [words,highlightedIndex]); // Re-run effect if words change

  console.log(words[highlightedIndex])
  

  useEffect(() => {
    if (meteors.length < 1) {
      setMeteors([{ id: Math.random().toString(36).substr(2, 9) }]);
    }
  }, []);

  useEffect(() => {
    let intervalMeteor: NodeJS.Timeout | null = null;
    intervalMeteor = setInterval(() => {
      const addMeteor = Math.floor(Math.random() * 10);
      if (addMeteor == 0) {
        setMeteors(prevMeteors => [
          ...prevMeteors,
          { id: Math.random().toString(36).substr(2, 9) }
        ]);
      }
    }, 5000);

    return () => {
      clearInterval(intervalMeteor);
    };

  }, []);

  useEffect(() => {
    let intervalWord: NodeJS.Timeout | null = null;

    if (play) {

      ///Gestion des mots
      // Make 1rst word appear when click on button
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      const newWord = wordsArray[randomIndex];

      // Generate random position for the first word
      const newX = Math.floor(Math.random() * 750);

      // Update state with the first word
      setWords(prevWords => [...prevWords, { text: newWord, x: newX, y: 0 }]);

      intervalWord = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * wordsArray.length);
        const newWord = wordsArray[randomIndex];

        // Generate random position for the new word
        const newX = Math.floor(Math.random() * 750);

        // Update state with the new word
        setWords(prevWords => [...prevWords, { text: newWord, x: newX, y: 0 }]);
      }, 2000); // Add a new word every 5 seconds

    }

    return () => {
      setWords([]);
      if (intervalWord) {
        clearInterval(intervalWord);
      }
    };
  }, [play]);

  useEffect(() => {
    const handleKeyDown = (e : KeyboardEvent) => {
      const key = e.key;
      setTextTyped((prev) => {
        let updatedText = prev;
        if (key == 'Backspace') {
          updatedText = prev.slice(0,-1);
        }
        else {updatedText = prev + key;}
        

        //const matchIndex = words.findIndex((word) => updatedText.trim().toLowerCase() === word.text.toLowerCase());

        if (updatedText == words[highlightedIndex].text) {
          setWords((prevWords) => prevWords.filter((_, index) => index !== highlightedIndex));
          return '';
        }
        return updatedText;
      });
    };
  

    if (play) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setTextTyped('')
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [play, words]);

  const handlePositionUpdate = (index: number, x: number, y: number) => {
    setWords(prevWords => {
      const updatedWords = [...prevWords];
      updatedWords[index] = { ...updatedWords[index], x, y };
      return updatedWords;
    });
  };

  return (
    <div>
      <div className="playBox">
        {words.map((word, index) => (
          <Word key={index} text={word.text} x={word.x} y={word.y} showWord={true} onPositionUpdate={(x, y) => handlePositionUpdate(index, x, y)}/>
        ))}
        {meteors.map((meteor) => (
          <Meteor key={meteor.id} deleteMeteorite={removeMeteorite} meteorId={meteor.id} />
        ))}
      </div>
      <p>{textTyped}</p>
      <PlayButton isPlaying={play} onClickFunction={togglePlaying} />
    </div>
  )

}