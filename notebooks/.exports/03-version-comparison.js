next(async () => {
  //     uncomment to revert to snapshot
  //     TODO: snapshots working only first time
  await snapshots.revert(setupSnap);
});

getKp3rReserves = async (v1Pool) => {
  response = await v1Pool.getReserves();
  token0 = await v1Pool.token0();
  token1 = await v1Pool.token1();
  if (token0 == keep3r.v1.address) {
    return response[0];
  } else if (token1 == keep3r.v1.address) {
    return response[1];
  }
};

// create jobs and keepers

next(async () => {
  v1Job = await (await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v1.address);
  v2Job = await (await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address);

  v1Keeper = await common.activateKeeper(keep3r.v1);
  v2Keeper = keep3r.keeper;

  v1Liquidity = '0xaf988aff99d3d0cb870812c325c588d8d8cb7de8';
  v1Pool = await $.fetch('IUniswapV2PoolForTest', v1Liquidity);
  v1LiqWhale = await $.impersonate('0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd');

  // adds 10 underlying KP3R to each job
  kp3rPerLPToken = (await getKp3rReserves(v1Pool)).div(await v1Pool.totalSupply());
  liquidityToAddV1 = kp3rSpent.div(kp3rPerLPToken);
  liquidityToAddV2 = klpBalance;

  // approve job and liquidity in V1
  await keep3r.proxy.connect(keep3r.governance).addJob(v1Job.address);
  await keep3r.proxy.connect(keep3r.governance).approveLiquidity(keep3r.pool.address);

  // approve job in V2 (keep3r.pool already approved)
  await keep3r.v2.connect(provider).addJob(v2Job.address);
});

// add liquidity to jobs

next(async () => {
  // V1 create a job and add liquidity
  await $.setBalance(v1LiqWhale._address, toUnit(1000));
  await v1Pool.connect(v1LiqWhale).approve(keep3r.v1.address, liquidityToAddV1);
  await keep3r.v1.connect(v1LiqWhale).addLiquidityToJob(v1Liquidity, v1Job.address, liquidityToAddV1);
  await $.sleep($.time(3, 'days'));
  await keep3r.v1.connect(provider).applyCreditToJob(v1LiqWhale._address, v1Liquidity, v1Job.address);

  // V2 create a job and add liquidity
  await keep3r.pool.connect(provider).approve(keep3r.v2.address, liquidityToAddV2);
  await keep3r.v2.connect(provider).addLiquidityToJob(v2Job.address, keep3r.pool.address, liquidityToAddV2);
});

// charts configuration

next(async () => {
  await $.resetRecording();
  $.resetTraces();

  $.setPeriodTrace(432000);

  $.addViewTrace(keep3r.v1, 'credits', [v1Job.address, keep3r.v1.address], 'Keep3rV1 credits');
  $.addViewTrace(keep3r.v2, 'totalJobCredits', [v2Job.address], 'Keep3rV2 total credits');
  $.addEventTrace(keep3r.v2.web3, 'KeeperWork');
  $.addEventTrace(keep3r.v2.web3, 'LiquidityCreditsReward', '_rewardedAt');
});

// working in both versions

next(async () => {
  await $.resetRecording();

  await $.sleepAndExecute(
    $.time(20, 'days'),
    $.time(6, 'hours'),
    // make keepers work each job every 2 days
    [
      {
        run: async () => {
          tx1 = await v1Job.connect(v1Keeper).work();
          tx2 = await v2Job.connect(v2Keeper).work();
        },
        every: $.time(4, 'days'),
      },
    ]
  );

  await $.draw();
});
