import { useState, useEffect, useCallback, useRef } from 'react';

export const useAccuracy = (isPlaying: boolean, isPaused: boolean, textTyped: string, highlightedWord: string) => {
    const wordAccuracy = useRef<number | null>(null);
    const meanAccuracy = useRef<number | null>(null);

    useEffect(() => {
        let correctLetters = 0;
        let incorrectLetters = 0;
        while ((textTyped.length -1) < highlightedWord.length) {
            if (textTyped?.[(textTyped.length -1)] === highlightedWord[(textTyped.length -1)]) {
                correctLetters = correctLetters + 1;
            } else {
                incorrectLetters = correctLetters +1;
            }
        }
    },[])
}