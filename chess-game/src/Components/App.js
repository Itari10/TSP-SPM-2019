import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board from './Board';
import EndTurnBtn from './EndTurnBtn';

  class App extends React.Component{
    
    entireBoard = Array(8).fill(Array(8).fill(null));
    //state;
    
    constructor(props){
      super(props);
      //this.entireBoard = Array(8).fill(Array(8).fill(null));
      //this.state = null;
    }
    
    
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
                <Board board = {this.entireBoard}/>
            </div>
        );
    }
}



export default App;
