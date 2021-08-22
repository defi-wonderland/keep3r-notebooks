var moment = require('moment');
var { constants } = require('../utils');
var { advanceTimeAndBlock } = require('../utils/evm');
var { toUnit } = require('../utils/bn');
var { LIQUIDITIES } = require('../utils/constants');
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm');
var { next, clear } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');

clear();

var $ = new Notebook();

next(async () => {
    await $.setup();
});

var liquidityPool, liquidityWhale;
next(async () => {
    const data = await $.setupLiquidity(LIQUIDITIES.KP3R_WETH);
    liquidityPool = data.pool;
    liquidityWhale = data.whale;
});

pool = '0x11b7a6bc0259ed6cf9db8f499988f9ecc7167bf5'
next(async () => {
    uniPool = await $.fetch('IUniswapV3Pool',pool)
    
    await uniPool.increaseObservationCardinalityNext(0x00ff)
    kp3rPool = await $.deploy('Keep3rV1Pair',pool)
});

WETH9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
router = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

next(async () => {
    uniRouter = await $.fetch('ISwapRouter',router)
    weth = await $.fetch('WETH9',WETH9)
});

next(async () => {  
    await $.keep3r.connect($.governance).approveLiquidity(kp3rPool.address)

    await weth.connect($.jobOwner).deposit({value: toUnit(100)})
    await $.keep3rV1Proxy.connect($.governance)['mint(address,uint256)']($.jobOwner.address,toUnit(0xffff))
    
    await weth.connect($.jobOwner).approve(kp3rPool.address,toUnit(0xffff))
    await $.keep3rV1.connect($.jobOwner).approve(kp3rPool.address,toUnit(0xffff))
    
    await kp3rPool.connect($.jobOwner).mint(
        toUnit(100),
        toUnit(5.2),
        toUnit(90),
        toUnit(4),
        $.jobOwner.address)
    
    await $.keep3rV1.connect($.jobOwner).approve(uniRouter.address,toUnit(0xffffff))
    await uniRouter.connect($.jobOwner).exactInputSingle([
                $.keep3rV1.address,
                WETH9,
                10000,
                $.keeper.address,
                2638281696,
                toUnit(1),
                0,
                0])
    await $.sleep($.time(5,'days'))
})

next(async () => {
    await kp3rPool.approve($.keep3r.address, toUnit(0xffff))
    await $.keep3r.connect($.jobOwner).addLiquidityToJob($.job.address,kp3rPool.address,toUnit(22))
    console.log('liquidityAmount', ((await $.keep3r.liquidityAmount($.job.address, kp3rPool.address)).div(toUnit(1))).toNumber())
});

$.keep3r.totalJobCredits($.job.address)

0x19905e62977a0562 / toUnit(1)

$.job.connect($.keeper).work();

next(async () => {
    console.log('Start of simulation');
    console.log(await $.helper.observe(kp3rPool.address,[0,432000]))
    
    // sleep some hours
    await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));
    
    // work a lot
    for (let i = 0; i < 12; i++) {
        await $.recordCredits();
        await $.job.connect($.keeper).work();
        await $.sleepAndRecord($.time(4, 'days'),$.time(1,'day'));
        bonds = await $.keep3r.bonds($.keeper.address,$.keep3rV1.address)
        if( bonds.gt(toUnit(10))) {
            console.log('burn')
            await $.keep3r.connect($.keeper).unbond($.keep3rV1.address,bonds)            
            await uniRouter.connect($.jobOwner).exactInputSingle([
                $.keep3rV1.address,
                WETH9,
                10000,
                $.keeper.address,
                2638281696,
                bonds,
                toUnit(0.00001),
                0])
        }
    }
    
    await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));
    
    console.log(await $.helper.observe(kp3rPool.address,[0,432000]))
    console.log('End of simulation');
});

$.sleepAndRecord($.time(1, 'day'), $.time(4, 'hours'));

next(async () => {
    await $.draw();
});

$.keep3r.bonds($.keeper.address,$.keep3rV1.address)

0x0bdbe483ebb192bf

0x106ee119c64edbc3/toUnit(1)

$.keep3r.totalJobCredits($.job.address)

$.job.connect($.keeper).workHard(0)


