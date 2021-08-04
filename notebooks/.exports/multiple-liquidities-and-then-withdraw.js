var moment = require('moment');
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
  await $.addLiquidityToJob(wethPool, wethPoolWhale, toUnit(10));
  await $.addLiquidityToJob(ldoPool, ldoPoolWhale, toUnit(5));
});

next(async () => {
  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 6 periods
  await $.sleepAndRecord($.rewardPeriod * 6, $.time(4, 'hours'));

  // remove half of weth liquidity
  await $.removeLiquidityToJob(wethPool, toUnit(5));
  await $.recordCredits();

  // sleep 6 periods
  await $.sleepAndRecord($.rewardPeriod * 6, $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
