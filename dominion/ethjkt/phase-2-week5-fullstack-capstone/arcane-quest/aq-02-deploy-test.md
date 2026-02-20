# 🚀 ARCANE QUEST 02 — ARCANE DEPLOYMENT

> **"App tanpa test itu kayak mobil tanpa rem. App tanpa CI/CD itu kayak mobil tanpa dashboard. App tanpa monitoring itu kayak mobil tanpa spion. Sekarang kalian pasang SEMUANYA."**

---

## 🎯 Misi

Ambil Notes App dari AQ-01 (atau bikin baru kalau belum), lalu:

1. **Tambah 10 tests** (Vitest + Playwright)
2. **Setup CI/CD** (GitHub Actions)
3. **Deploy production** (Vercel + Railway)
4. **Monitoring** (Sentry)

**Selesaikan semua requirements di bawah.**

---

## 📋 Requirements

### 1. Testing — 10 Tests Minimum

#### Backend Tests (Vitest) — Min 5

```typescript
// Contoh test cases yang expected:
describe('Auth API', () => {
  it('should register new user with valid data');
  it('should reject duplicate email registration');
  it('should login with correct credentials');
  it('should reject login with wrong password');
  it('should return 401 for protected route without token');
});

describe('Notes API', () => {
  it('should create note for authenticated user');
  it('should return only notes belonging to user');
  it('should update own note');
  it('should not access other user notes');
  it('should delete own note');
});
```

- [ ] Setup Vitest config buat backend
- [ ] Test database terpisah (test environment)
- [ ] Database reset sebelum setiap test suite
- [ ] Semua tests pass dengan `npm test`

#### E2E Tests (Playwright) — Min 3

```typescript
// Contoh E2E flows:
test('complete auth flow', async ({ page }) => {
  // Register → Login → See dashboard → Logout
});

test('notes CRUD flow', async ({ page }) => {
  // Login → Create note → Edit note → Delete note
});

test('protected routes redirect', async ({ page }) => {
  // Visit /dashboard without auth → Redirect to /login
});
```

- [ ] Playwright installed dan configured
- [ ] Tests run against local dev server
- [ ] `npx playwright test` pass semua

#### Test Configuration

```typescript
// vitest.config.ts (backend)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
});
```

---

### 2. CI/CD — GitHub Actions

- [ ] `.github/workflows/ci.yml` created
- [ ] Pipeline triggers on push ke `main` dan PR
- [ ] Steps include: install, lint, type-check, test, build
- [ ] PostgreSQL service container buat test di CI
- [ ] Environment variables dari GitHub Secrets
- [ ] Badge di README shows passing status

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: arcane_notes_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/arcane_notes_test
      JWT_SECRET: test-secret-key-for-ci

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Unit & integration tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: E2E tests
        run: npx playwright test
```

---

### 3. Deployment

#### Frontend → Vercel

- [ ] Connect GitHub repo ke Vercel
- [ ] Set build command dan output directory
- [ ] Configure environment variables:
  - `VITE_API_URL` → Railway backend URL
- [ ] Verify auto-deploy on push ke main
- [ ] Test semua routes (including direct URL access)

#### Backend → Railway

- [ ] Create project di Railway
- [ ] Add PostgreSQL plugin
- [ ] Deploy dari GitHub repo
- [ ] Configure environment variables:
  - `DATABASE_URL` (auto dari Railway PostgreSQL)
  - `JWT_SECRET`
  - `FRONTEND_URL` (buat CORS)
  - `PORT`
- [ ] Run `prisma migrate deploy` post-deploy
- [ ] Test health endpoint: `GET /api/health`

---

### 4. Monitoring — Sentry

- [ ] Create Sentry account (free tier)
- [ ] Setup Sentry di **frontend** (`@sentry/react`)
- [ ] Setup Sentry di **backend** (`@sentry/node`)
- [ ] Verify error tracking works (trigger deliberate error)
- [ ] Source maps uploaded (optional tapi recommended)

```typescript
// Frontend — main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

```typescript
// Backend — index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Your routes go here...
// app.use('/api/auth', authRouter);
// app.use('/api/notes', notesRouter);

// Sentry error handler (AFTER all routes, BEFORE your error handler)
Sentry.setupExpressErrorHandler(app);
```

---

## ✅ Submission Checklist

- [ ] 10+ tests passing (`npm test` + `npx playwright test`)
- [ ] GitHub Actions CI green ✅
- [ ] Frontend deployed di Vercel (accessible)
- [ ] Backend deployed di Railway (accessible)
- [ ] Sentry configured (show dashboard screenshot)
- [ ] README updated dengan badges dan deploy URLs

---

## 💡 Tips

1. **Test database TERPISAH dari dev database.** Jangan pernah run test di dev/prod DB.
2. **CI failure pertama = normal.** Biasanya env variable missing. Check logs.
3. **Sentry free tier cukup banget** buat project ini. Gak perlu bayar.
4. **Deploy backend DULU, baru frontend.** Frontend butuh backend URL.
5. **Kalau CI timeout, check Playwright.** Biasanya Playwright yang lama di CI.

**Professional-grade deployment pipeline. Ini yang bedain bootcamp graduate sama real developer. GO.** 🚀
