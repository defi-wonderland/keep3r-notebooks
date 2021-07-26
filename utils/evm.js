const { network } = require('hardhat');

exports.advanceTimeAndBlock = async (time) => {
  await advanceTime(time);
  await advanceBlock();
};

exports.advanceToTimeAndBlock = async (time) => {
  await advanceToTime(time);
  await advanceBlock();
};

exports.advanceTime = async (time) => {
  await network.provider.request({
    method: 'evm_increaseTime',
    params: [time],
  });
};

exports.advanceToTime = async (time) => {
  await network.provider.request({
    method: 'evm_setNextBlockTimestamp',
    params: [time],
  });
};

exports.advanceBlock = async () => {
  await network.provider.request({
    method: 'evm_mine',
    params: [],
  });
};

exports.reset = async (forking = null) => {
  const params = forking ? [{ forking }] : [];
  await network.provider.request({
    method: 'hardhat_reset',
    params,
  });
};
