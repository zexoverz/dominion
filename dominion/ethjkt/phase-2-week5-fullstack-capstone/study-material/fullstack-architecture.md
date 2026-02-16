# 🏗️ Fullstack Architecture Patterns

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> Arsitektur yang baik itu kayak fondasi rumah — nggak keliatan dari luar, tapi kalau jelek, semuanya runtuh.

---

## 🎯 Kenapa Arsitektur Penting?

Lo udah bisa bikin frontend. Lo udah bisa bikin backend. Tapi gimana caranya **gabungin keduanya** dengan rapi? Itu yang kita bahas di sini.

Arsitektur yang bagus bikin:
- **Codebase gampang di-navigate** — Developer baru bisa langsung paham
- **Scalable** — Tambah fitur tanpa refactor besar-besaran
- **Maintainable** — Bug gampang ditemukan dan di-fix
- **Deployable** — Frontend dan backend bisa di-deploy independently

---

## 📁 Monorepo vs Separate Repos

### Option 1: Monorepo (Recommended buat Capstone)

Semua code dalam **satu repository**:

```
my-capstone/
├── client/          # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/          # Express backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── shared/          # Shared types & utils
│   ├── types.ts
│   └── constants.ts
├── package.json     # Root package.json (workspaces)
├── .gitignore
├── .env.example
└── README.md
```

**Kelebihan:**
- Satu git history — gampang track perubahan
- Shared types antara FE/BE — no more type mismatch
- Satu PR bisa update FE + BE sekaligus
- Gampang di-setup buat capstone (satu repo, satu clone)

**Kekurangan:**
- Repo bisa jadi gede kalau project besar
- CI/CD lebih complex (harus tau mana yang berubah)

### Option 2: Separate Repos

```
my-capstone-client/    # Repo 1: Frontend
my-capstone-server/    # Repo 2: Backend
```

**Kelebihan:**
- Separation of concerns yang jelas
- Deploy independently — FE update nggak affect BE
- Tim bisa kerja parallel tanpa conflict

**Kekurangan:**
- Shared types harus di-publish sebagai package atau di-copy
- Dua repo = dua tempat manage issues, PRs, etc.

### Rekomendasi ETHJKT:

**Buat capstone, pakai monorepo.** Lebih simpel, lo kerja sendiri, dan shared types itu game changer.

---

## 📂 Folder Structure — The Right Way

### Frontend (React + Vite + TypeScript)

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Atomic components (Button, Input, Card)
│   │   ├── layout/       # Layout components (Header, Sidebar, Footer)
│   │   └── forms/        # Form components
│   ├── pages/            # Page-level components (route targets)
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useNotes.ts
│   │   └── useDebounce.ts
│   ├── services/         # API calls
│   │   ├── api.ts        # Axios/fetch instance
│   │   ├── authService.ts
│   │   └── notesService.ts
│   ├── context/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── types/            # TypeScript types (or import from shared/)
│   │   └── index.ts
│   ├── utils/            # Helper functions
│   │   ├── formatDate.ts
│   │   └── validation.ts
│   ├── styles/           # Global styles
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx        # React Router config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

### Backend (Express + TypeScript)

```
server/
├── src/
│   ├── config/           # Configuration
│   │   ├── database.ts   # DB connection
│   │   ├── env.ts        # Environment variables
│   │   └── cors.ts       # CORS config
│   ├── controllers/      # Route handlers (business logic)
│   │   ├── authController.ts
│   │   └── notesController.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts       # JWT verification
│   │   ├── validate.ts   # Request validation
│   │   └── errorHandler.ts
│   ├── models/           # Database models / queries
│   │   ├── userModel.ts
│   │   └── noteModel.ts
│   ├── routes/           # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── notesRoutes.ts
│   │   └── index.ts      # Route aggregator
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Helper functions
│   │   ├── hash.ts
│   │   └── jwt.ts
│   ├── db/
│   │   ├── migrations/   # SQL migration files
│   │   └── seeds/        # Seed data
│   └── app.ts            # Express app setup
├── package.json
├── tsconfig.json
└── .env
```

### Kenapa Structure Ini?

**Separation by feature type** (bukan by feature). Ini pattern paling umum dan gampang dipahami:

- Mau cari semua API routes? Lihat `routes/`
- Mau cari business logic? Lihat `controllers/`
- Mau cari database queries? Lihat `models/`
- Mau cari reusable components? Lihat `components/`

---

## 🔗 Shared Types — FE & BE Ngomong Bahasa yang Sama

Ini salah satu **biggest wins** dari monorepo. Definisikan types **sekali**, pakai di **dua tempat**:

```typescript
// shared/types.ts

// ===== User =====
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  data: {
    user: User;
    token: string;
  };
}

// ===== Notes =====
export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  category?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  category?: string;
  isPinned?: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
}

// ===== API Response wrapper =====
export type ApiResponse<T> =
  | { success: true; data: T }
  | ErrorResponse;
```

### Pakai di Frontend:

