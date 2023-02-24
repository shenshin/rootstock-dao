// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/governance/Governor.sol';

abstract contract GovernorCountingUniversal is Governor {
  struct ProposalVote {
    uint256 totalVotes;
    mapping(uint8 => uint256) candidateVotes;
    mapping(address => bool) hasVoted;
  }
  mapping(uint256 => ProposalVote) private _proposalVotes;

  enum CountingType {
    Simple,
    Ballot
  }
  // counting types for proposal IDs
  mapping(uint256 => CountingType) public countingTypes;

  /**
   * @dev See {IGovernor-COUNTING_MODE}.
   */
  function COUNTING_MODE()
    public
    pure
    virtual
    override
    returns (string memory)
  {
    return 'support=bravo&quorum=for,abstain';
  }

  /**
   * @dev Proposer should call `proposeBallot` instead of `propose` to
   * initiate proposal in Ballot mode
   */
  function proposeBallot(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) public virtual returns (uint256 proposalId) {
    proposalId = propose(targets, values, calldatas, description);
    countingTypes[proposalId] = CountingType.Ballot;
  }

  /**
   * @dev See {IGovernor-hasVoted}.
   */
  function hasVoted(
    uint256 proposalId,
    address account
  ) public view virtual override returns (bool) {
    return _proposalVotes[proposalId].hasVoted[account];
  }

  /**
   * @dev Accessor to the internal vote counts.
   */
  function proposalVotes(
    uint256 proposalId
  )
    public
    view
    virtual
    returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)
  {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    if (countingTypes[proposalId] == CountingType.Ballot) {
      revert(
        'GovernorCountingUniversal: Ballot mode. Use proposalVotes(uint256 proposalId, uint8 candidate)'
      );
    } else {
      return (
        proposalVote.candidateVotes[0],
        proposalVote.candidateVotes[1],
        proposalVote.candidateVotes[2]
      );
    }
  }

  /**
   * @dev `proposalVotes(uint256)` overload for Ballot counting mode
   */
  function proposalVotes(
    uint256 proposalId,
    uint8 candidate
  ) public view virtual returns (uint256 candidateVotes) {
    return _proposalVotes[proposalId].candidateVotes[candidate];
  }

  /**
   * @dev See {Governor-_quorumReached}.
   */
  function _quorumReached(
    uint256 proposalId
  ) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    if (countingTypes[proposalId] == CountingType.Ballot) {
      return quorum(proposalSnapshot(proposalId)) <= proposalVote.totalVotes;
    } else {
      return
        quorum(proposalSnapshot(proposalId)) <=
        proposalVote.candidateVotes[1] + proposalVote.candidateVotes[2];
    }
  }

  /**
   * @dev See {Governor-_voteSucceeded}.
   */
  function _voteSucceeded(
    uint256 proposalId
  ) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    if (countingTypes[proposalId] == CountingType.Ballot) {
      return _quorumReached(proposalId);
    } else {
      return proposalVote.candidateVotes[1] > proposalVote.candidateVotes[0];
    }
  }

  /**
   * @dev See {Governor-_countVote}.
   */
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
      'GovernorCountingUniversal: vote already cast'
    );
    proposalVote.hasVoted[account] = true;
    proposalVote.totalVotes += weight;
    if (countingTypes[proposalId] != CountingType.Ballot && support > 2) {
      revert('GovernorCountingUniversal: invalid vote');
    }
    proposalVote.candidateVotes[support] += weight;
  }
}
