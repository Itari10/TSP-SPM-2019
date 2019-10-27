import React from 'react';
import Square from './Square';


var entireBoard = Array(8).fill(Array(8).fill(<Square/>));

const Board = (props) => {
    //return createBoard();

    return (
        <div className="board">
            {generateRow(0)}
            {generateRow(1)}
            {generateRow(2)}
            {generateRow(3)}
            {generateRow(4)}
            {generateRow(5)}
            {generateRow(6)}
            {generateRow(7)}
        </div>
    );
};

//stitches together the HTML elements that make up the board
function createBoard(){
    return(
        <div className="board">
            {() => {                                 // Nick if you can look at this...
                for (let i = 0; i < 8; i++){         // I don't understand why it doesn't work
                    generateRow(i)                   // it compiles but doesn't show the board
                }                                    // if you uncomment line 8   -Joe
            }}
        </div>
    );
}


// Creates a row of board squares. Called once for each of the 8 rows on the board
function generateRow(currentY){
    return(
        <div className="row">
            {addSquaresToRow(currentY)}
        </div>
    );
}

// HELPER METHOD that adds squares to the primary board data structure
// then returns the given row so it can be rendered.
function addSquaresToRow(curY){
    for (let i = 0; i < 8; i++) {
        entireBoard[curY][i] = <Square x = {i} y = {curY}/>;
    }
    return entireBoard[curY];
}

export default Board;
export {entireBoard};