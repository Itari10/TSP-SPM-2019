import React from 'react';
import Square from './Square';

export const entireBoard = Array(8).fill(Array(8).fill(null));      // creates an 8x8 array of nulls

const Board = (props) => {

    addSquaresToBoard();

    return (
        <div className="board">
            {entireBoard}
        </div>
    );
};

// Fills the board with 8 rows of Squares
export function addSquaresToBoard(){
    for (let i = 0; i < 8; i++){
        entireBoard.push( createRow(i) );
    }
}

// HELPER METHOD that creates a row of Squares
export function createRow(currentY){
    return(
        <div className="row">
            {createSquares(currentY)}
        </div>
    );
}

// HELPER METHOD that creates 8 squares and adds them to a row
export function createSquares(currentY){
    let squareArray = [];
    for (let i = 0; i < 8; i++) {
        squareArray.push(<Square y = {currentY} x = {i} piece="dogtest2.png" />);
    }
    return squareArray;
}

export default Board;