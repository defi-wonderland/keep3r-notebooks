const { network } = require('hardhat');
const { FORK_BLOCK_NUMBER } = require('./constants');

const setBalance = async (address, amount) => {
  await network.provider.send('hardhat_setBalance', [address, amount.toHexString()]);
};

const getPastEvents = (contract, eventName, fromBlock, options) => {
  if (fromBlock == undefined) {
    fromBlock = FORK_BLOCK_NUMBER;
  }
  return new Promise((resolve, reject) => {
    const optionsWithDefault = {
      fromBlock: fromBlock,
      toBlock: 'latest',
      ...options,
    };

    contract.getPastEvents(eventName, optionsWithDefault, (err, events) => {
      if (err) reject(err);
      else resolve(events);
    });
  });
};

exports.setBalance = setBalance;
exports.getPastEvents = getPastEvents;
