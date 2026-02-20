# 📚 Study Material 02 — Code Standards for Teams

> **"Saat lo coding sendirian, code style itu preferensi. Saat lo coding dalam tim, code style itu HUKUM. Gak ada yang lebih buang waktu dari debat tabs vs spaces di PR review."**

---

## 🎯 Learning Objectives

Setelah baca materi ini, kalian bakal bisa:
- Setup ESLint shared config buat seluruh tim
- Configure Prettier buat auto-formatting
- Setup Husky pre-commit hooks biar gak ada code jelek yang ke-commit
- Define folder structure dan naming conventions yang konsisten
- Configure TypeScript strict mode yang proper buat tim

---

## 1. Kenapa Code Standards?

Bayangin 4 orang nulis code dengan style berbeda:
- Person A pake single quotes, Person B pake double quotes
- Person C indent 2 spaces, Person D indent 4 spaces
- Person A pake camelCase, Person C pake snake_case

PR review jadi nightmare. Diff penuh formatting changes yang gak ada hubungannya sama logic. Merge conflicts karena whitespace.

**Solution:** Automate SEMUA formatting dan linting. Setup sekali, forget forever.

---

## 2. ESLint — The Linter

ESLint catches **code quality issues** — unused variables, missing error handling, inconsistent patterns.

### Setup

```bash
# Install ESLint + TypeScript support
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# For React projects, add:
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# For import sorting:
npm install -D eslint-plugin-import
```

### Configuration — `.eslintrc.cjs`

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-refresh',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    // ============ TypeScript ============
    '@typescript-eslint/no-explicit-any': 'error',      // NO ANY!
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // ============ React ============
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true,
    }],
    'react/prop-types': 'off',          // Pake TypeScript, gak perlu prop-types
    'react/self-closing-comp': 'error',  // <Component /> bukan <Component></Component>
    
    // ============ React Hooks ============
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // ============ Import ============
    'import/order': ['error', {
      groups: [
        'builtin',     // Node built-ins (fs, path)
        'external',    // npm packages (react, express)
        'internal',    // Aliases (@/components)
        'parent',      // Parent imports (../)
        'sibling',     // Sibling imports (./)
        'index',       // Index imports (./)
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    }],
    'import/no-duplicates': 'error',
    
    // ============ General ============
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],         // === bukan ==
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.*'],
};
```

### ESLint Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

### Tim Agreement

Semua member HARUS pake config yang SAMA. Caranya:
1. Config ada di ROOT repo (`.eslintrc.cjs`)
2. Semua member install recommended VS Code extensions
3. **Jangan override config di personal settings**

---

## 3. Prettier — The Formatter

Prettier handles **formatting** — indentation, quotes, semicolons, line width. Beda dari ESLint yang handle code quality.

### Setup

```bash
npm install -D prettier eslint-config-prettier
```

`eslint-config-prettier` disable ESLint rules yang conflict sama Prettier.

### Configuration — `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSameLine": false
}
```

### `.prettierignore`

```
dist
node_modules
coverage
*.min.js
pnpm-lock.yaml
package-lock.json
```

### Update ESLint to Use Prettier

Tambahkan `'prettier'` di akhir `extends` array di `.eslintrc.cjs`:

```javascript
extends: [
  // ... existing extends
  'prettier', // HARUS di paling akhir
],
```

### Prettier Scripts

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md,css}\""
  }
}
```

### VS Code Settings

Biar semua member auto-format on save, bikin `.vscode/settings.json` di repo:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Dan `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

Commit kedua file ini ke repo. Pas member buka project, VS Code suggest install extensions.

---

## 4. Husky + lint-staged — Pre-Commit Hooks

ESLint dan Prettier cuma berguna kalau orang JALANIN. Gimana kalau ada member yang lupa format? atau push code yang ada lint error?

**Husky** jalanin script otomatis sebelum commit. **lint-staged** jalanin linter cuma di files yang di-stage (biar cepet).

### Setup

```bash
# Install
npm install -D husky lint-staged

# Initialize Husky
npx husky init

# This creates .husky/ directory
```

### Configure lint-staged

Di `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### Create Pre-Commit Hook

