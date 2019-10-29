import React from 'react';
import Square from './Square';

class Board extends React.Component{

    // creates the Board, including the 2D-array data structure
    constructor(props) {
        super(props);
        
        this.entireBoard = Array(8).fill(Array(8).fill(null));      // creates an 8x8 array of nulls
        this.addSquaresToBoard();
    }
    
    // renders the board
    render(){
        return (
            <div className="board">
                {this.entireBoard}
            </div>
        );
    }

    // Fills the board with 8 rows of Squares
    addSquaresToBoard(){
        for (let i = 0; i < 8; i++){
            this.entireBoard.push( this.createRow(i) );
        }
    }

    // HELPER METHOD that creates a row of Squares
    createRow(currentY){
        return(
            <div className="row">
                {this.createSquares(currentY)}
            </div>
        );
    }

    // HELPER METHOD that creates 8 squares and adds them to a row
    createSquares(currentY){
        let squareArray = [];
        for (let i = 0; i < 8; i++) {
            squareArray.push(<Square y = {currentY} x = {i} />);
        }
        return squareArray;
    }
}

export default Board;