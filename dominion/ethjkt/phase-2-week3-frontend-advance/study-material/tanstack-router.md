# 🧭 TanStack Router — Type-Safe Routing

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Kenapa TanStack Router?

React Router udah jadi standard selama bertahun-tahun, tapi TanStack Router bawa something baru: **100% type-safe routing**. Artinya TypeScript bakal nge-catch routing errors di compile time, bukan di runtime.

### Perbandingan

| Feature | React Router | TanStack Router |
|---------|-------------|-----------------|
| Type safety | Partial | 100% end-to-end |
| Search params | String only | Typed & validated |
| Data loading | via loader | Built-in loaders |
| File-based routing | Remix only | Built-in |
| Bundle size | ~13KB | ~12KB |
| DevTools | ❌ | ✅ |

---

## 🚀 Setup

```bash
pnpm add @tanstack/react-router
pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
```

### Vite Plugin Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // Auto-generate route tree
    react(),
  ],
})
```

---

## 📁 File-Based Routing

TanStack Router bisa auto-generate routes dari file structure. Ini cara paling recommended:

```
src/
├── routes/
│   ├── __root.tsx          # Root layout (always rendered)
│   ├── index.tsx           # / (home page)
│   ├── about.tsx           # /about
│   ├── dashboard/
│   │   ├── index.tsx       # /dashboard
│   │   ├── analytics.tsx   # /dashboard/analytics
│   │   └── settings.tsx    # /dashboard/settings
│   ├── users/
│   │   ├── index.tsx       # /users
│   │   └── $userId.tsx     # /users/:userId (dynamic)
│   └── _auth/              # Layout route group (underscore prefix)
│       ├── login.tsx       # /login
│       └── register.tsx    # /register
├── routeTree.gen.ts        # Auto-generated! Jangan edit manual
└── main.tsx
```

### Root Layout

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/users" className="[&.active]:font-bold">
          Users
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </nav>
      
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
```

### Home Page

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <h1>Welcome to ETHJKT App! 🚀</h1>
    </div>
  )
}
```

### Dynamic Route

```tsx
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  // Loader — fetch data sebelum render
  loader: async ({ params }) => {
    // params.userId is typed! ✨
    const res = await fetch(`/api/users/${params.userId}`)
    if (!res.ok) throw new Error('User not found')
    return res.json() as Promise<User>
  },
  component: UserProfile,
})

function UserProfile() {
  // Data from loader — fully typed!
  const user = Route.useLoaderData()
  const { userId } = Route.useParams() // Also typed!
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>ID: {userId}</p>
    </div>
  )
}
```

---

## 🔍 Search Params (Type-Safe!)

Ini fitur killer TanStack Router. Search params di-validate dan typed:

```tsx
// src/routes/users/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

// Define search params schema
const userSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(''),
  sort: z.enum(['name', 'email', 'createdAt']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
})

type UserSearch = z.infer<typeof userSearchSchema>

export const Route = createFileRoute('/users/')({
  // Validate search params
  validateSearch: (search) => userSearchSchema.parse(search),
  component: UserListPage,
})

function UserListPage() {
  // search is fully typed! { page: number, search: string, sort: ..., order: ... }
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  return (
    <div>
      <input
        value={search.search}
        onChange={(e) =>
          navigate({
            search: (prev) => ({ ...prev, search: e.target.value, page: 1 }),
          })
        }
        placeholder="Search users..."
      />
      
      <select
        value={search.sort}
        onChange={(e) =>
          navigate({
            search: (prev) => ({ ...prev, sort: e.target.value as UserSearch['sort'] }),
          })
        }
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="createdAt">Date</option>
      </select>
      
      <div>Page: {search.page}</div>
      
      <button
        onClick={() =>
          navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
        }
      >
        Next Page
      </button>
    </div>
  )
}
```

URL bakal terlihat: `/users?page=2&search=john&sort=name&order=asc`

Dan yang keren: kalau user manually edit URL dengan value yang salah, validator bakal catch dan fallback ke default! 🛡️

---

## 🏗️ Layout Routes

Layout routes itu routes yang wrap child routes dengan shared UI tapi **nggak nambahin path segment**.

```tsx
// src/routes/_dashboard.tsx (underscore prefix = layout route)
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/analytics">Analytics</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

