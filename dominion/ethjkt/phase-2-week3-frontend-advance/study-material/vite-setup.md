# ⚡ Vite Setup & Configuration

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Kenapa Vite? Bye-bye CRA! 👋

Oke guys, kalau kalian masih pakai Create React App (CRA) di tahun 2024+, it's time to move on. CRA udah deprecated dan nggak di-maintain lagi. Vite (dibaca "vit", bahasa Prancis artinya "cepat") adalah build tool modern yang bakal bikin development experience kalian jauh lebih smooth.

### Perbandingan CRA vs Vite

| Aspek | CRA | Vite |
|-------|-----|------|
| Cold start | 30-60 detik | < 1 detik |
| HMR (Hot Module Replacement) | 2-5 detik | Instan (~50ms) |
| Bundle size | Lebih besar | Lebih kecil (tree-shaking) |
| Config | Harus eject | Mudah di-extend |
| Maintenance | Deprecated ❌ | Aktif ✅ |

### Kenapa Vite Secepat Itu?

CRA pakai **Webpack** yang harus bundle SEMUA file dulu sebelum serve ke browser. Vite pakai pendekatan berbeda:

1. **Development:** Pakai native ES Modules (ESM) — browser langsung import file yang dibutuhin aja
2. **Production:** Pakai **Rollup** buat bundling yang optimal
3. **Pre-bundling:** Dependencies di-prebundle pakai **esbuild** (ditulis Go, 10-100x lebih cepat dari JS-based bundlers)

```
CRA Flow:
Source → Webpack bundles EVERYTHING → Browser

Vite Flow:
Source → Browser requests file → Vite serves that file (via ESM)
```

---

## 🚀 Setup Project Vite + React + TypeScript

### Step 1: Create Project

```bash
# Pakai npm
npm create vite@latest my-app -- --template react-ts

# Atau pakai pnpm (recommended!)
pnpm create vite my-app --template react-ts

# Atau pakai yarn
yarn create vite my-app --template react-ts
```

### Step 2: Install Dependencies & Run

```bash
cd my-app
pnpm install
pnpm dev
```

Boom! 💥 Dalam hitungan detik, dev server kalian udah jalan di `http://localhost:5173`.

### Template yang Tersedia

```bash
# Vanilla
npm create vite@latest my-app -- --template vanilla-ts

# React
npm create vite@latest my-app -- --template react-ts

# Vue
npm create vite@latest my-app -- --template vue-ts

# Svelte
npm create vite@latest my-app -- --template svelte-ts
```

---

## 📁 Struktur Project

```
my-app/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Type declarations
├── index.html             # Root HTML (di root, bukan public!)
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts         # Vite configuration
```

Perhatiin ya, `index.html` ada di **root folder**, bukan di `public/`. Ini karena Vite treat `index.html` sebagai entry point, bukan static file.

---

## ⚙️ vite.config.ts Deep Dive

File ini adalah jantung konfigurasi Vite. Mari kita bedah:

### Basic Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Config Lengkap untuk Production

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env variables berdasarkan mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Path alias — biar nggak perlu ../../.. lagi
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
      },
    },
    
    // Dev server config
    server: {
      port: 3000,
      open: true, // Auto-open browser
      proxy: {
        // Proxy API requests ke backend
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    // Build config
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          // Code splitting per vendor
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },
        },
      },
      // Target browser support
      target: 'es2020',
    },
    
    // CSS config
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  }
})
```

### Path Alias + TypeScript

Kalau pakai path alias, jangan lupa update `tsconfig.json` juga:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Sekarang import jadi lebih clean:

```typescript
// Sebelum 😢
import { Button } from '../../../components/ui/Button'

