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

## 4. Phase 3 Proposal: Tower of Chains — Web3 & Smart Contract Development

### Overview

Phase 3 transforms students from fullstack Web2 developers into **Fullstack Web3 Developers**. Five weeks of hands-on Solidity, Foundry, testing, DeFi, NFTs, EIP analysis, and open source contribution.

**Prerequisites:** Completion of Phase 2 (all 5 weeks including Web3 frontend)

---

### Week 1: `phase-3-week1-solidity-fundamentals`

**"Selamat datang di Tower of Chains, Etherean! 🧙‍♂️"**

**Study Materials:**
- Blockchain fundamentals: blocks, transactions, gas, accounts (EOA vs contract)
- Solidity basics: types, visibility, storage vs memory vs calldata
- Contract structure: constructor, functions, modifiers, events
- Development environment: Foundry installation, forge, cast, anvil
- Your first contract: Counter, then TodoList
- Testing basics with forge test

**Logic Nolep:**
- **LN: Voting Contract** — Create a voting system with candidate registration, vote casting, and result tallying. Write 10+ tests.
- **LN: Piggy Bank** — Create a savings contract with deposit, withdraw (with time lock), and emergency break. Deploy to Monad Testnet.

**Arcane Quest (Quiz):**
- Part 1: Solidity syntax & types
- Part 2: Storage patterns
- Part 3: Deploy & interact via cast

---

### Week 2: `phase-3-week2-token-standards`

**Study Materials:**
- ERC-20 deep dive: implementation from scratch vs OpenZeppelin
- ERC-721 (NFT): metadata, tokenURI, enumerable
- ERC-1155 (Multi-token): batch operations, game items
- OpenZeppelin contracts: inheritance, AccessControl, Ownable
- Token economics: supply, minting, burning, allowances
- **EIP Reading Session:** Read EIP-20 and EIP-721 — understand the proposal process

**Logic Nolep:**
- **LN: Token Factory** — Build a factory contract that deploys custom ERC-20 tokens with configurable name, symbol, supply, and burn capability. Write comprehensive tests.
- **LN: NFT Collection** — Build an NFT contract with reveal mechanism, whitelist (Merkle proof), and royalties (EIP-2981). Deploy and mint on testnet.

**Arcane Quest:**
- Part 1: ERC-20 implementation
- Part 2: ERC-721 implementation
- Part 3: Read & summarize an EIP of your choice

---

### Week 3: `phase-3-week3-defi-mechanics`

**Study Materials:**
- DeFi fundamentals: AMM, liquidity pools, constant product formula (x*y=k)
- Building a simple DEX: swap, addLiquidity, removeLiquidity
- LP tokens and yield calculation
- Price oracles: Chainlink integration
- Flash loans concept
- Security: reentrancy, front-running, sandwich attacks
- **EIP Reading Session:** Read EIP-4626 (Tokenized Vaults)

**Logic Nolep:**
- **LN: Simple DEX** — Build an AMM DEX with two ERC-20 tokens, liquidity provision, and swap functionality with slippage protection and 0.3% fees. Full Foundry test suite with fuzzing.
- **LN: Staking Contract** — Build a staking system where users deposit tokens and earn rewards over time. Include emergency withdraw and admin functions.

**Arcane Quest:**
- Part 1: AMM math problems
- Part 2: Security audit quiz (spot the vulnerability)
- Part 3: Gas optimization challenge

---

### Week 4: `phase-3-week4-advanced-patterns`

**Study Materials:**
- Upgradeable contracts: proxy patterns (UUPS, Transparent)
- Multi-contract architectures: factory, diamond pattern
- Gas optimization: storage packing, calldata, assembly basics
- Events and indexing: building for frontends/indexers
- Cross-contract communication
- Foundry advanced: fuzzing, invariant testing, fork testing
- **EIP Reading Session:** Read EIP-2535 (Diamond Standard) or EIP-1967 (Proxy Storage)

**Logic Nolep:**
- **LN: Upgradeable Token** — Deploy a UUPS upgradeable ERC-20, then deploy V2 with new features. Prove the upgrade works via tests.
- **LN: Multi-Sig Wallet** — Build a multi-signature wallet requiring N-of-M approvals for transactions. Include proposal, approval, execution, and revocation.

**Arcane Quest:**
- Part 1: Proxy pattern quiz
- Part 2: Gas optimization challenge (refactor a wasteful contract)
- Part 3: Fork testing a live protocol

---

### Week 5: `phase-3-week5-capstone-and-contribution`

**Study Materials:**
- Smart contract security audit checklist
- Open source contribution guide: finding issues, writing PRs, code review etiquette
- Protocol analysis: pick a real protocol (Uniswap, Aave, Compound) and read its contracts
- Deployment to mainnet considerations: audits, monitoring, incident response
- Career paths: smart contract engineer, auditor, protocol developer
- **EIP Contribution:** Draft a mini-EIP (even if not submitted) — understand the format

**Logic Nolep:**
- **LN: Open Source PR** — Find a real open source Web3 project, identify an issue or improvement, and submit a PR. Document the process.
- **LN: Protocol Fork** — Fork a simple DeFi protocol (like Uniswap V2 core), deploy your own version on testnet, and write a detailed analysis of how it works.

**Final Capstone Project (Group):**
- Build a complete dApp from scratch: smart contracts + tests + frontend + deployment
- Suggested projects: DAO governance system, NFT marketplace, lending protocol, on-chain game
- Final presentation to community — demo + architecture walkthrough + security analysis
- **Live Code Session** — individual smart contract challenge (like Phase 0's final gate)

**Arcane Quest:**
- Part 1: Security audit a provided contract (find 5 bugs)
- Part 2: Write a technical blog post about something you learned
- Part 3: EIP draft exercise

---

### Phase 3 Summary Table

| Week | Topic | Key Project | EIP Study |
|------|-------|-------------|-----------|
| 1 | Solidity Fundamentals + Foundry | Voting Contract + Piggy Bank | — |
| 2 | Token Standards (ERC-20/721/1155) | Token Factory + NFT Collection | EIP-20, EIP-721 |
| 3 | DeFi Mechanics (AMM, Staking) | Simple DEX + Staking Contract | EIP-4626 |
| 4 | Advanced Patterns (Proxy, Gas, Multi-sig) | Upgradeable Token + Multi-Sig Wallet | EIP-2535/1967 |
| 5 | Capstone + Open Source Contribution | Protocol Fork + Group dApp + OSS PR | Draft a mini-EIP |

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
