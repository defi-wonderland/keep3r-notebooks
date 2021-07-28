const { network } = require('hardhat');

const advanceTimeAndBlock = async (time) => {
  await advanceTime(time);
  await advanceBlock();
};

const advanceToTimeAndBlock = async (time) => {
  await advanceToTime(time);
  await advanceBlock();
};

const advanceTime = async (time) => {
  await network.provider.request({
    method: 'evm_increaseTime',
    params: [time],
  });
};

const advanceToTime = async (time) => {
  await network.provider.request({
    method: 'evm_setNextBlockTimestamp',
    params: [time],
  });
};

const advanceBlock = async () => {
  await network.provider.request({
    method: 'evm_mine',
    params: [],
  });
};

const reset = async (forking = null) => {
  const params = forking ? [{ forking }] : [];
  await network.provider.request({
    method: 'hardhat_reset',
    params,
  });
};

const getLatestBlockTimestamp = async () => {
  return (await ethers.provider.getBlock('latest')).timestamp;
};

exports.advanceTimeAndBlock = advanceTimeAndBlock;
exports.advanceToTimeAndBlock = advanceToTimeAndBlock;
exports.advanceTime = advanceTime;
exports.advanceToTime = advanceToTime;
exports.advanceBlock = advanceBlock;
exports.reset = reset;
exports.getLatestBlockTimestamp = getLatestBlockTimestamp;