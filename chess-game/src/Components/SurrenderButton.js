import React from 'react';

const SurrenderButton = (props) => {

    function clicked() {
        window.location.reload();
    }    
    return (
        <button className="ffButton" onClick={()=>{clicked()}}>
            Surrender
        </button>
    )
}

export default SurrenderButton;