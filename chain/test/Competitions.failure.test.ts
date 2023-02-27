import hre from 'hardhat';
import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deploy, getProposalId, Proposal, ProposalState } from '../util';
import { RootstockGovernor, Competition, VoteToken } from '../typechain-types';

async function startCompetition(
  governor: RootstockGovernor,
  competition: Competition,
  voteToken: VoteToken,
) {
  const signers = await hre.ethers.getSigners();
  await voteToken.delegate(signers[0].address);
  const competitionName = 'Competition 1';
  const teams = signers.slice(1, 6).map((s) => s.address);
  const callback = competition.interface.encodeFunctionData(
    'onCompetitionEnd',
    [competitionName, teams],
  );
  const proposal: Proposal = [
    [competition.address],
    [0],
    [callback],
    competitionName,
  ];
  const proposalId = getProposalId(proposal);
  // start the competition
  const tx = await governor.proposeBallot(...proposal);
  await tx.wait();
  await mine(2);
  return { proposal, teams, proposalId };
}

describe('Competition error path', () => {
  it('voter cannot vote twice', async () => {
    const { competition, governor, voteToken } = await loadFixture(deploy);
    const { proposalId } = await startCompetition(
      governor,
      competition,
      voteToken,
    );
    // first vote successful
    const tx1 = await governor.castVote(proposalId, 2);
    await tx1.wait();
    // second attempt fails
    const tx2 = governor.castVote(proposalId, 2);
    await expect(tx2).to.be.revertedWith(
      'GovernorCountingUniversal: vote already cast',
    );
  });

  it('proposal should be defeated without any votes', async () => {
    const { competition, governor, voteToken } = await loadFixture(deploy);
    const { proposalId } = await startCompetition(
      governor,
      competition,
      voteToken,
    );
    // wait some time w/o voting
    await mine(50);
    const state = await governor.state(proposalId);
    expect(state).to.equal(ProposalState.Defeated);
  });

  it('competition proposal cannot be executed twice', async () => {
    const { competition, governor, voteToken, signers } = await loadFixture(
      deploy,
    );
    const { proposalId, proposal } = await startCompetition(
      governor,
      competition,
      voteToken,
    );
    await governor.castVote(proposalId, 10).then((tx) => tx.wait());
    await governor
      .connect(signers[1])
      .castVote(proposalId, 10)
      .then((tx) => tx.wait());

    await mine(20);
    const [targets, values, calldatas, description] = proposal;
    const descHash = hre.ethers.utils.solidityKeccak256(
      ['string'],
      [description],
    );
    // first execution
    const execution1 = await governor.execute(
      targets,
      values,
      calldatas,
      descHash,
    );
    await expect(execution1).to.emit(governor, 'ProposalExecuted');
    // second attempt
    const execution2 = governor.execute(targets, values, calldatas, descHash);
    await expect(execution2).to.be.revertedWith(
      'Governor: proposal not successful',
    );
  });

  it('Competition is not going to execute proposal with invalid number of teams', async () => {
    /* 
    It's possible to create an invalid proposal because Governor doesn't verify
    calldatas
    */
    const { competition, governor, voteToken, signers } = await loadFixture(
      deploy,
    );
    await voteToken.delegate(signers[0].address);
    const competitionName = 'Competition 1';
    const addresses: string[] = signers.map((s) => s.address);
    // 400 addresses instead of 250 max
    const tooManyTeams: string[] = Array(20).fill(addresses).flat();
    // possible to create a proposal
    const callback = competition.interface.encodeFunctionData(
      'onCompetitionEnd',
      [competitionName, tooManyTeams],
    );
    const proposal: Proposal = [
      [competition.address],
      [0],
      [callback],
      competitionName,
    ];
    const proposalId = getProposalId(proposal);
    // start competition
    const propose = await governor.proposeBallot(...proposal);
    await propose.wait();
    await mine(2);
    const vote = await governor.castVote(proposalId, 10);
    await vote.wait();
    await mine(50);
    const state = await governor.state(proposalId);
    // make sure the proposal is successful
    expect(state).to.equal(ProposalState.Succeeded);
    const descHash = hre.ethers.utils.solidityKeccak256(
      ['string'],
      [competitionName],
    );
    // However Competition s/c will not mint prizes for illegal competition proposal
    const tx = governor.execute(
      [competition.address],
      [0],
      [callback],
      descHash,
    );
    await expect(tx).to.be.revertedWith(
      'Competitions: Min 2, max 250 teams are allowed',
    );
  });
});
