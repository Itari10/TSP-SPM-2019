import React from 'react';
import { render, shallow, mount } from 'enzyme';    // enzyme assertion methods
import { expect } from 'chai';              // chai assertion methods
import App from '../Components/App';
import Board from '../Components/App';
import {Pieces} from '../Components/Board';
import {Players} from '../Components/Board';

/************************  FOR INTELLIJ USERS  **************************************
 *                                                                                  *
 *   To run these tests, make a 2nd NPM configuration  (NOT JEST)                   *
 *   Set the command to TEST instead of START  (you'll have to scroll down)         *
 *                                                                                  *
 *   TO MAKE INTELLIJ RECOGNIZE THE SYNTAX:                                         *
 *                                                                                  *
 *   File -->  Settings  -->  Languages and Frameworks -->                          *
 *   Javascript  -->  Libraries -->  Download  --> download jest, chai, and enzyme  *
 *                                                                                  *
 ************************************************************************************/

/************  BEFORE ANY OF THIS WORKS YOU WILL NEED TO:  **********************
 *                                                                               *
 *   npm install --save-dev jest                                                 *
 *   npm install --save-dev enzyme enzyme-adapter-react-16 react-test-renderer   *
 *   npm install chai                                                            *
 *                                                                               *
 *   npm test                // to run the actual tests                          *
 *                                                                               *
 *********************************************************************************/

//  TESTING GUIDE:
//  https://medium.com/@rossbulat/testing-in-react-with-jest-and-enzyme-an-introduction-99ce047dfcf8

//  ENZYME DOCUMENTATION:
//  https://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html

//  ENZYME SELECTORS TO USE WITH find()
//  https://airbnb.io/enzyme/docs/api/selector.html

//  CHAI DOCUMENTATION:
//  https://www.chaijs.com/api/bdd/#method_lengthof


// dummy test. if this one doesn't work we have major problems
describe('JEST ONLINE', () => {
    it('sums numbers', () => {
        expect(1 + 2).equals(3);
        expect(2 + 2).equals(4);
    });
});


// APP-LEVEL TESTS
describe('APP TESTS', () => {

    let app = null;         // wrapper for the App Component

    test('renders without crashing', () => {

        // this test WILL fail if <App /> doesn't render
        app = shallow(<App />);
    });

    test('loads the Board component', () => {
        expect(app.find('Board')).to.have.lengthOf(1);
    });

    // END TURN BUTTON WAS REMOVED
    // test('loads the End-Turn Button component', () => {
    //     expect(app.find('EndTurnBtn')).to.have.lengthOf(1);
    // });

    test('loads two PlayerBoxes component', () => {
        expect(app.find('PlayerBox')).to.have.lengthOf(2);
    });
});


// BOARD TESTS
describe('BOARD TESTS', () => {

    let app = mount(<App />);       // wrapper for the App Component
    let board = null;               // wrapper for the Board Component
    let boardDiv = null;            // wrapper for the actual board div inside Board Component

    test('found the board component', () => {
        board = app.find('Board');
        expect(board).to.have.lengthOf(1);
    });

    test('actual board div exists inside Board component', () => {
        boardDiv = board.find('div.board');
        expect(boardDiv).to.have.lengthOf(1);
    });

    test('exactly 8 row divs rendered', () => {
        let boardRows = boardDiv.find('div.boardRow');
        expect(boardRows).to.have.lengthOf(8);
    });

    // searches through the boardRow div and determines if there are 8
    // divs inside it, each with their own UNIQUE id
    test('each of the 8 divs is unique', () => {
        let currentRow = null;                                  // wrapper for current row is Squares being tested
        let rowsFound = 0;
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);
            expect(currentRow.type()).to.equal('div');
            expect(currentRow.key()).to.equal('bRow' + y);        // ensures the div has the expected unique id
            rowsFound++;
        }
        expect(rowsFound).to.equal(8);
    });

    // makes sure that each row contains 8 Squares
    // uniqueness is not tested yet
    test('each div contains 8 Squares', () =>{
        let currentRow = null;
        let squaresInRow = null;                            // counts Squares in each row
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);               // row divs are the children of the main boardDiv
            squaresInRow = currentRow.find('Square');
            expect(squaresInRow.length).to.equal(8);
            currentRow = null;
        }
    });

    // traverses the entire board and makes sure all 64 Squares
    // are found and they all have unique coordinates and ids.
    test('all 64 Squares are unique and have the correct coordinates', () => {
        let currentRow = null;
        let currentSquare = null;                                   // wrapper for current Square being tested
        let uniqueSquares = 0;                                      // counts each Square as it's found
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);                       // iterates over each Square in each row
            for ( let x = 0; x < 8; x++ ){
                currentSquare = currentRow.childAt(x);              // Squares are children of the boardRow div
                expect(currentSquare.name()).to.equal('Square');
                expect(currentSquare.key()).to.equal('Sq'+y+'.'+x);
                expect(currentSquare.prop('x')).to.equal(x);
                expect(currentSquare.prop('y')).to.equal(y);
                uniqueSquares++;
            }
        }
        expect(uniqueSquares).to.equal(64);
    });
});


