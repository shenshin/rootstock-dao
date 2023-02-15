import { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Context, IWeb3Context } from '../context/web3Context';

interface Web3ProviderProps {
  children: React.ReactNode;
}
function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [address, setAddress] = useState<string>('');
  const [chainError, setChainError] = useState<string>('');

  const connect = async () => {
    try {
      // if Metamsk is not installed
      if (window.ethereum === undefined)
        throw new Error('Please install Metamask');
      await window.ethereum.request!({
        method: 'eth_requestAccounts',
      });
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const [walletAddress] = await ethersProvider.listAccounts();
      setProvider(ethersProvider);
      setAddress(walletAddress);
    } catch (error) {
      if (error instanceof Error) setChainError(error.message);
    }
  };
  const contextValue: IWeb3Context = {
    address,
    provider,
    connect,
    chainError,
  };
  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}

export default Web3Provider;
