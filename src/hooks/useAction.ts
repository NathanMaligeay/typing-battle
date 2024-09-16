import { useState, useEffect, useCallback, useRef } from 'react';
import { Word } from './useWords';

export const useAction = (setWords: (updater: (prevWords: Word[]) => Word[]) => void, setTextTyped: (updater: (prevText: string) => string) => void,  isPlaying: boolean, addPointScore: (points: number) => void) => {
    const freezeScoreRef = useRef<number>(0); //si j'utilise un usestate, ça ne fonctionne pas bien --> comprendre pq
    const nukeScoreRef = useRef<number>(0);


    const addScoreAction = useCallback(() => {
        if (freezeScoreRef.current < 100) {
            freezeScoreRef.current = freezeScoreRef.current + 10;
        }
        if (nukeScoreRef.current < 100) {
            nukeScoreRef.current = nukeScoreRef.current + 10;
        };
    }, [])

    const resetScoreAction = useCallback(() => {
        freezeScoreRef.current = 0;
        nukeScoreRef.current = 0;
    },[]);

    const nukeAction = useCallback(() => {
        setWords(() => []);
        setTextTyped(() => '');
        addPointScore(5000);
    }, [setWords, addPointScore]);

    const freezeAction = useCallback(() => {
        setWords((prevWords) => 
            prevWords.map((word) => ({
                ...word,
                wordIsPaused: true,
            }))
        );

        setTimeout(() => {
            setWords((prevWords) => 
                prevWords.map((word) => ({
                    ...word,
                    wordIsPaused: false,
                }))
            )
        },5000);
        addPointScore(5000);
    }, [setWords, addPointScore])

    const handleKeyDownAction = useCallback((e: KeyboardEvent) => {
        if (!isPlaying) return;
        if (e.key === '1' && nukeScoreRef.current >= 100) {
            nukeAction();
            nukeScoreRef.current = 0;
        }
        if (e.key === '2' && freezeScoreRef.current >= 100) {
            freezeAction();
            freezeScoreRef.current = 0;
        }
    }, [isPlaying, nukeAction, freezeAction]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDownAction);
        return () => document.removeEventListener('keydown', handleKeyDownAction);
      }, [handleKeyDownAction]);

    return { freezeScoreRef, nukeScoreRef, addScoreAction, resetScoreAction };

}