import { ethers } from 'ethers';
import {
  ERC20__factory,
  ERC20,
  VoteToken__factory,
  VoteToken,
  RootstockGovernor__factory,
  RootstockGovernor,
} from './typechain-types';
import rifDeployed from './RIF.rsktestnet.address.json';
import voteTokenDeployed from './VoteToken.rsktestnet.address.json';
import governorDeployed from './RootstockGovernor.rsktestnet.address.json';

export interface Contracts {
  rif: ERC20;
  voteToken: VoteToken;
  governor: RootstockGovernor;
}

export function getContracts(
  provider: ethers.providers.Web3Provider | undefined,
): Contracts {
  const rif = new ethers.Contract(
    rifDeployed.address.toLowerCase(),
    ERC20__factory.abi,
    provider?.getSigner(0),
  ) as ERC20;
  const voteToken = new ethers.Contract(
    voteTokenDeployed.address.toLowerCase(),
    VoteToken__factory.abi,
    provider?.getSigner(0),
  ) as VoteToken;
  const governor = new ethers.Contract(
    governorDeployed.address.toLowerCase(),
    RootstockGovernor__factory.abi,
    provider?.getSigner(0),
  ) as RootstockGovernor;
  return { rif, voteToken, governor };
}

export default getContracts;
