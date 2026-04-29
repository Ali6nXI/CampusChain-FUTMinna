import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useWallet } from "./components/WalletConnect";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SellEnergy from "./pages/SellEnergy";
import BuyEnergy from "./pages/BuyEnergy";
import TradeHistory from "./pages/TradeHistory";

export default function App() {
  const { account, connectWallet } = useWallet();

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar account={account} onConnect={connectWallet} />
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard account={account} />} />
            <Route path="/sell" element={<SellEnergy account={account} />} />
            <Route path="/buy" element={<BuyEnergy account={account} />} />
            <Route path="/history" element={<TradeHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}