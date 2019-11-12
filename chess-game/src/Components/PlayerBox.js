import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.isTurn) ? "turn" : "notTurn"} id={props.playerNumber}>
            <h2>Player {props.playerNumber}:</h2>
            <SurrenderButton />
        </div>
    );
};

export default PlayerBox;