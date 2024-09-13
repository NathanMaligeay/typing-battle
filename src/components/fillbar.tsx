interface FillbarProps {
    value: number;
    isPlaying: boolean;
    text: string;
    textColor: string;
    insideColor: string;
    keyToPress: string;
}

const Fillbar: React.FC<FillbarProps> = ({ value, isPlaying, text, textColor, insideColor, keyToPress }) => {

    const barContainerStyle: React.CSSProperties = {
        height: '300px',
        width: '40px',
        borderRadius: '10px',
        border: `5px solid ${textColor}`,
        //overflow: 'hidden',
    };

    const barStyle: React.CSSProperties = {
        fontFamily: 'silkscreen',
        height: '100%',
        //overflow: 'hidden',
        display: 'flex',
        background: `linear-gradient(to top, ${insideColor} ${value}%, rgb(19, 3, 26) ${value}%)`,
        color: `${textColor}`,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const verticalWordStyle: React.CSSProperties = {
        writingMode: 'vertical-lr',
        textOrientation: 'upright',
        fontFamily: 'silkscreen',
        fontSize: '45px',
        margin: '0',
    };

    const customStyle = {
        marginTop: '10px',
        color: 'yellow',
        fontSize: '25px',
        fontFamily: 'silkscreen',
    };

    if (isPlaying) {
        return (
            <div style={barContainerStyle}>
                <div style={barStyle}>
                    <span style={verticalWordStyle}>{text}</span>
                </div>
                {value >= 100 && <p style={customStyle}>[{keyToPress}]</p>}
            </div>
        )
    }
}

export default Fillbar;