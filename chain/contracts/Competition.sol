// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import './RootstockGovernor.sol';
import './Awards.sol';

contract Competition is Ownable {
  struct Team {
    uint256 votes;
    address addr;
  }

  RootstockGovernor public immutable governor;
  Awards public awards; // prizes NFT s/c

  constructor(RootstockGovernor _governor) {
    governor = _governor;
  }

  modifier onlyGovernor() {
    require(
      msg.sender == address(governor),
      'Competition: Can be called only by the Governor'
    );
    _;
  }

  // sets an address of NFT s/c which mints prizes
  function setAwards(Awards _awards) external onlyOwner {
    awards = _awards;
  }

  // Is called by the governor if voting reaches the quorum
  function onCompetitionEnd(
    string calldata contestName,
    address[] calldata teams
  ) external onlyGovernor {
    require(
      teams.length > 1 && teams.length <= 250,
      'Competitions: Min 2, max 250 teams are allowed'
    );
    uint256 proposalId = governor.proposalIds(
      uint256(keccak256(abi.encodePacked(contestName)))
    );
    uint256[] memory votes = governor.proposalVotes(
      proposalId,
      uint8(teams.length)
    );
    Team[][] memory winners = findWinners(teams, votes);
    // runs 3 times, iterates ranks
    for (uint8 rank = 0; rank < winners.length; rank++) {
      // runs as many times as there are teams in the same rank (1-few)
      for (uint8 i = 0; i < winners[rank].length; i++) {
        if (winners[rank][i].votes == 0) return;
        // mint NFTs
        awards.givePrize(
          contestName,
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
    address[] memory teams,
    uint256[] memory votes
  ) private pure returns (Team[][] memory winners) {
    winners = new Team[][](3);
    winners[0] = new Team[](1); // 1st place
    winners[1] = new Team[](1); // 2nd place
    winners[2] = new Team[](1); // 3rd place
    for (uint8 i = 0; i < teams.length; i++) {
      Team memory team = Team({addr: teams[i], votes: votes[i + 1]});
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
    revert('Competition: No need to send me money');
  }

  fallback() external {
    revert('Competition: Unknown function call');
  }
}
