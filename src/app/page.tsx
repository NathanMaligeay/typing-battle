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
import GameOverBox from "@/components/gameoverbox";

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
  const [gameOver, setGameOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const wordsTyped = useRef<number>(0) as React.MutableRefObject<number>;
  const accuracy = useRef<number>(0) as React.MutableRefObject<number>;
  const [time, setTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timePlayedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef } = useWords(isPlaying, isPaused);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped, setTextTyped, resetEntireStringTyped, calculateWordAccuracy } = useKeyboardInput(isPlaying, highlightedWord, isPaused);
  const { health, takeDamage, resetHealth } = useHealth();
  const { updateCombo, resetCombo, addWordScore, resetScore, score, hiScore, addPointScore } = useScore(isPlaying, isPaused);
  const { freezeScoreRef, nukeScoreRef, addScoreAction, resetScoreAction } = useAction(setWords, setTextTyped, isPlaying, addPointScore, words, wordsTyped);


  const togglePlaying = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    setGameOver(false);
    resetTextTyped();
    resetHealth();
    resetScore();
    resetScoreAction();
    resetWordIntervalRef();
    setTime(0); // reset le timer a 0 pour chaque game
    wordsTyped.current = 0;
    accuracy.current = 0;
    setTimerActive(true); //active le timer
    closeModal();
  }, [setIsPlaying, setIsPaused, resetTextTyped, resetHealth, resetScore, resetScoreAction, resetWordIntervalRef, setTimerActive])

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    setIsPlaying(false);
    setTimerActive(false);
  },[setGameOver, setIsPlaying, setTimerActive])

  useEffect(() => {
    if (timerActive) {
      timePlayedIntervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000) //add 1 to counter each sec
    } else {
      if (timePlayedIntervalRef.current) {
        clearInterval(timePlayedIntervalRef.current);
        timePlayedIntervalRef.current = null;
      }
    }

    return () => {
      if (timePlayedIntervalRef.current) {
        clearInterval(timePlayedIntervalRef.current);
      }
    }
  }, [timerActive, setTime])

  const togglePausing = () => {
    setIsPaused((prev) => !prev);
    setTimerActive((prev) => !prev);
  }

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
      resetEntireStringTyped();
    }
    resetCombo();
    removeWord(wordId);
    takeDamage();
  }, [removeWord, resetTextTyped, takeDamage, resetCombo, highlightedWord, resetEntireStringTyped]);

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
  }, [textTyped, highlightedWord, removeWord, resetTextTyped, updateCombo, addWordScore, addScoreAction, calculateWordAccuracy, resetEntireStringTyped]);


  useEffect(() => {
    const handleEndGame = async () => {
      try {
        await sendEndGameInfo(username, wordsTyped.current, (accuracy.current / wordsTyped.current) * 100);
      } catch (error) {
        if (error instanceof Error) alert(`Error: ${error.message}`);
      }
    }
    if (health === 0) {
      if (username) {
        handleEndGame();
      }
      handleGameOver();
    }
  }, [health, username, handleGameOver])

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isPlaying && !isPaused) togglePausing();
  }

  const closeModal = () => setIsModalOpen(false);
  
  const closeGameOverModal = () => {
    setGameOver(false);
  }


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
  }, [])

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
          <Modal isOpen={gameOver} onClose={closeGameOverModal}>
            <GameOverBox timePlayed={time} wordsTyped={wordsTyped.current} accuracy={accuracy.current}/>
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