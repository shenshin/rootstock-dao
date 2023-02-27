import { useContext, useState } from 'react';
import { Web3Context } from '../context/web3Context';
import {
  ProposalContext,
  ProposalState,
  IProposal,
  ProposalType,
} from '../context/proposalContext';
import getContracts from '../contracts/getContracts';

enum VoteOptions {
  Against,
  For,
  Abstain,
}

function Vote() {
  const { provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { proposals } = useContext(ProposalContext);
  const [voteIndex, setVoteIndex] = useState<number>(0);
  const [proposalIndex, setProposalIndex] = useState<number>(0);

  const vote = async () => {
    try {
      setErrorMessage('');
      const { governor } = getContracts(provider!);
      const { proposalId } = proposals[proposalIndex];
      if ((await governor.state(proposalId)) !== ProposalState.Active)
        throw new Error(`You cannot vote for this proposal`);
      const tx = await governor.castVote(proposalId, voteIndex);
      setLoading(`Sending Vote transaction`);
      await tx.wait();
      setLoading('You have casted the vote');
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const getTeams = (proposal: IProposal): string[] => {
    if (proposal.type === ProposalType.Simple) return [];
    const { competition } = getContracts(provider!);
    const participants: string[] = competition.interface.decodeFunctionData(
      'onCompetitionEnd',
      proposal.calldatas[0],
    ).teams;
    return participants;
  };

  return (
    <div>
      <h1>Voting for a proposal</h1>
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
            <div>
              <label htmlFor="vote">
                Vote{' '}
                <select onChange={(e) => setVoteIndex(+e.target.value)}>
                  {Object.values(VoteOptions)
                    .filter((option) => typeof option === 'string')
                    .map((option, i) => (
                      <option value={i} key={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <button type="button" onClick={vote}>
              Cast vote
            </button>
            <button
              type="button"
              onClick={() => getTeams(proposals[proposalIndex])}
            >
              Check type
            </button>
          </>
        )}
      </div>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Vote;
