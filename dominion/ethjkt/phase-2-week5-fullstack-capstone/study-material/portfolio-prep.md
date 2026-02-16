# ⚔️ Arcane Quest Phase 2 — Week 5: Portfolio Preparation

## 🏰 "The Arcane Archive" — Mempersiapkan Warisan Quest-mu

> *"Seorang Arcane Knight tidak hanya bertempur — mereka meninggalkan legacy. Scroll of Achievement yang kau tulis hari ini akan menentukan guild mana yang merekrut-mu di masa depan."*

Selamat, Knight! Kamu sudah hampir menyelesaikan Phase 2 dari Arcane Quest. Sebelum menghadapi Final Boss (Capstone Project), ada satu skill krusial yang sering diabaikan: **mempersiapkan portfolio yang bikin recruiter langsung tertarik.**

Percuma bikin project keren kalau nggak ada yang tahu. Portfolio adalah etalase kemampuanmu. Let's make it shine! ✨

---

## 📜 Part 1: Writing a Killer README

README adalah **first impression** project-mu. Recruiter biasanya cuma spend 30 detik scanning README sebelum decide apakah mau liat lebih lanjut atau skip. Jadi, README harus **informatif, visual, dan profesional.**

### 🏗️ Struktur README yang Ideal

```markdown
# 🛒 TokoBoss — E-Commerce Platform

![Build Status](https://img.shields.io/github/actions/workflow/status/username/tokoboss/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

> Platform e-commerce modern dengan fitur real-time inventory,
> payment gateway integration, dan admin dashboard.

🔗 **Live Demo:** [tokoboss.vercel.app](https://tokoboss.vercel.app)

![Screenshot](./docs/screenshot-hero.png)

## ✨ Features

- 🔐 Authentication (JWT + OAuth Google)
- 🛒 Shopping cart dengan persistent storage
- 💳 Payment integration (Midtrans)
- 📊 Admin dashboard dengan analytics
- 📱 Fully responsive design
- ⚡ Optimized performance (Lighthouse 90+)

## 🛠️ Tech Stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Frontend    | React, TypeScript, Tailwind   |
| Backend     | Node.js, Express, Prisma      |
| Database    | PostgreSQL                    |
| Auth        | JWT, bcrypt, Google OAuth     |
| Deployment  | Vercel (FE), Railway (BE)     |
| Testing     | Jest, React Testing Library   |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/username/tokoboss.git
cd tokoboss

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start development server
npm run dev
```

### Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/tokoboss
JWT_SECRET=your-secret-key
MIDTRANS_SERVER_KEY=your-midtrans-key
GOOGLE_CLIENT_ID=your-google-client-id
```

## 📁 Project Structure

```
tokoboss/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── services/
├── prisma/          # Database schema & migrations
└── docs/            # Documentation & screenshots
```

## 🧪 Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📸 Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Homepage
![Homepage](./docs/screenshots/home.png)

### Product Detail
![Product](./docs/screenshots/product.png)

### Admin Dashboard
![Admin](./docs/screenshots/admin.png)

</details>

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name** — [GitHub](https://github.com/username) · [LinkedIn](https://linkedin.com/in/username)
```

### 🎯 Elemen README yang Wajib Ada

#### 1. **Badges** — Status indicators di bagian atas

