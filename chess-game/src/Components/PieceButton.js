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
        >
        </button>
    );
}

export default PieceButton;