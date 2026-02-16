# 🔌 REST API Integration Patterns

> *"Fetch langsung di component itu kayak nulis SQL langsung di HTML — technically works, tapi kamu bakal nyesel."*

## Kenapa Butuh API Service Layer?

Coba bayangin kamu fetch data langsung di component:

```jsx
// ❌ DON'T DO THIS
function UserList() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('http://localhost:3001/api/v1/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
  });
  // ...
}
```

**Masalahnya:**
1. **Base URL hardcoded** — Ganti server = update di 50 tempat
2. **Auth header duplikat** — Copy-paste di semua component
3. **Error handling duplikat** — Setiap component handle error sendiri
4. **Nggak testable** — Component langsung coupled sama HTTP
5. **Nggak reusable** — Endpoint yang sama dipake banyak component

## Architecture: Service Layer Pattern

```
Component (UI)
    ↓ calls
React Query Hook (caching, state)
    ↓ calls
API Service (business logic, transforms)
    ↓ calls
Axios Instance (HTTP, interceptors, auth)
    ↓ calls
Server (REST API)
```

Setiap layer punya tanggung jawab masing-masing. Clean separation of concerns!

## Step 1: Axios Instance

```jsx
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
    // Attach auth token ke setiap request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (development only)
    if (import.meta.env.DEV) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
  (response) => {
    // Transform response kalau perlu
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized — token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Coba refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        // Simpan token baru
        localStorage.setItem('token', data.token);

        // Retry original request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh gagal — force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 403) {
      console.error('🚫 Forbidden — nggak punya akses');
    }

    if (error.response?.status === 429) {
      console.error('⏳ Rate limited — terlalu banyak request');
    }

    if (error.response?.status >= 500) {
      console.error('💥 Server error — coba lagi nanti');
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Kenapa Interceptors Penting?

1. **Auth otomatis** — Token di-attach ke setiap request tanpa manual
2. **Token refresh** — 401 → auto refresh → retry. Seamless!
3. **Error handling terpusat** — Satu tempat untuk handle semua HTTP errors
4. **Logging** — Debug requests tanpa console.log di mana-mana

## Step 2: API Service Modules

Setiap resource punya file service sendiri:

```jsx
// src/api/services/userService.js
import api from '../axios';

export const userService = {
  // GET /users
  getAll: async (params = {}) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  // GET /users/:id
  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  // POST /users
  create: async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  // PUT /users/:id
  update: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  // PATCH /users/:id (partial update)
  patch: async (id, fields) => {
    const { data } = await api.patch(`/users/${id}`, fields);
    return data;
  },

  // DELETE /users/:id
  delete: async (id) => {
    await api.delete(`/users/${id}`);
  },

  // GET /users/:id/posts
  getPosts: async (userId) => {
    const { data } = await api.get(`/users/${userId}/posts`);
    return data;
  },

  // POST /users/:id/avatar (file upload)
  uploadAvatar: async (userId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
```

```jsx
// src/api/services/authService.js
import api from '../axios';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { user, token, refreshToken }
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },
};
```

```jsx
// src/api/services/index.js — barrel export
export { userService } from './userService';
export { authService } from './authService';
```

## Step 3: React Query Hooks

```jsx
// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/services';

const USERS_KEY = 'users';

