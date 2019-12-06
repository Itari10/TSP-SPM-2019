import React from 'react';
import {determineImage} from './Square';
import '../Style/PromotionScreen.css';

const PieceButton = (props) => {
    return (
        <button
            style={{
                backgroundImage: 'url('+ determineImage(props) + ')'
            }}
            className="promotionImage"
            onClick={() => props.update(props.pieceType)}
        >
        </button>
    );
}

export default PieceButton;