// Sesudah 😎
import { Button } from '@/components/ui/Button'
```

---

## 🔥 HMR (Hot Module Replacement)

HMR adalah fitur yang bikin perubahan code langsung ke-reflect di browser **tanpa full page reload**. State React kalian tetap preserved!

### Gimana HMR Bekerja di Vite?

1. Kamu edit file `Button.tsx`
2. Vite detect perubahan via file watcher
3. Vite cuma invalidate module yang berubah
4. Browser fetch HANYA module yang berubah (bukan re-bundle semua)
5. React Fast Refresh update component tanpa kehilangan state

```typescript
// Vite HMR API (advanced, biasanya nggak perlu manual)
if (import.meta.hot) {
  import.meta.hot.accept('./module.ts', (newModule) => {
    // Handle module update
    console.log('Module updated!', newModule)
  })
}
```

### Tips: Kapan HMR Nggak Jalan?

- File yang di-edit bukan React component (misal utility function yang di-import banyak tempat)
- Ada syntax error
- Component pakai anonymous export (selalu kasih nama!)

```typescript
// ❌ Anonymous — HMR might not work
export default () => <div>Hello</div>

// ✅ Named — HMR works perfectly
export default function Greeting() {
  return <div>Hello</div>
}
```

---

## 🌍 Environment Variables

Vite handle env variables dengan cara yang sedikit beda dari CRA:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My Awesome App

# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.production.com
```

**Penting:** Semua env variable yang mau di-expose ke client HARUS prefix `VITE_`.

```typescript
// Akses di code
const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE // 'development' | 'production'
const isDev = import.meta.env.DEV // boolean
const isProd = import.meta.env.PROD // boolean
```

Type safety untuk env variables:

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 📦 Rollup & Build Optimization

Vite pakai **Rollup** untuk production build. Beberapa optimasi yang bisa kalian lakukan:

### Code Splitting

```typescript
// Lazy loading routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Settings = React.lazy(() => import('./pages/Settings'))
```

### Analyze Bundle Size

```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

### Build & Preview

```bash
# Build untuk production
pnpm build

# Preview production build locally
pnpm preview
```

---

## 🔌 Plugin Ecosystem

Vite punya ecosystem plugin yang kaya:

```bash
# Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer

# SVG as React components
pnpm add -D vite-plugin-svgr

# Auto-import (nggak perlu import React, useState, dll)
pnpm add -D unplugin-auto-import
```

```typescript
// vite.config.ts
import svgr from 'vite-plugin-svgr'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    AutoImport({
      imports: ['react'],
      dts: './src/auto-imports.d.ts',
    }),
  ],
})
```

---

## 🎯 Practice Exercises

### Exercise 1: Setup Project
Buat project Vite + React + TypeScript baru. Setup path aliases untuk `@components`, `@hooks`, `@utils`, dan `@pages`. Pastikan TypeScript nggak error.

### Exercise 2: Environment Config
Setup 3 environment files (`.env`, `.env.development`, `.env.production`) dengan variable `VITE_API_URL` dan `VITE_APP_TITLE`. Buat component yang menampilkan nilai-nilai ini.

### Exercise 3: Proxy Setup
Konfigurasi Vite dev server supaya request ke `/api/*` di-proxy ke `http://localhost:8080`. Test dengan `fetch('/api/users')`.

### Exercise 4: Build Analysis
Install `rollup-plugin-visualizer`, jalankan `pnpm build`, dan analisis bundle size. Identifikasi dependency terbesar dan coba implementasi code splitting.

### Bonus Challenge 🏆
Setup Vite project lengkap dengan:
- Path aliases
- Tailwind CSS
- Environment variables
- Proxy config
- SVG import sebagai React component
- Bundle analyzer

---

## 📚 Resources

- [Vite Official Docs](https://vitejs.dev/)
- [Vite Plugin List](https://github.com/vitejs/awesome-vite)
- [Rollup Documentation](https://rollupjs.org/)
- [esbuild](https://esbuild.github.io/)

---

> 💡 **Pro tip:** Kalau project kalian masih pakai CRA, migration ke Vite itu surprisingly straightforward. Biasanya cuma perlu 30 menit! Cek [migration guide](https://vitejs.dev/guide/migration) untuk detail.

Selamat! Kalian udah siap pakai Vite untuk semua project React ke depannya. Next up, kita bakal deep dive ke React hooks! 🚀
