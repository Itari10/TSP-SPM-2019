import React, { Component } from 'react'


export default class Timer extends Component {

    // Gather all of the props and put them into Timer State
    constructor(props) {
        super(props);
        this.state = {
            minutes: 20,
            seconds: 0,
            isTurn: props.isTurn,
            triggerGameOver: props.triggerGameOver,
            isEndGame: props.isEndGame,
            isStalemate: props.isStalemate,
        };
    }


    // Begins the timer by using an interval
    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes, isEndGame, isTurn, isStalemate } = this.state;

            // check if the game is over by other circumstances, if so, stop timer
            if (isEndGame || isStalemate){
                this.endTheGame();
            }

            // if there are still seconds left keep going down
            if (seconds > 0 && isTurn) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }));
            }
            // if there are no seconds either end the game (if 0 minutes also) or subtract a minute
            if (seconds === 0) {
                if (minutes === 0) {
                    this.endTheGame();
                } else if (isTurn) {
                    this.keepGoing()
                }
            }
        }, 1000)
    }

    // This function will watch for the endGame state to update, if it does we will ensure our local state of endGame
    // updates and we will then be able to end the game on the next second interval
    componentDidUpdate(prevProps) {
        if (this.props.isEndGame !== prevProps.isEndGame)
            this.setState(({}) => ({
                isEndGame: true
            }));
        if (this.props.isTurn !== prevProps.isTurn)
            this.setState(({isTurn}) => ({
                isTurn: !isTurn
            }));
        if (this.props.isStalemate !== prevProps.isStalemate)
            this.setState(({}) => ({
                isStalemate: true
            }));
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }


    // This will end the game and stop the timer, isEndGame being true will end the game elsewhere
    endTheGame() {
        const { isTurn, triggerGameOver, isEndGame, isStalemate } = this.state;
        clearInterval(this.myInterval);

        // Handles the condition of timer running out of time
        if (isTurn && !isEndGame && !isStalemate) {
            triggerGameOver();
        }
    }

    // subtracting a minute
    keepGoing() {
        this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59
        }))
    }

    render() {
        const { minutes, seconds } = this.state;
        return (
            <div>
                <h2>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
            </div>
        )
    }
}