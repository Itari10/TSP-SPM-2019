import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.checkmate ? "checkmate" : (props.isTurn ? (props.inCheck ? "turnCheck" : "turn") : "notTurn"))}
             id={props.playerNumber}>
            <div className={"pBoxHeader"}>

                <h2>{props.playerTitle + (props.checkmate ? ": CHECKMATE" : (props.inCheck ? ": CHECK" : ""))}</h2>

                <SurrenderButton
                    disable =           {!props.isTurn}
                    triggerGameOver =   {props.triggerGameOver}
                />
            </div>
            <div className={"pBoxContainer"} />

        </div>
    );
};

export default PlayerBox;