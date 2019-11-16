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
    const [currentPlayer, swapPlayer] =         React.useState( Players.WHITE );
    const [updateBoard, setUpdateBoard] =       React.useState( true );             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState( [-1,-1] );          // [-1,-1] means "NOTHING SELECTED"
    const [highlightedSquares, setHighlights] = React.useState( [] );               // keeps track of currently highlighted squares
    const [gameOver, setGameOver] = React.useState(false);

    // swaps the player turn
    const swapTurn = () => {
        swapPlayer( currentPlayer === Players.WHITE ? Players.BLACK : Players.WHITE )
    };

    //Activate game over functionality
    const endGame = () => {
        setGameOver(true);
    }

    const squareClicked = (y, x) => {

        let boardMap = boardState;          // current state of the board when the square is clicked

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
                case Pieces.ROOK: showRookMoves(); break;
                case Pieces.KNIGHT: showKnightMoves(); break;
                case Pieces.BISHOP: showBishopMoves(); break;
                case Pieces.QUEEN: showQueenMoves(); break;
                case Pieces.KING: showKingMoves(); break;
                case Pieces.PAWN: showPawnMoves(); break;
                default: return;
            }
        }

        // Here a square is ALREADY SELECTED and you've clicked on one of the HIGHLIGHTED SQUARES
        // This is a successful move so the turn is swapped to the next player upon completion
        else if ( selectedSquare[0] !== -1 && boardMap[y][x].isHighlighted === true ){
            let selectedPiece = boardMap[selectedSquare[0]][selectedSquare[1]];
            boardMap[y][x].pcType = selectedPiece.pcType;
            boardMap[y][x].pcOwner = selectedPiece.pcOwner;     // move piece from selected square to clicked square
            selectedPiece.pcType = Pieces.EMPTY;
            selectedPiece.pcOwner = Players.NONE;               // clear the selected square
            selectedPiece.isSelected = false;

            // transforms pawns into queens if they reach the other side of the board
            // no need to check which player because pawns will only ever reach one side
            if ((y === 0 || y === 7) && boardMap[y][x].pcType === Pieces.PAWN ){
                boardMap[y][x].pcType = Pieces.QUEEN;
            }

            deHighlightAllSquares();
            setSelectedSquare( [-1,-1] );
            swapTurn();                         // next player's turn
        }
        setBoardState(boardMap);                // updates the board with all changes made
        setUpdateBoard(!updateBoard);           // and triggers a re-render
        // END OF MAIN FUNCTION EXECUTION



        // ******************************************************************************************
        // ************************************ HELPER FUNCTIONS ************************************
        // ******************************************************************************************

        // de-highlights all squares in the highlight list
        function deHighlightAllSquares(){
            let litSquare = null;
            for ( let i = 0; i < highlightedSquares.length; i++ ){
                litSquare = highlightedSquares[i];
                boardMap[ litSquare.y ][ litSquare.x ].isHighlighted = false;
            }
            setHighlights( [] );                    // reset highlighted squares state to an empty array
        }

        // iterates through a list of acceptable moves that a piece can make
        // highlights them on the board, and updates the state to match
        function highlightGoodMoves( goodMoves ){
            for ( let i = 0; i < goodMoves.length; i++ ){
                boardMap[ goodMoves[i].y ][ goodMoves[i].x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }


        // Searches in the four CARDINAL directions for acceptable moves for a given piece
        // Uses variable-swapping depending on the direction parameter passed in
        // Updates the goodMoves array based on good moves that were found in the given direction
        function findCardinalMoves(goodMoves, direction){

            let yDir = null;            // amount to increment y by when searching
            let xDir = null;            // amount to increment x by when searching
            let yLimit = null;          // limit placed on y variable in loops
            let xLimit = null;          // limit placed on x variable in loops

            switch (direction) {
                case Directions.DOWN:   yDir = 1;   yLimit = 8;    break;
                case Directions.UP:     yDir = -1;  yLimit = -1;   break;       // sets up logic variables based on
                case Directions.LEFT:   xDir = -1;  xLimit = -1;   break;       // direction being searched
                case Directions.RIGHT:  xDir = 1;   xLimit = 8;    break;
                default: return;
            }

            // UP and DOWN
            if ( direction === Directions.UP || direction === Directions.DOWN ){
                for ( let curY = y + yDir; (curY !== y + (8 * yDir)) && (curY !== yLimit); curY += yDir){
                    if (boardMap[ curY ][ x ].pcType === Pieces.EMPTY) {
                        goodMoves.push( new Move(curY,x) );                     // if square is empty, the move is good
                        continue;                                               // add and continue moving forward
                    }
                    if (boardMap[ curY ][ x ].pcOwner === currentPlayer)        // discard if you run into your own piece
                        break;
                    if (boardMap[ curY ][ x ].pcOwner !== currentPlayer ){
                        goodMoves.push( new Move(curY,x) );                     // if square contains enemy, move is good
                        break;                                                  // but we can no longer move forward
                    }
                }
            }

            // LEFT and RIGHT
            else{
                for ( let curX = x + xDir; (curX !== x + (8 * xDir)) && (curX !== xLimit); curX += xDir){
                    if (boardMap[ y ][ curX ].pcType === Pieces.EMPTY) {
                        goodMoves.push( new Move(y,curX) );
                        continue;
                    }
                    if (boardMap[ y ][ curX ].pcOwner === currentPlayer)
                        break;
                    if (boardMap[ y ][ curX ].pcOwner !== currentPlayer ){
                        goodMoves.push( new Move(y,curX) );
                        break;
                    }
                }
            }
            return goodMoves;
        }

        // Searches in DIAGONAL directions for acceptable moves for a given piece
        // Uses variable-swapping depending on the direction parameter passed in
        // Updates the goodMoves array based on good moves that were found in the given direction
        function findDiagonalMoves(goodMoves, direction){

            let yDir = null;            // amount to increment y by when searching
            let xDir = null;            // amount to increment x by when searching
            let yLimit = null;          // limit placed on y variable in loops
            let xLimit = null;          // limit placed on x variable in loops

            switch (direction) {
                case Directions.DOWN_RIGHT: yDir = 1;   xDir = 1;   yLimit = 8;   xLimit = 8;   break;
                case Directions.DOWN_LEFT:  yDir = 1;   xDir = -1;  yLimit = 8;   xLimit = -1;  break;
                case Directions.UP_RIGHT:   yDir = -1;  xDir = 1;   yLimit = -1;  xLimit = 8;   break;
                case Directions.UP_LEFT:    yDir = -1;  xDir = -1;  yLimit = -1;  xLimit = -1;  break;
                default: return;
            }

            // add moves based on given direction
            for ( let curY = y + yDir, curX = x + xDir;
                  curY !== y + (8 * yDir) && curX !== x + (8 * xDir) &&
                  curY !== yLimit && curX !== xLimit; curY += yDir, curX += xDir){

                if (boardMap[ curY ][ curX ].pcType === Pieces.EMPTY) {
                    goodMoves.push( new Move(curY,curX) );                  // if square is empty, the move is good
                    continue;                                               // add and continue moving forward
                }
                if (boardMap[ curY ][ curX ].pcOwner === currentPlayer)     // discard if you run into your own piece
                    break;
                if (boardMap[ curY ][ curX ].pcOwner !== currentPlayer ){
                    goodMoves.push( new Move(curY,curX) );                  // if square contains enemy, move is good
                    break;                                                  // but we can no longer move forward
                }
            }
            return goodMoves;
        }


        // **********************************************************************************
        // ***************************** KNIGHT FUNCTIONALITY *******************************
        // **********************************************************************************
        function showKnightMoves() {
            let possibleMoves = [];                     // all theoretical moves the KNIGHT can make
            let goodMoves = [];                         // moves that are allowed
            let move = null;                            // current move being tested

            possibleMoves.push( new Move(y-2,x+1) );
            possibleMoves.push( new Move(y-2,x-1) );
            possibleMoves.push( new Move(y+2,x+1) );
            possibleMoves.push( new Move(y+2,x-1) );
            possibleMoves.push( new Move(y+1,x+2) );
            possibleMoves.push( new Move(y+1,x-2) );
            possibleMoves.push( new Move(y-1,x-2) );
            possibleMoves.push( new Move(y-1,x+2) );

            // for each of the possible moves, remove any that are not allowed
            for ( let i = 0; i < possibleMoves.length; i++ ){
                move = possibleMoves[i];
                if ( move.x > 7 || move.x < 0 )         // discard if move is out of Y-range
                    continue;
                if ( move.y > 7 || move.y < 0 )         // discard if move is out of X-range
                    continue;
                if ( boardMap[move.y][move.x].pcOwner === currentPlayer )        // discard if attacking your own piece
                    continue;

                goodMoves.push(move);
            }

            // finally, highlight all board squares that are in the list good moves
            // then update the highlightedSquares state to match
            highlightGoodMoves( goodMoves );
        }


        // **********************************************************************************
        // ***************************** PAWN FUNCTIONALITY *********************************
        // **********************************************************************************
        function showPawnMoves() {
            let possibleMoves = [];
            let goodMoves = [];
            let move = null;

            // pawn movement is dependant upon the player
            switch( currentPlayer ){
                case Players.BLACK: {
                    possibleMoves.push( new Move(y+1,x+1) );        // diagonal attacks
                    possibleMoves.push( new Move(y+1,x-1) );

                    // add forward moves until a collision occurs
                    for ( let curY = y + 1; curY <= y + 2 && curY < 8; curY++){
                        if (boardMap[ curY ][ x ].pcType !== Pieces.EMPTY)
                            break;
                        possibleMoves.push( new Move(curY,x) )
                    }
                    break;
                }
                case Players.WHITE: {
                    possibleMoves.push( new Move(y-1,x+1) );        // diagonal attacks
                    possibleMoves.push( new Move(y-1,x-1) );

                    // add forward moves until a collision occurs
                    for ( let curY = y - 1; curY >= y - 2 && curY > -1; curY--){
                        if (boardMap[ curY ][ x ].pcType !== Pieces.EMPTY)
                            break;
                        possibleMoves.push( new Move(curY,x) )
                    }
                    break;
                }

                default:
                    return;
            }

            // for each of the possible moves, remove any that are not allowed
            for ( let i = 0; i < possibleMoves.length; i++ ){
                move = possibleMoves[i];
                if ( move.x > 7 || move.x < 0 )
                    continue;                           // discard if move is off the board
                if ( move.y > 7 || move.y < 0 )
                    continue;
                if (move.y === y+2 && y !== 1)          // discard WHITE double moves if not on starting row
                    continue;
                if (move.y === y-2 && y !== 6)          // discard BLACK double moves if not on starting row
                    continue;
                if ( boardMap[move.y][move.x].pcOwner === currentPlayer )       // discard if attacking your own piece
                    continue;
                if ((currentPlayer === Players.WHITE) &&
                    (move.x !== x) &&
                    (boardMap[move.y][move.x].pcOwner !== Players.BLACK))       // discard WHITE diagonals if no enemy piece
                    continue;
                if ((currentPlayer === Players.BLACK) &&
                    (move.x !== x) &&
                    (boardMap[move.y][move.x].pcOwner !== Players.WHITE))       // discard BLACK diagonals if no enemy piece
                    continue;

                goodMoves.push(move);
            }
            highlightGoodMoves( goodMoves );
        }


        // **********************************************************************************
        // ******************************* ROOK FUNCTIONALITY *******************************
        // **********************************************************************************
        function showRookMoves() {
            let goodMoves = [];
            goodMoves = findCardinalMoves(goodMoves, Directions.DOWN);
            goodMoves = findCardinalMoves(goodMoves, Directions.UP);
            goodMoves = findCardinalMoves(goodMoves, Directions.LEFT);
            goodMoves = findCardinalMoves(goodMoves, Directions.RIGHT);
            highlightGoodMoves( goodMoves );
        }


        // **********************************************************************************
        // ******************************* BISHOP FUNCTIONALITY *****************************
        // **********************************************************************************
        function showBishopMoves() {
            let goodMoves = [];
            goodMoves = findDiagonalMoves(goodMoves, Directions.DOWN_RIGHT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.DOWN_LEFT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.UP_RIGHT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.UP_LEFT);
            highlightGoodMoves( goodMoves );
        }


        // **********************************************************************************
        // ******************************* QUEEN FUNCTIONALITY ******************************
        // **********************************************************************************
        function showQueenMoves() {
            let goodMoves = [];
            goodMoves = findCardinalMoves(goodMoves, Directions.DOWN);
            goodMoves = findCardinalMoves(goodMoves, Directions.UP);
            goodMoves = findCardinalMoves(goodMoves, Directions.LEFT);
            goodMoves = findCardinalMoves(goodMoves, Directions.RIGHT);

            goodMoves = findDiagonalMoves(goodMoves, Directions.DOWN_RIGHT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.DOWN_LEFT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.UP_RIGHT);
            goodMoves = findDiagonalMoves(goodMoves, Directions.UP_LEFT);
            highlightGoodMoves( goodMoves );
        }


        // **********************************************************************************
        // ******************************* KING FUNCTIONALITY *******************************
        // **********************************************************************************
        function showKingMoves() {
            let possibleMoves = [];                 // all possible moves the king can make
            let safeMoves = [];                     // list of moves the king can make without being put into check
            let potDangerSquare = null;             // current square being tested for a potential enemy
            let foundDanger = false;                // whether or not an enemy has been found
            let move = null;                        // current move being examined
            let loopCounter = 0;                    // DEBUGGING: counts loops required for King safety

            for ( let yOffset = -1; yOffset < 2; yOffset++ ){             // adds 1 move in every direction
                for ( let xOffset = -1; xOffset < 2; xOffset++){          // skips the Square the king is already on
                    if ( yOffset === 0 && xOffset === 0 )
                        continue;
                    possibleMoves.push(new Move(y+yOffset,x+xOffset))
                }
            }

            boardMap[y][x].pcType = Pieces.EMPTY;       // temporarily removes king from actual spot for "in danger" tests
            boardMap[y][x].pcOwner = Players.NONE;


            // for each of the possible moves the king can make
            // test to see if they are valid and will NOT put the king in check
            for ( let i = 0; i < possibleMoves.length; i++ ) {
                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)
                    continue;                           // discard if the move itself is off the board
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === currentPlayer)   // discard if the move collides with your own piece
                    continue;


                // **************************************************
                // ********* DANGER-AVOIDANCE FUNCTIONALITY *********
                // **************************************************
                //
                // For each of the 8 moves around the king, "search" cursors are sent out in ALL directions
                // FROM THAT POINT and they each look for a potential threat. If one is found, that particular
                // move is NOT added to the list of good moves because it will put the King in check.

                foundDanger = false;

                // searches DOWN looking for danger
                for (let checkY = move.y + 1, checkX = move.x; checkY < 8; checkY++) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )        // search ran into one of your
                        break;                                              // own pieces so stop looking

                    if (checkY === move.y + 1
                        && potDangerSquare.pcType === Pieces.KING ) {       // ran into a NEARBY enemy king
                        foundDanger = true;                                 // we're in danger, stop looking
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.QUEEN) ||
                        (potDangerSquare.pcType === Pieces.ROOK)) {         // ran into an enemy queen or rook
                        foundDanger = true;                                 // we're in danger, stop looking
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )          // we're not in danger
                        break;                                              // but ran into something, stop looking
                    loopCounter++;
                }
                if (foundDanger)        // this move is not safe, discard and try next move
                    continue;

                // searches UP looking for danger
                for (let checkY = move.y - 1, checkX = move.x; checkY > -1; checkY--) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if (checkY === move.y - 1 && potDangerSquare.pcType === Pieces.KING) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.QUEEN) ||
                        (potDangerSquare.pcType === Pieces.ROOK)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches RIGHT looking for danger
                for (let checkY = move.y, checkX = move.x + 1; checkX < 8; checkX++) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if (checkX === move.x + 1 && potDangerSquare.pcType === Pieces.KING) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.QUEEN) ||
                        (potDangerSquare.pcType === Pieces.ROOK)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches LEFT looking for danger
                for (let checkY = move.y, checkX = move.x - 1; checkX > -1; checkX--) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if (checkX === move.x - 1 && potDangerSquare.pcType === Pieces.KING) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.QUEEN) ||
                        (potDangerSquare.pcType === Pieces.ROOK)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches UP-LEFT looking for danger
                for (let checkY = move.y-1, checkX = move.x-1; checkY > -1 && checkX > -1; checkY--, checkX--) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )        // search ran into your own piece.
                        break;                                              // stop looking

                    if ((checkY === move.y-1 && checkX === move.x-1) &&     // pawns only can attack in the direction
                        (potDangerSquare.pcType === Pieces.KING  ||         // they move, so need to check ownership
                        (potDangerSquare.pcType === Pieces.PAWN
                             && currentPlayer === Players.WHITE))) {
                        foundDanger = true;                                 // ran into a NEARBY enemy pawn or King.
                        break;                                              // we're in danger, stop looking
                    }
                    if ((potDangerSquare.pcType === Pieces.BISHOP) ||
                        (potDangerSquare.pcType === Pieces.QUEEN)) {
                        foundDanger = true;                                 // ran into an enemy Bishop or Queen.
                        break;                                              // we're in danger, stop looking
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;                                              // we're not in danger but we
                    loopCounter++;
                }                                                           // ran into something, stop looking
                if (foundDanger)
                    continue;

                // searches UP-RIGHT looking for danger
                for (let checkY = move.y-1, checkX = move.x+1; checkY > -1 && checkX < 8; checkY--, checkX++) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if ((checkY === move.y-1 && checkX === move.x+1) &&
                        (potDangerSquare.pcType === Pieces.KING  ||
                        (potDangerSquare.pcType === Pieces.PAWN
                            && currentPlayer === Players.WHITE))) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.BISHOP) ||
                        (potDangerSquare.pcType === Pieces.QUEEN)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches DOWN-LEFT looking for danger
                for (let checkY = move.y+1, checkX = move.x-1; checkY < 8 && checkX > -1; checkY++, checkX--) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if ((checkY === move.y+1 && checkX === move.x-1) &&
                        (potDangerSquare.pcType === Pieces.KING  ||
                        (potDangerSquare.pcType === Pieces.PAWN
                            && currentPlayer === Players.BLACK))) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.BISHOP) ||
                        (potDangerSquare.pcType === Pieces.QUEEN)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches DOWN-RIGHT looking for danger
                for (let checkY = move.y+1, checkX = move.x+1; checkY < 8 && checkX < 8; checkY++, checkX++) {
                    potDangerSquare = boardMap[checkY][checkX];

                    if ( potDangerSquare.pcOwner === currentPlayer )
                        break;

                    if ((checkY === move.y+1 && checkX === move.x+1) &&
                        (potDangerSquare.pcType === Pieces.KING  ||
                        (potDangerSquare.pcType === Pieces.PAWN
                            && currentPlayer === Players.BLACK))) {
                        foundDanger = true;
                        break;
                    }
                    if ((potDangerSquare.pcType === Pieces.BISHOP) ||
                        (potDangerSquare.pcType === Pieces.QUEEN)) {
                        foundDanger = true;
                        break;
                    }
                    if ( potDangerSquare.pcType !== Pieces.EMPTY )
                        break;
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // searches for KNIGHT attacks
                let potKnightAttacks = [];
                potKnightAttacks.push( new Move(move.y-2,move.x+1) );
                potKnightAttacks.push( new Move(move.y-2,move.x-1) );
                potKnightAttacks.push( new Move(move.y+2,move.x+1) );
                potKnightAttacks.push( new Move(move.y+2,move.x-1) );
                potKnightAttacks.push( new Move(move.y+1,move.x+2) );
                potKnightAttacks.push( new Move(move.y+1,move.x-2) );
                potKnightAttacks.push( new Move(move.y-1,move.x-2) );
                potKnightAttacks.push( new Move(move.y-1,move.x+2) );

                for ( let checkY, checkX, i = 0; i < potKnightAttacks.length; i++ ){
                    checkY = potKnightAttacks[i].y;
                    checkX = potKnightAttacks[i].x;

                    if (checkY < 0 || checkY > 7 )
                        continue;
                    if (checkX < 0 || checkX > 7 )
                        continue;
                    if ((boardMap[checkY][checkX].pcType === Pieces.KNIGHT) &&
                        (boardMap[checkY][checkX].pcOwner !== currentPlayer)) {
                        foundDanger = true;
                        break;
                    }
                    loopCounter++;
                }
                if (foundDanger)
                    continue;

                // FINALLY, if all checks are exhausted,
                // add the move to the list of safe moves for the king
                safeMoves.push(move);
                loopCounter++;
            }
            boardMap[y][x].pcType = Pieces.KING;
            boardMap[y][x].pcOwner = currentPlayer;         // tests are complete, put the king back
            highlightGoodMoves( safeMoves );                // and highlight his safe moves
            console.log("It took " + loopCounter + " loops to determine safe moves for King.");
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
                    <PlayerBox playerTitle="CATS" isTurn={currentPlayer === Players.BLACK} triggerGameOver={endGame} />
                    <div className="spacer"/>
                    <PlayerBox playerTitle="DOGS" isTurn={currentPlayer === Players.WHITE} triggerGameOver={endGame} />
                </div>
                <div className="col-sm-8">
                    <Board bState = {boardState} pieceClicked = {squareClicked}/>
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
