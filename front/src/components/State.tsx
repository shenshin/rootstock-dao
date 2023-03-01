import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../context/web3Context';
import { ProposalContext, ProposalState } from '../context/proposalContext';
import getContracts from '../contracts/getContracts';

function State() {
  const { provider } = useContext(Web3Context);
  const { proposals } = useContext(ProposalContext);
  const [proposalIndex, setProposalIndex] = useState<number>(0);
  const [proposalState, setProposalState] = useState<string>('?');

  const getProposalState = async () => {
    const { governor } = getContracts(provider!);
    const { proposalId } = proposals[proposalIndex];
    const stateCode = await governor.state(proposalId);
    setProposalState(ProposalState[stateCode]);
  };

  useEffect(() => {
    if (proposals.length === 0) return;
    getProposalState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalIndex, proposals]);

  return (
    <div>
      <h1>Getting proposal state</h1>
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
            <h3>State: {proposalState}</h3>
            <button type="button" onClick={getProposalState}>
              Update state
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default State;
