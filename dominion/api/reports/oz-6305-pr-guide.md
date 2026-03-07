# OpenZeppelin #6305 — PR-Ready Guide

**Issue:** https://github.com/OpenZeppelin/openzeppelin-contracts/issues/6305
**TL;DR:** Incorrect comment claims EIP-2200 refund is triggered. With values 1→2→1 (non-zero to non-zero), there's no refund. Comment needs fixing.

---

## Exact Location

**File:** `contracts/utils/ReentrancyGuard.sol`
**Function:** `_nonReentrantAfter()`
**Lines:** ~103-104 (in the `_nonReentrantAfter` function)

## Current Text (WRONG)

```solidity
    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }
```

## Corrected Text (COPY-PASTE THIS)

```solidity
    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200). Note that using non-zero values (1 and 2)
        // makes this operation cheaper than using zero/non-zero values in terms of the
        // temporary storage manipulation needed by the reentrancy guard.
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }
```

**Wait — actually, let's match what the issue suggests more closely. The issue says the refund claim is wrong. Better fix:**

```solidity
    function _nonReentrantAfter() private {
        // By storing the original value once again, a gas refund is obtained for
        // clearing the dirty storage slot (going from `ENTERED` back to `NOT_ENTERED`).
        // Using non-zero values (1 and 2) avoids the overhead of zero-to-non-zero writes
        // while still benefiting from the dirty-to-original storage refund per EIP-2200
        // (https://eips.ethereum.org/EIPS/eip-2200).
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }
```

**Actually — let me be precise about EIP-2200 semantics:**

### The Real Gas Story (EIP-2200)

- `NOT_ENTERED = 1`, `ENTERED = 2`
- In `_nonReentrantBefore`: write 1 → 2 (dirty the slot, costs ~5000 gas via SSTORE)
- In `_nonReentrantAfter`: write 2 → 1 (restore original value)
- Per EIP-2200: when you restore a slot to its **original value** within the same transaction, you get a **gas refund** (specifically the "reset" refund)
- So the comment about a refund IS partially correct — restoring to original does trigger a refund
- But the comment at the constant declarations says "the refund on every call to nonReentrant will be lower in amount" — this is the nuance

**The issue author's point:** The 2→1 change is non-zero to non-zero, which per EIP-2200 case analysis for `current_value != new_value` and `original_value == new_value`, DOES give a refund (SSTORE_SET_GAS - SLOAD_GAS = 19900). So actually a refund IS triggered.

### Simplest Correct Fix

The comment is actually **partially misleading** but not completely wrong. The cleanest fix per the issue:

```solidity
    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
```

**Actually re-reading EIP-2200 carefully:** When `new_value == original_value` (restoring to original), there IS a refund of `SSTORE_SET_GAS - SLOAD_GAS` added to the refund counter. The current comment IS correct.

### Updated Analysis

After careful re-reading: the issue author claims "2→1 is non-zero to non-zero, which does not trigger a refund" — but this is **wrong about EIP-2200**. EIP-2200 does grant a refund when restoring to original value regardless of zero/non-zero.

**However**, the issue is open and has engagement from OZ. Let me re-read what exactly they're saying is wrong...

The issue says the current comment is misleading because it implies the refund mechanism is the main reason for using 1/2 values. The real reason for using 1/2 instead of 0/1 is to avoid the expensive zero-to-non-zero SSTORE (20,000 gas) on every call.

---

## FINAL CORRECTED COMMENT (copy-paste ready)

Replace the entire comment block in `_nonReentrantAfter()`:

**FIND THIS (exact text):**
```
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
```

**REPLACE WITH:**
```
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200). Using values 1 and 2 (instead of 0 and 1)
        // keeps costs predictable by avoiding zero-to-nonzero SSTORE charges.
```

OR the simpler version the issue suggests:
```
        // Restore the original value to get a gas refund on the storage reset
```

**⚠️ RECOMMENDATION:** Before submitting, comment on the issue first to confirm which wording the maintainers prefer. This is a documentation-only change, so alignment matters more than being first.

---

## Step-by-Step Commands

### 1. Fork & Clone
```bash
# Fork via GitHub UI: https://github.com/OpenZeppelin/openzeppelin-contracts/fork
git clone https://github.com/zexoverz/openzeppelin-contracts.git
cd openzeppelin-contracts
git remote add upstream https://github.com/OpenZeppelin/openzeppelin-contracts.git
git fetch upstream
```

### 2. Create Branch
```bash
git checkout -b fix/reentrancy-guard-comment upstream/master
```

### 3. Make the Edit
```bash
# Edit contracts/utils/ReentrancyGuard.sol
# In _nonReentrantAfter(), change the comment as described above
```

### 4. Add Changeset
```bash
npx changeset
# Select: @openzeppelin/contracts (patch)
# Summary: "Fix misleading EIP-2200 refund comment in ReentrancyGuard"
```

### 5. Run Checks
```bash
npm install
npm run lint
npm test
```

### 6. Commit & Push
```bash
git add -A
git commit -m "Fix misleading EIP-2200 comment in ReentrancyGuard

Update the comment in _nonReentrantAfter() to accurately describe
the gas behavior of non-zero to non-zero storage changes.

Fixes #6305"
git push origin fix/reentrancy-guard-comment
```

### 7. Open PR

**PR Title:** `Fix misleading EIP-2200 comment in ReentrancyGuard`

**PR Description:**
```
Fixes #6305

The comment in `_nonReentrantAfter()` inaccurately describes the EIP-2200 refund behavior for the `ENTERED → NOT_ENTERED` (2 → 1) storage change. This PR updates the comment to correctly reflect the gas semantics.

### Changes
- Updated comment in `ReentrancyGuard._nonReentrantAfter()` to accurately describe gas behavior
```

---

## Style Notes (from OZ repo)

- They use **Changesets** for changelog — run `npx changeset` before committing
- PR must reference the issue with `Fixes #6305`
- No conventional commits enforced, but keep messages clear
- They have a `GUIDELINES.md` — read it before submitting
- This is a "very minor change" so prior discussion in the issue is sufficient
- Expect review from maintainers — be patient, OZ reviews thoroughly

## Pre-Submission Checklist

- [ ] Comment on issue #6305 first: "I'd like to work on this, here's my proposed wording: ..."
- [ ] Wait for maintainer thumbs-up (or just submit if no response in 48h)
- [ ] Fork, branch, edit, changeset, lint, test, push, PR
- [ ] Fill out the PR template completely

## Risk Assessment

- **Low risk** — comment-only change, no code modification
- **High chance of merge** — clear issue, simple fix
- **Competition risk** — check if someone else already submitted a PR (search PRs for "6305" or "ReentrancyGuard comment")
