"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
//import FillableWord from '@/components/fillableword';
import Fillbar from '@/components/fillbar';
import ScoreBox from '@/components/scorebox';
import TextTypedBox from '@/components/texttypedbox';
import Modal from '@/components/modal';

import { useWords } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useHealth } from '@/hooks/useHealth';
import { useScore } from '@/hooks/useScore';
import { useAction } from '@/hooks/useAction';
import "../styles/main.css";
import RegisterForm from '@/components/registerform';
import LoginForm from '@/components/loginform';
import { registerUser, loginUser } from '@/utils/api';

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  const { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef } = useWords(isPlaying, isPaused);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped, setTextTyped } = useKeyboardInput(isPlaying, highlightedWord, isPaused);
  const { health, takeDamage, resetHealth } = useHealth();
  const { updateCombo, resetCombo, addWordScore, resetScore, score, hiScore, addPointScore } = useScore(isPlaying, isPaused);
  const { freezeScoreRef, nukeScoreRef, addScoreAction, resetScoreAction } = useAction(setWords, setTextTyped, isPlaying, addPointScore);

  const togglePlaying = () => {
    setIsPlaying(prev => !prev);
    setIsPaused(false);
    resetTextTyped();
    resetHealth();
    resetScore();
    resetScoreAction();
    resetWordIntervalRef();
  }

  const togglePausing = () => {
    setIsPaused((prev) => !prev);
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
      addScoreAction();
    }
  }, [textTyped, highlightedWord, removeWord, resetTextTyped]);

  useEffect(() => {
    if (health === 0) {
      alert('L');
      togglePlaying();
    }
  }, [health, togglePlaying])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = async (username: string, password: string) => {
    try {
      await registerUser(username, password);
      alert('Registration successful!');
      closeModal();
    } catch (error) {
      if (error instanceof Error) alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      await loginUser(username, password);
      alert('Login successful!');
      closeModal();
    } catch (error) {
      if (error instanceof Error) alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className='HUDbox'>
      <div className='leftPanel'>
        <div className="playBox">
          {isPlaying ? null :
            <button className="playButton" onClick={togglePlaying}>
              PLAY
            </button>
          }
          {isPaused ? <div className='pauseDiv'>
            <button className="resumeButton" onClick={togglePausing}>
            RESUME
            </button>
          </div>
            : null}
          {words.map((word) => (
            <Word
              key={word.id}
              {...word}
              isHighlighted={word.id === highlightedWord?.id}
              onPositionUpdate={updateWordPosition}
              onReachBottom={handleWordReachBottom}
              isPaused={isPaused}
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
        <TextTypedBox isPlaying={isPlaying} textTyped={textTyped} highlightedWordText={highlightedWord?.text || ''} />
      </div>
      <div className='rightPanel'>
        <div className='userBox'>
          <button onClick={openModal}>Login / Register</button>
        </div>
        <ScoreBox currentScore={score} highScore={hiScore} isPlaying={isPlaying} />
        <div className='verticalPanel'>
          <Healthbar health={health} isPlaying={isPlaying} />
          <Fillbar isPlaying={isPlaying} value={nukeScoreRef.current} text='NUKE' textColor='rgb(255, 69, 0)' insideColor='rgb(255, 215, 0)' keyToPress='1' />
          <Fillbar isPlaying={isPlaying} value={freezeScoreRef.current} text='FREEZE' textColor='aqua' insideColor='white' keyToPress='2' />
          {/* <FillableWord text='NUKE' color='orange' percentage={nukeScoreRef.current} isPlaying={isPlaying} actionScore={nukeScoreRef.current} keyToPress='1' />
          <FillableWord text='FREEZE' color='cornflowerblue' percentage={freezeScoreRef.current} isPlaying={isPlaying} actionScore={freezeScoreRef.current} keyToPress='2' /> */}
        </div>
        {isPlaying ?
            <button className="rightPanelButton" onClick={isPaused ? togglePlaying : togglePausing}>
            {isPaused ? 'STOP' : 'PAUSE'}
          </button>
          : null
      }
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
      {isRegistering ? (
        <RegisterForm onSubmit={handleRegister} onSwitch={() => setIsRegistering(false)} />
      ) : (
        <LoginForm onSubmit={handleLogin} onSwitch={() => setIsRegistering(true)} />
      )}
      </Modal>
    </div>

  );
};

export default Main;