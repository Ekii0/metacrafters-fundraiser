const { task } = require("hardhat/config");

task(
  "withdrawFunds",
  "Will withdraw funds to fundraiser account of a successful campaign"
)
  .addOptionalParam(
    "name",
    "Name of campaign from which to withdraw funds",
    "Test Campaign"
  )
  .addOptionalParam(
    "owner",
    "Index of fundraiser account associated with campaign",
    "0"
  )
  .setAction(async ({ name, owner }) => {
    try {
      const [deployer, alt1, alt2] = await hre.ethers.getSigners();
      const contract = await hre.ethers.getContract("Fundraiser");
      const projectName = name;
      const fundraisers = [deployer, alt1, alt2];
      const fundraiser = fundraisers[owner];
      const fundraiserAddress = await fundraiser.getAddress();
      const projectId = hre.ethers.utils.solidityKeccak256(
        ["string", "address"],
        [projectName, fundraiserAddress]
      );

      console.log(
        `Fundraiser ${fundraiserAddress} is trying to withdraw funds from campaign "${projectName}"...`
      );
      await contract.connect(fundraiser).withdrawFundsFromProject(projectId);
      console.log("Withdrawing successful!");
      console.log(
        "-------------------------------------------------------------"
      );
    } catch (err) {
      console.error(err);
    }
  });
