var moment = require('moment');
var { constants } = require('../utils');
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

next(async () => {
    await $.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(10));
});

next(async () => {    
    const timeToWork = $.rewardPeriod * 4;
    const startedToWorkAt = await getLatestBlockTimestamp();
    const sleepTime = $.time(72, 'hours');
    
    console.log('Start of simulation');
    await $.recordCredits();
    
    // sleep
    await $.sleep(sleepTime);
    await $.recordCredits();
    
    // until 4 periods have not passed
    while ((await getLatestBlockTimestamp()) - startedToWorkAt < timeToWork) {
        // work
        await $.job.connect($.keeper).work();
        await $.recordCredits();
        
        // sleep
        await $.sleepAndRecord(sleepTime, $.time(4, 'hours'));
        await $.recordCredits();
    }
    
    console.log('End of simulation');
});

$.keep3r.totalJobCredits($.job.addr)

next(async () => {
    await $.draw();
});


