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

  // Initiates voting. Can be called only by the competition initiator.
  function startCompetition(
    address[] calldata teams,
    string calldata name
  ) external onlyOwner {
    require(
      teams.length > 1 && teams.length <= 250,
      'Min 2, max 250 teams are allowed'
    );
    bytes32 nameHash = keccak256(abi.encodePacked(name));
    Competition storage contest = competitions[nameHash];
    require(contest.teams.length == 0, 'Competition has already started');
    contest.teams = teams;
    contest.name = name;
    (
      address[] memory targets,
      uint256[] memory amounts,
      bytes[] memory calldatas
    ) = getProposal(nameHash);
    contest.proposalId = governor.propose(targets, amounts, calldatas, name);
  }

  /* 
  Prepares proposal parameters for creating/executing competition
  proposals on the governor
   */
  function getProposal(
    bytes32 nameHash
  )
    private
    view
    returns (
      address[] memory targets,
      uint256[] memory amounts,
      bytes[] memory calldatas
    )
  {
    targets = new address[](1);
    targets[0] = address(this);
    amounts = new uint256[](1);
    amounts[0] = 0;
    calldatas = new bytes[](1);
    calldatas[0] = abi.encodeWithSelector(
      this.onCompetitionEnd.selector,
      nameHash
    );
  }

  /* 
  Voters should call this function to know what proposal ID 
  corresponds to the competition name they are going to vote for
   */
  function getProposalId(
    string calldata competitionName
  ) external view returns (uint256) {
    bytes32 nameHash = keccak256(abi.encodePacked(competitionName));
    return competitions[nameHash].proposalId;
  }

  // Is called by the competition initiator (owner) to execute competition proposal
  function endCompetition(string calldata name) external onlyOwner {
    bytes32 nameHash = keccak256(abi.encodePacked(name));
    Competition storage contest = competitions[nameHash];
    require(
      governor.state(contest.proposalId) == IGovernor.ProposalState.Succeeded,
      'Voting is still active or quorum was not reached'
    );
    (
      address[] memory targets,
      uint256[] memory amounts,
      bytes[] memory calldatas
    ) = getProposal(nameHash);
    governor.execute(targets, amounts, calldatas, nameHash);
  }

  // Is called by the governor if voting reaches the quorum
  function onCompetitionEnd(bytes32 nameHash) external onlyGovernor {
    Competition storage contest = competitions[nameHash];
    Team[][] memory winners = findWinners(contest.proposalId, contest.teams);
    // runs 3 times, iterates ranks
    for (uint8 rank = 0; rank < winners.length; rank++) {
      // runs as many times as there are teams in the same rank (1-few)
      for (uint8 i = 0; i < winners[rank].length; i++) {
        if (winners[rank][i].votes == 0) return;
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

  /* Finds winning teams.
  Returns a result like:
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
    winners[0] = new Team[](1); // 1st place
    winners[1] = new Team[](1); // 2nd place
    winners[2] = new Team[](1); // 3rd place
    for (uint8 i = 0; i < teams.length; i++) {
      Team memory team = Team({
        addr: teams[i],
        votes: governor.proposalVotes(proposalId, i + 1)
      });
      if (team.votes == 0) continue;
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

  /* 
  Pushes an element (Team) to the end of Team[] array.
  It is necessary because there is no built-in `push` method for
  memory arrays in Solidity yet
   */
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
