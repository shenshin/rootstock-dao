import { createContext } from 'react';
import { providers } from 'ethers';

export interface IWeb3Context {
  address?: string;
  provider?: providers.Web3Provider;
  connect?: () => Promise<void>;
}

export const Web3Context = createContext<IWeb3Context>({});

export default Web3Context;
