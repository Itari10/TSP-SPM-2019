import React from 'react';
import Square from './Square';

let entireBoard = [];

const Board = (props) => {

    if (entireBoard.length === 0) {
        addSquaresToBoard();
    }

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