# 🏆 Group Project Week 4: Arcane Team Quest Manager

## ETHJKT — Phase 2, Week 4 | Arcane Quest Series

> *"Final quest Phase 2. Kali ini bukan solo — kamu dan tim-mu akan membangun sesuatu yang nyata. Tunjukkan semua yang sudah kamu pelajari, Summoner."*

---

## 📋 Project Brief

Build a **Team Task Manager** — aplikasi web yang memungkinkan tim untuk:

- 🔐 Register & Login (JWT authentication)
- 📝 Full CRUD pada tasks (Create, Read, Update, Delete)
- 👥 Assign tasks ke anggota tim
- 🔄 Real-time data fetching (React Query)
- 🏪 Client-side state management (Zustand)
- 🎨 Responsive UI dengan proper UX

### Nama Project: **Arcane Guild Board**

> Sebuah "quest board" di mana guild members bisa posting, claim, dan menyelesaikan quests (tasks).

---

## 🛠️ Tech Stack (Wajib)

| Layer | Tech |
|-------|------|
| Frontend Framework | React + Vite |
| Routing | React Router v6 |
| Server State | TanStack React Query |
| Client State | Zustand |
| HTTP Client | Axios (with interceptors) |
| Notifications | react-hot-toast |
| Styling | Tailwind CSS |
| Backend | Express.js (Phase 1) dengan JWT auth |

---

## 📝 Functional Requirements

### 🔐 Authentication (Wajib)

- [ ] Register — nama, email, password
- [ ] Login — email + password → dapat JWT token
- [ ] Logout — clear token + redirect ke login
- [ ] Protected routes — unauthorized users redirect ke login
- [ ] Token persistence — tetap login setelah refresh (localStorage)
- [ ] Auto-logout saat token expired (401 response)

### 📋 Task CRUD (Wajib)

- [ ] **Create** — Buat task baru dengan: title, description, priority (low/medium/high), status (todo/in-progress/done)
- [ ] **Read** — Tampilkan semua tasks dalam board/list view
- [ ] **Update** — Edit task title, description, priority, status
- [ ] **Delete** — Hapus task dengan konfirmasi

### 🔍 Filtering & Search (Wajib)

- [ ] Filter by status: All, Todo, In Progress, Done
- [ ] Filter by priority: All, Low, Medium, High
- [ ] Search by title (debounced input)

### ⚡ State Management (Wajib)

- [ ] **React Query** untuk semua server state (fetch, create, update, delete)
- [ ] **Zustand** untuk UI state (filter selection, modal open/close, sidebar toggle, theme)
- [ ] Proper loading states (skeleton/spinner) di semua async operations
- [ ] Error states dengan user-friendly messages + toast notifications

### 🎨 UI/UX (Wajib)

- [ ] Responsive — mobile + desktop
- [ ] Consistent design system (colors, spacing, typography)
- [ ] Empty states ("Belum ada quest" dengan illustration/emoji)
- [ ] Loading skeletons (bukan cuma "Loading...")
- [ ] Confirmation dialog sebelum delete

---

## ⭐ Bonus Features (Nilai Tambahan)

Pilih minimal **2** dari list ini:

- [ ] **Dark/Light mode** toggle (state di Zustand, persist ke localStorage)
- [ ] **Drag & drop** task antar kolom status (Kanban board style)
- [ ] **Task assignment** — assign task ke member, tampilkan avatar
- [ ] **Due date** — date picker, highlight overdue tasks
- [ ] **Optimistic updates** — UI update langsung sebelum server confirm
- [ ] **Pagination** atau infinite scroll untuk task list
- [ ] **Task comments** — simple comment thread per task
- [ ] **Dashboard stats** — chart/numbers: total tasks, completed %, by priority
- [ ] **Export** — download tasks as CSV/JSON
- [ ] **Real-time** — polling setiap 30 detik atau WebSocket (advanced)

---

## 📁 Project Structure (Recommended)

```
src/
├── components/
│   ├── common/          # Button, Modal, Skeleton, ErrorBoundary
│   ├── auth/            # LoginForm, RegisterForm
│   └── tasks/           # TaskCard, TaskForm, TaskBoard, TaskFilters
├── config/
│   └── index.js         # Environment config
├── hooks/
│   ├── useAuth.js       # Auth-related React Query hooks
│   └── useTasks.js      # Task CRUD React Query hooks
├── lib/
│   └── api.js           # Axios instance + interceptors
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx
├── store/
│   ├── authStore.js     # Zustand: auth state
│   └── uiStore.js       # Zustand: UI state (filters, modals, theme)
├── App.jsx
└── main.jsx
```

---

## 📊 Grading Rubric

### Total: 100 poin

