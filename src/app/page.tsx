"use client";

//css
import "../styles/main.css";

//libs
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

//components
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
//import FillableWord from '@/components/fillableword';
import Fillbar from '@/components/fillbar';
import ScoreBox from '@/components/scorebox';
import TextTypedBox from '@/components/texttypedbox';
import Modal from '@/components/modal';
import ExpandingBox from '@/components/expandingbox';
import LoginRegisterForm from '@/components/loginregisterform';

//custom hooks
import { useWords } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useHealth } from '@/hooks/useHealth';
import { useScore } from '@/hooks/useScore';
import { useAction } from '@/hooks/useAction';

//utils
import { registerUser, loginUser, sendEndGameInfo } from '@/utils/api';

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const wordsTyped = useRef<number>(0) as React.MutableRefObject<number>;
  const accuracy = useRef<number>(0) as React.MutableRefObject<number>;
  const [username, setUsername] = useState<string | null>(null);
  const { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef } = useWords(isPlaying, isPaused);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped, setTextTyped, resetEntireStringTyped, calculateWordAccuracy } = useKeyboardInput(isPlaying, highlightedWord, isPaused);
  const { health, takeDamage, resetHealth } = useHealth();
  const { updateCombo, resetCombo, addWordScore, resetScore, score, hiScore, addPointScore } = useScore(isPlaying, isPaused);
  const { freezeScoreRef, nukeScoreRef, addScoreAction, resetScoreAction } = useAction(setWords, setTextTyped, isPlaying, addPointScore, words, wordsTyped);
  

  const togglePlaying = useCallback(() => {
    setIsPlaying(prev => !prev);
    setIsPaused(false);
    resetTextTyped();
    resetHealth();
    resetScore();
    resetScoreAction();
    resetWordIntervalRef();
    wordsTyped.current = 0;
    
  }, [setIsPlaying, setIsPaused, resetTextTyped, resetHealth, resetScore, resetScoreAction, resetWordIntervalRef, wordsTyped])

  const togglePausing = () => {
    setIsPaused((prev) => !prev);
  }

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
      resetEntireStringTyped();
    }
    resetCombo();
    removeWord(wordId);
    takeDamage();
  }, [removeWord, resetTextTyped, takeDamage, resetCombo, highlightedWord]);

  useEffect(() => {
    if (highlightedWord && textTyped === highlightedWord.text) {
      accuracy.current = accuracy.current + calculateWordAccuracy();
      removeWord(highlightedWord.id);
      resetTextTyped();
      resetEntireStringTyped();
      updateCombo();
      addWordScore(highlightedWord.text);
      addScoreAction();
      wordsTyped.current = wordsTyped.current + 1;
    }
  }, [textTyped, highlightedWord, removeWord, resetTextTyped, updateCombo, addWordScore, addScoreAction]);

  console.log(accuracy.current);

  useEffect(() => {
    const handleEndGame = async () => {
      try {
        await sendEndGameInfo(username, wordsTyped.current, (accuracy.current / wordsTyped.current)*100 );
      } catch (error) {
        if (error instanceof Error) alert(`Error: ${error.message}`);
      }
    }
    if (health === 0) {
      alert('L');
      if (username) {
        handleEndGame();
      }
      togglePlaying();
    }
  }, [health, togglePlaying, username])

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isPlaying && !isPaused) togglePausing();

  }
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await registerUser(username, password);
      const { registration, message, username: registeredUsername } = response;
      if (registration) {
        alert(message);
        setIsLogin(true);
        setUsername(registeredUsername);
      } else {
        alert(message);
      }
      closeModal();
    } catch (error) {
      if (error instanceof Error) alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      const { login, message, username: loggedInUsername } = response;

      if (login) {
        setIsLogin(true);
        setUsername(loggedInUsername);
        alert(message);
        closeModal();
      } else {
        alert(message);
      }
    } catch (error) {
      if (error instanceof Error) alert(`Error: ${error.message}`);
    }
  };

  const handleLogout = useCallback(() => {
    setIsLogin(false);
    setUsername(null);
  },[])

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
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <LoginRegisterForm onLogin={handleLogin} onRegister={handleRegister} />
          </Modal>
        </div>
        <TextTypedBox isPlaying={isPlaying} textTyped={textTyped} highlightedWordText={highlightedWord?.text || ''} />
      </div>
      <div className='rightPanel'>

        {isLogin ? <ExpandingBox username={username} handleLogout={handleLogout} /> : <button className='loginregisterbutton' onClick={toggleModal}>Login / Register</button>}

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
    </div>

  );
};

export default Main;