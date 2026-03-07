# Protocol Engineering Bootcamp — 8 Weeks
## From dApp Builder to Core Dev
### For: Faisal (Zexo)

**Starting point:** You understand Solidity, DeFi flows, ZK concepts. You can read code and understand logic. You've never written EVM-level code yourself or read client implementations. That's OK — we're fixing that.

**Time commitment:** 1.5-2 hours/day, 5 days/week

**Rule:** NO AI coding for you during this bootcamp. You read, you type, you understand. Ask THRONE to explain, but don't ask THRONE to write.

**Philosophy:** One concept per day. Go deep, not wide. If a day takes you two days, that's fine — understanding beats speed.

---

# WEEK 1-2: EVM & OPCODES (Days 1-10)

---

## DAY 1: The Stack Machine Mental Model
**Goal:** Understand that the EVM is a stack machine and what that means.

### Instructions:
1. Open https://www.evm.codes/
2. Read the intro: the EVM is a **stack-based virtual machine**. Everything operates on a stack of 256-bit (32-byte) words. Max depth: 1024.
3. Understand the stack model:
   - Operations **pop** inputs from the top of the stack
   - Operations **push** results back onto the stack
   - There are no registers, no variables — just the stack

4. Read these stack opcodes one by one (click each for details):
   - `PUSH1` through `PUSH32` → push 1-32 bytes onto stack
   - `POP` → removes top of stack (discards it)
   - `DUP1` through `DUP16` → duplicates the Nth stack item to the top
   - `SWAP1` through `SWAP16` → swaps top of stack with Nth item below

5. Practice mentally: trace what happens to the stack for:
```
PUSH1 0x05    → stack: [5]
PUSH1 0x03    → stack: [3, 5]
ADD           → stack: [8]
PUSH1 0x02    → stack: [2, 8]
MUL           → stack: [16]
```

6. Now trace this one yourself (write it out on paper):
```
PUSH1 0x0A
PUSH1 0x14
DUP2
ADD
SWAP1
SUB
```

### Homework:
- What is the maximum stack depth? (1024)
- What happens if you try to push onto a full stack? (stack overflow, execution reverts)
- What happens if you POP from an empty stack? (stack underflow, execution reverts)
- Trace the 6-instruction sequence above on paper. What's the final stack state?
- Why 256-bit words? (Ethereum addresses are 160-bit, hashes are 256-bit — 256 covers everything)

---

## DAY 2: Arithmetic & Comparison Opcodes
**Goal:** Understand how math and logic work in the EVM.

### Instructions:
1. Still on https://www.evm.codes/, read these opcodes:

