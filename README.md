# Web3 Fundraising Platform

This project demonstrates a basic Web3 fundraising platform, and was built for the [metacrafters](https://metacrafters.io) coding challenge. The Solidity contracts should be written such that:

> 1. Funds take the form of ERC20 tokens
> 2. Crowdfunding projects have a funding goal
> 3. When a funding goal is not met, customers are able to get a refund of their pledged funds
> 4. dApps using the contract can observe state changes in transaction logs
> 5. Optional bonus: contract is upgradeable (not implemented)

## Usage

### Installation

Clone this repository and run `yarn` to install dev dependencies.

### Compile and deploy contracts

To compile the contracts, simply run `yarn hardhat compile`.

To deploy the contracts to the local Hardhat network, run `yarn hardhat deploy`.

### Use provided scripts/tasks

To test the functionality of the contracts, I created a few useful Hardhat scripts. These need to be executed with a Hardhat node running in the background.

```shell
    yarn hardhat node
```

#### Basic usage of tasks

With the Hardhat network running in the background, run the desired scripts in another terminal window. Example usage could look like as follows:

```shell
    # starts a test fundraising campaign with standard parameters
    yarn hardhat --network localhost startCampaign

    # uses a funding account to fund the newly created campaign
    yarn hardhat --network localhost fundCampaign

    # uses another account to fund the campaign, and spends 60k tokens instead of the standard 50k tokens
    yarn hardhat --network localhost fundCampaign --funder 2 --amount 60000

    # mines a block 5 days in the future. The campaign is now finished.
    yarn hardhat --network localhost advanceTime

    # withdraws all funds to the creator account of the successful fundraising campaign
    yarn hardhat --network localhost withdrawFunds

    # in case of an unsuccessful campaign, funders can request refunds like this:
    yarn hardhat --network localhost requestRefund
```

#### Running tasks with optional parameters

Tasks may take optional parameters. For all tasks documentation is provided and can be accessed like this:

```shell
    yarn hardhat --help <nameOfTask>
```

##### Example

Documentation for the `startCampaign` task looks like this:

```shell
    $ yarn hardhat --help startCampaign
    Hardhat version 2.12.6

    Usage: hardhat [GLOBAL OPTIONS] startCampaign [--duration <STRING>] [--goal <STRING>] [--name <STRING>] [--owner <STRING>]

    OPTIONS:

    --duration    How long the campaign will be running in seconds (default: "18000")
    --goal        Fundraising goal in FRT tokens (default: "100000")
    --name        Name of the campaign (default: "Test Campaign")
    --owner       Index of fundraiser account: 0, 1 or 2 (default: "0")

    startCampaign: Creates a new fundraising campaign
```
