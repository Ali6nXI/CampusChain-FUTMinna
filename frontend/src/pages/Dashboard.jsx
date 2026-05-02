import { useEffect, useState } from "react";
import axios from "axios";
import MeterCard from "../components/MeterCard";

const API = "http://localhost:3001";

export default function Dashboard({ account }) {
    const [listings, setListings] = useState([]);
    const [balance, setBalance] = useState("0");
    const [meters, setMeters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Poll meter readings every 10 seconds
        const interval = setInterval(fetchMeters, 10000);
        return () => clearInterval(interval);
    }, [account]);

    const fetchData = async () => {
        try {
            const listingsRes = await axios.get(`${API}/api/energy/listings`);
            setListings(listingsRes.data.listings || []);
            if (account) {
                const balanceRes = await axios.get(`${API}/api/energy/balance/${account}`);
                setBalance(balanceRes.data.balance || "0");
            }
            await fetchMeters();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeters = async () => {
        try {
            const res = await axios.get(`${API}/api/meters`);
            console.log("📡 Meters raw response:", res.data);
            console.log("📡 Readings object:", res.data.readings);
            console.log("📡 Keys:", Object.keys(res.data.readings || {}));
            setMeters(res.data.readings || {});
        } catch (error) {
            console.error("❌ Error fetching meters:", error);
        }
    };

    const activeListings = listings.filter((l) => l.isActive);
    const completedTrades = listings.filter((l) => !l.isActive);

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-6">CampusChain P2P Energy Trading — FUT Minna</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <MeterCard title="Your CET Balance" value={parseFloat(balance).toFixed(2)} unit="CET" icon="🪙" color="text-yellow-400" />
                <MeterCard title="Active Listings" value={activeListings.length} unit="listings" icon="⚡" color="text-green-400" />
                <MeterCard title="Completed Trades" value={completedTrades.length} unit="trades" icon="✅" color="text-blue-400" />
                <MeterCard title="Total Listings" value={listings.length} unit="total" icon="📊" color="text-purple-400" />
            </div>

            {/* Live IoT Meter Readings */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    Live IoT Meter Readings
                    <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-1 rounded-full">Live</span>
                </h2>
                {Object.keys(meters).length === 0 ? (
                    <p className="text-gray-400">No meter readings yet. Start the IoT simulator to see live data.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.values(meters).map((reading) => (
                            <div key={reading.building} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <h3 className="font-semibold text-yellow-400 mb-3">{reading.building}</h3>
                                <div className="space-y-1 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-400">Voltage</span><span>{reading.voltage} V</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Current</span><span>{reading.current} A</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Power</span><span className="text-green-400">{reading.power} W</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Energy</span><span>{reading.energy_kwh} kWh</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Surplus</span><span className="text-yellow-400">{reading.surplus} Wh</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Listings Table */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Active Energy Listings</h2>
                {loading ? (
                    <p className="text-gray-400">Loading listings...</p>
                ) : activeListings.length === 0 ? (
                    <p className="text-gray-400">No active listings yet. Be the first to sell surplus energy!</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="text-left pb-3">Building</th>
                                <th className="text-left pb-3">Energy (Wh)</th>
                                <th className="text-left pb-3">Price/Wh (CET)</th>
                                <th className="text-left pb-3">Seller</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeListings.map((listing) => (
                                <tr key={listing.id} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="py-3">{listing.buildingName}</td>
                                    <td className="py-3">{listing.energyAmount}</td>
                                    <td className="py-3">{listing.pricePerWh}</td>
                                    <td className="py-3 text-gray-400">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}