import React from 'react';
import '../Style/EndTurnBtn.css'

/*
 End turn button is temporary for testing the switching of turns between the players
 */
const EndTurnBtn = (props) => {

    return (
        <button className="btn" onClick={()=>{props.onClick()}}>
                <h2> End Turn </h2>
        </button>
    );
};

export default EndTurnBtn;