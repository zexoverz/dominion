# 📋 WEEK 5 — FINAL SUBMISSION CHECKLIST

> **"Gua udah liat terlalu banyak project bagus yang GAGAL di submission cuma gara-gara lupa hal kecil. Checklist ini bakal jadi safety net kalian. JANGAN SKIP SATUPUN."**

---

## 🎯 Overview

Oke, jadi kalian udah coding selama berminggu-minggu. Capstone udah hampir jadi. Sekarang pertanyaannya: **udah bener-bener SIAP belum buat di-submit?**

Gua bikin checklist ini bukan buat bikin hidup kalian susah — tapi buat **mastiin kalian gak kehilangan poin gara-gara hal bodoh**. Gua pernah liat project yang functionality-nya keren banget, tapi dapet nilai jelek karena README-nya kosong. Atau test-nya cuma 3. Atau deploy-nya broken pas hari presentasi.

**JANGAN jadi orang itu.**

Checklist ini dibagi jadi beberapa section. Setiap item ada checkbox-nya. Kalian HARUS bisa centang SEMUA sebelum submit. Kalau ada yang gak bisa di-centang, itu berarti **project kalian belum selesai**.

---

## ✅ SECTION 1: Code Quality & Tooling

### ESLint + Prettier

- [ ] ESLint installed dan configured (`eslint.config.js` atau `.eslintrc`)
- [ ] Prettier installed dan configured (`.prettierrc`)
- [ ] ESLint + Prettier gak conflict (pakai `eslint-config-prettier`)
- [ ] `npm run lint` jalan **tanpa error** (warning boleh, error TIDAK)
- [ ] `npm run format` bisa auto-format semua file
- [ ] Kedua tool terpasang di **frontend DAN backend**

```json
// Recommended .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

Kenapa ini penting? Karena di dunia kerja, **code yang gak consistent formatnya = red flag**. Recruiter buka repo kalian, liat ada tab campur space, single quote campur double quote — langsung close tab. Serius.

### TypeScript Strict Mode

- [ ] `tsconfig.json` ada `"strict": true`
- [ ] ZERO `any` type di codebase (atau minimal banget dengan comment justifikasi)
- [ ] Semua function punya return type yang explicit
- [ ] Semua props/params punya type definition
- [ ] Shared types ada di folder `types/` atau `shared/`
- [ ] No `@ts-ignore` tanpa comment penjelasan

```json
// tsconfig.json minimum
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

Gua tau strict mode bikin hidup lebih susah. Tapi itu pointnya — **kalau TypeScript-nya strict dan code kalian compile clean, itu BUKTI kalian ngerti type system**. Itu yang bikin recruiter impressed.

---

## ✅ SECTION 2: Responsive Design

### Mobile-First Testing

- [ ] Buka app di Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- [ ] Test di viewport 375px (iPhone SE) — **semua content readable, gak overflow**
- [ ] Test di viewport 768px (iPad) — layout adjust properly
- [ ] Test di viewport 1024px+ (Desktop) — full layout, no wasted space
- [ ] Navigation works di mobile (hamburger menu atau bottom nav)
- [ ] Forms usable di mobile (input gak terlalu kecil, button reachable)
- [ ] Tables responsive (horizontal scroll atau card view di mobile)
- [ ] Modal/dialog gak overflow di mobile
- [ ] Toast/notification visible dan gak blocking content

### Quick Test Routine

```
1. Buka deployed URL di HP kalian sendiri
2. Coba SEMUA fitur utama dari HP
3. Minta 2 teman buka di HP mereka (different device)
4. Screenshot setiap halaman di mobile view
5. Simpen screenshot buat README
```

Kenapa gua maksa soal responsive? Karena **interviewer PASTI buka portfolio kalian di HP**. Mereka lagi di bus, lagi makan, scroll LinkedIn, klik link portfolio kalian — dan kalau broken di mobile, **bye bye opportunity**.

---

## ✅ SECTION 3: Loading & Error States

### Loading States

- [ ] Skeleton loader atau spinner saat fetch data pertama kali
- [ ] Button loading state saat submit form (disabled + spinner)
- [ ] Page-level loading saat route change
- [ ] Optimistic update di tempat yang masuk akal (like, bookmark, etc)
- [ ] Gak ada flash of empty content sebelum data load

### Error States

- [ ] API error di-handle gracefully (gak cuma blank screen)
- [ ] Error boundary di React (`ErrorBoundary` component)
- [ ] Form validation errors tampil jelas (field-level, bukan cuma alert)
- [ ] 404 page yang proper (bukan default browser error)
- [ ] Network error handling (offline state, retry button)
- [ ] Toast notification buat success/error actions

