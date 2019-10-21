import React from 'react';
import './PlayerBox.css';

const PlayerBox = (props) => {
    return (
        <div className="playerBox" id={props.playerNumber}>
            <h1>Player {props.playerNumber}:</h1>
        </div>
    );
};

export default PlayerBox;