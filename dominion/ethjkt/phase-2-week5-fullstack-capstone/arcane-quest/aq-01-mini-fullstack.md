# ⚡ ARCANE QUEST 01 — SPEED QUEST: Mini Fullstack

> **"Build Notes App fullstack dari nol sampai deploy. Tunjukin kalian bisa deliver."**

---

## 🎯 Misi

Build **Arcane Notes** — fullstack notes application dengan authentication. React frontend, Express backend, PostgreSQL database, deployed ke production.

Ini bukan capstone. Ini **warm-up**. Tujuannya: buktiin kalian bisa deliver fullstack app yang solid.

---

## 📊 Grading

| Kategori | Bobot | Detail |
|----------|-------|--------|
| **Functionality** | 35% | Semua requirements work end-to-end, no critical bugs |
| **Code Quality** | 25% | TypeScript strict, clean architecture, well-commented |
| **UI/UX** | 20% | Responsive, intuitive, loading/error states handled |
| **Deployment** | 20% | Both FE + BE deployed dan accessible di production |

---

## 📋 Requirements

### Authentication (WAJIB)

- [ ] Register — email, password (hashed bcrypt), nama
- [ ] Login — return JWT token
- [ ] Protected routes — middleware check token
- [ ] Logout — clear token di client

### Notes CRUD (WAJIB)

- [ ] Create note — title, content, user_id
- [ ] Read all notes — filtered by logged-in user
- [ ] Read single note — by ID, only owner
- [ ] Update note — title dan/atau content
- [ ] Delete note — soft delete atau hard delete

### Frontend (WAJIB)

- [ ] Login / Register page
- [ ] Notes list page (dashboard)
- [ ] Create / Edit note page atau modal
- [ ] Delete confirmation
- [ ] Protected routes (redirect ke login kalau belum auth)
- [ ] Basic responsive (gak harus cantik, tapi usable di mobile)

### Deployment (WAJIB)

- [ ] Backend → Railway (dengan PostgreSQL)
- [ ] Frontend → Vercel
- [ ] Kedua app terhubung dan berfungsi di production

---

## 🛠️ Tech Stack (FIXED)

```
Frontend:  React + TypeScript + Vite + Tailwind CSS
Backend:   Express + TypeScript + Prisma
Database:  PostgreSQL (Railway)
Auth:      JWT (jsonwebtoken + bcrypt)
Deploy:    Vercel (FE) + Railway (BE + DB)
```

---

## 📐 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  notes     Note[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user baru |
| POST | `/api/auth/login` | ❌ | Login, return JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/notes` | ✅ | Get all notes (user) |
| GET | `/api/notes/:id` | ✅ | Get single note |
| POST | `/api/notes` | ✅ | Create note |
| PUT | `/api/notes/:id` | ✅ | Update note |
| DELETE | `/api/notes/:id` | ✅ | Delete note |

---

## 🛤️ Recommended Steps

```
1. Setup — init repo, install deps, folder structure
2. Database — Prisma schema, migrate, seed
3. Backend — Auth endpoints + middleware
4. Backend — Notes CRUD endpoints
5. Frontend — Auth pages (login/register)
6. Frontend — Notes CRUD UI
7. Deploy — Railway (BE+DB) + Vercel (FE)
8. Test production + fix bugs
```

---

## ⭐ POIN PLUS (Optional, Buat yang Mau Flex)

### Categories (+10 poin)

- [ ] Tambah model `Category` (id, name, color)
- [ ] Note bisa di-assign ke category
- [ ] Filter notes by category di frontend
- [ ] CRUD category

### Search (+10 poin)

- [ ] Search bar di notes list
- [ ] Search by title AND content
- [ ] Debounced search (gak query setiap keystroke)

### Markdown Support (+10 poin)

- [ ] Content note support markdown
- [ ] Preview mode (rendered markdown)
- [ ] Pakai `react-markdown` atau similar

### Pin Notes (+5 poin)

- [ ] Toggle pin/unpin
- [ ] Pinned notes always di atas

---

## 📁 Folder Structure

```
arcane-notes/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── middleware/
│       │   ├── lib/
│       │   └── index.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Submission

```
Submit:
1. GitHub repo URL
2. Live frontend URL (Vercel)
3. Live backend URL (Railway)
4. Screenshot timestamp dari git log (bukti waktu)
```

---

## 💡 Tips dari Gua

1. **Jangan over-engineer.** Ini speed quest. Simple > Perfect.
2. **Copy-paste dari project sebelumnya = BOLEH.** Ini real world. Reuse code.
3. **Deploy DULU sebelum polish.** Working deployed app > Beautiful local app.
4. **Commit frequently.** Biar progress kalian keliatan jelas.
5. **Kalau stuck, skip dan lanjut.** Balik nanti kalau udah kelar yang lain.

**1 app. Fullstack. Deployed. Go.** ⚡
