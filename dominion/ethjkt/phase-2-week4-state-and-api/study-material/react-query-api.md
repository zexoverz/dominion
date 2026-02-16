# 🔮 React Query (TanStack Query) untuk API Integration

> *"React Query itu kayak punya asisten pribadi yang ngurus semua urusan API kamu — caching, retry, sync, semuanya."*

## Install & Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```jsx
// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // Data dianggap fresh selama 1 menit
      gcTime: 5 * 60 * 1000,      // Garbage collect setelah 5 menit
      retry: 2,                     // Retry 2 kali kalau gagal
      refetchOnWindowFocus: true,   // Refetch kalau user balik ke tab
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

DevTools akan muncul sebagai floating button di kiri bawah. Super useful untuk debugging!

## useQuery — Fetch Data

### Basic Usage

```jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function UserList() {
  const {
    data,
    isLoading,      // True saat pertama kali fetch (no cache)
    isFetching,     // True setiap kali fetch (termasuk background refetch)
    isError,
    error,
    refetch,        // Manual refetch
  } = useQuery({
    queryKey: ['users'],                              // Cache key
    queryFn: () => axios.get('/api/users').then(r => r.data), // Fetch function
  });

  if (isLoading) return <Skeleton count={5} />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {isFetching && <p className="text-sm text-gray-400">Updating...</p>}
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name} — {user.email}</li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### Query Key — Identitas Cache

Query key itu array yang jadi identifier unik untuk cache:

```jsx
// Semua users
useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// User spesifik
useQuery({ queryKey: ['users', userId], queryFn: () => fetchUser(userId) });

// Users dengan filter
useQuery({
  queryKey: ['users', { role: 'admin', page: 2 }],
  queryFn: () => fetchUsers({ role: 'admin', page: 2 }),
});

// Posts by user
useQuery({
  queryKey: ['users', userId, 'posts'],
  queryFn: () => fetchUserPosts(userId),
});
```

Key berubah → React Query fetch ulang otomatis!

```jsx
function UserProfile({ userId }) {
  // userId berubah → auto refetch! No need for useEffect
  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => axios.get(`/api/users/${userId}`).then(r => r.data),
  });

  return <h1>{data?.name}</h1>;
}
```

### Enabled — Conditional Fetching

```jsx
function UserPosts({ userId }) {
  // Cuma fetch kalau userId ada
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => axios.get(`/api/users/${userId}/posts`).then(r => r.data),
    enabled: !!userId, // false = nggak fetch
  });

  return /* ... */;
}
```

### Select — Transform Data

```jsx
function ActiveUserCount() {
  const { data: count } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(r => r.data),
    select: (users) => users.filter(u => u.isActive).length,
    // Data di-transform SEBELUM masuk component
    // Re-render cuma kalau count berubah, bukan kalau raw data berubah
  });

  return <p>{count} active users</p>;
}
```

## useMutation — Create, Update, Delete

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (newUser) => axios.post('/api/users', newUser).then(r => r.data),

    onSuccess: (data) => {
      // Invalidate cache → trigger refetch user list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User ${data.name} berhasil dibuat!`);
    },

    onError: (error) => {
      toast.error(`Gagal: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createUser.mutate({
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nama" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Full CRUD

```jsx
// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API = '/api/users';

// READ
export function useUsers(filters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => axios.get(API, { params: filters }).then(r => r.data),
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => axios.get(`${API}/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

// CREATE
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axios.post(API, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// UPDATE
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => axios.put(`${API}/${id}`, data).then(r => r.data),
    onSuccess: (data, variables) => {
      // Update specific user cache
      queryClient.setQueryData(['users', variables.id], data);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// DELETE
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axios.delete(`${API}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['users', deletedId] });
    },
  });
}
```

## Invalidation — Senjata Rahasia

`invalidateQueries` itu cara kamu bilang ke React Query: "Data ini udah stale, fetch ulang dong."

```jsx
const queryClient = useQueryClient();

// Invalidate semua query yang key-nya mulai dengan 'users'
queryClient.invalidateQueries({ queryKey: ['users'] });

// Invalidate exact match
queryClient.invalidateQueries({ queryKey: ['users', 1], exact: true });

