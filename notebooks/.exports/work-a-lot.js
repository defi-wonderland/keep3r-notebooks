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
    const timeToSleep = moment.duration(1, 'month').as('seconds');
    const startedToWorkAt = await getLatestBlockTimestamp();
    
    console.log('Start of simulation');
    await notebook.recordCredits();
    
    // sleep 1 day
    await advanceTimeAndBlock(moment.duration(5, 'day').as('seconds'));
    await notebook.recordCredits();

    // work
    await notebook.job.connect(notebook.keeper).work();
    await notebook.recordCredits();
    
    // sleep 1 month, record credits every day
    await notebook.sleepAndRecord(moment.duration(0.5, 'month').as('seconds'), moment.duration(4, 'hours').as('seconds'));
    
    // work
    await notebook.job.connect(notebook.keeper).work();
    await notebook.recordCredits();
    
    // sleep some hours
    await advanceTimeAndBlock(moment.duration(2, 'days').as('seconds'));
    await notebook.recordCredits();
    
    // work a lot
    for (let i = 0; i < 3; i++) {
        await notebook.recordCredits();
        await notebook.job.connect(notebook.keeper).work();
        await advanceTimeAndBlock(moment.duration(12, 'hours').as('seconds'));
        await notebook.recordCredits();
    }
    
    // sleep 2 weeks, record credits every day
    await notebook.sleepAndRecord(moment.duration(2, 'weeks').as('seconds'), moment.duration(4, 'hours').as('seconds'));
    
    console.log('End of simulation');
});

next(async () => {
    await notebook.draw();
});


