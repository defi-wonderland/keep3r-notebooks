const { ethers, network } = require('hardhat');
const { Wallet } = require('ethers');
const { getAddress } = require('ethers/lib/utils');
const { randomHex } = require('web3-utils');

exports.impersonate = async (address) => {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  return ethers.provider.getSigner(address);
};

exports.generateRandomAddress = () => {
  return getAddress(randomHex(20));
};

exports.generateRandom = async () => {
  return (await Wallet.createRandom()).connect(ethers.provider);
};
