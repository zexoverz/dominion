# 📚 Study Material 01 — Teamwork & Git Collaboration

> **"Git itu gampang kalo sendirian. Tapi begitu 4 orang push ke repo yang sama? Welcome to merge conflict hell. Makanya kita belajar ini SEBELUM mulai coding."**

---

## 🎯 Learning Objectives

Setelah baca materi ini, kalian bakal bisa:
- Setup branching strategy yang proper buat tim
- Bikin dan review Pull Request yang berkualitas
- Handle merge conflicts tanpa panik
- Pake conventional commits yang konsisten
- Split kerjaan di tim secara efektif
- Jalanin async standup dan komunikasi tim

---

## 1. Branching Strategy

### Kenapa Butuh Strategy?

Bayangin 4 orang push langsung ke `main`. Person A push code yang break Person B punya. Person C merge conflict sama Person D. Chaos.

**Branching strategy** itu aturan main: siapa bikin branch apa, merge ke mana, kapan merge ke `main`.

### GitFlow (Simplified)

Buat project kalian, gua recommend simplified GitFlow:

```
main                  ← Production-ready code. JANGAN push langsung.
├── develop           ← Integration branch. Semua feature merge ke sini.
│   ├── feature/auth              ← Person A
│   ├── feature/products          ← Person B
│   ├── feature/admin-panel       ← Person C
│   └── feature/realtime          ← Person D
│
├── hotfix/critical-bug           ← Emergency fix langsung ke main
└── release/v1.0                  ← Prep release (optional)
```

### Branch Naming Convention

```bash
# Format: type/short-description
feature/auth-login
feature/product-crud
feature/admin-dashboard
feature/websocket-notifications

fix/login-redirect-bug
fix/cors-config

hotfix/production-crash

chore/update-dependencies
chore/ci-pipeline
```

### Rules

1. **`main` is sacred** — Protected branch. No direct push. Only merge dari `develop` (atau hotfix).
2. **`develop` is integration** — Semua feature branch merge ke sini via PR.
3. **Feature branches pendek** — Idealnya 1-3 hari. Jangan develop 1 minggu baru merge.
4. **Delete branch setelah merge** — Keep repo clean.

### Setup Branch Protection di GitHub

```
Settings → Branches → Add rule

Branch name pattern: main
✅ Require a pull request before merging
✅ Require approvals (1)
✅ Dismiss stale pull request approvals when new commits are pushed
✅ Require status checks to pass before merging (kalau udah setup CI)
```

Lakukan hal yang sama untuk `develop` — tapi approvals boleh lebih relaxed.

---

## 2. Pull Request (PR) Workflow

### Anatomy of a Good PR

PR itu bukan cuma "merge my code". PR adalah **komunikasi**. Lo kasih tau tim: ini yang gue ubah, ini kenapa, ini cara test-nya.

```markdown
## What
Add user authentication with JWT (login, register, protected routes)

## Why
Auth is the foundation — other features depend on knowing who the user is.

## How
- Added `/api/auth/register` and `/api/auth/login` endpoints
- JWT access token (15min) + refresh token (7 days)
- Auth middleware for protected routes
- Prisma User model with bcrypt password hashing

## Testing
- [x] Register with valid data → 201
- [x] Register with existing email → 409
- [x] Login with valid creds → JWT returned
- [x] Login with wrong password → 401
- [x] Access protected route without token → 401
- [x] Access protected route with valid token → 200

## Screenshots
[kalau ada UI changes, tambahin screenshot]
```

### PR Size

**Keep PRs small.** Kalau PR lo 50+ files changed, itu terlalu gede. Pecah jadi beberapa PR.

| PR Size | Files Changed | Verdict |
|---------|--------------|---------|
| 🟢 Small | 1-10 | Perfect. Easy to review. |
| 🟡 Medium | 10-25 | OK. Mungkin bisa dipecah. |
| 🔴 Large | 25+ | Terlalu gede. Pecah jadi smaller PRs. |

