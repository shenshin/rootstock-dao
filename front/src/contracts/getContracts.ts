import { ethers } from 'ethers';
import {
  VoteToken__factory,
  VoteToken,
  RootstockGovernor__factory,
  RootstockGovernor,
} from './typechain-types';

import voteTokenDeployed from './VoteToken.rsktestnet.address.json';
import governorDeployed from './RootstockGovernor.rsktestnet.address.json';

export interface Contracts {
  voteToken: VoteToken;
  governor: RootstockGovernor;
}

// eslint-disable-next-line prettier/prettier
export function getContracts(
  provider: ethers.providers.Web3Provider,
): Contracts {
  const voteToken = new ethers.Contract(
    voteTokenDeployed.address.toLowerCase(),
    VoteToken__factory.abi,
    provider.getSigner(0),
  ) as VoteToken;
  const governor = new ethers.Contract(
    governorDeployed.address.toLowerCase(),
    RootstockGovernor__factory.abi,
    provider.getSigner(0),
  ) as RootstockGovernor;
  return { voteToken, governor };
}

export default getContracts;
