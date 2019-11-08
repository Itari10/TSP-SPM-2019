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

    const pieceClicked = (y, x) => {

        /*
         This commented out code is just trying to make it so we don't
         have to force the re-render using updateboard everytime the
         boardstate is updated. Currently is broken code

         This is probably just how we're going to have to do it because
         React is annoying when it comes to arrays. It won't scan the whole
         thing to see if something has changed.
        */
        // setBoardState(boardState.map((mapRow, rowIndex) => {
        //     mapRow.map((square, colIndex) => {
        //         if (row === rowIndex && col === colIndex) {
        //             console.log("foudn match");
        //             square = "WP";
        //         }
        //         return square;
        //     })
        //     return mapRow;
        // }));


        // JANK
        let temp = bState;
        temp[y][x].pieceID = "BQ";          // sets the (y, x) that was clicked to queen
        setBoardState( temp );              // updates the actual board state
        setUpdateBoard( !updateBoard );       // triggers the app to re-render
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
                    <Board bState = {bState} pieceClicked = {pieceClicked}/>
                </div>
            </div>
        </div>
    );
};

export default App;
