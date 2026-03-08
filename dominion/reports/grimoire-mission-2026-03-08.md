# 📚 GRIMOIRE Open Source Scan — Good First Issues for ETHJKT Students

**Date:** 2026-03-08  
**Mission:** Curate beginner-friendly open source issues across Ethereum/web3 repos  
**Target audience:** ETHJKT community students (900+ members, ranging from beginners to intermediate devs)

---

## 📊 Scan Summary

| Repository | Good First Issues Found | Status |
|---|---|---|
| OpenZeppelin/openzeppelin-contracts | 2 | ✅ Active |
| wevm/wagmi | 2 | ✅ Active |
| wevm/viem | 1 | ✅ Active |
| foundry-rs/forge-std | 1 | ✅ Active |
| crytic/slither | 25 | ✅ Goldmine |
| ethereum/go-ethereum | 1 | ✅ Active |
| Consensys/teku | 1 | ✅ Active |
| smartcontractkit/chainlink | 1 | ⚠️ Stale |
| ethers-io/ethers.js | 0 | ❌ None |
| NomicFoundation/hardhat | 0 | ❌ None |
| foundry-rs/foundry | 0 | ❌ None |

**Total curated issues:** 18 across 7 repos

---

## 🏆 Tier 1 — Highly Recommended (Clear scope, beginner-friendly, high-impact repos)

