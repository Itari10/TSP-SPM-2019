import React from 'react';
import '../Style/Square.css';
import {Pieces} from './Board';
import {Players} from './Board';
import error from "../Assets/error.png";

// STANDARD THEME
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
import blackPawnFaded from "../Assets/blackPawnFaded.png";

// DOG VS CAT THEME
import whiteRook1 from "../Assets/DogTheme/whiteRook1.png";
import whiteKnight1 from "../Assets/DogTheme/whiteKnight1.png";
import whiteBishop1 from "../Assets/DogTheme/whiteBishop1.png";
import whiteKing1 from "../Assets/DogTheme/whiteKing1.png";
import whiteQueen1 from "../Assets/DogTheme/whiteQueen1.gif";
import whitePawn1 from "../Assets/DogTheme/whitePawn1.png";
import whitePawnFaded1 from "../Assets/DogTheme/whitePawnFaded1.png";
import blackRook1 from "../Assets/DogTheme/blackRook1.png";
import blackKnight1 from "../Assets/DogTheme/blackKnight1.png";
import blackBishop1 from "../Assets/DogTheme/blackBishop1.png";
import blackKing1 from "../Assets/DogTheme/blackKing1.png";
import blackQueen1 from "../Assets/DogTheme/blackQueen1.gif";
import blackPawn1 from "../Assets/DogTheme/blackPawn1.png";
import blackPawnFaded1 from "../Assets/DogTheme/blackPawnFaded1.png";

// POKEMON THEME
import whiteRook2 from "../Assets/PokemonTheme/whiteRook2.png";
import whiteKnight2 from "../Assets/PokemonTheme/whiteKnight2.png";
import whiteBishop2 from "../Assets/PokemonTheme/whiteBishop2.png";
import whiteKing2 from "../Assets/PokemonTheme/whiteKing2.png";
import whiteQueen2 from "../Assets/PokemonTheme/whiteQueen2.png";
import whitePawn2 from "../Assets/PokemonTheme/whitePawn2.png";
import whitePawnFaded2 from "../Assets/PokemonTheme/whitePawnFaded2.png";
import blackRook2 from "../Assets/PokemonTheme/blackRook2.png";
import blackKnight2 from "../Assets/PokemonTheme/blackKnight2.png";
import blackBishop2 from "../Assets/PokemonTheme/blackBishop2.png";
import blackKing2 from "../Assets/PokemonTheme/blackKing2.png";
import blackQueen2 from "../Assets/PokemonTheme/blackQueen2.png";
import blackPawn2 from "../Assets/PokemonTheme/blackPawn2.png";
import blackPawnFaded2 from "../Assets/PokemonTheme/blackPawnFaded2.png";

//RWBY Theme
import whiteRook3 from "../Assets/RWBYTheme/whiteRook3.png";
import whiteKnight3 from "../Assets/RWBYTheme/whiteKnight3.png";
import whiteBishop3 from "../Assets/RWBYTheme/whiteBishop3.png";
import whiteKing3 from "../Assets/RWBYTheme/whiteKing3.png";
import whiteQueen3 from "../Assets/RWBYTheme/whiteQueen3.png";
import whitePawn3 from "../Assets/RWBYTheme/whitePawn3.png";
import whitePawnFaded3 from "../Assets/RWBYTheme/whitePawnFaded3.png";
import blackRook3 from "../Assets/RWBYTheme/blackRook3.png";
import blackKnight3 from "../Assets/RWBYTheme/blackKnight3.png";
import blackBishop3 from "../Assets/RWBYTheme/blackBishop3.png";
import blackKing3 from "../Assets/RWBYTheme/blackKing3.png";
import blackQueen3 from "../Assets/RWBYTheme/blackQueen3.png";
import blackPawn3 from "../Assets/RWBYTheme/blackPawn3.png";
import blackPawnFaded3 from "../Assets/RWBYTheme/blackPawnFaded3.png";

// themes enum
export const Themes = {
    TRADITIONAL: 0,
    DOGSandCATS: 1,
    POKEMON: 2,
    RWBY: 3
};

