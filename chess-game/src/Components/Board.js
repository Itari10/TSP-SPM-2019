import React from 'react';
import Square from './Square';
import rookWhite from "../Assets/rookWhite.png";
import tree from "../Assets/tree.jpg";
import bishopWhite from "../Assets/bishopWhite.png";
import dogtest2 from "../Assets/dogtest2.png";
import test from "../Assets/test.png";
import rookBlack from "../Assets/rookBlack.png";
import bishopBlack from "../Assets/bishopBlack.png";

// class used as a container to hold piece info
class Piece{
    constructor(pieceImage, isHighlighted, isSelected){
        this.isHighlighted = isHighlighted;
        this.isSelected = isSelected;
        this.pieceID = pieceImage;
    }
}

const Board = (props) => {

    /** CONVERTS THE BOARD-STATE INTO JSX
     *  which is then rendered by App
     *
     *  y:        current y index on the board AND inside the 8x8 board array
     *  x:        current x index on the board AND inside the 8x8 board array
     *  piece:    the image representing the piece that's on the board
     *  key:      unique identifier so that React stops complaining
     *  onClick:  FUNCTION passed from App that activates when Square is clicked
     */
    function createBoardJSX( boardState ){
        let boardJSX = [];
        for ( let y = 0; y < 8; y++ ){
            boardJSX.push(createRow(y, boardState));
        }
        return boardJSX;
    }

    // creates a row of squares
    function createRow(currentY, boardState){
        return(
            <div className="boardRow" id={'br' + currentY} key={'key' + currentY}>
                {create8squares(currentY, boardState)}
            </div>
        );
    }

    // adds 8 squares to board
    function create8squares(curY, boardState){
        let currentRow = [];
        for ( let x = 0; x < 8; x++ ){
            currentRow.push(
                <Square
                    y =             {curY}
                    x =             {x}
                    isHighlighted = {boardState[curY][x].isHighlighted}
                    isSelected =    {boardState[curY][x].isSelected}
                    piece =         {determineImage(boardState[curY][x].pieceID)}
                    key =           {curY + ',' + x}
                    onClick =       {props.pieceClicked}
                />
            );
        }
        return currentRow;
    }

    // renders the board based on the boardState passed from App
    return (
        <div className="board">
            {createBoardJSX(props.bState)};
        </div>
    );
};

// maps piece ID's onto their respective image filenames
function determineImage(pieceID){
    switch (pieceID) {
        case "WR":  return rookWhite;       // white pieces
        case "WK":  return tree;
        case "WB":  return bishopWhite;
        case "WQ":  return dogtest2;
        case "WKi": return test;
        case "WP":  return tree;

        case "BR":  return rookBlack;       // black pieces
        case "BK":  return tree;
        case "BB":  return bishopBlack;
        case "BQ":  return dogtest2;
        case "BKi": return test;
        case "BP":  return tree;

        default:    return null;            // empty spaces
    }
}

// FIRST TIME BOARD SETUP
export function initializeBoard(){
    let defaultBoard = new Array(8);
    for ( let y = 0; y < 8; y++ ){
        defaultBoard[y] = new Array(8);
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x] = null;
        }
    }

    // white pieces
    defaultBoard[0][0] = new Piece("BR", false, false);
    defaultBoard[0][1] = new Piece("BK", false, false);
    defaultBoard[0][2] = new Piece("BB", false, false);
    defaultBoard[0][3] = new Piece("BKi", false, false);
    defaultBoard[0][4] = new Piece("BQ", false, false);
    defaultBoard[0][5] = new Piece("BB", false, false);
    defaultBoard[0][6] = new Piece("BK", false, false);
    defaultBoard[0][7] = new Piece("BR", false, false);

    // black pieces
    defaultBoard[7][0] = new Piece("BR", false, false);
    defaultBoard[7][1] = new Piece("BK", false, false);
    defaultBoard[7][2] = new Piece("BB", false, false);
    defaultBoard[7][3] = new Piece("BKi", false, false);
    defaultBoard[7][4] = new Piece("BQ", false, false);
    defaultBoard[7][5] = new Piece("BB", false, false);
    defaultBoard[7][6] = new Piece("BK", false, false);
    defaultBoard[7][7] = new Piece("BR", false, false);

    // pawns
    for ( let x = 0; x < 8; x++ ){
        defaultBoard[1][x] = new Piece("WP", false, false);
        defaultBoard[6][x] = new Piece("BP", false, false);
    }

    // blank pieces
    for ( let y = 2; y < 6; y++ ){
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x] = new Piece(null, false, false);
        }
    }

    return defaultBoard;
}

export default Board;