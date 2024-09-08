"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
import FillableWord from '@/components/fillableword';
import ScoreBox from '@/components/scorebox';
import { useWords, Word as WordType } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useHealth } from '@/hooks/useHealth';
import { useScore } from '@/hooks/useScore';
import "../styles/main.css";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { words, highlightedWord, removeWord, updateWordPosition } = useWords(isPlaying);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped } = useKeyboardInput(isPlaying);
  const { health, takeDamage, resetHealth } = useHealth();
  const {updateCombo, resetCombo, addWordScore, resetScore, score, hiScore} = useScore(isPlaying);

  const togglePlaying = () => {
    setIsPlaying(prev => !prev);
    resetTextTyped();
    resetHealth();
    resetScore();
  }

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
    }
    
    resetCombo();
    removeWord(wordId);
    takeDamage();
  }, [removeWord, resetTextTyped, takeDamage, highlightedWord]);

  useEffect(() => {
    if (highlightedWord && textTyped === highlightedWord.text) {
      removeWord(highlightedWord.id);
      resetTextTyped();
      updateCombo();
      addWordScore(textTyped);
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
      <div className='leftPanel'>
        <div className="playBox">
          {isPlaying ? null :
            <button className="playButton" onClick={togglePlaying}>
              PLAY
            </button>
          }
          {words.map((word) => (
            <Word
              key={word.id}
              {...word}
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
          <img className='spaceBeagle' src='space_beaglev2.png'></img>
        </div>

        <div className='inputTextDiv'>{textTyped}</div>
      </div>
      <div className='rightPanel'>
        <div className='userBox'>im user</div>
        <ScoreBox currentScore={score} highScore={hiScore}/>
        <div className='verticalPanel'>
          <Healthbar health={health} isPlaying={isPlaying} />
          <div>im freeze</div>
          <div>im nuke</div>
        </div>
      </div>


    </div>

  );
};

export default Main;