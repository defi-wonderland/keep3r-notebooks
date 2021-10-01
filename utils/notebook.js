require('dotenv').config({ path: '../.env' });
const { evm, wallet, constants, contracts, common } = require('../utils');
const { getBlockTimestamp } = require('../utils/evm');
const { getPastEvents } = require('../utils/contracts');
const { unixToDate } = require('../utils/jupyter');
const { ethers, web3, artifacts } = require('hardhat');
const moment = require('moment');
const Plot = require('plotly-notebook-js');
const { notebookRecorder } = require('../utils/notebook-recorder');
const { advanceTimeAndBlock } = require('../utils/evm');

class Notebook {
  jobOwner;
  keeper;
  keep3r;
  governance;
  keep3rV1;
  helper;
  job;
  w3Keep3r;
  rewardPeriod;
  swapper;
  ethers;

  async setup(blockNumber) {
    await evm.reset({
      jsonRpcUrl: process.env.MAINNET_HTTPS_URL,
      blockNumber: blockNumber,
    });

    // setup credit recorder
    this.notebookRecorder = new notebookRecorder();
  }

  // contract utils

  async fetch(contractName, address) {
    let fetchedContract = await ethers.getContractAt(contractName, address);
    return fetchedContract;
  }

  async deploy(contractName, ctor = null, libraries = null) {
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
    await this.recordCredits();

    while (totalSlept < totalSleepTime - recordEvery) {
      await advanceTimeAndBlock(recordEvery);
      await this.recordCredits();
      totalSlept += recordEvery;
    }

    await advanceTimeAndBlock(totalSleepTime - totalSlept);
    await this.recordCredits();
  }

  // draw settings

  /* TODO: make independent of params */
  /* make params string */
  async recordCredits(keep3r, job) {
    await this.notebookRecorder.recordView(keep3r, 'jobLiquidityCredits', job.address, 0);
    await this.notebookRecorder.recordView(keep3r, 'totalJobCredits', job.address, 1);
  }

  resetRecording() {
    this.notebookRecorder.reset();
  }

  /* TODO: make draw independent of the draw params
  // - add function to add traces to the drawing
  */
  async draw() {
    const plot = Plot.createPlot([]);
    plot.addTraces([
      {
        ...this.notebookRecorder.getViewRecording(0),
        name: 'Current credits',
        mode: 'lines',
        line: {
          color: 'rgba(51, 0, 255, .3)',
          width: 1,
          dash: 'dashdot',
        },
      },
    ]);
    plot.addTraces([
      {
        ...this.notebookRecorder.getViewRecording(1),
        name: 'Total credits',
        mode: 'lines+markers',
        line: {
          color: 'rgb(63, 255, 0)',
          width: 2,
        },
      },
    ]);
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
    // plot.addTraces([
    //   {
    //     ...(await this.notebookRecorder.getPeriodTrace(this.rewardPeriod)),
    //     name: 'Period',
    //     mode: 'markers',
    //     marker: {
    //       symbol: 'line-ns-open',
    //       size: 12,
    //       color: 'rgb(0, 0, 0)',
    //     },
    //   },
    // ]);
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
