import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Web3Context from './context/web3Context';
import Navigation from './components/Navigation';
import Connect from './components/Connect';
import Enfranchisement from './components/Enfranchisement';
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
        <Route path="*" element={<Navigate to="enfranchisement" />} />
        <Route path="enfranchisement" element={<Enfranchisement />} />
      </Routes>
    </div>
  );
}

export default App;
