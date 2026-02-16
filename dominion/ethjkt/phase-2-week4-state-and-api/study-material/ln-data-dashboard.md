# ⚔️ ARCANE QUEST: Build a Data Dashboard

> *"Saatnya menggabungkan semua ilmu — dari React Query sampai state management — jadi satu aplikasi nyata!"*

## 🎯 Misi

Kamu akan membangun **Data Dashboard** yang connect ke REST API (Express backend dari Phase 1). Dashboard ini bisa menampilkan, menambah, mengedit, dan menghapus data — dengan loading states, error handling, search, dan filter yang proper.

## Tech Stack

- **React** + **Vite**
- **React Query** (TanStack Query) — server state
- **Zustand** — client state (UI preferences)
- **Axios** — HTTP client
- **React Router** — routing
- **Tailwind CSS** (optional, bisa pake CSS biasa)

## Prerequisites

Pastikan backend Express API dari Phase 1 udah jalan di `http://localhost:3001` dengan endpoints:
- `GET /api/items` — List all items
- `GET /api/items/:id` — Get single item
- `POST /api/items` — Create item
- `PUT /api/items/:id` — Update item
- `DELETE /api/items/:id` — Delete item

Kalau belum punya, bikin mock API cepat:

```js
// server.js — Quick mock API
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: 'Ethereum Node Setup', category: 'infra', status: 'active', priority: 'high' },
  { id: 2, name: 'Smart Contract Audit', category: 'security', status: 'pending', priority: 'critical' },
  { id: 3, name: 'DApp Frontend', category: 'frontend', status: 'active', priority: 'medium' },
  { id: 4, name: 'Token Economics Design', category: 'research', status: 'completed', priority: 'high' },
  { id: 5, name: 'Gas Optimization', category: 'backend', status: 'active', priority: 'low' },
];
let nextId = 6;

app.get('/api/items', (req, res) => {
  const { search, category, status } = req.query;
  let result = [...items];
  if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  if (category) result = result.filter(i => i.category === category);
  if (status) result = result.filter(i => i.status === status);
  res.json(result);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const item = { id: nextId++, ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));
```

## Step 1: Setup Project

```bash
npm create vite@latest arcane-dashboard -- --template react
cd arcane-dashboard
npm install @tanstack/react-query @tanstack/react-query-devtools axios zustand react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

### Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance
│   └── items.js           # API functions
├── components/
│   ├── Dashboard.jsx
│   ├── ItemList.jsx
│   ├── ItemForm.jsx
│   ├── ItemCard.jsx
│   ├── SearchBar.jsx
│   ├── FilterBar.jsx
│   ├── LoadingSkeleton.jsx
│   └── ErrorMessage.jsx
├── hooks/
│   └── useItems.js        # React Query hooks
├── stores/
│   └── useUiStore.js      # Zustand store
├── App.jsx
└── main.jsx
```

## Step 2: Axios Instance

```jsx
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
```

## Step 3: API Functions

```jsx
// src/api/items.js
import api from './axios';

export const itemsApi = {
  getAll: (params = {}) =>
    api.get('/items', { params }).then(r => r.data),

  getById: (id) =>
    api.get(`/items/${id}`).then(r => r.data),

  create: (data) =>
    api.post('/items', data).then(r => r.data),

  update: (id, data) =>
    api.put(`/items/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/items/${id}`),
};
```

## Step 4: React Query Hooks

