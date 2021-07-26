const { network } = require('hardhat');

exports.setBalance = async (address, amount) => {
  await network.provider.send('hardhat_setBalance', [address, amount.toHexString()]);
};
