# 🏰 ARCANE QUEST: Authenticated CRUD App

## ETHJKT — Phase 2, Week 4 | Arcane Quest Series

> *"Ini dia, Summoner. Quest terakhir Phase 2. Kamu akan membangun aplikasi full-stack yang connect ke backend Phase 1, lengkap dengan authentication dan CRUD. Siap?"*

---

## 🎯 Quest Objective

Build a **Task Manager** app dengan fitur:

- 🔐 Register & Login (JWT authentication)
- 📝 CRUD Tasks (Create, Read, Update, Delete)
- 🛡️ Protected Routes (hanya user yang login bisa akses)
- ⚡ Proper loading & error states
- 🔗 Connect ke Express backend dari Phase 1

### Tech Stack

- **Frontend:** React + Vite + React Router + Zustand + React Query
- **Backend:** Express.js (dari Phase 1) dengan JWT auth
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

---

## 📋 Prerequisites

Pastikan kamu udah punya backend Express dari Phase 1 yang support:

```
POST   /api/auth/register   → Register user baru
POST   /api/auth/login      → Login, return JWT token
GET    /api/tasks           → Get all tasks (authenticated)
POST   /api/tasks           → Create task (authenticated)
PUT    /api/tasks/:id       → Update task (authenticated)
DELETE /api/tasks/:id       → Delete task (authenticated)
```

Kalau belum punya, tanya instruktur untuk starter backend. Yang penting ada JWT auth dan CRUD endpoints.

---

## 🚀 Step 1: Project Setup

```bash
npm create vite@latest arcane-tasks -- --template react
cd arcane-tasks
npm install
npm install axios react-router-dom @tanstack/react-query zustand react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Arcane Tasks
```

### Folder Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   ├── Layout.jsx
│   └── TaskCard.jsx
├── config/
│   └── index.js
├── hooks/
│   └── useTasks.js
├── lib/
│   └── api.js
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx
├── store/
│   └── authStore.js
├── App.jsx
└── main.jsx
```

---

## 🔧 Step 2: Config & API Client

```js
// src/config/index.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  appName: import.meta.env.VITE_APP_NAME || 'Arcane Tasks',
};
export default config;
```

```js
// src/lib/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token ke setiap request
api.interceptors.request.use((reqConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired, silakan login lagi');
      window.location.href = '/login';
    } else if (status === 500) {
      toast.error('Server error 🔧');
    } else if (!error.response) {
      toast.error('Network error — cek koneksi internet kamu 📡');
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Step 3: Auth Store (Zustand)

```js
// src/store/authStore.js
import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      // Setelah register, langsung login
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Register gagal';
      set({ error: msg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
      });

      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login gagal';
      set({ error: msg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
```

---

## 🛡️ Step 4: Protected Route

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect ke login, simpan intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
```

---

## 📝 Step 5: Task Hooks (React Query)

```js
// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

// GET all tasks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    },
    retry: 2,
    staleTime: 30 * 1000, // 30 detik
  });
}

// CREATE task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const { data } = await api.post('/tasks', taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task berhasil dibuat! ✨');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal buat task');
    },
  });
}

// UPDATE task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...taskData }) => {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated! 📝');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal update task');
    },
  });
}

// DELETE task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task dihapus 🗑️');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal hapus task');
    },
  });
}
```

---

## 🖥️ Step 6: Pages

### Login Page

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      toast.success('Welcome back, Summoner! ⚔️');
      navigate(from, { replace: true });
    } catch (err) {
      // Error sudah di-handle di store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">
          ⚔️ Arcane Tasks
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Masuk ke realm-mu, Summoner
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="summoner@arcane.gg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {isLoading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

### Register Page

```jsx
// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await register(form);
      // Auto-login setelah register
      await login({ email: form.email, password: form.password });
      toast.success('Selamat datang di Arcane Realm! 🏰');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error di-handle di store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">
          🏰 Join the Realm
        </h1>
        <p className="text-gray-400 text-center mb-8">Buat akun baru</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Nama kamu"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Min. 6 karakter"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-semibold transition"
          >
            {isLoading ? '⏳ Creating account...' : '✨ Register'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Udah punya akun?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
```

### Dashboard Page

```jsx
// src/pages/DashboardPage.jsx
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import toast from 'react-hot-toast';

function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createTask.mutate(
      { title: newTitle, completed: false },
      { onSuccess: () => setNewTitle('') }
    );
  };

  const handleUpdate = (id) => {
    if (!editTitle.trim()) return;
    updateTask.mutate(
      { id, title: editTitle },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const handleToggle = (task) => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin mau hapus task ini?')) {
      deleteTask.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">⚔️ Arcane Tasks</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Halo, {user?.name} 👋</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Create Form */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            placeholder="✨ Tambah quest baru..."
          />
          <button
            type="submit"
            disabled={createTask.isPending}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
          >
            {createTask.isPending ? '⏳' : '➕ Add'}
          </button>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-gray-400">Loading quests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg text-center">
            <p className="text-red-300">Gagal load tasks 😵</p>
            <p className="text-red-400 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {tasks && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-400">Belum ada quest. Buat yang pertama!</p>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3"
            >
              {/* Toggle Checkbox */}
              <button
                onClick={() => handleToggle(task)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-500 hover:border-purple-500'
                }`}
              >
                {task.completed && '✓'}
              </button>

              {/* Title */}
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(task.id)}
                  onBlur={() => setEditingId(null)}
                  className="flex-1 p-1 bg-gray-700 text-white rounded border border-purple-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </span>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditTitle(task.title);
                  }}
                  className="text-gray-400 hover:text-purple-400"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
```

---

## 🔗 Step 7: App Router & Main

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a2e', color: '#eee', border: '1px solid #6c63ff' },
        }} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 🏋️ Quest Challenges

### Challenge 1: Basic Flow
Jalanin app, register user baru, login, dan buat 3 tasks. Pastikan semuanya persist setelah refresh.

### Challenge 2: Error States
1. Matiin backend server → coba create task. Apa yang terjadi?
2. Hapus token dari localStorage → refresh page. Kemana kamu di-redirect?
3. Tambahin invalid token → coba fetch tasks. Error apa yang muncul?

### Challenge 3: UX Polish
1. Tambahin loading skeleton saat tasks loading
2. Tambahin konfirmasi dialog sebelum delete (bukan `window.confirm`, tapi custom modal)
3. Tambahin filter: "All", "Active", "Completed"
4. Tambahin search bar untuk filter tasks by title

### Challenge 4: Bonus Features
1. Tambahin task priority (low, medium, high) dengan warna berbeda
2. Tambahin due date ke task
3. Implement drag-and-drop reorder tasks

---

## 📚 Checklist Sebelum Submit

- [ ] Register & Login berfungsi
- [ ] Token tersimpan dan auto-attach ke requests
- [ ] CRUD Tasks semua berfungsi (Create, Read, Update, Delete)
- [ ] Protected route redirect ke login kalau belum auth
- [ ] Loading states di semua async operations
- [ ] Error handling — toast muncul saat error
- [ ] Logout berfungsi dan clear semua state
- [ ] Code bersih dan terorganisir

> *"Quest ini adalah ujian sesungguhnya, Summoner. Semua yang kamu pelajari di Phase 2 — state management, API integration, error handling — converge di sini. Complete this quest, dan kamu siap untuk Phase 3."* 🏆

---

**Next:** [Soft Skills — Reading API Documentation](./sk-api-docs.md) →
