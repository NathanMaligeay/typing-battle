import { useState, useEffect, useCallback, useRef } from 'react';

export const useAccuracy = (isPlaying: boolean, isPaused: boolean, textTyped: string, highlightedWord: string) => {
    const wordAccuracy = useRef<number | null>(null);
    const meanAccuracy = useRef<number | null>(null);

    useEffect(() => {
        const letterTyped = 0;
        while (letterTyped < highlightedWord.length) {
            
        }
    },[])
}