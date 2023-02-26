import { ethers } from 'ethers';
import {
  VoteToken__factory,
  VoteToken,
  RootstockGovernor__factory,
  RootstockGovernor,
  Competitions__factory,
  Competitions,
  Awards__factory,
  Awards,
} from './typechain-types';

import voteTokenDeployed from './VoteToken.rsktestnet.address.json';
import governorDeployed from './RootstockGovernor.rsktestnet.address.json';
import competitionsDeployed from './Competitions.rsktestnet.address.json';
import awardsDeployed from './Awards.rsktestnet.address.json';

export interface Contracts {
  voteToken: VoteToken;
  governor: RootstockGovernor;
  competitions: Competitions;
  awards: Awards;
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
  const competitions = new ethers.Contract(
    competitionsDeployed.address.toLowerCase(),
    Competitions__factory.abi,
    provider.getSigner(0),
  ) as Competitions;
  const awards = new ethers.Contract(
    awardsDeployed.address.toLowerCase(),
    Awards__factory.abi,
    provider.getSigner(0),
  ) as Awards;
  return { voteToken, governor, competitions, awards };
}

export default getContracts;
