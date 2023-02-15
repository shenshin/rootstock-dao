import hre from 'hardhat';
import { BigNumberish, BytesLike, BigNumber } from 'ethers';
import { mine } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { RootstockGovernor, VoteToken } from '../typechain-types';

type Proposal = [string[], BigNumberish[], BytesLike[], string];
enum VoteOptions {
  Against,
  For,
  Abstain,
}
enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

describe('Governor', () => {
  let governor: RootstockGovernor;
  let voteToken: VoteToken;
  let proposal: Proposal;

  const deploy = async () => {
    // deploy vote token
    const VTFactory = await hre.ethers.getContractFactory('VoteToken');
    voteToken = await VTFactory.deploy();
    await voteToken.deployed();
    // mint NFTs
    const signers = (await hre.ethers.getSigners()).slice(0, 5);
    const mintTx = await voteToken.safeMintBatch(signers.map((s) => s.address));
    await mintTx.wait();
    // deploy Governor
    const GovFactory = await hre.ethers.getContractFactory('RootstockGovernor');
    governor = await GovFactory.deploy(voteToken.address);
    await governor.deployed();
    signers[0].sendTransaction({
      to: governor.address,
      value: hre.ethers.utils.parseEther('1'),
    });
  };

  const getProposalID = (): Promise<BigNumber> => {
    const [targets, values, calldatas, desc] = proposal;
    const descHash = hre.ethers.utils.solidityKeccak256(['string'], [desc]);
    return governor.hashProposal(targets, values, calldatas, descHash);
  };

  before(async () => {
    await deploy();
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
    const tx = await governor.propose(...proposal);
    await expect(tx).to.emit(governor, 'ProposalCreated');
  });

  it('proposal should be active', async () => {
    await mine(2);
    const propId = await getProposalID();
    const state = await governor.state(propId);
    expect(state).to.equal(ProposalState.Active);
  });

  it('should vote for proposal', async () => {
    const [voter] = await hre.ethers.getSigners();
    const propId = await getProposalID();
    const tx = await governor.castVote(propId, VoteOptions.For);
    await expect(tx)
      .to.emit(governor, 'VoteCast')
      .withArgs(voter.address, propId, VoteOptions.For, 1, '');
  });

  it('proposal should be successful', async () => {
    await mine(20);
    const propId = await getProposalID();
    const state = await governor.state(propId);
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
