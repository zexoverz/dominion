# ⚡ Environment Variables & Error Handling

## ETHJKT — Phase 2, Week 4 | Arcane Quest Series

> *"Seorang Arcane Developer sejati nggak cuma bikin app yang jalan — tapi bikin app yang TAHAN BANTING."*

---

## 🎯 Learning Objectives

Setelah menyelesaikan modul ini, kamu bisa:

1. Menggunakan environment variables di Vite (`.env`, `import.meta.env`, prefix `VITE_`)
2. Implementasi React Error Boundaries untuk catch rendering errors
3. Menampilkan toast notifications pakai `react-hot-toast`
4. Membuat global error handler untuk API calls
5. Implementasi retry logic dan graceful degradation

---

## 📦 Part 1: Environment Variables di Vite

### Kenapa Butuh Environment Variables?

Bayangin kamu punya API URL yang beda antara development dan production:

- Development: `http://localhost:3001/api`
- Production: `https://api.myapp.com/api`

Hardcode URL? **Big no-no.** Itulah gunanya environment variables — config yang bisa berubah tanpa ubah kode.

### File `.env` di Vite

Vite support beberapa file `.env`:

```
.env                # Loaded di semua environment
.env.local          # Loaded di semua, GITIGNORED
.env.development    # Hanya di dev (vite dev)
.env.production     # Hanya di production (vite build)
```

### Aturan Penting: Prefix `VITE_`

**Hanya variable dengan prefix `VITE_` yang di-expose ke client-side code.** Ini security feature — biar nggak accidentally leak server secrets ke browser.

```bash
# .env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Arcane Task Manager

# INI NGGAK AKAN KE-EXPOSE ke browser!
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=super-rahasia-banget
```

### Akses di Code: `import.meta.env`

```jsx
// ✅ Cara yang benar
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Built-in variables dari Vite
console.log(import.meta.env.MODE);    // "development" atau "production"
console.log(import.meta.env.DEV);     // true di dev
console.log(import.meta.env.PROD);    // true di production
console.log(import.meta.env.BASE_URL); // base URL dari config

// ❌ Ini NGGAK AKAN KERJA (nggak ada prefix VITE_)
const dbUrl = import.meta.env.DATABASE_URL; // undefined!
```

### Best Practice: Config File

Jangan scatter `import.meta.env` di mana-mana. Bikin satu config file:

```js
// src/config/index.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  appName: import.meta.env.VITE_APP_NAME || 'Arcane App',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};

export default config;
```

```jsx
// Pake di mana aja
import config from '@/config';

const response = await fetch(`${config.apiUrl}/tasks`);
```

### `.env.example` untuk Tim

Selalu commit file `.env.example` supaya teammate tau variable apa aja yang dibutuhin:

```bash
# .env.example — Copy jadi .env dan isi valuenya
VITE_API_URL=
VITE_APP_NAME=
```

Dan tambahin `.env.local` ke `.gitignore`:

```
# .gitignore
.env.local
.env.*.local
```

---

## 🛡️ Part 2: React Error Boundaries

### Masalahnya

Kalau ada error di React component, **seluruh app bisa crash** dan user cuma liat blank screen. Nggak banget, kan?

```jsx
// Komponen ini bakal crash kalau data.name undefined
function UserProfile({ data }) {
  return <h1>{data.name.toUpperCase()}</h1>; // 💥 TypeError!
}
```

### Error Boundary: Safety Net untuk UI

