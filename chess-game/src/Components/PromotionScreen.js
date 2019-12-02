import React from 'react';
import '../Style/PromotionScreen.css';
import PieceButton from './PieceButton';
import { Pieces } from './Board';

const PromotionScreen = (props) => {

    return (
        <div className="promotion">
            <h1>Promote your guy here</h1>
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.ROOK} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.QUEEN} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.BISHOP} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.KNIGHT} />
        </div>
    );
}

export default PromotionScreen;