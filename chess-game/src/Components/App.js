import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import Board from './Board';

class App extends React.Component{

    render() {
        return (
            <div className="App">
                <div className="Header">
                    <h1>CHESS</h1>
                </div>
                <PlayerBox playerNumber="1" />
                <PlayerBox playerNumber="2" />
                <Board />
            </div>
        );
    }
}

export default App;
