import { useContext } from 'react';
import Web3Context from '../context/web3Context';

function Connect() {
  const { connect } = useContext(Web3Context);
  return (
    <div>
      <p>Connect your wallet</p>
      <button type="button" onClick={connect}>
        Connect wallet!
      </button>
    </div>
  );
}

export default Connect;
