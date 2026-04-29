import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3001";

export default function SellEnergy({ account }) {
    const [form, setForm] = useState({
        buildingName: "",
        energyAmount: "",
        pricePerWh: "",
    });
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!form.buildingName || !form.energyAmount || !form.pricePerWh) {
            alert("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError(null);
        setTxHash(null);
        try {
            const res = await axios.post(`${API}/api/energy/list`, {
                buildingName: form.buildingName,
                energyAmount: parseInt(form.energyAmount),
                pricePerWh: form.pricePerWh,
            });
            setTxHash(res.data.txHash);
            setForm({ buildingName: "", energyAmount: "", pricePerWh: "" });
        } catch (err) {
            setError(err.response?.data?.error || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const buttonLabel = loading ? "Submitting to blockchain..." : "List Energy for Sale";

    return (
        <div className="p-6 text-white max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-2">Sell Surplus Energy</h1>
            <p className="text-gray-400 mb-6">List your building surplus solar energy for sale</p>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Building Name</label>
                    <input
                        name="buildingName"
                        value={form.buildingName}
                        onChange={handleChange}
                        placeholder="e.g. Hostel A, Lab Block"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Energy Amount (Wh)</label>
                    <input
                        name="energyAmount"
                        value={form.energyAmount}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g. 500"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Price per Wh (CET tokens)</label>
                    <input
                        name="pricePerWh"
                        value={form.pricePerWh}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g. 1"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
                >
                    {buttonLabel}
                </button>
                {txHash && (
                    <div className="bg-green-900 border border-green-600 rounded-lg p-3 text-sm">
                        <p className="text-green-400 font-semibold">Listed successfully!</p>

                        href={`https://amoy.polygonscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline break-all"
                        <a>
                            View on Polygonscan: {txHash.slice(0, 20)}...
                        </a>
                    </div>
                )}
                {error && (
                    <div className="bg-red-900 border border-red-600 rounded-lg p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}