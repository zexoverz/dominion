# GRIMOIRE Report: ETHJKT Phase 2 Week 4-5 Gap Completion Design

> Generated: 2026-02-14 | Analyst: GRIMOIRE, Knowledge General of the Dominion

---

## Executive Summary

Phase 2 currently has 3 weeks (HTML/CSS/jQuery → React → Advanced React). Based on analysis of all existing repos, workshop projects, and curriculum patterns, this report designs **Week 4 (Web3 Frontend Integration)** and **Week 5 (Fullstack dApp Capstone)** to complete the phase.

Key references studied:
- `phase-2-week1-frontend-basic` — HTML/CSS/jQuery, DOM, AJAX, Vercel deploy
- `phase-2-week2-reactjs` — React basics, hooks, Router, Tailwind
- `phase-2-week3-frontend-advance` — Vite, core hooks, TanStack, Cypress, Redux, Stripe, Clerk
- `tugwar-game-ui` — React + Wagmi + RainbowKit + Vite (Monad Testnet)
- `simple-defi-ui` — React + TypeScript + Ethers.js (Lisk Sepolia)
- `erc20-factory-ui` — React + Vite + Web3 wallet connection

---

## Phase 2 Week 4: `phase-2-week4-web3-frontend`

### README.md Design (Indonesian, Wizard Theme)

```markdown
# Week4-Web3-Frontend-Integration 🧙‍♂️⛓️

Welcome to week 4, Etherean! Selamat sudah melewati 3 minggu phase 2. Kalian
sudah jago bikin website React yang kenceng dan rapih. Sekarang saatnya kita
masuk ke dunia Web3 — dimana website kalian bisa konek langsung ke blockchain!

Di week ini kalian akan belajar cara menghubungkan React app kalian ke smart
contract yang ada di blockchain. Bayangkan React kalian sebagai "tongkat sihir"
dan blockchain sebagai "buku mantra" — kalian butuh jembatan untuk membaca dan
menulis mantra-mantra itu. Jembatan itu namanya **wagmi** dan **viem**.

Kalian juga akan belajar **RainbowKit** — UI kit yang bikin proses connect
wallet jadi gampang banget. Tinggal plug and play, user bisa langsung konek
MetaMask, WalletConnect, dan wallet lainnya.

Setelah itu kalian akan belajar:
- Cara **membaca data** dari smart contract (balances, NFT metadata, pool info)
- Cara **menulis transaksi** ke blockchain (transfer token, mint NFT, vote)
- Cara **mendengarkan event** dari smart contract secara real-time
- Cara handle **multi-chain** — switch network, detect wrong chain

Intinya setelah week ini kalian bukan cuma frontend developer, tapi sudah jadi
**Web3 Frontend Developer**! 🚀

## Week 4 Study Material (Berurutan)

- [Introduction to Web3 Frontend](study-material/intro-web3-frontend.md)
- [Setting Up wagmi v2 + viem](study-material/wagmi-viem-setup.md)
- [RainbowKit: Wallet Connection Made Easy](study-material/rainbowkit.md)
- [Logic Nolep: Wallet Dashboard](study-material/ln-wallet-dashboard.md)
- [Reading Smart Contracts: useReadContract](study-material/reading-contracts.md)
- [Writing Transactions: useWriteContract](study-material/writing-contracts.md)
- [Contract Events & Real-time Updates](study-material/contract-events.md)
- [Logic Nolep: Token Explorer dApp](study-material/ln-token-explorer.md)
- [Multi-chain Support & Network Switching](study-material/multichain.md)
- [Soft Skills: Technical Writing for Web3](study-material/sk-technical-writing.md)
- [Group Project Week4](study-material/gp-week4.md)
```

### Study Materials Detail

#### 1. `intro-web3-frontend.md`
- What is a dApp vs traditional web app
- Architecture: React → wagmi/viem → RPC Provider → Blockchain
- Key concepts: wallets, providers, signers, ABI, contract addresses
- Comparison: ethers.js vs viem (why viem is the modern choice)
- **Links:**
  - https://viem.sh/docs/introduction
  - https://wagmi.sh/react/getting-started
  - https://ethereum.org/en/developers/docs/dapps/

#### 2. `wagmi-viem-setup.md`
- Installing wagmi v2, viem, @tanstack/react-query
- Creating wagmi config (chains, transports, connectors)
- WagmiProvider + QueryClientProvider setup
- Understanding chain definitions (mainnet, sepolia, monad testnet, lisk sepolia)
- Environment variables: RPC URLs, WalletConnect Project ID
- **Hands-on:** Set up a fresh Vite + React + TypeScript project with wagmi

