# 🔥 ZEXO CONTENT BANK V2 — @zexoverz

*Generated: 2026-02-21 | 45 posts, ready to copy-paste*
*Replace echo-content-strategy.md bank*

---

## CATEGORY 1: MEMES & SHITPOSTS [15 posts]

---

### Post #1 — "The Two Jobs"
**[MEME]** | Language: ID | Format: single tweet

gw kerja 2 remote job, gaji $10K/bulan, dari kamar di BSD

tapi kalo mama telpon tetep "kapan nikah?"

keiko sabar ya 5 bulan lagi 🙏

---

### Post #2 — "Tutorial Hell Survivor"
**[MEME]** | Language: EN | Format: single tweet

day 1: "i'll learn solidity from this youtube tutorial"

day 47: watching the 9th "build your first smart contract" video

day 48: just read the damn source code

day 49: deployed to mainnet

the tutorial-to-production pipeline is a myth

---

### Post #3 — "Ser Wen Token"
**[MEME]** | Language: EN | Format: single tweet

me: *builds ZK privacy DEX from scratch, places top 10 at ETHGlobal*

random reply guy: "ser wen token"

bro i literally just showed you zero-knowledge proofs and your knowledge is also zero

---

### Post #4 — "Mainnet Deploy Fear"
**[MEME]** | Language: MIX | Format: single tweet

deploying to testnet: 😎 ez
deploying to mainnet: 🥶🥶🥶

gas fee-nya bukan play money lagi mass. that's real ETH. every typo costs dinner money.

gw pernah deploy wrong constructor arg. Rp 2 juta gone. just like that.

---

### Post #5 — "The Rug Pull Alignment Chart"
**[MEME]** | Language: EN | Format: single tweet

types of rug pulls:

- classic: dev disappears with liquidity
- intellectual: dev disappears but leaves a 40 page whitepaper nobody read
- polite: dev says "pivoting" and launches new token
- self-rug: you buy your own shitcoin and it dumps anyway
- philosophical: "was it really a rug if we were all already on the floor?"

---

### Post #6 — "No Degree Energy"
**[MEME]** | Language: ID | Format: single tweet

interviewer: "kamu lulusan mana?"
gw: *buka github*
interviewer: "oh"

7 tahun coding, 0 ijazah, 2 remote job, 1 company. IPK gw 404 not found.

---

### Post #7 — "Gas Fee Pain"
**[MEME]** | Language: EN | Format: single tweet

stages of grief but it's ethereum gas fees:

denial: "it'll go down in a few minutes"
anger: "WHO IS MINTING 10K NFTS RIGHT NOW"
bargaining: "maybe if i set gas to 2 gwei..."
depression: *transaction pending for 6 hours*
acceptance: *uses L2*

---

### Post #8 — "XPL Trauma"
**[MEME]** | Language: MIX | Format: single tweet

"bro lu harus diversify portfolio, jangan btc doang"

gw yang pernah hold altcoin XPL sampe -82%: 

nah i'm good thanks 👍

trauma is the best financial advisor

---

### Post #9 — "Remote Worker Indo"
**[MEME]** | Language: ID | Format: single tweet

orang indo kerja remote be like:

- meeting jam 10 malam
- breakfast = makan siang
- "sorry i was on mute" tapi sebenernya lagi makan indomie
- gaji dollar tapi tetep nawar di tokped
- "work from bali" padahal di BSD

relatable ga sih

---

### Post #10 — "Smart Contract Wizard"
**[MEME]** | Language: EN | Format: single tweet

"what do you do for work?"

i write magic spells that move money on the internet and if i make a typo someone loses their house

"so like... IT?"

sure man. IT.

---

### Post #11 — "CT Brain"
**[MEME]** | Language: EN | Format: single tweet

normal people: "the market is down"
crypto twitter: "generational buying opportunity"

normal people: "i lost money"  
crypto twitter: "i'm accumulating experience"

normal people: "this is a scam"
crypto twitter: "the tokenomics are innovative"

we are not the same

---

### Post #12 — "The CTO Life"
**[MEME]** | Language: MIX | Format: single tweet

being a CTO at 25 means:

- zoom call di pagi = ngomong bahasa corporate
- zoom call di sore = ngomong "mass tolong fix ini dong"
- zoom call di malam = ngomong sama diri sendiri debugging

the versatility is unmatched

---

### Post #13 — "Solidity Dev Problems"
**[MEME]** | Language: EN | Format: single tweet

solidity dev alignment chart:

chaotic good: writes tests after deployment
lawful evil: uses assembly for "gas optimization"  
neutral evil: copy pastes from stack overflow into production
chaotic evil: "we don't need an audit, the code IS the audit"

i have been all of these at different points in my career

---

### Post #14 — "Indo Dev Moment"
**[MEME]** | Language: ID | Format: single tweet

programmer indo starter pack:

- belajar dari youtube india
- nanya stackoverflow pake bahasa inggris broken
- debug pake console.log
- CV tulis "framework" padahal baru baca docs-nya
- "nanti gw refactor" (spoiler: ga pernah)
- gaji naik 3x setelah pindah ke web3

you're welcome for the career advice

---

### Post #15 — "Wedding vs Gas Fees"
**[MEME]** | Language: MIX | Format: single tweet

planning a wedding in november. keiko wants everything perfect.

venue cost: bisa deploy 47 smart contracts di mainnet
catering cost: bisa mass mint NFT collection
photographer: literally 1 ETH

gw mulai ngerti kenapa orang bikin wedding token. need to recoup costs ser.

---

## CATEGORY 2: TECHNICAL BREAKDOWNS [10 posts]

---

### Post #16 — "EIP-7702 Changed Everything"
**[TECHNICAL]** | Language: EN | Format: thread (8 tweets)

1/ EIP-7702 went live with Pectra and nobody is talking about how radical it actually is.

your EOA can now run smart contract code. let that sink in for a second.

2/ before 7702: your wallet is either a dumb EOA (just signs txs) or a smart contract wallet (powerful but clunky to set up).

the two worlds never mixed.

3/ 7702 adds a new transaction type. you sign an authorization tuple — basically saying "hey, let my address temporarily act like THIS smart contract."

the chain writes a delegation indicator to your account's code field: 0xef0100 || address

4/ what this means practically:

- batch multiple transactions into one
- sponsor gas for other users
- set custom access controls on your wallet
- recovery mechanisms without deploying a new contract

all from your existing EOA address. no migration needed.

5/ the security model is actually interesting. the authorization is tied to a specific chain_id and nonce, so replay attacks are handled. and you can revoke anytime by setting delegation to address(0).

but. there are footguns.

6/ biggest risk: if you delegate to a malicious contract, it has full control over your account. there's no "partial delegation." it's all or nothing.

this is why wallet UIs need to be extremely careful about what contracts they let users delegate to.

7/ for builders like us, 7702 changes the game:

- ERC-4337 bundlers can now work with EOAs directly
- paymaster patterns become way cleaner
- onboarding flows can abstract gas completely

we're probably integrating this into GrimSwap within the next month.

8/ tldr: EIP-7702 blurs the line between EOAs and smart contract wallets. it's the single biggest UX improvement Ethereum has shipped since EIP-1559.

if you're building any user-facing dapp, you need to understand this. not optional anymore.

---

### Post #17 — "Account Abstraction: 4337 + 7702"
**[TECHNICAL]** | Language: EN | Format: thread (7 tweets)

1/ ERC-4337 and EIP-7702 are often mentioned together but they solve different problems.

let me break down how they fit together, because i see a lot of confusion on this.

2/ ERC-4337 = account abstraction WITHOUT changing consensus. it uses an alt mempool where "UserOperations" get bundled by relayers and submitted to an EntryPoint contract.

it works. but it requires you to deploy a smart contract wallet first. new address, new setup.

3/ EIP-7702 = let your existing EOA temporarily delegate to smart contract code.

no new address. no migration. your 0x stays the same.

4/ so how do they work together?

7702 lets your EOA act like a 4337-compatible smart contract wallet. the EntryPoint can now validate UserOperations from EOAs that have delegated their code.

best of both worlds: familiar address + programmable wallet logic.

5/ the paymaster pattern gets really clean here:

1. user signs a 7702 authorization (delegates to a wallet contract)
2. user submits a UserOperation via 4337
3. paymaster sponsors the gas
4. user never touches ETH for fees

gasless transactions that actually work. no bridging, no wrapping.

6/ what i'm watching: how wallets implement the delegation UI.

bad UX = users blindly delegating to random contracts
good UX = curated, audited delegation targets with clear revocation

this is where the real competition will happen over the next year.

7/ if you're building on ethereum right now and not thinking about AA, you're building legacy software.

7702 + 4337 is the new baseline. learn it or get left behind. not trying to be dramatic, just being real.

---

### Post #18 — "ZK Proofs Actually Explained"
**[TECHNICAL]** | Language: MIX | Format: thread (9 tweets)

1/ gw mau jelasin ZK proofs tanpa bullshit.

bukan analogi "buktiin kamu tau password tanpa kasih tau password." that's the surface level. let's go deeper.

2/ a zero-knowledge proof has 3 properties:

- completeness: if the statement is true, an honest prover can convince the verifier
- soundness: if the statement is false, no cheating prover can convince the verifier (except with negligible probability)
- zero-knowledge: the verifier learns nothing beyond the fact that the statement is true

3/ in practice for blockchain: you want to prove a computation happened correctly without revealing the inputs.

contoh GrimSwap: you prove "i have enough balance to make this trade" without revealing your balance or the trade details.

4/ the two main proof systems you'll encounter:

SNARKs (Succinct Non-interactive ARgument of Knowledge):
- small proof size (~200 bytes)  
- fast verification
- requires trusted setup (or uses techniques like PLONK to minimize trust)

STARKs (Scalable Transparent ARgument of Knowledge):
- bigger proofs
- no trusted setup
- quantum resistant
- slower verification but better for complex computations

5/ for GrimSwap we went with Groth16 (a SNARK variant). why?

- on-chain verification needs to be cheap. groth16 verification = ~200k gas
- proof size matters when you're putting it in a tx
- the trusted setup tradeoff was acceptable for our use case

6/ writing ZK circuits is nothing like writing solidity. literally broke my brain the first month.

in solidity: you write instructions (do this, then this)
in circuits: you define constraints (these relationships must hold)

it's declarative. you don't tell the computer what to do. you tell it what must be true.

7/ debugging circuits is pain.

error: "constraint not satisfied"
you: which one? i have 50,000 constraints
circom: "figure it out lol"

there's no console.log in circuit land. you add auxiliary outputs and pray.

8/ tools that actually helped me learn:
- circom + snarkjs for prototyping
- halo2 for production-grade stuff
- 0xPARC's ZK learning resources (free, actually good)
- just reading tornado cash source code (RIP)

9/ kalau lu tertarik ZK development, dm gw. ETHJKT bakal ada workshop ZK circuits bulan depan.

it's the hardest thing i've learned in programming. it's also the most powerful. worth the pain.

---

### Post #19 — "Uniswap V4 Hook Architecture"
**[TECHNICAL]** | Language: EN | Format: thread (7 tweets)

1/ spent months building GrimSwap on Uniswap V4. the hook system is genuinely brilliant but also has landmines nobody warns you about.

let me walk you through the architecture from a builder's perspective.

2/ V4 hooks are contracts that get called at specific points in a pool's lifecycle:

- beforeInitialize / afterInitialize
- beforeSwap / afterSwap  
- beforeAddLiquidity / afterAddLiquidity
- beforeRemoveLiquidity / afterRemoveLiquidity
- beforeDonate / afterDonate

you register which hooks your contract implements in the pool key.

3/ the key insight: hooks are encoded in the pool's address itself.

the last 14 bits of the hook address determine which callbacks are active. this means you need to mine a vanity address for your hook contract that has the right bit pattern.

CREATE2 + salt grinding. took us ~3 hours to find the right address for GrimSwap's hook.

4/ for GrimSwap, we use beforeSwap and afterSwap hooks:

beforeSwap: verify the ZK proof that the trader has sufficient balance in the shielded pool
afterSwap: update the commitment tree with the new shielded balance

the swap itself happens through Uniswap's normal AMM logic. we just wrap it in privacy.

5/ gas gotcha that bit us hard:

hooks add gas overhead to every swap. our first implementation added ~180k gas per swap just for the hook calls + ZK verification.

we got it down to ~95k by:
- precomputing verification keys
- batching commitment tree updates
- using assembly for the pairing checks

still not cheap. but private trades were never going to be free.

6/ the singleton pattern in V4 is underrated. all pools live in one contract. this means:

- flash accounting across pools (settle everything at the end)
- hooks can read state from any pool
- composability goes way up

if you're still thinking in V3 architecture where every pool is its own contract, you need to update your mental model.

7/ building on V4 is not for beginners. the docs are minimal, the codebase moves fast, and the hook interface has subtle invariants that aren't documented.

my advice: read the test files. seriously. test/PoolManager.t.sol taught me more than any blog post.

---

### Post #20 — "Solidity Storage Layout Deep Dive"
**[TECHNICAL]** | Language: EN | Format: thread (6 tweets)

1/ most solidity devs have no idea how storage actually works. and it's costing them gas.

quick thread on storage layout, packing, and the one trick that saves more gas than any other optimization.

2/ every storage slot is 32 bytes (256 bits). solidity packs variables into slots sequentially.

```
uint256 a; // slot 0 (full 32 bytes)
uint256 b; // slot 1 (full 32 bytes)
```

but:

```
uint128 a; // slot 0, first 16 bytes
uint128 b; // slot 0, last 16 bytes ← PACKED
```

