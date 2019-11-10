import React from 'react';
import Square from './Square';

// class used as a container to hold piece info
class Piece{
    constructor(pieceType, ownedBy, isHighlighted, isSelected, defaultColor){
        this.pcType = pieceType;
        this.pcOwner = ownedBy;
        this.isHighlighted = isHighlighted;
        this.isSelected = isSelected;
        this.defaultColor = defaultColor;       // THIS VALUE SHOULD NEVER CHANGE
    }
}

// player enum
export const Players = {
    NONE: 0,
    WHITE: 1,
    BLACK: 2,
};

// piece enum
export const Pieces = {
    EMPTY: 0,
    ROOK: 1,
    KNIGHT: 2,
    BISHOP: 3,
    QUEEN: 4,
    KING: 5,
    PAWN: 6
};

const Board = (props) => {

    // renders the board based on the boardState passed from App
    return (
        <div className="board">
            {createBoardJSX(props.bState)};
        </div>
    );

    /** DATA-TO-COMPONENT CONVERSION
     * Converts the 2D-array of Piece objects into their JSX React-component
     * equivalent. This is then passed back up to app and is then rendered
     *
     *  key             unique identifier for the Component (so React stops complaining)
     *  y               Y-coordinate on the board AND inside the 8x8 board array
     *  x               Y-coordinate on the board AND inside the 8x8 board array
     *  defaultColor    the default color of this Square
     *  pieceType       the type of piece on this square
     *  ownedBy         the player who owns the piece on this square
     *  onClick:        FUNCTION passed from App that activates when Square is clicked
     */
    function create8squares(curY, boardState){
        let curRow = [];
        let curSquare = null;                           // current piece
        for ( let x = 0; x < 8; x++ ){
            curSquare = boardState[curY][x];            // makes code easier to read
            curRow.push(
                <Square
                    key =           {'Sq'+curY+'.'+x}
                    y =             {curY}
                    x =             {x}
                    defaultColor =  {curSquare.defaultColor}
                    isHighlighted = {curSquare.isHighlighted}
                    isSelected =    {curSquare.isSelected}
                    pieceType =     {curSquare.pcType}
                    ownedBy =       {curSquare.pcOwner}
                    onClick =       {props.pieceClicked}
                />
            );
        }
        return curRow;
    }

    // converts boardState into JSX
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
            <div className="boardRow" key={'bRow' + currentY}>
                {create8squares(currentY, boardState)}
            </div>
        );
    }
};


// Performs the initial first-time board creation
// when the game starts. Fills an [8][8] array with
// Piece objects containing starting-state of a chessboard
export function initializeBoard(){
    let defaultBoard = new Array(8);
    for ( let y = 0; y < 8; y++ ){
        defaultBoard[y] = new Array(8);     // creates an [8][8] of nulls
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x] = null;
        }
    }

    // white Pieces
    defaultBoard[0][0] = new Piece(Pieces.ROOK, Players.WHITE, false, false);
    defaultBoard[0][1] = new Piece(Pieces.KNIGHT, Players.WHITE, false, false);
    defaultBoard[0][2] = new Piece(Pieces.BISHOP, Players.WHITE, false, false);
    defaultBoard[0][3] = new Piece(Pieces.KING, Players.WHITE, false, false);
    defaultBoard[0][4] = new Piece(Pieces.QUEEN, Players.WHITE, false, false);
    defaultBoard[0][5] = new Piece(Pieces.BISHOP, Players.WHITE, false, false);
    defaultBoard[0][6] = new Piece(Pieces.KNIGHT, Players.WHITE, false, false);
    defaultBoard[0][7] = new Piece(Pieces.ROOK, Players.WHITE, false, false);

    // black Pieces
    defaultBoard[7][0] = new Piece(Pieces.ROOK, Players.BLACK, false, false);
    defaultBoard[7][1] = new Piece(Pieces.KNIGHT, Players.BLACK, false, false);
    defaultBoard[7][2] = new Piece(Pieces.BISHOP, Players.BLACK, false, false);
    defaultBoard[7][3] = new Piece(Pieces.KING, Players.BLACK, false, false);
    defaultBoard[7][4] = new Piece(Pieces.QUEEN, Players.BLACK, false, false);
    defaultBoard[7][5] = new Piece(Pieces.BISHOP, Players.BLACK, false, false);
    defaultBoard[7][6] = new Piece(Pieces.KNIGHT, Players.BLACK, false, false);
    defaultBoard[7][7] = new Piece(Pieces.ROOK, Players.BLACK, false, false);

    // pawns
    for ( let x = 0; x < 8; x++ ){
        defaultBoard[1][x] = new Piece(Pieces.PAWN, Players.WHITE, false, false);
        defaultBoard[6][x] = new Piece(Pieces.PAWN, Players.BLACK, false, false);
    }

    // blank squares
    for ( let y = 2; y < 6; y++ ){
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x] = new Piece(Pieces.EMPTY, Players.NONE, false, false);
        }
    }

    // sets default board square colors
    for ( let y = 0; y < 8; y++ ){
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x].defaultColor = ((x + y) % 2) === 0 ? '#ffddca' : '#d9a989';
        }
    }
    return defaultBoard;
}

export default Board;