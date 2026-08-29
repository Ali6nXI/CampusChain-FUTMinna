# CampusChain Hardware Layer

This folder contains the physical demonstration and bridge components of CampusChain.

> **Important**  
> The core CampusChain system (smart contracts, backend, React dashboard, and IoT simulation) runs without physical hardware.  
> The files here support an optional physical demonstration of the settlement signal path.

## Current Status

| Component                    | Status          | Notes                                      |
|-----------------------------|-----------------|--------------------------------------------|
| Python IoT Simulator        | ✅ Implemented  | Located in `/iot`                          |
| MQTT Pipeline               | ✅ Working      | HiveMQ public broker                       |
| Physical ESP32 Nodes        | 🟡 Demonstration| Two nodes used for signalling test         |
| Real energy metering        | ❌ Not verified | Solar generation not measured during tests |
| Power transfer between buildings | ❌ Not implemented | System trades entitlements only       |

## Folder Contents

- `bridge.py` – Bridge script between on-chain events and external systems
- `chain_watcher.py` – Watches Polygon Amoy for TradeExecuted events
- `trade.py` – Helper utilities for trade-related operations

## Physical Demonstration Nodes (Optional)

Two ESP32-based nodes were constructed for signalling verification:

**Prosumer Node (Hostel)**
- ESP32 development board
- INA219 current sensor
- SSD1306 OLED (128×64)
- Publishes to Firebase path: `/nodes/hostel`

**Consumer Node (Library)**
- ESP32 development board
- SSD1306 OLED (128×64)
- LED (GPIO 26) + DC fan (GPIO 27)
- Polls Firebase path: `/trade/value`

### What was verified
- A purchase on Polygon Amoy → watcher detects settlement → Firebase flag raised → consumer node energises LED and fan.
- End-to-end signalling latency was measured (see Chapter 4, Section 4.8).

### What was **not** verified
- Actual solar generation measurement (panel produced ~0 mW during testing)
- Physical transfer of energy between buildings
- Long-term field deployment

## Future Hardware Roadmap

- Deploy Raspberry Pi + PZEM-004T smart meters on real campus buildings
- Integrate with actual REA/AfDB solar-hybrid plant data
- Add cryptographic oracle binding between meter readings and on-chain listings
- Support real-time grid balancing signals

## Notes for Examiners / Readers

CampusChain is primarily a **blockchain + software prototype**.  
The hardware work in this folder demonstrates that a blockchain settlement can trigger a physical response. It does **not** claim full smart-meter deployment or physical energy transfer across the campus.
