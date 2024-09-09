import React from "react";

interface fillableWordProps {
    text: string;
    color: string;
    percentage: number;
}

const FillableWord: React.FC<fillableWordProps> = ({ text, color, percentage }) => {

    const divStyle : React.CSSProperties = {
        
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
        fontFamily : 'silkscreen',
        fontSize: '45px',
        margin: '0',
    };

    return (
        <div style={divStyle}>
            <p style={fillableWordStyle}>{text}</p>
        </div>
    );
};

export default FillableWord;

