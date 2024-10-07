'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

interface HealthbarProps {
    isPlaying: boolean;
}

const Healthbar: React.FC<HealthbarProps> = ({ isPlaying }) => {

    const health = useSelector((state: RootState) => state.health.value);

    const healthBarContainerStyle: React.CSSProperties = {
        height: '300px',
        width: '60px',
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
    return null;
}

export default Healthbar;