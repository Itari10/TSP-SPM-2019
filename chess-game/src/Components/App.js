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
    // Attempting to set them manually will NOT result in errors, but will cause unintended buggy behavior
    // The values inside useState() are the INITIAL values set when the game first loads.
    const [boardState, setBoardState] =         React.useState( initializeBoard() );
    const [currentPlayerTurn, swapPlayerTurn] = React.useState( Players.WHITE );
    const [updateBoard, setUpdateBoard] =       React.useState( true );             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState( [-1,-1] );          // [-1,-1] means "NOTHING SELECTED"
    const [highlightedSquares, setHighlights] = React.useState( [] );               // keeps track of currently highlighted squares


    const squareClicked = (y, x) => {

        let boardMap = boardState;          // current state of the board when the square is clicked

        // If you click the square that's already selected...
        // deselect the square and unhighlight any highlighted squares
        if ( y === selectedSquare[0] && x === selectedSquare[1] ) {
            setSelectedSquare([-1,-1]);
            boardMap[y][x].isSelected = false;

            // de-highlights all highlighted squares that were
            // associated with the selected square
            deHighlightAllSquares();
        }


        // if you click on YOUR OWN piece
        else if (boardMap[y][x].pcOwner === currentPlayerTurn ) {

            // and nothing is selected..
            // then select that piece
            if ( selectedSquare[0] === -1 ) {
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // if you already have a piece selected...
            // de-select it and select the new piece
            else{
                deHighlightAllSquares();
                boardMap[selectedSquare[0]][selectedSquare[1]].isSelected = false;
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // highlight all possible moves for the piece that's selected
            switch ( boardMap[y][x].pcType ){

                // FOR DEVELOPMENT:
                //
                // IF MAY BE EASIER TO JUST WRITE THE CODE FOR YOUR PIECE HERE
                // AND PUT IT IN ITS RESPECTIVE METHOD LATER.
                //
                case Pieces.ROOK: highlightRookMoves(); break;
                case Pieces.KNIGHT: highlightKnightMoves(); break;
                case Pieces.BISHOP: highlightBishopMoves(); break;
                case Pieces.QUEEN: highlightQueenMoves(); break;
                case Pieces.KING: highlightKingMoves(); break;
                case Pieces.PAWN: highlightPawnMoves(); break;
            }
        }

        // Here a square is ALREADY selected and you've clicked on a highlighted square
        // This is a successful move and so the turn is swapped to the next player upon completion
        else if ( selectedSquare[0] !== -1 && boardMap[y][x].isHighlighted === true ){
            let selectedPiece = boardMap[selectedSquare[0]][selectedSquare[1]];
            boardMap[y][x].pcType = selectedPiece.pcType;
            boardMap[y][x].pcOwner = selectedPiece.pcOwner;     // move piece from selected square to clicked square
            selectedPiece.pcType = Pieces.EMPTY;
            selectedPiece.pcOwner = Players.NONE;               // clear the selected square
            selectedPiece.isSelected = false;

            deHighlightAllSquares();
            setSelectedSquare([-1, -1]);        // set the SelectedSquare state to "nothing selected"
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
        function highlightKnightMoves() {
            let possibleMoves = [];                     // all theoretical moves the KNIGHT can make
            let goodMoves = [];                         // moves that are allowed

            possibleMoves.push( new Move(y-2,x+1) );
            possibleMoves.push( new Move(y-2,x-1) );
            possibleMoves.push( new Move(y+2,x+1) );      // creates the list of ALL moves
            possibleMoves.push( new Move(y+2,x-1) );      // this piece can theoretically make
            possibleMoves.push( new Move(y+1,x+2) );
            possibleMoves.push( new Move(y+1,x-2) );
            possibleMoves.push( new Move(y-1,x-2) );
            possibleMoves.push( new Move(y-1,x+2) );

            for ( let i = 0; i < possibleMoves.length; i++ ){
                let move = possibleMoves[i];
                if ( move.x > 7 || move.x < 0 )                     // discard if move is out of Y-range
                    continue;
                if ( move.y > 7 || move.y < 0 )                     // discard if move is out of X-range
                    continue;
                if ( boardMap[move.y][move.x].pcOwner === currentPlayerTurn )        // discard if attacking your own piece
                    continue;

                goodMoves.push(move);                               // otherwise add it to the list of good moves
            }

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }


        // highlights all the acceptable moves that the PAWN piece can make
        function highlightPawnMoves() {
            let possibleMoves = [];                     // all theoretical moves the PAWN can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Pawn move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }


        // highlights all the acceptable moves that the ROOK piece can make
        function highlightRookMoves() {
            let possibleMoves = [];                     // all theoretical moves the ROOK can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Rook move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }

        // highlights all the acceptable moves that the BISHOP piece can make
        function highlightBishopMoves() {
            let possibleMoves = [];                     // all theoretical moves the BISHOP can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Bishop move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }


        // highlights all the acceptable moves that the QUEEN piece can make
        function highlightQueenMoves() {
            let possibleMoves = [];                     // all theoretical moves the QUEEN can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the Queen move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }


        // highlights all the acceptable moves that the KING piece can make
        function highlightKingMoves() {
            let possibleMoves = [];                     // all theoretical moves the KING can make
            let goodMoves = [];                         // moves that are allowed

            // TODO: where can the King move?

            let goodMove = null;
            for ( let i = 0; i < goodMoves.length; i++ ){
                goodMove = goodMoves[i];                                        // highlight all moves in the goodMove list
                boardMap[ goodMove.y ][ goodMove.x ].isHighlighted = true;      // and record them to the highlight-squares state
                setHighlights( goodMoves )                                      // to increase efficiency when de-selecting them
            }
        }
    };

    // swaps the player turn
    const swapTurn = () => {
        swapPlayerTurn( currentPlayerTurn === Players.WHITE ? Players.BLACK : Players.WHITE )

    };

    // renders the game
    return (
        <div className="App">
            <div className="Header">
                <h1>BEAST WARS</h1>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <PlayerBox playerNumber="1" isTurn={currentPlayerTurn === Players.WHITE}/>
                    <div className="spacer"/>
                    <PlayerBox playerNumber="2" isTurn={currentPlayerTurn === Players.BLACK}/>
                </div>
                <div className="col-sm-8">
                    <Board bState = {boardState} pieceClicked = {squareClicked}/>
                </div>
            </div>
        </div>
    );
};

{/*<div className="row">*/}
    {/*<EndTurnBtn onClick={swapTurn}/>*/}
{/*</div>*/}

export default App;
