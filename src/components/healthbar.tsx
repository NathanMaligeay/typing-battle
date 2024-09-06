interface HealthbarProps {
    health: number;
    isPlaying: boolean;
}

const Healthbar: React.FC<HealthbarProps> = ({health, isPlaying}) => {

    const healthBarContainerStyle: React.CSSProperties = {
        height: '300px',
        width: '40px',
        color: 'white',
        borderRadius: '10px',
        border: '1px solid green',
        overflow : 'hidden',
    };
    
    const healthBarStyle: React.CSSProperties = {
        height: '100%',
        overflow : 'hidden',
        display: 'flex',
        background: `linear-gradient(to top, yellow ${health}%, transparent ${health}%)`,
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems : 'center',
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