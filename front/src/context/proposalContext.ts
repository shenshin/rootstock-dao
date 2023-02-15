import { createContext } from 'react';
import { ethers, BigNumber } from 'ethers';

export interface IProposal {
  addresses: string[];
  amounts: BigNumber[];
  calldatas: string[];
  description: string;
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

export function getProposalId(proposal: IProposal): BigNumber {
  const { addresses, amounts, calldatas, description } = proposal;
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
  proposals: IProposal[];
  setProposals: React.Dispatch<React.SetStateAction<IProposal[]>>;
}

export const ProposalContext = createContext<IProposalContext>({
  proposals: [],
  setProposals: () => {},
});

export default ProposalContext;
