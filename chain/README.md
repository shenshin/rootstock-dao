# Awards NFT minting

Voting system is represented by `RootstockGovernor` and `Competitions` smart contracts, where Competitions is a proposal target for the Governor

- 250 teams can participate in the competition.
- each competition is created by the owner of Competitions s/c by calling `startCompetition` function and passing 2 parameters:
  1. array of participant addresses
  2. competition description, which has to be unique
- Competitions s/c then creates a proposal on the Governor thus starting the voting. It encodes the call of `endCompetition` function on its target (Competitions s/c) with competition description hash as a parameter.
- the voting lasts a certain time (parameter of the Governor) and ends successfully if total votes number is more than 4% of VoteToken holders (quorum, also Governor parameter)
- successful proposal can be executed by calling `execute` on the Governor which calls `endCompetition` on the target
- Competitions s/c then collects the voting results from the Governor and mints NFTs to the winners
- participants who took 1, 2 or 3 places take the awards. If 2 teams get the same number of votes, they share the place.
- each winner gets an NFT with unique id
- mapping `prizes` on the Competitions s/c keeps the information about NTF ids: 
  1. place the owner took
  2. competition description hash