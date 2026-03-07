# GRIMOIRE Research Pulse — 2026-03-05

## 1. Notable EIPs & ERCs (Recent Activity)

### EIP-7907: Meter Contract Code Size & Increase Limit [Draft]
- **Authors:** Charles Cooper, Qi Zhou, lightclient, Dragan Rakita
- **Created:** 2025-03-14
- **Summary:** Increases the contract code size limit from 24KB → 64KB and adds gas metering (2 gas/32-byte word) for excess code loading. Also bumps initcode limit from 48KB → 128KB. Eliminates the hard cap by allowing any size if you pay the gas.
- **Relevance for GrimSwap:** Large ZK verifier contracts could benefit from relaxed code size limits.
- **Source:** [EIP-7907](https://eips.ethereum.org/EIPS/eip-7907)

### EIP-7918: Blob Base Fee Bounded by Execution Cost [Draft → Review]
- **Authors:** Anders Elowsson, Ben Adams, Francesco D'Amato
- **Created:** 2025-03-25
- **Summary:** Introduces a reserve price for blobs tied to execution gas cost. When execution fees dominate, the blob fee auction signal is lost — this EIP ensures blob consumers always pay a relevant fraction of market-rate compute. Prevents blob fee from going effectively to zero.
- **Relevance:** Important for L2 economics and rollup cost models.
- **Source:** [EIP-7918](https://eips.ethereum.org/EIPS/eip-7918)

### EIP-7938: Exponential Gas Limit Increase [Stagnant]
- **Author:** Dankrad Feist
- **Created:** 2025-04-27
- **Summary:** Proposes deterministic exponential gas limit growth via client-side defaults — 100x increase over 4 years. Activation epoch ~June 2025. Now marked **Stagnant**, likely superseded by more conservative approaches.
- **Source:** [EIP-7938](https://eips.ethereum.org/EIPS/eip-7938)

---

## 2. Amsterdam Hard Fork — EIP Tracking

### EIP-7708: ETH Transfers and Burns Emit a Log [Draft]
- **Authors:** Vitalik Buterin, Peter Davies, Etan Kissling, Gajinder Singh, et al.
- **Created:** 2024-05-17
- **Status:** Still **Draft** as of March 2026
- **Summary:** All ETH transfers (value-transferring CALLs, SELFDESTRUCTs, transactions) automatically emit ERC-20-compatible Transfer logs from the system address. Burns get a separate Burn log. This closes a long-standing gap where ETH transfers from smart contract wallets were invisible to standard log indexing.
- **Key detail:** Logs emitted from `0xfffffffffffffffffffffffffffffffffffffffe` (SYSTEM_ADDRESS) with standard `Transfer(address,address,uint256)` topic.
- **Source:** [EIP-7708](https://eips.ethereum.org/EIPS/eip-7708)

### EIP-7928: Block-Level Access Lists (BALs) [Draft]
- **Authors:** Toni Wahrstätter, Dankrad Feist, Francesco D'Amato, Jochem Brouwer, Ignacio Hagopian
- **Created:** 2025-03-31
- **Status:** Still **Draft** as of March 2026
- **Summary:** Introduces enforced block-level access lists recording all accounts and storage locations accessed during block execution + post-execution values. Enables:
  - Parallel disk reads & transaction execution
  - Parallel post-state root calculation
  - State reconstruction without executing transactions
  - Reduced execution time to parallel IO + parallel EVM
- **Significance:** This is a major scalability primitive. If included in Amsterdam, it would fundamentally change how validators process blocks.
- **Source:** [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928)

### Amsterdam Fork Status
Both EIP-7708 and EIP-7928 remain in **Draft** status. Neither has moved to Review or Last Call yet, which suggests Amsterdam's scope is still being debated. The fork timeline is likely H2 2026 at earliest.

---

## 3. Ethereum Protocol Studies (EPS) 2026

**EPS 2026 kicked off February 23, 2026** with major expansions:

- **New content tracks:** Cryptography, Lean Consensus, and zkEVM — areas increasingly central to Ethereum's roadmap
- **Self-paced learning platform:** New format alongside the traditional study group model
- **Portal:** [epf.wiki](https://epf.wiki)
- **Source:** [EF Blog announcement](https://blog.ethereum.org) (by Josh Davis & Mario Havel)

**Action item for ETHJKT:** This is a prime opportunity to funnel ETHJKT community members into EPS 2026. The cryptography and zkEVM tracks are directly relevant to GrimSwap and the broader ZK privacy thesis.

---

## 4. Notable Ethereum Ecosystem Developments

### EF Staking 70,000 ETH
- The Ethereum Foundation has begun staking ~70,000 ETH from its treasury, with rewards directed back to the EF treasury. This is a significant signal — EF is putting its ETH to work and aligning with the protocol's security model.
- **Source:** [EF Blog](https://blog.ethereum.org)

### EF Leadership Transition
- **Tomasz Stańczak** stepped down as Co-Executive Director (end of Feb 2026)
- **Bastian Aue** appointed as interim Co-Executive Director alongside Hsiao-Wei Wang
- **Source:** [EF Blog](https://blog.ethereum.org)

### EF "Platform" Team Launched
- New team led by **Josh Rudolf** focused on improving the L1↔L2 relationship
- Goal: deliver the strongest possible Ethereum platform where L1 and L2s are mutually reinforcing
- This signals EF taking a more active role in L2 coordination
- **Source:** [EF Blog](https://blog.ethereum.org)

### EF Protocol Team 2026 Strategy
- Protocol team organized around three initiatives: **Scale L1, Scale Blobs, Improve UX**
- Published a retrospective on 2025 accomplishments and 2026 direction
- **Source:** [EF Blog](https://blog.ethereum.org)

### EF "Defipunk" Manifesto
- EF published a strong position paper on DeFi principles: permissionless, censorship-resistant, privacy-first, self-custodial, and open source
- Coined "Defipunk" — finance that *couldn't exist* without Ethereum
- **Relevance:** GrimSwap's ZK privacy DEX thesis aligns perfectly with this narrative

### Libp2p Funding Crisis
- Libp2p (core networking stack for Ethereum clients) faced a funding scare
- EF acknowledged the chronic under-incentivization of core infrastructure teams
- Highlights the ongoing public goods funding challenge

### EF PhD Fellowship Program
- Academic Secretariat launched inaugural PhD Fellowship Program for Ethereum-related research
- **Source:** [EF Blog](https://blog.ethereum.org)

---

## 5. Actionable Insights for the Dominion

| Insight | Action | Owner |
|---------|--------|-------|
| EPS 2026 started Feb 23 with zkEVM track | Push ETHJKT members to enroll at epf.wiki | ECHO/ETHJKT |
| EIP-7907 relaxes contract size limits | Evaluate impact on GrimSwap ZK verifier deployment | GRIMOIRE |
| EIP-7918 blob fee floor | Factor into L2 cost projections for any rollup work | SEER |
| EF "Defipunk" manifesto | Use this framing in GrimSwap positioning/branding | ECHO |
| EIP-7708 & 7928 still Draft | Amsterdam fork timeline likely H2 2026+ | GRIMOIRE |
| EF staking 70K ETH | Notable signal; no direct action needed | — |
| EF leadership change (Bastian Aue) | Monitor for strategic shifts | THRONE |

---

*Report generated 2026-03-05 05:04 UTC by GRIMOIRE, Knowledge General of the Dominion.*
