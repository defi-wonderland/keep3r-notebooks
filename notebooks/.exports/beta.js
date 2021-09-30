var moment = require('moment')
var { constants } = require('../utils')
var { advanceTimeAndBlock } = require('../utils/evm')
var { evm } = require('../utils');
var { toUnit } = require('../utils/bn')
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm')
var { next, clear, bnToNumber } = require('../utils/jupyter')
var { Notebook } = require('../utils/notebook')
var { Keep3r } = require('../utils/common')
var { ethers } = require('hardhat')

oneHundred = toUnit(100)

var $ = new Notebook();
var keep3r = new Keep3r();
var snapshots = new evm.SnapshotManager()

clear();

next(async () => {
    await $.setup(constants.FORK_BLOCK_NUMBER);
    await keep3r.setup();
    
    job = await(await ethers.getContractFactory('JobForTest')).deploy(keep3r.v2.address)
    provider = await $.newSigner();
    weth = await $.fetch('ERC20ForTest', constants.WETH_ADDRESS)
    uniV3Pool = await $.fetch('IUniswapV3Pool', constants.UNISWAP_V3_ORACLE_POOL )
});

next(async()=>{   
    tickTime = $.time(5,'days')
    uniResponse = await uniV3Pool.observe([0,tickTime])
    poolLiquidity = await uniV3Pool.liquidity()
    
    quote = 1.0001**(((uniResponse[0][1]).sub(uniResponse[0][0])).div(tickTime))
    
    console.log('previous liquidity', bnToNumber(poolLiquidity))
    console.log('previous tickQuote', 1/quote)
})



keep3r.pool.callStatic.viewPosition()

uniV3Pool.positions(bytes32)

uniV3Pool.observe([0,tickTime])

1.0001**((0x2f6c58c300-0x2c7f25d700)/432000)

next(async()=>{
    lib = await (await ethers.getContractFactory('LiquidityAmountsTest')).deploy()
})

lib.getAmountsForLiquidity(uint160,uint160,uint160,uint128)

next(async()=>{
upper = await lib.getSqrtRatioAtTick(887200)
lower = await lib.getSqrtRatioAtTick(-887200)
    console.log(await lib.getAmount0ForLiquidity(upper, lower,liquidity))
})


lib.address

lib.getSqrtRatioAtTick(0)

0x01000000000000000000000000
0xfffcb933bd6fad37aa2d162e

lib.getTickAtSqrtRatio('0x01000000000000000000000000')

lib.getAmount0ForLiquidity(0x01000000000000000000000000,4410618292, liquidity)

0xda4555e689b5828d70c63fac8dd92832/10**18



next(async()=>{
    // mints 100 KP3R and 100 WETH to provider and approves spendings
    await keep3r.proxy.connect(keep3r.governance)['mint(address,uint256)'](provider.address, oneHundred)
    await keep3r.v1.connect(provider).approve(keep3r.pool.address, oneHundred)
    await weth.connect(provider).deposit(oneHundred, {value:oneHundred})
    await weth.connect(provider).approve(keep3r.pool.address, oneHundred)
    
    kp3rInitialBalance = await keep3r.v1.balanceOf(provider.address)
    wethInitialBalance = await weth.balanceOf(provider.address)

    // MINT
    liquidity = await keep3r.pool.connect(provider).callStatic.mint(oneHundred,oneHundred,0,0,provider.address)
    await keep3r.pool.connect(provider).mint(oneHundred,oneHundred,0,0,provider.address)
    
    kp3rBalance = await keep3r.v1.balanceOf(provider.address)
    wethBalance = await weth.balanceOf(provider.address)
    klpBalance = await keep3r.pool.balanceOf(provider.address)
    console.log('KP3R spent', bnToNumber(kp3rInitialBalance.sub(kp3rBalance)))
    console.log('WETH spent', bnToNumber(wethInitialBalance.sub(wethBalance)))
    console.log('kLP minted', bnToNumber(klpBalance))
})

next(async()=>{
    /* Notice:
        at current block, pools cardinality is 1
        provider have just minted a position in the pool
        latest twap accumulator is 1s ago
        UniswapV3Pool will return 'OLD' and provide no credits
    */ 
    await advanceTimeAndBlock(432000)
})

// // Make a small swap
// next(async()=>{
//     uniRouter = await ethers.getContractAt('ISwapRouter','0xE592427A0AEce92De3Edee1F18E0157C05861564')
    
//     await keep3rproxy.connect(keep3rgovernance)['mint(address,uint256)'](provider.address, toUnit(100))
//     await keep3rv1.connect(provider).approve(uniRouter.address,toUnit(100))
    
//     await uniRouter.connect(provider).exactInputSingle([
//                 keep3rv1.address,
//                 '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//                 10000,
//                 keep3rv1.address,
//                 1628713433+100000000,
//                 toUnit(0.01),
//                 toUnit(0.0001),
//                 0])
// })



uniV3Pool.liquidity()

0x01440295848ef91d29/10**18



next(async()=>{    
//     await keep3r.v2.connect(provider).addJob(job.address)
    await keep3r.pool.connect(provider).approve(keep3r.v2.address, klpBalance)
    await keep3r.v2.connect(provider).addLiquidityToJob(job.address, keep3r.pool.address, klpBalance)
})

next(async()=>{
    console.log('quoteLiquidity', (await keep3r.v2.quoteLiquidity(keep3r.pool.address,klpBalance)).toString())
    console.log('jobPeriodCredits', (await keep3r.v2.jobPeriodCredits(job.address)).toString())
    console.log('jobLiquidityCredits', (await keep3r.v2.jobLiquidityCredits(job.address)).toString())
})

62992585216367744469/10**18

100 * 5 / 34