Badges bikin README terlihat profesional dan memberikan info cepat. Kamu bisa generate badges dari [shields.io](https://shields.io):

```markdown
<!-- Build status dari GitHub Actions -->
![CI](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)

<!-- Tech stack badges -->
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js)

<!-- Custom badges -->
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
```

#### 2. **Hero Screenshot** — Visual pertama yang dilihat orang

Tips screenshot yang bagus:
- Gunakan **full-width** screenshot di bagian atas
- Pakai **mockup frame** (bisa generate di mockuphone.com atau shots.so)
- Pastikan data di screenshot **looks realistic**, bukan "test123"
- Kalau bisa, bikin **GIF demo** singkat pakai tools kayak LICEcap atau Kap

#### 3. **Live URL** — Recruiter mau coba langsung

Deploy project-mu! Free hosting options:
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Railway, Render, Fly.io
- **Database:** Supabase, Neon, PlanetScale

#### 4. **Tech Stack Table** — Biar keliatan organized

Jangan cuma list teknologinya. Jelaskan **kenapa** kamu pilih tech tersebut kalau bisa:

```markdown
## 🛠️ Tech Stack & Rationale

- **React + TypeScript** — Type safety untuk codebase yang scalable
- **Prisma** — Type-safe ORM yang bikin database queries jadi readable
- **Tailwind CSS** — Rapid UI development tanpa context-switching ke CSS files
- **Zod** — Runtime validation yang sync dengan TypeScript types
```

#### 5. **Setup Guide** — Harus bisa di-clone dan jalan

Test sendiri! Clone repo ke folder baru, ikuti instruksi README-mu, dan pastikan **actually works**. Nggak ada yang lebih malu dari recruiter yang nggak bisa jalanin project-mu.

---

## 🧙 Part 2: GitHub Profile Optimization

GitHub profile itu ibarat **kartu nama digital** untuk developer. Banyak recruiter langsung buka GitHub sebelum even baca CV.

### 📝 Optimasi Bio & Profile

```markdown
# Contoh bio yang bagus:
"Fullstack Developer | React · Node.js · TypeScript · PostgreSQL
Building things that matter. ETHJKT Bootcamp Graduate 🚀"
```

**Checklist profile:**
- ✅ Profile photo yang profesional (nggak harus formal, tapi jelas dan recognizable)
- ✅ Bio yang mention tech stack utama
- ✅ Location (recruiter sering filter by location)
- ✅ Link ke portfolio website atau LinkedIn
- ✅ Status: "Available for hire" kalau lagi cari kerja

### 📌 Pinned Repositories

Kamu bisa pin sampai **6 repositories**. Ini real estate paling berharga di profile-mu!

**Strategi pinning:**
1. **Capstone Project** — Project terbaik dan paling complex
2. **Fullstack App** — Tunjukkan kemampuan end-to-end
3. **API/Backend Project** — Buktikan kamu nggak cuma frontend
4. **Open Source Contribution** — Kalau ada, ini impressive banget
5. **Utility/Library** — Small tapi well-crafted project
6. **Experiment/Fun Project** — Tunjukkan passion dan curiosity

### 📊 Contribution Graph

Contribution graph yang ijo itu emang nggak segalanya, tapi tetap bikin **good impression**. Tips:

- **Commit regularly** — Lebih baik commit kecil tiap hari daripada commit besar seminggu sekali
- **Write meaningful commit messages** — `"fix: resolve cart total calculation bug"` >> `"fix stuff"`
- **Use conventional commits:**

```bash
# Format: type(scope): description
git commit -m "feat(cart): add quantity update functionality"
git commit -m "fix(auth): handle expired token refresh"
git commit -m "docs(readme): add setup instructions"
git commit -m "refactor(api): extract validation middleware"
git commit -m "test(user): add registration endpoint tests"
```

### 🎨 Profile README

Bikin special repository dengan nama yang sama dengan username-mu untuk custom profile README:

```markdown
# Hi, I'm Budi 👋

## 🚀 About Me
Fullstack Developer yang passionate tentang building clean,
scalable web applications. Graduate of ETHJKT Bootcamp.

## 🛠️ Tech Stack
```

```
Frontend:  React · Next.js · TypeScript · Tailwind CSS
Backend:   Node.js · Express · Prisma
Database:  PostgreSQL · MongoDB · Redis
DevOps:    Docker · GitHub Actions · Vercel
```

```markdown
## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=radical)

## 🏆 Featured Projects

### [TokoBoss](https://github.com/username/tokoboss)
🛒 Full-featured e-commerce platform — React, Node.js, PostgreSQL

### [DevConnect](https://github.com/username/devconnect)
👥 Social media for developers — Next.js, Prisma, WebSocket
```

---

## 🎯 Part 3: Project Descriptions yang Menarik Recruiter

Recruiter bukan developer. Mereka scan cepat. Deskripsi project harus **singkat, impactful, dan menunjukkan value.**

### ❌ Deskripsi yang Biasa Aja

> "Website e-commerce yang dibuat pakai React dan Node.js. Ada fitur login, cart, dan checkout."

### ✅ Deskripsi yang Bikin Tertarik

> "Full-stack e-commerce platform handling 500+ products with real-time inventory tracking, Midtrans payment integration, and an admin dashboard featuring sales analytics. Built with React, TypeScript, Node.js, and PostgreSQL. Reduced page load time by 40% through image optimization and lazy loading."

### Formula Deskripsi Project

```
[What it does] + [Scale/Impact] + [Interesting technical challenge] + [Tech stack]
```

**Contoh-contoh:**

```markdown
# Task Manager Pro
Project management tool inspired by Trello with drag-and-drop
Kanban boards, real-time collaboration via WebSocket, and
team permission management. Supports 50+ concurrent users
with optimistic UI updates. Built with React, Node.js, Socket.io,
and PostgreSQL.

# FoodSnap
Social media app for food enthusiasts featuring image upload
with automatic compression, location-based restaurant discovery,
and a recommendation engine. Implemented infinite scroll with
virtualized lists handling 10,000+ posts. React Native, Express,
PostgreSQL, Cloudinary.
```

### 🔑 Keywords yang Recruiter Cari

Selipin keywords ini secara natural di deskripsi:
- **Authentication & Authorization** (JWT, OAuth, RBAC)
- **RESTful API** atau **GraphQL**
- **Database Design** (relational, migrations, indexing)
- **Testing** (unit, integration, e2e)
- **Performance Optimization** (caching, lazy loading, CDN)
- **Responsive Design** (mobile-first)
- **CI/CD** (GitHub Actions, automated deployment)
- **TypeScript** (type safety!)

---

## 💼 Part 4: LinkedIn Project Showcase

LinkedIn masih jadi platform #1 untuk job hunting di Indonesia. Optimize presence-mu di sana!

### 📋 Profile Optimization

**Headline** — Jangan cuma "Mahasiswa" atau "Fresh Graduate":

```
❌ "Mahasiswa Informatika di Universitas X"
✅ "Fullstack Developer | React · Node.js · TypeScript | ETHJKT Graduate"
```

**About Section:**

```
Fullstack Developer specializing in React and Node.js ecosystem.

I build performant, user-friendly web applications with clean code
and modern best practices. Experienced with TypeScript, PostgreSQL,
REST APIs, and cloud deployment.

Recent graduate of ETHJKT Fullstack Bootcamp where I built 5+
production-ready applications including a full e-commerce platform
and a real-time project management tool.

Currently seeking opportunities where I can contribute to meaningful
products while growing as an engineer.

🛠️ Skills: React, Next.js, Node.js, Express, TypeScript, PostgreSQL,
Prisma, Tailwind CSS, Git, Docker, CI/CD

📫 Open to opportunities — feel free to connect!
```

### 🖼️ Adding Projects to LinkedIn

LinkedIn punya **Featured** section dan **Projects** section. Manfaatkan keduanya!

**Featured Section:**
- Add link ke deployed project dengan thumbnail yang menarik
- Add link ke GitHub profile
- Kalau punya blog post tentang project-mu, add juga

**Projects Section:**
- Judul project yang catchy
- Deskripsi singkat (2-3 kalimat, pake formula di atas)
- Link ke live demo DAN GitHub repo
- Tag collaborators kalau ada

### 📝 Posting tentang Project-mu

Bikin post di LinkedIn tentang capstone project-mu! Template:

```
🚀 Excited to share my latest project: [Project Name]!

After [X weeks] of intensive development at ETHJKT Bootcamp,
I built [brief description].

🔧 Tech Stack: React, TypeScript, Node.js, PostgreSQL
✨ Key Features:
  • [Feature 1 with brief explanation]
  • [Feature 2 with brief explanation]
  • [Feature 3 with brief explanation]

💡 Biggest challenge: [What you learned]

🔗 Live Demo: [URL]
📦 GitHub: [URL]

#webdevelopment #fullstack #react #nodejs #javascript
```

---

## 🏋️ Exercises

### Exercise 1: README Makeover
Ambil salah satu project lama-mu. Rewrite README-nya mengikuti struktur di atas. Pastikan ada: badges, screenshot, tech stack table, setup guide yang works, dan live URL.

### Exercise 2: GitHub Profile Audit
Checklist audit — buka GitHub profile-mu dan pastikan:
- [ ] Bio terisi dengan tech stack
- [ ] Profile photo ada
- [ ] 4-6 repos ter-pin
- [ ] Semua pinned repos punya README yang bagus
- [ ] Commit messages menggunakan conventional commits
- [ ] Profile README repository dibuat

### Exercise 3: Deskripsi Project Rewrite
Tulis ulang deskripsi 3 project-mu menggunakan formula: `[What] + [Scale] + [Challenge] + [Stack]`. Masing-masing maksimal 3 kalimat.

### Exercise 4: LinkedIn Ready
Setup atau update LinkedIn profile-mu:
- [ ] Update headline
- [ ] Write About section
- [ ] Add minimal 2 projects ke Featured section
- [ ] Prepare draft post untuk capstone project (kamu bisa post setelah selesai)

### Exercise 5: Mock Recruiter Review
Minta teman atau mentor untuk review GitHub profile-mu selama **30 detik saja**. Tanya mereka:
- Apa first impression mereka?
- Tech stack apa yang mereka tangkap?
- Project mana yang paling menarik perhatian?
- Apakah mereka bisa jalanin project-mu dari README?

Feedback ini invaluable! 🎯

---

## 🗡️ Knight's Wisdom

> *"Code-mu adalah pedang. Portfolio-mu adalah armor. Keduanya harus diasah dengan sama tajamnya."*

Portfolio bukan sesuatu yang kamu bikin sekali terus ditinggal. Treat it as a **living document** — update terus seiring kamu grow sebagai developer. Setiap project baru, setiap skill baru, setiap achievement baru — refleksikan di portfolio-mu.

Sekarang, bersiaplah untuk Final Boss: **Capstone Project!** 🏰⚔️

---

*Arcane Quest Phase 2 — Week 5 | ETHJKT Bootcamp*
