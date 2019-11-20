import React from 'react';
import '../Style/EndGame.css'

const EndGameScreen = (props) => {
    return (
        <div className="endGameScreen">
            <h1>{props.winner} Wins!</h1>
            <button
                className=  "resetButton"
                onClick=    {()=>{window.location.reload()}}
            >
                Reset
            </button>
        </div>
    );
};

export default EndGameScreen;