# GRIMOIRE Report: ETHJKT Phase 3 Redesign — Hackathon & Job Ready

> Generated: 2026-02-14 | Analyst: GRIMOIRE, Knowledge General of the Dominion
> Directive: Lord Zexo — "Make them employable, make them win hackathons."

---

## Phase 3: Tower of Chains — Smart Contract Development (Hackathon & Job Ready)

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

#### Arcane Quest

**AQ: On-Chain Registry 📜**
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

#### Arcane Quest

**AQ: Token Forge ⚒️**
> Create your own ERC-20 token "EthereanCoin" with:
> - Configurable name, symbol, initial supply
> - Minting (owner only) and burning (any holder)
> - Pausable transfers (emergency stop)
> - 15+ tests including fuzz tests for transfer amounts
> - Deploy to testnet
>
> **Submit:** PR with contract, tests, deployment tx hash.

**AQ: NFT Koleksi Sihir 🖼️**
> Build an NFT collection "Etherean Artifacts" with:
> - Max supply of 100
> - Whitelist minting via Merkle proof (first 24h)
> - Public mint after whitelist phase
> - Reveal mechanism (hidden metadata → reveal)
> - Royalties via EIP-2981
> - 15+ tests including edge cases
> - Deploy to testnet and mint at least 3 NFTs
>
> **Submit:** PR with contract, tests, Merkle tree generation script, and deployed NFT link.

#### Arcane Quest
- Part 1: ERC-20 implementation quiz
- Part 2: ERC-721 implementation quiz
- Part 3: Spot the bug in token contracts

---

### Week 3: `phase-3-week3-defi-building-blocks`

