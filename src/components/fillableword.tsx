import React from "react";

interface fillableWordProps {
    text: string;
    color: string;
    percentage: number;
    isPlaying: boolean;
    actionScore: number;
}

const FillableWord: React.FC<fillableWordProps> = ({ text, color, percentage, isPlaying, actionScore }) => {

    const divStyle: React.CSSProperties = {

    };

    const fillableWordStyle: React.CSSProperties = {
        background: `linear-gradient(to top, ${color} ${percentage}%, transparent ${percentage}%)`,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextStrokeWidth: '1px',
        WebkitTextStrokeColor: 'white',
        display: 'inline-block',
        writingMode: 'vertical-lr',
        textOrientation: 'upright',
        fontFamily: 'silkscreen',
        fontSize: '45px',
        margin: '0',
    };

    const customStyle = {
        color: 'yellow',
        fontSize: '20px'
    };

    if (isPlaying) {
        return (
            <div style={divStyle}>
                <p style={fillableWordStyle}>{text}</p>
                {actionScore === 100 && <p style={customStyle}>[1]</p>}
            </div>
        );
    }
};

export default FillableWord;

