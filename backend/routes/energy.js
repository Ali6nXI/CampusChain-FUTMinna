const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const {
    energyTrade,
    energyToken,
    provider,
    TRADE_ADDRESS,
} = require("../services/contractService");

/**
 * Read-only energy API.
 *
 * Write operations were removed deliberately. Listing and buying are signed by
 * the user's own wallet in the browser, so the backend never holds a key and
 * cannot transact on anyone's behalf.
 */

const ready = (res) => {
    if (!energyTrade || !energyToken) {
        res.status(503).json({ success: false, error: "Contracts not configured. Check backend/.env" });
        return false;
    }
    return true;
};

const isAddress = (a) => {
    try { return ethers.isAddress(a); } catch { return false; }
};

// Simple in-memory cache so a dashboard polling every 10s does not hammer the RPC.
let cache = { at: 0, listings: null };
const TTL = 8000;

/** GET /api/energy/listings — all listings from the contract */
router.get("/listings", async (req, res) => {
    if (!ready(res)) return;
    try {
        if (cache.listings && Date.now() - cache.at < TTL) {
            return res.json({ success: true, listings: cache.listings, cached: true });
        }

        const count = Number(await energyTrade.listingCount());
        const ids = Array.from({ length: count }, (_, i) => i + 1);

        // Fetch in parallel rather than sequentially.
        const raw = await Promise.all(ids.map((i) => energyTrade.getActiveListing(i)));
        const listings = raw.map((l) => ({
            id: l.id.toString(),
            seller: l.seller,
            buildingName: l.buildingName,
            energyAmount: l.energyAmount.toString(),
            pricePerWh: ethers.formatEther(l.pricePerWh),
            isActive: l.isActive,
        }));

        cache = { at: Date.now(), listings };
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/** GET /api/energy/listings/:id — a single listing */
router.get("/listings/:id", async (req, res) => {
    if (!ready(res)) return;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ success: false, error: "Listing id must be a positive integer" });
    }
    try {
        const l = await energyTrade.getActiveListing(id);
        if (l.seller === ethers.ZeroAddress) {
            return res.status(404).json({ success: false, error: "Listing not found" });
        }
        res.json({
            success: true,
            listing: {
                id: l.id.toString(),
                seller: l.seller,
                buildingName: l.buildingName,
                energyAmount: l.energyAmount.toString(),
                pricePerWh: ethers.formatEther(l.pricePerWh),
                isActive: l.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/** GET /api/energy/balance/:address — CET balance for a wallet */
router.get("/balance/:address", async (req, res) => {
    if (!ready(res)) return;
    const address = req.params.address;
    if (!isAddress(address)) {
        return res.status(400).json({ success: false, error: "Invalid Ethereum address" });
    }
    try {
        const balance = await energyToken.balanceOf(address);
        res.json({ success: true, address, balance: ethers.formatEther(balance) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/** GET /api/energy/allowance/:address — how much the trade contract may spend */
router.get("/allowance/:address", async (req, res) => {
    if (!ready(res)) return;
    const address = req.params.address;
    if (!isAddress(address)) {
        return res.status(400).json({ success: false, error: "Invalid Ethereum address" });
    }
    try {
        const allowance = await energyToken.allowance(address, TRADE_ADDRESS);
        res.json({ success: true, address, spender: TRADE_ADDRESS, allowance: ethers.formatEther(allowance) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/** GET /api/energy/trades — completed trades from TradeExecuted events */
router.get("/trades", async (req, res) => {
    if (!ready(res)) return;
    try {
        const current = await provider.getBlockNumber();
        const span = Math.min(Number(req.query.blocks) || 9000, 9000);
        const fromBlock = Math.max(0, current - span);
        const events = await energyTrade.queryFilter("TradeExecuted", fromBlock, current);

        const trades = events.map((e) => ({
            listingId: e.args.listingId.toString(),
            buyer: e.args.buyer,
            seller: e.args.seller,
            energyAmount: e.args.energyAmount.toString(),
            totalCost: ethers.formatEther(e.args.totalCost),
            txHash: e.transactionHash,
            blockNumber: e.blockNumber,
        })).reverse();

        res.json({ success: true, fromBlock, toBlock: current, trades });
    } catch (error) {
        // Many public RPC endpoints restrict eth_getLogs or require an API key
        // for historical queries. Report that clearly instead of a raw dump.
        const msg = /archive|api key|personal token|limit|range/i.test(error.message || "")
            ? "This RPC endpoint restricts historical log queries. Use an Alchemy or Infura URL in AMOY_RPC_URL to enable trade history."
            : error.message;
        res.status(502).json({ success: false, error: msg, trades: [] });
    }
});

/**
 * Write endpoints intentionally removed.
 * Transactions are signed client-side in MetaMask.
 */
const clientSideOnly = (req, res) => {
    res.status(410).json({
        success: false,
        error: "This endpoint was removed. Listing and buying are signed in your wallet from the web app so that trades originate from your own account.",
    });
};
router.post("/list", clientSideOnly);
router.post("/buy/:id", clientSideOnly);
router.post("/cancel/:id", clientSideOnly);

module.exports = router;