export function useUsers(params) {
  return useQuery({
    queryKey: [USERS_KEY, params],
    queryFn: () => userService.getAll(params),
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => userService.update(id, data),
    onSuccess: (data, { id }) => {
      qc.setQueryData([USERS_KEY, id], data);
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}
```

### Pemakaian di Component — Super Clean!

```jsx
function UserList() {
  const { data: users, isLoading } = useUsers({ role: 'admin' });
  const deleteUser = useDeleteUser();

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => deleteUser.mutate(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

Component-nya bersih banget — nggak ada URL, headers, error handling, token. Semua di-handle oleh layer di bawahnya.

## Request/Response Transforms

Kadang format data dari API beda sama yang kamu mau di frontend:

```jsx
// API returns: { first_name: "Budi", last_name: "Santoso", created_at: "2024-01-15" }
// Frontend mau: { firstName: "Budi", lastName: "Santoso", createdAt: "2024-01-15" }

// src/api/transforms.js
import { camelCase, snakeCase, mapKeys } from 'lodash-es';

// snake_case → camelCase
export function toCamelCase(data) {
  if (Array.isArray(data)) return data.map(toCamelCase);
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        camelCase(key),
        toCamelCase(value),
      ])
    );
  }
  return data;
}

// camelCase → snake_case
export function toSnakeCase(data) {
  if (Array.isArray(data)) return data.map(toSnakeCase);
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        snakeCase(key),
        toSnakeCase(value),
      ])
    );
  }
  return data;
}
```

Apply di interceptors:

```jsx
// Request: convert camelCase → snake_case
api.interceptors.request.use((config) => {
  if (config.data) {
    config.data = toSnakeCase(config.data);
  }
  if (config.params) {
    config.params = toSnakeCase(config.params);
  }
  return config;
});

// Response: convert snake_case → camelCase
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = toCamelCase(response.data);
  }
  return response;
});
```

## Error Handling Middleware

```jsx
// src/api/errors.js

// Custom error class
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Parse error dari response
export function parseApiError(error) {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    const message = data?.message || data?.error || `HTTP Error ${status}`;

    return new ApiError(message, status, data);
  }

  if (error.request) {
    // Request sent but no response
    return new ApiError('Server tidak merespon. Cek koneksi internet.', 0);
  }

  // Something else went wrong
  return new ApiError(error.message || 'Terjadi kesalahan', -1);
}
```

```jsx
// Di interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw parseApiError(error);
  }
);
```

```jsx
// Di component, error udah clean
function UserProfile({ id }) {
  const { data, error } = useUser(id);

  if (error) {
    // error.status === 404 → "User tidak ditemukan"
    // error.status === 403 → "Nggak punya akses"
    return <p>{error.message}</p>;
  }

  return <h1>{data?.name}</h1>;
}
```

## File Structure Recap

```
src/
├── api/
│   ├── axios.js              # Axios instance + interceptors
│   ├── errors.js             # Error classes + parsing
│   ├── transforms.js         # Data transformations
│   └── services/
│       ├── index.js           # Barrel exports
│       ├── authService.js     # Auth endpoints
│       ├── userService.js     # User endpoints
│       └── postService.js     # Post endpoints
├── hooks/
│   ├── useUsers.js            # User React Query hooks
│   ├── usePosts.js            # Post React Query hooks
│   └── useAuth.js             # Auth React Query hooks
├── components/
│   └── ...                    # UI components (clean, no API logic!)
```

## Multiple API Support

Kadang app butuh connect ke beberapa API:

```jsx
// src/api/instances.js

// Main backend
export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Third-party API
export const etherscanApi = axios.create({
  baseURL: 'https://api.etherscan.io/api',
  params: { apikey: import.meta.env.VITE_ETHERSCAN_KEY },
});

// Analytics API
export const analyticsApi = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_URL,
});

// Setiap instance bisa punya interceptors sendiri
mainApi.interceptors.request.use(/* auth token */);
etherscanApi.interceptors.response.use(/* transform etherscan response */);
```

## 🏋️ Latihan

### Exercise 1: API Service Layer
Bikin service layer lengkap untuk todo app:
- `todoService.js` — CRUD operations
- Axios instance dengan auth interceptor
- React Query hooks

### Exercise 2: Error Handling
Implementasikan:
- Custom `ApiError` class
- Global error handler di interceptor
- Toast notification untuk setiap error type (404, 403, 500, network error)

### Exercise 3: Multiple APIs
Bikin app yang fetch data dari 2 API:
1. JSONPlaceholder (`https://jsonplaceholder.typicode.com`) — posts
2. Random User API (`https://randomuser.me/api`) — user avatars

Gabungkan data-nya di satu page. Masing-masing API punya axios instance sendiri.

### Exercise 4: Request Transform
API kamu return data dengan `snake_case`. Bikin interceptor yang auto-convert ke `camelCase` di response dan sebaliknya di request.

---

> 💡 **Pro tip:** Investasi waktu bikin API layer yang proper itu bakal bayar sendiri berkali-kali lipat. Kalau backend pindah URL, ganti auth method, atau ubah response format — kamu cuma perlu update 1 file, bukan 50 component.

**Next:** Authentication flows — JWT, login, register, protected routes! 🔐
