import React, { Component } from 'react'



export default class Timer extends Component {

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



    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes, isEndGame } = this.state;
            if (isEndGame)
                this.endTheGame();
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }));
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    this.endTheGame();
                } else {
                    this.keepGoing()
                }
            }
        }, 1000)
    }

    componentDidUpdate(prevProps) {
        if (this.props.isEndGame !== prevProps.isEndGame)
            this.setState(({}) => ({
                isEndGame: true
            }));
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
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