### How to Review a PR

Sebagai reviewer, lo cek:

1. **Does it work?** — Pull branch-nya, run locally, test manual
2. **Code quality** — Clean? Readable? TypeScript types proper?
3. **Architecture** — Folder structure consistent? Patterns followed?
4. **Edge cases** — Error handling? Validation? Empty states?
5. **Performance** — Any obvious N+1 queries? Unnecessary re-renders?

**Review comments etiquette:**

```
✅ "Consider using useMemo here since this calculation is expensive"
✅ "Nit: typo in variable name 'usre' → 'user'"
✅ "Could we add error handling for the case where the product doesn't exist?"

❌ "This is wrong" (gak helpful — explain kenapa dan suggest fix)
❌ "I would do it differently" (kalau approach-nya work, don't block)
```

### Review Labels

Pake prefix biar jelas intent-nya:

- `[BLOCKER]` — Harus fix sebelum merge
- `[SUGGESTION]` — Nice to have tapi gak mandatory
- `[NIT]` — Minor style issue
- `[QUESTION]` — Gue gak ngerti, bisa explain?

### Merge Strategy

Pilih satu dan **konsisten**:

| Strategy | Command | Best For |
|----------|---------|----------|
| **Merge commit** | `git merge` | Default. Keeps full history. |
| **Squash merge** | Squash and merge | Clean history. 1 PR = 1 commit di develop. |
| **Rebase** | `git rebase` | Linear history. Advanced. |

**Recommendation:** Squash merge buat feature → develop. Regular merge buat develop → main.

---

## 3. Merge Conflicts

### Kenapa Terjadi?

Merge conflict terjadi kalau 2+ orang edit **baris yang sama** di **file yang sama**. Git gak tau mana yang bener, jadi minta lo resolve manual.

### Cara Minimize Conflicts

