// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/governance/Governor.sol';

abstract contract GovernorCountingBallot is Governor {
  struct ProposalVote {
    uint256 totalVotes;
    mapping(uint8 => uint256) candidateVotes;
    mapping(address => bool) hasVoted;
  }

  mapping(uint256 => ProposalVote) private _proposalVotes;

  function COUNTING_MODE()
    public
    pure
    virtual
    override
    returns (string memory)
  {
    return 'Ballot';
  }

  function hasVoted(
    uint256 proposalId,
    address account
  ) public view virtual override returns (bool) {
    return _proposalVotes[proposalId].hasVoted[account];
  }

  function proposalVotes(
    uint256 proposalId,
    uint8 candidate
  ) public view virtual returns (uint256 candidateVotes) {
    return _proposalVotes[proposalId].candidateVotes[candidate];
  }

  function _quorumReached(
    uint256 proposalId
  ) internal view virtual override returns (bool) {
    return
      quorum(proposalSnapshot(proposalId)) <=
      _proposalVotes[proposalId].totalVotes;
  }

  /* Voting is assumed successful if the quorum is reached */
  function _voteSucceeded(
    uint256 proposalId
  ) internal view virtual override returns (bool) {
    return _quorumReached(proposalId);
  }

  function _countVote(
    uint256 proposalId,
    address account,
    uint8 support,
    uint256 weight,
    bytes memory // params
  ) internal virtual override {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];

    require(
      !proposalVote.hasVoted[account],
      'GovernorBallot: vote already cast'
    );
    proposalVote.hasVoted[account] = true;
    proposalVote.totalVotes += weight;
    proposalVote.candidateVotes[support] += weight;
  }
}
