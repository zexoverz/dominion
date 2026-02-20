# 📦 Materi 11: Environment Variables & Deployment Preparation

## Kenapa Materi Ini Penting?

Oke, jadi kalian udah bisa bikin React app yang connect ke API, handle auth, manage state — keren banget. Tapi sekarang pertanyaannya: **gimana caranya deploy ini ke internet beneran?**

Bayangin gini: selama development, API kalian jalan di `localhost:3000`. Tapi pas deploy, API-nya di `https://api.myapp.com`. Masa kalian hardcode URL-nya terus ganti manual tiap kali mau deploy? **NGGA DONG.**

Di sinilah **environment variables** masuk. Plus, kalian bakal ketemu masalah klasik: **CORS**. Browser ngeblock request dari domain berbeda kecuali server bilang "it's fine, let them in."

Materi ini bakal cover:
- Vite environment variables system
- `.env` files dan kapan pake yang mana
- CORS: kenapa ada, gimana solve-nya
- Vite proxy configuration
- Production deployment checklist

Let's go! 🚀

---

## 1. Vite Environment Variables — The Basics

### Apa Itu Environment Variable?

Environment variable itu **konfigurasi yang berubah tergantung environment**. Contoh paling gampang:

| Environment | API URL | Debug Mode |
|---|---|---|
| Development | `http://localhost:3000` | `true` |
| Staging | `https://staging-api.myapp.com` | `true` |
| Production | `https://api.myapp.com` | `false` |

Daripada hardcode, kita simpan di **file `.env`** dan akses lewat code.

### `.env` Files di Vite

Vite punya sistem `.env` yang straightforward. Bikin file di **root project** (sejajar `package.json`):

```
my-react-app/
├── .env                  # Default, selalu di-load
├── .env.local            # Local overrides, JANGAN commit ke git
├── .env.development      # Cuma di-load pas `vite` (dev server)
├── .env.production       # Cuma di-load pas `vite build`
├── .env.staging          # Custom mode
├── src/
├── package.json
└── vite.config.js
```

**Priority loading (dari rendah ke tinggi):**

```
.env                    ← selalu di-load
.env.local              ← selalu di-load, overrides .env
.env.[mode]             ← di-load sesuai mode (development/production)
.env.[mode].local       ← di-load sesuai mode, overrides .env.[mode]
```

Yang `.local` itu **HARUS** masuk `.gitignore`. Ini buat secrets yang cuma kalian yang tau.

### VITE_ Prefix — The Golden Rule

**⚠️ INI PENTING BANGET:** Di Vite, environment variable **HARUS** diawali `VITE_` supaya bisa diakses di client-side code.

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=My Awesome App
VITE_ENABLE_ANALYTICS=false

# INI NGGA BAKAL BISA DIAKSES DI CODE:
SECRET_KEY=my-super-secret
DATABASE_URL=postgres://localhost:5432/mydb
```

Kenapa? **Security.** Semua yang ada di client-side code bisa dilihat user lewat browser DevTools. Jadi Vite sengaja bikin barrier — kalian harus explicitly bilang "ini boleh di-expose ke client" dengan prefix `VITE_`.

```javascript
// ✅ Bisa diakses
console.log(import.meta.env.VITE_API_URL);
// Output: "http://localhost:3000"

// ❌ undefined — ngga ada VITE_ prefix
console.log(import.meta.env.SECRET_KEY);
// Output: undefined

// Built-in variables (selalu ada):
console.log(import.meta.env.MODE);    // "development" atau "production"
console.log(import.meta.env.DEV);     // true di development
console.log(import.meta.env.PROD);    // true di production
console.log(import.meta.env.BASE_URL); // base URL dari config
```

### Praktek: Setup Environment Variables

**`.env` (default untuk semua environment):**

```bash
VITE_APP_TITLE=Inventory Manager
VITE_APP_VERSION=1.0.0
```

**`.env.development`:**

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_MOCK=true
VITE_LOG_LEVEL=debug
```

**`.env.production`:**

```bash
VITE_API_URL=https://api.inventory-app.com/api
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=error
```

