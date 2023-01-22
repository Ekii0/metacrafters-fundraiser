// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FundraiserToken is ERC20 {
    constructor() ERC20("FundraiserToken", "FRT") {
        _mint(msg.sender, 12000000 * 10 ** decimals());
    }
}
