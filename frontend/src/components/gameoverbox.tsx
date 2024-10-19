import React, { useCallback, useState } from 'react';

interface GameOverBoxProps {
    timePlayed: number;
    wordsTyped: number;
    accuracy: number;
}

const GameOverBox: React.FC<GameOverBoxProps> = ({ timePlayed, wordsTyped, accuracy }) => {

    const transformTimeCounter = useCallback((timePlayed: number) => {
        const minute = Math.floor(timePlayed / 60);
        const secondes = timePlayed % 60;

        return { minute, secondes }
    }, []);

    return (
        <div className='gameoverbox'>
            <div>You survived {transformTimeCounter(timePlayed).minute} minute(s) and {transformTimeCounter(timePlayed).secondes} seconds.</div>
            <div>Words typed : {wordsTyped}</div>
            <div>Average accuracy : {wordsTyped !== 0 ? `${(accuracy / wordsTyped * 100).toFixed(2)}%` : 0}</div>
        </div>
    )
};

export default GameOverBox;
