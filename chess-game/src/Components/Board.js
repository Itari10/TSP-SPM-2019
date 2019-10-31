import React from 'react';
import Square from './Square';

const entireBoard = Array(8).fill(Array(8).fill(null));      // creates an 8x8 array of nulls

const Board = (props) => {

    addSquaresToBoard();

    return (
        <div className="board">
            {entireBoard}
        </div>
    );
};

// Fills the board with 8 rows of Squares
function addSquaresToBoard(){
    for (let i = 0; i < 8; i++){
        entireBoard.push( createRow(i) );
    }
}

// HELPER METHOD that creates a row of Squares
function createRow(currentY){
    return(
        <div className="row">
            {createSquares(currentY)}
        </div>
    );
}

// HELPER METHOD that creates 8 squares and adds them to a row
function createSquares(currentY){
    let squareArray = [];
    for (let i = 0; i < 8; i++) {
        squareArray.push(<Square y = {currentY} x = {i} piece={"do"} />);
    }
    return squareArray;
}

export default Board;
// module.exports = {addSquaresToBoard, createRow, createSquares, entireBoard};