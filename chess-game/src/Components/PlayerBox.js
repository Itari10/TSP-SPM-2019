import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.checkmate ? "checkmate" : (props.isTurn ? (props.inCheck ? "turnCheck" : "turn") : "notTurn"))}>
            <div className={"row"}>
                <div className={"col-sm-6 text-left"}>

                    <h2>{props.playerTitle + (props.checkmate ? ": CHECKMATE" : (props.inCheck ? ": CHECK" : ""))}</h2>
                </div>
                <div className={"col-sm-6 text-right"}>
                    <h2>Its a Timer bro</h2>
                </div>
            </div>
            <hr />
            <div className={"row height-adjust"}>
                <div className={"col-sm-12"} id={props.playerNumber} />
            </div>
            <hr />
            <div className={"row"}>
                <div className={"col-sm-12"}>
                    <SurrenderButton
                        disable =           {!props.isTurn}
                        triggerGameOver =   {props.triggerGameOver}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerBox;