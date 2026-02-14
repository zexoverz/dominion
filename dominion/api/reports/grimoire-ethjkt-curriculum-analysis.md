# GRIMOIRE Report: ETHJKT Curriculum Deep Analysis

> Generated: 2026-02-14 | Analyst: GRIMOIRE, Knowledge General of the Dominion

---

## 1. Full Curriculum Map

### 🗼 Phase 0: Tower of Foundation — JavaScript & Logic Fundamentals

**Duration:** 4 weeks + preparation + supplementary repos
**Language:** Bahasa Indonesia (全curriculum is in Indonesian)
**Target:** Complete beginners (even mobile-only learners)

| Week | Repo | Topics | Exercises |
|------|------|--------|-----------|
| Week 1 | `phase-0-week1-welcome-to-code` | Algorithm, pseudocode, variables, types, logical operators, conditionals (if/else, switch), loops (for, while), functions | 4 quiz parts + "Ujian Week1" exam |
| Week 2 | `phase-0-week2-array-and-logic` | Array basics, manipulation (push/pop/shift/unshift), iteration with loops, conditional logic in arrays | 3 quiz parts + "Ujian Week2" exam |
| Week 3 | `phase-0-week3-object-is-a-key` | Objects, properties, iteration, conditionals with objects, objects in functions | 3 quiz parts + "Ujian Week3" exam |
| Week 4 | `phase-0-week4-before-the-journey` | Recursion, Git branching, Regex. **Gate:** Must reach Codewars kyu 6 + live code session | 3 quiz parts + Final Live Code exam |
| Prep | `phase-0-preparation` | ES6 JavaScript, Web Development basics. **Gate to Phase 1** via PR review | 5 quizzes: ArrayDimension, NumberPattern, Recursive, Object, WebDev |
| Extra | `phase-0-code-in-mobile` | Termux setup, Neovim on Android — for students without laptops | Setup guide |
| Extra | `phase-0-basic-loop-quiz` | Supplementary loop drills: numbers, arrays, strings | Categorized exercises |

### 🗼 Phase 1: Tower of Shadows — Backend Development

**Duration:** 5 weeks
**Target:** Students who passed Phase 0 live code

| Week | Repo | Topics | Exercises |
|------|------|--------|-----------|
| Week 1 | `phase-1-week1-enhance-logic` | OOP, time complexity, searching algorithms, sorting algorithms, graph algorithms, Dijkstra's, Huffman coding, hashing, process.argv | "Logic Nolep" challenges for each topic |
| Week 2 | `phase-1-week2-backend-fundamental` | Backend fundamentals, MVC, Linux/WSL, Node.js modules, async JS, internal modules, JSON, CLI apps (Chalk) | LN: Encrypt/Decrypt, Async, Hospital Interface, CLI Game, CLI Chess |
| Week 3 | `phase-1-week3-backend-database` | SQL (SQLite), NoSQL (MongoDB), database design, race conditions, cloud databases, Express.js intro | LN: Warehouse SQL, Warehouse NoSQL, Database Design, Address Book |
| Week 4 | `phase-1-week4-backend-api` | Prisma ORM, Mongoose ODM, code standardization, logging (Winston), middleware, JWT, Helmet, CORS, Joi validation, Swagger docs | LN: Prisma Todo, Mongoose Todo, Inventory System |
| Week 5 | `phase-1-week5-backend-advance` | TypeScript, Bun.js, Elysia vs Hono, Drizzle ORM, WebSocket, Microservices (sync + async), Payment Gateway (Stripe) | LN: Chat Room, Movie Reservation (microservices + Stripe), Group Project |

### 🗼 Phase 2: Tower of Illusions — Frontend Development

**Duration:** 3 weeks (INCOMPLETE — should be 5)
**Target:** Students who passed Phase 1

| Week | Repo | Topics | Exercises |
|------|------|--------|-----------|
| Week 1 | `phase-2-week1-frontend-basic` | HTML, CSS, Flexbox, jQuery, DOM manipulation, AJAX, LocalStorage, Vercel deployment, **soft skills: presentation** | LN: Pet Shop, Inventory AJAX, Group Project Week1 |
| Week 2 | `phase-2-week2-reactjs` | React basics, Virtual DOM, components, hooks, lifecycle, React Router, state management intro | Study materials + LN challenges |
| Week 3 | `phase-2-week3-frontend-advance` | Vite, core hooks (useRef, useContext, useCallback, useMemo), advanced patterns, TanStack (Query, Router, Table, Form), Cypress testing, Redux, Stripe, Clerk auth | Study materials + LN challenges |

