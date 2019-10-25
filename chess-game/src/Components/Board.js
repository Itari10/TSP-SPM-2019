import React from 'react';
import Square from './Square';

let curY = 0;

function boardRow(){
    let rowToReturn = [8];

    for (let i = 0; i < 8; i++) {
        rowToReturn.push(<Square x = {i} y = {curY}/>);
    }
    curY++;
    return rowToReturn;
}

const Board = (props) => {
    let entireBoard = [][8];

    return (
        <div className="board">
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
            <div className="row">
                {boardRow()}
            </div>
        </div>
    ); 
};

export default Board;