# 🗺️ ETHJKT Fullstack Web3 Roadmap — Updated March 2026

*Roadmap belajar Web3 development dari nol sampai bisa deploy dApp dan contribute ke ecosystem Ethereum.*
*Bahasa: Indonesia | Level: Beginner → Intermediate*

---

## 📋 Overview

Roadmap ini dibagi jadi **5 fase**. Setiap fase punya tujuan yang jelas dan resource yang terstruktur. Estimasi total: **3-6 bulan** tergantung kecepatan belajar.

---

## 🏗️ Fase 0: Fondasi Programming (2-4 minggu)

**Tujuan:** Menguasai dasar programming dengan JavaScript

### Topik:
- Variable, tipe data, operator
- Conditional (if/else, switch)
- Loop (for, while)
- Function & scope
- Array & Object
- ES6+ syntax (arrow function, destructuring, spread, async/await)
- Git & GitHub basics

### Resources:
1. **[freeCodeCamp JavaScript Course](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)** — Gratis, interaktif, bisa di browser
2. **[JavaScript.info](https://javascript.info/)** — Referensi lengkap, dari dasar sampai advance
3. **[Codecademy JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)** — Interactive coding exercises
4. **[The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript)** — Full curriculum, project-based
5. **[CS50x (Harvard)](https://cs50.harvard.edu/x/)** — Computer science fundamentals (optional tapi bagus)
6. **[Git & GitHub Tutorial (freeCodeCamp)](https://www.youtube.com/watch?v=RGOj5yH7evk)** — 1 jam, semua yang perlu lu tau

### ETHJKT Repos:
- `phase-0-week1-welcome-to-code` → `phase-0-week4-before-the-journey`
- `phase-0-preparation` (ES6 + Web Dev basics)
- `phase-0-code-in-mobile` (buat yang belum punya laptop — pakai Termux)

---

## 🔗 Fase 1: Blockchain & Ethereum Fundamentals (1-2 minggu)

**Tujuan:** Pahami cara kerja blockchain, Ethereum, dan ecosystem-nya

### Topik:
- Apa itu blockchain, distributed ledger, consensus
- Ethereum: PoS, EVM, gas, accounts, transactions
- Wallet (EOA vs Smart Contract Wallet)
- L1 vs L2 (Arbitrum, Optimism, Base, zkSync)
- Testnet, faucet, block explorer

### Resources:
7. **[ethereum.org — Developer Docs](https://ethereum.org/en/developers/docs/)** — Official, paling up-to-date
8. **[Ethereum Whitepaper (Simplified)](https://ethereum.org/en/whitepaper/)** — Baca minimal sekali
9. **[Mastering Ethereum (Free Book)](https://github.com/ethereumbook/ethereumbook)** — Andreas Antonopoulos, open source
10. **[Ethereum 101 by Secureum](https://secureum.substack.com/p/ethereum-101)** — Dense tapi bagus banget
11. **[useWeb3.xyz](https://www.useweb3.xyz/)** — Curated list of Web3 learning resources
12. **[LearnWeb3 DAO](https://learnweb3.io/)** — Free courses, beginner to expert tracks

### Praktik:
- Install MetaMask → switch ke Sepolia testnet
- Claim testnet ETH dari faucet
- Kirim ETH, lihat transaksi di Etherscan
- Baca 1 block di block explorer, pahami isinya

---

## 📝 Fase 2: Solidity & Smart Contracts (3-4 minggu)

**Tujuan:** Bisa nulis, deploy, dan test smart contract

### Topik:
- Solidity syntax (types, functions, modifiers, events)
- Storage vs Memory vs Calldata
- Inheritance, interfaces, libraries
- Common patterns (Ownable, Pausable, ReentrancyGuard)
- ERC-20, ERC-721, ERC-1155 token standards
- Testing dengan Foundry / Hardhat
- Deploy ke testnet

### Resources:
13. **[CryptoZombies](https://cryptozombies.io/)** — Belajar Solidity sambil bikin game, interaktif
14. **[Solidity by Example](https://solidity-by-example.org/)** — Kumpulan contoh code yang bisa langsung dicopy
15. **[Scaffold-ETH 2](https://scaffoldeth.io/)** — Starter kit buat fullstack dApp development
16. **[SpeedRunEthereum](https://speedrunethereum.com/)** — 6 challenges progressif, dari beginner sampai intermediate
17. **[Patrick Collins Foundry Course (32 jam)](https://www.youtube.com/watch?v=umepbfKp5rI)** — THE best free Solidity course, hands down
18. **[OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)** — Standard library untuk smart contracts
19. **[Remix IDE](https://remix.ethereum.org/)** — Browser-based Solidity IDE, bagus buat mulai
20. **[Foundry Book](https://book.getfoundry.sh/)** — Official Foundry docs (recommended tooling)
21. **[Hardhat Documentation](https://hardhat.org/docs)** — Alternative tooling, JS-based

### ETHJKT Repos:
- `practice-todo-contract` — First smart contract
- `monad-taskmanager` / `foundry-monad-taskmanager` — Basic deployment
- `monad-token-factory` — ERC-20 factory pattern
- `campus-contracts` — Multi-contract system

---

## 🖥️ Fase 3: Frontend & Full-Stack dApp (3-4 minggu)

**Tujuan:** Connect frontend ke smart contract, build full dApp

### Topik:
- React basics (components, hooks, state)
- Wallet connection (RainbowKit, ConnectKit)
- Read/write contract (wagmi + viem / ethers.js)
- Transaction handling & error states
- IPFS & decentralized storage
- Deployment (Vercel)

### Resources:
22. **[wagmi Documentation](https://wagmi.sh/)** — React hooks untuk Ethereum (recommended)
23. **[viem Documentation](https://viem.sh/)** — TypeScript interface untuk Ethereum
24. **[RainbowKit](https://www.rainbowkit.com/)** — Best wallet connection UX
25. **[Alchemy University](https://www.alchemy.com/university)** — Free Web3 development course
26. **[thirdweb](https://thirdweb.com/learn)** — SDK + tutorials buat fullstack Web3

### ETHJKT Repos:
- `practice-todo-ui` — Fullstack todo app
- `erc20-factory-ui` — Token creation UI
- `simple-defi-ui` — DEX frontend
- `tugwar-game-ui` — Full dApp with wallet integration
- `ui-crypto-kitty` — NFT dApp
- `lisk-garden-dapp` — Blockchain game

---

## 🛡️ Fase 4: Security & DeFi Deep Dive (2-4 minggu)

**Tujuan:** Pahami attack vectors, DeFi mechanics, dan advanced patterns

### Topik:
- Common vulnerabilities (reentrancy, flash loans, oracle manipulation)
- DeFi primitives (AMM, lending, staking, bridges)
- Proxy patterns (UUPS, Transparent, Beacon)
- Gas optimization
- Smart contract auditing basics

### Resources:
27. **[Ethernaut by OpenZeppelin](https://ethernaut.openzeppelin.com/)** — Hacking challenges, belajar security sambil main
28. **[Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)** — DeFi security challenges
29. **[Secureum Bootcamp](https://secureum.substack.com/)** — Deep dive security
30. **[Uniswap V2 Source Code](https://github.com/Uniswap/v2-core)** — Baca ini, pahami AMM dari code-nya
31. **[Compound Protocol](https://github.com/compound-finance/compound-protocol)** — Lending protocol reference

### ETHJKT Repos:
- `simple-defi` — DEX/AMM
- `contracts-zk-age-verification` — ZK smart contracts
- `zk-age-verification` — ZK proofs

---

## 🚀 Fase 5: Specialization & Contribution (Ongoing)

**Tujuan:** Pilih spesialisasi dan mulai contribute ke ecosystem

### Track Options:
1. **DeFi Development** — Build AMMs, lending protocols, yield strategies
2. **Security & Auditing** — Audit smart contracts, bug bounties
3. **ZK Development** — Zero-knowledge proofs, privacy protocols
4. **Protocol Engineering** — Contribute ke Ethereum core (EIPs, execution clients)
5. **Full-Stack dApp** — Build production-grade applications

### Resources:
32. **[EIPs (Ethereum Improvement Proposals)](https://eips.ethereum.org/)** — Cara Ethereum berkembang
33. **[Ethereum Protocol Studies (EPS)](https://epf.wiki/)** — Pathway ke core contributor
34. **[0xPARC ZK Learning](https://learn.0xparc.org/)** — ZK circuit development
35. **[Code4rena](https://code4rena.com/)** — Competitive smart contract auditing
36. **[Immunefi](https://immunefi.com/)** — Bug bounty platform, dapet reward dari finding bugs

---

## 🛠️ Essential Tools

| Tool | Fungsi | Link |
|------|--------|------|
| MetaMask | Wallet | metamask.io |
| Remix | Browser IDE | remix.ethereum.org |
| Foundry | Dev toolkit (recommended) | getfoundry.sh |
| Hardhat | Dev toolkit (JS) | hardhat.org |
| Etherscan | Block explorer | etherscan.io |
| Scaffold-ETH 2 | Starter kit | scaffoldeth.io |
| Alchemy | Node provider | alchemy.com |
| Chainlink | Oracles & data feeds | chain.link |
| IPFS | Decentralized storage | ipfs.tech |
| The Graph | Indexing protocol | thegraph.com |

---

## 📅 Timeline Realistis

| Minggu | Fase | Milestone |
|--------|------|-----------|
| 1-3 | Fase 0 | JavaScript fundamentals solid |
| 4-5 | Fase 1 | Pahami Ethereum, punya wallet, kirim testnet tx |
| 6-9 | Fase 2 | Deploy smart contract pertama, bikin ERC-20 token |
| 10-13 | Fase 3 | Build & deploy full dApp |
| 14-17 | Fase 4 | Selesaikan Ethernaut, pahami DeFi |
| 18+ | Fase 5 | Mulai contribute, cari kerja, atau build project |

---

## 🎯 Tips dari ETHJKT

1. **Baca source code > nonton tutorial.** Setelah dasar-dasarnya paham, langsung baca Uniswap V2, Compound, OpenZeppelin.
2. **Deploy ke testnet setiap minggu.** Ga perlu perfect. Yang penting ship.
3. **Gabung komunitas.** ETHJKT ada study group mingguan. Belajar bareng > belajar sendiri.
4. **Build portfolio di GitHub.** Perusahaan Web3 liat GitHub lu, bukan ijazah lu.
5. **Konsisten > intense.** 2 jam sehari selama 3 bulan > 12 jam sehari selama 2 minggu terus burnout.

---

*Roadmap ini di-maintain oleh ETHJKT community. Kalau ada resource yang outdated atau mau suggest tambahan, open PR atau DM di Discord.*

*Last updated: March 2026*
