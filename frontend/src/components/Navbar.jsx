import { Link } from "react-router-dom";

export default function Navbar({ account, onConnect }) {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">⚡</span>
                <span className="text-xl font-bold">CampusChain</span>
                <span className="text-gray-400 text-sm ml-1">FUT Minna</span>
            </div>
            <div className="flex gap-6 text-sm font-medium">
                <Link to="/" className="hover:text-yellow-400 transition">Dashboard</Link>
                <Link to="/sell" className="hover:text-yellow-400 transition">Sell Energy</Link>
                <Link to="/buy" className="hover:text-yellow-400 transition">Buy Energy</Link>
                <Link to="/history" className="hover:text-yellow-400 transition">Trade History</Link>
            </div>
            <button
                onClick={onConnect}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition"
            >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
        </nav>
    );
}