// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EnergyToken - Test token for CampusChain P2P energy trading
/// @author Ogangbo Ochoche Joseph - FUT Minna
contract EnergyToken is ERC20, Ownable {
    
    // 1 token = 1 kWh of energy for simplicity
    uint256 public constant TOKENS_PER_KWH = 1 * 10**18;

    constructor() ERC20("CampusEnergyToken", "CET") Ownable(msg.sender) {
        // Mint 1,000,000 test tokens to deployer on launch
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /// @notice Mint tokens to any campus building address (owner only)
    function mintTo(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount);
    }

    /// @notice Burn tokens from caller's balance
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}