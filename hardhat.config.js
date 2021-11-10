require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-web3');
require('dotenv').config();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      hardfork: 'london',
      allowUnlimitedContractSize: true,
      gasPrice: 'auto',
    },
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
