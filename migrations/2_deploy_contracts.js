var fixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");
var exchange = artifacts.require("./Exchange.sol");

module.exports = function(deployer) {
  deployer.deploy(fixedSupplyToken);
  deployer.deploy(exchange);
};
