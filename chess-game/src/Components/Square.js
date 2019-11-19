import React from 'react';
import '../Style/Square.css';
import {Pieces} from './Board';
import {Players} from './Board';
import whiteRook from "../Assets/whiteRook.png";
import whiteKnight from "../Assets/whiteKnight.png";
import whiteBishop from "../Assets/whiteBishop.png";
import whiteKing from "../Assets/whiteKing.png";
import whiteQueen from "../Assets/whiteQueen.png";
import whitePawn from "../Assets/whitePawn.png";
import blackRook from "../Assets/blackRook.png";
import blackKnight from "../Assets/blackKnight.png";
import blackBishop from "../Assets/blackBishop.png";
import blackKing from "../Assets/blackKing.png";
import blackQueen from "../Assets/blackQueen.png";
import blackPawn from "../Assets/blackPawn.png";
import error from "../Assets/error.png";


/** Properties you can access through props
 *
 *  key             unique identifier for the Component
 *  y               Y-coordinate of this Square
 *  x               X-coordinate of this Square
 *  defaultColor    default color of this Square
 *  isHighlighted   whether or not this Square is highlighted
 *  isSelected      whether or not this Square is selected
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
    else if ( props.isHighlighted ){
        if ( props.defaultColor === '#d9a989' )
            return '#5da675';
        else
            return '#68b780';      // slightly darker color for dark squares
    }
    else
        return props.defaultColor;
}

// sets the piece image on the Square based on its properties
export function determineImage( props ){
    switch ( props.ownedBy ){
        case Players.WHITE: {
            switch( props.pieceType ){
                case Pieces.ROOK:   return whiteRook;
                case Pieces.PAWN:   return whitePawn;
                case Pieces.KNIGHT: return whiteKnight;     // white Pieces
                case Pieces.BISHOP: return whiteBishop;
                case Pieces.QUEEN:  return whiteQueen;
                case Pieces.KING:   return whiteKing;
                case Pieces.EMPTY:  return null;
                default:            return error;
            }
        }
        case Players.BLACK: {
            switch( props.pieceType ){
                case Pieces.ROOK:   return blackRook;
                case Pieces.PAWN:   return blackPawn;
                case Pieces.KNIGHT: return blackKnight;     // black Pieces
                case Pieces.BISHOP: return blackBishop;
                case Pieces.QUEEN:  return blackQueen;
                case Pieces.KING:   return blackKing;
                case Pieces.EMPTY:  return null;
                default:            return error;
            }
        }
        case Players.NONE:
        default:                    return null;            // empty spaces
    }
}

export default Square;