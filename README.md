# ⚡ CampusChain – FUT Minna

> **A Blockchain + IoT Peer-to-Peer Energy Trading Prototype for the FUT Minna Campus Microgrid**

![Status](https://img.shields.io/badge/Status-Working%20Prototype%20(Testnet)-brightgreen)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon%20Amoy%20Testnet-8247E5?logo=ethereum)
![Contracts](https://img.shields.io/badge/Contracts-Deployed%20%26%20Verified%20Live-success)
![Tests](https://img.shields.io/badge/Hardhat%20Tests-7%2F7%20Passing-brightgreen)
![IoT](https://img.shields.io/badge/IoT-Simulated%20(PZEM--004T)-orange?logo=raspberrypi)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20+%20Vite%20+%20Tailwind-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-Academic%20Use%20Only-blue)

---

## 👤 Project Details

| Field | Detail |
|---|---|
| **Student** | Joseph Ochoche Ogangbo |
| **Matriculation Number** | 2021/1/84514CF |
| **Programme** | B.Tech, Information Technology (IFT) |
| **School** | School of Information and Communication Technology (SICT) |
| **Institution** | Federal University of Technology, Minna, Niger State, Nigeria |
| **Supervisor** | Prof. Ojerinde |
| **Project Type** | Final Year Undergraduate Project (B.Tech) |
| **Network** | Polygon Amoy Testnet (Chain ID `80002`) — test tokens only |

---

## 📌 What is CampusChain?

CampusChain is a **blockchain-enabled, IoT-integrated peer-to-peer (P2P) energy trading prototype**. It allows campus buildings — hostels, laboratories, lecture halls and administrative blocks — to list and trade **surplus solar energy** with one another through smart contracts deployed on a public blockchain testnet.

The core research claim is that a distributed ledger can deliver **fair, transparent and fraud-resistant** internal energy allocation, so that surplus generation from the REA/AfDB-funded solar-hybrid plant is redistributed on campus instead of being wasted while diesel generators continue to burn fuel.

> ⚠️ **Academic prototype.** All trades use valueless **test tokens** on a public testnet. The system is fully isolated from the national grid (NEPA/PHCN/TCN), performs no real billing, and is **not intended for production deployment**.

---

## 🔍 Problem Statement

FUT Minna operates a solar-hybrid plant funded under the REA/AfDB rural electrification programme. Despite this investment, four problems persist:

| # | Problem | Impact |
|---|---|---|
| 1 | ⚡ Surplus solar generation is unused | Installed capacity is under-utilised; energy is curtailed or wasted |
| 2 | 🛢️ Continued diesel generator reliance | Recurring fuel and maintenance expenditure |
| 3 | 📊 Metering fraud and disputed readings | Loss of institutional trust and accountability |
| 4 | 🔒 No transparent allocation mechanism | No auditable way to reallocate surplus between buildings |

CampusChain addresses these by placing every listing and every trade on a **tamper-evident, publicly auditable ledger**, with meter data supplied by an independent IoT telemetry layer.

---

## ✅ Verified System Status

| Layer | Status | How it was verified |
| --- | --- | --- |
| **Smart contracts** | ✅ Deployed & live on-chain | eth_getCode returns bytecode at both addresses; name() → CampusEnergyToken, symbol() → CET, totalSupply() → 1,000,000 CET |
| **Contract linkage** | ✅ Correct | EnergyTrade.energyToken() resolves to the deployed EnergyToken address |
| **On-chain state** | ✅ Listings recorded | listingCount() readable; listings accessible via listings(uint256) |
| **Client-side signing** | ✅ Working | Listings and purchases signed from browser via MetaMask (non-custodial) |
| **ERC-20 approval flow** | ✅ Implemented | BuyEnergy checks allowance() and calls approve() before buyEnergy() |
| **Backend key custody** | ✅ Eliminated | Backend is fully read-only; no PRIVATE_KEY required |
| **Hardhat test suite** | ✅ Passing | npx hardhat test — all tests green |
| **Solidity compilation** | ✅ Clean | Contracts compile successfully (solc 0.8.28) |
| **IoT → MQTT pipeline** | ✅ Working | Python simulator publishes to HiveMQ; backend receives and validates payloads |
| **Frontend production build** | ✅ Succeeds | npm run build completes cleanly |
| **Physical signalling demo** | 🟡 Limited demonstration | Two ESP32 nodes (prosumer + consumer) used to show blockchain settlement → physical load response. Signalling path verified end-to-end. |
| **Physical energy metering** | ❌ Not verified | Solar generation measured ~0 mW during tests; no claim made on measurement accuracy or real irradiance behaviour |
| **Oracle binding** | ❌ Not implemented | No cryptographic link yet between meter readings and on-chain listings |
---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Blockchain** | Polygon Amoy Testnet (Chain ID 80002), Solidity `0.8.28`, Hardhat `2.28` |
| **Contracts** | OpenZeppelin ERC-20, `Ownable`, `ReentrancyGuard` |
| **IoT (simulated)** | Python 3, `paho-mqtt` 2.1.0, HiveMQ public broker |
| **Backend** | Node.js 22, Express 5, ethers.js 6, MQTT.js 5 |
| **Frontend** | React 19, Vite 8, Tailwind CSS 3.4, React Router 7, ethers.js 6, axios |
| **Wallet** | MetaMask — signs all listing and purchase transactions |

> **Node.js 22.13.0 or later is mandatory.** Hardhat 2.28 hard-refuses to start on Node 20 with `ERROR: You are using Node.js 20.x which is not supported by Hardhat`.

---

## 📋 Deployed Contracts — Polygon Amoy Testnet

| Contract | Address | Explorer |
|---|---|---|
| **EnergyToken (CET)** | `0x7223Fb307bD4C48335329CF68098521a59D579Ac` | [View](https://amoy.polygonscan.com/address/0x7223Fb307bD4C48335329CF68098521a59D579Ac) |
| **EnergyTrade** | `0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0` | [View](https://amoy.polygonscan.com/address/0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0) |

**Live on-chain state:**
```
EnergyToken.name()          → "CampusEnergyToken"
EnergyToken.symbol()        → "CET"
EnergyToken.totalSupply()   → 1,000,000 CET
EnergyToken.owner()         → 0x258354e5c77b820e0a214daaed05f04126310be3
EnergyTrade.energyToken()   → 0x7223Fb307bD4C48335329CF68098521a59D579Ac  ✅ linked
EnergyTrade.listingCount()  → 6
```

---

## 🗺️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│   IoT LAYER  (simulated + limited physical demo)       │
│  meter_simulator.py  → synthetic PZEM-004T readings     │
│  mqtt_publisher.py   → publishes every 10 s, QoS 1      │
│  Buildings: Hostel A · Lab Block · Lecture Hall C ·     │
│             Admin Block                                 │
└───────────────────────┬─────────────────────────────────┘
                        │ MQTT  broker.hivemq.com:1883
                        │ topic campuschain/futminna/{building}
                        ▼
┌─────────────────────────────────────────────────────────┐
│  BACKEND LAYER   Node.js + Express (port 3001)          │
│  READ-ONLY — holds no private key                       │
│  mqttService.js      → subscribes, validates, caches    │
│  contractService.js  → read-only ethers.js bindings     │
│  routes/energy.js    → GET listings · balance ·         │
│                        allowance · trades               │
└───────────────────────┬─────────────────────────────────┘
                        │ JSON-RPC (read only)
                        ▼
┌─────────────────────────────────────────────────────────┐
│  BLOCKCHAIN LAYER   Polygon Amoy Testnet (chain 80002)  │
│  EnergyToken.sol  — ERC-20 "CET", 18 decimals           │
│  EnergyTrade.sol  — listings, purchases, cancellations  │
│  Events: SurplusListed · TradeExecuted · ListingCancelled│
└──────────▲────────────────────────────┬─────────────────┘
           │                            │
           │ WRITE: signed transactions │ READ: listings,
           │ (listSurplus, approve,     │ balances, events
           │  buyEnergy)                ▼
┌──────────┴──────────────────────────────────────────────┐
│  PRESENTATION LAYER   React 19 + Vite + Tailwind        │
│  Dashboard · Sell Energy · Buy Energy · Trade History   │
│  contracts.js    → addresses, ABIs, chain config        │
│  WalletConnect   → MetaMask signer, network guard       │
│                                                          │
│  Transactions are signed HERE, in the user's wallet,     │
│  and submitted directly to the chain.                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Trade Lifecycle (Non-Custodial)

Every state-changing transaction is signed in the participant's own wallet — **the backend cannot transact on any user's behalf**.

**Selling**
```
1. Seller connects MetaMask; app verifies chain ID 80002 (Amoy)
2. Seller submits the Sell form
3. Browser calls listSurplus() directly on EnergyTrade
4. Seller signs in MetaMask  ── one prompt
5. SurplusListed event emitted; listing recorded under the seller's own address
```

**Buying**
```
1. Buyer connects MetaMask on a different account
2. Buyer selects a listing (own listings are disabled)
3. App computes totalCost = energyAmount x pricePerWh
4. App checks balanceOf(); insufficient CET is reported before any prompt
5. App checks allowance(); if short, calls approve()
      └─ Buyer signs in MetaMask  ── prompt 1 of 2
6. App calls buyEnergy()
      └─ Buyer signs in MetaMask  ── prompt 2 of 2
7. Contract transfers CET buyer → seller and sets isActive = false
8. TradeExecuted event provides the immutable audit record
```

---

## 🧪 Test Suite

```powershell
cd contracts
npx hardhat test
```
```
  CampusChain Energy Trading
    ✔ Should deploy both contracts successfully
    ✔ Should mint tokens to owner on deploy
    ✔ Should allow seller to list surplus energy
    ✔ Should allow buyer to purchase energy
    ✔ Should emit TradeExecuted event on purchase
    ✔ Should not allow seller to buy their own listing
    ✔ Should allow seller to cancel their listing

  7 passing (769ms)
```

---

## 🔧 Resolved Defects

| # | Defect | Resolution |
|---|---|---|
| 1 | **Custodial signing.** Backend signed every tx with one server-held key; all listings shared one seller address | `useWallet()` returns contracts bound to the user's MetaMask signer. `SellEnergy`/`BuyEnergy` call contracts from browser |
| 2 | **Missing ERC-20 approval.** `buyEnergy()` performs `transferFrom`, which reverts without a prior allowance | `BuyEnergy.jsx` reads `allowance()` and issues `approve()` before `buyEnergy()` |
| 3 | **Private key in backend.** Live key sat in `backend/.env` signing for all users | Backend refactored to read-only. Write endpoints return HTTP 410 |
| 4 | **Trade History showed listings, not trades.** Page re-rendered listings table | Reads `TradeExecuted` events via `queryFilter` |
| 5 | **No network validation.** User on Ethereum Mainnet got cryptic failures | Chain ID 80002 detected; orange banner with one-click switch |
| 6 | **Unvalidated MQTT input.** Malformed payloads corrupted reading cache | Payload schema validated before storage |
| 7 | **No API input validation.** Invalid addresses gave 500 errors | Address format checked; proper 400/404 responses |
| 8 | **Serial RPC calls.** `getActiveListing` called in a loop, one round-trip per listing | Parallel `Promise.all` fetch with 8-second cache |
| 9 | **Debug output in production.** `console.log` shipped in `Dashboard.jsx` | Removed; replaced with connection-error state |
| 10 | **Hardcoded addresses in four files.** | Centralised in `frontend/src/contracts.js` |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js ≥ 22.13.0** — Hardhat 2.28 refuses to start on Node 20
- Python ≥ 3.10
- Git
- MetaMask browser extension
- Amoy test MATIC from the [Polygon faucet](https://faucet.polygon.technology/)

### 1. Clone
```bash
git clone https://github.com/Ali6nXI/CampusChain-FUTMinna.git
cd CampusChain-FUTMinna
```

### 2. Smart contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test                                    # 7 passing
```

### 3. Backend
```bash
cd ../backend
npm install
```

Create `backend/.env` (**never commit this file**):
```env
PORT=3001
AMOY_RPC_URL=https://polygon-amoy-bor-rpc.publicnode.com
ENERGY_TOKEN_ADDRESS=0x7223Fb307bD4C48335329CF68098521a59D579Ac
ENERGY_TRADE_ADDRESS=0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0
```

> **No `PRIVATE_KEY` is required.** The backend is read-only. If you still have a `PRIVATE_KEY` line from an earlier version, delete it.

```bash
node server.js        # -> http://localhost:3001
```

### 4. Frontend
```bash
cd ../frontend
npm install
npm run dev           # -> http://localhost:5173
```

### 5. IoT simulator
```bash
cd ../iot
pip install -r requirements.txt
python mqtt_publisher.py
```

---

## 🔌 REST API Reference

Base URL: `http://localhost:3001`

The API is **read-only**. The backend holds no private key and cannot transact on any user's behalf.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Health check; reports MQTT status and contract addresses |
| `GET` | `/api/meters` | Latest cached IoT reading for every building |
| `GET` | `/api/energy/listings` | All listings from the contract (parallel fetch, 8 s cache) |
| `GET` | `/api/energy/listings/:id` | A single listing; 404 if not found |
| `GET` | `/api/energy/balance/:address` | CET balance for a wallet; 400 on malformed address |
| `GET` | `/api/energy/allowance/:address` | How much CET the trade contract may currently spend |
| `GET` | `/api/energy/trades` | Completed trades from `TradeExecuted` events |

> **Removed endpoints:** `POST /api/energy/list`, `/buy/:id` and `/cancel/:id` now return **HTTP 410 Gone**. Listing and buying are signed by the user's own wallet.

---

## 📂 Repository Structure

```
CampusChain-FUTMinna/
├── contracts/
│   ├── contracts/
│   │   ├── EnergyToken.sol          # ERC-20 CET token
│   │   └── EnergyTrade.sol          # P2P listing + purchase logic
│   ├── scripts/
│   │   └── deploy.ts                # deploys token, then trade contract
│   ├── test/
│   │   └── EnergyTrade.test.cjs     # 7 Hardhat tests — all passing
│   └── hardhat.config.cjs
├── backend/
│   ├── server.js                    # Express entry point, port 3001
│   ├── routes/energy.js             # READ-ONLY: listings · balance · trades
│   ├── services/
│   │   ├── contractService.js       # read-only ethers.js bindings (no key)
│   │   └── mqttService.js           # MQTT subscriber, validation, cache
│   └── .env.example                 # template — copy to .env
├── frontend/
│   └── src/
│       ├── App.jsx                  # React Router + wallet wiring
│       ├── contracts.js             # addresses, ABIs, Amoy chain config
│       ├── components/
│       │   ├── Navbar.jsx           # nav + network warning
│       │   ├── WalletConnect.jsx    # useWallet() — signer + getContracts()
│       │   └── MeterCard.jsx
│       └── pages/
│           ├── Dashboard.jsx        # balance · counts · live meters · listings
│           ├── SellEnergy.jsx
│           ├── BuyEnergy.jsx
│           └── TradeHistory.jsx
├── iot/
│   ├── meter_simulator.py           # synthetic PZEM-004T readings
│   ├── mqtt_publisher.py            # HiveMQ publisher, 10 s interval
│   └── requirements.txt
└── README.md
```

---

## ⚠️ Limitations

CampusChain is an academic prototype. The following limitations apply:

1. **Limited physical hardware**  
   Two ESP32 demonstration nodes were built to show that a blockchain settlement can trigger a physical load response. Full smart-meter deployment across campus buildings was not performed.

2. **No verified energy metering**  
   Solar generation was not successfully measured during testing (panel output remained near zero). The system therefore trades digital entitlements rather than verified physical energy.

3. **No physical power transfer**  
   Energy is not switched or transferred between buildings. The consumer node’s load is powered by its own independent supply.

4. **No oracle binding**  
   There is currently no cryptographic link between IoT/meter readings and the quantities listed on-chain.

5. **Testnet only**  
   All transactions use valueless test tokens on Polygon Amoy. No real money or mainnet deployment is involved.

6. **Simulation-based IoT data**  
   The primary energy data used by the platform comes from a Python simulator rather than live campus meters.

These limitations are intentional for a B.Tech research prototype and are documented so that the system’s actual scope is clear.

---

## 👤 Author

**Joseph Ochoche Ogangbo** — 2021/1/84514CF
Department of Information Technology (IFT)
School of Information and Communication Technology (SICT)
Federal University of Technology, Minna, Niger State, Nigeria

*Supervised by Prof. Ojerinde*

---

*Built for smarter, fairer energy on the FUT Minna campus.*
