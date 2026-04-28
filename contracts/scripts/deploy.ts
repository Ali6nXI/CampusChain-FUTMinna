import hre from "hardhat";

async function main() {
    const { ethers } = hre;

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Deploy EnergyToken first
    console.log("\n--- Deploying EnergyToken ---");
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    const energyToken = await EnergyToken.deploy();
    await energyToken.waitForDeployment();
    const tokenAddress = await energyToken.getAddress();
    console.log("EnergyToken deployed to:", tokenAddress);

    // Deploy EnergyTrade using the token address
    console.log("\n--- Deploying EnergyTrade ---");
    const EnergyTrade = await ethers.getContractFactory("EnergyTrade");
    const energyTrade = await EnergyTrade.deploy(tokenAddress);
    await energyTrade.waitForDeployment();
    const tradeAddress = await energyTrade.getAddress();
    console.log("EnergyTrade deployed to:", tradeAddress);

    console.log("\n--- Deployment Complete ---");
    console.log("EnergyToken:", tokenAddress);
    console.log("EnergyTrade:", tradeAddress);
    console.log("SAVE THESE ADDRESSES - you will need them later!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});