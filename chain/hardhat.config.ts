import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { mnemonic } from './.secret.json';

const accounts = {
  mnemonic,
  path: "m/44'/60'/0'/0",
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts,
    },
    rskmainnet: {
      chainId: 30,
      url: 'https://public-node.rsk.co/',
      accounts,
    },
    rsktestnet: {
      chainId: 31,
      url: 'https://public-node.testnet.rsk.co/',
      accounts,
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/YMsB0__NR71E9X257R_OMKsv7JTK_wkf`,
      chainId: 5,
      accounts: {
        mnemonic,
      },
    },
  },
};

export default config;
