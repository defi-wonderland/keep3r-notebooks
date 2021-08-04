var moment = require('moment');
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
  await $.sleepAndRecord(moment.duration(2, 'weeks').as('seconds'), moment.duration(4, 'hours').as('seconds'));

  // add 1 unit of ldoKp3r and sleep 2 weeks
  await $.addLiquidityToJob(ldoPool, ldoPoolWhale, toUnit(1));
  await $.sleepAndRecord(moment.duration(2, 'weeks').as('seconds'), moment.duration(4, 'hours').as('seconds'));
});

next(async () => {
  const timeToSleep = moment.duration(1, 'month').as('seconds');
  const startedToWorkAt = await getLatestBlockTimestamp();

  console.log('Start of simulation');

  // work
  await $.job.connect($.keeper).work();
  await $.recordCredits();

  // sleep some more
  await $.sleepAndRecord(moment.duration(2, 'weeks').as('seconds'), moment.duration(4, 'hours').as('seconds'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
