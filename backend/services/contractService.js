const { ethers } = require("ethers");
require("dotenv").config();

/**
 * Read-only contract service.
 *
 * The backend no longer holds a private key. All state-changing transactions
 * (listSurplus, buyEnergy, cancelListing) are signed in the user's browser
 * wallet, which is what makes CampusChain genuinely peer-to-peer instead of
 * custodial. This service only reads public chain state for the dashboard.
 */

const ENERGY_TRADE_ABI = [
    "function getActiveListing(uint256 _listingId) external view returns (tuple(uint256 id, address seller, string buildingName, uint256 energyAmount, uint256 pricePerWh, bool isActive))",
    "function listingCount() external view returns (uint256)",
    "function energyToken() external view returns (address)",
    "event SurplusListed(uint256 indexed listingId, address indexed seller, string buildingName, uint256 energyAmount, uint256 pricePerWh)",
    "event TradeExecuted(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 energyAmount, uint256 totalCost)",
];

const ENERGY_TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
];

const RPC_URL = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/";
const TOKEN_ADDRESS = process.env.ENERGY_TOKEN_ADDRESS;
const TRADE_ADDRESS = process.env.ENERGY_TRADE_ADDRESS;

let provider = null;
let energyTrade = null;
let energyToken = null;

if (!TOKEN_ADDRESS || !TRADE_ADDRESS) {
    console.error("Missing ENERGY_TOKEN_ADDRESS or ENERGY_TRADE_ADDRESS in backend/.env");
} else {
    try {
        provider = new ethers.JsonRpcProvider(RPC_URL);
        energyTrade = new ethers.Contract(TRADE_ADDRESS, ENERGY_TRADE_ABI, provider);
        energyToken = new ethers.Contract(TOKEN_ADDRESS, ENERGY_TOKEN_ABI, provider);

        console.log("Contracts connected (read-only)");
        console.log("  EnergyTrade:", TRADE_ADDRESS);
        console.log("  EnergyToken:", TOKEN_ADDRESS);
    } catch (error) {
        console.error("Contract connection failed:", error.message);
    }
}

module.exports = {
    energyTrade,
    energyToken,
    provider,
    TOKEN_ADDRESS,
    TRADE_ADDRESS,
    ENERGY_TRADE_ABI,
    ENERGY_TOKEN_ABI,
};