```typescript
// client/src/services/notesService.ts
import type { Note, CreateNoteRequest, PaginatedResponse } from '../../shared/types';
import api from './api';

export const getNotes = async (page = 1): Promise<PaginatedResponse<Note>> => {
  const { data } = await api.get(`/notes?page=${page}`);
  return data;
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  const { data } = await api.post('/notes', note);
  return data.data;
};
```

### Pakai di Backend:

```typescript
// server/src/controllers/notesController.ts
import type { CreateNoteRequest, Note, PaginatedResponse } from '../../shared/types';
import { Request, Response } from 'express';
import * as noteModel from '../models/noteModel';

export const getNotes = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { notes, total } = await noteModel.findByUserId(userId, page, limit);

  const response: PaginatedResponse<Note> = {
    success: true,
    data: notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  res.json(response);
};
```

**Hasilnya?** Kalau lo ubah type di `shared/types.ts`, TypeScript akan **teriak** di kedua sisi kalau ada yang nggak match. No more "kenapa frontend expect `userName` tapi backend send `name`?"

---

## 📜 API Contract Design

API contract itu **perjanjian** antara frontend dan backend: "Gue kirim data format X, lo balas format Y."

### Konsistensi Response Format:

Selalu pakai format yang **konsisten**:

```typescript
// Success response
{
  "success": true,
  "data": { ... }       // or [...]
  "message": "Optional success message"
}

// Error response
{
  "success": false,
  "error": "What went wrong"
  "details": [...]       // Optional validation errors
}
```

### Error Handling Middleware:

```typescript
// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

### Versioning (Nice-to-have):

```
/api/v1/notes    ← Current version
/api/v2/notes    ← Future version with breaking changes
```

Buat capstone, lo nggak perlu versioning. Tapi good to know buat real projects.

---

## 🌍 Environment Separation

App lo harus bisa jalan di **berbagai environment** tanpa ubah code:

### Environment Variables:

```bash
# .env.example (commit this to git!)
# Copy to .env and fill in values

# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_dev

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

```bash
# .env (DON'T commit this!)
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notes_dev
JWT_SECRET=dev-secret-key-12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Environment Config Pattern:

```typescript
// server/src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  get isDev() { return this.nodeEnv === 'development'; },
  get isProd() { return this.nodeEnv === 'production'; },
};

// Validate required vars at startup
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

### Three Environments:

| Environment | Purpose | Database | URL |
|-------------|---------|----------|-----|
| **Development** | Local coding | Local PostgreSQL | localhost:5173 + :3001 |
| **Staging** | Test before production | Staging DB | staging.myapp.com |
| **Production** | Real users | Production DB | myapp.com |

### Frontend Environment Variables (Vite):

```bash
# client/.env
VITE_API_URL=http://localhost:3001/api

# client/.env.production
VITE_API_URL=https://api.myapp.railway.app/api
```

```typescript
// client/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔧 Monorepo Setup dengan npm Workspaces

### Root package.json:

```json
{
  "name": "my-capstone",
  "private": true,
  "workspaces": [
    "client",
    "server",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build --workspace=client && npm run build --workspace=server",
    "test": "npm run test --workspace=client && npm run test --workspace=server",
    "lint": "npm run lint --workspace=client && npm run lint --workspace=server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### Setup Commands:

```bash
# Initialize monorepo
mkdir my-capstone && cd my-capstone
npm init -y

# Create client (React + Vite)
npm create vite@latest client -- --template react-ts
cd client && npm install && cd ..

# Create server
mkdir -p server/src
cd server && npm init -y
npm install express cors dotenv pg jsonwebtoken bcryptjs
npm install -D typescript @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs tsx nodemon
cd ..

# Create shared types
mkdir shared
echo '// Shared types go here' > shared/types.ts

# Install root dependencies
npm install -D concurrently

# Start both!
npm run dev
```

---

## 🏋️ Latihan

### Exercise 1: Setup Monorepo
1. Buat monorepo structure dengan npm workspaces
2. Setup client (Vite + React + TS) dan server (Express + TS)
3. Buat `shared/types.ts` dengan minimal 3 interfaces
4. Pastikan `npm run dev` jalan buat keduanya

### Exercise 2: Implement Shared Types
1. Define types untuk capstone project lo di `shared/types.ts`
2. Import dan pakai di client service file
3. Import dan pakai di server controller
4. Verify TypeScript nggak ada error

### Exercise 3: Environment Setup
1. Buat `.env.example` dengan semua variables yang dibutuhin
2. Buat `config/env.ts` dengan validation
3. Setup axios instance dengan `VITE_API_URL`
4. Test: ubah API URL, pastikan client nyambung ke URL yang baru

---

## 🔑 Key Takeaways

- **Monorepo** = pilihan terbaik buat solo capstone project
- **Folder structure** yang konsisten bikin code gampang di-navigate
- **Shared types** = satu sumber kebenaran buat FE dan BE
- **API contract** yang jelas mencegah miscommunication
- **Environment separation** bikin app portable dari dev ke production
- **Config validation** at startup mencegah runtime errors

> 🧙‍♂️ "Arsitektur yang baik itu invisible — lo baru sadar pentingnya ketika nggak ada." — ETHJKT Wisdom

Sekarang lo punya blueprint buat build capstone dengan struktur yang solid. Let's build something amazing! 🚀
