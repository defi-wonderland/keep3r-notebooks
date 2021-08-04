var moment = require('moment');
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

var wethPool, wethPoolWhale;
next(async () => {
    const data = await notebook.setupLiquidity(LIQUIDITIES.KP3R_WETH);
    wethPool = data.pool;
    wethPoolWhale = data.whale;
});

var ldoPool, ldoPoolWhale;
next(async () => {
    const data = await notebook.setupLiquidity(LIQUIDITIES.KP3R_LDO);
    ldoPool = data.pool;
    ldoPoolWhale = data.whale;
});

next(async () => {
    await notebook.addLiquidityToJob(wethPool, wethPoolWhale, toUnit(10));
    await notebook.addLiquidityToJob(ldoPool, ldoPoolWhale, toUnit(5));
});

next(async () => {
    console.log('Start of simulation');
    await notebook.recordCredits();
    
    // sleep 6 periods
    await notebook.sleepAndRecord(notebook.rewardPeriod * 6, moment.duration(4, 'hours').as('seconds'));
    
    // remove half of weth liquidity
    await notebook.removeLiquidityToJob(wethPool, toUnit(5));
    await notebook.recordCredits();
    
    // sleep 6 periods
    await notebook.sleepAndRecord(notebook.rewardPeriod * 6, moment.duration(4, 'hours').as('seconds'));
    
    console.log('End of simulation');
});

next(async () => {
    await notebook.draw();
});
