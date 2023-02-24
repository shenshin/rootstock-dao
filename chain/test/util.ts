import { BigNumberish, BytesLike, BigNumber } from 'ethers';
import hre, { ethers } from 'hardhat';

export type Proposal = [string[], BigNumberish[], BytesLike[], string];

export function getProposalId(proposal: Proposal): BigNumber {
  const [addresses, amounts, calldatas, description] = proposal;
  const descHash = ethers.utils.solidityKeccak256(['string'], [description]);
  return BigNumber.from(
    ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address[]', 'uint256[]', 'bytes[]', 'bytes32'],
        [addresses, amounts, calldatas, descHash],
      ),
    ),
  );
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export async function deploy() {
  const signers = await hre.ethers.getSigners();
  // deploy vote token
  const VTFactory = await hre.ethers.getContractFactory('VoteToken');
  const voteToken = await VTFactory.deploy();
  await voteToken.deployed();
  // mint NFTs
  const mintTx = await voteToken.safeMintBatch(signers.map((s) => s.address));
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
  return { signers, voteToken, governor, competitions, awards };
}
