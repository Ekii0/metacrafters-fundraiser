const { task } = require("hardhat/config");

task(
  "requestRefund",
  "Request a refund from contract if the campaign was unsuccessful"
)
  .addOptionalParam(
    "funder",
    "Index of funder account that will request the refund: 1 or 2",
    "1"
  )
  .addOptionalParam(
    "name",
    "Name of campaign from which to request a refund",
    "Test Campaign"
  )
  .addOptionalParam(
    "owner",
    "Index of fundraiser account associated with the campaign",
    "0"
  )
  .setAction(async ({ funder, name, owner }) => {
    try {
      const [deployer, funder1, funder2] = await hre.ethers.getSigners();
      const owners = [deployer, funder1, funder2];
      const funders = [deployer, funder1, funder2];
      const campaignFunder = funders[funder];
      const campaignOwner = owners[owner];
      const funderAddress = await campaignFunder.getAddress();
      const ownerAddress = await campaignOwner.getAddress();
      const projectName = name;
      const projectId = hre.ethers.utils.solidityKeccak256(
        ["string", "address"],
        [projectName, ownerAddress]
      );
      const contract = await hre.ethers.getContract("Fundraiser");

      console.log(
        `Account ${funderAddress} is requesting refund for project "${projectName}" started by ${ownerAddress}...`
      );
      await contract.connect(campaignFunder).requestRefund(projectId);
      console.log("Got funds back!");
      console.log(
        "-------------------------------------------------------------"
      );
    } catch (err) {
      console.error(err);
    }
  });
