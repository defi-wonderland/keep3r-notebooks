next(async () => {
  //     uncomment to revert to snapshot
  //     TODO: snapshots working only first time
  await snapshots.revert(setupSnap);
});

// create job and add liquidity

next(async () => {
  // let time pass without swaps to keep twap calculation stable
  $.sleep($.time(10, 'days'));

  job = await (await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address);
  newJob = await (await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address);

  await keep3r.v2.connect(provider).addJob(job.address);
  await keep3r.v2.connect(provider).addJob(newJob.address);

  // add liquidity to job
  await keep3r.pool.connect(provider).approve(keep3r.v2.address, klpBalance);
  await keep3r.v2.connect(provider).addLiquidityToJob(job.address, keep3r.pool.address, klpBalance);
});

// charts configuration

next(async () => {
  await $.resetRecording();
  $.resetTraces();

  $.setPeriodTrace(432000);

  $.addViewTrace(keep3r.v2, 'totalJobCredits', [job.address], 'job credits');
  $.addViewTrace(keep3r.v2, 'totalJobCredits', [newJob.address], 'newJob credits');
  $.addEventTrace(keep3r.v2.web3, 'JobMigrationSuccessful');
});

// credit mining without working

next(async () => {
  await $.sleepAndRecord($.time(2, 'days'), $.time(4, 'hours'));

  await keep3r.v2.connect(provider).migrateJob(job.address, newJob.address);
  await $.sleep($.time(1, 'minutes'));
  await keep3r.v2.connect(provider).acceptJobMigration(job.address, newJob.address);

  await $.sleepAndRecord($.time(2, 'days'), $.time(4, 'hours'));

  await $.draw();
});
