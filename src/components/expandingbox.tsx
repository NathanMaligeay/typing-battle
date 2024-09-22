import React, { useState, useEffect } from "react";
import { getNumberGames } from '@/utils/api';

interface ExpandingBoxProps {
    username: string | null;
}

const ExpandingBox: React.FC<ExpandingBoxProps> = ({username}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [totalWordsTyped, setTotalWordsTyped] = useState<number | null>(0);
  const [meanWordsTyped, setMeanWordsTyped] = useState<number | null>(0);



  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchGameCount = async () => {
        try {
            const data = await getNumberGames(username);
            setGameCount(data.count);
            console.log(data.count)
            setTotalWordsTyped(data.total_words_typed);
            console.log(data.total_words_typed)
            setMeanWordsTyped(data.mean_words_typed);
            console.log(data.mean_words_typed)
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
      {isExpanded ? <div>
        <div>Number of games played : {gameCount}</div>
        <div>Total number of words typed : {totalWordsTyped}</div>
        <div>Avg. number of words typed : {meanWordsTyped}</div>
        </div> 
        : 
        <div>Connected as {username}</div>}
    </div>
  );
};

export default ExpandingBox;
