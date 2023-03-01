import { useContext, useState } from 'react';
import { Web3Context } from '../context/web3Context';
import { ProposalContext, ProposalState } from '../context/proposalContext';
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
                Select proposal
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
                {proposals[proposalIndex]?.teams ? (
                  <p>Competition. Select team </p>
                ) : (
                  <p>Vote for proposal </p>
                )}
                <select onChange={(e) => setVoteIndex(+e.target.value)}>
                  {proposals[proposalIndex]?.teams
                    ? proposals[proposalIndex].teams?.map((team, i) => (
                        <option value={i + 1} key={team.id}>
                          {`${i + 1}: ${team.address}`}
                        </option>
                      ))
                    : Object.values(VoteOptions)
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
          </>
        )}
      </div>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Vote;
