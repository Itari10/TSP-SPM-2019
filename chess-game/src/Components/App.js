import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board from './Board';
import EndTurnBtn from './EndTurnBtn';

const App = (props) => {

  //state of players turn in game
  const [playerOneTurn, setPlayerOneTurn] = React.useState(true);
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
                <PlayerBox playerNumber="1" isTurn={playerOneTurn} />
                <div className="spacer" />
                <PlayerBox playerNumber="2" isTurn={!playerOneTurn} />
            </div>
            <div className="col-sm-8">
                <Board />
            </div>
        </div>
    </div>
    );
}

export default App;
