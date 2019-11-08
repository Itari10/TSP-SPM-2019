import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board, {initializeBoard} from './Board';
import EndTurnBtn from './EndTurnBtn';

const App = (props) => {

    // state management
    const [bState, setBoardState] = React.useState( initializeBoard() );
    const [playerOneTurn, setPlayerOneTurn] = React.useState(true);
    const [updateBoard, setUpdateBoard] = React.useState(true);             // band-aid state
    const [selectedSquare, setSelectedSquare] = React.useState([-1,-1]);

    const squareClicked = (y, x) => {

        // JANK
        // let temp = bState;
        // temp[y][x].pieceID = "BQ";          // sets the (y, x) that was clicked to queen
        // setBoardState( temp );              // updates the actual board state
        // setUpdateBoard( !updateBoard );       // triggers the app to re-render

        let boardMap = bState;

        //If you click the same square as the currently selected square, deselect the sqaure
        if (selectedSquare[0] === y && selectedSquare[1] === x) {
            setSelectedSquare([-1,-1]);
            
        //If there is no currently selected square, select the square that was clicked
        } else if (selectedSquare[0] === -1 && selectedSquare[1] === -1) {       
            setSelectedSquare([y,x]);
            if ( boardMap[y][x].pieceID === null ) {
                setSelectedSquare([-1,-1]);
            }

        //Move piece
        } else {
            let selectedPiece = boardMap[selectedSquare[0]][selectedSquare[1]];
            boardMap[y][x].pieceID = selectedPiece.pieceID;
            boardMap[selectedSquare[0]][selectedSquare[1]].pieceID = null;
            setSelectedSquare([-1,-1]);
            setBoardState(boardMap);
            setUpdateBoard(!updateBoard);
        }
        return;
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
