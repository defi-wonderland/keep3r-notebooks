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

    // setup keeper
    await this.keep3r.connect(this.keeper).bond(constants.KP3R_V1_ADDRESS, 0);
    await evm.advanceTimeAndBlock(moment.duration(3, 'days').as('seconds'));
    await this.keep3r.connect(this.keeper).activate(constants.KP3R_V1_ADDRESS);

    // setup credit recorder
    this.creditRecorder = new CreditRecorder(this.keep3r);

    // setup reward period
    this.rewardPeriod = (await this.keep3r.rewardPeriodTime()).toNumber();
  }

  async setupLiquidity(liquidityData) {
    const whale = await wallet.impersonate(liquidityData.whale);
    const pool = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', liquidityData.pool);
    await pool.connect(whale).transfer(this.jobOwner.address, 1);
    await this.keep3r.connect(this.governance).approveLiquidity(pool.address);
    return { whale, pool };
  }

  async addLiquidityToJob(pool, whale, amount) {
    await pool.connect(whale).transfer(this.jobOwner.address, amount, { gasPrice: 0 });
    await pool.connect(this.jobOwner).approve(this.keep3r.address, amount);
    await this.keep3r.connect(this.jobOwner).addLiquidityToJob(this.job.address, pool.address, amount);
  }

  async removeLiquidityToJob(pool, amount) {
    await this.keep3r.connect(this.jobOwner).withdrawLiquidityFromJob(this.job.address, pool.address, amount);
  }

  async recordCredits() {
    await this.creditRecorder.record(this.job.address);
  }

  async resetRecording(){
    await this.creditRecorder.reset(this.job.address);
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
        ...(await this.creditRecorder.getEventsTrace(this.w3Keep3r,'KeeperWork')),
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
        ...(await this.creditRecorder.getEventsTrace(this.w3Keep3r,'JobCreditsUpdated', 1)),
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
        ...(await this.creditRecorder.getPeriodTrace()),
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
        ...(await this.creditRecorder.getEventsTrace(this.w3Keep3r,'LiquidityAddition')),
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
        ...(await this.creditRecorder.getEventsTrace(this.w3Keep3r,'LiquidityWithdrawal')),
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
}

exports.Notebook = Notebook;
