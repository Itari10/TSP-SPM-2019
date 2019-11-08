import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './Components/App';


let boardMap = [];
let defaultRowOne = ["WR", "WK", "WB", "WKi", "WQ", "WB", "WK", "WR"];
let defaultRowTwo = ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"];
boardMap.push(defaultRowOne);
boardMap.push(defaultRowTwo);
for (let i = 0; i < 4; i++) {
    let blankRow = ["E","E","E","E","E","E","E","E"]
    boardMap.push(blankRow);
}
defaultRowOne = ["BP","BP","BP","BP","BP","BP","BP","BP"];
defaultRowTwo = ["BR","BK", "BB", "BKi", "BQ", "BB", "BK", "BR"];
boardMap.push(defaultRowOne);
boardMap.push(defaultRowTwo);

ReactDOM.render(<App boardMap={boardMap} />, document.getElementById('root'));