// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './GovernorBallot.sol';
import './Awards.sol';
import 'hardhat/console.sol';

contract Competitions is Ownable {
  struct Team {
    uint256 votes;
    address addr;
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
    Team[][] memory winners = findWinners(contest.proposalId, contest.teams);
    // runs 3 times, iterates ranks
    for (uint8 rank = 0; rank < winners.length; rank++) {
      // runs as many times as there are teams in the same rank (1-few)
      for (uint8 i = 0; i < winners[rank].length; i++) {
        // mint NFTs
        awards.givePrize(
          contest.name,
          winners[rank][i].votes,
          winners[rank][i].addr,
          rank + 1
        );
      }
    }
  }

  /* Finds winner teams.
  Returns a result of a kind:
  [
    // 1 rank
    [Team, Team],
    // 2 rank
    [Team],
    // 3 rank
    [Team, Team]
  ]
   */
  function findWinners(
    uint256 proposalId,
    address[] memory teams
  ) private view returns (Team[][] memory winners) {
    winners = new Team[][](3);
    winners[0] = new Team[](1);
    winners[1] = new Team[](1);
    winners[2] = new Team[](1);
    for (uint8 i = 0; i < teams.length; i++) {
      Team memory team = Team({
        addr: teams[i],
        votes: governor.proposalVotes(proposalId, i + 1)
      });
      if (team.votes > winners[0][winners[0].length - 1].votes) {
        winners[2] = winners[1];
        winners[1] = winners[0];
        winners[0] = new Team[](1);
        winners[0][0] = team;
      } else if (team.votes == winners[0][winners[0].length - 1].votes) {
        winners[0] = push(winners[0], team);
      } else if (team.votes > winners[1][winners[1].length - 1].votes) {
        winners[2] = winners[1];
        winners[1] = new Team[](1);
        winners[1][0] = team;
      } else if (team.votes == winners[1][winners[1].length - 1].votes) {
        winners[1] = push(winners[1], team);
      } else if (team.votes > winners[2][winners[2].length - 1].votes) {
        winners[2] = new Team[](1);
        winners[2][0] = team;
      } else if (team.votes == winners[2][winners[2].length - 1].votes) {
        winners[2] = push(winners[2], team);
      }
    }
  }

  // pushes an element (Team) to the end of Team[] array
  function push(
    Team[] memory arr,
    Team memory team
  ) private pure returns (Team[] memory newArr) {
    newArr = new Team[](arr.length + 1);
    for (uint8 i = 0; i < arr.length; i++) newArr[i] = arr[i];
    newArr[arr.length] = team;
  }

  receive() external payable {
    revert('No need to send me money');
  }

  fallback() external {
    revert('Unknown function call');
  }
}
