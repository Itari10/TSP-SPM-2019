import React from 'react';
import '../Style/PlayerBox.css';
import Timer from './Timer';
import SurrenderButton from './SurrenderButton';
import {Themes} from "./Square"


const PlayerBox = (props) => {

    return (
        <div className={determineClassName()}>
            <div className={"row"}>
                <div className={"col-sm-6 text-left"}>

                    <h2>{determineHeading()}</h2>
                </div>
                <div className={"col-sm-6 text-right"}>
                    <Timer
                        isTurn =            {props.isTurn}
                        isEndGame =         {props.isEndGame}
                        triggerGameOver =   {props.triggerGameOver}
                        isStalemate =       {props.staleMate}
                    />
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
        let player = determineTitle();

        // these conditions will never be true at the same time
        let checkMate = (props.checkMate ? ": CHECKMATE" : "");
        let staleMate = (props.staleMate ? ": STALEMATE" : "");

        // will not display "CHECK" if state is checkmate or stalemate
        let check = "";
        if ( !props.checkMate && !props.staleMate ){
            if ( props.inCheck )
                check = ": CHECK";
        }
        else{
            check = "";
        }

        return player + checkMate + staleMate + check
    }

    //determines the playerTitle
    function determineTitle() {
        switch ( props.theme ) {
            case Themes.TRADITIONAL: {
                switch ( props.playerNumber ) {
                    case "1":   return  "White";
                    case "2":   return  "Black";
                }
            }
            case Themes.DOGSandCATS: {
                switch ( props.playerNumber ) {
                    case "1":   return  "Dogs";
                    case "2":   return  "Cats";
                }
            }
            case Themes.POKEMON: {
                switch (props.playerNumber) {
                    case "1":
                        return "Mew";
                    case "2":
                        return "Mewtwo";
                }
            }
            case Themes.RWBY: {
                switch (props.playerNumber) {
                    case "1":
                        return "Light";
                    case "2":
                        return "Dark";
                }
            }
        }
    }
};

export default PlayerBox;