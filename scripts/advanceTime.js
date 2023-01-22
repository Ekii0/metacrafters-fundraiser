const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { task } = require("hardhat/config");

task(
  "advanceTime",
  "Helper function that mines a block 'x' seconds in the future"
)
  .addOptionalPositionalParam(
    "interval",
    "Seconds that will be skipped forward.",
    "18000" // 18,000s = 5 days = 5 * 3600s
  )
  .setAction(async ({ interval }) => {
    try {
      console.log(`Advancing time by ${interval} seconds...`);
      await time.increase(+interval);
      console.log("Done! Mined new block in the future!");
      console.log(
        "-----------------------------------------------------------"
      );
    } catch (err) {
      console.error(err);
    }
  });
