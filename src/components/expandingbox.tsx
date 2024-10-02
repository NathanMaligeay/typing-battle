import React, { useState, useEffect } from "react";
import { getNumberGames } from '@/utils/api';

interface ExpandingBoxProps {
    username: string | null;
    handleLogout: () => void;
}

const ExpandingBox: React.FC<ExpandingBoxProps> = ({username, handleLogout}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [totalWordsTyped, setTotalWordsTyped] = useState<number | null>(0);
  const [meanWordsTyped, setMeanWordsTyped] = useState<number | null>(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);



  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchGameCount = async () => {
        try {
            const data = await getNumberGames(username);
            const {count, total_words_typed, mean_words_typed, mean_accuracy} = data;
            setGameCount(count);
            setTotalWordsTyped(total_words_typed);
            setMeanWordsTyped(mean_words_typed);
            setAccuracy(mean_accuracy)
        } catch (error) {
            if (error instanceof Error) alert(`Error: ${error.message}`);
        }
    }
    if (username) {
        fetchGameCount();
    }
  }, [username, isExpanded])


  return (
    <div
      className={`box ${isExpanded ? "expanded" : ""}`}
      onClick={toggleExpand}
    >
      {isExpanded ? <div className="expandedbox">
        <div>Games played : {gameCount}</div>
        <div>Words typed : {totalWordsTyped}</div>
        <div>Avg. words typed : {meanWordsTyped}</div>
        <div>Avg. accuracy: {accuracy}</div>
        <div>
          <button onClick={handleLogout} className="logoutButton">Logout</button>
          <button className="logoutButton">View games</button>
        </div>
        </div> 
        : 
        <div>Connected as {username}</div>}
    </div>
  );
};

export default ExpandingBox;
