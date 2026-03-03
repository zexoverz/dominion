# Draft Speaking — Web3 Beginner Kickoff
**Event:** Web3 Beginner Kickoff: Your First Step to Building
**Date:** 3 Maret 2026
**Platform:** Discord ETH JKT
**Speaker:** Faisal (Zexo)

---

## PART 1: OPENING (5-7 menit)

Assalamualaikum, halo semuanya! Selamat datang di **Web3 Beginner Kickoff** — sesi pertama kalian untuk mulai journey sebagai Web3 developer.

Gua Faisal, biasa dipanggil Zexo. Gua lead di Ethereum Jakarta dan mentor di program Co-Learning Camp HackQuest. Sebelum kita mulai, gua mau bilang satu hal:

**Kalian udah ngambil langkah yang bener dengan ada di sini hari ini.**

Banyak orang cuma nonton dari jauh, baca-baca thread Twitter tentang Web3, tapi ga pernah mulai. Kalian beda — kalian hadir. Dan itu udah lebih dari 90% orang di luar sana.

Hari ini kita bakal bahas 3 hal:
1. **Update terbaru Ethereum ecosystem** — biar kalian tau landscape-nya sekarang kayak gimana
2. **Roadmap belajar Web3 dari nol** — step by step, ga usah bingung mulai dari mana
3. **Registrasi Co-Learning Camp #8** — bootcamp 2 minggu yang bakal nge-boost perjalanan kalian

Santai aja, ini bukan ujian. Ini orientasi. Kalian cuma perlu **curious dan open-minded**.

---

## PART 2: ETHEREUM ECOSYSTEM UPDATE — Jan 2026 s/d Sekarang (10-15 menit)

Oke, sebelum kita bahas roadmap, gua mau kasih kalian update tentang apa yang terjadi di Ethereum belakangan ini. Ini penting biar kalian paham kenapa belajar Ethereum development itu worth it banget.

---

### Pectra & Fusaka — Upgrade Besar Ethereum

> **SHARE SCREEN:** Buka https://ethereum.org/en/roadmap/ — tunjukin roadmap visual Ethereum

Tahun 2025 kemarin, Ethereum ngeluarin **2 upgrade besar**:

**Pectra** (Mei 2025) — Ini upgrade paling feature-packed sepanjang sejarah Ethereum. 11 EIP sekaligus. Yang paling penting:

> **SHARE SCREEN:** Buka https://eips.ethereum.org/EIPS/eip-7702 — tunjukin EIP-7702 spec langsung

- **EIP-7702**: EOA (wallet biasa kalian) sekarang bisa execute smart contract logic. Artinya kalian bisa batch transaksi, gasless transaction, dll tanpa harus bikin smart wallet baru.
- **Blob increase**: Data capacity buat Layer 2 naik 2x lipat, bikin transaksi di L2 makin murah.
- **Validator flexibility**: Validator sekarang bisa stake 32 sampai 2,048 ETH.

> **SHARE SCREEN:** Buka https://ethereum.org/en/roadmap/pectra/ — summary resmi Pectra dari EF

**Fusaka** (Desember 2025) — Upgrade ini fokus ke scaling:

> **SHARE SCREEN:** Buka https://www.fidelitydigitalassets.com/research-and-insights/fusaka-upgrade-scaling-meets-value-accrual — artikel Fidelity tentang Fusaka (biar keliatan institusi besar juga nge-track Ethereum)

- **PeerDAS (EIP-7594)**: Validator ga perlu download semua blob data lagi. Data requirement turun ~85%. Ini bikin network lebih ringan dan scalable.

---

### EIP-8141: Frame Transactions — Game Changer!

> **SHARE SCREEN:** Buka https://eips.ethereum.org/EIPS/eip-8141 — tunjukin EIP spec langsung biar audience liat ini official

Ini yang paling hot. **28 Februari kemarin**, Vitalik announce **EIP-8141 — Frame Transactions**.

