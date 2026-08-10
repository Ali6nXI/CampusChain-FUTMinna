import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001";

export default function TradeHistory() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const res = await axios.get(`${API}/api/energy/listings`);
            setTrades(res.data.listings || []);
        } catch (err) {
            console.error("Error fetching trade history:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-6 py-8 relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Trade <span className="text-gold">History</span></h1>
            <p className="text-futm-300/70 mt-1.5 mb-7 text-sm">View all energy trading activity on campus</p>

            {loading ? (
                <p className="text-futm-300/60 text-sm">Loading trade history…</p>
            ) : trades.length === 0 ? (
                <div className="glass rounded-2xl p-14 text-center">
                    <p className="text-gray-400 text-lg">No trades recorded yet.</p>
                    <p className="text-futm-300/45 text-sm mt-1.5">
                        Trades will appear here once energy is listed and purchased.
                    </p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th >Building</th>
                                <th >Energy (Wh)</th>
                                <th >Price (CET/Wh)</th>
                                <th >Seller</th>
                                <th >Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade, index) => (
                                <tr
                                    key={trade.id ?? index}
                                    
                                >
                                    <td className="font-semibold text-white">{trade.buildingName}</td>
                                    <td >{trade.energyAmount}</td>
                                    <td className="text-gold tabular-nums font-semibold">{trade.pricePerWh}</td>
                                    <td className="text-futm-300/60 font-mono text-xs">
                                        {trade.seller
                                            ? `${trade.seller.slice(0, 6)}...${trade.seller.slice(-4)}`
                                            : "—"}
                                    </td>
                                    <td >
                                        {trade.isActive ? (
                                            <span className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-full">
                                                Sold
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
