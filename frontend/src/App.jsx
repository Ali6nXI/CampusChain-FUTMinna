import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useWallet } from "./components/WalletConnect";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SellEnergy from "./pages/SellEnergy";
import BuyEnergy from "./pages/BuyEnergy";
import TradeHistory from "./pages/TradeHistory";

export default function App() {
  const {
    account,
    connectWallet,
    connecting,
    wrongNetwork,
    switchToAmoy,
    getContracts,
  } = useWallet();

  return (
    <Router>
      <div className="min-h-screen chain-bg text-futm-100">
        <Navbar
          account={account}
          onConnect={connectWallet}
          connecting={connecting}
          wrongNetwork={wrongNetwork}
          onSwitch={switchToAmoy}
        />
        <main className="max-w-7xl mx-auto relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard account={account} />} />
            <Route
              path="/sell"
              element={
                <SellEnergy
                  account={account}
                  wrongNetwork={wrongNetwork}
                  switchToAmoy={switchToAmoy}
                  getContracts={getContracts}
                />
              }
            />
            <Route
              path="/buy"
              element={
                <BuyEnergy
                  account={account}
                  wrongNetwork={wrongNetwork}
                  switchToAmoy={switchToAmoy}
                  getContracts={getContracts}
                />
              }
            />
            <Route path="/history" element={<TradeHistory />} />
          </Routes>
        </main>

        <footer className="relative z-10 mt-16 border-t border-futm-400/10 bg-futm-950/60">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-futm-300/50">
            <span>CampusChain · Department of Information Technology, SICT · FUT Minna</span>
            <span>Academic prototype — test tokens only, isolated from the national grid</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}
