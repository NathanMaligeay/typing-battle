import React, { useEffect } from "react";
import "../styles/main.css";


// interface MeteorProps {
//     numberMeteor: number,
// }

const Meteor: React.FC/*<MeteorProps>*/ = (/*{numberMeteor}*/) => {

    useEffect(() => {
        const style = document.createElement('style');
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const createMeteorStyle = (): React.CSSProperties => {

        const randomWidth = Math.floor(Math.random() * 100)
        const sideStart = Math.floor(Math.random() * 4)
        const randomXStartPosition = Math.floor(Math.random() * 100);
        const randomXEndPosition = Math.floor(Math.random() * 100);
        const randomYStartPosition = Math.floor(Math.random() * 100);
        const randomYEndPosition = Math.floor(Math.random() * 100);
        const randomRotationStart = Math.floor(Math.random() * 360); // Random starting rotation
        const randomRotationEnd = Math.floor(Math.random() * 360); // Random ending rotation
        const animationDuration = Math.log2(randomWidth) //plus la météorite est grosse, plus je veux qu'elle se déplace lentement

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




        // Generate a unique keyframes animation for each meteor



        // Append the keyframes to the style element
        if (typeof document !== 'undefined') {
            const styleSheet = document.head.querySelector('style');
            if (styleSheet) {
                styleSheet.sheet?.insertRule(keyframes, styleSheet.sheet.cssRules.length);
            }
        }


        return {
            width: `${randomWidth}px`,
            animation: `${animationName} ${animationDuration}s linear infinite`,
        };
    };



    return (
        <div className="meteor-container">
            <img src="meteor.png" className="meteor" alt="Meteor" style={createMeteorStyle()} />
        </div>
    )
}

export default Meteor