import React from "react";

interface WordProps {
    text: string;
    x: number;
    y: number;
    //keystroke: string;
    showWord: boolean;
}

interface WordState {
    wordText: string;
    x_pos: number;
    y_pos: number;
    //textTyped: string;
    isVisible: boolean;
}

class Word extends React.Component<WordProps, WordState> {
    private intervalId?: NodeJS.Timeout; // Store interval ID for clearing it later

    constructor(props: WordProps) {
        super(props);
        this.state = {
            wordText: props.text,
            x_pos: props.x,
            y_pos: props.y,
            //textTyped: props.keystroke,
            isVisible: props.showWord
        };
    }

    componentDidMount() {
        // Start the animation when the component mounts
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                const newYPos = prevState.y_pos + 1;

                // Check if the word has reached the bottom
                if (newYPos >= 780) {
                    clearInterval(this.intervalId); // Stop the interval if the word reaches the bottom
                    return {
                        y_pos: newYPos,
                        isVisible: false // Hide the word by setting isVisible to false
                    };
                }

                return {
                    y_pos: newYPos, // Continue moving the word down
                    isVisible: prevState.isVisible
                };
            });
        }, 10); // Update every 10ms
    }

    componentWillUnmount() {
        // Clear the interval when the component unmounts
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }



    toggleWord = () => {
        if (this.state.y_pos === 390) {
            this.setState((prevState) => ({
                isVisible: !prevState.isVisible
            }));
        }
    };

    render(): React.ReactNode {
        const { x_pos, y_pos, wordText } = this.state;

        const style: React.CSSProperties = {
            position: 'absolute',
            margin: 'auto',
            left: `${x_pos}px`,
            top: `${y_pos}px`,
            fontSize: '12px',
            color: 'yellow'
        };

        return this.state.isVisible ? <div style={style}>{wordText}</div> : null;
    }
}

export default Word;