# ethereum.org #12195 — Scope Analysis & Contribution Guide

**Issue:** https://github.com/ethereum/ethereum-org-website/issues/12195
**Originally:** #6327 (re-posted to surface)
**Type:** New documentation page — "Interacting with Smart Contracts"

---

## What They Want

A new docs page at `/developers/docs/smart-contracts/interacting/` that explains how developers can **interact with already-deployed contracts** (not write/compile/deploy their own).

Currently the smart contracts section covers:
- Intro to smart contracts
- Deploying
- Compiling
- Testing
- Composability
- Security
- Formal verification
- Anatomy
- Libraries

**Missing:** How to actually call/read existing contracts. This is what most devs do day-to-day.

---

## Where It Lives

**File path:**
```
public/content/developers/docs/smart-contracts/interacting/index.md
```

**URL when published:**
```
https://ethereum.org/en/developers/docs/smart-contracts/interacting/
```

---

## Page Format (matching existing docs)

Frontmatter template:
```yaml
---
title: Interacting with smart contracts
description: An introduction to how developers can read data from and send transactions to existing smart contracts.
lang: en
---
```

Then standard markdown with:
- `## Section Title {#section-id}` format for headers
- Internal links like `[smart contracts](/developers/docs/smart-contracts/)`
- Code blocks with language tags
- "Further reading" section at bottom

---

## Similar Pages for Reference

1. **Compiling** — `public/content/developers/docs/smart-contracts/compiling/index.md`
2. **JavaScript APIs** — `public/content/developers/docs/apis/javascript/index.md`
3. **Backend APIs** — `public/content/developers/docs/apis/backend/index.md`
4. **Calling a Smart Contract from JavaScript** (tutorial) — `public/content/developers/tutorials/calling-a-smart-contract-from-javascript/index.md`

---

## Proposed Page Outline

```markdown
---
title: Interacting with smart contracts
description: How to read data from and send transactions to deployed smart contracts using developer tools and libraries.
lang: en
---

Smart contracts are most useful when other people and programs can interact with them. This page explains how to read and write data to contracts that are already deployed on Ethereum.

## Prerequisites {#prerequisites}

- [Smart contracts](/developers/docs/smart-contracts/)
- [Smart contract ABIs](/developers/docs/smart-contracts/compiling/)
- [Accounts](/developers/docs/accounts/)
- [Transactions](/developers/docs/transactions/)
- [JSON-RPC](/developers/docs/apis/json-rpc/)

## Reading vs. writing {#reading-vs-writing}

Two fundamental types of interaction:
- **Reading (calls):** Query data without a transaction. Free, instant, no gas.
- **Writing (transactions):** Change state. Requires gas, signed by EOA, mined into a block.

## Contract ABIs {#contract-abis}

- What is an ABI (Application Binary Interface)?
- How ABIs are generated from compilation
- How tools use ABIs to encode/decode function calls
- Where to find ABIs (Etherscan, compilation artifacts)
- Example ABI snippet

## Making read calls {#read-calls}

- Using `eth_call` JSON-RPC method
- View and pure functions
- Example: reading an ERC-20 balance

## Sending transactions {#sending-transactions}

- Constructing a transaction to a contract
- Encoding function parameters
- Gas estimation
- Signing and broadcasting
- Example: transferring ERC-20 tokens

## Events and logs {#events-and-logs}

- How contracts emit events
- Subscribing to / filtering events
- Using events to track contract activity
- Example: listening for Transfer events

## Tools and libraries {#tools-and-libraries}

- [JavaScript/TypeScript: ethers.js, web3.js, viem](/developers/docs/apis/javascript/)
- [Python: web3.py](/developers/docs/apis/backend/)
- [Foundry cast](https://book.getfoundry.sh/cast/) (CLI interaction)
- Block explorers (Etherscan "Read/Write Contract")

## Contract interaction from other contracts {#contract-to-contract}

- Interfaces and external calls
- Low-level call/delegatecall
- Brief mention of composability (link to /smart-contracts/composability/)

## Further reading {#further-reading}

- [Calling a smart contract from JavaScript](/developers/tutorials/calling-a-smart-contract-from-javascript/)
- [ethers.js documentation](https://docs.ethers.org/)
- [viem documentation](https://viem.sh/)
- [Ethereum JSON-RPC specification](/developers/docs/apis/json-rpc/)
```

---

## Contribution Steps

### 1. Fork & Clone
```bash
git clone https://github.com/zexoverz/ethereum-org-website.git
cd ethereum-org-website
git remote add upstream https://github.com/ethereum/ethereum-org-website.git
git fetch upstream
git checkout -b add-interacting-with-contracts-docs upstream/dev
```

### 2. Create the Page
```bash
mkdir -p public/content/developers/docs/smart-contracts/interacting
# Create index.md with the content above
```

### 3. Update Sidebar (if needed)
Check `src/data/developer-docs-links.yaml` or equivalent navigation config to add the new page to the smart contracts section.

### 4. Local Dev
```bash
yarn install
yarn dev
# Visit http://localhost:3000/en/developers/docs/smart-contracts/interacting/
```

### 5. PR

**Title:** `Add "Interacting with smart contracts" documentation page`

**Description:**
```
Closes #12195

Adds a new documentation page under /developers/docs/smart-contracts/interacting/ that covers:
- Reading data vs. sending transactions
- Contract ABIs and how they're used
- Tools and libraries for contract interaction
- Events and logs
- Contract-to-contract interaction

This fills a gap in the smart contracts section where we explain writing, compiling, and deploying contracts but not how to interact with existing ones.
```

---

## Effort Estimate

This is a **medium-sized contribution** — requires writing 1500-2500 words of original technical content with code examples. Estimate 3-5 hours for a quality submission. Not a 15-minute fix like OZ #6305.

## Tips

- Comment on the issue first to claim it
- ethereum.org reviews can take weeks — be patient
- They care about accessibility and plain language
- Include code examples in multiple languages/libraries if possible
- Check their [style guide](https://ethereum.org/en/contributing/style-guide/) before writing
