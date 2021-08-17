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
  for (let i = 0; i < 8; i++) {
    await $.swapper.convertEthToExactKP3R(toUnit(0.001), { value: toUnit(1) });
    await $.sleep($.time(24, 'hours'));
  }
  await $.addLiquidityToJob(liquidityPool, liquidityWhale, toUnit(1));
  await $.keep3rV1Proxy.connect($.governance)['mint(address,uint256)']($.keep3r.address, toUnit(10));
});

next(async () => {
  const timeToSleep = $.time(1, 'month');
  const startedToWorkAt = await getLatestBlockTimestamp();

  console.log('Start of simulation');
  await $.recordCredits();

  // sleep 1 day
  await $.sleep($.time(2, 'days', 'seconds'));

  // work a lot
  for (let i = 0; i < 28; i++) {
    await $.swapper.convertEthToExactKP3R(toUnit(0.001), { value: toUnit(1) });
    await $.recordCredits();
    await $.job.connect($.keeper).work();
    await $.sleep($.time(12, 'hours'));
    await $.recordCredits();
    if (i % 6 == 0) {
      await $.swapper.convertEthToExactKP3R(toUnit(0.7), { value: toUnit(1) });
    }
  }

  // sleep 2 weeks, record credits every day
  await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  await $.draw();
});