Error Boundary adalah React component yang **catch JavaScript errors** di child component tree dan menampilkan fallback UI.

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state supaya render fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error ke service (Sentry, LogRocket, dll)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-500">
              ⚠️ Oops! Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mt-2">
              {this.state.error?.message || 'Something went wrong'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Coba Lagi
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Cara Pakai

```jsx
// App.jsx — Wrap seluruh app
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            {/* Error boundary per section */}
            <ErrorBoundary fallback={<p>Dashboard error 😵</p>}>
              <Dashboard />
            </ErrorBoundary>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### ⚠️ Limitasi Error Boundary

Error Boundaries **NGGAK catch**:
- Event handlers (pakai try-catch biasa)
- Async code (promises, setTimeout)
- Server-side rendering errors
- Error di Error Boundary itu sendiri

```jsx
function MyButton() {
  const handleClick = () => {
    try {
      // Error Boundary nggak catch ini!
      riskyOperation();
    } catch (error) {
      // Handle manual pakai try-catch
      console.error('Button error:', error);
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

---

## 🍞 Part 3: Toast Notifications dengan `react-hot-toast`

Toast = notifikasi kecil yang muncul sebentar terus hilang. Perfect buat feedback ke user: "Data saved!", "Login failed!", dll.

### Setup

```bash
npm install react-hot-toast
```

```jsx
// main.jsx atau App.jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#eee',
            border: '1px solid #6c63ff',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}
```

### Penggunaan

```jsx
import toast from 'react-hot-toast';

// Basic
toast('Hello, Summoner!');

// Success
toast.success('Task berhasil dibuat! ✨');

// Error
toast.error('Gagal menyimpan data 😵');

// Loading → lalu success/error (Promise toast)
const saveTask = async (taskData) => {
  toast.promise(
    api.post('/tasks', taskData),
    {
      loading: 'Menyimpan task...',
      success: 'Task tersimpan! 🎉',
      error: (err) => `Gagal: ${err.message}`,
    }
  );
};

// Custom toast
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
    bg-white shadow-lg rounded-lg p-4 flex items-center gap-3`}>
    <span>🏆</span>
    <div>
      <p className="font-bold">Achievement Unlocked!</p>
      <p className="text-sm text-gray-500">First task completed</p>
    </div>
    <button onClick={() => toast.dismiss(t.id)}>✕</button>
  </div>
));
```

---

## 🌐 Part 4: Global Error Handler untuk API

### Centralized Error Handling di Axios

Daripada nulis try-catch di setiap API call, bikin satu handler:

```js
// src/lib/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '@/config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — global error handler
api.interceptors.response.use(
  (response) => response, // Success: pass through
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        toast.error('Session expired. Silakan login lagi.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Kamu nggak punya akses untuk ini 🔒');
        break;
      case 404:
        toast.error('Data nggak ditemukan 🔍');
        break;
      case 422:
        // Validation errors
        toast.error(message || 'Data yang kamu kirim nggak valid');
        break;
      case 429:
        toast.error('Terlalu banyak request. Coba lagi nanti ⏳');
        break;
      case 500:
        toast.error('Server error. Tim kami sedang perbaiki 🔧');
        break;
      default:
        if (!error.response) {
          // Network error
          toast.error('Nggak bisa konek ke server. Cek internetmu 📡');
        } else {
          toast.error(message || 'Terjadi kesalahan');
        }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔄 Part 5: Retry Logic

Kadang request gagal karena network hiccup. Retry otomatis bisa bantu:

```js
// src/utils/retry.js
export async function withRetry(fn, options = {}) {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = !error.response || error.response.status >= 500;

      if (isLastAttempt || !isRetryable) {
        throw error;
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1);
      console.log(`Retry attempt ${attempt}/${maxRetries} in ${waitTime}ms...`);
      await new Promise((r) => setTimeout(r, waitTime));
    }
  }
}
```

```jsx
// Penggunaan
import { withRetry } from '@/utils/retry';
import api from '@/lib/api';

const fetchTasks = async () => {
  const { data } = await withRetry(
    () => api.get('/tasks'),
    { maxRetries: 3, delay: 1000 }
  );
  return data;
};
```

### Retry dengan React Query (lebih gampang!)

```jsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => api.get('/tasks').then(r => r.data),
  retry: 3,               // retry 3x
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
});
```

---

## 🪂 Part 6: Graceful Degradation

Graceful degradation = app tetap **usable** meskipun ada bagian yang error.

```jsx
// Contoh: Profile page yang tetap jalan meski avatar gagal load
function ProfilePage({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then(r => r.data),
  });

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <h2>⚠️ Nggak bisa load profile</h2>
        <p>Beberapa fitur mungkin nggak tersedia.</p>
        <button onClick={() => window.location.reload()}>
          Refresh halaman
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Avatar bisa gagal load — kasih fallback */}
      <img
        src={user.avatar}
        alt={user.name}
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      <h1>{user.name}</h1>

      {/* Section yang bisa gagal independent */}
      <ErrorBoundary fallback={<p>Nggak bisa load activity 😅</p>}>
        <ActivityFeed userId={userId} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Stats lagi nggak available</p>}>
        <UserStats userId={userId} />
      </ErrorBoundary>
    </div>
  );
}
```

### Offline Detection

```jsx
// src/hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}

// Penggunaan
function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-500 text-white p-2 text-center">
          ⚡ Kamu sedang offline. Beberapa fitur mungkin terbatas.
        </div>
      )}
      {/* ... rest of app */}
    </div>
  );
}
```

---

## 🏋️ Exercises

### Exercise 1: Setup Environment
1. Buat file `.env` dengan `VITE_API_URL` dan `VITE_APP_NAME`
2. Buat `src/config/index.js` yang baca dari `import.meta.env`
3. Buat `.env.example` untuk didistribusi ke tim
4. Pastikan `.env.local` ada di `.gitignore`

### Exercise 2: Error Boundary
1. Buat komponen `ErrorBoundary` dengan tombol "Coba Lagi"
2. Buat komponen `BuggyComponent` yang sengaja throw error
3. Wrap `BuggyComponent` dengan `ErrorBoundary` dan test hasilnya
4. Coba nested Error Boundaries — outer dan inner

### Exercise 3: Toast + Global Handler
1. Install `react-hot-toast` dan setup `<Toaster />`
2. Buat Axios instance dengan interceptors yang show toast otomatis
3. Test dengan request ke endpoint yang nggak exist (404)
4. Test dengan matiin backend (network error)

### Exercise 4: Retry & Degradation
1. Implementasi `withRetry` utility function
2. Buat komponen yang pakai `useOnlineStatus` hook
3. Buat halaman dengan multiple sections, masing-masing wrapped Error Boundary
4. Simulate error di salah satu section — pastikan section lain tetap jalan

---

## 📚 Key Takeaways

| Konsep | Kapan Pakai |
|--------|-------------|
| `.env` + `VITE_` prefix | Config yang beda per environment |
| Error Boundary | Catch rendering errors di component tree |
| Toast notifications | Quick feedback ke user |
| Axios interceptors | Global error handling untuk API |
| Retry logic | Network hiccups, server errors |
| Graceful degradation | App tetap usable meski partial failure |

> *"Arcane Developer nggak cuma bikin fitur — tapi bikin SHIELD. Error bukan musuh, tapi tantangan yang harus di-handle dengan elegan."* ⚔️

---

**Next:** [Arcane Quest — Authenticated CRUD App](./ln-authenticated-crud.md) →
