import React, { ReactNode } from 'react';
import { Square } from './Square';
import AppContext from '../AppContextProvider';
import './Board.css'

function range(size:number, startAt:number = 0):ReadonlyArray<number> {
    const values: number[] = [];
    for(let i=startAt; i<size; i++) {
        values.push(i);
    }
    return values;
}

interface BoardProps {
}

interface BoardState {
}

export class Board extends React.PureComponent <BoardProps, BoardState> {
    render(): ReactNode {
        const {
            width,
            height,
            playable,
            won,
        } = this.context;

        return (
            <table style={{cursor: playable ? 'pointer' : 'initial'}}>
                <tbody>
                    {range(height).map((y, k1)=>(
                    <tr key={k1}>
                        {range(width).map((x, k2)=>(
                            <Square key={k2} x={x} y={y} />
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}

Board.contextType = AppContext;