1. **Pull `develop` sering** — Sebelum mulai kerja hari ini:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git merge develop
   ```
   Lebih baik resolve conflict kecil tiap hari daripada conflict raksasa di akhir.

2. **Jangan edit file yang sama** — Pembagian tugas yang jelas:
   - Person A owns `src/pages/auth/*`
   - Person B owns `src/pages/products/*`
   - Shared files (`types.ts`, `api.ts`) → 1 orang jadi "owner", yang lain PR ke dia

3. **Small, frequent merges** — Merge feature branch ke develop setiap 1-2 hari.

### Cara Resolve Conflicts

```bash
# Saat merge develop ke feature branch
git merge develop

# Git bilang ada conflict:
# CONFLICT (content): Merge conflict in src/lib/api.ts

# Buka file, cari markers:
<<<<<<< HEAD
// Your code
const API_URL = '/api/v1';
=======
// Their code
const API_URL = process.env.VITE_API_URL;
>>>>>>> develop

# Pilih mana yang bener (atau gabungin):
const API_URL = process.env.VITE_API_URL || '/api/v1';

# Mark as resolved
git add src/lib/api.ts
git commit -m "fix: resolve merge conflict in api.ts"
```

### Pro Tips

- **Jangan panik.** Conflict itu normal. Bukan error. Bukan bug.
- **Communicate.** "Hey, gue lagi edit `api.ts`, lo jangan edit dulu ya."
- **Use VS Code merge editor** — visual, lebih gampang dari terminal.
- **Kalau ragu, tanya.** Jangan asal resolve — bisa break orang lain punya code.

---

## 4. Commit Conventions

### Conventional Commits

Format: `type(scope): description`

```bash
feat(auth): add login and register endpoints
feat(products): implement product CRUD with pagination
fix(cart): fix quantity update not reflecting in total
fix(auth): handle expired refresh token properly
docs(readme): add setup instructions and ERD
style(ui): fix button alignment on mobile
refactor(api): extract axios instance to separate module
test(auth): add unit tests for login controller
chore(deps): update React to v19
chore(ci): add GitHub Actions workflow
```

### Types

| Type | Kapan |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no code change) |
| `refactor` | Code restructure (no new feature, no bug fix) |
| `test` | Adding/updating tests |
| `chore` | Build process, dependencies, tooling |

### Bad vs Good Commits

```bash
# ❌ BAD
git commit -m "fix"
git commit -m "update"
git commit -m "asdfgh"
git commit -m "WIP"
git commit -m "fix bug" # bug apa?

# ✅ GOOD
git commit -m "fix(auth): return 401 instead of 500 on invalid token"
git commit -m "feat(admin): add user management table with pagination"
git commit -m "refactor(api): move error handling to centralized middleware"
```

### Commit Frequency

- **Commit sering** — setiap fitur kecil yang work, commit.
- **Jangan commit code yang break** — at least `npm run build` harus pass.
- **1 commit = 1 logical change** — jangan mix 3 fitur dalam 1 commit.

---

## 5. Code Ownership

### Apa Itu?

Code ownership = siapa yang **responsible** buat bagian code tertentu. Bukan berarti cuma dia yang boleh edit, tapi dia yang:
- Review semua PR yang touch area itu
- Maintain quality di area itu
- Jadi go-to person kalau ada bug di area itu

### Cara Assign Ownership

```markdown
## Team Charter — Code Ownership

| Area | Owner | Files |
|------|-------|-------|
| Authentication | Person A | `src/**/auth*`, `middleware/auth.ts` |
| Product/Core Features | Person B | `src/**/product*`, `src/**/order*` |
| Admin Panel | Person C | `src/**/admin*`, `controllers/admin*` |
| Real-time + Infra | Person D | `src/**/socket*`, `prisma/`, CI/CD |
| Shared Components | Person A (lead) | `src/components/ui/*` |
```

### CODEOWNERS File (GitHub)

Bikin file `.github/CODEOWNERS`:

```
# Auth
apps/backend/src/controllers/auth* @person-a
apps/backend/src/middleware/auth* @person-a
apps/frontend/src/pages/auth* @person-a

# Products
apps/backend/src/controllers/product* @person-b
apps/frontend/src/pages/product* @person-b

# Admin
apps/*/src/**/admin* @person-c

# Socket/Real-time
apps/backend/src/socket/ @person-d
```

GitHub bakal otomatis assign reviewer berdasarkan file yang di-touch.

---

## 6. Pembagian Kerja yang Efektif

### Strategy: Feature-Based Split

Jangan split by "frontend" vs "backend". Split by **feature** — 1 orang own 1 feature end-to-end (FE + BE).

```
Person A: Auth + User Management (FE + BE)
Person B: Core Feature 1 (e.g., Products) (FE + BE)
Person C: Core Feature 2 (e.g., Orders) + Admin Panel
Person D: Real-time (WebSocket) + File Uploads + CI/CD
```

**Kenapa?**
- Gak ada blocking — Person A gak perlu nunggu Person B bikin API dulu
- Ownership jelas — kalau ada bug di products, tanya Person B
- Faster iteration — 1 orang bisa iterate end-to-end tanpa koordinasi

### Foundation First

Sebelum split, build foundation **bareng-bareng** (Day 1-2):
- Auth system (1 person leads, others review)
- Database schema + Prisma setup
- Base layout (header, sidebar, routing)
- Shared types/interfaces
- API client setup (Axios instance)

Setelah foundation ready, baru split ke feature branches.

### Interface Contract

SEBELUM mulai parallel development, define **API contract**:

```typescript
// types/api.ts — agreed by ALL members
interface Product {
  id: number;
  title: string;
  price: number;
  seller: Pick<User, 'id' | 'name' | 'avatar'>;
  images: string[];
  status: 'ACTIVE' | 'PENDING' | 'REJECTED';
}

