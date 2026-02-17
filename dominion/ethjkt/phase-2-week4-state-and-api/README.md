# 🏰 Phase 2 — Week 4: State Management & API Integration

> **"The week that connects everything."**

Minggu ini kalian belajar menghubungkan React frontend ke backend API, manage state dengan proper, handle authentication, dan prepare for production deployment.

---

## 📋 Prerequisites

Sebelum mulai Week 4, pastikan kalian udah paham:

- ✅ **Week 1:** React basics, JSX, components, props
- ✅ **Week 2:** Hooks (useState, useEffect, useRef), React Router
- ✅ **Week 3:** Advanced hooks, custom hooks, performance optimization
- ✅ **Phase 1:** Express API, JWT authentication, database CRUD

---

## 📚 Study Materials

Pelajari **secara berurutan** — setiap materi build on top of the previous one.

### Day 1-2: State Management

| # | Materi | Topik | Durasi |
|---|---|---|---|
| 01 | [The State Spectrum](./study-material/01-state-spectrum.md) | Dari useState sampe server state, lifting state, prop drilling | 45 min |
| 02 | [Zustand Fundamentals](./study-material/02-zustand.md) | State management yang gak bikin pusing, store creation | 60 min |
| 03 | [Zustand Advanced](./study-material/03-zustand-advanced.md) | Production-grade patterns, middleware, selectors | 60 min |

### Day 2-3: API Integration

| # | Materi | Topik | Durasi |
|---|---|---|---|
| 04 | [Data Fetching Patterns](./study-material/04-data-fetching-patterns.md) | Kenapa useEffect + fetch itu bencana, proper patterns | 45 min |
| 05 | [Axios Service Layer](./study-material/05-axios-service-layer.md) | Arsitektur API yang bener, interceptors, error handling | 45 min |
| 06 | [React Query CRUD](./study-material/06-react-query-crud.md) | useQuery, useMutation, queryKey, caching | 75 min |
| 07 | [React Query Advanced](./study-material/07-react-query-advanced.md) | Dashboard dengan multiple data sources, optimistic updates | 60 min |

### Day 3-4: Authentication

| # | Materi | Topik | Durasi |
|---|---|---|---|
| 08 | [Auth JWT Complete](./study-material/08-auth-jwt-complete.md) | Dari register sampe auto-logout, token rotation | 60 min |
| 09 | [Protected Routes](./study-material/09-protected-routes.md) | Role-based access control, route guards, auth context | 45 min |
| 10 | [Error Handling & UX](./study-material/10-error-handling-ux.md) | Bikin app yang gak malu-maluin pas error | 60 min |

### Day 4-5: Advanced Topics

| # | Materi | Topik | Durasi |
|---|---|---|---|
| 11 | [Environment Variables & Deploy Prep](./study-material/11-env-deployment-prep.md) | Vite env vars, CORS, proxy, production checklist | 45 min |
| 12 | [WebSocket — Real-time](./study-material/12-websocket-intro.md) | WebSocket basics, Socket.IO in React, real-time patterns | 60 min |
| 13 | [Testing API Integration](./study-material/13-testing-integration.md) | MSW, testing React Query hooks, testing auth flows | 75 min |
| 14 | [Soft Skill: API Documentation](./study-material/14-sk-api-documentation.md) | Swagger/OpenAPI, Postman, HTTP status codes, rate limiting | 45 min |
| 15 | [Week 4 Recap](./study-material/15-week4-recap.md) | Decision trees, checklists, top mistakes, Week 5 prep | 30 min |

---

## ⚔️ Arcane Quests

