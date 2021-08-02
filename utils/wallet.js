const { ethers, network } = require('hardhat');
const { Wallet } = require('ethers');
const { getAddress } = require('ethers/lib/utils');
const { randomHex } = require('web3-utils');

const impersonate = async (address) => {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  return ethers.provider.getSigner(address);
};

const generateRandomAddress = () => {
  return getAddress(randomHex(20));
};

const generateRandom = async () => {
  return (await Wallet.createRandom()).connect(ethers.provider);
};

exports.impersonate = impersonate;
exports.generateRandomAddress = generateRandomAddress;
exports.generateRandom = generateRandom;
