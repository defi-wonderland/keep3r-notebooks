require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-web3');
require('dotenv').config();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {},
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
