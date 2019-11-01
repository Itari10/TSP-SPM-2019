import React from 'react';
import Square from './Square';


// the entireBoard 2D array is passed to Board through props
const Board = (props) => {

    if (props.entireBoard.length === 0) {
        addSquaresToBoard(props);
    }

    return (
        <div className="board">
            {props.entireBoard}
        </div>
    );
};

// Fills the board with 8 rows of Squares
function addSquaresToBoard(props){
    for (let i = 0; i < 8; i++){
        props.entireBoard.push( createRow(i) );
    }
}

// HELPER METHOD that creates a row of Squares
// key property was added because React was complaining that
// each member of a list is supposed to have a unique "key" property
function createRow(currentY){
    return(
        <div className="boardRow" key = {currentY}>
            {createSquares(currentY)}
        </div>
    );
}

// HELPER METHOD that creates 8 squares and adds them to a row
// key property was added because React was complaining that
// each member of a list is supposed to have a unique "key" property
function createSquares(currentY){
    let squareArray = [];
    for (let i = 0; i < 8; i++) {
        squareArray.push(<Square y = {currentY} x = {i} piece={"do"} key = {currentY.toString() + i.toString()}/>);
    }
    return squareArray;
}

export default Board;