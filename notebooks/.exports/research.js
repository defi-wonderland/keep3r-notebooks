var { evm, wallet, constants, common } = require('../utils');
var { getPastEvents } = require('../utils/contracts');
var { unixToDate } = require('../utils/jupyter');
var { web3, artifacts } = require('hardhat');
var Plot = require('plotly-notebook-js');
var { CreditRecorder } = require('../utils/credit-recorder');
var { next, clear } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');
var { toUnit } = require('../utils/bn');

// setup notebook scope
var $ = new Notebook();
next(async () => {
  await $.setup();
});

UNISWAP_V3_POOL = '0x11B7a6bc0259ed6Cf9DB8F499988F9eCc7167bf5';
UNISWAP_V2_PAIR = '0xaf988afF99d3d0cb870812C325C588D8D8CB7De8';
RICH_KP3R_WETH_POOL_ADDRESS = '0x2269522ad48aeb971b25042471a44acc8c1b5eca';

toUnit(1);

0x0de0b6b3a7640000;

// balanceOf 0x2269522ad48aeb971b25042471a44acc8c1b5eca
2717553745601527329;

uniV2Pair.methods.balanceOf(RICH_KP3R_WETH_POOL_ADDRESS).call();

toUnit(2.7).toString();

next(async () => {
  artifact = await artifacts.readArtifact('IUniswapV3PoolForTest');
  uniV3Pool = new web3.eth.Contract(artifact.abi, UNISWAP_V3_POOL);
  artifact = await artifacts.readArtifact('UniswapV2Pair');
  uniV2Pair = new web3.eth.Contract(artifact.abi, UNISWAP_V2_PAIR);
});

uniV3Pool.methods.observe([832000, 0]).call();

5 * 24 * 3600;

next(async () => {});

8000037037037037037 / 8000000000000000000;

0x2c68af0bb1400000 / 10 ** 18;

0x35e5875cdcc1d01dec72e6d0;

0x28e18f5898c62326e6d0;

0x35e5875cdcc1d01dec72e6d0 - 0x6bcabcf69ad26eaf92980000 / 2;