### 📦 Practice & Project Repos

| Repo | Type | Tech Stack | Curriculum Fit |
|------|------|-----------|---------------|
| `practice-todo-ui` | Practice | Next.js, TypeScript | Phase 2 follow-up: fullstack todo app frontend |
| `practice-todo-contract` | Practice | Solidity, Hardhat | Bridge to Web3: first smart contract experience |
| `erc20-factory-ui` | Workshop | React, Vite, Web3 | Workshop project: token creation UI |
| `simple-defi` | Workshop | Solidity, Foundry | DEX/AMM on Monad — DeFi fundamentals |
| `simple-defi-ui` | Workshop | React, TypeScript, Ethers.js | DEX frontend on Lisk Sepolia |
| `simple-defi-indexer` | Workshop | Indexer | Blockchain data indexing |
| `tugwar-game` | Workshop | Solidity, Foundry | On-chain game mechanics |
| `tugwar-game-ui` | Workshop | React, Wagmi, RainbowKit | Full dApp with wallet integration |
| `zk-age-verification` | Workshop | React, Circom, Wagmi | ZK proofs frontend |
| `contracts-zk-age-verification` | Workshop | Solidity, Foundry, Circom | ZK smart contracts |
| `monad-taskmanager` | Workshop | Solidity, Hardhat | Basic contract deployment |
| `monad-token-factory` | Workshop | Solidity, OpenZeppelin | ERC20 factory pattern |
| `foundry-monad-taskmanager` | Workshop | Solidity, Foundry | Foundry version of taskmanager |
| `campus-contracts` | Workshop | Solidity, Hardhat | Multi-contract system (StudentID, CourseBadge, CampusCredit) |
| `og-inft-monorepo` | Workshop | Solidity, Hono, React, ERC-7857 | Intelligent NFTs on 0G Network |
| `lisk-garden-dapp` | Workshop | Next.js 15, React 19, Panna SDK | Blockchain game on Lisk |
| `ui-crypto-kitty` | Workshop | React, Wagmi, Viem, RainbowKit | NFT breeding/collection dApp |
| `property-token-ui` | Workshop | React, Wagmi, Mantle | RWA tokenization platform |
| `eduloan-mantle-ui` | Workshop | React, Wagmi, RainbowKit, Mantle | DeFi education loan platform |
| `counter-stylus-contracts` | Workshop | Rust, Arbitrum Stylus | Non-EVM smart contracts |
| `ethjkt-multichain-faucet` | Infrastructure | Solidity, Foundry | Multi-chain faucet contracts |
| `services-ethjkt` | Infrastructure | Bun, Hono | Faucet backend service |
| `landing` | Website | Svelte | ETHJKT landing page |
| `ethjkt-course` | Docs | — | Master course overview (all 4 phases) |
| `fullstack-web3-roadmap` | Docs | — | Learning roadmap document |
| `docs-ethjkt` | Docs | — | Community documentation |
| `ethjkt-roadmap-2026` | Docs | — | 2026 strategic roadmap |

**Key finding:** The workshop/project repos are **standalone** — used in ETHJKT Onchain Day events, Campus workshops, and hackathon prep. They are NOT formally part of Phases 0-2 but serve as the practical foundation for the future Phase 3.

---

## 2. Teaching Style Analysis

### Patterns & Conventions

1. **Language:** All in Bahasa Indonesia with casual, motivational tone ("gua", "kalian", "ges")
2. **Naming:** `phase-{N}-week{N}-{topic-slug}` for curriculum repos
3. **Theming:** Harry Potter / wizard / sorcery metaphor throughout:
   - Students = "Etherean"
   - Quizzes = "Arcane Quest"
   - Hard challenges = "Logic Nolep" (LN)
   - Phases = "Towers" (Foundation, Shadows, Illusions, Chains)
4. **Structure per week:**
   - README.md with topic overview + motivational intro
   - `study-materials/` or `study_material/` folder with markdown lessons (part1.md, part2.md, etc.)
   - `quiz/` or `logic_nolep/` folder with coding challenges
   - Weekly exam ("Ujian") at the end
