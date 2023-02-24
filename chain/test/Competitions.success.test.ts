import hre from 'hardhat';
import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import {
  RootstockGovernor,
  VoteToken,
  Competitions,
  Awards,
} from '../typechain-types';
import { Proposal, ProposalState, getProposalId, deploy } from '../util';

describe('Competitions happy path', () => {
  let governor: RootstockGovernor;
  let voteToken: VoteToken;
  let proposal: Proposal;
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
        const vp = await voteToken.getVotes(signer.address);
        expect(vp).to.equal(1);
      }),
    );
  });

  it('should start the competition', async () => {
    competitionName = 'Competition 1';
    const descHash = hre.ethers.utils.solidityKeccak256(
      ['string'],
      [competitionName],
    );
    const callback = competitions.interface.encodeFunctionData(
      'onCompetitionEnd',
      [descHash],
    );
    proposal = [[competitions.address], [0], [callback], competitionName];
    const proposalId = getProposalId(proposal);
    teams = (await hre.ethers.getSigners()).slice(1, 6).map((s) => s.address);
    // start the competition
    const tx = await competitions.startCompetition(teams, competitionName);
    /* 
    ProposalCreated event signature:
    ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)
    */
    await expect(tx)
      .to.emit(governor, 'ProposalCreated')
      .withArgs(
        proposalId,
        competitions.address,
        [competitions.address],
        [0],
        anyValue,
        [callback],
        anyValue,
        anyValue,
        competitionName,
      );
  });

  it('proposal should be active', async () => {
    await mine(2);
    const propId = await competitions.getProposalId(competitionName);
    const state = await governor.state(propId);
    expect(state).to.equal(ProposalState.Active);
  });

  it('voters should vote for different teams', async () => {
    const propId = await competitions.getProposalId(competitionName);
    const signers = await hre.ethers.getSigners();
    const vote = async (signerIndex: number, suppport: number) => {
      await expect(
        governor.connect(signers[signerIndex]).castVote(propId, suppport),
      )
        .to.emit(governor, 'VoteCast')
        .withArgs(signers[signerIndex].address, propId, suppport, 1, '');
    };
    await vote(0, 5);
    await vote(1, 2);
    await vote(2, 1);
    await vote(3, 1);
    await vote(4, 2);
    await vote(5, 5);
    await vote(6, 2);
    await vote(7, 3);
    await vote(8, 3);
    await vote(9, 4);
    await vote(10, 5);
    await vote(11, 5);
  });

  it('proposal should be successful', async () => {
    await mine(20);
    const propId = await competitions.getProposalId(competitionName);
    const state = await governor.state(propId);
    expect(state).to.equal(ProposalState.Succeeded);
  });

  it('votes should be recorded correctly', async () => {
    const propId = await competitions.getProposalId(competitionName);
    const proposalVotes = 'proposalVotes(uint256,uint8)';
    expect(await governor[proposalVotes](propId, 0)).to.equal(0);
    expect(await governor[proposalVotes](propId, 1)).to.equal(2); // 3rd
    expect(await governor[proposalVotes](propId, 2)).to.equal(3); // 2nd
    expect(await governor[proposalVotes](propId, 3)).to.equal(2); // 3rd
    expect(await governor[proposalVotes](propId, 4)).to.equal(1);
    expect(await governor[proposalVotes](propId, 5)).to.equal(4); // 1st
  });

  it('should execute the proposal and mint NFTs to the winners', async () => {
    const tx = await competitions.endCompetition(competitionName);
    await expect(tx).to.emit(governor, 'ProposalExecuted');
    await expect(tx).to.emit(awards, 'Transfer');
  });

  it('winners should top up their balances', async () => {
    await Promise.all(
      [teams[5 - 1], teams[2 - 1], teams[3 - 1], teams[1 - 1]].map(
        async (winner) => {
          expect(await awards.balanceOf(winner)).to.equal(1);
        },
      ),
    );
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
    await checkNftMint(5, 1, 4);
    await checkNftMint(2, 2, 3);
    await checkNftMint(1, 3, 2);
    await checkNftMint(3, 3, 2);
  });
});
