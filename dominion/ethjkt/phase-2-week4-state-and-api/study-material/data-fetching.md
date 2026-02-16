# 📡 Data Fetching Patterns

> *"Fetch data itu gampang. Fetch data dengan BENAR? Nah, itu cerita lain."*

## fetch vs axios

### Native Fetch

```jsx
// Basic fetch
const response = await fetch('https://api.example.com/users');
const data = await response.json();

// POST request
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Budi', email: 'budi@eth.id' }),
});
```

**Keanehan fetch:**
```jsx
// ⚠️ fetch TIDAK throw error untuk HTTP errors (404, 500, dll)
const response = await fetch('/api/users');
// response.ok === false untuk 404, tapi NGGAK masuk catch!

// Harus manual check
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

### Axios

```bash
npm install axios
```

```jsx
import axios from 'axios';

// GET — langsung dapet data (nggak perlu .json())
const { data } = await axios.get('/api/users');

// POST
const { data } = await axios.post('/api/users', {
  name: 'Budi',
  email: 'budi@eth.id',
});

// Axios THROW error untuk HTTP errors! ✅
try {
  const { data } = await axios.get('/api/users');
} catch (error) {
  console.log(error.response.status); // 404
  console.log(error.response.data);   // Error message dari server
}
```

### Perbandingan

| Fitur | fetch | axios |
|-------|-------|-------|
| Built-in | ✅ Yes | ❌ Install needed |
| Auto JSON parse | ❌ Manual `.json()` | ✅ Automatic |
| Error handling | ⚠️ Manual check | ✅ Auto throw |
| Interceptors | ❌ No | ✅ Yes |
| Request cancel | AbortController | CancelToken / AbortController |
| Timeout | ❌ Manual | ✅ Built-in |
| Progress | ❌ No | ✅ Yes |

**Rekomendasi:** Pake **axios** untuk project serius. Pake **fetch** kalau nggak mau tambah dependency atau buat project kecil.

## useEffect Fetching — dan Kenapa Itu Buruk

Ini pattern yang paling sering diajarkan tapi paling banyak masalahnya:

```jsx
// ⚠️ Pattern klasik tapi problematic
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

### Masalah-masalahnya:

**1. Race Condition 🏎️**

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // User klik profile A, lalu klik profile B sebelum A selesai loading
    // Request A finish SETELAH request B → data A override data B! 😱
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

**2. No Caching**
Setiap kali component mount, fetch ulang. Navigate away, navigate back → fetch lagi. Padahal data belum berubah!

**3. No Deduplication**
Kalau 3 component butuh data user yang sama, fetch jalan 3 kali.

**4. No Background Refetch**
Data bisa stale. User buka tab lain, balik lagi → data masih lama.

**5. Memory Leak**
Component unmount sebelum fetch selesai → `setState` on unmounted component.

**6. Boilerplate Gila**
Loading state, error state, retry logic, abort controller — semua manual!

## Fixing Race Conditions

### Solusi 1: Cleanup Function

```jsx
useEffect(() => {
  let cancelled = false;

  async function fetchUser() {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();

    if (!cancelled) {
      setUser(data);
    }
  }

  fetchUser();

  return () => {
    cancelled = true; // Cancel kalau userId berubah sebelum selesai
  };
}, [userId]);
```

### Solusi 2: AbortController

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchUser() {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }

  fetchUser();

  return () => controller.abort();
}, [userId]);
```

AbortController beneran **cancel** HTTP request-nya, bukan cuma ignore response. Lebih efisien karena nggak buang bandwidth.

### Axios Cancel

```jsx
useEffect(() => {
  const controller = new AbortController();

  axios.get(`/api/users/${userId}`, {
    signal: controller.signal,
  })
    .then(res => setUser(res.data))
    .catch(err => {
      if (!axios.isCancel(err)) {
        setError(err.message);
      }
    });

  return () => controller.abort();
}, [userId]);
```

## Loading & Error States yang Proper

```jsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setStatus('loading');
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json);
        setStatus('success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setStatus('error');
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  // Render based on status
  if (status === 'idle' || status === 'loading') {
    return <LoadingSkeleton />;
  }

  if (status === 'error') {
    return (
      <div className="error">
        <p>Gagal memuat data: {error}</p>
        <button onClick={() => setStatus('idle')}>Coba Lagi</button>
      </div>
    );
  }

  return children(data);
}

