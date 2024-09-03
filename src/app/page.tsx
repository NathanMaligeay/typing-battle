"use client";

import React, { useState, useEffect } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import FillableWord from '@/components/fillableword';
import { useWords } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import "../styles/main.css";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { words, removeWord, updateWordPosition } = useWords(isPlaying);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped } = useKeyboardInput(isPlaying);

  const togglePlaying = () => setIsPlaying(prev => !prev);

  const lowestWord = words.reduce((lowest, word) => 
    word.y > lowest.y ? word : lowest, words[0] || { y: 0 });

  useEffect(() => {
    if (lowestWord && textTyped === lowestWord.text) {
      removeWord(lowestWord.id);
      resetTextTyped();
    }
  }, [textTyped, lowestWord, removeWord, resetTextTyped]);

  return (
    <div>
      <div className="playBox">
        {words.map((word) => (
          <Word
            key={word.id}
            {...word}
            isHighlighted={word === lowestWord}
            onPositionUpdate={updateWordPosition}
            onReachBottom={removeWord}
          />
        ))}
        {meteors.map((meteor) => (
          <Meteor
            key={meteor.id}
            meteorId={meteor.id}
            onAnimationEnd={removeMeteor}
          />
        ))}
      </div>
      <p>{textTyped}</p>
      <button onClick={togglePlaying}>
        {isPlaying ? "Stop game" : "Start game"}
      </button>
      <FillableWord text={'this is a test'} color={'green'} percentage={80}/>
    </div>
  );
};

export default Main;