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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        }, 10);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [id, text, y, onPositionUpdate, onReachBottom]);

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        fontSize: '12px',
        color: isHighlighted ? 'red' : 'yellow',
    };

    return <div style={style}>{text}</div>;
};

export default React.memo(Word);