const { ethers, network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer, funder1, funder2 } = await getNamedAccounts();

  let erc20Token;
  erc20Token =
    network.name == "hardhat"
      ? await ethers.getContract("FundraiserToken", deployer)
      : "0x1234567890123456789012345678901234567890";
  const tokenAddress = erc20Token.address;

  await deploy("Fundraiser", {
    from: deployer,
    args: [tokenAddress],
    log: true,
    waitConfirmations: 1,
  });

  if (network.name == "hardhat") {
    log("Funding accounts with 1,000,000 FTR tokens...");
    const startingTokenBalance = "1000000000000000000000000"; // 1,000,000 FRT

    await erc20Token.transfer(funder1, startingTokenBalance);
    await erc20Token.transfer(funder2, startingTokenBalance);
    log("Accounts funded!");
    log("-------------------------------------------------------------------");
  }
};
