# Protocol Engineering Bootcamp — 14 Days
## From dApp Builder to Core Dev
### For: Faisal (Zexo)

**Starting point:** You understand Solidity, DeFi flows, ZK concepts. You can read code and understand logic. You've never written EVM-level code yourself or read client implementations. That's OK — we're fixing that.

**Time commitment:** 1.5-2 hours/day

**Rule:** NO AI coding for you during this bootcamp. You read, you type, you understand. Ask THRONE to explain, but don't ask THRONE to write.

---

## DAY 1: EVM Opcode Basics
**Goal:** Understand that Solidity compiles to opcodes, and what those opcodes do.

### Instructions:
1. Open https://www.evm.codes/
2. Read these opcodes one by one (click each for details):

**Stack operations (the basics):**
- `PUSH1` → pushes 1 byte onto stack
- `POP` → removes top of stack
- `DUP1` → duplicates top of stack
- `SWAP1` → swaps top two stack items

**Math:**
- `ADD`, `SUB`, `MUL`, `DIV` → basic math on stack items
- `MOD`, `EXP` → modulo and exponentiation

**Comparison:**
- `LT`, `GT`, `EQ` → less than, greater than, equal
- `ISZERO` → is top of stack zero?

**Memory & Storage:**
- `MLOAD` → load from memory (temporary, cheap)
- `MSTORE` → store to memory
- `SLOAD` → load from storage (permanent, expensive — 2100 gas cold)
- `SSTORE` → store to storage (permanent, very expensive — 20000 gas new slot)

**Flow control:**
- `JUMP` → go to code position
- `JUMPI` → conditional jump (this is how if/else works!)
- `JUMPDEST` → valid jump target

**Environment:**
- `CALLER` → this is `msg.sender` in Solidity!
- `CALLVALUE` → this is `msg.value`!
- `ORIGIN` → this is `tx.origin`
- `GASPRICE` → gas price of tx
- `BALANCE` → get ETH balance of address

**The important ones:**
- `CALL` → call another contract (this is how .call() works)
- `DELEGATECALL` → call but keep msg.sender (this is how proxies work!)
- `STATICCALL` → read-only call (this is how view functions work!)
- `CREATE` → deploy new contract
- `CREATE2` → deploy at deterministic address
- `LOG0`-`LOG4` → emit events (this is what emit Transfer() compiles to!)
- `RETURN` → return data
- `REVERT` → revert with data

### Homework:
Write down (on paper or a file) answers to:
- What's the difference between MEMORY and STORAGE?
- Why is SSTORE so expensive?
- How does Solidity's `if (x > 5)` translate to opcodes? (hint: GT + JUMPI)
- What opcode does `msg.sender` become?

---

## DAY 2: Trace a Real Transaction
**Goal:** See opcodes executing in a real transaction.

