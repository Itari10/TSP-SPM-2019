import React from 'react';
import '../Style/Square.css';
import dogtest2 from '../Assets/dogtest2.png';
import tree from '../Assets/tree.jpg';
import test from '../Assets/test.png';
import bishopWhite from '../Assets/bishopWhite.png';
import bishopBlack from '../Assets/bishopBlack.png';
import rookWhite from '../Assets/rookWhite.png';
import rookBlack from '../Assets/rookBlack.png';

/**
 Square should be aware of it's coordinates
 whether or not it's selected
 and whether or not it's highlighted

 PROPS
 key:            unused unique identifier so that we'd stop getting React warnings
 y:              Y coordinate on the board and inside the main 2D array
 x:              X coordinate on the board and inside the main 2D array
 piece:          current piece "on" the square
 isHighlighted   whether or not the given square is currently highlighted

 STATE
 isSelected:      needs to be set to false when another square isSelected
**/

class Square extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            piece: true
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.piece !== this.props.piece) {
            this.setState({
                piece: !this.state.piece
            })
        }
    }
    
    determineImage() {
        switch (this.props.piece) {
            case "WB":
                return bishopWhite;
            case "WK":
                return tree;
            case "WR":
                return rookWhite;
            case "WKi":
                return test;
            case "WQ":
                return dogtest2;
            case "WP":
                return tree;
            case "BB":
                return bishopBlack;
            case "BK":
                return tree;
            case "BR":
                return rookBlack;
            case "BKi":
                return test;
            case "BQ":
                return dogtest2;
            case "BP":
                return tree;
            default:
                return null;
        }
    }

    render() {
        return (
            <button 
                className={"square"} 
                style={{backgroundImage: 'url('+ this.determineImage() + ')'}} 
                onClick={()=>{this.props.onClick(this.props.y, this.props.x)}} 
            />
        );
    }
};

export default Square;