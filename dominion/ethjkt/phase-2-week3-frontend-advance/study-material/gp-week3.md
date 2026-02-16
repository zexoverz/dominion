# 🏰 Group Project Week 3 — Team Dashboard App

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Grand Fortress**

## Project Brief

Selamat datang di **final group project** Week 3! Di quest ini, tim kamu bakal build sebuah **Team Dashboard Application** yang menggabungkan semua konsep yang udah dipelajari sepanjang minggu ini.

Dashboard ini bakal jadi "command center" buat sebuah team — bisa manage members, track tasks, liat analytics, dan collaborate. Think of it as a mini Notion/Linear.

## Objectives

Setelah menyelesaikan project ini, kamu bakal:
- ✅ Mampu build full-stack React application
- ✅ Implement authentication flow
- ✅ Manage complex state
- ✅ Write clean, tested, reviewable code
- ✅ Collaborate effectively using Git

## Tech Stack (Wajib)

| Layer | Tool |
|-------|------|
| Build Tool | **Vite** |
| Framework | **React + TypeScript** |
| Routing | **React Router** or **TanStack Router** |
| Data Fetching | **TanStack Query** or **RTK Query** |
| State Management | **Zustand** or **Redux Toolkit** |
| Authentication | **Clerk** |
| Styling | **Tailwind CSS** (recommended) |
| Testing | **Cypress** (minimal 5 E2E tests) |
| Version Control | **Git + GitHub** (PR-based workflow) |

## Requirements

### Core Features (Wajib — 70% dari nilai)

#### 1. Authentication (15%)
- [ ] Sign up / Sign in dengan Clerk
- [ ] Protected routes — dashboard hanya bisa diakses setelah login
- [ ] User profile page dengan avatar dan info
- [ ] Sign out functionality

#### 2. Dashboard Home (15%)
- [ ] Welcome message dengan nama user
- [ ] Summary cards (total members, active tasks, completed tasks)
- [ ] Recent activity feed
- [ ] Responsive layout (mobile + desktop)

#### 3. Team Members Page (15%)
- [ ] List semua team members (fetch dari API/mock)
- [ ] Search/filter members by name atau role
- [ ] Member detail view
- [ ] Loading states dan error handling

#### 4. Task Management (15%)
- [ ] Create new task (form dengan validation)
- [ ] List tasks dengan status (To Do, In Progress, Done)
- [ ] Update task status (drag-and-drop BONUS, atau dropdown)
- [ ] Delete task dengan confirmation
- [ ] Assign task ke team member

#### 5. State Management (10%)
- [ ] Global state pake Zustand atau Redux Toolkit
- [ ] Persistent state (localStorage) buat user preferences
- [ ] Proper loading/error/success states
- [ ] No unnecessary re-renders

### Bonus Features (30% dari nilai)

#### 6. Testing (10%)
- [ ] Minimal 5 Cypress E2E tests
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test error states
- [ ] CI pipeline dengan GitHub Actions

#### 7. Advanced Features (10%)
- [ ] Dark/light mode toggle (persisted)
- [ ] Real-time notifications (mock atau WebSocket)
- [ ] Data visualization (charts/graphs)
- [ ] Keyboard shortcuts
- [ ] Pagination atau infinite scroll

#### 8. Code Quality (10%)
- [ ] Clean PR history (meaningful commit messages)
- [ ] Code review evidence (comments di PRs)
- [ ] Consistent code style (ESLint + Prettier configured)
- [ ] TypeScript strict mode — no `any`!
- [ ] README yang lengkap

## API / Data Source

Kamu boleh pilih salah satu:

### Option A: Mock Data + JSON Server

```bash
npm install -D json-server
```

```json
// db.json
{
  "members": [
    { "id": "1", "name": "Arcane Mage", "role": "Frontend", "avatar": "🧙" },
    { "id": "2", "name": "Shield Bearer", "role": "Backend", "avatar": "🛡️" }
  ],
  "tasks": [
    { "id": "1", "title": "Setup Vite project", "status": "done", "assignee": "1" },
    { "id": "2", "title": "Implement auth", "status": "in-progress", "assignee": "2" }
  ]
}
```

```bash
npx json-server db.json --port 3001
```

### Option B: Express Backend

Bikin simple Express API dengan in-memory data atau SQLite. Lebih challenging tapi lebih realistic.

### Option C: Firebase/Supabase

Pake BaaS (Backend as a Service) buat real persistent data. Paling realistic tapi scope bisa membesar — manage with care.

## Project Structure (Recommended)

```
team-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI (Button, Card, Modal, etc.)
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── features/        # Feature-specific components
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── MembersPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand/Redux stores
│   ├── services/            # API calls
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   ├── App.tsx
│   └── main.tsx
├── cypress/
│   └── e2e/                 # E2E tests
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── pull_request_template.md
├── .eslintrc.json
├── .prettierrc
├── README.md
└── package.json
```

## Git Workflow

### Branching Strategy: GitHub Flow

```
main (protected) ──────────────────────►
  │          │          │          │
  └── feat/auth   fix/nav   feat/tasks
       │          │          │
       └── PR ────└── PR ────└── PR
```