// Usage
<DataFetcher url="/api/users">
  {(users) => (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )}
</DataFetcher>
```

## Custom Hook: useFetch

Daripada copy-paste di mana-mana, bikin custom hook:

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, error, isLoading };
}

// Usage
function UserList() {
  const { data: users, error, isLoading } = useFetch('/api/users');

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

Ini udah lebih baik dari raw useEffect, tapi masih kurang: no caching, no deduplication, no background refetch.

## SWR Pattern — Stale While Revalidate

SWR itu strategy HTTP caching yang jadi populer di frontend:

1. **Return cached data dulu** (stale) → User langsung lihat sesuatu
2. **Fetch ulang di background** (revalidate) → Update kalau ada data baru
3. **Update UI** kalau data berubah

```
User buka halaman
  → Tampilkan data dari cache (instant!)
  → Fetch data baru di background
  → Kalau data berubah, update tampilan
  → Kalau sama, do nothing
```

Ini ngasih UX yang sangat smooth karena user nggak pernah lihat loading spinner (kecuali pertama kali).

### SWR Library

```bash
npm install swr
```

```jsx
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function UserProfile({ userId }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}`,
    fetcher
  );

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

**SWR otomatis handle:**
- ✅ Caching
- ✅ Deduplication
- ✅ Revalidation on focus
- ✅ Revalidation on reconnect
- ✅ Retry on error
- ✅ Race condition prevention

### React Query (TanStack Query)

React Query itu SWR on steroids. Lebih powerful, lebih banyak fitur:

```jsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return <h1>{data.name}</h1>;
}
```

Kita bahas React Query lebih dalam di materi berikutnya!

## Comparison: Manual vs SWR vs React Query

```jsx
// ❌ Manual — banyak boilerplate, banyak bug potential
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;
  setLoading(true);
  fetch(url)
    .then(r => r.json())
    .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
    .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });
  return () => { cancelled = true; };
}, [url]);

// ✅ React Query — clean, powerful, production-ready
const { data, isLoading, error } = useQuery({
  queryKey: ['data', url],
  queryFn: () => fetch(url).then(r => r.json()),
});
```

Dari ~15 baris jadi ~4 baris, dengan LEBIH BANYAK fitur. No-brainer!

## Retry Logic

```jsx
// Manual retry
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
      // Exponential backoff: 1s, 2s, 4s
    }
  }
}

// React Query — built-in retry!
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  retry: 3,              // Retry 3 kali
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});
```

## 🏋️ Latihan

### Exercise 1: Custom useFetch Hook
Buat custom hook `useFetch` yang:
- Handle loading, error, data states
- Support AbortController
- Support retry (parameter: maxRetries)
- Return refetch function

### Exercise 2: Race Condition Demo
Bikin component yang fetch data berdasarkan dropdown selection. Tunjukkan race condition terjadi (add artificial delay), lalu fix pake AbortController.

### Exercise 3: Fetch Comparison
Fetch data dari `https://jsonplaceholder.typicode.com/posts` menggunakan:
1. Raw `fetch` + `useEffect`
2. `axios` + `useEffect`
3. Custom `useFetch` hook

Bandingkan code readability dan behavior-nya.

### Exercise 4: Loading States
Bikin 3 versi loading state:
1. Simple spinner
2. Skeleton loader (placeholder yang mirip layout final)
3. Progressive loading (tampilkan partial data dulu)

Mana yang UX-nya paling bagus?

---

> 💡 **Kesimpulan:** Jangan pake raw `useEffect` + `fetch` untuk production. Pake React Query atau SWR. Serius, ini bukan opini — ini udah jadi consensus di React community. Bahkan React docs sendiri bilang: "Don't fetch in effects."

**Next:** React Query deep dive — ini tools yang bakal jadi sahabat kamu! 🔮