```tsx
// Minimum error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

Ini bedanya **project bootcamp** sama **production app**. App yang cuma work di happy path = project latihan. App yang handle semua edge case = **portfolio piece**.

---

## ✅ SECTION 4: Testing

### Minimum Requirements

- [ ] **15+ tests total** (ini MINIMUM, lebih banyak lebih bagus)
- [ ] Unit tests untuk utility functions dan helpers
- [ ] Integration tests untuk API endpoints (min 5)
- [ ] Component tests untuk critical UI components (min 5)
- [ ] E2E tests untuk main user flows (min 3)
- [ ] `npm test` atau `npm run test` pass SEMUA
- [ ] Test coverage report available (`--coverage`)

### Test Distribution Recommendation

```
Backend (Vitest):
├── Auth endpoints (register, login, logout)     → 3 tests min
├── CRUD endpoints (main resource)                → 4 tests min
├── Middleware (auth, validation)                  → 2 tests min
└── Utility functions                             → 2 tests min

Frontend (Vitest + React Testing Library):
├── Form components (validation, submit)          → 3 tests min
├── Data display components (loading, error, data)→ 2 tests min
└── Custom hooks                                  → 2 tests min

E2E (Playwright):
├── Authentication flow                           → 1 test min
├── Main CRUD flow                                → 1 test min
└── Navigation/routing                            → 1 test min
```

Tips dari gua: **tulis test SEBELUM deadline, bukan H-1**. Kalau kalian nulis test di menit terakhir, test-nya bakal asal-asalan dan gak meaningful. Tulis test selama development — itu jauh lebih gampang dan hasilnya lebih bagus.

---

## ✅ SECTION 5: CI/CD Pipeline

### GitHub Actions

- [ ] `.github/workflows/ci.yml` exist dan BERJALAN
- [ ] Pipeline run on every push ke `main` dan setiap PR
- [ ] Steps minimal: install → lint → type-check → test → build
- [ ] **Badge status GREEN** ✅ di latest commit
- [ ] Build time reasonable (< 5 menit)
- [ ] Environment variables configured di GitHub Secrets

```yaml
# Minimum CI workflow
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

- [ ] Kalau punya separate frontend/backend, pipeline cover KEDUANYA
- [ ] No hardcoded secrets di code (check git history juga!)

---

## ✅ SECTION 6: Deployment

### Frontend → Vercel

- [ ] Deployed dan accessible via public URL
- [ ] Environment variables set di Vercel dashboard
- [ ] Custom domain (optional tapi POIN PLUS BESAR)
- [ ] Build succeeds di Vercel (check deploy logs)
- [ ] All routes work (termasuk direct URL access, bukan cuma navigate)
- [ ] API calls pointing ke production backend URL (bukan localhost!)

### Backend → Railway

- [ ] Deployed dan accessible via public URL
- [ ] PostgreSQL database provisioned di Railway
- [ ] Environment variables set (DATABASE_URL, JWT_SECRET, etc)
- [ ] Prisma migrations applied di production DB
- [ ] Health check endpoint works (`GET /api/health` → 200)
- [ ] CORS configured buat production frontend URL
- [ ] No `console.log` spam di production (pakai proper logger)

### Post-Deploy Verification

```
1. Buka frontend URL → halaman load?
2. Register user baru → berhasil?
3. Login → token disimpan?
4. CRUD operations → data persist?
5. Logout → session cleared?
6. Refresh page → masih authenticated?
7. Buka di incognito → public routes work?
```

**TEST DEPLOY KALIAN SEKARANG.** Jangan tunggu hari H. Gua serius — 50% masalah capstone yang gua liat itu deploy-related. Database connection timeout, CORS error, environment variable missing. Fix sekarang, bukan pas presentasi.

---

## ✅ SECTION 7: README & Documentation

### README.md Must-Have

- [ ] **Project title** yang catchy (bukan "my-app" atau "capstone-project")
- [ ] **Badges** — CI status, deploy status, tech stack badges
- [ ] **Screenshot/GIF** dari app yang running (min 3 screenshots)
- [ ] **Live URL** — link ke deployed app yang WORKS
- [ ] **Tech stack** — list semua technology yang dipakai
- [ ] **Features** — bullet list semua fitur
- [ ] **Getting started** — clone, install, env setup, run
- [ ] **API documentation** — endpoint list dengan method + path + description
- [ ] **Database schema** — ERD diagram atau table list
- [ ] **Project structure** — folder tree
- [ ] **Testing** — how to run tests
- [ ] **Contributing** (optional tapi professional)
- [ ] **License**

```markdown
<!-- Badge examples -->
![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://img.shields.io/badge/deploy-live-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
```

### Screenshot Guide

```
1. Buka app di browser, full screen
2. Gunakan Chrome DevTools → Screenshot (Ctrl+Shift+P → "screenshot")
3. Capture: Landing page, Dashboard, Main feature, Mobile view
4. Optimize images (tinypng.com)
5. Taruh di folder /docs/screenshots/
6. Reference di README dengan relative path
```

README kalian itu **halaman landing portfolio**. Recruiter gak bakal clone repo kalian dan run locally — mereka cuma baca README. Kalau README-nya bagus, mereka klik live URL. Kalau live URL-nya works, mereka consider kalian. **README = first impression.**

---

## ✅ SECTION 8: Presentation Prep

### Sebelum Demo Day

