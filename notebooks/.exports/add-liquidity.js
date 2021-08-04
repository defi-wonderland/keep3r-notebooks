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
    
    // sleep 3 periods
    await notebook.sleepAndRecord(notebook.rewardPeriod * 3 - moment.duration(3, 'days').as('seconds'), moment.duration(4, 'hours').as('seconds'));
    await notebook.recordCredits();
    
    // add liquidity
    await notebook.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(1));
    await notebook.recordCredits();
    
    // sleep 3 periods
    await notebook.sleepAndRecord(notebook.rewardPeriod * 3, moment.duration(4, 'hours').as('seconds'));
    
    // work
    await notebook.job.connect(notebook.keeper).work();
    await notebook.recordCredits();
    
    console.log('End of simulation');
});

next(async () => {
    await notebook.draw();
});
