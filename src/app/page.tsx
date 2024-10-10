"use client";

//css
import "../styles/main.css";

//libs
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { takeDamage, resetHealth } from '../lib/healthSlice';
import { startGame, endGame, stopGame, endGameOver, togglePausing } from '../lib/gameSlice';

//components
import Word from '@/components/word';
import Meteor from '@/components/meteor';
import Healthbar from '@/components/healthbar';
import Fillbar from '@/components/fillbar';
import ScoreBox from '@/components/scorebox';
import TextTypedBox from '@/components/texttypedbox';
import Modal from '@/components/modal';
import ExpandingBox from '@/components/expandingbox';
import LoginRegisterForm from '@/components/loginregisterform';
import GameOverBox from "@/components/gameoverbox";
import GamesList from "@/components/gameslist";

//custom hooks
import { useWords } from '@/hooks/useWords';
import { useMeteors } from '@/hooks/useMeteors';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useScore } from '@/hooks/useScore';
import { useAction } from '@/hooks/useAction';

//utils
import { registerUser, loginUser, sendEndGameInfo } from '@/utils/api';
import { RootState } from "../lib/store";

const Main: React.FC = () => {

  const dispatch = useAppDispatch();

  //state Redux
  const { health, isPlaying, isPaused, isGameOver } = useAppSelector((state: RootState) => ({
    health: state.health.value,
    isPlaying: state.game.isPlaying,
    isPaused: state.game.isPaused,
    isGameOver: state.game.isGameOver,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loginErrMessage, setLoginErrMessage] = useState<string>('');
  const [registerErrMessage, setRegisterErrMessage] = useState<string>('');
  const wordsTyped = useRef<number>(0) as React.MutableRefObject<number>;
  const accuracy = useRef<number>(0) as React.MutableRefObject<number>;
  const [time, setTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timePlayedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const { words, highlightedWord, removeWord, updateWordPosition, setWords, resetWordIntervalRef } = useWords(isPlaying, isPaused);
  const { meteors, removeMeteor } = useMeteors();
  const { textTyped, resetTextTyped, setTextTyped, resetEntireStringTyped, calculateWordAccuracy } = useKeyboardInput(isPlaying, highlightedWord, isPaused);
  const { updateCombo, resetCombo, addWordScore, resetScore, score, hiScore, addPointScore } = useScore(isPlaying, isPaused);
  const { freezeScoreRef, nukeScoreRef, addScoreAction, resetScoreAction } = useAction(setWords, setTextTyped, isPlaying, addPointScore, words, wordsTyped);


  const togglePlaying = useCallback(() => {
    dispatch(startGame());
    resetTextTyped();
    dispatch(resetHealth());
    resetScore();
    resetScoreAction();
    resetWordIntervalRef();
    setTime(0);
    wordsTyped.current = 0;
    accuracy.current = 0;
    setTimerActive(true);
    closeModal();
  }, [resetTextTyped, resetScore, resetScoreAction, resetWordIntervalRef, setTimerActive, dispatch])


  const handleGameOver = useCallback(() => {
    dispatch(endGame());
    setTimerActive(false);
    dispatch(resetHealth());
  }, [setTimerActive, dispatch])

  useEffect(() => {
    if (timerActive) {
      timePlayedIntervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000)
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

  const togglePause = useCallback(() => {
    dispatch(togglePausing());
    setTimerActive((prev) => !prev);
  },[dispatch, setTimerActive])

  const handleWordReachBottom = useCallback((wordId: string) => {
    if (highlightedWord?.id === wordId) {
      resetTextTyped();
      resetEntireStringTyped();
    }
    resetCombo();
    removeWord(wordId);
    dispatch(takeDamage());
  }, [removeWord, resetTextTyped, resetCombo, highlightedWord, resetEntireStringTyped, dispatch]);

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
    const handleEndGameInfo = async () => {
      try {
        await sendEndGameInfo(username, wordsTyped.current, (accuracy.current / wordsTyped.current) * 100, score);
      } catch (error) {
        if (error instanceof Error) alert(`Error: ${error.message}`);
      }
    }
    if (health === 0) {
      if (username) {
        handleEndGameInfo();
      }
      handleGameOver();
    }
  }, [health, username, handleGameOver, score])

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
    if (isPlaying && !isPaused) togglePause();
    if (isGameOver) dispatch(endGameOver());
  },[setIsModalOpen, isPlaying, isPaused, togglePause, dispatch, isGameOver])

  const closeModal = () => {
    setIsModalOpen(false);
    setLoginErrMessage('');
    setRegisterErrMessage('');
  }

  const closeGameOverModal = () => {
    dispatch(endGameOver());
  }


  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await registerUser(username, password);
      const { registration, message, username: registeredUsername } = response;
      if (registration) {
        setIsLogin(true);
        setUsername(registeredUsername);
        closeModal();
        setRegisterErrMessage('');
      } else {
        setRegisterErrMessage(message)
      }
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
        closeModal();
        setLoginErrMessage('');
      }
      else {
        setLoginErrMessage("Incorrect credentials")
      }
    } catch (error) {
      setLoginErrMessage("Incorrect credentials");
    }
  };

  const closeShowList = useCallback(() => {
    setShowList(false);
    
  }, [setShowList])

  const handleLogout = useCallback(() => {
    setIsLogin(false);
    setUsername(null);
    if (isModalOpen) toggleModal();
    if (showList) closeShowList();
    if (isGameOver) dispatch(endGameOver());
    
  }, [setIsLogin, setUsername, toggleModal, isModalOpen, closeShowList, showList, dispatch, isGameOver])

  

  const toggleShowList = useCallback(() => {
    if (isPaused) {
      setShowList((prev) => !prev);
    }
    else {
      if (isGameOver) {
        dispatch(endGameOver());
      }
      setShowList((prev) => !prev);
      if (isPlaying) {
      dispatch(togglePausing());
      }
    }
    
  },[setShowList,dispatch, isPaused, isPlaying, isGameOver])


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
            <button className="resumeButton" onClick={togglePause}>
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
            <LoginRegisterForm onLogin={handleLogin} onRegister={handleRegister} loginErrMessage={loginErrMessage} registerErrMessage={registerErrMessage} />
          </Modal>
          <Modal isOpen={isGameOver} onClose={closeGameOverModal}>
            <GameOverBox timePlayed={time} wordsTyped={wordsTyped.current} accuracy={accuracy.current} />
          </Modal>
          <Modal isOpen={showList} onClose={closeShowList}>
            <GamesList username={username}></GamesList>
          </Modal>
        </div>
        <TextTypedBox isPlaying={isPlaying} textTyped={textTyped} highlightedWordText={highlightedWord?.text || ''} />
      </div>
      <div className='rightPanel'>

        {isLogin ? <ExpandingBox username={username} handleLogout={handleLogout} toggleShowList={toggleShowList} /> : <button className='loginregisterbutton' onClick={toggleModal}>Login / Register</button>}

        <ScoreBox currentScore={score} highScore={hiScore} isPlaying={isPlaying} />
        <div className='verticalPanel'>
          <Healthbar isPlaying={isPlaying} />
          <Fillbar isPlaying={isPlaying} value={nukeScoreRef.current} text='NUKE' textColor='rgb(255, 69, 0)' insideColor='rgb(255, 215, 0)' keyToPress='1' />
          <Fillbar isPlaying={isPlaying} value={freezeScoreRef.current} text='FREEZE' textColor='aqua' insideColor='white' keyToPress='2' />
        </div>
        {isPlaying ?
          <button className="rightPanelButton" onClick={isPaused ? () => dispatch(stopGame()) : togglePause}>
            {isPaused ? 'STOP' : 'PAUSE'}
          </button>
          : null
        }
      </div>
    </div>
  );
};

export default Main;