Singkatnya, ini adalah solusi final untuk masalah Account Abstraction yang udah 10 tahun dicari. Frame Transaction itu konsepnya satu transaksi bisa punya banyak "frame" — setiap frame bisa authorize sender dan gas payer sendiri-sendiri.

Artinya:
- **Native batching** — approve + swap dalam 1 transaksi
- **Gas sponsorship** — orang lain bisa bayarin gas fee kalian
- **Privacy yang lebih baik** — pakai ZK proof untuk verifikasi

> **SHARE SCREEN:** Buka https://mpost.io/vitalik-buterin-ethereums-eip-8141-account-abstraction-protocol-to-go-live-after-hegota-upgrade/ — artikel Vitalik announce EIP-8141

Ini targetnya masuk di upgrade **Hegota** akhir 2026 atau awal 2027.

---

### Quantum Resistance — Ethereum Siap-siap Lawan Komputer Kuantum

> **SHARE SCREEN:** Buka https://www.coindesk.com/tech/2026/01/24/ethereum-foundation-makes-post-quantum-security-a-top-priority-as-new-team-forms/ — CoinDesk coverage pembentukan tim PQ

Januari 2026, Ethereum Foundation bikin **tim khusus Post-Quantum Security**. Kenapa? Karena komputer kuantum makin berkembang dan bisa mengancam kriptografi yang dipake Ethereum sekarang.

Yang udah dilakukan:
- Tim baru dipimpin **Thomas Coratger**
- **$1 juta Poseidon Prize** untuk riset hash function
- **27 Februari kemarin**, mereka berhasil jalanin sistem post-quantum di devnet — bikin block dan verifikasi semua precompile baru

> **SHARE SCREEN:** Buka https://www.coindesk.com/tech/2026/02/26/vitalik-buterin-unveils-ethereum-roadmap-to-counter-quantum-computing-threat/ — Vitalik's quantum resistance roadmap sampai 2030

Vitalik sendiri udah kasih roadmap buat quantum resistance sampai 2030. 4 area yang vulnerable: BLS signatures, KZG commitments, ECDSA signatures, dan ZK proofs. Semua bakal di-upgrade ke quantum-resistant versions.

---

### Roadmap 2026: Glamsterdam & Hegota

> **SHARE SCREEN:** Buka https://www.bitget.com/news/detail/12560605220358 — Ethereum Foundation "Strawmap" visualization

Ethereum Foundation juga publish **"Strawmap"** — roadmap eksperimental sampai 2029:

- **Glamsterdam** (target pertengahan 2026): ePBS (Enshrined Proposer-Builder Separation), gas repricing, block time lebih cepat

> **SHARE SCREEN:** Buka https://bingx.com/en/news/post/vitalik-buterin-details-eips-for-ethereum-s-glamsterdam-hardfork-planned-for-early — detail 8 EIP yang Vitalik outlined untuk Glamsterdam

- **Hegota** (target akhir 2026): Verkle Trees, Frame Transactions, native Account Abstraction

---

### Layer 2 Makin Kuat

> **SHARE SCREEN:** Buka https://l2beat.com/scaling/tvl — L2Beat live dashboard, tunjukin TVL dan activity semua L2

- L2 TVL udah di angka **$47 miliar**
- **Base** (Coinbase) jadi L2 paling banyak dipakai
- Fee L2 turun **40-60%** setelah Fusaka
- Institusi besar udah masuk: **Robinhood** bikin L2, **JP Morgan** launch tokenized fund di Ethereum, **BlackRock** udah operasi di Ethereum

> **SHARE SCREEN:** Buka https://www.theblock.co/post/383329/2026-layer-2-outlook — The Block: 2026 L2 outlook, prediksi L2 TVL bakal exceed L1

---

### Kenapa Ini Penting Buat Kalian?

> **SHARE SCREEN:** Buka https://web3.career/ — tunjukin live job listings Web3 biar audience liat demand-nya real

Karena semua ini butuh **developer**. Setiap upgrade, setiap fitur baru, setiap L2 yang launch — mereka semua butuh orang yang bisa ngoding smart contract, bikin dApp, dan integrasi Web3.

