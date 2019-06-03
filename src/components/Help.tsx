import React, { ReactNode } from 'react';
import AppContext from '../AppContextProvider';

interface HelpProps {
}

interface HelpState {
    
}

export class Help extends React.PureComponent <HelpProps, HelpState> {
    render(): ReactNode {
        return (
            <div className="help">
                <p>
                    Ce mort pion est une mise en oeuvre de l'algorythme minimax sans limite de profondeur.<br />
                    Le nombre d'itération de l'algorythme suit exponentiellement le nombre de case vide
                    (visible dans l'inspecteur) :
                    <ul>
                        <li>~65000 par case si le robot commence (9 cases vides)</li>
                        <li>~7000 par case au deuxième coup</li>
                        <li>~180 par case au troisième coup</li>
                    </ul>
                    Afin de limiter le temps de réponse, seule trois cases sont laissées au
                    premier coup au robot s'il commence (le centre, un angle, un milieu extérieur).
                    Il choisi toujours le centre haut.
                </p>
                <p>
                    Le jeu a été développé pour une prise en charge de grille plus importante, 
                    mais au regard des temps de résolution (plusieur dizaines par secondes pour 
                    des grilles de 30 cases), seule la version à 9 cases est mise en ligne.
                </p>
                <p>
                    Dans cette configurations, le robot et l'homme s'ils ne font aucune erreur 
                    ne gagnent jamais. Je vous laisse tester et me prévenir si vous réussissez à 
                    vaincre l'ordinateur.
                </p>
            </div>
        )
    }
}

Help.contextType = AppContext;