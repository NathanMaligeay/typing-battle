import { useState, useEffect, useCallback, useRef } from 'react';

export const useScore = (isPlaying: boolean) => {
    const [score, setScore] = useState<number>(0);
    const [hiScore, setHiScore] = useState<number>(0);
    const comboRef = useRef<number>(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { //ajoute +1 au score toutes les secondes
        const addScore = () => {
            setScore((prev) => prev+1);
        }
        if (isPlaying) {
            intervalRef.current = setInterval(addScore, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    },[isPlaying, setScore, intervalRef])

    useEffect(() => { //gère le highscore (s'update en live en fct du score, je voudrais que ça s'update qu'à la fin de partie)
        if (score > hiScore) {
            setHiScore(score);
        }
    }, [score]);

    const resetScore = useCallback(() => setScore(0),[]);
    const updateCombo = useCallback(() => comboRef.current = comboRef.current + 1,[]);
    const resetCombo = useCallback(() => comboRef.current = 1, []);

    const addWordScore = useCallback((word: string) => {
        setScore((prev) => prev + (word.length * comboRef.current));
    },[]);


    return {updateCombo, resetCombo, addWordScore, resetScore, score, hiScore};

}