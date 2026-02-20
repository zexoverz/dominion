# 🏗️ 02 — Fullstack Architecture: Biar Gak Berantakan

```
╔═══════════════════════════════════════════════════╗
║  "Architecture is the decisions you wish you      ║
║   could get right early in a project."            ║
║  — Ralph Johnson                                  ║
╚═══════════════════════════════════════════════════╝
```

## Monorepo vs Separate Repos

Pertanyaan pertama yang harus dijawab: **taruh frontend dan backend di satu repo atau pisah?**

### Option A: Monorepo (RECOMMENDED buat capstone)

```
my-app/
├── packages/
│   ├── frontend/        ← React app
│   ├── backend/         ← Express app
│   └── shared/          ← Shared TypeScript types
├── package.json         ← Root package.json
├── tsconfig.base.json   ← Shared TS config
└── README.md
```

**Pros:**
- ✅ Satu repo, satu PR, satu CI/CD
- ✅ Shared types antara FE dan BE — **INI GAME CHANGER**
- ✅ Atomic commits (ubah API + frontend sekaligus)
- ✅ Lebih gampang setup buat 1 orang

**Cons:**
- ❌ Repo bisa gede
- ❌ Deploy lebih ribet (harus deploy FE dan BE terpisah dari 1 repo)

### Option B: Separate Repos

```
my-app-frontend/    ← Repo 1
my-app-backend/     ← Repo 2
```

**Pros:**
- ✅ Deploy lebih straightforward
- ✅ Tim bisa kerja independent
- ✅ CI/CD lebih simple per repo

**Cons:**
- ❌ Gak bisa share types langsung
- ❌ Harus sync manual kalau API berubah
- ❌ Dua repo buat di-manage

### Verdict buat Capstone:

**MONOREPO.** Kalian kerja sendiri (atau tim kecil), dan shared types itu **TERLALU BERGUNA** buat dilewatin. Trust me.

## Production Folder Structure

Ini folder structure yang gua recommend. Ini bukan random — ini structure yang dipake di banyak production codebase:

```
capstone-project/
├── packages/
│   ├── frontend/
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── assets/              ← Images, fonts, etc
│   │   │   ├── components/          ← Reusable UI components
│   │   │   │   ├── ui/              ← Generic (Button, Input, Modal)
│   │   │   │   └── layout/          ← Layout components (Header, Footer, Sidebar)
│   │   │   ├── features/            ← Feature-based modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/  ← Feature-specific components
│   │   │   │   │   ├── hooks/       ← Feature-specific hooks
│   │   │   │   │   ├── api.ts       ← API calls for this feature
│   │   │   │   │   ├── store.ts     ← Zustand store for this feature
│   │   │   │   │   └── types.ts     ← Feature-specific types
│   │   │   │   ├── notes/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── api.ts
│   │   │   │   │   ├── store.ts
│   │   │   │   │   └── types.ts
│   │   │   │   └── tags/
│   │   │   │       └── ...
│   │   │   ├── hooks/               ← Global shared hooks
│   │   │   ├── lib/                 ← Utilities, helpers, config
│   │   │   │   ├── api-client.ts    ← Axios/fetch wrapper
│   │   │   │   ├── utils.ts         ← Generic utility functions
│   │   │   │   └── constants.ts     ← App constants
│   │   │   ├── pages/               ← Route pages
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── NotesPage.tsx
│   │   │   ├── routes/              ← React Router config
│   │   │   │   └── index.tsx
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── .env.example
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma        ← Database schema
│   │   │   ├── migrations/          ← Auto-generated migrations
│   │   │   └── seed.ts              ← Seed data
│   │   ├── src/
│   │   │   ├── config/              ← App configuration
│   │   │   │   ├── env.ts           ← Environment variable validation
│   │   │   │   └── database.ts      ← Prisma client instance
│   │   │   ├── middleware/           ← Express middleware
│   │   │   │   ├── auth.ts          ← JWT verification
│   │   │   │   ├── errorHandler.ts  ← Global error handler
│   │   │   │   └── validation.ts    ← Request validation (Zod)
│   │   │   ├── modules/             ← Feature modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   └── auth.validation.ts
│   │   │   │   ├── notes/
│   │   │   │   │   ├── notes.controller.ts
│   │   │   │   │   ├── notes.service.ts
│   │   │   │   │   ├── notes.routes.ts
│   │   │   │   │   └── notes.validation.ts
│   │   │   │   └── tags/
│   │   │   │       └── ...
│   │   │   ├── utils/               ← Utility functions
│   │   │   │   ├── jwt.ts
│   │   │   │   ├── hash.ts
│   │   │   │   └── response.ts      ← Standardized response helpers
│   │   │   ├── app.ts               ← Express app setup
│   │   │   └── server.ts            ← Server entry point
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/
│       ├── src/
│       │   ├── types/               ← Shared TypeScript types
│       │   │   ├── user.ts
│       │   │   ├── note.ts
│       │   │   ├── tag.ts
│       │   │   └── api.ts           ← API request/response types
│       │   └── index.ts             ← Re-export everything
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                   ← GitHub Actions
├── .gitignore
├── package.json                     ← Root workspace config
├── tsconfig.base.json
└── README.md
```

