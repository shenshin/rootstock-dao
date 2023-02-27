import hre from 'hardhat';
import { BigNumber } from 'ethers';
import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { RootstockGovernor, VoteToken } from '../typechain-types';
import {
  deploy,
  Proposal,
  ProposalState,
  VoteOptions,
  getProposalId,
} from '../util';

describe('Governor', () => {
  let governor: RootstockGovernor;
  let voteToken: VoteToken;
  let proposal: Proposal;
  let proposalId: BigNumber;

  before(async () => {
    const contracts = await loadFixture(deploy);
    governor = contracts.governor;
    voteToken = contracts.voteToken;
  });

  it('should delegate voting power', async () => {
    const [signer] = await hre.ethers.getSigners();
    const tx = await voteToken.delegate(signer.address);
    await expect(tx).to.emit(voteToken, 'DelegateChanged');
    const vp = await voteToken.getVotes(signer.address);
    expect(vp).to.equal(1);
  });

  it('should create proposal', async () => {
    const [signer] = await hre.ethers.getSigners();
    const amount = '0.000001';
    const description = 'Proposal #1';
    proposal = [
      [signer.address],
      [hre.ethers.utils.parseEther(amount)],
      ['0x'],
      description,
    ];
    proposalId = getProposalId(proposal);
    const tx = await governor.propose(...proposal);
    await expect(tx).to.emit(governor, 'ProposalCreated');
  });

  it('proposal should be active', async () => {
    await mine(2);
    const state = await governor.state(proposalId);
    expect(state).to.equal(ProposalState.Active);
  });

  it('should vote for proposal', async () => {
    const [voter] = await hre.ethers.getSigners();
    const tx = await governor.castVote(proposalId, VoteOptions.For);
    await expect(tx)
      .to.emit(governor, 'VoteCast')
      .withArgs(voter.address, proposalId, VoteOptions.For, 1, '');
  });

  it('should count the vote', async () => {
    const votes = await governor['proposalVotes(uint256)'](proposalId);
    expect(votes.forVotes).to.equal(1);
    expect(votes.againstVotes).to.equal(0);
    expect(votes.abstainVotes).to.equal(0);
  });

  it('proposal should be successful', async () => {
    await mine(20);
    const state = await governor.state(proposalId);
    expect(state).to.equal(ProposalState.Succeeded);
  });

  it('should execute the proposal', async () => {
    const [voter] = await hre.ethers.getSigners();
    const [targets, values, calldatas, desc] = proposal;
    const descHash = hre.ethers.utils.solidityKeccak256(['string'], [desc]);
    const tx = governor.execute(targets, values, calldatas, descHash);
    await expect(tx).to.emit(governor, 'ProposalExecuted');
    await expect(() => tx).to.changeEtherBalance(
      voter,
      hre.ethers.utils.parseEther('0.000001'),
    );
  });
});
