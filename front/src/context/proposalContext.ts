import { createContext } from 'react';
import { ethers, BigNumber } from 'ethers';

export interface IProposal {
  description: string;
  proposalId: BigNumber;
}
export interface ITransfer extends IProposal {
  addresses: string[];
  amounts: BigNumber[];
  calldatas: string[];
}

export interface ICompetition extends IProposal {
  teams: {
    id: number;
    name: string;
    address: string;
  }[];
}

// typeguard
export function isCompetition(proposal: IProposal): proposal is ICompetition {
  return 'teams' in proposal;
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
  proposals: Array<ITransfer | ICompetition>;
  setProposals: React.Dispatch<
    React.SetStateAction<Array<ITransfer | ICompetition>>
  >;
}

export const ProposalContext = createContext<IProposalContext>({
  proposals: [],
  setProposals: () => {},
});

export default ProposalContext;
