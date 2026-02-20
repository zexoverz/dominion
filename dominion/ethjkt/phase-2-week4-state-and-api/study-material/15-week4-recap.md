# 🏁 Materi 15: Week 4 Recap — State & API Mastery

## Selamat! 🎉

Kalian udah selesain Week 4 — **the hardest week in Phase 2**. Seriously. Minggu ini kalian belajar:
- State management (useState, Context, Zustand)
- API integration (Axios, React Query)
- Authentication (JWT, protected routes)
- Forms & validation
- Real-time (WebSocket, Socket.IO)
- Testing (Vitest, RTL, MSW)
- Professional skills (docs, status codes, deployment)

Itu BANYAK. Let's organize everything so it sticks.

---

## 1. State Management Decision Tree

Kapan pake apa? Ini guide-nya:

```mermaid
flowchart TD
    A[Butuh state] --> B{Scope?}
    
    B -->|Satu component| C[useState ✅]
    B -->|Parent + child| D{Berapa level deep?}
    B -->|Global / banyak component| E{Tipe data?}
    
    D -->|1-2 level| F[Props drilling ✅<br/>Masih fine]
    D -->|3+ level| G[Context or Zustand]
    
    E -->|Server data<br/>API responses| H[React Query ✅<br/>BUKAN Zustand!]
    E -->|UI state<br/>theme, sidebar, modal| I{Seberapa complex?}
    E -->|Auth state<br/>user, token| J[Context + useReducer ✅<br/>atau Zustand]
    
    I -->|Simple<br/>1-2 values| K[Context ✅]
    I -->|Complex<br/>banyak actions| L[Zustand ✅]
    
    style C fill:#10b981,color:#fff
    style F fill:#10b981,color:#fff
    style H fill:#3b82f6,color:#fff
    style K fill:#f59e0b,color:#000
    style L fill:#8b5cf6,color:#fff
    style J fill:#f59e0b,color:#000
```

### Quick Reference Table

| State Type | Solution | Example |
|---|---|---|
| Form input values | `useState` | Input text, checkbox, dropdown |
| Toggle (show/hide) | `useState` | Modal open, sidebar collapse |
| List dari API | React Query | Products, users, orders |
| Single item dari API | React Query | Product detail, user profile |
| Auth (user + token) | Context + Zustand | Login state, current user |
| Theme (dark/light) | Context | App-wide theme toggle |
| Shopping cart | Zustand | Items, quantities, total |
| Notifications | Zustand | Notification list, unread count |
| Form with many fields | React Hook Form | Registration, product form |

---

## 2. API Integration Checklist

Setiap kali kalian integrasi API endpoint baru, follow this:

### Setup (Sekali Per Project)

- ✅ Axios instance configured (baseURL, timeout, interceptors)
- ✅ React Query configured (QueryClient, defaults, DevTools)
- ✅ Error boundary setup (global error handler, fallback UI)
- ✅ Environment variables (`.env`, `.env.production`)
- ✅ CORS handled (backend cors config OR Vite proxy)

### Per Endpoint

- ✅ Read API documentation
- ✅ Test di Postman / Thunder Client
- ✅ TypeScript type/interface defined
- ✅ React Query hook created (`useQuery` / `useMutation`)
- ✅ Loading state handled (skeleton / spinner)
- ✅ Error state handled (error message + retry button)
- ✅ Empty state handled ("No data found")
- ✅ Success feedback (toast notification)
- ✅ Optimistic updates where appropriate
- ✅ Tests written (MSW handler + component test)

### Deployment

- ✅ `.env.production` configured
- ✅ No secrets in `VITE_*` variables
- ✅ `npm run build` succeeds
- ✅ `npm run preview` works (production build locally)
- ✅ Backend CORS allows production domain
- ✅ HTTPS everywhere

---

## 3. Authentication Checklist

Auth punya banyak edge cases. Make sure kalian cover semua:

### Login Flow
- ✅ Login form with validation
- ✅ Submit → POST /api/auth/login
- ✅ Store token (localStorage or httpOnly cookie)
- ✅ Store user data (Zustand / Context)
- ✅ Redirect to dashboard
- ✅ Error handling (wrong credentials, server error)

