import React from 'react';
import '../Style/EndGame.css'

const EndGameScreen = (props) => {
    return (
        <div className={determineBoxLocation()}>
            <h1>{props.winner} Wins!</h1>
            <button
                className=  "resetButton"
                onClick=    {()=>{window.location.reload()}}
            >
                Reset
            </button>
        </div>
    );

    // changes the popup box's location depending
    // on which player won the game
    function determineBoxLocation() {
        if ( props.blackMate ){
            return "endGameScreenWhiteWins";
        }
        else if ( props.whiteMate )
            return "endGameScreenBlackWins";
    }
};

export default EndGameScreen;

