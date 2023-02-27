import { ethers } from 'ethers';
import {
  VoteToken__factory,
  VoteToken,
  RootstockGovernor__factory,
  RootstockGovernor,
  Competition__factory,
  Competition,
  Awards__factory,
  Awards,
} from './typechain-types';

import voteTokenDeployed from './VoteToken.rsktestnet.address.json';
import governorDeployed from './RootstockGovernor.rsktestnet.address.json';
import competitionDeployed from './Competition.rsktestnet.address.json';
import awardsDeployed from './Awards.rsktestnet.address.json';

export interface Contracts {
  voteToken: VoteToken;
  governor: RootstockGovernor;
  competition: Competition;
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
  const competition = new ethers.Contract(
    competitionDeployed.address.toLowerCase(),
    Competition__factory.abi,
    provider.getSigner(0),
  ) as Competition;
  const awards = new ethers.Contract(
    awardsDeployed.address.toLowerCase(),
    Awards__factory.abi,
    provider.getSigner(0),
  ) as Awards;
  return { voteToken, governor, competition, awards };
}

export default getContracts;
