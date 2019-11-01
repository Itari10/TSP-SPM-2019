import React from 'react';
import '../Style/Square.css';
import dogtest2 from '../Assets/dogtest2.png';
import tree from '../Assets/tree.jpg';
import test from '../Assets/test.png';

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
    function determineImage() {
        switch (props.piece) {
            case "dog":
                return dogtest2;
            case "tree":
                return tree;
            case "test":
                return test;
            default:
                return test;
        }
    }

    return (
        <button className={"square"} style={{backgroundImage: 'url('+ determineImage() + ')'}} />
    );
};

export default Square;