**"Welcome to DeFi week, Etherean! 💰 Kalian bakal belajar gimana Uniswap kerja, bikin staking contract sendiri, dan connect semuanya ke frontend dari Phase 2. Ini yang bikin kalian beda dari dev biasa."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | How AMMs work: constant product formula (x*y=k), Uniswap V2 math | [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf) |
| 2 | Liquidity pools: adding/removing liquidity, LP tokens, impermanent loss | [Finematics — Liquidity Pools](https://www.youtube.com/watch?v=cizLhxSKrAc) |
| 3 | Staking contracts: deposit, reward calculation, time-weighted distribution | [Cyfrin Updraft — DeFi](https://updraft.cyfrin.io/) |
| 4 | Flash loans: concept, use cases, implementation | [Aave Flash Loans Docs](https://docs.aave.com/developers/guides/flash-loans) |
| 5 | Price oracles: Chainlink integration | [Chainlink Docs — Data Feeds](https://docs.chain.link/data-feeds) |
| 6 | Connecting contracts to React frontend (from Phase 2) | Reference: `simple-defi-ui`, `tugwar-game-ui` repos |

#### Arcane Quest

**AQ: Staking dApp — Etherean Vault 🏦**
> Build a complete staking dApp (contract + frontend):
>
> **Smart Contract:**
> - Users stake ERC-20 tokens
> - Rewards accrue per second based on stake amount
> - Claim rewards anytime
> - Unstake with no lock (or optional time lock for bonus)
> - Emergency withdraw (forfeits unclaimed rewards)
> - Owner can set reward rate and fund reward pool
> - 20+ tests including fuzz tests
>
> **Frontend (React):**
> - Connect wallet (wagmi + RainbowKit)
> - Display staked balance, earned rewards, APR
> - Stake/unstake/claim buttons with transaction handling
> - Real-time reward counter
>
> - Deploy contracts to testnet, frontend to Vercel
>
> **Submit:** PR with contracts, tests, frontend code, deployed links (contract + Vercel).

#### Arcane Quest
- Part 1: AMM math problems (calculate swap output, price impact)
- Part 2: Staking reward calculation scenarios
- Part 3: Flash loan attack scenario analysis

---

### Week 4: `phase-3-week4-security-and-gas`

**"Etherean, minggu ini kalian jadi auditor. 🔍 Kalian bakal belajar gimana hacker nyerang smart contract — dan gimana cara defend. Plus, kalian bakal belajar bikin contract yang gas-efficient. Ini skill yang paling dicari di industri."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | Reentrancy attacks: classic, cross-function, cross-contract | [Cyfrin Updraft — Security & Auditing](https://updraft.cyfrin.io/courses/security) |
| 2 | Integer overflow (pre-0.8) and precision loss | [SWC Registry](https://swcregistry.io/) |
| 3 | Front-running and sandwich attacks: mempool, MEV | [Flashbots Docs](https://docs.flashbots.net/) |
| 4 | Access control vulnerabilities: tx.origin, missing modifiers | [OpenZeppelin — Access Control](https://docs.openzeppelin.com/contracts/5.x/access-control) |
| 5 | Slither static analysis: installation, running, interpreting results | [Slither GitHub](https://github.com/crytic/slither) |
| 6 | Gas optimization: storage packing, calldata vs memory, unchecked blocks, short-circuit | [RareSkills — Gas Optimization](https://www.rareskills.io/post/gas-optimization) |
| 7 | Common patterns: checks-effects-interactions, pull over push, ReentrancyGuard | [Solidity Patterns](https://fravoll.github.io/solidity-patterns/) |

#### Arcane Quest

**AQ: Bug Hunter 🐛**
> You'll receive 5 intentionally vulnerable contracts (inspired by [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)):
> 1. A vault with reentrancy vulnerability
> 2. A token sale with precision loss
> 3. A lending pool with flash loan exploit
> 4. A governance contract with access control bug
> 5. A DEX with price manipulation vulnerability
>
> For each contract:
> - Write an exploit contract/test that demonstrates the attack
> - Fix the vulnerability
> - Run Slither on both versions, document findings
> - Write a short audit report (vulnerability, severity, fix)
>
> **Submit:** PR with exploit tests, fixed contracts, Slither reports, and audit notes.

**AQ: Gas Wizard ⛽**
> You'll receive an unoptimized contract (~50,000 gas per core function). Optimize it to under 30,000 gas:
> - Apply storage packing
> - Use calldata where possible
> - Optimize loops
> - Use custom errors instead of require strings
> - Use unchecked where safe
> - Document every optimization with gas before/after using `forge test --gas-report`
>
> **Submit:** PR with original contract, optimized contract, gas reports, and optimization notes.

#### Arcane Quest
- Part 1: Identify vulnerabilities in code snippets (multiple choice)
- Part 2: Gas optimization quiz
- Part 3: Write a security checklist for a given contract

---

### Week 5: `phase-3-week5-hackathon-simulation`

**"Etherean, ini minggu terakhir di Tower of Chains! 🏆 Kalian udah belajar Solidity, token, DeFi, security. Sekarang saatnya BUKTIIN. Kalian bakal simulate hackathon conditions — 48 jam buat bikin dApp dari nol. Ini yang bakal jadi portfolio kalian buat apply kerja dan menang hackathon."**

#### Study Materials

| # | Topic | Resources |
|---|-------|-----------|
| 1 | How to win hackathons: ideation frameworks, MVP mindset, time management | [ETHGlobal — Hackathon Guide](https://ethglobal.com/) |
| 2 | Team formation: roles, communication, git workflow for speed | [ETHGlobal Starter Kits](https://github.com/ethglobal) |
| 3 | Rapid prototyping: Scaffold-ETH 2, templates, boilerplates | [Scaffold-ETH 2](https://scaffoldeth.io/) |
| 4 | Pitching your project: demo structure, storytelling, technical depth | Previous ETHJKT Onchain Day presentations |
| 5 | Web3 developer portfolio: GitHub profile optimization, deployed projects, README quality | [How to Build a Web3 Portfolio](https://www.web3.career/) |
| 6 | Mock interview prep: common Solidity interview questions | [RareSkills — Solidity Interview](https://www.rareskills.io/post/solidity-interview-questions) |
| 7 | Job hunting: web3.career, crypto.jobs, ETHGlobal showcase, networking | [web3.career](https://web3.career/), [crypto.jobs](https://crypto.jobs/) |

#### Phase — Hackathon Simulation (48 jam)

**Format:** Teams of 2-3. Friday evening kickoff → Sunday evening demo.

**Rules:**
- Pick a problem and build a solution — contracts + frontend + deployment
- Must use Foundry for contracts
- Must deploy to a testnet
- Must have a working frontend
- Must have a README with: problem statement, solution, architecture, how to run, deployed links
- Must present in 5 minutes + 3 min Q&A

**Suggested Project Ideas (or come up with your own):**
- 🗳️ DAO Governance — proposal creation, voting, execution
- 🎮 On-chain game — turn-based strategy with NFT rewards
- 💸 Micro-lending — peer-to-peer lending with collateral
- 🎵 Music NFT marketplace — artists mint, fans buy/trade, royalty splits
- 🌍 Impact certificate — verifiable impact/donation tracking on-chain
- 🔐 Dead man's switch — automated inheritance/recovery system

#### Arcane Quest

**AQ: Portfolio Assembly 📂**
> Create your Web3 developer portfolio:
> 1. Update GitHub profile README with your Web3 journey
> 2. Pin your best 6 repos (mix of Phase 1-3 projects)
> 3. Each pinned repo must have: clear README, deployed link (if applicable), tech stack badges
> 4. Write a "What I Built at ETHJKT" blog post (Medium, Mirror, or dev.to)
> 5. Prepare answers for 10 common Web3 developer interview questions:
>    - What is the difference between `msg.sender` and `tx.origin`?
>    - Explain reentrancy and how to prevent it
>    - How does Uniswap V2's AMM work?
>    - What is the proxy pattern and why is it needed?
>    - How do you optimize gas in Solidity?
>    - What is a flash loan?
>    - Explain ERC-20 approve + transferFrom flow
>    - What are the main differences between Foundry and Hardhat?
>    - How do you handle upgradeable contracts?
>    - What security tools do you use and why?
>
> **Submit:** PR with updated GitHub profile link, blog post link, and interview answer document.

**AQ: Hackathon Project 🚀**
> Your hackathon simulation project. Judged on:
> - **Innovation** (25%) — is it a real problem with a novel solution?
> - **Technical execution** (30%) — contracts well-tested? frontend functional?
> - **Completeness** (20%) — is it deployed? does it work end-to-end?
> - **Presentation** (15%) — clear demo, good storytelling
> - **Code quality** (10%) — clean code, good README, documented
>
> **Submit:** PR with full project repo, deployed links, and presentation slides/recording.

#### Final Demo Day 🎪
- Each team presents their hackathon project
- Community voting for "Best Project", "Best Technical", "Best Presentation"
- Certificate of completion for all students who finish Phase 3
- Top projects get featured on ETHJKT landing page

---

### Phase 3 Summary Table

| Week | Topic | Key Build | Skills Gained |
|------|-------|-----------|---------------|
| 1 | Solidity Fundamentals + Foundry | On-Chain Registry | Solidity, Foundry, testing, deployment |
| 2 | Token Standards + Real Contracts | ERC-20 Token + NFT Collection | Token standards, OpenZeppelin, fuzz testing |
| 3 | DeFi Building Blocks | Staking dApp (contract + frontend) | AMM math, staking, full-stack dApp |
| 4 | Security + Gas Optimization | Bug hunting + gas optimization | Auditing, Slither, vulnerability patterns |
| 5 | Hackathon Simulation + Portfolio | Complete dApp (48h) + portfolio | Hackathon skills, interviewing, job readiness |

### Graduate Profile

A Phase 3 graduate ("Etherean Unchained 🔓") can:
- ✅ Write, test, and deploy Solidity smart contracts with Foundry
- ✅ Implement ERC-20, ERC-721, ERC-1155 tokens
- ✅ Build DeFi primitives (staking, AMM concepts)
- ✅ Identify and fix common smart contract vulnerabilities
- ✅ Optimize gas usage
- ✅ Build a complete dApp (contracts + frontend + deployment)
- ✅ Compete in hackathons with confidence
- ✅ Apply for Web3 developer positions with a strong portfolio
- ✅ Pass common Solidity/Web3 technical interviews

---

*Phase 3 redesigned. No EIP editing. No protocol research. Pure builder energy. Hackathon winners and employable devs.*

— GRIMOIRE 🧙‍♂️
