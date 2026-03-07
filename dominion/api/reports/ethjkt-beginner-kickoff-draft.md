# 🎤 ETHJKT Web3 Beginner Kickoff — Speaking Draft

*Event: Web3 Beginner Kickoff: Your First Step to Building*
*Platform: Discord Voice — Magic Temple*
*Speaker: Faisal (Zexo)*
*Duration: ~45-60 menit*

---

## 1. OPENING (5 menit)

Assalamualaikum, selamat malam semuanya! Welcome to ETHJKT Web3 Beginner Kickoff.

Gw Faisal, founder ETHJKT. Buat yang baru join — ETHJKT itu komunitas developer Web3 terbesar di Indonesia. Kita mulai dari 12 orang di coffee shop Jakarta, sekarang udah 900+ members.

Malam ini kita bakal bahas 3 hal:
1. **Update terbaru Ethereum ecosystem** — biar kalian tau landscape-nya sekarang kayak gimana
2. **Roadmap belajar Web3 untuk pemula** — step by step, dari nol
3. **Registrasi Co-Learning Camp #8** bareng HackQuest — kesempatan belajar intensif 2 minggu

Ini session khusus buat yang masih newbie di Web3 ya. Kalau kalian Keeper atau Archmage yang udah advance, boleh stay untuk nemenin adek-adeknya, tapi materinya memang fokus dasar.

Let's go. 🚀

---

## 2. ETHEREUM ECOSYSTEM UPDATE (15 menit)

*"Sebelum kalian belajar build di Ethereum, kalian harus tau dulu Ethereum itu lagi di fase apa."*

### 2a. Pectra Upgrade (Q1 2026)

Ethereum baru aja ngalamin upgrade besar namanya **Pectra**. Ini beberapa perubahan penting:

- **EIP-7702 — Account Abstraction untuk EOA kalian**
  - Dulu: wallet kalian (EOA) itu "bodoh" — cuma bisa sign transaksi, that's it
  - Sekarang: wallet kalian bisa sementara jalanin smart contract code
  - Artinya? Batch transaksi (approve + swap dalam 1 klik), gasless transaction (orang lain bayarin gas lu), recovery mechanism
  - Ini ngubah UX Ethereum secara fundamental. Wallet jadi lebih kayak app, bukan cuma address

- **EIP-7691 — Lebih banyak blob space buat L2**
  - L2 (Arbitrum, Optimism, Base) jadi lebih murah lagi
  - Fee transaksi di L2 sekarang bisa di bawah $0.001

- **EIP-7708 — ETH transfer sekarang emit logs**
  - Kedengeran boring, tapi ini penting: sekarang ETH transfer bisa di-track sama kayak ERC-20 token
  - Buat kalian yang nanti bikin indexer atau block explorer, ini game changer

### 2b. Straw Man Proposal & Apa yang Akan Datang

Vitalik baru aja share proposal tentang **EIP-8141 — Frame Transactions**. Ini evolusi berikutnya dari Account Abstraction:

- Satu transaksi bisa punya N "frame" (langkah-langkah)
- Native gas payment pakai token apapun — tanpa perantara
- **ZK privacy natively di mempool** — ini yang paling exciting
- Bayangkan: privacy protocol kayak Tornado Cash atau Railgun, tapi ga butuh broadcaster terpisah. Langsung submit ke mempool biasa.

### 2c. Quantum Resistance

Ethereum juga udah mulai persiapan untuk **quantum computing**:
- Quantum computer bisa break signature scheme yang dipakai sekarang (ECDSA)
- Solusi: migrasi ke signature scheme yang quantum-resistant (lattice-based, hash-based)
- EIP-8141 juga accommodate ini — account bisa pakai custom signature scheme
- Timeline masih panjang, tapi Ethereum udah prepare dari sekarang

### 2d. The Big Picture

