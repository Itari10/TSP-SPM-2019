import React from 'react';
import '../Style/Square.css';

/*
Square should be aware of it's coordinates, whether or not it's selected and whether or not it's highlighted
*/
const Square = (props) => {
    const [isSelected, setSelected] = React.useState(0);
    const [isHighlighted, setHighlighted] = React.useState(0);

    return (
        <button className="square"></button>
    );
}

export default Square;