// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './GovernorBallot.sol';
import './Awards.sol';
import 'hardhat/console.sol';

contract Competitions is Ownable {
  struct Competition {
    address[] teams; // participants
    string name; // description
    uint256 proposalId; // corresponding proposal on the Governor
  }
  // competitions are identified by description hash
  mapping(bytes32 => Competition) public competitions;

  GovernorBallot public immutable governor;
  Awards public awards; // prizes NFT s/c

  constructor(GovernorBallot _governor) {
    governor = _governor;
  }

  modifier onlyGovernor() {
    require(
      msg.sender == address(governor),
      'Can be called only by the GovernorBallot'
    );
    _;
  }

  // sets an address of NFT s/c which mints prizes
  function setAwards(Awards _awards) external onlyOwner {
    awards = _awards;
  }

  // initiates voting
  function startCompetition(
    address[] calldata teams,
    string calldata name
  ) external onlyOwner {
    require(
      teams.length > 1 && teams.length <= 250,
      'Min 2, max 250 teams are allowed'
    );
    Competition storage contest = competitions[
      keccak256(abi.encodePacked(name))
    ];
    require(contest.teams.length == 0, 'Competition has already started');
    contest.teams = teams;
    contest.name = name;
    contest.proposalId = createProposal(name);
  }

  // creates a proposal on the governor
  function createProposal(string calldata name) private returns (uint256) {
    address[] memory targets = new address[](1);
    targets[0] = address(this);
    uint256[] memory amounts = new uint256[](1);
    amounts[0] = 0;
    bytes[] memory calldatas = new bytes[](1);
    calldatas[0] = abi.encodeWithSelector(
      this.endCompetition.selector,
      keccak256(abi.encodePacked(name))
    );
    return governor.propose(targets, amounts, calldatas, name);
  }

  // is called by the governor if voting reaches the quorum
  function endCompetition(bytes32 nameHash) external onlyGovernor {
    Competition storage contest = competitions[nameHash];
    (uint256 first, uint256 second, uint256 third) = findMaxVotes(
      contest.proposalId,
      contest.teams
    );
    for (uint8 i = 0; i < contest.teams.length; i++) {
      uint256 votingResult = governor.proposalVotes(contest.proposalId, i + 1);
      uint8 rank;
      if (votingResult == first) rank = 1;
      else if (votingResult == second) rank = 2;
      else if (votingResult == third) rank = 3;
      awards.givePrize(contest.name, votingResult, contest.teams[i], rank);
    }
  }

  // finds out how many votes the winning teams received
  function findMaxVotes(
    uint256 proposalId,
    address[] memory teams
  ) private view returns (uint256 first, uint256 second, uint256 third) {
    first = governor.proposalVotes(proposalId, 1);
    second = 0;
    third = 0;
    for (uint8 i = 1; i < teams.length; i++) {
      uint votingResult = governor.proposalVotes(proposalId, i + 1);
      if (votingResult > first) {
        third = second;
        second = first;
        first = votingResult;
      } else if (votingResult > second) {
        third = second;
        second = votingResult;
      } else if (votingResult > third) {
        third = votingResult;
      }
    }
  }

  receive() external payable {
    revert('No need to send me money');
  }

  fallback() external {
    revert('Unknown function call');
  }
}
