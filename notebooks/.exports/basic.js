require('dotenv').config({ path: '../.env' });
var { evm, wallet, constants, common } = require('../utils');

evm.reset({
  jsonRpcUrl: process.env.MAINNET_HTTPS_URL,
  blockNumber: constants.FORK_BLOCK_NUMBER,
});

jobOwner = null;
wallet.impersonate(constants.RICH_ETH_ADDRESS).then((r) => (jobOwner = r));

var keep3r, governance, keep3rV1;
common.setupKeep3r().then((res) => {
  keep3r = res.keep3r;
  governance = res.governance;
  keep3rV1 = res.keep3rV1;
});

var job;
common.createJobForTest(keep3r.address, jobOwner).then((res) => (job = res));

keep3r.connect(governance).addJob(job.address);

keep3r.jobs();
