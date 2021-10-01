require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-web3');
require('dotenv').config();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {},
  hardhat: {
    allowUnlimitedContractSize: true,
    gasPrice: 'auto',
  },
  mainnet: {
    url: process.env.MAINNET_HTTPS_URL,
    accounts: [process.env.MAINNET_PRIVATE_KEY],
    gasPrice: 'auto',
  },
  solidity: {
    version: '0.8.7',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
