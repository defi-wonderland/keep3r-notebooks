const { FakeContract, MockContract, smock } = require('@defi-wonderland/smock');
const { expect } = require('chai');
const { ethers } = require('hardhat');

let fetchedContract;
describe('mocking helper', () => {
  let helperFactory;
  let helper;

  beforeEach(async () => {
    helperFactory = await smock.mock('Keep3rHelper');
    helper = await helperFactory.deploy();

    erc20Factory = await smock.mock('ERC20');
    erc20 = await erc20Factory.deploy('myToken', 'TKN');

    /// @dev When working with interfaces a fake in an address is needed for this
    // poolFactory = await smock.mock('IUniswapV3Pool')
    // pool = poolFactory.deploy(address = '0xF4aaEe4E6FfC79252f131635A0DBD6D630C69C12')
  });

  it.only('should fake totalSuppy', async () => {
    erc20.totalSupply.returns(1);
    expect((await erc20.callStatic.totalSupply()).toNumber()).to.be.eq(1);
  });

  it('should set the return', async () => {
    helper.observe.returns([1, 0]);
    // helper.observe.reverts;
    expect(await helper.observe('0xF4aaEe4E6FfC79252f131635A0DBD6D630C69C12', [0, 432000])).to.be.eq([1, 0]);
  });
});