Edit `.husky/pre-commit`:

```bash
npx lint-staged
```

### Apa yang Terjadi?

```
Developer runs: git commit -m "feat: add product page"
                    ↓
Husky intercepts commit
                    ↓
lint-staged runs on staged files:
  1. ESLint --fix → auto-fix what it can
  2. Prettier --write → auto-format
                    ↓
If ESLint finds ERRORS that can't be auto-fixed:
  ❌ COMMIT BLOCKED — developer must fix manually
                    ↓
If all passes:
  ✅ COMMIT SUCCEEDS — code is clean!
```

### `--max-warnings=0`

Perhatiin di config ada `--max-warnings=0`. Ini artinya bahkan **warnings** bakal block commit. Aggressive? Yes. Tapi ini enforce discipline:
- Gak ada `console.log` yang ke-commit
- Gak ada unused variables
- Gak ada `any` types

Kalau tim lo belum siap, bisa ubah ke `--max-warnings=10` dulu, terus turunin gradually.

### Troubleshooting Husky

```bash
# Kalau Husky gak jalan setelah clone
npx husky install

# Kalau permission error
chmod +x .husky/pre-commit

# Kalau mau skip hook (EMERGENCY ONLY)
git commit -m "hotfix: critical" --no-verify
```

> ⚠️ `--no-verify` itu emergency escape hatch. JANGAN pake routinely. Kalau ada member yang sering pake ini, ada masalah.

---

## 5. Folder Structure Conventions

### Frontend Structure

```
src/
├── components/
│   ├── ui/                    # Generic reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Spinner.tsx
│   │   └── index.ts           # Barrel export
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── features/              # Feature-specific components
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   └── ProtectedRoute.tsx
│       ├── products/
│       │   ├── ProductCard.tsx
│       │   ├── ProductList.tsx
│       │   ├── ProductForm.tsx
│       │   └── ProductFilter.tsx
│       └── admin/
│           ├── UserTable.tsx
│           ├── StatsCard.tsx
│           └── AdminSidebar.tsx
├── pages/                     # Route pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   └── admin/
│       ├── DashboardPage.tsx
│       └── UsersPage.tsx
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useSocket.ts
├── stores/                    # Zustand stores
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── notificationStore.ts
├── lib/                       # Utilities & configs
│   ├── api.ts                 # Axios instance
│   ├── socket.ts              # Socket.IO client
│   ├── queryClient.ts         # TanStack Query client
│   └── utils.ts               # Helper functions
├── types/                     # TypeScript types
│   ├── auth.ts
│   ├── product.ts
│   └── api.ts
├── App.tsx
├── main.tsx
└── routes.tsx                 # Route definitions
```

### Backend Structure

```
src/
├── controllers/               # Request handlers
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   └── admin.controller.ts
├── services/                  # Business logic
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   └── upload.service.ts
├── middleware/                 # Express middleware
│   ├── auth.ts
│   ├── rbac.ts
│   ├── validate.ts
│   ├── upload.ts
│   └── errorHandler.ts
├── routes/                    # Route definitions
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── order.routes.ts
│   ├── admin.routes.ts
│   └── index.ts               # Mount all routes
├── socket/                    # WebSocket handlers
│   ├── index.ts               # Socket.IO setup
│   └── handlers/
│       ├── notification.handler.ts
│       └── realtime.handler.ts
├── lib/                       # Configs & utilities
│   ├── prisma.ts              # Prisma client singleton
│   ├── cloudinary.ts          # Upload config
│   └── jwt.ts                 # JWT helpers
├── types/                     # TypeScript types
│   ├── express.d.ts           # Express augmentation
│   └── index.ts
├── validators/                # Zod schemas
│   ├── auth.validator.ts
│   └── product.validator.ts
└── index.ts                   # Entry point
```

### Conventions

