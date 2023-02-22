import { BigNumberish, BytesLike, BigNumber } from 'ethers';
import { ethers } from 'hardhat';

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