// API endpoints contract
// GET /api/products → Product[]
// POST /api/products → Product (body: CreateProductDTO)
// PUT /api/products/:id → Product (body: UpdateProductDTO)
// DELETE /api/products/:id → void
```

Kalau semua sepakat di interface, frontend bisa develop pake **mock data** tanpa nunggu backend ready.

---

## 7. Komunikasi Tim

### Async Standup

Gak perlu meeting tiap hari. Cukup kirim **async standup** di grup chat (Discord/WA) setiap pagi:

```
🟢 Standup — [Nama] — [Tanggal]

✅ Kemarin:
- Setup auth endpoints (register, login)
- Added JWT middleware

📋 Hari ini:
- Protected routes
- Refresh token flow

🚧 Blockers:
- Butuh database schema finalized buat user roles
```

**Rules:**
- Post sebelum mulai kerja hari itu
- Keep it short — 3-5 bullet points max
- Kalau ada blocker, **tag orang yang bisa bantu**

### Communication Tools

| Tool | Untuk |
|------|-------|
| **Discord/WA Group** | Daily standup, quick questions, casual chat |
| **GitHub Issues** | Task tracking, bug reports, feature requests |
| **GitHub PR Comments** | Code review, technical discussion |
| **Video Call** | Complex discussions, pair programming, demo prep |

### When to Sync vs Async

| Situation | Async (chat) | Sync (call) |
|-----------|-------------|-------------|
| Status update | ✅ | ❌ |
| Quick question | ✅ | ❌ |
| Architecture decision | ❌ | ✅ |
| Merge conflict help | ❌ | ✅ |
| Demo preparation | ❌ | ✅ |
| Bug investigation | Depends | If complex, yes |

### Conflict Resolution

Disagreement itu normal. Ini cara handle:

1. **State your case** — explain kenapa approach lo lebih baik (with reasons, bukan ego)
2. **Listen** — genuinely consider the other approach
3. **Compromise or vote** — kalau gak bisa sepakat, vote. Majority wins.
4. **Move on** — once decided, commit to it. Jangan sabotage.
5. **Escalate to mentor** — kalau beneran deadlock

---

## 8. Useful Git Commands for Teams

```bash
# See who wrote what
git blame src/controllers/auth.ts

# See commit history per person
git shortlog -sn --all

# See what branches exist
git branch -a

# See graph of commits
git log --oneline --graph --all

# Stash changes before switching branch
git stash
git checkout develop
git pull
git checkout feature/my-feature
git stash pop

# Interactive rebase to clean up commits before PR
git rebase -i HEAD~5

# Cherry pick specific commit
git cherry-pick abc1234

# Reset branch to match develop
git checkout feature/my-feature
git reset --hard develop
```

---

## 9. GitHub Projects (Optional tapi Recommended)

Pake **GitHub Projects** buat track tasks:

1. Go to repo → Projects → New Project
2. Pilih "Board" template
3. Columns: **Backlog | To Do | In Progress | Review | Done**
4. Bikin Issues buat setiap task
5. Assign ke member
6. Link Issues ke PRs

Ini bikin transparent siapa ngerjain apa, apa yang udah selesai, apa yang masih pending.

---

## 10. Checklist Sebelum Mulai Coding

- [ ] Semua member punya akses ke repo (collaborator)
- [ ] Branch protection enabled di `main` (dan `develop`)
- [ ] CODEOWNERS file created
- [ ] Commit convention disepakati (conventional commits)
- [ ] Communication channel established (Discord/WA group)
- [ ] Task board setup (GitHub Projects / Notion)
- [ ] API contract/interfaces defined
- [ ] Code ownership assigned
- [ ] ESLint + Prettier + Husky configured (lihat Study Material 02)

---

> **"Tim yang komunikasinya bagus bisa ship project yang biasa-biasa aja jadi luar biasa. Tim yang komunikasinya jelek bisa bikin project yang harusnya gampang jadi gagal total. Communication is the REAL skill."**
