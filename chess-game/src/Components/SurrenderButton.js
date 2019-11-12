import React from 'react';

const SurrenderButton = (props) => {

    function clicked() {
        window.location.reload();
    }    
    return (
        <button className="ffButton" onClick={()=>{clicked()}} disabled={props.disable}>
            Surrender
        </button>
    )
}

export default SurrenderButton;