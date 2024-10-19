import React from "react";

interface scoreBoxProps {
    currentScore: number;
    highScore: number;
    isPlaying: boolean;
};

const ScoreBox: React.FC<scoreBoxProps> = ({ currentScore, highScore, isPlaying }) => {
    if (isPlaying) {
        return (
            <div className="scoreBox">
                <div>Score: {currentScore}</div>
                <div>Hi-score: {highScore}</div>
            </div>
        );
    }
};

export default ScoreBox;