**Supply developer Web3 masih jauh di bawah demand.** Dan kalian di sini, di titik awal yang perfect untuk mulai.

> **SHARE SCREEN:** Buka https://www.developerreport.com/ — Electric Capital Developer Report, tunjukin growth Web3 devs globally

---

## PART 3: ROADMAP BELAJAR WEB3 DARI NOL (7-10 menit)

Oke sekarang pertanyaan besarnya: **"Gimana cara mulai?"**

> **SHARE SCREEN:** Buka https://github.com/Ethereum-Jakarta/fullstack-web3-roadmap — tunjukin repo roadmap kita, scroll pelan-pelan dari atas

Kita punya roadmap lengkap di GitHub yang udah gua buat dan terus di-update. Ini open-source, gratis, dan kalian bisa follow dari mana aja.

> **SHARE SCREEN:** Buka https://github.com/Ethereum-Jakarta/ethjkt-course — tunjukin ETHJKT Tower Course repo

Dan semua materi detail lengkapnya ada di **ETHJKT Tower Course** — dari Phase 0 sampai Phase 3, study materials, quests, semuanya ada.

Roadmap ini dibagi jadi **4 Phase**:

### Phase 0: Foundation — "The First Brick"
Ini pondasi. Kalian belajar:
- **JavaScript** — bahasa utama kita, 1 bahasa bisa handle frontend & backend. Dan syntax-nya mirip Solidity nanti.
- **HTML/CSS** — bikin website
- **Git & GitHub** — wajib, semua open-source Ethereum pakai Git
- **Blockchain Theory** — mulai kenalan sama konsep blockchain, bikin wallet, kirim testnet transaction

> **SHARE SCREEN:** Buka https://github.com/Ethereum-Jakarta/phase-0-week1-welcome-to-code — tunjukin contoh materi Phase 0 kita

Targetnya: bisa solve Codewars kyu 5/6, paham Git, bikin website sederhana, dan punya pemahaman dasar blockchain.

### Phase 1: Backend Development — "The Engine Room"
- REST API pakai Node.js & Express
- Database (PostgreSQL/MongoDB) — konsep sama kayak blockchain storage nanti
- Authentication & Security — di Web3 diganti wallet signature
- Cloud Deployment — nanti deploy smart contract pakai prinsip yang sama

> **SHARE SCREEN:** Buka https://github.com/Ethereum-Jakarta/phase-1-week4-backend-api — tunjukin contoh materi backend

Selesai phase ini, kalian udah bisa **kerja sebagai backend developer**. Dan semua yang kalian pelajari langsung transferable ke smart contract development.

### Phase 2: Frontend & Fullstack — "The Bridge to Web3"
- React.js, Tailwind, State Management
- Testing, CI/CD
- Group project & Demo Day
- **Web3 Basic Integration** — pertama kalinya kodingan kalian interact sama blockchain!

> **SHARE SCREEN:** Buka https://github.com/Ethereum-Jakarta/phase-2-week1-frontend-basic — tunjukin salah satu repo Phase 2

Selesai phase ini, kalian udah bisa **kerja sebagai fullstack developer** dan udah pernah connect wallet ke website kalian sendiri.

### Phase 3: Web3 Development — "Tower of Chains"
- Solidity & Smart Contract pakai Foundry
- Token Standards (ERC-20, ERC-721, ERC-1155)
- DeFi building blocks (AMM, Staking)
- Security & Auditing — skill paling dibayar mahal di Web3
- Hackathon Simulation — 48 jam bikin dApp dari nol

> **SHARE SCREEN:** Buka https://remix.ethereum.org/ — tunjukin Remix IDE, tulis simple contract "Hello World" live kalau sempat

Selesai phase ini, kalian siap **apply kerja Web3** dan **menang hackathon**.

### Kunci Sukses

> **SHARE SCREEN:** Kembali ke https://github.com/Ethereum-Jakarta/fullstack-web3-roadmap — scroll ke bagian Curated Learning Resources

