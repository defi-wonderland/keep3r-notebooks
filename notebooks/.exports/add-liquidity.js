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
  await $.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(100));
});

next(async () => {
  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 3 periods
  await $.sleepAndRecord($.rewardPeriod * 3 - $.time(3, 'days'), $.time(4, 'hours'));
  await $.recordCredits();

  // add liquidity
  await $.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(1));
  await $.recordCredits();

  // sleep 3 periods
  await $.sleepAndRecord($.rewardPeriod * 3, $.time(4, 'hours'));

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
