const contracts = require('./contracts');
const { KP3R_V1_ADDRESS, KP3R_V1_GOVERNANCE_ADDRESS } = require('./constants');
const wallet = require('./wallet');
const { toUnit } = require('./bn');
const { ethers } = require('hardhat');

const setupKeep3r = async () => {
  // create governance with some eth
  const governance = await wallet.impersonate(wallet.generateRandomAddress());
  await contracts.setBalance(governance._address, toUnit(1000));

  // deploy proxy and set it as Keep3rV1 governance
  const { keep3rV1, keep3rV1Proxy } = await setupKeep3rV1(governance);

  const helperFactory = await ethers.getContractFactory('Keep3rHelper');
  const keep3rFactory = await ethers.getContractFactory('Keep3r');

  // deploy Keep3rHelper and Keep3r contract
  const helper = await helperFactory.deploy();
  const keep3r = await keep3rFactory.connect(governance).deploy(helper.address, keep3rV1.address, keep3rV1Proxy.address);

  // set Keep3r as proxy minter
  await keep3rV1Proxy.connect(governance).setMinter(keep3r.address);

  // give some eth to Keep3r and to Keep3rV1
  await contracts.setBalance(keep3r.address, toUnit(1000));
  await contracts.setBalance(keep3rV1.address, toUnit(1000));

  return { governance, keep3r, keep3rV1, keep3rV1Proxy, helper };
};

async function setupKeep3rV1(governance) {
  // get Keep3rV1 and it's governance
  const keep3rV1 = await ethers.getContractAt('IKeep3rV1', KP3R_V1_ADDRESS);
  const keep3rV1Governance = await wallet.impersonate(KP3R_V1_GOVERNANCE_ADDRESS);

  // deploy proxy
  const keep3rV1Proxy = await (await ethers.getContractFactory('Keep3rV1Proxy')).connect(governance).deploy(keep3rV1.address);

  // set proxy as Keep3rV1 governance
  await keep3rV1.connect(keep3rV1Governance).setGovernance(keep3rV1Proxy.address, { gasPrice: 0 });
  await keep3rV1Proxy.connect(governance).acceptKeep3rV1Governance();

  return { keep3rV1, keep3rV1Proxy };
}

const createJobForTest = async (keep3rAddress, jobOwner) => {
  const jobFactory = await ethers.getContractFactory('JobForTest');

  return await jobFactory.connect(jobOwner).deploy(keep3rAddress);
};

exports.setupKeep3r = setupKeep3r;
exports.createJobForTest = createJobForTest;