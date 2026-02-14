# 📜 GRIMOIRE — Ethereum Contribution Research Report
**Compiled:** 2026-02-14 | **For:** Lord Zexo (Muhammad Faisal Firdani)

---

## Table of Contents
1. [Top 10 EIPs to Study & Contribute To](#1-top-10-eips-to-study--contribute-to)
2. [Open Source Contribution Opportunities](#2-open-source-contribution-opportunities)
3. [Reputation Building Strategy](#3-reputation-building-strategy)
4. [ETHJKT Course Content](#4-ethjkt-course-content)

---

## 1. Top 10 EIPs to Study & Contribute To

### 1. EIP-7702 — Set Code for EOAs
- **Status:** Final (included in Pectra)
- **What it does:** Allows EOAs to temporarily delegate to smart contract code via a new tx type, enabling account abstraction features for existing wallets.
- **Why relevant to Zexo:** Directly impacts DEX UX — GrimSwap users could batch approve+swap in one tx. ZK wallet patterns become possible for EOAs.
- **How to contribute:** Build reference implementations of delegate contracts for DEX interactions, write security analysis articles, create GrimSwap-compatible 7702 modules.

### 2. ERC-4337 — Account Abstraction Using Alt Mempool
- **Status:** Review (Draft→Review)
- **What it does:** Full account abstraction without consensus changes — UserOperations, bundlers, paymasters, and smart contract wallets.
- **Why relevant to Zexo:** GrimSwap can integrate paymasters for gasless ZK swaps. Huge ecosystem being built around this.
- **How to contribute:** Build a paymaster for DEX operations, contribute to the reference EntryPoint contract, write test suites for edge cases, submit ERC-4337 extensions.

### 3. ERC-7683 — Cross Chain Intents Standard
- **Status:** Draft
- **What it does:** Standardizes cross-chain intent-based trading with common order structs and settlement interfaces. Created by Uniswap/Across teams.
- **Why relevant to Zexo:** Directly applicable to GrimSwap's cross-chain ambitions. ZK proofs can verify cross-chain fills. Aligns with DEX infrastructure.
- **How to contribute:** Implement the standard in GrimSwap, propose ZK-proof-based settlement verification, participate in Ethereum Magicians discussions.

### 4. EIP-7594 — PeerDAS (Peer Data Availability Sampling)
- **Status:** Draft (targeted for Fusaka upgrade)
- **What it does:** Scales data availability via DAS — nodes sample subsets of blob data using erasure coding, enabling L2s to post more data cheaply.
- **Why relevant to Zexo:** Cheaper L2 data = cheaper ZK proof posting for GrimSwap. Understanding DAS positions Zexo as protocol-level contributor.
- **How to contribute:** Write educational content, help with test vectors, contribute to client implementations, build tooling to measure PeerDAS impact on L2 costs.

### 5. EIP-7685 — General Purpose Execution Layer Requests
- **Status:** Final (Pectra)
- **What it does:** Creates a general framework for smart-contract-triggered requests from EL to CL (validator deposits, withdrawals, consolidations).
- **Why relevant to Zexo:** Understanding EL↔CL communication is crucial for protocol-level contributions. Foundation for future protocol features.
- **How to contribute:** Write explainer articles, build monitoring tools, propose new request types.

### 6. EIP-4844 — Shard Blob Transactions (Proto-Danksharding)
- **Status:** Final (Dencun)
- **What it does:** Introduced blob-carrying transactions for L2 data availability at reduced cost. Foundation for full danksharding.
- **Why relevant to Zexo:** GrimSwap on L2 benefits directly. Understanding blob economics and KZG commitments essential for ZK engineer.
- **How to contribute:** Build blob analytics tools, optimize L2 contracts for blob data, write educational content about KZG and polynomial commitments.

### 7. ERC-7579 — Minimal Modular Smart Accounts
- **Status:** Draft
- **What it does:** Defines a minimal interface for modular smart accounts — composable modules for execution, validation, hooks, and fallbacks.
- **Why relevant to Zexo:** Build GrimSwap as a module that smart accounts can plug in. ZK validation modules are a greenfield opportunity.
- **How to contribute:** Build DEX execution modules, create ZK validation plugins, write reference implementations and tests.

### 8. EIP-7251 — Increase MAX_EFFECTIVE_BALANCE
- **Status:** Final (Pectra)
- **What it does:** Raises validator max effective balance from 32 ETH to 2048 ETH, enabling validator consolidation.
- **Why relevant to Zexo:** Protocol-level understanding; staking infrastructure is adjacent to DeFi. Shows depth of protocol knowledge.
- **How to contribute:** Build validator consolidation tooling, write analysis of economic implications, contribute test cases.

### 9. ERC-6900 — Modular Smart Contract Accounts (Alchemy)
- **Status:** Draft
- **What it does:** Standard for modular account abstraction — defines plugin architecture for smart contract accounts.
- **Why relevant to Zexo:** Competing/complementary to ERC-7579. Building plugins for both standards gives broad AA ecosystem presence.
- **How to contribute:** Build DEX-specific plugins, ZK-auth modules, review and comment on the specification.

### 10. EIP-7691 — Blob Throughput Increase
- **Status:** Final (Pectra)
- **What it does:** Increases blob count per block (target from 3→6, max from 6→9), directly scaling L2 data throughput.
- **Why relevant to Zexo:** More blobs = cheaper L2 operations for GrimSwap. Understanding blob economics helps optimize ZK DEX costs.
- **How to contribute:** Analyze impact on L2 costs, build dashboards tracking blob usage, write about implications for ZK rollups.

---

## 2. Open Source Contribution Opportunities

### High-Impact Repos & Issues to Target

#### ethereum/EIPs
1. **EIP editing and formatting PRs** — The EIPs repo always needs help fixing formatting, broken links, and metadata. Low barrier, high visibility.
   - URL: `https://github.com/ethereum/EIPs/issues`
   - Look for: `e-review` labeled PRs that need editorial review

2. **Write reference implementations for Draft EIPs** — Many Draft EIPs lack reference implementations in Solidity.
   - Pick any Draft ERC and build the reference: `https://eips.ethereum.org/all`

#### OpenZeppelin/openzeppelin-contracts
3. **Account abstraction utilities** — OZ is actively building AA support. Contribute helpers, extensions, or test coverage.
   - URL: `https://github.com/OpenZeppelin/openzeppelin-contracts/labels/good%20first%20issue`

4. **Gas optimization PRs** — Find functions that can be optimized with assembly or better storage patterns. OZ reviews these carefully and they get visibility.
   - URL: `https://github.com/OpenZeppelin/openzeppelin-contracts/issues`

5. **Documentation improvements** — OZ docs always need examples, especially for newer features (Governor, AccessManager).
   - URL: `https://github.com/OpenZeppelin/openzeppelin-contracts/labels/documentation`

#### ethereum/solidity
6. **Compiler bug fixes tagged "good first issue"** — Solidity compiler has well-labeled beginner issues.
   - URL: `https://github.com/ethereum/solidity/labels/good%20first%20issue`
   - Focus on: documentation, error message improvements, SMTChecker

#### Uniswap Repos
7. **v4-core hooks contributions** — Uniswap v4 hooks are a hot area. Write novel hook implementations.
   - URL: `https://github.com/Uniswap/v4-core`
   - Build: ZK-verified price oracle hooks, privacy hooks for GrimSwap patterns

8. **v4-periphery** — Helper contracts need testing and optimization.
   - URL: `https://github.com/Uniswap/v4-periphery/issues`

#### Other Key Repos
9. **eth-infinitism/account-abstraction** — The ERC-4337 reference implementation. Contribute tests, gas optimizations, or paymaster examples.
   - URL: `https://github.com/eth-infinitism/account-abstraction`

10. **privacy-scaling-explorations (PSE)** — Ethereum Foundation's ZK research group. Multiple repos need contributors.
    - URL: `https://github.com/privacy-scaling-explorations`
    - Focus on: semaphore, bandada, maci — all ZK circuits that align with Zexo's skills

---

## 3. Reputation Building Strategy

### The Path: Random Contributor → EF-Recognized

#### Phase 1: Establish Presence (Months 1-3)
- **Target:** 4-6 merged PRs per month across 2-3 repos
- **Focus repos:** OpenZeppelin, ethereum/EIPs, PSE repos
- **Actions:**
  - Fix bugs, improve docs, add test coverage
  - Comment thoughtfully on EIP discussions on Ethereum Magicians
  - Start a blog/mirror.xyz documenting EIP analyses
  - Publish 2 articles analyzing EIPs relevant to ZK/DEX

#### Phase 2: Become Known (Months 3-6)
- **Target:** 3-4 meaningful PRs per month + 1 original contribution
- **Focus:** Write a Draft EIP or ERC (e.g., ZK-DEX standard, privacy-preserving swap interface)
- **Actions:**
  - Present at Ethereum Magicians or EIP office hours
  - Submit talks to ETHGlobal, Devcon, Devconnect
  - Build a reference implementation for an existing Draft EIP
  - Engage regularly on Ethereum R&D Discord

#### Phase 3: Get Recognized (Months 6-12)
- **Target:** Become a regular contributor to 1-2 core repos
- **Actions:**
  - Co-author an EIP with an established contributor
  - Apply for EF grants (Ecosystem Support Program, PSE grants)
  - Get invited as EIP reviewer/editor
  - Run ETHJKT hackathons focused on EIP implementations

### Which Repos Give Most Visibility
1. **ethereum/EIPs** — Every merged PR is visible to the entire ecosystem
2. **OpenZeppelin/openzeppelin-contracts** — Industry standard, high star count
3. **privacy-scaling-explorations/**** — Direct EF visibility
4. **ethereum/go-ethereum** or **ethereum/consensus-specs** — Core protocol, highest prestige
5. **Uniswap/v4-core** — DeFi visibility

### Recommended Contribution Cadence
- **Minimum:** 2 PRs/month (won't move the needle fast enough)
- **Optimal:** 6-8 PRs/month (mix of small fixes + 1-2 substantial contributions)
- **Visibility multiplier:** 1 blog post or tweet thread per week analyzing an EIP or your contribution

### Leveraging ETHJKT (900+ Members)
- **Contribution Sprints:** Monthly "EIP Implementation Sprint" where ETHJKT members collectively implement reference code for Draft EIPs. Tag the community in PRs.
- **Community Reviews:** Have ETHJKT members review and test EIP implementations before submitting PRs. More eyes = higher quality.
- **Collaborative EIP Authorship:** Draft EIPs as a community (e.g., "Standards for ZK-DEX on Ethereum" co-authored by ETHJKT contributors).
- **Hackathons → PRs Pipeline:** Every ETHJKT hackathon should produce at least 3-5 upstream contributions.
- **EF Ambassador:** Position ETHJKT as an EF-adjacent community. Apply for EF Community grants for ETHJKT operations.

### Key People to Engage With
| Person | Role | Where to Engage |
|--------|------|-----------------|
| **Tim Beiko** | EF Protocol Support | AllCoreDevs calls, Twitter |
| **Sam Wilson (@SamWilsn)** | EIP Editor | ethereum/EIPs repo, Ethereum Magicians |
| **Yoav Weiss** | ERC-4337 lead | Account abstraction forums |
| **Vitalik Buterin** | Protocol research | Ethereum Magicians, ethresear.ch |
| **Francisco Giordano (@frangio)** | OpenZeppelin lead | OZ GitHub, Twitter |
| **Barry WhiteHat** | PSE/ZK research | PSE repos, Ethereum R&D Discord |
| **Aya Miyaguchi** | EF Executive Director | Devcon, EF events |
| **Josh Stark** | EF Ecosystem Support | ESP applications |
| **lightclient** | Geth core dev, EIP author | AllCoreDevs, ethereum/EIPs |
| **Dankrad Feist** | EF Researcher (DAS, blobs) | ethresear.ch, Twitter |

### Quick Wins for Immediate Visibility
1. Write a comprehensive Mirror article: "Implementing ERC-7683 Cross-Chain Intents for ZK DEXs"
2. Submit a PR to PSE's semaphore repo
3. Open a Draft EIP for "ZK-Verified Cross-Chain Swap Standard"
4. Present "ZK DEX Architecture" at an Ethereum Magicians session

---

## 4. ETHJKT Course Content

### Phase 3 Course: Advanced Ethereum Protocol Engineering

**Duration:** 8 weeks, 2 sessions/week
**Prerequisites:** Solid Solidity, built at least 1 DeFi project

| Week | Topic | Key Concepts |
|------|-------|-------------|
| 1 | **The EVM Deep Dive** | Opcodes, stack machine, memory/storage layout, gas mechanics, bytecode analysis |
| 2 | **Ethereum Consensus & State** | Beacon chain, slots/epochs, state trie (MPT→Verkle), execution vs consensus layer |
| 3 | **EIP Process & Protocol Upgrades** | How EIPs work, AllCoreDevs process, hard fork mechanics, reading & writing EIPs |
| 4 | **Account Abstraction (4337 + 7702)** | UserOps, bundlers, paymasters, smart accounts, building AA-compatible dApps |
| 5 | **L2 Architecture & Data Availability** | Rollups (optimistic vs ZK), blob transactions (4844), PeerDAS (7594), L2 economics |
| 6 | **ZK Proofs for Ethereum** | SNARKs vs STARKs, KZG commitments, Groth16, PLONK, building ZK circuits for Ethereum |
| 7 | **MEV, Flashbots & Transaction Ordering** | MEV extraction, PBS (proposer-builder separation), Flashbots Protect, MEV-resistant DEX design |
| 8 | **Contributing to Ethereum Core** | Setting up client dev environment, writing EIPs, contributing to go-ethereum/reth, testing framework |

**Hands-on Projects:**
- Week 2: Build a state proof verifier in Solidity
- Week 4: Deploy a paymaster contract for gasless transactions
- Week 6: Build a simple ZK circuit and verify on-chain
- Week 8: Submit an actual PR to an Ethereum repo

---

### Secret Phase: "The Arcane Protocol"

**Concept:** An invite-only advanced track for ETHJKT's top graduates. Application-based (must have completed Phase 3 + submitted at least 1 open source PR).

**What makes it special:**
- Direct mentorship from Zexo and guest speakers from EF/protocol teams
- Members co-author EIPs together
- Builds a "core contributor" pipeline from Indonesia to Ethereum

**Curriculum (12 weeks):**

| Week | Module | Description |
|------|--------|-------------|
| 1-2 | **Cryptography Foundations** | Elliptic curves, pairings, hash functions, commitment schemes — the math behind Ethereum |
| 3-4 | **ZK Circuit Engineering** | Circom/Halo2/Noir, building production ZK circuits, optimization techniques |
| 5-6 | **Protocol Research & Writing** | How to write research posts for ethresear.ch, reading Ethereum specs, formal verification basics |
| 7-8 | **Client Development** | Pick geth or reth, build a small feature/fix, understand the codebase |
| 9-10 | **EIP Workshop** | Each student drafts an EIP/ERC. Peer review. Prepare for submission. |
| 11-12 | **Capstone: Open Source Sprint** | 2-week sprint where each participant submits PRs to major Ethereum repos. Tracked on leaderboard. |

**Exclusive Perks:**
- Private Telegram/Discord with Ethereum core devs (invite connections over time)
- Collaborative research papers published under ETHJKT
- Priority for EF grant applications (mentored by Zexo)
- "Arcane Protocol Graduate" NFT credential

**Differentiation from other communities:**
- No other Web3 community in SEA has a protocol-level contribution pipeline
- Focus on DOING (PRs, EIPs) not just LEARNING (tutorials)
- Direct path from student → recognized Ethereum contributor

---

### Newbie Session: "Web3 from Zero"

**Duration:** 10 sessions (1 per week, 2-3 hours each)
**Target:** Complete beginners — knows basic programming, zero blockchain knowledge

---

#### Session 1: "What Even Is Blockchain?"
**Learning Objectives:**
- Understand why blockchain exists (trust problem)
- Know the difference between Web1, Web2, Web3
- Explain what Ethereum is in simple terms

**Hands-on Project:** Set up MetaMask, get testnet ETH from a faucet, send a transaction. Explore it on Etherscan.

---

#### Session 2: "Your First Smart Contract"
**Learning Objectives:**
- Understand what smart contracts are
- Write basic Solidity (variables, functions, modifiers)
- Deploy using Remix IDE

**Hands-on Project:** Deploy a "Hello World" contract that stores and retrieves a message. Deploy to Sepolia testnet.

---

#### Session 3: "Solidity Fundamentals"
**Learning Objectives:**
- Data types, arrays, mappings, structs
- Control flow, events, errors
- Visibility and access control basics

**Hands-on Project:** Build a simple "Todo List" contract — add items, mark complete, emit events.

---

#### Session 4: "Tokens — The Building Blocks"
**Learning Objectives:**
- What are ERC-20 tokens and why they matter
- Understand token contracts (mint, transfer, approve, allowance)
- Brief intro to ERC-721 (NFTs)

**Hands-on Project:** Create your own ERC-20 token using OpenZeppelin. Deploy and interact via Remix.

---

#### Session 5: "Frontend Meets Blockchain"
**Learning Objectives:**
- Connecting a web app to Ethereum (ethers.js / viem)
- Reading from and writing to smart contracts
- Handling wallet connections (wagmi/RainbowKit)

**Hands-on Project:** Build a simple React frontend that connects to MetaMask, shows your token balance, and lets you transfer tokens.

---

#### Session 6: "Building with Hardhat/Foundry"
**Learning Objectives:**
- Professional development environment setup
- Writing and running tests
- Deployment scripts and verification

**Hands-on Project:** Migrate the token project to Foundry. Write 5+ unit tests. Deploy with a script.

---

#### Session 7: "DeFi Basics — Build a Simple DEX"
**Learning Objectives:**
- AMM concept (x*y=k)
- Liquidity pools and swaps
- Price impact and slippage

**Hands-on Project:** Build a minimal constant-product AMM (2 tokens, add liquidity, swap). Test with Foundry.

---

#### Session 8: "Security & Best Practices"
**Learning Objectives:**
- Common vulnerabilities (reentrancy, overflow, access control)
- Using OpenZeppelin safely
- Basic auditing mindset

**Hands-on Project:** Find and fix bugs in 3 intentionally vulnerable contracts. Use Slither for static analysis.

---

#### Session 9: "Going to Production"
**Learning Objectives:**
- Mainnet deployment considerations
- Gas optimization basics
- Upgradeable contracts (proxy patterns)
- Verifying contracts on Etherscan

**Hands-on Project:** Deploy your DEX to a testnet with a proxy pattern. Verify on Etherscan. Write a README.

---

#### Session 10: "Your dApp Portfolio & What's Next"
**Learning Objectives:**
- How to build a Web3 developer portfolio
- Contributing to open source
- Career paths in Web3
- ETHJKT community next steps (Phase 2, Phase 3)

**Hands-on Project:** Polish all projects into a GitHub portfolio. Write a blog post about your learning journey. Submit your first PR to an open-source project (even just a typo fix).

---

### Supplementary Resources for All Courses
- **Reading list:** ethereum.org docs, Mastering Ethereum (Antonopoulos), Ethereum Yellow Paper (advanced)
- **Tools:** Remix, Foundry, Hardhat, Tenderly, Etherscan
- **Communities:** Ethereum Magicians, ethresear.ch, Ethereum R&D Discord
- **Practice:** Ethernaut (security), SpeedRunEthereum, Damn Vulnerable DeFi

---

## Summary: Zexo's Priority Actions (Next 30 Days)

| Priority | Action | Expected Impact |
|----------|--------|----------------|
| 🔴 | Submit 3 PRs to PSE repos (semaphore, bandada) | Direct EF visibility |
| 🔴 | Write Mirror article analyzing ERC-7683 for ZK DEXs | Thought leadership |
| 🟡 | Open 2 PRs on OpenZeppelin (tests/docs) | Build GitHub history |
| 🟡 | Start drafting an EIP for ZK-verified swap standard | Original contribution |
| 🟢 | Comment on 5 active EIP discussions on Ethereum Magicians | Become known in community |
| 🟢 | Finalize Newbie Session curriculum and announce via ETHJKT | Community building |
| 🟢 | Apply for EF Ecosystem Support Program grant for ETHJKT | Funding + recognition |

---

*📜 The Codex has spoken. The path is clear. Now execute, Lord Zexo.*