### Protected Routes
- ✅ ProtectedRoute component wraps private pages
- ✅ Redirect to /login if no token
- ✅ Verify token on app load (GET /api/auth/me)
- ✅ Loading state while verifying

### Token Management
- ✅ Attach token to every API request (Axios interceptor)
- ✅ Handle 401 response → redirect to login
- ✅ Token refresh flow (if applicable)
- ✅ Clear token on logout
- ✅ Clear all cached data on logout (`queryClient.clear()`)

### Security
- ✅ No sensitive data in localStorage (only token)
- ✅ HTTPS in production
- ✅ Token expiration handled gracefully
- ✅ Logout clears ALL state

---

## 4. Top 10 Mistakes Week 4

Ini mistakes paling common yang gue liat. Jangan ulangin:

### 🚨 #1: Pake Zustand buat Server Data

```javascript
// ❌ WRONG — nyimpen API data di Zustand
const useStore = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const res = await api.get('/products');
    set({ products: res.data });
  },
}));

// ✅ RIGHT — pake React Query
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data),
  });
}
```

**Rule:** Server data → React Query. Client state → Zustand/Context.

### 🚨 #2: Hardcode API URL

```javascript
// ❌ 
fetch('http://localhost:3000/api/products')

// ✅ 
fetch(`${import.meta.env.VITE_API_URL}/products`)
```

### 🚨 #3: Lupa Error Handling

```javascript
// ❌ Happy path only
const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
return <ProductList products={data} />;

// ✅ Handle semua states
const { data, isLoading, error } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState />;
return <ProductList products={data} />;
```

### 🚨 #4: Ngga Cleanup useEffect

```javascript
// ❌ Memory leak
useEffect(() => {
  socket.on('notification', handler);
}, []);

// ✅ Always cleanup
useEffect(() => {
  socket.on('notification', handler);
  return () => socket.off('notification', handler);
}, []);
```

### 🚨 #5: Mutate State Directly di Zustand

```javascript
// ❌ 
addItem: (item) => {
  const items = get().items;
  items.push(item); // MUTATING!
  set({ items });
},

// ✅ 
addItem: (item) => set((state) => ({ 
  items: [...state.items, item] 
})),
```

### 🚨 #6: Ngga Debounce Search

Kirim API request tiap keystroke = 10 requests per second = rate limited.

```javascript
// ✅ Debounce 300ms
const [debouncedSearch] = useDebounce(searchTerm, 300);
const { data } = useQuery({
  queryKey: ['products', debouncedSearch],
  queryFn: () => searchProducts(debouncedSearch),
  enabled: debouncedSearch.length > 0,
});
```

### 🚨 #7: Secret di VITE_ Variable

```bash
# ❌ NEVER DO THIS
VITE_JWT_SECRET=my-super-secret
VITE_DATABASE_URL=postgres://user:pass@host/db

# ✅ Only public-facing values
VITE_API_URL=https://api.myapp.com
```

### 🚨 #8: Multiple QueryClient Instances

```javascript
// ❌ Bikin queryClient di dalam component = new instance tiap render
function App() {
  const queryClient = new QueryClient(); // BAD!
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}

// ✅ Bikin DI LUAR component
const queryClient = new QueryClient();
function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

### 🚨 #9: Ngga Handle Loading State

User klik button, nothing happens for 2 seconds, they click again. Now you have duplicate submissions.

```javascript
// ✅ Disable button saat loading
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</button>
```

### 🚨 #10: Test Cuma Happy Path

Kalo kalian cuma test "data loads successfully" — that's 20% of the picture. Test error states, empty states, loading states, edge cases.

---

## 5. Skills Acquired This Week

Cek mana yang udah kalian kuasai:

```
State Management:
  □ useState for local state
  □ useReducer for complex state
  □ Context API for prop drilling solution
  □ Zustand for global client state
  □ When to use which (decision tree)

