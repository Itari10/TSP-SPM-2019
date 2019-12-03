import React, { Component } from 'react'



export default class Timer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: 5,
            isTurn: props.isTurn,
            triggerGameOver: props.triggerGameOver,
            isEndGame: props.isEndGame,
        };
    }



    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes, isTurn, triggerGameOver, isEndGame } = this.state;

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
                console.log(this.state);
            }
            //if (endGame) HANDLE LOGIC
            if (seconds === 0) {
                if (minutes === 0) {
                    this.endTheGame()
                    console.log(this.state);
                } else {
                    this.keepGoing()
                }
            }
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }



    endTheGame() {
        const { isTurn, triggerGameOver } = this.state;
        clearInterval(this.myInterval);
        if (isTurn) {
            triggerGameOver();
        }
    }

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