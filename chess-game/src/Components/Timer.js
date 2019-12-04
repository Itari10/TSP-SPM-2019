import React, { Component } from 'react'



export default class Timer extends Component {

    //Gather all of the props and put them into Timer State
    constructor(props) {
        super(props);
        this.state = {
            minutes: 20,
            seconds: 0,
            isTurn: props.isTurn,
            triggerGameOver: props.triggerGameOver,
            isEndGame: props.isEndGame,
        };
    }


    //Begins the timer by using an interval
    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes, isEndGame } = this.state;

            //Check if the game is over by other circumstances, if so, stop timer
            if (isEndGame)
                this.endTheGame();

            //If there are still seconds left keep going down
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }));
            }
            //if there are no seconds either end the game (if 0 minutes also) or subtract a minute
            if (seconds === 0) {
                if (minutes === 0) {
                    this.endTheGame();
                } else {
                    this.keepGoing()
                }
            }
        }, 1000)
    }

    //This function will watch for the endGame state to update, if it does we will ensure our local state of endGame
    //updates and we will then be able to end the game on the next second interval
    componentDidUpdate(prevProps) {
        if (this.props.isEndGame !== prevProps.isEndGame)
            this.setState(({}) => ({
                isEndGame: true
            }));
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }


    //This will end the game and stop the time
    endTheGame() {
        const { isTurn, triggerGameOver, isEndGame } = this.state;
        clearInterval(this.myInterval);
        if (isTurn && !isEndGame) {
            triggerGameOver();
        }
    }

    //subtracting a minute
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