// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract VoteToken is ERC721, Ownable, EIP712, ERC721Votes {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721('VoteToken', 'VT') EIP712('VoteToken', '1') {}

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function safeMintBatch(address[] calldata to) public onlyOwner {
    require(to.length <= 40, 'Too many addresses');
    for (uint256 i; i < to.length; i++) {
      safeMint(to[i]);
    }
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Votes) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }
}