Gua tau ini keliatan banyak. Tapi setiap folder punya PURPOSE. Gak ada yang random.

## Kenapa Feature-Based Structure?

Liat frontend structure di atas — gua pake **feature-based** bukan **type-based**:

```
❌ Type-based (JANGAN):          ✅ Feature-based (PAKE INI):
src/                              src/
├── components/                   ├── features/
│   ├── NoteCard.tsx             │   ├── notes/
│   ├── NoteForm.tsx             │   │   ├── components/
│   ├── LoginForm.tsx            │   │   │   ├── NoteCard.tsx
│   └── TagBadge.tsx             │   │   │   └── NoteForm.tsx
├── hooks/                        │   │   ├── hooks/
│   ├── useNotes.ts              │   │   │   └── useNotes.ts
│   ├── useAuth.ts               │   │   └── api.ts
│   └── useTags.ts               │   ├── auth/
├── services/                     │   │   ├── components/
│   ├── noteService.ts           │   │   │   └── LoginForm.tsx
│   ├── authService.ts           │   │   └── hooks/
│   └── tagService.ts            │   │       └── useAuth.ts
└── types/                        │   └── tags/
    ├── note.ts                   │       └── ...
    ├── auth.ts                   └── components/
    └── tag.ts                        └── ui/  ← shared only
```

**Kenapa feature-based lebih bagus?**

1. **Colocation** — semua yang related ada di satu folder. Mau ngerjain fitur notes? Buka `features/notes/`, semua ada di situ.
2. **Scalability** — tambah fitur baru = tambah folder baru. Gak perlu edit 5 folder berbeda.
3. **Delete-ability** — mau hapus fitur? Delete 1 folder. Done.

## Shared Types — The Secret Weapon

Ini alasan utama gua recommend monorepo. Dengan shared types, frontend dan backend **guaranteed pake type yang sama**.

### packages/shared/src/types/user.ts

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### packages/shared/src/types/note.ts

```typescript
import type { Tag } from './tag';

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPinned: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  isPinned?: boolean;
  tagIds?: number[];
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {}

export interface NotesResponse {
  notes: Note[];
  total: number;
}
```

### packages/shared/src/types/api.ts

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Pake di Backend:

```typescript
// packages/backend/src/modules/notes/notes.controller.ts
import type { CreateNoteRequest, NotesResponse } from '@capstone/shared';

export const getNotes = async (req: Request, res: Response) => {
  const notes = await noteService.getAll(req.userId);
  const response: NotesResponse = { notes, total: notes.length };
  res.json(response);
};

export const createNote = async (req: Request, res: Response) => {
  const data: CreateNoteRequest = req.body;  // Type-safe!
  const note = await noteService.create(req.userId, data);
  res.status(201).json(note);
};
```

### Pake di Frontend:

```typescript
// packages/frontend/src/features/notes/api.ts
import type { CreateNoteRequest, NotesResponse, Note } from '@capstone/shared';
import { apiClient } from '@/lib/api-client';

export const fetchNotes = async (): Promise<NotesResponse> => {
  const { data } = await apiClient.get('/notes');
  return data;
};

export const createNote = async (payload: CreateNoteRequest): Promise<Note> => {
  const { data } = await apiClient.post('/notes', payload);
  return data;
};
```

**Liat?** Frontend dan backend pake TYPE YANG SAMA. Kalau backend ubah response format, TypeScript langsung error di frontend. **No more "kok API-nya beda?"**

## API-Contract-First Development

Workflow yang gua recommend:

```mermaid
flowchart LR
    A[Define Types\nin shared/] --> B[Write API Contract\nendpoint + types]
    B --> C[Backend implements\nendpoints]
    B --> D[Frontend mocks data\nbased on types]
    C --> E[Integration\nConnect FE to BE]
    D --> E
    E --> F[Test + Deploy]
```

### Step-by-step:

1. **Define shared types** dulu — ini kontrak antara FE dan BE
2. **Backend implement** endpoints yang return data sesuai types
3. **Frontend develop** pake mock data yang shape-nya sesuai types
4. **Connect** — ganti mock dengan real API calls
5. **Guaranteed compatible** karena pake types yang sama

