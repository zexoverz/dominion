# 🔄 TanStack Query (React Query) — Data Fetching

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Kenapa TanStack Query?

Pernah nggak kalian bikin custom `useFetch` hook terus realize: "Hmm, gue butuh caching... loading states... error handling... refetch... deduplication... pagination..." — dan tiba-tiba hook kalian jadi monster 500 baris? 😱

**TanStack Query** solve semua itu. Ini bukan HTTP client (tetap pakai `fetch` atau `axios`), tapi **server state management** yang handle:

- ✅ Caching & automatic background refetching
- ✅ Deduplication (fetch sekali walau 10 component butuh data yang sama)
- ✅ Loading/error/success states
- ✅ Pagination & infinite scroll
- ✅ Optimistic updates
- ✅ Offline support
- ✅ DevTools bawaan

---

## 🚀 Setup

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create QueryClient dengan default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
      gcTime: 1000 * 60 * 30,   // Garbage collect setelah 30 menit
      retry: 3,                   // Retry 3x kalau gagal
      refetchOnWindowFocus: true, // Refetch waktu user balik ke tab
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* DevTools — hanya muncul di development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 📡 useQuery — Fetching Data

### Basic Usage

```tsx
import { useQuery } from '@tanstack/react-query'

// API function (terpisah dari hook)
async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

function UserList() {
  const { 
    data,        // Response data
    isLoading,   // True saat pertama kali fetch
    isFetching,  // True setiap kali fetch (termasuk background refetch)
    isError,     // True kalau error
    error,       // Error object
    refetch,     // Manual refetch function
  } = useQuery({
    queryKey: ['users'],           // Unique key untuk caching
    queryFn: fetchUsers,           // Function yang fetch data
  })
  
  if (isLoading) return <Skeleton count={5} />
  if (isError) return <p>Error: {error.message}</p>
  
  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Query Keys — Caching System

Query key itu ID unik untuk setiap query. TanStack Query pakai ini untuk caching:

```tsx
// Simple key
useQuery({ queryKey: ['users'], queryFn: fetchUsers })

// Key dengan parameter — auto-refetch kalau userId berubah
useQuery({ 
  queryKey: ['users', userId], 
  queryFn: () => fetchUser(userId) 
})

// Key dengan filter
useQuery({ 
  queryKey: ['users', { status: 'active', page: 1 }],
  queryFn: () => fetchUsers({ status: 'active', page: 1 })
})

