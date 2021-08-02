require('dotenv').config({ path: '../.env' });
const { evm, wallet, constants, common } = require('../utils');
const { getBlockTimestamp } = require('../utils/evm');
const { getPastEvents } = require('../utils/contracts');
const { unixToDate } = require('../utils/jupyter');
const { ethers, web3, artifacts } = require('hardhat');
const moment = require('moment');
const Plot = require('plotly-notebook-js');
const { CreditRecorder } = require('../utils/credit-recorder');

class Notebook {
  creditRecorder;
  jobOwner;
  keeper;
  keep3r;
  governance;
  keep3rV1;
  helper;
  job;
  w3Keep3r;
  kp3rWeth;
  kp3rWethWale;
  rewardPeriod;

  async setup() {
    await evm.reset({
      jsonRpcUrl: process.env.MAINNET_HTTPS_URL,
      blockNumber: constants.FORK_BLOCK_NUMBER,
    });

    [this.jobOwner, this.keeper] = await ethers.getSigners();

    // setup keep3r
    const data = await common.setupKeep3r();
    this.keep3r = data.keep3r;
    this.governance = data.governance;
    this.keep3rV1 = data.keep3rV1;
    this.helper = data.helper;

    // setup job
    this.job = await common.createJobForTest(this.keep3r.address, this.jobOwner);
    await this.keep3r.connect(this.jobOwner).addJob(this.job.address);

    // setup web3 keep3r
    const artifact = await artifacts.readArtifact('Keep3r');
    this.w3Keep3r = new web3.eth.Contract(artifact.abi, this.keep3r.address);

    // setup liquidity
    this.kp3rWethWale = await wallet.impersonate(constants.RICH_KP3R_WETH_POOL_ADDRESS);
    this.kp3rWeth = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', constants.KP3R_WETH_POOL_ADDRESS);
    await this.keep3r.connect(this.governance).approveLiquidity(this.kp3rWeth.address);

    // setup keeper
    await this.keep3r.connect(this.keeper).bond(constants.KP3R_V1_ADDRESS, 0);
    await evm.advanceTimeAndBlock(moment.duration(3, 'days').as('seconds'));
    await this.keep3r.connect(this.keeper).activate(constants.KP3R_V1_ADDRESS);

    // setup credit recorder
    this.creditRecorder = new CreditRecorder(this.keep3r);

    // setup reward period
    this.rewardPeriod = (await notebook.keep3r.REWARD_PERIOD()).toNumber();
  }

  async addLiquidityToJob(amount) {
    await this.kp3rWeth.connect(this.kp3rWethWale).transfer(this.jobOwner.address, amount);
    await this.kp3rWeth.connect(this.jobOwner).approve(this.keep3r.address, amount);
    await this.keep3r.connect(this.jobOwner).addLiquidityToJob(this.job.address, this.kp3rWeth.address, amount);
  }

  async removeLiquidityToJob(amount) {
    await this.keep3r.connect(this.jobOwner).withdrawLiquidityFromJob(this.job.address, this.kp3rWeth.address, amount);
  }

  async recordCredits() {
    await this.creditRecorder.record(this.job.address);
  }

  async sleepAndRecord(totalSleepTime, recordEvery) {
    let totalSlept = 0;
    await this.recordCredits();

    while (totalSlept < (totalSleepTime - recordEvery)) {    
        await advanceTimeAndBlock(recordEvery);
        await this.recordCredits();
        totalSlept += recordEvery;
    }

    await advanceTimeAndBlock(totalSleepTime - totalSlept);
    await this.recordCredits();
  }

  async draw() {
    const plot = Plot.createPlot([]);
    plot.addTraces([
      {
        ...this.creditRecorder.getCurrentCredits(this.job.address),
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
        ...this.creditRecorder.getTotalCredits(this.job.address),
        name: 'Total credits',
        mode: 'lines+markers',
        line: {
          color: 'rgb(63, 255, 0)',
          width: 2,
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.getEventsTrace('KeeperWork')),
        name: 'Work',
        mode: 'markers',
        marker: {
          symbol: 'x-thin-open',
          size: 12,
          color: 'rgb(0, 0, 255)',
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.getEventsTrace('JobCreditsUpdated', 1)),
        name: 'Rewarded At',
        mode: 'markers',
        marker: {
          symbol: 'star',
          size: 12,
          color: 'rgb(255, 215, 0)',
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.getPeriodTrace()),
        name: 'Period',
        mode: 'markers',
        marker: {
          symbol: 'line-ns-open',
          size: 12,
          color: 'rgb(0, 0, 0)',
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.getEventsTrace('LiquidityAddition')),
        name: 'Liquidity added',
        mode: 'markers',
        marker: {
          symbol: 'triangle-up',
          size: 16,
          color: 'rgb(0, 255, 0)',
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.getEventsTrace('LiquidityWithdrawal')),
        name: 'Liquidity withdrawn',
        mode: 'markers',
        marker: {
          symbol: 'triangle-down',
          size: 16,
          color: 'rgb(255, 0, 0)',
        },
      },
    ]);

    $$html$$ = plot.render();
  }

  async getEventsTrace(eventName, timestampArgIndex) {
    const events = await getPastEvents(this.w3Keep3r, eventName);

    let timestampPromises;
    if (timestampArgIndex === undefined) {
      timestampPromises = events.map((event) => getBlockTimestamp(event.blockNumber));
    } else {
      // grab timestamp from event arguments
      timestampPromises = events.map((event) => Promise.resolve(event.returnValues[timestampArgIndex]));
    }
    
    return Promise.all(timestampPromises).then((timestamps) => {
      return timestamps.reduce((acc, timestamp) => ({
        x: [...acc.x, unixToDate(timestamp)],
        y: [...acc.y, 0]
      }), { x: [], y: [] });
    });
  }

  async getPeriodTrace() {
    const periodTrace = { x: [], y: [] };

    const firstTimestamp = await getBlockTimestamp(constants.FORK_BLOCK_NUMBER);
    const latestTimestamp = await getLatestBlockTimestamp();
    
    const firstPeriod = firstTimestamp - (firstTimestamp % this.rewardPeriod) + this.rewardPeriod;
    const lastPeriod = latestTimestamp - (latestTimestamp % this.rewardPeriod);
    
    let currentPeriod = firstPeriod;
    while (currentPeriod <= lastPeriod) {
      periodTrace.x.push(unixToDate(currentPeriod));
      periodTrace.y.push(0);
      currentPeriod += this.rewardPeriod;
    }

    return periodTrace;
  }
}

exports.Notebook = Notebook;