#### 3. `rainbowkit.md`
- Installing @rainbow-me/rainbowkit
- RainbowKitProvider + ConnectButton
- Customizing themes and accent colors
- Custom connect button component
- Handling connection states (connected, disconnecting, reconnecting)
- **Hands-on:** Add wallet connection to the wagmi project

#### 4. `ln-wallet-dashboard.md` — Logic Nolep
**Scenario:** Buat "Wallet Dashboard" yang menampilkan:
- Connected wallet address (truncated + copy button)
- ETH balance (native token)
- Network info (chain name, chain ID, block number)
- Recent transactions from wallet (using viem public client)
- Switch network button (Sepolia ↔ Monad Testnet)
- Responsive design with Tailwind

**Requirements:**
- Gunakan `useAccount`, `useBalance`, `useChainId`, `useSwitchChain`
- Handle semua state: disconnected, connecting, wrong network
- Deploy ke Vercel

#### 5. `reading-contracts.md`
- ABI: what it is, how to import it, type-safe ABIs with wagmi
- `useReadContract` — reading single values (balanceOf, name, symbol, totalSupply)
- `useReadContracts` — batched multicall reads
- Refetch strategies: polling, manual refetch, on block
- Formatting: `formatEther`, `formatUnits` from viem
- **Hands-on:** Read ERC20 token data from a deployed contract

#### 6. `writing-contracts.md`
- `useWriteContract` — sending transactions
- `useWaitForTransactionReceipt` — waiting for confirmation
- Transaction lifecycle: preparing → signing → pending → confirmed
- Error handling: user rejected, insufficient funds, gas estimation failed
- Optimistic UI updates with TanStack Query invalidation
- **Hands-on:** Build a simple token transfer form

#### 7. `contract-events.md`
- `useWatchContractEvent` — subscribing to contract events
- Parsing event logs with viem
- Building real-time feeds (e.g., live transfer log)
- Combining events with TanStack Query for cached + live data
- **Hands-on:** Build a live event feed for an ERC20 contract

#### 8. `ln-token-explorer.md` — Logic Nolep
**Scenario:** Buat "Token Explorer dApp" yang memungkinkan user untuk:
- Connect wallet via RainbowKit
- Input contract address ERC20 apa saja
- Menampilkan: name, symbol, decimals, totalSupply, user balance
- Transfer token ke address lain (form: recipient + amount)
- Live feed: tampilkan Transfer events real-time
- History: tampilkan 10 transfer events terakhir

**Requirements:**
- Gunakan wagmi hooks: `useReadContract`, `useReadContracts`, `useWriteContract`, `useWaitForTransactionReceipt`, `useWatchContractEvent`
- Type-safe ABI (import dari file .ts)
- Loading states, error handling, toast notifications
- Responsive + dark mode support
- Deploy ke Vercel

#### 9. `multichain.md`
- Configuring multiple chains in wagmi config
- `useSwitchChain` hook
- Chain-specific contract addresses (address mapping per chain)
- Detecting wrong network and prompting switch
- Custom chain definitions (for Monad, Lisk, etc.)
- **Hands-on:** Make the Token Explorer support Sepolia + Monad Testnet

#### 10. `sk-technical-writing.md` — Soft Skills
- Writing clear README.md for dApp projects
- Documenting smart contract interfaces for frontend devs
- Writing deployment guides
- Creating architecture diagrams

#### 11. `gp-week4.md` — Group Project
**Project: NFT Gallery dApp**
- Tim 3-4 orang
- Connect wallet, display NFTs owned by connected wallet
- Use `useReadContracts` multicall for batch metadata reads
- Grid/list view toggle, NFT detail modal
- Filter by collection
- Deploy ke Vercel
- **Submission:** PR ke repo group project + presentasi demo

### Week 4 — Final Assignment
Submit PR dengan Token Explorer dApp yang sudah complete + deployed ke Vercel. Include:
- Source code (clean, typed, well-structured)
- README with setup instructions
- Live URL (Vercel deployment)
- Screenshot/recording demonstrating all features

---

## Phase 2 Week 5: `phase-2-week5-fullstack-dapp`

### README.md Design (Indonesian, Wizard Theme)

