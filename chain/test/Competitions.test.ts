import hre from 'hardhat';
import { BigNumberish, BytesLike, BigNumber } from 'ethers';
import { mine } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import {
  GovernorBallot,
  VoteToken,
  Competitions,
  Awards,
} from '../typechain-types';

type Proposal = [string[], BigNumberish[], BytesLike[], string];

function getProposalId(proposal: Proposal): BigNumber {
  const [addresses, amounts, calldatas, description] = proposal;
  const descHash = hre.ethers.utils.solidityKeccak256(
    ['string'],
    [description],
  );
  return BigNumber.from(
    hre.ethers.utils.keccak256(
      hre.ethers.utils.defaultAbiCoder.encode(
        ['address[]', 'uint256[]', 'bytes[]', 'bytes32'],
        [addresses, amounts, calldatas, descHash],
      ),
    ),
  );
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
  let governor: GovernorBallot;
  let voteToken: VoteToken;
  let proposal: Proposal;
  let competitions: Competitions;
  let awards: Awards;
  let teams: string[];
  let competitionName: string;

  const deploy = async () => {
    // deploy vote token
    const VTFactory = await hre.ethers.getContractFactory('VoteToken');
    voteToken = await VTFactory.deploy();
    await voteToken.deployed();
    // mint NFTs
    const signers = await hre.ethers.getSigners();
    const mintTx = await voteToken.safeMintBatch(signers.map((s) => s.address));
    await mintTx.wait();
    // deploy Governor
    const GovFactory = await hre.ethers.getContractFactory('GovernorBallot');
    governor = await GovFactory.deploy(voteToken.address);
    await governor.deployed();
    signers[0].sendTransaction({
      to: governor.address,
      value: hre.ethers.utils.parseEther('1'),
    });
    // deploy Competitions
    const CompetitionsFactory = await hre.ethers.getContractFactory(
      'Competitions',
    );
    competitions = await CompetitionsFactory.deploy(governor.address);
    await competitions.deployed();
    // deploy Awards
    const AwardsFactory = await hre.ethers.getContractFactory('Awards');
    awards = await AwardsFactory.deploy(competitions.address);
    // set Awards address on the Competitions
    const setAwardstx = await competitions.setAwards(awards.address);
    await setAwardstx.wait();
  };

  before(async () => {
    await deploy();
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
    const ranks = 3;
    const descHash = hre.ethers.utils.solidityKeccak256(
      ['string'],
      [competitionName],
    );

    const callback = competitions.interface.encodeFunctionData(
      'endCompetition',
      [descHash],
    );
    proposal = [[competitions.address], [0], [callback], competitionName];
    const proposalId = getProposalId(proposal);
    teams = (await hre.ethers.getSigners()).slice(1, 6).map((s) => s.address);
    // start the competition
    const tx = await competitions.startCompetition(
      teams,
      competitionName,
      ranks,
    );
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
    const propId = getProposalId(proposal);
    const state = await governor.state(propId);
    expect(state).to.equal(ProposalState.Active);
  });

  it('voters should vote for different teams', async () => {
    const propId = getProposalId(proposal);
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
    const propId = getProposalId(proposal);
    const state = await governor.state(propId);
    expect(state).to.equal(ProposalState.Succeeded);
  });

  it('votes should be recorded correctly', async () => {
    const propId = getProposalId(proposal);
    expect(await governor.proposalVotes(propId, 0)).to.equal(0);
    expect(await governor.proposalVotes(propId, 1)).to.equal(2); // 3rd
    expect(await governor.proposalVotes(propId, 2)).to.equal(3); // 2nd
    expect(await governor.proposalVotes(propId, 3)).to.equal(2); // 3rd
    expect(await governor.proposalVotes(propId, 4)).to.equal(1);
    expect(await governor.proposalVotes(propId, 5)).to.equal(4); // 1st
  });

  it('should execute the proposal and mint NFTs to the winners', async () => {
    const [targets, values, calldatas] = proposal;
    const descHash = hre.ethers.utils.solidityKeccak256(
      ['string'],
      [competitionName],
    );
    const tx = await governor.execute(targets, values, calldatas, descHash);
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

  it('winners should own minted NFTs', async () => {
    expect(await awards.ownerOf(0)).to.equal(teams[5 - 1]);
    expect(await awards.ownerOf(1)).to.equal(teams[2 - 1]);
    expect(await awards.ownerOf(2)).to.equal(teams[1 - 1]);
    expect(await awards.ownerOf(3)).to.equal(teams[3 - 1]);
  });

  it('NFTs shouls save info about the places taken in the competition', async () => {
    const prize0 = await awards.prizes(0);
    expect(prize0.competitionName).to.equal(competitionName);
    expect(prize0.rank).to.equal(1);

    const prize1 = await awards.prizes(1);
    expect(prize1.competitionName).to.equal(competitionName);
    expect(prize1.rank).to.equal(2);

    const prize2 = await awards.prizes(2);
    expect(prize2.competitionName).to.equal(competitionName);
    expect(prize2.rank).to.equal(3);

    const prize3 = await awards.prizes(3);
    expect(prize3.competitionName).to.equal(competitionName);
    expect(prize3.rank).to.equal(3);
  });
});