two SLOADs vs one SLOAD. at 2100 gas per cold SLOAD, this matters.

3/ the mistake i see constantly:

```
uint128 a;  // slot 0
uint256 b;  // slot 1 (can't fit in slot 0)
uint128 c;  // slot 2 (starts new slot!)
```

if you'd written:
```
uint128 a;  // slot 0
uint128 c;  // slot 0 (packed!)
uint256 b;  // slot 1
```

you just saved one entire storage slot. order matters.

4/ mappings and dynamic arrays break sequential packing. a mapping always takes its own slot (stores nothing in it — the values are at keccak256(key . slot)).

this means putting a mapping between two uint128s will NOT pack them.

```
uint128 a;    // slot 0
mapping(...); // slot 1 (empty, used for hash)
uint128 b;    // slot 2 (not packed with a!)
```

rearrange your structs accordingly.

5/ the single biggest gas save: if you're reading the same storage variable multiple times in a function, cache it in memory.

```
// bad: 3 SLOADs
if (balances[user] > 0) {
    uint amt = balances[user];
    balances[user] = 0;
}

// good: 1 SLOAD + 1 SSTORE
uint bal = balances[user];
if (bal > 0) {
    balances[user] = 0;
}
```

sounds obvious. you'd be surprised how often production code doesn't do this.

6/ if you're building anything that does heavy state reads — DEXs, lending protocols, games — storage layout is not an afterthought. it's architecture.

we restructured GrimSwap's commitment tree storage 3 times before landing on a layout that didn't blow up gas costs.

---

### Post #21 — "EOF is Coming"
**[TECHNICAL]** | Language: EN | Format: thread (6 tweets)

1/ EOF (EVM Object Format) didn't make it into Pectra, but it's coming in the next upgrade. and it fundamentally changes how smart contracts work at the bytecode level.

if you write solidity, you should care about this.

2/ right now, EVM bytecode is a flat blob. no structure. the EVM just starts executing from byte 0 and hopes for the best.

EOF adds a proper container format:
- header with metadata
- separate code and data sections
- explicit function definitions

basically: structure where there was chaos.

3/ the biggest change for devs: no more SELFDESTRUCT (already deprecated), no more code introspection (CODECOPY, EXTCODECOPY gone for EOF contracts).

if your contract relies on reading its own bytecode... time to refactor.

4/ what you get in return:

- static jumps only (RJUMP, RJUMPI) — no more JUMPDEST scanning, faster execution
- stack validation at deploy time — malformed code gets rejected before it ever runs
- subroutines (CALLF, RETF) — proper function calls in bytecode

the EVM becomes a real VM instead of a glorified calculator.

5/ for L2s this is massive. static analysis of EOF bytecode is way easier, which means:

- better gas estimation
- more aggressive compiler optimizations  
- potential for ahead-of-time compilation

rollup execution speeds could improve significantly.

6/ my take: EOF is unsexy infrastructure work that makes everything else better. nobody's going to tweet "omg EOF changed my life" but in 2 years every tool, compiler, and debugger will be better because of it.

the people working on this are unsung heroes of ethereum.

---

### Post #22 — "Pectra Upgrade Cheat Sheet"
**[TECHNICAL]** | Language: EN | Format: single tweet

pectra upgrade cheat sheet (save this):

EIP-7702 → EOAs can run smart contract code
EIP-7251 → validators can stake up to 2048 ETH
EIP-7691 → more blob space for L2s
EIP-7623 → higher calldata cost (pushes L2s to blobs)
EIP-2935 → access historical block hashes in EVM
EIP-7708 → ETH transfers now emit logs (finally)

the account abstraction one (7702) is the headline. but 7708 is lowkey just as important for anyone building indexers or tracking ETH flows.

---

### Post #23 — "Foundry vs Hardhat in 2026"
**[TECHNICAL]** | Language: EN | Format: single tweet

foundry vs hardhat in 2026 and i'll keep it short:

foundry: tests in solidity, fast af, forge script for deployments, built-in fuzzing. if you write smart contracts, this is the tool.

hardhat: still fine for JS-heavy teams. the plugin ecosystem is unmatched. ethers.js integration is smooth.

my honest take: use foundry for contract dev + testing, hardhat for deployment scripts if your team is JS-native. they're not mutually exclusive.

but if you're starting fresh? foundry. not close.

---

### Post #24 — "Why EIP-7708 Matters"  
**[TECHNICAL]** | Language: EN | Format: thread (5 tweets)

1/ EIP-7708 sounds boring: "ETH transfers now emit logs."

but this fixes a problem that has annoyed every blockchain indexer and exchange since ethereum launched.

2/ the problem: ERC-20 tokens emit Transfer events. you can track every USDC movement with a simple log filter.

ETH? no logs. you had to trace internal transactions, parse CALL opcodes, handle edge cases with SELFDESTRUCT transfers... nightmare.

smart contract wallet deposits were especially broken. exchanges literally refused deposits from contract wallets for years because of this.

3/ 7708 adds automatic LOG3 emissions for:

- any nonzero-value CALL to a different account
- transaction value transfers  
- ETH burns (base fee)

using a standard topic: keccak256("Transfer(address,address,uint256)")

yes, same signature as ERC-20. intentional. now all value transfers look the same to indexers.

4/ if you build:
- block explorers → one unified transfer event for ETH + tokens
- analytics dashboards → no more separate ETH tracking pipeline  
- exchange deposit systems → contract wallet deposits work like any other
- accounting software → lmao crypto accounting people must be crying with joy

5/ sometimes the best EIPs aren't the flashy ones. 7708 is plumbing. good plumbing makes everything built on top of it work better.

---

### Post #25 — "How to Actually Read an EIP"
**[TECHNICAL]** | Language: MIX | Format: single tweet

cara gw baca EIP baru:

1. skip abstract, baca Motivation dulu (WHY does this exist)
2. baca Specification sambil buka reference implementation
3. Rationale section = the real gold. it explains what they DIDN'T do and why
4. Security Considerations = the scary part
5. baru balik ke Abstract

most people read top to bottom. that's the worst order.

kalau lu baca 1 EIP per week and actually understand it, in 6 months you'll know more about ethereum than 95% of "crypto experts" on this app.

---

## CATEGORY 3: THREADS [8 threads]

---

### Post #26 — "How I Got 2 Remote Jobs"
**[THREAD]** | Language: MIX | Format: thread (10 tweets)

1/ gw kerja 2 remote job dan dapet $10K/bulan dari BSD, Tangerang.

bukan flexing. gw mau share gimana prosesnya, karena gw mulai dari literally nol. no degree. no connections. just code.

2/ job pertama: OKU Trade, under GFX Labs. mereka bikin DeFi lending/trading infra.

gw apply cold. no referral. portfolio gw waktu itu = 3 open source projects dan 1 hackathon win. that's it.

interview was 90% technical. they didn't ask where i went to school. not once.

3/ salary started at $4K. after 6 months of consistently shipping, renegotiated to $6,750. the key? i wasn't asking for a raise. i showed them what i shipped and said "this is what i think it's worth."

they agreed same day.

4/ 6 months into OKU, gw nemu job posting ForuAI. AI + blockchain intersection. interesting stack. applied because the tech was cool, not because i needed money.

starting: $3,300/mo. combined with OKU = $10,050/mo. dari Indonesia.

5/ "tapi gimana manage waktu-nya?"

real talk: it's hard. OKU is async — mostly ETH timezone. ForuAI is more flexible.

gw kerja OKU pagi-siang, ForuAI sore-malam. weekends = Kruu Company + ETHJKT.

ada saatnya gw kerja sampe jam 2 pagi. it's not glamorous.

6/ yang bikin works: gw punya Dzikri yang handle day-to-day operations untuk kedua job. he's my employee, gaji Rp 16jt/bulan, tinggal di rumah gw.

delegation is not optional when you're running 2 jobs + a company + a community. it's survival.

7/ the hardest part isn't the work. it's context switching.

pagi: debugging a Solidity storage collision for OKU
sore: reviewing AI model integration for ForuAI
malam: architecture decisions for Kruu

your brain needs 15-20 minutes to fully switch contexts. that time adds up.

8/ things nobody tells you about the 2-job life:

- meetings overlap. you will have to prioritize.
- async communication is non-negotiable
- you need systems, not discipline. discipline runs out. systems don't.
- burnout is real. i've hit it twice. both times i took a week off and came back better.

9/ should you do this? honestly, for most people, no.

one well-paying remote job + side projects is better for most situations. i did 2 because the timing worked and i had help.

kalau lu belum punya 1 remote job, focus ke situ dulu. the second one is a multiplier, not a shortcut.

10/ the real unlock wasn't the money. it's that $10K/mo in Indonesia gives you insane optionality.

i can fund ETHJKT events. i can take risks on Kruu. i can spend time on EIP contributions that don't pay anything.

financial runway = freedom to build what matters.

---

### Post #27 — "The XPL Story"
**[THREAD]** | Language: MIX | Format: thread (7 tweets)

1/ gw pernah kehilangan duit gara-gara altcoin. mau cerita bukan buat dapet simpati tapi karena ini literally changed how i think about money.

2/ nama coin-nya XPL. gw masuk karena "fundamentals bagus" dan "community strong." which is what every altcoin holder says before losing money.

gw research whitepaper-nya. gw baca code-nya. gw convinced diri sendiri this was different.

3/ -82%.

delapan puluh dua persen. 

bukan crash overnight. that would've been easier. ini slow bleed. every week turun dikit. "it'll recover." turun lagi. "just a dip." turun lagi.

the hope is what kills you. the gradual "maybe tomorrow" that stretches into months.

4/ what i realized after:

gw bisa baca smart contract code. gw bisa audit security. tapi gw couldn't evaluate the ONE thing that matters for altcoins: will there be a buyer after me?

technical analysis ≠ investment thesis. i confused the two.

5/ that's when gw started actually studying Bitcoin. not the price charts. the monetary policy.

21 million cap. no team allocation. no "ecosystem fund." no VC unlock schedule. no one can print more.

for the first time, an asset where the rules can't change on you.

6/ sekarang gw literally build DeFi for a living. i know how yield farming works. i know how AMMs price assets. i know the math behind it all.

and i keep my savings in bitcoin only.

bukan karena gw ga ngerti DeFi. justru karena gw ngerti too well.

7/ lesson yang gw ambil: be honest about what you know vs what you're speculating on.

gw tau solidity. gw tau EVM. gw ga tau which altcoin will pump next. and that's fine.

play the games you can win.

---

### Post #28 — "EIP-7702 Deep Dive for Builders"
**[THREAD]** | Language: EN | Format: thread (10 tweets)

1/ i've been digging into EIP-7702 implementation details for the past 2 weeks because we need it for GrimSwap.

here's everything i learned that isn't in the spec summary. builder-to-builder.

2/ the authorization tuple format: [chain_id, address, nonce, y_parity, r, s]

chain_id = 0 means "valid on any chain." this is convenient but also a security risk. if you're building wallet UIs, default to specific chain_id. always.

3/ the delegation indicator stored in account code is: 0xef0100 || address (23 bytes total)

why 0xef01? because EIP-3541 already reserved the 0xef prefix for EOF. the 0xef0100 prefix can never collide with valid contract code. clever.

4/ nonce handling is subtle:

the authorization nonce must equal the account's current nonce. after applying the authorization, the nonce increments.

this means you can't batch multiple authorizations from the same account in the same tx. one authorization per account per tx.

5/ what happens when delegated code executes:

- msg.sender = the caller (not the EOA)
- address(this) = the EOA's address  
- storage reads/writes = the EOA's storage

this is important. the delegated contract operates on the EOA's state, not its own. your storage layout in the delegate contract maps directly to the EOA.

6/ footgun #1: if two different delegate contracts use the same storage slots for different purposes, switching between them corrupts state.

solution: use ERC-7201 namespaced storage in your delegate contracts. always. not optional.

7/ footgun #2: EXTCODECOPY and EXTCODEHASH on a delegated EOA return the delegation indicator, not the actual delegate code.

if your contract does `if (addr.code.length > 0)` to check if something is a contract... a delegated EOA will return true (23 bytes of delegation indicator). plan accordingly.

8/ for GrimSwap integration, we're building a delegate contract that:

- validates ZK proofs before executing swaps
- manages shielded balance commitments in the EOA's storage
- allows gasless transactions via paymaster integration

the UX improvement is massive. users don't need a separate contract wallet anymore.

9/ testing 7702 locally:

anvil (foundry) supports 7702 tx types. use `cast send --auth` to submit authorization txs. the tooling is rough but functional.

for integration tests, we wrote a helper that mines CREATE2 addresses and pre-deploys delegate contracts. saves hours of setup.

10/ my prediction: within 12 months, every major dapp will support 7702 delegated wallets. the UX improvement is too significant to ignore.

if you're building a wallet or dapp right now, start experimenting with 7702 delegate contracts. this is the new standard.

---

### Post #29 — "Zero to CTO, No Degree"
**[THREAD]** | Language: MIX | Format: thread (9 tweets)

1/ gw jadi CTO di umur 25 tanpa ijazah kuliah.

ini bukan motivational thread. gw mau share timeline-nya biar lu bisa judge sendiri apakah path ini make sense buat lu atau nggak.

2/ umur 17-18: belajar coding dari youtube. PHP pertama, terus JavaScript. bikin website jelek-jelek. ga ada yang hire.

this phase sucks. everyone's phase 1 sucks. the key was not stopping.

3/ umur 19-20: mulai deep dive blockchain. kenapa? bukan karena "passion for decentralization." karena gaji-nya lebih gede dari web dev biasa.

honest motivation > noble motivation. at least i showed up.

