# Week4-State-Management-API-Integration

Welcome to week 4, selamat udah melewati 3 week penuh di phase 2! Kalian udah belajar dari HTML mentah, naik ke React, sampai Advanced React concepts. **Tapi ada satu masalah besar** — semua yang kalian bangun sejauh ini masih pake data dummy. State lokal doang, gak ada koneksi ke dunia luar.

Minggu ini kalian akan belajar mantra baru: **menghubungkan frontend ke backend**. Bayangin frontend kalian itu wajah aplikasi yang cakep, dan backend itu otak di belakangnya. Selama ini kalian cuma ngurus wajahnya — sekarang waktunya nyambungin ke otaknya.

Kalian akan belajar:
- **State Management** yang proper — React Context, Zustand, kapan pakai apa
- **Data Fetching** — React Query / TanStack Query, atau fetch + useEffect patterns
- **REST API Integration** — konek React app ke Express API dari Phase 1
- **Authentication UI** — login, register, JWT flow, protected routes
- **Error Handling & Loading States** — UX yang professional, bukan cuma spinner doang

Di week 3 kalian udah dikenalkan sedikit ke TanStack Query dan Redux. Di week ini kita deep dive lebih jauh — fokusnya bukan lagi "cara pakainya gimana" tapi "gimana cara arsitektur state yang bener di real-world app". Kalian juga bakal konek langsung ke backend yang udah kalian bangun di Phase 1.

Setelah week ini, frontend kalian bukan lagi boneka tanpa nyawa — dia udah hidup, bisa baca dan tulis data dari server! 🚀

## Prerequisite

Pastikan kalian udah selesaiin:
- ✅ Phase 1 (Backend: Node.js, Express, PostgreSQL, REST API)
- ✅ Phase 2 Week 1 (HTML/CSS/jQuery)
- ✅ Phase 2 Week 2 (React Basics)
- ✅ Phase 2 Week 3 (Advanced React)

## Week 4 Study Material (Berurutan)

- [State Management Patterns](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/state-management.md)
- [React Context Deep Dive](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/react-context.md)
- [Zustand : Lightweight State Management](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/zustand.md)
- [Data Fetching Patterns](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/data-fetching.md)
- [React Query untuk API Integration](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/react-query-api.md)
- [Arcane Quest : Data Dashboard](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/ln-data-dashboard.md)
- [REST API Integration](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/rest-api-integration.md)
- [Authentication Flows : JWT + Login/Register](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/auth-flows.md)
- [Environment Variables & Error Handling](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/env-error-handling.md)
- [Arcane Quest : Authenticated CRUD App](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/ln-authenticated-crud.md)
- [Soft Skills : Reading API Documentation](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/sk-api-docs.md)
- [Group Project Week4](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/gp-week4.md)

## Referensi Dokumentasi

Kalian wajib baca dokumentasi resmi ini selama week 4:

- React State Management → https://react.dev/learn/managing-state
- Scaling Up with Reducer and Context → https://react.dev/learn/scaling-up-with-reducer-and-context
- Zustand → https://zustand-demo.pmnd.rs/ | https://github.com/pmndrs/zustand
- TanStack Query → https://tanstack.com/query/latest/docs/react/overview
- Axios → https://axios-http.com/docs/intro
- JWT Introduction → https://jwt.io/introduction
- Vite Env Variables → https://vitejs.dev/guide/env-and-mode

## Cara Pengerjaan

1. Fork repo ini ke akun GitHub pribadi kalian
2. Clone hasil fork ke local
3. Kerjakan setiap study material secara berurutan
4. Push ke repo fork kalian
5. Buat Pull Request ke repo utama untuk submission

## Peraturan

- Deadline setiap Arcane Quest: lihat jadwal di channel Discord
- Wajib push minimal 1 commit per hari selama week ini
- Code harus clean, typed (TypeScript), dan well-commented
- Semua submission via Pull Request
- Gunakan Zustand untuk client state, React Query untuk server state
- Deploy setiap Arcane Quest ke Vercel
