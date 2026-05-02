const { ethers } = require("ethers");
require("dotenv").config();

const ENERGY_TRADE_ABI = [
    "function listSurplus(string memory _buildingName, uint256 _energyAmount, uint256 _pricePerWh) external",
    "function buyEnergy(uint256 _listingId) external",
    "function cancelListing(uint256 _listingId) external",
    "function getActiveListing(uint256 _listingId) external view returns (tuple(uint256 id, address seller, string buildingName, uint256 energyAmount, uint256 pricePerWh, bool isActive))",
    "function listingCount() external view returns (uint256)",
    "event TradeExecuted(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 energyAmount, uint256 totalCost)",
    "event SurplusListed(uint256 indexed listingId, address indexed seller, string buildingName, uint256 energyAmount, uint256 pricePerWh)"
];

const ENERGY_TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)"
];

let energyTrade, energyToken, provider;

try {
    provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    energyTrade = new ethers.Contract(
        process.env.ENERGY_TRADE_ADDRESS,
        ENERGY_TRADE_ABI,
        wallet
    );

    energyToken = new ethers.Contract(
        process.env.ENERGY_TOKEN_ADDRESS,
        ENERGY_TOKEN_ABI,
        wallet
    );

    console.log("✅ Contracts connected successfully");
    console.log("EnergyTrade:", process.env.ENERGY_TRADE_ADDRESS);
    console.log("EnergyToken:", process.env.ENERGY_TOKEN_ADDRESS);
} catch (error) {
    console.error("❌ Contract connection failed:", error.message);
}

module.exports = { energyTrade, energyToken, provider };