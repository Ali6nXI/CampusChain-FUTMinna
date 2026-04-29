import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001";

export default function BuyEnergy({ account }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await axios.get(`${API}/api/energy/listings`);
            const active = res.data.listings.filter((l) => l.isActive);
            setListings(active);
        } catch (err) {
            console.error("Error fetching listings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (listingId) => {
        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }
        setBuying(listingId);
        setError(null);
        setTxHash(null);
        try {
            const res = await axios.post(`${API}/api/energy/buy/${listingId}`);
            setTxHash(res.data.txHash);
            fetchListings();
        } catch (err) {
            setError(err.response?.data?.error || "Transaction failed");
        } finally {
            setBuying(null);
        }
    };

    const getButtonLabel = (listing) => {
        if (buying === listing.id) return "Processing...";
        if (listing.seller.toLowerCase() === account?.toLowerCase()) return "Your Listing";
        return "Buy Energy";
    };

    const isDisabled = (listing) => {
        return buying === listing.id || listing.seller.toLowerCase() === account?.toLowerCase();
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Buy Energy</h1>
            <p className="text-gray-400 mb-6">Purchase surplus solar energy from other campus buildings</p>

            {txHash && (
                <div className="bg-green-900 border border-green-600 rounded-lg p-3 text-sm mb-4">
                    <p className="text-green-400 font-semibold">Purchase successful!</p>

                    href={`https://amoy.polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline break-all"
          >
                    View on Polygonscan: {txHash.slice(0, 20)}...
                </a>
        </div>
    )
}

{
    error && (
        <div className="bg-red-900 border border-red-600 rounded-lg p-3 text-sm text-red-400 mb-4">
            {error}
        </div>
    )
}

{
    loading ? (
        <p className="text-gray-400">Loading available listings...</p>
    ) : listings.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No energy listings available right now.</p>
            <p className="text-gray-500 text-sm mt-2">Check back later or ask a building to list surplus energy.</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
                <div key={listing.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{listing.buildingName}</h3>
                        <span className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <p>Energy: <span className="text-white font-semibold">{listing.energyAmount} Wh</span></p>
                        <p>Price: <span className="text-yellow-400 font-semibold">{listing.pricePerWh} CET/Wh</span></p>
                        <p>Seller: <span className="text-gray-400">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</span></p>
                    </div>
                    <button
                        onClick={() => handleBuy(listing.id)}
                        disabled={isDisabled(listing)}
                        className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50 text-sm"
                    >
                        {getButtonLabel(listing)}
                    </button>
                </div>
            ))}
        </div>
    )
}
    </div >
  );
}