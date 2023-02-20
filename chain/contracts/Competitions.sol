// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './GovernorBallot.sol';

contract Competitions is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  struct Team {
    address addr;
    uint256 votingResult;
  }
  struct Competition {
    address[] teams;
    uint256 proposalId;
    uint8 winPlaces;
  }
  // competitions are identified by description hash: descHash => Competition
  mapping(bytes32 => Competition) public competitions;

  /* 
  Competition winners are getting NFTs with unique numbers (1, 2, 3...)
  with information about the competition and place they took
  - team address
- competition id (uint)
- competition name (string)
- position/ rank (uint)

startCompetition adds new argument for X, where X is the number of teams that can win
limit max allowed teams to 32 or 16 (depending on whether it runs out of gas in the sort)
   */
  struct Prize {
    bytes32 competition;
    uint8 place;
  }
  mapping(uint256 => Prize) public prizes;

  GovernorBallot public immutable governor;

  constructor(GovernorBallot _governor) ERC721('Meow token', 'MEO') {
    governor = _governor;
  }

  modifier onlyGovernor() {
    require(
      msg.sender == address(governor),
      'Can be called only by the GovernorBallot'
    );
    _;
  }

  // initiates voting
  function startCompetition(
    address[] calldata _teamAddresses,
    string calldata _description,
    uint8 _winPlaces
  ) external onlyOwner {
    require(
      _teamAddresses.length > 1 && _teamAddresses.length <= 250,
      'Min 2, max 250 teams are allowed'
    );
    Competition storage newCompetition = competitions[
      keccak256(abi.encodePacked(_description))
    ];
    require(
      newCompetition.teams.length == 0,
      'Competition has already started'
    );
    newCompetition.teams = _teamAddresses;
    newCompetition.proposalId = createProposal(_description);
    newCompetition.winPlaces = _winPlaces;
  }

  // creates a proposal on the governor
  function createProposal(
    string calldata _description
  ) private returns (uint256) {
    address[] memory targets = new address[](1);
    targets[0] = address(this);
    uint256[] memory amounts = new uint256[](1);
    amounts[0] = 0;
    bytes[] memory calldatas = new bytes[](1);
    calldatas[0] = abi.encodeWithSelector(
      this.endCompetition.selector,
      keccak256(abi.encodePacked(_description))
    );
    return governor.propose(targets, amounts, calldatas, _description);
  }

  // is called by the governor if voting reaches the quorum
  function endCompetition(bytes32 _descriptionHash) external onlyGovernor {
    Competition storage competition = competitions[_descriptionHash];
    Team[] memory teams = new Team[](competition.teams.length);
    // fill teams with voting results
    for (uint8 i = 0; i < teams.length; i++) {
      teams[i] = Team({
        addr: competition.teams[i],
        votingResult: governor.proposalVotes(competition.proposalId, i + 1)
      });
    }
    // mint to the winning places
    awardWinners(_descriptionHash, sortTeams(teams), competition.winPlaces);
  }

  // NFTs can only be minted to the winners
  // give prizes to the teams with voting results below `threshold` (1st - 3rd places)
  function awardWinners(
    bytes32 competition,
    Team[] memory sortedTeams,
    uint8 winPlaces
  ) private {
    uint8 place; // 1st, 2nd, 3rd ... places
    uint256 prevResult; // previous team voting result
    for (uint8 i = 0; i < sortedTeams.length; i++) {
      if (sortedTeams[i].votingResult == 0) return; // don't mint without any votes
      if (sortedTeams[i].votingResult != prevResult) {
        prevResult = sortedTeams[i].votingResult; // save current result
        place++; // proceed to the next place group
      }
      // mint only until the threshold is reached (placeNum <= 3)
      if (place > winPlaces) return;
      givePrize(competition, sortedTeams[i].addr, place);
    }
  }

  // bubble sort teams by the voting results
  function sortTeams(Team[] memory teams) private pure returns (Team[] memory) {
    for (uint8 i = 0; i < teams.length - 1; i++) {
      for (uint8 j = 0; j < teams.length - i - 1; j++) {
        if (teams[j].votingResult < teams[j + 1].votingResult) {
          Team memory temp = teams[j];
          teams[j] = teams[j + 1];
          teams[j + 1] = temp;
        }
      }
    }
    return teams;
  }

  // mints 1 NFT with unique number and saves info about the place taken
  function givePrize(bytes32 competition, address to, uint8 place) private {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    prizes[tokenId] = Prize({competition: competition, place: place});
  }

  receive() external payable {
    revert('No need to send me money');
  }

  fallback() external {
    revert('Unknown function call');
  }
}
