// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './GovernorBallot.sol';
import './Awards.sol';
import 'hardhat/console.sol';

contract Competitions is Ownable {
  struct Team {
    address addr;
    uint256 votingResult;
  }
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
    Competition storage newCompetition = competitions[
      keccak256(abi.encodePacked(name))
    ];
    require(
      newCompetition.teams.length == 0,
      'Competition has already started'
    );
    newCompetition.teams = teams;
    newCompetition.name = name;
    newCompetition.proposalId = createProposal(name);
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
    Competition storage competition = competitions[nameHash];
    Team[] memory teams = new Team[](competition.teams.length);
    // fill teams with voting results
    for (uint8 i = 0; i < teams.length; i++) {
      teams[i] = Team({
        addr: competition.teams[i],
        votingResult: governor.proposalVotes(competition.proposalId, i + 1)
      });
    }
    awardWinners(competition.name, teams);
  }

  // give prizes to the teams with the highest ranks
  function awardWinners(string memory name, Team[] memory teams) private {
    (uint256 first, uint256 second, uint256 third) = findMaxVotes(teams);
    for (uint i = 0; i < teams.length; i++) {
      if (teams[i].votingResult == first)
        awards.givePrize(name, teams[i].votingResult, teams[i].addr, 1);
      else if (teams[i].votingResult == second)
        awards.givePrize(name, teams[i].votingResult, teams[i].addr, 2);
      else if (teams[i].votingResult == third)
        awards.givePrize(name, teams[i].votingResult, teams[i].addr, 3);
    }
  }

  // finds out how many votes the winning teams received
  function findMaxVotes(
    Team[] memory teams
  ) private pure returns (uint first, uint second, uint third) {
    first = teams[0].votingResult;
    second = 0;
    third = 0;
    for (uint i = 1; i < teams.length; i++) {
      uint votingResult = teams[i].votingResult;
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
