# GRIMOIRE Report: ETHJKT Phase 2 Week 4-5 Gap Completion Design

> Generated: 2026-02-14 | Updated: 2026-02-14 | Analyst: GRIMOIRE, Knowledge General of the Dominion
> ⚠️ CORRECTED: Phase 0-2 is PURE WEB2. No blockchain, no wagmi, no wallet connection. dApp integration starts in Phase 3.

---

## Executive Summary

Phase 2 currently has 3 weeks (HTML/CSS/jQuery → React → Advanced React). This report designs **Week 4 (State Management + API Integration)** and **Week 5 (Fullstack Web App Capstone)** to complete the phase.

These weeks bridge Phase 1 (backend: Node/Express/PostgreSQL) with Phase 2 (frontend: React) into a complete fullstack Web2 experience, preparing students for Phase 3's blockchain/dApp integration.

Key references studied:
- `phase-2-week1-frontend-basic` — HTML/CSS/jQuery, DOM, AJAX, Vercel deploy
- `phase-2-week2-reactjs` — React basics, hooks, Router, Tailwind
- `phase-2-week3-frontend-advance` — Vite, core hooks, TanStack, Cypress, Redux, Stripe, Clerk
- Phase 1 backend repos — Express, PostgreSQL, REST APIs, authentication

---

## Phase 2 Week 4: `phase-2-week4-state-api`

### README.md Design (Indonesian, Wizard Theme)

```markdown
# Week4-State-Management-API-Integration 🧙‍♂️🔗

Selamat datang di Week 4, Etherean! Kalian sudah melewati 3 minggu penuh
di Tower of Illusions — dari HTML mentah sampai Advanced React. Tapi semua
yang kalian bangun sejauh ini... masih "kosong". Data dummy, state lokal,
tidak ada koneksi ke dunia luar.

Minggu ini tongkat sihir kalian akan belajar mantra baru: **menghubungkan
frontend ke backend**. Bayangkan frontend kalian sebagai wajah sang penyihir
yang tampan, dan backend sebagai perpustakaan mantra di menara belakang.
Selama ini kalian cuma melihat wajahnya — sekarang kalian akan membuka
pintu ke perpustakaan itu.

Kalian akan belajar:
- **State Management** yang proper — React Context, Zustand, kapan pakai apa
- **Data Fetching** — React Query / SWR, atau fetch + useEffect patterns
- **REST API Integration** — konek React app ke Express API dari Phase 1
- **Authentication UI** — login, register, JWT flow, protected routes
- **Error Handling & Loading States** — UX yang professional

Setelah week ini, frontend kalian bukan lagi boneka tanpa nyawa — dia sudah
hidup, bisa baca dan tulis data dari server! 🚀

## Week 4 Study Material (Berurutan)

- [State Management Patterns](study-material/state-management.md)
- [React Context Deep Dive](study-material/react-context.md)
- [Zustand: Lightweight State Management](study-material/zustand.md)
- [Data Fetching Patterns](study-material/data-fetching.md)
- [React Query / TanStack Query for API](study-material/react-query-api.md)
- [Logic Nolep: Data Dashboard](study-material/ln-data-dashboard.md)
- [REST API Integration](study-material/rest-api-integration.md)
- [Authentication Flows: JWT + Login/Register UI](study-material/auth-flows.md)
- [Environment Variables & Error Handling](study-material/env-error-handling.md)
- [Logic Nolep: Authenticated CRUD App](study-material/ln-authenticated-crud.md)
- [Soft Skills: API Documentation Reading](study-material/sk-api-docs.md)
- [Group Project Week4](study-material/gp-week4.md)

## Cara Pengerjaan

1. Fork repo ini ke akun GitHub pribadi kalian
2. Clone hasil fork ke local
3. Kerjakan setiap study material secara berurutan
4. Push ke repo fork kalian
5. Buat Pull Request ke repo utama untuk submission

## Peraturan

- Deadline setiap Logic Nolep: lihat jadwal di channel Discord
- Wajib push minimal 1 commit per hari selama week ini
- Code harus clean, typed (TypeScript), dan well-commented
- Semua submission via Pull Request
```

### Study Materials Detail

#### 1. `state-management.md`
- Masalah prop drilling dan kenapa butuh state management
- Perbandingan solusi: React Context vs Zustand vs Redux Toolkit
- Kapan pakai apa: local state, shared state, global state, server state
- Mental model: "state yang dekat, simpan dekat; state yang jauh, angkat naik"
- **Links:**
  - https://react.dev/learn/managing-state
  - https://react.dev/learn/scaling-up-with-reducer-and-context

