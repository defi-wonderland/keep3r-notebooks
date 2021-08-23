require('dotenv').config({ path: '../.env' });
const { evm, wallet, constants, common } = require('../utils');
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
    this.keep3rV1Proxy = data.keep3rV1Proxy;

    // setup pool
    const pool = '0x11b7a6bc0259ed6cf9db8f499988f9ecc7167bf5';
    const pool_artifact = await artifacts.readArtifact('IUniswapV3Pool');
    this.w3Pool = new web3.eth.Contract(pool_artifact.abi, pool);

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
    this.notebookRecorder = new notebookRecorder();

    // setup reward period
    this.rewardPeriod = (await this.keep3r.rewardPeriodTime()).toNumber();
  }

  // keep3r utils

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

  // contract utils

  async fetch(contractName, address) {
    let fetchedContract = await ethers.getContractAt(contractName, address);
    return fetchedContract;
  }

  async deploy(contractName, constructor = null) {
    let factory = await ethers.getContractFactory(contractName);
    let contract = await factory.deploy(constructor);
    return contract;
  }

  async getBalance(address) {
    return await ethers.provider.getBalance(address);
  }

  async impersonate(address) {
    return await wallet.impersonate(address);
  }

  async block() {
    return await ethers.provider.getBlock('latest');
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

  async recordCredits() {
    await this.notebookRecorder.recordView(this.keep3r, 'jobLiquidityCredits', this.job.address, 0);
    await this.notebookRecorder.recordView(this.keep3r, 'totalJobCredits', this.job.address, 1);
  }

  resetRecording() {
    this.notebookRecorder.reset();
  }

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
    plot.addTraces([
      {
        ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'KeeperWork')),
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
        ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'JobCreditsUpdated', 1)),
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
        ...(await this.notebookRecorder.getPeriodTrace(this.rewardPeriod)),
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
        ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'LiquidityAddition')),
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
        ...(await this.notebookRecorder.getEventsTrace(this.w3Keep3r, 'LiquidityWithdrawal')),
        name: 'Liquidity withdrawn',
        mode: 'markers',
        marker: {
          symbol: 'triangle-down',
          size: 16,
          color: 'rgb(255, 0, 0)',
        },
      },
    ]);
    plot.addTraces([
      {
        ...(await this.notebookRecorder.getEventsTrace(this.w3Pool, 'Swap')),
        name: 'KP3R Swapped',
        mode: 'markers',
        marker: {
          symbol: 'triangle-down',
          size: 16,
          color: 'rgb(0, 255, 255)',
        },
      },
    ]);

    $$html$$ = plot.render();
  }
}

exports.Notebook = Notebook;
