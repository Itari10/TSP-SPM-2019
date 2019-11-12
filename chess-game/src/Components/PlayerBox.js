import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={(props.isTurn) ? "turn" : "notTurn"} id={props.playerNumber}>
<<<<<<< HEAD
            <h2>Player {props.playerNumber}:</h2>
            <SurrenderButton />
=======
            <h2>{props.playerTitle}</h2>
>>>>>>> 7a94e9fae31b042e6da0ac05c300966ba371c696
        </div>
    );
};

export default PlayerBox;