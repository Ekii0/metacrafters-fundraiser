// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Fundraiser is ReentrancyGuard {
    // Fundraising campaign variables
    struct Campaign {
        string name;
        address owner;
        uint256 startDate;
        uint32 duration;
        uint256 fundraisingGoal;
    }
    mapping(bytes32 => bool) private campaignExists;
    mapping(bytes32 => Campaign) private campaignMapping;

    // Balance of each project; maps projectIds to the project's balance
    mapping(bytes32 => uint256) private campaignBalance;

    // Amount each funder has spent on a specific project
    mapping(address => mapping(bytes32 => uint256))
        private contributionFromFunderToCampaign;

    // ERC20 interface; required to send and transfer ERC20 tokens
    IERC20 private erc20;

    // Events
    event NewCampaignStarted(
        string name,
        address owner,
        bytes32 id,
        uint256 startDate,
        uint32 duration,
        uint256 fundraisingGoal
    );

    event FundingReceived(
        bytes32 projectId,
        uint256 fundingAmount,
        address funder
    );

    event Refunded(bytes32 projectId, address funder, uint256 amountRefunded);

    event FundsWithdrawn(bytes32 projectId, uint256 totalFunds, address owner);

    constructor(address _erc20TokenAddress) {
        erc20 = IERC20(_erc20TokenAddress);
    }

    /**
     * @dev Function to start a new campaign
     */
    function startCampaign(
        string memory _name,
        uint32 _duration, // can store a max duration of ~136 years.
        uint256 _fundraisingGoal
    ) external {
        // require campaign does not already exist
        bytes32 _newId = _createProjectId(_name, msg.sender);
        require(
            !campaignExists[_newId],
            "You already have a running campaign with this name!"
        );
        // Then add project to campaigns;
        campaignExists[_newId] = true;
        Campaign memory _newCampaign = Campaign(
            _name,
            msg.sender,
            block.timestamp,
            _duration,
            _fundraisingGoal
        );
        campaignMapping[_newId] = _newCampaign;
        emit NewCampaignStarted(
            _name,
            msg.sender,
            _newId,
            block.timestamp,
            _duration,
            _fundraisingGoal
        );
    }

    /**
     * @dev Function to fund a project
     */
    function fundProject(bytes32 _projectId, uint256 _fundingAmount) external {
        // Check if project exists
        require(campaignExists[_projectId], "Can't fund nonexisting campaign!");
        // Check if caller has sufficient funds
        require(
            erc20.balanceOf(msg.sender) >= _fundingAmount,
            "You do not have enough funds!"
        );
        erc20.transferFrom(msg.sender, address(this), _fundingAmount);
        campaignBalance[_projectId] += _fundingAmount;
        contributionFromFunderToCampaign[msg.sender][
            _projectId
        ] = _fundingAmount;

        emit FundingReceived(_projectId, _fundingAmount, msg.sender);
    }

    /**
     * @dev Function to get funds back (if campaign unsuccessful)
     */
    function requestRefund(bytes32 _projectId) external nonReentrant {
        // Project must exist
        require(campaignExists[_projectId], "Campaign does not exist!");
        Campaign memory _campaign = campaignMapping[_projectId];
        // Funding period needs to be expired
        uint256 _currentTime = block.timestamp;
        require(
            _currentTime > _campaign.startDate + _campaign.duration,
            "Campaign is still running!"
        );
        // Funding goal has not been reached
        uint256 _totalAmountRaised = campaignBalance[_projectId];
        require(
            _totalAmountRaised < _campaign.fundraisingGoal,
            "Campaign has reached sufficient funding!"
        );
        // Funder must have contributed to campaign
        uint256 _individualContribution = contributionFromFunderToCampaign[
            msg.sender
        ][_projectId];
        require(_individualContribution > 0, "You hadn't funded this project!");
        // Reset funder's balance and transfer tokens back
        contributionFromFunderToCampaign[msg.sender][_projectId] = 0;
        bool _success = erc20.transfer(msg.sender, _individualContribution);
        require(_success, "Refunding failed!");
        emit Refunded(_projectId, msg.sender, _individualContribution);
    }

    /**
     * @dev Function for project owners to withdraw funds (if campaign was successful)
     */
    function withdrawFundsFromProject(
        bytes32 _projectId
    ) external nonReentrant {
        // Campaign must exist
        require(campaignExists[_projectId], "This campaign does not exist!");
        address _owner = campaignMapping[_projectId].owner;
        // msg.sender must be owner of campaign
        require(msg.sender == _owner, "You're not the fundraiser!");
        // fundraisingGoal must have been reached
        uint256 _goal = campaignMapping[_projectId].fundraisingGoal;
        uint256 _balance = campaignBalance[_projectId];
        require(
            _balance >= _goal,
            "The campaign hasn't reached the fundraising goal!"
        );
        // required time must have passed
        uint256 _current = block.timestamp;
        require(
            _current >=
                campaignMapping[_projectId].startDate +
                    campaignMapping[_projectId].duration,
            "Campaign is still running!"
        );
        // reset campaign and transfer tokens to owner
        delete campaignBalance[_projectId];
        delete campaignMapping[_projectId];
        delete campaignExists[_projectId];
        bool _success = erc20.transfer(msg.sender, _balance);
        require(_success, "Failed to withdraw funds!");
        emit FundsWithdrawn(_projectId, _balance, msg.sender);
    }

    /**
     * @dev Helper function to create unique projectIds from projectName and projectOwner.
     */
    function _createProjectId(
        string memory _name,
        address _projectOwner
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _projectOwner));
    }
}
