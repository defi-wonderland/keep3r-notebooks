var moment = require('moment');
var { constants } = require('../utils');
var { advanceTimeAndBlock } = require('../utils/evm');
var { toUnit } = require('../utils/bn');
var { LIQUIDITIES } = require('../utils/constants');
var { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm');
var { next, clear } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');

clear();

var notebook = new Notebook();

next(async () => {
    await notebook.setup();
});

var liquidityPool, liquidityWhale;
next(async () => {
    const data = await notebook.setupLiquidity(LIQUIDITIES.KP3R_WETH);
    liquidityPool = data.pool;
    liquidityWhale = data.whale;
});

next(async () => {
    await notebook.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(1));
});

next(async () => {
    console.log('Start of simulation');
    await notebook.recordCredits();
    
    // sleep 6 periods
    await notebook.sleepAndRecord(moment.duration(1, 'day').as('seconds'), moment.duration(4, 'hours').as('seconds'));
    
    // remove liquidity
    await notebook.recordCredits();
    await notebook.sleep(1);
    await notebook.removeLiquidityToJob(liquidityPool, toUnit(0.5));
    await notebook.recordCredits();
    
    // sleep 6 periods
    await notebook.sleepAndRecord(notebook.rewardPeriod, moment.duration(4, 'hours').as('seconds'));
    
    console.log('End of simulation');
});

next(async () => {
    await notebook.draw();
});
