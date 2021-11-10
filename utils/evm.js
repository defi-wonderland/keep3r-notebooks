const { network } = require('hardhat');
const { ethers } = require('hardhat');

class SnapshotManager {
  snapshots = {};

  async take() {
    const id = await this.takeSnapshot();
    this.snapshots[id] = id;
    return id;
  }

  async revert(id) {
    await this.revertSnapshot(id);
    await advanceBlock();
    this.snapshots[id] = await this.takeSnapshot();
  }

  async takeSnapshot() {
    return await network.provider.request({
      method: 'evm_snapshot',
      params: [],
    });
  }

  async revertSnapshot(id) {
    await network.provider.request({
      method: 'evm_revert',
      params: [id],
    });
  }
}

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

const getBlockTimestamp = async (blockNumber) => {
  return (await ethers.provider.getBlock(blockNumber)).timestamp;
};

exports.SnapshotManager = SnapshotManager;
exports.advanceTimeAndBlock = advanceTimeAndBlock;
exports.advanceToTimeAndBlock = advanceToTimeAndBlock;
exports.advanceTime = advanceTime;
exports.advanceToTime = advanceToTime;
exports.advanceBlock = advanceBlock;
exports.reset = reset;
exports.getLatestBlockTimestamp = getLatestBlockTimestamp;
exports.getBlockTimestamp = getBlockTimestamp;
