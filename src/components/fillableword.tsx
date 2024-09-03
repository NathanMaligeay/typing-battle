import React from "react";

interface fillableWordProps {
    text: string;
    color: string;
    percentage: number;
}

const FillableWord: React.FC<fillableWordProps> = ({ text, color, percentage }) => {


    const fillableWordStyle: React.CSSProperties = {
        background: `linear-gradient(to right, ${color} ${percentage}%, transparent ${percentage}%)`,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextStrokeWidth: '1px',
        WebkitTextStrokeColor: 'black',
        display: 'inline-block',
    };

    return (
        <div>
            <p style={fillableWordStyle}>{text}</p>
        </div>
    );
};

export default FillableWord;