**Pake di code:**

```javascript
// src/config/api.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appTitle: import.meta.env.VITE_APP_TITLE,
  isMockEnabled: import.meta.env.VITE_ENABLE_MOCK === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default config;
```

```javascript
// src/lib/axios.js
import axios from 'axios';
import config from '../config/api';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});

export default api;
```

> **💡 Pro tip:** Semua env var itu **string**. `VITE_ENABLE_MOCK=true` itu string `"true"`, bukan boolean `true`. Makanya kita compare `=== 'true'`.

### Custom Modes

Selain `development` dan `production`, kalian bisa bikin mode sendiri:

```bash
# .env.staging
VITE_API_URL=https://staging-api.myapp.com/api
VITE_APP_TITLE=Inventory Manager [STAGING]
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview"
  }
}
```

### TypeScript Support

Biar dapet autocomplete, bikin type declaration:

```typescript
// src/vite-env.d.ts (atau env.d.ts)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Sekarang `import.meta.env.VITE_API_URL` bakal ada autocomplete. Nice! ✨

---

## 2. CORS — The Bane of Every Frontend Developer

### Apa Itu CORS?

**CORS** = Cross-Origin Resource Sharing. Ini security feature dari browser.

Ketika React app kalian di `http://localhost:5173` mau request ke API di `http://localhost:3000`, itu namanya **cross-origin request** karena **port-nya beda**.

```
Origin = protocol + domain + port
http://localhost:5173  ≠  http://localhost:3000
    ↑           ↑   ↑
 protocol    domain  port
```

Browser secara default **NGEBLOCK** cross-origin request. Kenapa? Biar website jahat ngga bisa diem-diem hit API kalian pake cookie user yang lagi login.

### Gimana CORS Works?

```mermaid
sequenceDiagram
    participant Browser
    participant React as React App<br/>(localhost:5173)
    participant API as Express API<br/>(localhost:3000)
    
    Browser->>API: OPTIONS /api/products (Preflight)
    Note right of API: "Boleh ngga localhost:5173<br/>akses gua?"
    API-->>Browser: 200 OK + CORS Headers
    Note left of Browser: Access-Control-Allow-Origin:<br/>http://localhost:5173
    Browser->>API: GET /api/products (Actual Request)
    API-->>Browser: 200 OK + Data
```

Browser kirim **preflight request** (OPTIONS) dulu buat nanya: "Eh server, boleh ngga origin ini akses lo?" Kalo server respond dengan header yang bener, baru browser kirim request aslinya.

### Solve CORS di Backend (Express)

Cara paling proper — setup di Express:

```javascript
// backend/server.js
import cors from 'cors';

// Option 1: Allow semua origin (development only!)
app.use(cors());

// Option 2: Specific origins (RECOMMENDED untuk production)
app.use(cors({
  origin: [
    'http://localhost:5173',           // Vite dev server
    'https://my-app.vercel.app',       // Production frontend
    'https://staging.my-app.vercel.app' // Staging
  ],
  credentials: true,  // Kalo pake cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Option 3: Dynamic origin (advanced)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

```bash
# backend/.env
ALLOWED_ORIGINS=http://localhost:5173,https://my-app.vercel.app
```

### Common CORS Errors & Solutions

**Error 1:** `Access to XMLHttpRequest has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header`

→ **Fix:** Backend belum setup `cors()` middleware.

**Error 2:** `The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*' when the request's credentials mode is 'include'`

→ **Fix:** Kalo pake `credentials: true`, origin ngga boleh `*`. Harus specific.

**Error 3:** `Request header field authorization is not allowed by Access-Control-Allow-Headers`

→ **Fix:** Tambahin `Authorization` ke `allowedHeaders`.

---

## 3. Vite Proxy — CORS Killer di Development

Ada cara lebih elegant buat handle CORS di development: **Vite proxy**.

Idenya: instead of React langsung hit `localhost:3000`, semua request di-proxy lewat Vite dev server. Jadi dari sisi browser, request-nya ke origin yang sama — **no CORS!**

```mermaid
graph LR
    A[Browser] -->|/api/products| B[Vite Dev Server<br/>localhost:5173]
    B -->|proxy ke<br/>localhost:3000/api/products| C[Express API<br/>localhost:3000]
    C -->|response| B
    B -->|response| A
    
    style B fill:#f9f,stroke:#333