// BOARD SETUP TESTS
describe('BOARD SETUP', () => {
    let app = mount(<App />);                       // wrapper for the App Component
    let board = app.find('Board');                  // wrapper for the Board Component
    let boardDiv = board.find('div.board');         // wrapper for the actual board div inside Board Component


    // white pieces
    test('white pieces are set up correctly', () => {
        expect( board.prop('bState')[7][0].pcType ).to.equal( Pieces.ROOK );
        expect( board.prop('bState')[7][1].pcType ).to.equal( Pieces.KNIGHT );
        expect( board.prop('bState')[7][2].pcType ).to.equal( Pieces.BISHOP );
        expect( board.prop('bState')[7][3].pcType ).to.equal( Pieces.KING );
        expect( board.prop('bState')[7][4].pcType ).to.equal( Pieces.QUEEN );
        expect( board.prop('bState')[7][5].pcType ).to.equal( Pieces.BISHOP );
        expect( board.prop('bState')[7][6].pcType ).to.equal( Pieces.KNIGHT );
        expect( board.prop('bState')[7][7].pcType ).to.equal( Pieces.ROOK );
        for ( let x = 0; x < 8; x++ ){
            expect( board.prop('bState')[7][x].pcOwner ).to.equal( Players.WHITE );
        }
    });

    // white pawns
    test('white pawns are set up correctly', () => {
        for ( let x = 0; x < 8; x++ ){
            expect( board.prop('bState')[6][x].pcType ).to.equal( Pieces.PAWN );
            expect( board.prop('bState')[6][x].pcOwner ).to.equal( Players.WHITE );
        }
    });

    // black pieces
    test('black pieces are set up correctly', () => {
        expect( board.prop('bState')[0][0].pcType ).to.equal( Pieces.ROOK );
        expect( board.prop('bState')[0][1].pcType ).to.equal( Pieces.KNIGHT );
        expect( board.prop('bState')[0][2].pcType ).to.equal( Pieces.BISHOP );
        expect( board.prop('bState')[0][3].pcType ).to.equal( Pieces.KING );
        expect( board.prop('bState')[0][4].pcType ).to.equal( Pieces.QUEEN );
        expect( board.prop('bState')[0][5].pcType ).to.equal( Pieces.BISHOP );
        expect( board.prop('bState')[0][6].pcType ).to.equal( Pieces.KNIGHT );
        expect( board.prop('bState')[0][7].pcType ).to.equal( Pieces.ROOK );
        for ( let x = 0; x < 8; x++ ){
            expect( board.prop('bState')[0][x].pcOwner ).to.equal( Players.BLACK );
        }
    });

    // black pawns
    test('black pawns are set up correctly', () => {
        for ( let x = 0; x < 8; x++ ){
            expect( board.prop('bState')[1][x].pcType ).to.equal( Pieces.PAWN );
            expect( board.prop('bState')[1][x].pcOwner ).to.equal( Players.BLACK );
        }
    });


    // Makes sure all the WHITE pieces are placed in the correct slots
    // and are displaying the correct images.
    test('WHITE pieces render the correct images', () => {
        let currentRow = null;
        let currentButton = null;                   // wrapper for button inside the Square

        // MAJOR PIECES
        currentRow = boardDiv.childAt(7);
        for ( let x = 0; x < 8; x++ ){
            currentButton = currentRow.childAt(x).childAt(0);
            switch (x){
                case 0: expect(currentButton.prop('style').backgroundImage).to.equal('url(rookWhite.png)');     break;
                case 1: expect(currentButton.prop('style').backgroundImage).to.equal('url(knightWhite.png)');   break;
                case 2: expect(currentButton.prop('style').backgroundImage).to.equal('url(bishopWhite.png)');   break;
                case 3: expect(currentButton.prop('style').backgroundImage).to.equal('url(kingWhite.png)');     break;
                case 4: expect(currentButton.prop('style').backgroundImage).to.equal('url(queenWhite.gif)');    break;
                case 5: expect(currentButton.prop('style').backgroundImage).to.equal('url(bishopWhite.png)');   break;
                case 6: expect(currentButton.prop('style').backgroundImage).to.equal('url(knightWhite.png)');   break;
                case 7: expect(currentButton.prop('style').backgroundImage).to.equal('url(rookWhite.png)');     break;
            }
        }

        // PAWNS
        currentRow = boardDiv.childAt(6);
        for ( let x = 0; x < 8; x++ ){
            currentButton = currentRow.childAt(x).childAt(0);
            expect(currentButton.prop('style').backgroundImage).to.equal('url(pawnWhite.png)');
        }
    });

    // Makes sure all the BLACK pieces are placed in the correct slots
    // and are displaying the correct images.
    test('BLACK pieces render the correct images', () => {
        let currentRow = null;
        let currentButton = null;                   // wrapper for button inside the Square

        // MAJOR PIECES
        currentRow = boardDiv.childAt(0);
        for ( let x = 0; x < 8; x++ ){
            currentButton = currentRow.childAt(x).childAt(0);
            switch (x){
                case 0: expect(currentButton.prop('style').backgroundImage).to.equal('url(rookBlack.png)');     break;
                case 1: expect(currentButton.prop('style').backgroundImage).to.equal('url(knightBlack.png)');   break;
                case 2: expect(currentButton.prop('style').backgroundImage).to.equal('url(bishopBlack.png)');   break;
                case 3: expect(currentButton.prop('style').backgroundImage).to.equal('url(kingBlack.png)');     break;
                case 4: expect(currentButton.prop('style').backgroundImage).to.equal('url(queenBlack.gif)');    break;
                case 5: expect(currentButton.prop('style').backgroundImage).to.equal('url(bishopBlack.png)');   break;
                case 6: expect(currentButton.prop('style').backgroundImage).to.equal('url(knightBlack.png)');   break;
                case 7: expect(currentButton.prop('style').backgroundImage).to.equal('url(rookBlack.png)');     break;
            }
        }

        // PAWNS
        currentRow = boardDiv.childAt(1);
        for ( let x = 0; x < 8; x++ ){
            currentButton = currentRow.childAt(x).childAt(0);
            expect(currentButton.prop('style').backgroundImage).to.equal('url(pawnBlack.png)');
        }
    });

    // Makes sure the center 4 rows of the board are not displaying any pieces
    test('center 4 rows are empty', () => {
        let currentRow = null;
        let currentButton = null;

        for ( let y = 2; y > 6; y++ ){
            currentRow = boardDiv.childAt(y);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                expect(currentButton.prop('style').backgroundImage).to.equal('url(null)');
            }
        }
    });
});

