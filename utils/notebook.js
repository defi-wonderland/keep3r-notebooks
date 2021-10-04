require('dotenv').config({ path: '../.env' });
const { evm, wallet, constants, contracts, common } = require('../utils');
const { getBlockTimestamp } = require('../utils/evm');
const { toUnit } = require('../utils/bn');
const { getPastEvents } = require('../utils/contracts');
const { unixToDate } = require('../utils/jupyter');
const { ethers, web3, artifacts } = require('hardhat');
const moment = require('moment');
const Plot = require('plotly-notebook-js');
const { NotebookRecorder } = require('../utils/notebook-recorder');
const { advanceTimeAndBlock } = require('../utils/evm');

class Notebook {
  traces = [];
  events = [];

  async setup(blockNumber) {
    await evm.reset({
      jsonRpcUrl: process.env.MAINNET_HTTPS_URL,
      blockNumber: blockNumber,
    });

    // setup credit recorder
    this.notebookRecorder = new NotebookRecorder();
  }

  // contract utils

  async fetch(contractName, address) {
    let fetchedContract = await ethers.getContractAt(contractName, address);

    let artifact = await artifacts.readArtifact(contractName);
    fetchedContract.web3 = new web3.eth.Contract(artifact.abi, address);

    return fetchedContract;
  }

  // TODO: fix Cannot read property 'signer' of null
  async deploy(contractName, ctor = null, libraries = null) {
    // TODO: add web3
    let factory = await ethers.getContractFactory(contractName, libraries);
    let contract = await factory.deploy(constructor);
    return contract;
  }

  async getBalance(address) {
    return await ethers.provider.getBalance(address);
  }

  /* TODO: not working */
  async setBalance(address, amount) {
    await contracts.setBalance(address, amount);
  }

  async newSigner() {
    let signer = await wallet.generateRandom();
    await contracts.setBalance(signer.address, toUnit(1000));
    return signer;
  }

  async impersonate(address) {
    return await wallet.impersonate(address);
  }

  async block(str = 'latest') {
    return await ethers.provider.getBlock(str);
  }

  // time utils

  time(timeUnits, unit, asUnits) {
    if (asUnits == undefined) {
      asUnits = 'seconds';
    }
    return moment.duration(timeUnits, unit).as(asUnits);
  }

  async sleep(totalSleepTime) {
    await advanceTimeAndBlock(totalSleepTime);
  }

  async sleepAndRecord(totalSleepTime, recordEvery) {
    let totalSlept = 0;
    await this.recordViews();

    while (totalSlept < totalSleepTime - recordEvery) {
      await advanceTimeAndBlock(recordEvery);
      await this.recordViews();
      totalSlept += recordEvery;
    }

    await advanceTimeAndBlock(totalSleepTime - totalSlept);
    await this.recordViews();
  }

  async sleepAndExecute(totalSleepTime, recordEvery, executions) {
    let totalSlept = 0;
    let lastExecutions = {};
    await this.recordViews();

    while (totalSlept < totalSleepTime - recordEvery) {
      await advanceTimeAndBlock(recordEvery);
      await this.recordViews();
      totalSlept += recordEvery;

      await Promise.all(
        executions.map(async (execution, executionIndex) => {
          if (totalSlept > (lastExecutions[executionIndex] || 0) + execution.every) {
            await execution.run();
            lastExecutions[executionIndex] = totalSlept;
          }
        })
      );

      await this.recordViews();
    }

    await advanceTimeAndBlock(totalSleepTime - totalSlept);
    await $.recordViews();
  }

  // draw settings
  /* TODO: allow more than 1 viewArgument
  // ex. keep3rV1.bonds(KP3R, KEEPER)
  // ex. keep3rV2.totalJobCredits(JOB)
   */
  addViewTrace(contract, viewName, viewArguments, traceName = null) {
    this.traces.push({
      contract,
      viewName,
      viewArguments,
      traceName,
    });
  }

  // /* TODO: add functionTrace */
  // async addFunctionTrace(fn){
  //   (x,y) = await fn();
  //   this.traces.push({
  //     (x,y)
  //   })
  // }

  addEventTrace(w3contract, eventName, timestampArgIndex) {
    this.events.push({
      w3contract,
      eventName,
      timestampArgIndex,
    });
  }

  period;

  setPeriodTrace(periodTime) {
    this.period = periodTime;
  }

  resetTraces() {
    this.traces = [];
    this.events = [];
  }

  async recordViews() {
    await Promise.all(
      this.traces.map(async (trace, index) => {
        await this.notebookRecorder.recordView(trace.contract, trace.viewName, trace.viewArguments, index);
      })
    );
  }

  async resetRecording() {
    await this.notebookRecorder.reset();
  }

  /* TODO: keep factorizing */
  async draw() {
    const plot = Plot.createPlot([]);

    this.traces.map((trace, index) => {
      plot.addTraces([
        {
          ...this.notebookRecorder.getViewRecording(index),
          name: trace.traceName || trace.viewName,
          line: {
            width: 1,
            // dash: 'dashdot',
          },
        },
      ]);
    });

    /* TODO: snapshots not working with web3 */
    await Promise.all(
      this.events.map(async (e, i) => {
        plot.addTraces([
          {
            ...(await this.notebookRecorder.getEventsTrace(e.w3contract, e.eventName, e.timestampArgIndex)),
            name: e.eventName,
            mode: 'markers',
          },
        ]);
      })
    );

    plot.addTraces([
      {
        ...(await this.notebookRecorder.getPeriodTrace(this.period)),
        name: 'Period',
        mode: 'markers',
        marker: {
          symbol: 'line-ns-open',
          size: 12,
          color: 'rgb(0, 0, 0)',
        },
      },
    ]);

    // TODO: add this configuration to addView/EventTraces factories
    // plot.addTraces([
    //   {
    //     ...this.notebookRecorder.getViewRecording(0),
    //     name: 'Current credits',
    //     mode: 'lines',
    //     line: {
    //       color: 'rgba(51, 0, 255, .3)',
    //       width: 1,
    //       dash: 'dashdot',
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...this.notebookRecorder.getViewRecording(1),
    //     name: 'Total credits',
    //     mode: 'lines+markers',
    //     line: {
    //       color: 'rgb(63, 255, 0)',
    //       width: 2,
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...this.notebookRecorder.getViewRecording(2),
    //     name: 'Period credits',
    //     mode: 'lines+markers',
    //     line: {
    //       color: 'rgb(63, 255, 255)',
    //       width: 2,
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'KeeperWork')),
    //     name: 'Work',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'x-thin-open',
    //       size: 12,
    //       color: 'rgb(0, 0, 255)',
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'LiquidityCreditsReward', 1)),
    //     name: 'Rewarded At',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'star',
    //       size: 12,
    //       color: 'rgb(255, 215, 0)',
    //     },
    //   },
    // ]);
    //
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'LiquidityAddition')),
    //     name: 'Liquidity added',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'triangle-up',
    //       size: 16,
    //       color: 'rgb(0, 255, 0)',
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'LiquidityWithdrawal')),
    //     name: 'Liquidity withdrawn',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'triangle-down',
    //       size: 16,
    //       color: 'rgb(255, 0, 0)',
    //     },
    //   },
    // ]);
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getEventsTrace(this.w3Pool, 'Swap')),
    //     name: 'KP3R Swapped',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'triangle-down',
    //       size: 16,
    //       color: 'rgb(0, 255, 255)',
    //     },
    //   },
    // ]);

    $$html$$ = plot.render();
  }
}

exports.Notebook = Notebook;
