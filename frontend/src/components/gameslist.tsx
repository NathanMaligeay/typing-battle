import React, { useEffect, useState } from 'react';
import { getAllGames } from '@/utils/api';

interface GamesListProps {
    username: string | null;
}

interface Game {
    id: number;
    wordsTyped: number;
    accuracy: number;
    score: number;
    createdOn: Date;
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

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit format
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        return `${day}/${month}`;
    };

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const games = await getAllGames(username);
                console.log(games);
                const gamesWithDate = games.map((game: { createdOn: string | number | Date; }) => ({
                    ...game,
                    createdOn: new Date(game.createdOn), // Convert createdOn to Date
                }));
                setGamesArray(gamesWithDate);
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
                        <th style={thStyle}>Words Typed</th>
                        <th style={thStyle}>Accuracy (%)</th>
                        <th style={thStyle}>Score</th>
                        <th style={thStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {gamesArray.map((game) => (
                        <tr key={game.id}>
                            <td>{game.wordsTyped}</td>
                            <td>{game.accuracy}</td>
                            <td>{game.score}</td>
                            <td>{formatDate(game.createdOn)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GamesList;
