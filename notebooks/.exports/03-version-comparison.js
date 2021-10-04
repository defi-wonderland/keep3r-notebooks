next(async()=>{
    //     uncomment to revert to snapshot
    //     TODO: snapshots working only first time
        await snapshots.revert(setupSnap)    
})

// create jobs and keepers

next(async()=>{
    v1Job = await(await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v1.address)
    v2Job = await(await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address)

    v1Keeper = await common.activateKeeper(keep3r.v1)
    v2Keeper = keep3r.keeper
    
    v1Liquidity = '0xaf988aff99d3d0cb870812c325c588d8d8cb7de8'
    v1Pool = await $.fetch('IERC20', v1Liquidity)
    v1LiqWhale = await $.impersonate('0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd')
    
    liquidityToAdd = klpBalance.div(2)
    
    // approve job and liquidity in V1
    await keep3r.proxy.connect(keep3r.governance).addJob(v1Job.address)
    await keep3r.proxy.connect(keep3r.governance).approveLiquidity(keep3r.pool.address)
    
    // approve job in V2 (keep3r.pool already approved)
    await keep3r.v2.connect(provider).addJob(v2Job.address)
})

// add liquidity to jobs
/* TODO: set same underlying liquidity for V1 and V2 */

next(async()=>{
    // V1 create a job and add liquidity
    await $.setBalance(v1LiqWhale._address, toUnit(1000))
    await v1Pool.connect(v1LiqWhale).approve(keep3r.v1.address, liquidityToAdd)
    await keep3r.v1.connect(v1LiqWhale).addLiquidityToJob(v1Liquidity, v1Job.address, liquidityToAdd)
    await $.sleep($.time(3,'days'))
    await keep3r.v1.connect(provider).applyCreditToJob(v1LiqWhale._address, v1Liquidity, v1Job.address)
    
    // V2 create a job and add liquidity
    await keep3r.pool.connect(provider).approve(keep3r.v2.address, liquidityToAdd)
    await keep3r.v2.connect(provider).addLiquidityToJob(v2Job.address, keep3r.pool.address, liquidityToAdd)
})

// charts configuration

next(async() =>{
    await $.resetRecording()
    $.resetTraces()

    $.setPeriodTrace(432000)
    
    $.addViewTrace(keep3r.v1, 'credits', [v1Job.address, keep3r.v1.address], 'V1 credits')
    $.addViewTrace(keep3r.v2, 'totalJobCredits', [v2Job.address], 'V2 credits')
    $.addEventTrace(keep3r.v2.web3, 'KeeperWork')
})

// working in both versions

next(async()=>{    
    await $.resetRecording()
    
    await $.sleepAndExecute(
        $.time(10,'days'),
        $.time(12,'hours'),
        // make keepers work each job every 2 days
        [{
            run: async()=>{
                    tx1 = await v1Job.connect(v1Keeper).work()
                    tx2 = await v2Job.connect(v2Keeper).work()
            },
            every: $.time(2,'days')
         }]
    )
    
    await $.draw()
})
