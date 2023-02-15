import { useContext, useState } from 'react';
import { utils } from 'ethers';
import { Web3Context } from '../context/web3Context';
import { ProposalContext } from '../context/proposalContext';
import getContracts from '../contracts/getContracts';
import './Propose.css';

function Propose() {
  const { address, provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { proposals, setProposals } = useContext(ProposalContext);
  // address to send RBTC to on successful proposal voting
  const [target, setTarget] = useState<string>(address ?? '');
  // RBTC amount to send on successful proposal voting
  const [amount, setAmount] = useState<string>('0.000001');
  // proposal description
  const [description, setDescription] = useState<string>('');

  const propose = async () => {
    try {
      setErrorMessage('');
      // here can be some validation of proposal parameters
      // e.g. the description should be unique
      if (proposals.some((p) => p.description === description))
        throw new Error(`Proposal already exists`);
      // proposal parameters
      const addresses = [target];
      const amounts = [utils.parseEther(amount)];
      const calldatas: string[] = ['0x']; // empty calldata
      // create a new proposal
      const { governor } = getContracts(provider!);
      const tx = await governor.propose(
        addresses,
        amounts,
        calldatas,
        description,
      );
      setLoading(`Sending proposal creation transaction`);
      await tx.wait();
      setLoading(`Proposal was created`);
      // save created proposal to context
      setProposals((old) => [
        ...old,
        { addresses, amounts, calldatas, description },
      ]);
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Proposal creation</h1>
      <p>The proposal is to send some RBTC to a target address</p>
      <label className="proposal-param" htmlFor="target-addr">
        Target address
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          name="target-addr"
        />
      </label>
      <label className="proposal-param" htmlFor="target-ammount">
        Amount to send
        <input
          type="number"
          value={amount}
          min={0}
          max={1}
          step={0.000001}
          onChange={(e) => setAmount(e.target.value)}
          name="target-ammount"
        />
      </label>
      <label className="proposal-param" htmlFor="prop-description">
        Proposal description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="prop-description"
          placeholder="enter unique description"
        />
      </label>
      <button type="button" onClick={propose}>
        Propose
      </button>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Propose;
