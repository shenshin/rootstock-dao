import hre from 'hardhat';
import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { Proposal, ProposalState, getProposalId } from './util';

const deploy = async () => {
  const signers = await hre.ethers.getSigners();
  const voterAddresses = signers.map((s) => s.address).slice(0, 10);
  // deploy vote token
  const VTFactory = await hre.ethers.getContractFactory('VoteToken');
  const voteToken = await VTFactory.deploy();
  await voteToken.deployed();
  // mint NFTs
  const mintTx = await voteToken.safeMintBatch(voterAddresses);
  await mintTx.wait();
  // deploy Governor
  const GovFactory = await hre.ethers.getContractFactory('GovernorBallot');
  const governor = await GovFactory.deploy(voteToken.address);
  await governor.deployed();
  signers[0].sendTransaction({
    to: governor.address,
    value: hre.ethers.utils.parseEther('1'),
  });
  // deploy Competitions
  const CompetitionsFactory = await hre.ethers.getContractFactory(
    'Competitions',
  );
  const competitions = await CompetitionsFactory.deploy(governor.address);
  await competitions.deployed();
  // deploy Awards
  const AwardsFactory = await hre.ethers.getContractFactory('Awards');
  const awards = await AwardsFactory.deploy(competitions.address);
  // set Awards address on the Competitions
  const setAwardstx = await competitions.setAwards(awards.address);
  await setAwardstx.wait();
  return { signers, voterAddresses, voteToken, governor, competitions, awards };
};

describe('Competition error path', () => {
  const competitionName = 'Competition 1';

  describe('Create competition', () => {
    it('non-owner can not start competitions', async () => {
      const { signers, voterAddresses, competitions } = await loadFixture(
        deploy,
      );
      const tx = competitions
        .connect(signers[1])
        .startCompetition(voterAddresses, competitionName);
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('cannot create a competition without members', async () => {
      const { competitions } = await loadFixture(deploy);
      const tx = competitions.startCompetition([], competitionName);
      await expect(tx).to.be.revertedWith('Min 2, max 250 teams are allowed');
    });

    it('cannot create a competition with a lot of members', async () => {
      const addresses = Array(500).fill(
        '0x1D171425b1ed35222C05Ca94A06d6569997634D8',
      );
      const { competitions } = await loadFixture(deploy);
      const tx = competitions.startCompetition(addresses, competitionName);
      await expect(tx).to.be.revertedWith('Min 2, max 250 teams are allowed');
    });

    it('should not let create competition with the same name', async () => {
      const { voterAddresses, competitions } = await loadFixture(deploy);
      const tx1 = await competitions.startCompetition(
        voterAddresses,
        competitionName,
      );
      await tx1.wait();
      const tx2 = competitions.startCompetition(
        voterAddresses,
        competitionName,
      );
      await expect(tx2).to.be.revertedWith('Competition has already started');
    });
  });

  describe('End competition. Give prizes', () => {});
});
