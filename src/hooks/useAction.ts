import { useState, useEffect, useCallback, useRef } from 'react';
import { Word } from './useWords';

export const useAction = (score: number, words: Word[], setWords: ([]) => void, isPlaying: boolean) => {
    const freezeScoreRef = useRef<number>(0);
    const nukeScoreRef = useRef<number>(0);


    useEffect(() => {
        if (freezeScoreRef.current < 100) {
            freezeScoreRef.current = Math.min(freezeScoreRef.current + (score - freezeScoreRef.current), 100)
        }
        if (nukeScoreRef.current < 100) {
            nukeScoreRef.current = Math.min(nukeScoreRef.current + (score - nukeScoreRef.current), 100)
        }
    }, [score])

    const nukeAction = useCallback(() => {
        setWords([]);
    }, [setWords]);

    // const freezeAction = useCallback(() => {

    // }, [])

    const handleKeyDownAction = useCallback((e: KeyboardEvent) => {
        if (!isPlaying) return;
        if (e.key === '1' && nukeScoreRef.current == 100) {
            nukeAction();
            nukeScoreRef.current = 0;
        }
    }, [isPlaying, nukeAction]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDownAction);
        return () => document.removeEventListener('keydown', handleKeyDownAction);
      }, [handleKeyDownAction]);

    return { freezeScoreRef, nukeScoreRef };

}