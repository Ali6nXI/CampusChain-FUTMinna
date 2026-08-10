// Central contract configuration for CampusChain.
// Addresses come from Vite env vars so they can change without editing code.
// Create frontend/.env with:
//   VITE_ENERGY_TOKEN_ADDRESS=0x...
//   VITE_ENERGY_TRADE_ADDRESS=0x...

export const ENERGY_TOKEN_ADDRESS =
    import.meta.env.VITE_ENERGY_TOKEN_ADDRESS ||
    "0x7223Fb307bD4C48335329CF68098521a59D579Ac";

export const ENERGY_TRADE_ADDRESS =
    import.meta.env.VITE_ENERGY_TRADE_ADDRESS ||
    "0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0";

// Polygon Amoy testnet
export const CHAIN_ID = 80002;
export const CHAIN_ID_HEX = "0x13882";

export const AMOY_PARAMS = {
    chainId: CHAIN_ID_HEX,
    chainName: "Polygon Amoy Testnet",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
};

export const EXPLORER = "https://amoy.polygonscan.com";

export const ENERGY_TRADE_ABI = [
    "function listSurplus(string _buildingName, uint256 _energyAmount, uint256 _pricePerWh) external",
    "function buyEnergy(uint256 _listingId) external",
    "function cancelListing(uint256 _listingId) external",
    "function getActiveListing(uint256 _listingId) external view returns (tuple(uint256 id, address seller, string buildingName, uint256 energyAmount, uint256 pricePerWh, bool isActive))",
    "function listingCount() external view returns (uint256)",
    "function energyToken() external view returns (address)",
    "event SurplusListed(uint256 indexed listingId, address indexed seller, string buildingName, uint256 energyAmount, uint256 pricePerWh)",
    "event TradeExecuted(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 energyAmount, uint256 totalCost)",
    "event ListingCancelled(uint256 indexed listingId, address indexed seller)",
];

export const ENERGY_TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
];

export const txUrl = (hash) => `${EXPLORER}/tx/${hash}`;
export const shortAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");
