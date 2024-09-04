import React, { useEffect, useRef } from 'react';

interface WordProps {
    id: string;
    text: string;
    x: number;
    y: number;
    isHighlighted: boolean;
    onPositionUpdate: (id: string, y: number) => void;
    onReachBottom: (id: string) => void;
}

const Word: React.FC<WordProps> = ({ id, text, x, y, isHighlighted, onPositionUpdate, onReachBottom }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null); //permet de stocker une valeur qui ne sert pas à render qqchose et renvoie un objet avec methode "current"
    // en gros chaque composant Word a son propre interval stocké dans une ref et pas de rerender qd intervalRef est changé

    useEffect(() => { 
        intervalRef.current = setInterval(() => {
            const speed = Math.random() * (2 / text.length);
            const newY = y + speed;

            if (newY >= 780) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                onReachBottom(id);
            } else {
                onPositionUpdate(id, newY);
            }
        }, 4);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [id, text, y, onPositionUpdate, onReachBottom]); // ### je suis pas sur de comprendre le useeffect ici, a chaque fois que y change (dc tt le temps),
    // on recrée un intervalRef pr le mot? donc la vitesse change tout le temps et n'est pas constante ?

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        fontSize: '12px',
        color: isHighlighted ? 'red' : 'yellow',
    };

    return <div style={style}>{text}</div>;
};

export default React.memo(Word); // ### pas sur de comprendre pq on memoize le component
// memo = skip le rerender du component si les props du component n'ont pas changé