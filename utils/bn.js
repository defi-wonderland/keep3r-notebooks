const { utils } = require('ethers');

const toUnit = (value) => {
  return utils.parseUnits(value.toString());
};

exports.toUnit = toUnit;
