import { useState } from "react";
import { ethers } from "ethers";
import { txUrl } from "../contracts";

export default function SellEnergy({ account, wrongNetwork, switchToAmoy, getContracts }) {
    const [form, setForm] = useState({ buildingName: "", energyAmount: "", pricePerWh: "" });
    const [status, setStatus] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        if (!form.buildingName.trim()) return "Enter a building name.";
        const amt = Number(form.energyAmount), price = Number(form.pricePerWh);
        if (!Number.isFinite(amt) || amt <= 0) return "Energy amount must be greater than zero.";
        if (!Number.isInteger(amt)) return "Energy amount must be a whole number of Wh.";
        if (!Number.isFinite(price) || price <= 0) return "Price must be greater than zero.";
        return null;
    };

    const handleSubmit = async () => {
        setError(null); setTxHash(null);
        if (!account) return setError("Connect your wallet first.");
        if (wrongNetwork) return setError("Switch to Polygon Amoy before listing.");
        const invalid = validate();
        if (invalid) return setError(invalid);
        const contracts = getContracts();
        if (!contracts) return setError("Wallet not ready. Reconnect and try again.");

        try {
            setStatus("signing");
            const tx = await contracts.trade.listSurplus(
                form.buildingName.trim(),
                BigInt(form.energyAmount),
                ethers.parseEther(String(form.pricePerWh))
            );
            setStatus("pending"); setTxHash(tx.hash);
            await tx.wait();
            setStatus(null);
            setForm({ buildingName: "", energyAmount: "", pricePerWh: "" });
        } catch (err) {
            setStatus(null);
            setError(err?.code === "ACTION_REJECTED" || err?.code === 4001
                ? "Transaction rejected in MetaMask."
                : err?.shortMessage || err?.reason || err?.message || "Transaction failed.");
        }
    };

    const busy = status !== null;
    const label = status === "signing" ? "Confirm in MetaMask…"
        : status === "pending" ? "Waiting for confirmation…"
        : "List Energy for Sale";
    const total = Number(form.energyAmount) > 0 && Number(form.pricePerWh) > 0
        ? Number(form.energyAmount) * Number(form.pricePerWh) : null;

    return (
        <div className="px-6 py-8 max-w-2xl mx-auto relative z-10">
            <div className="mb-7">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Sell <span className="text-gold">Surplus Energy</span>
                </h1>
                <p className="text-futm-300/70 mt-1.5 text-sm">
                    List your building's surplus solar generation on the campus market
                </p>
            </div>

            {wrongNetwork && (
                <div className="glass rounded-xl p-4 mb-5 flex items-center justify-between gap-3 border-gold/30">
                    <span className="text-gold-light text-sm">You are not connected to Polygon Amoy.</span>
                    <button onClick={switchToAmoy} className="btn-gold px-3 py-1.5 rounded-lg text-xs">
                        Switch network
                    </button>
                </div>
            )}

            <div className="glass rounded-2xl p-7 space-y-5">
                <div>
                    <label className="text-xs uppercase tracking-wider text-futm-300/70 mb-2 block">Building Name</label>
                    <input name="buildingName" value={form.buildingName} onChange={handleChange}
                        placeholder="e.g. Hostel A, Lab Block" disabled={busy} className="field" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-futm-300/70 mb-2 block">Energy (Wh)</label>
                        <input name="energyAmount" value={form.energyAmount} onChange={handleChange}
                            type="number" min="1" step="1" placeholder="500" disabled={busy} className="field" />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wider text-futm-300/70 mb-2 block">Price / Wh (CET)</label>
                        <input name="pricePerWh" value={form.pricePerWh} onChange={handleChange}
                            type="number" min="0" step="any" placeholder="1" disabled={busy} className="field" />
                    </div>
                </div>

                {total !== null && (
                    <div className="rounded-xl bg-futm-950/50 border border-futm-400/15 px-4 py-3 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-futm-300/70">Buyer pays</span>
                        <span className="text-xl font-extrabold text-gold tabular-nums">{total} CET</span>
                    </div>
                )}

                <button onClick={handleSubmit} disabled={busy || !account || wrongNetwork}
                    className="btn-gold w-full py-3.5 rounded-xl">
                    {label}
                </button>

                {!account && (
                    <p className="text-xs text-futm-300/50 text-center">Connect your wallet to list energy.</p>
                )}

                {txHash && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4">
                        <p className="text-emerald-300 font-semibold text-sm mb-1">
                            {status === "pending" ? "Transaction submitted" : "Listed successfully"}
                        </p>
                        <a href={txUrl(txHash)} target="_blank" rel="noreferrer"
                            className="text-futm-300 hover:text-gold text-xs underline break-all transition">
                            View on Polygonscan ↗
                        </a>
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}
            </div>

            <p className="text-xs text-futm-300/40 mt-5 text-center leading-relaxed">
                Listings are signed in your own wallet and recorded on-chain under your address.
                No energy is escrowed; a listing is an offer to transfer a metered surplus.
            </p>
        </div>
    );
}
