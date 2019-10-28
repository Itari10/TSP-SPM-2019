import React from 'react';
import Square from './Square';

class Board extends React.Component{

    // creates the Board, including the 2D-array data structure
    constructor(props) {
        super(props);
        this.entireBoard = Array(8).fill(Array(8).fill(null));
    }

    // renders the board
    render(){
        return (
            <div className="board">
                {this.generateAllRows()}
            </div>
        );
    }

    // HELPER METHOD that generates all 8 rows of the board
    generateAllRows(){
        let rowArray = [];
        for ( let i = 0; i < 8; i++){
            rowArray.push(this.createRow(i));
        }
        return rowArray;
    }

    // HELPER METHOD that creates a row of board squares
    // this is called once for each of the 8 rows on the board
    createRow(currentY){
        return(
            <div className="row">
                {this.addSquaresToRow(currentY)}
            </div>
        );
    }

    // HELPER METHOD that adds squares to the primary board data structure
    // then returns the given row so it can be rendered.
    addSquaresToRow(curY){
        for (let i = 0; i < 8; i++) {

            // assigns each square its location-aware x / y properties
            // based on their location inside the primary array
            this.entireBoard[curY][i] = <Square x = {i} y = {curY}/>;
        }
        return this.entireBoard[curY];
    }
}

export default Board;