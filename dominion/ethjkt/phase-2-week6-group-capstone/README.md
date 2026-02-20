# 🏆 PHASE 2 — WEEK 6: GROUP CAPSTONE + DEMO DAY

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ███████╗████████╗██╗  ██╗     ██╗██╗  ██╗████████╗      ║
║     ██╔════╝╚══██╔══╝██║  ██║     ██║██║ ██╔╝╚══██╔══╝      ║
║     █████╗     ██║   ███████║     ██║█████╔╝    ██║          ║
║     ██╔══╝     ██║   ██╔══██║██   ██║██╔═██╗    ██║          ║
║     ███████╗   ██║   ██║  ██║╚█████╔╝██║  ██╗   ██║          ║
║     ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝   ╚═╝          ║
║                                                              ║
║        W E E K  6  —  G R O U P   C A P S T O N E           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

> **"Ini dia, minggu terakhir Phase 2 yang sesungguhnya. Di Week 5 kalian udah buktiin bisa bikin fullstack app sendiri. Sekarang buktiin kalian bisa kerja dalam TIM."**

---

## 🔥 Apa Ini?

Week 6 adalah **GROUP CAPSTONE WEEK** — 1 minggu penuh dedicated buat kerja dalam tim 3-4 orang, build capstone project yang scope-nya LEBIH BESAR dari individual capstone di Week 5.

Di dunia kerja, gak ada yang ngoding sendirian. Kalian bakal selalu di tim. Git conflicts, code reviews, pembagian tugas, komunikasi — semua itu skill yang HARUS kalian kuasai. Week ini adalah training ground-nya.

Dan di akhir minggu: **DEMO DAY** di Discord voice channel **"Magic Temple"** 🏛️. Setiap tim presentasi project mereka di depan semua orang.

---

## ✅ Prerequisites

Sebelum mulai Week 6, kalian HARUS:

- [x] Phase 2 Week 1-5 complete
- [x] Individual capstone (AQ-03 Week 5) sudah di-submit
- [x] Familiar dengan Git branching, PR reviews
- [x] Punya tim 3-4 orang yang udah terbentuk

---

## 📚 Study Materials

| # | Topik | Deskripsi |
|---|-------|-----------|
| 01 | [Teamwork & Git Collaboration](study-material/01-teamwork-git.md) | Branching strategy, PR reviews, merge conflicts, async standups |
| 02 | [Code Standards for Teams](study-material/02-code-standards.md) | ESLint, Prettier, Husky, naming conventions, TypeScript strict |

---

## ⚔️ Arcane Quests

| Quest | Nama | Deskripsi |
|-------|------|-----------|
| AQ-01 | [👥 Group Capstone](arcane-quest/aq-01-group-capstone.md) | Group capstone project. 5 quest options. Bigger scope than individual. |
| AQ-02 | [🎤 Demo Day](arcane-quest/aq-02-demo-day.md) | Demo Day rules di Discord "Magic Temple" voice channel. |

---

## 🛠️ Tech Stack

Sama dengan Week 5 — tapi sekarang dikerjain bareng:

| Layer | Technology |
|-------|-----------|
| Language | **TypeScript** (strict mode, everywhere) |
| Frontend | **React 19** + Vite + Tailwind CSS |
| State | **Zustand** + **TanStack React Query** |
| Backend | **Express.js** / Hono |
| ORM | **Prisma** |
| Database | **PostgreSQL** |
| Auth | **JWT** (access + refresh tokens) |
| Real-time | **Socket.IO** / WebSocket |
| Testing | **Vitest** + **Playwright** |
| CI/CD | **GitHub Actions** |
| Deploy | **Vercel** (FE) + **Railway** (BE + DB) |

---

## Cara Pengerjaan & Submit Tugas

### Flow Pengerjaan

1. **Fork** repo ini ke GitHub account **Team Lead**
2. Semua member jadi **collaborator** di fork tersebut
3. Setup branch protection: `main` protected, semua changes lewat PR ke `develop`
4. Kerjain study materials, lalu mulai Group Capstone
5. **Setiap member** commit dan push ke feature branch masing-masing
6. **Pull Request** antar member ke `develop`, lalu `develop` → `main`
7. Setelah selesai, **Create Pull Request** dari fork ke repo ETHJKT ini
8. Mentor akan review lewat PR comments

### Rules Submission

- 📝 Isi judul PR dengan **nama tim + semua member**
- 📅 Wajib push **minimal 1 commit per hari per member**
- 🧹 Code harus **clean, typed (TypeScript), consistent code style**
- 📬 Semua submission via **Pull Request**
- 🚀 Deploy ke **Vercel** (FE) + **Railway** (BE)
- 🎤 **WAJIB presentasi di Demo Day** — absent = -20% individual grade

---

## ⚠️ Rules

1. **TypeScript strict mode** — `any` = point deduction
2. **AI tools boleh** buat assist — tapi kalian HARUS bisa explain setiap line
3. **Copy-paste dari tutorial = INSTANT FAIL**
4. **Deploy HARUS work** pas Demo Day
5. **Semua member HARUS contribute code** — gue check `git shortlog -sn --all`
6. **PR reviews mandatory** — no merge tanpa review dari minimal 1 member lain

---

## 🔥 Pesan

> Week 5 itu solo boss fight. Week 6 itu **raid boss**. Kalian butuh tim, strategi, koordinasi, dan eksekusi bareng. Ini yang bakal kalian lakuin SETIAP HARI di dunia kerja nanti.
>
> Build something BIGGER. Ship it as a TEAM. Present it with PRIDE.
>
> **See you at the Magic Temple.** 🏛️⚔️
