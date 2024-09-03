import React from "react";

interface WordProps {
    text: string;
    x: number;
    y: number;
    showWord: boolean;
    onPositionUpdate: (x: number, y: number) => void;
    textColor : string;
}

interface WordState {
    wordText: string;
    x_pos: number;
    y_pos: number;
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
            isVisible: props.showWord,
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                const speed=Math.random()
                const newYPos = prevState.y_pos + (speed * (2/ this.state.wordText.length));

                // Check if the word has reached the bottom
                if (newYPos >= 780) {
                    clearInterval(this.intervalId); // Stop the interval if the word reaches the bottom
                    return {
                        y_pos: newYPos,
                        isVisible: false // Hide the word by setting isVisible to false
                    };
                }

                this.props.onPositionUpdate(this.state.x_pos, newYPos);


                return {
                    y_pos: newYPos,
                    isVisible: prevState.isVisible
                };
            });
        }, 10);
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
        const { x_pos, y_pos, wordText, } = this.state;
        const { textColor } = this.props;

        const style: React.CSSProperties = {
            position: 'absolute',
            margin: 'auto',
            left: `${x_pos}px`,
            top: `${y_pos}px`,
            fontSize: '12px',
            color: textColor,
        };

        return this.state.isVisible ? <div style={style}>{wordText}</div> : null;
    }
}

export default Word;