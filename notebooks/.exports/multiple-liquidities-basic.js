var moment = require('moment');
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

var wethPool, wethPoolWhale;
next(async () => {
    const data = await $.setupLiquidity(LIQUIDITIES.KP3R_WETH);
    wethPool = data.pool;
    wethPoolWhale = data.whale;
});

var ldoPool, ldoPoolWhale;
next(async () => {
    const data = await $.setupLiquidity(LIQUIDITIES.KP3R_LDO);
    ldoPool = data.pool;
    ldoPoolWhale = data.whale;
});

next(async () => {
    // add 2 units of wethKp3r and sleep 2 weeks
    await $.addLiquidityToJob(wethPool, wethPoolWhale, toUnit(2));
    await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));
    
    // add 1 unit of ldoKp3r and sleep 2 weeks
    await $.addLiquidityToJob(ldoPool, ldoPoolWhale, toUnit(1));
    await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));
});

next(async () => {
    const timeToSleep = $.time(1, 'month');
    const startedToWorkAt = await getLatestBlockTimestamp();
    
    console.log('Start of simulation');

    // work
    await $.job.connect($.keeper).work();
    await $.recordCredits();
    
    // sleep some more
    await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));
    
    console.log('End of simulation');
});

next(async () => {
    await $.draw();
});
