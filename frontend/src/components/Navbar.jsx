import { Link, useLocation } from "react-router-dom";
import { shortAddr } from "../contracts";
import logo from "../assets/campuschain-logo.png";

export default function Navbar({ account, onConnect, connecting, wrongNetwork, onSwitch }) {
    const { pathname } = useLocation();
    const links = [
        { to: "/", label: "Dashboard" },
        { to: "/sell", label: "Sell Energy" },
        { to: "/buy", label: "Buy Energy" },
        { to: "/history", label: "Trade History" },
    ];

    return (
        <header className="sticky top-0 z-50">
            {/* Institutional strip */}
            <div className="bg-futm-950/95 border-b border-futm-400/10 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-[11px] text-futm-300/70">
                    <span>Federal University of Technology, Minna &nbsp;·&nbsp; School of ICT</span>
                    <span className="hidden sm:inline tracking-wide">Technology&nbsp;for&nbsp;Empowerment</span>
                </div>
            </div>

            {/* Main bar */}
            <nav className="bg-futm-900/90 backdrop-blur-md border-b border-futm-400/15">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logo}
                            alt="CampusChain logo"
                            width={44}
                            height={44}
                            className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.45)]
                                       transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="leading-tight">
                            <div className="text-lg font-extrabold tracking-tight text-white">
                                Campus<span className="text-gold">Chain</span>
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.16em] text-futm-300/70">
                                P2P Energy Trading
                            </div>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <div className="flex gap-7 text-sm font-medium order-3 md:order-2 w-full md:w-auto">
                        {links.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`nav-link ${pathname === l.to
                                    ? "text-gold nav-link-active"
                                    : "text-futm-300/80 hover:text-white"}`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet */}
                    <div className="flex items-center gap-2 order-2 md:order-3">
                        {account && wrongNetwork && (
                            <button onClick={onSwitch}
                                className="pill pill-warn hover:brightness-110 transition"
                                title="CampusChain runs on Polygon Amoy testnet">
                                Wrong network — switch
                            </button>
                        )}
                        {account && !wrongNetwork && (
                            <span className="hidden sm:flex pill pill-active">
                                <span className="pulse-dot" /> Amoy
                            </span>
                        )}
                        <button
                            onClick={onConnect}
                            disabled={connecting}
                            className="btn-gold px-4 py-2 rounded-lg text-sm"
                        >
                            {connecting ? "Connecting…" : account ? shortAddr(account) : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
