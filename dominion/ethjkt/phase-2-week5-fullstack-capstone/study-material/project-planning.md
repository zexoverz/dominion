# 📋 Project Planning & Wireframing

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> "Failing to plan is planning to fail." — Benjamin Franklin
>
> Minggu terakhir, geng. Capstone week. Sebelum kita ngebut coding, kita harus **plan dulu**. Trust me, 2 jam planning bisa save 20 jam debugging.

---

## 🎯 Kenapa Planning Itu Penting?

Pernah nggak lo mulai coding langsung, terus di tengah jalan bingung: "Eh, ini database-nya gimana ya?" atau "Aduh, API-nya harusnya kayak gini bukan sih?"

Itu yang terjadi kalau lo skip planning. Hasilnya:
- **Scope creep** — fitur nambah terus, nggak kelar-kelar
- **Technical debt** — code jadi berantakan karena nggak ada arsitektur jelas
- **Wasted time** — refactor berkali-kali karena salah desain dari awal

Di dunia profesional, engineer senior biasanya spend **30-40% waktu di planning** sebelum nulis satu baris code. Kita nggak perlu se-intense itu, tapi minimal lo harus punya:

1. **User Stories** — Siapa user-nya? Mau ngapain?
2. **Feature List** — Fitur apa aja yang di-build?
3. **Wireframes** — Tampilannya kayak gimana?
4. **Database Schema** — Data disimpan gimana?
5. **API Endpoints** — Frontend ngomong ke backend lewat mana?
6. **Timeline** — Kapan harus kelar?

---

## 📝 Step 1: User Stories

User story itu cara kita **describe fitur dari perspektif user**. Format-nya:

```
Sebagai [role], saya ingin [action], supaya [benefit].
```

### Contoh — Notes App:

```markdown
1. Sebagai user, saya ingin register akun, supaya data notes saya tersimpan.
2. Sebagai user, saya ingin login ke akun saya, supaya bisa akses notes dari mana aja.
3. Sebagai user, saya ingin membuat note baru, supaya bisa mencatat ide.
4. Sebagai user, saya ingin mengedit note, supaya bisa update isinya.
5. Sebagai user, saya ingin menghapus note, supaya bisa bersihkan yang nggak perlu.
6. Sebagai user, saya ingin search notes, supaya bisa cari note dengan cepat.
```

### Tips Menulis User Stories:

- **Spesifik** — Jangan "saya ingin manage notes". Pecah jadi create, read, update, delete.
- **Prioritas** — Kasih label: Must-have, Nice-to-have, Stretch goal.
- **Testable** — Lo harus bisa verify: "Fitur ini udah jalan atau belum?"

### Prioritization dengan MoSCoW:

| Label | Artinya | Contoh |
|-------|---------|--------|
| **Must** | Wajib ada, app nggak jalan tanpa ini | Auth, CRUD utama |
| **Should** | Penting tapi app masih bisa jalan tanpa ini | Search, filter |
| **Could** | Bagus kalau ada | Dark mode, animations |
| **Won't** | Nggak dikerjain sekarang | Mobile app, AI features |

---

## 📋 Step 2: Feature List & Breakdown

Dari user stories, kita bikin **feature list** yang lebih teknikal:

```markdown
## Authentication
- [ ] Register dengan email & password
- [ ] Login & dapat JWT token
- [ ] Protected routes (redirect ke login kalau belum auth)
- [ ] Logout (clear token)

## Notes CRUD
- [ ] Create note (title + content)
- [ ] List semua notes (dengan pagination)
- [ ] View single note
- [ ] Edit note
- [ ] Delete note (dengan konfirmasi)

## Search & Filter
- [ ] Search by title
- [ ] Sort by date (newest/oldest)
- [ ] Filter by category/tag

## UI/UX
- [ ] Responsive design (mobile + desktop)
- [ ] Loading states
- [ ] Error handling & toast notifications
- [ ] Empty states
```

Setiap checkbox itu bisa jadi **task** yang lo track progressnya. Kalau kerja tim, bisa assign ke orang.

---

## 🎨 Step 3: Wireframing

Wireframe itu **sketsa kasar** dari UI lo. Bukan desain final — tujuannya buat **plan layout dan flow** sebelum coding.

### Tools yang Bisa Dipake:

1. **Excalidraw** (excalidraw.com) — Free, simple, hand-drawn style. Recommended buat quick wireframes.
2. **Figma** (figma.com) — Lebih proper, bisa bikin hi-fi mockups. Free tier cukup.
3. **Kertas + Pulpen** — Seriously, ini valid. Foto aja hasilnya.