```jsx
// src/hooks/useItems.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/items';

// Fetch all items with filters
export function useItems(filters = {}) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsApi.getAll(filters),
    staleTime: 30 * 1000, // Fresh selama 30 detik
  });
}

// Fetch single item
export function useItem(id) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

// Create item
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// Update item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => itemsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['items', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// Delete item (optimistic)
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemsApi.delete,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData(['items']);

      queryClient.setQueriesData({ queryKey: ['items'] }, (old) => {
        if (Array.isArray(old)) {
          return old.filter(item => item.id !== deletedId);
        }
        return old;
      });

      return { previous };
    },
    onError: (err, id, context) => {
      // Rollback
      if (context?.previous) {
        queryClient.setQueryData(['items'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

## Step 5: Zustand Store (UI State)

```jsx
// src/stores/useUiStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      // View preferences
      viewMode: 'grid', // 'grid' | 'list'
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      categoryFilter: '',
      setCategoryFilter: (cat) => set({ categoryFilter: cat }),

      statusFilter: '',
      setStatusFilter: (status) => set({ statusFilter: status }),

      // Reset all filters
      resetFilters: () => set({
        searchQuery: '',
        categoryFilter: '',
        statusFilter: '',
      }),

      // Modal state
      isFormOpen: false,
      editingItem: null,
      openForm: (item = null) => set({ isFormOpen: true, editingItem: item }),
      closeForm: () => set({ isFormOpen: false, editingItem: null }),
    }),
    {
      name: 'dashboard-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);

export default useUiStore;
```

## Step 6: Components

### main.jsx

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### SearchBar

```jsx
// src/components/SearchBar.jsx
import { useState, useEffect } from 'react';
import useUiStore from '../stores/useUiStore';

function SearchBar() {
  const searchQuery = useUiStore(s => s.searchQuery);
  const setSearchQuery = useUiStore(s => s.setSearchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce: update store setelah user berhenti ngetik 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Cari item..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="search-input"
      />
      {localQuery && (
        <button onClick={() => { setLocalQuery(''); setSearchQuery(''); }}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
```

### FilterBar

```jsx
// src/components/FilterBar.jsx
import useUiStore from '../stores/useUiStore';

const CATEGORIES = ['infra', 'security', 'frontend', 'backend', 'research'];
const STATUSES = ['active', 'pending', 'completed'];

function FilterBar() {
  const categoryFilter = useUiStore(s => s.categoryFilter);
  const statusFilter = useUiStore(s => s.statusFilter);
  const setCategoryFilter = useUiStore(s => s.setCategoryFilter);
  const setStatusFilter = useUiStore(s => s.setStatusFilter);
  const resetFilters = useUiStore(s => s.resetFilters);

  return (
    <div className="filter-bar">
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">Semua Kategori</option>
        {CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Semua Status</option>
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button onClick={resetFilters} className="btn-reset">
        Reset Filter
      </button>
    </div>
  );
}

export default FilterBar;
```

### ItemCard

```jsx
// src/components/ItemCard.jsx
import { useDeleteItem } from '../hooks/useItems';
import useUiStore from '../stores/useUiStore';

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

function ItemCard({ item }) {
  const deleteItem = useDeleteItem();
  const openForm = useUiStore(s => s.openForm);

  const handleDelete = () => {
    if (window.confirm(`Hapus "${item.name}"?`)) {
      deleteItem.mutate(item.id);
    }
  };

  return (
    <div className="item-card">
      <div className="card-header">
        <span
          className="priority-badge"
          style={{ backgroundColor: PRIORITY_COLORS[item.priority] }}
        >
          {item.priority}
        </span>
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      </div>

      <h3>{item.name}</h3>
      <p className="category">📁 {item.category}</p>

      <div className="card-actions">
        <button onClick={() => openForm(item)} className="btn-edit">
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteItem.isPending}
          className="btn-delete"
        >
          {deleteItem.isPending ? '⏳' : '🗑️'} Hapus
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
```

### ItemForm (Create/Edit Modal)

```jsx
// src/components/ItemForm.jsx
import { useState, useEffect } from 'react';
import { useCreateItem, useUpdateItem } from '../hooks/useItems';
import useUiStore from '../stores/useUiStore';

function ItemForm() {
  const isFormOpen = useUiStore(s => s.isFormOpen);
  const editingItem = useUiStore(s => s.editingItem);
  const closeForm = useUiStore(s => s.closeForm);

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    status: 'active',
    priority: 'medium',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        status: editingItem.status,
        priority: editingItem.priority,
      });
    } else {
      setFormData({ name: '', category: 'frontend', status: 'active', priority: 'medium' });
    }
  }, [editingItem]);

  if (!isFormOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...formData });
      } else {
        await createItem.mutateAsync(formData);
      }
      closeForm();
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    }
  };

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <div className="modal-overlay" onClick={closeForm}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{editingItem ? '✏️ Edit Item' : '➕ Tambah Item Baru'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nama item..."
              required
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="infra">Infrastructure</option>
              <option value="security">Security</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeForm} disabled={isPending}>
              Batal
            </button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? '⏳ Menyimpan...' : editingItem ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm;
