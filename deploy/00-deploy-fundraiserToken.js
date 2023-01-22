const { network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  if (network.name == "hardhat") {
    console.log(
      "Local network detected. Deploying Fundraiser Token Contract..."
    );
    await deploy("FundraiserToken", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: 1,
    });
    log("Successfully deployed Fundraiser Token Contract!");
    log("-------------------------------------------------------------------");
  }
};
