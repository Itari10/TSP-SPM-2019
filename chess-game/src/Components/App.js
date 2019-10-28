import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board from './Board';
import EndTurnBtn from './EndTurnBtn';

<<<<<<< HEAD
  class App extends React.Component{
    
=======
class App extends React.Component{

>>>>>>> Cleaned up code in Board. Removed unnecessary code from App
    render() {
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
                <EndTurnBtn onClick={setTurn}/>
                <PlayerBox playerNumber="1" />
                <PlayerBox playerNumber="2" />
                <Board />
            </div>
        );
    }
}

export default App;
