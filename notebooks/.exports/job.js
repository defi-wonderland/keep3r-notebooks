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

next(async () => {
  oracleFactory = await $.fetch('Keep3rV2OracleFactory', '0xaed599aadfee8e32cedb59db2b1120d33a7bacfd');
  oracle = await $.fetch('Keep3rV2Oracle', '0xe20B3f175F9f4e1EDDf333f96b72Bba138c9e83a');
  uniV2Pair = await $.fetch('UniswapV2Pair', '0xaf988aff99d3d0cb870812c325c588d8d8cb7de8');
});

oracle.length();

oracle.observations(4719);

next(async () => {
  await oracle.connect(await $.impersonate(oracleFactory.address)).update({ gasPrice: 0 });
});

uniV2Pair.getReserves();

$.sleep(3600);

1628028923 - 1628025092;

uniV2Pair.sync();

next(async () => {
  // make a Swap
  await uniRouter.connect($.jobOwner).exactInputSingle([$.keep3rV1.address, WETH9, 10000, $.jobOwner.address, 2638281696, 1, 0, 0]);
});

$.sleep(100);

$.job.connect($.keeper).work();

next(async () => {
  // fund the jobOwner
  await weth.connect($.jobOwner).deposit({ value: toUnit(100) });
  await $.keep3rV1Proxy.connect($.governance)['mint(address,uint256)']($.jobOwner.address, toUnit(0xffff));

  // approve spendings
  await weth.connect($.jobOwner).approve(kp3rPool.address, toUnit(0xffffff));
  await $.keep3rV1.connect($.jobOwner).approve(kp3rPool.address, toUnit(0xffffff));
  await $.keep3rV1.connect($.jobOwner).approve(uniRouter.address, toUnit(0xffffff));

  // mint a position
  await kp3rPool.connect($.jobOwner).mint(toUnit(100), toUnit(5.2), toUnit(90), toUnit(4), $.jobOwner.address);

  console.log('LPs', (await kp3rPool.balanceOf($.jobOwner.address)).div(toUnit(1)).toNumber());

  // make an empty swap
  await uniRouter.connect($.jobOwner).exactInputSingle([$.keep3rV1.address, WETH9, 10000, $.jobOwner.address, 2638281696, 1, 0, 0]);
  await $.sleep($.time(5, 'days'));
});

next(async () => {
  await $.keep3r.connect($.governance).approveLiquidity(kp3rPool.address);

  await kp3rPool.approve($.keep3r.address, toUnit(0xffff));
  await $.keep3r.connect($.jobOwner).addLiquidityToJob($.job.address, kp3rPool.address, toUnit(2));
  console.log('liquidityAmount', (await $.keep3r.liquidityAmount($.job.address, kp3rPool.address)).div(toUnit(1)).toNumber());
});

next(async () => {
  console.log('Start of simulation');

  // sleep some hours
  await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));

  // work a lot
  for (let i = 0; i < 56; i++) {
    await $.recordCredits();
    await $.job.connect($.keeper).work();
    await $.sleepAndRecord($.time(0.5, 'days'), $.time(12, 'hours'));
    bonds = await $.keep3r.bonds($.keeper.address, $.keep3rV1.address);
    if (bonds.gt(toUnit(20))) {
      console.log('swaps', bonds.div(toUnit(1)).toNumber(), 'KP3R');
      await $.keep3r.connect($.keeper).unbond($.keep3rV1.address, bonds);
      // somebody swaps 20 KP3R into the pool
      await uniRouter
        .connect($.jobOwner)
        .exactInputSingle([$.keep3rV1.address, WETH9, 10000, $.keeper.address, 2638281696, bonds, toUnit(0.00001), 0]);
    }
  }

  await $.sleepAndRecord($.time(2, 'weeks'), $.time(4, 'hours'));

  console.log('End of simulation');
});

next(async () => {
  console.log(await uniPool.slot0());
});

uniPool.observations(10);

uniPool.observations(9);

next(async () => {
  await $.draw();
});