// src/routes/_dashboard/dashboard/index.tsx → /dashboard
// src/routes/_dashboard/dashboard/analytics.tsx → /dashboard/analytics
```

---

## 🔄 Loaders — Data Fetching

Loaders fetch data SEBELUM route render. Nggak ada loading spinner jank!

```tsx
// src/routes/dashboard/index.tsx
export const Route = createFileRoute('/dashboard/')({
  loader: async () => {
    // Fetch multiple data in parallel
    const [stats, recentActivity] = await Promise.all([
      fetch('/api/dashboard/stats').then(r => r.json()),
      fetch('/api/dashboard/activity').then(r => r.json()),
    ])
    
    return { stats, recentActivity }
  },
  
  // Pending component — shown while loading
  pendingComponent: () => <DashboardSkeleton />,
  
  // Error component — shown if loader fails
  errorComponent: ({ error }) => (
    <div className="error">
      <h2>Failed to load dashboard</h2>
      <p>{error.message}</p>
    </div>
  ),
  
  component: Dashboard,
})

function Dashboard() {
  const { stats, recentActivity } = Route.useLoaderData()
  
  return (
    <div>
      <StatsCards stats={stats} />
      <ActivityFeed items={recentActivity} />
    </div>
  )
}
```

### Loader + TanStack Query (Best Practice!)

```tsx
import { queryOptions } from '@tanstack/react-query'

// Define query options
const dashboardStatsQuery = queryOptions({
  queryKey: ['dashboard', 'stats'],
  queryFn: fetchDashboardStats,
  staleTime: 1000 * 60 * 5,
})

export const Route = createFileRoute('/dashboard/')({
  loader: ({ context: { queryClient } }) => {
    // Ensure data is in cache — doesn't refetch if fresh
    return queryClient.ensureQueryData(dashboardStatsQuery)
  },
  component: Dashboard,
})

function Dashboard() {
  // Use the same query — instant because data is already cached from loader!
  const { data: stats } = useQuery(dashboardStatsQuery)
  
  return <StatsCards stats={stats} />
}
```

---

## 🔗 Type-Safe Navigation

```tsx
// Semua navigation di-type-check! 🎉

// Link component
<Link to="/users/$userId" params={{ userId: '123' }}>
  View User
</Link>

// ❌ TypeScript error — wrong params!
<Link to="/users/$userId" params={{ id: '123' }}>
  View User
</Link>

// Navigate programmatically
const navigate = useNavigate()
navigate({
  to: '/users/$userId',
  params: { userId: '123' },
  search: { tab: 'posts' },
})

// From route hook
const navigate = Route.useNavigate()
navigate({
  search: (prev) => ({ ...prev, page: prev.page + 1 }),
})
```

---

## 🔧 Router Setup (main.tsx)

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen' // Auto-generated

const queryClient = new QueryClient()

// Create router instance
const router = createRouter({
  routeTree,
  context: { queryClient }, // Pass queryClient to all loaders
  defaultPreload: 'intent', // Preload on hover/focus
})

// Type-safe router declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

---

## 🎯 Practice Exercises

### Exercise 1: Basic Routes
Setup TanStack Router dengan file-based routing. Buat halaman: Home, About, Contact, dan 404 Not Found.

### Exercise 2: Dynamic Routes
Buat route `/products/$productId` yang fetch product data dari API. Handle loading dan error states.

### Exercise 3: Search Params
Buat halaman `/products` dengan search params: `search` (string), `category` (enum), `page` (number), `minPrice` (number). Validate pakai Zod.

### Exercise 4: Nested Layout
Buat dashboard layout dengan sidebar navigation. Dashboard punya 3 sub-pages: Overview, Analytics, Settings. Semua share sidebar layout.

### Bonus Challenge 🏆
Migrate sebuah app dari React Router ke TanStack Router. Document perbedaan yang kalian temuin dan gimana type safety nge-catch bugs.

---

> 💡 **Pro tip:** TanStack Router + TanStack Query = ultimate combo. Router handle routing & data loading, Query handle caching & server state. Together they're unstoppable! 🚀
