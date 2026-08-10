import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MeterCard, { BuildingMeter, Icons } from "../components/MeterCard";
import { shortAddr } from "../contracts";

const API = "http://localhost:3001";

export default function Dashboard({ account }) {
    const [listings, setListings] = useState([]);
    const [balance, setBalance] = useState("0");
    const [meters, setMeters] = useState({});
    const [loading, setLoading] = useState(true);
    const [meterError, setMeterError] = useState(false);

    const fetchListings = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/energy/listings`);
            setListings(res.data.listings || []);
        } catch { /* surfaced by the meter banner */ }
    }, []);

    const fetchMeters = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/meters`);
            setMeters(res.data.readings || {});
            setMeterError(false);
        } catch { setMeterError(true); }
    }, []);

    const fetchBalance = useCallback(async () => {
        if (!account) { setBalance("0"); return; }
        try {
            const res = await axios.get(`${API}/api/energy/balance/${account}`);
            setBalance(res.data.balance || "0");
        } catch { /* ignore */ }
    }, [account]);

    useEffect(() => {
        (async () => {
            await Promise.all([fetchListings(), fetchMeters(), fetchBalance()]);
            setLoading(false);
        })();
        const id = setInterval(() => { fetchMeters(); fetchListings(); fetchBalance(); }, 10000);
        return () => clearInterval(id);
    }, [fetchListings, fetchMeters, fetchBalance]);

    const active = listings.filter((l) => l.isActive);
    const completed = listings.filter((l) => !l.isActive);
    const totalWh = active.reduce((s, l) => s + Number(l.energyAmount || 0), 0);

    return (
        <div className="px-6 py-8 relative z-10">

            {/* Hero */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="pill pill-active"><span className="pulse-dot" /> Polygon Amoy Testnet</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Campus Energy <span className="text-gold">Dashboard</span>
                </h1>
                <p className="text-futm-300/70 mt-1.5 text-sm">
                    Peer-to-peer solar energy trading across the FUT Minna campus microgrid
                </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MeterCard title="Your CET Balance" value={parseFloat(balance).toFixed(2)} unit="CET" icon={Icons.coin} accent="text-gold" />
                <MeterCard title="Active Listings" value={active.length} unit="listings" icon={Icons.bolt} accent="text-emerald-300" />
                <MeterCard title="Completed Trades" value={completed.length} unit="trades" icon={Icons.check} accent="text-futm-300" />
                <MeterCard title="Energy Available" value={totalWh} unit="Wh" icon={Icons.chart} accent="text-white" />
            </section>

            {/* Live telemetry */}
            <section className="glass rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-white">Live IoT Meter Readings</h2>
                        <p className="text-xs text-futm-300/60 mt-0.5">
                            PZEM-004T simulation · MQTT over HiveMQ · refreshed every 10 s
                        </p>
                    </div>
                    <span className="pill pill-active"><span className="pulse-dot" /> Live</span>
                </div>

                {Object.keys(meters).length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-futm-300/70 text-sm">
                            {meterError
                                ? "Cannot reach the backend on port 3001."
                                : "No meter readings yet."}
                        </p>
                        <code className="text-xs text-gold/80 mt-2 inline-block">
                            {meterError ? "node server.js" : "python mqtt_publisher.py"}
                        </code>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.values(meters).map((r) => (
                            <BuildingMeter key={r.building} reading={r} />
                        ))}
                    </div>
                )}
            </section>

            {/* Listings */}
            <section className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-futm-400/12 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Active Energy Listings</h2>
                    <span className="text-xs text-futm-300/60">{active.length} available</span>
                </div>

                {loading ? (
                    <p className="text-futm-300/60 text-sm px-6 py-10 text-center">Loading listings…</p>
                ) : active.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-futm-300/70">No active listings.</p>
                        <p className="text-futm-300/45 text-sm mt-1">
                            Visit <span className="text-gold">Sell Energy</span> to list surplus.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Building</th><th>Energy</th><th>Price / Wh</th>
                                    <th>Total</th><th>Seller</th>
                                </tr>
                            </thead>
                            <tbody>
                                {active.map((l) => (
                                    <tr key={l.id}>
                                        <td className="font-semibold text-white">{l.buildingName}</td>
                                        <td className="tabular-nums">{l.energyAmount} Wh</td>
                                        <td className="tabular-nums text-gold">{l.pricePerWh} CET</td>
                                        <td className="tabular-nums text-gold font-semibold">
                                            {(Number(l.energyAmount) * Number(l.pricePerWh)).toFixed(0)} CET
                                        </td>
                                        <td className="text-futm-300/60 font-mono text-xs">{shortAddr(l.seller)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