```

### LoadingSkeleton

```jsx
// src/components/LoadingSkeleton.jsx
function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line short" />
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
```

### ErrorMessage

```jsx
// src/components/ErrorMessage.jsx
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-container">
      <h3>😵 Oops! Ada yang salah</h3>
      <p>{error?.message || 'Terjadi kesalahan yang tidak diketahui'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          🔄 Coba Lagi
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
```

### Dashboard (Main Page)

```jsx
// src/components/Dashboard.jsx
import { useItems } from '../hooks/useItems';
import useUiStore from '../stores/useUiStore';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import ItemCard from './ItemCard';
import ItemForm from './ItemForm';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';

function Dashboard() {
  const searchQuery = useUiStore(s => s.searchQuery);
  const categoryFilter = useUiStore(s => s.categoryFilter);
  const statusFilter = useUiStore(s => s.statusFilter);
  const viewMode = useUiStore(s => s.viewMode);
  const setViewMode = useUiStore(s => s.setViewMode);
  const openForm = useUiStore(s => s.openForm);

  // Build filters object
  const filters = {};
  if (searchQuery) filters.search = searchQuery;
  if (categoryFilter) filters.category = categoryFilter;
  if (statusFilter) filters.status = statusFilter;

  const { data: items, isLoading, isError, error, refetch, isFetching } = useItems(filters);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚔️ Arcane Dashboard</h1>
        <p className="subtitle">ETHJKT Project Tracker</p>
      </header>

      <div className="toolbar">
        <SearchBar />
        <FilterBar />

        <div className="toolbar-actions">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'active' : ''}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'active' : ''}
            >
              ☰ List
            </button>
          </div>

          <button onClick={() => openForm()} className="btn-primary">
            ➕ Tambah Item
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        {isFetching && !isLoading && (
          <span className="updating">🔄 Updating...</span>
        )}
        {items && <span>{items.length} items ditemukan</span>}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : isError ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>🔍 Tidak ada item ditemukan</p>
          <button onClick={() => useUiStore.getState().resetFilters()}>
            Reset filter
          </button>
        </div>
      ) : (
        <div className={`items-${viewMode}`}>
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Modal form */}
      <ItemForm />
    </div>
  );
}

export default Dashboard;
```

### App.jsx

```jsx
// src/App.jsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app">
      <Dashboard />
    </div>
  );
}

