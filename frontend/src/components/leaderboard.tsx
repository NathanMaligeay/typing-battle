import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons";


interface LeaderboardGame {
  id: number;
  username: string;
  score: number;
  wordsTyped: number;
  accuracy: number;
  createdOn: Date;
}

const Leaderboard: React.FC = () => {
  const [gamesArray, setGamesArray] = useState<LeaderboardGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const medalStyle = ["yellow", "silver", "bronze"];

  const formatDate = (date: Date | string) => {
    const validDate = date instanceof Date ? date : new Date(date); // Convert if it's a string
    const day = String(validDate.getDate()).padStart(2, "0");       // Ensure two-digit format
    const month = String(validDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    return `${day}/${month}`;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setGamesArray(leaderboard);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
    
  }, []);

  if (loading) {
    return <div>Loading games...</div>;
  }

  const divStyle: React.CSSProperties = {
    width: 'fit-content',
    boxSizing: 'content-box',
    color: 'yellow',
    fontSize: '20px',
    fontFamily: 'silkscreen',
    maxHeight: '400px', // Limite la hauteur de la div pour permettre le scroll
    overflowY: 'auto',  // Active le défilement vertical
    marginRight: '2px',
};


  return (
    <div style={divStyle}>
      <table className="no-hover">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Words Typed</th>
            <th>Accuracy (%)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {gamesArray.map((game, index) => (
            <tr key={game.id}>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <FontAwesomeIcon
          icon={faMedal}
          style={{ color: medalStyle[index] }}
        />
              </td>
              <td>{game.username}</td>
              <td>{game.score}</td>
              <td>{game.wordsTyped}</td>
              <td>{game.accuracy}</td>
              <td>{formatDate(game.createdOn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
