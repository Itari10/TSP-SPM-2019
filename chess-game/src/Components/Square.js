import React from 'react';
import '../Style/Square.css';
import dogtest2 from '../Assets/dogtest2.png';
import tree from '../Assets/tree.jpg';
import test from '../Assets/test.png';

/**
 Square should be aware of it's coordinates
 whether or not it's selected
 and whether or not it's highlighted

 PROPS
 key:            unused unique identifier so that we'd stop getting React warnings
 y:              Y coordinate on the board and inside the main 2D array
 x:              X coordinate on the board and inside the main 2D array
 piece:          current piece "on" the square
 isHighlighted   whether or not the given square is currently highlighted

 STATE
 isSelected:      needs to be set to false when another square isSelected
**/

const Square = (props) => {
    function determineImage() {
        switch (props.piece) {
            case "dog":
                return dogtest2;
            case "tree":
                return tree;
            case "test":
                return test;
            default:
                return null;
        }
    }

    return (
        <button className={"square"} style={{backgroundImage: 'url('+ determineImage() + ')'}} />
    );
};

export default Square;