var moment = require('moment')
var { constants } = require('../utils')
var { advanceTimeAndBlock } = require('../utils/evm')
var { evm, common } = require('../utils');
var { toUnit } = require('../utils/bn')
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm')
var { next, clear, bnToNumber } = require('../utils/jupyter')
var { Notebook } = require('../utils/notebook')
var { Keep3r } = require('../utils/common')
var { ethers } = require('hardhat')

kp3rAmount = toUnit(10)

var $ = new Notebook();
var keep3r = new Keep3r();
var snapshots = new evm.SnapshotManager()

clear();

next(async () => {
    await $.setup(constants.FORK_BLOCK_NUMBER);
    await keep3r.setup();
    
    provider = await $.newSigner();
    job = await(await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address)
    weth = await $.fetch('ERC20ForTest', constants.WETH_ADDRESS)
    uniV3Pool = await $.fetch('IUniswapV3Pool', constants.UNISWAP_V3_ORACLE_POOL )
});

next(async()=>{   
    tickTime = $.time(5,'days')
    uniResponse = await uniV3Pool.observe([0,tickTime])
    // manual Uniswap quote calculation: 1.0001^tick
    quote = 1.0001**(((uniResponse[0][1]).sub(uniResponse[0][0])).div(tickTime))
    
    console.log('tickQuote', 1/quote)
})

next(async()=>{
    // mint KP3R and WETH to provider and approve spendings
    await keep3r.proxy.connect(keep3r.governance)['mint(address,uint256)'](provider.address, kp3rAmount)
    await keep3r.v1.connect(provider).approve(keep3r.pool.address, kp3rAmount)
    await weth.connect(provider).deposit(kp3rAmount, {value:kp3rAmount})
    await weth.connect(provider).approve(keep3r.pool.address, kp3rAmount)
    
    kp3rInitialBalance = await keep3r.v1.balanceOf(provider.address)
    wethInitialBalance = await weth.balanceOf(provider.address)

    // mint kLP
    liquidity = await keep3r.pool.connect(provider).callStatic.mint(kp3rAmount,kp3rAmount,0,0,provider.address)
    await keep3r.pool.connect(provider).mint(kp3rAmount,kp3rAmount,0,0,provider.address)
    
    kp3rBalance = await keep3r.v1.balanceOf(provider.address)
    wethBalance = await weth.balanceOf(provider.address)
    klpBalance = await keep3r.pool.balanceOf(provider.address)
    console.log('KP3R spent', bnToNumber(kp3rInitialBalance.sub(kp3rBalance)))
    console.log('WETH spent', bnToNumber(wethInitialBalance.sub(wethBalance)))
    console.log('kLP minted', bnToNumber(klpBalance))
})

next(async()=>{    
    await keep3r.v2.connect(provider).addJob(job.address)
    await keep3r.pool.connect(provider).approve(keep3r.v2.address, klpBalance)
    await keep3r.v2.connect(provider).addLiquidityToJob(job.address, keep3r.pool.address, klpBalance)
})

next(async()=>{
    setupSnap = await snapshots.take()
    
    console.log('totalJobCredits', bnToNumber((await keep3r.v2.totalJobCredits(job.address))))
    console.log('jobPeriodCredits', bnToNumber((await keep3r.v2.jobPeriodCredits(job.address))))
    console.log('jobLiquidityCredits', bnToNumber((await keep3r.v2.jobLiquidityCredits(job.address))))
})
