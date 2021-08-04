var moment = require('moment');
var { constants } = require('../utils');
var { toUnit } = require('../utils/bn');
var { LIQUIDITIES } = require('../utils/constants');
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm');
var { next, clear } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');
var { ethers, web3, artifacts } = require('hardhat');

clear();

var $ = new Notebook();

next(async () => {
  await $.setup();
});

UNISWAP_V3_POOL = '0x11B7a6bc0259ed6Cf9DB8F499988F9eCc7167bf5';
UNISWAP_V2_PAIR = '0xaf988afF99d3d0cb870812C325C588D8D8CB7De8';
RICH_KP3R_WETH_POOL_ADDRESS = '0x2269522ad48aeb971b25042471a44acc8c1b5eca';

next(async () => {
  artifact = await artifacts.readArtifact('IUniswapV3PoolForTest');
  uniV3Pool = new web3.eth.Contract(artifact.abi, UNISWAP_V3_POOL);
  artifact = await artifacts.readArtifact('UniswapV2Pair');
  uniV2Pair = new web3.eth.Contract(artifact.abi, UNISWAP_V2_PAIR);
});

next(async () => {
  console.log(await uniV3Pool.methods.observe([832000, 0]).call());
});