1. **Jangan skip fundamental** — banyak orang langsung loncat ke Solidity tapi ga bisa JavaScript. Itu resep gagal.
2. **Konsisten > Intensif** — mending 1 jam setiap hari daripada 10 jam sekali seminggu
3. **Build, build, build** — tutorial doang ga cukup. Harus bikin project sendiri.
4. **Gabung komunitas** — kalian udah di ETH JKT, ini advantage besar. Jangan sia-siain.
5. **Pakai resources yang udah dikurasi** — di roadmap kita udah ada 20 resource terbaik, ga perlu bingung cari sendiri.

---

## PART 4: CLOSING — Co-Learning Camp #8 Registration (5 menit)

Nah, sekarang bagian yang paling exciting.

> **SHARE SCREEN:** Buka https://www.hackquest.io/co-learning/3068518d-7fdc-48cc-a3df-ea01faaf7300 — tunjukin halaman registrasi bootcamp, biarkan di screen sampai akhir

Buat kalian yang mau **fast-track** perjalanan Web3 kalian, kita punya **Co-Learning Camp #8: Ethereum Edition** bareng **HackQuest**.

Ini bukan sembarang bootcamp. **700+ builder Indonesia** udah belajar lewat Co-Learning Camp HackQuest — dan sekarang mereka build dApps, menang hackathon, bahkan dapet kerjaan di Web3.

### Apa yang Bakal Kalian Pelajari:
- Ethereum fundamentals (PoS, EVM, gas)
- Solidity smart contracts
- DeFi protocols (DEX, lending, staking)
- NFT development (ERC-20, ERC-721)
- Full-stack dApp development

### Timeline:
- **Registrasi tutup:** 4 Maret 2026 — BESOK!
- **Camp:** 5-16 Maret 2026 (2 minggu intensif)
- **4 Live Townhalls** (8-10 PM WIB)

### Benefits:
- Structured learning path yang jelas
- Live mentorship 4 sesi — dimentorin langsung
- Hands-on projects yang bisa masuk portfolio
- **Top 10** masuk Quack Believers program
- **Top 3** dapet reward

### Link Pendaftaran:
https://www.hackquest.io/co-learning/3068518d-7fdc-48cc-a3df-ea01faaf7300

Gua serius, ini opportunity yang jarang ada. 2 minggu, structured, ada mentor, ada reward. Dan gratis.

**Registrasi tutup besok 4 Maret.** Jadi langsung daftar sekarang sebelum slot penuh.

---

## PENUTUP

Terakhir, gua mau bilang satu hal:

**Web3 itu bukan cuma hype.** Ini adalah perubahan fundamental cara internet bekerja. Dan developer yang masuk sekarang — di fase awal ini — adalah orang-orang yang bakal shape masa depan teknologi ini.

Kalian ga perlu jadi jenius. Kalian ga perlu punya background IT. Yang kalian butuh cuma **konsistensi dan keberanian untuk mulai**.

Dan kalian udah mulai hari ini. Selamat datang di journey Web3 kalian.

Kita ketemu lagi di Co-Learning Camp. Daftar sekarang, dan let's build together.

Terima kasih semuanya!

---

### Share Screen Reference — Urutan Buka Tab

Buka semua tab ini **sebelum event** biar tinggal switch pas ngomong:

