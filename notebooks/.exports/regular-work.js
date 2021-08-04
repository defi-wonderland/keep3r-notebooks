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
    await notebook.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(10));
});

next(async () => {    
    const timeToWork = notebook.rewardPeriod * 4;
    const startedToWorkAt = await getLatestBlockTimestamp();
    const sleepTime = moment.duration(72, 'hours').as('seconds');
    
    console.log('Start of simulation');
    await notebook.recordCredits();
    
    // sleep
    await advanceTimeAndBlock(sleepTime);
    await notebook.recordCredits();
    
    // until 4 periods have not passed
    while ((await getLatestBlockTimestamp()) - startedToWorkAt < timeToWork) {
        // work
        await notebook.job.connect(notebook.keeper).work();
        await notebook.recordCredits();
        
        // sleep
        await notebook.sleepAndRecord(sleepTime, moment.duration(4, 'hours').as('seconds'));
        await notebook.recordCredits();
    }
    
    console.log('End of simulation');
});

next(async () => {
    await notebook.draw();
});
