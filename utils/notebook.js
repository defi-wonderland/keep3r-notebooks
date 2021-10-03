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
  traces;
  events;

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

  async deploy(contractName, ctor = null, libraries = null) {
    // TODO: fix Cannot read property 'signer' of null
    // TODO: add web3
    let factory = await ethers.getContractFactory(contractName, libraries);
    let contract = await factory.deploy(constructor);
    return contract;
  }

  async getBalance(address) {
    return await ethers.provider.getBalance(address);
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

  async sleepAndExecute(totalSleepTime, recordEvery, executeFunction, executeEvery) {
    let totalSlept = 0;
    let lastExecution = 0;
    await this.recordViews();

    while (totalSlept < totalSleepTime - recordEvery) {
      await advanceTimeAndBlock(recordEvery);
      await this.recordViews();
      totalSlept += recordEvery;
      if (totalSlept > lastExecution + executeEvery) {
        await executeFunction();
        await this.recordViews();
        lastExecution = totalSlept;
      }
    }

    await advanceTimeAndBlock(totalSleepTime - totalSlept);
    await $.recordViews();
  }

  // draw settings
  /* TODO: allow more than 1 viewArgument
  // ex. keep3rV1.bonds(KP3R, KEEPER)
   */
  addViewTrace(contract, viewName, viewArgument) {
    if (!this.traces) {
      this.traces = [];
    }
    this.traces.push({
      contract: contract,
      viewName: viewName,
      viewArgument: viewArgument,
    });
  }

  addEventTrace(w3contract, eventName, timestampArgIndex) {
    if (!this.events) {
      this.events = [];
    }
    this.events.push({
      w3contract: w3contract,
      eventName: eventName,
      timestampArgIndex: timestampArgIndex,
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
      this.traces.map(async (t, i) => {
        await this.notebookRecorder.recordView(t.contract, t.viewName, t.viewArgument, i);
      })
    );
  }

  async resetRecording() {
    await this.notebookRecorder.reset();
  }

  /* TODO: keep factorizing */
  async draw() {
    const plot = Plot.createPlot([]);

    if (this.traces) {
      this.traces.map((t, i) => {
        plot.addTraces([
          {
            ...this.notebookRecorder.getViewRecording(i),
            name: t.viewName,
            line: {
              width: 1,
              // dash: 'dashdot',
            },
          },
        ]);
      });
    }

    /* TODO: snapshots not working with web3 */
    if (this.events) {
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
    }

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
