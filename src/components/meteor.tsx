import React, { useEffect, useMemo, useState } from "react";
import "../styles/main.css";


interface MeteorProps {
    meteorId: string,
    deleteMeteorite: (event: React.AnimationEvent<HTMLImageElement>) => void
}

const createMeteorStyle = (): React.CSSProperties => {

    const randomWidth = Math.floor(Math.random() * 91) + 10;
    const sideStart = Math.floor(Math.random() * 4);
    const randomXStartPosition = Math.floor(Math.random() * 100);
    const randomXEndPosition = Math.floor(Math.random() * 100);
    const randomYStartPosition = Math.floor(Math.random() * 100);
    const randomYEndPosition = Math.floor(Math.random() * 100);
    const randomRotationStart = Math.floor(Math.random() * 360); // Random starting rotation
    const randomRotationEnd = Math.floor(Math.random() * 360); // Random ending rotation
    const animationDuration = Math.pow(Math.log2(randomWidth),2)/1.5 //plus la météorite est grosse, plus je veux qu'elle se déplace lentement

    const animationName = `moveMeteor-${Math.random().toString(36).substr(2, 9)}`;
    let keyframes = '';

    switch (sideStart) {
        case 0:
            keyframes = `
 @keyframes ${animationName} {
     0% {
         left: -10%;
         top: ${randomYStartPosition}%;
         transform: rotate(${randomRotationStart}deg);
     }
     100% {
         left: 110%;
         top: ${randomYEndPosition}%;
         transform: rotate(${randomRotationEnd}deg);
     }
 }
`;
            break;
        case 1:
            keyframes = `
        @keyframes ${animationName} {
            0% {
                right: -10%;
                top: ${randomYStartPosition}%;
                transform: rotate(${randomRotationStart}deg);
            }
            100% {
                right: 110%;
                top: ${randomYEndPosition}%;
                transform: rotate(${randomRotationEnd}deg);
            }
        }
    `;
            break;
        case 2:
            keyframes = `
        @keyframes ${animationName} {
            0% {
                left: ${randomXStartPosition}%;
                top: -10%;
                transform: rotate(${randomRotationStart}deg);
            }
            100% {
                left: ${randomXEndPosition}%;
                top: 110%;
                transform: rotate(${randomRotationEnd}deg);
            }
        }
    `;
            break;
        case 3:
            keyframes = `
 @keyframes ${animationName} {
     0% {
         left: ${randomXStartPosition}%;
         bottom: -10%;
         transform: rotate(${randomRotationStart}deg);
     }
     100% {
         left: ${randomXEndPosition}%;
         bottom: 110%;
         transform: rotate(${randomRotationEnd}deg);
     }
 }
`;
            break;
    }

    // Ensure the keyframes are properly appended
    const styleSheet = document.head.querySelector('style') || document.createElement('style');
    if (!document.head.querySelector('style')) {
        document.head.appendChild(styleSheet);
    }
    styleSheet.sheet?.insertRule(keyframes, styleSheet.sheet.cssRules.length);

    return {
        width: `${randomWidth}px`,
        animation: `${animationName} ${animationDuration}s linear 1`,
    };
};

const Meteor: React.FC<MeteorProps> = ({meteorId, deleteMeteorite}) => {

    useEffect(() => {
        const style = document.createElement('style');
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, );

    const meteorStyle = useMemo(createMeteorStyle, []);


    return (
        <div className="meteor-container">
            <img key={meteorId} id={meteorId} src="meteor.png" className="meteor" alt="Meteor" style={meteorStyle} onAnimationEnd={deleteMeteorite} />
        </div>
    )
}

export default Meteor