| Kategori | Poin | Detail |
|----------|------|--------|
| **Authentication** | 20 | Register, login, logout, protected routes, token handling |
| **CRUD Operations** | 25 | Create, read, update, delete — semua berfungsi dengan proper error handling |
| **State Management** | 20 | React Query untuk server state, Zustand untuk UI state, proper separation |
| **UI/UX Quality** | 15 | Responsive, loading states, error states, empty states, consistent design |
| **Code Quality** | 10 | Clean code, proper folder structure, reusable components, no console errors |
| **Bonus Features** | 10 | Min 2 bonus features implemented properly |

### Grading Scale

| Grade | Poin | Keterangan |
|-------|------|------------|
| A | 90-100 | Exceptional — semua requirements + bonus, polished UI |
| B | 75-89 | Great — semua wajib requirements, minor issues |
| C | 60-74 | Good — sebagian besar requirements, beberapa bugs |
| D | < 60 | Incomplete — banyak requirements missing |

---

## 📅 Timeline

### Minggu ini (Week 4)

| Hari | Target |
|------|--------|
| **Day 1 (Senin)** | Tim formation, project planning, setup repo, backend review |
| **Day 2 (Selasa)** | Auth flow: register, login, protected routes, Zustand auth store |
| **Day 3 (Rabu)** | Task CRUD: React Query hooks, create/read/update/delete |
| **Day 4 (Kamis)** | Filtering, search, UI polish, loading/error states |
| **Day 5 (Jumat)** | Bonus features, testing, bug fixes, presentation prep |

### Daily Standup (10 menit, awal hari)

Setiap anggota jawab:
1. Kemarin ngerjain apa?
2. Hari ini mau ngerjain apa?
3. Ada blocker?

---

## 👥 Team Roles (Saran)

Untuk tim 3-4 orang:

| Role | Tanggung Jawab |
|------|---------------|
| **Lead / Integrator** | Setup project, routing, API config, merge PRs, resolve conflicts |
| **Auth Developer** | Login, register, protected routes, auth store, token management |
| **Task Developer** | Task CRUD, React Query hooks, task components |
| **UI/UX Developer** | Layout, styling, responsive, loading/error/empty states, bonus features |

> Semua orang HARUS code. Roles cuma untuk ownership, bukan pembatas.

---

## 🚀 Submission

### Apa yang Dikumpulkan

1. **GitHub Repository** — public repo dengan README yang jelas
2. **README.md** harus berisi:
   - Nama tim dan anggota
   - Screenshot aplikasi (min 3: login, dashboard, task form)
   - Cara menjalankan (setup instructions)
   - List fitur yang diimplementasi
   - Pembagian tugas per anggota
3. **Live Demo** — deploy ke Vercel/Netlify (bonus poin)
4. **Presentasi** — 10 menit demo + Q&A (Jumat)

### Presentasi Format (10 menit)

1. **Intro** (1 min) — Nama tim, anggota
2. **Demo** (5 min) — Live demo semua fitur: register → login → CRUD → filter → bonus
3. **Tech Highlights** (2 min) — Satu hal menarik/challenging yang tim pelajari
4. **Q&A** (2 min) — Pertanyaan dari instruktur dan peserta lain

---

## ⚠️ Rules

1. **No copy-paste** dari Arcane Quest tutorial apa adanya — harus customize dan extend
2. **Semua anggota harus contribute** — cek git log, harus ada commits dari semua orang
3. **Pakai branching** — minimal `main` + feature branches, merge via PR
4. **Nggak boleh pakai AI untuk generate seluruh project** — AI boleh untuk referensi/debug, tapi kamu harus ngerti setiap baris code
5. **Deadline adalah deadline** — late submission -10 poin per hari

---

## 💡 Tips untuk Sukses

1. **Start simple** — bikin MVP dulu (auth + basic CRUD), baru polish
2. **Test API dulu** di Postman/Thunder Client sebelum coding frontend
3. **Commit sering** — small, meaningful commits > satu commit gede di akhir
4. **Komunikasi** — pakai Discord/WA group, daily standup beneran
5. **Jangan perfectionist** — working > perfect. Ship it, lalu improve
6. **Bagi tugas jelas** — tapi tetap review code satu sama lain

> *"A guild is only as strong as its weakest link. Lift each other up, Summoners. Complete this quest together, and you'll emerge as true Arcane Developers."* 🏆⚔️

---

## 📚 Resources

- [Arcane Quest: Authenticated CRUD](./ln-authenticated-crud.md) — Step-by-step reference
- [Environment & Error Handling](./env-error-handling.md) — Error handling patterns
- [Reading API Docs](./sk-api-docs.md) — How to test before you code
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Good luck, Summoners. Ini final quest Phase 2. Tunjukkan kemampuan kalian.** 🔥