Ini cara kerja yang dipake di banyak perusahaan. Frontend gak perlu nunggu backend selesai, dan sebaliknya.

## Environment Separation

**JANGAN PERNAH** hardcode credentials di code. Pake environment variables.

### packages/backend/.env.example

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/capstone_dev

# Auth
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Sentry (optional)
SENTRY_DSN=
```

### packages/frontend/.env.example

```bash
VITE_API_URL=http://localhost:3000/api
VITE_SENTRY_DSN=
```

### Environment validation (backend):

```typescript
// packages/backend/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

Ini bikin app lo crash IMMEDIATELY kalau env var missing, bukan crash random 2 jam kemudian pas ada request.

## Architecture Diagram

Ini full architecture dari capstone project:

```mermaid
graph TB
    subgraph "Client (Browser)"
        FE[React + Vite + TypeScript]
        Z[Zustand Store]
        RQ[React Query Cache]
        FE --> Z
        FE --> RQ
    end
    
    subgraph "Vercel"
        CDN[Vercel CDN / Edge]
    end
    
    subgraph "Railway"
        BE[Express + TypeScript]
        PM[Prisma ORM]
        DB[(PostgreSQL)]
        BE --> PM --> DB
    end
    
    subgraph "External Services"
        S[Sentry Monitoring]
        GH[GitHub Actions CI/CD]
    end
    
    FE -->|"HTTPS API calls"| CDN
    CDN -->|"Serves static files"| FE
    RQ -->|"GET/POST/PUT/DELETE"| BE
    BE -->|"JSON responses"| RQ
    FE -.->|"Error reports"| S
    BE -.->|"Error reports"| S
    GH -.->|"Deploy"| CDN
    GH -.->|"Deploy"| BE
```

### Request Flow:

```
User Action
    │
    ▼
React Component
    │
    ├── Local state? → Zustand
    │
    └── Server data? → React Query
                          │
                          ▼
                    API Client (Axios)
                          │
                          ▼
                    Express Router
                          │
                          ▼
                    Middleware Chain
                    (CORS → Auth → Validate)
                          │
                          ▼
                    Controller
                          │
                          ▼
                    Service Layer
                          │
                          ▼
                    Prisma ORM
                          │
                          ▼
                    PostgreSQL
                          │
                          ▼
                    Response travels back up ⬆️
```

## Setting Up the Monorepo

### Root package.json:

```json
{
  "name": "capstone-project",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:frontend": "npm run dev --workspace=packages/frontend",
    "dev:backend": "npm run dev --workspace=packages/backend",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "typescript": "^5.3.0"
  }
}
```

### tsconfig.base.json:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Dari root, `npm run dev` bakal jalanin frontend AND backend sekaligus. Clean.

## Backend Layer Pattern

Gua pake **Controller → Service → Repository** pattern:

```
┌─────────────┐
│  Controller  │  ← Handle HTTP request/response
│              │  ← Input validation
│              │  ← Call service
├─────────────┤
│  Service     │  ← Business logic
│              │  ← Data transformation
│              │  ← Error handling
├─────────────┤
│  Prisma ORM  │  ← Database queries
│              │  ← Raw data access
└─────────────┘
```

**Kenapa split?**
- Controller gak perlu tau database query gimana
- Service bisa di-test tanpa HTTP
- Ganti database? Cuma ubah di Prisma layer, service tetap sama

### Example:

```typescript
// notes.controller.ts — Handle HTTP
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createNoteSchema.parse(req.body);
    const note = await noteService.create(req.userId!, data);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// notes.service.ts — Business logic
export const noteService = {
  async create(userId: number, data: CreateNoteRequest): Promise<Note> {
    const note = await prisma.note.create({
      data: {
        ...data,
        userId,
        tags: data.tagIds ? {
          connect: data.tagIds.map(id => ({ id }))
        } : undefined
      },
      include: { tags: true }
    });
    return note;
  }
};
```

## Recap

```
Architecture Decisions for Capstone:
├── Monorepo with npm workspaces
├── Feature-based folder structure
├── Shared TypeScript types (FE + BE)
├── API-contract-first development
├── Environment validation with Zod
├── Controller → Service → Prisma pattern
└── Concurrent dev server (FE + BE)
```

Arsitektur yang bagus itu kayak fondasi rumah. Kalau fondasinya bener, lo bisa tambah lantai tanpa ambruk. Kalau fondasinya asal, lantai 2 langsung retak.

**Setup arsitektur yang bener dari awal. Future you will thank present you.** 🙏

---

Next Part -> [03 - Prisma & Drizzle](https://github.com/Ethereum-Jakarta/phase-2-week5-fullstack-capstone/blob/main/study-material/03-prisma-drizzle.md)
