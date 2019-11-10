import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board, {initializeBoard} from './Board';
import EndTurnBtn from './EndTurnBtn';
import {Pieces} from './Board';
import {Players} from './Board';

// tuple for holding potential board moves.
class Move{
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

const App = (props) => {

    // REMEMBER: These states CANNOT be changed without using the corresponding SET methods.
    // Attempting to set them manually will NOT result in errors, but WILL cause unintended buggy behavior
    const [boardState, setBoardState] =         React.useState( initializeBoard() );
    const [currentPlayer, swapPlayer] = React.useState( Players.WHITE );
    const [updateBoard, setUpdateBoard] =       React.useState( true );             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState( [-1,-1] );          // [-1,-1] means "NOTHING SELECTED"
    const [highlightedSquares, setHighlights] = React.useState( [] );               // keeps track of currently highlighted squares

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
            }
        }

        // Here a square is ALREADY selected and you've clicked on a highlighted square
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

        // highlights all the acceptable moves
        // that the KNIGHT piece can make
        function showKnightMoves() {
            let possibleMoves = [];                     // all theoretical moves the KNIGHT can make
            let goodMoves = [];                         // moves that are allowed

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
                let move = possibleMoves[i];
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
            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // highlight all moves in the goodMove list
            }
            setHighlights( goodMoves );
        }

        // highlights all the acceptable moves that the PAWN piece can make
        function showPawnMoves() {
            let possibleMoves = [];
            let goodMoves = [];

            // pawn movement is dependant upon the player
            switch( currentPlayer ){
                case Players.WHITE: {
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
                case Players.BLACK: {
                    possibleMoves.push( new Move(y-1,x+1) );        // diagonal attacks
                    possibleMoves.push( new Move(y-1,x-1) );

                    // add forward moves until a collision occurs
                    for ( let curY = y - 1; curY >= y - 2 && curY > 0; curY--){
                        if (boardMap[ curY ][ x ].pcType !== Pieces.EMPTY)
                            break;
                        possibleMoves.push( new Move(curY,x) )
                    }
                    break;
                }
            }

            // for each of the possible moves, remove any that are not allowed
            for ( let i = 0; i < possibleMoves.length; i++ ){
                let move = possibleMoves[i];
                if ( move.x > 7 || move.x < 0 )         // discard if move is out of Y-range
                    continue;
                if ( move.y > 7 || move.y < 0 )         // discard if move is out of X-range
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

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // highlights all the acceptable moves that the ROOK piece can make
        function showRookMoves() {
            let possibleMoves = [];                     // all theoretical moves the ROOK can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Rook move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // highlights all the acceptable moves that the BISHOP piece can make
        function showBishopMoves() {
            let possibleMoves = [];                     // all theoretical moves the BISHOP can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Bishop move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // highlights all the acceptable moves that the QUEEN piece can make
        function showQueenMoves() {
            let possibleMoves = [];                     // all theoretical moves the QUEEN can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Queen move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // highlights all the acceptable moves that the KING piece can make
        function showKingMoves() {
            let possibleMoves = [];                     // all theoretical moves the KING can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the King move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }
    };

    // swaps the player turn
    const swapTurn = () => {
        swapPlayer( currentPlayer === Players.WHITE ? Players.BLACK : Players.WHITE )
    };

    // renders the game
    return (
        <div className="App">
            <div className="Header">
                <h1>COWS, HORSES, AND PAWNS</h1>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <PlayerBox playerNumber="1" isTurn={currentPlayer === Players.WHITE}/>
                    <div className="spacer"/>
                    <PlayerBox playerNumber="2" isTurn={currentPlayer === Players.BLACK}/>
                </div>
                <div className="col-sm-8">
                    <Board bState = {boardState} pieceClicked = {squareClicked}/>
                </div>
            </div>
        </div>
    );
};

// deprecated End-Turn Button component
//
// <div className="row">
//    <EndTurnBtn onClick={swapTurn}/>
// </div>*/}

export default App;
