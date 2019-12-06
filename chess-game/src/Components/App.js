import React from 'react';
import '../Style/App.css';
import PlayerBox from './PlayerBox';
import ThemeDropDown from "./ThemeDropDown";
import Board, {initializeBoard} from './Board';
import {Pieces} from './Board';
import {Players} from './Board';
import {Themes} from './Square';
import EndGameScreen from './EndGameScreen';
import {determineImage} from './Square.js';
import PromotionScreen from './PromotionScreen';

// tuple for holding potential board moves.
class Move{
    constructor(y, x) {
        this.y = y;
        this.x = x;
        this.hasCapturable = false;         // this move will result in an en-passant piece capture
        this.capX = null;                   // X-coordinate of the capturable piece
        this.isCastleMove = false;          // this is a castling move
        this.castleSide = null;             // the direction of the castling move
    }
}

// directions enum
const Directions = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    DOWN_RIGHT: 4,
    DOWN_LEFT: 5,
    UP_RIGHT: 6,
    UP_LEFT: 7,
};

const App = (props) => {

    // REMEMBER: These states CANNOT be changed without using the corresponding SET methods.
    // Attempting to set them manually will NOT result in errors, but WILL cause unintended buggy behavior
    const [boardState, setBoardState] =         React.useState( initializeBoard() );
    const [currentPlayer, setCurrentPlayer] =   React.useState( Players.WHITE );
    const [updateBoard, setUpdateBoard] =       React.useState( true );             // call setUpdateBoard() to re-render
    const [selectedSquare, setSelectedSquare] = React.useState( [-1,-1] );          // [-1,-1] means "NOTHING SELECTED"
    const [highlightedSquares, setHighlights] = React.useState( [] );               // keeps track of currently highlighted squares
    const [capturableSquares, setCapturables] = React.useState( [] );               // squares that can be captured by en-passant
    const [castleRooks, setCastleRooks] =       React.useState( [] );               // rooks that can castle
    const [gameOver, setGameOver] =             React.useState( false );
    const [promote, setPromote] =               React.useState( false );
    const [getTheme, setTheme] =                React.useState( Themes.TRADITIONAL );         // Keeps track of current theme
    const [promotionPiece, setPromoPiece] =     React.useState([0,0]);

    // swaps theme
    function swapTheme(x){
        setTheme(x);
    }

    // swaps the player turn
    const swapTurn = () => {
        if (currentPlayer === Players.WHITE )
            setCurrentPlayer( Players.BLACK );
        else
            setCurrentPlayer( Players.WHITE );
    };

    // activates game-over functionality
    const endGame = () => {
        setGameOver(true);
    };


    const doPromotion = (chosenPiece) => {
        console.log(boardState);
        squareClicked(-2, chosenPiece);
    }

    const squareClicked = (y, x) => {

        // PRIMARY STATE VARIABLES
        let boardMap = boardState;              // array that contains the current board state
        let boardData = boardMap[7][8];         // holds key information for check / checkmate calculations
        let whiteCanMove = true;                // used in check/stale mate calculation
        let blackCanMove = true;                // used in check/stale mate calculations

        //For promotion
        if (y === -2) {
            boardMap[promotionPiece[0]][promotionPiece[1]].pcType = x;
            setBoardState(boardMap);
            setUpdateBoard(!updateBoard);
            setPromote(false);
            return;
        }

        // makes squares unclickable once the game is over
        if (boardData.whiteCheckMate ||
            boardData.blackCheckMate ||
            boardData.whiteStaleMate ||
            boardData.blackStaleMate ||
            promote){
            return;
        }


        // If you've click the square that's already selected...
        // deselect the square and unhighlight any highlighted squares
        if ( y === selectedSquare[0] && x === selectedSquare[1] ) {
            setSelectedSquare([-1,-1]);
            boardMap[y][x].isSelected = false;

            // de-highlights all highlighted squares that were
            // associated with the selected square
            deHighlightAllSquares();
        }

        // if you click on YOUR OWN piece...
        else if (boardMap[y][x].pcOwner === currentPlayer ) {

            // and nothing is selected...
            // then select that piece
            if ( selectedSquare[0] === -1 ) {
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // or if you already have a piece selected...
            // de-select it and select the new piece
            else{
                deHighlightAllSquares();
                boardMap[selectedSquare[0]][selectedSquare[1]].isSelected = false;
                setSelectedSquare( [y, x] );
                boardMap[y][x].isSelected = true;
            }

            // now highlight all possible moves for that selected piece
            switch ( boardMap[y][x].pcType ){
                case Pieces.ROOK: showRookMoves( y, x, true ); break;
                case Pieces.KNIGHT: showKnightMoves( y, x, true ); break;
                case Pieces.BISHOP: showBishopMoves( y, x, true ); break;
                case Pieces.QUEEN: showQueenMoves( y, x, true ); break;
                case Pieces.KING: showKingMoves( y, x, true ); break;
                case Pieces.PAWN: showPawnMoves( y, x, true ); break;
                default: console.log("ERROR: DEFAULT CASE REACHED IN squareClicked() movement highlighting");
            }
        }

        // Here a square is ALREADY SELECTED and you've clicked on one of the HIGHLIGHTED SQUARES
        // This is a successful move so the turn is swapped to the next player upon completion
        else if ( selectedSquare[0] !== -1 && boardMap[y][x].isHighlighted === true ){

            updatePieceListsNormalMove();               // updates each player's list of pieces

            if ( currentPlayer === Players.WHITE )      // clears ability to en-passant
                clearBlackEP();

            if ( currentPlayer === Players.BLACK )      // from any pawns that had it from last turn
                clearWhiteEP();

            // if a piece was captured, add it to the dungeon
            if (boardMap[y][x].pcType !== Pieces.EMPTY)
                addToDungeon(y, x);

            // move piece from selected square to clicked square
            boardMap[y][x].pcType =  boardMap[ selectedSquare[0] ][ selectedSquare[1] ].pcType;
            boardMap[y][x].pcOwner = boardMap[ selectedSquare[0] ][ selectedSquare[1] ].pcOwner;
            boardMap[y][x].hasMoved = boardMap[ selectedSquare[0] ][ selectedSquare[1] ].hasMoved;

            // clear the selected square
            boardMap[ selectedSquare[0] ][ selectedSquare[1] ].pcType = Pieces.EMPTY;
            boardMap[ selectedSquare[0] ][ selectedSquare[1] ].pcOwner = Players.NONE;
            boardMap[ selectedSquare[0] ][ selectedSquare[1] ].isSelected = false;
            boardMap[ selectedSquare[0] ][ selectedSquare[1] ].hasMoved = false;

            // EN-PASSANT LOGIC
            if ( boardMap[y][x].pcType === Pieces.PAWN ){

                // BLACK pawns
                if ( currentPlayer === Players.BLACK ) {

                    // player just double moved
                    if ( y === selectedSquare[0] + 2 ) {
                        if ( x > 0 &&
                            boardMap[y][x-1].pcType === Pieces.PAWN &&
                            boardMap[y][x-1].pcOwner === Players.WHITE){        // grants adjacent enemy pawns
                            boardMap[y][x-1].canEpRight = true;                 // up-right en-passant
                        }

                        if ( x < 7 &&
                            boardMap[y][x+1].pcType === Pieces.PAWN &&          // grants adjacent enemy pawns
                            boardMap[y][x+1].pcOwner === Players.WHITE){        // up-left en-passant
                            boardMap[y][x+1].canEpLeft = true;
                        }
                    }

                    // OR if the player just attacked using en-passant..
                    // removes the piece captured by the move
                    else if ( boardMap[y-1][x].isCapturable ) {
                        addToDungeon(y-1,x);
                        boardMap[y-1][x].pcType = Pieces.EMPTY;
                        boardMap[y-1][x].pcOwner = Players.NONE;

                        // removes captured piece from player's piece list
                        updatePieceListEpCapture();
                    }
                }

                // WHITE pawns
                else {
                    if ( y === selectedSquare[0] - 2 ) {
                        if ( x > 0 &&
                            boardMap[y][x-1].pcType === Pieces.PAWN &&
                            boardMap[y][x-1].pcOwner === Players.BLACK){
                            boardMap[y][x-1].canEpRight = true;
                        }
                        if ( x < 7 &&
                            boardMap[y][x+1].pcType === Pieces.PAWN &&
                            boardMap[y][x+1].pcOwner === Players.BLACK){
                            boardMap[y][x+1].canEpLeft = true;
                        }
                    }
                    else if ( boardMap[y+1][x].isCapturable ) {
                        addToDungeon(y+1,x);
                        boardMap[y+1][x].pcType = Pieces.EMPTY;
                        boardMap[y+1][x].pcOwner = Players.NONE;
                        updatePieceListEpCapture();
                    }
                }
            }

            // king-specific logic
            if ( boardMap[y][x].pcType === Pieces.KING ){

                // if a KING was just moved, updates its location
                if ( boardMap[y][x].pcType === Pieces.KING ) {
                    if (currentPlayer === Players.WHITE) {
                        boardData.wKingY = y;
                        boardData.wKingX = x;
                    }
                    else {
                        boardData.bKingY = y;
                        boardData.bKingX = x;
                    }
                }

                // RIGHT-CASTLING
                if ( x === selectedSquare[1] + 2 ){
                    boardMap[ selectedSquare[0] ][ 7 ].pcType = Pieces.EMPTY;
                    boardMap[ selectedSquare[0] ][ 7 ].pcOwner = Pieces.NONE;
                    boardMap[ selectedSquare[0] ][ 5 ].pcType = Pieces.ROOK;
                    boardMap[ selectedSquare[0] ][ 5 ].pcOwner = currentPlayer;
                    boardMap[ selectedSquare[0] ][ 5 ].hasMoved = true;

                    // updates rook's location on player's piece list
                    updatePieceListRightCastle();
                }

                // LEFT-CASTLING
                else if ( x === selectedSquare[1] - 2 ){
                    boardMap[ selectedSquare[0] ][ 0 ].pcType = Pieces.EMPTY;
                    boardMap[ selectedSquare[0] ][ 0 ].pcOwner = Pieces.NONE;
                    boardMap[ selectedSquare[0] ][ 3 ].pcType = Pieces.ROOK;
                    boardMap[ selectedSquare[0] ][ 3 ].pcOwner = currentPlayer;
                    boardMap[ selectedSquare[0] ][ 3 ].hasMoved = true;

                    // updates rook's location on player's piece list
                    updatePieceListLeftCastle();
                }
            }

            // tracks if the king or rook has moved for castling
            if ( boardMap[y][x].pcType === Pieces.KING || Pieces.ROOK )
                boardMap[y][x].hasMoved = true;

            // transforms pawns into queens if they reach the other side of the board
            if ((y === 0 || y === 7) && boardMap[y][x].pcType === Pieces.PAWN ){
                boardMap[y][x].pcType = Pieces.QUEEN;
                let temp = [y,x];
                setPromoPiece(temp);
                setPromote(true);
            }

            // calculates check, checkmate and stalemate conditions for the next player
            if ( currentPlayer === Players.WHITE ){
                blackCanMove = canBlackMove();
                boardData.blackCheck = ! squareIsSafe( boardData.bKingY, boardData.bKingX );
            }
            else if ( currentPlayer === Players.BLACK ){
                whiteCanMove = canWhiteMove();
                boardData.whiteCheck = ! squareIsSafe( boardData.wKingY, boardData.wKingX );
            }

            // determines CHECKMATE status
            if ( boardData.whiteCheck && ! whiteCanMove )
                boardData.whiteCheckMate = true;
            else if ( boardData.blackCheck && ! blackCanMove )
                boardData.blackCheckMate = true;

            // determines STALEMATE status
            if (( ! boardData.whiteCheck && ! whiteCanMove ) ||
                ( ! boardData.blackCheck && ! blackCanMove )){
                boardData.whiteStaleMate = true;
                boardData.blackStaleMate = true;
            }

            // determines DRAW status
            if ( determineDraw() ) {
                boardData.whiteStaleMate = true;
                boardData.blackStaleMate = true;
            }

            // GAME OVER
            // if ( boardData.whiteCheckMate )
            //     setGameOver(true);
            // if ( boardData.whiteCheckMate )
            //     setGameOver(true);

            boardMap[7][8] = boardData;                 // copies boardData into extra boardState slot
            setSelectedSquare( [-1,-1] );
            setUpdateBoard( ! updateBoard );            // updates the board so highlighting is correctly rendered
            deHighlightAllSquares();
            swapTurn();
        }
        setBoardState( boardMap );                      // updates the board state
        setUpdateBoard( ! updateBoard );                // triggers a re-render
        // END OF MAIN CLICK FUNCTION



        // ******************************************************************************************
        // ************************************ HELPER FUNCTIONS ************************************
        // ******************************************************************************************


        //adds the given piece to the dungeon
        function addToDungeon (y, x) {
            let node = document.createElement("img");
            let parameters = {
                isTheme: getTheme,
                ownedBy: boardMap[y][x].pcOwner,
                pieceType: boardMap[y][x].pcType
            };
            node.setAttribute("src", determineImage(parameters));
            node.setAttribute("class", "dungeonImage");
            let dungeon = "";
            if (currentPlayer === Players.BLACK)
                dungeon = document.getElementById("2");
            else
                dungeon = document.getElementById("1");
            dungeon.appendChild(node);
        }


        // CLEARS HIGHLIGHTING for all squares in the highlight list
        //    as well as all squares in the capturable pawns list
        //    as well as all rooks in the castleable rooks list
        function deHighlightAllSquares(){
            for ( let i = 0; i < highlightedSquares.length; i++ )
                boardMap[ highlightedSquares[i].y ][ highlightedSquares[i].x ].isHighlighted = false;
            for ( let i = 0; i < capturableSquares.length; i++ )
                boardMap[ capturableSquares[i].y ][ capturableSquares[i].x ].isCapturable = false;
            for ( let i = 0; i < castleRooks.length; i++ )
                boardMap[ castleRooks[i].y ][ castleRooks[i].x ].canCastle = false;
            setCastleRooks( [] );
            setHighlights( [] );
            setCapturables( [] );
        }

        // Iterates through a list of moves that a piece can make and
        // highlights them on the board. Updates the state to match
        function highlightGoodMoves( goodMoves ){
            for ( let i = 0; i < goodMoves.length; i++ ){
                boardMap[ goodMoves[i].y ][ goodMoves[i].x ].isHighlighted = true;
            }
            setHighlights( goodMoves );
        }

        // fades the pawns that will be captured by a given en-passant move
        function fadeCapturables( pawnList ){
            for ( let i = 0; i < pawnList.length; i++ ){
                boardMap[ pawnList[i].y ][ pawnList[i].x ].isCapturable = true;
            }
            setCapturables( pawnList );
        }

        // highlights the rooks that will be moved by a given castling move
        function highlightCastleRooks( rookList ){
            for ( let i = 0; i < rookList.length; i++ ){
                boardMap[ rookList[i].y ][ rookList[i].x ].canCastle = true;
            }
            setCastleRooks( rookList );
        }

        // determines if the currently player is in check
        function playerIsInCheck( player ){
            return ((player === Players.WHITE && boardData.whiteCheck) ||
                (player === Players.BLACK && boardData.blackCheck));
        }

        // determines if the current player's king is safe
        function playerKingIsSafe( player ){
            if ( player === Players.WHITE )
                return squareIsSafe( boardData.wKingY, boardData.wKingX );
            else
                return squareIsSafe( boardData.bKingY, boardData.bKingX );
        }

        // clears all black pawns of ability to En-Passant
        function clearBlackEP(){
            for ( let i = 0; i < boardData.blackPieces.length; i++ ){
                if ( boardMap[ boardData.blackPieces[i].y][ boardData.blackPieces[i].x ].pcType === Pieces.PAWN ) {
                    boardMap[ boardData.blackPieces[i].y ][ boardData.blackPieces[i].x ].canEpRight = false;
                    boardMap[ boardData.blackPieces[i].y ][ boardData.blackPieces[i].x ].canEpLeft = false;
                }
            }
        }

        // clears all white pawns of ability to En-Passant
        function clearWhiteEP(){
            for ( let i = 0; i < boardData.whitePieces.length; i++ ){
                if ( boardMap[ boardData.whitePieces[i].y][ boardData.whitePieces[i].x ].pcType === Pieces.PAWN ) {
                    boardMap[ boardData.whitePieces[i].y ][ boardData.whitePieces[i].x ].canEpRight = false;
                    boardMap[ boardData.whitePieces[i].y ][ boardData.whitePieces[i].x ].canEpLeft = false;
                }
            }
        }

        // removes a captured pawn from the given player's piece list
        function updatePieceListEpCapture(){
            if ( currentPlayer === Players.WHITE ){
                for (let i = 0; i < boardData.blackPieces.length; i++) {
                    if ( boardData.blackPieces[i].y === y+1 && boardData.blackPieces[i].x === x ) {
                        boardData.blackPieces.splice(i, 1);
                        return;
                    }
                }
            }
            else{
                for (let i = 0; i < boardData.whitePieces.length; i++) {
                    if ( boardData.whitePieces[i].y === y-1 && boardData.whitePieces[i].x === x ) {
                        boardData.whitePieces.splice(i, 1);
                        return;
                    }
                }
            }
        }

        // updates the rook's location inside the piece list after a right-castling move
        function updatePieceListRightCastle(){
            if ( currentPlayer === Players.WHITE ){
                for (let i = 0; i < boardData.whitePieces.length; i++) {
                    if (boardData.whitePieces[i].y === 7 &&
                        boardData.whitePieces[i].x === 7) {
                        boardData.whitePieces[i].y = 7;
                        boardData.whitePieces[i].x = 5;
                        break;
                    }
                }
            }
            else{
                for (let i = 0; i < boardData.blackPieces.length; i++) {
                    if (boardData.blackPieces[i].y === 0 &&
                        boardData.blackPieces[i].x === 7) {
                        boardData.blackPieces[i].y = 0;
                        boardData.blackPieces[i].x = 5;
                        break;
                    }
                }
            }
        }

        // updates the rook's location inside the piece list after a left-castling move
        function updatePieceListLeftCastle(){
            if ( currentPlayer === Players.WHITE ){
                for (let i = 0; i < boardData.whitePieces.length; i++) {
                    if (boardData.whitePieces[i].y === 7 &&
                        boardData.whitePieces[i].x === 0) {
                        boardData.whitePieces[i].y = 7;
                        boardData.whitePieces[i].x = 3;
                        break;
                    }
                }
            }
            else{
                for (let i = 0; i < boardData.blackPieces.length; i++) {
                    if (boardData.blackPieces[i].y === 0 &&
                        boardData.blackPieces[i].x === 0) {
                        boardData.blackPieces[i].y = 0;
                        boardData.blackPieces[i].x = 3;
                        break;
                    }
                }
            }
        }

        // updates the list of of coordinates for each player's pieces every new move.
        // these lists are used to increase efficiency when calculating checkmate / en-passant
        function updatePieceListsNormalMove(){

            // updates coordinates for the piece that moved
            if ( currentPlayer === Players.WHITE ) {
                for (let i = 0; i < boardData.whitePieces.length; i++) {
                    if (boardData.whitePieces[i].y === selectedSquare[0] &&
                        boardData.whitePieces[i].x === selectedSquare[1]) {
                        boardData.whitePieces[i].y = y;
                        boardData.whitePieces[i].x = x;
                        break;
                    }
                }

                // if a piece was captured
                // remove it from enemy's list
                if ( boardMap[y][x].pcType !== Pieces.EMPTY ){
                    for (let i = 0; i < boardData.blackPieces.length; i++) {
                        if ( boardData.blackPieces[i].y === y && boardData.blackPieces[i].x === x ) {
                            boardData.blackPieces.splice(i, 1);
                            break;
                        }                   // splice() removes the piece at index i from the list
                    }
                }
            }
            else {
                for (let i = 0; i < boardData.blackPieces.length; i++) {
                    if (boardData.blackPieces[i].y === selectedSquare[0] &&
                        boardData.blackPieces[i].x === selectedSquare[1]) {
                        boardData.blackPieces[i].y = y;
                        boardData.blackPieces[i].x = x;
                        break;
                    }
                }
                if ( boardData.pcType !== Pieces.EMPTY ){
                    for (let i = 0; i < boardData.whitePieces.length; i++) {
                        if ( boardData.whitePieces[i].y === y && boardData.whitePieces[i].x === x ) {
                            boardData.whitePieces.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        // determines if any of the DRAW conditions are present. each of these states
        // means the game will never end and neither player can ever achieve checkmate
        function determineDraw(){

            let piece1 = null;      // temp variables used to make code easier to read
            let piece2 = null;

            // king vs king
            if (boardData.whitePieces.length === 1 &&
                boardData.blackPieces.length === 1 ){
                return true;
            }

            // lone white king, black bishop + king
            if (boardData.whitePieces.length === 1 &&
                boardData.blackPieces.length === 2 ){
                piece1 = boardData.blackPieces[0];
                piece2 = boardData.blackPieces[1];
                if (boardMap[ piece1.y ][ piece1.x ].pcType === Pieces.BISHOP ||
                    boardMap[ piece2.y ][ piece2.x ].pcType === Pieces.BISHOP) {
                    return true;
                }
            }

            // lone black king, white bishop + king
            if (boardData.blackPieces.length === 1 &&
                boardData.whitePieces.length === 2 ){
                piece1 = boardData.whitePieces[0];
                piece2 = boardData.whitePieces[1];
                if (boardMap[ piece1.y ][ piece1.x ].pcType === Pieces.BISHOP ||
                    boardMap[ piece2.y ][ piece2.x ].pcType === Pieces.BISHOP) {
                    return true;
                }
            }

            // lone white king, black knight + king
            if (boardData.whitePieces.length === 1 &&
                boardData.blackPieces.length === 2 ){
                piece1 = boardData.blackPieces[0];
                piece2 = boardData.blackPieces[1];
                if (boardMap[ piece1.y ][ piece1.x ].pcType === Pieces.KNIGHT ||
                    boardMap[ piece2.y ][ piece2.x ].pcType === Pieces.KNIGHT) {
                    return true;
                }
            }

            // lone black king, white knight + king
            if (boardData.blackPieces.length === 1 &&
                boardData.whitePieces.length === 2 ){
                piece1 = boardData.whitePieces[0];
                piece2 = boardData.whitePieces[1];
                if (boardMap[ piece1.y ][ piece1.x ].pcType === Pieces.KNIGHT ||
                    boardMap[ piece2.y ][ piece2.x ].pcType === Pieces.KNIGHT) {
                    return true;
                }
            }


            // both players have king + bishop, both bishops are same color
            if (boardData.blackPieces.length === 2 &&
                boardData.whitePieces.length === 2 ){
                let blackBishop = null;
                let whiteBishop = null;
                for ( let i = 0; i < 2; i++){
                    if (boardMap[ boardData.whitePieces[i].y ][ boardData.whitePieces[i].x ].pcType === Pieces.BISHOP ) {
                        whiteBishop = boardData.whitePieces[i];
                        for ( let k = 0; k < 2; k++){
                            if (boardMap[ boardData.blackPieces[k].y ][ boardData.blackPieces[k].x ].pcType === Pieces.BISHOP ) {
                                blackBishop = boardData.blackPieces[k];

                                // calculates if bishops are on same color square
                                if (((blackBishop.y + blackBishop.x) % 2) ===
                                    ((whiteBishop.y + whiteBishop.x) % 2)) {
                                    return true;
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            return false;
        }


        // determines if there is at least ONE legal move the white player can make.
        // the result is used to determine if the player is in checkmate or stalemate on each turn
        function canWhiteMove(){
            let canMove = false;
            let piece = null;
            for (let i = 0; i < boardData.whitePieces.length; i++ ){
                piece = boardData.whitePieces[i];
                switch (boardMap[piece.y][piece.x].pcType) {
                    case Pieces.ROOK:   canMove = showRookMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.KNIGHT: canMove = showKnightMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.BISHOP: canMove = showBishopMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.QUEEN:  canMove = showQueenMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.KING:   canMove = showKingMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.PAWN:   canMove = showPawnMoves(piece.y,piece.x,false) > 0;   break;
                    default: console.log("ERROR: DEFAULT CASE REACHED IN canWhiteMove()");
                }
                if ( canMove )
                    break;
            }
            return canMove;
        }

        // determines if there is at least ONE legal move the black player can make.
        // the result is used to determine if the player is in checkmate or stalemate on each turn
        function canBlackMove(){
            let canMove = false;
            let piece = null;
            for (let i = 0; i < boardData.blackPieces.length; i++ ){
                piece = boardData.blackPieces[i];
                switch (boardMap[piece.y][piece.x].pcType) {
                    case Pieces.ROOK:   canMove = showRookMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.KNIGHT: canMove = showKnightMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.BISHOP: canMove = showBishopMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.QUEEN:  canMove = showQueenMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.KING:   canMove = showKingMoves(piece.y,piece.x,false) > 0;   break;
                    case Pieces.PAWN:   canMove = showPawnMoves(piece.y,piece.x,false) > 0;   break;
                    default: console.log("ERROR: DEFAULT CASE REACHED IN canBlackMove()");
                }
                if ( canMove )
                    break;
            }
            return canMove;
        }


        // Searches in a given direction for acceptable moves for a given piece
        // Direction is determined by parameters and loop constraints are set up accordingly
        // Adds moves to the goodMoves array based on safe moves that were found in the given direction
        function addDirectionalMoves(y, x, mainSquareOwner, goodMoves, direction){

            let yDir = null;            // amount to increment y by when searching
            let xDir = null;            // amount to increment x by when searching
            let yLimit = null;          // limit placed on y variable in loops
            let xLimit = null;          // limit placed on x variable in loops
            let kingIsSafe = false;     // is the current player's King being put in check by the move being tested?
            let squareType = null;      // current piece type of the square being considered
            let squareOwner = null;     // current owner of the square being considered

            switch (direction) {
                case Directions.DOWN:       yDir = 1;   yLimit = 8;    break;
                case Directions.UP:         yDir = -1;  yLimit = -1;   break;       // sets up logic variables based on
                case Directions.LEFT:       xDir = -1;  xLimit = -1;   break;       // direction being searched
                case Directions.RIGHT:      xDir = 1;   xLimit = 8;    break;
                case Directions.DOWN_RIGHT: yDir = 1;   xDir = 1;   yLimit = 8;   xLimit = 8;   break;
                case Directions.DOWN_LEFT:  yDir = 1;   xDir = -1;  yLimit = 8;   xLimit = -1;  break;
                case Directions.UP_RIGHT:   yDir = -1;  xDir = 1;   yLimit = -1;  xLimit = 8;   break;
                case Directions.UP_LEFT:    yDir = -1;  xDir = -1;  yLimit = -1;  xLimit = -1;  break;
                default: return;
            }

            // UP and DOWN
            if ( direction === Directions.UP || direction === Directions.DOWN ){

                // add moves in a the given direction until forced to stop
                for (let curY = y + yDir; (curY !== y + (8 * yDir)) && (curY !== yLimit); curY += yDir) {
                    squareType = boardMap[curY][x].pcType;
                    squareOwner = boardMap[curY][x].pcOwner;

                    if (boardMap[curY][x].pcOwner === mainSquareOwner)      // discard if you run into your own piece
                        break;

                    else {                                                  // otherwise...
                        boardMap[curY][x].pcType = Pieces.PAWN;
                        boardMap[curY][x].pcOwner = mainSquareOwner;        // temporarily make the move

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );       // make sure your king is still safe

                        boardMap[curY][x].pcType = squareType;
                        boardMap[curY][x].pcOwner = squareOwner;

                        if ( kingIsSafe ) {                                 // King is SAFE, add the move
                            goodMoves.push(new Move(curY, x));
                        }                                                   // King is NOT SAFE if you make this move.
                        else {                                              // if you're NOT in check, this move will put us
                            if ( ! playerIsInCheck( mainSquareOwner ) )     // IN check, so we stop looking for new move
                                break;
                        }                                           // however if you ARE in check, keep looking for a move
                        if ( squareType !== Pieces.EMPTY )          // unless this was an attack. if it was, we have to stop
                            break;
                    }                   // NOTE: this area of code results in "gaps" in potential moves a piece can make
                }                       // in a given direction when you're in check. This is INTENDED because sometimes the only move
            }                           // a piece make to save its king is several moves away from its current location.


            // LEFT and RIGHT
            else if ( direction === Directions.LEFT || direction === Directions.RIGHT ){

                for (let curX = x + xDir; (curX !== x + (8 * xDir)) && (curX !== xLimit); curX += xDir) {
                    squareType = boardMap[y][curX].pcType;
                    squareOwner = boardMap[y][curX].pcOwner;

                    if (boardMap[y][curX].pcOwner === mainSquareOwner)
                        break;

                    else {
                        boardMap[y][curX].pcType = Pieces.PAWN;
                        boardMap[y][curX].pcOwner = mainSquareOwner;

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );

                        boardMap[y][curX].pcType = squareType;
                        boardMap[y][curX].pcOwner = squareOwner;

                        if ( kingIsSafe ) {
                            goodMoves.push(new Move(y, curX));
                        }
                        else {
                            if ( ! playerIsInCheck( mainSquareOwner ) )
                                break;
                        }
                        if ( squareType !== Pieces.EMPTY )
                            break;
                    }
                }
            }

            // DIAGONALS
            else{
                for ( let curY = y + yDir, curX = x + xDir;
                      curY !== y + (8 * yDir) && curX !== x + (8 * xDir) &&
                      curY !== yLimit && curX !== xLimit; curY += yDir, curX += xDir){

                    squareType = boardMap[curY][curX].pcType;
                    squareOwner = boardMap[curY][curX].pcOwner;

                    if (boardMap[curY][curX].pcOwner === mainSquareOwner)
                        break;

                    else {
                        boardMap[curY][curX].pcType = Pieces.PAWN;
                        boardMap[curY][curX].pcOwner = mainSquareOwner;

                        kingIsSafe = playerKingIsSafe( mainSquareOwner );

                        boardMap[curY][curX].pcType = squareType;
                        boardMap[curY][curX].pcOwner = squareOwner;

                        if ( kingIsSafe ) {
                            goodMoves.push(new Move(curY, curX));
                        }
                        else {
                            if ( ! playerIsInCheck( mainSquareOwner ) )
                                break;
                        }
                        if ( squareType !== Pieces.EMPTY )
                            break;
                    }
                }
            }
            return goodMoves;
        }


        // This functions sends out "search" cursors in all directions away from the square
        // at the given Y, X coordinates and searches for pieces that can attack this square.
        // If the square is safe, TRUE is returned. FALSE otherwise.
        function squareIsSafe(y, x){

            let mainSquareOwner = boardMap[y][x].pcOwner;       // owner of the square whose safety is in question
            let squareBeingSearched = null;                     // current square being tested for a potential enemy

            // searches DOWN looking for danger
            for (let checkY = y + 1; checkY < 8; checkY++) {
                squareBeingSearched = boardMap[ checkY ][ x ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )      // search ran into your own piece.
                    break;                                                  // stop searching in this direction

                if (checkY === y + 1
                    && squareBeingSearched.pcType === Pieces.KING ) {       // ran into a NEARBY enemy king
                    return false;                                           // we're in danger
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||        // ran into an enemy queen or rook
                    (squareBeingSearched.pcType === Pieces.ROOK)) {         // we're in danger
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )          // we ran into something non-threatening
                    break;                                                  // stop searching in this direction
            }

            // searches UP looking for danger
            for (let checkY = y - 1; checkY > -1; checkY--) {
                squareBeingSearched = boardMap[ checkY ][ x ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkY === y - 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches RIGHT looking for danger
            for (let checkX = x + 1; checkX < 8; checkX++) {
                squareBeingSearched = boardMap[ y ][ checkX ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkX === x + 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches LEFT looking for danger
            for (let checkX = x - 1; checkX > -1; checkX--) {
                squareBeingSearched = boardMap[ y ][ checkX ];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if (checkX === x - 1 && squareBeingSearched.pcType === Pieces.KING) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.QUEEN) ||
                    (squareBeingSearched.pcType === Pieces.ROOK)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches UP-LEFT looking for danger
            for (let checkY = y-1, checkX = x-1; checkY > -1 && checkX > -1; checkY--, checkX--) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )      // search ran into your own piece.
                    break;                                                  // stop searching in this direction

                if ((checkY === y-1 && checkX === x-1) &&                   // pawns only can attack in the direction
                    (squareBeingSearched.pcType === Pieces.KING  ||         // they move, so need to check ownership
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.WHITE))) {       // ran into a NEARBY enemy pawn or King.
                    return false;                                           // we're in danger
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {        // ran into an enemy Bishop or Queen.
                    return false;                                           // we're in danger
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;                                                  // we ran into something non-threatening
            }                                                               // stop searching in this direction

            // searches UP-RIGHT looking for danger
            for (let checkY = y-1, checkX = x+1; checkY > -1 && checkX < 8; checkY--, checkX++) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y-1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.WHITE))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches DOWN-LEFT looking for danger
            for (let checkY = y+1, checkX = x-1; checkY < 8 && checkX > -1; checkY++, checkX--) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y+1 && checkX === x-1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.BLACK))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches DOWN-RIGHT looking for danger
            for (let checkY = y+1, checkX = x+1; checkY < 8 && checkX < 8; checkY++, checkX++) {
                squareBeingSearched = boardMap[checkY][checkX];

                if ( squareBeingSearched.pcOwner === mainSquareOwner )
                    break;

                if ((checkY === y+1 && checkX === x+1) &&
                    (squareBeingSearched.pcType === Pieces.KING  ||
                        (squareBeingSearched.pcType === Pieces.PAWN
                            && mainSquareOwner === Players.BLACK))) {
                    return false;
                }
                if ((squareBeingSearched.pcType === Pieces.BISHOP) ||
                    (squareBeingSearched.pcType === Pieces.QUEEN)) {
                    return false;
                }
                if ( squareBeingSearched.pcType !== Pieces.EMPTY )
                    break;
            }

            // searches for potential KNIGHT attacks
            let knightAttack = [];
            knightAttack.push( new Move(y-2,x+1) );
            knightAttack.push( new Move(y-2,x-1) );
            knightAttack.push( new Move(y+2,x+1) );
            knightAttack.push( new Move(y+2,x-1) );
            knightAttack.push( new Move(y+1,x+2) );
            knightAttack.push( new Move(y+1,x-2) );
            knightAttack.push( new Move(y-1,x+2) );
            knightAttack.push( new Move(y-1,x-2) );

            for ( let checkY, checkX, i = 0; i < knightAttack.length; i++ ){
                checkY = knightAttack[i].y;
                checkX = knightAttack[i].x;

                if (checkY < 0 || checkY > 7 )
                    continue;
                if (checkX < 0 || checkX > 7 )
                    continue;
                if ((boardMap[checkY][checkX].pcType === Pieces.KNIGHT) &&
                    (boardMap[checkY][checkX].pcOwner !== mainSquareOwner)) {
                    return false;
                }
            }
            return true;        // all searches for danger have been exhausted. Square is safe.
        }


        // *****************************************************************************
        // ******************************* KING MOVEMENT *******************************
        // *****************************************************************************
        function showKingMoves( y, x, highlight ) {

            let possibleMoves = [];         // all possible moves the king can make
            let safeMoves = [];             // list of moves the king can make without being put into check
            let castleRooks = [];           // list of rooks that can be castled by this king move
            let squareType = null;          // current piece type of the square being considered
            let squareOwner = null;         // current owner of the square being considered
            let move = null;                // current move being examined
            let castleMove = null;          // temp variable used in testing castling moves
            let kingOwner = null;           // owner of the pawn whose moves are being looked at

            for ( let yOffset = -1; yOffset < 2; yOffset++ ){             // adds 1 move in every direction
                for ( let xOffset = -1; xOffset < 2; xOffset++){          // skips the Square the king is already on
                    if ( yOffset === 0 && xOffset === 0 )
                        continue;
                    possibleMoves.push(new Move(y+yOffset,x+xOffset))
                }
            }

            // right castling
            if ( boardMap[y][x].hasMoved === false &&               // adds right castle if pre-conditions
                 boardMap[y][x+3].hasMoved === false &&             // are correct
                 boardMap[y][x+3].pcType === Pieces.ROOK &&
                 boardMap[y][x+2].pcType === Pieces.EMPTY &&
                 boardMap[y][x+1].pcType === Pieces.EMPTY ) {
                castleMove = new Move(y,x+2);
                castleMove.isCastleMove = true;
                castleMove.castleSide = 'R';
                possibleMoves.push( castleMove );
            }

            // left castling
            if ( boardMap[y][x].hasMoved === false &&               // adds left castle if pre-conditions
                boardMap[y][x-4].hasMoved === false &&              // are correct
                boardMap[y][x-4].pcType === Pieces.ROOK &&
                boardMap[y][x-3].pcType === Pieces.EMPTY &&
                boardMap[y][x-2].pcType === Pieces.EMPTY &&
                boardMap[y][x-1].pcType === Pieces.EMPTY ) {
                castleMove = new Move(y,x-2);
                castleMove.isCastleMove = true;
                castleMove.castleSide = 'L';
                possibleMoves.push( castleMove );
            }

            kingOwner = boardMap[y][x].pcOwner;
            boardMap[y][x].pcType = Pieces.EMPTY;           // temporarily "picks up" the king to simulate moves
            boardMap[y][x].pcOwner = Players.NONE;

            // test each move, remove any that aren't allowed
            for ( let i = 0; i < possibleMoves.length; i++ ) {
                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)                   // immediately discard if move is off board
                    continue;                                   // or collides with your own piece
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === kingOwner)
                    continue;

                // CASTLING MOVE-HIGHLIGHTING
                // This block makes sure any moves flagged as a "castling move" follow all rules
                // and do not endanger the king before being added to the safe moves list
                if ( move.isCastleMove ){
                    let xDir = null;
                    let xLimit = null;
                    let kingIsSafe = null;

                    if ((kingOwner === Players.WHITE && boardMap[7][8].whiteCheck ) ||      // cant castle if you're in check
                        (kingOwner === Players.BLACK && boardMap[7][8].blackCheck ))
                        continue;

                    if ( move.castleSide === 'R' ){                 // sets variables based on castle direction
                        xDir = 1;
                        xLimit = 7;
                    }
                    else if ( move.castleSide === 'L' ){
                        xDir = -1;
                        xLimit = 1;
                    }
                    for ( let curX = 4 + xDir; curX !== xLimit; curX += xDir ){
                        boardMap[y][curX].pcType = Pieces.KING;
                        boardMap[y][curX].pcOwner = kingOwner;

                        kingIsSafe = squareIsSafe( y, curX );                   // make sure king will NOT be in check
                                                                                // at any point along castling path
                        boardMap[y][curX].pcType = Pieces.EMPTY;
                        boardMap[y][curX].pcOwner = Players.NONE;
                        if ( ! kingIsSafe )
                            break;
                    }
                    if ( ! kingIsSafe )                             // if he is, discard this move
                        continue;

                    // castling move is good
                    // add move / rook highlighting
                    if ( move.castleSide === 'R' ){
                        if ( kingOwner === Players.WHITE )
                            castleRooks.push( new Move(7,7) );
                        else
                            castleRooks.push( new Move(0,7) );
                    }
                    else{
                        if ( kingOwner === Players.WHITE )
                            castleRooks.push( new Move(7,0) );
                        else
                            castleRooks.push( new Move(0,0) );
                    }
                    safeMoves.push( move );
                }

                // all other non-castling moves
                else{
                    squareType = boardMap[move.y][move.x].pcType;
                    squareOwner = boardMap[move.y][move.x].pcOwner;
                    boardMap[move.y][move.x].pcType = Pieces.KING;      // temporarily make the move
                    boardMap[move.y][move.x].pcOwner = kingOwner;

                    if ( squareIsSafe( move.y, move.x ))                // checks if the king is still safe if he moves here
                        safeMoves.push(move);                           // if so, add it to his list of safe moves

                    boardMap[move.y][move.x].pcType = squareType;
                    boardMap[move.y][move.x].pcOwner = squareOwner;
                }
            }

            boardMap[y][x].pcType = Pieces.KING;
            boardMap[y][x].pcOwner = kingOwner;         // tests are complete, put the king back down

            if ( highlight ) {
                highlightGoodMoves(safeMoves);          // and highlight his safe moves
                highlightCastleRooks(castleRooks);      // and highlight any rooks that he will castle
            }

            return safeMoves.length;
        }


        // *****************************************************************************
        // ******************************* PAWN MOVEMENT *******************************
        // *****************************************************************************
        function showPawnMoves( y, x, highlight ) {

            let possibleMoves = [];         // all theoretical moves the knight can make
            let goodMoves = [];             // moves that are allowed
            let capturables = [];           // squares that will be captured by en-passant
            let move = null;                // current move being tested
            let squareType = null;          // piece type of the square being considered
            let squareOwner = null;         // owner of the square being considered
            let kingIsSafe = false;         // whether the current player's king being put in check by the current move
            let pawnOwner = null;           // owner of the pawn whose moves are being looked at

            pawnOwner = boardMap[y][x].pcOwner;

            // BLACK pawn moves
            if (pawnOwner === Players.BLACK) {
                possibleMoves.push( new Move(y+1,x+1) );            // diagonal moves. these include regular
                possibleMoves.push( new Move(y+1,x-1) );            // pawn-attacks as well as en-passant attacks

                for (let curY = y + 1; curY <= y + 2 && curY < 8; curY++) {     // adds two forward moves
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)              // until a collision occurs
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }

            // WHITE pawn moves
            else {
                possibleMoves.push( new Move(y-1,x+1) );
                possibleMoves.push( new Move(y-1,x-1) );

                for (let curY = y - 1; curY >= y - 2 && curY > -1; curY--) {
                    if (boardMap[curY][x].pcType !== Pieces.EMPTY)
                        break;
                    possibleMoves.push(new Move(curY, x))
                }
            }

            boardMap[y][x].pcType = Pieces.EMPTY;               // temporarily "picks up" the piece for
            boardMap[y][x].pcOwner = Players.NONE;              // simulate different moves

            // test each move, remove any that aren't allowed
            for (let i = 0; i < possibleMoves.length; i++) {
                move = possibleMoves[i];

                if (move.x > 7 || move.x < 0)
                    continue;                           // discard if move is off the board
                if (move.y > 7 || move.y < 0)
                    continue;
                if (move.y === y + 2 && y !== 1)        // discard double moves if not on starting row
                    continue;
                if (move.y === y - 2 && y !== 6)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === pawnOwner)     // discard if attacking your own piece
                    continue;

                // if you're white and CANNOT en-passant...
                // AND there is NOT a black piece to your diagonal, then discard this move
                if ((pawnOwner === Players.WHITE && boardMap[move.y][move.x].pcOwner !== Players.BLACK) &&
                    ((boardMap[y][x].canEpRight === false && move.x === x+1) ||
                     (boardMap[y][x].canEpLeft === false && move.x === x-1))){
                        continue;
                }

                // if you're black and CANNOT en-passant...
                // AND there is NOT an enemy piece to your diagonal, then discard this move
                if ((pawnOwner === Players.BLACK && boardMap[move.y][move.x].pcOwner !== Players.WHITE) &&
                     ((boardMap[y][x].canEpRight === false && move.x === x+1) ||
                      (boardMap[y][x].canEpLeft === false && move.x === x-1))){
                        continue;
                }

                // adds capturable flag to en-passant moves, if any
                if (boardMap[y][x].canEpRight === true && move.x === x+1) {
                    move.hasCapturable = true;
                    move.capX = x+1;
                }
                else if (boardMap[y][x].canEpLeft === true && move.x === x-1) {
                    move.hasCapturable = true;
                    move.capX = x-1;
                }

                squareType = boardMap[move.y][move.x].pcType;
                squareOwner = boardMap[move.y][move.x].pcOwner;
                boardMap[move.y][move.x].pcType = Pieces.PAWN;          // temporarily make the move
                boardMap[move.y][move.x].pcOwner = pawnOwner;

                if ( move.hasCapturable ){                                  // and if the move involves en-passant
                    if ( pawnOwner === Players.WHITE ){                     // make sure the captured piece
                        boardMap[y][move.capX].pcType = Pieces.EMPTY;       // is simulated to be removed as well
                        boardMap[y][move.capX].pcOwner = Players.NONE;
                    }
                    else{
                        boardMap[y][move.capX].pcType = Pieces.EMPTY;
                        boardMap[y][move.capX].pcOwner = Players.NONE;
                    }
                }

                kingIsSafe = playerKingIsSafe( pawnOwner );                 // makes sure king is safe if you move here

                if ( move.hasCapturable ){
                    if ( pawnOwner === Players.WHITE ){
                        boardMap[y][move.capX].pcType = Pieces.PAWN;        // replace any captured pieces
                        boardMap[y][move.capX].pcOwner = Players.BLACK;
                    }
                    else{
                        boardMap[y][move.capX].pcType = Pieces.PAWN;
                        boardMap[y][move.capX].pcOwner = Players.WHITE;
                    }
                }

                boardMap[move.y][move.x].pcType = squareType;
                boardMap[move.y][move.x].pcOwner = squareOwner;

                // king is safe, add the move
                if (kingIsSafe) {
                    goodMoves.push(new Move( move.y, move.x ));
                    if ( move.hasCapturable )                           // add any en-passant capturables
                        capturables.push(new Move( y, move.capX ))      // associated with this move
                }
                else {                                          // King is NOT SAFE if you make this move.
                    if ( ! playerIsInCheck( pawnOwner ) )       // if you're NOT in check, this move will put us
                        break;                                  // IN check, so we stop looking for new moves
                    else
                        continue;                           // however if you ARE in check, keep testing moves
                }                                           // that could save your King unless we've hit something
            }

            boardMap[y][x].pcType = Pieces.PAWN;
            boardMap[y][x].pcOwner = pawnOwner;

            if (highlight) {
                highlightGoodMoves(goodMoves);          // highlights places the pawn can MOVE
                fadeCapturables(capturables);           // highlights pieces that will be captured by en-passant
            }

            return goodMoves.length;
        }


        // *******************************************************************************
        // ******************************* KNIGHT MOVEMENT *******************************
        // *******************************************************************************
        function showKnightMoves( y, x, highlight ) {

            let possibleMoves = [];         // all theoretical moves the knight can make
            let goodMoves = [];             // moves that are allowed
            let move = null;                // current move being tested
            let squareType = null;          // piece type of the square being considered
            let squareOwner = null;         // owner of the square being considered
            let kingIsSafe = false;         // whether the current player's king being put in check by the current move
            let knightOwner = null;         // owner of the knight whose moves are being looked at

            possibleMoves.push( new Move(y-2,x+1) );
            possibleMoves.push( new Move(y-2,x-1) );
            possibleMoves.push( new Move(y+2,x+1) );
            possibleMoves.push( new Move(y+2,x-1) );
            possibleMoves.push( new Move(y+1,x+2) );
            possibleMoves.push( new Move(y+1,x-2) );
            possibleMoves.push( new Move(y-1,x-2) );
            possibleMoves.push( new Move(y-1,x+2) );

            knightOwner = boardMap[y][x].pcOwner;
            boardMap[y][x].pcType = Pieces.EMPTY;                   // temporarily "picks up" the piece to
            boardMap[y][x].pcOwner = Players.NONE;                  // simulate different moves

            // test each move, remove any that aren't allowed
            for (let i = 0; i < possibleMoves.length; i++) {
                move = possibleMoves[i];

                if (move.y > 7 || move.y < 0)               // immediately discard if move is off board
                    continue;                               // or collides with your own piece
                if (move.x > 7 || move.x < 0)
                    continue;
                if (boardMap[move.y][move.x].pcOwner === knightOwner)
                    continue;

                squareType = boardMap[move.y][move.x].pcType;
                squareOwner = boardMap[move.y][move.x].pcOwner;
                boardMap[move.y][move.x].pcType = Pieces.KNIGHT;        // temporarily make the move
                boardMap[move.y][move.x].pcOwner = knightOwner;

                kingIsSafe = playerKingIsSafe( knightOwner );           // makes sure king is safe if you move here

                boardMap[move.y][move.x].pcType = squareType;
                boardMap[move.y][move.x].pcOwner = squareOwner;

                if (kingIsSafe) {                                       // king is SAFE, add the move
                    goodMoves.push(new Move(move.y, move.x));
                }
                else {                                              // King is NOT SAFE if you make this move.
                    if ( ! playerIsInCheck( knightOwner ) )         // if you're NOT in check, this move will put us
                        break;                                      // IN check, so stop looking for new moves
                    else
                        continue;               // however if you ARE in check, keep testing moves
                }                               // that could save your King
            }

            boardMap[y][x].pcType = Pieces.KNIGHT;
            boardMap[y][x].pcOwner = knightOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }


        // *******************************************************************************
        // ******************************* BISHOP MOVEMENT *******************************
        // *******************************************************************************
        function showBishopMoves( y, x, highlight ) {
            let goodMoves = [];
            let bishopOwner = boardMap[y][x].pcOwner;           // owner of the bishop whose moves are being looked at

            boardMap[y][x].pcType = Pieces.EMPTY;               // temporary "picks up" the piece for
            boardMap[y][x].pcOwner = Players.NONE;              // king check-avoidance testing

            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.UP_RIGHT);
            goodMoves = addDirectionalMoves(y,x, bishopOwner, goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.BISHOP;              // places piece back down after all
            boardMap[y][x].pcOwner = bishopOwner;               // safe moves are found

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;                    // for checkmate calculations
        }


        // *****************************************************************************
        // ******************************* ROOK MOVEMENT *******************************
        // *****************************************************************************
        function showRookMoves( y, x, highlight ) {
            let goodMoves = [];
            let rookOwner = boardMap[y][x].pcOwner;

            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.DOWN);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.UP);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.LEFT);
            goodMoves = addDirectionalMoves(y,x, rookOwner, goodMoves, Directions.RIGHT);

            boardMap[y][x].pcType = Pieces.ROOK;
            boardMap[y][x].pcOwner = rookOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }


        // ******************************************************************************
        // ******************************* QUEEN MOVEMENT *******************************
        // ******************************************************************************
        function showQueenMoves( y, x, highlight ) {
            let goodMoves = [];
            let queenOwner = boardMap[y][x].pcOwner;

            boardMap[y][x].pcType = Pieces.EMPTY;
            boardMap[y][x].pcOwner = Players.NONE;

            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.LEFT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.RIGHT);

            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN_RIGHT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.DOWN_LEFT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP_RIGHT);
            goodMoves = addDirectionalMoves(y,x, queenOwner, goodMoves, Directions.UP_LEFT);

            boardMap[y][x].pcType = Pieces.QUEEN;
            boardMap[y][x].pcOwner = queenOwner;

            if (highlight)
                highlightGoodMoves( goodMoves );

            return goodMoves.length;
        }
    };


    // renders the game
    return (
        <div className="App">
            <div className="Header">
                <h1>CHESS</h1>
            </div>
            <div className="col-sm-4">
                <ThemeDropDown theme={getTheme} setFunc={swapTheme}/>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <PlayerBox
                        playerTitle =       "BLACK"
                        isTurn =            {currentPlayer === Players.BLACK}
                        triggerGameOver =   {endGame}
                        inCheck =           {boardState[7][8].blackCheck}
                        checkMate =         {boardState[7][8].blackCheckMate}
                        staleMate =         {boardState[7][8].blackStaleMate}
                        playerNumber =      {"2"}
                        isEndGame =         {gameOver}
                    />
                    <div className="spacer"/>
                    <PlayerBox
                        playerTitle =       "WHITE"
                        isTurn =            {currentPlayer === Players.WHITE}
                        triggerGameOver =   {endGame}
                        inCheck =           {boardState[7][8].whiteCheck}
                        checkMate =         {boardState[7][8].whiteCheckMate}
                        staleMate =         {boardState[7][8].whiteStaleMate}
                        playerNumber =      {"1"}
                        isEndGame =         {gameOver}
                    />
                </div>
                <div className="col-sm-8">
                    <Board
                        bState =            {boardState}
                        pieceClicked =      {squareClicked}
                        theme =             {getTheme}
                    />
                </div>
            </div>
            {gameOver &&
            <EndGameScreen winner={(currentPlayer === 2) ? "White" : "Black"} />
            }
            {promote &&
            <PromotionScreen isTheme={getTheme} pcOwner={(currentPlayer === 2) ? Players.WHITE : Players.BLACK} update={doPromotion} />
            }
        </div>
    );
};

// deprecated End-Turn Button component
//
// <div className="row">
//    <EndTurnBtn onClick={swapTurn}/>
// </div>*/}

export default App;
