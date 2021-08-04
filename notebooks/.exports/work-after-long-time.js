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
  const timeToSleep = moment.duration(1, 'month').as('seconds');
  const startedToWorkAt = await getLatestBlockTimestamp();

  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 1 day
  await $.sleep(moment.duration(2, 'day').as('seconds'));
  await $.recordCredits();

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  // sleep 1 month, record credits every day
  await $.sleepAndRecord($.time(1, 'month'), $.time(4, 'hours'));

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  // sleep 2 weeks, record credits every day
  await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
