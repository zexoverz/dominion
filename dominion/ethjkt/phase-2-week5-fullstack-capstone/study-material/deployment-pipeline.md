# 🚀 Deployment Pipeline

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> Code yang cuma jalan di localhost itu belum jadi app. Deployment is where the magic happens — app lo bisa diakses siapa aja, dari mana aja.

---

## 🎯 Overview

Di materi ini lo akan belajar:
1. **Deploy frontend** ke Vercel
2. **Deploy backend** ke Railway
3. **Connect custom domain** (optional)
4. **Environment variables** di production
5. **CI/CD** dengan GitHub Actions

### Architecture di Production:

```
[User Browser]
      |
      ▼
[Vercel - Frontend]  ←→  [Railway - Backend]  ←→  [Railway PostgreSQL]
   React app              Express API              Database
   myapp.vercel.app       myapp-api.up.railway.app
```

---

## 📦 Part 1: Deploy Frontend ke Vercel

Vercel itu platform deployment yang **dibikin sama tim Next.js**. Perfect buat React apps — gratis, cepet, auto-deploy dari GitHub.

### Step 1: Push ke GitHub

```bash
# Kalau belum ada repo di GitHub, buat dulu
# Go to github.com → New repository → "arcane-notes"

cd arcane-notes
git remote add origin https://github.com/USERNAME/arcane-notes.git
git push -u origin main
```

### Step 2: Setup Vercel