**Arithmetic:**
- `ADD`, `SUB`, `MUL`, `DIV` → basic math on the top two stack items
- `SDIV`, `SMOD` → signed versions (two's complement)
- `MOD` → modulo
- `EXP` → exponentiation (careful: gas cost is proportional to exponent size!)
- `ADDMOD`, `MULMOD` → modular arithmetic (used in cryptography)
- `SIGNEXTEND` → extend sign bit

**Comparison & Bitwise:**
- `LT`, `GT`, `SLT`, `SGT` → less than, greater than (signed and unsigned)
- `EQ` → equality check — pushes 1 or 0
- `ISZERO` → is top of stack zero? pushes 1 or 0
- `AND`, `OR`, `XOR`, `NOT` → bitwise operations
- `BYTE` → extract a single byte from a 32-byte word
- `SHL`, `SHR`, `SAR` → shift left, shift right, arithmetic shift right

2. Key insight: **there are no booleans in the EVM**. Everything is a 256-bit integer. Zero = false, non-zero = true.

3. Trace how Solidity's `if (x > 5)` becomes opcodes:
```
PUSH1 0x05    → stack: [5, x]  (x was already on stack)
GT            → stack: [1] or [0]
PUSH1 0x20    → stack: [0x20, 1_or_0]  (jump destination)
JUMPI         → if top-1 != 0, jump to 0x20
```

### Homework:
- How does the EVM represent `true`? (any non-zero value, typically 1)
- What's the difference between `DIV` and `SDIV`? (unsigned vs signed — matters for negative numbers)
- Why does EXP have variable gas cost? (prevents cheap computation of huge exponents)
- Trace: `PUSH1 10, PUSH1 3, DIV` — what's on the stack? (3, because integer division)
- Trace: `PUSH1 10, PUSH1 3, MOD` — what's on the stack? (1)

---

## DAY 3: Memory — The Scratch Pad
**Goal:** Understand EVM memory — the temporary, byte-addressable workspace.

### Instructions:
1. On evm.codes, read these opcodes:
   - `MLOAD` → load 32 bytes from memory at offset
   - `MSTORE` → store 32 bytes to memory at offset
   - `MSTORE8` → store 1 byte to memory at offset
   - `MSIZE` → current size of memory in bytes

2. Key properties of memory:
   - **Byte-addressable** — you can read/write at any byte offset
   - **Temporary** — cleared between external calls, doesn't persist
   - **Costs gas to expand** — starts at 0 bytes, grows as needed
   - **Expansion cost is quadratic** — first 724 bytes are cheap (3 gas per word), then cost ramps up: `cost = (words² / 512) + (3 * words)`
   - **Never shrinks** — once expanded, stays expanded for that call

3. Memory layout convention in Solidity:
```
0x00 - 0x3f: Scratch space (Solidity uses for hashing)
0x40 - 0x5f: Free memory pointer (points to next available memory)
0x60 - 0x7f: Zero slot (Solidity uses as initial value for dynamic memory arrays)
0x80+:       Actual free memory starts here
```

4. Trace this:
```
PUSH1 0x42          → stack: [0x42]
PUSH1 0x80          → stack: [0x80, 0x42]
MSTORE              → memory[0x80..0x9f] = 0x42 (padded to 32 bytes), stack: []
PUSH1 0x80          → stack: [0x80]
MLOAD               → stack: [0x42]
```

### Homework:
- What is the free memory pointer? Where is it stored? (at memory offset 0x40, Solidity starts it at 0x80)
- Why is memory expansion cost quadratic? (prevents contracts from using unlimited RAM)
- If you MSTORE at offset 1000, how much memory is allocated? (1032 bytes — rounds up to 32-byte word)
- What's the difference between memory and storage? (memory is temporary + cheap, storage is permanent + expensive)

---

## DAY 4: Storage — The Permanent Database
**Goal:** Understand EVM storage — the permanent, slot-based key-value store.

### Instructions:
1. On evm.codes, read:
   - `SLOAD` → load 32 bytes from storage slot
   - `SSTORE` → store 32 bytes to storage slot

2. Key properties of storage:
   - **Slot-addressable** — 2^256 slots, each 32 bytes
   - **Permanent** — persists between transactions, stored on disk
   - **Very expensive** — SSTORE (new slot): 20,000 gas. SLOAD (cold): 2,100 gas
   - **Per-contract** — each contract has its own independent storage

3. Solidity storage layout:
```
Slot 0: First state variable
Slot 1: Second state variable
Slot 2: Third state variable
...
```

For a contract:
```solidity
contract Example {
    uint256 public x;      // slot 0
    uint256 public y;      // slot 1
    address public owner;  // slot 2
    bool public paused;    // slot 2 (packed with owner! address=20 bytes + bool=1 byte fits in 32)
}
```

4. Verify on a real contract:
```bash
# Read slot 0 of WETH contract
cast storage 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 0 --rpc-url https://eth.llamarpc.com
# Read slot 1
cast storage 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 1 --rpc-url https://eth.llamarpc.com
```

5. Gas costs to memorize:
```
SLOAD cold:     2,100 gas (first time reading a slot in this tx)
SLOAD warm:       100 gas (already read before in this tx)
SSTORE new:    20,000 gas (slot was zero → non-zero)
SSTORE update:  5,000 gas (slot was non-zero → different non-zero)
SSTORE clear:   gets refund (slot → zero, up to 4,800 gas refund)
```

### Homework:
- Why is SSTORE 20,000 gas for new slots? (creates a new node in the storage trie — permanent state bloat)
- If a contract has 3 `uint256` variables, which slots are they in? (0, 1, 2)
- Why does "warm" vs "cold" matter? (EIP-2929: first access loads from disk, subsequent from cache)
- Read 3 different storage slots of any mainnet contract using `cast storage`. What values do you get?

---

## DAY 5: Mappings & Storage Slot Computation (keccak256)
**Goal:** Understand how Solidity maps dynamic data structures to storage slots.

### Instructions:
1. Mappings can't use sequential slots (the key space is too large). Instead:
```
slot_for_mapping_value = keccak256(abi.encode(key, mapping_slot))
```

For a contract:
```solidity
contract Token {
    mapping(address => uint256) public balanceOf;  // slot 0
}
```
The balance of address `0xABC...` is stored at:
```
slot = keccak256(abi.encode(0xABC..., 0))
     = keccak256(0x000000000000000000000000ABC...0000000000000000000000000000000000000000000000000000000000000000)
```

2. Try it yourself:
```bash
# Compute the storage slot for USDC balanceOf[some_address]
# USDC balanceOf mapping is at slot 9

# First, encode the key and slot:
cast keccak 0x000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA960450000000000000000000000000000000000000000000000000000000000000009

# Then read that slot:
cast storage 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 <computed_slot> --rpc-url https://eth.llamarpc.com
```

3. Nested mappings (like `mapping(address => mapping(address => uint256))`):
```
slot = keccak256(abi.encode(inner_key, keccak256(abi.encode(outer_key, mapping_slot))))
```

4. Dynamic arrays:
```
array.length → stored at the declared slot (e.g., slot 3)
array[i]     → stored at keccak256(3) + i
```

### Homework:
- Compute the storage slot for `balanceOf[your_address]` in any ERC-20 contract. Verify with `cast storage`.
- Why does Solidity use keccak256 for mapping slots? (to distribute values uniformly across 2^256 slot space, avoiding collisions)
- What happens if two different keys hash to the same slot? (virtually impossible — keccak256 collision)
- Why can't you enumerate all keys in a mapping? (the keys aren't stored anywhere — you'd need to hash every possible key)

---

## DAY 6: Calldata & the Function Dispatcher
**Goal:** Understand how the EVM knows which function to call.

### Instructions:
1. On evm.codes, read:
   - `CALLDATALOAD` → load 32 bytes from calldata at offset
   - `CALLDATASIZE` → size of calldata in bytes
   - `CALLDATACOPY` → copy calldata to memory

2. When you call a function, the calldata looks like:
```
0x70a08231                                              ← function selector (first 4 bytes)
000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045  ← first argument (padded to 32 bytes)
```

3. The function selector is the first 4 bytes of `keccak256("functionName(argType1,argType2)")`:
```bash
cast sig "balanceOf(address)"
# Output: 0x70a08231

cast sig "transfer(address,uint256)"
# Output: 0xa9059cbb
```

4. The **function dispatcher** is the first thing in every Solidity contract's bytecode:
```
PUSH1 0x00
CALLDATALOAD       → load first 32 bytes of calldata
PUSH1 0xe0
SHR                → shift right 224 bits (= 28 bytes) to get just the 4-byte selector
DUP1
PUSH4 0x70a08231   → "balanceOf(address)" selector
EQ                 → does it match?
PUSH2 0x0045       → jump destination for balanceOf
JUMPI              → if match, jump to balanceOf code
DUP1
PUSH4 0xa9059cbb   → "transfer(address,uint256)" selector
EQ
PUSH2 0x0067
JUMPI              → if match, jump to transfer code
...
PUSH1 0x00
DUP1
REVERT             → no match = revert (or hit fallback/receive)
```

5. Deploy and verify:
```bash
# Create any contract, compile it, and look at the bytecode
# The first ~50 bytes will be this dispatcher pattern
forge build
cat out/YourContract.sol/YourContract.json | jq -r '.bytecode.object' | head -c 200
```

### Homework:
- Compute the function selector for `approve(address,uint256)` using cast sig
- Why is the selector only 4 bytes? (gas efficiency — 4 bytes is enough to avoid collisions in practice)
- Can two functions have the same selector? (yes, it's called a selector collision — extremely rare but possible)
- Look at the bytecode of a compiled contract. Can you identify the dispatcher pattern?

---

## DAY 7: ABI Encoding
**Goal:** Understand how function arguments are encoded in calldata.

### Instructions:
1. ABI encoding rules:
   - Everything is padded to 32 bytes
   - Static types (uint256, address, bool) are encoded in-place
   - Dynamic types (bytes, string, arrays) use an offset pointer + length + data

2. Encode a simple call:
```bash
# transfer(address,uint256)
cast calldata "transfer(address,uint256)" 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 1000000000000000000
```
Output breakdown:
```
a9059cbb                                                         ← selector
000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045 ← address (left-padded with zeros)
0000000000000000000000000000000000000000000000000de0b6b3a7640000 ← uint256 (1e18 in hex)
```

3. Decode calldata from a real transaction:
```bash
# Pick any Uniswap transaction and decode it:
cast 4byte-decode 0xa9059cbb000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA960450000000000000000000000000000000000000000000000000de0b6b3a7640000
```

4. Dynamic types are more complex:
```bash
cast calldata "transfer(address,uint256,bytes)" 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 1000000000000000000 0xdeadbeef
```
The bytes argument uses an offset pointer — study the output carefully.

### Homework:
- Encode a call to `swap(uint256,uint256,address,bytes)` with sample values. Break down each 32-byte chunk.
- Why is ABI encoding padded to 32 bytes? (matches EVM word size — CALLDATALOAD always reads 32 bytes)
- Decode the calldata of a real mainnet transaction using `cast 4byte-decode`
- What's the difference between `abi.encode` and `abi.encodePacked`? (packed removes padding — used in keccak256 for tighter hashing, but can't be decoded by the ABI)

---

## DAY 8: CALL vs DELEGATECALL vs STATICCALL
**Goal:** Understand the three critical call opcodes and their security implications.

### Instructions:
1. On evm.codes, read opcodes `CALL` (0xF1), `DELEGATECALL` (0xF4), `STATICCALL` (0xFA):

2. **CALL** — the normal external call:
```
Contract A → CALL → Contract B
  - msg.sender inside B = address(A)
  - msg.value inside B = whatever A sent
  - Storage context = B's storage
  - Code executed = B's code
```

3. **DELEGATECALL** — execute B's code in A's context:
```
Contract A → DELEGATECALL → Contract B
  - msg.sender inside B = whoever called A (preserved!)
  - msg.value inside B = whatever was sent to A (preserved!)
  - Storage context = A's storage (!)
  - Code executed = B's code
```
This is how **proxies** work. The proxy (A) DELEGATECALLs to the implementation (B), so B's code modifies A's storage.

4. **STATICCALL** — read-only call:
```
Contract A → STATICCALL → Contract B
  - Same as CALL, but if B tries to modify state (SSTORE, LOG, CREATE, SELFDESTRUCT), it reverts
  - This is how `view`/`pure` functions are enforced at the EVM level
```

5. Draw this diagram on paper:
```
User → A → CALL(1 ETH) → B → CALL(0) → C
  A: msg.sender=User, msg.value=from_user
  B: msg.sender=A, msg.value=1 ETH, storage=B's
  C: msg.sender=B, msg.value=0, storage=C's

User → A → DELEGATECALL → B
  B runs but: msg.sender=User, storage=A's!
```

6. CALL takes 7 arguments from the stack:
   - gas, to, value, argsOffset, argsSize, retOffset, retSize
   DELEGATECALL takes 6 (no value — it preserves the original value)
   STATICCALL takes 6 (no value — can't send ETH in a read-only call)

### Homework:
- Why is DELEGATECALL dangerous? (B's code runs with A's storage — if B is malicious, it can drain A)
- How do proxy upgrades work? (proxy DELEGATECALLs to implementation; to upgrade, change the implementation address in proxy's storage)
- If A → DELEGATECALL → B, and B does `SSTORE(slot 0, 42)`, whose storage slot 0 is written? (A's!)
- If A → CALL → B with 1 ETH, and B reverts, does A get the ETH back? (Yes! The entire call frame is rolled back)

---

## DAY 9: Deploy + Disassemble Your Own Contract
**Goal:** Write Solidity → see what it becomes at the opcode level.

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
forge init day9 && cd day9
# Put the contract in src/Simple.sol
forge build
# Get the bytecode:
cat out/Simple.sol/Simple.json | jq -r '.bytecode.object'
```

3. Go to https://www.evm.codes/playground
4. Paste the bytecode
5. Step through it instruction by instruction — you should recognize:
   - The function dispatcher (from Day 6)
   - SLOAD/SSTORE (from Day 4)
   - The stack operations (from Day 1)

6. Now do the same with a more complex contract:
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
- Notice: `emit Transfer()` becomes LOG3 because:
  - topic[0] = keccak256("Transfer(address,address,uint256)")
  - topic[1] = from (indexed)
  - topic[2] = to (indexed)
  - data = amount
- This is EXACTLY the same log format EIP-7708 wants to add for ETH transfers!

---

## DAY 10: Trace a Real Transaction + Gas Mechanics
**Goal:** See opcodes executing in a real transaction and understand gas costs.

### Instructions:
1. Install Foundry if you haven't: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
2. Pick any Uniswap V3 swap transaction hash from Etherscan
3. Run:
```bash
cast run <TXHASH> --trace --rpc-url https://eth.llamarpc.com
```
4. For each line, identify:
   - Which opcode is executing
   - What the gas cost is (cold vs warm?)
   - Why each CALL happens (what contract, what function?)
   - Where LOG3 appears (ERC-20 Transfer events)

5. Alternative visual trace: https://openchain.xyz/trace

6. Gas mechanics to understand:
   - **EIP-2929 (cold/warm):** First time touching an address/slot = cold = expensive. After = warm = cheap.
   - **EIP-1559:** Base fee (burned) + priority fee (to validator). `max_fee_per_gas` ≥ `base_fee + priority_fee`.
   - **21,000 base gas:** Every transaction costs at least 21,000 gas
   - **Calldata cost:** 4 gas per zero byte, 16 gas per non-zero byte

7. Calculate gas for a simple ERC-20 transfer:
```
21,000  (base tx cost)
+ 2,100 (SLOAD cold: read sender balance)
+ 5,000 (SSTORE: update sender balance)
+ 2,100 (SLOAD cold: read recipient balance)
+ 20,000 or 5,000 (SSTORE: update recipient balance — 20k if new, 5k if existing)
+ 1,756 (LOG3: 375 base + 375*3 topics + 8*32 data bytes)
+ ~200  (calldata, stack ops, etc.)
≈ 32,000 - 52,000 gas
```

### Homework:
- Count how many CALLs happen in a single Uniswap swap
- Find where the ERC-20 Transfer events are emitted (LOG3)
- Find where ETH transfer happens (if any) — notice: **NO LOG for ETH!** This is exactly why EIP-7708 exists
- What's the actual gas used for a simple ETH transfer? (21,000 — just the base cost, no contract execution)

---

# WEEK 3-4: EXECUTION LAYER & STATE (Days 11-20)

---

## DAY 11: Read execution-specs — The Python EVM
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

### Homework:
- Read `interpreter.py` end to end. How many lines is it? (surprisingly short)
- Find the opcode dispatch — how does it map opcode byte → Python function?
- Where is gas deducted?
- In your own words, what is an "Environment" in the EVM context?

---

## DAY 12: Storage in the Specs — SLOAD & SSTORE
**Goal:** Trace SLOAD and SSTORE through the execution-specs source code.

### Instructions:
1. Open `src/ethereum/cancun/vm/instructions/storage.py`
2. Read the `sload()` function:
   - It takes an address and slot
   - Checks warm/cold access (EIP-2929)
   - Charges appropriate gas
   - Returns the value from state

3. Read the `sstore()` function:
   - Much more complex gas logic
   - Handles: zero→non-zero (20k), non-zero→non-zero (5k), non-zero→zero (refund)
   - EIP-2200 / EIP-3529 refund rules

4. Follow the call chain into `state.py`:
```
sstore() → set_storage() → ...
```
Find `set_storage()` and `get_storage()` in the state module. These modify the state trie.

### Homework:
- Trace the full call chain for SSTORE: `execute_code → sstore → set_storage → ?`
- What's the "original value" concept in SSTORE gas? (the value at the start of the transaction, not the current value)
- What happens if you SSTORE the same slot twice in one transaction? (second one is warm = cheaper)

---

## DAY 13: The CALL Implementation in execution-specs
**Goal:** Read how CALL works at the specification level.

### Instructions:
1. Open `src/ethereum/cancun/vm/instructions/system.py` and find the `call()` function
2. CALL takes 7 arguments from the stack:
   - gas, to, value, argsOffset, argsSize, retOffset, retSize

3. Trace the full call chain:
```
call() → generic_call() → message_call() → process_message_call() → execute_code()
```

4. Focus on value transfer:
   - Find where value > 0 triggers ETH transfer
   - Notice: balance is subtracted from caller, added to callee
   - Notice: **NO LOG IS EMITTED** — this is the gap EIP-7708 fills

5. Find the 2300 gas stipend:
   - When CALL sends value > 0, callee gets a bonus 2300 gas
   - This is why `address.transfer()` and `address.send()` forward exactly 2300 gas

### Homework:
- In your own words, write what happens when the EVM hits a CALL opcode (5-7 sentences, be specific)
- Where does gas get deducted for CALL? (2600 gas for cold address, 100 for warm)
- Where does value transfer happen in the code? Exact file and function name.
- If CALL with value reverts, does the ETH come back? (Yes — the entire call frame state is rolled back)

---

## DAY 14: State Trie + World State
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

8. Open `execution-specs/src/ethereum/cancun/state.py`:
   - Find `get_account()` — how to read an account
   - Find `set_account()` — how to modify an account
   - Find `move_ether()` — THIS is how ETH transfers work at protocol level!

### Homework:
- Why is SSTORE 20,000 gas for new slots but only 5,000 for existing? (new slot = new node in the storage trie = state bloat)
- What happens to the world state root when a single SSTORE happens? (the root hash changes completely — Merkle tree property)
- Verify: use `cast balance`, `cast nonce`, and `cast code` on any mainnet address

---

## DAY 15: Block Production + state_transition()
**Goal:** Understand what happens between blocks.

### Instructions:
1. Open `execution-specs/src/ethereum/cancun/fork.py`
2. Find `state_transition()` — READ IT CAREFULLY:
```python
def state_transition(chain, block):
    # 1. Validate the block header
    validate_header(block.header)
    # 2. Process each transaction
    for tx in block.transactions:
        receipt = process_transaction(env, tx)
        receipts.append(receipt)
    # 3. Process withdrawals
    process_withdrawals(state, block.withdrawals)
    # 4. Calculate the new state root
    new_root = state_root(state)
    # 5. Verify it matches
    assert new_root == block.header.state_root
```

3. Find `process_transaction()`:
   - Validates the tx (nonce, gas, signature)
   - Deducts gas payment from sender
   - Creates a "message" and runs it through the EVM
   - Collects logs, calculates gas refund
   - Creates a receipt

4. THIS is the core of Ethereum. Everything else (networking, consensus, p2p) is just about agreeing on WHICH blocks to run through this function.

### Homework:
- In your own words: what is a "state transition"? (applying a block to transform state A into state B)
- What happens if a transaction reverts? (state changes for that tx are rolled back, but gas is still consumed)
- Where do transaction logs end up? (in the receipt → receipts trie → block header)

---

## DAY 16: Receipts, Logs, and Bloom Filters
**Goal:** Understand how events/logs work at protocol level — directly relevant to EIP-7708.

### Instructions:
1. After each transaction, a Receipt is created:
```python
Receipt {
    succeeded:        bool
    cumulative_gas:   total gas used up to this tx in the block
    bloom:            bloom filter of all logs in this tx
    logs:             list of Log objects
}
```

2. Each Log has:
```python
Log {
    address:   the contract that emitted it
    topics:    list of 32-byte values (max 4)
    data:      arbitrary bytes
}
```

3. The bloom filter — 256-byte (2048-bit) bitfield:
   - For each log, address and each topic are hashed → bits are set
   - Lets light clients quickly check: "does this block possibly contain a Transfer event?"
   - False positives possible, false negatives impossible

4. For EIP-7708:
   - New system logs are emitted from SYSTEM_ADDRESS (0xfff...ffe)
   - These go into the bloom filter
   - Indexers can filter for Transfer events from SYSTEM_ADDRESS to find ALL ETH transfers
   - This is HUGE for block explorers

### Homework:
- What's the difference between topics and data? (topics are indexed/searchable, data is not)
- Why max 4 topics? (LOG0-LOG4 opcodes, hard-coded in the EVM)
- After EIP-7708: how would you find all ETH transfers in a block? (filter where address=SYSTEM_ADDRESS and topic[0]=Transfer signature)
- Read a real receipt using `cast receipt <txhash> --rpc-url https://eth.llamarpc.com`

---

## DAY 17: Gas Accounting Deep Dive
**Goal:** Understand gas deeply — crucial for writing protocol tests.

### Instructions:
1. Open `execution-specs/src/ethereum/cancun/vm/gas.py`
2. Key gas costs:
```
SLOAD cold:     2,100    SLOAD warm:     100
SSTORE new:    20,000    SSTORE update: 5,000    SSTORE reset: 2,900
CALL cold:      2,600    CALL warm:       100
CREATE:        32,000
LOG base:         375    + 375/topic     + 8/byte of data
ETH transfer:    9,000   (the value transfer stipend adjustment)
```

3. EIP-7708 gas question:
   - A system LOG3 costs: 375 + 375×3 + 8×32 = 1,756 gas
   - Is this charged to the caller? Re-read the EIP — this is an open design question!

4. EIP-2929 (warm/cold):
   - First touch of address or storage slot = "cold" = expensive
   - After that in same tx = "warm" = cheap
   - `accessed_addresses` and `accessed_storage_keys` track what's been touched

5. EIP-3529 (refund cap):
   - Max refund = gas_used // 5 (only 20% of gas can be refunded)
   - Prevents gas token exploits

### Homework:
- Calculate total gas for a simple ERC-20 transfer (show your work)
- Why did Ethereum add warm/cold? (prevents DoS: attacker can't SLOAD 1000 different slots cheaply)
- What's the maximum gas refund from SSTORE? (capped at 20% of total gas used)

---

## DAY 18: Transaction Types & EIP-1559
**Goal:** Understand the different transaction formats.

### Instructions:
1. Transaction types:
   - **Type 0** (legacy): gasPrice only
   - **Type 1** (EIP-2930): adds `accessList` (pre-warm addresses/slots)
   - **Type 2** (EIP-1559): `maxFeePerGas` + `maxPriorityFeePerGas`, no `gasPrice`
   - **Type 3** (EIP-4844): adds `blobVersionedHashes` for blob transactions

2. EIP-1559 mechanics:
```
effective_gas_price = min(maxFeePerGas, baseFee + maxPriorityFeePerGas)
priority_fee = effective_gas_price - baseFee
burned = baseFee × gas_used        ← sent to burn address
validator_tip = priority_fee × gas_used  ← to block proposer
```

3. Base fee adjustment:
   - Target: 50% block utilization (15M gas target out of 30M limit)
   - If block > 50% full: base fee increases (max 12.5% per block)
   - If block < 50% full: base fee decreases

4. Explore:
```bash
# Check current base fee:
cast base-fee --rpc-url https://eth.llamarpc.com

# Look at a Type 2 transaction:
cast tx <TXHASH> --rpc-url https://eth.llamarpc.com
```

### Homework:
- What's the difference between `maxFeePerGas` and `maxPriorityFeePerGas`?
- If baseFee=30 gwei and you set maxFee=50, maxPriority=2, what's your effective gas price? (32 gwei)
- Why does EIP-1559 burn the base fee? (prevents miners/validators from manipulating the fee market)
- Find `process_transaction()` in execution-specs — where is EIP-1559 fee logic handled?

---

## DAY 19: The Environment & Context Opcodes
**Goal:** Understand all the opcodes that read transaction/block context.

### Instructions:
1. On evm.codes, read:
   - `CALLER` → msg.sender
   - `CALLVALUE` → msg.value
   - `ORIGIN` → tx.origin (the EOA that started the tx)
   - `GASPRICE` → effective gas price
   - `COINBASE` → block.coinbase (fee recipient)
   - `TIMESTAMP` → block.timestamp
   - `NUMBER` → block.number
   - `DIFFICULTY` / `PREVRANDAO` → post-merge: RANDAO mix from beacon chain
   - `GASLIMIT` → block gas limit
   - `CHAINID` → chain ID (1 for mainnet)
   - `BASEFEE` → EIP-1559 base fee
   - `SELFBALANCE` → this contract's ETH balance
   - `BALANCE` → any address's ETH balance
   - `EXTCODESIZE`, `EXTCODECOPY`, `EXTCODEHASH` → read another contract's code

2. Find these in execution-specs: `vm/instructions/environment.py`

3. Key insight: these opcodes read from the `Environment` struct set up at the start of execution. They don't query the network in real-time.

### Homework:
- What's the difference between CALLER and ORIGIN? (CALLER = immediate caller, ORIGIN = original EOA, never a contract)
- Why is ORIGIN considered dangerous? (can be spoofed via intermediate contracts, breaks when called from other contracts)
- What replaced DIFFICULTY after The Merge? (PREVRANDAO — same opcode number 0x44, different semantics)

---

## DAY 20: Putting It All Together — Trace a Full Transaction
**Goal:** Connect everything from Weeks 1-4 by tracing a transaction end-to-end.

### Instructions:
1. Pick a complex transaction (e.g., a Uniswap swap or Aave liquidation)
2. Trace it through EVERY layer you've learned:
   - **Calldata:** Decode the function selector and arguments (Day 6-7)
   - **Dispatcher:** The contract matches the selector (Day 6)
   - **Stack operations:** Arguments are loaded onto the stack (Day 1-2)
   - **Storage reads:** SLOAD reads pool state, balances (Day 4-5)
   - **Internal calls:** CALL/STATICCALL to other contracts (Day 8, 13)
   - **Storage writes:** SSTORE updates balances (Day 4, 12)
   - **Events:** LOG opcodes emit Transfer, Swap events (Day 9, 16)
   - **Gas accounting:** Total gas = sum of all operations (Day 10, 17)
   - **Receipt:** Status, logs, bloom filter (Day 16)
   - **State root:** World state changes, new root computed (Day 14-15)

3. Write a full trace document:
```markdown
## Transaction: 0x...

### 1. Calldata
- Selector: 0x... = swap(...)
- Arguments: ...

### 2. Execution Trace
- SLOAD slot X (cold, 2100 gas) → reads pool reserve
- CALL to token contract (cold, 2600 gas)
  - SLOAD slot Y → reads balance
  - SSTORE slot Y → updates balance
  - LOG3 → Transfer event
- ...

### 3. Total Gas
- Base: 21,000
- Execution: ...
- Total: ...

### 4. State Changes
- Account A balance: X → Y
- Contract storage slot Z: old → new
```

### Homework:
- Complete the trace document for your chosen transaction
- Identify every ETH transfer that has NO corresponding log event (these are what EIP-7708 would fix)
- Count: how many storage reads/writes, how many calls, how many logs?

---

# WEEK 5-6: CONSENSUS & CLIENT CODE (Days 21-30)

---

## DAY 21: Consensus Layer Basics
**Goal:** Understand the other half of Ethereum.

### Instructions:
1. Read: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/
2. Key concepts:
   - **Slot:** 12-second window. One validator proposes a block per slot.
   - **Epoch:** 32 slots = 6.4 minutes
   - **Validator:** stakes 32 ETH, proposes + attests blocks
   - **Attestation:** "I agree block X at slot Y is valid"
   - **Finality:** after 2 epochs (~13 min), blocks are finalized

3. Two-layer architecture:
```
Consensus Layer (CL): Prysm, Lighthouse, Teku, Lodestar
  - Manages validators, attestations, finality
  - Tells EL: "here's the next block"

Execution Layer (EL): Geth, Reth, Nethermind, Besu
  - Runs the EVM, processes transactions
  - Reports back: "here's the state root"

They talk via the Engine API (JSON-RPC)
```

4. For your EIP work:
   - EIP-7708 is purely Execution Layer
   - Most EIPs you'll encounter modify the EL
   - CL EIPs exist but are harder to contribute to early on

### Homework:
- In one sentence: what's the difference between EL and CL?
- Why two layers? (The Merge kept EL but replaced PoW mining with CL validators)
- Which layer do you work on for EVM/gas/state EIPs? (EL)

---

## DAY 22: The Engine API
**Goal:** Understand how CL and EL communicate.

### Instructions:
1. Three critical Engine API methods:

**`engine_newPayloadV3(payload)`**
CL says: "Execute this block and tell me if it's valid."
EL runs state_transition() and returns VALID, INVALID, or SYNCING.

**`engine_forkchoiceUpdatedV3(state, payloadAttributes)`**
CL says: "The chain head is now block X. Optionally, start building a new block."

**`engine_getPayloadV3(payloadId)`**
CL says: "Give me the block you've been building."

2. The flow for a new block:
```
1. CL selects validator for this slot
2. CL calls forkchoiceUpdated with payloadAttributes → EL starts building
3. EL picks txs from mempool, executes them
4. CL calls getPayload → gets the block
5. CL broadcasts block to network
6. Other nodes: CL receives block → calls newPayload → EL validates
```

3. Read the Engine API spec: https://github.com/ethereum/execution-apis/tree/main/src/engine

### Homework:
- Draw a sequence diagram (on paper) of block production
- Where does the Engine API live in geth? (find the file)
- Why does the CL drive block production and not the EL?

---

## DAY 23: Read Geth — interpreter.go
**Goal:** Read the most important Go file in Ethereum.

### Instructions:
1. Clone geth:
```bash
git clone https://github.com/ethereum/go-ethereum.git
cd go-ethereum
```

2. Open `core/vm/interpreter.go`
3. Find the `Run()` method:
```go
func (in *EVMInterpreter) Run(contract *Contract, input []byte) ([]byte, error) {
    for {
        op = contract.GetOp(pc)    // Read opcode
        operation := in.table[op]  // Look up the operation
        // ... gas check ...
        res, err = operation.execute(&pc, in, callContext)  // Execute!
        pc++
    }
}
```

4. Don't panic about Go syntax. Focus on:
   - `in.table[op]` — lookup table mapping opcode → function
   - Each operation has: execute function, gas cost function, stack requirements
   - The loop continues until STOP, RETURN, REVERT, or error

5. Open `core/vm/jump_table.go` — find where the table is built

### Homework:
- How many lines is the interpreter loop? (surprisingly short)
- What is `in.table`? Where is it defined?
- Find the CALL entry in the jump table — what function does it point to?
- Compare with execution-specs' `interpreter.py` — what's the same, what's different?

---

## DAY 24: Read Geth — instructions.go (Part 1: Stack & Storage)
**Goal:** See how opcodes are implemented in production Go code.

### Instructions:
1. Open `core/vm/instructions.go`
2. Find and read these functions:
   - `opPush1` — how PUSH works in Go
   - `opAdd`, `opSub`, `opMul` — arithmetic in uint256
   - `opSload` — storage load (compare with execution-specs)
   - `opSstore` — storage store

3. For each function, note:
   - How values are popped from and pushed to the stack
   - How gas is handled
   - Error conditions

4. Compare `opSstore` in geth vs `sstore()` in execution-specs:
   - Same logic, different languages
   - Geth is optimized (uses uint256 library), specs are clear (uses Python ints)

### Homework:
- Read `opSload` and write a comment for each line explaining what it does
- How does geth represent the stack? (find the Stack type definition)
- What happens in `opSstore` if the contract is in read-only mode (STATICCALL)?

---

## DAY 25: Read Geth — instructions.go (Part 2: CALL & System)
**Goal:** Read the CALL implementation in production code.

### Instructions:
1. Find `opCall` in `core/vm/instructions.go`:
```go
func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
    // Pop 7 values from stack: gas, addr, value, inOffset, inSize, retOffset, retSize
    // Execute the call
    ret, returnGas, err := interpreter.evm.Call(scope.Contract, toAddr, args, gas, bigVal)
}
```

2. Follow into `evm.Call()` in `core/vm/evm.go`:
```go
func (evm *EVM) Call(...) {
    // Transfer value (ETH)
    evm.Context.Transfer(evm.StateDB, caller.Address(), addr, value)
    // Run the code
    ret, err = evm.interpreter.Run(contract, input)
}
```

3. Find the Transfer function:
```go
func Transfer(db StateDB, sender, recipient common.Address, amount *big.Int) {
    db.SubBalance(sender, amount)
    db.AddBalance(recipient, amount)
}
```
Two lines. No log. **This is where EIP-7708 adds the log.**

4. Also read `opDelegateCall` and `opStaticCall` — compare with `opCall`.

### Homework:
- Where exactly would EIP-7708 add a log in geth? (after Transfer() in evm.Call())
- What would the code look like? Sketch it out.
- How is `opDelegateCall` different from `opCall`? (no value parameter, preserved msg.sender)

---

## DAY 26: Read Geth — State & Types
**Goal:** Understand geth's state management.

### Instructions:
1. Read `core/state/statedb.go`:
   - `GetBalance()`, `SubBalance()`, `AddBalance()`
   - `GetState()` (SLOAD), `SetState()` (SSTORE)
   - `AddLog()` — how logs are appended

2. Read `core/types/receipt.go`:
   - Receipt struct: Status, CumulativeGasUsed, Logs, Bloom
   - How receipts are encoded for the receipts trie

3. Read `core/types/log.go`:
   - Log struct: Address, Topics, Data
   - This is what EIP-7708 creates programmatically

### Homework:
- Trace: when opSstore executes in instructions.go, how does the state change flow through statedb.go?
- When AddLog() is called, where does the log end up? (in the stateDB's journal, then into the receipt)
- What is the StateDB "journal"? (tracks changes for revert support)

---

## DAY 27: Read Reth — The Rust Client
**Goal:** Get familiar with Ethereum's second-most-popular EL client.

### Instructions:
1. Clone reth:
```bash
git clone https://github.com/paradigmxyz/reth.git
cd reth
```

2. Find the interpreter:
```bash
find . -name "*.rs" | xargs grep -l "fn run" | grep -i interpret | head -5
# Or navigate directly:
ls crates/interpreter/src/
```

3. Find the CALL implementation — search for opcode dispatch

4. Don't try to understand all the Rust. Focus on:
   - Structure: how is it organized compared to geth?
   - The interpreter loop: same pattern (read opcode → dispatch → execute)?
   - Where value transfer happens in CALL

5. This matters because EIP implementations need to work across ALL clients. If you contribute tests, they test geth AND reth AND Nethermind AND Besu.

### Homework:
- Find the CALL handler in reth. What file is it in?
- Compare the file structure: geth's `core/vm/` vs reth's `crates/interpreter/`
- Is the interpreter pattern the same? (yes — all clients implement the same spec)

---

## DAY 28: How Hard Forks Are Coordinated
**Goal:** Understand the process of upgrading Ethereum.

### Instructions:
1. A hard fork (network upgrade) is:
   - A set of EIPs activated at a specific block/timestamp
   - All clients must implement ALL EIPs before the activation time
   - If a client doesn't upgrade, it forks off the network

2. The process:
```
EIP proposed → Discussion on Ethereum Magicians → AllCoreDevs call →
Accepted for fork → Clients implement → Devnets → Testnets →
Shadow forks → Mainnet activation
```

3. In the code, forks are configured:
```go
// geth: params/config.go
CancunTime:  u64(1710338135),  // timestamp-based activation
// All EIPs in Cancun activate at this timestamp
```

4. In execution-specs, each fork has its own directory:
```
src/ethereum/frontier/   ← original
src/ethereum/homestead/  ← first fork
...
src/ethereum/cancun/     ← current
src/ethereum/prague/     ← next
```

5. Jump table changes per fork:
```go
// geth: core/vm/jump_table.go
func newCancunInstructionSet() JumpTable {
    instructionSet := newShanghaiInstructionSet()
    enable4844(&instructionSet)  // blob opcodes
    enable7516(&instructionSet)  // BLOBBASEFEE
    // ...
}
```

### Homework:
- Which EIPs are in the Cancun fork? List them and their one-line descriptions.
- How is EIP-7708 planned to activate? (which fork?)
- Find the jump table entry point for the latest fork in geth

---

## DAY 29: State Processor & Block Validation
**Goal:** Read how geth processes a complete block.

### Instructions:
1. Open `core/state_processor.go` — find `Process()`:
   - This is geth's equivalent of execution-specs' `apply_body()`
   - Iterates over transactions, executes each one
   - Collects receipts, calculates gas used

2. Open `core/state_transition.go` — find `TransitionDb()`:
   - This processes a single transaction
   - Validates nonce, buys gas, executes, refunds
   - This is where the EIP-1559 fee logic lives in geth

3. The flow:
```
state_processor.Process(block)
  → for each tx:
      state_transition.TransitionDb()
        → evm.Call() or evm.Create()
          → interpreter.Run()
            → opcode execution
```

### Homework:
- Find where gas is bought (deducted from sender) in state_transition.go
- Find where gas is refunded after execution
- Find where the receipt is created
- Compare with execution-specs fork.py — same structure?

---

## DAY 30: Week 3-4 Capstone — Map the Full Execution Pipeline
**Goal:** Create a reference document connecting spec → geth → reth for the entire execution pipeline.

### Instructions:
1. Create a markdown file `execution-pipeline-map.md`:

```markdown
## Execution Pipeline: Spec → Geth → Reth

### Block Processing
| Step | execution-specs | geth | reth |
|------|----------------|------|------|
| Process block | fork.py:state_transition() | state_processor.go:Process() | ? |
| Process tx | fork.py:process_transaction() | state_transition.go:TransitionDb() | ? |
| EVM execution | interpreter.py:execute_code() | interpreter.go:Run() | ? |
| Opcode dispatch | instructions/__init__.py | jump_table.go | ? |

### Key Operations
| Operation | execution-specs | geth | reth |
|-----------|----------------|------|------|
| SLOAD | instructions/storage.py:sload() | instructions.go:opSload() | ? |
| SSTORE | instructions/storage.py:sstore() | instructions.go:opSstore() | ? |
| CALL | instructions/system.py:call() | instructions.go:opCall() + evm.go:Call() | ? |
| Value transfer | state.py:move_ether() | evm.go:Transfer() | ? |
| Add log | ? | statedb.go:AddLog() | ? |
```

2. Fill in the reth column from Day 27.
3. This document is your reference for Week 7-8.

### Homework:
- Complete the mapping table with file paths and line numbers
- Identify: where would EIP-7708 changes go in EACH column?
- This is the most valuable artifact from the bootcamp — keep it updated

---

# WEEK 7-8: EIP CONTRIBUTION (Days 31-40)

---

## DAY 31: Re-Read EIP-7708 with Fresh Eyes
**Goal:** Now that you understand the full stack, re-read the EIP and actually understand every sentence.

### Instructions:
1. Read: https://eips.ethereum.org/EIPS/eip-7708
2. For EVERY sentence in the spec, write in the margin:
   - "I understand this because..." OR
   - "I don't understand this — need to research..."

3. Key questions to answer:
   - What exactly triggers the system log?
   - What address does the log come from?
   - What are the topics and data?
   - Is the gas cost charged to the caller?
   - What about reverted calls — does the log persist?
   - What about SELFDESTRUCT?
   - What about CREATE/CREATE2 with value?

### Homework:
- Write a 1-page summary of EIP-7708 in your own words, as if explaining to another Solidity developer
- List every edge case you can think of
- List every question you still have

---

## DAY 32: Map EIP-7708 to Code Locations
**Goal:** Connect every spec requirement to actual code.

### Instructions:
1. For each requirement in the EIP, find WHERE in the code it goes:

**"CALL with non-zero value"**
→ geth: `core/vm/evm.go:Call()` → after `Transfer()`
→ specs: `vm/instructions/system.py:call()` → after value transfer

**"SELFDESTRUCT with non-zero value"**
→ geth: `core/vm/instructions.go:opSelfdestruct`
→ specs: `vm/instructions/system.py:selfdestruct()`

**"Transaction with non-zero value"**
→ geth: `core/state_transition.go:TransitionDb()`
→ specs: `fork.py:process_transaction()`

2. Create `eip-7708-code-mapping.md` with exact file paths and line numbers.

3. Check the existing geth PR: https://github.com/ethereum/go-ethereum/pull/33645
   - Read the diff — compare with your mapping
   - Did you find the same locations? What did you miss?

### Homework:
- Complete the mapping table
- For each location, write 1-2 sentences explaining WHY the change goes there
- Identify any requirements NOT yet implemented in the PR

---

## DAY 33: Read Real PRs on Geth
**Goal:** Understand how protocol changes are actually submitted and reviewed.

### Instructions:
1. Read PR #33645 (EIP-7708) on geth:
   - Read the PR description
   - Read EVERY file changed
   - Read the review comments — what did reviewers ask about?

2. Read 2-3 other recent EIP PRs:
   - Search geth PRs for recent EIP implementations
   - Notice the pattern: tests, implementation, docs
   - Notice the review process: core devs ask tough questions

3. Pay attention to:
   - How tests are structured (where do they go?)
   - How gas costs are configured
   - How fork activation logic works
   - What gets caught in review vs what ships

### Homework:
- List 3 things you learned from reading PR review comments
- What's the typical structure of an EIP implementation PR?
- What would YOUR review comment be on PR #33645?

---

## DAY 34: Execution Spec Tests — Setup & Structure
**Goal:** Set up the test framework and understand how tests work.

### Instructions:
1. Clone and install:
```bash
git clone https://github.com/ethereum/execution-spec-tests.git
cd execution-spec-tests
pip install -e ".[docs,lint,test]"
# or use uv:
uv pip install -e ".[docs,lint,test]"
```

2. Verify:
```bash
fill --help
```

3. Explore the test structure:
```bash
ls tests/
ls tests/cancun/
# Find a simple test:
cat tests/cancun/eip4844/test_point_evaluation_precompile.py | head -50
```

4. Understand test anatomy:
```python
@pytest.mark.parametrize("value", [1, 0])
def test_something(state_test, pre, value):
    """Test description."""
    # pre = initial state (accounts, balances, code)
    # tx = the transaction to execute
    # post = expected state after execution
    # state_test runs it all and checks
```

### Homework:
- List all the test directories. What EIP does each correspond to?
- Read one complete test file. Identify: pre-state, transaction, post-state assertions.
- What is `fill`? What does it produce? (test fixtures that clients consume)

---

## DAY 35: Write a Baseline Test (Pre-EIP-7708)
**Goal:** Write a test that demonstrates the current behavior (no log on ETH transfer).

### Instructions:
1. Create a test file:
```python
"""
Baseline test: CALL with value transfer currently emits NO system log.
This test documents the pre-EIP-7708 behavior.
"""
import pytest
from ethereum_test_tools import (
    Account, Block, BlockchainTestFiller, Environment,
    TestAddress, Transaction, to_address, Opcodes as Op,
)

@pytest.mark.valid_from("Cancun")
def test_call_value_no_system_log(blockchain_test: BlockchainTestFiller):
    """CALL with 1 ETH: recipient gets ETH, but no system Transfer log."""
    sender = TestAddress
    contract_a = to_address(0x100)
    contract_b = to_address(0x200)

    contract_a_code = (
        Op.CALL(gas=100000, address=contract_b, value=10**18,
                argsOffset=0, argsLength=0, retOffset=0, retLength=0)
        + Op.STOP
    )

    pre = {
        sender: Account(balance=10**20),
        contract_a: Account(balance=10**19, code=contract_a_code, nonce=1),
        contract_b: Account(balance=0, code=Op.STOP, nonce=1),
    }

    tx = Transaction(to=contract_a, gas_limit=500000, value=0, sender=sender)

    post = {
        contract_b: Account(balance=10**18),  # Got 1 ETH
    }

    blockchain_test(pre=pre, blocks=[Block(txs=[tx])], post=post)
```

2. Run it:
```bash
fill --fork Cancun -k test_call_value_no_system_log -v
```

### Homework:
- Did the test pass? If not, debug it.
- How would this test change AFTER EIP-7708? (the receipt should contain a Transfer log)
- What edge cases should you test? (zero value, revert, delegatecall, etc.)

---

## DAY 36: Write EIP-7708 Edge Case Tests
**Goal:** Write tests for edge cases that the EIP needs to handle.

### Instructions:
1. Test cases to write:
   - **Zero-value CALL:** Should NOT emit a system log
   - **CALL that reverts:** Should the system log be rolled back? (yes!)
   - **Nested CALLs:** A → B (1 ETH) → C (0.5 ETH). Two system logs?
   - **DELEGATECALL:** No value transfer, no system log
   - **STATICCALL:** No value transfer, no system log
   - **SELFDESTRUCT:** Sends remaining balance — system log?
   - **CREATE with value:** Deploying contract with initial ETH — system log?
   - **Self-transfer:** Contract sends ETH to itself — system log?

2. Write at least 3 of these tests. Use the baseline test as a template.

3. For each test, document:
   - What behavior you're testing
   - What the expected result should be (per the EIP spec)
   - Any ambiguity in the spec

### Homework:
- Which edge cases are NOT clearly specified in the EIP? (list them)
- These ambiguities are EXACTLY what you should ask about in your EIP comment
- Run your tests. Do they all pass?

---

## DAY 37: Post Your First EIP Comment
**Goal:** Write a substantive comment on the EIP discussion.

### Instructions:
1. Go to the EIP-7708 discussion on Ethereum Magicians
2. Read ALL existing comments first
3. Write a comment that includes:
   - What you've studied (briefly — 1-2 sentences)
   - A specific technical observation (from your code mapping)
   - A specific question about an edge case (from your tests)
   - Reference to actual code locations

4. Example comment structure:
```
I've been reading through the execution-specs and geth implementations
to map where EIP-7708 changes would go.

Observation: In geth's evm.go:Call(), the value transfer happens at line X,
before the callee's code runs. The system log would need to be emitted here,
but if the callee reverts, the log should be rolled back. The current PR
handles this by [observation about the PR].

Question: The EIP doesn't specify behavior for CREATE/CREATE2 with value.
Should deploying a contract with initial ETH also emit a system Transfer log?
The code path in geth is evm.go:Create(), which also calls Transfer().
```

5. DO NOT ask basic questions. Your comment should demonstrate you've read the code.

### Homework:
- Draft your comment before posting. Get feedback from THRONE.
- Post it. Screenshot for your records.
- This is your introduction to the Ethereum core dev community.

---

## DAY 38: Write a Proper Test PR
**Goal:** Prepare a test PR for execution-spec-tests.

### Instructions:
1. Fork execution-spec-tests on GitHub
2. Create a branch: `eip7708-tests`
3. Organize your tests:
```
tests/amsterdam/eip7708/
    __init__.py
    test_native_transfer_log.py        # basic cases
    test_native_transfer_edge_cases.py # edge cases
```

4. Follow the repo's style guide:
   - Read CONTRIBUTING.md
   - Check linting: `tox -e lint`
   - Run tests: `fill --fork Amsterdam -k eip7708 -v`

5. Write a good PR description:
   - What the tests cover
   - Which edge cases are included
   - Any ambiguity in the spec you found

### Homework:
- Is your PR ready to submit? (code clean, tests pass, good description)
- Have you tested locally?
- Review your own diff — would you approve this PR?

---

## DAY 39: Submit Your PR + Review Others
**Goal:** Submit your contribution and engage with the community.

### Instructions:
1. Push your branch and open the PR
2. In the PR description, link to:
   - The EIP spec
   - The geth PR implementing it
   - Any relevant discussion on Ethereum Magicians

3. While waiting for review, review someone else's PR:
   - Find an open PR on execution-spec-tests
   - Read it carefully
   - Leave a thoughtful review comment

4. Engage with any review comments on YOUR PR:
   - Respond promptly
   - Make requested changes
   - Don't argue — learn

### Homework:
- PR is submitted ✓
- You've reviewed at least one other PR ✓
- You're watching for review comments ✓

---

## DAY 40: Reflection + Next Steps
**Goal:** Document what you've learned and plan your path forward.

### Instructions:
1. Write a reflection document:
   - What was hardest? What was easiest?
   - What surprised you?
   - What do you still not understand?
   - What would you teach someone else?

2. Update your EIP-7708 code mapping with anything you've learned

3. Plan your next contributions:
   - More tests for EIP-7708?
   - Tests for a different EIP?
   - A code contribution to geth or reth?
   - A new EIP of your own?

4. You now have:
   - Deep understanding of the EVM
   - Ability to read execution-specs AND geth code
   - A submitted test PR
   - A posted EIP comment
   - Credibility as a protocol contributor

### Homework:
- Update your EPF application with your bootcamp artifacts
- Share what you've learned (blog post, tweet thread, etc.)
- Pick your next EIP to contribute to

---

## AFTER THE 8 WEEKS

You'll know:
- How the EVM works internally (not just "it runs Solidity")
- How to read execution-specs AND geth AND reth code
- Where specific EIP changes go in the codebase
- How to write execution spec tests
- How to post substantive EIP comments
- How to submit protocol-level PRs

You'll be ready to:
- Post substantive comments on EIPs (because you've read the actual code)
- Submit test PRs to ethereum/execution-spec-tests
- Review PRs on geth/reth (even if you don't write Go/Rust fluently)
- Talk to core devs without sounding like you're bluffing
- Apply to EPF with real artifacts

The gap is closed. Now go ship. 👑
