const { expect } = require("chai");
const hre = require("hardhat");

describe("CampusChain Energy Trading", function () {
  let energyToken, energyTrade;
  let owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await hre.ethers.getSigners();

    // Deploy EnergyToken
    const EnergyToken = await hre.ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy();
    await energyToken.waitForDeployment();

    // Deploy EnergyTrade
    const EnergyTrade = await hre.ethers.getContractFactory("EnergyTrade");
    energyTrade = await EnergyTrade.deploy(await energyToken.getAddress());
    await energyTrade.waitForDeployment();

    // Send tokens to seller and buyer for testing
    await energyToken.mintTo(seller.address, hre.ethers.parseEther("1000"));
    await energyToken.mintTo(buyer.address, hre.ethers.parseEther("1000"));
  });

  it("Should deploy both contracts successfully", async function () {
    expect(await energyToken.getAddress()).to.be.properAddress;
    expect(await energyTrade.getAddress()).to.be.properAddress;
  });

  it("Should mint tokens to owner on deploy", async function () {
    const balance = await energyToken.balanceOf(owner.address);
    expect(balance).to.equal(hre.ethers.parseEther("1000000"));
  });

  it("Should allow seller to list surplus energy", async function () {
    await energyTrade.connect(seller).listSurplus("Hostel A", 500, hre.ethers.parseEther("1"));
    const listing = await energyTrade.getActiveListing(1);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.buildingName).to.equal("Hostel A");
    expect(listing.energyAmount).to.equal(500);
    expect(listing.isActive).to.equal(true);
  });

  it("Should allow buyer to purchase energy", async function () {
    const pricePerWh = hre.ethers.parseEther("1");
    await energyTrade.connect(seller).listSurplus("Lab Block", 100, pricePerWh);

    // Buyer approves the trade contract to spend tokens
    const totalCost = BigInt(100) * pricePerWh;
    await energyToken.connect(buyer).approve(await energyTrade.getAddress(), totalCost);

    // Buyer purchases the energy
    await energyTrade.connect(buyer).buyEnergy(1);

    const listing = await energyTrade.getActiveListing(1);
    expect(listing.isActive).to.equal(false);
  });

  it("Should emit TradeExecuted event on purchase", async function () {
    const pricePerWh = hre.ethers.parseEther("1");
    await energyTrade.connect(seller).listSurplus("Lecture Hall C", 200, pricePerWh);

    const totalCost = BigInt(200) * pricePerWh;
    await energyToken.connect(buyer).approve(await energyTrade.getAddress(), totalCost);

    await expect(energyTrade.connect(buyer).buyEnergy(1))
      .to.emit(energyTrade, "TradeExecuted")
      .withArgs(1, buyer.address, seller.address, 200, totalCost);
  });

  it("Should not allow seller to buy their own listing", async function () {
    await energyTrade.connect(seller).listSurplus("Hostel B", 300, hre.ethers.parseEther("1"));
    await expect(energyTrade.connect(seller).buyEnergy(1))
      .to.be.revertedWith("Seller cannot buy own listing");
  });

  it("Should allow seller to cancel their listing", async function () {
    await energyTrade.connect(seller).listSurplus("Admin Block", 400, hre.ethers.parseEther("1"));
    await energyTrade.connect(seller).cancelListing(1);
    const listing = await energyTrade.getActiveListing(1);
    expect(listing.isActive).to.equal(false);
  });
});