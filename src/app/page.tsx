"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
import FillableWord from '@/components/fillableword';
import { useWords, Word as WordType } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useHealth } from '@/hooks/useHealth';
import "../styles/main.css";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { words, highlightedWord, removeWord, updateWordPosition } = useWords(isPlaying);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped } = useKeyboardInput(isPlaying);
  const { health, takeDamage, resetHealth } = useHealth();

  const togglePlaying = () => {
    setIsPlaying(prev => !prev);
    resetTextTyped();
    resetHealth();
  }

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
    }
    
    removeWord(wordId);
    takeDamage();
  }, [removeWord, resetTextTyped, takeDamage, highlightedWord]);

  useEffect(() => {
    if (highlightedWord && textTyped === highlightedWord.text) {
      removeWord(highlightedWord.id);
      resetTextTyped();
    }
  }, [textTyped, highlightedWord, removeWord, resetTextTyped]);

  useEffect(() => {
    if (health === 0) {
      alert('L');
      togglePlaying();
    }
  }, [health, togglePlaying])

  return (
    <div className='HUDbox'>
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
      <div className='inputTextDiv'>{textTyped}</div>
      <button onClick={togglePlaying}>
        {isPlaying ? "Stop game" : "Start game"}
      </button>
      <Healthbar health={health} isPlaying={isPlaying} />
    </div>
  );
};

export default Main;