| Rule | Example |
|------|---------|
| Components: **PascalCase** | `ProductCard.tsx`, `LoginForm.tsx` |
| Hooks: **camelCase** with `use` prefix | `useAuth.ts`, `useProducts.ts` |
| Stores: **camelCase** with `Store` suffix | `authStore.ts`, `uiStore.ts` |
| Utils/lib: **camelCase** | `api.ts`, `utils.ts` |
| Types: **PascalCase** | `Product`, `User`, `CreateProductDTO` |
| Controllers: **kebab/dot** | `auth.controller.ts` |
| Routes: **kebab/dot** | `auth.routes.ts` |
| Constants: **UPPER_SNAKE_CASE** | `MAX_FILE_SIZE`, `JWT_SECRET` |

### Barrel Exports

Buat cleaner imports, pake barrel exports (`index.ts`):

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export { Card } from './Card';

// Usage in other files:
import { Button, Input, Modal } from '@/components/ui';
// Instead of:
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
```

---

## 6. Naming Conventions

### Variables & Functions

```typescript
// ✅ Good — camelCase, descriptive
const productList = await fetchProducts();
const isAuthenticated = !!user;
const handleSubmit = (data: FormData) => { ... };
function calculateTotal(items: CartItem[]): number { ... }

// ❌ Bad
const pl = await fetchProducts();        // Terlalu singkat
const data = await fetchProducts();      // Terlalu generic
const ProductList = await fetchProducts(); // PascalCase buat variable
```

### React Components

```typescript
// ✅ Good — PascalCase, descriptive
function ProductCard({ product }: ProductCardProps) { ... }
function AdminUserTable({ users }: AdminUserTableProps) { ... }

// ❌ Bad
function productCard() { ... }    // lowercase
function Card() { ... }           // Terlalu generic (kecuali di ui/)
function Comp1() { ... }          // Meaningless name
```

### Types & Interfaces

```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

// DTOs (Data Transfer Objects) — for API request/response
interface CreateProductDTO {
  title: string;
  price: number;
  categoryId: number;
}

interface UpdateProductDTO extends Partial<CreateProductDTO> {}

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  message: string;
  pagination?: PaginationMeta;
}

// ❌ Bad
interface IUser { ... }           // Jangan prefix I — ini bukan C#
interface UserType { ... }        // Redundant suffix
type user = { ... };              // lowercase
```

### File Naming Summary

```
✅ ProductCard.tsx     (component — PascalCase)
✅ useAuth.ts          (hook — camelCase with use prefix)
✅ authStore.ts        (store — camelCase)
✅ auth.controller.ts  (backend — dot notation)
✅ auth.routes.ts      (backend — dot notation)
✅ auth.validator.ts   (validator — dot notation)

❌ product-card.tsx    (jangan kebab-case buat components)
❌ AuthStore.ts        (jangan PascalCase buat non-components)
❌ authController.ts   (kurang readable tanpa dot separator)
```

---

## 7. TypeScript Strict Mode for Teams

### Why Strict?

TypeScript tanpa strict mode itu kayak safety belt yang gak dikaitkan. Ada, tapi gak berguna.

### `tsconfig.json` — Strict Config

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Apa yang `strict: true` Enable?

| Flag | Apa yang Dilakuin |
|------|-------------------|
| `strictNullChecks` | `null` dan `undefined` harus di-handle explicitly |
| `strictFunctionTypes` | Function parameter types dicek ketat |
| `strictBindCallApply` | `bind`, `call`, `apply` dicek type-nya |
| `strictPropertyInitialization` | Class properties harus di-initialize |
| `noImplicitAny` | Gak boleh implicit `any` — harus declare type |
| `noImplicitThis` | `this` harus punya type |
| `alwaysStrict` | Emit `"use strict"` di semua files |

### Common Strict Mode Patterns

```typescript
// ❌ Won't compile — strictNullChecks
function getUser(id: number): User {
  const user = users.find(u => u.id === id);
  return user; // Error: Type 'User | undefined' is not assignable to type 'User'
}

// ✅ Handle the undefined case
function getUser(id: number): User | null {
  const user = users.find(u => u.id === id);
  return user ?? null;
}

// ❌ Won't compile — noImplicitAny
function processData(data) { ... } // Error: Parameter 'data' implicitly has 'any' type

// ✅ Declare the type
function processData(data: ProductData) { ... }