#### 2. `react-context.md`
- `createContext`, `useContext`, Provider pattern
- Building a Theme context (light/dark mode)
- Building an Auth context (user data, login status)
- Avoiding unnecessary re-renders with context splitting
- Limitations of Context for frequent updates
- **Hands-on:** Buat ThemeProvider + AuthProvider untuk aplikasi sederhana

#### 3. `zustand.md`
- Installing dan setup Zustand
- Creating stores: state + actions dalam satu tempat
- Selectors untuk avoid re-renders
- Middleware: persist (localStorage), devtools
- Comparison: kapan Context cukup, kapan butuh Zustand
- **Hands-on:** Buat shopping cart store dengan Zustand (add, remove, update quantity, persist ke localStorage)
- **Links:**
  - https://zustand-demo.pmnd.rs/
  - https://github.com/pmndrs/zustand

#### 4. `data-fetching.md`
- The classic: fetch + useEffect + useState pattern
- Problems with manual fetching: loading, error, cache, race conditions
- Introduction to server state vs client state
- Why dedicated data fetching libraries exist
- **Hands-on:** Fetch data dari JSONPlaceholder API dengan manual pattern, rasakan pain-nya

#### 5. `react-query-api.md`
- TanStack Query (React Query) setup dengan real APIs
- `useQuery` — fetching + caching + background refetch
- `useMutation` — POST/PUT/DELETE requests
- Query invalidation — auto-refetch setelah mutation
- Loading, error, and stale states
- Pagination dan infinite scroll patterns
- **Hands-on:** Build a post list that fetches from API, with create/edit/delete mutations
- **Links:**
  - https://tanstack.com/query/latest/docs/react/overview

#### 6. `ln-data-dashboard.md` — Logic Nolep
**Scenario:** Buat "Data Dashboard" yang fetches dan displays data dari public API:
- Gunakan API publik (JSONPlaceholder, atau REQ|RES API)
- Dashboard menampilkan: user list, post list, comment list
- Sidebar navigation antar halaman
- Search dan filter functionality
- Loading skeletons (bukan spinner doang!)
- Error states yang informatif
- Zustand store untuk UI state (sidebar open/close, active filters)
- React Query untuk semua data fetching
- Responsive design dengan Tailwind

**Requirements:**
- TypeScript strict mode
- Minimum 3 halaman dengan React Router
- Zustand untuk UI state
- React Query untuk server state
- Loading skeletons + error boundaries
- Deploy ke Vercel

#### 7. `rest-api-integration.md`
- Connecting React frontend to Express/Hono backend
- CORS: apa itu dan cara setup di backend
- Axios vs fetch: pros and cons
- Creating an API client/service layer (abstraction)
- Base URL configuration per environment
- Request/response interceptors (auth headers, error handling)
- **Hands-on:** Setup API client yang reusable, konek ke backend dari Phase 1

#### 8. `auth-flows.md`
- JWT authentication flow: register → login → store token → send with requests
- Building Login page: form, validation, API call, redirect
- Building Register page: form, validation, API call, redirect
- Storing JWT: localStorage vs httpOnly cookie (tradeoffs)
- Auth context/store: currentUser, isAuthenticated, login(), logout()
- Protected routes: redirect ke login jika belum auth
- Auto-refresh token (optional advanced topic)
- **Hands-on:** Buat complete auth flow: register, login, protected dashboard page

#### 9. `env-error-handling.md`
- Environment variables di Vite: `import.meta.env`
- `.env`, `.env.local`, `.env.production` — kapan pakai apa
- Error boundaries di React (class component fallback)
- Toast notifications untuk user feedback (react-hot-toast / sonner)
- Retry logic untuk failed requests
- Graceful degradation: apa yang ditampilkan saat API down
- **Hands-on:** Setup environment variables + global error handling

#### 10. `ln-authenticated-crud.md` — Logic Nolep
**Scenario:** Buat "Task Manager" yang terkoneksi ke REST API:
- Register + Login (JWT auth)
- Protected dashboard (redirect jika belum login)
- CRUD tasks: create, read, update, delete
- Task status: todo, in-progress, done (drag atau click to change)
- Filter by status, search by title
- Optimistic updates (UI update dulu, API menyusul)
- Proper error handling (token expired, network error, validation error)

