next(async()=>{
    //     uncomment to revert to snapshot
    //     TODO: snapshots working only first time
        await snapshots.revert(setupSnap)    
})

next(async()=>{
    [ethProvider] = await ethers.getSigners()
    await ethProvider.sendTransaction({to:provider._address, value:toUnit(100)})
})

// charts configuration

next(async() =>{
    await $.resetRecording()
    $.resetTraces()

    $.setPeriodTrace(432000)
    
    $.addViewTrace(dai, 'balanceOf', [provider._address])

    $.addEventTrace(dai.web3, 'Transfer')    
})

// credit mining without working

next(async()=>{
    
    await $.sleepAndRecord(
        $.time(4,'days'),
        $.time(4,'hours')
    )
    
    await $.draw()
})

// credit mining with twap change

next(async()=>{    
    await $.resetRecording()
    
    await $.sleepAndExecute(
        $.time(5,'days'),
        $.time(12,'hours'),
        // make a big swap in uniswapV3 pool to alter quote
        [{
            run: async()=>{
                    await dai.connect(provider).transfer(dai.address, toUnit(10_000_000))
            },
            every: $.time(1,'days')
         }]
    )
    
    await $.draw()
})


