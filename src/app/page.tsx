"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import FillableWord from '@/components/fillableword';
import { useWords, Word as WordType } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import "../styles/main.css";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { words, highlightedWord, removeWord, updateWordPosition } = useWords(isPlaying);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped } = useKeyboardInput(isPlaying);

  const togglePlaying = () => {
    setIsPlaying(prev => !prev);
    resetTextTyped();
  }

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
    }
    
    removeWord(wordId);
  }, [removeWord, resetTextTyped, highlightedWord]);

  useEffect(() => {
    if (highlightedWord && textTyped === highlightedWord.text) {
      removeWord(highlightedWord.id);
      resetTextTyped();
    }
  }, [textTyped, highlightedWord, removeWord, resetTextTyped]);

  return (
    <div>
      <div className="playBox">
        {words.map((word) => (
          <Word
            key={word.id}
            {...word} //syntaxe pr éviter d'écrire text=word.text etc
            isHighlighted={word.id === highlightedWord?.id}
            onPositionUpdate={updateWordPosition}
            onReachBottom={handleWordReachBottom}
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
      <FillableWord text={'this is a test'} color={'green'} percentage={80} />
    </div>
  );
};

export default Main;