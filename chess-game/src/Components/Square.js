import React from 'react';
import '../Style/Square.css';

/** Properties you can access through props
 *
 *  key             unique identifier for the Component (so React stops complaining)
 *  y               Y-coordinate on the board AND inside the 8x8 board array
 *  x               Y-coordinate on the board AND inside the 8x8 board array
 *  pieceType       the type of piece on this square
 *  ownedBy         the player who owns the piece on this square
 *  image           the image that will be rendered of this square
 *  onClick:  FUNCTION passed from App that activates when Square is clicked
**/
const Square = (props) => {

    // onClick() triggers the pieceClicked()
    // method located in App. The coordinates of the
    // piece that was clicked are sent through the callback
    return (
        <button
            className={"square"}
            style={{backgroundImage: 'url('+ props.image + ')'}}
            onClick={() => props.onClick(props.y, props.x)}
        />
    );
};

export default Square;