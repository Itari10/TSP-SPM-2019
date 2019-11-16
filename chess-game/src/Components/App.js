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
    const [whiteKingLocation, setWhiteKing] =   React.useState( [7, 3] );
    const [blackKingLocation, setBlackKing] =   React.useState( [0, 3] );
    const [playerKingY, setKingY] =             React.useState( 7 );                // current player's king's Y coordinate
    const [playerKingX, setKingX] =             React.useState( 3 );                // current player's king's X coordinate
    const [whiteKingCheck, setWhiteCheck] =     React.useState( false );
    const [blackKingCheck, setBlackCheck] =     React.useState( false );

    // swaps the player turn
    const swapTurn = () => {
        if (currentPlayer === Players.WHITE ){
            setKingY( blackKingLocation[0] );       // updates current player's king coordinates
            setKingX( blackKingLocation[1] );
            setCurrentPlayer( Players.BLACK )
        }
        else{
            setKingY( whiteKingLocation[0] );
            setKingX( whiteKingLocation[1] );
            setCurrentPlayer( Players.WHITE );
        }
    };

    // activates game-over functionality
    const endGame = () => {
        setGameOver(true);
    };

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

            if ( boardMap[y][x].pcType === Pieces.KING ){       // updates king locations when moved
                if (currentPlayer === Players.WHITE)
                    setWhiteKing( [y,x] );
                else
                    setBlackKing( [y,x] );
            }

            // transforms pawns into queens if they reach the other side of the board
            if ((y === 0 || y === 7) && boardMap[y][x].pcType === Pieces.PAWN ){
                boardMap[y][x].pcType = Pieces.QUEEN;
            }

            deHighlightAllSquares();
            setSelectedSquare( [-1,-1] );
            swapTurn();                         // next player's turn
        }
        setBoardState(boardMap);                // updates the board with all changes made
        setUpdateBoard(!updateBoard);           // and triggers a re-render
        // END OF MAIN CLICK FUNCTION



        // *****************************************************************************
        // ******************************* KING MOVEMENT *******************************
        // *****************************************************************************
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


        // *****************************************************************************
        // ******************************* PAWN MOVEMENT *******************************
        // *****************************************************************************
        function showPawnMoves() {
            let possibleMoves = [];
            let goodMoves = [];
            let move = null;
            let currentType = null;                     // current piece type of the given square
            let currentOwner = null;                    // current owner of the given square


            // BLACK pawns
            if (currentPlayer === Players.BLACK) {
                possibleMoves.push(new Move(y + 1, x + 1));                            // diagonal attacks
                possibleMoves.push(new Move(y + 1, x - 1));

                for (let curY = y + 1; curY <= y + 2 && curY < 8; curY++) {         // adds two forward moves
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }

            // WHITE pawns
            else {
                possibleMoves.push(new Move(y - 1, x + 1));                            // diagonal attacks
                possibleMoves.push(new Move(y - 1, x - 1));

                for (let curY = y - 1; curY >= y - 2 && curY > -1; curY--) {        // adds two forward moves
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }


            // If your King is currently NOT in check
            if ((currentPlayer === Players.WHITE && !whiteKingCheck) ||
                (currentPlayer === Players.BLACK && !blackKingCheck)) {

                boardMap[y][x].pcType = Pieces.EMPTY;               // temporary "picks up" the piece for
                boardMap[y][x].pcOwner = Players.NONE;              // king check-avoidance testing

                // for each of the possible moves, remove any that are not allowed
                for (let i = 0; i < possibleMoves.length; i++) {
                    move = possibleMoves[i];
                    if (move.x > 7 || move.x < 0)
                        continue;                           // discard if move is off the board
                    if (move.y > 7 || move.y < 0)
                        continue;
                    if (move.y === y + 2 && y !== 1)          // discard WHITE double moves if not on starting row
                        continue;
                    if (move.y === y - 2 && y !== 6)          // discard BLACK double moves if not on starting row
                        continue;
                    if (boardMap[move.y][move.x].pcOwner === currentPlayer)       // discard if attacking your own piece
                        continue;
                    if ((currentPlayer === Players.WHITE) &&
                        (move.x !== x) &&
                        (boardMap[move.y][move.x].pcOwner !== Players.BLACK))       // discard WHITE diagonals
                        continue;                                                   // if no enemy piece
                    if ((currentPlayer === Players.BLACK) &&
                        (move.x !== x) &&
                        (boardMap[move.y][move.x].pcOwner !== Players.WHITE))       // discard BLACK diagonals
                        continue;                                                   // if no enemy piece

                    currentType = boardMap[move.y][move.x].pcType;          // store square condition
                    currentOwner = boardMap[move.y][move.x].pcOwner;
                    boardMap[move.y][move.x].pcType = Pieces.KNIGHT;
                    boardMap[move.y][move.x].pcOwner = currentPlayer;       // temporarily move to that square

                    if (squareIsSafe(playerKingY, playerKingX))             // add the move if it doesn't
                        goodMoves.push(move);                               // endanger your King

                    boardMap[move.y][move.x].pcType = currentType;
                    boardMap[move.y][move.x].pcOwner = currentOwner;        // replace square condition
                }

                boardMap[y][x].pcType = Pieces.PAWN;
                boardMap[y][x].pcOwner = currentPlayer;
                highlightGoodMoves(goodMoves);
            }
        }


        // *******************************************************************************
        // ******************************* KNIGHT MOVEMENT *******************************
        // *******************************************************************************
        function showKnightMoves() {
            let possibleMoves = [];                     // all theoretical moves the KNIGHT can make
            let goodMoves = [];                         // moves that are allowed
            let move = null;                            // current move being tested
            let currentType = null;                     // current piece type of the given square
            let currentOwner = null;                    // current owner of the given square

            possibleMoves.push( new Move(y-2,x+1) );
            possibleMoves.push( new Move(y-2,x-1) );
            possibleMoves.push( new Move(y+2,x+1) );
            possibleMoves.push( new Move(y+2,x-1) );
            possibleMoves.push( new Move(y+1,x+2) );
            possibleMoves.push( new Move(y+1,x-2) );
            possibleMoves.push( new Move(y-1,x-2) );
            possibleMoves.push( new Move(y-1,x+2) );

            // If your King is currently NOT in check
            if ((currentPlayer === Players.WHITE && ! whiteKingCheck) ||
                (currentPlayer === Players.BLACK && ! blackKingCheck)) {

                boardMap[y][x].pcType = Pieces.EMPTY;               // temporary "picks up" the piece for
                boardMap[y][x].pcOwner = Players.NONE;              // king check-avoidance testing

                // for each of the possible moves, remove any that are now allowed
                for (let i = 0; i < possibleMoves.length; i++) {
                    move = possibleMoves[i];
                    if (move.x > 7 || move.x < 0)                   // discard if move is off the board or
                        continue;                                   // collides with your own piece
                    if (move.y > 7 || move.y < 0)
                        continue;
                    if (boardMap[move.y][move.x].pcOwner === currentPlayer)
                        continue;

                    currentType = boardMap[move.y][move.x].pcType;          // store square condition
                    currentOwner = boardMap[move.y][move.x].pcOwner;
                    boardMap[move.y][move.x].pcType = Pieces.KNIGHT;
                    boardMap[move.y][move.x].pcOwner = currentPlayer;       // temporarily move to that square

                    if (squareIsSafe(playerKingY, playerKingX))             // add the move if it doesn't
                        goodMoves.push(move);                               // endanger your King

                    boardMap[move.y][move.x].pcType = currentType;
                    boardMap[move.y][move.x].pcOwner = currentOwner;        // replace square condition
                }
            }

            boardMap[y][x].pcType = Pieces.KNIGHT;
            boardMap[y][x].pcOwner = currentPlayer;
            highlightGoodMoves( goodMoves );
        }


        // *******************************************************************************
        // ******************************* BISHOP MOVEMENT *******************************
        // *******************************************************************************
        function showBishopMoves() {
            let goodMoves = [];
            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = addDiagonalMoves(goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.UP_RIGHT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.BISHOP;
            boardMap[y][x].pcOwner = currentPlayer;
            highlightGoodMoves( goodMoves );
        }


        // *****************************************************************************
        // ******************************* ROOK MOVEMENT *******************************
        // *****************************************************************************
        function showRookMoves() {
            let goodMoves = [];
            boardMap[y][x].pcType = Pieces.EMPTY;               // temporary "picks up" the piece for
            boardMap[y][x].pcOwner = Players.NONE;              // king check-avoidance testing

            goodMoves = findCardinalMoves(goodMoves, Directions.DOWN);
            goodMoves = findCardinalMoves(goodMoves, Directions.UP);
            goodMoves = findCardinalMoves(goodMoves, Directions.LEFT);
            goodMoves = findCardinalMoves(goodMoves, Directions.RIGHT);

            boardMap[y][x].pcType = Pieces.ROOK;                // places piece back down after all
            boardMap[y][x].pcOwner = currentPlayer;             // safe moves are found
            highlightGoodMoves( goodMoves );
        }


        // ******************************************************************************
        // ******************************* QUEEN MOVEMENT *******************************
        // ******************************************************************************
        function showQueenMoves() {
            let goodMoves = [];
            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = findCardinalMoves(goodMoves, Directions.DOWN);
            goodMoves = findCardinalMoves(goodMoves, Directions.UP);
            goodMoves = findCardinalMoves(goodMoves, Directions.LEFT);
            goodMoves = findCardinalMoves(goodMoves, Directions.RIGHT);

            goodMoves = addDiagonalMoves(goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.UP_RIGHT);
            goodMoves = addDiagonalMoves(goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.QUEEN;
            boardMap[y][x].pcOwner = currentPlayer;
            highlightGoodMoves( goodMoves );
        }




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


        // Iterates through a list of moves that a piece can make and
        // highlights them on the board. Updates the state to match
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
            let kingIsSafe = false;     // is the current player's King being put in check by the move being tested
            let currentType = null;     // current piece type of the given square
            let currentOwner = null;    // current owner of the given square

            switch (direction) {
                case Directions.DOWN:   yDir = 1;   yLimit = 8;    break;
                case Directions.UP:     yDir = -1;  yLimit = -1;   break;       // sets up logic variables based on
                case Directions.LEFT:   xDir = -1;  xLimit = -1;   break;       // direction being searched
                case Directions.RIGHT:  xDir = 1;   xLimit = 8;    break;
                default: return;
            }

            // UP and DOWN
            if ( direction === Directions.UP || direction === Directions.DOWN ){

                // Your King is currently NOT in check
                if ((currentPlayer === Players.WHITE && ! whiteKingCheck) ||
                    (currentPlayer === Players.BLACK && ! blackKingCheck)) {

                    for (let curY = y + yDir; (curY !== y + (8 * yDir)) && (curY !== yLimit); curY += yDir) {
                        currentType = boardMap[curY][x].pcType;
                        currentOwner = boardMap[curY][x].pcOwner;

                        if (boardMap[curY][x].pcOwner === currentPlayer)        // discard if you run into your own piece
                            break;

                        else {                                                          // otherwise...
                            boardMap[curY][x].pcType = Pieces.PAWN;
                            boardMap[curY][x].pcOwner = currentPlayer;                  // temporarily move to that square

                            kingIsSafe = squareIsSafe(playerKingY, playerKingX);        // make sure your king is still safe

                            boardMap[curY][x].pcType = currentType;
                            boardMap[curY][x].pcOwner = currentOwner;

                            if ( kingIsSafe ) {                                 // if so, the move is good
                                goodMoves.push(new Move(curY, x));
                                if (currentType !== Pieces.EMPTY)               // if this was an attack, searching stops here
                                    break;                                      // (otherwise, keep searching for new moves)
                            }
                            else                // if your king wasn't safe
                                break;          // we DON'T add the move, and stop searching
                        }                       // for new moves in this direction
                    }
                }
            }

            // LEFT and RIGHT
            else{
                if ((currentPlayer === Players.WHITE && ! whiteKingCheck) ||
                    (currentPlayer === Players.BLACK && ! blackKingCheck)) {

                    for (let curX = x + xDir; (curX !== x + (8 * xDir)) && (curX !== xLimit); curX += xDir) {
                        currentType = boardMap[y][curX].pcType;
                        currentOwner = boardMap[y][curX].pcOwner;

                        if (boardMap[y][curX].pcOwner === currentPlayer)
                            break;

                        else {
                            boardMap[y][curX].pcType = Pieces.PAWN;
                            boardMap[y][curX].pcOwner = currentPlayer;

                            kingIsSafe = squareIsSafe(playerKingY, playerKingX);

                            boardMap[y][curX].pcType = currentType;
                            boardMap[y][curX].pcOwner = currentOwner;

                            if ( kingIsSafe ) {
                                goodMoves.push(new Move(y, curX));
                                if (currentType !== Pieces.EMPTY)
                                    break;
                            }
                            else
                                break;
                        }
                    }
                }
            }
            return goodMoves;
        }


        // Searches in DIAGONAL directions for acceptable moves for a given piece
        // Uses variable-swapping depending on the direction parameter passed in
        // Updates the goodMoves array based on good moves that were found in the given direction
        function addDiagonalMoves(goodMoves, direction){

            let yDir = null;            // amount to increment y by when searching
            let xDir = null;            // amount to increment x by when searching
            let yLimit = null;          // limit placed on y variable in loops
            let xLimit = null;          // limit placed on x variable in loops
            let kingIsSafe = false;     // is the current player's King being put in check by the move being tested
            let currentType = null;     // current piece type of the given square
            let currentOwner = null;    // current owner of the given square

            switch (direction) {
                case Directions.DOWN_RIGHT: yDir = 1;   xDir = 1;   yLimit = 8;   xLimit = 8;   break;
                case Directions.DOWN_LEFT:  yDir = 1;   xDir = -1;  yLimit = 8;   xLimit = -1;  break;
                case Directions.UP_RIGHT:   yDir = -1;  xDir = 1;   yLimit = -1;  xLimit = 8;   break;
                case Directions.UP_LEFT:    yDir = -1;  xDir = -1;  yLimit = -1;  xLimit = -1;  break;
                default: return;
            }

            // If your King is currently NOT in check
            if ((currentPlayer === Players.WHITE && ! whiteKingCheck) ||
                (currentPlayer === Players.BLACK && ! blackKingCheck)) {

                // add moves based on given direction
                for ( let curY = y + yDir, curX = x + xDir;
                      curY !== y + (8 * yDir) && curX !== x + (8 * xDir) &&
                      curY !== yLimit && curX !== xLimit; curY += yDir, curX += xDir){

                    currentType = boardMap[curY][curX].pcType;
                    currentOwner = boardMap[curY][curX].pcOwner;

                    if (boardMap[curY][curX].pcOwner === currentPlayer)        // discard if you run into your own piece
                        break;

                    else {                                                      // otherwise...
                        boardMap[curY][curX].pcType = Pieces.PAWN;
                        boardMap[curY][curX].pcOwner = currentPlayer;           // temporarily move to that square

                        kingIsSafe = squareIsSafe(playerKingY, playerKingX);    // make sure your king is still safe

                        boardMap[curY][curX].pcType = currentType;
                        boardMap[curY][curX].pcOwner = currentOwner;

                        if ( kingIsSafe ) {                                 // if so, the move is good
                            goodMoves.push(new Move(curY, curX));
                            if (currentType !== Pieces.EMPTY)               // if this was an attack, searching stops here
                                break;                                      // (otherwise, keep searching for new moves)
                        }
                        else                // if your king wasn't safe
                            break;          // DON'T add the move, and stop searching
                    }                       // for new moves in this direction
                }
            }
            return goodMoves;
        }


        // This functions sends out "search" cursors in all directions away from the square
        // at the given Y, X coordinates and searches for pieces that can attack this square.
        // If the square is safe, TRUE is returned. FALSE otherwise.
        function squareIsSafe(y, x){

            let squareBeingSearched = null;             // current square being tested for a potential enemy

            // searches DOWN looking for danger
            for (let checkY = y + 1; checkY < 8; checkY++) {
                squareBeingSearched = boardMap[ checkY ][ x ];

                if ( squareBeingSearched.pcOwner === currentPlayer )        // search ran into your own piece.
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
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

                if ( squareBeingSearched.pcOwner === currentPlayer )        // search ran into your own piece.
                    break;                                                  // stop searching in this direction

                if ((checkY === y-1 && checkX === x-1) &&                   // pawns only can attack in the direction
                    (squareBeingSearched.pcType === Pieces.KING  ||         // they move, so need to check ownership
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && currentPlayer === Players.WHITE))) {         // ran into a NEARBY enemy pawn or King.
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
                    break;

                if ((checkY === y-1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && currentPlayer === Players.WHITE))) {
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
                    break;

                if ((checkY === y+1 && checkX === x-1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && currentPlayer === Players.BLACK))) {
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

                if ( squareBeingSearched.pcOwner === currentPlayer )
                    break;

                if ((checkY === y+1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && currentPlayer === Players.BLACK))) {
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

                if (knightAttack[i].y < 0 || checkY > 7 )
                    continue;
                if (checkX < 0 || checkX > 7 )
                    continue;
                if ((boardMap[checkY][checkX].pcType === Pieces.KNIGHT) &&
                    (boardMap[checkY][checkX].pcOwner !== currentPlayer)) {
                    return false;
                }
            }

            return true;        // all searches for danger have been exhausted. Square is safe.
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
