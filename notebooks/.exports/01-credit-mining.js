// add traces of interest
next(async() =>{
//     await snapshots.revert(setupSnap)
    await $.resetRecording()
    $.resetTraces()

    $.setPeriodTrace(432000)
    
    $.addViewTrace(keep3r.v2, 'jobLiquidityCredits', job.address)
    $.addViewTrace(keep3r.v2, 'totalJobCredits', job.address)
    $.addViewTrace(keep3r.v2, 'jobPeriodCredits', job.address) 
//     $.addViewTrace(keep3r.v1, 'bonds', keep3r.keeper.address) 
    $.addEventTrace(keep3r.v2.web3, 'LiquidityCreditsReward', '_rewardedAt')
    $.addEventTrace(keep3r.v2.web3, 'LiquidityAddition')
    $.addEventTrace(keep3r.v2.web3, 'KeeperWork')
})

// liquidity added in 00-setup

next(async()=>{
    
    rewardPeriodTime = (await keep3r.v2.rewardPeriodTime()).toNumber()
    inflationPeriod = (await keep3r.v2.inflationPeriod()).toNumber()
    
    console.log('KP3R spent', bnToNumber(kp3rInitialBalance.sub(kp3rBalance)))
    console.log('kLP minted', bnToNumber(klpBalance))
    console.log('reward period',  rewardPeriodTime / (3600 * 24), 'days')
    console.log('inflation period', (await keep3r.v2.inflationPeriod()).toNumber() / (3600 * 24), 'days')
    console.log('KP3R minted by reward period', bnToNumber(await keep3r.v2.jobPeriodCredits(job.address)))
    console.log('KP3R minted by inflation period', bnToNumber((await keep3r.v2.jobPeriodCredits(job.address)).mul(inflationPeriod).div(rewardPeriodTime)))
})

// credit mining without working

next(async()=>{
    
    await $.sleepAndRecord(
        3 * rewardPeriodTime,
        $.time(4,'hours')
    )
    
    await $.draw()
})

// credit mining with twap change

next(async()=>{
    await $.resetRecording()
    
    await $.sleepAndExecute(
        3 * rewardPeriodTime,
        $.time(12,'hours'),
        async()=>{await common.makeASwap(provider, keep3r.v1.address, constants.WETH_ADDRESS, provider.address, 1000, toUnit(1000))},
        $.time(2,'days')
    )
    
    await $.draw()
})

// balanced work

next(async()=>{
    await $.sleep(rewardPeriodTime)
    await $.resetRecording()
        
    await $.sleepAndExecute(
        4 * rewardPeriodTime,
        $.time(4,'hours'),
        async()=>{
            await job.connect(keep3r.keeper).workHard(2)
        },
        $.time(36,'hours')
    )
    
    await $.draw()
})

// balanced work with twap change

next(async()=>{
    await $.sleep(rewardPeriodTime)
    await $.resetRecording()
        
    await $.sleepAndExecute(
        4 * rewardPeriodTime,
        $.time(4,'hours'),
        async()=>{
            await job.connect(keep3r.keeper).workHard(2)
            await common.makeASwap(provider, keep3r.v1.address, constants.WETH_ADDRESS, provider.address, 1000, toUnit(300))
        },
        $.time(36,'hours')
    )
    
    await $.draw()
})

// intense work

next(async()=>{
    await $.sleep(rewardPeriodTime)
    await $.resetRecording()
    block = await $.block()
    await advanceTimeAndBlock(rewardPeriodTime - (block.timestamp % rewardPeriodTime))
    
    await $.sleepAndExecute(
        2 * rewardPeriodTime,
        $.time(4,'hours'),
        async()=>{await job.connect(keep3r.keeper).workHard(3)},
        $.time(12,'hours')
    )
 
    await $.draw()
})

// maximum credit spending

next(async()=>{
    await $.resetRecording()
    block = await $.block()
    await advanceTimeAndBlock(rewardPeriodTime - (block.timestamp % rewardPeriodTime))
    
    await $.sleepAndExecute(
        2 * Math.floor(1.9 * rewardPeriodTime),
        $.time(4,'hours'),
        async()=>{await job.connect(keep3r.keeper).workHard(25)},
        Math.floor(1.8 * rewardPeriodTime)
    )
 
    await $.sleepAndRecord(rewardPeriodTime, $.time(4,'hours'))
    
    await $.draw()
})


