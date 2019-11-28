import React from 'react';
import Square from './Square';

// class used as a container to hold piece info
class Piece{
    constructor(pieceType, ownedBy, isHighlighted, isSelected){
        this.pcType = pieceType;
        this.pcOwner = ownedBy;
        this.isHighlighted = isHighlighted;
        this.isSelected = isSelected;
        this.defaultColor = null;
        this.canEpLeft = false;             //
        this.canEpRight = false;            // en-passant variables
        this.isCapturable = false           //
    }
}

// class used as a container to hold piece coordinates
class Coordinate{
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

// structure containing board-state variables
// hidden in the boardState[7][8] cell
export class BoardData {
    constructor() {
        this.whiteCheck = false;
        this.blackCheck = false;
        this.whiteCheckMate = false;
        this.blackCheckMate = false;
        this.whitePieces = [];
        this.blackPieces = [];
        this.bKingY = 0;
        this.bKingX = 3;
        this.wKingY = 7;
        this.wKingX = 3;
    }
}

// player enum
export const Players = {
    NONE: 0,
    WHITE: 1,
    BLACK: 2
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
            {createBoardJSX()};
        </div>
    );

    // converts boardState into JSX
    function createBoardJSX(){
        let boardJSX = [];
        for ( let y = 0; y < 8; y++ ){
            boardJSX.push( createRow(y) );
        }
        return boardJSX;
    }

    // creates a row of squares
    function createRow(currentY){
        return(
            <div className="boardRow" key={'bRow' + currentY}>
                {create8squares(currentY)}
            </div>
        );
    }

    /** DATA-TO-COMPONENT CONVERSION
     * Converts the 2D-array of Piece objects into their JSX React-component
     * equivalent. This is then passed back up to app to be rendered
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
     */
    function create8squares(currentY){
        let curRow = [];
        let curSquare = null;
        for ( let x = 0; x < 8; x++ ){
            curSquare = props.bState[currentY][x];      // makes code easier to read
            curRow.push(
                <Square
                    key =           {'Sq'+currentY+'.'+x}
                    y =             {currentY}
                    x =             {x}
                    defaultColor =  {curSquare.defaultColor}
                    isHighlighted = {curSquare.isHighlighted}
                    isSelected =    {curSquare.isSelected}
                    isCapturable =  {curSquare.isCapturable}
                    pieceType =     {curSquare.pcType}
                    ownedBy =       {curSquare.pcOwner}
                    onClick =       {props.pieceClicked}
                />
            );
        }
        return curRow;
    }
};


// Performs the initial first-time board creation
// when the game starts. Fills an [8][8] array with
// Piece objects containing starting-state of a chessboard
export function initializeBoard(){
    let defaultBoard = new Array(8);
    for ( let y = 0; y < 8; y++ ){
        if ( y === 7 ){
            defaultBoard[y] = new Array(9);
            for ( let x = 0; x < 9; x++ ){
                defaultBoard[y][x] = null;
            }
        }
        else{
            defaultBoard[y] = new Array(8);     // creates an [8][8] of nulls
            for ( let x = 0; x < 8; x++ ){
                defaultBoard[y][x] = null;
            }
        }
    }

    // black Pieces
    defaultBoard[0][0] = new Piece(Pieces.ROOK, Players.BLACK, false, false);
    defaultBoard[0][1] = new Piece(Pieces.KNIGHT, Players.BLACK, false, false);
    defaultBoard[0][2] = new Piece(Pieces.BISHOP, Players.BLACK, false, false);
    defaultBoard[0][3] = new Piece(Pieces.KING, Players.BLACK, false, false);
    defaultBoard[0][4] = new Piece(Pieces.QUEEN, Players.BLACK, false, false);
    defaultBoard[0][5] = new Piece(Pieces.BISHOP, Players.BLACK, false, false);
    defaultBoard[0][6] = new Piece(Pieces.KNIGHT, Players.BLACK, false, false);
    defaultBoard[0][7] = new Piece(Pieces.ROOK, Players.BLACK, false, false);

    // white Pieces
    defaultBoard[7][0] = new Piece(Pieces.ROOK, Players.WHITE, false, false);
    defaultBoard[7][1] = new Piece(Pieces.KNIGHT, Players.WHITE, false, false);
    defaultBoard[7][2] = new Piece(Pieces.BISHOP, Players.WHITE, false, false);
    defaultBoard[7][3] = new Piece(Pieces.KING, Players.WHITE, false, false);
    defaultBoard[7][4] = new Piece(Pieces.QUEEN, Players.WHITE, false, false);
    defaultBoard[7][5] = new Piece(Pieces.BISHOP, Players.WHITE, false, false);
    defaultBoard[7][6] = new Piece(Pieces.KNIGHT, Players.WHITE, false, false);
    defaultBoard[7][7] = new Piece(Pieces.ROOK, Players.WHITE, false, false);

    // pawns
    for ( let x = 0; x < 8; x++ ){
        defaultBoard[1][x] = new Piece(Pieces.PAWN, Players.BLACK, false, false);
        defaultBoard[6][x] = new Piece(Pieces.PAWN, Players.WHITE, false, false);
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
    defaultBoard[7][8] = initializeBoardData();         // ADDS HIDDEN BOARD-DATA STORAGE
    return defaultBoard;
}

// creates the initial list of black piece locations
function createBlackPieceList(){
    let blackPieceList = [];
    for ( let y = 0; y < 2; y++ ) {
        for (let x = 0; x < 8; x++) {
            blackPieceList.push( new Coordinate(y, x) );
        }
    }
    return blackPieceList;
}

// creates the initial list of white piece locations
function createWhitePieceList(){
    let whitePieceList = [];
    for ( let y = 7; y > 5; y-- ) {
        for (let x = 0; x < 8; x++) {
            whitePieceList.push( new Coordinate(y, x) );
        }
    }
    return whitePieceList;
}

function initializeBoardData(){
    let bData = new BoardData();                        // initializes board data storage
    bData.whitePieces = createWhitePieceList();
    bData.blackPieces = createBlackPieceList();         // creates initial piece lists
    return bData;
}

export default Board;