### 1. OpenZeppelin Contracts — Optimize `_quickSort()` Function
- **Repo:** [OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- **Issue:** [#6289 — Function `_quickSort()` can be optimized](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/6289)
- **Difficulty:** ⭐⭐⭐ Medium
- **Skills needed:** Solidity, algorithms (quicksort), gas optimization, EVM stack mechanics
- **Scope:** Replace tail recursion with iterative loop in `Arrays.sol` to avoid stack overflow on large arrays. Clear diff provided in the issue.
- **Why it's great:** Contributing to OpenZeppelin is a resume highlight. The issue has a detailed POC and suggested solution. Milestone: v5.7.
- **Created:** 2026-01-15 | **Last active:** 2026-02-23

### 2. OpenZeppelin Contracts — Add ESLint Rule for No Async in Describe Blocks
- **Repo:** [OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- **Issue:** [#4943 — Consider adding an ESLint rule for no async in describe blocks](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4943)
- **Difficulty:** ⭐⭐ Easy
- **Skills needed:** JavaScript, ESLint configuration, testing (Mocha)
- **Scope:** Add `eslint-plugin-mocha` rule `no-async-describe` to the project's ESLint config. Straightforward config change.
- **Why it's great:** Easy entry point into OpenZeppelin. Involves test tooling, not smart contracts — lower risk, still impressive.
- **Created:** 2024-03-06 | **Last active:** 2026-01-02

### 3. Foundry forge-std — Document JSON Key Dot-Prefix Requirement
- **Repo:** [foundry-rs/forge-std](https://github.com/foundry-rs/forge-std)
- **Issue:** [#394 — docs(StdJson): document that key parameter must start with a dot](https://github.com/foundry-rs/forge-std/issues/394)
- **Difficulty:** ⭐ Easy
- **Skills needed:** Solidity (reading), NatSpec documentation, Foundry basics
- **Scope:** Add documentation/comments to `Vm.sol` clarifying that JSON key parameters need a leading `.` prefix, and name the unnamed parameters.
- **Why it's great:** Perfect first PR. Documentation-only, low risk, teaches you how to contribute to Foundry's standard library.
- **Created:** 2023-05-29 | **Last active:** 2026-01-22

### 4. Wagmi — Foundry Plugin Multiple Addresses Same ABI Bug
- **Repo:** [wevm/wagmi](https://github.com/wevm/wagmi)
- **Issue:** [#4396 — bug: foundry plugin multiple addresses referencing the same ABI](https://github.com/wevm/wagmi/issues/4396)
- **Difficulty:** ⭐⭐⭐ Medium
- **Skills needed:** TypeScript, @wagmi/cli, code generation, Foundry
- **Scope:** Fix the Foundry CLI plugin to support multiple contract addresses sharing the same ABI (e.g., WETH and DAI both using ERC20 ABI). Minimal reproducible example provided.
- **Why it's great:** Real bug with clear repro. Teaches wagmi CLI internals. wevm team is responsive.
- **Created:** 2024-11-10 | **Last active:** 2026-02-28

---

## 🥈 Tier 2 — Good Opportunities (Slightly more complex or niche)

### 5. Viem — `isAddress` Memory Leak on iOS 18+
- **Repo:** [wevm/viem](https://github.com/wevm/viem)
- **Issue:** [#2911 — isAddress function causes memory leak on iOS 18+](https://github.com/wevm/viem/issues/2911)
- **Difficulty:** ⭐⭐⭐ Medium
- **Skills needed:** TypeScript, regex/string operations, mobile debugging, memory profiling
- **Scope:** Investigate and fix memory leak in `isAddress` validation when called repeatedly on iOS 18+. Likely regex-related.
- **Why it's great:** Real-world performance bug in a widely-used library. Good for students interested in frontend web3.
- **Created:** 2024-10-23 | **Last active:** 2025-11-08

### 6. Wagmi — Nuxt Auto-Import EventEmitter3 Bug
- **Repo:** [wevm/wagmi](https://github.com/wevm/wagmi)
- **Issue:** [#3977 — autoimport Nuxt eventemitter3 does not provide an export named 'default'](https://github.com/wevm/wagmi/issues/3977)
- **Difficulty:** ⭐⭐ Easy-Medium
- **Skills needed:** Vue.js/Nuxt, ESM modules, TypeScript, @wagmi/vue
- **Scope:** Fix ESM import compatibility for `eventemitter3` when using Nuxt auto-imports with `@wagmi/vue`.
- **Why it's great:** Good for Vue/Nuxt developers. Stackblitz repro available.
- **Created:** 2024-05-23 | **Last active:** 2026-02-23

### 7. Go-Ethereum (Geth) — Implement EIP-4361 (Sign-In with Ethereum)
- **Repo:** [ethereum/go-ethereum](https://github.com/ethereum/go-ethereum)
- **Issue:** [#24132 — Implement EIP 4361](https://github.com/ethereum/go-ethereum/issues/24132)
- **Difficulty:** ⭐⭐⭐⭐ Hard
- **Skills needed:** Go, Ethereum protocol, EIP-4361 (SIWE), authentication
- **Scope:** Implement Sign-In with Ethereum standard in geth. Significant undertaking.
- **Why it's great:** Contributing to geth is legendary-tier for a resume. However, this is complex — best for advanced students.
- **Created:** 2021-12-20

### 8. Consensys/Teku — Add JSON Logging Option
- **Repo:** [Consensys/teku](https://github.com/Consensys/teku)
- **Issue:** [#10247 — Add option to log as JSON](https://github.com/Consensys/teku/issues/10247)
- **Difficulty:** ⭐⭐ Easy-Medium
- **Skills needed:** Java, logging frameworks, CLI configuration
- **Scope:** Add a `--log-format=json` flag to Teku (Ethereum consensus client). Likely involves Log4j/Logback config.
- **Why it's great:** Ethereum consensus layer contribution. Infrastructure work that's tangible and well-scoped.
- **Created:** 2025-12-17

---

## 🔧 Tier 3 — Slither Goldmine (Security tooling — 25 open good-first-issues)

[Slither](https://github.com/crytic/slither) by Trail of Bits is a Solidity static analysis tool. It has **25 open good-first-issues** — by far the richest source. Great for students interested in **security auditing**.

### Best Picks from Slither:

| # | Issue | Difficulty | Skills |
|---|---|---|---|
| 9 | [#1155 — Wiki config section missing flags](https://github.com/crytic/slither/issues/1155) | ⭐ Easy | Documentation, Markdown |
| 10 | [#1206 — Fix typos in detectors documentation](https://github.com/crytic/slither/issues/1206) | ⭐ Easy | Documentation, English |
| 11 | [#2150 — Ignore interfaces for inheritance-graph printer](https://github.com/crytic/slither/issues/2150) | ⭐⭐ Easy-Medium | Python, Solidity AST |
| 12 | [#2073 — Statements with `.` reported as external calls](https://github.com/crytic/slither/issues/2073) | ⭐⭐ Medium | Python, Solidity IR |
| 13 | [#1059 — Rename IR classes to avoid name clashes](https://github.com/crytic/slither/issues/1059) | ⭐⭐ Medium | Python, refactoring |
| 14 | [#857 — slither-doc: generate doc from natspec](https://github.com/crytic/slither/issues/857) | ⭐⭐⭐ Medium | Python, Solidity NatSpec |
| 15 | [#2077 — slither-read-storage: nested struct support](https://github.com/crytic/slither/issues/2077) | ⭐⭐⭐ Medium-Hard | Python, EVM storage layout |
| 16 | [#930 — Constants implementing interface getters naming](https://github.com/crytic/slither/issues/930) | ⭐⭐ Medium | Python, Solidity patterns |
| 17 | [#1780 — Update register printer for multiple compilation units](https://github.com/crytic/slither/issues/1780) | ⭐⭐ Medium | Python, compiler internals |
| 18 | [#681 — Improve test_ast_parsing.py](https://github.com/crytic/slither/issues/681) | ⭐⭐ Medium | Python, testing |

---

## 🎯 Recommended Path for ETHJKT Students

### 🟢 Complete Beginners (First OSS contribution ever)
1. **Start with:** forge-std #394 (docs fix) or Slither #1155/#1206 (docs/typos)
2. **Learn:** How to fork, branch, PR, pass CI
3. **Time:** 1-3 hours

### 🟡 Intermediate (Know Solidity, some JS/TS)
1. **Go for:** OpenZeppelin #4943 (ESLint rule) or Wagmi #4396 (CLI bug fix)
2. **Learn:** Project architecture, testing, code review process
3. **Time:** 4-8 hours

### 🔴 Advanced (Strong dev skills, want resume impact)
1. **Target:** OpenZeppelin #6289 (quicksort optimization) or Viem #2911 (memory leak)
2. **Learn:** Gas optimization, performance debugging, core library internals
3. **Time:** 8-20 hours

### 🟣 Security Track (Aspiring auditors)
1. **All of Slither's 25 issues** — start with docs (#1155, #1206), then move to Python code
2. **Learn:** Static analysis, Solidity IR, AST parsing, vulnerability detection
3. **Time:** Varies, but Slither is the single best entry for security students

---

## 📋 Quick Reference Table

| # | Repo | Issue | Difficulty | Language | Type |
|---|---|---|---|---|---|
| 1 | OpenZeppelin | [#6289](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/6289) | ⭐⭐⭐ | Solidity | Gas optimization |
| 2 | OpenZeppelin | [#4943](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4943) | ⭐⭐ | JS/ESLint | Tooling |
| 3 | forge-std | [#394](https://github.com/foundry-rs/forge-std/issues/394) | ⭐ | Solidity/Docs | Documentation |
| 4 | Wagmi | [#4396](https://github.com/wevm/wagmi/issues/4396) | ⭐⭐⭐ | TypeScript | Bug fix |
| 5 | Viem | [#2911](https://github.com/wevm/viem/issues/2911) | ⭐⭐⭐ | TypeScript | Bug fix |
| 6 | Wagmi | [#3977](https://github.com/wevm/wagmi/issues/3977) | ⭐⭐ | Vue/TS | Bug fix |
| 7 | go-ethereum | [#24132](https://github.com/ethereum/go-ethereum/issues/24132) | ⭐⭐⭐⭐ | Go | Feature |
| 8 | Teku | [#10247](https://github.com/Consensys/teku/issues/10247) | ⭐⭐ | Java | Feature |
| 9-18 | Slither | [Multiple](https://github.com/crytic/slither/issues?q=is%3Aopen+label%3A%22good+first+issue%22) | ⭐-⭐⭐⭐ | Python | Various |

---

## 💡 Tips for ETHJKT Students Making Their First Contribution

1. **Read CONTRIBUTING.md** in the repo before starting
2. **Comment on the issue** saying you'd like to work on it — maintainers may give guidance
3. **Start small** — a merged docs PR counts as much as a code PR for building confidence
4. **Run the test suite** before submitting your PR
5. **Don't be afraid of review feedback** — it's how you learn
6. **Slither is the goldmine** — 25 issues, Python-based, security-focused. Perfect for auditor-track students.

---

## ⚠️ Notes

- **Hardhat, ethers.js, foundry (main repo)** currently have 0 good-first-issues tagged. These projects may use different labeling or handle contributions differently.
- **Aave, Safe, Uniswap, thirdweb** also had 0 tagged issues at scan time.
- Issues were scanned via GitHub Search API on 2026-03-08. Availability may change — always check the issue is still open and unassigned before starting work.
- Some older Slither issues (2020-2022) may need verification that they're still relevant.

---

*Report compiled by GRIMOIRE 📚 — Knowledge General of the Dominion*  
*For ETHJKT community use*
