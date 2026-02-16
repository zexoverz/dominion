# PR Guide: ethereum/tests #1498 — Update LegacyTests Submodule

**Prepared:** 2026-02-16 | **For:** Faisal (zexoverz) | **Issue:** [ethereum/tests#1498](https://github.com/ethereum/tests/issues/1498)

---

## ⚠️ BLOCKER: Upstream PR Not Yet Merged

**Critical finding:** This issue asks to update the `LegacyTests` submodule in `ethereum/tests` to include the fix from [ethereum/legacytests#16](https://github.com/ethereum/legacytests/pull/16). However, **legacytests#16 is still OPEN** (not merged) as of 2026-02-16.

The PR on `ethereum/tests` is a **one-line submodule pointer update** — it can only be done after legacytests#16 merges. You have two options:

### Option A: Wait and Pounce (Recommended)
1. Watch legacytests#16 for merge
2. Once merged, immediately submit the submodule update PR (5 minutes of work)
3. You'll be the first to close issue #1498

### Option B: Submit to legacytests Instead
- Himess already has PR #16 open with the exact fix
- You could review it, leave a helpful comment, build credibility
- Not ideal for a "first PR" since the work is done

### Option C: Submit the ethereum/tests PR Now (Pointing to Himess's Branch)
- Technically possible but bad form — the upstream fix should be on `main` first
- Maintainers would reject this

**Recommendation: Go with Option A. Monitor legacytests#16. The moment it merges, execute the steps below.**

---

## Issue Summary

- **Opened by:** [Himess](https://github.com/Himess) on 2026-02-04
- **Status:** Open, 0 comments, no assignee, no labels
- **No one else is working on it** (no linked PRs on ethereum/tests)

### The Bug

11 test files in the `LegacyTests` submodule have **wrong expected state root hashes** for pre-Spurious Dragon forks (Frontier, Homestead, EIP150).

**Root cause:** The EVM that generated these tests incorrectly created an empty COINBASE account in the state when a transaction was invalid. Before EIP-158 (Spurious Dragon), empty accounts aren't auto-deleted, so the state root was wrong. Invalid transactions should leave state completely unchanged → state root should equal pre-state root.

**Verified by:** Both `geth` and `revm` calculate the same correct hash values.

---

## What the PR Actually Changes

The PR on `ethereum/tests` is **trivially simple**: update the `LegacyTests` submodule pointer from the current commit to the one that includes the fix.

### Current submodule state:
```
LegacyTests @ 1f581b8ccdc4c63acf5f2c5c1b155c690c32a8eb
```

### Target submodule state:
```
LegacyTests @ <new-commit-sha-after-legacytests-16-merges>
```

The actual file changes (11 files, hash corrections) live in `ethereum/legacytests`, not in `ethereum/tests` directly. Your PR just bumps the submodule pointer.

---

## Affected Files (in legacytests, for reference)

All under `Cancun/GeneralStateTests/`:

| # | File | Wrong Hash → Correct Hash | Forks Affected |
|---|------|---------------------------|----------------|
| 1 | `stExample/accessListExample.json` | `0x9c82fe...0cba3` → `0x23af37...57da5` | Frontier, Homestead, EIP150 |
| 2 | `stExample/basefeeExample.json` | `0x9c82fe...0cba3` → `0x23af37...57da5` | Frontier, Homestead, EIP150 |
| 3 | `stExample/eip1559.json` | `0x62445c...b23ac` → `0xcfa569...83def` | Frontier, Homestead, EIP150 |
| 4 | `stTransactionTest/HighGasPrice.json` | `0x7e18cd...226ec` → `0x175172...8052a` | Frontier, Homestead, EIP150 |
| 5 | `stTransactionTest/HighGasPriceParis.json` | `0x7595d8...784e7` → `0xecd1ce...2cc09` | Frontier, Homestead, EIP150 |
| 6 | `stTransactionTest/NoSrcAccount.json` | `0xa511d2...f1eb2` → `0x25298c...d690a` | Frontier, Homestead, EIP150 |
| 7 | `stTransactionTest/NoSrcAccount1559.json` | (similar pattern) | Frontier, Homestead, EIP150 |
| 8 | `stTransactionTest/NoSrcAccountCreate.json` | (similar pattern) | Frontier, Homestead, EIP150 |
| 9 | `stTransactionTest/NoSrcAccountCreate1559.json` | (similar pattern) | Frontier, Homestead, EIP150 |
| 10 | `stTransactionTest/ValueOverflow.json` | (similar pattern) | Frontier, Homestead, EIP150 |
| 11 | `stTransactionTest/ValueOverflowParis.json` | (similar pattern) | Frontier, Homestead, EIP150 |

---

## Step-by-Step PR Commands

### Prerequisites
```bash
# Ensure you have git configured
git config --global user.name "zexoverz"
git config --global user.email "your-email@example.com"
```

### 1. Fork ethereum/tests on GitHub
Go to https://github.com/ethereum/tests → Click "Fork" → Fork to `zexoverz/tests`

### 2. Clone your fork
```bash
git clone --recurse-submodules https://github.com/zexoverz/tests.git
cd tests
git remote add upstream https://github.com/ethereum/tests.git
```

### 3. Create a branch (from develop — that's the default branch)
```bash
git checkout develop
git pull upstream develop
git checkout -b fix/update-legacytests-submodule
```

### 4. Update the submodule to latest (after legacytests#16 is merged)
```bash
cd LegacyTests
git fetch origin
git checkout main  # or whatever the latest commit is after PR #16 merges
# Verify the fix commit is included:
git log --oneline -5
# You should see: "fix: correct pre-Spurious Dragon state roots for invalid transaction tests"
cd ..
git add LegacyTests
```

### 5. Commit
```bash
git commit -m "update LegacyTests submodule

Update LegacyTests to include fix for incorrect pre-Spurious Dragon
state roots in invalid transaction tests (ethereum/legacytests#16).

Closes #1498"
```

### 6. Push and open PR
```bash
git push origin fix/update-legacytests-submodule
```

Then go to https://github.com/ethereum/tests/compare/develop...zexoverz:tests:fix/update-legacytests-submodule

---

## PR Title
```
update LegacyTests submodule (fix pre-Spurious Dragon state roots)
```

## PR Description
```markdown
## Summary

Updates the `LegacyTests` submodule to include the fix from ethereum/legacytests#16.

## Changes

This bumps the `LegacyTests` submodule pointer to include corrected expected state root hashes for pre-Spurious Dragon forks (Frontier, Homestead, EIP150) in 11 test files where invalid transactions incorrectly had state roots reflecting an empty COINBASE account creation.

## Affected Tests

- `stExample/eip1559.json`
- `stExample/accessListExample.json`
- `stExample/basefeeExample.json`
- `stTransactionTest/HighGasPrice.json`
- `stTransactionTest/HighGasPriceParis.json`
- `stTransactionTest/ValueOverflow.json`
- `stTransactionTest/ValueOverflowParis.json`
- `stTransactionTest/NoSrcAccount.json`
- `stTransactionTest/NoSrcAccount1559.json`
- `stTransactionTest/NoSrcAccountCreate.json`
- `stTransactionTest/NoSrcAccountCreate1559.json`

## Related

- Closes #1498
- ethereum/legacytests#16
- ethereum/execution-specs#1967
- bluealloy/revm#3270
- ethereum/go-ethereum#33527
```

---

## PR Style Notes (from reviewing recent merged PRs)

- ethereum/tests uses **`develop`** as default branch (not `main`)
- PRs are typically merged by `winsvega` (maintainer)
- Commit messages are lowercase, concise
- No CI checks visible on most PRs (the repo is test data, not code)
- PRs can be very minimal — even null body is accepted (see PR #1493)
- Labels are rarely used
- Review turnaround: days to weeks

---

## Tips for Review

1. **Be patient.** This repo doesn't get frequent attention. Weeks between reviews is normal.
2. **Keep it minimal.** One submodule update, one commit. Don't add anything extra.
3. **Reference the issue.** `Closes #1498` in the commit message is important.
4. **Don't mention GrimSwap/ETHJKT in the PR.** This is a technical contribution to Ethereum core infrastructure. Keep it purely technical.
5. **If asked questions**, demonstrate you understand the root cause (empty COINBASE account pre-EIP-158).

---

## Timeline

| Step | Time |
|------|------|
| Fork + clone | 5 min |
| Update submodule + commit | 5 min |
| Open PR | 5 min |
| **Total** | **~15 min** |

**But first:** Wait for legacytests#16 to merge. Monitor it at https://github.com/ethereum/legacytests/pull/16

---

## Monitoring Script

Check legacytests#16 status:
```bash
curl -s https://api.github.com/repos/ethereum/legacytests/pulls/16 | jq '.state, .merged_at'
```

When it shows `"closed"` and a non-null `merged_at`, go time.