```markdown
# Week5-Fullstack-dApp-Capstone 🧙‍♂️🏆

Selamat datang di week terakhir Phase 2, Etherean! Ini adalah puncak dari
perjalanan kalian di Tower of Illusions. Selama 4 minggu kalian sudah belajar
dari HTML dasar sampai Web3 frontend integration. Sekarang saatnya kalian
membuktikan semua skill itu dalam satu proyek besar: **Fullstack dApp Capstone**.

Di week ini kalian akan membangun dApp end-to-end — dari frontend React yang
konek ke smart contract, terintegrasi dengan backend API, dan di-deploy ke
production. Ini bukan latihan lagi, ini adalah **final project** yang bisa
kalian tunjukkan ke dunia sebagai portfolio Web3 developer kalian.

Kalian akan belajar:
- **IPFS & Decentralized Storage** — upload file/metadata ke Pinata
- **Backend + Blockchain Integration** — API yang baca data on-chain
- **Environment Management** — manage contract addresses, RPC URLs per network
- **Frontend Testing** — mock contract interactions untuk testing
- **Deployment Pipeline** — Vercel untuk frontend, testnet untuk contracts
- **Presentation & Demo** — showcase project kalian secara professional

Ini adalah ujian terakhir sebelum kalian masuk ke **Tower of Chains (Phase 3)**
dimana kalian akan belajar menulis smart contract sendiri. Buktikan bahwa kalian
layak menjadi seorang Fullstack Web3 Developer! 🚀

## Week 5 Study Material (Berurutan)

- [IPFS & Decentralized Storage](study-material/ipfs-storage.md)
- [Backend Integration for dApps](study-material/backend-integration.md)
- [Logic Nolep: NFT Minter with IPFS](study-material/ln-nft-minter.md)
- [Environment & Deployment Management](study-material/env-deployment.md)
- [Frontend Testing with Contract Mocks](study-material/testing-web3.md)
- [Logic Nolep: Voting dApp](study-material/ln-voting-dapp.md)
- [Soft Skills: Demo Day Preparation](study-material/sk-demo-day.md)
- [Capstone Project Guidelines](study-material/capstone-project.md)
```

### Study Materials Detail

#### 1. `ipfs-storage.md`
- What is IPFS? Content-addressed storage
- Pinata SDK: uploading files and JSON metadata
- Generating metadata URIs for NFTs
- web3.storage as alternative
- **Hands-on:** Upload an image + JSON metadata to Pinata, get IPFS URI
- **Links:**
  - https://docs.pinata.cloud/
  - https://docs.ipfs.tech/
  - https://nft.storage/

#### 2. `backend-integration.md`
- When you need a backend alongside your dApp (indexing, caching, auth)
- Using Phase 1 skills: Express/Hono API that reads blockchain data via viem
- Caching contract reads on backend to reduce RPC calls
- Webhook patterns: listening to events server-side
- **Hands-on:** Build a simple API that returns token holder data from on-chain reads

#### 3. `ln-nft-minter.md` — Logic Nolep
**Scenario:** Buat "NFT Minter dApp" lengkap:
- Connect wallet via RainbowKit
- Upload image to IPFS via Pinata
- Fill metadata form (name, description, attributes)
- Upload metadata JSON to IPFS
- Mint NFT by calling contract's `mint(tokenURI)` function
- Display minted NFTs in gallery view
- Show transaction status (pending, confirmed, failed)

**Requirements:**
- Gunakan wagmi + viem untuk contract interaction
- Pinata SDK untuk IPFS upload
- TanStack Query untuk state management
- Toast notifications untuk transaction status
- Fully typed TypeScript
- Deploy ke Vercel (connect to Sepolia or Monad Testnet)

#### 4. `env-deployment.md`
- Environment variables strategy: `.env.local`, `.env.production`
- Contract address mapping per chain/environment
- Vercel environment configuration
- CI/CD basics: GitHub Actions for auto-deploy
- Custom domain setup on Vercel
- **Hands-on:** Configure multi-environment deployment for NFT Minter

#### 5. `testing-web3.md`
- Vitest setup for React + wagmi
- Mocking wagmi hooks with `@wagmi/test`
- Testing contract reads/writes without real blockchain
- Cypress E2E with injected wallet (using Synpress or manual mock)
- **Hands-on:** Write 5 unit tests + 2 E2E tests for the NFT Minter

#### 6. `ln-voting-dapp.md` — Logic Nolep
**Scenario:** Buat "Decentralized Voting dApp":
- Admin bisa create proposal (judul + deskripsi + deadline)
- User bisa vote (1 wallet = 1 vote per proposal)
- Real-time vote count update via contract events
- Results visualization (bar chart/progress bar)
- Proposal list with status (active, ended)
- Backend API: cache proposal list + vote counts untuk fast loading

**Requirements:**
- Frontend: React + Vite + wagmi + RainbowKit
- Backend: Hono/Express API with viem for blockchain reads
- Smart contract interaction (read proposals, cast vote, get results)
- TanStack Query for async state
- Minimum 3 unit tests
- Deploy frontend ke Vercel, backend ke Railway/Render
- **Interact with a pre-deployed Voting contract** (address provided)

