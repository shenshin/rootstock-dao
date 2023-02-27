// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/governance/Governor.sol';

abstract contract GovernorCountingUniversal is Governor {
  enum CountingType {
    Simple, // each vote is either for, against, or abstain
    Ballot // each vote is for a single choice out of multiple choices
  }

  struct ProposalVote {
    CountingType countingType;
    uint256 totalVotes;
    mapping(uint8 => uint256) candidateVotes;
    mapping(address => bool) hasVoted;
  }

  mapping(uint256 => ProposalVote) private _proposalVotes;

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
  ) internal virtual returns (uint256 proposalId) {
    proposalId = propose(targets, values, calldatas, description);
    _proposalVotes[proposalId].countingType = CountingType.Ballot;
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
    require(
      proposalVote.countingType == CountingType.Simple,
      'GovernorCountingUniversal: Can be called only in Simple mode'
    );
    return (
      proposalVote.candidateVotes[0],
      proposalVote.candidateVotes[1],
      proposalVote.candidateVotes[2]
    );
  }

  /**
   * @dev `proposalVotes(uint256)` overload for Ballot counting mode. 
   * Returns voting results for teams from 0 to `teams`
   * @param proposalId - Proposal ID
   * @param teams - number of voting results to return.
   * e.g. 5 returns voting results for teams 0 - 5, where 0 is assumed `Abstain`
   * @return votes voting results for `teams` teams
   */
  function proposalVotes(
    uint256 proposalId,
    uint8 teams
  ) public view virtual returns (uint256[] memory votes) {
    require(
      teams > 0 && teams <= 250,
      'GovernorCountingUniversal: teams out of range'
    );
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    require(
      proposalVote.countingType == CountingType.Ballot,
      'GovernorCountingUniversal: Can be called only in Ballot mode)'
    );
    votes = new uint256[](teams + 1);
    for (uint8 i = 0; i <= teams; i++) {
      votes[i] = proposalVote.candidateVotes[i];
    }
  }

  /**
   * @dev See {Governor-_quorumReached}.
   */
  function _quorumReached(
    uint256 proposalId
  ) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    if (proposalVote.countingType == CountingType.Ballot) {
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
    if (proposalVote.countingType == CountingType.Ballot) {
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
    require(
      !(proposalVote.countingType == CountingType.Simple && support > 2),
      'GovernorCountingUniversal: invalid vote'
    );
    proposalVote.hasVoted[account] = true;
    proposalVote.candidateVotes[support] += weight;
    // recoding total votes casted
    // In Ballot mode 0 (zero) is assumed `abstain`, so it's not counted in total votes
    if (proposalVote.countingType == CountingType.Ballot && support == 0)
      return;
    proposalVote.totalVotes += weight;
  }
}
