# First PR Candidates for Faisal (zexoverz)
> Generated: 2026-02-16 | Status: ethereum/tests #1498 BLOCKED — these are alternatives

## Ranking Criteria
**Score = Achievability × Credibility × Freshness**
- Achievability: How easy to complete in 1-2h
- Credibility: Repo prestige (ethereum/ > OZ > foundry)
- Freshness: Recent activity, not stale

---

## 🥇 #1 — OpenZeppelin/openzeppelin-contracts #6305
**"Incorrect comment about EIP-2200 refund in ReentrancyGuard"**

| Field | Detail |
|-------|--------|
| Link | https://github.com/OpenZeppelin/openzeppelin-contracts/issues/6305 |
| Labels | `good first issue`, `documentation`, `typo` |
| Created | 2026-01-22 |
| Last Activity | 2026-02-03 |
| Assigned? | **No** (unassigned) |
| Competitors? | ⚠️ 2 people asked to be assigned (Riya379, HiteshMittal07) on Jan 23, but **neither was assigned and no PR exists** as of Feb 16 |
| Difficulty | 1/5 |
| Time | 30 min |

**What needs to be done:**
- Fix a misleading comment in `ReentrancyGuard.sol` about EIP-2200 gas refunds
- The comment says storing the original value triggers a refund, but `2 → 1` is non-zero to non-zero (no refund)
- Update the comment to accurately describe gas behavior
- One-line comment change + possibly update tests

**Why it's great for Faisal:**
- OpenZeppelin is THE gold standard Solidity library — instant credibility
- Requires understanding EIP-2200 gas mechanics — directly relevant to EVM bootcamp
- Tagged `good first issue` by OZ maintainers
- Shows deep EVM knowledge (gas refund semantics) without requiring protocol changes
- ⚠️ **MOVE FAST** — others asked but weren't assigned. First quality PR wins.

---

## 🥈 #2 — ethereum/ethereum-org-website #12195
**"Documentation request: interacting with smart contracts"**

| Field | Detail |
|-------|--------|
| Link | https://github.com/ethereum/ethereum-org-website/issues/12195 |
| Labels | `good first issue`, `help wanted`, `content 🖋️`, `feature ✨` |
| Created | 2024-02-15 |
| Last Activity | 2026-02-05 |
| Assigned? | **No** |
| Competitors? | 15 comments but mostly stale-bot + discussion. No one has submitted a PR. |
| Difficulty | 2/5 |
| Time | 1-2 hours |

**What needs to be done:**
- Create a new documentation page: "Interacting with Smart Contracts"
- Cover: reading data vs. sending transactions, contract ABIs, tools/libraries (ethers.js, web3.py, viem)
- Link to existing tutorials and API docs
- Follow ethereum.org content style guide

