# ⚡ CampusChain – FUT Minna

> **A Blockchain + IoT Peer-to-Peer Energy Trading System for FUT Minna Campus Microgrid**

![Status](https://img.shields.io/badge/Status-Prototype%20Complete-brightgreen)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon%20Amoy%20Testnet-8247E5?logo=ethereum)
![IoT](https://img.shields.io/badge/IoT-Python%20MQTT%20Simulation-C51A4A?logo=raspberrypi)
![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Vite%20+%20Tailwind-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-Academic%20Use%20Only-blue)

---

## 📌 What is CampusChain?

CampusChain is a **blockchain-enabled, IoT-integrated peer-to-peer (P2P) energy trading prototype** built as a postgraduate thesis project at the Federal University of Technology, Minna (FUT Minna). It enables campus buildings — hostels, labs, and lecture halls — to **securely trade surplus solar energy** using real smart contracts deployed on the Polygon Amoy testnet.

All trades use **test tokens only** — no real money is involved. The system is fully isolated from the national grid (NEPA/PHCN).

---

## 🔍 Problem Statement

FUT Minna's campus is powered by a solar-hybrid plant funded by REA/AfDB. Despite this, the campus suffers from:

| Problem | Impact |
|---|---|
| ⚡ Surplus solar energy going to waste | Inefficient use of existing infrastructure |
| 🛢️ High diesel generator costs | Unnecessary recurring expenditure |
| 📊 Metering fraud | Loss of trust and accountability |
| 🔒 No transparent energy allocation | No mechanism for fair, auditable internal trading |

CampusChain addresses all four problems through a tamper-resistant, distributed architecture.

---

## 🚀 Key Features

- 📜 **Smart Contracts** — ERC-20 token (CET) + P2P trading contract deployed on Polygon Amoy testnet
- 🔌 **IoT Simulation** — Python MQTT publisher simulating 4 campus buildings via HiveMQ broker
- 🖥️ **Web Dashboard** — React.js interface for buying/selling surplus solar energy in real time
- 🔗 **MQTT + Node.js Pipeline** — Live IoT data flowing from simulator to dashboard
- 🏫 **Campus-Isolated Design** — Decoupled from NEPA/PHCN, operates as a standalone microgrid
- 🧾 **Immutable Audit Trail** — Every energy trade recorded on-chain and verifiable on Polygonscan

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Blockchain** | Polygon Amoy Testnet, Solidity, Hardhat |
| **Smart Contracts** | ERC-20 (CET Token), P2P EnergyTrade contract |
| **IoT Simulation** | Python, paho-mqtt, HiveMQ public broker |
| **Backend** | Node.js, Express, ethers.js, MQTT |
| **Frontend** | React.js, Vite, Tailwind CSS, ethers.js, axios |
| **Wallet** | MetaMask |

---

## 📋 Deployed Contracts (Polygon Amoy Testnet)

| Contract | Address |
|---|---|
| **EnergyToken (CET)** | `0x38351EC35A682a037Ac67C5583a751093C188C28` |
| **EnergyTrade** | `0xE8fdd1d1a13447FaeCE1F5e98da5B049a9331368` |

Verify on [Polygon Amoy Polygonscan](https://amoy.polygonscan.com)

---

## 🗺️ System Architecture

```
[IoT Simulation Layer]
  Python MQTT Publisher
  4 Buildings: Hostel A, Lab Block, Lecture Hall C, Admin Block
        |
        | MQTT (broker.hivemq.com)
        ↓
[Backend Layer]
  Node.js + Express
  MQTT Subscriber → stores latest readings
  ethers.js → talks to smart contracts
  REST API → serves frontend
        |
        ↓
[Blockchain Layer]
  Polygon Amoy Testnet
  EnergyToken.sol (ERC-20 CET)
  EnergyTrade.sol (P2P listings + purchases)
        |
        ↓
[Frontend Layer]
  React.js + Vite + Tailwind CSS
  Dashboard | Sell Energy | Buy Energy | Trade History
  MetaMask wallet integration
```

---

## 📂 Project Structure

```
CampusChain-FUTMinna/
├── contracts/
│   ├── contracts/
│   │   ├── EnergyToken.sol       # ERC-20 CET token
│   │   └── EnergyTrade.sol       # P2P trading contract
│   ├── test/
│   │   └── EnergyTrade.test.cjs  # 7 Hardhat tests (all passing)
│   └── hardhat.config.cjs        # Hardhat config (CJS, not ESM)
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── routes/
│   │   └── energy.js             # API routes
│   ├── services/
│   │   ├── contractService.js    # ethers.js contract connections
│   │   └── mqttService.js        # MQTT subscriber + meter store
│   └── .env                      # 🔒 NOT committed (see .gitignore)
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # React Router setup
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WalletConnect.jsx
│   │   │   └── MeterCard.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx     # Live stats + IoT readings + listings
│   │       ├── SellEnergy.jsx    # List surplus energy
│   │       ├── BuyEnergy.jsx     # Browse and buy listings
│   │       └── TradeHistory.jsx  # All completed trades
│   ├── tailwind.config.js
│   └── vite.config.js
├── iot/
│   ├── meter_simulator.py        # Simulates PZEM-004T sensor data
│   ├── mqtt_publisher.py         # Publishes to HiveMQ every 10s
│   └── requirements.txt
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MetaMask browser extension
- Polygon Amoy testnet MATIC (from [faucet](https://faucet.polygon.technology/))

### 1. Clone the Repository

```bash
git clone https://github.com/Ali6nXI/CampusChain-FUTMinna.git
cd CampusChain-FUTMinna
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3001
AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_wallet_private_key_here
ENERGY_TOKEN_ADDRESS=0x38351EC35A682a037Ac67C5583a751093C188C28
ENERGY_TRADE_ADDRESS=0xE8fdd1d1a13447FaeCE1F5e98da5B049a9331368
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

Start the backend:

```bash
node server.js
```

Backend runs at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. IoT Simulator Setup

```bash
cd iot
pip install -r requirements.txt
python mqtt_publisher.py
```

Publishes simulated meter readings for 4 buildings every 10 seconds to `broker.hivemq.com` on topic `campuschain/futminna/{building}`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meters` | Latest IoT meter readings for all buildings |
| `GET` | `/api/energy/listings` | All energy trade listings from contract |
| `POST` | `/api/energy/list` | Create a new energy listing |
| `POST` | `/api/energy/buy/:id` | Buy an energy listing by ID |
| `GET` | `/api/energy/balance/:address` | CET token balance for a wallet address |

---

## 🧪 Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

All 7 tests pass:

```
EnergyTrade
  ✔ Should list energy for sale
  ✔ Should allow buying a listing
  ✔ Should mark listing as inactive after purchase
  ✔ Should transfer tokens correctly
  ✔ Should reject purchase with insufficient tokens
  ✔ Should reject buying own listing
  ✔ Should emit correct events
```

---

## 🔄 How a Trade Works

```
1. Seller connects MetaMask wallet
2. Seller submits surplus energy (e.g. 100 Wh @ 1 CET/Wh) on Sell Energy page
3. Smart contract records the listing on-chain
4. Buyer sees the listing on Buy Energy page
5. Buyer clicks "Buy" → MetaMask prompts for approval
6. Smart contract transfers CET tokens and marks listing complete
7. Trade is permanently recorded on Polygon Amoy testnet
8. Verifiable on Polygonscan ✅
```

---

## 📊 Live Dashboard

The dashboard shows:
- Your CET token balance
- Number of active listings and completed trades
- **Live IoT meter readings** (voltage, current, power, energy, surplus) for all 4 buildings, updated every 10 seconds
- Active energy listings table

---

## ⚠️ Disclaimer

This project is an **academic prototype** developed for a postgraduate thesis at FUT Minna. It uses **test tokens only** and does not involve real currency or real energy billing. It is **not intended for production deployment**.

---

## 📄 References

| Document | Link |
|---|---|
| 📰 2024 FUT Minna Research Paper | [Electrica Journal](https://electricajournal.org/index.php/pub/article/view/1162/1159) |
| 🎓 FUT Minna PG Thesis Guidelines 2023 | [View Guidelines](http://irepo.futminna.edu.ng:8080/jspui/bitstream/123456789/30099/1/PG%20Thesis%20Guidelines_2023_%20%281%29.pdf) |
| 🔍 Polygon Amoy Explorer | [amoy.polygonscan.com](https://amoy.polygonscan.com) |

---

## 👤 Author

**Ogangbo Ochoche Joseph**
Department of Information Technology (IFT)
School of Information and Communication Technology (SICT)
Federal University of Technology, Minna — Nigeria

---

*Made with ❤️ for smarter, fairer energy on FUTMinna-campus.*