API Integration:
  □ Axios setup with interceptors
  □ React Query useQuery
  □ React Query useMutation
  □ Optimistic updates
  □ Infinite scroll / pagination
  □ Cache invalidation

Authentication:
  □ JWT concept (access + refresh tokens)
  □ Login/logout flow
  □ Protected routes
  □ Axios auth interceptor
  □ Token refresh

Forms:
  □ Controlled components
  □ React Hook Form
  □ Zod validation
  □ Form error display

Real-time:
  □ WebSocket concept
  □ Socket.IO client setup
  □ Real-time events in React
  □ Socket + React Query pattern

Testing:
  □ Vitest setup
  □ React Testing Library basics
  □ MSW for API mocking
  □ Testing hooks with renderHook
  □ Testing error states

Professional:
  □ Read Swagger/OpenAPI docs
  □ Use Postman/Thunder Client
  □ HTTP status codes
  □ Environment variables
  □ CORS understanding
  □ Deployment preparation
```

---

## 6. Architecture Overview — What We Built

```mermaid
graph TB
    subgraph "React Application"
        A[App.jsx] --> B[Router]
        B --> C[Public Routes]
        B --> D[Protected Routes]
        
        C --> E[LoginPage]
        C --> F[RegisterPage]
        
        D --> G[DashboardPage]
        D --> H[ProductsPage]
        D --> I[ProfilePage]
        
        subgraph "State Layer"
            J[React Query<br/>Server State]
            K[Zustand<br/>Client State]
            L[Context<br/>Auth State]
        end
        
        subgraph "Service Layer"
            M[Axios Instance]
            N[Socket.IO Client]
        end
        
        G & H & I --> J & K & L
        J --> M
        K --> N
    end
    
    subgraph "Backend"
        O[Express API]
        P[Socket.IO Server]
        Q[(Database)]
    end
    
    M -->|HTTP/REST| O
    N -->|WebSocket| P
    O --> Q
    
    style J fill:#3b82f6,color:#fff
    style K fill:#8b5cf6,color:#fff
    style L fill:#f59e0b,color:#000
```

---

## 7. Prep for Week 5 — Capstone Project

Week 5 is **Capstone Week**. Everything kalian pelajari dari Week 1-4 bakal digabungin jadi satu project utuh.

### What to Expect

- Full-stack application (React + Express API)
- Authentication required
- CRUD operations
- State management (proper separation)
- Testing
- Deployment (Vercel + Railway)
- Presentation / Demo Day

### How to Prepare

1. **Review Week 1-3 materials** — routing, components, hooks
2. **Complete ALL Week 4 Arcane Quests** — especially AQ-01 (Connect to Phase 1 API)
3. **Practice the workflow**: Read docs → Test in Postman → Build hooks → Build UI → Test → Deploy
4. **Make sure your Phase 1 backend is deployed** and accessible
5. **Clean up your code** — good folder structure, consistent naming

### Technical Readiness Checklist

```
□ Can set up a React project from scratch (Vite)
□ Can implement React Router (public + protected routes)
□ Can connect to a REST API (Axios + React Query)
□ Can implement auth (login, logout, token management)
□ Can manage state properly (useState, Context, Zustand, React Query)
□ Can handle forms with validation (React Hook Form + Zod)
□ Can write tests (Vitest + RTL + MSW)
□ Can deploy to Vercel
□ Can configure environment variables
□ Can handle CORS
```

Kalo semua itu ✅, kalian siap buat capstone. Kalo ada yang masih ❌, **review materi sekarang** — jangan tunggu Week 5.

---

## Final Words

Week 4 itu dense. Kalo kalian merasa overwhelmed, itu normal. Kalian literally belajar hal-hal yang di-real-world dipake tiap hari sama professional developers.

Yang penting sekarang:
1. **Practice** — jangan cuma baca, coding
2. **Build** — complete the arcane quests
3. **Review** — re-read materi yang masih kurang paham
4. **Rest** — istirahat itu bagian dari learning

See you di Week 5. Let's build something amazing! 🚀💪

---

> **Back to:** [README — Week 4 Overview](../README.md)
