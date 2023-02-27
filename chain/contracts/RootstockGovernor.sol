// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/governance/Governor.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorSettings.sol';
import './GovernorCountingUniversal.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol';

contract RootstockGovernor is
  Governor,
  GovernorSettings,
  GovernorCountingUniversal,
  GovernorVotes,
  GovernorVotesQuorumFraction
{
  constructor(
    IVotes _token
  )
    Governor('RootstockGovernor')
    GovernorSettings(1 /* 1 block */, 20 /* 10 minutes */, 0)
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(6)
  {}

  // proposal description hash => proposal ID
  mapping(bytes32 => uint256) public proposalIds;

  function createProposal(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description,
    CountingType countingType
  ) external {
    uint256 proposalId;
    if (countingType == CountingType.Simple) {
      proposalId = propose(targets, values, calldatas, description);
    } else if (countingType == CountingType.Ballot) {
      proposalId = proposeBallot(targets, values, calldatas, description);
    } else {
      revert('RootstockGovernor: unknown voting type');
    }
    // associate proposal description with proposal ID
    proposalIds[keccak256(abi.encodePacked(description))] = proposalId;
  }

  // The following functions are overrides required by Solidity.

  function votingDelay()
    public
    view
    override(IGovernor, GovernorSettings)
    returns (uint256)
  {
    return super.votingDelay();
  }

  function votingPeriod()
    public
    view
    override(IGovernor, GovernorSettings)
    returns (uint256)
  {
    return super.votingPeriod();
  }

  function quorum(
    uint256 blockNumber
  )
    public
    view
    override(IGovernor, GovernorVotesQuorumFraction)
    returns (uint256)
  {
    return super.quorum(blockNumber);
  }

  function proposalThreshold()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
  {
    return super.proposalThreshold();
  }
}