**Why it's great for Faisal:**
- **ethereum/** org repo — maximum credibility
- Content Faisal knows cold (7 years blockchain engineering)
- Writing docs about smart contract interaction is literally his expertise
- Long-standing request from an ethereum.org team member (wackerow)
- Nobody has delivered despite 2 years of discussion

---

## 🥉 #3 — foundry-rs/foundry #5429
**"feat: add path to compiler to `forge compiler resolve`"**

| Field | Detail |
|-------|--------|
| Link | https://github.com/foundry-rs/foundry/issues/5429 |
| Labels | `first issue`, `T-feature`, `C-forge`, `A-compiler` |
| Created | 2023-07-18 |
| Last Activity | ~2024-07 (comments from maintainer zerosnacks) |
| Assigned? | **No** |
| Competitors? | Some discussion but no PR submitted |
| Difficulty | 3/5 |
| Time | 1-2 hours |

**What needs to be done:**
- Add the compiler binary path to the output of `forge compiler resolve`
- Currently shows compiler version but not where the binary lives
- Requires modifying Rust code in foundry's forge CLI
- Related issues: #5715, #6099

**Why it's great for Faisal:**
- Foundry is the dominant Solidity dev tool — high credibility
- Tagged `first issue` by maintainers
- Practical tooling improvement he'd use himself
- ⚠️ Requires Rust knowledge — may be harder if Faisal isn't comfortable with Rust

---

## #4 — ethereum/ethereum-org-website #11833
**"Suggest a developer tool"**

| Field | Detail |
|-------|--------|
| Link | https://github.com/ethereum/ethereum-org-website/issues/11833 |
| Labels | `good first issue`, `help wanted` |
| Created | 2023-12-?? |
| Last Activity | TBD (need to check) |
| Assigned? | **No** |
| Difficulty | 1/5 |
| Time | 30 min - 1 hour |

**What needs to be done:**
- Suggest and add a developer tool to ethereum.org's developer tools listing
- Could add GrimSwap or other tools Faisal knows well
- Follow the contribution template

**Why it's great for Faisal:**
- Very low barrier to entry
- ethereum/ org repo
- Could showcase his own ecosystem knowledge
- ⚠️ Lower impact than #12195 — better as a backup

---

## #5 — OpenZeppelin/openzeppelin-contracts #6289
**"Function `_quickSort()` can be optimized"**

| Field | Detail |
|-------|--------|
| Link | https://github.com/OpenZeppelin/openzeppelin-contracts/issues/6289 |
| Labels | `good first issue`, `idea`, `gas optimization` |
| Created | 2026-01-15 |
| Last Activity | 2026-01-30 (maintainer Amxx commented) |
| Assigned? | **No** |
| Competitors? | ⚠️ clawdhash claimed it Jan 29 — but maintainer Amxx pushed back on part of the approach |
| Difficulty | 3/5 |
| Time | 1-2 hours |
| Milestone | v5.7 |

**What needs to be done:**
- Replace tail recursion in `_quickSort()` with a while loop
- Always recurse on the smaller partition (classic quicksort optimization)
- Maintainer Amxx confirmed interest but disputed the uint64 packing suggestion

**Why it's great for Faisal:**
- High-credibility OZ repo, milestone v5.7 means it WILL get merged
- Gas optimization = demonstrates EVM understanding
- ⚠️ Someone already claimed it — risky. But if their PR doesn't materialize, Faisal could step in

---

## ❌ ELIMINATED CANDIDATES

| Issue | Reason |
|-------|--------|
| ethereum/go-ethereum #24132 (EIP-4361) | Assigned to holiman (core maintainer). Not available. |
| ethereum/execution-specs — good first issues | **Zero** open good-first-issue issues found |
| ethereum/execution-spec-tests — good first issues | **Zero** open good-first-issue issues found |
| ethereum/EIPs — good first issues | **Zero** open good-first-issue issues found |
| ethereum/tests #1498 | BLOCKED — upstream not merged |

---

## 🎯 RECOMMENDED ACTION PLAN

### Option A: Speed Play (do TODAY)
1. **Grab OZ #6305** (EIP-2200 comment fix) — comment "I'd like to submit a PR for this" and immediately push a PR
2. The fix is ~2 lines. Be first with a quality PR. Include a clear commit message referencing EIP-2200.
3. Time: 30 minutes total

### Option B: High Impact (do this week)
1. **Write the ethereum.org docs page** (#12195) — "Interacting with Smart Contracts"
2. This is a bigger contribution that showcases Faisal's actual expertise
3. Comment on the issue first with an outline, then submit the PR
4. Time: 2 hours

### Option C: Both
- Do OZ #6305 today (30 min) for a quick win
- Do ethereum.org #12195 this week for a substantial contribution
- Two merged PRs in two top-tier repos within a week

**I recommend Option C.** The OZ comment fix gets Faisal's name on the board immediately while the docs contribution shows depth.

---

## ⚡ SPEED MATTERS

For OZ #6305 specifically: two people already asked to be assigned 3 weeks ago and neither delivered. The maintainers haven't assigned anyone. In open source, **the first quality PR wins**, not the first "can I work on this?" comment. Just submit the PR.
