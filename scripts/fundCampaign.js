const { task } = require("hardhat/config");

task("fundCampaign", "Will fund a campaign from specified funding account")
  .addOptionalParam("funder", "Index of funding account: 1 or 2", "1")
  .addOptionalParam("name", "Name of campaign to be funded", "Test Campaign")
  .addOptionalParam(
    "owner",
    "Index of account of campaign starter: 0, 1, or 2",
    "0"
  )
  .addOptionalParam("amount", "Amount to be funded in FRT tokens", "50000")
  .setAction(async ({ funder, name, owner, amount }) => {
    try {
      const [owner0, funder1, funder2] = await hre.ethers.getSigners();
      const funders = [owner0, funder1, funder2];
      const owners = [owner0, funder1, funder2];
      const campaignFunder = funders[funder];
      const funderAddress = await campaignFunder.getAddress();
      const campaignOwner = owners[owner];
      const ownerAddress = await campaignOwner.getAddress();
      const erc20 = await hre.ethers.getContract("FundraiserToken");
      const contract = await hre.ethers.getContract("Fundraiser");
      const campaignName = name;
      const projectId = hre.ethers.utils.solidityKeccak256(
        ["string", "address"],
        [campaignName, ownerAddress]
      );
      console.log(`Created ProjectID: ${projectId}`);
      const fundingAmount = amount + "000000000000000000"; // 50,000 FRT

      console.log(
        `Funding campaign "${campaignName}" from ${funderAddress} with ${fundingAmount} FRT...`
      );
      await erc20
        .connect(campaignFunder)
        .approve(contract.address, fundingAmount);
      await contract
        .connect(campaignFunder)
        .fundProject(projectId, fundingAmount);
      console.log("Successfully funded campaign!");
      console.log(
        "-------------------------------------------------------------"
      );
    } catch (err) {
      console.error(err);
    }
  });