1. Buka [vercel.com](https://vercel.com) → Sign up dengan GitHub
2. Klik **"Add New Project"**
3. Import repo `arcane-notes` dari GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client` ← PENTING! Karena monorepo
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables** — tambah:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
   (Isi URL backend nanti setelah deploy Railway)
6. Klik **Deploy**

### Step 3: Verify

Vercel akan kasih URL kayak `arcane-notes-abc123.vercel.app`. Buka di browser — lo harusnya lihat frontend (tapi belum konek ke backend).

### Auto-Deploy:

Setelah setup, setiap kali lo `git push` ke `main`, Vercel **otomatis re-deploy**. Push to branch lain? Vercel bikin **preview deployment** — URL temporary buat review.

---

## 🚂 Part 2: Deploy Backend ke Railway

Railway itu platform buat deploy backends, databases, dan services lain. Gratis tier tersedia dengan batasan usage.

### Step 1: Setup Railway

1. Buka [railway.app](https://railway.app) → Sign up dengan GitHub
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repo `arcane-notes`
4. Railway akan detect codenya. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm run build && npm start`

### Step 2: Add PostgreSQL Database

1. Di Railway project dashboard, klik **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway otomatis bikin PostgreSQL instance
3. Klik PostgreSQL service → tab **"Variables"** → copy `DATABASE_URL`

### Step 3: Environment Variables

Di Railway, klik backend service → tab **"Variables"** → tambah:

```
PORT=3001
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}    # Railway auto-link!
JWT_SECRET=your-super-secret-production-key-change-this-please
JWT_EXPIRES_IN=7d
CLIENT_URL=https://arcane-notes-abc123.vercel.app
```

**Tips:** Railway punya fitur **variable references** — `${{Postgres.DATABASE_URL}}` otomatis terisi dari PostgreSQL service.

### Step 4: Run Migrations

Railway nggak otomatis jalanin SQL. Lo perlu jalanin migrations:

**Option A: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run psql $DATABASE_URL -f server/src/db/migrations/001_initial.sql
```

**Option B: Tambah migration script**

```json
// server/package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "tsx src/db/migrate.ts"
  }
}
```

```typescript
// server/src/db/migrate.ts
import pool from './db';
import fs from 'fs';
import path from 'path';

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_initial.sql'),
    'utf-8'
  );
  
  await pool.query(sql);
  console.log('✅ Migration complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
```

### Step 5: Update Vercel Environment Variable

Sekarang lo punya Railway backend URL. Balik ke Vercel:

1. Settings → Environment Variables
2. Update `VITE_API_URL` ke `https://arcane-notes-production.up.railway.app/api`
3. Redeploy (Settings → Deployments → Redeploy)

### Step 6: Test Production

```bash
# Test backend
curl https://arcane-notes-production.up.railway.app/api/health

# Buka frontend
# https://arcane-notes-abc123.vercel.app
```

Kalau notes muncul dan lo bisa create/delete → **Production is live!** 🎉

---

## 🌐 Part 3: Custom Domain (Optional)

### Vercel Custom Domain:

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `notes.yourdomain.com`
3. Add DNS record di domain registrar:
   ```
   Type: CNAME
   Name: notes
   Value: cname.vercel-dns.com
   ```
4. Wait ~5 menit, Vercel auto-provision SSL certificate

### Railway Custom Domain:

1. Railway Dashboard → Service → Settings → Domains
2. Add domain: `api.yourdomain.com`
3. Add DNS record:
   ```
   Type: CNAME
   Name: api
   Value: [railway-provided-value]
   ```

---

## 🔐 Part 4: Environment Variables Best Practices

### ❌ JANGAN:

```typescript
// NEVER hardcode secrets!
const JWT_SECRET = "my-secret-key-123";
const DATABASE_URL = "postgresql://user:password@host/db";
```

### ✅ DO:

```typescript
// Always use environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
```

### Checklist Environment Variables:

```markdown
## Frontend (Vercel)
- VITE_API_URL          → Backend API URL

## Backend (Railway)
- PORT                  → Server port
- NODE_ENV              → production
- DATABASE_URL          → PostgreSQL connection string
- JWT_SECRET            → Random string, 32+ chars
- JWT_EXPIRES_IN        → Token expiry (e.g., 7d)
- CLIENT_URL            → Frontend URL (for CORS)

## Database (Railway)
- (Auto-generated by Railway)
```

### Generate Strong Secrets:

```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### .env.example vs .env:

```bash
# .env.example (COMMIT this — shows what vars are needed)
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp
JWT_SECRET=change-me-in-production
CLIENT_URL=http://localhost:5173

# .env (NEVER commit — contains actual secrets)
# Listed in .gitignore
```

---

## 🔄 Part 5: CI/CD dengan GitHub Actions

CI/CD = **Continuous Integration / Continuous Deployment**. Artinya: setiap kali lo push code, otomatis di-test dan di-deploy.

### Apa yang Kita Setup:

```
Push to GitHub → GitHub Actions runs tests → If pass → Auto-deploy
                                            → If fail → Block merge, notify
```

### Step 1: Create Workflow File

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-client:
    name: Test Frontend
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: ./client
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint --if-present
      
      - name: Run tests
        run: npm run test:run
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://mock-api.example.com/api

  test-server:
    name: Test Backend
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: ./server
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:run
      
      - name: Build
        run: npm run build
```

### Step 2: Commit & Push

```bash
mkdir -p .github/workflows
# Copy ci.yml ke .github/workflows/
git add .github/workflows/ci.yml
git commit -m "🔧 add CI workflow"
git push
```

### Step 3: Verify

1. Buka repo di GitHub → tab **"Actions"**
2. Lo harusnya lihat workflow running
3. Kalau semua ✅ hijau → CI works!

### Step 4: Branch Protection (Recommended)

1. GitHub → Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Check: **"Require status checks to pass before merging"**
4. Select: `Test Frontend` dan `Test Backend`
5. Save

Sekarang, nggak ada yang bisa merge PR ke `main` kalau tests gagal!

### Workflow Lengkap dengan Deploy Notification:

```yaml
# .github/workflows/ci.yml (extended version)
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-client:
    name: 🧪 Test Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm run test:run
      - run: npm run build
        env:
          VITE_API_URL: https://mock-api.example.com/api

  test-server:
    name: 🧪 Test Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: npm ci
      - run: npm run test:run
      - run: npm run build

  # This job only runs on main (after merge)
  deploy-check:
    name: ✅ Ready to Deploy
    needs: [test-client, test-server]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "All tests passed! Vercel & Railway will auto-deploy."
```

---

## 🐛 Troubleshooting Deployment

### "Build failed" di Vercel
→ Check build logs di Vercel dashboard
→ Pastiin `Root Directory` set ke `client`
→ Pastiin semua env vars ada

### Backend nggak bisa connect ke database
→ Check `DATABASE_URL` di Railway variables
→ Pakai variable reference: `${{Postgres.DATABASE_URL}}`

### CORS error di production
→ Update `CLIENT_URL` di backend env vars ke Vercel URL yang benar
→ Pastiin include `https://`

### "Module not found" di Railway
→ Check `Root Directory` set ke `server`
→ Pastiin `build` command jalan: `npm run build && npm start`

### GitHub Actions failing
→ Check Actions tab → click failed job → baca log
→ Common: missing `npm ci` atau wrong working-directory

---

## 🏋️ Latihan

### Exercise 1: Deploy
1. Push project ke GitHub
2. Deploy frontend ke Vercel
3. Deploy backend + PostgreSQL ke Railway
4. Verify semuanya works di production

### Exercise 2: CI/CD
1. Buat `.github/workflows/ci.yml`
2. Push dan verify workflow runs
3. Intentionally break a test, push → verify CI catches it
4. Fix test, push → verify CI passes

### Exercise 3: Environment
1. Buat `.env.example` yang lengkap
2. Generate strong JWT secret buat production
3. Setup semua env vars di Vercel + Railway
4. Verify frontend bisa konek ke backend di production

---

## 🔑 Key Takeaways

- **Vercel** = easiest way to deploy React apps (free, auto-deploy from GitHub)
- **Railway** = great for backends + databases (free tier available)
- **Environment variables** = NEVER hardcode secrets, always use env vars
- **GitHub Actions** = automated testing on every push/PR
- **Branch protection** = prevent broken code from reaching main
- **CI/CD** = deploy with confidence, every single time

> 🧙‍♂️ "Deploy early, deploy often. App yang live di production itu 100x lebih valuable daripada yang cuma jalan di localhost." — ETHJKT Wisdom

Lo tinggal satu langkah lagi dari live production app! 🚀
