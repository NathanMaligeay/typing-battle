import React from "react";

interface PlayButtonProps {
    isPlaying: boolean;
    onClickFunction: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClickFunction }) => {
    if (isPlaying) {
        return <button onClick={onClickFunction}>Stop game</button>;
    }
    else {
        return <button onClick={onClickFunction}>Start game</button>;
    }
}

export default PlayButton;