| # | Kapan | URL | Catatan |
|---|-------|-----|---------|
| 1 | PART 2 - Intro | https://ethereum.org/en/roadmap/ | Ethereum roadmap visual |
| 2 | PART 2 - Pectra | https://ethereum.org/en/roadmap/pectra/ | Summary resmi Pectra |
| 3 | PART 2 - EIP-7702 | https://eips.ethereum.org/EIPS/eip-7702 | EIP spec — tunjukin ini official |
| 4 | PART 2 - Fusaka | https://www.fidelitydigitalassets.com/research-and-insights/fusaka-upgrade-scaling-meets-value-accrual | Fidelity artikel — institusi besar nge-track ETH |
| 5 | PART 2 - EIP-8141 | https://eips.ethereum.org/EIPS/eip-8141 | Frame Transactions spec |
| 6 | PART 2 - EIP-8141 artikel | https://mpost.io/vitalik-buterin-ethereums-eip-8141-account-abstraction-protocol-to-go-live-after-hegota-upgrade/ | Vitalik announce |
| 7 | PART 2 - Quantum | https://www.coindesk.com/tech/2026/01/24/ethereum-foundation-makes-post-quantum-security-a-top-priority-as-new-team-forms/ | CoinDesk PQ team |
| 8 | PART 2 - Quantum roadmap | https://www.coindesk.com/tech/2026/02/26/vitalik-buterin-unveils-ethereum-roadmap-to-counter-quantum-computing-threat/ | Vitalik PQ roadmap |
| 9 | PART 2 - Strawmap | https://www.bitget.com/news/detail/12560605220358 | EF Strawmap visualization |
| 10 | PART 2 - Glamsterdam | https://bingx.com/en/news/post/vitalik-buterin-details-eips-for-ethereum-s-glamsterdam-hardfork-planned-for-early | 8 EIPs Glamsterdam |
| 11 | PART 2 - L2 | https://l2beat.com/scaling/tvl | L2Beat live dashboard |
| 12 | PART 2 - L2 outlook | https://www.theblock.co/post/383329/2026-layer-2-outlook | The Block L2 outlook |
| 13 | PART 2 - Jobs | https://web3.career/ | Live Web3 job listings |
| 14 | PART 2 - Dev report | https://www.developerreport.com/ | Electric Capital dev report |
| 15 | PART 3 - Roadmap | https://github.com/Ethereum-Jakarta/fullstack-web3-roadmap | Repo roadmap kita |
| 16 | PART 3 - Course | https://github.com/Ethereum-Jakarta/ethjkt-course | ETHJKT Tower Course |
| 17 | PART 3 - Phase 0 | https://github.com/Ethereum-Jakarta/phase-0-week1-welcome-to-code | Contoh materi Phase 0 |
| 18 | PART 3 - Phase 1 | https://github.com/Ethereum-Jakarta/phase-1-week4-backend-api | Contoh materi Phase 1 |
| 19 | PART 3 - Phase 2 | https://github.com/Ethereum-Jakarta/phase-2-week1-frontend-basic | Contoh materi Phase 2 |
| 20 | PART 3 - Remix | https://remix.ethereum.org/ | Quick demo Solidity |
| 21 | PART 4 - Bootcamp | https://www.hackquest.io/co-learning/3068518d-7fdc-48cc-a3df-ea01faaf7300 | Registrasi — biarkan di screen |

### Quick Links untuk di-share di Chat Discord:
```
🚀 LINKS FROM TODAY'S SESSION:

📚 Roadmap: https://github.com/Ethereum-Jakarta/fullstack-web3-roadmap
🏰 ETHJKT Course: https://github.com/Ethereum-Jakarta/ethjkt-course
🎓 Co-Learning Camp #8: https://www.hackquest.io/co-learning/3068518d-7fdc-48cc-a3df-ea01faaf7300

🔗 Top Resources:
- Ethereum Docs: https://ethereum.org/developers/docs/
- Cyfrin Updraft: https://updraft.cyfrin.io/
- CryptoZombies: https://cryptozombies.io/
- Scaffold-ETH 2: https://scaffoldeth.io/
- Solidity by Example: https://solidity-by-example.org/
- Foundry Book: https://book.getfoundry.sh/
- Remix IDE: https://remix.ethereum.org/
- Ethernaut: https://ethernaut.openzeppelin.com/

📰 Ethereum Updates:
- EIP-8141 Frame Transactions: https://eips.ethereum.org/EIPS/eip-8141
- Pectra Upgrade: https://ethereum.org/en/roadmap/pectra/
- L2 Dashboard: https://l2beat.com/scaling/tvl
- Web3 Jobs: https://web3.career/
```
