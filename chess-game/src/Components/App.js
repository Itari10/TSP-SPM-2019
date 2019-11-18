import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board, {initializeBoard} from './Board';
import {Pieces} from './Board';
import {Players} from './Board';
import EndGameScreen from './EndGameScreen';

// tuple for holding potential board moves.
class Move{
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

// directions enum
const Directions = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    DOWN_RIGHT: 4,
    DOWN_LEFT: 5,
    UP_RIGHT: 6,
    UP_LEFT: 7,
};

const App = (props) => {


    // REMEMBER: These states CANNOT be changed without using the corresponding SET methods.
    // Attempting to set them manually will NOT result in errors, but WILL cause unintended buggy behavior
    const [boardState, setBoardState] =         React.useState( initializeBoard() );
    const [currentPlayer, setCurrentPlayer] =   React.useState( Players.WHITE );
    const [updateBoard, setUpdateBoard] =       React.useState( true );             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState( [-1,-1] );          // [-1,-1] means "NOTHING SELECTED"
    const [highlightedSquares, setHighlights] = React.useState( [] );               // keeps track of currently highlighted squares
    const [gameOver, setGameOver] =             React.useState( false );

    // swaps the player turn
    const swapTurn = () => {
        if (currentPlayer === Players.WHITE )
            setCurrentPlayer( Players.BLACK );
        else
            setCurrentPlayer( Players.WHITE );
    };

    // activates game-over functionality
    const endGame = () => {
        setGameOver(true);
    };


    const squareClicked = (y, x) => {

        // PRIMARY STATE VARIABLES
        let boardMap = boardState;                      // array that contains the current board state
        let boardData = boardMap[7][8];                 // holds key information for check / checkmate calculations


        // If you've click the square that's already selected...
        // deselect the square and unhighlight any highlighted squares
        if ( y === selectedSquare[0] && x === selectedSquare[1] ) {
            setSelectedSquare([-1,-1]);
            boardMap[y][x].isSelected = false;

            // de-highlights all highlighted squares that were
            // associated with the selected square
            deHighlightAllSquares();
        }

        // if you click on YOUR OWN piece...
        else if (boardMap[y][x].pcOwner === currentPlayer ) {

            // and nothing is selected...
            // then select that piece
            if ( selectedSquare[0] === -1 ) {
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // or if you already have a piece selected...
            // de-select it and select the new piece
            else{
                deHighlightAllSquares();
                boardMap[selectedSquare[0]][selectedSquare[1]].isSelected = false;
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // now highlight all possible moves for that selected piece
            switch ( boardMap[y][x].pcType ){
                case Pieces.ROOK: showRookMoves( y, x, true ); break;
                case Pieces.KNIGHT: showKnightMoves( y, x, true ); break;
                case Pieces.BISHOP: showBishopMoves( y, x, true ); break;
                case Pieces.QUEEN: showQueenMoves( y, x, true ); break;
                case Pieces.KING: showKingMoves( y, x, true ); break;
                case Pieces.PAWN: showPawnMoves( y, x, true ); break;
                default: console.log("ERROR: DEFAULT CASE REACHED IN squareClicked() movement highlighting");
            }
        }

        // Here a square is ALREADY SELECTED and you've clicked on one of the HIGHLIGHTED SQUARES
        // This is a successful move so the turn is swapped to the next player upon completion
        else if ( selectedSquare[0] !== -1 && boardMap[y][x].isHighlighted === true ){

            updatePieceLists();                                                    // updates each player's piece list

            // adds the piece to the dungeon
            if (boardMap[y][x].pcType !== Pieces.EMPTY)
                addToDungeon(y, x);

            boardMap[y][x].pcType = boardMap[selectedSquare[0]][selectedSquare[1]].pcType;        // move piece from selected
            boardMap[y][x].pcOwner = boardMap[selectedSquare[0]][selectedSquare[1]].pcOwner;      // square to clicked square

            boardMap[selectedSquare[0]][selectedSquare[1]].pcType = Pieces.EMPTY;
            boardMap[selectedSquare[0]][selectedSquare[1]].pcOwner = Players.NONE;          // clear the selected square
            boardMap[selectedSquare[0]][selectedSquare[1]].isSelected = false;
            setSelectedSquare( [-1,-1] );

            if ( boardMap[y][x].pcType === Pieces.KING ){
                if (currentPlayer === Players.WHITE) {              // updates player king locations
                    boardData.wKingY = y;
                    boardData.wKingX = x;
                }
                else {
                    boardData.bKingY = y;
                    boardData.bKingX = x;
                }
            }

            // transforms pawns into queens if they reach the other side of the board
            if ((y === 0 || y === 7) && boardMap[y][x].pcType === Pieces.PAWN ){
                boardMap[y][x].pcType = Pieces.QUEEN;
            }

            // determines CHECK and CHECKMATE status
            boardData.whiteCheck = ! squareIsSafe( boardData.wKingY, boardData.wKingX );
            boardData.blackCheck = ! squareIsSafe( boardData.bKingY, boardData.bKingX );

            // determines CHECKMATE status
            if ( boardData.whiteCheck )
                boardData.whiteCheckMate = determineWhiteCheckmate();
            if ( boardData.blackCheck )
                boardData.blackCheckMate = determineBlackCheckmate();

            // GAME OVER
            if ( boardData.whiteCheckMate )
                //setGameOver(true);
            if ( boardData.whiteCheckMate )
                //setGameOver(true);

            boardMap[7][8] = boardData;                 // copies boardData into extra boardState slot
            setUpdateBoard( ! updateBoard );            // updates the board so highlighting is correctly rendered
            deHighlightAllSquares();
            swapTurn();
        }
        setBoardState( boardMap );                      // updates the board state
        setUpdateBoard( ! updateBoard );                 // triggers a re-render
        // END OF MAIN CLICK FUNCTION




        // ******************************************************************************************
        // ************************************ HELPER FUNCTIONS ************************************
        // ******************************************************************************************


        //adds the given piece to the dungeon
        function addToDungeon (y, x) {
            let node = document.createElement("img");
            node.setAttribute("src", Pieces.KNIGHT);
            let dungeon = "";
            if (currentPlayer === Players.BLACK)
                dungeon = document.getElementById("2");
            else
                dungeon = document.getElementById("1");
            dungeon.appendChild(node);
        }


        // de-highlights all squares in the highlight list
        function deHighlightAllSquares(){
            let litSquare = null;
            for ( let i = 0; i < highlightedSquares.length; i++ ){
                litSquare = highlightedSquares[i];
                boardMap[ litSquare.y ][ litSquare.x ].isHighlighted = false;
            }
            setHighlights( [] );
        }

        // Iterates through a list of moves that a piece can make and
        // highlights them on the board. Updates the state to match
        function highlightGoodMoves( goodMoves ){
            for ( let i = 0; i < goodMoves.length; i++ ){
                boardMap[ goodMoves[i].y ][ goodMoves[i].x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // determines if the currently player is in check
        function playerIsInCheck( player ){
            return ((player === Players.WHITE && boardData.whiteCheck) ||
                (player === Players.BLACK && boardData.blackCheck));
        }

        // determines if the current player's king is safe
        function playerKingIsSafe( player ){
            if ( player === Players.WHITE )
                return squareIsSafe( boardData.wKingY, boardData.wKingX );
            else
                return squareIsSafe( boardData.bKingY, boardData.bKingX );
        }


        // Searches in a given direction for acceptable moves for a given piece
        // Direction is determined by parameters and loop constraints are set up accordingly
        // Adds moves to the goodMoves array based on safe moves that were found in the given direction
        function addDirectionalMoves(y, x, mainSquareOwner, goodMoves, direction){

            let yDir = null;            // amount to increment y by when searching
            let xDir = null;            // amount to increment x by when searching
            let yLimit = null;          // limit placed on y variable in loops
            let xLimit = null;          // limit placed on x variable in loops
            let kingIsSafe = false;     // is the current player's King being put in check by the move being tested?
            let squareType = null;      // current piece type of the square being considered
            let squareOwner = null;     // current owner of the square being considered

            switch (direction) {
                case Directions.DOWN:       yDir = 1;   yLimit = 8;    break;
                case Directions.UP:         yDir = -1;  yLimit = -1;   break;       // sets up logic variables based on
                case Directions.LEFT:       xDir = -1;  xLimit = -1;   break;       // direction being searched
                case Directions.RIGHT:      xDir = 1;   xLimit = 8;    break;
                case Directions.DOWN_RIGHT: yDir = 1;   xDir = 1;   yLimit = 8;   xLimit = 8;   break;
                case Directions.DOWN_LEFT:  yDir = 1;   xDir = -1;  yLimit = 8;   xLimit = -1;  break;
                case Directions.UP_RIGHT:   yDir = -1;  xDir = 1;   yLimit = -1;  xLimit = 8;   break;
                case Directions.UP_LEFT:    yDir = -1;  xDir = -1;  yLimit = -1;  xLimit = -1;  break;
                default: return;
            }

            // UP and DOWN
            if ( direction === Directions.UP || direction === Directions.DOWN ){

                // add moves in a the given direction until forced to stop
                for (let curY = y + yDir; (curY !== y + (8 * yDir)) && (curY !== yLimit); curY += yDir) {
                    squareType = boardMap[curY][x].pcType;
                    squareOwner = boardMap[curY][x].pcOwner;

                    if (boardMap[curY][x].pcOwner === mainSquareOwner)      // discard if you run into your own piece
                        break;

                    else {                                                  // otherwise...
                        boardMap[curY][x].pcType = Pieces.PAWN;
                        boardMap[curY][x].pcOwner = mainSquareOwner;        // temporarily make the move

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );       // make sure your king is still safe

                        boardMap[curY][x].pcType = squareType;
                        boardMap[curY][x].pcOwner = squareOwner;

                        if ( kingIsSafe ) {                                 // King is SAFE, add the move
                            goodMoves.push(new Move(curY, x));
                        }                                                   // King is NOT SAFE if you make this move.
                        else {                                              // if you're NOT in check, this move will put us
                            if ( ! playerIsInCheck( mainSquareOwner ) )     // IN check, so we stop looking for new move
                                break;
                        }                                           // however if you ARE in check, keep looking for a move
                        if ( squareType !== Pieces.EMPTY )          // unless this was an attack. if it was, we have to stop
                            break;
                    }                   // NOTE: this area of code results in "gaps" in potential moves a piece can make
                }                       // in a given direction when you're in check. This is INTENDED because sometimes the only move
            }                           // a piece make to save its king is several moves away from its current location.


            // LEFT and RIGHT
            else if ( direction === Directions.LEFT || direction === Directions.RIGHT ){

                for (let curX = x + xDir; (curX !== x + (8 * xDir)) && (curX !== xLimit); curX += xDir) {
                    squareType = boardMap[y][curX].pcType;
                    squareOwner = boardMap[y][curX].pcOwner;

                    if (boardMap[y][curX].pcOwner === mainSquareOwner)
                        break;

                    else {
                        boardMap[y][curX].pcType = Pieces.PAWN;
                        boardMap[y][curX].pcOwner = mainSquareOwner;

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );

                        boardMap[y][curX].pcType = squareType;
                        boardMap[y][curX].pcOwner = squareOwner;

                        if ( kingIsSafe ) {
                            goodMoves.push(new Move(y, curX));
                        }
                        else {
                            if ( ! playerIsInCheck( mainSquareOwner ) )
                                break;
                        }
                        if ( squareType !== Pieces.EMPTY )
                            break;
                    }
                }
            }

            // DIAGONALS
            else{
                for ( let curY = y + yDir, curX = x + xDir;
                      curY !== y + (8 * yDir) && curX !== x + (8 * xDir) &&
                      curY !== yLimit && curX !== xLimit; curY += yDir, curX += xDir){

                    squareType = boardMap[curY][curX].pcType;
                    squareOwner = boardMap[curY][curX].pcOwner;

                    if (boardMap[curY][curX].pcOwner === mainSquareOwner)
                        break;

                    else {
                        boardMap[curY][curX].pcType = Pieces.PAWN;
                        boardMap[curY][curX].pcOwner = mainSquareOwner;

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );

                        boardMap[curY][curX].pcType = squareType;
                        boardMap[curY][curX].pcOwner = squareOwner;

                        if ( kingIsSafe ) {
                            goodMoves.push(new Move(curY, curX));
                        }
                        else {
                            if ( ! playerIsInCheck( mainSquareOwner ) )
                                break;
                        }
                        if ( squareType !== Pieces.EMPTY )
                            break;
                    }
                }
            }
            return goodMoves;
        }


        // This functions sends out "search" cursors in all directions away from the square
        // at the given Y, X coordinates and searches for pieces that can attack this square.
        // If the square is safe, TRUE is returned. FALSE otherwise.
        function squareIsSafe(y, x){

            let mainSquareOwner = boardMap[y][x].pcOwner;       // owner of the square whose safety is in question
            let squareBeingSearched = null;                     // current square being tested for a potential enemy

            // searches DOWN looking for danger
            for (let checkY = y + 1; checkY < 8; checkY++) {
                squareBeingSearched = boardMap[ checkY ][ x ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )      // search ran into your own piece.
                    break;                                                  // stop searching in this direction

                if (checkY === y + 1
                    && squareBeingSearched.pcType === Pieces.KING ) {       // ran into a NEARBY enemy king
                    return false;                                           // we're in danger
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||        // ran into an enemy queen or rook
                    (squareBeingSearched.pcType === Pieces.ROOK)) {         // we're in danger
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )          // we ran into something non-threatening
                    break;                                                  // stop searching in this direction
            }

            // searches UP looking for danger
            for (let checkY = y - 1; checkY > -1; checkY--) {
                squareBeingSearched = boardMap[ checkY ][ x ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkY === y - 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches RIGHT looking for danger
            for (let checkX = x + 1; checkX < 8; checkX++) {
                squareBeingSearched = boardMap[ y ][ checkX ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkX === x + 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches LEFT looking for danger
            for (let checkX = x - 1; checkX > -1; checkX--) {
                squareBeingSearched = boardMap[ y ][ checkX ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkX === x - 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches UP-LEFT looking for danger
            for (let checkY = y-1, checkX = x-1; checkY > -1 && checkX > -1; checkY--, checkX--) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )      // search ran into your own piece.
                    break;                                                  // stop searching in this direction

                if ((checkY === y-1 && checkX === x-1) &&                   // pawns only can attack in the direction
                    (squareBeingSearched.pcType === Pieces.KING  ||         // they move, so need to check ownership
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.WHITE))) {       // ran into a NEARBY enemy pawn or King.
                    return false;                                           // we're in danger
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {        // ran into an enemy Bishop or Queen.
                    return false;                                           // we're in danger
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;                                                  // we ran into something non-threatening
            }                                                               // stop searching in this direction

            // searches UP-RIGHT looking for danger
            for (let checkY = y-1, checkX = x+1; checkY > -1 && checkX < 8; checkY--, checkX++) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y-1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.WHITE))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches DOWN-LEFT looking for danger
            for (let checkY = y+1, checkX = x-1; checkY < 8 && checkX > -1; checkY++, checkX--) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y+1 && checkX === x-1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.BLACK))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches DOWN-RIGHT looking for danger
            for (let checkY = y+1, checkX = x+1; checkY < 8 && checkX < 8; checkY++, checkX++) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y+1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.BLACK))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches for potential KNIGHT attacks
            let knightAttack = [];
            knightAttack.push( new Move(y-2,x+1) );
            knightAttack.push( new Move(y-2,x-1) );
            knightAttack.push( new Move(y+2,x+1) );
            knightAttack.push( new Move(y+2,x-1) );
            knightAttack.push( new Move(y+1,x+2) );
            knightAttack.push( new Move(y+1,x-2) );
            knightAttack.push( new Move(y-1,x+2) );
            knightAttack.push( new Move(y-1,x-2) );

            for ( let checkY, checkX, i = 0; i < knightAttack.length; i++ ){
                checkY = knightAttack[i].y;
                checkX = knightAttack[i].x;

                if (checkY < 0 || checkY > 7 )
                    continue;
                if (checkX < 0 || checkX > 7 )
                    continue;
                if ((boardMap[checkY][checkX].pcType === Pieces.KNIGHT) &&
                    (boardMap[checkY][checkX].pcOwner !== mainSquareOwner)) {
                    return false;
                }
            }
            return true;        // all searches for danger have been exhausted. Square is safe.
        }


        // updates the list of of coordinates for each player's pieces
        // these lists are used to increase efficiency when calculating checkmate
        function updatePieceLists(){

            // updates coordinates for piece that moved
            if ( currentPlayer === Players.WHITE ) {
                for (let i = 0; i < boardData.whitePieces.length; i++) {
                    if (boardData.whitePieces[i].y === selectedSquare[0] &&
                        boardData.whitePieces[i].x === selectedSquare[1]) {
                        boardData.whitePieces[i].y = y;
                        boardData.whitePieces[i].x = x;
                        break;
                    }
                }

                // if a piece was captured
                // remove it from enemy's list
                if ( boardMap[y][x].pcType !== Pieces.EMPTY ){
                    for (let i = 0; i < boardData.blackPieces.length; i++) {
                        if ( boardData.blackPieces[i].y === y && boardData.blackPieces[i].x === x ) {
                            boardData.blackPieces.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < boardData.blackPieces.length; i++) {
                    if (boardData.blackPieces[i].y === selectedSquare[0] &&
                        boardData.blackPieces[i].x === selectedSquare[1]) {
                        boardData.blackPieces[i].y = y;
                        boardData.blackPieces[i].x = x;
                        break;
                    }
                }
                if ( boardData.pcType !== Pieces.EMPTY ){
                    for (let i = 0; i < boardData.whitePieces.length; i++) {
                        if ( boardData.whitePieces[i].y === y && boardData.whitePieces[i].x === x ) {
                            boardData.whitePieces.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }


        // determines if there is at least ONE move the WHITE player can make to avoid checkmate.
        // iterates through all white pieces and simulates moves until one is found that can stop checkmate
        function determineWhiteCheckmate(){
            let checkMate = true;
            let piece = null;
            for (let i = 0; i < boardData.whitePieces.length; i++ ){
                piece = boardData.whitePieces[i];
                switch (boardMap[piece.y][piece.x].pcType) {
                    case Pieces.ROOK:   checkMate = showRookMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.KNIGHT: checkMate = showKnightMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.BISHOP: checkMate = showBishopMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.QUEEN:  checkMate = showQueenMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.KING:   checkMate = showKingMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.PAWN:   checkMate = showPawnMoves(piece.y,piece.x,false) === 0;   break;
                    default: console.log("ERROR: DEFAULT CASE REACHED IN determineWhiteCheckmate()");
                }
                if ( ! checkMate )
                    break;
            }
            return checkMate;
        }

        // determines if there is at least ONE move the BLACK player can make to avoid checkmate.
        // iterates through all black pieces and simulates moves until one is found that can stop checkmate
        function determineBlackCheckmate(){
            let checkMate = true;
            let piece = null;
            for (let i = 0; i < boardData.blackPieces.length; i++ ){
                piece = boardData.blackPieces[i];
                switch (boardMap[piece.y][piece.x].pcType) {
                    case Pieces.ROOK:   checkMate = showRookMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.KNIGHT: checkMate = showKnightMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.BISHOP: checkMate = showBishopMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.QUEEN:  checkMate = showQueenMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.KING:   checkMate = showKingMoves(piece.y,piece.x,false) === 0;   break;
                    case Pieces.PAWN:   checkMate = showPawnMoves(piece.y,piece.x,false) === 0;   break;
                    default: console.log("ERROR: DEFAULT CASE REACHED IN determineBlackCheckmate()");
                }
                if ( ! checkMate )
                    break;
            }
            return checkMate;
        }


        // *****************************************************************************
        // ******************************* KING MOVEMENT *******************************
        // *****************************************************************************
        function showKingMoves( y, x, highlight ) {

            let possibleMoves = [];         // all possible moves the king can make
            let safeMoves = [];             // list of moves the king can make without being put into check
            let squareType = null;          // current piece type of the square being considered
            let squareOwner = null;         // current owner of the square being considered
            let move = null;                // current move being examined
            let kingOwner = null;

            for ( let yOffset = -1; yOffset < 2; yOffset++ ){             // adds 1 move in every direction
                for ( let xOffset = -1; xOffset < 2; xOffset++){          // skips the Square the king is already on
                    if ( yOffset === 0 && xOffset === 0 )
                        continue;
                    possibleMoves.push(new Move(y+yOffset,x+xOffset))
                }
            }

            kingOwner = boardMap[y][x].pcOwner;
            boardMap[y][x].pcType = Pieces.EMPTY;           // temporarily "picks up" the king to simulate moves
            boardMap[y][x].pcOwner = Players.NONE;

            // test each move, remove any that aren't allowed
            for ( let i = 0; i < possibleMoves.length; i++ ) {
                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)               // immediately discard if move is off board
                    continue;                               // or collides with your own piece
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === kingOwner)
                    continue;

                squareType = boardMap[move.y][move.x].pcType;
                squareOwner = boardMap[move.y][move.x].pcOwner;
                boardMap[move.y][move.x].pcType = Pieces.KING;      // temporarily make the move
                boardMap[move.y][move.x].pcOwner = kingOwner;

                if ( squareIsSafe(move.y, move.x) )                 // checks if the king is still safe if he moves here
                    safeMoves.push(move);                           // if so, add it to his list of safe moves

                boardMap[move.y][move.x].pcType = squareType;
                boardMap[move.y][move.x].pcOwner = squareOwner;
            }

            boardMap[y][x].pcType = Pieces.KING;
            boardMap[y][x].pcOwner = kingOwner;         // tests are complete, put the king back

            if ( highlight )
                highlightGoodMoves( safeMoves );        // and highlight his safe moves

            return safeMoves.length;
        }


        // *****************************************************************************
        // ******************************* PAWN MOVEMENT *******************************
        // *****************************************************************************
        function showPawnMoves( y, x, highlight ) {

            let possibleMoves = [];         // all theoretical moves the knight can make
            let goodMoves = [];             // moves that are allowed
            let move = null;                // current move being tested
            let squareType = null;          // piece type of the square being considered
            let squareOwner = null;         // owner of the square being considered
            let kingIsSafe = false;         // whether the current player's king being put in check by the current move
            let pawnOwner = null;           // owner of the pawn whose moves are being looked at

            pawnOwner = boardMap[y][x].pcOwner;

            // BLACK pawns
            if (pawnOwner === Players.BLACK) {
                possibleMoves.push( new Move(y+1,x+1) );             // diagonal attacks
                possibleMoves.push( new Move(y+1,x-1) );

                for (let curY = y + 1; curY <= y + 2 && curY < 8; curY++) {     // adds two forward moves
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }

            // WHITE pawns
            else {
                possibleMoves.push( new Move(y-1,x+1) );
                possibleMoves.push( new Move(y-1,x-1) );

                for (let curY = y - 1; curY >= y - 2 && curY > -1; curY--) {
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }

            boardMap[y][x].pcType = Pieces.EMPTY;               // temporarily "picks up" the piece for
            boardMap[y][x].pcOwner = Players.NONE;              // simulate different moves

            // test each move, remove any that aren't allowed
            for (let i = 0; i < possibleMoves.length; i++) {
                move = possibleMoves[i];

                if (move.x > 7 || move.x < 0)
                    continue;                           // discard if move is off the board
                if (move.y > 7 || move.y < 0)
                    continue;
                if (move.y === y + 2 && y !== 1)        // discard double moves if not on starting row
                    continue;
                if (move.y === y - 2 && y !== 6)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === pawnOwner)             // discard if attacking your own piece
                    continue;
                if ((pawnOwner === Players.WHITE) &&
                    (move.x !== x) &&                                           // discard WHITE diagonals
                    (boardMap[move.y][move.x].pcOwner !== Players.BLACK))       // if no enemy piece
                    continue;
                if ((pawnOwner === Players.BLACK) &&
                    (move.x !== x) &&                                           // discard BLACK diagonals
                    (boardMap[move.y][move.x].pcOwner !== Players.WHITE))       // if no enemy piece
                    continue;

                squareType = boardMap[move.y][move.x].pcType;
                squareOwner = boardMap[move.y][move.x].pcOwner;
                boardMap[move.y][move.x].pcType = Pieces.PAWN;          // temporarily make the move
                boardMap[move.y][move.x].pcOwner = pawnOwner;

                kingIsSafe = playerKingIsSafe( pawnOwner );             // makes sure king is safe if you move here

                boardMap[move.y][move.x].pcType = squareType;
                boardMap[move.y][move.x].pcOwner = squareOwner;

                if (kingIsSafe) {                                       // king is SAFE, add the move
                    goodMoves.push(new Move(move.y, move.x));
                }
                else {                                          // King is NOT SAFE if you make this move.
                    if ( ! playerIsInCheck( pawnOwner ) )       // if you're NOT in check, this move will put us
                        break;                                  // IN check, so we stop looking for new moves
                    else
                        continue;                           // however if you ARE in check, keep testing moves
                }                                           // that could save your King unless we've hit something
            }

            boardMap[y][x].pcType = Pieces.PAWN;
            boardMap[y][x].pcOwner = pawnOwner;

            if (highlight)
                highlightGoodMoves(goodMoves);

            return goodMoves.length;
        }


        // *******************************************************************************
        // ******************************* KNIGHT MOVEMENT *******************************
        // *******************************************************************************
        function showKnightMoves( y, x, highlight ) {

            let possibleMoves = [];         // all theoretical moves the knight can make
            let goodMoves = [];             // moves that are allowed
            let move = null;                // current move being tested
            let squareType = null;          // piece type of the square being considered
            let squareOwner = null;         // owner of the square being considered
            let kingIsSafe = false;         // whether the current player's king being put in check by the current move
            let knightOwner = null;         // owner of the knight whose moves are being looked at

            possibleMoves.push( new Move(y-2,x+1) );
            possibleMoves.push( new Move(y-2,x-1) );
            possibleMoves.push( new Move(y+2,x+1) );
            possibleMoves.push( new Move(y+2,x-1) );
            possibleMoves.push( new Move(y+1,x+2) );
            possibleMoves.push( new Move(y+1,x-2) );
            possibleMoves.push( new Move(y-1,x-2) );
            possibleMoves.push( new Move(y-1,x+2) );

            knightOwner = boardMap[y][x].pcOwner;
            boardMap[y][x].pcType = Pieces.EMPTY;                   // temporarily "picks up" the piece to
            boardMap[y][x].pcOwner = Players.NONE;                  // simulate different moves

            // test each move, remove any that aren't allowed
            for (let i = 0; i < possibleMoves.length; i++) {
                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)               // immediately discard if move is off board
                    continue;                               // or collides with your own piece
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === knightOwner)
                    continue;

                squareType = boardMap[move.y][move.x].pcType;
                squareOwner = boardMap[move.y][move.x].pcOwner;
                boardMap[move.y][move.x].pcType = Pieces.KNIGHT;        // temporarily make the move
                boardMap[move.y][move.x].pcOwner = knightOwner;

                kingIsSafe = playerKingIsSafe( knightOwner );           // makes sure king is safe if you move here

                boardMap[move.y][move.x].pcType = squareType;
                boardMap[move.y][move.x].pcOwner = squareOwner;

                if (kingIsSafe) {                                       // king is SAFE, add the move
                    goodMoves.push(new Move(move.y, move.x));
                }
                else {                                              // King is NOT SAFE if you make this move.
                    if ( ! playerIsInCheck( knightOwner ) )         // if you're NOT in check, this move will put us
                        break;                                      // IN check, so stop looking for new moves
                    else
                        continue;               // however if you ARE in check, keep testing moves
                }                               // that could save your King
            }

            boardMap[y][x].pcType = Pieces.KNIGHT;
            boardMap[y][x].pcOwner = knightOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }


        // *******************************************************************************
        // ******************************* BISHOP MOVEMENT *******************************
        // *******************************************************************************
        function showBishopMoves( y, x, highlight ) {
            let goodMoves = [];
            let bishopOwner = boardMap[y][x].pcOwner;           // owner of the bishop whose moves are being looked at

            boardMap[y][x].pcType = Pieces.EMPTY;               // temporary "picks up" the piece for
            boardMap[y][x].pcOwner = Players.NONE;              // king check-avoidance testing

            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.UP_RIGHT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.BISHOP;              // places piece back down after all
            boardMap[y][x].pcOwner = bishopOwner;               // safe moves are found

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;                    // for checkmate calculations
        }


        // *****************************************************************************
        // ******************************* ROOK MOVEMENT *******************************
        // *****************************************************************************
        function showRookMoves( y, x, highlight ) {
            let goodMoves = [];
            let rookOwner = boardMap[y][x].pcOwner;

            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.DOWN);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.UP);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.LEFT);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.RIGHT);

            boardMap[y][x].pcType = Pieces.ROOK;
            boardMap[y][x].pcOwner = rookOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }


        // ******************************************************************************
        // ******************************* QUEEN MOVEMENT *******************************
        // ******************************************************************************
        function showQueenMoves( y, x, highlight ) {
            let goodMoves = [];
            let queenOwner = boardMap[y][x].pcOwner;

            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.LEFT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.RIGHT);

            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP_RIGHT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.QUEEN;
            boardMap[y][x].pcOwner = queenOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }
    };


    // renders the game
    return (
        <div className="App">
            <div className="Header">
                <h1>CHESS</h1>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <PlayerBox
                        playerTitle =       "CATS"
                        isTurn =            {currentPlayer === Players.BLACK}
                        triggerGameOver =   {endGame}
                        inCheck =           {boardState[7][8].blackCheck}
                        checkmate =         {boardState[7][8].blackCheckMate}
                        playerNumber =      {"2"}
                    />
                    <div className="spacer"/>
                    <PlayerBox
                        playerTitle =       "DOGS"
                        isTurn =            {currentPlayer === Players.WHITE}
                        triggerGameOver =   {endGame}
                        inCheck =           {boardState[7][8].whiteCheck}
                        checkmate =         {boardState[7][8].whiteCheckMate}
                        playerNumber =      {"1"}
                    />
                </div>
                <div className="col-sm-8">
                    <Board
                        bState =            {boardState}
                        pieceClicked =      {squareClicked}
                        bData =             {boardState[7][8]}
                    />
                </div>
            </div>
            {gameOver &&
            <EndGameScreen />
            }
        </div>
    );
};

// deprecated End-Turn Button component
//
// <div className="row">
//    <EndTurnBtn onClick={swapTurn}/>
// </div>*/}

export default App;
