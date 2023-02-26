// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './Competition.sol';

/* 
This is a possible implementation of NFT smart contract which mints
tokens for competition winners. Tokens include information about:
- competition name
- number of votes a team has got
- team's rank in the competition
 */
contract Awards is ERC721 {
  struct Prize {
    string competitionName;
    uint256 votingResult;
    uint8 rank;
  }
  mapping(uint256 => Prize) public prizes;

  Competition immutable competitions;

  constructor(Competition _competitions) ERC721('AwardToken', 'AWD') {
    competitions = _competitions;
  }

  modifier onlyCompetition() {
    require(
      msg.sender == address(competitions),
      'Can be called only by Competitions'
    );
    _;
  }

  // mints 1 NFT with unique number and saves info about the place taken
  function givePrize(
    string calldata competitionName,
    uint256 votingResult,
    address to,
    uint8 rank
  ) external onlyCompetition {
    // calculating a unique token ID
    uint256 tokenId = uint256(
      keccak256(abi.encodePacked(competitionName, to, rank))
    );
    _safeMint(to, tokenId);
    prizes[tokenId] = Prize({
      competitionName: competitionName,
      votingResult: votingResult,
      rank: rank
    });
  }
}