### Apa Aja yang Di-wireframe:

```
📱 Pages/Screens:
├── Landing Page / Login
├── Register
├── Dashboard (list notes)
├── Create Note
├── Edit Note
├── Note Detail
└── Profile / Settings
```

### Contoh Wireframe Sederhana (ASCII):

```
┌─────────────────────────────────┐
│  🔷 NotesApp        [+ New] [👤]│
├─────────────────────────────────┤
│  🔍 Search notes...             │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 📝 Meeting Notes          │  │
│  │ Updated: 2 hours ago      │  │
│  │ Lorem ipsum dolor sit...  │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 📝 Shopping List          │  │
│  │ Updated: yesterday        │  │
│  │ Beli susu, telur, roti... │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 📝 Project Ideas          │  │
│  │ Updated: 3 days ago       │  │
│  │ DeFi dashboard, NFT...    │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  📊 Dashboard  📝 Notes  ⚙️    │
└─────────────────────────────────┘
```

### User Flow Diagram:

```
[Landing] → [Login] → [Dashboard]
                          ↓
                    [Create Note] → [Dashboard] (updated)
                          ↓
                    [View Note] → [Edit Note] → [Dashboard]
                          ↓
                    [Delete] → [Confirm] → [Dashboard]
```

### Tips Wireframing:

1. **Start low-fi** — Kotak-kotak dan garis aja dulu. Jangan mikirin warna.
2. **Focus on flow** — Gimana user navigate dari satu page ke page lain?
3. **Think about states** — Loading, empty, error, success.
4. **Mobile first** — Desain mobile dulu, baru scale ke desktop.

---

## 🗄️ Step 4: Database Schema Design

Sebelum nulis SQL, **gambar dulu** relasi antar tabel:

### Contoh — Notes App Schema:

```sql
-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,      -- hashed!
  name        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  content     TEXT,
  category    VARCHAR(50),
  is_pinned   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Tags table (optional - many-to-many)
CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
  note_id  INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  tag_id   INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
```

### Entity Relationship Diagram (ERD):

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  users   │────<│  notes   │>────│ note_tags │────<│  tags    │
│──────────│     │──────────│     │──────────│     │──────────│
│ id (PK)  │     │ id (PK)  │     │ note_id  │     │ id (PK)  │
│ email    │     │ user_id  │     │ tag_id   │     │ name     │
│ password │     │ title    │     └──────────┘     └──────────┘
│ name     │     │ content  │
│ created  │     │ category │
└──────────┘     │ is_pinned│
                 │ created  │
                 └──────────┘
```

### Tips Database Design:

- **Normalisasi** — Jangan duplikasi data. Kalau satu data dipakai di banyak tempat, bikin tabel sendiri.
- **Foreign keys** — Selalu pakai FK buat menjaga integritas data.
- **Indexes** — Tambahin index di kolom yang sering di-query (email, user_id).
- **Timestamps** — Selalu tambah `created_at` dan `updated_at`.
- **Soft delete** — Consider pakai `deleted_at` instead of benar-benar delete data.

---

## 🔌 Step 5: API Endpoint Planning

Design API lo **sebelum coding**. Ini jadi "kontrak" antara frontend dan backend.

### RESTful API Convention:

```markdown
## Auth Endpoints
POST   /api/auth/register    — Register user baru
POST   /api/auth/login       — Login, return JWT
GET    /api/auth/me          — Get current user (protected)

## Notes Endpoints
GET    /api/notes             — List user's notes (with pagination)
POST   /api/notes             — Create new note
GET    /api/notes/:id         — Get single note
PUT    /api/notes/:id         — Update note
DELETE /api/notes/:id         — Delete note

## Search
GET    /api/notes?search=keyword&sort=newest&page=1&limit=10
```

### API Contract — Request & Response:

```markdown
### POST /api/auth/register