| # | Quest | Type | Difficulty |
|---|---|---|---|
| 01 | [Arcane Bridge — Connect to Phase 1 API](./arcane-quest/aq-01-connect-phase1.md) | **MANDATORY** | ⭐⭐⭐ |
| 02 | [Arcane Command Center — Real-time Dashboard](./arcane-quest/aq-02-realtime-dashboard.md) | Optional | ⭐⭐⭐⭐ |
| 03 | [Arcane Scroll — Social Feed](./arcane-quest/aq-03-social-feed.md) | Optional | ⭐⭐⭐⭐ |
| 04 | [Arcane Task Guild — Group Project](./arcane-quest/aq-04-group-project.md) | Group (3-4) | ⭐⭐⭐⭐⭐ |
| 05 | [Ujian Week 4](./arcane-quest/aq-05-ujian.md) | Exam | ⭐⭐⭐ |

> **AQ-01 is MANDATORY.** Ini bridge antara Phase 1 dan Phase 2. Semua orang HARUS submit.

---

## 🧩 Quizzes

Practice challenges buat tiap major topic:

| Quiz | Topic | Challenges |
|---|---|---|
| [Quiz: State Management](./quiz/quiz-state.md) | Zustand, Context, state patterns | 8 challenges |
| [Quiz: API Integration](./quiz/quiz-api.md) | React Query, Axios, data fetching | 6 challenges |
| [Quiz: Authentication](./quiz/quiz-auth.md) | JWT, protected routes, token handling | 5 challenges |

---

## 🗓️ Suggested Schedule

```
Day 1 (Mon):  Materi 01-03 → Quiz State (partial)
Day 2 (Tue):  Materi 04-06 → Start AQ-01
Day 3 (Wed):  Materi 07-09 → Quiz API + Quiz Auth
Day 4 (Thu):  Materi 10-12 → Continue AQ-01
Day 5 (Fri):  Materi 13-15 → Finish AQ-01 → Ujian
```

---

## 🛠️ Tech Stack This Week

| Category | Tools |
|---|---|
| State Management | useState, Context API, Zustand |
| Server State | TanStack React Query v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Real-time | Socket.IO Client |
| Testing | Vitest + React Testing Library + MSW |
| Deployment | Vercel (FE) + Railway (BE) |

---

## 🎯 Learning Outcomes

By the end of this week, kalian bisa:

1. **Choose** the right state management solution for any scenario
2. **Connect** a React frontend to a REST API
3. **Implement** JWT authentication with protected routes
4. **Handle** loading, error, and empty states professionally
5. **Write** tests for API integrations
6. **Deploy** a fullstack application to production
7. **Read** API documentation and use professional tools

---

## 📖 Additional Resources

- [TanStack React Query Docs](https://tanstack.com/query/latest)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com)
- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [MSW Docs](https://mswjs.io)
- [Swagger Petstore](https://petstore.swagger.io) — practice reading API docs
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

---

## Cara Pengerjaan & Submit Tugas

> Kalian udah pernah ngerjain flow ini di Phase 0-1, jadi harusnya udah familiar. Tapi gua tulis lagi biar gak ada yang bingung.

**Kalian akan melakukan Fork & PR ulang untuk setiap week karena ETHJKT memisahkan 1 Repo = 1 Week.**

### Flow Pengerjaan

1. **Fork** repo ini ke GitHub account kalian
2. **Clone** fork kalian ke local
3. Kerjain study materials, quizzes, dan arcane quests
4. **Commit** progress kalian (wajib push minimal 1 commit per hari!)
5. **Push** ke fork kalian
6. **Create Pull Request** ke repo ETHJKT ini
7. Mentor akan review lewat PR comments
8. Untuk pengerjaan selanjutnya, tinggal commit & push aja — PR otomatis ke-update

### Rules Submission

- 📝 Isi judul PR dengan **username/nama kalian**
- 📅 Wajib push **minimal 1 commit per hari**
- 🧹 Code harus **clean, typed (TypeScript), dan well-commented**
- 📬 Semua submission via **Pull Request**
- 🚀 Deploy setiap Arcane Quest ke **Vercel**

---

> **Next Week:** [Week 5 — Capstone Project](../phase-2-week5-capstone/) 🚀
