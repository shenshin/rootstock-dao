import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Web3Provider from './providers/Web3Provider';
import ProposalProvider from './providers/ProposalProvider';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <ProposalProvider>
          <App />
        </ProposalProvider>
      </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