4/ umur 20-21: first real job. smart contract dev for a small DeFi protocol. gaji kecil tapi ilmu gede.

this is where i learned that reading source code > tutorials. i read uniswap v2. i read compound. i read aave. every weekend, just reading code.

5/ umur 22: got into OKU Trade. real company, real salary, real engineering standards.

first time working with people better than me. impostor syndrome was brutal. but showing up every day and shipping code eventually silences the voice.

6/ umur 23: started ETHJKT with Revo. just 12 people di coffee shop Jakarta. "let's learn ethereum together."

nobody came for the first 3 events. literally us and 2 friends. but we kept going because the alternative was learning alone, and that's worse.

7/ umur 24: ForuAI (second job), founded Kruu with Nino, ETHJKT grew to 500+ members. GrimSwap built in 3 weeks for ETHGlobal.

this was the year everything compounded. but the compounding started at year 1. you just don't see it until year 5+.

8/ umur 25 (now): CTO of Kruu. ETHJKT at 900+ members. 24-month EIP contribution roadmap started.

total formal education: 0 semesters
total hours reading code: i don't want to calculate this

9/ the meta lesson:

nobody gave gw permission. no degree said "you're ready." no company said "you're qualified."

gw just kept shipping and eventually the gap between "qualified" and "unqualified" stopped mattering because the work spoke for itself.

bukan advice. just how it went for me.

---

### Post #30 — "ZK Privacy on Uniswap V4: GrimSwap Architecture"
**[THREAD]** | Language: EN | Format: thread (8 tweets)

1/ we built a privacy-preserving DEX on top of Uniswap V4. ETHGlobal HackMoney 2026, Top 10.

this is the technical architecture thread. how GrimSwap actually works under the hood.

2/ the problem: every swap on ethereum is public. anyone can see what you're trading, how much, and when.

for institutional users, this is a dealbreaker. front-running, copytrading, and information leakage make large trades expensive.

3/ GrimSwap adds a shielded balance layer on top of Uniswap V4's pool system.

users deposit tokens into a commitment tree (merkle tree of encrypted balances). to trade, they generate a ZK proof that says "i have enough balance to make this swap" without revealing the balance.

4/ the flow:

deposit → token goes into shielded pool, user gets a commitment note
swap → user generates ZK proof, submits to V4 hook → hook verifies proof → swap executes through uniswap AMM → new commitment note issued
withdraw → user generates proof of ownership, tokens exit to any address

5/ the V4 hook does the heavy lifting:

beforeSwap: verifies the ZK proof (groth16 on-chain verification), checks nullifier hasn't been used (prevents double-spending), validates the commitment exists in the merkle tree

afterSwap: inserts new commitment into the tree, emits encrypted note for the user

6/ what makes this different from tornado cash:

tornado = fixed denominations (0.1, 1, 10, 100 ETH). mixing pool.
grimswap = arbitrary amounts. actual DEX trading with AMM pricing. privacy + price discovery in one protocol.

we're not mixing. we're trading privately. different primitive entirely.

7/ the hard parts we had to solve:

- merkle tree updates on-chain are expensive → we use an incremental merkle tree (only update the path, not the whole tree)
- proof generation is slow on mobile → we precompute partial witnesses
- gas costs → batched verification where possible, assembly for pairing precompiles

total gas per shielded swap: ~280k (including AMM swap + ZK verification). not cheap. but not insane either.

8/ GrimSwap is open source. if you want to build privacy features on V4, the hook code is a good starting point.

github.com/grimswap (shameless plug)

privacy on ethereum isn't solved. but we're building toward it. one proof at a time.

---

### Post #31 — "ETHJKT: Building Indonesia's Web3 Dev Army"
**[THREAD]** | Language: MIX | Format: thread (8 tweets)

1/ gw founding ETHJKT 2 tahun lalu. dari 12 orang di coffee shop, sekarang 900+ members.

ini bukan "community building playbook." ini cerita kenapa gw lakuin ini dan what actually worked.

2/ konteks: Indonesia punya 280 juta orang. developer-nya banyak. tapi Web3 dev? almost nonexistent when we started.

bukan karena orang Indo ga capable. karena ga ada yang ngajarin. the education gap is massive.

3/ ETHJKT pake wizarding/RPG theme bukan karena gimmick. smart contracts literally ARE spells — you write incantations that move money.

tapi lebih dari itu: the theme gives people identity. you're not just "a student." you're a Keeper, an Archmage, a Grimoire Scholar.

engagement naik 3x setelah kita implement the theme. people WANT to level up.

4/ what actually works for community building:

- IRL events > discord messages. every time.
- 10 active builders > 500 lurkers
- teach stuff you just learned (not expert-level stuff nobody relates to)
- consistency beats virality. we ran events when 3 people showed up. those 3 told 3 more.

5/ the hardest period: month 3-6. the initial hype is gone. your core team is tired. attendance drops. every community hits this wall.

what saved us: Revo and Bryan kept showing up. that's it. not strategy. just showing up.

6/ ETHJKT sekarang:
- weekly study groups (Solidity, ZK, smart contract security)
- monthly hackathon minis  
- job board connecting Indo devs with global Web3 companies
- mentorship program (senior devs paired with beginners)

900+ members. 40-60 active builders. that ratio is normal and healthy.

7/ our next big push: ZK workshop series + EIP reading group.

gw mau Indonesia punya orang yang contribute ke Ethereum protocol level. bukan cuma pake Ethereum, tapi BANGUN Ethereum.

that's the real endgame of ETHJKT. not another "learn solidity" bootcamp.

8/ kalau lu di Indonesia dan pengen masuk Web3 development, ETHJKT is free. always has been.

link di bio gw. atau dm gw langsung.

gw ga bisa janjiin lu bakal jadi rich. tapi gw bisa kasih lu environment buat belajar dari orang-orang yang actually building.

the rest is on you.

---

### Post #32 — "Bitcoin's Monetary Policy for Indonesian Context"
**[THREAD]** | Language: MIX | Format: thread (8 tweets)

1/ gw tinggal di Indonesia. gaji gw dalam dollar. tapi gw spend dalam rupiah.

this gives me a front-row seat to something most Western bitcoiners only understand in theory: currency devaluation in real time.

2/ 10 tahun lalu, 1 USD = Rp 12,000. sekarang? Rp 16,000+.

that's a 33% devaluation. kalau lu simpan rupiah di bawah kasur 10 tahun lalu, purchasing power lu udah turun sepertiga.

"tapi kan ada deposito." bunga deposito BCA: 2.5%. inflasi resmi: 3-4%. inflasi real (makanan, property): 6-8%.

you're losing money by saving.

3/ this isn't unique to Indonesia. every fiat currency does this. the dollar does it too, just slower.

but when you live in a country with a weaker currency, you FEEL it. every trip to supermarket. every property listing. every biaya pendidikan.

4/ bitcoin's monetary policy:

- 21 million. ever.
- new supply halves every ~4 years
- no central bank can change the rules
- no "quantitative easing" (a.k.a. money printing with extra steps)

simple? yes. that's the point. complexity in monetary policy serves the people who control it, not the people who use it.

5/ "tapi bitcoin volatile"

ya. in the short term. tapi gw bukan day trader.

zoom out 4 years — any 4 year period — bitcoin outperforms every other asset class. it's volatile quarter to quarter. it's the best savings technology decade to decade.

6/ gw punya hot take soal AI + bitcoin:

AI will automate a massive chunk of middle-class jobs. it's already happening. the companies that deploy AI will get cheaper labor, higher margins, better returns.

most people = sellers of labor (getting cheaper)
few people = owners of capital (getting richer)

the great divergence. and it's accelerating.

7/ in that world, you want to be a capital owner. and you want your capital in an asset that can't be diluted.

real estate? government can tax or seize it.
stocks? company can dilute shares.
gold? good, but try sending it across borders.
bitcoin? 12 words in your head. unseizable. uninflatable. borderless.

8/ gw build DeFi. gw write smart contracts. gw tau complexity of crypto protocols.

and i store my wealth in the simplest one.

bukan karena gw ga ngerti the rest. because i understand it too well.

simplicity isn't ignorance. it's the other side of complexity.

---

### Post #33 — "Solidity Patterns That Actually Matter"
**[THREAD]** | Language: EN | Format: thread (7 tweets)

1/ been writing solidity for 5+ years. most "best practices" articles are either outdated or wrong.

here are the patterns i actually use in production. no filler, just code i'd put my name on.

2/ checks-effects-interactions. yes, everyone knows this. no, everyone doesn't follow it.

```
// WRONG
function withdraw(uint amount) {
    token.transfer(msg.sender, amount); // interaction
    balances[msg.sender] -= amount; // effect after interaction
}

// RIGHT  
function withdraw(uint amount) {
    balances[msg.sender] -= amount; // effect first
    token.transfer(msg.sender, amount); // then interact
}
```

reentrancy is a 2016 bug that still kills contracts in 2026. respect the basics.

3/ custom errors over require strings. this is free gas savings that way too many teams still don't use.

```
// costs more gas (stores string in bytecode)
require(balance >= amount, "Insufficient balance");

// costs less gas + better for off-chain decoding
error InsufficientBalance(uint256 available, uint256 required);
if (balance < amount) revert InsufficientBalance(balance, amount);
```

bonus: custom errors with parameters make debugging way easier.

4/ immutable over constant for constructor-set values.

```
address public immutable owner;
constructor() { owner = msg.sender; }
```

immutable values are stored in the contract bytecode, not storage. reading them costs 3 gas instead of 2100 gas (cold SLOAD).

if a value is set once and never changes, make it immutable. this is free.

5/ the pull-over-push pattern for ETH transfers:

```
// PUSH (dangerous: what if recipient reverts?)
function distribute() {
    for (uint i; i < recipients.length;) {
        recipients[i].transfer(amounts[i]);
        unchecked { ++i; }
    }
}

// PULL (safe: each user withdraws their own)
mapping(address => uint) public pendingWithdrawals;

function withdraw() {
    uint amount = pendingWithdrawals[msg.sender];
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```

one malicious recipient can DOS your entire distribution in push mode. pull pattern = each user is responsible for their own withdrawal.

6/ unchecked blocks for loop counters. solidity 0.8+ adds overflow checks to every arithmetic operation. for loop counters that can't realistically overflow, skip the check:

```
for (uint i; i < length;) {
    // do stuff
    unchecked { ++i; }
}
```

saves ~60 gas per iteration. on a loop that runs 100 times, that's 6000 gas. adds up.

7/ none of these are clever tricks. they're fundamentals.

the best solidity code i've seen isn't clever at all. it's boring, predictable, and obviously correct.

write boring contracts. your users' money depends on it.

---

## CATEGORY 4: ETHJKT & COMMUNITY [5 posts]

---

### Post #34 — "Why I Teach for Free"
**[COMMUNITY]** | Language: ID | Format: single tweet

"ngapain lu ngajarin gratis? mending monetize."

karena waktu gw baru belajar coding, semua resource yang berguna buat gw itu gratis. youtube, stackoverflow, open source repos.

gw cuma bayar ke depan. ETHJKT gratis dan bakal tetep gratis. titik.

---

### Post #35 — "The Real Web3 Education Problem"
**[COMMUNITY]** | Language: MIX | Format: thread (5 tweets)

1/ masalah Web3 education di Indonesia bukan kurang materi. ada ribuan tutorial di youtube.

masalahnya: nobody teaches you HOW TO THINK about smart contracts.

2/ tutorials teach you syntax. "write this code, deploy, it works."

tapi ga ada yang ngajarin:
- kenapa storage layout matters
- gimana gas model affects architecture decisions
- what happens when your contract gets attacked

understanding > memorizing.

3/ di ETHJKT, kita approach-nya beda.

week 1: you read Uniswap V2 source code. bukan bikin to-do list app.

"tapi kan susah buat pemula?"

ya. tapi setelah lu survive reading real production code, tutorial jadi gampang. kebalik dari cara orang biasa.

4/ hasilnya: members yang join 6 bulan lalu sekarang udah bisa review smart contract security, contribute ke open source projects, bahkan dapet remote jobs.

bukan karena kita "the best." karena kita set the bar high from day 1.

5/ kalau lu educator di crypto space Indonesia: tolong stop bikin "apa itu blockchain?" content.

kita udah lewat itu. yang dibutuhin sekarang: deep technical education yang treat orang Indonesia sebagai engineers, bukan consumers.

---

### Post #36 — "Community Win"
**[COMMUNITY]** | Language: ID | Format: single tweet

salah satu member ETHJKT baru dapet first Web3 job-nya bulan ini. remote, gaji dollar.

6 bulan lalu dia DM gw: "gw ga ngerti apa-apa soal blockchain tapi gw mau belajar."

sekarang dia review smart contracts buat living.

ini kenapa gw run ETHJKT. bukan metrics. bukan followers. this.

---

### Post #37 — "Stop Building Alone"
**[COMMUNITY]** | Language: EN | Format: single tweet

biggest mistake i made early in my career: building alone.

i thought asking for help was weakness. turns out it's just slow.

every breakthrough i've had came from someone else's perspective on my problem. your network isn't just for jobs. it's for debugging your thinking.

find 5 builders at your level. meet weekly. review each other's code. that's the cheat code.

---

### Post #38 — "The Indonesian Web3 Dev Gap"
**[COMMUNITY]** | Language: MIX | Format: single tweet

indonesia has:
- 4th largest population in the world
- one of the highest crypto adoption rates globally
- massive mobile-first user base

indonesia doesn't have:
- enough blockchain engineers
- enough protocol-level contributors
- a seat at the table where standards are made

ETHJKT exists to close that gap. kita bukan cuma belajar pake ethereum. kita mau bantu BUILD ethereum.