### Instructions:
1. Install Foundry if you haven't: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
2. Pick any Uniswap V3 swap transaction hash from Etherscan
3. Run:
```bash
cast run <TXHASH> --trace --rpc-url https://eth.llamarpc.com
```
4. You'll see output like:
```
[CALL] 0xRouter → 0xPool (value: 0, gas: 200000)
  [SLOAD] slot 0x00 → 0x...
  [CALL] 0xPool → 0xToken (value: 0, gas: 50000)
    [LOG3] Transfer(from, to, amount)
```
5. For each line, ask yourself:
   - Why is this CALL happening?
   - What contract is being called?
   - What does the SLOAD read? (hint: it's reading pool state like sqrtPriceX96)
   - Why is there a LOG3? (hint: ERC-20 Transfer event = LOG3 because it has 3 topics)

### Alternative if cast is slow:
- Go to https://openchain.xyz/trace
- Paste the tx hash
- It shows the full call trace visually

### Homework:
- Count how many CALLs happen in a single Uniswap swap
- Find where the ERC-20 Transfer events are emitted (LOG3)
- Find where ETH transfer happens (if any) — notice: no LOG for ETH! This is exactly why EIP-7708 exists

---

## DAY 3: Deploy + Disassemble Your Own Contract
**Goal:** Write Solidity → see what it becomes.

### Instructions:
1. Create a simple contract:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Simple {
    uint256 public count;
    
    function increment() external {
        count += 1;
    }
    
    function getCount() external view returns (uint256) {
        return count;
    }
}
```

2. Compile and get bytecode:
```bash
forge init day3 && cd day3
# Put the contract in src/Simple.sol
forge build
# Get the bytecode:
cat out/Simple.sol/Simple.json | jq -r '.bytecode.object'
```

3. Go to https://www.evm.codes/playground
4. Paste the bytecode
5. Step through it instruction by instruction

6. Now do the same with a slightly more complex contract:
```solidity
contract Transfer {
    mapping(address => uint256) public balances;
    
    event Transfer(address indexed from, address indexed to, uint256 amount);
    
    function transfer(address to, uint256 amount) external {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}
```

### Homework:
- Find where SSTORE happens in the increment() bytecode
- Find where LOG3 happens in the transfer() bytecode
- Notice: the `emit Transfer()` becomes LOG3 because:
  - topic[0] = keccak256("Transfer(address,address,uint256)")
  - topic[1] = from (indexed)
  - topic[2] = to (indexed)
  - data = amount
- This is EXACTLY the same log format EIP-7708 wants to add for ETH transfers!

---

## DAY 4: Read the Execution Specs
**Goal:** Read the actual Ethereum specification — it's Python, you can do this.

### Instructions:
1. Clone the repo:
```bash
git clone https://github.com/ethereum/execution-specs.git
cd execution-specs
```

2. Navigate to the latest fork:
```bash
ls src/ethereum/
# You'll see: frontier, homestead, ..., shanghai, cancun, prague
# Open the latest one you recognize
cd src/ethereum/cancun
```

3. Read these files IN ORDER:
```
vm/__init__.py          → Entry point: what is an "Environment"?
vm/interpreter.py       → THE MAIN LOOP: how the EVM runs
vm/instructions/        → Each opcode implementation
vm/instructions/stack.py    → push, pop, dup, swap
vm/instructions/arithmetic.py → add, sub, mul
vm/instructions/storage.py   → sload, sstore
vm/instructions/system.py    → call, create, return, revert
```

4. Focus on `vm/interpreter.py`:
```python
# This is the core loop. Simplified, it does:
while pc < len(code):
    op = code[pc]           # Read current opcode
    # Execute the opcode
    # Update gas
    # Move pc forward
```
That's it. The EVM is a while loop over bytecodes. That's the whole thing.

5. Now open `vm/instructions/system.py` and find the `call` function
   - Read it line by line
   - Notice: it creates a new "message" with the target address, value, gas
   - Notice: if value > 0, it transfers ETH (subtracts from caller, adds to callee)
   - Notice: NO LOG IS EMITTED for the ETH transfer — this is the gap EIP-7708 fills!

### Homework:
- In your own words, write what happens when the EVM hits a CALL opcode (3-5 sentences)
- Find where gas is deducted for CALL (hint: 2600 gas for cold address, 100 for warm)
- Find where value transfer happens in the call function

---

## DAY 5: CALL Opcode Deep Dive
**Goal:** Understand CALL completely — this is the most important opcode.

### Instructions:
1. Still in execution-specs, read `vm/instructions/system.py` → `call()` function again
2. CALL takes 7 arguments from the stack:
   - gas — how much gas to give the subcall
   - to — target address
   - value — ETH to send
   - argsOffset — where in memory the input data starts
   - argsSize — how big the input data is
   - retOffset — where to write the return data
   - retSize — how big the return data buffer is

3. Now understand the CALL variants:
   - `CALL` → normal call, can send ETH, callee sees your address as msg.sender
   - `DELEGATECALL` → runs callee's code but in YOUR storage context. msg.sender stays the same. This is how proxies work!
   - `STATICCALL` → read-only, reverts if callee tries to write state. This is how `view` functions are enforced!
   - `CALLCODE` → deprecated, don't worry about it

4. Draw a diagram (yes, on paper):
```
TX: User → Contract A → CALL → Contract B → CALL → Contract C
         msg.sender=User    msg.sender=A       msg.sender=B
         msg.value=1 ETH    msg.value=0.5 ETH  msg.value=0
```
Each CALL creates a new "call frame" with its own:
- msg.sender (the caller)
- msg.value (ETH sent)
- memory (fresh, empty)
- return data buffer
But they ALL share the same:
- storage (each contract has its own)
- global state

5. Now the key insight for EIP-7708:
   When Contract A CALLs Contract B with value=0.5 ETH:
   - A's balance decreases by 0.5 ETH
   - B's balance increases by 0.5 ETH
   - NO EVENT IS EMITTED
   - If you're not running a trace, you can't see this transfer happened
   - EIP-7708 adds: emit LOG3(SYSTEM_ADDRESS, Transfer, A, B, 0.5 ETH)

### Homework:
- Explain DELEGATECALL in your own words — why is it dangerous?
- If A → DELEGATECALL → B, what is msg.sender inside B?
- If A → CALL → B with 1 ETH, and B reverts, does A get its 1 ETH back? (yes!)
- If A → CALL → B with 1 ETH, and B → CALL → C, and C reverts, does B still have the 1 ETH? (yes! only C's state is rolled back)

---

## DAY 6: State Trie + World State
**Goal:** Understand how Ethereum stores ALL account data.

### Instructions:
1. Read: https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/
   (just the overview, don't get lost in the math)

2. Key concept — Ethereum's "world state" is a mapping:
```
address → Account {
    nonce:       how many txs sent (EOA) or contracts created (contract)
    balance:     ETH balance in wei
    storageRoot: root hash of this account's storage trie
    codeHash:    hash of the contract code (empty for EOAs)
}
```

3. Every SSTORE changes the storage trie of that contract
4. Every ETH transfer changes the balance of two accounts
5. Every transaction changes at least the sender's nonce + balance (gas payment)
6. A block = process all transactions → get new world state root
7. That state root goes into the block header — this is how light clients verify state

8. Open `execution-specs/src/ethereum/cancun/state.py`
   - Find `get_account()` — how to read an account
   - Find `set_account()` — how to modify an account
   - Find `move_ether()` — THIS is how ETH transfers work at protocol level!

### Homework:
- Why is SSTORE 20,000 gas for new slots but only 5,000 for existing? (hint: new slot = new node in the storage trie)
- What happens to the world state root when a single SSTORE happens? (the root hash changes completely because Merkle tree)
- Why do we need a state root in the block header? (so anyone can verify "yes, after all these txs, the state is correct")

---

## DAY 7: Block Production + state_transition()
**Goal:** Understand what happens between blocks.

### Instructions:
1. Open `execution-specs/src/ethereum/cancun/fork.py`
2. Find the function `state_transition()` — READ IT CAREFULLY
3. It does roughly this:
```python
def state_transition(chain, block):
    # 1. Validate the block header
    validate_header(block.header)
    
    # 2. Process each transaction
    for tx in block.transactions:
        receipt = process_transaction(env, tx)
        receipts.append(receipt)
    
    # 3. Pay the block reward / process withdrawals
    process_withdrawals(state, block.withdrawals)
    
    # 4. Calculate the new state root
    new_root = state_root(state)
    
    # 5. Verify it matches what the block header claims
    assert new_root == block.header.state_root
```

4. Now find `process_transaction()` in the same file or in `fork.py`
   - It validates the tx (nonce, gas, signature)
   - Deducts gas payment from sender
   - Creates a "message" and runs it through the EVM
   - Collects logs, calculates gas refund
   - Creates a receipt

5. THIS is the core of Ethereum. Everything else (networking, consensus, p2p) is just about agreeing on WHICH blocks to run through this function.

### Homework:
- In your own words: what is a "state transition"? (applying a block to transform state A into state B)
- What happens if a transaction reverts? (state changes for that tx are rolled back, but gas is still consumed)
- Where do transaction logs end up? (in the receipt, which goes into the receipts trie, which goes into the block header)

---

## DAY 8: Gas Accounting
**Goal:** Understand gas deeply — this is crucial for writing protocol tests.

### Instructions:
1. Open `execution-specs/src/ethereum/cancun/vm/gas.py`
2. Key gas costs to memorize:
```
SLOAD cold:     2100 gas (first time reading a slot in this tx)
SLOAD warm:      100 gas (already read before in this tx)
SSTORE new:    20000 gas (slot was zero, now non-zero)
SSTORE update:  5000 gas (slot was non-zero, changing value)
SSTORE reset:   2900 gas (slot going back to original value)
CALL cold:      2600 gas (calling address for first time)
CALL warm:       100 gas (already called in this tx)
CREATE:         32000 gas
LOG base:         375 gas + 375 per topic + 8 per byte of data
ETH transfer:   9000 gas (the value transfer part of CALL)
```

3. Now calculate: how much gas does EIP-7708 add per ETH transfer?
   - It emits a LOG3 (3 topics: event sig, from, to) + 32 bytes data (amount)
   - Cost: 375 (base) + 375*3 (topics) + 8*32 (data) = 375 + 1125 + 256 = 1756 gas
   - But the EIP says this cost is NOT charged because it's a system log
   - Wait — is it? Re-read the EIP. This is an open question worth exploring!

4. Understand EIP-2929 (access lists / warm vs cold):
   - First time you touch an address or storage slot = "cold" = expensive
   - After that in same tx = "warm" = cheap
   - This is why `access_list` exists in tx type 1 — pre-warm addresses/slots

### Homework:
- Calculate the gas cost of a simple ERC-20 transfer (ballpark):
  - 21000 base + SLOAD(from balance) + SLOAD(to balance) + SSTORE(from) + SSTORE(to) + LOG3
- Why did Ethereum add the warm/cold distinction? (prevents DoS: attacker can't SLOAD 1000 different slots cheaply)

---

## DAY 9: Receipts, Logs, Bloom Filters
**Goal:** Understand how events/logs work at protocol level — directly relevant to EIP-7708.

### Instructions:
1. Open `execution-specs/src/ethereum/cancun/fork.py`
2. After each transaction, a Receipt is created:
```python
Receipt {
    succeeded:        bool (did it revert?)
    cumulative_gas:   total gas used up to this tx in the block
    bloom:            bloom filter of all logs in this tx
    logs:             list of Log objects
}
```

3. Each Log has:
```python
Log {
    address:   the contract that emitted it
    topics:    list of 32-byte values (max 4)
    data:      arbitrary bytes
}
```

4. The bloom filter — understand this:
   - It's a 256-byte (2048-bit) bitfield in every block header
   - For each log, the address and each topic are hashed and bits are set
   - This lets light clients quickly check: "does this block POSSIBLY contain a Transfer event from address X?"
   - It can have false positives but never false negatives

5. For EIP-7708:
   - New system logs are emitted from SYSTEM_ADDRESS (0xfff...ffe)
   - These go into the bloom filter
   - Indexers can filter for Transfer events from SYSTEM_ADDRESS to find all ETH transfers
   - This is HUGE for block explorers — one filter catches all ETH movements

### Homework:
- What's the difference between topics and data in a log? (topics are indexed/searchable, data is not)
- Why can logs only have max 4 topics? (LOG0-LOG4 opcodes, it's hard-coded in the EVM)
- After EIP-7708, how would you find all ETH transfers in a block? (filter logs where address=SYSTEM_ADDRESS and topic[0]=Transfer signature)

---

## DAY 10: Consensus Layer Basics
**Goal:** Understand the other half of Ethereum (you don't need to go deep, just the model).

### Instructions:
1. Read: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/
2. Key concepts:
   - **Slot:** 12-second time window. One validator proposes a block per slot.
   - **Epoch:** 32 slots = 6.4 minutes
   - **Validator:** stakes 32 ETH, proposes + attests blocks
   - **Attestation:** "I agree block X at slot Y is valid and should be the head"
   - **Finality:** after 2 epochs (~13 min), blocks are finalized — can't be reverted

3. The two-layer architecture:
```
Consensus Layer (CL): Prysm, Lighthouse, Teku, Lodestar
  - Manages validators, attestations, finality
  - Tells EL: "here's the next block to build/validate"
  
Execution Layer (EL): Geth, Reth, Nethermind, Besu
  - Runs the EVM, processes transactions
  - Reports back to CL: "here's the state root after executing"
  
They talk via the Engine API (JSON-RPC between CL and EL)
```

4. For your purposes (EIP contributions):
   - Most EIPs you'll work on are Execution Layer (EVM, state, txs)
   - Consensus Layer EIPs exist but are harder to contribute to
   - EIP-7708 is purely Execution Layer — it changes what happens during CALL execution
   - The Amsterdam hard fork coordinates changes across BOTH layers

### Homework:
- In one sentence: what's the difference between EL and CL?
- Why does Ethereum have two layers? (The Merge — PoW→PoS kept EL but replaced PoW with CL)
- If you want to contribute to EVM/state/gas stuff, which layer do you work on? (EL)

---

## DAY 11: Read Geth — interpreter.go
**Goal:** Read the most important Go file in Ethereum.

### Instructions:
1. Clone geth:
```bash
git clone https://github.com/ethereum/go-ethereum.git
cd go-ethereum
```

2. Open `core/vm/interpreter.go`
3. Find the `Run()` method — this is the EVM main loop in Go:
```go
func (in *EVMInterpreter) Run(contract *Contract, input []byte) ([]byte, error) {
    // ... setup ...
    for {
        op = contract.GetOp(pc)    // Read opcode at current position
        operation := in.table[op]  // Look up the operation
        // ... gas check ...
        res, err = operation.execute(&pc, in, callContext)  // Execute it!
        pc++
    }
}
```

4. Don't panic about Go syntax. Focus on:
   - `in.table[op]` — this is a lookup table mapping opcode → function
   - Each operation has: execute function, gas cost function, stack requirements
   - The loop continues until STOP, RETURN, REVERT, or error

5. Open `core/vm/jump_table.go` — find where the table is built
   - Search for `newFrontierInstructionSet` and follow to the latest fork
   - Each entry maps an opcode to its handler

### Homework:
- In your own words: what does the EVM interpreter loop do? (read opcode, check gas, execute, repeat)
- What happens when gas runs out mid-execution? (ErrOutOfGas, all state changes in this call frame are reverted)
- Find the `CALL` entry in the jump table — what function does it point to?

---

## DAY 12: Read Geth — instructions.go
**Goal:** See how individual opcodes are implemented in a real client.

### Instructions:
1. Open `core/vm/instructions.go`
2. Find `opCall` — this is the CALL implementation:
```go
func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
    // Pop 7 values from stack: gas, addr, value, inOffset, inSize, retOffset, retSize
    // ...
    // Execute the call
    ret, returnGas, err := interpreter.evm.Call(scope.Contract, toAddr, args, gas, bigVal)
    // ...
}
```

3. Now find `evm.Call()` in `core/vm/evm.go`:
```go
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) ([]byte, uint64, error) {
    // Transfer value (ETH)
    evm.Context.Transfer(evm.StateDB, caller.Address(), addr, value)
    // Run the code
    ret, err = evm.interpreter.Run(contract, input)
    // ...
}
```

4. See that `Transfer` call? That's where ETH moves. Open `core/vm/evm.go` and find the Transfer function:
```go
func Transfer(db StateDB, sender, recipient common.Address, amount *big.Int) {
    db.SubBalance(sender, amount)
    db.AddBalance(recipient, amount)
}
```
That's it. Two lines. Subtract from sender, add to recipient. NO LOG. This is the exact spot where EIP-7708 would add a log emission.

### Homework:
- Where exactly in geth's code would you add the EIP-7708 log? (after the Transfer() call in evm.Call())
- What would the code look like? (something like: `evm.StateDB.AddLog(&types.Log{Address: SystemAddress, Topics: [transferSig, from, to], Data: amount})`)
- Find `opDelegateCall` — how is it different from `opCall`? (no value transfer, different msg.sender)

---

## DAY 13: Map EIP-7708 to Actual Code
**Goal:** Connect the spec to real code locations.

### Instructions:
1. Re-read EIP-7708 spec: https://eips.ethereum.org/EIPS/eip-7708
2. For each spec requirement, find WHERE in the code it would go:

**"Any nonzero-value-transferring transaction"**
→ `core/state_transition.go` → `TransitionDb()` → where `msg.Value` is transferred
→ execution-specs: `fork.py` → `process_transaction()` → where value is moved

**"Any nonzero-value-transferring CALL"**
→ `core/vm/evm.go` → `Call()` → after `Transfer()`
→ execution-specs: `vm/instructions/system.py` → `call()` → after value transfer

**"Any nonzero-value-transferring SELFDESTRUCT"**
→ `core/vm/instructions.go` → `opSelfdestruct`
→ execution-specs: `vm/instructions/system.py` → `selfdestruct()`

3. Now check the PR that's ALREADY implementing this:
   - Go to https://github.com/ethereum/go-ethereum/pull/33645
   - Read the diff — see where they add log emissions
   - Compare with your guesses from step 2

### Homework:
- Write a summary: "EIP-7708 touches these files in geth: ..." (list them)
- Write a summary: "EIP-7708 touches these files in execution-specs: ..." (list them)
- What's the one edge case you'd test first? (CALL with value that reverts — does the log get rolled back?)

---

## DAY 14: Write Your First Execution Spec Test
**Goal:** Actually write code that tests Ethereum.

### Instructions:
1. Clone execution-spec-tests:
```bash
git clone https://github.com/ethereum/execution-spec-tests.git
cd execution-spec-tests
```

2. Install dependencies:
```bash
pip install -e ".[docs,lint,test]"
# or use uv/pdm if available
```

3. Look at existing test examples:
```bash
ls tests/cancun/
# Find a simple test, like tests/cancun/eip4844/
# Read how tests are structured
```

4. Test structure:
```python
@pytest.mark.parametrize("value", [1, 0])
def test_call_with_value(state_test, pre, value):
    """Test that CALL with value transfers ETH."""
    # Set up pre-state (accounts, balances, code)
    # Define the transaction
    # Define expected post-state
    # state_test runs it and checks
```

5. Write a simple test:
   - Deploy a contract that does CALL with 1 ETH to another address
   - Check that after execution, the recipient has 1 ETH
   - Check that the receipt contains NO Transfer log (pre-EIP-7708)
   - This is your baseline test!

6. Run it:
```bash
pytest tests/your_test.py -v
```

### Homework:
- Did your test pass? If not, debug it. This is the real work.
- Now think: how would this test change AFTER EIP-7708? (the receipt SHOULD contain a Transfer log from SYSTEM_ADDRESS)
- Congratulations — you can now write protocol-level tests. This is what gets merged into ethereum/ repos.

---

## AFTER THE 14 DAYS

You'll know:
- How the EVM works internally (not just "it runs Solidity")
- How to read execution-specs AND geth code
- Where specific EIP changes go in the codebase
- How to write execution spec tests

You'll be ready to:
- Post substantive comments on EIPs (because you've read the actual code)
- Submit test PRs to ethereum/execution-spec-tests
- Review PRs on geth/reth (even if you don't write Go/Rust fluently)
- Talk to core devs without sounding like you're bluffing

The gap is closed. Now go ship. 👑