5. **Progressive difficulty:** Each week builds on the last with explicit links to next week
6. **Gates:** Phase transitions require completion evidence (Codewars kyu 6, live code, PR reviews)
7. **Community-driven:** Discord links everywhere, PR-based submissions, mentor review
8. **Group projects:** Introduced in Phase 1 Week 5 and Phase 2, building collaboration skills
9. **Soft skills:** Phase 2 adds presentation skills — not just code
10. **Real deployments:** Students deploy to Vercel (Phase 2), testnets (workshops)

### Exercise Format — "Logic Nolep" (LN)

The signature exercise format. Each LN:
- Has a themed scenario (Hospital, Warehouse, Chess, Inventory, etc.)
- Requires building a complete mini-project, not just solving algorithm puzzles
- Escalates from console apps → CLI apps → backend APIs → full frontends
- Submitted via PR for mentor review

---

## 3. Phase 2 Gap Analysis

### Current State: 3 weeks (should be 5)

Phase 2 covers HTML/CSS/jQuery → React basics → React advanced. But comparing to Phase 0 (4 weeks + prep) and Phase 1 (5 weeks), **Phase 2 is missing 2 weeks**.

### What's Missing

| Gap | Expected Topic | Why It's Critical |
|-----|---------------|-------------------|
| **Week 4: Web3 Frontend Integration** | Wallet connection (wagmi/viem), reading smart contracts from React, writing transactions, handling chain switching | This is the bridge from Web2 to Web3 — without it, students can't build dApps |
| **Week 5: Fullstack dApp Capstone** | End-to-end dApp project connecting React frontend to deployed smart contract, deployment to Vercel + testnet, final presentation | Phase 0 has a live code final, Phase 1 has a group project — Phase 2 needs its capstone |

### Specific Missing Topics

1. **Wallet connection** — wagmi, viem, RainbowKit (used in ALL workshop repos but never taught)
2. **Smart contract interaction from frontend** — reading state, sending transactions, handling events
3. **Web3 state management** — TanStack Query with contract reads, optimistic updates
4. **Multi-chain support** — switching networks, chain configuration
5. **IPFS/decentralized storage** — uploading metadata, NFT images
6. **Frontend deployment with Web3** — environment variables for contract addresses, RPC URLs
7. **Final project/capstone** — a complete dApp from scratch

### Recommended Phase 2 Completion Plan

**Add these 2 weeks:**

#### Phase 2 Week 4: `phase-2-week4-web3-frontend`
- wagmi v2 + viem setup
- RainbowKit wallet connection
- Reading contract state (useReadContract)
- Writing transactions (useWriteContract)
- Event listening and real-time updates
- Chain switching and network management
- **LN: Build a Token Dashboard** — connect wallet, display balances, transfer tokens
- **LN: Build an NFT Gallery** — read NFT metadata, display collection

#### Phase 2 Week 5: `phase-2-week5-fullstack-dapp`
- Connecting frontend to backend API + smart contract
- Environment management for multi-chain deployment
- IPFS integration (Pinata/web3.storage)
- Frontend testing with contract mocks
- Deployment pipeline: Vercel + testnet
- **Group Project: Build a complete dApp** (e.g., simple DEX UI, NFT marketplace, or voting app)
- **Final Presentation** — demo + code review

---

## 4. Phase 3 Redesign: Tower of Chains — Smart Contract Development (Hackathon & Job Ready)

> ⚠️ **REDESIGNED 2026-02-14** — Previous version focused on EIP editing and protocol contributions. Replaced with practical, employment-focused track per Lord Zexo's directive.

### Overview

Phase 3 transforms students from fullstack Web2 developers into **employable Web3 developers who can win hackathons**. Five weeks of hands-on Solidity, Foundry, DeFi, security, and a full hackathon simulation.

**Goal:** Students graduate able to:
- Apply for Solidity/Web3 developer jobs
- Compete (and win) at ETHGlobal and similar hackathons
- Build and deploy production-quality smart contracts
- Have a portfolio of deployed projects on their GitHub

**Prerequisites:** Completion of Phase 2 (all 5 weeks including Web3 frontend integration)

**What this is NOT:** This is not a protocol research track. No EIP editing, no protocol-level contributions. This is a builder track.

---

### Week 1: `phase-3-week1-solidity-fundamentals`

