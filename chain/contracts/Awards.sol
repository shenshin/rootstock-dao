// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './Competitions.sol';

contract Awards is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  struct Prize {
    string competitionName;
    uint256 votingResult;
    uint8 rank;
  }
  mapping(uint256 => Prize) public prizes;

  Competitions immutable competitions;

  constructor(Competitions _competitions) ERC721('AwardToken', 'AWD') {
    competitions = _competitions;
  }

  modifier onlyCompetitions() {
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
  ) external onlyCompetitions {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    prizes[tokenId] = Prize({
      competitionName: competitionName,
      votingResult: votingResult,
      rank: rank
    });
  }
}
