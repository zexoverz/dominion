# ⚔️ Arcane Quest 04: Arcane Task Guild

## 👥 Group Project — Fullstack Task Manager

> **Difficulty:** ⭐⭐⭐⭐⭐ (Expert)
> **Type:** Group project (3-4 orang)
> **Type:** Group (3-4 orang)
> **Presentasi:** Demo Day di akhir minggu

---

## Misi

Tim kalian bikin **fullstack task management application**. Kayak Trello/Asana sederhana. Ini simulasi kerja di tim engineering beneran — ada pembagian tugas, git workflow, code review, dan demo day.

---

## Product Requirements

### Core Features

1. **Authentication**
   - Register & Login
   - JWT auth
   - User profile (nama, email, avatar)

2. **Project/Board Management**
   - Create project/board
   - Invite members ke project
   - List projects yang user terlibat

3. **Task CRUD**
   - Create task (title, description, assignee, priority, due date)
   - Edit task
   - Delete task
   - Assign task ke team member

4. **Task Status (Kanban-style)**
   - Columns: `To Do` → `In Progress` → `Review` → `Done`
   - Move task antar column (drag-drop optional, button juga OK)
   - Visual indicator per status (warna)

5. **Real-time Updates**
   - Socket.IO: ketika teammate update task, semua orang liat perubahan
   - "Rina moved 'Fix login bug' to In Progress"
   - Notification bell

### Bonus Features (Extra Points)

- Drag and drop tasks between columns (react-beautiful-dnd)
- Due date alerts / overdue indicator
- Task comments / activity log
- Filter by assignee, priority, status
- Dashboard with task statistics

---

## Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- TanStack React Query
- Zustand (UI state, notifications)
- Socket.IO Client
- Tailwind CSS
- React Hook Form + Zod

### Backend
- Express.js
- Socket.IO
- JWT Authentication
- PostgreSQL / MySQL
- Prisma atau Sequelize (ORM)

---

## Team Roles

Bagi tugas berdasarkan area. Semua orang HARUS ngoding.

| Role | Responsibilities |
|---|---|
| **Lead / Fullstack** | Setup project, git workflow, API design, integration |
| **Frontend 1** | Auth pages, layout, routing, protected routes |
| **Frontend 2** | Task board UI, task cards, forms, drag-drop |
| **Backend** | API endpoints, database, Socket.IO, deployment |

> Kalo tim 3 orang, gabungin Frontend 1 + 2.

---

## Git Workflow

**WAJIB** pake branching strategy:

```
main (production)
├── develop (integration)
│   ├── feature/auth (Frontend 1)
│   ├── feature/task-board (Frontend 2)
│   ├── feature/api-tasks (Backend)
│   └── feature/realtime (Lead)
```

Rules:
1. **Jangan push langsung ke main**
2. Bikin branch per feature: `feature/nama-feature`
3. Pull Request ke `develop`
4. Minimal 1 reviewer approve sebelum merge
5. Merge `develop` → `main` buat deploy

---

## Phases

| Phase | Milestone |
|---|---|
| **Setup** | Repo, project structure, database schema, API design document |
| **Backend** | Auth + Task CRUD API |
| **Frontend** | Auth pages, layout, Task board UI + integration, Socket.IO |
| **Integration** | Real-time features, bug fixing, testing |
| **Ship** | Polish, deployment, prepare presentation, **DEMO DAY** |

---

## API Design (Suggested)

### Auth
```
POST   /api/auth/register    { name, email, password }
POST   /api/auth/login       { email, password }
GET    /api/auth/me           (protected)
```

### Projects
```
GET    /api/projects                    (user's projects)
POST   /api/projects                    { name, description }
GET    /api/projects/:id                (single project + members)
POST   /api/projects/:id/members        { userId }
```

### Tasks
```
GET    /api/projects/:projectId/tasks              (all tasks in project)
POST   /api/projects/:projectId/tasks              { title, description, assigneeId, priority, dueDate }
PUT    /api/tasks/:id                               { title, description, status, assigneeId, priority }
PATCH  /api/tasks/:id/status                        { status }
DELETE /api/tasks/:id
```

### Socket Events
```
task:created    → { task }
task:updated    → { task }
task:moved      → { taskId, newStatus, movedBy }
task:deleted    → { taskId }
member:joined   → { user, projectId }
```

---

## Database Schema (Suggested)

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Members (many-to-many)
CREATE TABLE project_members (
  project_id INTEGER REFERENCES projects(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'member',
  PRIMARY KEY (project_id, user_id)
);

-- Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  project_id INTEGER REFERENCES projects(id),
  assignee_id INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Grading

| Criteria | Points | Description |
|---|---|---|
| **Auth** | 15 | Register, login, protected routes, JWT |
| **Task CRUD** | 20 | Create, read, update, delete tasks |
| **Task Board UI** | 15 | Kanban columns, task cards, status changes |
| **Real-time** | 15 | Socket.IO integration, live updates |
| **Team Workflow** | 10 | Git branches, PRs, commits from all members |
| **Code Quality** | 10 | Clean code, proper state management, error handling |
| **Deployment** | 5 | Both FE + BE deployed and accessible |
| **Demo Presentation** | 10 | Clear demo, all features shown, team participation |
| **TOTAL** | **100** |

### Individual Assessment

Setiap member dinilai berdasarkan:
- Git commits (semua orang HARUS punya commits)
- Feature ownership (apa yang kamu build)
- Demo participation (kamu bisa jelasin bagian kamu)

---

## Demo Day Format

1. **Intro** (1 min) — Perkenalan tim + project overview
2. **Live Demo** (5 min) — Show all features working
3. **Technical Deep Dive** (3 min) — Architecture, interesting challenges
4. **Q&A** (2 min) — Questions from audience/instructor

### Demo Checklist
- [ ] Register new user
- [ ] Login
- [ ] Create a project
- [ ] Add tasks with different statuses
- [ ] Assign tasks to team members
- [ ] Move task status (show real-time update on another browser)
- [ ] Show deployed version

---

## Tips

1. **Day 1 is the most important** — good planning = smooth execution
2. **Communicate constantly** — daily standup (even 5 min)
3. **Don't build in isolation** — integrate early and often
4. **Test together** — both team members open the app, test real-time
5. **Have fun!** — this is the closest to real-world team development

---

## Demo Day di Magic Temple 🏛️

Setiap tim **WAJIB** presentasi project mereka di Discord voice channel **"Magic Temple"**.

### Format: 10 menit per tim

| Segment | Durasi | Detail |
|---------|--------|--------|
| **Intro + Live Demo** | 5 min | Perkenalan tim, showcase semua fitur, share screen di Discord |
| **Technical Deep Dive** | 3 min | Architecture, interesting challenges, tech decisions |
| **Q&A** | 2 min | Pertanyaan dari mentor dan audience |

### Rules

1. **SEMUA anggota tim HARUS bicara** — setiap member demo/explain bagian yang mereka kerjain
2. **Share screen di Discord** untuk live demo
3. **App harus deployed** — demo dari deployed URL, bukan localhost
4. **Have backup recording** — record demo pakai OBS/screen recorder sebelumnya

### Tips buat Discord Demo

- [ ] Test screen share di Discord sebelumnya — pastiin work
- [ ] Test mic — pastiin suara jelas, gak ada echo
- [ ] Stable internet — pake kabel LAN kalau bisa
- [ ] Close unnecessary tabs — biar Discord gak lag
- [ ] Practice run minimal 1x — time it, pastiin 10 menit
- [ ] Join Magic Temple voice channel **5 menit sebelum jadwal**

---

Go build something legendary, Guild! ⚔️👥
