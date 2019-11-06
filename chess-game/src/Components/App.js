import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board from './Board';
import EndTurnBtn from './EndTurnBtn';

const App = (props) => {
    
    //State management
    const [updateBoard, setUpdateBoard] = React.useState(true);
    const [boardState, setBoardState] = React.useState(props.boardMap);
    const [playerOneTurn, setPlayerOneTurn] = React.useState(true);

    // primary chessboard 2D array, passed to Board through props
    let entireBoard = [];
    
    function changePiece(row, col) {

        /*
        This commented out code is just trying to make it so we don't
        have to force the re-render using updateboard everytime the 
        boardstate is updated. Currently is broken code
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
        let tempBoard = boardState;
        tempBoard[row][col] = "WP";
        setBoardState(tempBoard);
        setUpdateBoard(!updateBoard);
    }


    //changes the players turn in the game
    const setTurn = () => {
        setPlayerOneTurn(!playerOneTurn);
    };

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
                    <Board entireBoard = {entireBoard} boardMap={props.boardMap} changePiece={changePiece} />
                </div>
            </div>
        </div>
    );
};

export default App;