**Requirements:**
- Backend: gunakan backend dari Phase 1, atau sediakan mock API
- Auth context/store dengan Zustand
- React Query untuk semua CRUD operations
- Toast notifications untuk feedback
- TypeScript strict
- Responsive
- Deploy ke Vercel

#### 11. `sk-api-docs.md` — Soft Skills
- Cara membaca API documentation (Swagger/OpenAPI)
- Cara test API dengan Postman/Insomnia sebelum coding frontend
- Menulis API request/response documentation untuk tim
- Communication: cara minta endpoint baru ke backend developer

#### 12. `gp-week4.md` — Group Project
**Project: Connect to Phase 1 Backend**
- Tim 3-4 orang (idealnya gabung dengan tim Phase 1 yang buat backend)
- Konek React frontend ke REST API yang dibangun di Phase 1
- Implementasi: auth flow + minimal 2 CRUD resources
- State management: Zustand + React Query
- Proper loading/error states
- Deploy: frontend ke Vercel, backend pastikan masih running di Railway/Render
- **Submission:** PR ke repo group project + presentasi demo 5 menit

### Week 4 — Final Assignment
Submit PR dengan "Authenticated CRUD App" (Logic Nolep terakhir) yang sudah complete + deployed ke Vercel. Include:
- Source code (clean, typed, well-structured)
- README with: setup instructions, API documentation, screenshots
- Live URL (Vercel deployment)
- Screenshot/recording demonstrating auth flow + CRUD operations

---

## Phase 2 Week 5: `phase-2-week5-fullstack-capstone`

### README.md Design (Indonesian, Wizard Theme)

```markdown
# Week5-Fullstack-Web-App-Capstone 🧙‍♂️🏆

Ini dia, Etherean — minggu terakhir Phase 2! Puncak dari Tower of Illusions!

Selama 9 minggu (Phase 1 + Phase 2), kalian sudah belajar dari nol:
- Phase 1: Backend — Node.js, Express, PostgreSQL, REST API, deployment
- Phase 2 Week 1-3: Frontend — HTML/CSS, React, Advanced React
- Phase 2 Week 4: Integration — State management, API connection, auth

Sekarang saatnya semua itu DIGABUNG menjadi satu aplikasi web yang utuh.
Ini bukan latihan lagi — ini adalah **portfolio project** kalian yang pertama.
Project yang bisa kalian tunjukkan ke recruiter, ke teman, ke dunia.

Minggu ini kalian akan:
- **Merencanakan** project dari nol (wireframe, feature list, tech stack)
- **Membangun** fullstack app lengkap (React + Express + PostgreSQL)
- **Men-deploy** ke production (Vercel + Railway)
- **Menulis test** (unit + integration)
- **Menyiapkan portfolio** (GitHub README yang keren, deployed demo)
- **Presentasi** di Demo Day! (10 menit per tim/individu)

Ini adalah ujian terakhir sebelum kalian memasuki **Tower of Chains (Phase 3)**
dimana kalian akan belajar blockchain dan smart contract. Buktikan bahwa kalian
sudah jadi **Fullstack Web Developer** yang sesungguhnya! 🚀

## Week 5 Study Material (Berurutan)

- [Project Planning & Wireframing](study-material/project-planning.md)
- [Fullstack Architecture Patterns](study-material/fullstack-architecture.md)
- [Logic Nolep: Mini Fullstack App](study-material/ln-mini-fullstack.md)
- [Testing Fundamentals](study-material/testing-fundamentals.md)
- [Deployment Pipeline](study-material/deployment-pipeline.md)
- [Logic Nolep: Deploy & Test](study-material/ln-deploy-test.md)
- [Soft Skills: Demo Day Preparation](study-material/sk-demo-day.md)
- [Portfolio Preparation](study-material/portfolio-prep.md)
- [Capstone Project Guidelines](study-material/capstone-project.md)

## Cara Pengerjaan

1. Fork repo ini ke akun GitHub pribadi kalian
2. Clone hasil fork ke local
3. Ikuti study material sebagai guide
4. Capstone project bisa individual atau tim (max 4 orang)
5. Submit via Pull Request + presentasi di Demo Day
```

### Study Materials Detail

#### 1. `project-planning.md`
- Dari ide ke implementasi: brainstorming → feature list → MVP scope
- User stories: "Sebagai [user], saya ingin [action], supaya [benefit]"
- Wireframing tools: Excalidraw, Figma (basics)
- Database schema design (review dari Phase 1)
- API endpoint planning (REST conventions)
- Project timeline: how to break down 1 week into milestones
- **Hands-on:** Buat wireframe + feature list untuk capstone project
- **Links:**
  - https://excalidraw.com/
  - https://www.figma.com/

