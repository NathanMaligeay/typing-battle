import React, { useState, useEffect } from "react";
import { getNumberGames } from '@/utils/api';

interface ExpandingBoxProps {
    username: string | null;
}

const ExpandingBox: React.FC<ExpandingBoxProps> = ({username}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [gameCount, setGameCount] = useState<number | null>(null);



  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchGameCount = async () => {
        try {
            const data = await getNumberGames(username);
            console.log(data);
            setGameCount(data.count);
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
        <div></div>
        </div> 
        : 
        <div>Connected as {username}</div>}
    </div>
  );
};

export default ExpandingBox;
