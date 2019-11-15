import React from 'react';
import '../Style/Square.css';
import {Pieces} from './Board';
import {Players} from './Board';
import rookWhite from "../Assets/rookWhite.png";
import knightWhite from "../Assets/knightWhite.png";
import bishopWhite from "../Assets/bishopWhite.png";
import kingWhite from "../Assets/kingWhite.png";
import queenWhite from "../Assets/queenWhite.gif";
import pawnWhite from "../Assets/pawnWhite.png";
import rookBlack from "../Assets/rookBlack.png";
import knightBlack from "../Assets/knightBlack.png";
import bishopBlack from "../Assets/bishopBlack.png";
import kingBlack from "../Assets/kingBlack.png";
import queenBlack from "../Assets/queenBlack.gif";
import pawnBlack from "../Assets/pawnBlack.png";
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
        />
    );
};

// sets the background color of the Square based on its properties
function determineBG(props){
    if ( props.isSelected ) {
        return '#aae7ff';
    }
    else if ( props.isHighlighted  ){
        if ( props.defaultColor === '#d9a989' )
            return '#5da675';
        else
            return '#68b780';      // slightly darker color for dark squares
    }
    else
        return props.defaultColor;
}

// sets the piece image on the Square based on its properties
function determineImage( props ){
    switch ( props.ownedBy ){
        case Players.WHITE: {
            switch( props.pieceType ){
                case Pieces.ROOK:   return rookWhite;
                case Pieces.PAWN:   return pawnWhite;
                case Pieces.KNIGHT: return knightWhite;     // white Pieces
                case Pieces.BISHOP: return bishopWhite;
                case Pieces.QUEEN:  return queenWhite;
                case Pieces.KING:   return kingWhite;
                case Pieces.EMPTY:  return null;
                default:            return error;
            }
        }
        case Players.BLACK: {
            switch( props.pieceType ){
                case Pieces.ROOK:   return rookBlack;
                case Pieces.PAWN:   return pawnBlack;
                case Pieces.KNIGHT: return knightBlack;     // black Pieces
                case Pieces.BISHOP: return bishopBlack;
                case Pieces.QUEEN:  return queenBlack;
                case Pieces.KING:   return kingBlack;
                case Pieces.EMPTY:  return null;
                default:            return error;
            }
        }
        case Players.NONE:
        default:                    return null;            // empty spaces
    }
}

export default Square;