```

### Setup Vite Proxy

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Semua request yang mulai /api di-forward ke localhost:3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Optional: rewrite path
        // rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
      // WebSocket proxy
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,  // Enable WebSocket proxy
      },
    },
  },
});
```

Sekarang di code, kalian cukup pake **relative URL**:

```javascript
// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  // Development: proxy handles it, jadi cukup /api
  // Production: pake full URL dari env var
  baseURL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL 
    : '/api',
  timeout: 10000,
});

export default api;
```

```javascript
// Ini bakal request ke localhost:5173/api/products
// Vite proxy forward ke localhost:3000/api/products
const { data } = await api.get('/products');
```

### Proxy + Environment Variables Pattern

Pattern yang gua recommend buat project kalian:

```javascript
// src/config/index.js
const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'My App',
    version: import.meta.env.VITE_APP_VERSION || '0.0.0',
  },
  features: {
    enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
};

// Freeze biar ngga bisa di-mutate
Object.freeze(config);
export default config;
```

```bash
# .env.development — kosongkan VITE_API_URL, biar fallback ke proxy
VITE_APP_TITLE=Inventory Manager [DEV]
VITE_ENABLE_MOCK=false

# .env.production
VITE_API_URL=https://api.inventory-app.com/api
VITE_APP_TITLE=Inventory Manager
VITE_ENABLE_ANALYTICS=true
```

---

## 4. Preparing for Production Deploy

### Build Process

Pas kalian run `vite build`, Vite:

1. Baca `.env.production` (karena mode = production)
2. Replace semua `import.meta.env.VITE_*` dengan value-nya (string replacement)
3. Bundle, minify, tree-shake
4. Output ke folder `dist/`

```bash
npm run build
# Output:
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-abc123.js    ← bundled JS
# │   ├── index-def456.css   ← bundled CSS
# │   └── logo-ghi789.png    ← static assets
```

**⚠️ PENTING:** Setelah build, env vars itu **baked into the JS bundle**. Ngga bisa diubah tanpa rebuild. Jadi kalo mau ganti API URL, harus build ulang.

### Production Checklist

Sebelum deploy, cek semua ini:

```markdown
## Pre-Deploy Checklist

### Environment
- [ ] `.env.production` sudah benar
- [ ] Semua VITE_* vars sudah di-set
- [ ] Ngga ada secrets di VITE_* vars
- [ ] `.env.local` sudah di .gitignore

### API & CORS
- [ ] Backend CORS allow production domain
- [ ] API URL production sudah benar
- [ ] HTTPS di production
- [ ] API health check endpoint works

### Build
- [ ] `npm run build` sukses tanpa error
- [ ] `npm run preview` — test production build locally
- [ ] Bundle size reasonable (check with `vite-bundle-analyzer`)
- [ ] No console.log di production (atau filtered)

### Auth & Security
- [ ] Token storage secure
- [ ] No sensitive data di localStorage
- [ ] HTTPS only cookies (if using cookies)
- [ ] CSP headers configured

### Performance
- [ ] Images optimized
- [ ] Lazy loading routes
- [ ] Code splitting works
- [ ] Gzip/Brotli enabled on server
```

### Deploy ke Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (dari root project React)
vercel

# Set environment variables di Vercel
vercel env add VITE_API_URL production
# Masukkan: https://api.yourapp.com/api

# Deploy production
vercel --prod
```

Atau lewat Vercel Dashboard:
1. Connect GitHub repo
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variables di Settings
5. Deploy! 🚀

### Deploy Backend ke Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init project
railway init

# Set env vars
railway variables set PORT=3000
railway variables set DATABASE_URL=your_db_url
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app
railway variables set JWT_SECRET=your_jwt_secret

# Deploy
railway up
```

### Full Architecture di Production