### Rules

1. **`main` branch is protected** — no direct push
2. **All changes via PR** — minimal 1 reviewer
3. **Conventional commits** — `feat:`, `fix:`, `refactor:`, etc.
4. **PR description template** — isi lengkap
5. **Review sebelum merge** — practice code review skills

### Setup Branch Protection

Di GitHub repo → Settings → Branches → Add rule:
- Branch name: `main`
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass (kalau ada CI)
- ✅ Require conversation resolution

## Grading Criteria

| Category | Weight | Criteria |
|----------|--------|----------|
| **Core Features** | 40% | All 5 core features working correctly |
| **Code Quality** | 20% | Clean code, proper TypeScript, no hacks |
| **Collaboration** | 15% | PR history, code reviews, fair contribution |
| **Testing** | 10% | Cypress tests, CI pipeline |
| **UI/UX** | 10% | Responsive, polished, good UX |
| **Bonus Features** | 5% | Extra credit for going above and beyond |

### Grading Rubric Detail

**A (90-100):** Semua core features done, bonus features ada, clean code, great collaboration evidence, comprehensive tests, polished UI.

**B (75-89):** Semua core features done, code quality bagus, some tests, decent collaboration, minor UI issues.

**C (60-74):** Most core features done, some code quality issues, minimal tests, basic collaboration.

**D (< 60):** Major features missing, poor code quality, no tests, poor collaboration evidence.

## Timeline

### Day 1-2: Setup & Foundation
- [ ] Create repo, invite team members
- [ ] Setup Vite + all dependencies
- [ ] Configure ESLint, Prettier, Tailwind
- [ ] Setup Clerk authentication
- [ ] Create basic layout (Sidebar + Header)
- [ ] Setup routing
- [ ] Bagi tugas lewat GitHub Issues

### Day 3-4: Core Features
- [ ] Implement Dashboard Home
- [ ] Implement Members page (CRUD)
- [ ] Implement Tasks page (CRUD)
- [ ] Setup state management
- [ ] Connect ke API/mock data
- [ ] Daily standup: share progress, blocker

### Day 5-6: Polish & Testing
- [ ] Write Cypress E2E tests
- [ ] Fix bugs dari code review
- [ ] Add loading/error states
- [ ] Responsive design check
- [ ] Setup CI pipeline
- [ ] Bonus features (kalau waktu cukup)

### Day 7: Presentation
- [ ] Final bug fixes
- [ ] Update README
- [ ] Prepare demo
- [ ] Present ke class!

## Presentation Format

Tiap tim punya **10 menit**:
- **3 min** — Demo app (live demo, bukan slides)
- **3 min** — Technical walkthrough (architecture, interesting code)
- **2 min** — Collaboration process (show PRs, reviews, Git graph)
- **2 min** — Q&A

## Team Roles (Suggested)

Buat tim 3-4 orang:

| Role | Responsibility |
|------|---------------|
| **Tech Lead** | Architecture decisions, code review, merge conflicts |
| **Frontend Lead** | UI/UX, component library, responsive design |
| **Feature Dev** | Core feature implementation |
| **QA/DevOps** | Testing, CI/CD, documentation |

> Semua orang harus **code**. Roles ini cuma buat ownership, bukan exclusive responsibility.

## Tips Sukses

1. **Start simple** — Get basic CRUD working first, polish later
2. **Communicate daily** — Quick standup (even async di Discord/WA group)
3. **Small PRs** — Easier to review, less conflicts
4. **Don't hero code** — Collaboration > individual output
5. **Ask for help** — Stuck > 30 menit? Ask teammate or mentor
6. **Git commit often** — Atomic commits, meaningful messages
7. **Have fun!** — This is practice for real-world team work

## README Template

```markdown
# 🏰 [Team Name] — Team Dashboard

## Team Members
- Member 1 — [GitHub](link) — Role
- Member 2 — [GitHub](link) — Role
- Member 3 — [GitHub](link) — Role

## Live Demo
[Link to deployed app]

## Tech Stack
- Vite + React + TypeScript
- Clerk (Auth)
- Zustand (State)
- TanStack Query (Data Fetching)
- Tailwind CSS
- Cypress (Testing)

## Getting Started

\```bash
git clone [repo-url]
cd team-dashboard
npm install
cp .env.example .env.local
# Fill in env vars
npm run dev
\```

## Features
- ✅ Feature 1
- ✅ Feature 2
- 🚧 Feature 3 (in progress)

## Screenshots
[Add screenshots here]

## Architecture
[Brief description or diagram]
```

## 🎯 Final Words

Ini bukan cuma coding exercise — ini **simulasi real-world team development**. Di dunia kerja (apalagi di web3), kamu bakal selalu kerja di team. Communication, code review, dan collaboration itu sama pentingnya dengan technical skills.

Good luck, adventurers! May your code compile and your PRs get approved on first review! ⚔️

---

> 🏰 *"Fortress yang paling kuat dibangun bukan oleh satu mage yang powerful, tapi oleh guild yang solid dan terkoordinasi."* — ETHJKT Arcane Wisdom
