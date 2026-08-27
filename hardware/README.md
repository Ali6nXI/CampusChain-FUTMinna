# Stellar Drips 🌊

> Soroban-native stablecoin streaming contract for recurring drip payments on Stellar.
> Nigeria-first remittances, gig salaries, and micro-disbursements.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-blueviolet)](https://soroban.stellar.org)
[![Drips Wave](https://img.shields.io/badge/Drips-Wave%20Maintainer-green)](https://www.drips.network/wave)
[![Issues](https://img.shields.io/github/issues/Ali6nXI/stellar-drips)](https://github.com/Ali6nXI/stellar-drips/issues)

---

## What is Stellar Drips?

Stellar Drips is a programmable payment streaming protocol built on Soroban — Stellar's smart contract platform. Instead of one-off transfers, senders lock funds into a stream and recipients claim what has accrued over time, second by second.

Think of it as putting money on autopilot: set it once, and it drips continuously to the recipient until the stream ends or is cancelled.

### Real-world use cases (Nigeria-first)

| Use case | Example |
|----------|---------|
| **Family remittances** | Diaspora sends daily USDC drips to relatives in Lagos instead of weekly lump sums |
| **Gig economy salaries** | Freelancers receive continuous salary streams instead of waiting for monthly payroll |
| **NGO micro-aid** | Aid organizations disburse funds gradually to ensure sustained support |
| **Subscriptions** | Pay for services in real-time — stop the stream, stop the payment |
| **Invoice streaming** | Clients stream payment as work progresses, not after completion |

---

## Architecture

```
stellar-drips/
├── contracts/stellar-drips/        # Soroban Rust smart contract
│   └── src/
│       ├── lib.rs                  # Contract entry point (create_stream, claim, cancel, get_stream)
│       ├── stream.rs               # Stream struct + accrued_amount logic
│       ├── errors.rs               # ContractError enum
│       └── test.rs                 # Unit + integration tests
├── frontend/                       # React/TypeScript dApp
│   └── src/
│       ├── components/
│       │   ├── ConnectWallet.tsx   # Freighter wallet connect
│       │   ├── CreateStreamForm.tsx # Create new drip stream
│       │   └── StreamCard.tsx      # Display stream with progress bar
│       ├── pages/
│       │   └── Dashboard.tsx       # Main dashboard
│       └── services/
│           └── stellar.ts          # Stellar SDK + contract integration
├── .github/
│   ├── workflows/ci.yml            # CI/CD pipeline
│   └── ISSUE_TEMPLATE/             # Stellar Wave issue templates
├── docs/                           # Architecture + deployment guides
├── scripts/                        # Deployment helper scripts
├── CONTRIBUTING.md
└── LICENSE
```

---

## How it works

### The Stream lifecycle

```
Sender calls create_stream()
        │
        ▼
Funds locked in contract ──────────────────────────────────────┐
        │                                                       │
        ▼                                                       │
Time passes... funds accrue to recipient                        │
        │                                                       │
        ├──► Recipient calls claim() ──► receives accrued funds │
        │                                                       │
        └──► Sender calls cancel() ──► remaining funds returned ┘
```

### Accrual math

At any point in time, the claimable amount is calculated as:

```
elapsed = current_time - start_time
duration = end_time - start_time
accrued = (total_amount * elapsed) / duration - claimed_amount
```

This ensures recipients can only claim what has linearly accrued — no over-claiming, no under-paying.

---

## Smart contract

### Contract functions

| Function | Description |
|----------|-------------|
| `create_stream(recipient, token, amount, duration_seconds)` | Lock funds and start a stream |
| `claim(stream_id)` | Recipient withdraws all currently accrued funds |
| `cancel(stream_id)` | Sender cancels stream and recovers remaining funds |
| `get_stream(stream_id)` | Read stream details (amounts, times, status) |

### Events emitted

| Event | Trigger |
|-------|---------|
| `StreamCreated` | New stream created |
| `Claimed` | Recipient claims accrued funds |
| `Cancelled` | Sender cancels the stream |

### Error codes

| Error | Meaning |
|-------|---------|
| `StreamNotFound` | Stream ID does not exist |
| `NotRecipient` | Caller is not the stream recipient |
| `NotSender` | Caller is not the stream sender |
| `StreamInactive` | Stream has been cancelled |
| `NothingToClaim` | No funds have accrued since last claim |
| `InvalidDuration` | Duration is zero or negative |
| `InvalidAmount` | Amount is zero or negative |

### Supported tokens

| Token | Network | Description |
|-------|---------|-------------|
| USDC | Testnet + Mainnet | USD Coin — global stablecoin |
| cNGN | Testnet + Mainnet | Nigerian Naira stablecoin |

---

## Getting started

### Prerequisites

- [Rust](https://rustup.rs) + `wasm32-unknown-unknown` target
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli) v25+
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://freighter.app) browser extension

### 1. Clone the repo

```bash
git clone https://github.com/Ali6nXI/stellar-drips.git
cd stellar-drips
```

### 2. Build the contract

```bash
cd contracts/stellar-drips
cargo build --target wasm32-unknown-unknown --release
```

### 3. Run tests

```bash
cargo test
```

### 4. Deploy to testnet

```bash
# Configure testnet
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate and fund a deployer account
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_drips.wasm \
  --source deployer \
  --network testnet
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full step-by-step guide.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, connect your Freighter wallet, and start streaming.

---

## Contributing — Drips Wave 🌊

Stellar Drips is an active **Drips Wave maintainer project**. Every month, contributors earn points by completing tagged issues during 7-day sprint waves.

### Open issues (current wave)

| Issue | Points | Labels |
|-------|--------|--------|
| [Deploy contract to Stellar testnet](https://github.com/Ali6nXI/stellar-drips/issues/1) | 150 pts | `good first issue` |
| [Add multi-stream view](https://github.com/Ali6nXI/stellar-drips/issues/2) | 200 pts | `enhancement` |
| [Write test suite for claim() edge cases](https://github.com/Ali6nXI/stellar-drips/issues/3) | 100 pts | `good first issue` |
| [Add cNGN token support](https://github.com/Ali6nXI/stellar-drips/issues/4) | 100 pts | `good first issue` |
| [Build stream history page](https://github.com/Ali6nXI/stellar-drips/issues/5) | 150 pts | `enhancement` |
| [Add loading states and error toasts](https://github.com/Ali6nXI/stellar-drips/issues/6) | 100 pts | `good first issue` |
| [Write Soroban testnet deployment guide](https://github.com/Ali6nXI/stellar-drips/issues/7) | 100 pts | `documentation` |

### How to contribute

1. Browse [open issues](https://github.com/Ali6nXI/stellar-drips/issues) labeled `stellar-wave`
2. Comment on the issue to claim it
3. Fork the repo and create a branch: `git checkout -b feat/your-feature`
4. Make your changes with clear commits
5. Open a pull request — reference the issue number
6. After merge, points are awarded via the Drips Wave program

Read [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## Roadmap

- [x] Core Soroban streaming contract (`create_stream`, `claim`, `cancel`)
- [x] React/TypeScript frontend with Freighter wallet
- [x] cNGN + USDC token support
- [x] CI/CD pipeline
- [ ] Testnet deployment + live contract address
- [ ] Multi-stream dashboard view
- [ ] Stream history page with CSV export
- [ ] Mainnet deployment
- [ ] Mobile PWA wrapper for Lagos users
- [ ] Integration with Trustless Work escrow repos
- [ ] SEP-41 compliance hooks

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Smart contract | Rust + Soroban SDK |
| Blockchain | Stellar (Testnet + Mainnet) |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Wallet | Freighter via `@stellar/freighter-api` |
| SDK | `@stellar/stellar-sdk` |
| CI/CD | GitHub Actions |

---

## Security

This contract handles real funds. If you find a vulnerability:

- Do **not** open a public issue
- Email the maintainer directly
- Allow 48 hours for response before disclosure

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Maintainer

Built and maintained by [Ali6nXI](https://github.com/Ali6nXI) as part of the **Stellar Wave** open-source program.

> "Making programmable money accessible to every Nigerian with a phone." 🇳🇬

---

*Part of the [Drips Wave](https://www.drips.network/wave) ecosystem — 535+ repos, 7-day contribution sprints, SDF-funded rewards.*