Intinya: Ethereum di 2026 itu beda jauh sama Ethereum 2 tahun lalu.
- UX makin bagus (Account Abstraction)
- Fee makin murah (L2 + blobs)
- Privacy makin feasible (ZK + protocol-level support)
- Future-proof (quantum resistance)

**Ini kenapa belajar Ethereum sekarang itu timing yang tepat.** Ecosystem-nya mature, tooling-nya bagus, dan demand buat developer tinggi banget.

---

## 3. ROADMAP BELAJAR WEB3 UNTUK PEMULA (10 menit)

*"Oke, sekarang gimana caranya mulai?"*

Gw ga mau bikin ini complicated. Ini step-by-step yang gw rekomendasiin:

### Step 1: JavaScript Fundamentals (2-4 minggu)
- Kalau belum bisa coding sama sekali, mulai dari sini
- Variable, loop, function, array, object
- ETHJKT punya Phase 0 curriculum yang lengkap

### Step 2: Pahami Blockchain Basics (1 minggu)
- Apa itu blockchain, consensus, wallet, transaction
- Install MetaMask, coba kirim testnet ETH
- Baca: ethereum.org/en/developers/docs/

### Step 3: Solidity — Smart Contract Pertama (2-3 minggu)
- Belajar Solidity dari dasar
- Deploy contract pertama ke testnet
- Tools: Remix IDE dulu, nanti pindah ke Foundry/Hardhat

### Step 4: Build Full dApp (2-3 minggu)
- Connect frontend (React) ke smart contract
- Belajar ethers.js / viem + wagmi
- Deploy project pertama ke testnet

### Step 5: Go Deeper
- DeFi mechanics (AMM, lending, staking)
- Security (reentrancy, flash loan attacks)
- Advanced patterns (proxy, diamond, modular accounts)

**Total dari nol sampe bisa deploy dApp: sekitar 2-3 bulan kalau konsisten.**

Gw udah compile semua resources terbaik di roadmap GitHub kita. Nanti gw share link-nya.

---

## 4. CLOSING — CO-LEARNING CAMP #8 (10 menit)

Nah, buat kalian yang mau fast-track journey ini, kita punya kabar bagus.

### 🚀 Co-Learning Camp #8: Ethereum Edition by HackQuest

Ini program intensif 2 minggu yang di-mentoring langsung. 700+ builder Indonesia udah lewat program ini dan banyak yang sekarang udah kerja di Web3.

**Yang bakal dipelajari:**
- Ethereum fundamentals (PoS, EVM, gas)
- Solidity smart contracts
- DeFi protocols (DEX, lending, staking)
- NFT development (ERC-20, ERC-721)
- Full-stack dApp development

**Timeline:**
- Registrasi tutup: **4 Maret 2026** (besok!)
- Camp: **5-16 Maret 2026**
- 4 Live Townhalls (8-10 PM WIB)

**Benefits:**
- Structured learning path
- Live mentorship (4 sessions)
- Hands-on projects
- Top 10 → Quack Believers program
- Top 3 Graduates dapet reward

**Link pendaftaran:** hackquest.io/co-learning/3068518d-7fdc-48cc-a3df-ea01faaf7300

Registrasi GRATIS. Slot terbatas. Dan tutupnya besok. Jadi kalau kalian serius mau mulai journey Web3, ini timing yang perfect.

---

### Penutup

Gw mulai belajar coding dari nol, tanpa ijazah, dari kamar di BSD. Sekarang gw CTO, punya 2 remote job, dan contribute ke Ethereum protocol.

Bukan flexing — gw cuma mau bilang: **background lu ga nentuin future lu.** Yang nentuin itu konsistensi dan mau ga mau lu belajar.

ETHJKT ada buat nemenin perjalanan kalian. Kita gratis, dan bakal tetep gratis.

Welcome to the journey. Let's build. 🔥

---

*Q&A setelah ini — silahkan tanya apapun di chat atau voice.*