// Invalidate SEMUA queries
queryClient.invalidateQueries();

// Set data langsung tanpa fetch (kalau kamu udah punya data-nya)
queryClient.setQueryData(['users', 1], updatedUser);
```

## Optimistic Updates

Update UI SEBELUM server respond. Kalau gagal, rollback. UX jadi super responsive!

```jsx
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo) =>
      axios.patch(`/api/todos/${todo.id}`, { done: !todo.done }),

    // Optimistic update
    onMutate: async (todo) => {
      // Cancel ongoing refetch (biar nggak override optimistic data)
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value (buat rollback)
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update cache
      queryClient.setQueryData(['todos'], (old) =>
        old.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
      );

      // Return snapshot for rollback
      return { previousTodos };
    },

    // Kalau error, rollback!
    onError: (err, todo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
      toast.error('Gagal update todo');
    },

    // Always refetch setelah selesai (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

## Infinite Queries — Load More / Infinite Scroll

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

function PostFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) =>
      axios.get(`/api/posts?page=${pageParam}&limit=10`).then(r => r.data),
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number, or undefined kalau udah habis
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
  });

  // data.pages = [[page1posts], [page2posts], ...]
  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Infinite Scroll dengan Intersection Observer

```jsx
import { useRef, useEffect } from 'react';

function PostFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    /* ... same as above */
  });

  const loadMoreRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div>
      {allPosts.map(post => <PostCard key={post.id} post={post} />)}
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
```

## Prefetching — Load Sebelum Dibutuhkan

```jsx
function UserList() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

  // Prefetch user detail saat hover
  const handleHover = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ['users', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    });
  };

  return (
    <ul>
      {users?.map(user => (
        <li
          key={user.id}
          onMouseEnter={() => handleHover(user.id)}
        >
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

User hover → data di-prefetch → klik → INSTANT! Nggak ada loading. 🚀

## Dependent Queries

Query yang depend on hasil query lain:

```jsx
function UserDashboard({ userId }) {
  // Fetch user dulu
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Fetch projects SETELAH user data available
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.teamId],
    queryFn: () => fetchProjects(user.teamId),
    enabled: !!user?.teamId, // Cuma jalan kalau teamId udah ada
  });

  return (
    <div>
      <h1>{user?.name}'s Dashboard</h1>
      <h2>Team Projects</h2>
      {projects?.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
}
```

## Polling — Real-time-ish Data

```jsx
function NotificationBell() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // Refetch setiap 30 detik
    refetchIntervalInBackground: false, // Stop kalau tab nggak aktif
  });

  return (
    <div className="relative">
      🔔
      {notifications?.unread > 0 && (
        <span className="badge">{notifications.unread}</span>
      )}
    </div>
  );
}
```

## 🏋️ Latihan

### Exercise 1: CRUD dengan React Query
Gunakan JSONPlaceholder API (`https://jsonplaceholder.typicode.com`):
- `useQuery` — Fetch list posts
- `useMutation` — Create post baru (POST)
- `invalidateQueries` — Refresh list setelah create

### Exercise 2: Search dengan Debounce
Bikin search bar yang:
- User ketik → debounce 300ms → fetch search results
- Loading state saat fetching
- Cancel previous request kalau user ketik lagi

Hint: query key berubah → auto refetch!

```jsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

const { data } = useQuery({
  queryKey: ['search', debouncedSearch],
  queryFn: () => searchAPI(debouncedSearch),
  enabled: debouncedSearch.length > 2,
});
```

### Exercise 3: Infinite Scroll
Implementasikan infinite scroll untuk posts dari JSONPlaceholder. Gunakan `useInfiniteQuery` + Intersection Observer.

### Exercise 4: Optimistic Delete
Bikin todo list dimana delete langsung hilang dari UI (optimistic), tapi kalau server error, muncul lagi (rollback).

---

> 💡 **Pro tip:** React Query bukan cuma library fetch. Ini **server state synchronization layer**. Dia handle caching, deduplication, background sync, retry, optimistic updates — semua hal yang biasanya kamu tulis manual dengan 200 baris kode.

**Next:** ARCANE QUEST — bikin data dashboard pake semua ilmu ini! ⚔️
