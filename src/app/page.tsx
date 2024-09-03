"use client"; // Add this directive to mark this file as a Client Component


import React, { useState, useEffect } from 'react';
import Word from '@/components/word';
import PlayButton from '@/components/playbutton';
import Meteor from '@/components/meteor';
import FillableWord from '@/components/fillableword';
import "../styles/main.css";

const wordsArray = ["thisisaveryslowword", "fast","iammedium"]


export default function Main() {

  const [play, setPlay] = useState<boolean>(false);
  const [words, setWords] = useState<{ text: string; x: number; y: number }[]>([]);
  const [meteors, setMeteors] = useState<{ id: string }[]>([]);
  const [textTyped, setTextTyped] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [wordCompleted, setWordCompleted] = useState<boolean>(false);


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
      const lowestWordIndex = words.reduce((lowestIndex, word, index) => {
        return word.y > words[lowestIndex].y ? index : lowestIndex;
      }, 0);

      setHighlightedIndex(lowestWordIndex);
    };

    checkPositions();

  }, [wordCompleted]);


  

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

      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      const newWord = wordsArray[randomIndex];
      const newX = Math.floor(Math.random() * 750);
      setWords(prevWords => [...prevWords, { text: newWord, x: newX, y: 0 }]);

      intervalWord = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * wordsArray.length);
        const newWord = wordsArray[randomIndex];
        const newX = Math.floor(Math.random() * 750);
        setWords(prevWords => [...prevWords, { text: newWord, x: newX, y: 0 }]);
      }, 5000);
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

  useEffect(() => {
    if (play) {
      if (words.length > 0) {
      console.log("the word highlighted should be " + words[highlightedIndex].text)
      console.log(highlightedIndex)
      // console.log(words[highlightedIndex].text)
      if (textTyped == words[highlightedIndex].text) {
        setWords((prevWords) => {
          const newWords = prevWords.filter((_, index) => index !== highlightedIndex);
          return newWords;
        })
        console.log(textTyped);
        setTextTyped('');
        setWordCompleted(true);
        setWordCompleted(false);
      }
    }
    }
  }, [words,highlightedIndex])

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
          <Word key={index} text={word.text} x={word.x} y={word.y} showWord={true} onPositionUpdate={(x, y) => handlePositionUpdate(index, x, y)} textColor={index === highlightedIndex ? 'red' : 'yellow'}/>
        ))}
        {meteors.map((meteor) => (
          <Meteor key={meteor.id} deleteMeteorite={removeMeteorite} meteorId={meteor.id} />
        ))}
      </div>
      <p>{textTyped}</p>
      <PlayButton isPlaying={play} onClickFunction={togglePlaying} />
      <FillableWord text={'this is a test'} color={'green'} percentage={80}/>
    </div>
  )

}