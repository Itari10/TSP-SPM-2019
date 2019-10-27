import React from 'react';
import Square from './Square';
import App from './App';


//var entireBoard = Array(8).fill(Array(8).fill(<Square/>));

class Board extends React.Component{

    //entireBoard = <Square/>[8][8];

    constructor(props){
        super(props);
        this.entireBoard = props.entireBoard;
    }

    render(){
        return (
            <div className="board">
                {this.generateRow(0)}
                {this.generateRow(1)}
                {this.generateRow(2)}
                {this.generateRow(3)}
                {this.generateRow(4)}
                {this.generateRow(5)}
                {this.generateRow(6)}
                {this.generateRow(7)}
            </div>
        );
    }

    // const Board = (props) => {
//     //return createBoard();
//
//     return (
//         <div className="board">
//             {generateRow(props,0)}
//             {generateRow(props,1)}
//             {generateRow(props,2)}
//             {generateRow(props,3)}
//             {generateRow(props,4)}
//             {generateRow(5)}
//             {generateRow(6)}
//             {generateRow(7)}
//         </div>
//     );
// };

//stitches together the HTML elements that make up the board
    createBoard(){
        return(
            <div className="board">
                {() => {                                 // Nick if you can look at this...
                    for (let i = 0; i < 8; i++){         // I don't understand why it doesn't work
                        this.generateRow(i)                   // it compiles but doesn't show the board
                    }                                    // if you uncomment line 8   -Joe
                }}
            </div>
        );
    }


// Creates a row of board squares. Called once for each of the 8 rows on the board
    generateRow(currentY){
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
            this.entireBoard[curY][i] = <Square x = {i} y = {curY}/>;
        }
        return this.entireBoard[curY];
    }
}

export default Board;
//export {entireBoard};