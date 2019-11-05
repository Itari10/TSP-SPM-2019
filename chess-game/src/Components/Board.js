import React from 'react';
import Square from './Square';


// the entireBoard 2D array is passed to Board through props
const Board = (props) => {
    
    // Fills the board with 8 rows of Squares
    function addSquaresToBoard(){
        for (let i = 0; i < 8; i++){
            props.entireBoard.push( createRow(i) );
        }
    }
    if (props.entireBoard.length === 0) {
        addSquaresToBoard(props);
    }

    // HELPER METHOD that creates a row of Squares
    // div id is used during testing to look up each row.
    function createRow(currentY){
        return(
            <div className="boardRow" id={'br' + currentY} key={'key' + currentY}>
                {createSquares(currentY)}
            </div>
        );
    }
    
    /** PRIMARY SQUARE CREATION METHOD - Creates 8 Square components for each row.
     *
     *  Square properties:
     *  y:      current y index on the board AND inside the 8x8 board array
     *  x:      current x index on the board AND inside the 8x8 board array
     *  id:     unique identifier that can be searched for using the html div "id" syntax
     *  key:    unique identifier so that React stops complaining
     */
    function createSquares(currentY){
        let squareArray = [];
        for (let i = 0; i < 8; i++) {
            squareArray.push(
                <Square
                    y =     {currentY}
                    x =     {i}
                    piece = {props.boardMap[0][i]}
                    key =   {currentY + ',' + i}
                />
            );
        }
        return squareArray;
    }

    return (
        <div className="board">
            {props.entireBoard}
        </div>
    );
};



export default Board;