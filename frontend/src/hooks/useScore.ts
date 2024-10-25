import { useState, useEffect, useCallback, useRef } from 'react';

export const useScore = (isPlaying: boolean, isPaused: boolean) => {
    const [score, setScore] = useState<number>(0);
    const [hiScore, setHiScore] = useState<number>(0);
    const comboRef = useRef<number>(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        const addOneScore = () => {
            setScore((prev) => prev+1);
        }

        if (isPlaying) {
            intervalRef.current = setInterval(addOneScore, 1000);
        }
        if (isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    },[isPlaying, isPaused, setScore, intervalRef])

    useEffect(() => { //gère le highscore (s'update en live en fct du score, je voudrais que ça s'update qu'à la fin de partie)
        if (score > hiScore) {
            setHiScore(score);
        }
    }, [score, hiScore]);

    const resetScore = useCallback(() => setScore(0),[]);
    const updateCombo = useCallback(() => comboRef.current = comboRef.current + 1,[]);
    const resetCombo = useCallback(() => comboRef.current = 1, []);

    const addWordScore = useCallback((word: string) => {
        setScore((prev) => prev + (word.length * comboRef.current));
        return (word.length * comboRef.current);
    },[]);

    const addPointScore = useCallback((points: number) => {
        setScore((prev) => prev + points);
    },[])


    return {updateCombo, resetCombo, addWordScore, resetScore, score, hiScore, addPointScore};

}