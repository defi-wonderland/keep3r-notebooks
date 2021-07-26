const { utils } = require('ethers');

exports.toUnit = (value) => {
  return utils.parseUnits(value.toString());
};
