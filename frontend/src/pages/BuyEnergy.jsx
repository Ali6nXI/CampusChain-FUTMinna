import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { txUrl, shortAddr, ENERGY_TRADE_ADDRESS } from "../contracts";

const API = "http://localhost:3001";

export default function BuyEnergy({ account, wrongNetwork, switchToAmoy, getContracts }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [stage, setStage] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);

    const fetchListings = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/energy/listings`);
            setListings((res.data.listings || []).filter((l) => l.isActive));
        } catch {
            setError("Could not load listings. Is the backend running on port 3001?");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    const handleBuy = async (listing) => {
        setError(null); setTxHash(null);
        if (!account) return setError("Connect your wallet first.");
        if (wrongNetwork) return setError("Switch to Polygon Amoy before buying.");
        const contracts = getContracts();
        if (!contracts) return setError("Wallet not ready. Reconnect and try again.");

        setBusyId(listing.id);
        try {
            const pricePerWhWei = ethers.parseEther(String(listing.pricePerWh));
            const totalCost = BigInt(listing.energyAmount) * pricePerWhWei;

            const balance = await contracts.token.balanceOf(account);
            if (balance < totalCost) {
                setBusyId(null);
                return setError(
                    `Insufficient CET. Needs ${ethers.formatEther(totalCost)} CET; you hold ${ethers.formatEther(balance)} CET.`
                );
            }

            const allowance = await contracts.token.allowance(account, ENERGY_TRADE_ADDRESS);
            if (allowance < totalCost) {
                setStage("approving");
                const approveTx = await contracts.token.approve(ENERGY_TRADE_ADDRESS, totalCost);
                await approveTx.wait();
            }

            setStage("buying");
            const tx = await contracts.trade.buyEnergy(listing.id);
            setTxHash(tx.hash);
            await tx.wait();

            setStage(null); setBusyId(null);
            await fetchListings();
        } catch (err) {
            setStage(null); setBusyId(null);
            setError(err?.code === "ACTION_REJECTED" || err?.code === 4001
                ? "Transaction rejected in MetaMask."
                : err?.shortMessage || err?.reason || err?.message || "Transaction failed.");
        }
    };

    const isOwn = (l) => account && l.seller.toLowerCase() === account.toLowerCase();
    const labelFor = (l) => {
        if (busyId === l.id) return stage === "approving" ? "Approving CET…" : "Purchasing…";
        if (isOwn(l)) return "Your Listing";
        return "Buy Energy";
    };

    return (
        <div className="px-6 py-8 relative z-10">
            <div className="mb-7">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Buy <span className="text-gold">Energy</span>
                </h1>
                <p className="text-futm-300/70 mt-1.5 text-sm">
                    Purchase surplus solar generation from other campus buildings
                </p>
            </div>

            {wrongNetwork && (
                <div className="glass rounded-xl p-4 mb-5 flex items-center justify-between gap-3 border-gold/30">
                    <span className="text-gold-light text-sm">You are not connected to Polygon Amoy.</span>
                    <button onClick={switchToAmoy} className="btn-gold px-3 py-1.5 rounded-lg text-xs">Switch network</button>
                </div>
            )}

            {txHash && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4 mb-5">
                    <p className="text-emerald-300 font-semibold text-sm mb-1">Purchase submitted</p>
                    <a href={txUrl(txHash)} target="_blank" rel="noreferrer"
                        className="text-futm-300 hover:text-gold text-xs underline break-all transition">
                        View on Polygonscan ↗
                    </a>
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4 mb-5 text-sm text-red-300">{error}</div>
            )}

            {loading ? (
                <p className="text-futm-300/60 text-sm">Loading available listings…</p>
            ) : listings.length === 0 ? (
                <div className="glass rounded-2xl p-14 text-center">
                    <p className="text-futm-300/75">No energy listings available right now.</p>
                    <p className="text-futm-300/45 text-sm mt-1.5">
                        Check back later, or list surplus from the <span className="text-gold">Sell Energy</span> page.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {listings.map((l) => {
                        const total = Number(l.energyAmount) * Number(l.pricePerWh);
                        return (
                            <div key={l.id} className="glass glass-hover rounded-2xl p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-white">{l.buildingName}</h3>
                                        <p className="text-[10px] uppercase tracking-wider text-futm-300/50 mt-0.5">
                                            Listing #{l.id}
                                        </p>
                                    </div>
                                    <span className="pill pill-active"><span className="pulse-dot" /> Active</span>
                                </div>

                                <div className="rounded-xl bg-futm-950/45 border border-futm-400/12 p-4 mb-4">
                                    <div className="flex items-baseline gap-1.5 mb-3">
                                        <span className="text-2xl font-extrabold text-white tabular-nums">{l.energyAmount}</span>
                                        <span className="text-xs text-futm-300/60">Wh available</span>
                                    </div>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-futm-300/60">Unit price</span>
                                            <span className="tabular-nums text-futm-100">{l.pricePerWh} CET/Wh</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-futm-300/60">Total cost</span>
                                            <span className="tabular-nums text-gold font-bold">{total} CET</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-futm-300/60">Seller</span>
                                            <span className="font-mono text-futm-300/80">{shortAddr(l.seller)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => handleBuy(l)}
                                    disabled={busyId !== null || isOwn(l) || !account || wrongNetwork}
                                    className={`w-full py-2.5 rounded-xl text-sm mt-auto ${isOwn(l) ? "btn-purple" : "btn-gold"}`}>
                                    {labelFor(l)}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="text-xs text-futm-300/40 mt-7 text-center leading-relaxed">
                Purchasing requires two wallet signatures: an ERC-20 approval, then the trade itself.
                You cannot buy your own listing.
            </p>
        </div>
    );
}
