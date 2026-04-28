const express = require("express");
const router = express.Router();
const { energyTrade, energyToken, provider } = require("../services/contractService");
const { ethers } = require("ethers");

// GET - get all listings
router.get("/listings", async (req, res) => {
    try {
        const count = await energyTrade.listingCount();
        const listings = [];

        for (let i = 1; i <= count; i++) {
            const listing = await energyTrade.getActiveListing(i);
            listings.push({
                id: listing.id.toString(),
                seller: listing.seller,
                buildingName: listing.buildingName,
                energyAmount: listing.energyAmount.toString(),
                pricePerWh: ethers.formatEther(listing.pricePerWh),
                isActive: listing.isActive,
            });
        }

        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - get single listing
router.get("/listings/:id", async (req, res) => {
    try {
        const listing = await energyTrade.getActiveListing(req.params.id);
        res.json({
            success: true,
            listing: {
                id: listing.id.toString(),
                seller: listing.seller,
                buildingName: listing.buildingName,
                energyAmount: listing.energyAmount.toString(),
                pricePerWh: ethers.formatEther(listing.pricePerWh),
                isActive: listing.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - list surplus energy
router.post("/list", async (req, res) => {
    try {
        const { buildingName, energyAmount, pricePerWh } = req.body;
        const tx = await energyTrade.listSurplus(
            buildingName,
            energyAmount,
            ethers.parseEther(pricePerWh.toString())
        );
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - buy energy
router.post("/buy/:id", async (req, res) => {
    try {
        const tx = await energyTrade.buyEnergy(req.params.id);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - cancel listing
router.post("/cancel/:id", async (req, res) => {
    try {
        const tx = await energyTrade.cancelListing(req.params.id);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - token balance
router.get("/balance/:address", async (req, res) => {
    try {
        const balance = await energyToken.balanceOf(req.params.address);
        res.json({
            success: true,
            balance: ethers.formatEther(balance),
            address: req.params.address,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;