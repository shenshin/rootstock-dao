import { useContext, useState } from 'react';
import Web3Context from '../context/web3Context';
import getContracts from '../contracts/getContracts';

function Delegate() {
  const { address, provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [delegateTo, setDelegateTo] = useState<string>(address ?? '');

  const delegate = async () => {
    try {
      setErrorMessage('');
      const { voteToken } = getContracts(provider!);
      const delegateTx = await voteToken.delegate(delegateTo);
      setLoading(`Sending delegation transaction`);
      await delegateTx.wait();
      setLoading(`Delegation succeeded`);
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Delegate Voting Power</h1>
      <p>Your own wallet address is {address}</p>
      <label htmlFor="delegate-to">
        Delegate voting power to{' '}
        <input
          type="text"
          name="delegate-to"
          value={delegateTo}
          onChange={(e) => setDelegateTo(e.target.value)}
        />{' '}
      </label>
      <button onClick={delegate} type="button">
        delegate
      </button>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Delegate;
