const contracts = require('./contracts');
const { KP3R_V1_ADDRESS, KP3R_V1_GOVERNANCE_ADDRESS, UNISWAP_V3_ORACLE_POOL, UNISWAP_V3_ROUTER, WETH_ADDRESS } = require('./constants');
const wallet = require('./wallet');
const { toUnit } = require('./bn');
var { advanceTimeAndBlock } = require('./evm');
const { ethers, web3, artifacts } = require('hardhat');

/*
setup: exports keep3r deployed and running
*/

class Keep3r {
  governance;
  keeper;
  v2;
  v1;
  helper;
  proxy;
  pool;

  async setup() {
    const data = await setupKeep3r();
    this.governance = data.governance;
    this.v2 = data.keep3r;
    this.v1 = data.keep3rV1;
    this.proxy = data.keep3rV1Proxy;
    this.helper = data.helper;

    // setup web3 keep3r for events
    /* NOTE: Keep3r artifact lacks Roles and DustCollector to make it fit under 24kb */
    const artifact = await artifacts.readArtifact('Keep3r');
    this.v2.web3 = new web3.eth.Contract(artifact.abi, data.keep3r.address);

    this.pool = await setupKeep3rPool();
    data.keep3r.connect(data.governance).approveLiquidity(this.pool.address);

    this.keeper = await activateKeeper(data.keep3r);
  }
}

const setupKeep3rPool = async () => {
  const pairManagerFactory = await ethers.getContractFactory('UniV3PairManager');
  const pairManager = await pairManagerFactory.deploy(UNISWAP_V3_ORACLE_POOL, KP3R_V1_GOVERNANCE_ADDRESS);

  const uniV3Pool = await ethers.getContractAt('IUniswapV3Pool', UNISWAP_V3_ORACLE_POOL);
  const uniV3Router = await ethers.getContractAt('ISwapRouter', UNISWAP_V3_ROUTER);

  return pairManager;
};

const activateKeeper = async (keep3r) => {
  const keeper = await wallet.generateRandom();
  await contracts.setBalance(keeper.address, toUnit(1000));
  await keep3r.connect(keeper).bond(KP3R_V1_ADDRESS, 0);
  await evm.advanceTimeAndBlock(moment.duration(3, 'days').as('seconds'));
  await keep3r.connect(keeper).activate(KP3R_V1_ADDRESS);
  return keeper;
};

const setupKeep3r = async () => {
  // create governance with some eth
  const governance = await wallet.impersonate(KP3R_V1_GOVERNANCE_ADDRESS);
  await contracts.setBalance(governance._address, toUnit(1000));

  // deploy proxy and set it as Keep3rV1 governance
  const { keep3rV1, keep3rV1Proxy } = await setupKeep3rV1(governance);

  const helperFactory = await ethers.getContractFactory('Keep3rHelperForTest');
  const keep3rFactory = await ethers.getContractFactory('Keep3r');

  const currentNonce = await ethers.provider.getTransactionCount(governance._address);
  const keeperV2Address = ethers.utils.getContractAddress({ from: governance._address, nonce: currentNonce + 1 });

  // deploy Keep3rHelper and Keep3r contract
  const helper = await helperFactory.connect(governance).deploy(keeperV2Address);

  const keep3r = await keep3rFactory
    .connect(governance)
    .deploy(governance._address, helper.address, keep3rV1.address, keep3rV1Proxy.address, UNISWAP_V3_ORACLE_POOL);

  const helperV1 = await ethers.getContractAt('IKeep3rV1Helper', await keep3rV1.callStatic.KPRH());
  const fastGas = helperV1.getFastGas();

  // sets Keep3rHelper base fee to replicate Keep3rV1Helper quote
  await helper.setBaseFee(fastGas);

  // set Keep3r as proxy minter
  await keep3rV1Proxy.connect(governance).setMinter(keep3r.address);

  return { governance, keep3r, keep3rV1, keep3rV1Proxy, helper };
};

const setupKeep3rV1 = async (governance) => {
  // get Keep3rV1 and it's governance
  const keep3rV1 = await ethers.getContractAt('IKeep3rV1', KP3R_V1_ADDRESS);

  // fetch proxy
  // WARNING: retrieve Keep3rV1Proxy artifact from repo
  const keep3rV1ProxyFactory = await ethers.getContractFactory('Keep3rV1Proxy');
  const keep3rV1Proxy = await keep3rV1ProxyFactory.deploy(KP3R_V1_GOVERNANCE_ADDRESS, KP3R_V1_ADDRESS);
  // TODO: unable to used deployed proxy because of London fork
  // await ethers.getContractAt('IKeep3rV1Proxy','0xFC48aC750959d5d5aE9A4bb38f548A7CA8763F8d')

  // set proxy as Keep3rV1 governance
  await keep3rV1.connect(governance).setGovernance(keep3rV1Proxy.address);
  await keep3rV1Proxy.connect(governance).acceptKeep3rV1Governance();

  return { keep3rV1, keep3rV1Proxy };
};

const createJobForTest = async (keep3rAddress, jobOwner) => {
  const jobFactory = await ethers.getContractFactory('JobForTest');

  return await jobFactory.connect(jobOwner).deploy(keep3rAddress);
};

// keep3r utils

const setupLiquidity = async (liquidityData) => {
  const whale = await wallet.impersonate(liquidityData.whale);
  const pool = await ethers.getContractAt('IERC20', liquidityData.pool);
  await pool.connect(whale).transfer(this.jobOwner.address, 1);
  await this.keep3r.connect(this.governance).approveLiquidity(pool.address);
  return { whale, pool };
};

const addLiquidityToJob = async (pool, whale, amount) => {
  await pool.connect(whale).approve(this.keep3r.address, amount);
  await this.keep3r.connect(whale).addLiquidityToJob(this.job.address, pool.address, amount);
};

// uniswap utils

const makeASwap = async (provider, fromToken, toToken, receiver, fee, amount) => {
  uniRouter = await ethers.getContractAt('ISwapRouter', '0xE592427A0AEce92De3Edee1F18E0157C05861564');

  await keep3r.proxy.connect(keep3r.governance)['mint(address,uint256)'](provider.address, amount);
  await keep3r.v1.connect(provider).approve(uniRouter.address, amount);

  const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;

  return await uniRouter
    .connect(provider)
    .exactInputSingle([fromToken, toToken, 10000, receiver, blockTimestamp + 100, amount, toUnit(0.0001), 0]);
};

exports.Keep3r = Keep3r;
exports.setupKeep3r = setupKeep3r;
exports.setupKeep3rPool = setupKeep3rPool;
exports.createJobForTest = createJobForTest;
exports.makeASwap = makeASwap;
exports.activateKeeper = activateKeeper;
