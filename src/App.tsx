import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Board } from './components/Board';
import { AppProvider } from './AppContextProvider';
import { Title } from './components/Title';
import { Score } from './components/Score';
import { Help } from './components/Help';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="App">
        <Title />
        <Board />
        <Score />
        <Help />
      </div>
    </AppProvider>
  );
}

export default App;
