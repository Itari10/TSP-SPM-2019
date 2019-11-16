import React from 'react';

const SurrenderButton = (props) => {

    return (
        <button
            className="ffButton"
            onClick =  {()=>{props.triggerGameOver()}}
            disabled = {props.disable}
        >
            Surrender
        </button>
    );
};

export default SurrenderButton;