import React from 'react';
import './App.css';
import PlayerBox from './PlayerBox';

function App() {
  return (
    <div className="App">
      <div className="Header">
        <h1>CHESS</h1>
      </div>
      <PlayerBox playerNumber="1" />
      <PlayerBox playerNumber="2" />
    </div>
  );
}

export default App;
