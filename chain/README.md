# Awards NFT minting

Voting system is represented by smart contracts:
- `RootstockGovernor` OpenZeppelin Governor extension defining all governance and voting parameters
- `GovernorCountingUniversal` modified Governor Voting module working in two modes:
  - Simple: voter can vote for/against/abstain for the proposal. This mode is 100% compatible with OpenZeppelin GovernorCountingSimple: new proposal is created by calling `propose` function on the Governor.
  - Ballot: voter can select one of 250 alternatives. To start a competition in this mode, initiator has to call `proposeBallot` function on the Governor with the same parameters as `propose` 
- `Competitions` initiates and finishes every competition, functions as proposal target for `RootstockGovernor`
- `Awards` is a possible implementation of NFT smart contract which mints award tokens for competition winners

## Competition rules

- after deployment Competitions owner has to link Competitions s/c with Awards s/c by calling `setAwards` function
- 250 teams can participate in a competition
- each competition is created by the owner of Competitions s/c by calling `startCompetition` function and passing 2 parameters:
  1. array of participant addresses
  2. competition description, which has to be unique
- Competitions s/c then creates a proposal on the Governor thus starting a voting. It encodes the call of `onCompetitionEnd` function on itself with competition description hash as a parameter.
- the voting lasts a certain time (parameter of the Governor) and ends successfully if total votes number is more than a certain % of VoteToken holders (quorum, also Governor parameter)
- voters can vote once for a certain team in competition proposal by calling `castVote(uint256 proposalId, uint8 teamNumber)` on the Governor. To find out Governor's proposal ID to vote for, voters can call `getProposalId(string competitionName)` on the Competitions s/c
- successful competition proposal can be executed by calling `endCompetition(string competitionName)` on the Competitions s/c by the owner
- Competitions s/c then collects the voting results from the Governor and mints NFTs to the winners
- participants who took 1, 2 or 3 places get the awards. If 2 teams get the same number of votes, they share the rank.
- each winner gets an NFT with unique id
- mapping `prizes(tokenId)` on the Competitions s/c keeps the information about minted NTF awards: 
  - competition name
  - number of votes a team has got
  - team's rank in the competition