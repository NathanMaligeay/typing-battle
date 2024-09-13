import React, { useEffect, useRef } from 'react';

interface WordProps {
    id: string;
    text: string;
    x: number;
    y: number;
    wordIsPaused: boolean;
    isHighlighted: boolean;
    onPositionUpdate: (id: string, y: number) => void;
    onReachBottom: (id: string) => void;
    isPaused: boolean;
}

const Word: React.FC<WordProps> = ({ id, text, x, y, wordIsPaused, isHighlighted, onPositionUpdate, onReachBottom, isPaused }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null); //permet de stocker une valeur qui ne sert pas à render qqchose et renvoie un objet avec methode "current"
    // en gros chaque composant Word a son propre interval stocké dans une ref et pas de rerender qd intervalRef est changé
    const yRef = useRef<number>(y)
    const speedRef = useRef<number>(text.length);

    useEffect(() => {
        if (wordIsPaused || isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {

            const newY = yRef.current + 1;

            if (newY >= 640) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                onReachBottom(id);
            } else {
                yRef.current = newY;
                onPositionUpdate(id, newY);
            }
        }, 4 * speedRef.current);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [id, onPositionUpdate, onReachBottom, wordIsPaused, speedRef.current, isPaused ]); // ### je suis pas sur de comprendre le useeffect ici, a chaque fois que y change (dc tt le temps),
    // on recrée un intervalRef pr le mot? donc la vitesse change tout le temps et n'est pas constante ?

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        fontSize: '15px',
        color: isHighlighted ? 'red' : 'yellow',
        zIndex: '2',
    };

    return <div className='word' style={style}>{text}</div>;
};

export default Word;

// export default React.memo(Word); // ### pas sur de comprendre pq on memoize le component
// memo = skip le rerender du component si les props du component n'ont pas changé