import React from 'react';
import Square from './Square';

const entireBoard = [8][8];

// uses a loop to add 8 Squares to the main board array
// method is called once for every square in the row (8 total)
// returns the given ROW that we're working on
function addSquaresToRow(curY){
    for (let i = 0; i < 8; i++) {
        entireBoard[curY].push(<Square x = {i} y = {curY}/>);
    }
    return entireBoard[curY];
}

// HELPER METHOD that creates a row of tile squares
// method is called once for every row in the board (8 total)
function generateRow(currentY){
    return(
        <div className="row">
            {addSquaresToRow(currentY)}
        </div>
    );
}

// stitches together the HTML elements that make up the board
function createBoard(){
    var htmlElements = '<div className="board">';
    for (let i = 0; i < 8; i++){
        htmlElements += generateRow(i);
    }
    htmlElements += '</div>';
    return htmlElements;
}


const Board = (props) => {
    return createBoard();


    // return (
    //     <div className="board">
    //         <div className="row">
    //             {addSquaresToRow(0)}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow(1)}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //         <div className="row">
    //             {addSquaresToRow()}
    //         </div>
    //     </div>
    // );
};


export default Board;