#### 2. `fullstack-architecture.md`
- Monorepo vs separate repos (frontend + backend)
- Frontend ↔ Backend communication patterns
- Project structure best practices (both frontend and backend)
- Shared types between frontend and backend (TypeScript)
- Authentication flow end-to-end (register → login → protected routes → API auth middleware)
- File upload patterns (multer on backend, FormData on frontend)
- **Hands-on:** Setup monorepo structure untuk capstone project

#### 3. `ln-mini-fullstack.md` — Logic Nolep
**Scenario:** Buat "Notes App" fullstack dalam 2 hari:
- **Backend:** Express + PostgreSQL
  - CRUD endpoints: GET /notes, POST /notes, PUT /notes/:id, DELETE /notes/:id
  - Auth: register, login, JWT middleware
  - Each user only sees their own notes
- **Frontend:** React + Vite + Tailwind
  - Login/Register pages
  - Notes list with create, edit, delete
  - Markdown support (render markdown in notes)
  - React Query + Zustand
- **Deploy:** Frontend ke Vercel, Backend ke Railway

**Requirements:**
- TypeScript di kedua sisi
- Proper error handling
- Loading states
- Responsive design
- Deployed dan bisa diakses publik

#### 4. `testing-fundamentals.md`
- Kenapa testing penting (confidence, refactoring, documentation)
- Unit tests dengan Vitest: testing functions, hooks, components
- React Testing Library: render, screen, fireEvent, waitFor
- Integration tests: testing API endpoints dengan Supertest
- Test structure: Arrange → Act → Assert
- Mocking: API calls, modules, timers
- **Hands-on:** Tulis 5 unit tests + 2 integration tests untuk Notes App
- **Links:**
  - https://vitest.dev/
  - https://testing-library.com/docs/react-testing-library/intro/

#### 5. `deployment-pipeline.md`
- Vercel deployment untuk React frontend (connect GitHub, auto-deploy)
- Railway deployment untuk Express backend (connect GitHub, environment variables)
- PostgreSQL on Railway (provisioning, connection string)
- Environment variables management (production vs development)
- Custom domain setup (optional)
- CI/CD basics: GitHub Actions untuk auto-run tests on PR
- Monitoring basics: checking logs, uptime
- **Hands-on:** Deploy the Notes App end-to-end

#### 6. `ln-deploy-test.md` — Logic Nolep
**Scenario:** Ambil Notes App dari LN sebelumnya dan:
- Tulis minimum 8 tests (mix of unit + integration)
- Setup GitHub Actions: run tests on every PR
- Deploy ke production (Vercel + Railway)
- Buat proper README.md dengan:
  - Project description
  - Tech stack badges
  - Screenshot
  - Setup instructions (local development)
  - Live URL
  - API documentation (endpoints list)

**Requirements:**
- All tests passing
- GitHub Actions green badge
- Live URL accessible
- README complete dan professional

#### 7. `sk-demo-day.md` — Soft Skills
- Structuring a 10-minute project demo:
  1. Problem statement (1 min)
  2. Solution overview (1 min)
  3. Live demo (5 min)
  4. Technical architecture (2 min)
  5. Lessons learned (1 min)
- Live demo best practices (have a backup recording!)
- Handling Q&A confidently
- Body language dan public speaking tips
- **Hands-on:** Buat slide deck 10 slide untuk capstone presentation

#### 8. `portfolio-prep.md`
- GitHub profile README (how to make it stand out)
- Project README template yang professional
- Clean commit history (squash messy commits)
- Deployed demo yang actually works
- LinkedIn update: add project, skills, description
- Personal website / portfolio page (optional, bisa pakai template)
- **Hands-on:** Polish GitHub profile + project README

#### 9. `capstone-project.md` — Final Capstone
**Pilih salah satu project atau propose sendiri (dengan approval mentor):**

**Option A: E-Commerce Store**
- Product listing with categories and search
- Shopping cart (add, remove, update quantity)
- User auth (register, login, profile)
- Checkout flow (order summary, order history)
- Admin panel: manage products (CRUD)
- Backend: Express + PostgreSQL

**Option B: Social Media / Forum**
- User registration and profiles
- Create posts with text and images
- Like and comment on posts
- Follow/unfollow users
- News feed (posts from followed users)
- Backend: Express + PostgreSQL

