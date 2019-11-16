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

            // BLACK pawns
            if ( currentPlayer === Players.BLACK ){
                possibleMoves.push( new Move(y+1,x+1) );                            // diagonal attacks
                possibleMoves.push( new Move(y+1,x-1) );

                for ( let curY = y + 1; curY <= y + 2 && curY < 8; curY++){         // adds two forward moves
                    if (boardMap[ curY ][ x ].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push( new Move(curY,x) )
                }
            }

            // WHITE pawns
            else{
                possibleMoves.push( new Move(y-1,x+1) );                            // diagonal attacks
                possibleMoves.push( new Move(y-1,x-1) );

                for ( let curY = y - 1; curY >= y - 2 && curY > -1; curY--){        // adds two forward moves
                    if (boardMap[ curY ][ x ].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push( new Move(curY,x) )
                }
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
                    (boardMap[move.y][move.x].pcOwner !== Players.BLACK))       // discard WHITE diagonals
                    continue;                                                   // if no enemy piece
                if ((currentPlayer === Players.BLACK) &&
                    (move.x !== x) &&
                    (boardMap[move.y][move.x].pcOwner !== Players.WHITE))       // discard BLACK diagonals
                    continue;                                                   // if no enemy piece

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
            let move = null;                        // current move being examined
            let startTime = Date.now();


            for ( let yOffset = -1; yOffset < 2; yOffset++ ){             // adds 1 move in every direction
                for ( let xOffset = -1; xOffset < 2; xOffset++){          // skips the Square the king is already on
                    if ( yOffset === 0 && xOffset === 0 )
                        continue;
                    possibleMoves.push(new Move(y+yOffset,x+xOffset))
                }
            }

            boardMap[y][x].pcType = Pieces.EMPTY;       // temporarily "picks king up" from his location for danger testing
            boardMap[y][x].pcOwner = Players.NONE;

            // for each of the possible moves the king can make
            // test to see if they are valid and will NOT put the king in check
            for ( let i = 0; i < possibleMoves.length; i++ ) {

                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)               // immediately discard if move is off board
                    continue;                               // or collides with your own piece
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === currentPlayer)
                    continue;

                if ( squareIsSafe(move.y, move.x) )         // checks if each remaining move is safe
                    safeMoves.push(move);                   // if so, add it to the list of safe moves
            }

            boardMap[y][x].pcType = Pieces.KING;
            boardMap[y][x].pcOwner = currentPlayer;         // tests are complete, put the king back
            highlightGoodMoves( safeMoves );                // and highlight his safe moves

            // TIME TESTING
            let endTime = Date.now();
            console.log("It took " + (endTime - startTime).toString() + " ms to show safe king moves");
        }


        // This functions sends out "search" cursors in all directions
        // away from the given square and searches for pieces that can attack this square.
        // If the square is safe, TRUE is returned. FALSE otherwise.
        function squareIsSafe(y, x){
            let potDangerSquare = null;             // current square being tested for a potential enemy
            let foundDanger = false;                // whether or not an enemy has been found

            // searches DOWN looking for danger
            for (let checkY = y + 1; checkY < 8; checkY++) {
                potDangerSquare = boardMap[ checkY ][ x ];

                if ( potDangerSquare.pcOwner === currentPlayer )        // search ran into one of your
                    break;                                              // own pieces so stop looking

                if (checkY === y + 1
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
            }
            if (foundDanger)
                return false;

            // searches UP looking for danger
            for (let checkY = y - 1; checkY > -1; checkY--) {
                potDangerSquare = boardMap[ checkY ][ x ];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if (checkY === y - 1 && potDangerSquare.pcType === Pieces.KING) {
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
            }
            if (foundDanger)
                return false;

            // searches RIGHT looking for danger
            for (let checkX = x + 1; checkX < 8; checkX++) {
                potDangerSquare = boardMap[ y ][ checkX ];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if (checkX === x + 1 && potDangerSquare.pcType === Pieces.KING) {
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
            }
            if (foundDanger)
                return false;

            // searches LEFT looking for danger
            for (let checkX = x - 1; checkX > -1; checkX--) {
                potDangerSquare = boardMap[ y ][ checkX ];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if (checkX === x - 1 && potDangerSquare.pcType === Pieces.KING) {
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
            }
            if (foundDanger)
                return false;

            // searches UP-LEFT looking for danger
            for (let checkY = y-1, checkX = x-1; checkY > -1 && checkX > -1; checkY--, checkX--) {
                potDangerSquare = boardMap[checkY][checkX];

                if ( potDangerSquare.pcOwner === currentPlayer )        // search ran into your own piece.
                    break;                                              // stop looking

                if ((checkY === y-1 && checkX === x-1) &&               // pawns only can attack in the direction
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
            }                                                           // ran into something, stop looking
            if (foundDanger)
                return false;

            // searches UP-RIGHT looking for danger
            for (let checkY = y-1, checkX = x+1; checkY > -1 && checkX < 8; checkY--, checkX++) {
                potDangerSquare = boardMap[checkY][checkX];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if ((checkY === y-1 && checkX === x+1) &&
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
            }
            if (foundDanger)
                return false;

            // searches DOWN-LEFT looking for danger
            for (let checkY = y+1, checkX = x-1; checkY < 8 && checkX > -1; checkY++, checkX--) {
                potDangerSquare = boardMap[checkY][checkX];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if ((checkY === y+1 && checkX === x-1) &&
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
            }
            if (foundDanger)
                return false;

            // searches DOWN-RIGHT looking for danger
            for (let checkY = y+1, checkX = x+1; checkY < 8 && checkX < 8; checkY++, checkX++) {
                potDangerSquare = boardMap[checkY][checkX];

                if ( potDangerSquare.pcOwner === currentPlayer )
                    break;

                if ((checkY === y+1 && checkX === x+1) &&
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
            }
            if (foundDanger)
                return false;

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

                if (knightAttack[i].y < 0 || checkY > 7 )
                    continue;
                if (checkX < 0 || checkX > 7 )
                    continue;
                if ((boardMap[checkY][checkX].pcType === Pieces.KNIGHT) &&
                    (boardMap[checkY][checkX].pcOwner !== currentPlayer)) {
                    foundDanger = true;
                    break;
                }
            }
            if (foundDanger)
                return false;

            return true;        // all searches for danger have been exhausted. Returns true.
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