// Key dengan nested params
useQuery({
  queryKey: ['projects', projectId, 'tasks', { sort: 'date' }],
  queryFn: () => fetchProjectTasks(projectId, { sort: 'date' })
})
```

### Dependent Queries

Fetch data B hanya setelah data A tersedia:

```tsx
function UserPosts({ userId }: { userId: string }) {
  // Pertama fetch user
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })
  
  // Kemudian fetch posts — enabled=false sampai user tersedia
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user!.id),
    enabled: !!user?.id, // Hanya fetch kalau user.id ada
  })
  
  return (
    <div>
      <h1>{user?.name}'s Posts</h1>
      {posts?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
```

---

## ✏️ useMutation — Modifying Data

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createUser(userData: CreateUserData): Promise<User> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

function CreateUserForm() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: createUser,
    
    // Invalidate cache setelah berhasil — trigger refetch user list
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`User ${newUser.name} berhasil dibuat!`)
    },
    
    onError: (error) => {
      toast.error(`Gagal: ${error.message}`)
    },
  })
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

### Optimistic Updates

Update UI sebelum server confirm — bikin app terasa instant:

```tsx
const likeMutation = useMutation({
  mutationFn: (postId: string) => likePost(postId),
  
  // Optimistic update SEBELUM server respond
  onMutate: async (postId) => {
    // Cancel ongoing refetches
    await queryClient.cancelQueries({ queryKey: ['posts', postId] })
    
    // Snapshot previous value
    const previousPost = queryClient.getQueryData(['posts', postId])
    
    // Optimistically update
    queryClient.setQueryData(['posts', postId], (old: Post) => ({
      ...old,
      likes: old.likes + 1,
      isLiked: true,
    }))
    
    // Return snapshot for rollback
    return { previousPost }
  },
  
  // Rollback kalau error
  onError: (err, postId, context) => {
    queryClient.setQueryData(['posts', postId], context?.previousPost)
  },
  
  // Refetch setelah settle (success or error)
  onSettled: (data, error, postId) => {
    queryClient.invalidateQueries({ queryKey: ['posts', postId] })
  },
})
```

---

## ⚙️ Caching & Stale Time

### Lifecycle Data di TanStack Query

```
Fresh → Stale → Inactive → Garbage Collected

staleTime: Berapa lama data dianggap fresh (default: 0)
gcTime: Berapa lama data inactive disimpan (default: 5 menit)
```

```tsx
// Per-query config
useQuery({
  queryKey: ['exchange-rates'],
  queryFn: fetchExchangeRates,
  staleTime: 1000 * 60,        // Fresh selama 1 menit
  refetchInterval: 1000 * 30,  // Auto-refetch setiap 30 detik
  refetchIntervalInBackground: false, // Stop refetch kalau tab inactive
})

// Data yang jarang berubah
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 1000 * 60 * 60 * 24, // Fresh selama 24 jam
  gcTime: Infinity,                 // Never garbage collect
})
```

### Refetch Behaviors

```tsx
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchOnMount: true,          // Refetch saat component mount
  refetchOnWindowFocus: true,    // Refetch saat tab focus
  refetchOnReconnect: true,      // Refetch saat internet reconnect
  refetchInterval: 1000 * 10,   // Polling setiap 10 detik
})
```

---

## 📄 Pagination

```tsx
function PaginatedPosts() {
  const [page, setPage] = useState(1)
  
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['posts', { page }],
    queryFn: () => fetchPosts({ page, limit: 10 }),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  })
  
  return (
    <div>
      <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
        {data?.posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {data?.totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

### Infinite Scroll

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) => fetchPosts({ cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  
  const allPosts = data?.pages.flatMap(page => page.posts) ?? []
  
  return (
    <div>
      {allPosts.map(post => <PostCard key={post.id} post={post} />)}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading...'
          : hasNextPage
            ? 'Load More'
            : 'No more posts'}
      </button>
    </div>
  )
}
```

---

## 🛠️ DevTools

TanStack Query DevTools bikin debugging jadi gampang banget:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Di App component
<ReactQueryDevtools 
  initialIsOpen={false}
  buttonPosition="bottom-right"
/>
```

DevTools nunjukin:
- Semua active queries
- Status (fresh/stale/fetching/error)
- Data yang di-cache
- Timeline fetch operations
- Manual refetch/invalidate

---

## 🏗️ Best Practices

### 1. Pisahkan API Functions

```typescript
// src/api/users.ts
export async function getUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
```

### 2. Custom Query Hooks

```typescript
// src/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}
```

### 3. Query Key Factory

```typescript
// src/api/queryKeys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Usage
useQuery({ queryKey: userKeys.detail(userId), queryFn: () => getUser(userId) })
queryClient.invalidateQueries({ queryKey: userKeys.lists() }) // Invalidate all user lists
```

---

## 🎯 Practice Exercises

### Exercise 1: Basic CRUD
Pakai JSONPlaceholder API (`https://jsonplaceholder.typicode.com`). Buat app yang bisa:
- List semua posts (`GET /posts`)
- View single post (`GET /posts/:id`)
- Create post (`POST /posts`)
- Delete post (`DELETE /posts/:id`)

### Exercise 2: Search with Debounce
Buat search component yang fetch dari API dengan debounce 500ms. Tampilkan loading state dan handle empty results.

### Exercise 3: Infinite Scroll
Implementasikan infinite scroll pakai `useInfiniteQuery`. Fetch posts 10 per batch, auto-load waktu user scroll ke bawah.

### Exercise 4: Optimistic Update
Buat todo list dengan optimistic updates. Waktu user toggle todo, UI update instant sebelum server respond. Rollback kalau error.

### Bonus Challenge 🏆
Buat crypto price tracker yang:
- Fetch harga dari CoinGecko API
- Auto-refresh setiap 30 detik
- Show sparkline chart per coin
- Cache data dengan staleTime yang tepat
- Pagination untuk coin list

---

> 💡 **Pro tip:** TanStack Query bukan cuma untuk REST API. Bisa dipakai untuk GraphQL, WebSocket, bahkan localStorage. Apapun yang async bisa di-wrap jadi query!
