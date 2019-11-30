import React from 'react';
import '../Style/Square.css';
import {Pieces} from './Board';
import {Players} from './Board';
//default pieces
import whiteRook from "../Assets/whiteRook.png";
import whiteKnight from "../Assets/whiteKnight.png";
import whiteBishop from "../Assets/whiteBishop.png";
import whiteKing from "../Assets/whiteKing.png";
import whiteQueen from "../Assets/whiteQueen.png";
import whitePawn from "../Assets/whitePawn.png";
import whitePawnFaded from "../Assets/whitePawnFaded.png";
import blackRook from "../Assets/blackRook.png";
import blackKnight from "../Assets/blackKnight.png";
import blackBishop from "../Assets/blackBishop.png";
import blackKing from "../Assets/blackKing.png";
import blackQueen from "../Assets/blackQueen.png";
import blackPawn from "../Assets/blackPawn.png";
//dog vs cat theme pieces
import whiteKnight1 from "../Assets/DogTheme/knightWhite.png";
import whiteQueen1 from "../Assets/DogTheme/queenWhite.gif";
import whiteKing1 from "../Assets/DogTheme/kingWhite.png";
import whiteRook1 from "../Assets/DogTheme/rookWhite.png";
import whitePawn1 from "../Assets/DogTheme/pawnWhite.png";
import whiteBishop1 from "../Assets/DogTheme/bishopWhite.png";
import blackKnight1 from "../Assets/DogTheme/knightBlack.png";
import blackRook1 from "../Assets/DogTheme/rookBlack.png";
import blackQueen1 from "../Assets/DogTheme/queenBlack.gif";
import blackKing1 from "../Assets/DogTheme/kingBlack.png";
import blackBishop1 from "../Assets/DogTheme/bishopBlack.png";
import blackPawn1 from "../Assets/DogTheme/pawnBlack.png";
//error image
import error from "../Assets/error.png";
import blackPawnFaded from "../Assets/blackPawnFaded.png";

// UNCOMMENT FOR DOG THEME
// import whiteRook from "../Assets/DogTheme/rookWhite.png";
// import whiteKnight from "../Assets/DogTheme/knightWhite.png";
// import whiteBishop from "../Assets/DogTheme/bishopBlack.png";
// import whiteKing from "../Assets/DogTheme/kingWhite.png";
// import whiteQueen from "../Assets/DogTheme/queenWhite.gif";
// import whitePawn from "../Assets/DogTheme/pawnWhite.png";
// import whitePawnFaded from "../Assets/whitePawnFaded.png";
// import blackRook from "../Assets/DogTheme/rookBlack.png";
// import blackKnight from "../Assets/DogTheme/knightBlack.png";
// import blackBishop from "../Assets/DogTheme/bishopBlack.png";
// import blackKing from "../Assets/DogTheme/kingBlack.png";
// import blackQueen from "../Assets/DogTheme/queenBlack.gif";
// import blackPawn from "../Assets/DogTheme/pawnBlack.png";
// import blackPawnFaded from "../Assets/blackPawnFaded.png";


/** Properties you can access through props
 *
 *  key             unique identifier for the Component
 *  y               Y-coordinate of this Square
 *  x               X-coordinate of this Square
 *  defaultColor    default color of this Square
 *  isHighlighted   is this Square highlighted
 *  isSelected      is this Square selected
 *  isCapturable    is this Square capturable via en-passant
 *  canCastle       is this Square a rook that can castle this move
 *  pieceType       the type of piece on this square
 *  ownedBy         the player who owns the piece on this square
 *  onClick:        FUNCTION passed from App that activates when Square is clicked
 **/
const Square = (props) => {

    // onClick() triggers the pieceClicked()
    // method located in App. The coordinates of the
    // piece that was clicked are sent through the callback
    return (
        <button
            className={"square"}
            style={{
                backgroundImage: 'url('+ determineImage(props) + ')',
                backgroundColor: determineBG(props)
            }}
            onClick={() => props.onClick(props.y, props.x)}
        >

        </button>
    );
};

// ADD THIS LINE INSIDE THE BUTTON FOR COORDINATES
//             {props.y + ',' + props.x}

// sets the background color of the Square based on its properties
function determineBG(props){
    if ( props.isSelected ) {
        return '#aae7ff';
    }
    if ( props.isHighlighted ){
        if ( props.defaultColor === '#d9a989' )
            return '#5da675';
        else
            return '#68b780';       // highlighting is slightly darker for dark squares
    }
    if ( props.canCastle ){         // highlights rooks in yellow that will be moved
        return '#fff18e';           // by the current castling move
    }
    // if ( props.isCapturable ){       // highlights pieces capturable by en-passant
    //     return '#c184a2';            // in red during move selection
    // }
    return props.defaultColor;
}

// theme enums
export const Themes = {
    TRADITIONAL: 0,
    DOGSandCATS: 1
};

// sets the piece image on the Square based on its properties
export function determineImage( props ){
    switch ( props.isTheme ) {
        case 0: { //traditional pieces
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:
                            return whiteRook;
                        case Pieces.PAWN:
                            return whitePawn;
                        case Pieces.KNIGHT:
                            return whiteKnight;     // white Pieces
                        case Pieces.BISHOP:
                            return whiteBishop;
                        case Pieces.QUEEN:
                            return whiteQueen;
                        case Pieces.KING:
                            return whiteKing;
                        case Pieces.EMPTY:
                            return null;
                        default:
                            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:
                            return blackRook;
                        case Pieces.PAWN:
                            return blackPawn;
                        case Pieces.KNIGHT:
                            return blackKnight;     // black Pieces
                        case Pieces.BISHOP:
                            return blackBishop;
                        case Pieces.QUEEN:
                            return blackQueen;
                        case Pieces.KING:
                            return blackKing;
                        case Pieces.EMPTY:
                            return null;
                        default:
                            return error;
                    }
                }
                case Players.NONE :
                default:
                    return null;            // empty spaces
            }
        }
        case 1: { //dogs Vs cats theme
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:
                            return whiteRook1;
                        case Pieces.PAWN:
                            return whitePawn1;
                        case Pieces.KNIGHT:
                            return whiteKnight1;     // white Pieces
                        case Pieces.BISHOP:
                            return whiteBishop1;
                        case Pieces.QUEEN:
                            return whiteQueen1;
                        case Pieces.KING:
                            return whiteKing1;
                        case Pieces.EMPTY:
                            return null;
                        default:
                            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:
                            return blackRook1;
                        case Pieces.PAWN:
                            return blackPawn1;
                        case Pieces.KNIGHT:
                            return blackKnight1;     // black Pieces
                        case Pieces.BISHOP:
                            return blackBishop1;
                        case Pieces.QUEEN:
                            return blackQueen1;
                        case Pieces.KING:
                            return blackKing1;
                        case Pieces.EMPTY:
                            return null;
                        default:
                            return error;
                    }
                }
                case Players.NONE :
                default:
                    return null;            // empty spaces
            }
        }
    }
}

export default Square;