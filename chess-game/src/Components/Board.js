import React from 'react';
import Square from './Square';
import rookWhite from "../Assets/rookWhite.png";
import knightWhite from "../Assets/knightWhite.png";
import bishopWhite from "../Assets/bishopWhite.png";
import kingWhite from "../Assets/kingWhite.png";
import queenWhite from "../Assets/queenWhite.png";
import pawnWhite from "../Assets/pawnWhite.png";
import rookBlack from "../Assets/rookBlack.png";
import knightBlack from "../Assets/knightBlack.png";
import bishopBlack from "../Assets/bishopBlack.png";
import kingBlack from "../Assets/kingBlack.png";
import queenBlack from "../Assets/queenBlack.png";
import pawnBlack from "../Assets/pawnBlack.png";
import error from "../Assets/error.png";


// class used as a container to hold piece info
class Piece{
    constructor(pieceType, ownedBy, isHighlighted, isSelected){
        this.isHighlighted = isHighlighted;
        this.isSelected = isSelected;
        this.pcType = pieceType;
        this.pcOwner = ownedBy;
    }
}

// player enum
export const players = {
    WHITE: 1,
    BLACK: 2,
    NONE: -1
};

// piece enum
export const pieces = {
    EMPTY: null,
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
     *  pieceType       the type of piece on this square
     *  ownedBy         the player who owns the piece on this square
     *  image           the image that will be rendered om this square
     *  onClick:        FUNCTION passed from App that activates when Square is clicked
     */
    function create8squares(curY, bState){
        let currentRow = [];
        let piece = null;                       // current piece
        for ( let x = 0; x < 8; x++ ){
            piece = bState[curY][x];            // to make code concise
            currentRow.push(
                <Square
                    key =           {curY + '.' + x}
                    y =             {curY}
                    x =             {x}
                    isHighlighted = {piece.isHighlighted}
                    isSelected =    {piece.isSelected}
                    pieceType =     {piece.pcType}
                    ownedBy =       {piece.pcOwner}
                    image =         {determineImage(piece.pcType, piece.pcOwner)}
                    onClick =       {props.pieceClicked}
                />
            );
        }
        return currentRow;
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
            <div className="boardRow" id={'br' + currentY} key={'key' + currentY}>
                {create8squares(currentY, boardState)}
            </div>
        );
    }
};

// Determines the image that will be displayed on a square based on
// the square's pcType and ownedBy properties
function determineImage(pieceType, ownedBy){
    switch ( ownedBy ){
        case players.WHITE: {
            switch( pieceType ){
                case pieces.ROOK:   return rookWhite;
                case pieces.PAWN:   return pawnWhite;
                case pieces.KNIGHT: return knightWhite;            // white pieces
                case pieces.BISHOP: return bishopWhite;
                case pieces.QUEEN:  return queenWhite;
                case pieces.KING:   return kingWhite;
                default:            return error;
            }
        }
        case players.BLACK: {
            switch( pieceType ){
                case pieces.ROOK:   return rookBlack;
                case pieces.PAWN:   return pawnBlack;
                case pieces.KNIGHT: return knightBlack;            // black pieces
                case pieces.BISHOP: return bishopBlack;
                case pieces.QUEEN:  return queenBlack;
                case pieces.KING:   return kingBlack;
                default:            return error;
            }
        }
        case players.NONE:
        default:                    return null;            // empty spaces
    }
}

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

    // white pieces
    defaultBoard[0][0] = new Piece(pieces.ROOK, players.WHITE, false, false);
    defaultBoard[0][1] = new Piece(pieces.KNIGHT, players.WHITE, false, false);
    defaultBoard[0][2] = new Piece(pieces.BISHOP, players.WHITE, false, false);
    defaultBoard[0][3] = new Piece(pieces.KING, players.WHITE, false, false);
    defaultBoard[0][4] = new Piece(pieces.QUEEN, players.WHITE, false, false);
    defaultBoard[0][5] = new Piece(pieces.BISHOP, players.WHITE, false, false);
    defaultBoard[0][6] = new Piece(pieces.KNIGHT, players.WHITE, false, false);
    defaultBoard[0][7] = new Piece(pieces.ROOK, players.WHITE, false, false);

    // black pieces
    defaultBoard[7][0] = new Piece(pieces.ROOK, players.BLACK, false, false);
    defaultBoard[7][1] = new Piece(pieces.KNIGHT, players.BLACK, false, false);
    defaultBoard[7][2] = new Piece(pieces.BISHOP, players.BLACK, false, false);
    defaultBoard[7][3] = new Piece(pieces.KING, players.BLACK, false, false);
    defaultBoard[7][4] = new Piece(pieces.QUEEN, players.BLACK, false, false);
    defaultBoard[7][5] = new Piece(pieces.BISHOP, players.BLACK, false, false);
    defaultBoard[7][6] = new Piece(pieces.KNIGHT, players.BLACK, false, false);
    defaultBoard[7][7] = new Piece(pieces.ROOK, players.BLACK, false, false);

    // pawns
    for ( let x = 0; x < 8; x++ ){
        defaultBoard[1][x] = new Piece(pieces.PAWN, players.WHITE, false, false);
        defaultBoard[6][x] = new Piece(pieces.PAWN, players.BLACK, false, false);
    }

    // blank pieces
    for ( let y = 2; y < 6; y++ ){
        for ( let x = 0; x < 8; x++ ){
            defaultBoard[y][x] = new Piece(pieces.EMPTY, players.NONE, false, false);
        }
    }

    return defaultBoard;
}

export default Board;