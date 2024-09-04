import React, { useMemo } from "react";
import "../styles/main.css";

interface MeteorProps {
    meteorId: string;
    onAnimationEnd: (id: string) => void;
}

const generateKeyframes = (sideStart: number, meteorId: string, randomYStartPosition: number, randomYEndPosition: number, randomXStartPosition: number, randomXEndPosition: number, randomRotationStart: number, randomRotationEnd: number) => {
    const animationName = `moveMeteor-${meteorId}`;
    switch (sideStart) {
        case 0:
            return `
                @keyframes ${animationName} {
                    0% { left: -10%; top: ${randomYStartPosition}%; transform: rotate(${randomRotationStart}deg); }
                    100% { left: 110%; top: ${randomYEndPosition}%; transform: rotate(${randomRotationEnd}deg); }
                }
            `;
        case 1:
            return `
                @keyframes ${animationName} {
                    0% { right: -10%; top: ${randomYStartPosition}%; transform: rotate(${randomRotationStart}deg); }
                    100% { right: 110%; top: ${randomYEndPosition}%; transform: rotate(${randomRotationEnd}deg); }
                }
            `;
        case 2:
            return `
                @keyframes ${animationName} {
                    0% { left: ${randomXStartPosition}%; top: -10%; transform: rotate(${randomRotationStart}deg); }
                    100% { left: ${randomXEndPosition}%; top: 110%; transform: rotate(${randomRotationEnd}deg); }
                }
            `;
        case 3:
            return `
                @keyframes ${animationName} {
                    0% { left: ${randomXStartPosition}%; bottom: -10%; transform: rotate(${randomRotationStart}deg); }
                    100% { left: ${randomXEndPosition}%; bottom: 110%; transform: rotate(${randomRotationEnd}deg); }
                }
            `;
        default:
            return '';
    }
};

const Meteor: React.FC<MeteorProps> = ({ meteorId, onAnimationEnd }) => {
    const meteorStyle = useMemo(() => {
        const randomWidth = Math.floor(Math.random() * 91) + 10;
        const sideStart = Math.floor(Math.random() * 4);
        const randomXStartPosition = Math.floor(Math.random() * 100);
        const randomXEndPosition = Math.floor(Math.random() * 100);
        const randomYStartPosition = Math.floor(Math.random() * 100);
        const randomYEndPosition = Math.floor(Math.random() * 100);
        const randomRotationStart = Math.floor(Math.random() * 360);
        const randomRotationEnd = Math.floor(Math.random() * 360);
        const animationDuration = Math.pow(Math.log2(randomWidth), 2) / 1.5;

        const keyframes = generateKeyframes(sideStart, meteorId, randomYStartPosition, randomYEndPosition, randomXStartPosition, randomXEndPosition, randomRotationStart, randomRotationEnd);

        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);

        return {
            width: `${randomWidth}px`,
            animation: `moveMeteor-${meteorId} ${animationDuration}s linear 1`,
        };
    }, [meteorId]); // ### logique de mettre meteorId dans la dep array? une fois que la météorite est créé, son id ne change pas pendant son lifecycle 

    return (
        <div className="meteor-container">
            <img
                src="meteor.png"
                className="meteor"
                alt="Meteor"
                style={meteorStyle}
                onAnimationEnd={() => onAnimationEnd(meteorId)}
            />
        </div>
    );
};

export default React.memo(Meteor);