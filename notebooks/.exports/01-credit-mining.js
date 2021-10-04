next(async()=>{
    //     uncomment to revert to snapshot
    //     TODO: snapshots working only first time
        await snapshots.revert(setupSnap)    
})

// create job and add liquidity

next(async()=>{
    job = await(await ethers.getContractFactory('JobForTest')).connect(provider).deploy(keep3r.v2.address)

    await keep3r.v2.connect(provider).addJob(job.address)
    await keep3r.pool.connect(provider).approve(keep3r.v2.address, klpBalance)
    await keep3r.v2.connect(provider).addLiquidityToJob(job.address, keep3r.pool.address, klpBalance)
})

// charts configuration

next(async() =>{
    await $.resetRecording()
    $.resetTraces()

    $.setPeriodTrace(432000)
    
    $.addViewTrace(keep3r.v2, 'jobLiquidityCredits', [job.address])
    $.addViewTrace(keep3r.v2, 'totalJobCredits', [job.address])
    $.addViewTrace(keep3r.v2, 'jobPeriodCredits', [job.address]) 
//     TODO: add multiple arguments to view
    $.addViewTrace(keep3r.v1, 'bonds', [keep3r.v1.address, keep3r.keeper.address]) 
    $.addEventTrace(keep3r.v2.web3, 'LiquidityCreditsReward', '_rewardedAt')
    $.addEventTrace(keep3r.v2.web3, 'LiquidityAddition')
    $.addEventTrace(keep3r.v2.web3, 'KeeperWork')
})

// liquidity added in 00-setup

next(async()=>{
    rewardPeriodTime = (await keep3r.v2.rewardPeriodTime()).toNumber()
    inflationPeriod = (await keep3r.v2.inflationPeriod()).toNumber()
    
    console.log('KP3R spent', bnToNumber(kp3rSpent))
    console.log('WETH spent', bnToNumber(wethSpent))
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

// twap calculation: 1.0001^(tickDifference/timeDifference)

uniQuote = async()=>{   
    tickTime = rewardPeriodTime
    uniResponse = await uniV3Pool.observe([0,tickTime])
    quote = 1.0001**(((uniResponse[0][1]).sub(uniResponse[0][0])).div(tickTime))
    console.log('tickQuote', quote)
}

// read uniswap pool Swap events

$.addEventTrace(uniV3Pool.web3, 'Swap')

// credit mining with twap change

next(async()=>{    
    await $.resetRecording()
    
    await $.sleepAndExecute(
        3 * rewardPeriodTime,
        $.time(12,'hours'),
        // make a big swap in uniswapV3 pool to alter quote
        async()=>{
            await common.makeASwap(
                    provider, 
                    keep3r.v1.address, 
                    constants.WETH_ADDRESS, 
                    provider.address, 
                    1000, 
                    toUnit(1000))
            await uniQuote()
                 },
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
        $.time(12,'hours')
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
        async()=>{
            await job.connect(keep3r.keeper).workHard(3)
        },
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
        async()=>{
            await job.connect(keep3r.keeper).workHard(25)
        },
        Math.floor(1.8 * rewardPeriodTime)
    )
 
    await $.sleepAndRecord(rewardPeriodTime, $.time(4,'hours'))
    
    await $.draw()
})

// unbonding liquidity

next(async()=>{
    await $.resetRecording()
    block = await $.block()
    await advanceTimeAndBlock(rewardPeriodTime - (block.timestamp % rewardPeriodTime))
    
    await $.sleepAndExecute(
        2 * rewardPeriodTime,
        $.time(4,'hours'),
        async()=>{
            await keep3r.v2.connect(provider).unbondLiquidityFromJob(job.address, keep3r.pool.address, toUnit(1))
        },
        rewardPeriodTime
    )
 
    await $.sleepAndRecord(rewardPeriodTime, $.time(4,'hours'))
    
    await $.draw()
})


