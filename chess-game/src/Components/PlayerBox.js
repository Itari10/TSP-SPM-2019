import React from 'react';
import '../Style/PlayerBox.css';
import SurrenderButton from './SurrenderButton';


const PlayerBox = (props) => {

    return (
        <div className={determineClassName()}>
            <div className={"row"}>
                <div className={"col-sm-6 text-left"}>

                    <h2>{determineHeading()}</h2>
                </div>
                <div className={"col-sm-6 text-right"}>
                    <h2>Its a Timer bro</h2>
                </div>
            </div>
            <hr />
            <div className={"row height-adjust"}>
                <div className={"col-sm-12"} id={props.playerNumber} />
            </div>
            <hr />
            <div className={"row"}>
                <div className={"col-sm-12"}>
                    <SurrenderButton
                        disable =           {!props.isTurn}
                        triggerGameOver =   {props.triggerGameOver}
                    />
                </div>
            </div>
        </div>
    );

    // determines the className of the primary PlayerBox div based on states
    // this is used to set the background and border colors of the box
    function determineClassName(){
        if ( props.checkMate )              // checkmate / stalemate are top priority
            return "checkMate";
        else if ( props.staleMate )
            return "staleMate";
        else{
            if ( props.isTurn ){            // otherwise if it's the player's turn...
                if ( props.inCheck )
                    return "turnCheck";     // and they're in check..
                else
                    return "turn";          // or they're not
            }
            return "notTurn";               // or if not their turn at all
        }
    }

    // determines the displayed heading of the PlayerBox based on states
    function determineHeading(){
        let player = props.playerTitle;

        // these conditions will never be true at the same time
        let checkMate = (props.checkMate ? ": CHECKMATE" : "");
        let staleMate = (props.staleMate ? ": STALEMATE" : "");

        // will not display "CHECK" if state is checkmate or stalemate
        let check = (( !props.checkMate && !props.staleMate ) ? (props.inCheck ? ": CHECK" : "") : "");

        return player + checkMate + staleMate + check
    }
};

export default PlayerBox;