import { useContext, useState } from 'react';
import { ethers } from 'ethers';
import Web3Context from '../context/web3Context';
import getContracts from '../contracts/getContracts';

function Enfranchisement() {
  const { address, provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<number>(10);

  const wrapTokens = async () => {
    try {
      const { rif, voteToken } = getContracts(provider);
      const rifDecimals = await rif.decimals();
      const tokensToWrap = ethers.BigNumber.from(tokenAmount).mul(
        ethers.BigNumber.from(10).pow(rifDecimals),
      );
      // tx 1: rif -> rifVote approval
      const approveTx = await rif.approve(voteToken.address, tokensToWrap);
      setLoading(`Sending tx ${approveTx.hash}`);
      await approveTx.wait();
      // tx 2: mint rifVote tokens
      const depositTx = await voteToken.depositFor(address!, tokensToWrap);
      setLoading(`Sending tx ${depositTx.hash}`);
      await depositTx.wait();
      // tx 3: delegate voting power
      const delegateTx = await voteToken.delegate(address!);
      setLoading(`Sending tx ${delegateTx.hash}`);
      await delegateTx.wait();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading('');
    }
  };
  return (
    <div>
      <h1>Enfranchisement</h1>
      <label htmlFor="rif-token-amount">
        Enter RIF token amount
        <input
          value={tokenAmount}
          type="number"
          name="rif-token-amount"
          min={1}
          step={1}
          onChange={(e) => setTokenAmount(+e.target.value)}
        />
      </label>
      <button onClick={wrapTokens} type="button">
        wrap
      </button>
      {loading && <p>{loading}</p>}
    </div>
  );
}

export default Enfranchisement;
