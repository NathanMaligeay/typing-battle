import React from "react";

interface fillableWordProps {
    text: string;
    color: string;
    percentage: number;
    isPlaying: boolean;
    actionScore: number;
    keyToPress: string;
}

const FillableWord: React.FC<fillableWordProps> = ({ text, color, percentage, isPlaying, actionScore, keyToPress }) => {

    const divStyle: React.CSSProperties = {
        display: 'inline-block'
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
        fontSize: '25px',
        fontFamily: 'silkscreen'
    };

    if (isPlaying) {
        return (
            <div style={divStyle}>
                <span style={fillableWordStyle}>{text}</span>
                {actionScore === 100 && <p style={customStyle}>[{keyToPress}]</p>}
            </div>
        );
    }
};

export default FillableWord;

