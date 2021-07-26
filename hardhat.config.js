require('@nomiclabs/hardhat-ethers');
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
