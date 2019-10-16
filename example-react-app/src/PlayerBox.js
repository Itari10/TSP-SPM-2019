import React from 'react';
import './PlayerBox.css';

const PlayerBox = (props) => {
    return (
        <div className="playerBox">
            <h1>Player {props.playerNumber}:</h1>
        </div>
    );
}

export default PlayerBox;