**"Selamat datang di Tower of Chains, Etherean! 🧙‍♂️ Di tower ini, kalian bakal nulis smart contract pertama kalian. Bukan cuma baca — tapi DEPLOY dan TEST. Let's go!"**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | Blockchain recap: blocks, txs, gas, accounts (EOA vs contract) | [Cyfrin Updraft — Blockchain Basics](https://updraft.cyfrin.io/courses/blockchain-basics) |
| 2 | Solidity basics: types (uint, address, bool, bytes, string, arrays, mappings, structs, enums) | [Solidity by Example](https://solidity-by-example.org/) |
| 3 | Functions: visibility (public/external/internal/private), view/pure, payable | [Cyfrin Updraft — Solidity Fundamentals](https://updraft.cyfrin.io/courses/solidity) |
| 4 | Modifiers, events, custom errors, require/revert | [Patrick Collins — Learn Solidity](https://www.youtube.com/watch?v=umepbfKp5rI) |
| 5 | Storage vs memory vs calldata | [Solidity Docs — Data Location](https://docs.soliditylang.org/en/latest/types.html#data-location) |
| 6 | Foundry setup: forge, cast, anvil | [Foundry Book](https://book.getfoundry.sh/) |
| 7 | Writing your first test with `forge test` | [Cyfrin Updraft — Foundry Fundamentals](https://updraft.cyfrin.io/courses/foundry) |
| 8 | Deploying to local anvil + testnet | [Foundry Book — Deploying](https://book.getfoundry.sh/forge/deploying) |

#### Logic Nolep

**LN: On-Chain Registry 📜**
> Build a smart contract "Buku Sihir" (Spell Book) — an on-chain registry where users can register their wizard name, store a list of spells, and look up other wizards. Requirements:
> - Register with a unique wizard name (revert if taken)
> - Add spells to your profile (max 10)
> - View any wizard's spell list
> - Event emitted on registration and spell addition
> - 10+ unit tests with Foundry
> - Deploy to Monad Testnet
>
> **Submit:** PR with contract code, tests, deployment script, and testnet contract address in README.

#### Arcane Quest (Quiz)
- Part 1: Solidity syntax & types
- Part 2: Storage patterns & gas concepts
- Part 3: Deploy & interact via `cast`

---

### Week 2: `phase-3-week2-token-standards`

**"Etherean, minggu ini kalian bakal bikin token dan NFT kalian sendiri. Bukan pake wizard GUI — kalian NULIS sendiri dari nol. OpenZeppelin jadi senjata rahasia kalian. 🪄"**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | ERC-20: the fungible token standard — implement from scratch, then with OpenZeppelin | [OpenZeppelin ERC-20 Docs](https://docs.openzeppelin.com/contracts/5.x/erc20) |
| 2 | ERC-721: NFTs — metadata, tokenURI, enumerable | [OpenZeppelin ERC-721 Docs](https://docs.openzeppelin.com/contracts/5.x/erc721) |
| 3 | ERC-1155: multi-token — batch ops, game items, SFTs | [OpenZeppelin ERC-1155 Docs](https://docs.openzeppelin.com/contracts/5.x/erc1155) |
| 4 | OpenZeppelin contracts: inheritance, AccessControl, Ownable, Pausable | [OpenZeppelin Wizard](https://wizard.openzeppelin.com/) |
| 5 | Testing with Foundry: unit tests, fuzz tests, test helpers | [Cyfrin Updraft — Advanced Foundry](https://updraft.cyfrin.io/courses/advanced-foundry) |
| 6 | Token economics basics: supply, mint, burn, allowances | [Patrick Collins — ERC-20 Deep Dive](https://www.youtube.com/watch?v=umepbfKp5rI) |
| 7 | Merkle proofs for whitelists | [Solidity by Example — Merkle Tree](https://solidity-by-example.org/app/merkle-tree/) |

#### Logic Nolep

**LN: Token Forge ⚒️**
> Create your own ERC-20 token "EthereanCoin" with:
> - Configurable name, symbol, initial supply
> - Minting (owner only) and burning (any holder)
> - Pausable transfers (emergency stop)
> - 15+ tests including fuzz tests for transfer amounts
> - Deploy to testnet

**LN: NFT Koleksi Sihir 🖼️**
> Build an NFT collection "Etherean Artifacts" with:
> - Max supply of 100
> - Whitelist minting via Merkle proof (first 24h)
> - Public mint after whitelist phase
> - Reveal mechanism (hidden metadata → reveal)
> - Royalties via EIP-2981
> - 15+ tests including edge cases
> - Deploy to testnet and mint at least 3 NFTs

#### Arcane Quest
- Part 1: ERC-20 implementation quiz
- Part 2: ERC-721 implementation quiz
- Part 3: Spot the bug in token contracts

---

### Week 3: `phase-3-week3-defi-building-blocks`

**"Welcome to DeFi week, Etherean! 💰 Kalian bakal belajar gimana Uniswap kerja, bikin staking contract sendiri, dan connect semuanya ke frontend dari Phase 2."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | How AMMs work: constant product formula (x*y=k), Uniswap V2 math | [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf) |
| 2 | Liquidity pools: adding/removing liquidity, LP tokens, impermanent loss | [Finematics — Liquidity Pools](https://www.youtube.com/watch?v=cizLhxSKrAc) |
| 3 | Staking contracts: deposit, reward calculation, time-weighted distribution | [Cyfrin Updraft — DeFi](https://updraft.cyfrin.io/) |
| 4 | Flash loans: concept, use cases, implementation | [Aave Flash Loans Docs](https://docs.aave.com/developers/guides/flash-loans) |
| 5 | Price oracles: Chainlink integration | [Chainlink Docs — Data Feeds](https://docs.chain.link/data-feeds) |
| 6 | Connecting contracts to React frontend (from Phase 2) | Reference: `simple-defi-ui`, `tugwar-game-ui` repos |

#### Logic Nolep

**LN: Staking dApp — Etherean Vault 🏦**
> Build a complete staking dApp (contract + frontend):
> - Users stake ERC-20 tokens, rewards accrue per second
> - Claim rewards, unstake, emergency withdraw
> - Frontend: connect wallet, display balances, stake/unstake/claim
> - 20+ tests including fuzz tests
> - Deploy contracts to testnet, frontend to Vercel

#### Arcane Quest
- Part 1: AMM math problems (calculate swap output, price impact)
- Part 2: Staking reward calculation scenarios
- Part 3: Flash loan attack scenario analysis

---

### Week 4: `phase-3-week4-security-and-gas`

**"Etherean, minggu ini kalian jadi auditor. 🔍 Kalian bakal belajar gimana hacker nyerang smart contract — dan gimana cara defend."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | Reentrancy attacks: classic, cross-function, cross-contract | [Cyfrin Updraft — Security & Auditing](https://updraft.cyfrin.io/courses/security) |
| 2 | Integer overflow (pre-0.8) and precision loss | [SWC Registry](https://swcregistry.io/) |
| 3 | Front-running and sandwich attacks: mempool, MEV | [Flashbots Docs](https://docs.flashbots.net/) |
| 4 | Access control vulnerabilities: tx.origin, missing modifiers | [OpenZeppelin — Access Control](https://docs.openzeppelin.com/contracts/5.x/access-control) |
| 5 | Slither static analysis | [Slither GitHub](https://github.com/crytic/slither) |
| 6 | Gas optimization: storage packing, calldata vs memory, unchecked blocks | [RareSkills — Gas Optimization](https://www.rareskills.io/post/gas-optimization) |
| 7 | Common patterns: checks-effects-interactions, pull over push, ReentrancyGuard | [Solidity Patterns](https://fravoll.github.io/solidity-patterns/) |

#### Logic Nolep

**LN: Bug Hunter 🐛**
> Receive 5 intentionally vulnerable contracts (inspired by Damn Vulnerable DeFi). For each: write an exploit test, fix the vulnerability, run Slither, write an audit report.

**LN: Gas Wizard ⛽**
> Optimize an unoptimized contract from ~50,000 gas to under 30,000 gas per core function. Document every optimization with `forge test --gas-report`.

#### Arcane Quest
- Part 1: Identify vulnerabilities in code snippets
- Part 2: Gas optimization quiz
- Part 3: Write a security checklist for a given contract

---

### Week 5: `phase-3-week5-hackathon-simulation`

**"Etherean, ini minggu terakhir di Tower of Chains! 🏆 Saatnya BUKTIIN. 48 jam buat bikin dApp dari nol — hackathon simulation."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | How to win hackathons: ideation, MVP mindset, time management | [ETHGlobal](https://ethglobal.com/) |
| 2 | Rapid prototyping: Scaffold-ETH 2, templates | [Scaffold-ETH 2](https://scaffoldeth.io/) |
| 3 | Pitching your project: demo structure, storytelling | Previous ETHJKT Onchain Day presentations |
| 4 | Web3 developer portfolio: GitHub profile, deployed projects, README quality | [web3.career](https://web3.career/) |
| 5 | Mock interview prep: common Solidity interview questions | [RareSkills — Solidity Interview](https://www.rareskills.io/post/solidity-interview-questions) |
| 6 | Job hunting: web3.career, crypto.jobs, ETHGlobal showcase | [crypto.jobs](https://crypto.jobs/) |

#### Hackathon Simulation (48 jam)
- Teams of 2-3, Friday→Sunday
- Build a complete dApp: contracts + frontend + deployment
- Present in 5 min + 3 min Q&A
- Judged on: Innovation (25%), Technical (30%), Completeness (20%), Presentation (15%), Code Quality (10%)

#### Logic Nolep

**LN: Portfolio Assembly 📂** — Update GitHub profile, pin best repos, write blog post, prepare 10 interview answers.

**LN: Hackathon Project 🚀** — The hackathon simulation project itself.

#### Final Demo Day 🎪
- Team presentations, community voting
- Certificate of completion
- Top projects featured on ETHJKT landing page

---

### Phase 3 Summary Table

| Week | Topic | Key Build | Skills Gained |
|------|-------|-----------|---------------|
| 1 | Solidity Fundamentals + Foundry | On-Chain Registry | Solidity, Foundry, testing, deployment |
| 2 | Token Standards + Real Contracts | ERC-20 Token + NFT Collection | Token standards, OpenZeppelin, fuzz testing |
| 3 | DeFi Building Blocks | Staking dApp (contract + frontend) | AMM math, staking, full-stack dApp |
| 4 | Security + Gas Optimization | Bug hunting + gas optimization | Auditing, Slither, vulnerability patterns |
| 5 | Hackathon Simulation + Portfolio | Complete dApp (48h) + portfolio | Hackathon skills, interviewing, job readiness |

### Graduate Profile — "Etherean Unchained 🔓"

- ✅ Write, test, and deploy Solidity smart contracts with Foundry
- ✅ Implement ERC-20, ERC-721, ERC-1155 tokens
- ✅ Build DeFi primitives (staking, AMM concepts)
- ✅ Identify and fix common smart contract vulnerabilities
- ✅ Optimize gas usage
- ✅ Build a complete dApp (contracts + frontend + deployment)
- ✅ Compete in hackathons with confidence
- ✅ Apply for Web3 developer positions with a strong portfolio

---

## 5. Recommended Phase 2 Completion Plan

### Priority: HIGH — Phase 2 must be completed before Phase 3 launches

**Timeline:** 2-3 weeks to create content

| Action | Effort | Priority |
|--------|--------|----------|
| Create `phase-2-week4-web3-frontend` repo | 1 week | 🔴 Critical |
| Create `phase-2-week5-fullstack-dapp` repo | 1 week | 🔴 Critical |
| Update `ethjkt-course` README with Week 4-5 links | 1 hour | 🔴 Critical |
| Backfill Phase 2 Week 3 study materials (README mentions topics but `## Week 3 Study Material` section is empty) | 2-3 days | 🟡 High |
| Create `foundry-guide` README (currently empty) | 1 day | 🟡 High |
| Standardize folder naming (`study-materials` vs `study_material`) | 1 hour | 🟢 Low |

### Content Reuse from Existing Repos

The workshop repos already contain excellent material that can be referenced:
- `tugwar-game-ui` → Perfect example for wagmi/RainbowKit integration (Week 4)
- `simple-defi-ui` → DEX frontend with ethers.js (Week 4)
- `zk-age-verification` → Wagmi + Circom integration (Week 4 advanced)
- `ui-crypto-kitty` → NFT dApp with full Wagmi/Viem stack (Week 5 reference)
- `erc20-factory-ui` → Token interaction UI (Week 4)

These repos serve as "answer keys" — students build similar projects from scratch in Week 4-5.

---

## Appendix: Repo Classification

### Curriculum (Sequential)
- Phase 0: 7 repos (4 weeks + prep + mobile + loop quiz)
- Phase 1: 5 repos (5 weeks)
- Phase 2: 3 repos (3 weeks — **incomplete**)

### Workshop/Event Projects: 16 repos
Used in ETHJKT Onchain Day, Campus workshops, hackathon prep. Standalone.

### Infrastructure: 3 repos
Landing page, faucet contracts, faucet backend.

### Documentation: 4 repos
Course overview, roadmap, docs, 2026 roadmap.

---

*Report complete. The curriculum is excellent — well-structured, motivational, and practical. Phase 2 needs 2 more weeks to bridge Web2→Web3 frontend. Phase 3 is ready to be built.*

— GRIMOIRE 🧙‍♂️
