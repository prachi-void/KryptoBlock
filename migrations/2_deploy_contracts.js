var fileStore = artifacts.require("./fileStore.sol");

module.exports = function(deployer) {
    deployer.deploy(fileStore);
};