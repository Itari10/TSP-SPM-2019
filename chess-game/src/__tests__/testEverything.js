import React from 'react';                          // react
import { shallow, mount, render } from 'enzyme';    // enzyme assertion methods
import { expect } from 'chai';                      // chai assertion methods

import App from '../Components/App';        // allows access to App Component
import Board from '../Components/App';      // allows access to Board Component

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


//  describe(): An optional method to wrap a group of tests with.
//  describe() allows us to write some text that explains the nature of
//  the group of tests conducted within it. As you can see in the Terminal,
//  the describe() text acts as a header before the test results are shown.

//  it(): Similar in nature to describe()
//  it() allows us to write some text describing what a test should successfully achieve.
//  You may see that the test() method is used instead of it() throughout the Jest documentation,
//  and vice-versa in the Create React App documentation. Both are valid methods.

//  expect() and .toEqual(): Here we carry out the test itself.
//  The expect() method carries a result of a function, and toEqual(), in this case,
//  carries a value that expect() should match.


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

    test('loads the End-Turn Button component', () => {
        expect(app.find('EndTurnBtn')).to.have.lengthOf(1);
    });

    test('loads two PlayerBoxes component', () => {
        expect(app.find('PlayerBox')).to.have.lengthOf(2);
    });
});


// BOARD TESTS
describe('BOARD TESTS', () => {

    let app = mount(<App />);       // wrapper for the App Component
    let board = null;               // wrapper for the Board Component
    let boardDiv = null;            // wrapper for the board div inside Board
    let boardRows = null;           // wrapper for the 8 board rows
    let currentRow = null;          // wrapper for current board row being tested

    test('found the board component', () => {
        board = app.find('Board');
        expect(board).to.have.lengthOf(1);
    });

    test('actual board div exists inside Board component', () => {
        boardDiv = board.find('div.board');
        expect(boardDiv).to.have.lengthOf(1);
    });

    test('exactly 8 row divs rendered', () => {
        boardRows = boardDiv.find('div.boardRow');
        expect(boardRows).to.have.lengthOf(8);
    });

    // searches through the boardRow div and determines if there are 8
    // divs inside it, each with their own UNIQUE id
    test('each of the 8 divs is unique', () => {
        let rowsFound = 0;                                          // counts each row as it's found
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardRows.find('div.boardRow#br' + y);     // finds a boardRow with a div id matching its row index
            if ( currentRow !== null && currentRow.exists()  ){
                rowsFound++;
            }
            currentRow = null;                                      // resets to null to ensure we're not counting
        }                                                           // the same row twice
        expect(rowsFound).to.equal(8);
    });

    // TODO
    // test('determines that all 64 squares on the board are unique', () => {
    //
    // });
});


// SQUARE TESTS
describe('SQUARE TESTS', () => {
    // TODO
});


// PIECE TESTS
describe('PIECE TESTS', () => {
    // TODO
});


// PLAYERBOX TESTS
describe('PLAYERBOX TESTS', () => {
    // TODO
});





