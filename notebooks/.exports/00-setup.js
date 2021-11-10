// import dependencies

var moment = require('moment')
var { constants } = require('../utils')
var { advanceTimeAndBlock } = require('../utils/evm')
var { evm, common, contracts } = require('../utils');
var { toUnit } = require('../utils/bn')
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm')
var { next, clear, bnToNumber } = require('../utils/jupyter')
var { Notebook } = require('../utils/notebook')
var { ethers } = require('hardhat')

var $ = new Notebook();
var snapshots = new evm.SnapshotManager()

clear();

// setup tools and contracts

next(async () => {
    await $.setup(constants.FORK_BLOCK_NUMBER);
    
    provider = await $.impersonate(constants.RICH_DAI_ADDRESS);
    dai = await $.fetch('ERC20', constants.DAI_ADDRESS)
    uniV3Pool = await $.fetch('IUniswapV3Pool', constants.UNISWAP_V3_ORACLE_POOL )
});

// take snapshot

next(async()=>{
    setupSnap = await snapshots.take()
})


