interface HealthbarProps {
    health: number;
    isPlaying: boolean;
}

const Healthbar: React.FC<HealthbarProps> = ({ health, isPlaying }) => {

    const healthBarContainerStyle: React.CSSProperties = {
        height: '300px',
        width: '50px',
        borderRadius: '10px',
        border: '5px solid yellow',
        overflow: 'hidden',
    };

    const healthBarStyle: React.CSSProperties = {
        fontFamily: 'silkscreen',
        fontSize: '18px',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        background: `linear-gradient(to top, rgb(157, 2, 2) ${health}%, rgb(19, 3, 26) ${health}%)`,
        color: 'yellow',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    };

    if (isPlaying) {
        return (
            <div style={healthBarContainerStyle}>
                <div style={healthBarStyle}>
                    {health}
                </div>
            </div>
        )
    }
}

export default Healthbar;