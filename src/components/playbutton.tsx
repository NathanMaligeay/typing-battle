import React from "react";

interface PlayButtonProps {
    isPlaying: boolean;
    onClickFunction: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClickFunction }) => 
    <button onClick={onClickFunction}>{isPlaying ? "Stop game" : "Start game"}</button>;

export default PlayButton;
