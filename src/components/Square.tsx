import React, { ReactNode } from 'react';
import AppContext from '../AppContextProvider';

interface SquareProps {
    x: number;
    y: number;
}

interface SquareState {
    
}

export class Square extends React.PureComponent <SquareProps, SquareState> {
    render(): ReactNode {
        const {
            x,
            y,
        } = this.props;
        const {
            board,
            playable,
        } =  this.context;
        const value = board.value(x, y);
        let style:any = {};
        if(board.winner && board.isWinningPoint(x, y)) {
            style.background = board.winner==='X' ? 'green' : 'red';
        }

        return (
            <td onClick={playable && value===null? this.context.choice(x,y) : null} style={style}>
                {value}
            </td>
        )
    }
}

Square.contextType = AppContext;