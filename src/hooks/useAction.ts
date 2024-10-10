import { useState, useEffect, useCallback, useRef } from 'react';
import { Word } from './useWords';

export const useAction = (setWords: (updater: (prevWords: Word[]) => Word[]) => void,
    setTextTyped: (updater: (prevText: string) => string) => void,
    isPlaying: boolean, addPointScore: (points: number) => void,
    words: Word[],
    wordsTypedRef: React.MutableRefObject<number>
) => {
    const freezeScoreRef = useRef<number>(0);
    const nukeScoreRef = useRef<number>(0);


    const addScoreAction = useCallback(() => {
        if (freezeScoreRef.current < 100) {
            freezeScoreRef.current = freezeScoreRef.current + 1;
        }
        if (nukeScoreRef.current < 100) {
            nukeScoreRef.current = nukeScoreRef.current + 1.3;
        };
    }, [])

    const resetScoreAction = useCallback(() => {
        freezeScoreRef.current = 0;
        nukeScoreRef.current = 0;
    }, []);

    const nukeAction = useCallback(() => {
        const wordsNuked = words.length;
        wordsTypedRef.current = (wordsTypedRef.current || 0) + wordsNuked;
        setWords(() => []);
        setTextTyped(() => '');
        addPointScore(5000);
    }, [setWords, addPointScore, setTextTyped, wordsTypedRef, words]);

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
        }, 5000);
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