// ❌ Won't compile — noUncheckedIndexedAccess
const items: string[] = ['a', 'b', 'c'];
const first: string = items[0]; // Error: Type 'string | undefined'

// ✅ Check first
const first = items[0];
if (first !== undefined) {
  console.log(first.toUpperCase()); // Safe
}
// or
const first = items[0]!; // Non-null assertion (use sparingly!)
```

### Team Rule: ZERO `any`

```typescript
// ESLint rule (already in our config):
'@typescript-eslint/no-explicit-any': 'error'

// ❌ BANNED
const data: any = fetchSomething();
function handle(event: any) { ... }
const result = JSON.parse(response) as any;

// ✅ USE PROPER TYPES
const data: ProductResponse = await fetchProducts();
function handle(event: React.MouseEvent<HTMLButtonElement>) { ... }
const result: ApiResponse<Product[]> = JSON.parse(response);

// When you truly don't know the type, use `unknown`:
const data: unknown = JSON.parse(rawString);
if (isProductResponse(data)) {
  // Now TypeScript knows it's ProductResponse
  console.log(data.products);
}
```

### Shared Types Between FE & BE

Kalau frontend dan backend di monorepo, share types:

```
apps/
├── frontend/
├── backend/
└── shared/              # Shared types package
    └── types/
        ├── user.ts
        ├── product.ts
        └── index.ts
```

Atau simpler: copy-paste types file. Gak ideal tapi pragmatic buat project ini.

---

## 8. Environment Variables

### `.env` Files

```bash
# .env.example — COMMIT this (no secrets)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
FRONTEND_URL=http://localhost:5173

# .env — DO NOT COMMIT (in .gitignore)
DATABASE_URL=postgresql://admin:realpassword@localhost:5432/myapp
JWT_SECRET=super-secret-key-12345
# ... actual values
```

### `.gitignore` Must Include

```
.env
.env.local
.env.production
!.env.example
```

### Validation

Validate env vars at startup — gak mau app crash random karena missing env var:

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
```

---

## 9. Setup Checklist

Ini step-by-step buat Day 1. Team Lead lead the setup, semua member follow:

```bash
# 1. Create repo & clone
git clone https://github.com/your-team/arcane-project.git
cd arcane-project

# 2. Initialize
npm init -y

# 3. Install dev dependencies
npm install -D typescript eslint prettier husky lint-staged \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-config-prettier eslint-plugin-import \
  eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-react-refresh concurrently

# 4. Create config files
# .eslintrc.cjs — copy dari section 2
# .prettierrc — copy dari section 3
# tsconfig.json — copy dari section 7

# 5. Setup Husky
npx husky init

# 6. Configure lint-staged in package.json

# 7. Create .vscode/settings.json & extensions.json

# 8. Create .env.example

# 9. Create .gitignore

# 10. Initial commit
git add .
git commit -m "chore: initial project setup with linting and formatting"
git push

# 11. Setup branch protection on GitHub
# 12. Create develop branch
git checkout -b develop
git push -u origin develop

# 13. All members clone and create feature branches
```

---

## 10. Quick Reference Card

Print ini dan tempel di monitor lo:

```
┌──────────────────────────────────────────┐
│          TEAM CODE STANDARDS             │
├──────────────────────────────────────────┤
│ Components:    PascalCase.tsx            │
│ Hooks:         useXxx.ts                │
│ Stores:        xxxStore.ts              │
│ Utils:         camelCase.ts             │
│ Controllers:   xxx.controller.ts        │
│ Routes:        xxx.routes.ts            │
│ Types:         PascalCase (no I prefix) │
│ Constants:     UPPER_SNAKE_CASE         │
├──────────────────────────────────────────┤
│ Commits:  type(scope): description      │
│ Branches: feature/xxx, fix/xxx          │
│ PRs:      Always to develop, 1 reviewer │
├──────────────────────────────────────────┤
│ NO any. NO console.log. NO ==.          │
│ Always handle null/undefined.           │
│ Format on save. Lint before commit.     │
└──────────────────────────────────────────┘
```

---

> **"Code standards itu bukan birokrasi. Ini investment. 30 menit setup di Day 1 saves HOURS of debugging dan PR review drama. Trust the process."**
