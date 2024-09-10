"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
import FillableWord from '@/components/fillableword';
import ScoreBox from '@/components/scorebox';
import TextTypedBox from '@/components/texttypedbox';
import { useWords } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useHealth } from '@/hooks/useHealth';
import { useScore } from '@/hooks/useScore';
import { useAction } from '@/hooks/useAction';
import "../styles/main.css";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { words, highlightedWord, removeWord, updateWordPosition, setWords } = useWords(isPlaying);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped } = useKeyboardInput(isPlaying);
  const { health, takeDamage, resetHealth } = useHealth();
  const {updateCombo, resetCombo, addWordScore, resetScore, score, hiScore} = useScore(isPlaying);
  const {freezeScoreRef, nukeScoreRef} = useAction(score, words, setWords, isPlaying);

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
      addWordScore(highlightedWord.text);
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

        <TextTypedBox isPlaying={isPlaying} textTyped={textTyped} highlightedWordText={highlightedWord?.text || ''}/>
      </div>
      <div className='rightPanel'>
        <div className='userBox'>im user</div>
        <ScoreBox currentScore={score} highScore={hiScore} isPlaying={isPlaying}/>
        <div className='verticalPanel'>
          <Healthbar health={health} isPlaying={isPlaying} />
          <FillableWord  text='FREEZE' color='cornflowerblue' percentage={50} isPlaying={isPlaying} actionScore={freezeScoreRef.current}/>
          <FillableWord  text='NUKE' color='orange' percentage={100} isPlaying={isPlaying} actionScore={nukeScoreRef.current}/>
        </div>
      </div>


    </div>

  );
};

export default Main;