// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Presale is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable token;
    uint256 public immutable maxSaleSupply;
    uint64 public immutable startTime;
    uint64 public immutable endTime;

    uint256 public price;
    uint256 public minimumInvestment;
    uint256 public maximumInvestment;
    uint256 public totalTokenBought;

    event Sold(address buyer, uint256 amount);

    /**
     *  @notice Constructor
     * @param _token The address of the token
     * @param _price The price of the token
     * @param _minimumInvestment The minimum investment in wei
     * @param _maximumInvestment The maximum investment in wei
     * @param _startTime The UNIX timestamp of the start time of the sale
     * @param _endTime The UNIX timestamp of the end time of the sale
     */
    constructor(
        address _token,
        uint256 _price,
        uint256 _minimumInvestment,
        uint256 _maximumInvestment,
        uint64 _startTime,
        uint64 _endTime
    ) {
        token = IERC20(_token);
        startTime = _startTime;
        endTime = _endTime;
        price = _price;
        minimumInvestment = _minimumInvestment;
        maximumInvestment = _maximumInvestment;

        maxSaleSupply = 260000000 ether;
    }

    /**
     * @dev Calls buyTokens() function when eth is sent to contract address
     */
    receive() external payable {
        buyTokens();
    }

    /**
     * @notice Buys tokens by sending eth to the contract address
     */
    function buyTokens() public payable {
        require(block.timestamp > startTime, "TokenPresale: sale not started");
        require(block.timestamp < endTime, "TokenPresale: sale has ended");
        require(
            msg.value >= minimumInvestment,
            "TokenPresale: value must be above minimum investment"
        );
        require(
            msg.value <= maximumInvestment,
            "TokenPresale: value must be below maximum investment"
        );
        uint256 tokensBought = (price *
            msg.value *
            10 ** ERC20(address(token)).decimals()) / 1 ether;
        require(
            totalTokenBought + tokensBought <= maxSaleSupply,
            "TokenPresale: supply exceeded"
        );
        console.log("tokensBought", tokensBought);

        if (address(this).balance >= 0.5 ether) {
            (bool success, ) = payable(owner()).call{
                value: address(this).balance
            }("");
            require(success, "TokenPresale: transfer failed");
        }

        totalTokenBought += tokensBought;

        token.safeTransfer(_msgSender(), tokensBought);

        emit Sold(_msgSender(), tokensBought);
    }

    function setPrice(uint256 _newPrice) public onlyOwner {
        require(_newPrice > 0, "TokenPresale: price must be greater than 0");
        price = _newPrice;
    }

    /**
     * @dev withdraw eth from contract
     */
    function withdrawERC20() external onlyOwner {
        token.safeTransfer(_msgSender(), token.balanceOf(address(this)));
    }

    /**
     * @dev withdraw eth from contract
     */
    function withdraw() external onlyOwner {
        (bool success, ) = payable(_msgSender()).call{
            value: address(this).balance
        }("");
        require(success, "TokenPresale: transfer failed");
    }
}
