import React from 'react';
import '../Style/PlayerBox.css';

const PlayerBox = (props) => {

    return (
        <div className={(props.isTurn) ? "turn" : "notTurn"} id={props.playerNumber}>
            <h2>Player {props.playerNumber}:</h2>
        </div>
    );
};

export default PlayerBox;