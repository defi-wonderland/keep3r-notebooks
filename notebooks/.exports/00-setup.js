// import dependencies

var moment = require('moment');
var { constants } = require('../utils');
var { advanceTimeAndBlock } = require('../utils/evm');
var { evm, common, contracts } = require('../utils');
var { toUnit } = require('../utils/bn');
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm');
var { next, clear, bnToNumber } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');
var { Keep3r } = require('../utils/common');
var { ethers } = require('hardhat');

kp3rAmount = toUnit(10);

var $ = new Notebook();
var keep3r = new Keep3r();
var snapshots = new evm.SnapshotManager();

clear();

// setup tools and contracts

next(async () => {
  await $.setup(constants.FORK_BLOCK_NUMBER);
  await keep3r.setup();

  provider = await $.newSigner();
  weth = await $.fetch('ERC20ForTest', constants.WETH_ADDRESS);
  uniV3Pool = await $.fetch('IUniswapV3Pool', constants.UNISWAP_V3_ORACLE_POOL);
});

// mint a liquidity to Keep3r.provider

next(async () => {
  // mint KP3R and WETH to provider and approve spendings
  await keep3r.proxy.connect(keep3r.governance)['mint(address,uint256)'](provider.address, kp3rAmount);
  await keep3r.v1.connect(provider).approve(keep3r.pool.address, kp3rAmount);
  await weth.connect(provider).deposit(kp3rAmount, { value: kp3rAmount });
  await weth.connect(provider).approve(keep3r.pool.address, kp3rAmount);

  kp3rInitialBalance = await keep3r.v1.balanceOf(provider.address);
  wethInitialBalance = await weth.balanceOf(provider.address);

  // mint kLP
  liquidity = await keep3r.pool.connect(provider).callStatic.mint(kp3rAmount, kp3rAmount, 0, 0, provider.address);
  await keep3r.pool.connect(provider).mint(kp3rAmount, kp3rAmount, 0, 0, provider.address);

  kp3rBalance = await keep3r.v1.balanceOf(provider.address);
  wethBalance = await weth.balanceOf(provider.address);
  klpBalance = await keep3r.pool.balanceOf(provider.address);
  kp3rSpent = kp3rInitialBalance.sub(kp3rBalance);
  wethSpent = wethInitialBalance.sub(wethBalance);
});

// take snapshot

next(async () => {
  setupSnap = await snapshots.take();
});
