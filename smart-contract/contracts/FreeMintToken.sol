// SPDX-License-Identifier: MIT
// @author: https://github.com/goldnite
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FreeMintToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /**
     * @dev Mints `amount` tokens to `account`,
     *
     * See {ERC20-_mint}.
     */
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
