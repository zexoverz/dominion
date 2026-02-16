# EIP-7708 Ethereum Magicians Comment Draft
## By: Faisal (ETHJKT / GrimSwap)
## Target: https://ethereum-magicians.org/t/eip-7708-eth-transfers-emit-a-log/20034

---

**Title:** Privacy implications + a few edge cases worth discussing

---

Been thinking about this one for a while. For context — I built a ZK privacy DEX on Uniswap V4 hooks (GrimSwap, ETHGlobal Top 10), so my brain immediately goes to the privacy angle when I see "emit a log for every ETH transfer."

**The good:**
This solves a real pain point. Smart contract wallet deposits being invisible to exchanges/indexers has been a problem forever. Unifying ETH tracking under the same Transfer event as ERC-20 is elegant — one event signature to index everything. Block explorers and analytics tools will love this.

**The privacy concern:**
Right now, internal ETH transfers via CALL are somewhat opaque to lightweight observers — you need to trace execution to find them. After this EIP, every single ETH movement becomes a first-class log entry. That's great for transparency, but it also means:

1. **Privacy pools and mixers get weaker.** Any contract that moves ETH internally now broadcasts those movements as logs. If you're trying to break the link between depositor and withdrawer (e.g., Tornado-style or the privacy pools design from Vitalik's own paper), those internal CALL transfers are now visible without tracing. The log literally says "from A, to B, amount X" in a standardized format that anyone can filter.

2. **Smart contract wallets lose a layer of obscurity.** AA wallets (ERC-4337) doing internal transfers between sub-accounts — those movements become trivially indexable. Not necessarily bad, but worth acknowledging as a tradeoff.

3. **MEV searchers get more signal.** Standardized ETH transfer logs = easier to build real-time flow analysis. Every internal CALL with value is now a searchable event without running a trace. This is more data for sandwich bots and statistical arbitrage.

Not saying any of this is a dealbreaker — the benefits clearly outweigh these concerns. But the spec's Security Considerations section only talks about gas/log count. Might be worth adding a note about the observability increase.

**On the open questions:**

- **Fee payments triggering logs:** I'd say no. The log count explosion would be real — every single transaction generating an extra log for priority fee to coinbase. And fees are already deterministically computable from the receipt. Adding logs for completeness is nice in theory but the gas overhead across the entire network isn't worth it for data you can already derive.

- **Withdrawals triggering logs:** This one I'd actually lean yes on, or at least have a separate EIP for it. Withdrawals are the one remaining case where ETH appears "from nowhere" with no log trail. If the goal is "all ETH movements are trackable via logs," leaving withdrawals out breaks that guarantee.

- **SYSTEM_ADDRESS vs 0xeee...:** SYSTEM_ADDRESS makes more sense to me. It's already used in EIP-4788 for beacon root deposits, so there's precedent. Using 0xeee... would create a second "system" address convention for no real benefit.

**One edge case:**

What happens with zero-value CALLs that revert? The spec says "nonzero-value-transferring" which handles this, but what about a CALL with value that gets reverted in a sub-call? The log gets emitted "at the time that the value transfer executes" — does revert roll it back? I'd assume yes (logs in reverted contexts get dropped), but might be worth making that explicit in the spec since these are system-level logs, not contract-emitted ones.

Would be happy to help write test cases for this. The "Test Cases" section is still TODO and I'm already digging into execution-spec-tests for Amsterdam coverage.

— Faisal (ETHJKT / GrimSwap)
