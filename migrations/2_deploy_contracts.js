// var Ownable = artifacts.require("./zeppelin/Ownable.sol");
// var Destructible = artifacts.require("./zeppelin/Destructible.sol");
var Buidl = artifacts.require("./Buidl.sol");

module.exports = function(deployer) {
  // deployer.deploy(Ownable);
  // deployer.link(Ownable, Destructible);
  // deployer.deploy(Destructible);
  // deployer.link(Destructible, Buidl);
  deployer.deploy(Buidl);
};