// GAME STATE TESTS
describe('GAME STATE TESTS', () => {

    let app = mount(<App />);                       // wrapper for the App Component
    let board = app.find('Board');                  // wrapper for the Board Component
    let boardDiv = board.find('div.board');         // wrapper for the actual board div inside Board Component
    let button = null;


    test('clicking a white pawn selects it', () => {
        clickSquareAt(6,0);
        expect( board.prop('bState')[6][0].isSelected ).to.equal( true );
        expect( board.prop('bState')[5][0].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][0].isHighlighted ).to.equal( true );
    });

    test('clicking it again de-selects it', () => {
        clickSquareAt(6,0);
        expect( board.prop('bState')[6][0].isSelected ).to.equal( false );
        expect( board.prop('bState')[5][0].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][0].isHighlighted ).to.equal( false );
    });

    test('clicking enemy pieces does nothing', () => {
        for ( let y = 0; y < 2; y++ ){
            for ( let x = 0; x < 8; x++ ){
                clickSquareAt(y,x);
                expect( board.prop('bState')[y][x].isSelected ).to.equal( false );
            }
        }
    });

    test('clicking empty squares does nothing', () => {
        for ( let y = 2; y < 6; y++ ){
            for ( let x = 0; x < 8; x++ ){
                clickSquareAt(y,x);
                expect( board.prop('bState')[y][x].isSelected ).to.equal( false );
            }
        }
    });


    // TODO: Simulate over 9000 actual games

     /*************************************  INSTRUCTIONS  *********************************************
     *                                                                                                 *
     *     Use clickSquareAt( y, x ) to simulate clicking the given square                             *
     *     then test the properties of the board squares against what we would expect them to be       *
     *     after clicking a given series of squares. You can simulate an entire game this way,         *
     *     testing all kinds of things along the way. The most tests we have the better.               *
     *                                                                                                 *
     *                                                                                                 *
     *     use        app = mount(<App />);                                                            *
     *                board = app.find('Board')                                                        *
     *                boardDiv = board.find('div.board');     if you want to re-render a new game      *
     *                                                                                                 *
     **************************************************************************************************/




















    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});







