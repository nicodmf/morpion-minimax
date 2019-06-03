import React, { ReactNode } from 'react';
import AppContext from '../AppContextProvider';

interface ScoreProps {
}

interface ScoreState {
    
}

export class Score extends React.PureComponent <ScoreProps, ScoreState> {
    render(): ReactNode {
        const {
            won,
            board,
            ended,
        } = this.context;

        return (
            <div>
                {!won?null:<h2>Partie gagnée par les {board.winner}</h2>}
                {!ended?null:<h2>Partie finie sur une égalité</h2>}
                {!(ended||won)?null:<button onClick={()=>this.context.restart()}>Recommencer</button>}
                {!(ended||won)?null:<button onClick={()=>this.context.restartWithRobot()}>Recommencer, le robot commence</button>}
            </div>
        )
    }
}

Score.contextType = AppContext;