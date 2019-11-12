import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.isTurn) ? "turn" : "notTurn"} id={props.playerNumber}>
            <h2>{props.playerTitle}</h2>
            <SurrenderButton disable={!props.isTurn} />
        </div>
    );
};

export default PlayerBox;