"use client"; // Add this directive to mark this file as a Client Component


import React, { useState, useEffect } from 'react';
import Word from '@/components/word';
import PlayButton from '@/components/playbutton';
import Meteor from '@/components/meteor';
import "../styles/main.css";

const wordsArray = ["apple", "banana", "cherry", "date", "elderberry"]

export default function Main() {

  const [play, setPlay] = useState<boolean>(false);
  const [words, setWords] = useState<{ text: string; x: number; y: number }[]>([]);
  //const [keystroke, setKeystroke] = useState<string | null>(null);
  const [meteors, setMeteors] = useState<{ id: string }[]>([]);

  const togglePlaying = () => {
    setPlay(!play)
  }

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
    }, 500);

    return () => {
      clearInterval(intervalMeteor);
      //setMeteors([]); 
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
      }, 500); // Add a new word every 5 seconds

    }

    return () => {
      setWords([]);
      if (intervalWord) {
        clearInterval(intervalWord);
      }
    };
  }, [play]);


  return (
    <div>
      <div className="playBox">
        {words.map((word, index) => (
          <Word key={index} text={word.text} x={word.x} y={word.y} showWord={true} />
        ))}
        {meteors.map((meteor) => (
          <Meteor key={meteor.id} />
        ))}
      </div>
      <PlayButton isPlaying={play} onClickFunction={togglePlaying} />
    </div>

  )
}