- [ ] **Practice presentasi 3x minimum** (timer 10 menit)
- [ ] Practice di depan teman/mirror/kamera
- [ ] **Script talking points** (jangan hafalin, tapi tau flow-nya)
- [ ] Prepare jawaban buat common questions:
  - "Kenapa pilih tech stack ini?"
  - "Apa challenge terbesar?"
  - "Kalau dikasih waktu lebih, mau tambahin apa?"
  - "Gimana handle authentication?"
  - "Testing strategy-nya gimana?"

### Demo Flow (10 menit)

```
[0:00 - 1:00] Intro — Nama project, problem yang di-solve
[1:00 - 2:00] Tech stack overview — Architecture diagram
[2:00 - 6:00] LIVE DEMO — Main features, happy path
[6:00 - 7:30] Code walkthrough — 1-2 interesting implementations
[7:30 - 8:30] Testing & deployment — Show CI/CD, show tests passing
[8:30 - 10:00] Lessons learned + Q&A
```

### Backup Plan

- [ ] **RECORD demo video** sebagai backup (Loom/OBS, 5-10 menit)
- [ ] Save video file AND upload ke YouTube (unlisted)
- [ ] Test screen sharing SEBELUM hari H
- [ ] Prepare offline screenshots kalau internet mati
- [ ] Have deployed URL ready (copy paste, jangan ketik manual)
- [ ] Browser tabs pre-opened: Live app, GitHub repo, CI/CD dashboard

Kenapa backup recording? Karena **Murphy's Law is real**. Internet bisa mati. Deploy bisa down. Laptop bisa crash. Kalau kalian punya video recording, kalian masih bisa presentasi. Tanpa backup? Kalian cuma bisa nangis.

---

## ✅ SECTION 9: Final Polish

### Before Submit — Last Sweep

- [ ] Remove semua `console.log` yang gak perlu
- [ ] Remove semua commented-out code
- [ ] Remove semua TODO comments (kerjain atau hapus)
- [ ] Check for hardcoded values (API URLs, secrets)
- [ ] Git history clean (no "fix" "fix2" "fix again" commits — squash kalau perlu)
- [ ] `.env.example` file ada di repo (tanpa actual values)
- [ ] `.gitignore` proper (no node_modules, no .env, no dist)
- [ ] Package versions consistent (no conflicting peer deps)
- [ ] No security vulnerabilities (`npm audit`)

### Professional Touches (Poin Plus)

- [ ] Favicon custom (bukan default React/Vite logo)
- [ ] Page titles descriptive (bukan "Vite + React + TS")
- [ ] Meta tags untuk SEO basic
- [ ] Loading animation yang smooth
- [ ] Consistent color palette (pick 3-4 colors, stick to them)
- [ ] Proper git branching (feature branches, not all in main)
- [ ] Commit messages meaningful (conventional commits format)

---

## 🏁 FINAL SUBMISSION FORMAT

```
Submission harus include:
1. GitHub repo URL (public)
2. Live frontend URL (Vercel)
3. Live backend URL (Railway)  
4. Demo video URL (YouTube unlisted / Loom)
5. Slide presentasi (Google Slides / PDF)
```

### Grading Breakdown

| Kategori | Bobot | Apa yang dinilai |
|----------|-------|-------------------|
| Functionality | 30% | Features work, no major bugs |
| Code Quality | 20% | Clean, typed, consistent, DRY |
| UI/UX | 15% | Responsive, accessible, polished |
| Testing | 15% | Coverage, meaningful tests, CI green |
| Documentation | 10% | README, API docs, screenshots |
| Presentation | 10% | Demo smooth, Q&A confident |

---

## 💀 COMMON MISTAKES YANG BIKIN NILAI JEBLOK

1. **Deploy broken pas hari H** — Test deploy 3 hari sebelumnya. MINIMUM.
2. **README kosong** — No README = instant -10% grade.
3. **Gak ada tests** — "Gak sempet" bukan excuse. 15 tests itu bisa selesai dalam 2-3 jam.
4. **`any` everywhere** — Mending gak pakai TypeScript sekalian kalau `any` semua.
5. **Gak responsive** — 2025 dan app kalian gak bisa dibuka di HP? Come on.
6. **No error handling** — Click something, blank screen. Professional? No.
7. **Hardcoded localhost** — Works di laptop kalian, broken di everywhere else.
8. **Git history berantakan** — 47 commits yang isinya "fix" "fix" "fix". Squash please.

---

## 🔥 MINDSET

Gua mau kalian approach submission ini dengan mindset:

> **"Ini bukan tugas sekolah. Ini portfolio piece pertama gue yang bakal diliat recruiter."**

Setiap keputusan — dari warna button sampai test coverage — itu reflect **siapa kalian sebagai developer**. Kalau kalian submit sesuatu yang half-assed, itu yang orang liat. Kalau kalian submit sesuatu yang polished dan thoughtful, itu yang orang remember.

Phase 2 udah hampir kelar. Phase 3 — Blockchain & Smart Contract — udah nungguin. Tapi kalian gak bakal bisa survive Phase 3 kalau foundation kalian di fullstack development gak solid.

**Checklist ini adalah bukti foundation kalian solid. Centang SEMUANYA. No exceptions.**

Semangat. Kalian udah sampai sejauh ini. Tinggal satu push lagi. 🚀
