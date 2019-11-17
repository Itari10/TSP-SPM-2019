import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.checkmate ? "checkmate" : (props.isTurn ? (props.inCheck ? "turnCheck" : "turn") : "notTurn"))}
             id={props.playerNumber}>

            <h2>{props.playerTitle + (props.checkmate ? ": CHECKMATE" : (props.inCheck ? ": CHECK" : ""))}</h2>

            <SurrenderButton
                disable =           {!props.isTurn}
                triggerGameOver =   {props.triggerGameOver}
            />

        </div>
    );
};

export default PlayerBox;