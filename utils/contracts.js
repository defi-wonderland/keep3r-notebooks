const { network } = require('hardhat');

const setBalance = async (address, amount) => {
  await network.provider.send('hardhat_setBalance', [address, amount.toHexString()]);
};

exports.setBalance = setBalance;