**Option C: Project Management Tool**
- Create projects with multiple boards
- Kanban board with drag-and-drop cards
- Assign tasks to team members
- Due dates and status tracking
- Team invitation system
- Backend: Express + PostgreSQL

**Option D: Content Management System (CMS)**
- Rich text editor for creating articles
- Categories and tags
- Public blog view (SEO-friendly)
- Admin dashboard with analytics
- User roles (admin, editor, viewer)
- Backend: Express + PostgreSQL

**Option E: Custom Project (Propose)**
- Must include: auth, CRUD, minimum 3 database tables, deployment
- Submit proposal to mentor for approval within 2 days

**Capstone Requirements (All Options):**
- ✅ React + Vite + TypeScript (frontend)
- ✅ Express/Hono + TypeScript (backend)
- ✅ PostgreSQL (database)
- ✅ JWT Authentication
- ✅ React Query + Zustand for state management
- ✅ Tailwind CSS for styling
- ✅ Responsive design (mobile + desktop)
- ✅ Deployed: Vercel (frontend) + Railway (backend + database)
- ✅ README.md with: overview, screenshots, setup guide, live URL, API docs
- ✅ Minimum 8 tests (unit or integration)
- ✅ GitHub Actions: tests run on PR
- ✅ 10-minute presentation + live demo at Demo Day

**Submission:**
- PR ke repo capstone project
- Include live URL (both frontend and backend)
- Presentasi di Demo Day (jadwal ditentukan mentor)

**Grading Criteria:**
| Criteria | Weight |
|----------|--------|
| Functionality (features work end-to-end) | 30% |
| Code Quality (typed, clean, structured, both FE+BE) | 25% |
| UI/UX (responsive, polished, good loading/error states) | 15% |
| Testing (meaningful tests, CI passing) | 10% |
| Documentation (README, API docs, comments) | 10% |
| Presentation (demo, communication, Q&A) | 10% |

---

## Implementation Recommendations

### Repo Structure
Create two new repos matching the naming convention:
- `Ethereum-Jakarta/phase-2-week4-state-api`
- `Ethereum-Jakarta/phase-2-week5-fullstack-capstone`

### Technology Stack Summary
| Tool | Version | Purpose |
|------|---------|---------|
| React | v18+ | UI framework |
| Vite | v5.x | Build tool |
| TypeScript | v5.x | Type safety |
| Tailwind CSS | v3.x | Styling |
| Zustand | v4.x | Client state management |
| TanStack Query | v5.x | Server state / data fetching |
| React Router | v6.x | Client-side routing |
| Express/Hono | latest | Backend API |
| PostgreSQL | v15+ | Database |
| Prisma/Drizzle | latest | ORM (from Phase 1) |
| Vitest | latest | Unit/integration testing |
| React Testing Library | latest | Component testing |
| Vercel | — | Frontend deployment |
| Railway | — | Backend + DB deployment |

### Progression Flow
```
Phase 1 (Backend: Node/Express/PostgreSQL/REST API)
  → Phase 2 Week 1 (HTML/CSS/jQuery)
    → Phase 2 Week 2 (React Basics)
      → Phase 2 Week 3 (Advanced React)
        → Week 4 (State Management + API Integration — CONNECT FE to BE)
          → Week 5 (Fullstack Capstone — BUILD complete web app)
            → Phase 3 (Blockchain & Smart Contracts — Web3 starts here!)
```

Week 4-5 bridges Phase 1 backend skills with Phase 2 frontend skills into complete fullstack Web2 applications. Web3/blockchain integration begins in Phase 3.

---

## Summary

| Week | Title | Key Skills | Logic Nolep | Group/Final Project |
|------|-------|------------|-------------|-------------------|
| **4** | State Management + API Integration | React Context, Zustand, React Query, REST API integration, JWT auth, error handling | Data Dashboard, Authenticated CRUD App | Connect to Phase 1 Backend |
| **5** | Fullstack Web App Capstone | Project planning, fullstack architecture, testing, deployment, portfolio prep | Mini Fullstack App, Deploy & Test | Capstone (E-Commerce/Forum/PM Tool/CMS/Custom) |

With these two weeks, Phase 2 becomes a complete 5-week journey from HTML basics to fullstack Web2 development, perfectly bridging Phase 1 backend skills and preparing students for Phase 3's blockchain & smart contract development.

---

*Report generated by GRIMOIRE, Knowledge General of the Dominion* ⚔️📚
