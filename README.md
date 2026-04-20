# ⚡ CampusChain – FUT Minna

> **A Blockchain + IoT Peer-to-Peer Energy Trading System for FUT Minna Campus Microgrid**

![Status](https://img.shields.io/badge/Status-Phase%200%20Complete-brightgreen)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon%20Testnet-8247E5?logo=ethereum)
![IoT](https://img.shields.io/badge/IoT-Raspberry%20Pi%20%2B%20PZEM--004T-C51A4A?logo=raspberrypi)
![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-Academic%20Use-blue)

---

## 📌 What is CampusChain?

CampusChain is a **blockchain-enabled, IoT-integrated peer-to-peer (P2P) energy trading prototype** designed for isolated university microgrids in Nigeria. It enables campus buildings — hostels, labs, and lecture halls — to **securely trade surplus solar energy** using real smart meters and Solidity smart contracts deployed on the Polygon testnet.

All trades use **test tokens only** — no real money is involved. The system is fully isolated from the national grid (NEPA/PHCN).

---

## 🔍 Problem Statement

FUT Minna's campus is powered by a solar-hybrid plant funded by REA/AfDB. Despite this, the campus suffers from:

| Problem | Impact |
|---|---|
| ⚡ Surplus solar energy going to waste | Inefficient use of existing infrastructure |
| 🛢️ High diesel generator costs | Unnecessary recurring expenditure |
| 📊 Metering fraud | Loss of trust and accountability in energy distribution |
| 🔒 No transparent energy allocation | No mechanism for fair, auditable internal trading |

CampusChain addresses all four problems through a tamper-resistant, distributed architecture.

---

## 🚀 Key Features

- 🔌 **Real IoT Smart Meters** — Built with Raspberry Pi and PZEM-004T sensors for live energy readings
- 📜 **Smart Contracts** — Deployed on Polygon testnet (Solidity); Hyperledger Fabric also being explored
- 🖥️ **Web Dashboard** — Simple React.js interface for buying and selling surplus solar energy
- 🔗 **MQTT + Node-RED Pipeline** — Lightweight IoT messaging for real-time data flow
- 🏫 **Campus-Isolated System** — Fully decoupled from NEPA/PHCN; operates as a standalone microgrid
- 🧾 **Immutable Audit Trail** — Every energy trade recorded on-chain for full transparency

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Blockchain** | Polygon Testnet, Solidity |
| **IoT Hardware** | Raspberry Pi, PZEM-004T Energy Sensor |
| **IoT Middleware** | Node-RED, MQTT |
| **Frontend** | React.js, ethers.js |
| **Backend** | Node.js |

---

## 🗺️ System Architecture (Overview)

```
[Campus Building A]          [Campus Building B]
  Raspberry Pi                 Raspberry Pi
  PZEM-004T                    PZEM-004T
      |                              |
   MQTT Broker (Node-RED)  ←--------→
              |
        Node.js Backend
              |
     Polygon Testnet (Smart Contracts)
              |
       React.js Dashboard
       (Buy / Sell Surplus Solar)
```

---

## 📂 Project Structure

```
CampusChain-FUTMinna/
├── contracts/              # Solidity smart contracts
├── iot/                    # Raspberry Pi scripts + Node-RED flows
├── backend/                # Node.js API server
├── frontend/               # React.js dashboard
├── docs/                   # Research papers, PRD, thesis guidelines
└── README.md
```

---

## 📄 Documents & References

| Document | Link |
|---|---|
| 📋 Product Requirements Document (PRD) | [View PDF](https://github.com/Ali6nXI/CampusChain-FUTMinna/blob/main/CampusChain_PRD.pdf) |
| 📰 2024 FUT Minna Research Paper | [Electrica Journal](https://electricajournal.org/index.php/pub/article/view/1162/1159) |
| 🎓 FUT Minna PG Thesis Guidelines 2023 | [View Guidelines](http://irepo.futminna.edu.ng:8080/jspui/bitstream/123456789/30099/1/PG%20Thesis%20Guidelines_2023_%20%281%29.pdf) |

---

## 🗓️ Project Roadmap

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | Project preparation, literature review, tools setup | ✅ Complete |
| **Phase 1** | Learn fundamentals (Solidity, IoT, MQTT, React) | 🔄 Next |
| **Phase 2** | Build & test smart meter prototype | ⏳ Upcoming |
| **Phase 3** | Develop and deploy smart contracts to testnet | ⏳ Upcoming |
| **Phase 4** | Integrate IoT ↔ Blockchain pipeline | ⏳ Upcoming |
| **Phase 5** | Build React dashboard & end-to-end testing | ⏳ Upcoming |

---

## ⚠️ Disclaimer

This project is an **academic prototype** developed for a postgraduate thesis at FUT Minna. It uses **test tokens only** and does not involve real currency or real energy billing. It is not intended for production deployment.

---

## 👤 Author

**Ogangbo Ochoche Joseph**  
Department of Information Technology (IFT)  
School of Information and Communication Technology (SICT)  
Federal University of Technology, Minna — Nigeria

---

*Made with ❤️ for smarter, fairer energy on campus.*