/** Properties you can access through props
 *
 *  key             unique identifier for the Component
 *  y               Y-coordinate of this Square
 *  x               X-coordinate of this Square
 *  defaultColor    default color of this Square
 *  isHighlighted   is this Square highlighted
 *  isSelected      is this Square selected
 *  isCapturable    is this Square capturable by en-passant
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
    // if ( props.canCastle ){         // highlights rooks in yellow that will be moved
    //     return '#fff18e';           // by the current castling move
    // }
    // if ( props.isCapturable ){       // highlights pieces capturable by en-passant
    //     return '#c184a2';            // in red during move selection
    // }
    return props.defaultColor;
}

// sets the piece image on the Square based on its properties
export function determineImage( props ){
    switch ( props.isTheme ) {

        // TRADITIONAL
        case Themes.TRADITIONAL: {
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return whiteRook;
                        case Pieces.PAWN:   return (props.isCapturable ? whitePawnFaded : whitePawn);
                        case Pieces.KNIGHT: return whiteKnight;
                        case Pieces.BISHOP: return whiteBishop;
                        case Pieces.QUEEN:  return whiteQueen;
                        case Pieces.KING:   return whiteKing;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return blackRook;
                        case Pieces.PAWN:   return (props.isCapturable ? blackPawnFaded : blackPawn);
                        case Pieces.KNIGHT: return blackKnight;
                        case Pieces.BISHOP: return blackBishop;
                        case Pieces.QUEEN:  return blackQueen;
                        case Pieces.KING:   return blackKing;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.NONE :
                    default:                return null;        // empty spaces
            }
        }

        // DOGS vs CATS
        case Themes.DOGSandCATS: {
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return whiteRook1;
                        case Pieces.PAWN:   return (props.isCapturable ? whitePawnFaded1 : whitePawn1);
                        case Pieces.KNIGHT: return whiteKnight1;
                        case Pieces.BISHOP: return whiteBishop1;
                        case Pieces.QUEEN:  return whiteQueen1;
                        case Pieces.KING:   return whiteKing1;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return blackRook1;
                        case Pieces.PAWN:   return (props.isCapturable ? blackPawnFaded1 : blackPawn1);
                        case Pieces.KNIGHT: return blackKnight1;
                        case Pieces.BISHOP: return blackBishop1;
                        case Pieces.QUEEN:  return blackQueen1;
                        case Pieces.KING:   return blackKing1;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.NONE :
                    default:                return null;        // empty spaces
            }
        }

        // POKEMON
        case Themes.POKEMON: {
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return whiteRook2;
                        case Pieces.PAWN:   return (props.isCapturable ? whitePawnFaded2 : whitePawn2);
                        case Pieces.KNIGHT: return whiteKnight2;
                        case Pieces.BISHOP: return whiteBishop2;
                        case Pieces.QUEEN:  return whiteQueen2;
                        case Pieces.KING:   return whiteKing2;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return blackRook2;
                        case Pieces.PAWN:   return (props.isCapturable ? blackPawnFaded2 : blackPawn2);
                        case Pieces.KNIGHT: return blackKnight2;
                        case Pieces.BISHOP: return blackBishop2;
                        case Pieces.QUEEN:  return blackQueen2;
                        case Pieces.KING:   return blackKing2;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.NONE :
                default:                return null;        // empty spaces
            }
        }

        // RWBY
        case Themes.RWBY: {
            switch (props.ownedBy) {
                case Players.WHITE: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return whiteRook3;
                        case Pieces.PAWN:   return (props.isCapturable ? whitePawnFaded3 : whitePawn3);
                        case Pieces.KNIGHT: return whiteKnight3;
                        case Pieces.BISHOP: return whiteBishop3;
                        case Pieces.QUEEN:  return whiteQueen3;
                        case Pieces.KING:   return whiteKing3;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.BLACK: {
                    switch (props.pieceType) {
                        case Pieces.ROOK:   return blackRook3;
                        case Pieces.PAWN:   return (props.isCapturable ? blackPawnFaded3 : blackPawn3);
                        case Pieces.KNIGHT: return blackKnight3;
                        case Pieces.BISHOP: return blackBishop3;
                        case Pieces.QUEEN:  return blackQueen3;
                        case Pieces.KING:   return blackKing3;
                        case Pieces.EMPTY:  return null;
                        default:            return error;
                    }
                }
                case Players.NONE :
                default:                return null;        // empty spaces
            }
        }
    }
}

export default Square;