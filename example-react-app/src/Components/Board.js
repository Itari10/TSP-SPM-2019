import React from 'react';
import Square from './Square';

const Board = (props) => {
    let someList = [];
    for (let i = 0; i < 8; i++) {
        someList.push(<Square />);
    }
    return (
        <div className="board">
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
            <div className="row">
                {someList}
            </div>
        </div>
    ); 
};

export default Board;