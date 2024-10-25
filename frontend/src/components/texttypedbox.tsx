import React, { useCallback } from "react";
//import { Word as WordType } from '@/hooks/useWords';

interface textTypedBoxProps {
    textTyped: string,
    isPlaying: boolean,
    highlightedWordText: string,
};

const TextTypedBox: React.FC<textTypedBoxProps> = ({ textTyped, isPlaying, highlightedWordText }) => {

    const checkCorrespondingLetter = useCallback((index: number, textTyped: string, highlightedWordText: string) => {
        const correctLetter = highlightedWordText[index];
        const typedLetter = textTyped[index];

        if (!textTyped || textTyped.length<=index) {
            return "yellow";
        }
        else if (typedLetter == correctLetter) {
            return "green";
        }
        else {
            return "red";
        }
    }, [])


    if (isPlaying) {
        return (
            <div className="inputTextDiv">
                {highlightedWordText.split("").map((char, index) => (
                    <span key={index} style={{ color: checkCorrespondingLetter(index, textTyped, highlightedWordText) }}>
                        {char}
                    </span>
                ))}
            </div>
        );
    }
};

export default TextTypedBox;