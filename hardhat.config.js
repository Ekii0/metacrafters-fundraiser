require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-tracer");
require("./scripts/startCampaign");
require("./scripts/fundCampaign");
require("./scripts/advanceTime");
require("./scripts/requestRefund");
require("./scripts/withdrawFunds");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    funder1: {
      default: 1,
    },
    funder2: {
      default: 2,
    },
  },
};
