# Week3-Front-End-Advance
Welcome to week 3, sekali lagi selamat setelah melewati 1 week lagi dri phase 2. gua yakin sudah ada beberapa orang yang snowball dri 2 week tersebut.

Setelah kalian melewati week2, sudah dipastikan kalian terbiasa dengan berfikir secara react. Berfikir secara react ini maksudnya adalah ketika kalian melihat User Interface Website atau komponen 
website kalian akan selalu membayangkan itu jadi code react component. (Hampir setiap react developer berfikir secara natural begini).

Ketika kalian sudah ketemu dengan mid scale app, atau aplikasi yang lumayan besar. Maka akan sangat susah sekali untuk memanage komponen" react ini. Deliver datanya akan semakin sulit, rerendering semakin slow karena proses useEffect dimana mana, bahkan props yang terlalu banyak untuk dihandle karna komponen tree nya sudah sangat luas.

Di week 3 inilah kalian akan belajar konsep advance frontend dimana kalian akan improve speed cara kerja komponen react dalam development website. Bagaimana cara mengatur props dan state yang banyak, bagaimana kita mengatur suatu unique hooks untuk beberapa case, dan masalah malah latency speed dalam pemrosesan komponen react ke dalam website.

Kalian akan belajar menggunakan vite, dimana tools ini akan membungkus react project kalian dan menggunakan rollup modul dengan HMR vite agar pengaturan modul" yang ada react jadi ringan.

Kalian juga akan belajar Core hooks (useRef, useContext, useCallback, useMemo) untuk menghandle case yang sulit, dan Advance React Concepts seperti (rendering logic, reusable hooks, patterns, composition to avoid prop drilling).

Setelah itu Kalian akan belajar asynchronous state management untuk mempermudah handling async proses dalam komponen react menggunakan Tanstack. Tanstack ini tidaknya TanstackQuery saja, kalian juga belajar untuk modul Tanstack lain seperti Tanstack Router, Table dan Form. agar proses data handling di komponen kalian lebih efisiend dibanding handling manual sebelumnya.

Kalian juga belajar Cypress untuk frontend testing, unit testing ini tidak hanya terjadi dibackend saja. Di frontend juga membutuhkan tdd dan unit testing.

Terakhir kalian akan belajar State Management menggunakan redux, dan beberapa updated teknologi seperti stripe untuk payment gateway dan clerk untuk authentication.

Week3 ini akan sangat dinilai banget performance website react kalian, kalian dituntut untuk develop website react secara professional dimana data handling nya rapih dan komponen react reusable dan efektif di setiap case unique. tidak ada lagi membuat state banyak dan onChange banyak untuk handling form, tidak ada lagi useEffect sana sini untuk mengatur pengolahan data dari API. hal hal seperti itulah yang harus kita hindari di week3 ini.

jadi sekarang mulai untuk mengerjakan mengerjakan study material week 3, dan hajar semua Arcane Quest nya 🚀

## Prerequisite

Pastikan kalian udah selesaiin:
- ✅ Phase 1 (Backend: Node.js, Express, PostgreSQL, REST API)
- ✅ Phase 2 Week 1 (HTML/CSS/jQuery)
- ✅ Phase 2 Week 2 (React Basics)

## Week 3 Study Material (Berurutan)

- [Vite : Setup & Configuration](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/vite-setup.md)
- [useRef Deep Dive](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/useref-deep-dive.md)
- [useContext Deep Dive](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/usecontext-deep-dive.md)
- [useCallback & useMemo : Performance Optimization](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/usecallback-usememo.md)
- [Advanced React Patterns : Composition, Render Props, HOCs](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/advanced-react-patterns.md)
- [Custom Hooks](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/custom-hooks.md)
- [TanStack Query : Data Fetching](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/tanstack-query.md)
- [TanStack Router](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/tanstack-router.md)
- [Arcane Quest : Dashboard dengan TanStack Query + Table](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/ln-dashboard-tanstack.md)
- [TanStack Table & Form](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/tanstack-table-form.md)
- [Cypress : Frontend Testing](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/cypress-testing.md)
- [Redux Toolkit : State Management](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/redux-toolkit.md)
- [Stripe : Payment Gateway Integration](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/stripe-integration.md)
- [Clerk : Authentication](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/clerk-auth.md)
- [Arcane Quest : E-Commerce Checkout dengan Stripe + Clerk](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/ln-ecommerce-checkout.md)
- [Soft Skills : Code Review & Collaboration](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/sk-code-review.md)
- [Group Project Week3](https://github.com/Ethereum-Jakarta/phase-2-week3-frontend-advance/blob/main/study-material/gp-week3.md)

## Referensi Dokumentasi

Kalian wajib baca dokumentasi resmi ini selama week 3:

- Vite → https://vitejs.dev/guide/
- React Hooks Reference → https://react.dev/reference/react/hooks
- useRef → https://react.dev/reference/react/useRef
- useContext → https://react.dev/reference/react/useContext
- useCallback → https://react.dev/reference/react/useCallback
- useMemo → https://react.dev/reference/react/useMemo
- TanStack Query → https://tanstack.com/query/latest/docs/react/overview
- TanStack Router → https://tanstack.com/router/latest/docs/framework/react/overview
- TanStack Table → https://tanstack.com/table/latest/docs/introduction
- TanStack Form → https://tanstack.com/form/latest/docs/overview
- Cypress → https://docs.cypress.io/guides/overview/why-cypress
- Redux Toolkit → https://redux-toolkit.js.org/introduction/getting-started
- Stripe Docs → https://stripe.com/docs
- Clerk Docs → https://clerk.com/docs

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
- Gunakan Vite sebagai build tool untuk semua project
- Deploy setiap Arcane Quest ke Vercel