export default App;
```

## Step 7: Basic Styling

```css
/* src/index.css */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.dashboard { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.dashboard-header { text-align: center; margin-bottom: 2rem; }
.dashboard-header h1 { font-size: 2rem; color: #818cf8; }
.subtitle { color: #64748b; }

.toolbar { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; align-items: center; }
.search-input {
  padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #334155;
  background: #1e293b; color: #e2e8f0; width: 250px;
}

.filter-bar { display: flex; gap: 0.5rem; }
.filter-bar select {
  padding: 0.5rem; border-radius: 8px; border: 1px solid #334155;
  background: #1e293b; color: #e2e8f0;
}

.btn-primary {
  padding: 0.5rem 1rem; border-radius: 8px; border: none;
  background: #6366f1; color: white; cursor: pointer; font-weight: 600;
}
.btn-primary:hover { background: #4f46e5; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.items-list { display: flex; flex-direction: column; gap: 0.5rem; }

.item-card {
  background: #1e293b; border-radius: 12px; padding: 1.5rem;
  border: 1px solid #334155; transition: border-color 0.2s;
}
.item-card:hover { border-color: #6366f1; }

.card-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.priority-badge {
  padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;
  color: white; font-weight: 600;
}
.status-badge { font-size: 0.75rem; color: #94a3b8; }

.card-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.card-actions button {
  padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #334155;
  background: transparent; color: #e2e8f0; cursor: pointer;
}
.btn-delete:hover { border-color: #ef4444; color: #ef4444; }
.btn-edit:hover { border-color: #6366f1; color: #6366f1; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 50;
}
.modal {
  background: #1e293b; border-radius: 16px; padding: 2rem;
  width: 90%; max-width: 500px; border: 1px solid #334155;
}
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; color: #94a3b8; font-size: 0.875rem; }
.form-group input, .form-group select {
  width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid #334155;
  background: #0f172a; color: #e2e8f0;
}
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }

.error-container { text-align: center; padding: 3rem; }
.error-container h3 { margin-bottom: 0.5rem; }
.btn-retry { margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer; }

.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.skeleton-card { background: #1e293b; border-radius: 12px; padding: 1.5rem; }
.skeleton-line { height: 16px; border-radius: 4px; background: #334155; margin-bottom: 0.75rem; animation: pulse 1.5s infinite; }
.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 70%; }
.skeleton-line.long { width: 100%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-bar { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.875rem; color: #64748b; }
.updating { color: #818cf8; }

.empty-state { text-align: center; padding: 3rem; color: #64748b; }

.view-toggle { display: flex; gap: 0; }
.view-toggle button {
  padding: 0.5rem 0.75rem; border: 1px solid #334155; background: transparent; color: #94a3b8; cursor: pointer;
}
.view-toggle button:first-child { border-radius: 8px 0 0 8px; }
.view-toggle button:last-child { border-radius: 0 8px 8px 0; }
.view-toggle button.active { background: #334155; color: white; }

.toolbar-actions { display: flex; gap: 1rem; margin-left: auto; align-items: center; }
```

## Step 8: Test!

```bash
# Terminal 1: Start backend
node server.js

# Terminal 2: Start frontend
cd arcane-dashboard
npm run dev
```

Buka `http://localhost:5173` dan test:
1. ✅ Data tampil dari API
2. ✅ Search bar filter items (dengan debounce)
3. ✅ Dropdown filter by category dan status
4. ✅ Tambah item baru → list auto update
5. ✅ Edit item → list auto update
6. ✅ Hapus item → optimistic delete + rollback on error
7. ✅ Loading skeleton saat pertama fetch
8. ✅ Error message dengan retry button
9. ✅ View toggle grid/list
10. ✅ React Query DevTools bisa inspeksi cache

## 🏋️ Challenge Tambahan

### ⭐ Level 1
- Tambahkan sorting (by name, priority, status)
- Tambahkan pagination (10 items per page)

### ⭐⭐ Level 2
- Tambahkan detail page (`/items/:id`) dengan React Router
- Prefetch detail saat hover di list

### ⭐⭐⭐ Level 3
- Tambahkan bulk delete (checkbox + delete selected)
- Tambahkan drag-and-drop reorder
- Export data ke CSV

---

> 💡 **Refleksi:** Perhatikan gimana React Query handle semua complexity data fetching (caching, loading, error, invalidation), sementara Zustand handle UI state (filters, view mode, modal). Mereka nggak berkompetisi — mereka melengkapi!

**Quest Complete?** Submit screenshot dashboard kamu ke channel ETHJKT! ⚔️🎮
