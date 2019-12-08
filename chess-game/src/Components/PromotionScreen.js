import React from 'react';
import '../Style/PromotionScreen.css';
import PieceButton from './PieceButton';
import { Pieces } from './Board';

const PromotionScreen = (props) => {

    return (
        <div className="promotion">
            <h1>Promote to which piece?</h1>
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.ROOK} update={props.update} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.QUEEN} update={props.update} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.BISHOP} update={props.update} />
            <PieceButton isTheme={props.isTheme} ownedBy={props.pcOwner} pieceType={Pieces.KNIGHT} update={props.update} />
        </div>
    );
}

export default PromotionScreen;