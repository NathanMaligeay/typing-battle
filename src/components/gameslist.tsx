import React, { useEffect, useState } from 'react';
import { getAllGames } from '@/utils/api';

interface GamesListProps {
    username: string | null;
}

interface Game {
    game_id: number;
    words_typed: number;
    accuracy: number;
    score: number;
}


const GamesList: React.FC<GamesListProps> = ({ username }) => {
    const [gamesArray, setGamesArray] = useState<Game[]>([]); // State to store games data
    const [loading, setLoading] = useState<boolean>(true); // State to show loading

    const divStyle: React.CSSProperties = {
        boxSizing: 'content-box',
        color: 'yellow',
        fontSize: '25px',
        fontFamily: 'silkscreen',
        maxHeight: '400px', // Limite la hauteur de la div pour permettre le scroll
        overflowY: 'auto',  // Active le défilement vertical
        marginRight: '2px',
    };



    const thStyle: React.CSSProperties = {
        position: 'sticky',   // Make the <th> sticky
        top: 0,               // Stick to the top of the container
        backgroundColor: '#111',  // Background color to ensure it stays visible
        color: 'yellow',
        zIndex: 1,            // Ensures it stays above other rows when scrolling
        textAlign: 'left',    // Align text to the left
        borderTop: 'hidden',
    };

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const games = await getAllGames(username);
                setGamesArray(games);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching games:', error);
                setLoading(false);
            }
        };

        fetchGames();
    }, [username]);

    if (loading) {
        return <p>Loading games...</p>;
    }

    return (
        <div style={divStyle}>
            <table>
                <thead>
                    <tr>
                        <th style={thStyle}>Game ID</th>
                        <th style={thStyle}>Words Typed</th>
                        <th style={thStyle}>Accuracy (%)</th>
                        <th style={thStyle}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {gamesArray.map((game) => (
                        <tr key={game.game_id}>
                            <td>{game.game_id}</td>
                            <td>{game.words_typed}</td>
                            <td>{game.accuracy}</td>
                            <td>{game.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GamesList;
