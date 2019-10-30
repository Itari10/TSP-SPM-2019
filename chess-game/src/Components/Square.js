import React from 'react';
import '../Style/Square.css';

/*
Square should be aware of it's coordinates, whether or not it's selected and whether or not it's highlighted
Props {
    isHighlighted
    piece image
    coordinates
}
State {
    isSelected- needs to be set to false when another square isSelected
}
*/
const Square = (props) => {
    return (
        <button className={"square"} onClick={props.onclick}>
            {props.y} {props.x}
            <img className="piece" src={require("../Assets/dogtest2.png")}/>
        </button>
    );
};

export default Square;