import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board, {initializeBoard} from './Board';
import EndTurnBtn from './EndTurnBtn';
import {Pieces} from './Board';
import {Players} from './Board';


const App = (props) => {

    // state management
    const [bState, setBoardState] = React.useState( initializeBoard() );
    const [playerOneTurn, setPlayerOneTurn] = React.useState(true);
    const [updateBoard, setUpdateBoard] = React.useState(true);             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState([-1,-1]);


    const squareClicked = (y, x) => {

        let boardMap = bState;

        // If you click the same square as the currently selected square, deselect the square
        if ( y === selectedSquare[0] && x === selectedSquare[1] ) {
            setSelectedSquare([-1,-1]);
            boardMap[y][x].isSelected = false;
        }

        // Otherwise, if there is nothing selected, select the square that was clicked
        else if (selectedSquare[0] === -1 && selectedSquare[1] === -1) {

            // as long as there is a piece on that square, select it
            if ( boardMap[y][x].pcType !== Pieces.EMPTY ) {
                console.log(Pieces.EMPTY);
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }
        }

        // If there is a selected piece, and you click on another square
        // move the selected piece to that square and remove it from its previous square
        else {
            let selectedPiece = boardMap[ selectedSquare[0] ][ selectedSquare[1] ];
            let clickedPiece = boardMap[y][x];

            clickedPiece.pcType = selectedPiece.pcType;         // move piece from selected square to clicked square
            clickedPiece.pcOwner = selectedPiece.pcOwner;
            selectedPiece.pcType = Pieces.EMPTY;
            selectedPiece.pcOwner = Players.NONE;               // clear the selected square
            selectedPiece.isSelected = false;                   // and de-select it

            setSelectedSquare( [-1,-1] );                       // set the SelectedSquare state to "nothing selected"
            setBoardState(boardMap);                            // update board
            setUpdateBoard(!updateBoard);                       // and re-render
        }
    };

    //changes the players turn in the game
    const setTurn = () => {
        setPlayerOneTurn(!playerOneTurn);
    };

    // renders the game
    return (
        <div className="App">
            <div className="Header">
                <h1>CHESS</h1>
            </div>

            <div className="row">
                <EndTurnBtn onClick={setTurn}/>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <PlayerBox playerNumber="1" isTurn={playerOneTurn}/>
                    <div className="spacer"/>
                    <PlayerBox playerNumber="2" isTurn={!playerOneTurn}/>
                </div>
                <div className="col-sm-8">
                    <Board bState = {bState} pieceClicked = {squareClicked}/>
                </div>
            </div>
        </div>
    );
};

export default App;
