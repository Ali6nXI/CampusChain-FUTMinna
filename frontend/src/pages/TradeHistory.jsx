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
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Trade History</h1>
            <p className="text-gray-400 mb-6">View all energy trading activity on campus</p>

            {loading ? (
                <p className="text-gray-400">Loading trade history...</p>
            ) : trades.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                    <p className="text-gray-400 text-lg">No trades recorded yet.</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Trades will appear here once energy is listed and purchased.
                    </p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 text-left">
                                <th className="px-4 py-3">Building</th>
                                <th className="px-4 py-3">Energy (Wh)</th>
                                <th className="px-4 py-3">Price (CET/Wh)</th>
                                <th className="px-4 py-3">Seller</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade, index) => (
                                <tr
                                    key={trade.id ?? index}
                                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition"
                                >
                                    <td className="px-4 py-3 font-semibold">{trade.buildingName}</td>
                                    <td className="px-4 py-3">{trade.energyAmount}</td>
                                    <td className="px-4 py-3 text-yellow-400">{trade.pricePerWh}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {trade.seller
                                            ? `${trade.seller.slice(0, 6)}...${trade.seller.slice(-4)}`
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3">
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
