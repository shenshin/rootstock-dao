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

export enum VoteOptions {
  Against,
  For,
  Abstain,
}

export async function deploy() {
  // deploy VoteToken NFT smart contract
  const VoteTokenFactory = await hre.ethers.getContractFactory('VoteToken');
  const voteToken = await VoteTokenFactory.deploy();
  await voteToken.deployed();

  // mint some NFTs
  const signers = await hre.ethers.getSigners();
  const tx = await voteToken.safeMintBatch(signers.map((s) => s.address));
  await tx.wait();

  // deploy RootstockGovernor
  const GovernorFactory = await hre.ethers.getContractFactory(
    'RootstockGovernor',
  );
  const governor = await GovernorFactory.deploy(voteToken.address);
  await governor.deployed();

  // Send some RBTC to Governor treasury for proposal execution testing
  const amount = '0.00001';
  const transferTx = await signers[0].sendTransaction({
    to: governor.address,
    value: hre.ethers.utils.parseEther(amount),
  });
  await transferTx.wait();

  // deploy Competition
  const CompetitionFactory = await hre.ethers.getContractFactory('Competition');
  const competition = await CompetitionFactory.deploy(governor.address);
  await competition.deployed();

  // deploy Awards
  const AwardsFactory = await hre.ethers.getContractFactory('Awards');
  const awards = await AwardsFactory.deploy(competition.address);
  await awards.deployed();
  const setAwardTx = await competition.setAwards(awards.address);
  await setAwardTx.wait();

  return { signers, voteToken, governor, competition, awards };
}