#### 7. `sk-demo-day.md` — Soft Skills
- Structuring a 10-minute project demo
- Live demo best practices (have a backup recording!)
- Explaining technical architecture to non-technical audience
- Handling Q&A confidently
- Portfolio presentation: GitHub README, live demo URL, architecture diagram

#### 8. `capstone-project.md` — Final Capstone
**Pilih salah satu project atau propose sendiri (dengan approval mentor):**

**Option A: Simple DEX Interface**
- Token swap UI (pilih pair, input amount, execute swap)
- Liquidity pool info dashboard
- Transaction history
- Interact with pre-deployed AMM contract

**Option B: NFT Marketplace**
- Browse listed NFTs
- Buy NFT (connect wallet + send transaction)
- List own NFT for sale
- Transaction status tracking
- IPFS for NFT images

**Option C: DAO Dashboard**
- View proposals
- Create new proposal
- Vote on proposals
- Delegate voting power
- Results visualization

**Option D: Custom Project (Propose)**
- Must include: wallet connection, contract reads, contract writes, deployment
- Submit proposal to mentor for approval within 2 days

**Capstone Requirements (All Options):**
- ✅ React + Vite + TypeScript
- ✅ wagmi v2 + viem + RainbowKit
- ✅ TanStack Query for async state
- ✅ Tailwind CSS
- ✅ At least 1 backend endpoint (optional: more)
- ✅ Deployed to Vercel (frontend) + testnet (contract interaction)
- ✅ README.md with: overview, architecture diagram, setup guide, live URL
- ✅ Minimum 5 tests (unit or E2E)
- ✅ 10-minute presentation + live demo

**Submission:**
- PR ke repo capstone project
- Include live URL
- Presentasi di Demo Day (jadwal ditentukan mentor)

**Grading Criteria:**
| Criteria | Weight |
|----------|--------|
| Functionality (features work) | 30% |
| Code Quality (typed, clean, structured) | 25% |
| UI/UX (responsive, polished) | 15% |
| Testing | 10% |
| Documentation (README, comments) | 10% |
| Presentation | 10% |

---

## Implementation Recommendations

### Repo Structure
Create two new repos matching the naming convention:
- `Ethereum-Jakarta/phase-2-week4-web3-frontend`
- `Ethereum-Jakarta/phase-2-week5-fullstack-dapp`

### Pre-deployed Contracts Needed
Week 4-5 relies on students interacting with existing contracts:
1. **ERC20 Token** on Sepolia + Monad Testnet (for Token Explorer)
2. **ERC721 NFT** with `mint(tokenURI)` (for NFT Minter)
3. **Voting Contract** (for Voting dApp LN)
4. **AMM/DEX Contract** (for capstone Option A, can reuse `simple-defi` contracts)

These should be deployed by ETHJKT team and addresses provided in each LN.

### Starter Templates
Each LN should include a starter template in the repo:
```
study-material/
├── ln-wallet-dashboard.md
├── ln-wallet-dashboard-starter/    ← Vite + React + wagmi boilerplate
│   ├── package.json
│   ├── src/
│   └── ...
```

### Technology Stack Summary
| Tool | Version | Purpose |
|------|---------|---------|
| wagmi | v2.x | React hooks for Ethereum |
| viem | v2.x | TypeScript Ethereum client |
| @rainbow-me/rainbowkit | v2.x | Wallet connection UI |
| @tanstack/react-query | v5.x | Async state management |
| Vite | v5.x | Build tool |
| Tailwind CSS | v3.x | Styling |
| Vitest | latest | Unit testing |
| Pinata SDK | latest | IPFS uploads |

### Progression Flow
```
Week 3 (Advanced React) 
  → Week 4 (Web3 Frontend — connect wallet, read/write contracts)
    → Week 5 (Fullstack dApp — IPFS, backend, testing, capstone)
      → Phase 3 (Smart Contract Development — write your own contracts)
```

This creates a natural bridge: students learn to **use** contracts before learning to **write** them in Phase 3.

---

## Summary

| Week | Title | Key Skills | Logic Nolep | Group/Final Project |
|------|-------|------------|-------------|-------------------|
| **4** | Web3 Frontend Integration | wagmi v2, viem, RainbowKit, useReadContract, useWriteContract, events, multi-chain | Wallet Dashboard, Token Explorer | NFT Gallery dApp |
| **5** | Fullstack dApp Capstone | IPFS/Pinata, backend+blockchain, testing, deployment, presentation | NFT Minter, Voting dApp | Capstone (DEX/Marketplace/DAO/Custom) |

With these two weeks, Phase 2 becomes a complete 5-week journey from HTML basics to fullstack dApp development, perfectly setting up students for Phase 3's smart contract development.

---

*Report generated by GRIMOIRE, Knowledge General of the Dominion* ⚔️📚
