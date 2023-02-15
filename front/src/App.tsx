import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Web3Context from './context/web3Context';
import Navigation from './components/Navigation';
import Connect from './components/Connect';
import Delegate from './components/Delegate';
import Propose from './components/Propose';
import Vote from './components/Vote';
import State from './components/State';
import Execute from './components/Execute';
import './App.css';

function App() {
  const { address } = useContext(Web3Context);

  if (!address)
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Connect />} />
      </Routes>
    );
  return (
    <div className="app-container">
      <Navigation />
      <Routes>
        <Route path="*" element={<Navigate to="propose" />} />
        <Route path="delegate" element={<Delegate />} />
        <Route path="propose" element={<Propose />} />
        <Route path="vote" element={<Vote />} />
        <Route path="state" element={<State />} />
        <Route path="execute" element={<Execute />} />
      </Routes>
    </div>
  );
}

export default App;
