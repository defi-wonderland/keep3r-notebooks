var moment = require('moment');
var { constants } = require('../utils');
var { advanceTimeAndBlock } = require('../utils/evm');
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
  const timeToSleep = moment.duration(1, 'month').as('seconds');
  const startedToWorkAt = await getLatestBlockTimestamp();

  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 1 day
  await $.sleep($.time(5, 'days', 'seconds'));
  await $.recordCredits();

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  // sleep 1 month, record credits every day
  await $.sleepAndRecord(moment.duration(0.5, 'month').as('seconds'), moment.duration(4, 'hours').as('seconds'));

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  // sleep some hours
  await $.sleep($.time(2, 'days'));
  await $.recordCredits();

  // work a lot
  for (let i = 0; i < 3; i++) {
    await $.recordCredits();
    await $.job.connect($.keeper).work();
    await $.sleep($.time(12, 'hours'));
    await $.recordCredits();
  }

  // sleep 2 weeks, record credits every day
  await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
