import hre from 'hardhat';
import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import {
  GovernorBallot,
  VoteToken,
  Competitions,
  Awards,
} from '../typechain-types';
import { deploy } from './util';

/*
This set of tests is for a scenario where there are multiple teams that are tied in 1st place
because they have the same number of votes.
Additionally all other teams have zero votes, and thus there is no 2nd place or 3rd place prizes.
*/
describe('Competitions. Sorting team results. Finding winners', () => {
  let governor: GovernorBallot;
  let voteToken: VoteToken;
  let competitions: Competitions;
  let awards: Awards;
  let teams: string[];
  let competitionName: string;

  before(async () => {
    const contracts = await loadFixture(deploy);
    governor = contracts.governor;
    voteToken = contracts.voteToken;
    competitions = contracts.competitions;
    awards = contracts.awards;
  });

  it('should delegate voting power', async () => {
    const signers = await hre.ethers.getSigners();
    await Promise.all(
      signers.map(async (signer) => {
        const tx = await voteToken.connect(signer).delegate(signer.address);
        await expect(tx).to.emit(voteToken, 'DelegateChanged');
        expect(await voteToken.getVotes(signer.address)).to.equal(1);
      }),
    );
  });

  it('should start a competition', async () => {
    competitionName = 'Competition 1';
    // 10 teams are participating
    teams = (await hre.ethers.getSigners()).slice(1, 11).map((s) => s.address);
    const tx = competitions.startCompetition(teams, competitionName);
    await expect(tx).to.emit(governor, 'ProposalCreated');
  });

  it('voters should vote for different teams', async () => {
    /* 
    there are 10 teams in total
    3 of them have the same score of 5
    and the other 7 of them have the same score of 0
    */
    await mine(2);
    const signers = await hre.ethers.getSigners();
    const propId = await competitions.getProposalId(competitionName);
    const vote = async (signerIndex: number, suppport: number) => {
      await expect(
        governor.connect(signers[signerIndex]).castVote(propId, suppport),
      )
        .to.emit(governor, 'VoteCast')
        .withArgs(signers[signerIndex].address, propId, suppport, 1, '');
    };
    // 5 voters give votes to the team 5
    await vote(0, 5);
    await vote(1, 5);
    await vote(2, 5);
    await vote(3, 5);
    await vote(4, 5);
    // 5 voters vote for team 4
    await vote(5, 4);
    await vote(6, 4);
    await vote(7, 4);
    await vote(8, 4);
    await vote(9, 4);
    // 5 voters vote for team 10
    await vote(10, 10);
    await vote(11, 10);
    await vote(12, 10);
    await vote(13, 10);
    await vote(14, 10);
    // other teams don't have votes
  });

  it('should execute the proposal and mint NFTs to the winners', async () => {
    await mine(20);
    const tx = await competitions.endCompetition(competitionName);
    await expect(tx).to.emit(governor, 'ProposalExecuted');
    await expect(tx).to.emit(awards, 'Transfer');
  });

  it('teams should receive their minted NFTs', async () => {
    const checkNftMint = async (
      teamIndex: number,
      rank: number,
      votingResult: number,
    ) => {
      const index = teamIndex - 1;
      const id = hre.ethers.utils.solidityKeccak256(
        ['string', 'address', 'uint8'],
        [competitionName, teams[index], rank],
      );
      expect(await awards.ownerOf(id)).to.equal(teams[index]);
      const prize0 = await awards.prizes(id);
      expect(prize0.competitionName).to.equal(competitionName);
      expect(prize0.votingResult).to.equal(votingResult);
      expect(prize0.rank).to.equal(rank);
    };
    await checkNftMint(5, 1, 5);
    await checkNftMint(4, 1, 5);
    await checkNftMint(10, 1, 5);
  });
});
