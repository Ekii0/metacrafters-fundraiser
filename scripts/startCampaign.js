const { task } = require("hardhat/config");

task("startCampaign", "Creates a new fundraising campaign")
  .addOptionalParam("owner", "Index of fundraiser account: 0, 1 or 2", "0")
  .addOptionalParam("name", "Name of the campaign", "Test Campaign")
  .addOptionalParam(
    "duration",
    "How long the campaign will be running in seconds",
    "18000"
  )
  .addOptionalParam("goal", "Fundraising goal in FRT tokens", "100000")
  .setAction(async ({ owner, name, duration, goal }) => {
    try {
      const { deployer } = await hre.getNamedAccounts();
      const [alt0, alt1, alt2] = await hre.ethers.getSigners();
      const owners = [alt0, alt1, alt2];
      const founder = owners[+owner];
      const founderAddress = await founder.getAddress();
      const contract = await hre.ethers.getContract("Fundraiser", deployer);
      const campaignName = name;
      const campaignLength = duration; // 5days = 5 * 3600s = 18,000
      const campaignGoal = goal + "000000000000000000"; // 100,000 FRT;

      console.log(
        `Starting new campaign for account ${founderAddress} with parameters:`
      );
      console.log(
        `Name: ${campaignName}, Duration: ${campaignLength}, Funding goal: ${campaignGoal}`
      );
      await contract
        .connect(founder)
        .startCampaign(campaignName, campaignLength, campaignGoal);
      console.log("Done!");
      console.log(
        "-------------------------------------------------------------"
      );
    } catch (err) {
      console.error(err);
    }
  });