Request:
{
  "email": "wizard@ethjkt.id",
  "password": "secretspell123",
  "name": "Arcane Wizard"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "wizard@ethjkt.id",
    "name": "Arcane Wizard",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Response (400):
{
  "success": false,
  "error": "Email already registered"
}
```

```markdown
### GET /api/notes?page=1&limit=10

Headers: Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Meeting Notes",
      "content": "Discuss capstone...",
      "category": "work",
      "is_pinned": true,
      "created_at": "2026-02-16T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### HTTP Status Codes yang Sering Dipake:

| Code | Meaning | Kapan Dipake |
|------|---------|--------------|
| 200 | OK | GET success, UPDATE success |
| 201 | Created | POST success (create resource) |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Token invalid/missing |
| 403 | Forbidden | Nggak punya akses |
| 404 | Not Found | Resource nggak ada |
| 500 | Server Error | Bug di backend |

---

## ⏰ Step 6: Timeline Estimation

Capstone lo punya **7 hari**. Ini template timeline-nya:

```markdown
## 📅 Capstone Timeline (7 Days)

### Day 1-2: Planning & Setup
- [ ] Finalize user stories & feature list
- [ ] Wireframe semua pages
- [ ] Design database schema
- [ ] Plan API endpoints
- [ ] Setup project (repo, folders, dependencies)
- [ ] Setup database & run migrations

### Day 3-5: Building
- [ ] Day 3: Auth (register, login, protected routes)
- [ ] Day 4: Core CRUD (main feature)
- [ ] Day 5: Additional features + UI polish

### Day 6: Testing & Deployment
- [ ] Write tests (minimum 8: unit + integration)
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] Test di production

### Day 7: Presentation Prep
- [ ] Polish README (screenshots, badges, setup guide)
- [ ] Prepare demo script
- [ ] Practice presentation (5-7 menit)
- [ ] Record backup video (just in case)
- [ ] Final commit & push
```

### Tips Estimasi Waktu:

1. **Multiply by 2** — Kalau lo pikir butuh 2 jam, allocate 4 jam. Selalu ada unexpected issues.
2. **Buffer time** — Sisain 20% waktu buat bug fixing dan polish.
3. **MVP first** — Kelar-in Must-have features dulu. Nice-to-have bisa ditambah kalau masih ada waktu.
4. **Daily check** — Tiap hari review: "Apakah gue on track?"

---

## 📄 Planning Document Template

Copy template ini buat capstone lo:

```markdown
# 🏗️ [Nama Project] — Planning Document

## Overview
- **Nama:** [Nama project]
- **Deskripsi:** [1-2 kalimat tentang apa app ini]
- **Tech Stack:** React, Express, PostgreSQL, [lainnya]
- **Timeline:** [start date] — [end date]

## User Stories
1. Sebagai [role], saya ingin [action], supaya [benefit].
2. ...

## Feature Breakdown

### Must-have (MVP)
- [ ] Feature 1
- [ ] Feature 2

### Should-have
- [ ] Feature 3

### Could-have (Stretch)
- [ ] Feature 4

## Wireframes
[Link ke Excalidraw / Figma / upload gambar]

## Database Schema
[ERD diagram + SQL CREATE statements]

## API Endpoints
[List semua endpoints dengan request/response]

## Timeline
[Day-by-day breakdown]

## Risks & Mitigation
- **Risk:** [apa yang bisa salah]
- **Mitigation:** [gimana cara antisipasi]
```

---

## 🏋️ Latihan

### Exercise 1: Plan Your Capstone
1. Pilih satu capstone project option (lihat `capstone-project.md`)
2. Tulis minimum **8 user stories**
3. Buat feature list dengan prioritas MoSCoW
4. Estimasi timeline 7 hari

### Exercise 2: Wireframe
1. Buka Excalidraw (excalidraw.com)
2. Wireframe minimal **5 screens** dari capstone lo
3. Gambar user flow diagram
4. Export dan save di repo project lo

### Exercise 3: Database & API Design
1. Design database schema (minimal 3 tabel)
2. Tulis SQL CREATE statements
3. List semua API endpoints dengan contoh request/response
4. Review: "Apakah semua user stories bisa di-fulfill dengan API ini?"

---

## 🔑 Key Takeaways

- **Planning saves time** — 2 jam planning > 20 jam debugging
- **User stories** bikin lo fokus ke kebutuhan user, bukan fitur random
- **Wireframes** nggak harus cantik, yang penting jelas
- **Database design** di awal mencegah migration headaches nanti
- **API contract** jadi "bahasa" antara frontend dan backend team
- **Timeline** dengan buffer = lebih realistis

> 🧙‍♂️ "Seorang Arcane developer yang bijak selalu plan sebelum cast spell pertama." — ETHJKT Wisdom

Minggu ini adalah puncak perjalanan lo di Phase 2. Plan it well, build it strong. LFG! 🚀
