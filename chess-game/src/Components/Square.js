import React from 'react';
import '../Style/Square.css';

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

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         piece: true
    //     }
    // }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.piece !== this.props.piece) {
    //         this.setState({
    //             piece: !this.state.piece
    //         })
    //     }
    // }


    // onClick() triggers the pieceClicked()
    // method located in App. The coordinates of the
    // piece that was clicked are sent through the callback
    return (
        <button
            className={"square"}
            style={{backgroundImage: 'url('+ props.piece + ')'}}
            onClick={() => props.onClick(props.y, props.x)}
        />
    );
};

export default Square;