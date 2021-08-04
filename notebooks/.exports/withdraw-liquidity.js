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
  await $.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(1));
});

next(async () => {
  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 6 periods
  await $.sleepAndRecord($.time(1, 'day'), $.time(4, 'hours'));

  // remove liquidity
  await $.recordCredits();
  await $.sleep(1);
  await $.removeLiquidityToJob(liquidityPool, toUnit(0.5));
  await $.recordCredits();

  // sleep 6 periods
  await $.sleepAndRecord($.rewardPeriod, $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
