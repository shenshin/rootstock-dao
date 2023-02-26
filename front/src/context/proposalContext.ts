import { createContext } from 'react';
import { ethers, BigNumber } from 'ethers';

export interface IProposal {
  description: string;
  proposalId: BigNumber;
  addresses: string[];
  amounts: BigNumber[];
  calldatas: string[];
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

export function getProposalId(
  addresses: string[],
  amounts: BigNumber[],
  calldatas: string[],
  description: string,
): BigNumber {
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

export interface IProposalContext {
  proposals: Array<IProposal>;
  setProposals: React.Dispatch<React.SetStateAction<Array<IProposal>>>;
}

export const ProposalContext = createContext<IProposalContext>({
  proposals: [],
  setProposals: () => {},
});

export default ProposalContext;
