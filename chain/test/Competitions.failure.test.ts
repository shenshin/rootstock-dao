import { mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deploy } from './util';

describe('Competition error path', () => {
  const competitionName = 'Competition 1';

  describe('Create competition', () => {
    it('non-owner can not start competitions', async () => {
      const { signers, competitions } = await loadFixture(deploy);
      const tx = competitions.connect(signers[1]).startCompetition(
        signers.slice(1, 5).map((s) => s.address),
        competitionName,
      );
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
      const { competitions, signers } = await loadFixture(deploy);
      const tx1 = await competitions.startCompetition(
        signers.slice(1, 5).map((s) => s.address),
        competitionName,
      );
      await tx1.wait();
      const tx2 = competitions.startCompetition(
        signers.slice(1, 5).map((s) => s.address),
        competitionName,
      );
      await expect(tx2).to.be.revertedWith('Competition has already started');
    });

    it('voter cannot vote twice', async () => {
      const { competitions, signers, governor } = await loadFixture(deploy);
      const tx1 = await competitions.startCompetition(
        signers.slice(1, 5).map((s) => s.address),
        competitionName,
      );
      await tx1.wait();
      await mine(2);
      const txHash = await competitions.getProposalId(competitionName);
      const tx2 = await governor.castVote(txHash, 2);
      await tx2.wait();
      const tx3 = governor.castVote(txHash, 2);
      await expect(tx3).to.be.revertedWith('GovernorBallot: vote already cast');
    });

    it('proposal should be defeated without any votes', async () => {
      const { competitions, signers } = await loadFixture(deploy);
      const tx1 = await competitions.startCompetition(
        signers.slice(1, 5).map((s) => s.address),
        competitionName,
      );
      await tx1.wait();
      await mine(50);
      const tx = competitions.endCompetition(competitionName);
      await expect(tx).to.be.revertedWith(
        'Voting is still active or quorum was not reached',
      );
    });
  });

  describe('End competition. Give prizes', () => {});
});
