# Awards NFT minting

Voting system is represented by smart contracts:
- `RootstockGovernor` OpenZeppelin Governor extension defining all governance and voting parameters
- `GovernorCountingUniversal` modified Governor Voting module working in two modes:
  - Simple: voter can vote for/against/abstain for the proposal. This mode is 100% compatible with OpenZeppelin GovernorCountingSimple: new proposal is created by calling `propose` function on the Governor.
  - Ballot: voter can select one of 250 alternatives. To start a competition in this mode, initiator has to call `proposeBallot` function on the Governor with the same parameters as `propose` 
- `Competition` functions as proposal target for `RootstockGovernor`, finds and awards winners among the participating teams
- `Awards` is a possible implementation of NFT smart contract which mints award tokens for competition winners

## Competition rules

- after deployment Competition owner has to link Competition s/c with Awards s/c by calling `setAwards` function
- 250 teams can participate in a competition
- a competition has to be [encoded as a usual Governor proposal](https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-propose-address---uint256---bytes---string-), where:
  1. targets - `Competition` s/c address
  2. values - 0 (not sending any RBTC)
  3. calldatas - encoded call of Competition's function `onCompetitionEnd` with 2 parameters:
    - competition description, which has to be unique
    - array of participant addresses
  4. competition description (one more time)
- a new competition is started by calling Competition's `propose` with these 4 parameters
- voting starts 1 block after proposal initiation 
- the voting lasts a certain time (parameter of the Governor) and ends successfully if total votes number is more than a certain % of VoteToken holders (quorum, also Governor parameter)
- voters can vote once for one of the teams in competition proposal by calling `castVote(uint256 proposalId, uint8 teamNumber)` on the Governor. 
- successful competition proposal can be executed by calling `execute` on the Governor s/c
- after the execution the Governor calls `onCompetitionEnd` on the Competition s/c
- Competition s/c then collects the voting results from the Governor and mints NFTs to the winners
- participants who took 1, 2 or 3 places get the awards. If 2 teams get the same number of votes, they share the rank.
- each winner gets an NFT with unique id
- mapping `prizes(tokenId)` on the Competition s/c keeps the information about minted NTF awards: 
  - competition name
  - number of votes a team has got
  - team's rank in the competition