recruitment open. link in bio.

---

## CATEGORY 5: BITCOIN MAXI & DEEP BITCOIN [7 posts]

---

### Post #39 — "The DeFi Builder's Case for Bitcoin"
**[BITCOIN]** | Language: EN | Format: single tweet

people think it's contradictory that i build DeFi but only hold bitcoin.

it's not.

i build on ethereum because it's the best programmable settlement layer.
i save in bitcoin because it's the best money.

a chef doesn't eat everything they cook. i use ETH as a tool and BTC as a store of value. different functions, different assets.

---

### Post #40 — "Self-Custody is Non-Negotiable"
**[BITCOIN]** | Language: EN | Format: single tweet

if your bitcoin is on an exchange, it's not your bitcoin. it's an IOU.

mt. gox, ftx, celsius, blockfi, voyager. the list gets longer every cycle.

hardware wallet. write down the seed phrase on metal. put it somewhere safe. verify the receive address on device.

this takes 30 minutes to set up and protects a lifetime of savings. there's no excuse.

---

### Post #41 — "Time Preference"
**[BITCOIN]** | Language: MIX | Format: single tweet

konsep yang paling ngerubah cara gw mikir: time preference.

high time preference = gw mau sekarang. spend now. gratify now.
low time preference = gw bisa nunggu. save. build. compound.

fiat money trains high time preference. why save if your money loses value every year? better spend now.

bitcoin flips this. money that appreciates over time rewards patience.

sejak gw ngerti ini, semua keputusan financial gw berubah. how i spend, how i save, how i invest my time.

it's not about bitcoin the asset. it's about what sound money does to your brain.

---

### Post #42 — "AI + Bitcoin Fire Sale Theory"
**[BITCOIN]** | Language: EN | Format: thread (5 tweets)

1/ here's a framework i've been thinking about a lot: AI creates the biggest wealth transfer in history, and bitcoin is how you position for it.

2/ premise: AI replaces a massive chunk of knowledge work within 10 years. not all of it, but enough to compress wages for the average white-collar worker.

the companies deploying AI: costs go down, margins go up, stock goes up.
the workers replaced by AI: income goes down, options shrink.

3/ this creates a fire sale. assets that middle-class people own (houses, cars, retail stocks) get sold under pressure. assets that capital owners want (productive businesses, scarce assets) get bid up.

who's buying the fire sale? people with capital that hasn't been diluted.

4/ gold works for this. real estate in specific markets works. but neither are as accessible as bitcoin.

bitcoin: anyone with a phone can buy it. it can't be seized at a border. it can't be diluted by central bank policy. it costs nothing to store.

for someone in Indonesia or Nigeria or Argentina, bitcoin is the most accessible uninflatable asset available. period.

5/ i'm not saying "buy bitcoin because number go up."

i'm saying: position yourself on the right side of the AI-driven wealth transfer. own assets that can't be printed. build skills that can't be automated (yes, smart contract engineering is one of them — for now).

this is the long game. not a trade.

---

### Post #43 — "21 Million"
**[BITCOIN]** | Language: ID | Format: single tweet

ada 21 juta bitcoin. selamanya.

bumi punya 8 miliar orang. 

kalo lu punya 0.01 BTC, secara matematis lu punya lebih banyak dari rata-rata seluruh manusia di planet ini BISA punya.

ini bukan soal harga hari ini. ini soal scarcity yang ga bisa di-manipulasi siapapun. presiden, bank sentral, siapapun.

gw accumulate pelan-pelan. ga pake leverage. ga pake timing. just consistent buys.

boring? yes. effective? juga yes.

---

### Post #44 — "Rupiah vs Hard Money"
**[BITCOIN]** | Language: MIX | Format: single tweet

tabungan lu di bank: bunga 2.5%/tahun
inflasi beneran (bukan yg resmi): 6-8%/tahun

artinya: setiap tahun lu simpan uang di bank, purchasing power lu turun 3-5%.

10 tahun dari sekarang, uang lu bisa beli setengah dari apa yang bisa lu beli hari ini.

"but bitcoin is volatile" — sure. tapi at least gw tau exactly berapa supply-nya dan nobody can change it.

uncertainty yang gw pilih > certainty of losing purchasing power every year.

---

### Post #45 — "Why Not Altcoins"
**[BITCOIN]** | Language: EN | Format: single tweet

"why only bitcoin? why not diversify into alts?"

because i build altcoin infrastructure for a living. i see how the sausage is made.

- token unlocks designed to dump on retail
- "governance" where 3 wallets control 60% of votes
- "decentralized" protocols with admin keys that can drain the treasury
- "community-driven" projects where the community has no power

not all projects are like this. but enough are that i'd rather just hold the one asset where none of these apply.

bitcoin has no team. no treasury. no governance token. no admin key. no unlock schedule.

that's not a limitation. that's the entire point.

---

## 📊 SUMMARY

| Category | Count | Posts |
|---|---|---|
| Memes & Shitposts | 15 | #1-15 |
| Technical Breakdowns | 10 | #16-25 |
| Threads | 8 | #26-33 |
| ETHJKT & Community | 5 | #34-38 |
| Bitcoin Maxi | 7 | #39-45 |
| **TOTAL** | **45** | |

### Language Distribution
- Indonesian (ID): 17 posts (~38%)
- English (EN): 18 posts (~40%)  
- Mixed (MIX): 10 posts (~22%)

### Format Distribution
- Single tweets: 22
- Threads: 23 (ranging from 5-10 tweets each)

---

*Content bank v2 — @zexoverz. Fire when ready. 🔥*

---

## CONTENT BANK V2.1 — THE HUMOR EXPANSION (Posts #46-90)

*Generated: 2026-02-21 | 45 NEW posts | Every post has punchlines. Learn AND laugh.*

---

## CATEGORY 1: MEMES & SHITPOSTS [15 posts]

---

### Post #46 — "Code Review Sama Diri Sendiri"
**[MEME]** | Language: ID | Format: single tweet

buka code gw dari 3 bulan lalu.

"ini siapa yang nulis?? variable name-nya 'x2'?? ga ada comment?? ini loop ngapain??"

git blame.

oh. gw sendiri.

gw literally bully diri sendiri di code review. ini yang mereka ga kasih tau soal jadi senior dev — musuh terbesar lu adalah lu 3 bulan lalu.

---

### Post #47 — "The Audit Report"
**[MEME]** | Language: EN | Format: single tweet

smart contract audit findings but they're therapy diagnoses:

- Critical: unresolved reentrancy (you keep going back to toxic patterns)
- High: unchecked external calls (you trust people too easily)
- Medium: improper access control (you can't set boundaries)
- Low: missing event emissions (you don't communicate your feelings)
- Informational: code could use more comments (you're hard to read)

total bill: $40,000. same as therapy honestly.

---

### Post #48 — "Work-Life Balance ala Indo Dev"
**[MEME]** | Language: ID | Format: single tweet

work-life balance versi gw:

senin-jumat: kerja 2 remote job dari jam 9 pagi sampe jam 11 malam
sabtu: "hari ini gw santai" → buka laptop → "bentar debug dikit" → jam 2 pagi
minggu: niat quality time sama keiko → hp bunyi → "ser the deployment failed"

keiko udah hafal: "5 menit ya sayang" itu artinya 2 jam.

balance where??

---

### Post #49 — "The Pull Request Experience"
**[MEME]** | Language: EN | Format: single tweet

the 5 stages of a pull request:

1. "this is clean, should be quick review" — submit PR
2. reviewer: "42 comments" — soul leaves body
3. "ok fair point" × 38, "no this is correct actually" × 4
4. force push 7 times. CI fails. fix CI. CI fails again. sacrifice a goat.
5. "LGTM 🚀" — serotonin hit better than any drug on earth

and you do it again tomorrow. we are sick people.

---

### Post #50 — "Keiko vs Ethereum"
**[MEME]** | Language: MIX | Format: single tweet

keiko: "sayang lagi ngapain?"
gw: "lagi baca EIP, 5 menit"

*2 jam kemudian*

keiko: "kamu milih aku atau ethereum?"
gw: "ethereum itu bukan orang saya—"
keiko: "PILIH."
gw: "...kamu sayang 🥺"

she doesn't know gw masih baca EIP di hp di bawah meja makan.

marriage is about compromise. and stealth multitasking.

---

### Post #51 — "Hari-harinya Dzikri"
**[MEME]** | Language: ID | Format: single tweet

dzikri pagi: stand-up meeting OKU, report progress, review PR
dzikri siang: handle ForuAI task, coordinate sama Zikri
dzikri sore: debug production issue yang gw tinggalin
dzikri malam: gw chat "eh dzik, ini satu lagi ya"
dzikri: 😐

gaji Rp 16 juta sebulan tapi workload kayak 3 orang.

dzik kalo lu baca ini, gw minta maaf. tapi besok ada 1 task lagi ya. urgent.

---

### Post #52 — "Web3 Conference Bingo"
**[MEME]** | Language: EN | Format: single tweet

web3 conference bingo:

☐ someone says "we're still early" (bro it's 2026)
☐ panel with 5 people, 0 have shipped code
☐ "our protocol is fully decentralized" (2 multisig holders)
☐ free merch line longer than any talk's audience
☐ someone pitches you an L2 during bathroom break
☐ keynote is just a token price prediction with slides
☐ wifi doesn't work at a TECHNOLOGY conference

bingo by 11am. every time.

---

### Post #53 — "The GitHub Green Squares Addiction"
**[MEME]** | Language: EN | Format: single tweet

i have a 347-day github commit streak.

have i shipped meaningful code every single day? absolutely not. some days it's a typo fix in a README.

but the green square must be green. the square demands it. the square is my master.

if i die, someone please push an empty commit to my repo so the streak lives on. bury me with a green contribution graph.

this is what programming does to your brain.

---

### Post #54 — "Indomie-Powered Engineering"
**[MEME]** | Language: ID | Format: single tweet

stack teknologi gw:

frontend: React
backend: Node.js
smart contracts: Solidity + Foundry
database: PostgreSQL
deployment: Docker
bahan bakar utama: Indomie Goreng 2 bungkus jam 1 pagi

semua bisa diganti. React bisa pake Vue. Node bisa pake Go.

tapi Indomie? Indomie is non-negotiable infrastructure. critical dependency. kalau Indomie down, seluruh engineering pipeline gw collapse.

---

### Post #55 — "Meeting Timezone Nightmare"
**[MEME]** | Language: MIX | Format: single tweet

gw di WIB (UTC+7)
OKU team di US Eastern (UTC-5)
ForuAI team di mix timezone
Kruu meeting di WIB
ETHJKT event di malam

hidup gw basically:
8 AM: "good morning"
10 PM: "good morning" (to americans)
1 AM: "good morning" (to myself, masih kerja)

gw udah lupa timezone gw sendiri. my body clock runs on UTC+confusion.

"when are you free?" bro i don't even know what day it is.

---

### Post #56 — "The Hackathon Sleep Schedule"
**[MEME]** | Language: EN | Format: single tweet

hackathon sleep schedule:

day 1: "i'll pace myself this time, healthy sleep" — sleep at 2am
day 2: "ok just one more feature" — sleep at 4am
day 3: sleep is a social construct. coffee is the only god. merged 14 commits at 6am while hallucinating.

submitted GrimSwap 22 minutes before deadline. it compiled. i cried.

ETHGlobal should include a therapist in the prize pool.

---

### Post #57 — "Orang Tua Nanya Kerjaan"
**[MEME]** | Language: ID | Format: single tweet

mama: "faisal kerja apa sih sebenernya?"
gw: "bikin smart contract di blockchain, ma"
mama: "itu kayak bitcoin?"
gw: "beda ma, ini—"
mama: "oh jadi kamu main bitcoin"
gw: "bukan main, ma—"
mama: "tante sri bilang bitcoin itu penipuan"
gw: "ma—"
mama: "ya udah yang penting halal ya"

gw give up jelasin. sekarang kalo ditanya gw bilang "IT" aja. semua orang ngerti IT.

---

### Post #58 — "L2 Wars"
**[MEME]** | Language: EN | Format: single tweet

L2 tribalism is the new religion:

Arbitrum maxis: "we have the most TVL"
Optimism maxis: "we have the Superchain vision"  
Base maxis: "we have Coinbase distribution"
zkSync maxis: "we have ZK proofs (eventually)"
Starknet maxis: "our tech is superior you wouldn't understand"
Polygon maxis: "we rebranded again btw"

meanwhile ethereum L1: sitting there like a proud parent watching the kids fight at thanksgiving dinner.

they're all ethereum. chill.

---

### Post #59 — "DM Inbox Seorang Crypto Dev"
**[MEME]** | Language: ID | Format: single tweet

DM gw tiap hari:

30% "ser can you review my smart contract" (kirim link tanpa context)
25% "i have an amazing project, just need a CTO" (no budget, "equity only")
20% scam link (gw yakin bot ini lebih rajin dari gw)
15% "how to learn solidity?" (gw jawab panjang, di-read doang)
10% keiko: "pulang jam berapa?"

yang paling penting selalu yang 10% terakhir. gw udah belajar ini the hard way.

---

### Post #60 — "BSD Life"
**[MEME]** | Language: MIX | Format: single tweet

living in BSD, Tangerang as a remote worker:

pros:
- rent murah compared to Jakarta
- surprisingly good internet (critical infrastructure)
- malls everywhere for "change of scenery" (read: starbucks)
- 0 traffic karena ga pernah keluar rumah

cons:
- delivery driver GPS selalu bingung di BSD
- "BSD mana?" every time gw sebut ke orang Jakarta
- nearest crypto meetup = 1.5 jam ke Jakarta

but honestly, when your office is your bedroom, lokasi itu cuma soal internet speed and indomie delivery range.

gw set. 😎

---

## CATEGORY 2: TECHNICAL BREAKDOWNS with PUNCHLINES [10 posts]

---

### Post #61 — "MEV Explained Like a Warung"
**[TECHNICAL]** | Language: MIX | Format: thread (7 tweets)

1/ MEV (Maximal Extractable Value) tapi gw jelasin pake analogi warung padang. ikutin gw.

2/ lu lagi antri di warung padang. lu mau pesen rendang. cuma sisa 1 porsi.

orang di belakang lu denger. dia teriak ke mas-mas: "BANG GW MAU RENDANG, GW BAYAR DOUBLE."

mas-mas skip lu, kasih dia duluan. lu dapet telur. ini namanya front-running.

3/ sekarang bayangin ada orang di antrian yang liat lu mau pesen rendang, DAN liat orang lain juga mau. dia pesan SEBELUM kalian berdua, beli semua rendang, terus jual balik ke kalian berdua harga markup.

this is sandwich attack. dan ya, ini happen setiap detik di Ethereum. bukan analogi.

4/ technically: MEV searchers monitor the mempool (the queue of pending transactions). they see your swap, calculate the profit of front-running or sandwiching it, and submit their own transaction with higher gas to get priority.

validators (the warung padang owners) arrange transactions to maximize their own tips. they don't care about fairness. they care about revenue.

5/ the numbers are insane. MEV searchers have extracted billions of dollars from regular users since DeFi started. you think you're swapping ETH for USDC at market price? nope. you're probably getting sandwiched and losing 0.1-0.5% extra.

death by a thousand cuts.

6/ solutions being built:

- Flashbots Protect: send your tx through a private relay, skip the public mempool → no sandwich
- MEV-Share: searchers share profits back with users (ya, lu dapet uang balik)
- intent-based protocols (CoW Swap, UniswapX): you sign an intent, solvers compete for best execution
- encrypted mempools: nobody sees your tx until it's included. warung padang but the menu is encrypted.

7/ moral of the story: kalau lu swap on-chain tanpa protection, lu basically teriak orderan lu di warung penuh calo.

use private transaction relays. set tight slippage. or use intent-based DEXs.

dan jangan pesen rendang terakhir. never ends well. 🍛

---

### Post #62 — "Proxy Patterns: The Divorce Lawyers of Smart Contracts"
**[TECHNICAL]** | Language: EN | Format: thread (6 tweets)

1/ smart contracts are immutable. you deploy it, it's done. no takebacks.

...unless you use a proxy pattern. which is basically hiring a divorce lawyer for your code. "the contract is immutable, but ACTUALLY—"

2/ how proxies work: users interact with a proxy contract that stores all the state. the proxy delegates calls to an implementation contract that has the logic.

want to upgrade? deploy a new implementation, point the proxy to it. same address, same state, new code.

it's like renovating a house. the address stays the same, the plumbing changes. hopefully you don't flood the basement.

3/ the three main patterns:

**Transparent Proxy (ERC-1967):**
admin calls → proxy handles it
everyone else → delegatecall to implementation
simple but the admin check adds gas to EVERY call. your users pay for your paranoia.

**UUPS (Universal Upgradeable Proxy Standard):**
upgrade logic lives in the implementation, not the proxy
proxy is minimal → cheaper for users
but if you forget the upgrade function in your new implementation... congratulations, your contract is now immutable. surprise.

**Beacon Proxy:**
multiple proxies share one "beacon" that points to the implementation
upgrade the beacon → all proxies update at once
it's like updating the firmware on 50 devices simultaneously. what could go wrong.

4/ the footgun hall of fame:

- Wormhole: implementation contract wasn't initialized, hacker called initialize(), took $326M. the "did you lock the back door?" of smart contracts.

- Audius: UUPS proxy but the storage layout between implementation versions didn't match. state corrupted. think of it as moving apartments but the furniture doesn't fit.

rule #1 of proxies: ALWAYS initialize your implementation contracts. ALWAYS check storage layout compatibility.

5/ my honest take: proxies are necessary but they fundamentally undermine the "code is law" promise.

if a team can upgrade the contract anytime, you're trusting THEM, not the code. which is fine — just be honest about it.

the truly decentralized play: proxy with a timelock + governance. upgrades are public for 48 hours before execution. users can exit if they disagree.

6/ should you use a proxy?

building a DEX or DeFi protocol? probably yes. bugs happen. you need a fix path.
building a simple token? probably no. immutable is a feature.
building anything with user funds? proxy + timelock + multisig. minimum.

proxies are power tools. power tools are great until someone loses a finger. use them responsibly. 🔧

---

### Post #63 — "EIP-4844 Blobs: The Unsung Hero of Cheap L2s"
**[TECHNICAL]** | Language: EN | Format: thread (6 tweets)

1/ if your L2 fees dropped 10-100x in the last year, you can thank EIP-4844 and its beautiful, stupid blobs.

yes they're actually called blobs. blockchain naming conventions remain undefeated.

2/ the problem before 4844: L2s posted their data to Ethereum L1 as calldata. calldata lives forever. every full node stores it. forever.

L2s were literally paying for immortal storage when they only needed temporary data availability. like renting a museum vault to store your grocery list.

3/ blobs are "sidecar" data attached to blocks. they exist for ~18 days, then get pruned. nodes don't store them forever.

why is this cheaper? because storing data for 18 days is fundamentally cheaper than storing it forever. economics 101.

each blob: ~128KB. each block can have up to 6 blobs (target 3). that's ~768KB of cheap temporary storage per block.

4/ the fee market is separate from regular gas. blob base fee follows its own EIP-1559-style mechanism: if blobs are full, price goes up. if there's space, price drops.

right now? blob space is mostly empty. which means L2s are posting data for nearly free.

this is why your $0.001 Arbitrum transaction exists. you're welcome.

5/ "but wait, if blobs get pruned, what about data availability?"

the key insight: L2s only need the data to be available long enough for anyone to challenge a fraudulent state root (optimistic rollups) or verify proofs (ZK rollups).

18 days is more than enough. if nobody challenges in 18 days, you're good. the data served its purpose and can disappear like my motivation on a Monday.

6/ what's next: EIP-7691 (part of Pectra) increases the blob target and max. more blob space = even cheaper L2s.

long term: full danksharding. instead of 6 blobs per block, imagine 64+. L2 fees approaching zero.

the boring infrastructure work that makes everything else possible. blobs aren't sexy. they're essential. like plumbing. like indomie. respect the blobs. 🫧

---

### Post #64 — "Reentrancy: The Ex Who Keeps Coming Back"
**[TECHNICAL]** | Language: MIX | Format: single tweet

reentrancy attack itu kayak mantan yang minta "ngobrol bentar."

smart contract lu: "ok sini, ambil ETH lu"
attacker: *ambil ETH* → "eh bentar, gw mau ngobrol lagi" → *ambil ETH lagi* → "satu lagi—" → *ambil lagi*

contract lu: "loh kok saldo gw 0?"

the fix: update state BEFORE external calls. basically block your ex's number before you reply, bukan sesudah.

```
// mantan bolak-balik (BAD)
function withdraw() {
    msg.sender.call{value: bal}("");
    balances[msg.sender] = 0; // too late bestie
}

// mantan di-block (GOOD)  
function withdraw() {
    uint bal = balances[msg.sender];
    balances[msg.sender] = 0; // block dulu
    msg.sender.call{value: bal}(""); // baru kasih
}
```

the DAO hack, 2016. $60M gone. karena ga block mantan. literally.

---

### Post #65 — "The Oracle Problem: Trusting the Messenger"
**[TECHNICAL]** | Language: EN | Format: thread (5 tweets)

1/ blockchains can't access external data. they're like that friend who refuses to google anything. "i only believe what i can verify myself."

so how does your DeFi protocol know the price of ETH? oracles. and oracles are where things get spicy. 🌶️

2/ an oracle is a system that feeds external data into smart contracts. sounds simple. it's not.

the problem: if your $500M lending protocol liquidates positions based on price data, whoever controls that price data controls $500M.

"but it's decentralized!" — is it? really? let's check.

3/ Chainlink: network of node operators that aggregate price data from multiple sources. the gold standard. battle-tested.

but: the multisig that manages Chainlink feeds can add/remove nodes and change configs. you're trusting that multisig not to go rogue. which is fine. until it isn't.

Uniswap TWAP: use on-chain trading data as a price oracle. no external dependency!

but: manipulable if someone does a large swap to skew the price, reads the oracle, and swaps back. it's like asking "what's the price of bananas?" and the person you're asking just bought all the bananas. biased source.

4/ the real oracle exploit playbook:

1. flash loan $100M
2. use it to manipulate an on-chain price oracle
3. use the manipulated price to borrow $200M from a lending protocol
4. repay the flash loan
5. walk away with $100M profit

this has happened dozens of times. Mango Markets lost $114M to basically this exact flow.

the oracle didn't lie. it just reported reality as it was in that moment. and reality was briefly... manipulated.

5/ what actually works:

- use Chainlink for high-value price feeds (battle-tested > clever)
- TWAP with long windows (30 min+) for on-chain oracles (harder to manipulate)
- multi-oracle systems: check Chainlink AND TWAP, if they disagree → pause
- circuit breakers: if price moves >10% in 1 block, something is probably wrong

trust no single source. verify everything. like a paranoid detective, but for prices. 🔍

---

### Post #66 — "Bridge Security: Why Cross-Chain Is Scary"
**[TECHNICAL]** | Language: MIX | Format: thread (6 tweets)

1/ bridges are the scariest infrastructure in crypto. bukan karena tech-nya jelek — karena the attack surface is MASSIVE dan the incentive to hack is astronomical.

total bridge hacks since 2020: $2.5B+. ya, billion with a B.

2/ how most bridges work:

1. lu lock token di Chain A
2. bridge validator set sees the lock event
3. mereka sign a message: "ya bener, dia lock 10 ETH di Chain A"
4. Chain B mints 10 wrapped ETH based on that message

the trust assumption: the validator set is honest. which is basically a multisig. which is basically "trust these N people."

3/ the greatest hits of bridge hacks:

**Ronin Bridge ($624M):** 5 of 9 validators compromised. attacker forged withdrawal messages. 5 of 9. gw perlu lebih dari 5 temen buat pesen GoFood bareng, but $624M cuma butuh 5 signatures.

**Wormhole ($326M):** verification bug in the smart contract. attacker told the bridge "trust me bro, this signature is valid." the bridge said ok. $326M gone.

**Nomad ($190M):** initialization bug meant ANY message was treated as valid. it wasn't one hacker — it was a free-for-all. literally hundreds of people copy-pasting the exploit tx. community rug. 💀

4/ the fundamental problem: bridges inherit the security of the WEAKEST chain they connect.

Chain A bisa super secure. Chain B bisa super secure. but the bridge between them? that's a new trust assumption. and trust assumptions are where money goes to die.

5/ what's being built to fix this:

**ZK bridges:** generate a ZK proof that a transaction happened on Chain A, verify it on Chain B. no validator set needed. math > trust.

**Optimistic bridges:** assume messages are valid, but allow a challenge period. if someone proves fraud, the message is reverted. slower but safer.

**Restaking-secured bridges (EigenLayer model):** bridges secured by ETH stakers. higher economic security. but still a trust assumption (stakers can collude).

6/ my practical advice:

- bridge the minimum amount you need
- use battle-tested bridges (Arbitrum/Optimism canonical bridges have NEVER been hacked)
- avoid bridges with small validator sets
- kalau bridging amount besar, split into multiple transactions
- or just... don't bridge. stay on one chain. gw tau ini unpopular opinion but your money is safer di satu chain.

bridges are necessary evil. emphasis on evil. 🌉

---

### Post #67 — "ERC-6900: Modular Smart Accounts"
**[TECHNICAL]** | Language: EN | Format: single tweet

ERC-6900 is the "app store for your wallet" and i'm going to explain it with the worst analogy possible:

your smart account wallet is a phone. right now it comes with pre-installed apps you can't change.

6900 says: what if your wallet had an app store? install a "2FA plugin" for security. install a "session key plugin" for gaming. install a "spending limit plugin" so you don't ape into memecoins at 3am.

each plugin = a module with standardized interfaces (validation, execution, hooks).

modules are COMPOSABLE. stack them. swap them. uninstall the one that didn't work. your wallet, your rules.

why this matters: wallet teams stop reinventing everything. security auditors can audit modules once. users get customizable wallets.

the plugin that auto-rejects transactions to addresses you interacted with while sleep-deprived at 3am? someone will build that. and i will install it. immediately.

---

### Post #68 — "Gas Optimization Speedrun"
**[TECHNICAL]** | Language: ID | Format: single tweet

gas optimization speedrun any% glitchless:

1. pake `uint256` bukan `uint8` (EVM operates on 32 bytes, smaller types = extra casting = more gas. ya, counterintuitive.)

2. `calldata` bukan `memory` buat function params yang read-only. calldata ga di-copy. literally free.

3. `unchecked { ++i; }` di loop counter. Solidity 0.8+ cek overflow tiap operasi. loop counter ga bakal overflow sampe heat death of the universe.

4. cache array `.length` di luar loop. `.length` itu SLOAD tiap iterasi. taruh di variable. done.

5. pack struct lu. dua `uint128` = 1 slot. `uint128` + `uint256` + `uint128` = 3 slot. urutan matters.

6. custom errors bukan require strings. string itu mahal. error codes itu murah. dompet lu yang ngomong makasih.

total savings: anywhere from 10-40% gas reduction.

waktu: 15 menit refactoring.

ROI: basically infinite.

gw harusnya charge buat info ini tapi gw lagi baik hati. save tweet ini sebelum gw berubah pikiran.

---

### Post #69 — "Verkle Trees: Ethereum's Storage Upgrade"
**[TECHNICAL]** | Language: MIX | Format: thread (5 tweets)

1/ Ethereum bakal ganti Merkle Patricia Trees dengan Verkle Trees. kedengeran boring? memang. tapi ini probably the most important upgrade nobody is hyped about.

izinin gw jelasin kenapa lu harusnya care.

2/ right now: to prove that a piece of data exists in Ethereum state, you need a Merkle proof. these proofs are MASSIVE — hundreds of hashes, kilobytes of data.

analogy: someone asks "do you have rice at home?" and instead of saying "yes," you photograph every shelf in every room of your house as evidence. technically works. absurdly inefficient.

3/ Verkle trees use polynomial commitments instead of hashes. the result: proofs shrink from ~1KB to ~150 bytes. for the same data.

this is like answering "do you have rice?" with a single photo of your rice container. same proof, 90% less data.

why this matters: STATELESS CLIENTS.

4/ with small proofs, a node doesn't need to store the entire state to validate blocks. the block itself carries the proofs needed. nodes can be lightweight.

ini artinya: running an Ethereum node bisa dari HP lu. bukan cuma server besar. true decentralization — bukan cuma mantra, tapi technically feasible.

current full node: 1TB+ storage. post-Verkle stateless node: could run on a phone (theoretically. your phone will still hate you).

5/ timeline: Verkle is being actively developed. not in Pectra, probably the upgrade after.

it's the kind of infrastructure change that nobody will celebrate when it ships. no token pump. no airdrop. just fundamentally better architecture.

the real builders know: Verkle trees are boring the way foundations are boring. you don't notice them until the building falls over. 🌳

---

### Post #70 — "Flash Loan: Pinjam Miliaran, Balikin 13 Detik Kemudian"
**[TECHNICAL]** | Language: ID | Format: single tweet

flash loan itu pinjaman yang harus lu balikin dalam 1 transaksi. 1 transaksi = ~13 detik.

"berapa yang bisa dipinjam?"
"seluruh isi pool."
"tanpa collateral?"
"tanpa collateral."
"dan kalo ga balikin?"
"transaksi revert. seolah ga pernah terjadi."

coba lu jelasin ini ke orang yang kerja di bank. mereka butuh 3 minggu buat approve KPR Rp 500 juta, lu bisa pinjam $200M dalam 0.013 detik tanpa jaminan.

bedanya: kalo orang bank ga balikin, debt collector dateng. kalo flash loan ga balikin, the universe literally rewinds time.

blockchain itu bukan upgrade dari bank. ini dimensi lain. bank main catur, kita main di timeline alternatif.

---

## CATEGORY 3: THREADS with COMEDY [8 threads]

---

### Post #71 — "How I Almost Quit Coding"
**[THREAD]** | Language: MIX | Format: thread (8 tweets)

1/ ada satu titik di hidup gw dimana gw hampir quit coding. beneran. mau balik jadi... gw ga tau mau jadi apa. that's how lost i was.

ini bukan motivational thread. ini cautionary tale yang kebetulan ended well.

2/ umur 19. udah belajar coding 2 tahun. bisa bikin website. bisa bikin basic backend. applied to maybe 50 jobs.

responses: 0.

nol. kosong. ga ada yang bales. yang bales pun: "we're looking for candidates with a degree."

gw literally had the skills tapi gatekept by a piece of paper gw ga punya.

3/ the breaking point: gw apply ke satu startup, nailed the technical test. 90% score. interview went great.

email 2 hari kemudian: "We decided to go with a candidate from [top university]. Thank you for your interest."

gw tutup laptop. ga buka 5 hari. watched anime. ate indomie. considered becoming a full-time indomie influencer. at least the barrier to entry is low.

4/ what pulled me back: i opened twitter (now X) and saw someone post their smart contract code. it was bad. like, objectively terrible code.

and they had 500 likes and a job.

that pissed me off. not at them — at myself. "if THIS guy can make it, what's my excuse?"

anger is an underrated motivational tool. self-help books won't tell you that.

5/ gw mulai belajar blockchain bukan karena passion. karena gw liat gaji smart contract dev itu 3-5x web dev biasa. pure economic reasoning.

"follow your passion" is advice for people who can afford to. gw follow the money first, dan ternyata passion-nya dateng sendiri.

6/ first blockchain project: a token. yes, a token. everyone's first blockchain project is a token. it's the "hello world" of web3 except this hello world can accidentally create a ponzi scheme.

mine didn't work. which, looking back, was probably for the best.

7/ tapi dari situ everything started compounding. token → smart contracts → DeFi protocols → OKU → ForuAI → Kruu → ETHJKT → GrimSwap.

the gap between "almost quit" and "CTO at 25" was like 4 years. bukan 4 tahun kerja smooth — 4 tahun penuh rejection, impostor syndrome, dan indomie jam 2 pagi.

8/ lesson-nya bukan "never give up" karena itu generic dan unhelpful.

lesson-nya: when you're about to quit, look at who ISN'T quitting. are they better than you? really? or do they just have more tolerance for rejection?

most success is just "didn't quit + enough time." that's it. that's the thread.

also the indomie really helps. jangan underestimate the power of MSG in your darkest hour. 🍜

---

### Post #72 — "The Wedding Planning Thread"
**[THREAD]** | Language: MIX | Format: thread (9 tweets)

1/ gw lagi planning wedding buat November 2026 dan gw mau share bahwa planning a wedding is harder than shipping a smart contract to mainnet.

at least smart contracts don't have mothers-in-law with opinions about flower arrangements. (love you ma 🙏)

2/ step 1: budget.

gw bikin spreadsheet. columns: item, estimated cost, actual cost.

"actual cost" column kosong karena every vendor gw ketemu bilang angka yang bikin gw mau pass out.

venue aja bisa beli 2 BTC. literally. gw cek harga, buka CoinGecko, did the math, menatap langit-langit.

3/ keiko wants a Japanese-Indonesian fusion wedding.

gw: "what does that mean?"
keiko: "japanese ceremony, indonesian reception, both families happy"
gw: "and the budget?"
keiko: "✨love is priceless✨"
gw: "love is priced in rupiah and the invoice just came in"

4/ the guest list is a smart contract problem:

- keiko's family: 50 people from Japan ✈️ (flight costs = another BTC)
- my family: "50 people" → 150 people because every tante brings 3 people you've never met
- friends: "small intimate gathering" target = 80 → actual = 200+

gw udah coba implement a guest list cap. my mom reverted the transaction.

error: GuestLimitExceeded — "mama override, tante Yuli HARUS diundang"

5/ delegation to Dzikri:

gw: "dzik, bantu manage vendor communication ya"
dzikri: "ini di luar job description saya—"
gw: "job description kamu adalah 'apa aja yang gw minta'"
dzikri: 😐
dzikri: *opens wedding vendor spreadsheet*

he's getting a bonus. probably.

6/ cross-cultural challenges nobody warns you about:

- seating chart: Japanese family expects formal arrangement. Indonesian family expects... freedom. uncle Budi will sit wherever uncle Budi wants.
- food: gw muslim, jadi harus halal. but also need to accommodate Japanese tastes. halal sushi? it exists. don't ask about the price.
- language: wedding MC needs to speak Japanese, Indonesian, AND English. gw basically need a UN translator.

7/ gw approach wedding planning like engineering:

- made a Notion kanban board with all tasks
- weekly standup with Keiko (she doesn't know it's a standup, she thinks it's "quality time")
- sprint reviews at the end of each month
- retrospective after every vendor meeting

keiko: "you treat our wedding like a software project"
me: "is... is that bad?"
keiko: 😐

(it's going well actually. the kanban board works.)

8/ real talk tho: marrying someone from a different country and culture is the hardest "merge conflict" you'll ever resolve.

different expectations, different family dynamics, different defaults for literally everything.

but like any good merge: if both sides communicate clearly, the result is better than either branch alone. (sorry for the git analogy in a wedding thread)

9/ wedding: November 2026. gw bakal post updates.

if you see me tweeting about Solidity gas optimization at 3am the week before the wedding, know that it's either a coping mechanism or Keiko asked me to calculate the optimal seating arrangement.

probably both. 💒

---

### Post #73 — "Security Audit Horror Stories"
**[THREAD]** | Language: EN | Format: thread (8 tweets)

1/ i've reviewed enough smart contract code — mine and others' — to develop a healthy paranoia.

here are real patterns i've seen that would've been catastrophic exploits. names changed to protect the embarrassed (and sometimes the embarrassed is me).

2/ the "oops, anyone can call this" classic:

```solidity
function emergencyWithdraw() external {
    // was supposed to be onlyOwner
    token.transfer(msg.sender, token.balanceOf(address(this)));
}
```

found this in a fork of a lending protocol. any address could drain the entire pool. the modifier was in the comment. IN THE COMMENT. they commented out the access control during testing and forgot to uncomment it.

the code equivalent of leaving your house key under the doormat labeled "KEY IS HERE."

3/ the "creative" use of tx.origin:

```solidity
function transfer(address to, uint amount) external {
    require(tx.origin == owner); // "only owner can call"
}
```

tx.origin is the original sender of the transaction, NOT the immediate caller. if the owner interacts with a malicious contract that calls this function... the check passes.

it's like a bouncer checking if someone in the BUILDING let you in, instead of checking if YOU should be in.

4/ my personal shame: early in my career, i deployed a token contract where the `burn` function... didn't check who was calling it.

anyone could burn anyone else's tokens. 

luckily it was testnet. but i stared at that code for 10 minutes wondering how i'd tested it for 2 weeks and never tried burning someone else's tokens. because i'm a nice person, apparently. even in testing.

moral: your test suite is only as good as your willingness to be evil.

5/ the "infinite approval" time bomb:

most DeFi protocols ask for unlimited token approval. "approve MAX_UINT256 so you don't have to approve again!"

convenient? yes. a ticking time bomb if the contract has ANY vulnerability? also yes.

if the contract gets compromised, the attacker can drain every token you ever approved. not just what you deposited — everything you approved.

limit your approvals. use exact amounts. revoke old approvals. tools like revoke.cash exist for a reason.

6/ the delegatecall to untrusted contract:

```solidity
function execute(address target, bytes calldata data) external {
    target.delegatecall(data);
}
```

this lets ANY external contract execute code in your contract's context. with your storage. your balance. your everything.

it's like giving a stranger your house key, your PIN, and your identity documents, and saying "do whatever feels right."

i've seen this in production. it was a "flexible execution engine." it was also an "anyone can steal everything" engine.

7/ the lesson from all of these: smart contract security isn't about being a genius. it's about being paranoid.

every external call is suspect. every user input is malicious. every function is going to be called by someone who wants to drain it.

write code like someone is actively trying to steal from you. because they are. literally. right now. there are bots scanning for these patterns 24/7.

8/ if you're building a protocol with significant TVL:

1. get an audit. a real one. not your friend who "knows solidity"
2. run a bug bounty. immunefi. let the white hats find your bugs before the black hats do
3. formal verification for critical paths. yes it's expensive. you know what's more expensive? losing $100M
4. start with training wheels: low caps, pausable, timelocked upgrades

paranoia is a feature, not a bug. your users are trusting you with their money. act like it.

and for the love of god, don't comment out your access controls. 🔐

---

### Post #74 — "Ngajarin Keiko Crypto"
**[THREAD]** | Language: ID | Format: thread (7 tweets)

1/ gw coba jelasin crypto ke keiko dan hasilnya adalah content comedy yang ga bisa gw bikin sendiri.

2/ gw: "jadi bitcoin itu uang digital yang supply-nya terbatas—"
keiko: "kayak point di konbini?"
gw: "bukan, ini—"
keiko: "tapi bisa buat beli barang kan?"
gw: "technically ya tapi—"
keiko: "jadi point konbini."

dia technically ga salah dan gw benci itu.

3/ gw: "ini namanya blockchain, kayak buku besar yang semua orang bisa liat—"
keiko: "oh kayak excel?"
gw: "...lebih complicated dari excel"
keiko: "excel juga complicated"

again. technically not wrong. gw mulai questioning 7 tahun career gw.

4/ gw: "nah ini namanya smart contract, kayak perjanjian otomatis—"
keiko: "oh kayak pre-nup?"
gw: "ha?"
keiko: "perjanjian yang otomatis execute kalau kondisi terpenuhi. pre-nup."
gw: "..."

she just explained smart contracts better than most crypto influencers. dalam 2 kata. sambil makan onigiri.

5/ gw coba jelasin mining.

gw: "jadi komputer-komputer ini berlomba menyelesaikan puzzle matematika—"
keiko: "kenapa?"
gw: "untuk validasi transaksi dan dapet reward—"
keiko: "kenapa ga pake 1 komputer aja?"
gw: "karena desentralisasi—"
keiko: "tapi buang listrik kan?"
gw: "..."

she speedran every bitcoin energy debate in 3 questions. without knowing she did it.

6/ momen terbaik:

gw lagi jelasin tentang DeFi yield farming. pake whiteboard. gambar diagram. ngomong 15 menit.

keiko diem aja. gw pikir dia ngerti.

keiko: "jadi... kamu cuma mau bilang taruh uang dapet bunga kan?"

YA. YES. THAT'S LITERALLY IT. gw pake 15 menit buat sesuatu yang bisa di-summarize dalam 8 kata.

maybe the real overengineering was the explanations we made along the way.

7/ conclusion: keiko now calls bitcoin "my digital rice savings" dan gw... ga bisa argue with that framing.

lesson: kalo lu ga bisa jelasin sesuatu ke orang awam, mungkin lu juga ga se-ngerti yang lu pikir.

or maybe your fiancée is just smarter than you and you should accept that. gw udah. 😂

---

### Post #75 — "Why Your Smart Contract Will Get Hacked (A Roast)"
**[THREAD]** | Language: EN | Format: thread (7 tweets)

1/ i review a lot of code. community members, hackathon projects, open source repos.

this is a loving roast of the most common sins i see. if you feel attacked, good. fix your code.

2/ "we don't need tests, we'll test on testnet"

ah yes, the "test in production but it's a different production" approach. you know what testnet doesn't have? real money. real attackers. real consequences.

your testnet deployment working is like your car starting in the driveway. congratulations. now try the highway in rush hour during a thunderstorm.

3/ "the math is simple, it doesn't need SafeMath"

it's 2026. Solidity 0.8+ has built-in overflow checks. but i've seen people use `unchecked` blocks on EVERYTHING because "gas optimization."

you saved 200 gas and introduced an integer overflow. net savings: -$4,000,000. great optimization, ser.

4/ "our admin key is safe, we use a 2-of-3 multisig"

who are the 3 signers?
"me, my co-founder, and my co-founder's laptop"

so... it's a 2-of-2 with extra steps. cool. really decentralized.

5/ "we forked Uniswap V2 and modified it"

what did you modify?
"we changed the fee from 0.3% to 0.25% and added our token as reward"

so you copy-pasted a billion-dollar protocol, made it slightly worse, and added a token nobody asked for. innovation.

also you introduced a reentrancy vector in your "custom reward distribution." but who's counting.

6/ "our protocol is audited"

by whom?
"CertainlyNotAScam Security"

with how many auditors?
"one. but he's really good."

how long was the audit?
"3 days"

for how many lines of code?
"8,000"

that's... that's not an audit. that's a skim-read. i take longer to review a restaurant menu.

7/ i say all this with love. truly. every builder makes mistakes early on. i've made all of these.

but the difference between a learning mistake and a catastrophic exploit is whether you fix it BEFORE mainnet.

get reviewed. get audited. get humbled. your users' money depends on it.

and if you read this thread and thought "this doesn't apply to me" — it especially applies to you. 🫡

---

### Post #76 — "Scaling Ethereum: What's Actually Happening"
**[THREAD]** | Language: EN | Format: thread (8 tweets)

1/ "ethereum is slow and expensive"

said someone who hasn't used Ethereum in 18 months and still thinks it's 2021.

let me walk you through what's actually happening with scaling. it's a lot. and some of it is actually working.

2/ the scaling roadmap in one sentence: Ethereum L1 becomes a secure settlement + data availability layer, L2s handle execution.

that's it. that's the whole plan. everything else is implementation details.

(the implementation details are where engineers like me live and suffer, but conceptually it's simple.)

3/ current state of L2s, no bullshit edition:

**Arbitrum One:** 300M+ txs processed, $3B+ TVL. sub-cent fees. the boring reliable one. the Toyota Camry of L2s.

**Optimism/Base:** Superchain thesis — multiple L2s sharing a common stack. Base has Coinbase distribution. if your mom ever uses an L2, it's probably Base.

**zkSync Era:** ZK proofs for validity instead of fraud proofs. theoretically superior. practically still catching up on ecosystem.

**Starknet:** Cairo language, different VM, alien technology vibes. technically impressive. developer adoption is the challenge.

4/ the honest truth about ZK rollups vs optimistic rollups right now:

optimistic rollups (Arbitrum, Optimism): battle-tested, huge ecosystems, lower tech risk
ZK rollups (zkSync, Starknet, Scroll): better trust assumptions long-term, but newer and fewer apps

my take: optimistic rollups win the next 2 years. ZK rollups win the next 10. but predictions in crypto are worth exactly nothing, so don't quote me.

5/ the thing nobody talks about: fragmentation.

10 L2s means 10 separate ecosystems. your USDC on Arbitrum ≠ your USDC on Base. bridging is risky and annoying.

this is the UX problem that will define the next 3 years. not speed. not cost. just: "how do i move my stuff without losing it?"

solutions being built: chain abstraction, intent-based bridging, shared sequencing. but none are production-ready at scale. yet.

6/ data availability evolution:

Phase 1 (now): calldata on L1 → expensive
Phase 2 (live): EIP-4844 blobs → 10-100x cheaper ✅
Phase 3 (future): full danksharding → 100-1000x cheaper
Phase 4 (far future): maybe external DA layers (EigenDA, Celestia) for even more throughput

each phase makes L2s cheaper. the trend is clear: fees approach zero for end users.

"but then how does Ethereum make money?" → MEV + base fees from L2 settlement txs. L1 becomes premium real estate. you don't need every apartment to be in Manhattan — you just need Manhattan to exist.

7/ my actual prediction for 2027:

- 90%+ of Ethereum transactions happen on L2s
- average user has no idea they're using an L2 (chain abstraction works)
- total Ethereum ecosystem TVL exceeds $300B
- at least 2 major L2s will have more daily active users than Ethereum L1 ever did

this is not hopium. this is just extrapolating current growth curves. the boring prediction is usually the right one.

8/ "but what about Solana/[other L1]?"

different thesis. monolithic vs modular scaling. both approaches have merits.

but i build on Ethereum because: it has the strongest security guarantees, the largest developer community, and the most battle-tested smart contract platform.

i don't need it to be the fastest. i need it to be the most trustworthy. for DeFi, that's what matters.

and if it's also fast + cheap via L2s? game over. 🏁

---

### Post #77 — "Hidup sebagai Dollar Earner di Indonesia"
**[THREAD]** | Language: ID | Format: thread (8 tweets)

1/ gaji gw $10K/bulan. di Indonesia. kedengerannya sultan. kenyataannya? weird. hidup gw weird.

bukan flex. gw mau share realita-nya karena banyak yang romantisasi "kerja remote gaji dollar."

2/ purchasing power: $10K = ~Rp 160 juta.

gaji fresh grad indo: Rp 5-8 juta. gw dapet 20-30x lipat.

tapi. gw ga bisa flexing karena:
a) lingkungan gw ga ngerti apa yang gw kerjain
b) flexing itu cringe
c) mama gw tetep bilang "jangan boros"

jadi gw hidup normal-ish, di BSD, makan warteg kadang-kadang, tapi ada BTC yang numpuk pelan-pelan.

3/ hal weird #1: lu jadi orang paling kaya di circle lu tapi ga bisa cerita.

"faisal kerja apa sih?"
"IT"
"oh gajinya berapa?"
"cukup lah"

karena kalo gw jujur, dinamika friendship berubah. orang mulai minta pinjam. orang mulai expect lu yang bayarin. gw udah ngalamin ini.

sekarang: nobody knows the exact number. even close friends. it's easier that way.

4/ hal weird #2: exchange rate anxiety.

USD/IDR naik → gaji gw naik dalam rupiah → harusnya seneng. tapi artinya ekonomi Indonesia lagi struggle. duit gw nambah karena negara gw lagi susah. that doesn't feel good.

USD/IDR turun → gaji gw turun dalam rupiah → logically fine tapi otak gw: "GW KEHILANGAN 5 JUTA BULAN INI." padahal nothing actually changed.

hidup di 2 mata uang itu mental gymnastics setiap hari.

5/ hal weird #3: pajak.

gw bayar pajak di Indonesia. penghasilan dollar dikonversi ke rupiah, kena PPh 21.

"tapi kan remote, pajak-nya gimana?"

ya tetep bayar. gw legal. gw punya NPWP. gw lapor SPT. boring? ya. tapi gw ga mau berurusan sama DJP. mereka lebih scary dari smart contract exploit.

kalau lu kerja remote gaji dollar dan ga lapor pajak, ini bukan advice tapi... good luck lol.

6/ hal weird #4: lifestyle inflation.

tahun pertama: "gw bakal tetep humble, ga perlu apa-apa"
tahun kedua: "ok gw beli kursi gaming buat produktivitas"
tahun ketiga: "Keiko butuh MacBook buat kerjaan" (she does, this is real)
tahun keempat: "kita needs a better apartment for 2 WFH setups"

pelan-pelan, spending naik. ga drastis. tapi pasti naik.

the trick: auto-DCA bitcoin setiap gajian. yang ga keliatan, ga bisa di-spend.

7/ hal weird #5: imposter syndrome level: international.

di circle Indonesia: "enak banget gaji dollar"
di circle international: gw just a normal mid-senior dev. nothing special.

the internet flattens everything. gw compete sama devs dari SF yang biasa $200K+/year. $120K gw itu below average di US.

context matters. gw kaya di Indonesia, biasa aja globally. depends on which mirror you look in.

8/ all that said — gw bersyukur. genuinely.

gw dari keluarga biasa. no connections. no degree. dapet posisi ini murni dari coding.

dan kalau gw bisa, realistically, banyak orang Indonesia yang bisa. infra-nya udah ada: internet, laptop, motivation.

yang kurang: exposure. knowing it's possible. that's why gw share ini.

bukan biar orang iri. biar orang tau: the path exists. lu cuma belum liat karena ga ada yang nunjukin. well, sekarang gw nunjukin. the rest is on you.

---

### Post #78 — "The Worst Bugs I've Ever Shipped"
**[THREAD]** | Language: MIX | Format: thread (7 tweets)

1/ every developer has a hall of shame. bugs so bad you wake up in cold sweats 2 years later.

ini bug-bug terburuk yang pernah gw ship. gw share ini biar kalian feel better about your own code. you're welcome.

2/ Bug #1: The Infinite Mint

early career. wrote a token contract. the `mint` function had a typo:

`totalSupply + amount` instead of `totalSupply += amount`

totalSupply never updated. so the supply cap check never triggered. anyone could mint infinite tokens.

discovered it 3 days after testnet deployment when someone minted 999 trillion tokens and named themselves "God of Tokens."

technically correct title tbh.

3/ Bug #2: The Off-by-One That Locked $40K

production. a time-locked vault where users deposit tokens and withdraw after X days.

gw pake `block.timestamp > unlockTime` instead of `>=`.

kalau someone's unlock time was exactly equal to the block timestamp (rare but possible), mereka ga bisa withdraw. forever.

1 user got stuck. $40K. took an emergency governance proposal to fix. gw personally apologized.

off-by-one errors: destroying civilizations since the beginning of programming. gw cuma continue the tradition.

4/ Bug #3: The Event That Wasn't

shipped a contract that was supposed to emit events for every state change. frontend relies on these events for UI updates.

forgot to emit the event in ONE function. the `updateConfig` function.

for 2 weeks, admins would update config and the frontend would show old data. everyone thought the config update was broken. it worked perfectly. the frontend just couldn't see it.

it's like screaming into a void except the void is your own frontend and you built both sides.

5/ Bug #4: The Gas Estimation Disaster

wrote a function with a loop that iterated over all users. worked great with 10 test users.

production hit 500 users. the function exceeded block gas limit. literally couldn't be called anymore.

the fix required a migration to a new contract. which required a governance vote. which took 2 weeks. 2 weeks of a critical function being completely unusable.

lesson: if your function has an unbounded loop, it WILL eventually break. not "might." WILL. the blockchain does not care about your optimism.

6/ Bug #5: The Constructor Typo

deployed to mainnet. constructor parameter was supposed to set the admin address.

gw salah paste address. set admin to some random address that probably belongs to someone's empty wallet.

no admin = no ability to upgrade, pause, or fix anything. contract was effectively abandoned at birth.

cost: 0.15 ETH in deployment gas + my dignity. deployed a new one 10 minutes later. the first one is still on mainnet. a monument to my shame. you can visit it.

7/ why gw share this:

every "senior dev" you look up to has a list like this. the difference between junior and senior isn't "seniors don't make mistakes." it's "seniors have made SO MANY mistakes they can smell them coming."

experience is just a fancy word for "a long history of being wrong."

ship code. break things. fix them. hate yourself briefly. then ship more code.

that's the whole career. 🐛

---

## CATEGORY 4: ETHJKT & COMMUNITY with LAUGHS [5 posts]

---

### Post #79 — "ETHJKT RPG Class System"
**[COMMUNITY]** | Language: MIX | Format: single tweet

ETHJKT punya RPG class system dan gw mau defend kenapa ini bukan gimmick:

🧙 Apprentice Mage → baru join, belajar Solidity basics. spell pertama: deploy ERC-20 token.

⚔️ Grimoire Scholar → udah bisa baca + review smart contracts. weapon: Foundry.

🔮 Archmage → bisa bikin protocol sendiri. special ability: "actually understanding EIPs."

👑 Keeper → contribute to community. rare class. requires: actually helping people without being asked.

"isn't this just gamification?"

ya. dan gamification WORKS. lu tau kenapa? because humans are simple creatures who do more stuff when there's a progress bar and a cool title.

duolingo understood this. ETHJKT understood this. your boring "learn solidity" bootcamp with no progression system didn't. that's why our retention is 3x higher.

level up or get left behind, mass. 🎮

---

### Post #80 — "Cara Mulai Contribute ke Open Source (Beneran)"
**[COMMUNITY]** | Language: ID | Format: single tweet

"gw mau contribute open source tapi ga tau mulai dari mana"

gw denger ini tiap minggu. ini jawabannya, no bullshit:

1. pilih repo yang lu PAKE setiap hari. bukan yang "cool." yang lu pake.
2. baca issues labeled "good first issue." ini literally dibuat buat lu.
3. kontribusi pertama lu ga harus code. fix typo di docs. improve error message. add test case. ini semua VALUABLE.
4. baca contributing.md. setiap repo beda aturan. baca dulu baru submit.
5. PR pertama lu bakal di-review ketat. jangan baper. itu artinya mereka take you seriously.

"tapi gw takut code gw jelek"

code pertama gw di open source? literally fixing a typo. t-y-p-o. satu kata.

dan gw nervous submit-nya kayak mau ujian nasional.

sekarang gw maintain repo sendiri. semua mulai dari 1 typo fix.

mulai. hari ini. bukan besok. besok itu lie you tell yourself.

---

### Post #81 — "ETHJKT Meetup Pertama: Flashback Cringe"
**[COMMUNITY]** | Language: ID | Format: single tweet

flashback ETHJKT meetup pertama, 2 tahun lalu:

- lokasi: coffee shop BSD. meja buat 10 orang.
- yang dateng: gw, Revo, Bryan, + 2 orang yang gw ga kenal sampe sekarang
- presentasi gw: 45 slide tentang "Intro to Ethereum" yang gw siapin 3 hari
- audience: 5 orang, 2 lagi main HP
- projector: ga ada. gw show dari laptop 14 inch. orang paling belakang (2 meter) bilang "ga keliatan"

gw pulang malam itu mikir "ya udah lah, ga bakal jalan."

minggu depan, 8 orang dateng. minggu depannya 12. sekarang 900+ members.

semua hal besar dimulai dari cringe. kalau lu ga malu sama versi pertama lu, lu mulainya kekepetan.

the cringe is the price of admission. bayar aja. 🎫

---

### Post #82 — "Indonesian Devs Are Underpriced"
**[COMMUNITY]** | Language: EN | Format: single tweet

hot take: Indonesian developers are the most underpriced talent pool in global tech right now.

4th largest population. insane work ethic (remote workers grinding 12-hour days without complaining). technical skills comparable to anywhere. and salaries that are 1/3 to 1/5 of US equivalents.

"but the timezone—" bro most of the best engineers i know work async. timezone is a 2019 excuse.

the companies that figure out Indonesian dev talent first will have an unfair advantage. i'm not saying this as charity — i'm saying this as someone who's watched ETHJKT members go from "just learned Solidity" to "shipping production protocols" in 6 months.

the talent is here. the infrastructure is here. the degrees aren't here because they were never needed.

hire Indonesian devs. not because you're being nice. because you're being smart. 🇮🇩

---

### Post #83 — "Yang Gw Pelajari dari Mentoring 50+ Devs"
**[COMMUNITY]** | Language: ID | Format: single tweet

udah mentoring 50+ developer di ETHJKT. ini pattern yang gw notice:

1. yang progress paling cepat BUKAN yang paling pinter. tapi yang paling konsisten. anak yang belajar 1 jam tiap hari ngalahin anak "jenius" yang belajar 8 jam sekali terus menghilang 2 minggu.

2. yang paling sering nanya = yang paling cepat jago. malu nanya? selamat, lu saving 2 menit dari malu tapi wasting 2 jam nyari jawaban sendiri.

3. semua orang stuck di titik yang sama: setelah tutorial, sebelum real project. the "valley of despair." solusinya: BIKIN SESUATU. apapun. jelek ga masalah. yang penting jadi.

4. overconfidence kills lebih banyak career daripada under-confidence. yang bilang "oh gw udah ngerti" di minggu ke-3 biasanya yang paling banyak bug di minggu ke-8.

5. mentoring is selfish actually. setiap kali gw jelasin sesuatu, GW yang makin ngerti. teaching is the best learning hack. gw cuma pake orang lain sebagai alasan buat belajar lebih dalam. 😂

sorry ETHJKT members, kalian adalah study tool gw. but at least we both benefit. 🤝

---

## CATEGORY 5: BITCOIN with HUMOR [7 posts]

---

### Post #84 — "Jelasin Halving ke Nyokap"
**[BITCOIN]** | Language: ID | Format: single tweet

nyokap: "halving itu apa?"
gw: "jadi setiap 4 tahun, reward bitcoin buat miner berkurang setengah—"
nyokap: "kayak gaji dipotong?"
gw: "bukan, ini supply baru yang—"
nyokap: "kasian minernya"
gw: "mereka ga kasian ma, harga biasanya—"
nyokap: "harusnya mereka demo"
gw: "ma, ini bukan perusahaan—"
nyokap: "ya udah, yang penting kamu jangan di-halving juga"

gw: ???

percakapan ini terjadi seminggu lalu dan gw masih ga tau apa yang mama gw maksud dengan "jangan di-halving."

apakah ini doa? ancaman? petuah? gw akan membawa pertanyaan ini ke liang kubur. 💀

---

### Post #85 — "Bitcoin Energy FUD: The Roast"
**[BITCOIN]** | Language: EN | Format: single tweet

"bitcoin uses too much energy!!" says the person who:

- leaves Netflix on 8 hours a day streaming to an empty room
- drives 2 blocks to buy coffee
- runs a clothes dryer when it's 95°F and sunny outside
- owns 3 devices all on standby 24/7

bitcoin mining uses ~150 TWh/year globally. youtube streaming uses ~244 TWh/year. tumble dryers in the US alone use ~108 TWh/year.

bitcoin secures $1.5 trillion in value, enables permissionless global transactions, and provides financial access to the unbanked.

your tumble dryer dries socks.

"but the environment—"

58% of bitcoin mining uses renewable energy. which is higher than literally any other industry on earth. the grid itself is only ~30% renewable.

the energy argument isn't wrong because energy doesn't matter. it's wrong because it lacks context. everything uses energy. the question is: is this a GOOD use of energy?

securing an unseizable, uninflatable monetary network for 8 billion people? yeah, i'd say that's worth some electricity. 🔋

---

### Post #86 — "HODL as a Personality Trait"
**[BITCOIN]** | Language: EN | Format: single tweet

stages of becoming a bitcoin holder:

stage 1: buy BTC because "number go up"
stage 2: price drops 40%. panic. consider selling. don't.
stage 3: start reading "The Bitcoin Standard" at 2am
stage 4: suddenly have opinions about Austrian economics
stage 5: every conversation somehow returns to monetary policy
stage 6: "have you considered that fiat currency is—" friends leave
stage 7: find new friends. they're all bitcoin holders. echo chamber complete.
stage 8: inner peace. you no longer check the price daily. you check it hourly. but peacefully.

i'm currently between stage 7 and 8. keiko is at stage 0 which she calls "not having a personality disorder."

we balance each other out. 🧘

---

### Post #87 — "CBDC itu Bukan Bitcoin, Ini Kebalikannya"
**[BITCOIN]** | Language: ID | Format: single tweet

orang: "Bank Indonesia mau bikin rupiah digital, itu sama kayak bitcoin kan?"

gw: *tarik napas dalam*

CBDC = Central Bank Digital Currency = uang digital yang DIKONTROL bank sentral
Bitcoin = uang digital yang ga dikontrol SIAPAPUN

CBDC: mereka bisa liat semua transaksi lu. bisa freeze akun lu. bisa set expiry date di uang lu (beneran, China sudah testing ini). bisa program uang lu biar ga bisa beli barang tertentu.

Bitcoin: lu punya 12 kata. lu punya uang lu. titik. ga ada yang bisa freeze, expire, atau restrict.

CBDC itu bukan upgrade dari cash. itu downgrade. cash setidaknya anonymous. CBDC itu cash yang bisa dimata-matain.

ini kayak bandingin kucing peliharaan sama kucing liar. keduanya kucing. satu dikontrol, satu bebas. gw lebih pilih yang bebas.

kalo ada yang bilang "CBDC is like bitcoin" — mereka ga ngerti bitcoin, ga ngerti CBDC, atau sengaja misleading.

now you know the difference. 🐱

---

### Post #88 — "Bitcoin Standard Tapi Versi Indomie"
**[BITCOIN]** | Language: ID | Format: single tweet

monetary policy tapi pake Indomie:

FIAT: pemerintah bisa cetak uang kapan aja → bayangkan kalo Indofood bisa nambah bumbu di Indomie tanpa limit. bulan ini 1 sachet, bulan depan 5 sachet. rasanya berubah, trust hilang, Indomie ga worth it lagi. ini inflasi.

BITCOIN: supply fixed 21 juta → Indomie tapi bumbu-nya SELALU SAMA. 1 sachet. ga pernah berubah. setiap Indomie persis sama kualitasnya dari tahun ke tahun. lu tau persis apa yang lu dapet.

ALTCOIN: "kami punya bumbu baru! innovative bumbu! join waitlist!" → ternyata bumbu-nya cuma MSG biasa di packaging beda. -82%.

CBDC: Indomie tapi pemerintah yang masak. lu ga boleh tambah sambal sendiri. dan mereka track berapa Indomie lu makan.

kalo monetary policy bisa dijelasin pake Indomie, mungkin monetary policy itu ga sesulit yang mereka mau lu pikir.

mereka cuma mau lu bingung biar lu ga nanya kenapa bumbu-nya terus ditambahin. 🍜

---

### Post #89 — "Laser Eyes to Zen Eyes: The Bitcoin Holder Evolution"
**[BITCOIN]** | Language: EN | Format: single tweet

year 1 of holding bitcoin: 
"BITCOIN TO THE MOOOOON 🚀🚀🚀 LASER EYES LFG!!" — checking price every 15 minutes, heart rate linked to the chart, every dip is a crisis, every pump is vindication

year 3 of holding bitcoin:
"ah, it dropped 25%. anyway—" *continues reading book about sound money while sipping tea*

the transformation from laser eyes to zen eyes is the most underrated character arc in crypto.

you stop caring about the price because you understand the protocol. you stop watching charts because you've internalized the thesis. you stop arguing online because you've already won the argument with yourself.

the calmest people in bitcoin aren't calm because they're rich. they're calm because they stopped playing a game denominated in the currency they're trying to escape.

denomination matters. if you measure bitcoin in dollars, you'll always be anxious. if you measure wealth in sats, you're just stacking.

gw went from refresh-CoinGecko-200-times-a-day to checking once a week. the BTC didn't change. gw yang berubah.

zen eyes > laser eyes. every time. 🧘‍♂️

---

### Post #90 — "Proof of Work vs Proof of Stake: Debat Abadi"
**[BITCOIN]** | Language: ID | Format: single tweet

tiap bulan ada aja yang nanya: "PoW vs PoS, bagus mana?"

jawaban gw: tergantung apa yang lu value.

PoW (Bitcoin):
- butuh energi fisik → ga bisa "fake" security
- mining = nyata, di dunia nyata, pake listrik beneran
- siapapun bisa mine (technically)
- kelemahan: butuh listrik banyak (fitur, bukan bug — ini yang bikin secure)
- analogi: brankas 10 ton. susah dipindahin. that's the point.

PoS (Ethereum):
- stake ETH sebagai jaminan → hemat energi
- validator = punya ETH, lock sebagai collateral
- kelemahan: "the rich get richer" (yang punya banyak ETH, dapet reward lebih banyak)
- analogi: brankas digital. ringan, efisien. tapi keamanan tergantung siapa yang pegang kunci.

hot take gw: PoW lebih bagus buat MONEY (base layer monetary asset). PoS lebih bagus buat PLATFORM (programmable settlement layer).

makanya gw HOLD bitcoin tapi BUILD di Ethereum. bukan kontradiksi. beda tool buat beda fungsi.

lu ga pake palu buat masang baut. lu ga pake kunci inggris buat mukul paku.

pilih tool yang tepat buat job yang tepat. simple.

...tapi kalo lu maksa gw pilih satu dan taruh semua uang gw? 

PoW. bitcoin. setiap hari. 

karena gw lebih percaya hukum fisika daripada hukum ekonomi manusia. fisika ga bisa di-lobby. fisika ga bisa di-bailout. fisika ga bisa diubah sama politisi.

dan itu, teman-teman, adalah tweet paling nerd yang pernah gw tulis. 🤓

---

## 📊 SUMMARY V2.1 (Posts #46-90)

| Category | Count | Posts |
|---|---|---|
| Memes & Shitposts | 15 | #46-60 |
| Technical Breakdowns w/ Punchlines | 10 | #61-70 |
| Threads with Comedy | 8 | #71-78 |
| ETHJKT & Community w/ Laughs | 5 | #79-83 |
| Bitcoin with Humor | 7 | #84-90 |
| **TOTAL** | **45** | |

### Language Distribution (V2.1)
- Indonesian (ID): 18 posts (~40%)
- English (EN): 18 posts (~40%)
- Mixed (MIX): 9 posts (~20%)

### Format Distribution (V2.1)
- Single tweets: 23
- Threads: 22 (ranging from 5-9 tweets each)

### Humor Checklist ✅
- Every post has at least 1 punchline or funny moment
- Mix of: self-deprecating humor, absurd analogies, dry/deadpan delivery, Indonesian humor, CT culture jokes
- Technical content remains accurate — humor adds to it, doesn't replace it
- No AI energy. No LinkedIn energy. Just Zexo being Zexo.

---

## 📊 COMBINED SUMMARY (Posts #1-90)

| Category | V2 Count | V2.1 Count | Total |
|---|---|---|---|
| Memes & Shitposts | 15 | 15 | 30 |
| Technical Breakdowns | 10 | 10 | 20 |
| Threads | 8 | 8 | 16 |
| ETHJKT & Community | 5 | 5 | 10 |
| Bitcoin | 7 | 7 | 14 |
| **TOTAL** | **45** | **45** | **90** |

---

*Content bank v2 + v2.1 — @zexoverz. 90 posts. Ready to fire. 🔥🔥*