```mermaid
graph TB
    subgraph "User Browser"
        A[React App]
    end
    
    subgraph "Vercel CDN"
        B[Static Files<br/>HTML/JS/CSS]
    end
    
    subgraph "Railway"
        C[Express API]
        D[(PostgreSQL)]
    end
    
    A -->|Load app| B
    A -->|API calls<br/>HTTPS| C
    C -->|Query| D
    
    style B fill:#00d4ff,color:#000
    style C fill:#8b5cf6,color:#fff
    style D fill:#f59e0b,color:#000
```

---

## 5. Advanced: Environment-Specific Behavior

### Feature Flags dari Environment

```javascript
// src/config/features.js
export const features = {
  showDevTools: import.meta.env.DEV,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK === 'true',
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
};

// Usage di component
function App() {
  return (
    <div>
      <MainContent />
      {features.showDevTools && <DevToolsPanel />}
    </div>
  );
}
```

### Conditional Logging

```javascript
// src/utils/logger.js
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL || 'info'];

const logger = {
  debug: (...args) => {
    if (currentLevel <= LOG_LEVELS.debug) console.log('[DEBUG]', ...args);
  },
  info: (...args) => {
    if (currentLevel <= LOG_LEVELS.info) console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    if (currentLevel <= LOG_LEVELS.warn) console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    if (currentLevel <= LOG_LEVELS.error) console.error('[ERROR]', ...args);
  },
};

export default logger;
```

### Multiple API Endpoints

```bash
# .env.production
VITE_API_URL=https://api.myapp.com
VITE_WS_URL=wss://ws.myapp.com
VITE_CDN_URL=https://cdn.myapp.com
VITE_SENTRY_DSN=https://xxx@sentry.io/123
```

```javascript
// src/config/index.js
const config = {
  api: {
    rest: import.meta.env.VITE_API_URL,
    ws: import.meta.env.VITE_WS_URL,
    cdn: import.meta.env.VITE_CDN_URL,
  },
  monitoring: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },
};
```

---

## 6. Common Mistakes & Gotchas

### ❌ Mistake 1: Commit `.env.local`

```bash
# .gitignore — WAJIB PUNYA
.env.local
.env.*.local
```

### ❌ Mistake 2: Simpan Secret di VITE_ vars

```bash
# JANGAN! Ini bakal visible di browser
VITE_DATABASE_URL=postgres://user:pass@host:5432/db
VITE_JWT_SECRET=my-secret-key

# Yang boleh: URL yang memang public-facing
VITE_API_URL=https://api.myapp.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx  # Public key emang buat client
```

### ❌ Mistake 3: Lupa Restart Dev Server

Setelah edit `.env` file, **HARUS restart** Vite dev server. Env vars di-load pas startup, bukan hot-reloaded.

```bash
# Ctrl+C terus npm run dev lagi
```

### ❌ Mistake 4: Hardcode API URL

```javascript
// ❌ JANGAN
const res = await fetch('http://localhost:3000/api/products');

// ✅ PAKE CONFIG
import config from './config';
const res = await fetch(`${config.api.baseURL}/products`);
```

### ❌ Mistake 5: Lupa CORS di Production

Development pake proxy lancar jaya, deploy production langsung CORS error. **Selalu test production build locally:**

```bash
npm run build
npm run preview
# Preview serve dari port 4173, tanpa proxy!
# Pastikan CORS headers udah bener di backend
```

---

## Summary

| Konsep | Key Takeaway |
|---|---|
| `.env` files | Prioritas: `.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local` |
| `VITE_` prefix | WAJIB buat expose ke client code |
| `import.meta.env` | Cara akses env vars di Vite |
| CORS | Setup di backend, bukan frontend |
| Vite proxy | Development only, elegant CORS bypass |
| Production build | Env vars di-bake ke bundle, ngga bisa diubah runtime |
| Security | JANGAN taruh secrets di `VITE_*` vars |

Env vars dan deployment prep ini **fundamental skill**. Setiap project production pasti butuh ini. Master it now, thank yourself later. 💪

---

> **Next:** [Materi 12 — WebSocket: Real-time Beyond REST](./12-websocket-intro.md) 🔌
