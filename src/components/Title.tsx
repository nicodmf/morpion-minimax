import React, { ReactNode } from 'react';
import AppContext from '../AppContextProvider';

interface TitleProps {
}

interface TitleState {
    
}

export class Title extends React.PureComponent <TitleProps, TitleState> {
    render(): ReactNode {
        return (
            <div>
                <h1>Jouer au morpion contre l'algorithme minimax</h1>
            </div>
        )
    }
}

Title.contextType = AppContext;