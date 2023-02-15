import { useContext, useState } from 'react';
import { utils } from 'ethers';
import { Web3Context } from '../context/web3Context';
import {
  ProposalContext,
  ProposalState,
  getProposalId,
} from '../context/proposalContext';
import getContracts from '../contracts/getContracts';

function Execute() {
  const { provider } = useContext(Web3Context);
  const { proposals } = useContext(ProposalContext);
  const [proposalIndex, setProposalIndex] = useState<number>(0);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const executeProposal = async () => {
    try {
      setErrorMessage('');
      const { governor } = getContracts(provider!);
      const proposalId = getProposalId(proposals[proposalIndex]);
      if ((await governor.state(proposalId)) !== ProposalState.Succeeded)
        throw new Error(`Proposal cannot be executed`);
      const { addresses, amounts, calldatas, description } =
        proposals[proposalIndex];
      const descHash = utils.solidityKeccak256(['string'], [description]);
      const tx = await governor.execute(
        addresses,
        amounts,
        calldatas,
        descHash,
      );
      setLoading(`Sending Execute transaction`);
      await tx.wait();
      setLoading('Proposal was executed');
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Execute proposal</h1>
      <div>
        {proposals.length === 0 ? (
          <p>No active proposals</p>
        ) : (
          <>
            <div>
              <label htmlFor="select-proposal">
                Proposal{' '}
                <select
                  onChange={(e) => setProposalIndex(+e.target.value)}
                  name="select-proposal"
                >
                  {proposals.map((proposal, i) => (
                    <option value={i} key={proposal.description}>
                      {proposal.description}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" onClick={executeProposal}>
              execute
            </button>
          </>
        )}
      </div>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Execute;
